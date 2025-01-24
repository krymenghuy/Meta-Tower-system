<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\DBX;
use App\Models\Money;

class Account
{

    protected $id = null;
    protected $userInfo = null;

     protected $fk_tables = [
        'transactions'=>'account_id',
     ];

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function save($arr = []  , $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [

            'emp_id' => '1|number',
            'account_number' => '0|string|0-30',
            'balance' => '0|number|default=0',
            'currency_code'=> '1|choice|KHR,USD|default='.Money::$base_currency,
            'account_type' => '1|choice|Payroll,Wallet',
        ];
        $res = validateObject($arr, $v_rule, true, ['balance'=>['.'],'account_number'=>['-']], $ss->lang);
        if ($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $emp_id = $inputs['emp_id'];
        $emp = Employee::getProps($emp_id,'id,code,name');
        if (!$emp) return DV::error('Employee ID does not exist');
        $inputs['balance'] = (float) str_replace(',', '', $inputs['balance']) ;
        $account_number = $inputs['account_number'];
        if (!$account_number) {
            if ($inputs['account_type'] === 'Payroll') {
                $account_number = $emp->code.'-P';
            } elseif ($inputs['account_type'] === 'Wallet') {
                $account_number = $emp->code.'-W';
            } else {
                $account_number = $emp->code;
            }
        }
        $inputs['account_number'] = $account_number;

        if(!$account_number) $account_number = $emp->code;
        $inputs['account_number'] = $account_number;


        if (empty($id)) {
            if(self::accountNumberExists($account_number,$id)) return DV::error('Account number ?? already exists::'.$account_number);

            $existingAccount = DB::table('accounts')
                ->where('branch_id', $branch_id)
                ->where('emp_id', $inputs['emp_id'])
                ->where('account_type', $inputs['account_type'])
                ->first();

            if ($existingAccount) {
                return DV::error('The employee already has an account.');
            }
        }

        $id = saveData($ss,'accounts', ['id' => $id], $inputs, [], 1);

        return DV::depends($id, ['id' => $id], 'Failed to save account information');
    }

    static function accountNumberExists($account_number, $account_type, $id = null) {
        $str_id = $id > 0 ? 'id <> '.$id : '1=1';

        $exists = DB::table('accounts')
            ->where('account_number', $account_number)
            ->whereRaw($str_id)
            ->exists();

        return $exists;
    }


   function PayrollList($arr, $ss)
   {
       $d = (object) $arr;
       $branch_id = $ss->branch_id;

       $current_page = $d->current_page ?? 1;
       $per_page = $d->per_page ?? 10;
       if (!is_numeric($current_page))  $current_page = 1;
       $skip_rows = ($current_page - 1) * $per_page;
       $search_value = $d->search_value ?? null;
       $sort_by = $d->sort_by ?? 'a.id';
       $sort_order = $d->sort_order ?? 'asc';
       $balance_date = DBX::formatDate('a.last_balance_date', 'last_balance_date');

       $str_search = '1=1';

       $query = DB::table('accounts as a')
           ->join('employees as e', 'e.id', '=', 'a.emp_id')
           ->join('positions as pos', 'pos.id', '=', 'e.position_id')
           ->selectRaw('
               a.id,
               a.emp_id,
               e.name as emp_name,
               pos.title as position,
               a.account_type,
               a.account_number,
               a.balance,
               a.currency_code,
               ' . $balance_date . ',
               e.photo_file_name as emp_photo
           ')
           ->where('a.branch_id', $branch_id)
           ->where('a.account_type', 'Payroll');

           if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->where('e.name', 'LIKE', '%' . $search_value . '%');
        }

       $query->orderBy($sort_by, $sort_order);
       $count = $query->count('a.id');
       $rows = $query->skip($skip_rows)->take($per_page)->get();

       foreach ($rows as $row) {
           $row->image_url = $row->emp_photo ? Employee::profilePicture($row->emp_id) : '';
           unset($row->emp_photo);
       }

       return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
   }

   function WalletList($arr, $ss)
   {
       $d = (object) $arr;
       $branch_id = $ss->branch_id;

       $current_page = $d->current_page ?? 1;
       $per_page = $d->per_page ?? 10;
       if (!is_numeric($current_page))  $current_page = 1;
       $skip_rows = ($current_page - 1) * $per_page;
       $search_value = $d->search_value ?? null;
       $sort_by = $d->sort_by ?? 'a.id';
       $sort_order = $d->sort_order ?? 'asc';
       $balance_date = DBX::formatDate('a.last_balance_date', 'last_balance_date');

       $str_search = '1=1';

       $query = DB::table('accounts as a')
           ->join('employees as e', 'e.id', '=', 'a.emp_id')
           ->join('positions as pos', 'pos.id', '=', 'e.position_id')
           ->selectRaw('
               a.id,
               a.emp_id,
               e.name as emp_name,
               pos.title as position,
               a.account_type,
               a.account_number,
               a.balance,
               a.currency_code,
               ' . $balance_date . ',
               e.photo_file_name as emp_photo
           ')
           ->where('a.branch_id', $branch_id)
           ->where('a.account_type', 'Wallet');


       if ($search_value) {
        $search_value = escape_like_str($search_value);
        $query->where('e.name', 'LIKE', '%' . $search_value . '%');
        }

       $query->orderBy($sort_by, $sort_order);
       $count = $query->count('a.id');
       $rows = $query->skip($skip_rows)->take($per_page)->get();

       foreach ($rows as $row) {
           $row->image_url = $row->emp_photo ? Employee::profilePicture($row->emp_id) : '';
           unset($row->emp_photo);
       }

       return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
   }


   function getDetails($id, $ss)
   {
       $primaryAccount = DB::table('accounts as a')
           ->join('employees as e', 'e.id', '=', 'a.emp_id')
           ->join('positions as pos', 'pos.id', '=', 'e.position_id')
           ->selectRaw('
               a.id,
               a.emp_id,
               e.name as emp_name,
               pos.title as position,
               a.account_type,
               a.account_number,
               a.currency_code,
               a.balance
           ')
           ->where('a.id', $id)
           ->first();

       if ($primaryAccount) {
           $primaryAccount->image_url = Employee::profilePicture($primaryAccount->emp_id);

           $otherAccount = DB::table('accounts as a')
               ->select('id', 'account_type', 'account_number', 'currency_code', 'balance')
               ->where('a.emp_id', $primaryAccount->emp_id)
               ->where('a.id', '<>', $id)
               ->first();

           if ($otherAccount) {
               $primaryAccount->w_id = $otherAccount->id;
               $primaryAccount->w_account_type = $otherAccount->account_type;
               $primaryAccount->w_account_number = $otherAccount->account_number;
               $primaryAccount->w_currency_code = $otherAccount->currency_code;
               $primaryAccount->w_balance = $otherAccount->balance;
           }

           return $primaryAccount;
       }

       return null;
   }



    function delete($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $delete = DB::table('accounts')->where('id', $id)->delete();
        return DV::depends($delete,null,'Error deleting account');
    }

    function getFormOptions($id, $ss)
    {
        $account = null;
        if ($id) {
            $account = self::getDetails($id, $ss);
        }
        return (object) [

            'sort_by' => [
                ['id' => 'e.name', 'name' => 'By Name'],
                ['id' => 'a.account_number', 'name' => 'By Account Number'],
                ['id' => 'a.balance', 'name' => 'By  Balance'],
            ],
            'currency_codes' => Money::options_currency($ss),
            'employees' => GeneralSettings::options_employee([10, 20],$ss),
            'accounts' => $account,
        ];
    }
    function ConfirmTransfer($arr, $ss) {
        $d = (object) $arr;

        $from_account_id = DB::table('accounts')->where('account_type', $d->account_type)->where('account_number', $d->account_number)->value('id');
        $emp_id = DB::table('accounts')->where('account_type', $d->to_account_type)->where('account_number', $d->to_account_number)->value('emp_id');
        $emp_name = DB::table('employees')->where('id', $emp_id)->value('name');
        $to_account_id = DB::table('accounts')->where('account_type', $d->to_account_type)->where('account_number', $d->to_account_number)->value('id');

        if (!$from_account_id || !$to_account_id) {
            return DV::error('Account not found');
        }

        if($d->balance < $d->amount) {
            return DV::error('Insufficient balance');
        }
        return DV::depends(1, [
            'emp_name' => $emp_name,
            'from_account_type' => $d->account_type,
            'from_account_number' => $d->account_number,
            'to_account_type' => $d->to_account_type,
            'to_account_number' => $d->to_account_number,
            'amount' => $d->amount
        ]);
    }

    function transfer($arr, $ss) {
        $d = (object) $arr;
        $transfer_amount = 0;

        $from_account_id = DB::table('accounts')->where('account_type', $d->account_type)->where('account_number', $d->account_number)->value('id');
        $to_account_id = DB::table('accounts')->where('account_type', $d->to_account_type)->where('account_number', $d->to_account_number)->value('id');
        $emp_id = DB::table('accounts')->where('account_type', $d->to_account_type)->where('account_number', $d->to_account_number)->value('emp_id');
        $emp_name = DB::table('employees')->where('id', $emp_id)->value('name');

        if (!$from_account_id || !$to_account_id) {
            return DV::error('Account not found');
        }

        $amount_in = $d->amount;
        $amount_out = $d->amount;

        if ($d->currency_code === 'KHR' && $d->to_account_currency_code === 'USD') {
            $amount_out = $amount_in * $d->exchange_rate;
        } elseif ($d->currency_code === 'USD' && $d->to_account_currency_code === 'KHR') {
            $amount_out = $amount_in / $d->exchange_rate;
        }

        if($d->balance < $amount_out) {
            return DV::error('Insufficient balance');
        }

        $trx = $d;
        $trx->trx_type = 3;
        $trx->emp_id = $emp_id;
        $trx->from_account_id = $from_account_id;
        $trx->to_account_id = $to_account_id;
        $trx->account_id = $to_account_id;
        $trx->remarks = " From $d->account_type $d->account_number";
        $trx->amount = $amount_in;

        $transfer = Transaction::createTransaction((array)$trx, $ss);

        if ($transfer) {
            $transfer_amount = $transfer->transaction['amount'];
            $updateBalance_acc = Account::updateBalance($to_account_id, 'accounts', 'in', $transfer_amount, $transfer->trx_id, $ss);
        } else {
            return DV::error('Error saving transaction');
        }

        $withdrawData = (array)$trx;
        unset($withdrawData['account_id']);
        unset($withdrawData['emp_id']);
        unset($withdrawData['remarks']);

        $emp_id = DB::table('accounts')->where('account_type', $d->account_type)->where('account_number', $d->account_number)->value('emp_id');
        $withdrawData['emp_id'] = $emp_id;
        $withdrawData['account_id'] = $from_account_id;
        $withdrawData['amount'] = $amount_out;
        $withdrawData['remarks'] = " To $d->to_account_type $d->to_account_number";

        $res = Account::withdraw($withdrawData, $ss);

        if ($res->status == 'Error') {
            return $res;
        }

        $trx = (object)$res->data;

        if ($trx) {
            $updateBalance_def = Account::updateBalance($from_account_id, 'accounts', 'out', $trx->transaction['amount'], $trx->trx_id, $ss);
        }

        if ($updateBalance_acc && $updateBalance_def) {
            return DV::depends(1, [
                'from_account_type' => $d->account_type,
                'from_account_number' => $d->account_number,
                'to_account_type' => $d->to_account_type,
                'to_account_number' => $d->to_account_number,
                'emp_name' => $emp_name,
                'amount_in' => $amount_in,
                'amount_out' => $amount_out,
            ]);
        }

        return DV::error('Error transferring account');
    }


    function getAccountInfo($arr, $ss) {
        $d = (object) $arr;

        $account_type = DB::table('accounts')->where('account_number', $d->account_number)->value('account_type');
        $emp_id = DB::table('accounts')->where('account_number', $d->account_number)->value('emp_id');
        $emp_name = DB::table('employees')->where('id', $emp_id)->value('name');
        $currency_code = DB::table('accounts')->where('account_number', $d->account_number)->value('currency_code');

        return DV::depends(1, [
            'account_type' => $account_type,
            'emp_name' => $emp_name,
            'currency_code' => $currency_code

        ]);

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

    static function withdraw($arr,$ss){
        $v_rule = [
            'emp_id' => '0|number',
            'payroll_id' => '0|number',
            'amount' => '1|number',
            'remarks' => '0|string|250',
            'trx_type' => '1|number',
            'status'=>'0|string|10',
            'account_id' => '0|number',
            'from_account_id' => '1|number',
            'to_account_id' => '0|number',
        ];

        $res = validateObject($arr, $v_rule, true, ['remarks'=>['-']], $ss->lang);
        if ($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $inputs['status'] = 'out';

        $id = saveData($ss,'transactions', ['id' =>null], $inputs, [], 1,false, 'binary');
        $hex_trx_id = bin2hex($id);
        return DV::depends($hex_trx_id, ['transaction' => $inputs,'trx_id'=>$hex_trx_id],'Failed to save transaction');
    }

    function printTransaction($arr, $ss)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $last_balance_date = DBX::formatDate('a.last_balance_date', 'last_balance_date');
        $date = DBX::formatDate('t.created_at', 'created_at');
        $str_emp_id = '1=1';
        $emp_id = $d->emp_id ?? null;

        if ($emp_id) {
            $str_emp_id = 'e.id=' . $emp_id;
        }

        $account_id = $d->account_id ?? null;
        $str_account_id = '2=2';

        if ($account_id) {
            $str_account_id = 'a.id=' . $account_id;
        }

        $query = DB::table('accounts as a')
            ->join('employees as e', 'e.id', '=', 'a.emp_id')
            ->whereRaw($str_emp_id)
            ->whereRaw($str_account_id)
            ->selectRaw('
                a.id as account_id,
                a.account_number,
                a.account_type,
                a.currency_code,
                a.balance,
                ' . $last_balance_date . ',
                e.id as emp_id,
                e.name as emp_name,
                e.photo_file_name as emp_photo
            ')
            ->orderBy('e.id');

        $rows = $query->get();

        foreach ($rows as $row) {
            $threeMonthsAgo = now()->subMonths(3); // Get the date 3 months ago

            $row->trx = DB::table('transactions as t')
                ->leftJoin('accounts as fa', 'fa.id', '=', 't.from_account_id')
                ->leftJoin('accounts as ta', 'ta.id', '=', 't.to_account_id')
                ->where('t.account_id', $row->account_id)
                ->where('t.emp_id', $row->emp_id)
                ->where('t.created_at', '>=', $threeMonthsAgo) // Filter by the last 3 months
                ->selectRaw('
                    t.trx_type,
                    t.from_account_id,
                    t.to_account_id,
                    fa.account_number as from_account_number,
                    ta.account_number as to_account_number,
                    t.amount,
                    ' . $date . ',
                    t.status,
                    t.remarks
                ')
                ->orderBy('t.created_at', 'desc')
                ->get();

            $row->image_url = $row->emp_photo
                ? Employee::profilePicture($row->emp_id)
                : '';

            unset($row->emp_photo);
        }

        return [
            'status' => 'OK',
            'status_code' => 200,
            'data' => $rows,
        ];
    }
}
