<?php

namespace App\Models\Bhr;

use App\Models\DV;
use App\Models\JDV;
use App\Models\Bhr\PayrollList;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\DBX;

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
            // 'salary' => '0|number',
            'benefit' => '0|number',
            'deduction' => '0|number',
            'disburse' => '0|number|default = 0',
            // 'tax_base' => '0|number',
            // 'allowance' => '0|number',
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
            ->join('positions as pos', 'pos.id', '=', 'e.position_id')
            ->join('payrolls as p', 'p.id', '=', 'pl.payroll_id')
            ->join('um_branches as b', 'b.id', '=', 'e.branch_id')
            ->selectRaw('pl.id,
                        p.id as payroll_id,
                        p.name as payroll_name,
                        e.id as emp_id,
                        e.name as emp_name,
                        pos.title as emp_position,
                        b.name as branch_name,
                        e.salary,
                        e.apply_payroll_tax,
                        pl.benefit,
                        pl.deduction,
                        pl.tax_rate,
                        pl.bias,
                        pl.tax_base,
                        pl.tax_bonus,
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
        $clone_query = clone $query;
        $count = $clone_query->count('p.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            $row->image_url = '';
            if ($row->emp_photo) {
                $row->image_url = Employee::profilePicture($row->emp_id);
            }
            unset($row->emp_photo);

            $row->allowance = DB::table('tax_allowances')
                ->where('emp_id', $row->emp_id)
                ->value('allowance');



            $row->tax_base = ($row->tax_base ?? 0);
            $row->total_salary = ($row->total_salary ?? 0);
            $row->benefit = ($row->benefit ?? 0);
            $row->deduction = ($row->deduction ?? 0);
            $row->allowance = ($row->allowance ?? 0);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }



    function getDetails($id, $ss)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $row =DB::table('payroll_lists as pl')
        ->join('employees as e', 'e.id', '=', 'pl.emp_id')
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
                    e.salary,
                    pl.benefit, pl.deduction,
                    pl.tax_base,
                    pl.tax_bonus,
                    pl.total_salary,
                    pl.disburse,
                    e.photo_file_name as emp_photo')
        ->where('pl.id', $id)->first();

        if ($row) {
            $row->allowance = DB::table('tax_allowances')
            ->where('emp_id', $row->emp_id)
            ->value('allowance');
        }
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
                ['id' => 'e.salary', 'name' => 'By Salary Base'],

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
        if (!$payroll_id) {
            return JDV::error('Payroll not found');
        }

        $payroll = DB::table('payrolls')->where('id', $payroll_id)->first();
        if (!$payroll) {
            return JDV::error('Payroll period not found');
        }
        $start_date = $payroll->start_date;
        $end_date = $payroll->end_date;

        $get_employee = DB::table('employees as e')
            ->leftJoin('resignations as r', 'e.id', '=', 'r.emp_id')
            ->where(function ($query) use ($start_date, $end_date) {
                $query->where('e.status_id', 10) // Active employees
                    ->orWhere(function ($q) use ($start_date, $end_date) {
                        $q->where('e.status_id', 20) // Resigned employees
                          ->whereBetween('r.effective_date', [$start_date, $end_date]);
                    });
            })
            ->selectRaw('e.id as emp_id, e.name, e.apply_payroll_tax, e.salary')
            ->get();

        $success = 0;
        $error = 0;

        foreach ($get_employee as $emp) {
            if ($emp->apply_payroll_tax == 0) {
                $taxInfo = DB::table('tax_brackets')
                    ->where(function ($query) use ($emp) {
                        $query->whereRaw('lower_amount <= ?', [$emp->salary])
                            ->whereRaw('(upper_amount >= ? OR upper_amount = -1)', [$emp->salary]);
                    })
                    ->select('rate', 'bias')
                    ->first();

                $emp->tax_rate = (object) [
                    'rate' => $taxInfo->rate ?? 0,
                    'bias' => $taxInfo->bias ?? 0
                ];
            } else {
                $emp->tax_rate = (object) ['rate' => 0, 'bias' => 0];
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
                'bias' => '0|number',
                'total_salary' => '0|number',
            ];

            $empArray = (array)$emp;
            $empArray['tax_rate'] = $emp->tax_rate->rate;
            $empArray['bias'] = $emp->tax_rate->bias;

            $res = validateObject($empArray, $v_rule, true, [], $ss->lang);
            if ($res->error) {
                $error++;
                continue;
            }

            $inputs = $res->values;

            $checkExist = DB::table('payroll_lists')
                ->where('emp_id', $inputs['emp_id'])
                ->where('payroll_id', $inputs['payroll_id'])
                ->first();

            $payroll_list_id = $checkExist ? $checkExist->id : saveData($ss, 'payroll_lists', ['id' => null], $inputs, [], 1);

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

        $start_date = DBX::formatDate('p.start_date', 'start_date');
        $end_date = DBX::formatDate('p.end_date', 'end_date');

        $payrolls = DB::table('payroll_lists as pl')
            ->join('employees as e', 'e.id', '=', 'pl.emp_id')
            ->leftJoin('resignations as r', 'r.emp_id', '=', 'e.id')
            ->join('positions as pos', 'pos.id', '=', 'e.position_id')
            ->join('emp_types as el', 'el.id', '=', 'e.emp_type_id')
            ->join('payrolls as p', 'p.id', '=', 'pl.payroll_id')
            ->whereRaw($str_payroll_id)
            ->selectRaw('pl.id,
                        p.id as payroll_id,
                        '.$start_date.',
                        '.$end_date.',
                        p.name as payroll_name,
                        e.id as emp_id,
                        e.name as emp_name,
                        pos.title as emp_position,
                        el.name as emp_role,
                        e.salary,
                        pl.benefit, pl.deduction,
                        e.photo_file_name as emp_photo,
                        e.status_id,
                        e.joining_date,
                        r.effective_date')
            ->orderBy('e.id')
            ->get();

        $success = 0;
        $error = 0;
        $success_ids = [];
        $error_ids = [];

        foreach ($payrolls as &$payroll) {

            // Calculate payroll days in the period
            $payroll_start_date = new \DateTime($payroll->start_date);
            $payroll_end_date = new \DateTime($payroll->end_date);
            $payroll_days = $payroll_start_date->diff($payroll_end_date)->days + 1;

            $resigned_or_new_start = false;
            $count_date = $payroll_days;

            if ($payroll->status_id == 20 && $payroll->effective_date) {
                // Employee has resigned
                $effective_date = new \DateTime($payroll->effective_date);
                if ($effective_date >= $payroll_start_date && $effective_date <= $payroll_end_date) {
                    $count_date = $payroll_start_date->diff($effective_date)->days;
                    $resigned_or_new_start = true;
                }
            } elseif ($payroll->joining_date) {
                // Employee has just started
                $joining_date = new \DateTime($payroll->joining_date);
                if ($joining_date >= $payroll_start_date && $joining_date <= $payroll_end_date) {
                    $count_date = $joining_date->diff($payroll_end_date)->days + 1;
                    $resigned_or_new_start = true;
                }

            }

            $salary = $payroll->salary;
            $salary_per_day = $salary / $payroll_days;
            $last_salary = $resigned_or_new_start ? $salary_per_day * $count_date : $salary;

            $payroll->allowance = DB::table('tax_allowances')
                ->where('emp_id', $payroll->emp_id)
                ->value('allowance') ?? 0;

            $payroll->apply_payroll_tax = DB::table('employees')
                ->where('id', $payroll->emp_id)
                ->value('apply_payroll_tax');

            $allowance = $payroll->allowance;
            $benefit = $payroll->benefit ?? 0;
            $deduction = $payroll->deduction;
            $tax_bonus = 0;

            if ($payroll->apply_payroll_tax == 0) {
                $tax_info = DB::table('tax_brackets')
                    ->where('lower_amount', '<=', $last_salary)
                    ->where(function($query) use ($last_salary) {
                        $query->where('upper_amount', '>=', $last_salary)
                              ->orWhere('upper_amount', '=', -1);
                    })
                    ->first(['rate', 'bias']);

                $tax_rate = $tax_info->rate ?? 0;
                $bias = $tax_info->bias ?? 0;

                if ($benefit > 0) {
                    $payroll->tax_base = ($last_salary - $allowance) * ($tax_rate / 100) - $bias;
                    $tax_bonus = $benefit * (20 / 100);
                    $payroll->total = ($last_salary + $benefit) - ($payroll->tax_base + $tax_bonus + $deduction);
                } else {
                    $payroll->tax_base = ($last_salary - $allowance) * ($tax_rate / 100) - $bias;
                    $payroll->total = $last_salary - ($payroll->tax_base + $deduction);
                }
            } else {
                $payroll->tax_base = 0;
                $payroll->total = $last_salary + $benefit - $deduction;
            }

            $row = DB::table('payroll_lists')->where('id', $payroll->id)->update([
                'tax_base' => $payroll->tax_base,
                'tax_bonus' => $tax_bonus,
                'total_salary' => $payroll->total
            ]);

            if ($row) {
                $success++;
                $success_ids[] = $payroll->id;
            } else {
                $error++;
                $error_ids[] = $payroll->id;
            }
        }

        return DV::depends(1, [
            'On Calculate', $success,
            'On Calculate ids', $success_ids,
            'Calculated', $error,
            'Calculated ids', $error_ids
        ]);
    }





    function disbursePayrollList($id, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $trx = DB::table('payroll_lists as pl')
                ->join('payrolls as p', 'p.id', '=', 'pl.payroll_id')
                ->join('accounts as a', 'a.emp_id', '=', 'pl.emp_id')
                ->where('pl.id', $id)
                ->selectRaw('total_salary as amount,pl.emp_id,pl.payroll_id,p.name as remarks,a.id as account_id,p.authorized,a.account_number')->first();
        $trx->trx_type=3;
        $trx->transfer_acc_id = 1;
        $trx->from_acc_num = '1';
        $trx->to_acc_num = $trx->account_number;

        if(!$trx->authorized){
            return DV::error($trx->remarks.' is not authorized ');
        }

        $trx = Transaction::transfer((array)$trx, $ss);
        $transfer_amount = 0;

        if($trx){
            $transfer_amount = $trx['transactions']['amount'];
            $account_id = DB::table('accounts')->where('emp_id', $trx['transactions']['emp_id'])->value('id');
            $updateBalance_acc = PayrollList::updateBalance($account_id,'accounts','in',  $trx['transactions']['amount'], $trx['trx_id'], $ss);
        }

        $default_account = DB::table('accounts as a')
                ->where('a.id', 1)
                ->selectRaw(' a.id as account_id,a.account_number')->first();
        $default_account->trx_type='2';
        $default_account->from_acc_num = $default_account->account_number;
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
            return DV::depends(1, ['Payroll Disbursed' => $query]);
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

    function disburseAllPayrollList($payroll_id, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $undisbursedCount = DB::table('payroll_lists')
        ->where('payroll_id', $payroll_id)
        ->where('disburse', 0)
        ->count();

        if ($undisbursedCount === 1) {
        return DV::error('Already Disbursed');
        }


        $payrollEntries = DB::table('payroll_lists as pl')
                            ->join('payrolls as p', 'p.id', '=', 'pl.payroll_id')
                            ->join('accounts as a', 'a.emp_id', '=', 'pl.emp_id')
                            ->where('pl.payroll_id', $payroll_id)
                            ->where('pl.disburse', 0)
                            ->selectRaw('pl.id, total_salary as amount, pl.emp_id, pl.payroll_id, p.name as remarks, a.id as account_id, p.authorized, a.account_number')
                            ->get();

        $results = [];
        foreach ($payrollEntries as $trx) {
            $trx->trx_type = 3;
            $trx->transfer_acc_id = 1;
            $trx->from_acc_num = '1';
            $trx->to_acc_num = $trx->account_number;


            if(!$trx->authorized){
                return DV::error($trx->remarks.' is not authorized ');
            }

            $trxResult = Transaction::transfer((array) $trx, $ss);
            $transfer_amount = 0;

            if ($trxResult) {
                $transfer_amount = $trxResult['transactions']['amount'];
                $account_id = DB::table('accounts')->where('emp_id', $trxResult['transactions']['emp_id'])->value('id');
                $updateBalance_acc = PayrollList::updateBalance($account_id, 'accounts', 'in', $trxResult['transactions']['amount'], $trxResult['trx_id'], $ss);


                $default_account = DB::table('accounts as a')
                                    ->where('a.id', 1)
                                    ->selectRaw('a.id as account_id, a.account_number')
                                    ->first();
                $default_account->trx_type = '2';
                $default_account->from_acc_num = $default_account->account_number;
                $default_account->amount = $transfer_amount;
                $account_id = $default_account->account_id;
                $last_balance = $default_account->amount;
                $withdrawalResult = Transaction::withdrawal((array) $default_account, $ss);

                if ($updateBalance_acc && $withdrawalResult) {
                    PayrollList::updateBalance($account_id, 'accounts', 'out', $withdrawalResult['transactions']['amount'], $withdrawalResult['trx_id'], $ss);

                    // Mark payroll list entry as disbursed
                    DB::table('payroll_lists')
                      ->where('id', $trx->id)
                      ->update(['disburse' => 1, 'trx_id' => hex2bin($trxResult['trx_id'])]);

                    $results[] = DV::depends(1, ['Payroll Disbursed' => true]);
                } else {
                    $results[] = DV::error('Balance update failed for employee ID ' . $trx->emp_id);
                }
            } else {
                $results[] = DV::error('Transfer failed for employee ID ' . $trx->emp_id);
            }
        }

            return DV::depends(1, ['Payroll Disbursed' => $results]);
    }


}
