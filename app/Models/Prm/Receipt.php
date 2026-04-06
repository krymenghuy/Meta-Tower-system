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
                ->leftJoin('building_spaces as bs',  'bs.id', '=', 'i.space_id')
                ->leftJoin('receipt_breakdowns as rb', 'rb.receipt_id', '=', 'r.id')
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

                    DB::raw("
                        GROUP_CONCAT(
                            DISTINCT CONCAT(
                                TRIM(rb.method),
                                ' = $',
                                FORMAT(rb.amount, 2)
                            )
                            SEPARATOR ', '
                        ) as payment_methods
                    "),
                ])
                ->groupBy(
                    'r.id', 'r.code', 'r.receipt_date', 'r.total_received',
                    'r.remarks', 'r.updated_at', 'r.update_user',
                    't.name', 'i.code', 'i.amount'
                )
                ->orderByDesc('r.id');

            // Filters
            if (!empty($d->tenant_id)) {
                $query->where('r.tenant_id', $d->tenant_id);
            }

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
                $row = setOfficialDates($row, [], ['updated_at', 'receipt_date'], []);
            }
            foreach($rows as $row){
                $row = setOfficialDates($row,['receipt_date'],['updated_at','created_at as created_at'],[]);
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
