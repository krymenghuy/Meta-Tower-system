<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class EmployeeSkill
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function save($arr, $ss = null) {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'id' => '0|identity=1',
            'emp_id' => '1|number',
            'skill_id' => '1|number',
            'rate' => '1|number',
        ];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;

        $id = saveData($ss, 'emp_skills', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['sender' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving data');
    }

    function listpaginate($arr, $ss)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;

        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $emp_id = $d->emp_id ?? null;

        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $search_id = $d->id ?? null;

        $str_search = '1=1';

        $query = DB::table('emp_skills as es')
            ->join('skills as s', 's.id', '=', 'es.skill_id')
            ->join('employees as e', 'e.id', '=', 'es.emp_id')
            ->selectRaw('es.id, es.emp_id, e.name as emp_name, s.title as skill, es.rate')
            ->where('es.branch_id', $ss->branch_id)
            ->where('es.emp_id', $emp_id);


        if ($search_id) {
            $query->where('es.id', $search_id);
        }
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->where(function ($query) use ($search_value) {
                $query->where('e.name', 'like', '%' . $search_value . '%');
                $query->orWhere('s.name', 'like', '%' . $search_value . '%');
            });
        }

        $query->skip($skip_rows)->take($per_page);
        $count_query = clone $query;
        $count = $count_query->count('es.id');
        $rows = $query->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getDetails($id, $ss) {
        $query = DB::table('emp_skills as es')
            ->join('skills as s', 's.id', '=', 'es.skill_id')
            ->join('employees as e', 'e.id', '=', 'es.emp_id')
            ->selectRaw('es.id, es.emp_id, e.name as emp_name, s.title as skill, es.rate')
            ->where('es.branch_id', $ss->branch_id)
            ->where('es.id', $id)
            ->first();
        return $query;
    }

    function delete($id, $ss) {
        $branch_id = $ss->branch_id;
        $query = DB::table('emp_skills')
            ->where('id', $id)
            ->delete();
        return DV::depends($query, ['action', 'deleted']);
    }

    function getFormOptions($id, $ss) {
        $emp_skill = null;
        if ($id) {
            $emp_skill = self::getDetails($id, $ss);
        }
        return (object) [
            'employees' => GeneralSettings::options_employee(10, $ss),
            'skills' => GeneralSettings::options_skill($ss),
            'emp_skill' => $emp_skill,
        ];
    }

}
