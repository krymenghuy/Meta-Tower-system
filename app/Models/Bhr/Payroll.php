<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
use App\Models\DBX;
use Illuminate\Pagination\LengthAwarePaginator;
use DateTime;
use App\Models\Money;

class Payroll
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
    static function getProps($id, $cols = 'id,name,currency_code,total,exchange_rate')
    {
        return DB::table('payrolls')->where('id', $id)->selectRaw($cols)->first();
    }
    function save($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $v_rule = [
            'name' => '1|string|1-150',
            'month' => '1|number',
            'year' => '1|number',
            'start_date' => '1|date',
            'end_date' => '1|date',
            'p_number' => '1|number',
            'total' => '0|number',
            'authorized' => '1|number|default = 0',
            'disbursed' => '1|number|default = 0',
            'currency_code' => '1|choice|KHR,USD|default=' . Money::$base_currency,
            'exchange_rate' => '0|number',

        ];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $inputs['start_date'] = convertDate($inputs['start_date']);
        $inputs['end_date'] = convertDate($inputs['end_date']);
        $d = (object)$inputs;
        $err = self::checkDuplicateName($d->name, $id);
        if ($err) return DV::error($err);

        $err = self::validatePayrollDates($d->start_date, $d->end_date, $id);
        if ($err) return DV::error($err);

        if (!$id) {
            $checkExist = DB::table('payrolls')->where('month', $inputs['month'])->where('year', $inputs['year'])->where('start_date', $inputs['start_date'])->where('end_date', $inputs['end_date'])->take(1)->value('id');
            if ($checkExist) {
                return DV::error($inputs['name'] . ' is already exist!');
            }
        }

        $id = saveData($ss, 'payrolls', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['payrolls' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving payroll');
    }

    static function validatePayrollDates($start_date, $end_date, $id)
    {
        $str_id = '1 = 1';
        if ($id) {
            $str_id = "p.id <> $id";
        }

        if (new DateTime($start_date) > new DateTime($end_date)) {
            return 'Start Date and End Date is not correct!';
        }

        $start = convertDate($start_date);
        $end = convertDate($end_date);
        $count_days = dateDiff_days($start, $end) + 1;

        $test = $count_days;
        if ($test > 31) {
            return 'The difference between Start Date and End Date cannot be longer than 31 days!';
        }
        return null;
    }
    static function checkDuplicateName($name, $id)
    {
        $str_id = '1 = 1';
        if ($id) {
            $str_id = "p.id <> $id";
        }
        $test = DB::table('payrolls as p')->where('p.name', $name)->whereRaw($str_id)->select('id')->first();
        if ($test)
            return 'Payrll name ?? already exist::' . $name;
        // return DV::error('Payrll name ?? ??already exist::'.$name .';'.$name);

        return null;
    }

    static function isDisbursed($id)
    {
        if (!$id) return false;
        $x = DB::table('payroll_list as p')->where('payroll_id', $id)->where('disbursed', 1)->selectRaw('id')->first();
        if (!$x) return false;
        return true;
    }
    static function isAuthorized($id)
    {
        if (!$id) return false;
        $x = DB::table('payrolls')->where('id', $id)->value('authorized');
        if (!$x) return false;
        return $x == 1;
    }
    function getList($arr, $ss)
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
        $search_authorized = $d->authorized ?? null;
        $search_disbursed = $d->disbursed ?? null;

        $start_date = DBX::formatDate('p.start_date', 'start_date');
        $end_date = DBX::formatDate('p.end_date', 'end_date');
        $updated_date = DBX::formatTime('p.update_date', 'update_date');


        $query = DB::table('payrolls as p')
            ->selectRaw('p.id, p.name, p.month, p.year,
                        ' . $start_date . ', ' . $end_date . ',
                         p.p_number,p.head_count ,p.total, p.authorized, p.disbursed,
                         p.currency_code, p.exchange_rate,' . $updated_date . ',p.update_user')
            ->where('p.branch_id', $branch_id);

        if ($search_id) {
            $query->where('p.id', $search_id);
        }
        if ($search_value) {
            $query->where('p.name', 'like', '%' . $search_value . '%');
        }
        if ($search_authorized) {
            $query->where('p.authorized', $search_authorized);
        }
        if ($search_disbursed) {
            $query->where('p.disbursed', $search_disbursed);
        }

        $clone_query = clone $query;
        $count = $clone_query->count('p.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }


    function getDetails($id)
    {
        $start_date = DBX::formatDate('p.start_date', 'start_date');
        $end_date = DBX::formatDate('p.end_date', 'end_date');
        $row = DB::table('payrolls as p')
            ->selectRaw('p.id, p.name, p.month, p.year,' . $start_date . ', ' . $end_date . ', p.p_number, p.head_count,p.total, p.authorized, p.disbursed, p.currency_code, p.exchange_rate')
            ->where('p.id', $id)
            ->first();
        return $row;
    }

    function getEndDate($ss)
    {
        $end_date = DBX::formatDate('p.end_date', 'end_date');
        $row = DB::table('payrolls as p')
            ->selectRaw($end_date)
            ->where('p.branch_id', $ss->branch_id)
            ->orderBy('id', 'DESC')
            ->first();

        $date = new DateTime($row->end_date);
        $date->modify('+1 day');
        $row->end_date = $date->format('d-M-Y');
        return $row;
    }

    function delete($id = null)
    {
        $id = $id ?? $this->id;
        $payroll = self::getProps($id, 'id,authorized');
        if (!$payroll) return DV::error('The provided payroll ID does not exist');
        if ($payroll->authorized == 1) return DV::error('Cannot delete authorized payroll!');
        DB::table('payroll_list')->where('payroll_id', $id)->delete();
        DB::table('payrolls')->where('id', $id)->delete();
        return DV::depends(1);
    }

    /** reset payroll back to Pending (non-authorized), and remove all its disbursement transactions */
    function resetStatus($id = null) {}

    /** changeCurrency() makes change to payroll's currency. This can be done only before payroll is authorized */
    function changeCurrency($new_currency, $exchange_rate, $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $payroll = self::getProps($id, 'id,name,authorized,disbursed,currency_code,exchange_rate,total');
        if (!$payroll) return DV::error('Payroll ID is not valid');
        if ($payroll->authorized == 1) return DV::error('Cannot change currency because the payroll is already authorized1');
        DB::table('payrolls')->where('id', $id)->update(['currency_code' => $new_currency, 'exchange_rate' => $exchange_rate]);
        DB::table('payroll_list')->where('payroll_id', $id)->update(['currency_code' => $new_currency]);
        $pl = new \App\Models\Bhr\PayrollList();
        $res = $pl->calculatePayrollList($id, $ss);
        return $res;
    }

    function getFormOptions($id, $ss)
    {
        $payroll = null;
        if ($id) $payroll = self::getDetails($id);
        return (object) [
            'sort_by' => [

                ['id' => 'p.name', 'name' => 'By Name'],
            ],

            'authorized' => [
                ['id' => '1', 'name' => 'Approved'],
                ['id' => '0', 'name' => 'Pending'],

            ],
            'disbursed' => [
                ['id' => '1', 'name' => 'Success'],
                ['id' => '0', 'name' => 'Pending'],

            ],
            'currency_codes' => Money::options_currency($ss),
            'payrolls' => $payroll,
        ];
    }

    static function isEmpty($id)
    {
        $row = DB::table('payroll_list')->where('payroll_id', $id)->select('id')->first();
        return $row ? false : true;
    }

    function updateAuthorize($id = null, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $master_account_id = 1;
        if (self::isEmpty($id)) {
            return DV::error('Cannot authorize because the payroll is empty');
        }
        if (self::isAuthorized($id)) {
            return DV::error('The payroll is already Authorized');
        }

        $total = DB::table('payrolls as p')
            ->where('id', $id)
            ->selectRaw('id,total as amount')
            ->first();
        if (!$total || $total->amount <= 0) {
            return DV::error('The payroll total is zero. You may need to click Calculate button on Payroll List');
        }

        $default_account = DB::table('accounts as a')
            ->where('a.id', 1)
            ->selectRaw('balance as amount, a.id as account_id')->first();
        if (!$default_account) return DV::error('Master payroll account is not yet created!');

        if ($total) {

            $total->trx_type = "1";
            $total->account_id = 1;
            $total->payroll_id = $total->id;
            $total->to_account_id = $master_account_id;
        }

        $total = Transaction::deposit((array)$total, $ss)->data;
        $new_balance = $total['transaction']['amount'] + $default_account->amount;
        $query = DB::table('accounts')
            ->where('id', 1)->update(['balance' => $new_balance, 'trx_id' => hex2bin($total['trx_id'])]);

        $x = DB::table('payrolls')->where('id', $id)->update([
            'authorized' => 1,
            'update_user' => $ss->full_name,
            'update_date' => getNowTime(),
            'update_uid' => $ss->user_id
        ]);
        return DV::depends($x, ['Payroll  authorize', 'updated']);
    }

    static function getReverseError($id)
    {
        $row = DB::table('transactions as trx')
            ->join('accounts as a', 'a.id', '=', 'trx.account_id')
            ->join('employees as emp', 'emp.id', '=', 'a.emp_id')
            ->where('a.account_type', 'Payroll')
            ->where('trx.payroll_id', $id)
            ->whereRaw("a.balance < trx.amount")
            ->selectRaw('emp.id,emp.name, emp.code, trx.amount, a.balance')
            ->first();
        if (!$row) return null;
        return "Staff named $row->name dosn't have enough account balance";
    }
    function reverseTransactions($id, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $authorized = self::isAuthorized($id);
        if (!$authorized) {
            return DV::error('Payroll is not authorizad yet!');
        }
        $isDisbursed = self::isDisbursed($id);
        if ($isDisbursed) {
            $rows = DB::table('transactions')->where('payroll_id', $id)->selectRaw('id, account_id, amount, currency_code')->get();
            $success_count = 0;
            $failed_count = 0;
            foreach ($rows as $row) {
                $inputs = [
                    'to_account_id' => 1,
                    'remarks' => null,
                    'amount' => $row->amount,
                    'trx_type' => 3,
                    'status' => 'out'
                ];
                $account = new Account($row->account_id, $ss);
                $res = $account->transferTo($inputs);
                if ($res->status_code == 200) {
                    $success_count++;
                } else {
                    $failed_count++;
                }
            }
            if ($failed_count == 0 && $success_count > 0 || !$isDisbursed) {
                DB::table('payrolls')->where('id', $id)->update(['authorized' => 0, 'disbursed' => 0]);
                DB::table('payroll_list')->where('payroll_id', $id)->update(['disbursed' => 0]);
                return DV::depends(1);
            }
            return DV::error("Failed to reset payroll!");
        }
    }

    function reset($id = null, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $authorized = self::isAuthorized($id);
        if (!$authorized) {
            return DV::error('Payroll is not authorizad yet!');
        }
        $isDisbursed = self::isDisbursed($id);
        if ($isDisbursed) {
            $rows = DB::table('transactions')->where('payroll_id', $id)->selectRaw('id, account_id, amount, currency_code')->get();
            $success_count = 0;
            $failed_count = 0;
            foreach ($rows as $row) {
                $inputs = [
                    'to_account_id' => 1,
                    'remarks' => null,
                    'amount' => $row->amount,
                    'trx_type' => 3,
                    'status' => 'out'
                ];
                $account = new Account($row->account_id, $ss);
                $res = $account->transferTo($inputs);
                if ($res->status_code == 200) {
                    $success_count++;
                } else {
                    $failed_count++;
                }
            }
            if ($failed_count == 0 && $success_count > 0 || !$isDisbursed) {
                DB::table('payrolls')->where('id', $id)->update(['authorized' => 0, 'disbursed' => 0]);
                DB::table('payroll_list')->where('payroll_id', $id)->update(['disbursed' => 0]);
                return DV::depends(1);
            }
            return DV::error("Failed to reset payroll!");
        }
    }

    function updateDisburse($id = null, $ss = null)
    {

        if (self::isEmpty($id)) {
            return DV::error('Cannot disburse payroll because the ID is empty');
        }
        $payroll = DB::table('payrolls')->where('id', $id)->select('authorized', 'disbursed')->first();

        if (!$payroll) {
            return DV::error('Payroll not found');
        }
        if (!$payroll->authorized) {
            return DV::error('Cannot disburse payroll because it is not authorized');
        }
        if ($payroll->disbursed) {
            return DV::error('Cannot disburse payroll because it has already been disbursed');
        }
        $ss = $ss ? $ss : $this->userInfo;
        $x = DB::table('payrolls')->where('id', $id)->update([
            'disbursed' => 1,
            'update_user' => $ss->full_name,
            'update_date' => getNowTime(),
            'update_uid' => $ss->user_id
        ]);
        return DV::depends($x, ['Payroll  disbursed', 'updated']);
    }
}
