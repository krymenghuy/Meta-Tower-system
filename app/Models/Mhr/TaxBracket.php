<?php

namespace App\Models\Mhr;
use Vsd\Money\Models\VSMoney;
use DV;
use DBX;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;


class TaxBracket //extends VSModel
{
   protected $id = null;

    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function save($arr = [],$id = null,$ss = null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'lower_amount' => '1|number',
            'upper_amount' => '1|number',
            'rate' => '1|number',
            'bias' => '1|number',
           'currency_code'=> '1|choice|KHR,USD|default='.VSMoney::$national_currency,
        ];
        $checkUnique = null;


        $res = DBX::validateObject($arr, $v_rule, true, [], $ss->lang,false,$checkUnique);
        if ($res->error) {
            return DV::error($res->error);
        }
        $inputs = $res->values;
        $id = DBX::saveData($ss, 'tax_brackets', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['tax_brackets' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving data');
    }

    public static function get($tax_base =0){
        $info = DB::table('tax_brackets')
        ->where(function ($query) use ($tax_base) {
            $query->whereRaw('lower_amount <= ?', [$tax_base])
                ->whereRaw('(upper_amount >= ? OR upper_amount = -1)', [$tax_base]);
        })
        ->select('rate', 'bias')
        ->first();
        return $info ?? (object)['rate'=>0,'bias'=>0];
    }

    function getTaxBracketListPaginate($arr, $ss)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 20;

        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;



        $query = DB::table('tax_brackets as tb')
            ->selectRaw('tb.id, tb.lower_amount, tb.upper_amount, tb.rate, tb.bias,tb.currency_code, tb.update_user,tb.updated_at')
            ->where('tb.branch_id', $branch_id)
            ->orderBy('tb.lower_amount', 'asc') // Order by lower_amount first
            ->orderBy('tb.upper_amount', 'asc'); // Then order by upper_amount


        $count = $query->count();
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach($rows as $row){
            setOfficialDates($row,[''],['updated_at'],['']);

        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }


    function getDetails($id, $ss)
    {
        $row = DB::table('tax_brackets as tb')
            ->selectRaw('tb.id, tb.lower_amount, tb.upper_amount, tb.rate, tb.bias,tb.currency_code')
            ->where('tb.id', $id)
            ->first();
        return $row;
    }


    function delete($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $query = DB::table('tax_brackets')
            ->where('id', $id)
            ->delete();
        return DV::depends($query, null, 'Error deleting tax bracket');
    }

    function getFormOptions($id, $ss){
        $tax_bracket = null;
        if ($id) {
            $tax_bracket = self::getDetails($id, $ss);
        }
        return (object) [
            'currency_codes' => VSMoney::options_currency($ss),
            'tax_bracket' => $tax_bracket,
        ];

    }
}
