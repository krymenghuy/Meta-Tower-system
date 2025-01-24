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
    static function getProps($id,$cols='id,name,currency_code,total,exchange_rate'){
        return DB::table('payrolls')->where('id',$id)->selectRaw($cols)->first();
    }
    function save($arr = [],$id = null, $ss = null)
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
            'currency_code'=> '1|choice|KHR,USD|default='.Money::$base_currency,
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
        $err = self::checkDuplicateName($d->name,$id);
        if($err) return DV::error($err);

        $err = self::validatePayrollDates($d->start_date,$d->end_date,$id);
            if($err) return DV::error($err);

        if(!$id)
        {
            $checkExist = DB::table('payrolls')->where('month',$inputs['month'])->where('year',$inputs['year'])->where('start_date',$inputs['start_date'])->where('end_date',$inputs['end_date'])->take(1)->value('id');
            if($checkExist){
                return DV::error($inputs['name'].' is already exist!');
            }
        }


        $id = saveData($ss, 'payrolls', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['payrolls' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving payroll');
    }

    static function validatePayrollDates($start_date, $end_date, $id) {
        $str_id = '1 = 1';
        if ($id) {
            $str_id = "p.id <> $id";
        }

        if (new DateTime($start_date) > new DateTime($end_date)) {
            return 'Start Date and End Date is not correct!';
        }

        $start = convertDate($start_date);
        $end = convertDate($end_date);
        $count_days = dateDiff_days($start, $end) + 1 ;

        $test = $count_days;
        if ($test > 31) {
            return 'The difference between Start Date and End Date cannot be longer than 31 days!';
        }
        return null;
    }
    static function checkDuplicateName($name,$id){
        $str_id = '1 = 1';
        if($id){
            $str_id = "p.id <> $id";
        }
        $test = DB::table('payrolls as p')->where('p.name',$name)->whereRaw($str_id)->select('id')->first();
        if($test)
            return 'Payrll name ?? already exist::'.$name;
            // return DV::error('Payrll name ?? ??already exist::'.$name .';'.$name);

        return null;
    }

    static function isDisbursed($id){
        if(!$id) return false;
        $x = DB::table('payrolls as p')->where('id',$id)->value('disbursed');
        if(!$x) return false;
        return $x==1;
    }
    static function isAuthorized($id){
        if(!$id) return false;
        $x = DB::table('payrolls')->where('id',$id)->value('authorized');
        if(!$x) return false;
        return $x ==1;
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
                         p.currency_code, p.exchange_rate,'.$updated_date.',p.update_user')
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
        $payroll = self::getProps($id,'id,authorized');
        if(!$payroll) return DV::error('The provided payroll ID does not exist');
        if($payroll->authorized ==1) return DV::error('Cannot delete authorized payroll!');
        DB::table('payroll_list')->where('payroll_id',$id)->delete();
        DB::table('payrolls')->where('id',$id)->delete();
        return DV::depends(1);
    }

    /** reset payroll back to Pending (non-authorized), and remove all its disbursement transactions */
    function resetStatus($id = null){

    }

    /** changeCurrency() makes change to payroll's currency. This can be done only before payroll is authorized */
    function changeCurrency($new_currency,$exchange_rate, $id = null, $ss = null){
      $id = $id ?? $this->id;
      $ss = $ss ?? $this->userInfo;
      $payroll = self::getProps($id,'id,name,authorized,disbursed,currency_code,exchange_rate,total');
      if(!$payroll) return DV::error('Payroll ID is not valid');
      if($payroll->authorized ==1) return DV::error('Cannot change currency because the payroll is already authorized1');
      DB::table('payrolls')->where('id',$id)->update(['currency_code'=>$new_currency, 'exchange_rate'=>$exchange_rate]);
      DB::table('payroll_list')->where('payroll_id',$id)->update(['currency_code'=>$new_currency]);
      $pl = new \App\Models\Bhr\PayrollList();
      $res = $pl->calculatePayrollList($id,$ss);
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

    static function isEmpty($id){
        $row = DB::table('payroll_list')->where('payroll_id',$id)->select('id')->first();
        return $row? false: true;
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
    function reverseTransactions($id){

    }
    function reset($id = null, $ss = null){
        $ss = $ss ?? $this->userInfo;

        $notAuthorized = DB::table('payrolls')->where('id', $id)->value('authorized');
        if ($notAuthorized != 1){
            return DV::error('Payroll is not authorizad yet!');
        }
        $isDisbursed = DB::table('payrolls')->where('id', $id)->value('disbursed');
        if ($isDisbursed === 1){
            return DV::error('Payroll is already disbursed!');
        }
        $master_account_id = 1;
        $total = DB::table('payrolls as p')
        ->where('id', $id)
        ->selectRaw('id,total as amount')
            ->first();
        if (!$total || $total->amount <= 0) {
            return DV::error('The payroll total is zero. You may need to click Calculate button on Payroll List');
        }

        $payroll_amount = DB::table('payrolls as p')
        ->where('p.id', $id)
        ->selectRaw('total')->first();

        if (!$payroll_amount) return DV::error('Payroll not found!');
        if($payroll_amount->total <= 0) return DV::error('Payroll total is zero!');

        if ($total) {

            $total->trx_type = 2;
            $total->account_id = 1;
            $total->payroll_id = $total->id;
            $total->from_account_id = $master_account_id;
            $total->amount = $payroll_amount->total;
        }

        $total = Account::withdraw((array)$total, $ss)->data;
        $from_account_id = $total['transaction']['from_account_id'];
        $amount = $total['transaction']['amount'];
        if(!$total){
            return DV::error('Failed to reverse transaction');
        }
        if($total){
            $update_balance = Account::updateBalance($from_account_id, 'accounts', 'out', $amount, $total['trx_id'], $ss);
        }
        $x = DB::table('payrolls')->where('id', $id)->update([
            'authorized' => 0,
            'update_user' => $ss->full_name,
            'update_date' => getNowTime(),
            'update_uid' => $ss->user_id
        ]);
        return DV::depends($x, ['Payroll  authorize', 'reset']);
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
            'update_user'=>$ss->full_name,
            'update_date'=>getNowTime(),
            'update_uid'=>$ss->user_id
        ]);
        return DV::depends($x, ['Payroll  disbursed', 'updated']);
    }

}

