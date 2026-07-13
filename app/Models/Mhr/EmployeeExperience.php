<?php

namespace App\Models\Mhr;

use Illuminate\Support\Facades\DB;
use Vsd\Database\DBX;
use Vsd\Response\DV;
use Vsd\Vsloquent\VSModel;

class EmployeeExperience extends VSModel
{
    protected $table = 'employee_experiences';
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

        $colStart = DBX::formatDate('ex.start_date', 'start_date');
        $colEnd = DBX::formatDate('ex.end_date', 'end_date');

        return DB::table('employee_experiences as ex')
            ->leftJoin('organizations as o', 'o.id', '=', 'ex.organization_id')
            ->where('ex.emp_id', (int) $emp_id)
            ->orderByDesc('ex.start_date')
            ->orderByDesc('ex.id')
            ->selectRaw(
                "ex.id, ex.emp_id, ex.organization_id, ex.position, ex.period,
                ex.description, {$colStart}, {$colEnd}, o.name as organization",
            )
            ->get()
            ->map(function ($row) {
                $row->period_display = self::formatPeriodDisplay($row);
                $row->period = $row->period_display;
                return $row;
            })
            ->values()
            ->all();
    }

    public static function formatPeriodDisplay($row)
    {
        $start = $row->start_date ?? null;
        $end = $row->end_date ?? null;
        if ($start && $end) {
            return $start . ' - ' . $end;
        }
        if ($start) {
            return $start;
        }
        if ($end) {
            return $end;
        }

        return $row->period ?? '';
    }

    public function upsert($arr = [], $id = null, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $id = $id ?? $this->id;

        $v_rule = [
            'emp_id' => '1|number|exists=employees.id',
            'position' => '1|string|1-200|text=position_required',
            'organization_id' => '0|number',
            'start_date' => '0|date',
            'end_date' => '0|date',
            'period' => '0|string|0-150',
            'description' => '0|string|0-500',
        ];

        $res = DBX::validateObject($arr, $v_rule, true, [], $ss->lang, false, null);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $startDate = !empty($inputs['start_date']) ? convertDate($inputs['start_date']) : null;
        $endDate = !empty($inputs['end_date']) ? convertDate($inputs['end_date']) : null;
        $period = isset($inputs['period']) ? trim((string) $inputs['period']) : '';
        $period = $period !== '' ? $period : null;

        $hasDates = $startDate && $endDate;
        $hasStartOnly = $startDate && !$endDate;
        $hasEndOnly = !$startDate && $endDate;

        if ($hasStartOnly || $hasEndOnly) {
            return DV::error('Start date and end date are both required when using dates');
        }
        if (!$hasDates && !$period) {
            return DV::error('Please provide start/end dates or a period');
        }
        if ($hasDates && strtotime($startDate) > strtotime($endDate)) {
            return DV::error('End date cannot be before start date');
        }

        $inputs['start_date'] = $hasDates ? $startDate : null;
        $inputs['end_date'] = $hasDates ? $endDate : null;
        $inputs['period'] = $hasDates ? null : $period;
        $inputs['organization_id'] = !empty($inputs['organization_id'])
            ? $inputs['organization_id']
            : null;

        if ($inputs['organization_id']) {
            $orgExists = DB::table('organizations')->where('id', $inputs['organization_id'])->exists();
            if (!$orgExists) {
                return DV::error('Organization not found');
            }
        }

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

        $id = DBX::saveData($ss, 'employee_experiences', ['id' => $id], $inputs, [], 1, false);
        return DV::depends($id, ['employee_experiences' => $inputs, 'id' => $id], 'Failed to save experience');
    }

    public function delete($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        if (!$id || !is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        $deleted = DB::table('employee_experiences')->where('id', $id)->delete();
        return DV::depends($deleted, null, 'Error deleting experience');
    }

    static function getDetails($id, $ss)
    {
        $branch_id = $ss->branch_id;
        $colStart = DBX::formatDate('ex.start_date', 'start_date');
        $colEnd = DBX::formatDate('ex.end_date', 'end_date');
        $row = DB::table('employee_experiences as ex')
            ->leftJoin('organizations as o', 'o.id', '=', 'ex.organization_id')
            ->where('ex.id', $id)
            ->selectRaw(
                "ex.id, ex.emp_id, ex.organization_id, ex.position, ex.period,
                ex.description, {$colStart}, {$colEnd}, o.name as organization",
            )
            ->first();
        if ($row) {
            $row->period_display = self::formatPeriodDisplay($row);
        }
        return $row;
    }
    static function getFormOptions($id, $ss)
    {
        $employee_experience = null;
        if ($id) {
            $employee_experience = self::getDetails($id, $ss);
        }
        return (object) [
            'organizations' => DB::table('organizations')->selectRaw('id,name AS organization')->orderBy('id', 'ASC')->get(),
            'employee_experiences' => $employee_experience,
        ];
    }
}
