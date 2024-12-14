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

    function save($arr = [] , $ss = null , $id = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [

            'emp_id' => '1|number',
            'account_number' => '0|string|0-30',
            'balance' => '0|number|default=0',
            'currency' => '1|choice|USD,KHR',
            'account_type' => '1|Choice|Payroll,Wallet',
        ];
        $res = validateObject($arr, $v_rule, true, ['balance'=>['.']], $ss->lang);
        if ($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $emp_id = $inputs['emp_id'];
        $emp = Employee::getProps($emp_id,'id,code,name');
        if (!$emp) return DV::error('Employee ID does not exist');
        $inputs['balance'] = (float) str_replace(',', '', $inputs['balance']) ;
        $account_number = $inputs['account_number'];
        if(!$account_number) $account_number = $emp->code;
        $inputs['account_number'] = $account_number;
        if(!self::accountNumberExists($account_number)) return DV::error('Account number ?? already exists::'.$account_number);  
        if (empty($id)) {
            $existingAccount = DB::table('accounts')
                ->where('branch_id', $branch_id)
                ->where('emp_id', $inputs['emp_id'])
                ->first();

            if ($existingAccount) {
                return DV::error('The employee already has an account.');
            }
        }
        return DV::depends($id, ['id' => $id], 'Failed to save account information');
    }

   static function accountNumberExists($account_number){
      $id = DB::table('accounts')->where('account_number',$account_number)->value('id');
      return $id? true:false;  
   }

    function getList($arr, $ss)
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
            ->where('a.branch_id', $branch_id);

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
        $row = DB::table('accounts as a')
            ->join('employees as e', 'e.id', '=', 'a.emp_id')
            ->join('positions as pos', 'pos.id', '=', 'e.position_id')
            ->join('wallet_accounts as wa', 'wa.emp_id', '=', 'a.emp_id')
            ->selectRaw('
                a.id,
                a.emp_id,
                e.name as emp_name,
                pos.title as position,
                a.account_type,
                a.account_number,
                a.currency,
                a.balance,
                wa.account_number as w_account_number,
                wa.account_type as w_account_type
            ')
            ->where('a.id', $id)->first();

        if ($row) {
            $row->image_url = Employee::profilePicture($row->emp_id);
            return $row;
        } else {
             return null;
        }

    }
 
    function delete($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        if (!$id) return DV::error('Account ID is not valid'); 

        $x = DB::table('accounts')
            ->where('id', $id)
            ->delete();
        DBX::deleteForeignKeyRows(self::$fk_tables,$id,false);         
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

            'employees' => GeneralSettings::options_employee(10, $ss),
            'accounts' => $account,
        ];
    }

    /** $arr = [from_account_id, to_account_id, amount, currency_code, remarks] */
    function transfer($arr, $ss) {
        $d = (object) $arr;
        $account_id = DB::table('accounts')->where('emp_id', $d->emp_id)->value('id');
        $w_account_id = DB::table('wallet_accounts')->where('emp_id', $d->emp_id)->value('id');

        $trx = $d;
        $trx->trx_type=3;
        $trx->transfer_acc_id = $account_id;
        $trx->from_acc_num = $trx->w_account_number;
        $trx->to_acc_num = $trx->w_account_number;
        $trx->amount = $trx->w_balance;
        $trx->account_id = $w_account_id;
        $trx->remarks = 'From Payroll to Wallet';
        if($trx->balance < $trx->amount){
            return DV::error('Insufficient Balance');
        }

        $trx = Transaction::transfer((array)$trx, $ss);
        $transfer_amount = 0;

        if($trx){
            $transfer_amount = $trx['transactions']['amount'];
            $account_id = DB::table('wallet_accounts')->where('emp_id', $trx['transactions']['emp_id'])->value('id');
            $updateBalance_acc = PayrollAccount::updateBalance($account_id,'wallet_accounts','in',  $trx['transactions']['amount'], $trx['trx_id'], $ss);
        }

        $payroll_account = DB::table('accounts as a')
            ->where('a.account_number', $d->account_number)
            ->selectRaw(' a.id as account_id,a.account_number,a.emp_id')->first();
        $wallet_account = DB::table('wallet_accounts as wa')
            ->where('wa.account_number', $d->w_account_number)
            ->selectRaw(' wa.id as w_account_id,wa.account_number as w_account_number,wa.emp_id')->first();

        $payroll_account->trx_type=2;
        $payroll_account->emp_id = $payroll_account->emp_id;
        $payroll_account->from_acc_num = $payroll_account->account_number;
        $payroll_account->to_acc_num = $wallet_account->w_account_number;
        $payroll_account->remarks = 'Payroll to Wallet';
        $payroll_account->amount = $transfer_amount;
        $account_id = $payroll_account->account_id;
        $last_balance = $payroll_account->amount;

        $payroll_account = Transaction::withdrawal((array)$payroll_account, $ss);

        if($payroll_account){
            $updateBalance_def = PayrollList::updateBalance($account_id,'accounts','out',  $payroll_account['transactions']['amount'], $payroll_account['trx_id'], $ss);
        }

        if($updateBalance_acc && $updateBalance_def){

            return DV::depends(1, ['Transferred Successfully' => '']);
        }
        return DV::error('Error transferring account');

    }
}
