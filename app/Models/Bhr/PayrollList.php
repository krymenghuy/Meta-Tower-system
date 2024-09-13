<?php

namespace App\Models\Bhr;

use App\Models\DV;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;

class PayrollList
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
            'payroll_id' => '1|number',
            'emp_id' => '1|number',
            'position_id' => '1|number',
            'process_tax' => '1|number',
        ];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;

        $id = saveData($ss,'payroll_list', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['payroll_list' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving payroll');
    }


    function getPayrollListPaginate($arr, $ss)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;

        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }

        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $search_id = $d->id ?? null;
        $search_emp_id = $d->emp_id ?? null;
        $search_payroll_id = $d->payroll_id ?? null;

        $str_search = '1=1';

        $query = DB::table('payroll_list as pl')
            ->join('payrolls as p', 'p.id', 'pl.payroll_id')
            ->join('employees as em', 'em.id', 'pl.emp_id')
            ->join('positions as pos', 'pos.id', 'pl.position_id')
            ->selectRaw('pl.id,pl.payroll_id, p.name as payroll_name,pl.emp_id, em.first_name as emp_first_name, em.last_name as emp_last_name, pl.position_title, pl.process_tax')
            ->where('pl.branch_id', $branch_id)
            ->whereRaw($str_search)
            ->orderby('pl.id', 'asc');

            if ($search_id) {
                $query->where('pl.id', $search_id);
            }

            if ($search_payroll_id) {
                $query->where('pl.payroll_id', $search_payroll_id);
            }

            if ($search_emp_id) {
                $query->where('pl.emp_id', $search_emp_id);
            }

            if ($search_value) {
                $search_value = escape_like_str($search_value);
                $query->whereRaw("pl.position_title like '%{$search_value}%' or pl.process_tax like '%{$search_value}%' or em.first_name like '%{$search_value}%' or em.last_name like '%{$search_value}%' or p.name like '%{$search_value}%'");
                $query->whereRaw($str_search);
            }

            $query->skip($skip_rows)->take($per_page);
            $count_query = clone $query;
            $count = $count_query->count('pl.id');
            $rows = $query->get();

            return new LengthAwarePaginator($rows, $count, $per_page, $current_page);

        }


        function getDetails($id, $ss)
        {
            if(!is_numeric($id)){
                return DV::error('Invalid ID');
            }

            $ss = $ss ?? $this->userInfo;

            $query = DB::table('payroll_list as pl')
                ->join('payrolls as p', 'p.id', 'pl.payroll_id')
                ->join('employees as em', 'em.id', 'pl.emp_id')
                ->join('positions as pos', 'pos.id', 'pl.position_id')
                ->selectRaw('pl.id,pl.payroll_id, p.name as payroll_name,pl.emp_id, em.first_name as emp_first_name, em.last_name as emp_last_name, pl.position_title, pl.process_tax')
                ->where('pl.branch_id', $ss->branch_id)
                ->where('pl.id', $id)
                ->first();
            if(!$query){
                return DV::error('Payroll List not found');
            }
            // Return the query result
            return $query;
        }

        function deletePayrollList($id, $ss)
        {
            if(!is_numeric($id)){
                return DV::error('Invalid ID');
            }
            $branch_id = $ss->branch_id;
            $query = DB::table('payroll_list')
                ->where('id', $id)
                ->delete();
            if(!$query){
                return DV::error('Payroll List not found');
            }
            // Return the query result
            return $query;
        }
}
