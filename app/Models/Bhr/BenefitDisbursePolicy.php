<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class BenefitDisbursePolicy
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
            'benefit_id' => '1|number',
            'target_month' => '1|number',
            'target_year' => '1|number',
            'withdraw_rate' => '1|number',
        ];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;

        $id = saveData($ss, 'benefit_disburse_policies', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['sender' => $inputs, 'id' => $id]);
        }
        return DV::depends(0, ['sender' => $inputs]);
    }

    function getBenefitDisbursePolicyListPaginate($arr, $ss)
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
        $search_benefit_id = $d->benefit_id ?? null;

        $str_search = '1=1';

        $query = DB::table('benefit_disburse_policies as bdp')
            ->join('benefits as b', 'b.id', '=', 'bdp.benefit_id')
            ->selectRaw('bdp.id, bdp.benefit_id, b.name as benefit_name, bdp.target_month, bdp.target_year, bdp.withdraw_rate')
            ->where('bdp.branch_id', $ss->branch_id);

        if ($search_id) {
            $query->where('bdp.id', $search_id);
        }
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->where('b.name', 'like', '%' . $search_value . '%');
        }
        if($search_benefit_id){
            $query->where('bdp.benefit_id', $search_benefit_id);
        }
        $count = $query->count();
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getDetails($id, $ss)
    {
        $branch_id = $ss->branch_id;
        $query = DB::table('benefit_disburse_policies as bdp')
            ->join('benefits as b', 'b.id', '=', 'bdp.benefit_id')
            ->selectRaw('bdp.id, bdp.benefit_id, b.name as benefit_name, bdp.target_month, bdp.target_year, bdp.withdraw_rate')
            ->where('bdp.id', $id)
            ->where('bdp.branch_id', $ss->branch_id)
            ->first();
        return $query;
    }

    function deleteBenefitDisbursePolicy($id, $ss)
    {
        $branch_id = $ss->branch_id;
        $query = DB::table('benefit_disburse_policies')
            ->where('id', $id)
            ->where('branch_id', $ss->branch_id)
            ->delete();
        return $query;
    }

    function getFormOptions($id, $ss)
    {
        $bdp = null;
        if ($id) {
            $bdp = self::getDetails($id, $ss);
        }

        return (object) [
            'benefits' => DB::table('benefits')->selectRaw('id,name')->get(),
            "bdp" => $bdp,
        ];
    }
}
