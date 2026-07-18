<?php

namespace App\Models\Mhr;

use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use DV;
use Vsd\Vsloquent\VSModel;
use Vsd\Money\Models\VSMoney;

class TaxAllowance extends VSModel
{
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function save($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'emp_id' => '1|number|exists=employees.id',
            'qty' => '1|number',
            'amount' => '1|number',
            'currency_code' => '1|choice|KHR,USD|default=' . VSMoney::$national_currency,
            'remarks' => '0|string|0-250',
        ];
        $pos_char = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ',', ' '];
        $res = DBX::validateObject($arr, $v_rule, true, ['remarks' => $pos_char], $ss->lang, false, null);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $qty = (int) ($inputs['qty'] ?? 0);
        $amount = round((float) ($inputs['amount'] ?? 0), 2);

        if ($qty < 0) {
            return DV::error('Qty cannot be negative');
        }
        if ($amount < 0) {
            return DV::error('Amount cannot be negative');
        }

        $employee = DB::table('employees')
            ->where('id', $inputs['emp_id'])
            ->selectRaw('id, branch_id')
            ->first();
        if (!$employee) {
            return DV::error('Employee not found');
        }

        $inputs['qty'] = $qty;
        $inputs['amount'] = $amount;
        $inputs['allowance'] = round($qty * $amount, 2);
        $inputs['currency_code'] = $inputs['currency_code'] ?? VSMoney::$national_currency;
        $inputs['remarks'] = $inputs['remarks'] ?? null;
        $inputs['branch_id'] = $employee->branch_id ?? $branch_id;

        $id = DBX::saveData(
            $ss,
            'tax_allowances',
            ['id' => $id],
            $inputs,
            [],
            1,
            false
        );
        if ($id > 0) {
            return DV::depends($id, ['tax_allowances' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving tax allowance');
    }

    function getList($arr, $ss)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        $emp_id = $d->emp_id ?? $d->employee_id ?? null;

        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;

        $query = DB::table('tax_allowances as ta')
            ->leftJoin('employees as e', 'e.id', '=', 'ta.emp_id')
            ->where('ta.branch_id', $branch_id)
            ->selectRaw(
                'ta.id, ta.emp_id, ta.qty, ta.amount, ta.allowance, ta.remarks, ta.currency_code,
                ta.updated_at, ta.update_user, e.name as emp_name, e.code as emp_code'
            )
            ->orderBy('ta.id', 'DESC');

        if ($emp_id && is_numeric($emp_id)) {
            $query->where('ta.emp_id', (int) $emp_id);
        }

        $clone_query = clone $query;
        $count = $clone_query->count('ta.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach ($rows as $row) {
            $row = setOfficialDates($row, [''], ['updated_at'], []);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function listAll($arr, $ss)
    {
        $d = (object) $arr;
        $emp_id = $d->emp_id ?? $d->employee_id ?? null;

        if ($emp_id && is_numeric($emp_id)) {
            return self::getListByEmployee($emp_id, $ss);
        }

        return DB::table('tax_allowances as ta')
            ->where('ta.branch_id', $ss->branch_id)
            ->orderBy('ta.id')
            ->selectRaw(
                'ta.id, ta.emp_id, ta.qty, ta.amount, ta.allowance, ta.remarks, ta.currency_code, ta.branch_id'
            )
            ->get();
    }

    static function getListByEmployee($emp_id, $ss = null)
    {
        if (!$emp_id || !is_numeric($emp_id)) {
            return [];
        }

        return DB::table('tax_allowances as ta')
            ->where('ta.emp_id', (int) $emp_id)
            ->orderBy('ta.id')
            ->selectRaw(
                'ta.id, ta.emp_id, ta.qty, ta.amount, ta.allowance, ta.remarks, ta.currency_code, ta.branch_id'
            )
            ->get();
    }

    public function delete($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $taxAllowanceExist = DB::table('tax_allowances')
            ->where('id', $id)
            ->exists();

        if (!$taxAllowanceExist) {
            return DV::error('Tax Allowance not found');
        }

        $deleted = DB::table('tax_allowances')
            ->where('id', $id)
            ->delete();

        return DV::depends($deleted, null, 'Error deleting tax allowance');
    }

    static function getDetails($id, $ss)
    {
        $row = DB::table('tax_allowances as ta')
            ->selectRaw(
                'ta.id, ta.emp_id, ta.qty, ta.amount, ta.allowance, ta.remarks, ta.currency_code, ta.branch_id'
            )
            ->where('ta.id', $id)
            ->first();

        return $row;
    }

    static function getFormOptions($id, $ss)
    {
        $tax_allowance = null;
        if ($id) {
            $tax_allowance = self::getDetails($id, $ss);
        }

        return (object) [
            'currency_codes' => VSMoney::options_currency($ss),
            'tax_allowance' => $tax_allowance,
        ];
    }
}
