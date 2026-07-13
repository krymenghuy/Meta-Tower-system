<?php

namespace App\Models\Mhr;

use Illuminate\Support\Facades\DB;
use Vsd\Database\DBX;
use Vsd\Response\DV;
use Vsd\Vsloquent\VSModel;

class EmployeeEducation extends VSModel
{
    protected $table = 'employee_educations';
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

        return DB::table('employee_educations as ee')
            ->where('ee.emp_id', (int) $emp_id)
            ->orderByDesc('ee.finish_year')
            ->orderByDesc('ee.start_year')
            ->orderBy('ee.id')
            ->selectRaw(
                'ee.id, ee.emp_id, ee.school_name, ee.location, ee.start_year,
                ee.finish_year as end_year, ee.edu_level as degree, ee.major',
            )
            ->get()
            ->map(function ($row) {
                $row->school = $row->school_name;
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
            'school_name' => '1|string|1-200|text=school_name_required',
            'location' => '0|string|0-200',
            'start_year' => '0|number',
            'end_year' => '0|number',
            'degree' => '0|string|0-150',
            'major' => '0|string|0-150',
        ];

        $res = DBX::validateObject($arr, $v_rule, true, [], $ss->lang, false, null);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $startYear = isset($inputs['start_year']) && $inputs['start_year'] !== ''
            ? (int) $inputs['start_year']
            : null;
        $finishYear = isset($inputs['end_year']) && $inputs['end_year'] !== ''
            ? (int) $inputs['end_year']
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

        $inputs['start_year'] = $startYear;
        $inputs['finish_year'] = $finishYear;
        $inputs['edu_level'] = $inputs['degree'] ?? null;
        unset($inputs['end_year'], $inputs['degree']);

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

        $id = DBX::saveData($ss, 'employee_educations', ['id' => $id], $inputs, [], 1, false);
        return DV::depends($id, ['employee_educations' => $inputs, 'id' => $id], 'Failed to save education');
    }

    public function delete($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        if (!$id || !is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        $deleted = DB::table('employee_educations')->where('id', $id)->delete();
        return DV::depends($deleted, null, 'Error deleting education');
    }

    public static function getDetails($id, $ss)
    {
        if (!$id || !is_numeric($id)) {
            return null;
        }

        return DB::table('employee_educations as ee')
            ->where('ee.id', $id)
            ->selectRaw(
                'ee.id, ee.emp_id, ee.school_name, ee.location, ee.start_year,
                ee.finish_year as end_year, ee.edu_level as degree, ee.major',
            )
            ->first();
    }
}
