<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
use App\Models\DBX;
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

    function save($arr, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id' => '0|identity=1',
            'name' => '1|string',
            'p_month' => '1|number',
            'p_year' => '1|number',
            'start_date' => '1|date',
            'end_date' => '1|date',
            'p_number' => '1|number',
            'total' => '1|number',
            'authorized' => '1|number|default = 0',
            'disbursed' => '1|number|default = 0',
            'currency_code' => '0|number',
            'exchange_rate' => '0|number',

        ];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;

        $id = saveData($ss, 'payrolls', ['id' => $id], $inputs, [], 1);
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

        $str_search = '1=1';

        $query = DB::table('payrolls as p')
            ->selectRaw('p.id, p.name, p.p_month, p.p_year,formatDate(p.start_date) as start_date,formatDate(p.end_date) as end_date, p.p_number, p.total, p.authorized, p.disbursed, p.currency_code, p.exchange_rate')
            ->where('p.branch_id', $ss->branch_id);
        if ($search_id) {
            $query->where('p.id', $search_id);
        }
        if ($search_value) {
            $query->where('p.name', 'like', '%' . $search_value . '%');
        }
        $clone_query = clone  $query;
        $count = $clone_query->count('p.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();


        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getDetails($id, $ss)
    {
        $row = DB::table('payrolls as p')
            ->selectRaw('p.id, p.name, p.p_month, p.p_year, p.start_date, p.end_date, p.p_number, p.total, p.authorized, p.disbursed, p.currency_code, p.exchange_rate')
            ->where('p.branch_id', $ss->branch_id)
            ->where('p.id', $id)
            ->take(1)
            ->first();
        return $row;
    }

    function deletePayroll($id, $ss)
    {
        if(!is_numeric($id)){
            return DV::error('Invalid ID');
        }
        $branch_id = $ss->branch_id;
        $query = DB::table('payrolls')
            ->where('id', $id)
            ->delete();
        if(!$query){
            return DV::error('Payroll not found');
        }
        // Return the query result
        return $query;
    }

    function getFormOptions($id, $ss)
    {
        $payroll = null;
        if ($id) {
            $payroll = self::getDetails($id, $ss);
        }
        return (object) [
            'sort_by' => [

                ['id' => 'p.name', 'name' => 'By Name'],
            ],

            'payrolls' => $payroll,
        ];

    }
}
