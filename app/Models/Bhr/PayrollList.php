<?php

namespace App\Models\Bhr;

use App\Models\DV;
use App\Models\JDV;
use App\Models\Bhr\PayrollList;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\DBX;
use App\Models\Bhr\employee;
use App\Models\Bhr\Account;
// use App\Models\Bhr\PayrollListSettings;

class PayrollList
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function save($arr = [], $id = null, $ss = null) {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
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

        $inputs = $res->values;

        $id = saveData($ss,'payroll_list', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['payroll_list' => $inputs, 'id' => $id]);
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
        $search_disburse = $d->disburse ?? null;
        $str_search = '1=1';

        $query = DB::table('payroll_list as pl')
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
                        pl.salary,
                        e.apply_payroll_tax,
                        pl.benefit,
                        pl.deduction,
                        pl.tax_rate,
                        pl.bias,
                        pl.tax_base,
                        pl.benefit_tax,
                        pl.benefit_tax,
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

        if (!is_null($search_disburse)) { // Ensure the condition applies for both 0 and 1
            $query->where('pl.disburse', $search_disburse);
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
        $joining_date = DBX::formatDate('e.joining_date','joining_date');

        $row =DB::table('payroll_list as pl')
        ->join('employees as e', 'e.id', '=', 'pl.emp_id')
        ->join('positions as pos', 'pos.id', '=', 'e.position_id')
        ->join('payrolls as p', 'p.id', '=', 'pl.payroll_id')
        ->join('um_branches as b', 'b.id', '=', 'e.branch_id')
        ->selectRaw('pl.id,
                    p.id as payroll_id,
                    p.name as payroll_name,
                    e.id as emp_id,
                    e.code as emp_code,
                    e.name as emp_name,
                    e.sex,
                    pos.title as emp_position,
                    b.name as branch_name,
                    pl.salary,
                    e.apply_payroll_tax,
                    pl.benefit,
                    pl.deduction,
                    pl.tax_rate,
                    pl.bias,
                    pl.tax_base,
                    pl.benefit_tax,
                    pl.total_salary,
                    pl.disburse,
                    '.$joining_date.',
                    e.photo_file_name as emp_photo')
        ->where('pl.id', $id)->first();

        if ($row) {
            $row->allowance = DB::table('tax_allowances')
            ->where('emp_id', $row->emp_id)
            ->value('allowance');
        }
        return $row;
    }
    function deletePayrollList($id = null)
    {
        $id = $id ?? $this->id;
        $query = DB::table('payroll_list')
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
            'disburse' => [
                ['id' => 0, 'name' => 'Not Disburse'],
                ['id' => 1, 'name' => 'Disbursed'],
            ],

          'employees' => GeneralSettings::options_employee(10,$ss),
          'payrolls' => GeneralSettings::options_payroll($ss),
          'branches' => GeneralSettings::options_branch($ss),
            'payroll_list' => $payroll_list,
        ];

    }

    function importPayrollList($req, $ss)
    {
        $d = (object) $req;

        $payroll_id = isset($d->payroll_id) ? $d->payroll_id : null;
        if (!$payroll_id) {
            return JDV::error('Payroll not found');
        }

        // Get payroll period
        $payroll = DB::table('payrolls')->where('id', $payroll_id)->first();
        if (!$payroll) {
            return JDV::error('Payroll period not found');
        }
        $start_date = $payroll->start_date;
        $end_date = $payroll->end_date;

        $get_employee = DB::table('employees as e')
            ->where(function ($query) use ($start_date, $end_date) {
                $query->where('e.status_id', 10) // Active employees
                    ->orWhere(function ($query) use ($start_date, $end_date) {
                        $query->where('e.status_id', 20) // Resigned employees
                            ->whereExists(function ($query) use ($start_date, $end_date) {
                                $query->select(DB::raw(1))
                                    ->from('resignations as r')
                                    ->whereColumn('r.emp_id', 'e.id')
                                    ->whereBetween('r.effective_date', [$start_date, $end_date]);
                            })
                            ->orWhereExists(function ($query) use ($start_date) {
                                $query->select(DB::raw(1))
                                    ->from('resignations as r')
                                    ->whereColumn('r.emp_id', 'e.id')
                                    ->where('r.effective_date', '>', $start_date);
                            });
                    });
            })
            ->where(function ($query) use ($end_date) {
                $query->where('e.joining_date', '<=', $end_date);
            })
            ->selectRaw('e.id as emp_id, e.name, e.apply_payroll_tax, e.salary')
            ->get();

        $success = 0;
        $error = 0;

        foreach ($get_employee as $emp) {
            $payroll_list = DB::table('payroll_list')
                ->where('emp_id', $emp->emp_id)
                ->where('payroll_id', $payroll_id)
                ->first();

            if ($payroll_list) {
                $emp_salary = $payroll_list->salary;
            } else {
                $emp_salary = $emp->salary;
            }

            if ($emp->apply_payroll_tax == 0) {
                $taxInfo = DB::table('tax_brackets')
                    ->where(function ($query) use ($emp_salary) {
                        $query->whereRaw('lower_amount <= ?', [$emp_salary])
                              ->whereRaw('(upper_amount >= ? OR upper_amount = -1)', [$emp_salary]);
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
                'salary' => '0|number',
            ];

            $empArray = (array)$emp;
            $empArray['tax_rate'] = $emp->tax_rate->rate;
            $empArray['bias'] = $emp->tax_rate->bias;
            $empArray['salary'] = $emp_salary;

            $res = validateObject($empArray, $v_rule, true, [], $ss->lang);
            if ($res->error) {
                $error++;
                continue;
            }

            $inputs = $res->values;

            $checkExist = DB::table('payroll_list')
                ->where('emp_id', $inputs['emp_id'])
                ->where('payroll_id', $inputs['payroll_id'])
                ->first();

            $payroll_id = $inputs['payroll_id'];
            $emp_id = $inputs['emp_id'];

            $payroll_list_benefit = Employee::getPayrollListBenefit($payroll_id, $emp_id);
            $save_payroll_list_benefit = Employee::savePayrollListBenefit((array)$payroll_list_benefit, $ss);
            $inputs['benefit'] = $payroll_list_benefit->used_amount;

            $payroll_list_id = $checkExist ? $checkExist->id : saveData($ss, 'payroll_list', ['id' => null], $inputs, [], 1);

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

        $payrolls = DB::table('payroll_list as pl')
            ->join('employees as e', 'e.id', '=', 'pl.emp_id')
            ->leftJoin('resignations as r', 'r.emp_id', '=', 'e.id')
            ->leftJoin('rejoins as rej', 'rej.emp_id', '=', 'e.id')
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
                        pl.salary,
                        pl.benefit, pl.deduction,
                        e.photo_file_name as emp_photo,
                        e.status_id,
                        e.joining_date,
                        r.effective_date,
                        rej.rejoin_date')
            ->orderBy('e.id')
            ->get();

        $success = 0;
        $error = 0;
        $success_ids = [];
        $error_ids = [];

        foreach ($payrolls as &$payroll)
        {
            $payroll->tax_base = 0;
            $payroll->total = 0;
            $payroll_start_date = new \DateTime($payroll->start_date);
            $payroll_end_date = new \DateTime($payroll->end_date);

            $payroll_days = $payroll_start_date->diff($payroll_end_date)->days + 1;

            $resigned_or_new_start = false;
            $count_date = $payroll_days;

            $check_rejoin = DB::table('employees as e')
                ->join('rejoins as rej', 'rej.emp_id', '=', 'e.id')
                ->where('e.id', $payroll->emp_id)->value('rej.id');

            if($check_rejoin){
                $effective_date = new \DateTime($payroll->effective_date);
                if ($effective_date >= new \DateTime($payroll->start_date) && $effective_date <= new \DateTime($payroll->end_date)) {
                    $count_date = (new \DateTime($payroll->start_date))->diff($effective_date)->days;
                    $resigned_or_new_start = true;
                }
            }

            if ($payroll->status_id == 20 && $payroll->effective_date) {
                $effective_date = new \DateTime($payroll->effective_date);
                if ($effective_date >= $payroll_start_date && $effective_date <= $payroll_end_date) {
                    $count_date = $payroll_start_date->diff($effective_date)->days;
                    $resigned_or_new_start = true;
                }
            } elseif ($payroll->rejoin_date) {
                $rejoin_date = new \DateTime($payroll->rejoin_date);

                if ($rejoin_date >= $payroll_start_date && $rejoin_date <= $payroll_end_date) {
                    $count_date = $rejoin_date->diff($payroll_end_date)->days + 1;
                    $resigned_or_new_start = true;
                }

            } elseif ($payroll->joining_date) {
                $joining_date = new \DateTime($payroll->joining_date);
                if ($joining_date >= $payroll_start_date && $joining_date <= $payroll_end_date) {
                    $count_date = $joining_date->diff($payroll_end_date)->days + 1;
                    $resigned_or_new_start = true;
                }

            }
           $check_benefit = DB::table('payroll_list_benefits')
                ->where('emp_id', $payroll->emp_id)
                ->where('payroll_id', $payroll->payroll_id)
                ->selectRaw('tax_option_id')
                ->first();
            // \Log::info('check_benefit: ' . json_encode($check_benefit->tax_option_id) . ' - Employee ID: ' . $payroll->emp_id);

            $payroll->allowance = DB::table('tax_allowances')
                ->where('emp_id', $payroll->emp_id)
                ->value('allowance') ?? 0;

            $allowance = $payroll->allowance;
            $allowance_per_day = $allowance / $payroll_days;
            $last_allowance = $resigned_or_new_start ? $allowance_per_day * $count_date : $allowance;

            $payroll->apply_payroll_tax = DB::table('employees')
                ->where('id', $payroll->emp_id)
                ->value('apply_payroll_tax');
            $benefit = $payroll->benefit ?? 0;
            $deduction = $payroll->deduction;
            $benefit_tax = 0;

            if ($check_benefit && $check_benefit->tax_option_id == 1)
            {
                $salary = $payroll->salary + $benefit;
                $salary_per_day = $salary / $payroll_days;
                $last_salary = $resigned_or_new_start ? $salary_per_day * $count_date : $salary;

                if ($payroll->apply_payroll_tax == 0)
                {
                    $tax_info = DB::table('tax_brackets')
                        ->where('lower_amount', '<=', $salary)
                        ->where(function($query) use ($salary) {
                            $query->where('upper_amount', '>=', $salary)
                                  ->orWhere('upper_amount', '=', -1);
                        })
                        ->first(['rate', 'bias']);
                    $tax_rate = $tax_info->rate ?? 0;
                    $bias = $tax_info->bias ?? 0;
                    $bias_per_day = $bias / $payroll_days;
                    $last_bias = $resigned_or_new_start ? $bias_per_day * $count_date : $bias;

                    $payroll->tax_base = ($last_salary - $last_allowance) * ($tax_rate / 100) - $last_bias;
                    if ($payroll->tax_base < 0) {
                        $payroll->tax_base = 0;
                    }
                    $payroll->total = $last_salary - ($payroll->tax_base + $deduction);

                }
                else {
                    $payroll->tax_base = 0;
                    $payroll->total = $last_salary - $deduction;
                }

            }

            elseif ($check_benefit && $check_benefit->tax_option_id == 2)
            {
                $salary = $payroll->salary;
                $salary_per_day = $salary / $payroll_days;
                $last_salary = $resigned_or_new_start ? $salary_per_day * $count_date : $salary;

                if ($payroll->apply_payroll_tax == 0) {
                    $tax_info = DB::table('tax_brackets')
                        ->where('lower_amount', '<=', $salary)
                        ->where(function($query) use ($salary) {
                            $query->where('upper_amount', '>=', $salary)
                                  ->orWhere('upper_amount', '=', -1);
                        })
                        ->first(['rate', 'bias']);
                    $tax_rate = $tax_info->rate ?? 0;
                    $bias = $tax_info->bias ?? 0;
                    $bias_per_day = $bias / $payroll_days;
                    $last_bias = $resigned_or_new_start ? $bias_per_day * $count_date : $bias;

                    $payroll->tax_base = ($last_salary - $last_allowance) * ($tax_rate / 100) - $last_bias;
                    isset($payroll->tax_base) ? $payroll->tax_base : $payroll->tax_base = 0;

                    $payroll->total = $last_salary + $benefit - ($payroll->tax_base + $deduction);

                } else {
                    $payroll->tax_base = 0;
                    $payroll->total = $last_salary + $benefit - $deduction;
                }
            }

            elseif ($check_benefit && $check_benefit->tax_option_id == 3)
            {
                $salary = $payroll->salary;
                $salary_per_day = $salary / $payroll_days;
                $last_salary = $resigned_or_new_start ? $salary_per_day * $count_date : $salary;

                $benefit_flat_tax_rate = DB::table('emp_benefits')->where('emp_id', $payroll->emp_id)->value('flat_tax_rate') ?? 0;

                if ($payroll->apply_payroll_tax == 0)
                {
                    $tax_info = DB::table('tax_brackets')
                        ->where('lower_amount', '<=', $salary)
                        ->where(function($query) use ($salary) {
                            $query->where('upper_amount', '>=', $salary)
                                  ->orWhere('upper_amount', '=', -1);
                        })
                        ->first(['rate', 'bias']);
                    $tax_rate = $tax_info->rate ?? 0;
                    $bias = $tax_info->bias ?? 0;
                    $bias_per_day = $bias / $payroll_days;
                    $last_bias = $resigned_or_new_start ? $bias_per_day * $count_date : $bias;

                    $payroll->tax_base = ($last_salary - $last_allowance) * ($tax_rate / 100) - $last_bias;
                        if ($payroll->tax_base < 0) {
                            $payroll->tax_base = 0;
                        }
                        $benefit_tax = $benefit * ($benefit_flat_tax_rate / 100);
                        $payroll->total = ($last_salary + $benefit) - ($payroll->tax_base + $benefit_tax + $deduction);
                }
                else {
                    $payroll->tax_base = 0;
                    $payroll->total = $last_salary + $benefit - $deduction;
                }
            }
            else
            {
                $salary = $payroll->salary;
                $salary_per_day = $salary / $payroll_days;
                $last_salary = $resigned_or_new_start ? $salary_per_day * $count_date : $salary;

                if ($payroll->apply_payroll_tax == 0) {
                    $tax_info = DB::table('tax_brackets')
                        ->where('lower_amount', '<=', $salary)
                        ->where(function($query) use ($salary) {
                            $query->where('upper_amount', '>=', $salary)
                                ->orWhere('upper_amount', '=', -1);
                        })
                        ->first(['rate', 'bias']);
                    $tax_rate = $tax_info->rate ?? 0;
                    $bias = $tax_info->bias ?? 0;
                    $bias_per_day = $bias / $payroll_days;
                    $last_bias = $resigned_or_new_start ? $bias_per_day * $count_date : $bias;


                        $payroll->tax_base = ($last_salary - $last_allowance) * ($tax_rate / 100) - $last_bias;
                        if ($payroll->tax_base < 0) {
                            $payroll->tax_base = 0;
                        }
                        $payroll->total = $last_salary - ($payroll->tax_base + $deduction);

                } else {
                    $payroll->tax_base = 0;
                    $payroll->total = $last_salary - $deduction;
                }
            }

            $row = DB::table('payroll_list')->where('id', $payroll->id)->update([
                'tax_base' => $payroll->tax_base,
                'benefit_tax' => $benefit_tax,
                'count_day' => $count_date,
                'p_salary' => $last_salary,
                'p_allowance' => $last_allowance,
                'p_bias' => $last_bias,
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
        $master_account_id = 1;

        $existingDisbursement = DB::table('payroll_list')
            ->where('id', $id)
            ->value('disburse');

        if ($existingDisbursement) {
            return DV::error('Payroll has already been disbursed');
        }

        $trx = DB::table('payroll_list as pl')
                ->join('payrolls as p', 'p.id', '=', 'pl.payroll_id')
                ->join('accounts as a', 'a.emp_id', '=', 'pl.emp_id')
                ->where('pl.id', $id)
                ->selectRaw('total_salary as amount,pl.emp_id,pl.payroll_id,p.name as remarks,a.id as account_id,p.authorized,a.account_number')->first();
        if (!$trx) {
            return DV::error('Payroll List not found');
        }
        if(!$trx->authorized){
            return DV::error($trx->remarks.' is not authorized ');
        }
        $to_account = Employee::getPayrollAccount($trx->emp_id);

        if(!$to_account){
            return DV::error('Employee does not have payroll account');
        }
        $trx->trx_type=3;
        $trx->account_id = $to_account->account_id;
        $trx->from_account_id = $master_account_id;
        $trx->to_account_id = $to_account->account_id;

        if(!$trx->authorized){
            return DV::error($trx->remarks.' is not authorized ');
        }
        $transfer = Transaction::createTransaction((array)$trx, $ss);
        $transfer_amount = 0;

        if($transfer){
            $transfer_amount = $transfer['transaction']['amount'];
            $updateBalance_acc = PayrollList::updateBalance($transfer['transaction']['account_id'],'accounts','in', $transfer_amount, $transfer['trx_id'], $ss);
        }

        $withdrawData = (array)$trx;
        unset($withdrawData['account_id']);

        $res = Account::withdraw($withdrawData, $ss);

        if($res->status == 'Error'){
            return $res;
        }
        $trx = (object)$res->data;
        if($trx){
            $updateBalance_def = PayrollList::updateBalance($master_account_id,'accounts','out',  $trx->transaction['amount'], $trx->trx_id, $ss);
        }

        if($updateBalance_acc && $updateBalance_def){
            $query = DB::table('payroll_list')
                ->where('id', $id)
                ->update([
                    'disburse' => 1,
                    'trx_id' => hex2bin($trx->trx_id),
                ]);

            return DV::depends(1, ['Payroll Disbursed' => $query]);
        }
        return DV::error('Disbursement failed');

    }

    static function updateBalance($account_id,$table_name,$status, $amount, $trx_id, $ss = null)
    {
        if(!$account_id || !$trx_id){
            return DV::error('Invalid account id');
        }
        if(!$amount){
            $amount = 0;
        }
        $lastBalance = DB::table($table_name)->where('id', $account_id)->value('balance');
        if($status==='in'){
            $newBalance = (float)$lastBalance + (float)$amount;
        }else if($status==='out'){
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
        $master_account_id = 1;

        $undisbursed = DB::table('payroll_list')
            ->where('payroll_id', $payroll_id)
            ->where('disburse', 0)
            ->first();

        if (!$undisbursed) {
            return DV::error('Payroll List Already Disbursed');
        }

        $payrollEntries = DB::table('payroll_list as pl')
            ->join('payrolls as p', 'p.id', '=', 'pl.payroll_id')
            ->join('accounts as a', function ($join) {
                $join->on('a.emp_id', '=', 'pl.emp_id')
                     ->where('a.account_type', 'Payroll');
            })
            ->where('pl.payroll_id', $payroll_id)
            ->where('pl.disburse', 0)
            ->selectRaw('pl.id, total_salary as amount, pl.emp_id, pl.payroll_id, p.name as remarks, a.id as account_id, p.authorized, a.account_number, pl.disburse')
            ->get();

        $results = [];

        foreach ($payrollEntries as $trx) {
            $to_account = Employee::getPayrollAccount($trx->emp_id);

            if (!$to_account) {
                $results[] = DV::error('Employee ID ' . $trx->emp_id . ' does not have a Payroll account');
                continue;
            }

            if (!$trx->authorized) {
                return DV::error($trx->remarks . ' is not authorized');
            }

            $trx->trx_type = 3;
            $trx->from_account_id = $master_account_id;
            $trx->to_account_id = $to_account->account_id;

            $transfer = Transaction::createTransaction((array) $trx, $ss);
            if (!$transfer) {
                $results[] = DV::error('Transfer failed for Employee ID ' . $trx->emp_id);
                continue;
            }

            $transfer_amount = $transfer['transaction']['amount'];

            $updateBalance_acc = PayrollList::updateBalance(
                $transfer['transaction']['account_id'], 'accounts', 'in',
                $transfer_amount, $transfer['trx_id'], $ss
            );

            $withdrawData = (array) $trx;
            unset($withdrawData['account_id']);
            $res = Account::withdraw($withdrawData, $ss);

            if ($res->status === 'Error') {
                $results[] = DV::error('Withdrawal failed for Employee ID ' . $trx->emp_id);
                continue;
            }

            $trx_result = (object) $res->data;

            $updateBalance_def = PayrollList::updateBalance(
                $master_account_id, 'accounts', 'out',
                $trx_result->transaction['amount'], $trx_result->trx_id, $ss
            );

            if ($updateBalance_acc && $updateBalance_def) {
                DB::table('payroll_list')
                    ->where('id', $trx->id)
                    ->update([
                        'disburse' => 1,
                        'trx_id' => hex2bin($trx_result->trx_id),
                    ]);

                $results[] = DV::depends(1, ['Payroll Disbursed for Employee ID ' . $trx->emp_id]);
            } else {
                $results[] = DV::error('Balance update failed for Employee ID ' . $trx->emp_id);
            }
        }

        return DV::depends(1, ['Payroll Disbursement Results' => $results]);
    }





    function paySlip($id, $ss)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $joining_date = DBX::formatDate('e.joining_date', 'joining_date');
        $start_date = DBX::formatDate('p.start_date', 'start_date');
        $end_date = DBX::formatDate('p.end_date', 'end_date');

        $row = DB::table('payroll_list as pl')
            ->join('employees as e', 'e.id', '=', 'pl.emp_id')
            ->join('positions as pos', 'pos.id', '=', 'e.position_id')
            ->join('payrolls as p', 'p.id', '=', 'pl.payroll_id')
            ->join('um_branches as b', 'b.id', '=', 'e.branch_id')
            ->join('payroll_list_benefits as plb', function ($join) {
                $join->on('plb.emp_id', '=', 'pl.emp_id')
                     ->on('plb.payroll_id', '=', 'pl.payroll_id');
            })
            ->selectRaw('pl.id,
                        p.id as payroll_id,
                        p.name as payroll_name,
                        ' . $start_date . ',
                        ' . $end_date . ',
                        e.id as emp_id,
                        e.code as emp_code,
                        e.name as emp_name,
                        e.sex,
                        pos.title as emp_position,
                        b.name as branch_name,
                        pl.salary,
                        pl.p_salary,
                        pl.count_day,
                        e.apply_payroll_tax,
                        plb.tax_option_id,
                        pl.benefit,
                        pl.deduction,
                        pl.tax_rate,
                        pl.bias,
                        pl.p_bias,
                        pl.p_allowance,
                        pl.tax_base,
                        pl.benefit_tax,
                        pl.total_salary,
                        ' . $joining_date . ',
                        e.photo_file_name as emp_photo')
            ->where('pl.id', $id)->first();

        if ($row) {

            $row->allowance = DB::table('tax_allowances')
                ->where('emp_id', $row->emp_id)
                ->value('allowance');


            $row->benefit = $row->benefit ?? 0.00;
            $row->deduction = $row->deduction ?? 0.00;
            $row->tax_base = $row->tax_base ?? 0.00;
            $row->total_salary = $row->total_salary ?? 0.00;


            $row->image_url = $row->emp_photo
                ? Employee::profilePicture($row->emp_id)
                : '';
            unset($row->emp_photo);
        }

        return $row;
    }


}
