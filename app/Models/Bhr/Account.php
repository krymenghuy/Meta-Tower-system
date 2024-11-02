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
                ->join('transactions as t', 't.id', '=', 'a.trx_id')
                ->selectRaw('
                    a.id,
                    a.emp_id,
                    e.name as emp_name,
                    pos.title as position,
                    a.account_type,
                    a.account_number,
                    t.amount as transaction_amount,
                    t.trx_type,
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
            ->join('transactions as t', 't.id', '=', 'a.trx_id')
            ->selectRaw('a.id, a.emp_id, e.name as emp_name, pos.title as position,a.account_type, a.account_number,t.amount as transaction_amount,t.trx_type,a.currency,a.balance,formatdate(a.last_balance_date) as last_balance_date,e.photo_file_name as emp_photo')
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

    function transfer($arr, $ss)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $trx = (object) [];

        $payroll_account = DB::table('accounts')
            ->where('account_number', $d->account_number)
            ->value('balance');

        $payroll_balance = $payroll_account - $d->w_balance;

        $trx->emp_id = $d->emp_id;
        $trx->trx_type='3';
        $trx->amount = $d->w_balance*(-1);
        $trx->status = 'out';

        $trx = Transaction::save((array)$trx, $ss);

        DB::table('accounts')
            ->where('account_number', $d->account_number)
            ->update(['balance' => $payroll_balance, 'trx_id' => hex2bin($trx['trx_id'])]);

        $wellet = DB::table('wallet_accounts')
            ->where('w_account_number', $d->w_account_number)
            ->value('w_balance');

        $new_wellet_balance = $d->w_balance + $wellet;

        $wellet = DB::table('wallet_accounts')
            -where('w_account_number', $d->w_account_number)
            ->update(['w_balance' => $new_wellet_balance]);
    }
}
