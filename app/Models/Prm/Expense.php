<?php

namespace App\Models\Prm;

use App\Models\Prm\GeneralSettings;
use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use XPublicStorage;
use Vsd\Vsloquent\VSModel;


class Expense //extends Model
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'expenses';
    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
    public function saveExpense($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $v_rule = [
            'vendor_id' => '1|number|exists=vendors.id',
            'expense_type_id' => '1|number|exists=expense_types.id',
            'expense_date' => '1|date',
            'expense_no' => '1|string|0-50',
            'amount' => '1|number',
            'tax_amount' => '0|number',
            'pmt_method' => '0|string|0-50',
            'reference_no' => '0|string|0-100',
            'remarks' => '0|string|0-255',
            'invoice_image' => '0|string|0-255',
        ];
        $expense_no_char = ['@', '.', '-', '_'];
        $reference_no_char = ['@', '.', '-', '_'];
        $res = DBX::validateObject($arr, $v_rule, 1, ['expense_no' => $expense_no_char,'reference_no' => $reference_no_char], $ss->lang, 0, null);
        if ($res->error)
            return DV::error($res->error);

        $inputs = $res->values;

        if (!empty($inputs['vendor_id'])) {
            $vendor = DB::table('vendors')->where('id', $inputs['vendor_id'])->first();
            if ($vendor) {
                $inputs['payee_name'] = $vendor->name;
            }
        }

        $amount = $inputs['amount'] ?? 0;
        $tax = $inputs['tax_amount'] ?? 0;
        $inputs['total_amount'] = $amount + $tax;

        $exist = DB::table('expenses')
            ->whereRaw('LOWER(expense_no)=?', [strtolower($inputs['expense_no'])])
            ->when($id, function ($q) use ($id) {
                $q->where('id', '<>', $id);
            })
            ->exists();
        if ($exist)
            return DV::error('Expense number already exists!');
        $id = DBX::saveData($ss, 'expenses', ['id' => $id], $inputs, [], 1);

        if ($id > 0) {
            return DV::depends(1, ['expenses' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving expense!');
    }

    public function getListPaginate($arr = [], $ss = null)
    {

        $d = (object) $arr;
        $search_value = $d->search_value ?? null;
        $type_id = $d->expense_type_id ?? null;
        $status_id = $d->status_id ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page) || !is_numeric($per_page)) {
            return null;
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $str_search = "1=1";
        $str_moreWhere = "2=2";
        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(e.expense_no Like '%" . $search_value . "%' OR v.name Like '%" . $search_value . "%' OR e.reference_no Like '%" . $search_value . "%')";
        }
        if ($type_id) {
            $str_moreWhere .= ' AND e.expense_type_id =' . $type_id;
        }
        if ($status_id) {
            $str_moreWhere .= ' AND e.status_id =' . $status_id;
        }
        $query = DB::table('expenses as e')
            ->join('vendors as v', 'v.id', 'e.vendor_id')
            ->join('expense_types as et', 'et.id', 'e.expense_type_id')
            ->join('expense_statuses as es', 'es.id', 'e.status_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw("e.id,e.expense_no,e.expense_date,e.reference_no,e.amount,e.tax_amount,e.total_amount,e.pmt_method,e.remarks,e.update_user,e.updated_at, v.name as vendor_name,et.name as expense_type,es.name as status")
            ->orderBy('e.id', 'desc');
        $clone_query = clone $query;
        $count = $clone_query->count('e.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach($rows as $row){
            $row = setOfficialDates($row,['expense_date'],['updated_at'],[]);
        }
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }
}
