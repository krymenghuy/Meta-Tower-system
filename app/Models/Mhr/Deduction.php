<?php

namespace App\Models\Mhr;
use App\Models\Prm\GeneralSettings;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use DV;
use Vsd\Vsloquent\VSModel;

class Deduction extends VSModel
{
    protected $userInfo;
    protected $table = 'emp_deductions';

    function __construct($id = null, $userInfo = null) {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function upsert($arr = [], $id = null, $ss = null) {
        $ss = $ss ?? $this->userInfo;
        $id = $id ?? $this->id;

        $v_rule = [
            'emp_id' => '1|number|exists=employees.id|text=select_employee',
            'deduct_amount' => '1|number|text=deduct_amount',
            'deduct_date' => '0|date|text=deduct_date',
            'issues' => '0|string|250|text=issues',
            'remarks' => '0|string|1000',
        ];
        $chars = ['$', '#', '@', '!', '/', '.', '-', '_', '=', '?', "'"];
        $res = DBX::validateObject($arr, $v_rule, true, ['issues' => $chars], $ss->lang, false, null);
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

        $id = DBX::saveData($ss, 'emp_deductions', ['id' => $id], $inputs, [], 1, false);
        return DV::depends($id, ['action', 'deduction saved'], 'failed_to_save');
    }

    public function getDeductionListPaginate($arr, $ss)
    {
        $d = (object) $arr;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;

        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $search_value = $d->search_value ?? null;

        $str_search = '1=1';

        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = '(emp.name LIKE \'%' . $search_value . '%\' OR emp.code LIKE \'%' . $search_value . '%\')';
        }

        $skip_rows = ($current_page - 1) * $per_page;

        $query = DB::table('emp_deductions as d')
            ->join('employees as emp', 'emp.id', '=', 'd.emp_id')
            ->leftJoin('positions as p', 'p.id', '=', 'emp.position_id')
            ->whereRaw($str_search)
            ->selectRaw('d.id, emp.id as emp_id, emp.code as emp_code, emp.name, emp.sex, p.name as position, d.deduct_date, d.deduct_amount, d.issues, d.remarks, d.update_user, d.updated_at')
            ->orderBy('d.id', 'DESC');

        $clone_query = clone $query;
        $count = $clone_query->count('d.id');

        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            setOfficialDates($row, ['deduct_date'], ['updated_at'], ['']);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public function getDetails($id, $ss = null) {
        $deduct_dates = DBX::formatDate('d.deduct_date', 'deduct_date');
        $col_update_date = DBX::formatDate('d.updated_at', 'update_date');

        $row = DB::table('emp_deductions as d')
            ->join('employees as emp', 'emp.id', '=', 'd.emp_id')
            ->leftJoin('positions as p', 'p.id', '=', 'emp.position_id')
            ->where('d.id', $id)
            ->selectRaw('d.id, d.emp_id, emp.code as emp_code, emp.name as employee, emp.position_id as position_id, p.name as position, ' . $deduct_dates . ', d.deduct_amount, d.issues, d.remarks, d.update_user, ' . $col_update_date)
            ->first();
        return $row;
    }

    public function delete($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $deleted = DB::table('emp_deductions')->where('id', $id)->delete();
        return DV::depends($deleted, null, 'Failed to delete Deduction');
    }

    public function getFormOptions($id, $ss)
    {
        $deduction = null;
        if ($id) {
            $deduction = $this->getDetails($id, $ss);
        }

        $employees = GeneralSettings::options_employee(10, $ss);

        $positions = DB::table('positions')
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return (object) [
            'employees' => $employees,
            'positions' => $positions,
            'deduction' => $deduction
        ];
    }
}
