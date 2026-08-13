<?php

namespace App\Models\Mhr;

use DV;
use DBX;
use Illuminate\Support\Facades\DB;
use Vsd\Money\Models\VSMoney;
use DateTime;
use App\Models\Mhr\Employee;
use App\Models\Mhr\TaxBracket;
use Illuminate\Pagination\LengthAwarePaginator;

use Vsd\Vsloquent\VSModel;

class Payroll extends VSModel
{
    // protected $id = null;
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
            'month' => '1|number|text=month_required',
            'year' => '1|number|text=year_required',
            'name' => '1|string|1-150|text=name_required::@key;@max;@value',
            'p_number' => '1|number|text=payroll_number_required',
            'start_date' => '1|date|text=start_date_required',
            'end_date' => '1|date|text=end_date_required',
            'total' => '0|number',
            'authorized' => '1|number|default = 0',
            'disbursed' => '1|number|default = 0',
            'currency_code' => '0|choice|default = USD',
            'exchange_rate' => '0|number',

        ];

        $res = DBX::validateObject($arr, $v_rule, true, [], $ss->lang);
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

        $id = DBX::saveData($ss, 'payrolls', ['id' => $id], $inputs, [], 1);
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
            return 'Payroll name ?? already exist::' . $name;
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
        $branch_id = $d->branch_id ?? null;
        $authorized = isset($d->authorized) ? $d->authorized : null;
        $disbursed = isset($d->disbursed) ? $d->disbursed : null;
        $str_search = '1=1';
        $str_moreWhere = '2=2';
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = '(p.name LIKE \'%' . $search_value . '%\' OR p.p_number LIKE \'%' . $search_value . '%\')';
        }
        if($branch_id){
            $str_moreWhere .= ' AND p.branch_id =' . $branch_id;
        }
        if($authorized){
            $str_moreWhere .= ' AND p.authorized =' . $authorized;
        }
        if($disbursed){
            $str_moreWhere .= ' AND p.disbursed =' . $disbursed;
        }
        $query = DB::table('payrolls as p')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw('p.id, p.name, p.month, p.year,
                         p.start_date,p.end_date,
                         p.p_number,p.head_count ,p.total, p.authorized, p.disbursed,
                         p.currency_code, p.exchange_rate,p.updated_at,p.update_user');
        $clone_query = clone $query;
        $count = $clone_query->count('p.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach ($rows as $row) {
            setOfficialDates($row, ['start_date', 'end_date'], ['updated_at'], ['']);
        }
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }


    function getDetails($id)
    {
        $row = DB::table('payrolls as p')
            ->selectRaw('p.id, p.name, p.month, p.year,p.start_date,p.end_date, p.p_number, p.head_count,p.total, p.authorized, p.disbursed, p.currency_code, p.exchange_rate')
            ->where('p.id', $id)
            ->first();
        if($row){
            setOfficialDates($row, ['start_date', 'end_date'], ['updated_at'], ['']);
        }
        return $row;
    }

    function getEndDate($ss)
    {
        $end_date = DBX::formatDate('p.end_date', 'end_date') ?? null;
        $row = DB::table('payrolls as p')
            ->selectRaw($end_date)
            ->where('p.branch_id', $ss->branch_id)
            ->orderBy('id', 'DESC')
            ->first();

        if ($row && $row->end_date) {
            $date = new DateTime($row->end_date);
            $date->modify('+1 day');
            $row->end_date = $date->format('d-M-Y');
        } else {
            return (object) ['end_date' => ''];
        }

        return $row;
    }

    function delete($id = null)
    {
        $id = $id ?? $this->id;
        $payroll = self::getProps($id, 'id,authorized');
        if (!$payroll) return DV::error('payroll_id_not_exist');
        if ($payroll->authorized == 1) return DV::error('cannot_delete_authorized_payroll');
        DB::table('payroll_list')->where('payroll_id', $id)->delete();
        DB::table('payrolls')->where('id', $id)->delete();
        return DV::depends(1);
    }

    static function createDisburseTrack($payroll, $id, $ss)
    {
        $nowTime = date('d-M-Y h:i');
        if (!$payroll) $payroll = DB::table('payrolls as p')->where('p.id', $id)->selectRaw('id,total,currency_code')->first();
        $inputs = [
            'payroll_id' => $id,
            'description' => "disbursement by $ss->full_name at $nowTime",
            'total' => $payroll->total,
            'currency_code' => $payroll->currency_code,
            'head_count' => $payroll->head_count
        ];
        $disburse_id = DBX::saveData($ss, 'payroll_disbursements', ['id' => null], $inputs, [], 1, false, 'binary');
        if ($disburse_id) return bin2hex($disburse_id);
        return null;
    }

    // static function getTotalBenefitUsed($emp_benefit_id){
    //    return DB::table('payroll_list_benefits')->where('emp_benefit_id',$emp_benefit_id)->sum('used_amount');
    // }

    static function updatePayrollBenefitBalance($payroll_id, $emp_id, $disburse_id)
    {
        DB::beginTransaction();
        try {
            DB::table('payroll_list_benefits')->where('payroll_id', $payroll_id)->where('emp_id', $emp_id)->update(['disburse_id' => $disburse_id, 'disbursed' => 1]);
            $rows = DB::table('emp_benefits as b')->join('payroll_list_benefits as pb', 'b.id', '=', 'pb.emp_benefit_id')->where('payroll_id', $payroll_id)->selectRaw('b.id as emp_benefit_id,b.amount,b.balance')->get();
            foreach ($rows as $row) {
                $emp_benefit_id = $row->emp_benefit_id ?? 0;
                DB::statement(DB::raw("UPDATE emp_benefits SET balance = amount - (SELECT SUM(used_amount) FROM payroll_list_benefits WHERE emp_benefit_id =$emp_benefit_id AND disbursed =1 AND disburse_id IS NOT NULL) WHERE emp_benefits.id = $emp_benefit_id"));
                DB::table('emp_benefits')->where('id', $emp_benefit_id)->where('emp_id', $emp_id)->update(['last_disburse_id' => $disburse_id]);
            }
        } catch (\Exception $e) {
            DB::rollBack();
        }
        DB::commit();
        return DV::depends(1);
    }

    static function reverseBenefits($payroll_id, $disburse_id = null)
    {
        if (!$disburse_id) {
            $d = Payroll::getProps($payroll_id, 'id,last_disburse_id');
            $disburse_id = $d->last_disburse_id;
        }
        if (!$disburse_id) return;
        $payroll = self::getProps($payroll_id, 'exchange_rate, currency_code');
        if (!$payroll) return DV::error('payroll_id_not_exist');
        $emps = DB::table('payrolls as p')->join('payroll_list as l', 'l.payroll_id', '=', 'p.id')->join('payroll_list_benefits as pb', 'p.id', '=', 'l.payroll_id')->where('p.id', $payroll_id)->selectRaw('pb.emp_id, pb.emp_benefit_id')->get();
        DB::table('payroll_list_benefits')->where('payroll_id', $payroll_id)->update(['disbursed' => 0, 'disburse_id' => null]);
        //$since_date = date('Y-m-d', strtotime('-12 months'));
        //$since_last_year = DBX::convertToDate('pb.updated_at')." >='$since_date'";

        //foreach($emps as $emp){
        //$rows = DB::table('emp_benefits as b')->join('payroll_list_benefits as pb','b.id','=','pb.emp_benefit_id')->where('pb.payroll_id','<>',$payroll_id)->where('b.emp_id',$emp->id)->where('pb.disbursed',1)->whereNotNull('pb.disburse_id')->whereRaw($since_last_year)->selectRaw('emp_benefit_id')->get();
        foreach ($emps as $row) {
            $emp_benefit_id = $row->emp_benefit_id ?? 0;
            DB::statement(DB::raw("UPDATE emp_benefits SET balance = amount - IFNULL((SELECT SUM(used_amount) FROM payroll_list_benefits WHERE emp_benefit_id = $emp_benefit_id AND disbursed =1 AND disburse_id IS NOT NULL),0) WHERE id = $emp_benefit_id"));
            $last_disburse_id = DB::table('payroll_list_benefits AS pb')->where('emp_benefit_id', $emp_benefit_id)->whereNotNull('pb.disburse_id')->orderByRaw('created_at DESC')->value('disburse_id');
            DB::table('emp_benefits')->where('id', $emp_benefit_id)->update(['last_disburse_id' => $last_disburse_id]);
        }
        //}
        return DV::depends(1);
    }

    //disburseAllPayrollList()
    function disburseAll($id = null, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $payroll_id = $id ?? $this->id;
        $master_account_id = 1;

        $payroll = self::getProps($payroll_id, 'id,name,currency_code, total,exchange_rate,head_count');
        if (!$payroll) return DV::error('payroll_id_not_exist');
        if (!self::isAuthorized($payroll_id)) {
            return DV::error('payroll_not_authorized');
        }

        if ($payroll_id) DB::statement(DB::raw("update payrolls set total = (SELECT SUM(IFNULL(total_salary,0)) FROM payroll_list WHERE payroll_id = $payroll_id) WHERE id = $payroll_id"));
        $master_account = DB::table('accounts')
            ->where('id', $master_account_id)
            ->selectRaw('id,balance,currency_code')->first();

        if (!$master_account) {
            return DV::error('Master account not found! NOTE: master account is the Cash Account of the company that is used to send cash to staff`s payroll accounts');
        }
        $master_account_balance = $master_account->balance ?? 0;
        if ($master_account_balance <= 0) return DV::error('The master payroll account balance is now zero!');
        if (self::isDisbursed($payroll_id)) {
            return DV::error('payroll_not_disbursed');
        }
        $master_amount = 0;
        if ($payroll->currency_code != $master_account->currency_code) {
            $master_amount = VSMoney::convert($ss, $master_account->balance, $master_account->currency_code, $payroll->currency_code, $payroll->exchange_rate);
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
        if ($payrollEntries->isEmpty()) return DV::error('It looks like there are no staff in the payroll list');
        $disburse_id = self::createDisburseTrack($payroll, $payroll_id, $ss);
        if (!$disburse_id) return DV::error('Failed to create disbursement track!');
        $bin_disburse_id = hex2bin($disburse_id);
        DB::beginTransaction();
        foreach ($payrollEntries as &$emp) {
            $payroll_account = Employee::getPayrollAccount($emp->emp_id);
            if (!$payroll_account) {
                DB::rollback();
                return DV::error('Staff named ?? does not have payroll account yet!::' . $emp->name);
            } else {
                $emp->account_id = $payroll_account->account_id;
            }
            // if (!isset($payroll_account->account_id)) {
            //     $emp_id_no_account[] = $emp_id;
            // }
            $trx_inputs = ['disburse_id' => $bin_disburse_id, 'to_account_id' => $emp->account_id, 'amount' => $emp->amount, 'exchange_rate' => $emp->exchange_rate, 'remarks' => null, 'payroll_id' => $payroll_id];
            $account = new Account(1, $ss);
            $res = $account->transferTo($trx_inputs);
            if ($res->status_code === 200) {
                $success_count++;
                DB::table('payroll_list')->where('payroll_id', $payroll_id)->where('emp_id', $emp->emp_id)->update(['disbursed' => 1]);
                self::updatePayrollBenefitBalance($payroll_id, $emp->emp_id, $bin_disburse_id);
            } else {
                DB::rollback();
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
        if ($failed_count > 0) {
            DB::rollback();
            return DV::error('Failed to disburse the ?? staffs::' . $failed_count);
        } else {
            DB::table('payrolls')->where('id', $payroll_id)->update(['disbursed' => 1, 'last_disburse_id' => $bin_disburse_id]);
            DB::commit();
        }
        return DV::depends(1, ['success_count' => $success_count, 'failed_count' => $failed_count, 'failed_emps' => $failed_emps]);
    }

    /** changeCurrency() makes change to payroll's currency. This can be done only before payroll is authorized */
    function changeCurrency($new_currency, $exchange_rate, $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $payroll = self::getProps($id, 'id,name,authorized,disbursed,currency_code,exchange_rate,total');
        if (!$payroll) return DV::error('Payroll ID is not valid');
        if ($payroll->authorized == 1) return DV::error('Cannot change currency because the payroll is already authorized');
        DB::beginTransaction();
        try {
            DB::table('payrolls')->where('id', $id)->update(['currency_code' => $new_currency, 'exchange_rate' => $exchange_rate]);
            DB::table('payroll_list')->where('payroll_id', $id)->update(['currency_code' => $new_currency]);
            DB::table('payroll_list_benefits')->where('payroll_id', $id)->update(['currency_code' => $new_currency]);
            $res = $this->calculate($id, $ss);
            if ($res->status_code !== 200) {
                DB::rollBack();
                return $res;
            } else DV::depends(1);
        } catch (\Exception $e) {
            DB::rollBack();
        }
        DB::commit();
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
            'currency_codes' => VSMoney::options_currency($ss),
            'payrolls' => $payroll,
        ];
    }

    static function isEmpty($id)
    {
        $row = DB::table('payroll_list')->where('payroll_id', $id)->select('id')->first();
        return $row ? false : true;
    }

    function authorize($id = null, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        if (self::isEmpty($id)) {
            return DV::error('cannot_authorize_empty_payroll');
        }
        if (self::isAuthorized($id)) {
            return DV::error('payroll_already_authorized');
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
        if (!$default_account) return DV::error('master_payroll_account_not_created');

        $x = DB::table('payrolls')->where('id', $id)->update([
            'authorized' => 1,
            'auth_user' => $ss->full_name,
            'auth_date' => getNowTime(),
            'auth_uid' => $ss->user_id
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
        return "Staff named $row->name doesn't have enough account balance";
    }

    function removeStaff($emp_id, $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $emp = DB::table('payrolls as p')->join('payroll_list as l', 'l.payroll_id', '=', 'p.id')->where('l.payroll_id', $id)->where('emp_id', $emp_id)->selectRaw('p.id as payroll_id, l.id, p.authorized, p.disbursed AS payroll_disbursed, l.disbursed AS staff_disbursed')->first();
        if (!$emp) return DV::error('The staff identity was not found in the payroll list. It seems he or she is not included in the payroll');
        if ($emp->authorized == 1 || $emp->staff_disbursed == 1) return DV::error('Cannot remove the staff because the payroll has been authorized or disbursed already!');

        $x = DB::table('payroll_list')
            ->where('payroll_id', $id)
            ->where('emp_id', $emp_id)
            ->delete();
        return DV::depends($x, null, 'Failed to remove staff from payroll');
    }


    function reverseTransactions($id = null, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $id = $id ?? $this->id;
        $master_account_id = 1;
        $authorized = self::isAuthorized($id);
        if (!$authorized) return DV::error('payroll_not_authorized');
        $isDisbursed = self::isDisbursed($id);
        if (!$isDisbursed) {
            return DV::error('payroll_not_disbursed');
        }
        $payroll = self::getProps($id, 'last_disburse_id');
        if (!$payroll) return DV::error('payroll_id_not_exist');
        $isDisbursed = self::isDisbursed($id);
        if ($isDisbursed) {
            $rows = DB::table('transactions')->where('disburse_id', $payroll->last_disburse_id)->where('status', 'in')->selectRaw('id, account_id, exchange_rate, amount, currency_code')->get();
            $success_count = 0;
            $failed_count = 0;
            foreach ($rows as $row) {
                $inputs = [
                    'to_account_id' => $master_account_id,
                    'payroll_id' => $id,
                    'remarks' => null,
                    'amount' => $row->amount,
                    'exchange_rate' => $row->exchange_rate,
                    'trx_type' => 3,
                    'status' => 'out',
                ];
                $account = new Account($row->account_id, $ss);
                $res = $account->transferTo($inputs);
                if ($res->status_code == 200) {
                    $success_count++;
                    DB::table('payrolls')->where('id', $id)->update(['disbursed' => 0]);
                    DB::table('payroll_list')->where('payroll_id', $id)->update(['disbursed' => 0]);
                    self::reverseBenefits($id, $payroll->last_disburse_id);
                } else {
                    $failed_count++;
                }
            }
            if ($failed_count == 0 && $success_count > 0 || !$isDisbursed) {
                DB::table('payrolls')->where('id', $id)->update(['disbursed' => 0]);
                DB::table('payroll_list')->where('payroll_id', $id)->update(['disbursed' => 0]);
                return DV::depends(1, ['failed_count' => $failed_count, 'success_count' => $success_count]);
            }
            return DV::error("failed_reset_payroll");
        } else {
            return DV::error('payroll_not_disbursed_employee');
        }
    }

    function reset($id = null, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $authorized = self::isAuthorized($id);
        if (!$authorized) return DV::error('payroll_not_authorized');
        $isDisbursed = self::isDisbursed($id);
        $failed_count = -1;
        $success_count = 0;
        DB::beginTransaction();
        if ($isDisbursed) {
            $v_res = $this->reverseTransactions($id, $ss);
            if ($v_res->status_code === 200) {
                $failed_count = $v_res->data['failed_count'];
                $success_count = $v_res->data['success_count'];
            }
        }
        DB::table('payrolls')->where('id', $id)->update(['authorized' => 0, 'auth_user' => null, 'auth_date' => null, 'disbursed' => 0, 'last_disburse_id' => null]);
        DB::table('payroll_list')->where('payroll_id', $id)->update(['disbursed' => 0]);
        if ($failed_count <= 0) {
            DB::commit();
            return DV::depends(1, ['reversed_transaction_count' => $success_count]);
        } else return DV::error('failed_reset_payroll_transaction');
    }

    static function getAllBenefits($emp_id, $payroll)
    {
        $str_emp = $emp_id ? 'pb.emp_id =' . $emp_id : '1=1';
        $rows = DB::table('payroll_list_benefits as pb')->whereRaw($str_emp)->where('pb.payroll_id', '=', $payroll->id)->where('pb.used_amount', '>', 0)->selectRaw('pb.id,pb.payroll_id,pb.emp_id,pb.benefit_id,pb.used_amount,pb.tax_option_id,pb.target_month,flat_tax_rate')->get();
        return $rows;
    }


    /** return the amount of taxable or non-tax benefit. $tax_option_id = {1= Taxable, 2 = nontaxable}
     * NOTE: $payroll = {days,total_days}. if $payroll is given then getSimpleBenefits() returns the split amount, not total benefit
     */
    static function getSimpleBenefits($data, $emp_id, $tax_option_id, $payroll = null)
    {
        if (!in_array($tax_option_id, [1, 2])) {
            return 0;
        }
        $amount1 = $data->filter(fn($x) => $x->emp_id == $emp_id && $x->tax_option_id == $tax_option_id && $x->target_month == 0)
            ->sum('used_amount');
        $amount2 = $data->filter(fn($x) => $x->emp_id == $emp_id && $x->tax_option_id == $tax_option_id && $x->target_month > 0)
            ->sum('used_amount');
        $amount2 = $amount2 * $payroll->days / $payroll->total_days;

        return ($amount1 + $amount2);
    }

    static function getFlatRateBenefits($data, $emp_id, $payroll = null)
    {
        $merged = collect(array_merge(
            $data->filter(fn($x) => $x->emp_id == $emp_id && $x->tax_option_id === 3 && $x->target_month == 0)
                ->groupBy('flat_tax_rate')
                ->map(fn($group, $rate) => [
                    'flat_tax_rate' => $rate,
                    'amount' => $group->sum('used_amount')
                ])
                ->values()
                ->toArray(),
            $data->filter(fn($x) => $x->emp_id == $emp_id && $x->tax_option_id === 3 && $x->target_month > 0)
                ->groupBy('flat_tax_rate')
                ->map(fn($group, $rate) => [
                    'flat_tax_rate' => $rate,
                    'amount' => $group->sum('used_amount') * ($payroll->days / $payroll->total_days)
                ])
                ->values()
                ->toArray()
        ));

        // Group by flat_tax_rate and sum up the amounts
        return $merged->groupBy('flat_tax_rate')
            ->map(fn($group, $rate) => [
                'flat_tax_rate' => $rate,
                'amount' => $group->sum('amount')
            ])
            ->values()
            ->toArray();
    }

    static function formatFlatRateBenefits(array $benefits)
    {
        return collect($benefits)
            ->map(fn($item) => number_format($item['amount'], 2, '.', '') . '@' . $item['flat_tax_rate'])
            ->implode('|');
    }


    //CalculatePayroll()
    function calculate($id = null, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $payroll_id = $id ?? $this->id;
        $payroll = self::getProps($payroll_id, 'id,name,authorized,disbursed,month,year,start_date, end_date,currency_code');
        if (!$payroll) return DV::error('No Payroll ID provided');
        $db_start_date = convertDate($payroll->start_date);
        $db_end_date = convertDate($payroll->end_date);
        $payroll->start_date = $db_start_date;
        $payroll->end_date = $db_end_date;

        if ($payroll->authorized == 1) return DV::error('Cannot calculate payroll that as been authorized! The next step is to disburse payments to all staffs');
        if ($payroll->disbursed == 1) return DV::error('Cannot calculate any amounts because this payroll has been disbursed already!');
        $start_date = DBX::formatDate('p.start_date', 'start_date');
        $end_date = DBX::formatDate('p.end_date', 'end_date');

        $day_in_month = days_in_month($payroll->month, $payroll->year);
        $payroll_days = dateDiff_days($payroll->start_date, $payroll->end_date) + 1;
        $payroll->days = $payroll_days;
        $payroll->total_days = $day_in_month;
        $last_bias = 0;

        $emps = DB::table('payroll_list as pl')
            ->join('employees as e', 'e.id', '=', 'pl.emp_id')
            ->join('emp_types as el', 'el.id', '=', 'e.emp_type_id')
            ->join('payrolls as p', 'p.id', '=', 'pl.payroll_id')
            ->where('p.id', $payroll_id)
            ->selectRaw('pl.id,
                        p.id as payroll_id,
                        ' . $start_date . ',
                        ' . $end_date . ',
                        p.name as payroll_name,
                        p.month,
                        p.year,
                        e.id as emp_id,
                        e.code as emp_code,
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
                        e.last_rejoin_date,
                        e.branch_id as branch_id
                       ')
            ->orderBy('e.id')
            ->get();
        if ($emps->isEmpty()) return DV::error('It seems you have not yet imported active staffs into the payroll');
        $issues = [];
        $issues_count = 0;
        $success_count = 0;
        $fail_count = 0;

        foreach ($emps as $row) {

            $resigned_or_new_start = false;
            $count_days = $payroll->days;
            $count_days_resign = -1;
            $count_days_rejoin = -1;

            $resign = self::count_days_resign($row->emp_id, $payroll->start_date, $payroll->end_date);
            if ($resign->error) {
                $issues_count++;
                $issues[] = (object)[
                    'id' => $row->emp_id,
                    'code' => $row->emp_code,
                    'name' => $row->emp_name,
                    'issue' => $resign->error
                ];
            } else {
                $count_days_resign = $resign->count_days;
                $resigned_or_new_start = $resign->resigned_or_new_start;
            }

            $rejoin = self::count_days_rejoin($row->status_id, $row->last_rejoin_date, $row->joining_date, $payroll->start_date, $payroll->end_date);
            if ($rejoin->error) {
                $issues_count++;
                $issues[] = (object)[
                    'id' => $row->emp_id,
                    'code' => $row->emp_code,
                    'name' => $row->emp_name,
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


            $row->allowance = DB::table('tax_allowances')
                ->where('emp_id', $row->emp_id)
                ->selectRaw('id,allowance,currency_code as allowance_currency')
                ->get();

            $row->apply_payroll_tax = DB::table('employees')
                ->where('id', $row->emp_id)
                ->value('apply_payroll_tax');

            $benefits = self::getAllBenefits($row->emp_id, $payroll);
            $benefits_taxable = self::getSimpleBenefits($benefits, $row->emp_id, 1, $payroll);
            $benefits_not_taxable = self::getSimpleBenefits($benefits, $row->emp_id, 2, $payroll);
            $benefits_flat_rate = self::getFlatRateBenefits($benefits, $row->emp_id, $payroll);
            if ($row->allowance) {
                foreach ($row->allowance as $allowance) {
                    if ($allowance->allowance_currency != $row->payroll_currency) {
                        $allowance->allowance = VSMoney::convert($ss, $allowance->allowance, $allowance->allowance_currency, $row->payroll_currency, (1 / $row->exchange_rate));
                    }
                }
                $row->allowance = $row->allowance->sum('allowance');
            }

            $row->allowance = $row->allowance ?? 0;
            $row->count_days = $count_days;
            $row->benefit_taxable = $benefits_taxable ?? 0;
            $row->benefit_non_tax = $benefits_not_taxable ?? 0;
            $row->benefits_flat_rate = $benefits_flat_rate ?? [];
        }
        foreach ($emps as &$payroll) {
            $payroll->tax_base = 0;
            $payroll->total = 0;
            $benefit_taxable = 0;
            $benefit_non_tax = 0;
            $benefit_flat_rate = 0;
            $benefit_tax = 0;
            $payroll_total = 0;
            $count_days = $payroll->count_days;

            if ($count_days <= 0) {
                $issues_count++;
                $issues[] = (object)[
                    'id' => $payroll->emp_id,
                    'code' => $payroll->emp_code,
                    'name' => $payroll->emp_name,
                    'issue' => 'No days to calculate'
                ];
                continue;
            }
            if ($payroll->salary <= 0) {
                $issues_count++;
                $issues[] = (object)[
                    'id' => $payroll->emp_id,
                    'code' => $payroll->emp_code,
                    'name' => $payroll->emp_name,
                    'issue' => 'No salary to calculate'
                ];
                continue;
            }

            $salary = ($payroll->salary / $day_in_month) * $count_days;
            $benefit_taxable = $payroll->benefit_taxable;
            $benefit_non_tax = $payroll->benefit_non_tax;
            $benefits_flat_rate = $payroll->benefits_flat_rate;
            $total_benefit_flat_rate = array_sum(array_column($payroll->benefits_flat_rate, 'amount'));


            $allowance = $payroll->allowance;
            $allowance_used = ($allowance / $day_in_month) * $payroll_days;
            $allowance_per_day = $allowance_used / $payroll_days;
            $last_allowance = $resigned_or_new_start ? $allowance_per_day * $count_days : $allowance_used;
            $deduction = DB::table('emp_deductions')
                ->where('emp_id', $payroll->emp_id)
                ->whereBetween('deduct_date', [$db_start_date, $db_end_date])
                ->sum('deduct_amount') ?? 0;
            

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

                if ($total_benefit_flat_rate > 0) {
                    $benefit_flat_rate_sum = 0;
                    $benefit_tax = 0;

                    if ($benefit_taxable > 0 || $benefit_non_tax > 0) {
                        if (isset($benefits_flat_rate) && !empty($benefits_flat_rate)) {
                            foreach ($benefits_flat_rate as $bfr) {
                                $benefit_flat_rate = $bfr['amount'];
                                $benefit_flat_tax_rate = $bfr['flat_tax_rate'];

                                $benefit_flat_rate_sum += $benefit_flat_rate;
                                $benefit_tax += $benefit_flat_rate * ($benefit_flat_tax_rate / 100);
                            }
                        }
                        $payroll->total = ($payroll->total + $benefit_flat_rate_sum) - $benefit_tax;
                    } else {
                        $salary_used = $salary;
                        $salary_per_day = $salary_used / $payroll_days;
                        $last_salary = $resigned_or_new_start ? $salary_per_day * $count_days : $salary_used;
                        if (isset($benefits_flat_rate) && !empty($benefits_flat_rate)) {
                            foreach ($benefits_flat_rate as $bfr) {
                                $benefit_flat_rate = $bfr['amount'];
                                $benefit_flat_tax_rate = $bfr['flat_tax_rate'];

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
                if ($benefit_taxable <= 0 && $benefit_non_tax <= 0 && $total_benefit_flat_rate <= 0) {
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

                $salary_used = $salary;
                $salary_per_day = $salary_used / $payroll_days;
                $last_salary = $resigned_or_new_start ? $salary_per_day * $count_days : $salary_used;

                if (isset($benefits_flat_rate) && !empty($benefits_flat_rate)) {
                    foreach ($benefits_flat_rate as $bfr) {
                        $benefit_flat_rate = $bfr['amount'];
                        $benefit_flat_tax_rate = $bfr['flat_tax_rate'];

                        $benefit_flat_rate_sum += $benefit_flat_rate;
                    }
                }
                $payroll->tax_base = 0;
                $payroll->total = ($last_salary + $benefit_taxable + $benefit_non_tax + $benefit_flat_rate_sum) - $deduction;
            }
            $flat_rate_details = null;

            $flat_rate_details = self::formatFlatRateBenefits($benefits_flat_rate);
            // \Log::info(json_encode($flat_rate_details));

            $x = DB::table('payroll_list')->where('id', $payroll->id)->update([
                'tax_base' => $payroll->tax_base,
                'benefit_tax' => $benefit_tax,
                'count_day' => $count_days,
                'p_salary' => $last_salary,
                'benefit_taxable' => $benefit_taxable,
                'benefit_non_tax' => $benefit_non_tax,
                'benefit_flat_rate' => $flat_rate_details,
                'p_allowance' => $last_allowance,
                'p_bias' => $last_bias,
                'deduction' => $deduction,
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

    function importStaffList($id = null, $ss = null)
    {
        $payroll_id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        if (!$payroll_id)  return DV::error('No payroll ID provided');
        $payroll = self::getProps($payroll_id, 'id,name,authorized,disbursed,start_date,end_date');
        if (!$payroll) return DV::error('Payroll period not found');
        $start_date = convertDate($payroll->start_date);
        $end_date = convertDate($payroll->end_date);

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

            $payroll_list_benefit = Employee::savePayrollListBenefit($payroll_id, $emp->emp_id, $ss);
            if ($payroll_list_benefit->status_code != 200)
                $taxable_benefits = DB::table('payroll_list_benefits')->where('payroll_id', $payroll_id)->where('emp_id', $emp->emp_id)->where('tax_option_id', 1)->sum('used_amount');
            $tax_base = $emp_salary + ($taxable_benefits ?? 0);
            if ($emp->salary_currency != $currency_code) {
                $tax_base = VSMoney::convert($ss, $tax_base, $emp->salary_currency, $currency_code, (1 / $exchange_rate));
            }

            if ($emp->apply_payroll_tax == 1) {
                $taxInfo = null;
                if ($currency_code != VSMoney::$national_currency) {
                    if ($exchange_rate == 0) {
                        $exchange_rate = 1;
                    }
                    $tax_base = VSMoney::convert($ss, $tax_base, VSMoney::$national_currency, $currency_code, $exchange_rate);
                    $taxInfo = TaxBracket::get($tax_base);
                    $taxInfo->bias = VSMoney::convert($ss, $taxInfo->bias, VSMoney::$national_currency, $currency_code, (1 / $exchange_rate));
                    $last_bias = $taxInfo->bias;
                    // \Log::info('bias : '.json_encode($taxInfo->bias));
                } else {
                    $taxInfo = TaxBracket::get($tax_base);
                    $last_bias = $taxInfo->bias;
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

            $test_id = DBX::saveData($ss, 'payroll_list', ['id' => $test_id], $inputs, [], 1);

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

    function getStaffList($arr, $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $d = (object) $arr;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) $current_page = 1;
        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $branch_id = $d->branch_id ?? null;
        $sort_by = $d->sort_by ?? 'pl.id';
        $sort_order = $d->sort_order ?? 'asc';
        $disbursed = $d->disbursed ?? null;

        $query = DB::table('payroll_list as pl')
            ->join('employees as e', 'e.id', '=', 'pl.emp_id')
            ->join('positions as pos', 'pos.id', '=', 'e.position_id')
            ->join('payrolls as p', 'p.id', '=', 'pl.payroll_id')
            // ->join('um_branches as b', 'b.id', '=', 'e.branch_id')
            ->selectRaw('pl.id,
                        p.id as payroll_id,
                        p.name as payroll_name,
                        p.exchange_rate,
                        e.id as emp_id,
                        e.name as emp_name,
                        e.phone_number,
                        pos.name as emp_position,
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
                        e.photo_file_name as emp_photo')->where('p.id', $id);

        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->whereRaw("e.name like '%{$search_value}%' or pos.title like '%{$search_value}%' or e.phone_number like '%{$search_value}%'");
        }

        if (!is_null($branch_id)) {
            $query->where('e.branch_id', $branch_id);
        }
        if (!is_null($disbursed)) {
            $query->where('pl.disbursed', $disbursed);
        }
        $query->orderBy($sort_by, $sort_order);
        $clone_query = clone $query;
        $count = $clone_query->count('p.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as &$row) {
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
            // $used_amount = [];
            // $flat_tax_rates = [];

            if ($emp_allowance_count > 1) {
                $row->allowance = $row->allowance->get();
                foreach ($row->allowance as $allowance) {
                    if ($allowance->allowance_currency != $row->currency_code) {
                        $allowance->allowance = VSMoney::convert($ss, $allowance->allowance, $allowance->allowance_currency, $row->currency_code, (1 / $row->exchange_rate));
                    }
                }
                $row->allowance = $row->allowance->sum('allowance');
            } else {
                $allowance = $row->allowance->first();
                if ($allowance) {
                    if ($allowance->allowance_currency != $row->currency_code) {
                        $row->allowance = VSMoney::convert($ss, $allowance->allowance, $allowance->allowance_currency, $row->currency_code, (1 / $row->exchange_rate));
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
                    $taxRate = (string) $bfr->flat_tax_rate;
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
                $row->used_amount = $benefitFlatRate ? [(string) $benefitFlatRate->flat_tax_rate => (float) $benefitFlatRate->used_amount] : 0;
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

    function addStaff($emp_id, $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $payroll = self::getProps($id, 'id,name,authorized,disbursed');
        if (!$payroll) return DV::error('payroll_id_not_exist');
        if ($payroll->authorized == 1 || $payroll->disbursed == 1) return DV::error('Cannot add or remove staff from payroll list because the payroll is already authorized!');
        $inputs = [
            'emp_id' => $emp_id,
            'payroll_id' => $id
        ];
        $pl_id = DBX::saveData($ss, 'payroll_list', ['id' => null], $inputs, [], 1, false);
        return DV::depends($pl_id, null, 'Failed to add staff to payroll list');
    }

    static function getResignInfo($emp_id, $payroll_start_date, $payroll_end_date)
    {
        $q_date = DBX::convertToDate('r.effective_date');
        $str_date = "$q_date BETWEEN '$payroll_start_date' AND '$payroll_end_date'";
        return DB::table('resignations as r')->where('emp_id', $emp_id)->whereRaw($str_date)->selectRaw('r.id, r.effective_date')->orderby('r.effective_date', 'desc')->first();
    }

    static function count_days_resign($emp_id, $payroll_start_date, $payroll_end_date)
    {

        $resigned_or_new_start = false;
        $count_days = -1;
        $resignInfo = self::getResignInfo($emp_id, $payroll_start_date, $payroll_end_date);
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
    static function count_days_rejoin($emp_status_id, $rejoin_date, $joining_date, $payroll_start_date, $payroll_end_date)
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

    // function updateDisburse($id = null, $ss = null)
    // {

    //     if (self::isEmpty($id)) {
    //         return DV::error('Cannot disburse payroll because the ID is empty');
    //     }
    //     $payroll = DB::table('payrolls')->where('id', $id)->select('authorized', 'disbursed')->first();

    //     if (!$payroll) {
    //         return DV::error('Payroll not found');
    //     }
    //     if (!$payroll->authorized) {
    //         return DV::error('Cannot disburse payroll because it is not authorized');
    //     }
    //     if ($payroll->disbursed) {
    //         return DV::error('Cannot disburse payroll because it has already been disbursed');
    //     }
    //     $ss = $ss ? $ss : $this->userInfo;
    //     $x = DB::table('payrolls')->where('id', $id)->update([
    //         'disbursed' => 1,
    //         'update_user' => $ss->full_name,
    //         'update_date' => getNowTime(),
    //         'update_uid' => $ss->user_id
    //     ]);
    //     return DV::depends($x, ['Payroll  disbursed', 'updated']);
    // }
}
