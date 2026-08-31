<?php

namespace App\Models\Mhr;

use DV;
use DBX;
use App\Models\Prm\GeneralSettings;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use Vsd\Money\Models\VSMoney;
use Vsd\Vsloquent\VSModel;
use Illuminate\Support\Facades\Schema;

class Position extends VSModel
{
    protected $table = 'positions';
    protected $userInfo = null;
    protected static $fk_tables = [
        'employees' => 'position_id'
    ];

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function upsert($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'name' => '1|string|0-150|text=name_required::@key;@max;@value',
            'name_kh' => '0|string|0-150|text=name_required::@key;@max;@value',
            'code' => '0|string|0-50|text=enter_shortcut',
            'job_level_id' => '1|number|exists=job_levels.id|text=select_job_level',
            'department_id' => '1|number|exists=departments.id|text=select_department',
            'salary' => '1|number|text=enter_salary',
            'currency_code' => '1|choice|KHR,USD|text=select_currency_code|default=' . VSMoney::$base_currency,
            'staff_group_id' => '0|number|exists=staff_groups.id|text=select_staff_group',
            'description' => '0|string|0-300',
        ];
        $chars = ['&', '$', '#', '@', '!', '.', '-', '(', ')', ' ', ','];
        $res = DBX::validateObject($arr, $v_rule, true, ['name' => $chars, 'name_kh' => $chars, 'code' => $chars, 'description' => $chars], $ss->lang, false, null);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;

        $err = self::checkDuplicate($inputs['name'], $inputs['job_level_id'], $id, $branch_id);
        if ($err) {
            return DV::error($err);
        }

        $id = DBX::saveData($ss, 'positions', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['positions' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving position');
    }

    static function checkDuplicate($name, $job_level_id, $id, $branch_id = null)
    {
        $query = DB::table('positions as p')
            ->where('p.name', $name)
            ->where('p.job_level_id', $job_level_id)
            ->where('p.inactive', 0);

        if ($id) {
            $query->where('p.id', '<>', $id);
        }

        $test = $query->select('id')->first();
        if ($test) {
            return 'position_exist::' . $name;
        }
        return null;
    }

    public function getList($arr, $ss)
    {
        $d = (object) $arr;

        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $department_id = $d->department_id ?? null;
        $str_search = '1=1';
        $str_moreWhere = "2=2";

        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "(p.name LIKE '%" . $search_value . "%' OR p.name_kh = '" . $search_value . "')";
        }
        if ($department_id) {
            $str_moreWhere .= ' AND p.department_id = ' . $department_id;
        }
        $query = DB::table('positions as p')
            ->join('departments as d', 'd.id', '=', 'p.department_id')
            ->join('job_levels as job', 'job.id', '=', 'p.job_level_id')
            ->leftJoin('staff_groups as sg', 'sg.id', '=', 'p.staff_group_id')
            ->where('p.inactive', 0)
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw('p.id, p.name, p.name_kh, p.code, p.description, p.staff_group_id, sg.name as staff_group, p.department_id, p.job_level_id, job.name as level, p.salary, p.currency_code, d.name as department, p.updated_at, p.update_user')
            ->orderByRaw('job.rank ASC, d.name ASC');
            // ->orderByRaw('p.id DESC');
       
        $clone_query = clone $query;
        $count = $clone_query->count('p.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach($rows as $row){
            setOfficialDates($row,[''],['updated_at'],['']);
        }
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public function getDetails($id, $ss)
    {
        $branch_id = $ss->branch_id;
        $rows = DB::table('positions as p')
            ->leftJoin('departments as d', 'd.id', '=', 'p.department_id')
            ->leftJoin('job_levels as job', 'job.id', '=', 'p.job_level_id')
            ->leftJoin('staff_groups as sg', 'sg.id', '=', 'p.staff_group_id')
            ->selectRaw('p.id, p.name, p.name_kh,p.code, p.description, p.job_level_id, p.staff_group_id, p.department_id, p.salary, p.currency_code, d.name as department, job.name as level, sg.name as staff_group')
            ->where('p.inactive', 0)
            ->where('p.id', $id)
            ->first();
        return $rows;
    }

    static function getProps($id, $cols)
    {
        return DB::table('positions')->where('id', $id)->selectRaw($cols)->first();
    }

    public function deletePosition($id = null)
    {
        $id = $id ?? $this->id;
        $d = self::getProps($id, 'name');
        if (!$d) return DV::error('position_not_found');
        $cnt = 0;
        foreach (self::$fk_tables as $table => $fk_col) {
            $cnt += DB::table($table)->where($fk_col, $id)->count();
        }
        if ($cnt > 0) return DV::error('position_has_employees');
        $delete = DB::table('positions')->where('id', $id)->update(['inactive' => 1]);
        return DV::depends($delete, null, 'delete_failed');
    }

    public function getFormOptions($id, $ss)
    {
        $position = null;
        if ($id) {
            $position = self::getDetails($id, $ss);
        }
        return (object) [

            // 'status' => DB::table('dep_status')->selectRaw('id,name')->get(),
            'currency_codes' => VSMoney::options_currency($ss),
            'departments' => DB::table('departments as d')->where('d.inactive', 0)->selectRaw('id,name')->get(),
            'job_levels' => DB::table('job_levels as job')->selectRaw('id,name as level')->get(),
            'staff_groups' => DB::table('staff_groups')->selectRaw('id,name')->get(),
            'positions' => $position,
        ];
    }
}
