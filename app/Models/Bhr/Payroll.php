<?php

namespace App\Models\Bhr;

use App\Models\DV;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;

class Payroll
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
            'name' => '1|string|0-100',
            'position_id' => '1|numeric|0-1000000',
            'rate' => '1|string|0-100',
            'start_date' => '1|date',
            'end_date' => '1|date',
            'working_hours' => '1|string|0-100',
            'salary' => '1|numeric|0-1000000',
            'status_id' => '1|numeric|0-1000000',
        ];

        // $checkUnque = ["$branch_id|payrolls|name|id=id|text=Payroll already exists."];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;

        $id = saveData($ss,'payrolls', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['payrolls' => $inputs, 'id' => $id]);
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
        $search_position_id = $d->position_id ?? null;
        $search_status_id = $d->status_id ?? null;

        $str_search = '1=1';

        $query = DB::table('payrolls as pay')
            ->join('positions as pos', 'pos.id', '=', 'pay.position_id')
            ->join('statuses as s', 's.id', '=', 'pay.status_id')
            ->selectRaw('pay.id,pay.name,pay.position_id,pos.name as position,pay.rate,pay.start_date,pay.end_date,pay.working_hours,pay.salary,s.name as status')
            ->whereRaw($str_search);

        if($search_id){
            $query->where('pay.id', $search_id);
        }

        if($search_position_id){
            $query->where('pay.position_id', $search_position_id);
        }

        if($search_status_id){
            $query->where('pay.status_id', $search_status_id);
        }

        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->whereRaw("pay.name like '%{$search_value}%' or pos.name like '%{$search_value}%' or s.name like '%{$search_value}%' or pay.rate like '%{$search_value}%' or pay.start_date like '%{$search_value}%' or pay.end_date like '%{$search_value}%' or pay.working_hours like '%{$search_value}%' or pay.salary like '%{$search_value}%'");
            $query->whereRaw($str_search);
        }

        $query->skip($skip_rows)->take($per_page);
        $count_query = clone $query;
        $count = $count_query->count('pay.id');
        $rows = $query->get();


        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getDetails($id, $ss)
    {
        if(!is_numeric($id)){
            return DV::error('Invalid ID');
        }

        $branch_id = $ss->branch_id;

        $query = DB::table('payrolls as pay')
            ->join('positions as pos', 'pos.id', '=', 'pay.position_id')
            ->join('statuses as s', 's.id', '=', 'pay.status_id')
            ->selectRaw('pay.id,pay.name,pay.position_id,pos.name as position,pay.rate,pay.start_date,pay.end_date,pay.working_hours,pay.salary,s.name as status')
            ->where('pay.id', $id)
            ->where('pay.branch_id', $branch_id)
            ->get();
        if (count($query) > 0) {
            return DV::result($query[0]);
        }
        return DV::error('Payroll not found');
    }

    function deletePayroll($id, $ss)
    {
        if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }
        $branch_id = $ss->branch_id;
        $query = DB::table('payrolls')
            ->where('id', $id)
            ->delete();
        if (!$query) {
            return DV::error(' Payroll not found');
        }
        // Return the query result
        return $query;
    }
}
