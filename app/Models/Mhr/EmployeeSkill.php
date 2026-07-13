<?php

namespace App\Models\Mhr;

use Illuminate\Support\Facades\DB;
use Vsd\Database\DBX;
use Vsd\Response\DV;
use Vsd\Vsloquent\VSModel;

class EmployeeSkill extends VSModel
{
    protected $table = 'emp_skills';
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    protected static function baseQuery()
    {
        return DB::table('emp_skills as es')
            ->join('skills as s', 's.id', '=', 'es.skill_id');
    }

    public static function getListByEmployee($emp_id, $ss)
    {
        if (!$emp_id || !is_numeric($emp_id)) {
            return [];
        }

        return self::baseQuery()
            ->where('es.emp_id', (int) $emp_id)
            ->orderBy('es.id')
            ->selectRaw('es.id, es.emp_id, es.skill_id, es.rate, s.title AS skill_name, s.description')
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
            'skill_id' => '1|number|exists=skills.id|text=skill_name_required',
            'rate' => '1|number|text=rate_required',
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

        $duplicateQuery = DB::table('emp_skills')
            ->where('emp_id', (int) $inputs['emp_id'])
            ->where('skill_id', (int) $inputs['skill_id']);
        if ($id) {
            $duplicateQuery->where('id', '!=', (int) $id);
        }
        if ($duplicateQuery->exists()) {
            return DV::error('This skill is already assigned to the employee');
        }

        $employee = DB::table('employees')
            ->where('id', $inputs['emp_id'])
            ->selectRaw('id, branch_id')
            ->first();
        if (!$employee) {
            return DV::error('Employee not found');
        }

        $saveInputs = [
            'emp_id' => (int) $inputs['emp_id'],
            'skill_id' => (int) $inputs['skill_id'],
            'rate' => $rate,
            'branch_id' => $employee->branch_id ?? ($ss->branch_id ?? null),
        ];

        $now = getNowTime();
        if (!$id) {
            $saveInputs['created_at'] = $now;
        }
        $saveInputs['updated_at'] = $now;

        $id = DBX::saveData($ss, 'emp_skills', ['id' => $id], $saveInputs, [], 1, false);
        return DV::depends($id, ['emp_skills' => $saveInputs, 'id' => $id], 'Failed to save skill');
    }

    public function delete($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        if (!$id || !is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        $deleted = DB::table('emp_skills')->where('id', $id)->delete();
        return DV::depends($deleted, null, 'Error deleting skill');
    }

    public static function getDetails($id, $ss)
    {
        if (!$id || !is_numeric($id)) {
            return null;
        }

        $row = self::baseQuery()
            ->where('es.id', $id)
            ->selectRaw('es.id, es.emp_id, es.skill_id, es.rate, s.title AS skill_name, s.description')
            ->first();

        if ($row) {
            $row->rate = round((float) $row->rate, 2);
        }

        return $row;
    }

    public static function getFormOptions($id, $emp_id, $ss)
    {
        $skill = null;
        $currentSkillId = null;

        if ($id) {
            $skill = self::getDetails($id, $ss);
            $currentSkillId = $skill->skill_id ?? null;
        }

        $skills = ($emp_id && is_numeric($emp_id))
            ? Skill::getAvailableForEmployee($emp_id, $ss, $currentSkillId)
            : Skill::getOptions($ss);

        return (object) [
            'skills' => $skills,
            'skill' => $skill,
        ];
    }
}
