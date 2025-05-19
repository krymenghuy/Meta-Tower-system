<?php

namespace App\Models\Ypg;

use DV;
use DBX;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use VSMoney;

class TaxAllowance
{

    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function save($arr = [], $id = null, $ss = null) {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        //$branch_id = $ss->branch_id;

        $v_rule = [
            //'id' => '0|identity=1',
            'emp_id' => '1|number',
            'amount' => '1|number',
            'qty' => '1|number|default=1',
            'allowance' => '0|number',
            'currency_code'=> '1|choice|KHR,USD|default='.VSMoney::$national_currency,
            'remarks' => '0|string|250',
        ];

        $res = DBX::validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }
        //$id = $res->id;
        $inputs = $res->values;
        $qty = $inputs['qty'] ?? 1;
        $currency_code = $inputs['currency_code'] ?? null;
        if($currency_code != VSMoney::$national_currency) return DV::error('Tax Allowance must be national currency (??)::'.VSMoney::$national_currency);
        $inputs['allowance'] = $qty * $inputs['amount'];

        $id = DBX::saveData($ss, 'tax_allowances', ['id' => $id], $inputs, [], 1);
        return DV::depends($id, ['tax_allowances' => $inputs, 'id' => $id], 'Failed to save allowance');
    }

    function getList($arr, $ss)
    {
        $d = (object) $arr;

        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $emp_id = $d->emp_id ?? null;

        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;

        $query = DB::table('tax_allowances as ta')
            ->join('employees as em', 'em.id', '=', 'ta.emp_id')
            ->selectRaw('ta.id, em.name as emp_name,ta.amount,ta.qty,ta.allowance,ta.currency_code,ta.remarks')
            ->where('ta.branch_id', $ss->branch_id)
            ->where('ta.emp_id', $emp_id);

        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->where('em.name', 'like', '%' . $search_value . '%');
        }
        $query->skip($skip_rows)->take($per_page);
        $count_query = clone $query;
        $count = $count_query->count('ta.id');
        $rows = $query->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getListAll($arr, $ss)
    {
        $d = (object) $arr;
        $emp_id = $d->emp_id ?? null;
        $search_value = $d->search_value ?? null;

        $query = DB::table('tax_allowances as ta')
            ->join('employees as em', 'em.id', '=', 'ta.emp_id')
            ->selectRaw('ta.id, em.name as emp_name,ta.amount,ta.qty,ta.allowance,ta.currency_code,ta.remarks')
            ->where('ta.branch_id', $ss->branch_id)
            ->where('ta.emp_id', $emp_id);

        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->where('em.name', 'like', '%' . $search_value . '%');
        }
        return $query->get();
    }


    function getDetails($id, $ss)
    {
        $query = DB::table('tax_allowances as ta')
            ->join('employees as em', 'em.id', '=', 'ta.emp_id')
            ->selectRaw('ta.id, em.name as emp_name,ta.amount,ta.qty,ta.allowance,ta.currency_code,ta.remarks')
            ->where('ta.branch_id', $ss->branch_id)
            ->where('ta.id', $id)
            ->first();
        return $query;
    }

    function getFormOptions($id = null , $ss = null) {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $tax_allowance = null;
        if ($id) {
            $tax_allowance = self::getDetails($id, $ss);
        }
        return (object) [
            'currency_codes' => VSMoney::options_currency($ss),
            'employees' => GeneralSettings::options_employee(10,$ss),
            'tax_allowance' => $tax_allowance,
        ];

    }
    function delete($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $query = DB::table('tax_allowances')
            ->where('id', $id)
            ->delete();
        return DV::depends($query, null, 'Error deleting tax allowance');
    }

}
