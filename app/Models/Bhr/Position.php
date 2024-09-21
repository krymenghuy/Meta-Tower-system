<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class Position
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
            'department_id' => '1|number',
            'status_id' => '1|number',
        ];

        $checkUnque = ["$branch_id|positions|name|id=id|text=Position already exists."];
        $res = validateObject($arr, $v_rule, true, [], $ss->lang, false, $checkUnque);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;

        $id = saveData($ss,'positions', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['positions' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving position');

    }

    function getPositionListPaginate($arr, $ss) {
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
        $search_status_id = $d->status_id ?? null;

        $str_search = '1=1';

        $query = DB::table('positions as p')
            ->join('departments as d', 'd.id', '=', 'p.department_id')
            ->join('dep_status as ds', 'ds.id', '=', 'p.status_id')
            ->selectRaw('p.id, p.name, p.department_id, d.name as department, p.status_id, ds.name as status');
        if ($search_id) {
            $query->where('p.id', $search_id);
        }

        if ($search_status_id) {
            $query->where('p.status_id', $search_status_id);
        }

        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "p.name like '%$search_value%' or d.name like '%$search_value%'";
            $query->whereRaw($str_search);
        }

        $query->orderBy('p.id', 'asc');
        $query->skip($skip_rows)->take($per_page);
        $count_query = clone $query;
        $count = $count_query->count('d.id');
        $rows = $query->get();


        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getDetails($id){
        $query = DB::table('positions as p')
            ->join('departments as d', 'd.id', '=', 'p.department_id')
            ->join('dep_status as ds', 'ds.id', '=', 'p.status_id')
            ->selectRaw('p.id, p.name, p.department_id, d.name as department, p.status_id, ds.name as status');
        $query->where('p.id', $id);
        $row = $query->first();
        return $row;
    }

    function deletePosition($id)
    {
        $deleted = DB::table('positions')->where('id', $id)->delete();
        return $deleted;
    }

    function getFormOptions($id, $ss)
    {
        $position = null;
        if ($id) {
            $position = self::getDetails($id, $ss);
        }
        return (object) [

            'status' => DB::table('dep_status')->selectRaw('id,name')->get(),
            'departments' => DB::table('departments')->selectRaw('id,name')->get(),


            'positions' => $position,
        ];

    }

}
