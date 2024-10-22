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

    function save($arr,$ss = null){
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id' => '0|identity=1',
            'emp_id' => '1|number',
            'payroll' => '1|number',
            'wallet_account' => '1|number',
            'ballance' => '1|number',
        ];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;

        $id = saveData($ss,'accounts', ['id' => $id], $inputs, [], 1);
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

        $str_search = '1=1';

        $query = DB::table('accounts as a')
            ->join('employees as e', 'e.id', 'a.emp_id')
            ->join('positions as pos', 'pos.id', '=', 'e.position_id')
            ->selectRaw('a.id, a.emp_id, e.name as emp_name, pos.title as position, a.payroll, a.ballance, a.wallet_account,e.photo_file_name as emp_photo')
            ->where('a.branch_id', $branch_id);
        if ($search_id) {
            $query->where('a.id', $search_id);
        }
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "a.payroll like '%" . $search_value . "%' or e.name like '%" . $search_value . "%' or pos.title like '%" . $search_value . "%'";
            $query->whereRaw($str_search);
        }

        $query->orderBy($sort_by, $sort_order);
        $count = $query->count('a.id');
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
        $row = DB::table('accounts as a')
            ->join('employees as e', 'e.id', 'a.emp_id')
            ->join('positions as pos', 'pos.id', '=', 'e.position_id')
            ->selectRaw('a.id, a.emp_id, e.name as emp_name, pos.title as position, a.payroll, a.ballance, a.wallet_account,e.photo_file_name as emp_photo')
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
         // Ensure $id is numeric and valid
         if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        // Assuming $ss contains branch_id or other necessary info
        $branch_id = $ss->branch_id;

        // Build and execute the query
        $query = DB::table('accounts')
            ->where('id', $id)
            ->delete();
        if (!$query) {
            return DV::error('Account not found');
        }
        // Return the query result
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
                ['id' => 'a.payroll', 'name' => 'By Payroll'],
                ['id' => 'a.wallet_account', 'name' => 'By  Wallet Account'],
                ['id' => 'a.ballance', 'name' => 'By  Ballance'],
            ],

          'employees' => GeneralSettings::options_employee(10,$ss),
            'accounts' => $account,
        ];

    }
}
