<?php

namespace App\Models\Mhr;

use Illuminate\Support\Facades\DB;
use Vsd\Database\DBX;
use Vsd\Response\DV;
use Vsd\Vsloquent\VSModel;

class EmployeeEducation extends VSModel
{
    protected $table = 'emp_educations';
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    protected static function baseQuery()
    {
        return DB::table('emp_educations as ee')
            ->join('schools as sc', 'sc.id', '=', 'ee.school_id')
            ->leftJoin('edu_levels as el', 'el.id', '=', 'ee.edu_level_id');
    }

    public static function getListByEmployee($emp_id, $ss)
    {
        if (!$emp_id || !is_numeric($emp_id)) {
            return [];
        }

        return self::baseQuery()
            ->where('ee.emp_id', (int) $emp_id)
            ->orderByDesc('ee.finish_year')
            ->orderByDesc('ee.start_year')
            ->orderBy('ee.id')
            ->selectRaw(
                'ee.id, ee.emp_id, ee.school_id, ee.edu_level_id, ee.period,
                ee.start_year, ee.finish_year, ee.finish_year as end_year,
                ee.major, ee.diploma,
                sc.name as school, sc.name as school_name,
                el.name as edu_level, el.name as degree',
            )
            ->get()
            ->values()
            ->all();
    }

    public function upsert($arr = [], $id = null, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $id = $id ?? $this->id;

        if (!isset($arr['finish_year']) && isset($arr['end_year'])) {
            $arr['finish_year'] = $arr['end_year'];
        }

        $v_rule = [
            'emp_id' => '1|number|exists=employees.id',
            'school_id' => '1|number|exists=schools.id|text=school_name_required',
            'edu_level_id' => '0|number|exists=edu_levels.id',
            'period' => '0|string|0-50',
            'start_year' => '0|number',
            'finish_year' => '0|number',
            'major' => '0|string|0-150',
            'diploma' => '0|string|0-150',
        ];

        $res = DBX::validateObject($arr, $v_rule, true, [], $ss->lang, false, null);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $startYear = isset($inputs['start_year']) && $inputs['start_year'] !== ''
            ? (int) $inputs['start_year']
            : null;
        $finishYear = isset($inputs['finish_year']) && $inputs['finish_year'] !== ''
            ? (int) $inputs['finish_year']
            : null;

        if ($startYear && ($startYear < 1950 || $startYear > 2100)) {
            return DV::error('Start year is invalid');
        }
        if ($finishYear && ($finishYear < 1950 || $finishYear > 2100)) {
            return DV::error('End year is invalid');
        }
        if ($startYear && $finishYear && $finishYear < $startYear) {
            return DV::error('End year cannot be before start year');
        }

        $employee = DB::table('employees')
            ->where('id', $inputs['emp_id'])
            ->selectRaw('id, branch_id')
            ->first();
        if (!$employee) {
            return DV::error('Employee not found');
        }

        $saveInputs = [
            'emp_id' => $inputs['emp_id'],
            'school_id' => $inputs['school_id'],
            'edu_level_id' => isset($inputs['edu_level_id']) && $inputs['edu_level_id'] !== ''
                ? $inputs['edu_level_id']
                : null,
            'period' => $inputs['period'] ?? null,
            'start_year' => $startYear,
            'finish_year' => $finishYear,
            'major' => $inputs['major'] ?? null,
            'diploma' => $inputs['diploma'] ?? null,
            'branch_id' => $employee->branch_id ?? ($ss->branch_id ?? null),
        ];

        $now = getNowTime();
        if (!$id) {
            $saveInputs['created_at'] = $now;
        }
        $saveInputs['updated_at'] = $now;

        $id = DBX::saveData($ss, 'emp_educations', ['id' => $id], $saveInputs, [], 1, false);
        return DV::depends($id, ['emp_educations' => $saveInputs, 'id' => $id], 'Failed to save education');
    }

    public function delete($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        if (!$id || !is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        $deleted = DB::table('emp_educations')->where('id', $id)->delete();
        return DV::depends($deleted, null, 'Error deleting education');
    }

    function getDetails($id, $ss)
    {
        $row = self::baseQuery()
            ->where('ee.id', $id)
            ->selectRaw(
                'ee.id, ee.emp_id, ee.school_id, ee.edu_level_id, ee.period,
                ee.start_year, ee.finish_year, ee.finish_year as end_year,
                ee.major, ee.diploma,
                sc.name as school, sc.name as school_name,
                el.name as edu_level, el.name as degree',
            )
            ->first();
        return $row;
    }

    function getFormOptions($id, $ss)
    {
        $education = null;
        if ($id) $education = self::getDetails($id, $ss);
        return (object) [
            'schools' => DB::table('schools')->selectRaw('id,name AS school')->orderBy('name', 'ASC')->get(),
            'edu_levels' => DB::table('edu_levels')->selectRaw('id,name AS edu_level')->orderBy('id', 'ASC')->get(),
            'education_request' => $education,
        ];

    }
}
