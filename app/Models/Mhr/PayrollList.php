<?php

namespace App\Models\Mhr;

use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use App\Models\Prm\GeneralSettings;
use App\Models\Mhr\Employee;

class PayrollList //extends Model
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function addDeduction($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $v_rule = [
            'payroll_id' => '1|number|exists=payrolls.id',
            'emp_id' => '1|number',
            'deduction' => '1|number',
        ];

        $res = DBX::validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;

        $id = DBX::saveData($ss, 'payroll_list', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['payroll_list' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving payroll');
    }

    // function getList($arr, $ss)
    // {
    //     $d = (object) $arr;

    //     $current_page = $d->current_page ?? 1;
    //     $per_page = $d->per_page ?? 10;
    //     if (!is_numeric($current_page)) {
    //         $current_page = 1;
    //     }

    //     $skip_rows = ($current_page - 1) * $per_page;

    //     $search_value = $d->search_value ?? null;
    //     $search_id = $d->id ?? null;
    //     $filter_by = $d->payroll_id ?? null;
    //     $branch_id = $d->branch_id ?? null;
    //     $sort_by = $d->sort_by ?? 'pl.id';
    //     $sort_order = $d->sort_order ?? 'asc';
    //     $disbursed = $d->disbursed ?? null;
    //     $str_search = '1=1';

    //     $query = DB::table('payroll_list as pl')
    //         ->join('employees as e', 'e.id', '=', 'pl.emp_id')
    //         ->join('positions as pos', 'pos.id', '=', 'e.position_id')
    //         ->join('payrolls as p', 'p.id', '=', 'pl.payroll_id')
    //         ->join('um_branches as b', 'b.id', '=', 'e.branch_id')
    //         ->selectRaw('pl.id,
    //                     p.id as payroll_id,
    //                     p.name as payroll_name,
    //                     p.exchange_rate,
    //                     e.id as emp_id,
    //                     e.name as emp_name,
    //                     e.phone_number,
    //                     pos.title as emp_position,
    //                     b.name as branch_name,
    //                     pl.salary,
    //                     e.apply_payroll_tax,
    //                     pl.tax_rate,
    //                     pl.bias,
    //                     pl.deduction,
    //                     pl.tax_base,
    //                     pl.benefit_tax,
    //                     pl.total_salary,
    //                     pl.disbursed,
    //                     p.currency_code,
    //                     e.photo_file_name as emp_photo')
    //         // ->where('pl.emp_id',7)
    //         ->whereRaw($str_search);

    //     if ($search_id) {
    //         $query->where('pl.id', $search_id);
    //     }
    //     if ($search_value) {
    //         $search_value = escape_like_str($search_value);
    //         $query->whereRaw("e.name like '%{$search_value}%' or pos.title like '%{$search_value}%' or e.phone_number like '%{$search_value}%'");
    //     }
    //     if ($filter_by) {
    //         $query->where('pl.payroll_id', $filter_by);
    //     }
    //     //  else {
    //     //     $current_month_start = now()->startOfMonth()->toDateString();
    //     //     $current_month_end = now()->endOfMonth()->toDateString();
    //     //     $query->whereBetween('p.start_date', [$current_month_start, $current_month_end])
    //     //         ->orWhereBetween('p.end_date', [$current_month_start, $current_month_end]);
    //     // }
    //     if ($branch_id) {
    //         $query->where('e.branch_id', $branch_id);
    //     }

    //     if (!is_null($disbursed)) {
    //         $query->where('pl.disbursed', $disbursed);
    //     }

    //     $query->orderBy($sort_by, $sort_order);
    //     $clone_query = clone $query;
    //     $count = $clone_query->count('p.id');
    //     $rows = $query->skip($skip_rows)->take($per_page)->get();

    //     foreach ($rows as $row) {
    //         $row->image_url = '';
    //         if ($row->emp_photo) {
    //             $row->image_url = Employee::profilePicture($row->emp_id);
    //         }
    //         unset($row->emp_photo);
    //         //Tax allowance currency must be the same as National Currency
    //         $row->allowance = DB::table('tax_allowances')
    //             ->where('emp_id', $row->emp_id)
    //             ->selectRaw('id,allowance,currency_code as allowance_currency');

    //         $row->benefit_taxable = DB::table('payroll_list_benefits')
    //             ->where('emp_id', $row->emp_id)
    //             ->where('payroll_id', $row->payroll_id)
    //             ->where('tax_option_id', 1)
    //             ->selectRaw('emp_benefit_id,used_amount');

    //         $row->benefit_non_tax = DB::table('payroll_list_benefits')
    //             ->where('emp_id', $row->emp_id)
    //             ->where('payroll_id', $row->payroll_id)
    //             ->where('tax_option_id', 2)
    //             ->selectRaw('emp_benefit_id,used_amount');

    //         $row->benefit_flat_rate = DB::table('payroll_list_benefits')
    //             ->where('emp_id', $row->emp_id)
    //             ->where('payroll_id', $row->payroll_id)
    //             ->where('tax_option_id', 3)
    //             ->selectRaw('emp_benefit_id,used_amount,flat_tax_rate');

    //         $emp_allowance_count = DB::table('tax_allowances')
    //             ->where('emp_id', $row->emp_id)
    //             ->count('id');

    //         $emp_benefit_count = DB::table('emp_benefits')
    //             ->where('emp_id', $row->emp_id)
    //             ->count('id');

    //         $row->emp_allowance_count = $emp_allowance_count;
    //         $row->emp_benefit_count = $emp_benefit_count;
    //         $used_amount = [];
    //         $flat_tax_rates = [];

    //         if ($emp_allowance_count > 1) {
    //             $row->allowance = $row->allowance->get();
    //             foreach ($row->allowance as $allowance) {
    //                 if ($allowance->allowance_currency != $row->currency_code) {
    //                     $allowance->allowance = VSMoney::convert($ss, $allowance->allowance, $allowance->allowance_currency, $row->currency_code, (1 / $row->exchange_rate));
    //                 }
    //             }
    //             $row->allowance = $row->allowance->sum('allowance');
    //         } else {
    //             $allowance = $row->allowance->first();
    //             if ($allowance) {
    //                 if ($allowance->allowance_currency != $row->currency_code) {
    //                     $row->allowance = VSMoney::convert($ss, $allowance->allowance, $allowance->allowance_currency, $row->currency_code, (1 / $row->exchange_rate));
    //                 } else {
    //                     $row->allowance = $allowance->allowance;
    //                 }
    //             } else {
    //                 $row->allowance = 0;
    //             }
    //         }

    //         if ($emp_benefit_count > 1) {
    //             $row->benefit_taxable = $row->benefit_taxable->get();
    //             $row->benefit_non_tax = $row->benefit_non_tax->get();

    //             $row->benefit_taxable = $row->benefit_taxable->sum('used_amount');
    //             $row->benefit_non_tax = $row->benefit_non_tax->sum('used_amount');
    //         } else {
    //             $row->benefit_taxable = $row->benefit_taxable->first();
    //             $row->benefit_non_tax = $row->benefit_non_tax->first();
    //             $row->benefit_taxable = $row->benefit_taxable->used_amount ?? 0;
    //             $row->benefit_non_tax = $row->benefit_non_tax->used_amount ?? 0;
    //         }

    //         if ($emp_benefit_count > 1) {
    //             $benefitFlatRates = $row->benefit_flat_rate->get();
    //             $usedAmountByTaxRate = [];

    //             foreach ($benefitFlatRates as $bfr) {
    //                 $taxRate = (float) $bfr->flat_tax_rate;
    //                 $usedAmount = (float) $bfr->used_amount;

    //                 if (!isset($usedAmountByTaxRate[$taxRate])) {
    //                     $usedAmountByTaxRate[$taxRate] = 0;
    //                 }

    //                 $usedAmountByTaxRate[$taxRate] += $usedAmount;
    //             }

    //             $row->benefit_flat_rate = $benefitFlatRates;
    //             $row->used_amount = $usedAmountByTaxRate;
    //         } else {
    //             $benefitFlatRate = $row->benefit_flat_rate->first();
    //             $row->benefit_flat_rate = $benefitFlatRate ? [$benefitFlatRate] : 0;
    //             $row->used_amount = $benefitFlatRate ? [(float) $benefitFlatRate->flat_tax_rate => (float) $benefitFlatRate->used_amount] : 0;
    //         }

    //         $row->tax_base = ($row->tax_base ?? 0);
    //         $row->total_salary = ($row->total_salary ?? 0);
    //         $row->deduction = ($row->deduction ?? 0);
    //         $row->allowance = ($row->allowance ?? 0);
    //         $row->benefit_taxable = ($row->benefit_taxable ?? 0);
    //         $row->benefit_non_tax = ($row->benefit_non_tax ?? 0);
    //         $row->benefit_flat_rate = ($row->benefit_flat_rate ?? 0);
    //     }

    //     return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    // }

    function getDetails($id, $ss)
    {
        $ss = $ss ?? $this->userInfo;
        $auth_db = config('database.connections.auth_db.database');
        $branch_id = $ss->branch_id;
        $joining_date = DBX::formatDate('e.joining_date', 'joining_date');

        $row = DB::table('payroll_list as pl')
            ->join('employees as e', 'e.id', '=', 'pl.emp_id')
            ->join('positions as pos', 'pos.id', '=', 'e.position_id')
            ->join('payrolls as p', 'p.id', '=', 'pl.payroll_id')
            ->join("$auth_db.um_branches as b", 'b.id', '=', 'e.branch_id')
            ->selectRaw('pl.id,
                    p.id as payroll_id,
                    p.name as payroll_name,
                    e.id as emp_id,
                    e.code as emp_code,
                    e.name as emp_name,
                    e.sex,
                    pos.name as emp_position,
                    b.name as branch_name,
                    pl.salary,
                    e.apply_payroll_tax,
                    pl.deduction,
                    pl.tax_rate,
                    pl.bias,
                    pl.tax_base,
                    pl.benefit_tax,
                    pl.total_salary,
                    pl.disbursed,
                    ' . $joining_date . ',
                    e.photo_file_name as emp_photo')
            ->where('pl.id', $id)->first();

        if ($row) {
            $row->allowance = DB::table('tax_allowances')
                ->where('emp_id', $row->emp_id)
                ->value('allowance');

            $row->benefit_taxable = DB::table('payroll_list_benefits')
                ->where('emp_id', $row->emp_id)
                ->where('payroll_id', $row->payroll_id)
                ->where('tax_option_id', 1)
                ->value('used_amount');

            $row->benefit_non_tax = DB::table('payroll_list_benefits')
                ->where('emp_id', $row->emp_id)
                ->where('payroll_id', $row->payroll_id)
                ->where('tax_option_id', 2)
                ->value('used_amount');

            $row->benefit_flat_rate = DB::table('payroll_list_benefits')
                ->where('emp_id', $row->emp_id)
                ->where('payroll_id', $row->payroll_id)
                ->where('tax_option_id', 3)
                ->value('used_amount');

            $row->flat_tax_rate = DB::table('emp_benefits')
                ->where('emp_id', $row->emp_id)
                ->where('tax_option_id', 3)
                ->value('flat_tax_rate');

            $row->allowance = ($row->allowance ?? 0);
            $row->benefit_taxable = ($row->benefit_taxable ?? 0);
            $row->benefit_non_tax = ($row->benefit_non_tax ?? 0);
            $row->benefit_flat_rate = ($row->benefit_flat_rate ?? 0);
            $row->flat_tax_rate = ($row->flat_tax_rate ?? 0);
        }
        return $row;
    }

    function getFormOptions($id, $ss)
    {
        $payroll_list = null;
        $emp_deduct_id = null;
        $emp_deduct_amount = null;
        if ($id) {
            $payroll_list = $this->getDetails($id, $ss);
            if ($payroll_list) {
                $payroll = DB::table('payrolls')->where('id', $payroll_list->payroll_id)->selectRaw('start_date, end_date')->first();
                if ($payroll) {
                    $emp_deduct_row = DB::table('emp_deductions')
                        ->where('emp_id', $payroll_list->emp_id)
                        ->whereBetween('deduct_date', [$payroll->start_date, $payroll->end_date])
                        ->where(function ($query) {
                            $query->whereNull('issues')
                                ->orWhere('issues', '')
                                ->orWhere('issues', 'not like', 'Uninformed Leave%');
                        })
                        ->orderBy('id', 'desc')
                        ->first();

                    if ($emp_deduct_row) {
                        $emp_deduct_id = $emp_deduct_row->id;
                        $emp_deduct_amount = $emp_deduct_row->deduct_amount;
                    }
                }
            }
        }
        return (object) [

            'sort_by' => [
                ['id' => 'e.name', 'name' => 'By Name'],
                ['id' => 'e.salary', 'name' => 'By Salary'],

            ],
            'disbursed' => [
                ['id' => 0, 'name' => 'Pending'],
                ['id' => 1, 'name' => 'Disbursed'],
            ],

            'employees' => GeneralSettings::options_employee(10, $ss),
            'payrolls' => GeneralSettings::options_payroll($ss),
            // 'branches' => GeneralSettings::options_branch($ss),
            'payroll_list' => $payroll_list,
            'emp_deduct_id' => $emp_deduct_id,
            'emp_deduct_amount' => $emp_deduct_amount,
        ];
    }

    function delete($id = null)
    {
        $id = $id ?? $this->id;
        $emp = DB::table('payrolls as p')->join('payroll_list as l', 'l.payroll_id', '=', 'p.id')->where('l.id', $id)->selectRaw('p.id as payroll_id, l.id, p.authorized, p.disbursed AS payroll_disbursed, l.disbursed AS staff_disbursed')->first();
        if (!$emp) return DV::error('The staff identity was not found in the payroll list. It seems he or she is not included in the payroll');
        if ($emp->authorized == 1 || $emp->staff_disbursed == 1) return DV::error('Cannot remove the staff because the payroll has been authorized or disbursed already!');
        $x = DB::table('payroll_list')
            ->where('id', $id)
            ->delete();
        return DV::depends($x, null, 'Failed to remove staff from payroll');
    }

    // function disburseOne($id, $ss = null)
    // {
    //     $ss = $ss ?? $this->userInfo;
    //     $master_account_id = 1;
    //     if (self::isDisbursed($id)) {
    //         return DV::error('This payroll amount has been disbursed already!');
    //     }
    //     $emp = DB::table('payroll_list as pl')
    //     ->join('employees as e', 'e.id', '=', 'pl.emp_id')
    //     ->join('payrolls as p', 'p.id', '=', 'pl.payroll_id')
    //     ->join('accounts as a', 'a.emp_id', '=', 'pl.emp_id')
    //     ->where('pl.id', $id)
    //         ->selectRaw('pl.id, total_salary as amount, e.id AS emp_id, e.name, e.code, e.phone_number, pl.payroll_id, p.name as remarks, p.exchange_rate, a.id as account_id, p.currency_code')
    //         ->first();
    //     if (!$emp) {
    //         return DV::error('The provided staff identity does not exist');
    //     }
    //     $payroll = Payroll::getProps($emp->payroll_id, 'id, name, currency_code, total, exchange_rate');
    //     if (!$payroll) {
    //         return DV::error('The provided payroll ID does not exist');
    //     }
    //     if (!Payroll::isAuthorized($emp->payroll_id)) {
    //         return DV::error('This payroll has not been authorized!');
    //     }
    //     $master_account = DB::table('accounts')->where('id', $master_account_id)
    //         ->selectRaw('id, balance, currency_code')->first();
    //     if (!$master_account) {
    //         return DV::error('Master account not found! This is required to disburse payroll.');
    //     }

    //     if ($master_account->balance <= 0) {
    //         return DV::error('The master payroll account balance is zero!');
    //     }
    //     if ($payroll->currency_code !== $master_account->currency_code) {
    //         $master_amount = VSMoney::convert($ss, $master_account->balance, $master_account->currency_code, $payroll->currency_code, $payroll->exchange_rate);
    //     } else {
    //         $master_amount = $master_account->balance;
    //     }
    //     if ($master_amount < $emp->amount) {
    //         return DV::error('Insufficient balance of the Master Payroll Account. Required: ' . $payroll->currency_code . ' ' . $emp->amount);
    //     }
    //     $to_account = Employee::getPayrollAccount($emp->emp_id);
    //     if (!$to_account) {
    //         return DV::error('Employee does not have a payroll account');
    //     }
    //     $trx_inputs = [
    //         'to_account_id' => $to_account->account_id,
    //         'payroll_id' => $to_account->payroll_id,
    //         'amount' => $emp->amount,
    //         'exchange_rate' => $payroll->exchange_rate,
    //         'remarks' => $emp->remarks
    //     ];

    //     $account = new Account(1, $ss);
    //     $res = $account->transferTo($trx_inputs);

    //     if ($res->status_code === 200) {
    //         DB::table('payroll_list')->where('id', $id)->update([
    //             'disbursed' => 1,
    //         ]);
    //         return DV::depends(1);
    //     } else {
    //         return DV::error($res->error_message);
    //     }
    // }


    static function isDisbursed($id)
    {
        if (!$id) return false;
        $x = DB::table('payroll_list as l')->where('l.id', $id)->value('disbursed');
        return $x == 1;
    }

    function paySlip($id, $ss)
    {
        $ss = $ss ?? $this->userInfo;
        $joining_date = DBX::formatDate('e.joining_date', 'joining_date');
        $start_date = DBX::formatDate('p.start_date', 'start_date');
        $end_date = DBX::formatDate('p.end_date', 'end_date');

        $row = DB::table('payroll_list as pl')
            ->join('employees as e', 'e.id', '=', 'pl.emp_id')
            ->join('positions as pos', 'pos.id', '=', 'e.position_id')
            ->join('payrolls as p', 'p.id', '=', 'pl.payroll_id')
            ->leftJoin('payroll_list_benefits as plb', function ($join) {
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
                        e.phone_number,
                        e.apply_payroll_tax,
                        pos.name as emp_position,
                        pl.p_salary,
                        pl.benefit_taxable,
                        pl.benefit_non_tax,
                        pl.benefit_flat_rate,
                        pl.count_day,
                        pl.currency_code,
                        e.apply_payroll_tax,
                        plb.tax_option_id,
                        plb.flat_tax_rate,
                        pl.p_allowance,
                        pl.deduction,
                        pl.tax_rate,
                        pl.tax_base,
                        pl.benefit_tax,
                        pl.total_salary,
                        ' . $joining_date . ',
                        e.photo_file_name as emp_photo')
            ->where('pl.id', $id)->first();

        if ($row) {

            // $row->allowance = DB::table('tax_allowances')
            //     ->where('emp_id', $row->emp_id)
            //     ->value('allowance');


            $row->deduction = $row->deduction ?? 0.00;
            $row->tax_base = $row->tax_base ?? 0.00;
            $row->total_salary = $row->total_salary ?? 0.00;

            $row->flat_tax_rate = DB::table('emp_benefits')
                ->where('emp_id', $row->emp_id)
                ->where('tax_option_id', 3)
                ->value('flat_tax_rate');

            $row->flat_tax_rate = DB::table('emp_benefits')
                ->where('emp_id', $row->emp_id)
                ->where('tax_option_id', 3)
                ->value('flat_tax_rate');

            $row->image_url = $row->emp_photo
                ? Employee::profilePicture($row->emp_id)
                : '';
            unset($row->emp_photo);
        }
        return $row;
    }

    static function getResigInfo($emp_id, $payroll_start_date, $payroll_end_date)
    {
        $q_date = DBX::convertToDate('r.effective_date');
        $str_date = "$q_date BETWEEN '$payroll_start_date' AND '$payroll_end_date'";
        return DB::table('resignations as r')->where('emp_id', $emp_id)->whereRaw($str_date)->selectRaw('r.id, r.effective_date')->orderby('r.effective_date', 'desc')->first();
    }

    static function count_days_resign($emp_id, $payroll_start_date, $payroll_end_date)
    {

        $resigned_or_new_start = false;
        $count_days = -1;
        $resignInfo = self::getResigInfo($emp_id, $payroll_start_date, $payroll_end_date);
        if (!$resignInfo) {
            return (object)['error' => null, 'count_days' => $count_days, 'resigned_or_new_start' => false];
        }
        $effective_date = convertDate($resignInfo->effective_date);
        if ($effective_date >= $payroll_start_date && $effective_date <= $payroll_end_date) {
            $count_days = dateDiff_days($payroll_start_date, $effective_date);
            $resigned_or_new_start = true;
        }
        return (object)['error' => null, 'count_days' => $count_days, 'resigned_or_new_start' => $resigned_or_new_start];
    }
    /** count_days_rejoin() count effective days for rejoin and joining emp */
    static function count_days_rejoin($emp_id, $emp_status_id, $rejoin_date, $joining_date, $payroll_start_date, $payroll_end_date)
    {

        $count_days = -1;
        $resigned_or_new_start = false;
        if ($rejoin_date) {

            if ($rejoin_date >= $payroll_start_date && $rejoin_date <= $payroll_end_date && $emp_status_id === 10) {
                $count_days = dateDiff_days($rejoin_date, $payroll_end_date) + 1;
                $resigned_or_new_start = true;
                return (object)['error' => null, 'count_days' => $count_days, 'resigned_or_new_start' => $resigned_or_new_start];
            }
        } elseif ($joining_date) {

            if ($joining_date >= $payroll_start_date && $joining_date <= $payroll_end_date  && $emp_status_id === 10) {
                $count_days = dateDiff_days($joining_date, $payroll_end_date) + 1;
                $resigned_or_new_start = true;
                return (object)['error' => null, 'count_days' => $count_days, 'resigned_or_new_start' => $resigned_or_new_start];
            }
        }
        return (object)['error' => null, 'count_days' => -1, 'resigned_or_new_start' => $resigned_or_new_start];
    }
}
