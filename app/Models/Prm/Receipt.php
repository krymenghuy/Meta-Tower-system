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

    /**
     * Get a paginated list of receipts
     */
    public function getListPaginate($arr, $ss)
    {
        $d            = (object) $arr;
        $current_page = max(1, (int)($d->current_page ?? 1));
        $per_page     = (int)($d->per_page ?? 10);
        $skip         = ($current_page - 1) * $per_page;

        $query = DB::table('receipts as r')
            ->leftJoin('tenants as t', 't.id', '=', 'r.tenant_id')
            ->leftJoin('invoices as i', 'i.id', '=', 'r.invoice_id')
            ->select([
                'r.id',
                'r.code',
                'r.receipt_date',
                'r.invoice_id',
                'r.tenant_id',
                'r.total_received',
                'r.remarks',
                'r.created_at',
                't.name as tenant_name',
                'i.code as invoice_code',
                'i.amount as invoice_total'
            ])
            ->orderByDesc('r.id');

        if (!empty($d->tenant_id)) {
            $query->where('r.tenant_id', $d->tenant_id);
        }

        if (!empty($d->search_value)) {
            $search = '%' . $d->search_value . '%';
            $query->where(function ($q) use ($search) {
                $q->where('r.code', 'like', $search)
                  ->orWhere('t.name', 'like', $search);
            });
        }

        $count = (clone $query)->count();
        $rows  = $query->skip($skip)->take($per_page)->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    /**
     * Get specific receipt details and its payment breakdown
     */
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
                'rb.account_name',
                'rb.bank_name as manual_bank_name',
                'b.name as registered_bank_name',
                'rb.card_number',
                'rb.card_type',
                'rb.remarks'
            )
            ->get();

        return $header;
    }

    public function deleteReceipt($id, $ss = null)
    {
      $id = $id ?? $this->id;
      $X =self::deleteBy(['id' => $id]);
      return DV::depends($X, 'Failed to delete invoice.');
    }
}
