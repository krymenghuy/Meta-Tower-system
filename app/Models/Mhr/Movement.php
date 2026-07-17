<?php

namespace App\Models\Mhr;

use App\Models\Prm\GeneralSettings;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use DV;
use XBranch;
use Vsd\Money\Models\VSMoney;
use Vsd\Vsloquent\VSModel;

class Movement extends VSModel
{
    protected $userInfo = null;
    protected $table = 'emp_events';

    function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function upsert($arr = [], $id = null, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $id = $id ?? $this->id;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'emp_id' => '1|number|exists=employees.id|text=select_employee',
            'event_id' => '1|number|exists=events.id',
            'event_date' => '1|date|text=event_date_required',
            'remarks' => '0|string|250',
            'impact' => '0|string|0-50',
        ];
        $chars = ['$', '#', '@', '!', '/', '.', '-', '_', '=', '?', "'", ','];
        $res = DBX::validateObject($arr, $v_rule, true, ['remarks' => $chars], $ss->lang, false, null);
        if ($res->error) return DV::error($res->error);

        $inputs = $res->values;
        $d = (object) $inputs;
        $emp_id = $inputs['emp_id'];
        if (!$d->emp_id) return DV::error('Employee ID is missing');

        $employee_info = DB::table('employees as emp')
            ->where('emp.id', $emp_id)
            ->selectRaw('id, status_id, name, code')
            ->first();
        if (!$employee_info) return DV::error('It seems the employee information does not exist');
        if ($employee_info->status_id !== 10) return DV::error('The Employee is not active');

        if (empty($inputs['impact']) && !empty($inputs['event_id'])) {
            $inputs['impact'] = DB::table('events')->where('id', $inputs['event_id'])->value('impact');
        }

