<?php

namespace App\Models\Mhr;

use App\Models\Prm\GeneralSettings;
use Illuminate\Support\Facades\DB;
use Vsd\Database\DBX;
use Vsd\Response\DV;
use Vsd\Vsloquent\VSModel;

class EmployeeExperience extends VSModel
{
    protected $table = 'emp_experiences';
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    protected static function baseQuery()
    {
        return DB::table('emp_experiences as ex')
            ->join('organizations as o', 'o.id', '=', 'ex.organization_id')
            ->leftJoin('positions as p', 'p.id', '=', 'ex.position_id');
    }

    public static function getListByEmployee($emp_id, $ss)
    {
        if (!$emp_id || !is_numeric($emp_id)) {
            return [];
        }

        $colStart = DBX::formatDate('ex.start_date', 'start_date');
        $colEnd = DBX::formatDate('ex.end_date', 'end_date');

        return self::baseQuery()
            ->where('ex.emp_id', (int) $emp_id)
            ->orderByDesc('ex.start_date')
            ->orderByDesc('ex.id')
            ->selectRaw(
                "ex.id, ex.emp_id, ex.organization_id, ex.position_id, ex.period,
                ex.description, {$colStart}, {$colEnd},
                o.name as organization, p.name as position, p.name as position_name",
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
            'organization_id' => '1|number|exists=organizations.id|text=organization_required',
            'position_id' => '0|number|exists=positions.id',
            'start_date' => '0|date',
            'end_date' => '0|date',
            'period' => '0|string|0-100',
            'description' => '0|string|0-300',
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

        $employee = DB::table('employees')
            ->where('id', $inputs['emp_id'])
            ->selectRaw('id, branch_id')
            ->first();
        if (!$employee) {
            return DV::error('Employee not found');
        }

        $saveInputs = [
            'emp_id' => (int) $inputs['emp_id'],
            'organization_id' => (int) $inputs['organization_id'],
            'position_id' => isset($inputs['position_id']) && $inputs['position_id'] !== ''
                ? (int) $inputs['position_id']
                : null,
            'start_date' => $hasDates ? $startDate : null,
            'end_date' => $hasDates ? $endDate : null,
            'period' => $hasDates ? null : $period,
            'description' => $inputs['description'] ?? null,
            'branch_id' => $employee->branch_id ?? ($ss->branch_id ?? null),
        ];

        $now = getNowTime();
        if (!$id) {
            $saveInputs['created_at'] = $now;
        }
        $saveInputs['updated_at'] = $now;

        $id = DBX::saveData($ss, 'emp_experiences', ['id' => $id], $saveInputs, [], 1, false);
        return DV::depends($id, ['emp_experiences' => $saveInputs, 'id' => $id], 'Failed to save experience');
    }

    public function delete($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        if (!$id || !is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        $deleted = DB::table('emp_experiences')->where('id', $id)->delete();
        return DV::depends($deleted, null, 'Error deleting experience');
    }

    static function getDetails($id, $ss)
    {
        $colStart = DBX::formatDate('ex.start_date', 'start_date');
        $colEnd = DBX::formatDate('ex.end_date', 'end_date');
        $row = self::baseQuery()
            ->where('ex.id', $id)
            ->selectRaw(
                "ex.id, ex.emp_id, ex.organization_id, ex.position_id, ex.period,
                ex.description, {$colStart}, {$colEnd},
                o.name as organization, p.name as position, p.name as position_name",
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
            'organizations' => DB::table('organizations')
                ->selectRaw('id,name AS organization')
                ->orderBy('name', 'ASC')
                ->get(),
            'positions' => GeneralSettings::options_position($ss),
            'employee_experiences' => $employee_experience,
        ];

    }
}
