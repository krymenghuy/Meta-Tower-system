<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\DBX;
class WalletAccount
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function save($arr,$ss = null){
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

        $id = saveData($ss,'wallet_accounts', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['wallet_accounts' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving account');
    }

    function getWalletAccountListPaginate($arr, $ss)
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
        $sort_by = $d->sort_by ?? 'wa.id';
        $sort_order = $d->sort_order ?? 'asc';
        $search_id = $d->id ?? null;


        $str_search = '1=1';
        $balance_date = DBX::formatDate('wa.last_balance_date','last_balance_date');
        $query = DB::table('wallet_accounts as wa')
        ->join('employees as e', 'e.id', '=', 'wa.emp_id')
        ->join('positions as pos', 'pos.id', '=', 'e.position_id')
        ->selectRaw('
            wa.id,
            wa.emp_id,
            e.name as emp_name,
            pos.title as position,
            wa.account_number,
            wa.account_type,
            wa.balance,
            wa.currency,
            '.$balance_date.',
            e.photo_file_name as emp_photo
        ')
            ->where('wa.branch_id', $branch_id);
        if ($search_id) {
            $query->where('wa.id', $search_id);
        }
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "wa.account_number like '%" . $search_value . "%' or e.name like '%" . $search_value . "%' or pos.title like '%" . $search_value . "%'";
            $query->whereRaw($str_search);
        }
        $query->orderBy($sort_by, $sort_order);
        $count = $query->count('wa.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();


        foreach ($rows as $row) {

            $row->image_url = '';
            if ($row->emp_photo) {
                $row->image_url = Employee::profilePicture($row->emp_id);
            }
            unset($row->emp_photo);

        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getDetails($id, $ss)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $query = DB::table('wallet_accounts as wa')
            ->join('employees as e', 'e.id', '=', 'wa.emp_id')
            ->join('positions as pos', 'pos.id', '=', 'e.position_id')
            ->selectRaw('
                wa.id,
                wa.emp_id,
                e.name as emp_name,
                pos.title as position,
                wa.account_number,
                wa.account_type,
                wa.balance,
                wa.currency,
                e.photo_file_name as emp_photo
            ')
            ->where('wa.branch_id', $branch_id)
            ->where('wa.id', $id)
            ->first();
        if ($query) {
            $query->image_url = '';
            if ($query->emp_photo) {
                $query->image_url = Employee::profilePicture($query->emp_id);
            }
            unset($query->emp_photo);
        }
        return $query;
    }

    function deleteWalletAccount($id, $ss)
    {

        $branch_id = $ss->branch_id;
        return$query = DB::table('wallet_accounts')
            ->where('id', $id)
            ->delete();
        if(!$query){
            return DV::error('Account not found');
        }
        return $query;
    }

    function getFormOptions($id, $ss)
    {
        $wallet_account = null;
        if ($id) {
            $wallet_account = self::getDetails($id, $ss);
        }
        return (object) [

            'sort_by' => [
                ['id' => 'e.name', 'name' => 'By Name'],
                ['id' => 'wa.account_number', 'name' => 'By Account Number'],
                ['id' => 'wa.balance', 'name' => 'By  Balance'],
            ],

          'employees' => GeneralSettings::options_employee(10,$ss),
            'wallet_account' => $wallet_account,
        ];

    }
}
