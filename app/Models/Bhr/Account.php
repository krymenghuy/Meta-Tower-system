<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

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
            'account_type_id' => '1|number',

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
        $search_account_type_id = $d->account_type_id ?? null;
        $last_balance_date = convertDate($d->last_balance_date ?? null); // Assuming convertDate handles date parsing

        $str_search = '1=1';

        $query = DB::table('accounts as a')
            ->join('employees as e', 'e.id', 'a.emp_id')
            ->join('positions as pos', 'pos.id', '=', 'e.position_id')
            ->join('account_types as at', 'at.id', '=', 'a.account_type_id')
            ->join('transactions as t', 't.id', '=', 'a.trx_id')
            ->select([
                'a.id',
                'a.emp_id',
                'e.name as emp_name',
                'pos.title as position',
                'a.account_type_id',
                'at.name as account_type',
                'a.account_number',
                't.amount as transaction_amount',
                't.trx_type',
                'a.currency',
                'a.balance',
                'a.last_balance_date',
                'e.photo_file_name as emp_photo'
            ])
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
        if ($search_account_type_id) {
            $query->where('a.account_type_id', $search_account_type_id);
        }
        if ($last_balance_date) {
            $query->where('a.last_balance_date', $last_balance_date);
        }

        $query->orderBy($sort_by, $sort_order);
        $count = $query->count('a.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            // Format last_balance_date with Carbon
            $row->last_balance_date = $row->last_balance_date
                ? \Carbon\Carbon::parse($row->last_balance_date)->format('Y-m-d')
                : null;

            // Set image URL
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
            ->join('account_types as at', 'at.id', '=', 'a.account_type_id')
            ->join('transactions as t', 't.id', '=', 'a.trx_id')
            ->selectRaw('a.id, a.emp_id, e.name as emp_name, pos.title as position,a.account_type_id,at.name as account_type, a.account_number,t.amount as transaction_amount,t.trx_type,a.currency,a.balance,formatdate(a.last_balance_date) as last_balance_date,e.photo_file_name as emp_photo')
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
            'account_types' => DB::table('account_types')->selectRaw('id,name AS account_type')->get(),
            'accounts' => $account,
        ];
    }
}
