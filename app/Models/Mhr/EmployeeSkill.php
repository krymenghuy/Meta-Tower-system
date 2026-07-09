<?php

namespace App\Models\Mhr;

use Illuminate\Support\Facades\DB;
use Vsd\Database\DBX;
use Vsd\Response\DV;
use Vsd\Vsloquent\VSModel;

class EmployeeSkill extends VSModel
{
    protected $table = 'employee_skills';
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public static function getListByEmployee($emp_id, $ss)
    {
        if (!$emp_id || !is_numeric($emp_id)) {
            return [];
        }

        return DB::table('employee_skills as es')
            ->where('es.emp_id', (int) $emp_id)
            ->orderBy('es.id')
            ->selectRaw('es.id, es.emp_id, es.skill_name, es.rate, es.description')
            ->get()
            ->map(function ($row) {
                $row->rate = round((float) $row->rate, 2);
                $row->skill = $row->skill_name;
                return $row;
            })
            ->values()
            ->all();
    }

    public function upsert($arr = [], $id = null, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $id = $id ?? $this->id;

        $v_rule = [
            'emp_id' => '1|number|exists=employees.id',
            'skill_name' => '1|string|1-150|text=skill_name_required',
            'rate' => '1|number|text=rate_required',
            'description' => '0|string|0-250',
        ];

        $res = DBX::validateObject($arr, $v_rule, true, [], $ss->lang, false, null);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $rate = round((float) ($inputs['rate'] ?? 0), 2);
        if ($rate < 0 || $rate > 100) {
            return DV::error('Rate must be between 0 and 100');
        }
        $inputs['rate'] = $rate;

        $employee = DB::table('employees')
            ->where('id', $inputs['emp_id'])
            ->selectRaw('id, branch_id')
            ->first();
        if (!$employee) {
            return DV::error('Employee not found');
        }

        $inputs['branch_id'] = $employee->branch_id ?? ($ss->branch_id ?? null);
        $now = getNowTime();
        if (!$id) {
            $inputs['created_at'] = $now;
        }
        $inputs['updated_at'] = $now;

        $id = DBX::saveData($ss, 'employee_skills', ['id' => $id], $inputs, [], 1, false);
        return DV::depends($id, ['employee_skills' => $inputs, 'id' => $id], 'Failed to save skill');
    }

    public function delete($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        if (!$id || !is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        $deleted = DB::table('employee_skills')->where('id', $id)->delete();
        return DV::depends($deleted, null, 'Error deleting skill');
    }

    public static function getDetails($id, $ss)
    {
        if (!$id || !is_numeric($id)) {
            return null;
        }

        return DB::table('employee_skills as es')
            ->where('es.id', $id)
            ->selectRaw('es.id, es.emp_id, es.skill_name, es.rate, es.description')
            ->first();
    }
}
