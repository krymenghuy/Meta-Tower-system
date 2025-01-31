<?php

namespace App\Models\Bhr;

use App\Models\DV;
use App\Models\JDV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\DBX;
use App\Models\Bhr\Employee;
use App\Models\Bhr\Account;
use App\Models\Bhr\Payroll;
use App\Models\Money;
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

    function save($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $v_rule = [
            'payroll_id' => '1|number',
            'emp_id' => '1|number',
            // 'salary' => '0|number',
            // 'benefit' => '0|number',
            'deduction' => '0|number',
            'disbursed' => '0|number|default = 0',
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

        $id = saveData($ss, 'payroll_list', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['payroll_list' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving payroll');
    }

    function getList($arr, $ss)
    {
        $d = (object) $arr;

        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }

        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $search_id = $d->id ?? null;
        $filter_by = $d->payroll_id ?? null;
        $branch_id = $d->branch_id ?? null;
        $sort_by = $d->sort_by ?? 'pl.id';
        $sort_order = $d->sort_order ?? 'asc';
        $disbursed = $d->disbursed ?? null;
        $str_search = '1=1';

        $query = DB::table('payroll_list as pl')
            ->join('employees as e', 'e.id', '=', 'pl.emp_id')
            ->join('positions as pos', 'pos.id', '=', 'e.position_id')
            ->join('payrolls as p', 'p.id', '=', 'pl.payroll_id')
            ->join('um_branches as b', 'b.id', '=', 'e.branch_id')
            ->selectRaw('pl.id,
                        p.id as payroll_id,
                        p.name as payroll_name,
                        p.exchange_rate,
                        e.id as emp_id,
                        e.name as emp_name,
                        e.phone_number,
                        pos.title as emp_position,
                        b.name as branch_name,
                        pl.salary,
                        e.apply_payroll_tax,
                        pl.tax_rate,
                        pl.bias,
                        pl.deduction,
                        pl.tax_base,
                        pl.benefit_tax,
                        pl.total_salary,
                        pl.disbursed,
                        p.currency_code,
                        e.photo_file_name as emp_photo')
            // ->where('pl.emp_id',7)
            ->whereRaw($str_search);

        if ($search_id) {
            $query->where('pl.id', $search_id);
        }
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->whereRaw("e.name like '%{$search_value}%' or pos.title like '%{$search_value}%' or e.phone_number like '%{$search_value}%'");
        }
        if ($filter_by) {
            $query->where('pl.payroll_id', $filter_by);
        }
        //  else {
        //     $current_month_start = now()->startOfMonth()->toDateString();
        //     $current_month_end = now()->endOfMonth()->toDateString();
        //     $query->whereBetween('p.start_date', [$current_month_start, $current_month_end])
        //         ->orWhereBetween('p.end_date', [$current_month_start, $current_month_end]);
        // }
        if ($branch_id) {
            $query->where('e.branch_id', $branch_id);
        }

        if (!is_null($disbursed)) {
            $query->where('pl.disbursed', $disbursed);
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
            //Tax allowance currency must be the same as National Currency
            $row->allowance = DB::table('tax_allowances')
                ->where('emp_id', $row->emp_id)
                ->selectRaw('id,allowance,currency_code as allowance_currency');

            $row->benefit_taxable = DB::table('payroll_list_benefits')
                ->where('emp_id', $row->emp_id)
                ->where('payroll_id', $row->payroll_id)
                ->where('tax_option_id', 1)
                ->selectRaw('emp_benefit_id,used_amount');

            $row->benefit_non_tax = DB::table('payroll_list_benefits')
                ->where('emp_id', $row->emp_id)
                ->where('payroll_id', $row->payroll_id)
                ->where('tax_option_id', 2)
                ->selectRaw('emp_benefit_id,used_amount');

            $row->benefit_flat_rate = DB::table('payroll_list_benefits')
                ->where('emp_id', $row->emp_id)
                ->where('payroll_id', $row->payroll_id)
                ->where('tax_option_id', 3)
                ->selectRaw('emp_benefit_id,used_amount,flat_tax_rate');

            $emp_allowance_count = DB::table('tax_allowances')
                ->where('emp_id', $row->emp_id)
                ->count('id');

            $emp_benefit_count = DB::table('emp_benefits')
                ->where('emp_id', $row->emp_id)
                ->count('id');

            $row->emp_allowance_count = $emp_allowance_count;
            $row->emp_benefit_count = $emp_benefit_count;
            $used_amount = [];
            $flat_tax_rates = [];

            if ($emp_allowance_count > 1) {
                $row->allowance = $row->allowance->get();
                foreach ($row->allowance as $allowance) {
                    if ($allowance->allowance_currency != $row->currency_code) {
                        $allowance->allowance = Money::convert($ss, $allowance->allowance, $allowance->allowance_currency, $row->currency_code, (1 / $row->exchange_rate));
                    }
                }
                $row->allowance = $row->allowance->sum('allowance');
            } else {
                $allowance = $row->allowance->first();
                if ($allowance) {
                    if ($allowance->allowance_currency != $row->currency_code) {
                        $row->allowance = Money::convert($ss, $allowance->allowance, $allowance->allowance_currency, $row->currency_code, (1 / $row->exchange_rate));
                    } else {
                        $row->allowance = $allowance->allowance;
                    }
                } else {
                    $row->allowance = 0;
                }
            }

            if ($emp_benefit_count > 1) {
                $row->benefit_taxable = $row->benefit_taxable->get();
                $row->benefit_non_tax = $row->benefit_non_tax->get();

                $row->benefit_taxable = $row->benefit_taxable->sum('used_amount');
                $row->benefit_non_tax = $row->benefit_non_tax->sum('used_amount');
            } else {
                $row->benefit_taxable = $row->benefit_taxable->first();
                $row->benefit_non_tax = $row->benefit_non_tax->first();
                $row->benefit_taxable = $row->benefit_taxable->used_amount ?? 0;
                $row->benefit_non_tax = $row->benefit_non_tax->used_amount ?? 0;
            }

            if ($emp_benefit_count > 1) {
                $benefitFlatRates = $row->benefit_flat_rate->get();
                $usedAmountByTaxRate = [];

                foreach ($benefitFlatRates as $bfr) {
                    $taxRate = (float) $bfr->flat_tax_rate;
                    $usedAmount = (float) $bfr->used_amount;

                    if (!isset($usedAmountByTaxRate[$taxRate])) {
                        $usedAmountByTaxRate[$taxRate] = 0;
                    }

                    $usedAmountByTaxRate[$taxRate] += $usedAmount;
                }

                $row->benefit_flat_rate = $benefitFlatRates;
                $row->used_amount = $usedAmountByTaxRate;
            } else {
                $benefitFlatRate = $row->benefit_flat_rate->first();
                $row->benefit_flat_rate = $benefitFlatRate ? [$benefitFlatRate] : 0;
                $row->used_amount = $benefitFlatRate ? [(float) $benefitFlatRate->flat_tax_rate => (float) $benefitFlatRate->used_amount] : 0;
            }

            $row->tax_base = ($row->tax_base ?? 0);
            $row->total_salary = ($row->total_salary ?? 0);
            $row->deduction = ($row->deduction ?? 0);
            $row->allowance = ($row->allowance ?? 0);
            $row->benefit_taxable = ($row->benefit_taxable ?? 0);
            $row->benefit_non_tax = ($row->benefit_non_tax ?? 0);
            $row->benefit_flat_rate = ($row->benefit_flat_rate ?? 0);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getDetails($id, $ss)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $joining_date = DBX::formatDate('e.joining_date', 'joining_date');

        $row = DB::table('payroll_list as pl')
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
    function deletePayrollList($id = null)
    {
        $id = $id ?? $this->id;
        $query = DB::table('payroll_list')
            ->where('id', $id)
            ->delete();
        return DV::depends($query, null, 'Error deleting payroll list');
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
                ['id' => 'e.salary', 'name' => 'By Salary'],

            ],
            'disburse_statuses' => [
                ['id' => 0, 'name' => 'Pending'],
                ['id' => 1, 'name' => 'Disbursed'],
            ],

            'employees' => GeneralSettings::options_employee(10, $ss),
            'payrolls' => GeneralSettings::options_payroll($ss),
            'branches' => GeneralSettings::options_branch($ss),
            'payroll_list' => $payroll_list,
        ];
    }

    function importPayrollList($payroll_id, $ss)
    {
        if (!$payroll_id) {
            return JDV::error('Payroll not found');
        }

        $payroll = DB::table('payrolls')->where('id', $payroll_id)->first();
        if (!$payroll) {
            return JDV::error('Payroll period not found');
        }
        $start_date = $payroll->start_date;
        $end_date = $payroll->end_date;

        $ss = $ss ?? $this->userInfo;
        $payroll = Payroll::getProps($payroll_id, 'id,name,authorized,disbursed');
        if (!$payroll) {
            return DV::error('No Payroll ID provided');
        }
        if ($payroll->authorized == 1) return DV::error('Cannot import payroll that as been authorized! The next step is to disburse payments to all staffs');
        if ($payroll->disbursed == 1) return DV::error('Cannot import any amounts because this payroll has been disbursed already!');


        $payroll_info = DB::table('payrolls')->where('id', $payroll_id)->selectRaw('currency_code, exchange_rate')->first();
        $currency_code = $payroll_info->currency_code;
        $exchange_rate = $payroll_info->exchange_rate;
        if ($exchange_rate == 0) {
            $exchange_rate = 1;
        }

        $employees = DB::table('employees as e')
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
            ->selectRaw('e.id as emp_id, e.name, e.apply_payroll_tax, e.salary,e.currency_code as salary_currency')
            ->get();

        $success = 0;
        $error = 0;

        foreach ($employees as $emp) {
            $emp_salary = $emp->salary;
            $tax_base = $emp_salary;
            $payroll_list_benefit = Employee::getPayrollListBenefit($payroll_id, $emp->emp_id, $ss);

            if ($payroll_list_benefit) {
                $tax_option_id = DB::table('payroll_list_benefits')->where('payroll_id', $payroll_id)->where('emp_id', $emp->emp_id)->value('tax_option_id');

                if ($tax_option_id == 1) {
                    $tax_base = $emp_salary + $payroll_list_benefit->used_amount;
                    if ($emp->salary_currency != $currency_code || $payroll_list_benefit->currency_code != $currency_code) {

                        $tax_base = Money::convert($ss, $tax_base, $payroll_list_benefit->currency_code, $currency_code, (1 / $exchange_rate));
                    }
                }
            }
            if ($emp->salary_currency != $currency_code) {
                $emp_salary = Money::convert($ss, $emp_salary, $emp->salary_currency, $currency_code, (1 / $exchange_rate));
            }
            if ($emp->apply_payroll_tax == 1) {
                if ($currency_code != Money::$national_currency) {
                    if ($exchange_rate == 0) {
                        $exchange_rate = 1;
                    }
                    $tax_base = Money::convert($ss, $tax_base, Money::$national_currency, $currency_code, $exchange_rate);
                    $taxInfo = DB::table('tax_brackets')
                        ->where(function ($query) use ($tax_base) {
                            $query->whereRaw('lower_amount <= ?', [$tax_base])
                                ->whereRaw('(upper_amount >= ? OR upper_amount = -1)', [$tax_base]);
                        })
                        ->select('rate', 'bias')
                        ->first();
                    $taxInfo->bias = Money::convert($ss, $taxInfo->bias, Money::$national_currency, $currency_code, (1 / $exchange_rate));
                    // \Log::info('bias : '.json_encode($taxInfo->bias));
                } else {
                    $taxInfo = DB::table('tax_brackets')
                        ->where(function ($query) use ($tax_base) {
                            $query->whereRaw('lower_amount <= ?', [$tax_base])
                                ->whereRaw('(upper_amount >= ? OR upper_amount = -1)', [$tax_base]);
                        })
                        ->select('rate', 'bias')
                        ->first();
                }
                $emp->tax_rate = (object) [
                    'rate' => $taxInfo->rate,
                    'bias' => $taxInfo->bias
                ];
            } else {
                $emp->tax_rate = (object) ['rate' => 0, 'bias' => 0];
            }
            $inputs = [
                'payroll_id' => $payroll_id,
                'emp_id' => $emp->emp_id,
                'salary' => $emp_salary,
                'currency_code' => $currency_code,
                'tax_rate' => $emp->tax_rate->rate,
                'bias' => $emp->tax_rate->bias
            ];

            $test_id = DB::table('payroll_list')
                ->where('emp_id', $emp->emp_id)
                ->where('payroll_id', $payroll_id)
                ->value('id');

            $test_id = saveData($ss, 'payroll_list', ['id' => $test_id], $inputs, [], 1);

            if ($test_id) {
                $success++;
            }
        }
        DB::statement(DB::raw("
            UPDATE `payrolls` AS p
            SET `head_count` = (
                SELECT COUNT(l.id)
                FROM `payroll_list` AS l
                WHERE l.payroll_id = p.id
            )
        "));
        return DV::depends(1, ['success_count' => $success, 'error' => $error]);
    }

    function calculatePayrollList($payroll_id, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $payroll = Payroll::getProps($payroll_id, 'id,name,authorized,disbursed');
        if (!$payroll) {
            return DV::error('No Payroll ID provided');
        }
        if ($payroll->authorized == 1) return DV::error('Cannot calculate payroll that as been authorized! The next step is to disburse payments to all staffs');
        if ($payroll->disbursed == 1) return DV::error('Cannot calculate any amounts because this payroll has been disbursed already!');
        $start_date = DBX::formatDate('p.start_date', 'start_date');
        $end_date = DBX::formatDate('p.end_date', 'end_date');

        $payrolls = DB::table('payroll_list as pl')
            ->join('employees as e', 'e.id', '=', 'pl.emp_id')
            ->join('emp_types as el', 'el.id', '=', 'e.emp_type_id')
            ->join('payrolls as p', 'p.id', '=', 'pl.payroll_id')
            ->where('p.id', $payroll_id)
            // ->where('pl.emp_id', 7)
            ->selectRaw('pl.id,
                        p.id as payroll_id,
                        ' . $start_date . ',
                        ' . $end_date . ',
                        p.name as payroll_name,
                        p.month,
                        p.year,
                        e.id as emp_id,
                        e.name as emp_name,
                        el.name as emp_role,
                        pl.salary,
                        pl.tax_rate,
                        pl.bias,
                        p.currency_code as payroll_currency,
                        p.exchange_rate,
                        pl.deduction,
                        e.status_id,
                        e.joining_date,
                        e.last_rejoin_date
                       ')

            ->orderBy('e.id')
            ->get();
        if ($payrolls->isEmpty()) {
            return DV::error('It seems you have not yet imported active staffs into the payroll');
        }
        $issues = [];
        $issues_count = 0;
        $success_count = 0;
        $fail_count = 0;

        foreach ($payrolls as $row) {

            $row->allowance = DB::table('tax_allowances')
                ->where('emp_id', $row->emp_id)
                ->selectRaw('id,allowance,currency_code as allowance_currency');

            $row->apply_payroll_tax = DB::table('employees')
                ->where('id', $row->emp_id)
                ->value('apply_payroll_tax');

            $row->benefit_taxable = DB::table('payroll_list_benefits')
                ->where('emp_id', $row->emp_id)
                ->where('payroll_id', $row->payroll_id)
                ->where('tax_option_id', 1)
                ->sum('used_amount');

            $row->benefit_non_tax = DB::table('payroll_list_benefits')
                ->where('emp_id', $row->emp_id)
                ->where('payroll_id', $row->payroll_id)
                ->where('tax_option_id', 2)
                ->sum('used_amount');

            $row->benefit_flat_rate = DB::table('payroll_list_benefits')
                ->where('emp_id', $row->emp_id)
                ->where('payroll_id', $row->payroll_id)
                ->where('tax_option_id', 3)
                ->selectRaw('emp_benefit_id,used_amount,flat_tax_rate');

            $emp_benefit_count = DB::table('emp_benefits')
                ->where('emp_id', $row->emp_id)
                ->count('id');

            $emp_allowance_count = DB::table('tax_allowances')
                ->where('emp_id', $row->emp_id)
                ->count('id');

            $row->emp_allowance_count = $emp_allowance_count;
            $row->emp_benefit_count = $emp_benefit_count;
            $used_amount = [];
            $flat_tax_rates = [];

            if ($emp_allowance_count > 1) {
                $row->allowance = $row->allowance->get();
                foreach ($row->allowance as $allowance) {
                    if ($allowance->allowance_currency != $row->payroll_currency) {
                        $allowance->allowance = Money::convert($ss, $allowance->allowance, $allowance->allowance_currency, $row->payroll_currency, (1 / $row->exchange_rate));
                    }
                }
                $row->allowance = $row->allowance->sum('allowance');
            } else {
                $allowance = $row->allowance->first();
                if ($allowance) {
                    if ($allowance->allowance_currency != $row->payroll_currency) {
                        $row->allowance = Money::convert($ss, $allowance->allowance, $allowance->allowance_currency, $row->payroll_currency, (1 / $row->exchange_rate));
                    } else {
                        $row->allowance = $allowance->allowance;
                    }
                } else {
                    $row->allowance = 0;
                }
            }

            if ($emp_benefit_count > 1) {
                $benefitFlatRates = $row->benefit_flat_rate->get();
                $usedAmountByTaxRate = [];

                foreach ($benefitFlatRates as $bfr) {
                    $taxRate = (float) $bfr->flat_tax_rate;
                    $usedAmount = (float) $bfr->used_amount;

                    if (!isset($usedAmountByTaxRate[$taxRate])) {
                        $usedAmountByTaxRate[$taxRate] = 0;
                    }

                    $usedAmountByTaxRate[$taxRate] += $usedAmount;
                }
                $row->benefit_flat_rate = $benefitFlatRates;
                $row->used_amount = $usedAmountByTaxRate;
            } else {
                $benefitFlatRate = $row->benefit_flat_rate->first();

                if ($benefitFlatRate) {
                    $row->benefit_flat_rate = [$benefitFlatRate];
                    $row->used_amount = [
                        'flat_tax_rate' => (float) $benefitFlatRate->flat_tax_rate,
                        'used_amount' => (float) $benefitFlatRate->used_amount,
                    ];
                } else {
                    $row->benefit_flat_rate = [];
                    $row->used_amount = [
                        'flat_tax_rate' => 0,
                        'used_amount' => 0,
                    ];
                }
            }

            $row->tax_base = ($row->tax_base ?? 0);
            $row->deduction = ($row->deduction ?? 0);
            $row->allowance = ($row->allowance ?? 0);
            $row->benefit_taxable = ($row->benefit_taxable ?? 0);
            $row->benefit_non_tax = ($row->benefit_non_tax ?? 0);
            $row->benefit_flat_rate = ($row->benefit_flat_rate ?? 0);
        }
        // return $payrolls;

        foreach ($payrolls as &$payroll) {
            $payroll->tax_base = 0;
            $payroll->total = 0;
            $benefit_taxable = 0;
            $benefit_non_tax = 0;
            $benefit_flat_rate = 0;
            $benefit_tax = 0;
            $payroll_total = 0;
            $day_in_month = 0;

            $full_benefit_taxable = $payroll->benefit_taxable ?? 0;
            $full_salary = $payroll->salary  + $full_benefit_taxable;

            $day_in_month = days_in_month($payroll->month, $payroll->year);
            $payroll_start_date = convertDate($payroll->start_date);
            $payroll_end_date = convertDate($payroll->end_date);

            $payroll_days = dateDiff_days($payroll_start_date, $payroll_end_date) + 1;
            $salary = ($payroll->salary / $day_in_month) * $payroll_days;
            $benefit_taxable = ($full_benefit_taxable / $day_in_month) * $payroll_days;
            $benefit_non_tax = ($payroll->benefit_non_tax / $day_in_month) * $payroll_days;

            // \Log::info(['benefit_taxable' => $benefit_taxable, 'benefit_non_tax' => $benefit_non_tax]);

            if ($payroll->emp_benefit_count > 1) {
                $benefit_flat_rate_data = [];
                foreach ($payroll->used_amount as $flat_tax_rate => $benefit_flat_rate) {
                    $benefit_flat_rate_data[] = [
                        'flat_tax_rate' => $flat_tax_rate,
                        'benefit_flat_rate' => ($benefit_flat_rate / $day_in_month) * $payroll_days
                    ];
                }
                $payroll->benefit_flat_rate_data = $benefit_flat_rate_data;
            } else {
                $payroll->benefit_flat_rate_data = [
                    [
                        'flat_tax_rate' => $payroll->used_amount['flat_tax_rate'],
                        'benefit_flat_rate' => ($payroll->used_amount['used_amount'] / $day_in_month) * $payroll_days
                    ]
                ];
            }
            $resigned_or_new_start = false;
            $count_days = $payroll_days;
            $count_days_resign = -1;
            $count_days_rejoin = -1;
            $salary_used = $salary;

            $resign = self::count_days_resign($payroll->emp_id, $payroll_start_date, $payroll_end_date);
            if ($resign->error) {
                $issues_count++;
                $fail_emps[] = (object)[
                    'id' => $payroll->emp_id,
                    'code' => $payroll->emp_code,
                    'name' => $payroll->emp_name,
                    'issue' => $resign->error
                ];
            } else {
                $count_days_resign = $resign->count_days;
                $resigned_or_new_start = $resign->resigned_or_new_start;
            }

            $rejoin = self::count_days_rejoin($payroll->emp_id, $payroll->status_id, $payroll->last_rejoin_date, $payroll->joining_date, $payroll_start_date, $payroll_end_date);
            if ($rejoin->error) {
                $issues_count++;
                $fail_emps[] = (object)[
                    'id' => $payroll->emp_id,
                    'code' => $payroll->emp_code,
                    'name' => $payroll->emp_name,
                    'issue' => $rejoin->error
                ];
            } else {
                if ($rejoin->count_days >= 0) {
                    $count_days_rejoin = $rejoin->count_days;
                    $resigned_or_new_start = $rejoin->resigned_or_new_start;
                }
            }
            if ($count_days_resign >= 0 || $count_days_rejoin >= 0) {
                $count_days = ($count_days_resign < 0 ? 0 : $count_days_resign) + ($count_days_rejoin < 0 ? 0 : $count_days_rejoin);
            }

            $allowance = $payroll->allowance;
            $allowance_used = ($allowance / $day_in_month) * $payroll_days;
            $allowance_per_day = $allowance_used / $payroll_days;
            $last_allowance = $resigned_or_new_start ? $allowance_per_day * $count_days : $allowance_used;
            $deduction = $payroll->deduction;

            if ($payroll->apply_payroll_tax == 1) {

                $tax_rate = $payroll->tax_rate ?? 0;
                $bias = $payroll->bias ?? 0;
                $bias_used = ($bias / $day_in_month) * $payroll_days;
                $bias_per_day = $bias_used / $payroll_days;
                $last_bias = $resigned_or_new_start ? $bias_per_day * $count_days : $bias_used;

                if ($benefit_taxable > 0) {
                    $salary_used = $salary + $benefit_taxable;
                    $salary_per_day = $salary_used / $payroll_days;
                    $last_salary = $resigned_or_new_start ? $salary_per_day * $count_days : $salary_used;

                    $payroll->tax_base = ($last_salary - $last_allowance) * ($tax_rate / 100) - $last_bias;
                    if ($payroll->tax_base < 0) {
                        $payroll->tax_base = 0;
                    }
                    $payroll->total = $last_salary - ($payroll->tax_base + $deduction);
                }

                if ($benefit_non_tax > 0) {
                    if ($benefit_taxable > 0) {
                        $payroll->total += $benefit_non_tax;
                    } else {
                        $salary_used = $salary;
                        $salary_per_day = $salary_used / $payroll_days;
                        $last_salary = $resigned_or_new_start ? $salary_per_day * $count_days : $salary_used;

                        $payroll->tax_base = ($last_salary - $last_allowance) * ($tax_rate / 100) - $last_bias;
                        if ($payroll->tax_base < 0) {
                            $payroll->tax_base = 0;
                        }
                        $payroll->total = ($last_salary + $benefit_non_tax) - ($payroll->tax_base + $deduction);
                    }
                }

                if ($benefit_flat_rate > 0) {
                    $benefit_flat_rate_sum = 0;
                    $benefit_tax = 0;
                    $benefit_flat_rate_data = [];

                    if ($benefit_taxable > 0 || $benefit_non_tax > 0) {
                        if (isset($payroll->benefit_flat_rate_data) && !empty($payroll->benefit_flat_rate_data)) {
                            foreach ($payroll->benefit_flat_rate_data as $data) {
                                $benefit_flat_rate = $data['benefit_flat_rate'];
                                $benefit_flat_tax_rate = $data['flat_tax_rate'];

                                $benefit_flat_rate_sum += $benefit_flat_rate;
                                $benefit_tax += $benefit_flat_rate * ($benefit_flat_tax_rate / 100);
                            }
                        }
                        $payroll->total = ($payroll->total + $benefit_flat_rate_sum) - $benefit_tax;
                        // \Log::info(['benefit_flat_rate_sum' => $benefit_flat_rate_sum, 'benefit_tax' => $benefit_tax]);
                    } else {
                        $salary_used = $salary;
                        $salary_per_day = $salary_used / $payroll_days;
                        $last_salary = $resigned_or_new_start ? $salary_per_day * $count_days : $salary_used;
                        if (isset($payroll->benefit_flat_rate_data) && !empty($payroll->benefit_flat_rate_data)) {
                            foreach ($payroll->benefit_flat_rate_data as $data) {
                                $benefit_flat_rate = $data['benefit_flat_rate'];
                                $benefit_flat_tax_rate = $data['flat_tax_rate'];

                                $benefit_flat_rate_sum += $benefit_flat_rate;
                                $benefit_tax += $benefit_flat_rate * ($benefit_flat_tax_rate / 100);
                            }
                        }
                        $payroll->tax_base = ($last_salary - $last_allowance) * ($tax_rate / 100) - $last_bias;
                        if ($payroll->tax_base < 0) {
                            $payroll->tax_base = 0;
                        }
                        $payroll->total = ($last_salary + $benefit_flat_rate_sum) - ($payroll->tax_base + $benefit_tax + $deduction);
                    }
                }
                if ($benefit_taxable <= 0 && $benefit_non_tax <= 0 && $benefit_flat_rate <= 0) {
                    $salary_used = $salary;
                    $salary_per_day = $salary_used / $payroll_days;
                    $last_salary = $resigned_or_new_start ? $salary_per_day * $count_days : $salary_used;

                    $payroll->tax_base = ($last_salary - $last_allowance) * ($tax_rate / 100) - $last_bias;
                    if ($payroll->tax_base < 0) {
                        $payroll->tax_base = 0;
                    }

                    $payroll->total = $last_salary - ($payroll->tax_base + $deduction);
                }
            } else {
                $benefit_flat_rate_sum = 0;
                $benefit_tax = 0;
                $benefit_flat_rate_data = [];

                $salary_used = $salary;
                $salary_per_day = $salary_used / $payroll_days;
                $last_salary = $resigned_or_new_start ? $salary_per_day * $count_days : $salary_used;

                if (isset($payroll->benefit_flat_rate_data) && !empty($payroll->benefit_flat_rate_data)) {
                    foreach ($payroll->benefit_flat_rate_data as $data) {
                        $benefit_flat_rate = $data['benefit_flat_rate'];
                        $benefit_flat_tax_rate = $data['flat_tax_rate'];

                        $benefit_flat_rate_sum += $benefit_flat_rate;
                    }
                }
                $payroll->tax_base = 0;
                $payroll->total = ($last_salary + $benefit_taxable + $benefit_non_tax + $benefit_flat_rate_sum) - $deduction;
            }

            $flat_rate_details = null;
            if (isset($payroll->benefit_flat_rate_data)) {
                foreach ($payroll->benefit_flat_rate_data as $data) {
                    $flat_rate_details .= formatNumber($data['benefit_flat_rate'], 2) . '@' . $data['flat_tax_rate'] . '|';
                }
            }
            $x = DB::table('payroll_list')->where('id', $payroll->id)->update([
                'tax_base' => $payroll->tax_base,
                'benefit_tax' => $benefit_tax,
                'count_day' => $count_days,
                'p_salary' => $last_salary,
                'benefit_taxable' => $benefit_taxable,
                'benefit_non_tax' => $benefit_non_tax,
                'benefit_flat_rate' => $flat_rate_details,
                'p_allowance' => $last_allowance,
                // 'tax_rate' => $tax_rate,
                // 'p_bias' => $last_bias,
                'total_salary' => $payroll->total
            ]);

            $payroll_total = DB::table('payroll_list')
                ->where('payroll_id', $payroll->payroll_id)
                ->sum('total_salary');

            $x = DB::table('payrolls')->where('id', $payroll->payroll_id)->update([
                'total' => $payroll_total
            ]);
            $success_count++;
        }
        return DV::depends(1, [
            'success_count' => $success_count,
            'error_count' => $fail_count,
            'issues' => $issues,
            'issues_count' => $issues_count,
            'payroll_total' => $payroll_total
        ]);
    }

    function disburseOne($id, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $master_account_id = 1;
        if (self::isDisbursed($id)) {
            return DV::error('This payroll amount has been disbursed already!');
        }
        $emp = DB::table('payroll_list as pl')
        ->join('employees as e', 'e.id', '=', 'pl.emp_id')
        ->join('payrolls as p', 'p.id', '=', 'pl.payroll_id')
        ->join('accounts as a', 'a.emp_id', '=', 'pl.emp_id')
        ->where('pl.id', $id)
            ->selectRaw('pl.id, total_salary as amount, e.id AS emp_id, e.name, e.code, e.phone_number, pl.payroll_id, p.name as remarks, p.exchange_rate, a.id as account_id, p.currency_code')
            ->first();
        if (!$emp) {
            return DV::error('The provided staff identity does not exist');
        }
        $payroll = Payroll::getProps($emp->payroll_id, 'id, name, currency_code, total, exchange_rate');
        if (!$payroll) {
            return DV::error('The provided payroll ID does not exist');
        }
        if (!Payroll::isAuthorized($emp->payroll_id)) {
            return DV::error('This payroll has not been authorized!');
        }
        $master_account = DB::table('accounts')->where('id', $master_account_id)
            ->selectRaw('id, balance, currency_code')->first();
        if (!$master_account) {
            return DV::error('Master account not found! This is required to disburse payroll.');
        }

        if ($master_account->balance <= 0) {
            return DV::error('The master payroll account balance is zero!');
        }
        if ($payroll->currency_code !== $master_account->currency_code) {
            $master_amount = Money::convert($ss, $master_account->balance, $master_account->currency_code, $payroll->currency_code, $payroll->exchange_rate);
        } else {
            $master_amount = $master_account->balance;
        }
        if ($master_amount < $emp->amount) {
            return DV::error('Insufficient balance of the Master Payroll Account. Required: ' . $payroll->currency_code . ' ' . $emp->amount);
        }
        $to_account = Employee::getPayrollAccount($emp->emp_id);
        if (!$to_account) {
            return DV::error('Employee does not have a payroll account');
        }
        $trx_inputs = [
            'to_account_id' => $to_account->account_id,
            'payroll_id' => $to_account->payroll_id,
            'amount' => $emp->amount,
            'exchange_rate' => $payroll->exchange_rate,
            'remarks' => $emp->remarks
        ];

        $account = new Account(1, $ss);
        $res = $account->transferTo($trx_inputs);

        if ($res->status_code === 200) {
            DB::table('payroll_list')->where('id', $id)->update([
                'disbursed' => 1,
            ]);
            return DV::depends(1);
        } else {
            return DV::error($res->error_message);
        }
    }


    static function isDisbursed($id)
    {
        if (!$id) return false;
        $x = DB::table('payroll_list as l')->where('l.id', $id)->value('disbursed');
        return $x == 1;
    }
    //disburseAllPayrollList()
    function disburseAll($payroll_id, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $master_account_id = 1;
        $payroll = Payroll::getProps($payroll_id, 'id,name,currency_code, total,exchange_rate');
        if (!$payroll) return DV::error('The provided payroll ID does not exist');
        if (!Payroll::isAuthorized($payroll_id)) {
            return DV::error('This payroll has not been authorized!');
        }

        if ($payroll_id)  DB::statement(DB::raw("update payrolls set total = (SELECT SUM(IFNULL(total_salary,0)) FROM payroll_list WHERE payroll_id = $payroll_id) WHERE id = $payroll_id"));
        $master_account = DB::table('accounts')
            ->where('id', $master_account_id)
            ->selectRaw('id,balance,currency_code')->first();

        if (!$master_account) {
            return DV::error('Master account not found! NOTE: master account is the Cash Account of the company that is used to send cash to staff`s payroll accounts');
        }
        $master_account_balance = $master_account->balance ?? 0;
        if ($master_account_balance <= 0) return DV::error('The master payroll account balance is now zero!');
        if (Payroll::isDisbursed($payroll_id)) {
            return DV::error('Payroll has already been disbursed');
        }
        $master_amount = 0;
        if ($payroll->currency_code != $master_account->currency_code) {
            $master_amount = Money::convert($ss, $master_account->balance, $master_account->currency_code, $payroll->currency_code, $payroll->exchange_rate);
        } else if (!$payroll->currency_code) {
            return DV::error('Either payroll currency or master payroll account currency is not valid!');
        } else {
            $master_amount = $master_account->balance ?? 0;
        }

        if ($master_amount < $payroll->total) {
            $p_amount = $payroll->currency_code . ' ' . $payroll->total;
            return DV::error('Insufficient balance of the Master Payroll Account. ?? is required for overall payroll disbursements::' . $p_amount);
        }

        $payrollEntries = DB::table('payroll_list as pl')
            ->join('payrolls as p', 'p.id', '=', 'pl.payroll_id')
            ->join('employees as e', 'e.id', '=', 'pl.emp_id')
            ->where('pl.payroll_id', $payroll_id)
            ->whereRaw('IFNULL(pl.disbursed,0) =0')
            ->selectRaw('pl.id,e.id AS emp_id,e.name,e.code,e.phone_number, total_salary as amount, pl.emp_id, pl.payroll_id, p.name as remarks, p.exchange_rate')
            ->get();

        //$emp_id_no_account = [];
        $success_count = 0;
        $failed_count = 0;
        $failed_emps = [];

        foreach ($payrollEntries as &$emp) {
            $payroll_account = Employee::getPayrollAccount($emp->emp_id);
            if (!$payroll_account) {
                return DV::error('Staff named ?? does not have payroll account yet!::' . $emp->name);
            } else {
                $emp->account_id = $payroll_account->account_id;
            }
            // if (!isset($payroll_account->account_id)) {
            //     $emp_id_no_account[] = $emp_id;
            // }
            $trx_inputs = ['to_account_id' => $emp->account_id, 'amount' => $emp->amount, 'exchange_rate' => $emp->exchange_rate, 'remarks' => null, 'payroll_id'=>$payroll_id];
            $account = new Account(1, $ss);
            $res = $account->transferTo($trx_inputs);
            if ($res->status_code === 200) {
                $success_count++;
                DB::table('payroll_list')->where('payroll_id', $payroll_id)->where('emp_id', $emp->emp_id)->update(['disbursed' => 1]);
            } else {
                $failed_count++;
                $failed_emps[] = [
                    'emp_id' => $emp->emp_id,
                    'emp_code' => $emp->code,
                    'emp_name' => $emp->name,
                    'phone_number' => $emp->phone_number,
                    'issue' => $res->error_message
                ];
            }
        }
        if ($success_count > 0) {
            DB::table('payrolls')->where('id', $payroll_id)->update(['disbursed' => 1]);
        }

        // // if (!empty($emp_id_no_account)) {
        // //     $employees = DB::table('employees')
        // //         ->whereIn('id', $emp_id_no_account)
        // //         ->pluck('name', 'id');

        // //     $names = $employees->values()->all();
        // //     $first_name = $names[0] ?? 'Unknown';
        // //     $second_name = $names[1] ?? null;
        // //     $count = count($emp_id_no_account) - 2;

        // //     if ($count > 0) {
        // //         $error_message = $second_name
        // //             ? "Employees [$first_name, $second_name] and $count other" . ($count > 1 ? 's' : '') . " do not have  Payroll account."
        // //             : "Employees [$first_name] and $count other" . ($count > 1 ? 's' : '') . " do not have a payroll account.";
        // //     } else {
        // //         $error_message = $second_name
        // //             ? "Employees [$first_name, $second_name] do not have a payroll account."
        // //             : "Employee [$first_name] does not have a payroll account.";
        // //     }

        // //     return (object)[
        // //         'status' => 'error',
        // //         'status_code' => 405,
        // //         'error_message' => $error_message,
        // //         'data' => $emp_id_no_account,
        // //     ];
        // // }
        // $success_count = 0 ;
        // $failed_count = 0;
        // $failed_emps = 0;
        // foreach ($payrollEntries as $trx) {
        //     $trx->trx_type = 3;
        //     $trx->account_id = $trx->account_id;
        //     $trx->from_account_id = $master_account_id;
        //     $trx->to_account_id =  $trx->account_id;
        //     $trx_inputs = (array)$trx;
        //     $transfer = Transaction::create($trx_inputs,true, $ss, $status = 'in');
        //     $inputs['status'] = $status;
        //     $trx_error = $transfer->error ?? null;
        //     if ($trx_error) {
        //         $results[] = DV::error('Disbursement failed for staff named ??::'.$trx->name.'. Tracked issue: ' .$trx_error);
        //         continue;
        //     }
        //     unset($trx_inputs['account_id']);
        //     unset($trx_inputs['emp_id']);
        //     $account = new Account($emp->account_id, $ss);
        //     $res = $account->transferTo($trx_inputs);
        //     if ($res->status === 'Error') {
        //         $results[] = DV::error('Withdrawal failed for staff named ??::'.$trx->name. '. Tracked issue: '. ($res->error_message ?? '' ) );
        //         continue;
        //     }

        //     $error = $res->error_message ?? null;
        //     if(!$error){
        //         $trx_result = (object)$res->data;
        //         $updateBalance_def = Account::updateBalance($master_account_id, 'accounts', 'out',$trx_result->transaction['amount'], $ss);

        //         if ($updateBalance_acc && $updateBalance_def){
        //             $x = DB::table('payroll_list')->where('id', $trx->id)->update([
        //                 'disbursed' => 1,
        //                 'trx_id' => hex2bin($trx_result->trx_id),
        //             ]);
        //             $success_count++;
        //         }else{
        //             $failed_count++;
        //             $failed_emps[] = (object)['id'=>$trx->emp_id,'name'=>$trx->name, 'code'=>$trx->emp_code, 'issue'=>'Looks like the withdrawal of cash from master accoutn faileld'];
        //         }

        //     }else{
        //         $failed_count++;
        //         $failed_emps[] = (object)['id'=>$trx->emp_id,'name'=>$trx->name, 'code'=>$trx->emp_code, 'issue'=>$error];
        //     }
        // }
        return DV::depends(1, ['success_count' => $success_count, 'failed_count' => $failed_count, 'failed_emps' => $failed_emps]);
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
                        e.apply_payroll_tax,
                        pos.title as emp_position,
                        b.name as branch_name,
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

            $row->allowance = DB::table('tax_allowances')
                ->where('emp_id', $row->emp_id)
                ->value('allowance');


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
