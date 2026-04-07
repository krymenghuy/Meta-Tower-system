<?php

namespace App\Models\Prm;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DV;
use DBX;

class Receipt extends Model
{
    protected $table = 'receipts';
    protected $userInfo = null;
    protected $id = null;

    public function __construct($id = null, $userInfo = null)
    {
        parent::__construct();
        $this->id = $id;
        $this->userInfo = $userInfo;
    }



    public function getListPaginate($arr = [], $ss = null, $id = null)
    {
        $d = (object) $arr;

        $current_page = max(1, (int) ($d->current_page ?? 1));
        $per_page     = max(1, (int) ($d->per_page ?? 10));
        $search       = trim($d->search_value ?? '');

        $query = DB::table('receipts as r')
            ->leftJoin('tenants as t', 't.id', '=', 'r.tenant_id')
            ->leftJoin('invoices as i', 'i.id', '=', 'r.invoice_id')
            ->leftJoin('building_spaces as bs', 'bs.id', '=', 'i.space_id')
            ->leftJoin('receipt_breakdowns as rb', 'rb.receipt_id', '=', 'r.id')
            ->leftJoin('receipt_statuses as rs', 'rs.id', '=', 'r.receipt_status_id')

            ->select([
                'r.id',
                'r.code',
                'r.receipt_date',
                'r.total_received',
                'r.remarks',
                'r.updated_at',
                'r.update_user',
                't.name as tenant_name',
                'i.code as invoice_code',
                'i.amount as invoice_total',
                'i.invoice_date as invoice_date',
                'bs.code as space_code',
                'r.receipt_status_id',
                'rs.name as receipt_status_name',
                DB::raw('ANY_VALUE(rb.method) as method'),

                DB::raw("
                    GROUP_CONCAT(
                        DISTINCT CONCAT(
                            TRIM(COALESCE(rb.method, '')),
                            IF(rb.bank_name IS NOT NULL, CONCAT(' (', TRIM(rb.bank_name), ')'), ''),
                            IF(rb.cheque_bank_name IS NOT NULL, CONCAT(' - ', TRIM(rb.cheque_bank_name)), ''),
                            IF(rb.card_type IS NOT NULL, CONCAT(' ', TRIM(rb.card_type)), ''),
                            ' : $', FORMAT(rb.amount, 2)
                        )
                        SEPARATOR ' , '
                    ) as payment_methods
                "),
            ])
            ->groupBy('r.id')
            ->orderByDesc('r.id');

        if ($id) {
            $query->where('r.id', $id);
        }

        if ($search) {
            $search = '%' . escape_like_str($search) . '%';
            $query->where(function ($q) use ($search) {
                $q->where('r.code', 'LIKE', $search)
                ->orWhere('t.name', 'LIKE', $search)
                ->orWhere('i.code', 'LIKE', $search);
            });
        }

        $total = (clone $query)->select('r.id')->distinct()->count();

        $skip = ($current_page - 1) * $per_page;
        $rows = $query->skip($skip)->take($per_page)->get();

        // Format dates
        foreach ($rows as $row) {
            $row = setOfficialDates($row, ['receipt_date', 'invoice_date'], ['updated_at'], []);
        }

        return new LengthAwarePaginator($rows, $total, $per_page, $current_page);
    }


    public static function getReceiptDetails($id)
    {
        $header = DB::table('receipts as r')
            ->leftJoin('tenants as t', 't.id', '=', 'r.tenant_id')
            ->leftJoin('invoices as i', 'i.id', '=', 'r.invoice_id')
            ->where('r.id', $id)
            ->select(
                'r.id',
                'r.code',
                'r.receipt_date',
                'r.total_received',
                'r.remarks',
                'r.invoice_id',
                'i.code as invoice_code',
                't.name as tenant_name',
                't.phone_number as tenant_phone'
            )
            ->first();

        if (!$header) {
            return null;
        }

        // Fetch the payment methods used for this receipt
        $header->breakdowns = DB::table('receipt_breakdowns as rb')
            ->leftJoin('banks as b', 'b.id', '=', 'rb.bank_id')
            ->where('rb.receipt_id', $id)
            ->select(
                'rb.id',
                'rb.method',
                'rb.amount',
                'rb.currency_code',
                'rb.bank_ref_number',
                'rb.bank_name as manual_bank_name',
                'b.name as registered_bank_name',
                'rb.card_number',
                'rb.card_type',
                'rb.remarks'
            )
            ->get();

        return $header;
    }

public function setReceiptStatus($arr, $ss = null)
{
    $ss = $ss ?? $this->userInfo;
    $id = $arr['id'] ?? null;
    $new_status_id = (int)($arr['receipt_status_id'] ?? 0);

    if (!$id || !$new_status_id) {
        return DV::error('Missing required parameters');
    }

    return DB::transaction(function () use ($id, $new_status_id, $ss) {
        $receipt = DB::table('receipts')->where('id', $id)->first();
        if (!$receipt) return DV::error('Receipt not found');

        $old_status_id = (int)$receipt->receipt_status_id;

        $updated = DB::table('receipts')
            ->where('id', $id)
            ->update([
                'receipt_status_id' => $new_status_id,
                'update_user'       => $ss->full_name ?? $ss->name ?? 'System',
                'update_uid'        => $ss->id ?? $ss->uid ?? null,
                'updated_at'        => now(),
            ]);

        // 2. Only update Invoice if the status actually changed to/from Canceled (2)
        if ($updated && $old_status_id !== $new_status_id) {
            $invoice = DB::table('invoices')->where('id', $receipt->invoice_id)->first();

            if ($invoice) {
                $amount = (float)$receipt->total_received;
                $current_paid = (float)$invoice->paid_amount;
                $total_invoice = (float)$invoice->amount;

                // Status 2 = Canceled (Subtract amount)
                // Status 1 = Active (Add amount back)
                $new_paid_amount = ($new_status_id == 2)
                    ? max(0, $current_paid - $amount)
                    : ($current_paid + $amount);

                $new_due_amount = max(0, $total_invoice - $new_paid_amount);

                // Recalculate Invoice Payment Status: 1=Paid, 2=Unpaid, 3=Partial
                $inv_status = 2;
                if ($new_due_amount <= 0.001) {
                    $inv_status = 1;
                } else if ($new_paid_amount > 0) {
                    $inv_status = 3;
                }

                DB::table('invoices')->where('id', $receipt->invoice_id)->update([
                    'paid_amount'       => $new_paid_amount,
                    'due_amount'        => $new_due_amount,
                    'payment_status_id' => $inv_status,
                    'is_paid'           => ($inv_status == 1 ? 1 : 0),
                    'updated_at'        => now()
                ]);
            }
        }

        return DV::success(['message' => 'Status and invoice updated successfully']);
    });
}


    public function deleteById($id = null)
    {
        $id = $id ?? $this->id;
        return DB::transaction(function () use ($id) {
            DB::table('receipt_breakdowns')->where('receipt_id', $id)->delete();
            $deleted = self::where('id', $id)->delete();

            return DV::depends($deleted, 'Failed to delete receipt');
        });
    }

}
