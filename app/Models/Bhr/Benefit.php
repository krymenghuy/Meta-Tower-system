<?php

namespace App\Models\Bhr;

use App\Models\DV;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;


class Benefit
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
            'name' => '1|string|0-100',
            'amount' => '1|number',
            'description' => '0|string|0-100',
        ];

        // $checkUnque = ["$branch_id|benefits|name|id=id|text=Benefit already exists."];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;

        $id = saveData($ss,'benefits', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['benefits' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving benefit');

    }

    function getBenefitList($ss ){
        return DB::table('benefits')->selectRaw('id,name,amount,description')->get();

    }

    function getBenefitListPaginate($arr, $ss) {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;

        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 5;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }

        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $search_id = $d->id ?? null;

        $str_search = '1=1';

        $query = DB::table('benefits as b')
        ->selectRaw('b.id, b.name, b.amount, b.description');

        if ($search_id) {
            $query->whereRaw('b.id =' . $search_id);
        }
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->whereRaw("b.name like '%" . $search_value . "%'" . " or b.description like '%" . $search_value . "%'");
            $query->whereRaw($str_search);
        }

        $query->skip($skip_rows)->take($per_page);
        $count_query = clone $query;
        $count = $count_query->count('b.id');
        $rows = $query->get();


        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getDetails($id, $ss){
         // Ensure $id is numeric and valid
         if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        // Assuming $ss contains branch_id or other necessary info
        $branch_id = $ss->branch_id;

        // Build and execute the query
        $query = DB::table('benefits as b')
        ->selectRaw('b.id, b.name, b.amount, b.description')
        ->where('b.id', $id)
        ->first();
        if (!$query) {
            return DV::error('Benefit not found');
        }
        // Return the query result
        return $query;

    }

    function deleteBenefit($id, $ss){
         // Ensure $id is numeric and valid
         if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        // Assuming $ss contains branch_id or other necessary info
        $branch_id = $ss->branch_id;

        // Build and execute the query
        $query = DB::table('benefits')
        ->where('id', $id)
        ->delete();
        if (!$query) {
            return DV::error('Benefit not found');
        }
        // Return the query result
        return $query;
    }

}
