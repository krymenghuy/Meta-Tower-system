<?php

namespace App\Models\Ypg;

use DV;
use DBX;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class SalaryHistory
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function save($arr = [], $id = null, $ss = null) {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'emp_id' => '1|number',
            'org_position_id' => '1|number',
            'org_salary' => '1|numeric|0-1000000',
            'new_position_id' => '1|number',
            'new_salary' => '1|numeric|0-1000000',
        ];
        $res = DBX::validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;

        $id = DBX::saveData($ss, 'salary_histories', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['sender' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving data');
    }

    function getSalaryHistoryListPaginate($arr, $ss) {
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

        $query = DB::table('salary_histories as sh')
            ->join('employees as e', 'e.id', '=', 'sh.emp_id')
            ->selectRaw('sh.id, e.id as emp_id, e.name, sh.org_position_id, sh.org_salary, sh.new_position_id, sh.new_salary')
            ->where('sh.branch_id', $ss->branch_id);

        if ($search_id) {
            $query->where('sh.id', $search_id);
        }

        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "e.name like '%" . $search_value . "%' or p.title like '%" . $search_value . "%'";
        }
        $query->skip($skip_rows)->take($per_page);
        $count_query = clone $query;
        $count = $count_query->count('sh.id');
        $rows = $query->get();
        foreach($rows as $row)
        {
            $row->org_position = DB::table('positions as p')->where('p.id', $row->org_position_id)->value('title');
            $row->new_position = DB::table('positions as p')->where('p.id', $row->new_position_id)->value('title');
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getDetails($id, $ss) {
        $branch_id = $ss->branch_id;
        $query = DB::table('salary_histories as sh')
            ->join('employees as e', 'e.id', '=', 'sh.emp_id')
            ->selectRaw('sh.id, e.id as emp_id, e.name, sh.org_position_id, sh.org_salary, sh.new_position_id, sh.new_salary')
            ->where('sh.branch_id', $ss->branch_id)
            ->where('sh.id', $id)
            ->first();

        if ($query) {
            $query->org_position = DB::table('positions as p')->where('p.id', $query->org_position_id)->value('title');
            $query->new_position = DB::table('positions as p')->where('p.id', $query->new_position_id)->value('title');
            return $query;
        }

        return DV::error('Invalid ID');
    }

    function delete($id = null, $ss = null) {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        $branch_id = $ss->branch_id;

        $query = DB::table('emp_salary_histories')
            ->where('id', $id)
            ->delete();
        if (!$query) {
            return DV::error('Invalid ID');
        }
        return DV::depends($query, null, 'Error deleting salary history');
    }
    function getFormOptions($id, $ss)
    {
        $salary_history = null;
        if ($id) {
            $salary_history = self::getDetails($id, $ss);
        }
        return (object) [

            'employees' => DB::table('employees')->selectRaw('id,name')->get(),
            'org_positions' => DB::table('positions')->selectRaw('id,title')->get(),
            'new_positions' => DB::table('positions')->selectRaw('id,title')->get(),
            'salary_history' => $salary_history,
        ];

    }
}