        $id = DBX::saveData($ss, 'emp_events', ['id' => $id], $inputs, [], 1, false);
        return DV::depends($id, ['action', 'movement saved'], 'Failed to save Movement Information');
    }

    /** Profile movement: update employee branch / position / salary / work shift */
    public function applyEmployeeChanges($arr = [], $ss = null)
    {
        $ss = $ss ?? $this->userInfo;

        $v_rule = [
            'emp_id' => '1|number|exists=employees.id|text=select_employee',
            'change_branch' => '0|number',
            'change_position' => '0|number',
            'change_salary' => '0|number',
            'change_work_shift' => '0|number',
            'to_branch_id' => '0|number',
            'to_position_id' => '0|number',
            'new_salary' => '0|number',
            'to_work_shift_id' => '0|number',
            'branch_remarks' => '0|string|250',
            'position_remarks' => '0|string|250',
            'salary_remarks' => '0|string|250',
            'work_shift_remarks' => '0|string|250',
        ];
        $chars = ['$', '#', '@', '!', '/', '.', '-', '_', '=', '?', "'", ','];
        $res = DBX::validateObject($arr, $v_rule, true, [
            'branch_remarks' => $chars,
            'position_remarks' => $chars,
            'salary_remarks' => $chars,
            'work_shift_remarks' => $chars,
        ], $ss->lang, false, null);
        if ($res->error) return DV::error($res->error);

        $inputs = $res->values;
        $d = (object) $inputs;
        $emp_id = $inputs['emp_id'];
        if (!$d->emp_id) return DV::error('Employee ID is missing');

        $employee_info = DB::table('employees as emp')
            ->where('emp.id', $emp_id)
            ->selectRaw('id, status_id, name, code, branch_id, position_id, salary, work_shift_id')
            ->first();
        if (!$employee_info) return DV::error('It seems the employee information does not exist');
        if ($employee_info->status_id !== 10) return DV::error('The Employee is not active');

        $change_branch = !empty($d->change_branch);
        $change_position = !empty($d->change_position);
        $change_salary = !empty($d->change_salary);
        $change_work_shift = !empty($d->change_work_shift);

        if (!$change_branch && !$change_position && !$change_salary && !$change_work_shift) {
            return DV::error('Please select at least one change');
        }

        $updates = [];

        if ($change_branch) {
            if (empty($d->to_branch_id)) return DV::error('To Branch is required');
            $updates['branch_id'] = $d->to_branch_id;
        }

        if ($change_position) {
            if (empty($d->to_position_id)) return DV::error('To Position is required');
            $updates['position_id'] = $d->to_position_id;
        }

        if ($change_salary) {
            if ($d->new_salary === '' || $d->new_salary === null) return DV::error('New Salary is required');
            $updates['salary'] = $d->new_salary;
        }

        if ($change_work_shift) {
            if (empty($d->to_work_shift_id)) return DV::error('To Work Shift is required');
            $updates['work_shift_id'] = $d->to_work_shift_id;
        }

        if (empty($updates)) {
            return DV::error('No changes to apply');
        }

        $id = DBX::saveData($ss, 'employees', ['id' => $d->emp_id], $updates, [], 1, false);

        $event_date = date('Y-m-d');
        $events = DB::table('events')->select('id', 'name', 'impact')->get()->keyBy('name');

        if ($change_branch && isset($events['Change Branch'])) {
            $fromBranch = DB::table('um_branches')->where('id', $employee_info->branch_id)->value('name') ?: '—';
            $toBranch = DB::table('um_branches')->where('id', $d->to_branch_id)->value('name') ?: '—';
            $remarks = $fromBranch . ' → ' . $toBranch;
            $branch_remarks = trim($d->branch_remarks ?? '');
            if ($branch_remarks !== '') {
                $remarks = $remarks . ' | ' . $branch_remarks;
            }
            $this->upsert([
                'emp_id' => $d->emp_id,
                'event_id' => $events['Change Branch']->id,
                'event_date' => $event_date,
                'remarks' => mb_substr($remarks, 0, 250),
                'impact' => $events['Change Branch']->impact ?? null,
            ], null, $ss);
        }

        if ($change_position && isset($events['Change Position'])) {
            $fromPosition = DB::table('positions')->where('id', $employee_info->position_id)->value('name') ?: '—';
            $toPosition = DB::table('positions')->where('id', $d->to_position_id)->value('name') ?: '—';
            $remarks = $fromPosition . ' → ' . $toPosition;
            $position_remarks = trim($d->position_remarks ?? '');
            if ($position_remarks !== '') {
                $remarks = $remarks . ' | ' . $position_remarks;
            }
            $this->upsert([
                'emp_id' => $d->emp_id,
                'event_id' => $events['Change Position']->id,
                'event_date' => $event_date,
                'remarks' => mb_substr($remarks, 0, 250),
                'impact' => $events['Change Position']->impact ?? null,
            ], null, $ss);
        }

        if ($change_salary && isset($events['Change Salary'])) {
            $fromSalary = '—';
            if ($employee_info->salary !== null && $employee_info->salary !== '') {
                $fromSalary = VSMoney::format($employee_info->salary);
            }
            $toSalary = VSMoney::format($d->new_salary ?? 0);
            $remarks = $fromSalary . ' → ' . $toSalary;
            $salary_remarks = trim($d->salary_remarks ?? '');
            if ($salary_remarks !== '') {
                $remarks = $remarks . ' | ' . $salary_remarks;
            }
            $this->upsert([
                'emp_id' => $d->emp_id,
                'event_id' => $events['Change Salary']->id,
                'event_date' => $event_date,
                'remarks' => mb_substr($remarks, 0, 250),
                'impact' => $events['Change Salary']->impact ?? null,
            ], null, $ss);
        }

        if ($change_work_shift && isset($events['Change Work Shift'])) {
            $fromShift = DB::table('work_shifts')->where('id', $employee_info->work_shift_id)->value('name') ?: '—';
            $toShift = DB::table('work_shifts')->where('id', $d->to_work_shift_id)->value('name') ?: '—';
            $remarks = $fromShift . ' → ' . $toShift;
            $work_shift_remarks = trim($d->work_shift_remarks ?? '');
            if ($work_shift_remarks !== '') {
                $remarks = $remarks . ' | ' . $work_shift_remarks;
            }
            $this->upsert([
                'emp_id' => $d->emp_id,
                'event_id' => $events['Change Work Shift']->id,
                'event_date' => $event_date,
                'remarks' => mb_substr($remarks, 0, 250),
                'impact' => $events['Change Work Shift']->impact ?? null,
            ], null, $ss);
        }

        return DV::depends($id, ['action', 'movement saved'], 'Failed to save Movement Information');
    }

    function getEventListPaginate($arr, $ss)
    {
        $d = (object) $arr;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;

        if (!is_numeric($current_page)) {
            $current_page = 1;
        }

        $search_value = $d->search_value ?? null;
        $event_id = $d->event_id ?? null;
        $employee_id = $d->emp_id ?? null;

        $str_search = '1=1';

        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = '(emp.name LIKE \'%' . $search_value . '%\' OR emp.code LIKE \'%' . $search_value . '%\')';
        }

        $skip_rows = ($current_page - 1) * $per_page;
        if ($search_value) {
            $skip_rows = 0;
        }

        $col_event_date = DBX::formatDate('ee.event_date', 'event_date');
        $col_updated_at = DBX::formatTime('ee.updated_at', 'updated_at');

        $query = DB::table('emp_events as ee')
            ->join('employees as emp', 'emp.id', '=', 'ee.emp_id')
            ->join('positions as p', 'p.id', '=', 'emp.position_id')
            ->join('events as e', 'e.id', '=', 'ee.event_id')
            ->where('ee.branch_id', $ss->branch_id)
            ->whereRaw($str_search)
            ->selectRaw('
                ee.id,
                ee.emp_id,
                ee.event_id,
                COALESCE(NULLIF(ee.impact, ""), e.impact) as impact,
                e.name as event,
                ' . $col_event_date . ',
                ee.remarks,
                ee.update_user,
                ' . $col_updated_at . ',
                emp.name as emp_name,
                p.name as position,
                emp.photo_file_name as emp_photo
            ')
            ->orderBy('ee.id', 'DESC');

        if ($event_id) {
            $query->where('ee.event_id', $event_id);
        }
        if ($employee_id) {
            $query->where('ee.emp_id', $employee_id);
        }

        $clone_query = clone $query;
        $count = $clone_query->count('ee.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            $row->image_url = '';
            if (isset($row->emp_id) && $row->emp_photo) {
                $row->image_url = Employee::profilePicture($row->emp_id);
            }
            unset($row->emp_photo);
            $row = setOfficialDates($row, ['event_date'], ['updated_at'], ['']);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getDetails($id, $ss = null)
    {
        $col_event_date = DBX::formatDate('ee.event_date', 'event_date');
        $col_update_date = DBX::formatDate('ee.updated_at', 'update_date');

        $row = DB::table('emp_events as ee')
            ->join('employees as emp', 'emp.id', '=', 'ee.emp_id')
            ->join('positions as p', 'p.id', '=', 'emp.position_id')
            ->join('events as e', 'e.id', '=', 'ee.event_id')
            ->where('ee.branch_id', $ss->branch_id)
            ->where('ee.id', $id)
            ->selectRaw('
                ee.id,
                ee.emp_id,
                ee.event_id,
                e.name as event,
                COALESCE(NULLIF(ee.impact, ""), e.impact) as impact,
                ' . $col_event_date . ',
                ee.remarks,
                emp.name as emp_name,
                p.name as position,
                ee.update_user,
                ' . $col_update_date . '
            ')
            ->first();

        return $row;
    }

    function deleteEmpEvent($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $deleted = DB::table('emp_events')
            ->where('id', $id)
            ->where('branch_id', $ss->branch_id)
            ->delete();

        return DV::depends($deleted, null, 'Error deleting employee event');
    }

    function getFormOptions($id, $ss, $emp_id = null)
    {
        $emp_event = null;
        if ($id) $emp_event = $this->getDetails($id, $ss);
        if ($id && $emp_event) {
            $emp_id = $emp_id ?: ($emp_event->emp_id ?? null);
        }

        $employee = null;
        if ($emp_id) {
            $employee = Employee::getDetails($emp_id, $ss);
            if (!$employee) {
                $employee = DB::table('employees as emp')
                    ->leftJoin('positions as p', 'p.id', '=', 'emp.position_id')
                    ->leftJoin('work_shifts as ws', 'ws.id', '=', 'emp.work_shift_id')
                    ->leftJoin('um_branches as b', 'b.id', '=', 'emp.branch_id')
                    ->where('emp.id', $emp_id)
                    ->selectRaw('
                        emp.id,
                        emp.branch_id,
                        b.name as branch_name,
                        emp.salary,
                        p.name as position,
                        p.name as position_title,
                        ws.name as work_shift
                    ')
                    ->first();
            } elseif (empty($employee->branch_name) && !empty($employee->branch_id)) {
                $employee->branch_name = DB::table('um_branches')
                    ->where('id', $employee->branch_id)
                    ->value('name');
            }
        }

        $branches = XBranch::query()->alias('b')->whereRaw(DBX::whereBinary('subs_id', $ss->subs_id))->selectRaw('id,name')->get();
        if ($branches->isEmpty()) {
            $branches = GeneralSettings::options_branch($ss);
        }

        return (object) [
            'employees' => GeneralSettings::options_employee(10, $ss),
            'events' => DB::table('events')->selectRaw('id, name')->get(),
            'branches' => $branches,
            'positions' => GeneralSettings::options_position($ss),
            'work_shifts' => GeneralSettings::options_work_shift($ss),
            'emp_event' => $emp_event,
            'employee' => $employee,
        ];
    }
}
