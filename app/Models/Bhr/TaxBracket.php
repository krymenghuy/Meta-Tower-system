<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class TaxBracket
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
            'lower_amount' => '1|number',
            'upper_amount' => '1|number',
            'rate' => '1|number',
            'bias' => '1|number',
        ];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;

        $id = saveData($ss, 'tax_brackets', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['sender' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving data');
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

        $search_value = $d->search_value ?? null;
        $search_id = $d->id ?? null;
        $search_status_id = $d->status_id ?? null;

        $str_search = '1=1';

        $query = DB::table('tax_brackets as tb')
            ->selectRaw('tb.id, tb.lower_amount, tb.upper_amount, tb.rate, tb.bias')
            ->where('tb.branch_id', $ss->branch_id);

        if ($search_id) {
            $query->where('tb.id', $search_id);
        }
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->where('tb.lower_amount', 'like', '%' . $search_value . '%' . 'or' . 'tb.upper_amount', 'like', '%' . $search_value . '%');
        }
        $count = $query->count();
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getDetails($id, $ss)
    {
        $branch_id = $ss->branch_id;
        $query = DB::table('tax_brackets as tb')
            ->selectRaw('tb.id, tb.lower_amount, tb.upper_amount, tb.rate, tb.bias')
            ->where('tb.branch_id', $ss->branch_id)
            ->where('tb.id', $id)
            ->first();
        return $query;
    }


    function deleteTaxBracket($id, $ss)
    {
        $branch_id = $ss->branch_id;
        $query = DB::table('tax_brackets')
            ->where('id', $id)
            ->delete();
        return DV::depends($query, ['action', 'deleted']);
    }

    function getFormOptions($id, $ss){
        $tax_bracket = null;
        if ($id) {
            $tax_bracket = self::getDetails($id, $ss);
        }
        return (object) [

            'tax_bracket' => $tax_bracket,
        ];

    }


}
