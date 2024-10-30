<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class Transaction
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    static function save($arr,$ss = null){
        $ss = $ss ?? Transaction::$userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id' => '0|identity=1',
            'emp_id' => '1|number',
            'payroll_id' => '1|number',
            'amount' => '1|number',
            'remarks' => '0|string|250',
            'trx_type' => '1|number',
        ];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return ['error' => $res->error];
        }

        $id = $res->id;
        $inputs = $res->values;

        $id = saveData($ss,'transactions', ['id' => $id], $inputs, [], 1,false, 'binary');
        if ($id) {
            return ( ['transactions' => $inputs,'trx_id'=>bin2hex($id)] );
        }

        return ['error' => 'Error saving transaction'];
    }

    function getTransactionListPaginate($arr, $ss)
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


        $str_search = '1=1';

        $query = DB::table('transactions as t')
            ->join('employees as e', 'e.id', 't.emp_id')
            ->join('positions as pos', 'pos.id', '=', 'e.position_id')
            ->join('payrolls as p', 'p.id', '=', 't.payroll_id')
            ->selectRaw(' hex(t.id) as id, t.emp_id, e.name as emp_name, pos.title as position, p.name as payroll_name, t.amount, t.remarks, t.trx_type')
            ->where('t.branch_id', $branch_id);

        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "e.name like '%" . $search_value . "%' or t.remarks like '%" . $search_value . "%'";
            $query->whereRaw($str_search);
        }


        $count = $query->count('t.id');
       return $rows = $query->skip($skip_rows)->take($per_page)->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getDetails($id) {
        $query = DB::table('transactions as t')
        ->join('employees as e', 'e.id', 't.emp_id')
        ->join('positions as pos', 'pos.id', '=', 'e.position_id')
        ->join('payrolls as p', 'p.id', '=', 't.payroll_id')
        ->selectRaw('hex(t.id) as id, t.emp_id, e.name as emp_name, pos.title as position, p.name as payroll_name, t.amount, t.remarks, t.trx_type')
            ->where('t.id', hex2bin($id))
            ->first();
        return $query;
    }

    function deleteTransaction($id, $ss)
    {
        // Ensure $id is numeric and valid
        if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        // Assuming $ss contains branch_id or other necessary info
        $branch_id = $ss->branch_id;

        // Build and execute the query
        $query = DB::table('transactions')
            ->where('id', $id)
            ->delete();
        if (!$query) {
            return DV::error('Transaction not found');
        }
        // Return the query result
        return $query;
    }

    function getFormOptions($id, $ss)
    {
        $transaction = null;
        if ($id) {
            $transaction = self::getDetails($id, $ss);
        }
        return (object) [


          'employees' => GeneralSettings::options_employee(10,$ss),
            'transaction' => $transaction,
        ];

    }
}
