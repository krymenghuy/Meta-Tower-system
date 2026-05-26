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

        $search_value = $d->search_value ?? null;
        $status_id    = $d->status_id ?? null;
        $date_from    = $d->date_from ?? null;
        $date_to      = $d->date_to ?? null;

        $current_page = $d->current_page ?? 1;
        $per_page     = $d->per_page ?? 10;

        if (!is_numeric($current_page) || !is_numeric($per_page)) {
            return null;
        }

        $skip_rows = ($current_page - 1) * $per_page;

        $str_search = "1=1";
        $str_moreWhere = "2=2";

        if ($search_value) {
            $skip_rows = 0;
            $current_page = 1;
            $search_value = escape_like_str($search_value);
            $str_search = "(r.code LIKE '%" . $search_value . "%' OR t.name LIKE '%" .$search_value . "%' OR i.code LIKE '%" . $search_value . "%')";
        }

        if ($status_id) {
            $str_moreWhere .= ' AND r.receipt_status_id =' . (int)$status_id;
        }

        $query = DB::table('receipts as r')
            ->leftJoin('tenants as t', 't.id', '=', 'r.tenant_id')
            ->leftJoin('invoices as i', 'i.id', '=', 'r.invoice_id')
            ->leftJoin('building_spaces as bs', 'bs.id', '=', 'i.space_id')
            ->leftJoin('receipt_breakdowns as rb', 'rb.receipt_id', '=', 'r.id')
            ->leftJoin('receipt_statuses as rs', 'rs.id', '=', 'r.receipt_status_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->select([
                'r.id',
                'r.code',
                'r.receipt_date',
                'r.total_received',
                'r.remarks',
                'r.total_paid',
                'r.updated_at',
                'r.update_user',
                'r.receipt_status_id',
                't.name as tenant_name',
                't.phone_number as tenant_phone',
                'i.code as invoice_code',
                'i.amount as invoice_total',
                'i.issue_date as issue_date',
                'bs.code as space_code',
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

        if (!empty($date_from)) {
            $query->whereDate('r.receipt_date', '>=', date('Y-m-d', strtotime($date_from)));
        }
        if (!empty($date_to)) {
            $query->whereDate('r.receipt_date', '<=', date('Y-m-d', strtotime($date_to)));
        }

        if ($id) {
            $query->where('r.id', $id);
        }
        $clone_query = clone $query;
        $total = $clone_query->get()->count();

        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            $row = setOfficialDates($row, ['receipt_date', 'issue_date'], ['updated_at'], []);
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
                'r.total_paid',
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

public function cancelReceipt($arr, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $id = $arr['id'] ?? null;
        $remarks = $arr['remarks'] ?? $arr['remark'] ?? '';
        $new_status_id = 2; // Canceled status

        if (!$id) {
            return DV::error('Missing required parameters');
        }

        return DB::transaction(function () use ($id, $new_status_id, $ss, $remarks) {
            $receipt = DB::table('receipts')->where('id', $id)->first();
            if (!$receipt) {
                return DV::error('Receipt not found');
            }

            $old_status_id = (int)$receipt->receipt_status_id;
            if ($old_status_id === $new_status_id) {
                return DV::error('Receipt is already canceled');
            }
            $updated = DB::table('receipts')
                ->where('id', $id)
                ->update([
                    'receipt_status_id' => $new_status_id,
                    'remarks'           => $remarks,
                    'update_user'       => $ss->full_name ?? $ss->name ?? 'System',
                    'update_uid'        => $ss->id ?? $ss->uid ?? null,
                    'updated_at'        => now(),
                ]);

            if ($updated) {
                $invoice = DB::table('invoices')->where('id', $receipt->invoice_id)->first();

                if ($invoice) {
                    $amount_to_reverse = (float)$receipt->total_received;
                    $current_paid = (float)$invoice->paid_amount;
                    $total_invoice = (float)$invoice->amount;

                    $new_paid_amount = max(0, $current_paid - $amount_to_reverse);
                    $new_due_amount = max(0, $total_invoice - $new_paid_amount);

                    $inv_status = 2;
                    if ($new_due_amount <= 0.001) {
                        $inv_status = 1; // Paid
                    } elseif ($new_paid_amount > 0) {
                        $inv_status = 3; // Partial
                    }

                    DB::table('invoices')->where('id', $receipt->invoice_id)->update([
                        'paid_amount'       => $new_paid_amount,
                        'due_amount'        => $new_due_amount,
                        'payment_status_id' => $inv_status,
                        'is_paid'           => ($inv_status == 1 ? 1 : 0),
                        'updated_at'        => now(),
                        'update_user'       => $ss->full_name ?? $ss->name ?? 'System',
                        'update_uid'        => $ss->id ?? $ss->uid ?? null,
                    ]);
                }
            }

            return DV::success(['message' => 'Receipt canceled and invoice balance restored successfully']);
        });
    }


    public function getFormOptions($arr = [], $ss = null){
        $ss = $ss ? $ss : $this->userInfo;
        $d = (object)$arr;
        $id = $d->id ?? $this->id;
        return(object)[
            'receipt_statuses'  => GeneralSettings::options_receipt_status($ss)

        ];
    }


}