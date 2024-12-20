<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\DBX;

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
            'currency' => '1|choice|KHR,USD',
            'account_type' => '1|choice|Payroll,Wallet',
        ];
        $res = validateObject($arr, $v_rule, true, ['balance'=>['.']], $ss->lang);
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
        if(self::accountNumberExists($account_number,$id)) return DV::error('Account number ?? already exists::'.$account_number);
        if (empty($id)) {
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
            ->where('account_type', $account_type)
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
               a.currency,
               ' . $balance_date . ',
               e.photo_file_name as emp_photo
           ')
           ->where('a.branch_id', $branch_id)
           ->where('a.account_type', 'Payroll')
           ->orderBy('id', 'ASC');

       if ($search_value) {
           $search_value = escape_like_str($search_value);
           $str_search = "a.account_number LIKE '%" . $search_value . "%'
                      OR e.name LIKE '%" . $search_value . "%'
                      OR pos.title LIKE '%" . $search_value . "%'";
           $query->whereRaw($str_search);
       }

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
               a.currency,
               ' . $balance_date . ',
               e.photo_file_name as emp_photo
           ')
           ->where('a.branch_id', $branch_id)
           ->where('a.account_type', 'Wallet')
           ->orderBy('a.id', 'ASC');

       if ($search_value) {
           $search_value = escape_like_str($search_value);
           $str_search = "a.account_number LIKE '%" . $search_value . "%'
                      OR e.name LIKE '%" . $search_value . "%'
                      OR pos.title LIKE '%" . $search_value . "%'";
           $query->whereRaw($str_search);
       }

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
               a.currency,
               a.balance
           ')
           ->where('a.id', $id)
           ->first();

       if ($primaryAccount) {
           $primaryAccount->image_url = Employee::profilePicture($primaryAccount->emp_id);

           $otherAccount = DB::table('accounts as a')
               ->select('id', 'account_type', 'account_number', 'currency', 'balance')
               ->where('a.emp_id', $primaryAccount->emp_id)
               ->where('a.id', '<>', $id)
               ->first();

           if ($otherAccount) {
               $primaryAccount->w_id = $otherAccount->id;
               $primaryAccount->w_account_type = $otherAccount->account_type;
               $primaryAccount->w_account_number = $otherAccount->account_number;
               $primaryAccount->w_currency = $otherAccount->currency;
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

        return DB::table('accounts')->where('id', $id)->delete();
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

            'employees' => GeneralSettings::options_employee([10, 20],$ss),
            'accounts' => $account,
        ];
    }

    /** $arr = [from_account_id, to_account_id, amount, currency_code, remarks] */
    function transfer($arr, $ss) {
        $d = (object) $arr;
        $account_id = DB::table('accounts')->where('account_type', $d->account_type)->where('account_number', $d->account_number)->value('id');
        $emp_id = DB::table('accounts')->where('account_type', $d->account_type)->where('account_number', $d->account_number)->value('emp_id');
        $to_account_id = DB::table('accounts')->where('account_type', $d->to_account_type)->where('account_number', $d->to_account_number)->value('id');


        $trx = $d;
        $trx->trx_type=3;
        $trx->from_account_id = $account_id;
        $trx->to_account_id = $to_account_id;
        $trx->amount = $trx->amount;
        $trx->account_id = $account_id;
        $trx->remarks = "Transfer from $d->account_type $d->account_number to $d->to_account_type $d->to_account_number";
        if($trx->balance < $trx->amount){
            return DV::error('Insufficient Balance');
        }
        // return $trx;
        return $trx = Transaction::createTransaction((array)$trx, $ss);
        if(isset($trx['error'])){
            return DV::error($trx['error']);
        }
        $transfer_amount = 0;

        if(isset($trx['transaction'])){
            $transfer_amount = $trx['transaction']['amount'];
            $account_id = DB::table('accounts')->where('emp_id', $trx['transaction']['emp_id'])->value('id');
            $updateBalance_acc = Account::updateBalance($account_id,'accounts','in',  $trx['transaction']['amount'], $trx['trx_id'], $ss);
        }

        $payroll_account = DB::table('accounts as a')
            ->where('a.account_number', $d->account_number)
            ->where('account_type','Payroll')
            ->selectRaw(' a.id as account_id,a.account_number,a.emp_id')->first();
        if(!$payroll_account){
            return DV::error('Payroll Account not found!');
        }
        $wallet_account = DB::table('accounts as wa')
            ->where('wa.account_number', $d->w_account_number)
            ->where('account_type','Wallet')
            ->selectRaw(' wa.id as w_account_id,wa.account_number as w_account_number,wa.emp_id')->first();
        if(!$wallet_account){
            return DV::error('Wallet Account not found!');
        }
        $payroll_account->trx_type=2;
        $payroll_account->emp_id = $payroll_account->emp_id;
        $payroll_account->from_account_id = $payroll_account->account_number;
        $payroll_account->to_account_id = $wallet_account->w_account_number;
        $payroll_account->remarks = 'Payroll to Wallet';
        $payroll_account->amount = $transfer_amount;
        $account_id = $payroll_account->account_id;
        $last_balance = $payroll_account->amount;
        \Log::info((array)$payroll_account);

        $payroll_account = Transaction::withdrawal((array)$payroll_account, $ss);
        if($payroll_account->status_code == 405){
            return DV::error($payroll_account->error_message);
        }
        if($payroll_account->status_code == 200){
            \Log::info(json_encode($payroll_account));
            $payroll_account = $payroll_account->data;
            $updateBalance_def = Account::updateBalance($account_id,'accounts','out',  $payroll_account['transaction']['amount'], $payroll_account['trx_id'], $ss);
        }

        if($updateBalance_acc && $updateBalance_def){
            return DV::depends(1, ['Transferred Successfully' => '']);
        }
        return DV::error('Error transferring account');

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
            // 'account_id' => '0|number',
            'to_account_id' => '1|number',
        ];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $inputs['status'] = 'out';

        $id = saveData($ss,'transactions', ['id' =>null], $inputs, [], 1,false, 'binary');
        $hex_trx_id = bin2hex($id);
        return DV::depends($hex_trx_id, ['transaction' => $inputs,'trx_id'=>$hex_trx_id],'Failed to save transaction');
    }

}
