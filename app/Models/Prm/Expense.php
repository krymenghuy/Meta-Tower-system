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
        $branch_id = $ss->branch_id;

        $v_rule = [
            'vendor_id' => '1|number|exists=vendors.id',
            'category_id' => '1|number|exists=expense_categories.id',
            'expense_date' => '1|date',
            'amount' => '1|number',
            'currency_code' => '0|string|default=USD',
            'reference_no' => '0|string|0-100',
            'remarks' => '0|string|0-255',
            'invoice_image' => '0|string|0-255',
        ];
        $reference_no_char = ['@', '.', '-', '_'];
        $res = DBX::validateObject($arr, $v_rule, 1, ['reference_no' => $reference_no_char], $ss->lang, 0, null);
        if ($res->error)
            return DV::error($res->error);

        $inputs = $res->values;

        if (!empty($inputs['vendor_id'])) {
            $vendor = DB::table('vendors')->where('id', $inputs['vendor_id'])->first();
            if ($vendor) {
                $inputs['payee_name'] = $vendor->name;
            }
        }
        $exist = DB::table('expenses')
            ->whereRaw('LOWER(reference_no)=?', [strtolower($inputs['reference_no'])])
            ->when($id, function ($q) use ($id) {
                $q->where('id', '<>', $id);
            })
            ->exists();
        if ($exist)
            return DV::error('Reference number already exists!');
        $invoice_image = $d->invoice_image ?? null;
        unset($inputs['invoice_image']);
        $delete_pre_image = ($id > 0 && (!$invoice_image || isImage($invoice_image)));

        $created =  !$id;
        $id = DBX::saveData($ss, 'expenses', ['id' => $id], $inputs, [], 1);
        if($id && $created){
            $prefix = 'EXP-';
            $res = setOfficialExpenseNo($branch_id,'expense_code_control','expenses', ['id' => $id], $prefix,4,null);
        }

        if ($id > 0) {

            if($delete_pre_image){
                $file_name = DB::table('expenses as e')->where('e.id',$id)->take(1)->value('e.invoice_image');
                if($file_name){
                    XPublicStorage::delete(['branch_id' => null, 'subs_id' => $ss->subs_id,'dir' => self::$img_dir],'images',$file_name);
                }
                DB::table('expenses')->where('id', $id)->update(['invoice_image' => null]);
            }
            XPublicStorage::saveImage(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], null, $invoice_image, null, ['id' => $id, 'store' => 'expenses.invoice_image']);
            return DV::depends(1, ['expenses' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving expense!');
    }

    public function getListPaginate($arr = [], $ss = null)
    {

        $d = (object) $arr;
        $search_value = $d->search_value ?? null;
        $category_id = $d->category_id ?? null;
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
        if ($category_id) {
            $str_moreWhere .= ' AND e.category_id =' . $category_id;
        }
        if ($status_id) {
            $str_moreWhere .= ' AND e.status_id =' . $status_id;
        }
        $query = DB::table('expenses as e')
            ->join('vendors as v', 'v.id', 'e.vendor_id')
            ->join('expense_categories as ec', 'ec.id', 'e.category_id')
            ->join('expense_statuses as es', 'es.id', 'e.status_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw("e.id,e.expense_no,e.expense_date,e.reference_no,e.amount,e.currency_code,e.remarks,e.update_user,e.updated_at, v.name as vendor_name,ec.name as expense_category,es.name as status")
            ->orderBy('e.id', 'desc');
        $clone_query = clone $query;
        $count = $clone_query->count('e.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach($rows as $row){
            $row = setOfficialDates($row,['expense_date'],['updated_at'],[]);
        }
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public static function expenseDetails($id,$ss = null){

        return DB::table('expenses as e')
            ->where('e.id',$id)
            ->selectRaw('e.id,e.vendor_id,e.category_id,e.status_id,e.expense_no,e.expense_date,e.reference_no,e.amount,e.currency_code,e.remarks')
            ->first();
    }


    public static function getFormOptions($id = null, $ss = null){
        $expense_details = $id ? self::expenseDetails($id,$ss) : null;
        return (object)[
            'expense_details' => $expense_details,
            'vendors' => GeneralSettings::options_vendor($ss),
            'categories' => GeneralSettings::options_expense_categories($ss),
            'statuses' =>GeneralSettings::options_expense_statuses($ss),
        ];


    }

    public function deleteExpense($id = null, $ss = null){
        $id = $id ?? $this->id;
        $expense = DB::table('expenses as e')->select('e.id','e.status_id')->where('e.id',$id)->first();
        if(!$expense){
            return DV::error('Expense not found.');
        }
        if($expense->status_id > 1){
            return DV::error('Cannot delete this expense. It is already processed.');
        }
        $deleted = DB::table('expenses as e')->where('e.id', $id)->delete();
        return $deleted
            ? DV::depends($deleted, ['action' => 'deleted'])
            : DV::error('Delete failed.');
    }

    

}
