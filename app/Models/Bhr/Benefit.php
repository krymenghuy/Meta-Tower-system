<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
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
            'category_id' => '1|number',
            'amount' => '1|number',
            'remark' => '0|string|0-100',
        ];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;

        $id = saveData($ss, 'benefits', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['benefits' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving benefit');
    }

    function getBenefitListPaginate($arr, $ss)
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
        $search_id = $d->id ?? null;

        // Initialize query
        $query = DB::table('benefits as b')
        ->join('benefit_categories as bc', 'bc.id', '=', 'b.category_id') // Assuming this is the correct join
        ->selectRaw('b.id, b.category_id, bc.name as category, b.amount, b.remark');

        // Apply search filters
        if ($search_id) {
            $query->where('b.id', $search_id);
        }
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->where(function ($q) use ($search_value) {
                $q->where('b.category', 'like', "%{$search_value}%")
                ->orWhere('b.remark', 'like', "%{$search_value}%");
            });
        }

        // Clone the query for counting total rows without skip and take
        $count_query = clone $query;
        $count = $count_query->count('b.id');

        // Fetch paginated results with skip and take
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        // Return paginated result
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }


    function getDetails($id, $ss){
        $branch_id = $ss->branch_id;

        $rows = DB::table('benefits as b')
            ->join('benefit_categories as bc', 'bc.id', '=', 'b.category_id')
            ->selectRaw('b.id, b.category_id, bc.name as category, b.amount, b.remark')
            ->where('b.id', $id)
            ->first();
        return $rows;

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

    function getFormOptions($id, $ss){

        $benifit = null;
        if ($id) {
            $benifit = self::getDetails($id, $ss);
        }
        return $data = (object) [

            'categories' => DB::table('benefit_categories')->selectRaw('id,name')->get(),
            'benefit' => $benifit
        ];
        
    }

}
