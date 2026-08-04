<?php

namespace App\Models\Mhr;

use App\Models\Prm\GeneralSettings;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use DV;
use XPublicStorage;
use Vsd\Vsloquent\VSModel;

class Warning extends VSModel
{
    protected $userInfo;
    protected $table = 'emp_warnings';
    protected static $img_dir = 'warnings';

    function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function upsert($arr = [], $id = null, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $id = $id ?? $this->id;

        $v_rule = [
            'emp_id' => '1|number|exists=employees.id|text=select_employee',
            'warning_type_id' => '1|number|text=warning_type',
            'warning_date' => '1|date|text=warning_date',
            'issues' => '1|string|250|text=issues',
            'remarks' => '0|string|1000',
        ];
        $chars = ['$', '#', '@', '!', '/', '.', '-', '_', '=', '?', "'"];
        $res = DBX::validateObject($arr, $v_rule, true, ['remarks' => $chars, 'issues' => $chars], $ss->lang, false, null);
        if ($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $d = (object) $inputs;

        $emp_id = $inputs['emp_id'];
        if (!$d->emp_id) return DV::error('Employee ID is missing');

        $employee_info = DB::table('employees as emp')
            ->leftJoin('positions as p', 'p.id', '=', 'emp.position_id')
            ->where('emp.id', $emp_id)
            ->selectRaw('emp.id, emp.status_id, emp.name, emp.code, p.name as position_name')
            ->first();

        if (!$employee_info) return DV::error('It seems the employee information does not exist');
        if ($employee_info->status_id !== 10) return DV::error('The Employee is not active');

        $id = DBX::saveData($ss, 'emp_warnings', ['id' => $id], $inputs, [], 1, false);
        return DV::depends($id, ['action', 'warning saved'], 'failed_to_save');
    }

    public function getWarningListPaginate($arr, $ss)
    {
        $d = (object) $arr;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;

        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $search_value = $d->search_value ?? null;
        $warning_type_id = $d->warning_type_id ?? null;

        $str_search = '1=1';

        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = '(emp.name LIKE \'%' . $search_value . '%\' OR emp.code LIKE \'%' . $search_value . '%\')';
        }

        $skip_rows = ($current_page - 1) * $per_page;

        $query = DB::table('emp_warnings as w')
            ->join('employees as emp', 'emp.id', '=', 'w.emp_id')
            ->join('positions as p', 'p.id', '=', 'emp.position_id')
            ->join('warning_types as wt', 'wt.id', '=', 'w.warning_type_id')
            ->whereRaw($str_search)
            ->selectRaw('w.id, emp.id as emp_id, emp.code as emp_code, emp.name, emp.sex,p.name as position, w.warning_date, w.warning_type_id, wt.name as warning_type, w.issues, w.remarks, w.update_user, w.updated_at')
            ->orderBy('w.id', 'DESC');

        if ($warning_type_id) {
            $query->where('w.warning_type_id', $warning_type_id);
        }

        $clone_query = clone $query;
        $count = $clone_query->count('w.id');

        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            setOfficialDates($row, ['warning_date'], ['updated_at'], ['']);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public function getDetails($id, $ss = null)
    {
        $warning_dates = DBX::formatDate('w.warning_date', 'warning_date');
        $col_update_date = DBX::formatDate('w.updated_at', 'update_date');

        $row = DB::table('emp_warnings as w')
            ->join('employees as emp', 'emp.id', '=', 'w.emp_id')
            ->join('positions as p', 'p.id', '=', 'emp.position_id')
            ->join('warning_types as wt', 'wt.id', '=', 'w.warning_type_id')
            ->where('w.id', $id)
            ->selectRaw('w.id, w.emp_id, emp.code as emp_code, emp.name as employee, emp.position_id as position_id, p.name as position, w.warning_type_id, wt.name as warning_type, ' . $warning_dates . ', w.issues, w.remarks, w.update_user, ' . $col_update_date)
            ->first();
        return $row;
    }

    public function delete($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $deleted = DB::table('emp_warnings')->where('id', $id)->delete();
        return DV::depends($deleted, null, 'Failed to delete Warning');
    }

    public function getFormOptions($id, $ss)
    {
        $warning = null;
        if ($id) {
            $warning = $this->getDetails($id, $ss);
        }

        $warning_types = DB::table('warning_types')
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        $employees = GeneralSettings::options_employee(10, $ss);

        $positions = DB::table('positions')
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return (object) [
            'warning_types' => $warning_types,
            'employees' => $employees,
            'positions' => $positions,
            'warning' => $warning
        ];
    }
}
