<?php

namespace App\Models\Mhr;

use DBX;
use DV;
use Vsd\Vsloquent\VSModel;

use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\Prm\GeneralSettings;
class Movement extends VSModel
{
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function upsert($arr = [], $id = null,$ss = null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'emp_id' => '1|number|exist=employees.id',
            'event_id' => '1|number|exist=events.id',
            'event_date' => '1|date',
            'remarks' => '0|string|250',
            'impact' => '0|string|0-50',
        ];

        $res = DBX::validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        if (empty($inputs['impact']) && !empty($inputs['event_id'])) {
            $inputs['impact'] = DB::table('events')->where('id', $inputs['event_id'])->value('impact');
        }

        $id = DBX::saveData($ss, 'emp_events', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['sender' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving data');
    }

    /** Profile movement: update employee branch / position / salary / work shift */
    public function applyEmployeeChanges($arr = [], $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $d = (object) $arr;

        if (empty($d->emp_id) || !is_numeric($d->emp_id)) {
            return DV::error('Employee is required');
        }

        $emp = DB::table('employees')->where('id', $d->emp_id)->first();
        if (!$emp) {
            return DV::error('Employee not found');
        }

        // "0" / 0 must stay false — !empty(0) is false but be explicit for "1"/1/true/"on"
        $isOn = function ($v) {
            return $v === true || $v === 1 || $v === '1' || $v === 'on' || $v === 'true';
        };

        $change_branch = $isOn($d->change_branch ?? null);
        $change_position = $isOn($d->change_position ?? null);
        $change_salary = $isOn($d->change_salary ?? null);
        $change_work_shift = $isOn($d->change_work_shift ?? null);

        if (!$change_branch && !$change_position && !$change_salary && !$change_work_shift) {
            return DV::error('Please select at least one change');
        }

        $updates = [];

        if ($change_branch) {
            if (empty($d->to_branch_id) || !is_numeric($d->to_branch_id)) {
                return DV::error('To Branch is required');
            }
            $updates['branch_id'] =  $d->to_branch_id;
        }

        if ($change_position) {
            if (empty($d->to_position_id) || !is_numeric($d->to_position_id)) {
                return DV::error('To Position is required');
            }
            $updates['position_id'] = $d->to_position_id;
        }

        if ($change_salary) {
            if ($d->new_salary === '' || $d->new_salary === null || !is_numeric($d->new_salary)) {
                return DV::error('New Salary is required');
            }
            $updates['salary'] = $d->new_salary;
        }

        if ($change_work_shift) {
            if (empty($d->to_work_shift_id) || !is_numeric($d->to_work_shift_id)) {
                return DV::error('To Work Shift is required');
            }
            $updates['work_shift_id'] =  $d->to_work_shift_id;
        }

        if (empty($updates)) {
            return DV::error('No changes to apply');
        }

        $id = DBX::saveData($ss, 'employees', ['id' => $d->emp_id], $updates, [], 1, false);
        if ($id > 0) {
            $event_date = date('Y-m-d');
            $events = DB::table('events')->select('id', 'name', 'impact')->get()->keyBy('name');

            if ($change_branch && isset($events['Change Branch'])) {
                $this->upsert([
                    'emp_id' => $d->emp_id,
                    'event_id' => $events['Change Branch']->id,
                    'event_date' => $event_date,
                    'remarks' => $d->branch_remarks ?? null,
                    'impact' => $events['Change Branch']->impact ?? null,
                ], null, $ss);
            }

            if ($change_position && isset($events['Change Position'])) {
                $this->upsert([
                    'emp_id' => $d->emp_id,
                    'event_id' => $events['Change Position']->id,
                    'event_date' => $event_date,
                    'remarks' => $d->position_remarks ?? null,
                    'impact' => $events['Change Position']->impact ?? null,
                ], null, $ss);
            }

            if ($change_salary && isset($events['Change Salary'])) {
                $this->upsert([
                    'emp_id' => $d->emp_id,
                    'event_id' => $events['Change Salary']->id,
                    'event_date' => $event_date,
                    'remarks' => $d->salary_remarks ?? null,
                    'impact' => $events['Change Salary']->impact ?? null,
                ], null, $ss);
            }

            if ($change_work_shift && isset($events['Change Work Shift'])) {
                $this->upsert([
                    'emp_id' => $d->emp_id,
                    'event_id' => $events['Change Work Shift']->id,
                    'event_date' => $event_date,
                    'remarks' => $d->work_shift_remarks ?? null,
                    'impact' => $events['Change Work Shift']->impact ?? null,
                ], null, $ss);
            }

            return DV::depends(1, ['updates' => $updates, 'id' => $id]);
        }

        return DV::error('Error saving movement');
    }

    public function getEventListPaginate($arr, $ss)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;

        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }

        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $event = $d->event_id ?? null;
        $employee = $d->emp_id ?? null;
        $str_where  = '2=2';
        $str_search = '1=1';
        if ($search_value) {
            $skip_rows=0;
            $search_value = escape_like_str($search_value);
            $str_search = "emp.name like '%" . $search_value . "'";
        }
        if($event){
            $str_where = 'ee.event_id =\''.$event.'\'';
        }
        if($employee){
            $str_where .= ' AND ee.emp_id =\'' . $employee . '\'';

        }
        $col_event_date = DBX::formatDate('ee.event_date', 'event_date');
        $col_updated_at = DBX::formatTime('ee.updated_at', 'updated_at');
        $query = DB::table('emp_events as ee')
        ->join('employees as emp', 'emp.id', '=', 'ee.emp_id')
        ->join('positions as p', 'p.id', '=', 'emp.position_id')
        ->join('events as e', 'e.id', '=', 'ee.event_id')
        ->where('ee.branch_id', $branch_id)
        ->whereRaw($str_search)
        ->whereRaw($str_where)
            ->selectRaw('
        ee.id,
        ee.emp_id,
        ee.event_id,
        COALESCE(NULLIF(ee.impact, ""), e.impact) as impact,
        e.name as event,
        '.$col_event_date.',
        ee.remarks,
        ee.update_user,
        '.$col_updated_at.',
        emp.name as emp_name,
        p.name as position,
        emp.photo_file_name as emp_photo
    ')        ->orderBy('ee.id','DESC');
        $clone_query = clone $query;

        $count = $clone_query->count('ee.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            $row->image_url = '';
            if ($row->emp_photo) {
                $row->image_url = Employee::profilePicture($row->emp_id);
            }
            unset($row->emp_photo);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public function getDetails($id, $ss) {
        $query = DB::table('emp_events as ee')
            ->join('employees as emp', 'emp.id', '=', 'ee.emp_id')
            ->join('positions as p', 'p.id', '=', 'emp.position_id')
            ->join('events as e', 'e.id', '=', 'ee.event_id')
            ->selectRaw('ee.id, ee.emp_id, ee.event_id, e.name as event,e.impact,ee.event_date, ee.remarks, emp.name as emp_name, p.title as position, emp.photo_file_name as emp_photo')
            ->where('ee.branch_id', $ss->branch_id)
            ->where('ee.id', $id)
            ->first();

        if ($query) {
            $query->image_url = '';
            if ($query->emp_photo) {
                $query->image_url = Employee::profilePicture($query->emp_id);
            }
            unset($query->emp_photo);
        } else {
            $query = null;
        }
        return $query;
    }

    public function deleteEmpEvent($id = null) {
        $id = $id ?? $this->id;
        $branch_id = $ss->branch_id;
        $query = DB::table('emp_events')
            ->where('id', $id)
            ->delete();
        if (!$query) {
            return DV::error('Invalid ID');
        }
        return DV::depends($query, null, 'Error deleting employee event');
    }

    public function getFormOptions($id, $ss, $emp_id = null){
        $emp_event = null;
        if ($id) {
            $emp_event = self::getDetails($id, $ss);
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

        // um_branches.subs_id may not match session hex filter — load all for dropdown
        $branches = DB::table('um_branches')->selectRaw('id, name AS branch_name, name')->get();
        if ($branches->isEmpty()) {
            $branches = GeneralSettings::options_branch($ss);
        }

        return (object) [
            'employees' => GeneralSettings::options_employee(10,$ss),
            'events' => DB::table('events')->selectRaw('id,name')->get(),
            'branches' => $branches,
            'positions' => GeneralSettings::options_position($ss),
            'work_shifts' => GeneralSettings::options_work_shift($ss),
            'emp_event' => $emp_event,
            'employee' => $employee,
        ];
    }

}
