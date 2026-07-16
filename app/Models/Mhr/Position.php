<?php

namespace App\Models\Mhr;

use DV;
use DBX;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use VSMoney;

class Position
{
    protected $id = null;
    protected $userInfo = null;
    protected static $fk_tables = [
        'employees'=>'position_id'
    ];

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
            'title' => '1|string|0-100',
            'job_level_id'=>'1|number',
            'staff_group_id' => '1|number',
            'department_id' => '1|number',
            'salary' => '1|number',
            'currency_code'=> '1|choice|KHR,USD|default='.VSMoney::$base_currency,
        ];
        $pos_char = ['$',"'", '#', '@', '!','&', '.', '-', '_', '=', '?'];

        $res = DBX::validateObject($arr, $v_rule, true, ['Title'=>$pos_char], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        if(!$id)
        {
            $checkUnque = DB::table('positions')->where('title',$inputs['title'])->where('job_level_id',$inputs['job_level_id'])->where('branch_id', $branch_id)->select('id')->first();
            if ($checkUnque) {
                return DV::error('Position already exists.');
            }
        }

        $id = DBX::saveData($ss,'positions', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['positions' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving position');

    }

    function getList($arr, $ss) {
        $branch_id = $ss->branch_id;
        $d = (object) $arr;

        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $search_department = $d->department_id ?? null;
        $str_search = '1=1';
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "(p.title LIKE '%" .$search_value."%' OR d.name = '" . $search_value . "')";
        }

        $update_date =DBX::updatedAt();
        $col_update_date = DBX::formatTime("p.$update_date",'updated_at');
        $query = DB::table('positions as p')
            ->join('departments as d', 'd.id', '=', 'p.department_id')
            ->join('job_levels as job','job.id','=','p.job_level_id')
            ->join('staff_groups as sg','sg.id','=','p.staff_group_id')
            ->where('p.inactive',0)
            ->whereRaw($str_search)
            ->selectRaw('p.id, p.title,p.staff_group_id,sg.name as staff_group,p.department_id,p.job_level_id,job.name as level,p.salary,p.currency_code, d.name as department,'.$col_update_date.',p.update_user')->orderByRaw('job.rank ASC, d.name ASC');
            if ($search_department) {
                $query->where('p.department_id', $search_department);
            }
        $clone_query = clone $query;
        $count = $clone_query->count('p.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    static function isDuplidateName($title, $id){
        $q = DB::table('position')->where('title',$title)->selectRaw('id');
        if($id > 0) $q->where('id','<>',$id);
        if($q->first()) return true;
        return false;
    }

    function getDetails($id,$ss){
        $branch_id = $ss->branch_id;

        $rows = DB::table('positions as p')
            ->join('departments as d', 'd.id', '=', 'p.department_id')
            ->join('job_levels as job','job.id','=','p.job_level_id')
            ->join('staff_groups as sg','sg.id','=','p.staff_group_id')
            ->selectRaw('p.id, p.title,p.job_level_id,p.staff_group_id, p.department_id,p.salary,p.currency_code, d.name as department,job.name as level,sg.name as staff_group')
            ->where('p.inactive',0)
            ->where('p.id',$id)
            ->first();
        return $rows;
    }

    static function getProps($id, $cols){
         return DB::table('positions')->where('id',$id)->selectRaw($cols)->first();
    }

    function deletePosition($id = null)
    {
        $id = $id ?? $this->id;
        $d = self::getProps($id,'title');
        if(!$d) return DV::error('Position ID does not exist');
        $cnt = DBX::count_fk_items($id,self::$fk_tables,'employees');
        if($cnt > 0) return DV::error('Cannot delete this position because it is already in use');
        $delete = DB::table('positions')->where('id', $id)->update(['inactive'=>1]);
        return DV::depends($delete,null,'Failed to delete position');
    }

    function getFormOptions($id, $ss)
    {
        $position = null;
        if ($id) {
            $position = self::getDetails($id, $ss);
        }
        return (object) [

            // 'status' => DB::table('dep_status')->selectRaw('id,name')->get(),
            'currency_codes' => VSMoney::options_currency($ss),
            'departments' => DB::table('departments as d')->where('d.inactive',0)->selectRaw('id,name')->get(),
            'job_levels' => DB::table('job_levels as job')->selectRaw('id,name as level')->get(),
            'staff_groups' => DB::table('staff_groups')->selectRaw('id,name')->get(),
            'positions' => $position,
        ];

    }

}
