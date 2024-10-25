<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class TaxAllowance
{

    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function save($arr,$ss = null){
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id' => '0|identity=1',
            'emp_id' => '1|number',
            'amount' => '1|number',
            'remarks' => '0|string|250',
        ];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;

        $id = saveData($ss, 'tax_allowances', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['sender' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving data');
    }

    function getTaxAllowanceListPaginate($arr, $ss)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;

        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $emp_id = $d->emp_id ?? null;

        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $search_id = $d->id ?? null;

        $str_search = '1=1';

        $query = DB::table('tax_allowances as ta')
            ->join('employees as em', 'em.id', '=', 'ta.emp_id')
            ->selectRaw('ta.id, em.name as emp_name,ta.amount,ta.remarks')
            ->where('ta.branch_id', $ss->branch_id)
            ->where('ta.emp_id', $emp_id);

        if ($search_id) {
            $query->where('ta.id', $search_id);
        }
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->where('em.name', 'like', '%' . $search_value . '%');
        }
        $query->skip($skip_rows)->take($per_page);
        $count_query = clone $query;
        $count = $count_query->count('ta.id');
        $rows = $query->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }


    function getDetails($id, $ss)
    {
        $branch_id = $ss->branch_id;
        $query = DB::table('tax_allowances as ta')
            ->join('employees as em', 'em.id', '=', 'ta.emp_id')
            ->selectRaw('ta.id, em.name as emp_name,ta.amount,ta.remarks')
            ->where('ta.branch_id', $ss->branch_id)
            ->where('ta.id', $id)
            ->first();
        return $query;
    }

    function getFormOptions($id, $ss){
        $tax_allowance = null;
        if ($id) {
            $tax_allowance = self::getDetails($id, $ss);
        }
        return (object) [


            'employees' => GeneralSettings::options_employee(10,$ss),
            'tax_allowance' => $tax_allowance,
        ];

    }

    function deleteTaxAllowance($id, $ss)
    {
        $branch_id = $ss->branch_id;
        $query = DB::table('tax_allowances')
            ->where('id', $id)
            ->delete();
        return DV::depends($query, ['action', 'deleted']);
    }

}
