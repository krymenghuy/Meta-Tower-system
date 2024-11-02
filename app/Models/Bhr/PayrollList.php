<?php

namespace App\Models\Bhr;

use App\Models\DV;
use App\Models\JDV;
use Illuminate\Support\Facades\DB;
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
            'deduction' => '0|number',
            'disburse' => '0|number|default = 0',
            // 'tax_base' => '0|number',
            // 'tax_allowance' => '0|number',
            // 'tax_rate' => '0|number',
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
        $filter_by = $d->payroll_id ?? null;
        $search_branch = $d->branch_id ?? null;
        $sort_by = $d->sort_by ?? 'pl.id';
        $sort_order = $d->sort_order ?? 'asc';
        $str_search = '1=1';

        $query = DB::table('payroll_lists as pl')
            ->join('employees as e', 'e.id', '=', 'pl.emp_id')
            ->join('tax_allowances as ta', 'ta.emp_id', '=', 'e.id')
            ->join('positions as pos', 'pos.id', '=', 'e.position_id')
            ->join('emp_types as el', 'el.id', '=', 'e.emp_type_id')
            ->join('payrolls as p', 'p.id', '=', 'pl.payroll_id')
            ->join('um_branches as b', 'b.id', '=', 'e.branch_id')
            ->selectRaw('pl.id,
                        p.id as payroll_id,
                        p.name as payroll_name,
                        e.id as emp_id,
                        e.name as emp_name,
                        pos.title as emp_position,
                        el.name as emp_role,
                        b.name as branch_name,
                        e.salary_base,
                        e.apply_payroll_tax,
                        pl.benefit, pl.deduction,
                        pl.tax_rate,
                        pl.tax_base,
                        ta.amount as tax_allowance,
                        pl.total_salary,
                        pl.disburse,
                        e.photo_file_name as emp_photo')
            ->whereRaw($str_search);
        if ($search_id) {
            $query->where('pl.id', $search_id);
        }
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->whereRaw("e.name like '%{$search_value}%' or pos.title like '%{$search_value}%' or el.name like '%{$search_value}%'");
        }

        if ($filter_by) {
            $query->where('pl.payroll_id', $filter_by);
        }

        if ($search_branch) {
            $query->where('e.branch_id', $search_branch);
        }

        $query->orderBy($sort_by, $sort_order);
        $clone_query = clone  $query;
        $count = $clone_query->count('p.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach ($rows as $row) {
            $row->image_url = '';
            if ($row->emp_photo) {
                $row->image_url = Employee::profilePicture($row->emp_id);
            }
            unset($row->emp_photo);
            $row->tax_base = ($row->tax_base ?? 0);
            $row->total_salary = ($row->total_salary ?? 0);
            $row->benefit = ($row->benefit ?? 0);
            $row->deduction = ($row->deduction ?? 0);

            $row->tax_allowance = ($row->tax_allowance ?? 0);


            // $row->tax_rate = DB::table('tax_brackets')->whereRaw('lower_amount <=' . $row->salary_base . ' and upper_amount >=' . $row->salary_base)->take(1)->value('rate');
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getDetails($id, $ss)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $row =DB::table('payroll_lists as pl')
        ->join('employees as e', 'e.id', '=', 'pl.emp_id')
        ->join('tax_allowances as ta', 'ta.id', '=', 'e.id')
        ->join('positions as pos', 'pos.id', '=', 'e.position_id')
        ->join('emp_types as el', 'el.id', '=', 'e.emp_type_id')
        ->join('payrolls as p', 'p.id', '=', 'pl.payroll_id')
        ->join('um_branches as b', 'b.id', '=', 'e.branch_id')
        ->selectRaw('pl.id,
                    p.id as payroll_id,
                    p.name as payroll_name,
                    e.id as emp_id,
                    e.name as emp_name,
                    pos.title as emp_position,
                    el.name as emp_role,
                    b.name as branch_name,
                    e.salary_base,
                    pl.benefit, pl.deduction,
                    pl.tax_base,
                    ta.amount as tax_allowance,
                    pl.total_salary,
                    pl.disburse,
                    e.photo_file_name as emp_photo')
        ->where('pl.id', $id)->first();


        // $row->tax_rate = DB::table('tax_brackets')->whereRaw('lower_amount <=' . $row->salary_base . ' and upper_amount >=' . $row->salary_base)->take(1)->value('rate');
        return $row;
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
            $payroll_list = $this->getDetails($id, $ss);
        }
        return (object) [

            'sort_by' => [
                ['id' => 'e.name', 'name' => 'By Name'],
                ['id' => 'e.salary_base', 'name' => 'By Salary Base'],

            ],

          'employees' => GeneralSettings::options_employee(10,$ss),
          'payrolls' => GeneralSettings::options_payroll($ss),
          'branches' => GeneralSettings::options_branch($ss),
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
            ->where('status_id', 10)->selectRaw('id as emp_id,name,apply_payroll_tax,salary_base')->get();
        $success = 0;
        $error = 0;
        $exist = 0;
        foreach ($get_employee as $emp) {
            if($emp->apply_payroll_tax == 0){
                $emp->tax_rate = DB::table('tax_brackets')
                    ->whereRaw('lower_amount <=' . $emp->salary_base . ' and upper_amount >=' . $emp->salary_base)
                    ->take(1)->value('rate');

            }else
            {

                $emp->tax_rate = 0;
            }
            $payroll_list_id = null;
            $emp->payroll_id = $payroll_id;
            $v_rule = [
                'id' => '0|identity=1',
                'payroll_id' => '1|number',
                'emp_id' => '1|number',
                'benefit' => '0|number',
                'deduction' => '0|number',
                'tax_rate' => '0|number',
                'tax_base' => '0|number',
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

    function calculatePayrollList($req, $ss)
    {
        $d = (object) $req;
        $payroll_id = isset($d->payroll_id) ? $d->payroll_id : null;
        $str_payroll_id = '1=1';
        if ($payroll_id) {
            $str_payroll_id = 'p.id = ' . $payroll_id;
        }

        $payrolls = DB::table('payroll_lists as pl')
        ->join('employees as e', 'e.id', '=', 'pl.emp_id')
        ->join('tax_allowances as ta', 'ta.emp_id', '=', 'e.id')
        ->join('positions as pos', 'pos.id', '=', 'e.position_id')
        ->join('emp_types as el', 'el.id', '=', 'e.emp_type_id')
        ->join('payrolls as p', 'p.id', '=', 'pl.payroll_id')
        ->whereRaw($str_payroll_id)
        ->selectRaw('pl.id,
                    p.id as payroll_id,
                    p.name as payroll_name,
                    e.id as emp_id,
                    e.name as emp_name,
                    pos.title as emp_position,
                    el.name as emp_role,
                    e.salary_base,
                    pl.benefit, pl.deduction,
                    ta.amount as tax_allowance,
                    e.photo_file_name as emp_photo')->orderBy('e.id')->get();


            $success = 0;
            $error = 0;
            $success_ids =[];
            $error_ids = [];
            foreach ($payrolls as &$payroll) {
                $payroll->apply_payroll_tax = DB::table('employees')
                    ->where('id', $payroll->emp_id)
                    ->value('apply_payroll_tax');

                $salary_base = $payroll->salary_base;
                $tax_allowance = $payroll->tax_allowance;
                $benefit = $payroll->benefit;
                $deduction = $payroll->deduction;

                if ($payroll->apply_payroll_tax == 0) {
                    $payroll->tax_rate = DB::table('tax_brackets')
                        ->where('lower_amount', '<=', $salary_base)
                        ->where('upper_amount', '>=', $salary_base)
                        ->value('rate');

                    $tax_rate = $payroll->tax_rate;

                    $payroll->tax_base = ($salary_base - $tax_allowance) * ($tax_rate / 100);
                    $payroll->total = $salary_base + $benefit - $deduction - $payroll->tax_base;
                } else {
                    $payroll->tax_base = 0;  // No tax base for non-taxed employees
                    $payroll->total = $salary_base + $benefit - $deduction ;
                }
                $row =DB::table('payroll_lists')->where('id',$payroll->id)->update(
                    [
                     'tax_base' => $payroll->tax_base,
                     'total_salary' => $payroll->total
                     ]
                );
                if($row ){
                    $success++;
                    $success_ids[] = $payroll->id;
                }else {
                    $error++;
                    $error_ids[] = $payroll->id;
                }


            }

            return DV::depends(1,['On Calulate',$success,'On Calulate ids',$success_ids,'Calculated',$error,'Calculated ids',$error_ids]);


        }

        function disbursePayrollList($id, $ss = null)
        {
            $ss = $ss ?? $this->userInfo;
            $branch_id = $ss->branch_id;

            $trx = DB::table('payroll_lists as pl')
                    ->join('payrolls as p', 'p.id', '=', 'pl.payroll_id')
                    ->join('accounts as a', 'a.emp_id', '=', 'pl.emp_id')
                    ->where('pl.id', $id)
                    ->selectRaw('total_salary as amount,pl.emp_id,pl.payroll_id,p.name as remarks,a.id as account_id ')->first();
            $trx->trx_type=3;
            $trx->transfer_acc_id = 1;
            $trx = Transaction::transfer((array)$trx, $ss);
            $transfer_amount = 0;
            if($trx){
                $transfer_amount = $trx['transactions']['amount'];
                $account_id = DB::table('accounts')->where('emp_id', $trx['transactions']['emp_id'])->value('id');
                $updateBalance_acc = PayrollList::updateBalance($account_id,'accounts','in',  $trx['transactions']['amount'], $trx['trx_id'], $ss);
            }

            $default_account = DB::table('accounts as a')
                    ->where('a.id', 1)
                    ->selectRaw(' a.id as account_id')->first();
            $default_account->trx_type='2';
            $default_account->amount = $transfer_amount;
            $account_id = $default_account->account_id;
            $last_balance = $default_account->amount;
            $default_account = Transaction::withdrawal((array)$default_account, $ss);
            if($default_account){
                $updateBalance_def = PayrollList::updateBalance($account_id,'accounts','out',  $default_account['transactions']['amount'], $default_account['trx_id'], $ss);
            }
            // $newBalance = $default_account['transactions']['amount'] - $last_balance;
            if($updateBalance_acc && $updateBalance_def){
                $query = DB::table('payroll_lists')
                ->where('id', $id)
                ->update(['disburse' => 1, 'trx_id' => hex2bin($trx['trx_id'])]);
                return $query;
            }
            return DV::error('Disbursement failed');

        }

        static function updateBalance($account_id,$table_name,$status, $amount, $trx_id, $ss = null)
        {
            if(!$account_id){
                return DV::error('Invalid account id');
            }
            if(!$amount){
                $amount = 0;
            }
            $lastBalance = DB::table($table_name)->where('id', $account_id)->value('balance');

            if($status=='in'){
                $newBalance = (float)$lastBalance + (float)$amount;
            }else if($status=='out'){
                $newBalance = (float)$lastBalance - (float)$amount;
            }else{
                $newBalance = (float)$amount;
            }

            $lastBalanceDate = date('Y-m-d');
            $query = DB::table($table_name)
                ->where('id', $account_id)
                ->update(['balance' => $newBalance, 'last_balance_date' => $lastBalanceDate, 'trx_id' => hex2bin($trx_id)]);
            return $query;
        }
    }
