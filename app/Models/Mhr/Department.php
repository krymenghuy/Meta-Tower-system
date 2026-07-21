<?php

namespace App\Models\Mhr;

use App\Models\Prm\GeneralSettings;
use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use Vsd\Vsloquent\VSModel;

class Department extends VSModel
{
    protected $table = 'departments';

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function upsert($arr, $id = null ,$ss = null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $id = $id ?? $this->id;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'name' => '1|string|0-100|text=name_required::@key;@max;@value',
            'shortcut' => '1|string|0-10|text=shortcut_required::@key;@max;@value',
            'description' => '0|string|255',
            'inactive' => '0|number|default = 0',
        ];

        $pos_char = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ',', '(', ')', ' '];
        $allow_chars = [
            'name' => ['(', ')', '-', '/', '.', ' ', ','],
            'description' => $pos_char,
        ];
        $res = DBX::validateObject($arr, $v_rule, true, [], $ss->lang, false);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;

        $err = self::checkDuplicateName($inputs['name'], $id, $branch_id);
        if ($err) {
            return DV::error($err);
        }

        $id = DBX::saveData($ss,'departments', ['id' => $id], $inputs, [], 1,false);
        if ($id > 0) {
            return DV::depends($id, ['departments' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving department');

    }

    static function checkDuplicateName($name, $id, $branch_id)
    {
        $query = DB::table('departments as d')
            ->where('d.branch_id', $branch_id)
            ->where('d.name', $name);

        if ($id) {
            $query->where('d.id', '<>', $id);
        }

        $test = $query->select('id')->first();
        if ($test) {
            return 'department_exist';
        }

        return null;
    }

    function getList($arr, $ss) {
        //$branch_id = $ss->branch_id;
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

        $update_date = DBX::updatedAt();
        $col_update_date = DBX::formatTime("d.$update_date",'updated_at');
        $query = DB::table('departments as d')
            ->where('d.inactive', 0)
            ->whereRaw($str_search)
            ->selectRaw('d.id, d.name, d.shortcut, d.description, d.inactive,' . $col_update_date . ',d.update_user');
        $clone_query = clone  $query;
        $count = $clone_query->count('d.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }


    public function getDetails($id) {
        $row  = DB::table('departments as d')
            ->selectRaw('d.id, d.name, d.shortcut, d.description,d.inactive,d.created_at,d.updated_at,d.create_user,d.update_user')->where('d.inactive',0)->where('d.id',$id)->first();
        return $row;
    }
     static function getProps($id,$cols){
       return DB::table('departments')->where('id',$id)->selectRaw($cols)->first();
     }

    public function deleteDepartment($id, $ss = null) {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        if(!$id) return DV::error('Department ID is not valid');
        $delete = DB::table('departments')->where('id', $id)->delete();
        return DV::depends($delete,null,'Failed to delete department');
    }

    public function getFormOptions($id, $ss)
    {
        $department = null;
        if ($id) {
            $department = self::getDetails($id, $ss);
        }
        return (object) [

            'departments' => $department,
        ];

    }


}
