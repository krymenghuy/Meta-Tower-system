<?php

namespace App\Models\Bhr;

use App\Models\DV;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;

class PayrollList
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function save($arr,$ss = null){
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'id' => '0|identity=1',
            'payroll_id' => '1|number',
            'emp_id' => '1|number',
            // 'salary_base' => '0|number',
            'benefit' => '0|number',
            'desuction' => '0|number',
            // 'tax_base' => '0|number',
            'tax_allowance' => '0|number',
            'tax_rate' => '0|number',
            // 'total_salary' => '0|number',
        ];


        $res = validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;

        $id = saveData($ss,'payroll_lists', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['payroll_lists' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving payroll');
    }


    function getPayrollListPaginate($arr, $ss)
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
        $search_id = $d->id ?? null;

        $str_search = '1=1';

        $query = DB::table('payroll_lists as pl')
            ->join('employees as e', 'e.id', '=', 'pl.emp_id')
            ->join('positions as pos', 'pos.id', '=', 'e.positions_id')
            ->join('emp_roles as el', 'el.id', '=', 'e.emp_role_id')
            ->join('payrolls as p', 'p.id', '=', 'pl.payroll_id')
            ->selectRaw('
                        pl.id,
                        p.id as payroll_id,
                        p.name as payroll_name,
                        e.id as emp_id,
                        e.name as emp_name,
                        pos.title as emp_position,
                        el.name as emp_role,
                        pl.salary_base,
                        pl.benefit, pl.desuction,
                        pl.tax_base,
                        pl.tax_allowance,
                        pl.tax_rate,
                        pl.total_salary,
                        e.photo_file_name as emp_photo')
            ->whereRaw($str_search);
        if ($search_id) {
            $query->where('pl.id', $search_id);
        }
        if ($search_value) {
            $query->where('e.name', 'like', '%' . $search_value . '%');
        }
        $clone_query = clone  $query;
        $count = $clone_query->count('p.id');
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

    function getDetails($id, $ss)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $query = DB::table('payroll_lists as pl')
            ->join('employees as e', 'e.id', '=', 'pl.emp_id')
            ->join('positions as pos', 'pos.id', '=', 'e.positions_id')
            ->join('emp_roles as el', 'el.id', '=', 'e.emp_role_id')
            ->join('payrolls as p', 'p.id', '=', 'pl.payroll_id')
            ->selectRaw('
                        pl.id,
                        p.id as payroll_id,
                        p.name as payroll_name,
                        e.id as emp_id,
                        e.name as emp_name,
                        pos.title as emp_position,
                        el.name as emp_role,
                        pl.salary_base,
                        pl.benefit, pl.desuction,
                        pl.tax_base,
                        pl.tax_allowance,
                        pl.tax_rate,
                        pl.total_salary,
                        e.photo_file_name as emp_photo')
            ->where('pl.id', $id)->first();
        if ($query) {
            $query->image_url = Employee::profilePicture($query->emp_id);
            unset($query->emp_photo);
        } else {
            $query = null;
        }
        return $query;
    }


    function deletePayrollList($id, $ss)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $query = DB::table('payroll_lists')
            ->where('id', $id)
            ->delete();
        return $query;
    }

    function getFormOptions($id, $ss)
    {
        $payroll_list = null;
        if ($id) {
            $payroll_list = self::getDetails($id, $ss);
        }
        return (object) [

            'sort_by' => [
                ['id' => 'emp.name', 'name' => 'By Name'],
                ['id' => 'pay.salary', 'name' => 'By Salary']

            ],

          'employees' => GeneralSettings::options_employee(10,$ss),
          'payrolls' => DB::table('payrolls')->selectRaw('id,name')->get(),
            'payroll_lists' => $payroll_list,
        ];

    }

    function importPayrollList($req, $ss)
    {
        $d = (object) $req;
        $payroll_id = isset($d->payroll_id) ? $d->payroll_id : null;
        if(!$payroll_id){
            return JDV::error('Payroll not found');
        }
             $get_employee = DB::table('employees')
            ->where('status_id', 10)->selectRaw('id as emp_id,name')->get();
        $success = 0;
        $error = 0;
        $exist = 0;
        foreach ($get_employee as $emp) {
            $payroll_list_id = null;
            $emp->payroll_id = $payroll_id;
            $v_rule = [
                'id' => '0|identity=1',
                'payroll_id' => '1|number',
                'emp_id' => '1|number',
                'salary_base' => '0|number',
                'benefit' => '0|number',
                'desuction' => '0|number',
                'tax_base' => '0|number',
                'tax_allowance' => '0|number',
                'tax_rate' => '0|number',
                'total_salary' => '0|number',
            ];

            $res = validateObject((array)$emp, $v_rule, true, [], $ss->lang);
            if ($res->error) {
                $error++;
            }
            $inputs = $res->values;
            $checkExist = DB::table('payroll_lists')->where('emp_id', $inputs['emp_id'])->where('payroll_id', $inputs['payroll_id'])->first();
            if($checkExist){
                $payroll_list_id = $checkExist->id;
            }
            else{
                $payroll_list_id = saveData($ss,'payroll_lists', ['id' => $payroll_list_id], $inputs, [], 1);
            }
            if ($payroll_list_id > 0) {
                $success++;
            }
        }
        return DV::depends(1, ['success' => $success, 'error' => $error]);

    }

}
