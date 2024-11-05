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
            'title' => '1|string|0-100',
            'department_id' => '1|number',
            'salary' => '1|number',
            'inactive' => '1|number|default = 0',
        ];
        $pos_char = ['$', '#', '@', '!','&', '.', '-', '_', '=', '?'];

        $checkUnque = ["$branch_id|positions|title|id=id|text=Position already exists."];
        $res = validateObject($arr, $v_rule, true, ['title'=>$pos_char], $ss->lang, false, $checkUnque);
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
        $branch_id = $ss->branch_id;
        $d = (object) $arr;


        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $str_search = '1=1';
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "(p.title LIKE '%" .$search_value."%' OR d.name = '" . $search_value . "')";
        }

        $query = DB::table('positions as p')
            ->join('departments as d', 'd.id', '=', 'p.department_id')
            ->where('p.inactive',0)
            ->whereRaw($str_search)
            ->selectRaw('p.id, p.title, p.department_id,p.salary, d.name as department,p.updated_at,p.update_user')->orderBy('p.id','ASC');
        $clone_query = clone $query;
        $count = $clone_query->count('p.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();



        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getDetails($id,$ss){
        $branch_id = $ss->branch_id;

        $rows = DB::table('positions as p')
            ->join('departments as d', 'd.id', '=', 'p.department_id')
            ->selectRaw('p.id, p.title, p.department_id,p.salary, d.name as department')
            ->where('p.inactive',0)
            ->where('p.branch_id',$branch_id)
            ->where('p.id',$id)->take(1)
            ->first();
        return $rows;
    }

    function deletePosition($id)
    {
        $id = $id ?? $this->id;

        $delete = DB::table('positions')->where('id', $id)->update(['inactive'=>1]);
        return DV::depends($delete, ['action','deleted']);
    }

    function getFormOptions($id, $ss)
    {
        $position = null;
        if ($id) {
            $position = self::getDetails($id, $ss);
        }
        return (object) [

            // 'status' => DB::table('dep_status')->selectRaw('id,name')->get(),
            'departments' => DB::table('departments')->selectRaw('id,name')->get(),


            'positions' => $position,
        ];

    }

}
