<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;


class Department
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function save($arr,$id,$ss = null){
        $ss = $ss ?? $this->userInfo;
        $id = $id ?? $this->id;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id' => '0|identity=1',
            'name' => '0|string|0-100',
            'shortcut' => '0|string|0-10',
            'description' => '0|string|255',
            'inactive' => '1|number|default = 0',
        ];


        $checkUnque = ["$branch_id|departments|name|id=id|text=Department already exists."];
        $res = validateObject($arr, $v_rule, true, [], $ss->lang, false, $checkUnque);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;

        $id = saveData($ss,'departments', ['id' => $id], $inputs, [], 1,false);
        if ($id > 0) {
            return DV::depends($id, ['departments' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving department');

    }

    function getDepartmentListPaginate($arr, $ss) {
        $branch_id = $ss->branch_id;
        $d = (object) $arr;


        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $search_value = $d->search_value ?? null;
        $skip_rows = ($current_page - 1) * $per_page;

        $str_search = '1=1';
        if($search_value){
            $skip_rows = 0;
            $str_search = "(d.name LIKE '%" . $search_value . "%' OR d.shortcut ='" . $search_value . "')";
        }

        $query = DB::table('departments as d')
            ->where('d.inactive',0)
            ->whereRaw($str_search)
            ->selectRaw('d.id, d.name, d.shortcut, d.description, d.inactive,d.updated_at,d.update_user')->orderBy('d.id','ASC');
        $clone_query = clone  $query;
        $count = $clone_query->count('d.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();


        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getDetails($id,$ss) {
        $branch_id = $ss->branch_id;

        $row  = DB::table('departments as d')
            ->selectRaw('d.id, d.name, d.shortcut, d.description,d.inactive,d.created_at,d.updated_at,d.create_user,d.update_user')->where('d.inactive',0)->where('d.branch_id',$branch_id)->where('d.id',$id)->take(1)->first();
        
        return $row;
    }


    function deleteDepartment($id) {
        $id = $id ?? $this->id;

        $delete = DB::table('departments')->where('id', $id)->update(['inactive'=>1]);
        return DV::depends($delete, ['action', 'deleted']);
    }

    function getFormOptions($id, $ss)
    {
        $department = null;
        if ($id) {
            $department = self::getDetails($id, $ss);
        }
        return (object) [

            // 'status' => DB::table('dep_status')->selectRaw('id,name')->get(),


            'departments' => $department,
        ];

    }


}
