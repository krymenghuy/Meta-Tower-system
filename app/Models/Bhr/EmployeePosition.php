<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class EmployeePosition
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
            'position_id' => '1|number',
            'prev_position_id' => '1|number',
            'salary' => '1|numeric|0-1000000',
            'status_id' => '1|number|default = 1',
        ];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;

        $id = saveData($ss, 'emp_positions', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['sender' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving data');
    }

    function getEmpPositionListPaginate($arr, $ss) {
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

        $query = DB::table('emp_positions as ep')
            ->join('employees as e', 'e.id', '=', 'ep.emp_id')
            ->join('employee_status as s', 's.id', '=', 'ep.status_id')
            ->selectRaw('ep.id, e.id as emp_id, e.name, ep.prev_position_id,ep.position_id, ep.salary, s.name as status')
            ->where('ep.branch_id', $ss->branch_id);

        if ($search_id) {
            $query->where('ep.id', $search_id);
        }

        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "e.name like '%" . $search_value . "%' or p.title like '%" . $search_value . "%'";
            $query->whereRaw($str_search);
        }

        $query->skip($skip_rows)->take($per_page);
        $count_query = clone $query;
        $count = $count_query->count('ep.id');
        $rows = $query->get();
        foreach($rows as $row)
        {
            $row->prev_position_title = DB::table('positions as p')->where('p.id', $row->prev_position_id)->value('title');
            $row->position_title = DB::table('positions as p')->where('p.id', $row->position_id)->value('title');
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getDetails($id, $ss) {
         // Ensure $id is numeric and valid
         if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        // Assuming $ss contains branch_id or other necessary info
        $branch_id = $ss->branch_id;

        // Build and execute the query
        $query = DB::table('emp_positions as ep')
            ->join('employees as e', 'e.id', '=', 'ep.emp_id')
            ->join('employee_status as s', 's.id', '=', 'ep.status_id')
            ->selectRaw('ep.id, e.id as emp_id, e.name,ep.position_id, ep.prev_position_id, ep.salary, s.name as status')
            ->where('ep.branch_id', $ss->branch_id)
            ->where('ep.id', $id)
            ->first();

        if ($query) {
            $query->prev_position_title = DB::table('positions as p')->where('p.id', $query->prev_position_id)->value('title');
            $query->position_title = DB::table('positions as p')->where('p.id', $query->position_id)->value('title');
            return $query;
        }

        return DV::error('Invalid ID');
    }

    function deleteEmpPosition($id, $ss) {
         // Ensure $id is numeric and valid
         if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        // Assuming $ss contains branch_id or other necessary info
        $branch_id = $ss->branch_id;

        // Build and execute the query
        $query = DB::table('emp_positions')
            ->where('id', $id)
            ->delete();
        if (!$query) {
            return DV::error('Invalid ID');
        }
        // Return the query result
        return $query;
    }
    function getFormOptions($id, $ss)
    {
        $emp_position = null;
        if ($id) {
            $emp_position = self::getDetails($id, $ss);
        }
        return (object) [

            'employees' => DB::table('employees')->selectRaw('id,name')->get(),
            'status' => DB::table('employee_status')->selectRaw('id,name')->get(),
            'prev_positions' => DB::table('positions')->selectRaw('id,title')->get(),
            'positions' => DB::table('positions')->selectRaw('id,title')->get(),
            'emp_position' => $emp_position,
        ];

    }

}
