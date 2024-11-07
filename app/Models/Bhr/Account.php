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

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function save($arr, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id' => '0|identity=1',
            'emp_id' => '1|number',
            'account_number' => '1|number',
            'balance' => '0|number',
            'currency' => '1|string',
            'account_type' => '1|string',

        ];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;

        $id = saveData($ss, 'accounts', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['accounts' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving account');
    }

    function getAccountListPaginate($arr, $ss)
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
        $sort_by = $d->sort_by ?? 'a.id';
        $sort_order = $d->sort_order ?? 'asc';
        $search_id = $d->id ?? null;
        $balance_date = DBX::formatDate('a.last_balance_date','last_balance_date');

        $str_search = '1=1';

                $query = DB::table('accounts as a')
                ->join('employees as e', 'e.id', '=', 'a.emp_id')
                ->join('positions as pos', 'pos.id', '=', 'e.position_id')
                // ->join('transactions as t', 't.id', '=', 'a.trx_id')
                ->selectRaw('
                    a.id,
                    a.emp_id,
                    e.name as emp_name,
                    pos.title as position,
                    a.account_type,
                    a.account_number,
                    a.balance,
                    a.currency,
                    '.$balance_date.        ',
                    e.photo_file_name as emp_photo
                ')

                ->where('a.branch_id', $branch_id);

        if ($search_id) {
            $query->where('a.id', $search_id);
        }
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "a.account_number LIKE '%" . $search_value . "%'
                       OR e.name LIKE '%" . $search_value . "%'
                       OR pos.title LIKE '%" . $search_value . "%'";
            $query->whereRaw($str_search);
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
        $row = DB::table('accounts as a')
            ->join('employees as e', 'e.id', 'a.emp_id')
            ->join('positions as pos', 'pos.id', '=', 'e.position_id')
            // ->join('transactions as t', 't.id', '=', 'a.trx_id')
            ->join('wallet_accounts as wa', 'wa.emp_id', '=', 'a.emp_id')
            ->selectRaw('a.id, a.emp_id, e.name as emp_name, pos.title as position,a.account_type, a.account_number,a.currency,a.balance,e.photo_file_name as emp_photo,wa.account_number as w_account_number,wa.account_type as w_account_type')
            ->where('a.id', $id)->first();
        if ($row) {
            $row->image_url = Employee::profilePicture($row->emp_id);
            unset($row->emp_photo);
        } else {
            $row = null;
        }
        return $row;
    }

    function deleteAccount($id, $ss)
    {
        if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        $branch_id = $ss->branch_id;

        $query = DB::table('accounts')
            ->where('id', $id)
            ->delete();
        if (!$query) {
            return DV::error('Account not found');
        }

        return $query;
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

    function transfer($arr, $ss) {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
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
            $updateBalance_acc = PayrollList::updateBalance($account_id,'wallet_accounts','in',  $trx['transactions']['amount'], $trx['trx_id'], $ss);
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
