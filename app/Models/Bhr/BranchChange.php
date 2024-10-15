<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
class BranchChange
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
            'from_branch_id' => '1|number',
            'to_branch_id' => '1|number',
            'remarks' => '0|string|250',
        ];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;

        $id = saveData($ss, 'branch_changes', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['sender' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving data');
    }


    function getBranchChangeListPaginate($arr, $ss)
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

        $query = DB::table('branch_changes as bc')
            ->join('employees as e', 'e.id', '=', 'bc.emp_id')
            ->selectRaw('bc.id, e.id as emp_id, e.name, bc.from_branch_id, bc.to_branch_id, bc.remarks')
            ->where('bc.branch_id', $ss->branch_id);

        if ($search_id) {
            $query->where('bc.id', $search_id);
        }
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "e.name like '%" . $search_value . "%' or p.title like '%" . $search_value . "%'";
        }
        $query->skip($skip_rows)->take($per_page);
        $count_query = clone $query;
        $count = $count_query->count('bc.id');
        $rows = $query->get();
        foreach($rows as $row)
        {
            $row->from_branch = DB::table('um_branches as b')->where('b.id', $row->from_branch_id)->value('name');
            $row->to_branch = DB::table('um_branches as b')->where('b.id', $row->to_branch_id)->value('name');
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getDetails($id, $ss)
    {
        $branch_id = $ss->branch_id;
        $query = DB::table('branch_changes as bc')
            ->join('employees as e', 'e.id', '=', 'bc.emp_id')
            ->selectRaw('bc.id, e.id as emp_id, e.name, bc.from_branch_id, bc.to_branch_id, bc.remarks')
            ->where('bc.branch_id', $ss->branch_id)
            ->where('bc.id', $id)
            ->first();

        if ($query) {
            $query->from_branch = DB::table('um_branches as b')->where('b.id', $query->from_branch_id)->value('name');
            $query->to_branch = DB::table('um_branches as b')->where('b.id', $query->to_branch_id)->value('name');
            return $query;
        }

        return DV::error('Invalid ID');
    }

    function deleteBranchChange($id, $ss)
    {
        // Ensure $id is numeric and valid
        if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        // Assuming $ss contains branch_id or other necessary info
        $branch_id = $ss->branch_id;

        // Build and execute the query
        $query = DB::table('branch_changes')
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
        $branch_change = null;
        if ($id) {
            $branch_change = self::getDetails($id, $ss);
        }
        return (object) [

            'employees' => DB::table('employees')->selectRaw('id,name')->get(),
            'from_branches' => DB::table('um_branches')->selectRaw('id,name')->get(),
            'to_branches' => DB::table('um_branches')->selectRaw('id,name')->get(),
            'branch_change' => $branch_change,
        ];
    }

}

