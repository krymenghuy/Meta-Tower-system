<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\DBX;

class Transaction
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    static function create($arr, $update_balance = false,$ss = null,$status='in'){
        $ss = $ss ?? Transaction::$userInfo;
        $v_rule = [
            // 'id' => '0|identity=1',
            'emp_id' => '1|number',
            'payroll_id' => '0|number',
            'amount' => '1|number',
            'remarks' => '0|string|250',
            'trx_type' => '1|number',
            'status'=>'0|string|10',
            'account_id' => '1|number',
            'from_account_id' => '1|number',
            'to_account_id' => '1|number',
        ];

        $res = validateObject($arr, $v_rule, true, ['remarks'=>['-']], $ss->lang);
        if ($res->error) {
            return (object)['error' => $res->error];
        }

        $id = null;
        $inputs = $res->values;
        $d = (object) $inputs;
        $inputs['status'] = $status;

        $id = saveData($ss,'transactions', ['id' => $id], $inputs, [], 1,false, 'binary');
        if ($id) {
            $updateBalance_emp = Account::updateBalance(
                $d->from_account_id,
                'accounts',
                'out',
                $d->amount,
                $id,
                $ss
            );
            $updateBalance_master = Account::updateBalance(
                $d->to_account_id,
                'accounts',
                'in',
                $d->amount,
                $id,
                $ss
            );
            return  (object)['error'=>null,'transaction' => $inputs,'trx_id'=>bin2hex($id)];
        }
        return (object)['error' => 'Error saving transaction'];
    }

    //getTransactionListPaginate. please name it to getList()
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
        $date = DBX::formatDate('t.created_at','created_at');
        $str_emp_id = '1=1';
        $emp_id = $d->emp_id ?? null;

        if ($emp_id) {
            $str_emp_id = 'e.id=' . $emp_id;
        }
        $account_id = $d->account_id ?? null;
        $str_account_id = '2=2';

        if ($account_id) {
            $str_account_id = 't.account_id=' . $account_id;
        }
        $str_search = '3 = 3';

        $query = DB::table('transactions as t')
            ->join('employees as e', 'e.id', '=', 't.emp_id')
            ->join('positions as pos', 'pos.id', '=', 'e.position_id')
            ->join('accounts as a', 'a.id', '=', 't.account_id')
            ->leftJoin('accounts as fa', 'fa.id', '=', 't.from_account_id') // Join for from_account_id
            ->leftJoin('accounts as ta', 'ta.id', '=', 't.to_account_id')   // Join for to_account_id
            ->whereRaw($str_emp_id)
            ->whereRaw($str_account_id)
            ->selectRaw(
                'hex(t.id) as id, t.emp_id, e.name as emp_name, pos.title as position, t.amount,
                t.remarks, t.trx_type, t.payroll_id, t.account_id, t.status, ' . $date . ',
                t.from_account_id, t.to_account_id, a.account_number,
                fa.account_number as from_account_number, ta.account_number as to_account_number'
            )
            ->where('t.branch_id', $branch_id)
            ->orderBy('t.created_at', 'desc');

        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "e.name like '%" . $search_value . "%' or t.remarks like '%" . $search_value . "%'";
            $query->whereRaw($str_search);
        }

        $count = $query->count('t.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach ($rows as $row) {
            $row->payroll_name = DB::table('payrolls')->where('id', $row->payroll_id)->value('name');
        }
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }


    function getDetails($id = null) {
        $id = $id ?? $this->id;
        $query = DB::table('transactions as t')
        ->join('employees as e', 'e.id', 't.emp_id')
        ->join('positions as pos', 'pos.id', '=', 'e.position_id')
        ->join('payrolls as p', 'p.id', '=', 't.payroll_id')
        ->selectRaw('hex(t.id) as id, t.emp_id, e.name as emp_name, pos.title as position, p.name as payroll_name, t.amount, t.remarks, t.trx_type')
            ->where('t.id', hex2bin($id))
            ->first();
        return $query;
    }

    function delete($id = null)
    {
        $id = $id ?? $this->id;
        if (!$id) {
            return DV::error('Invalid transaction ID');
        }

        $x = DB::table('transactions')
            ->where('id', $id)
            ->delete();
        return DV::depends($x,null,'Failed to delete transaction!');
    }

    function getFormOptions($id, $ss)
    {
        $transaction = null;
        if ($id)  $transaction = self::getDetails($id, $ss);

        return (object) [
          'employees' => GeneralSettings::options_employee(10,$ss),
            'transaction' => $transaction,
        ];

    }
}
