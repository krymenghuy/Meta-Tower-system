<?php

namespace App\Models\Mhr;

use DV;
use DBX;
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

    function save($arr = [],$id = null, $ss =null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $v_rule = [
            'benefit_id' => '1|number',
            'target_month' => '1|number|default=0',
            'target_year' => '1|number|default=0',
            'withdraw_rate' => '1|number|default=100',
        ];
        $res = DBX::validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) return DV::error($res->error);
        $inputs = $res->values;

        if(!$id){
            $exists = DB::table('benefit_disburse_policies')
                ->where('benefit_id', $inputs['benefit_id'])
                ->where('target_month', $inputs['target_month'])
                ->where('target_year', $inputs['target_year'])
                ->exists();

            if ($exists) {
                return DV::error('disburse_policy_already_exists');
            }
        }

        $id = DBX::saveData($ss, 'benefit_disburse_policies', ['id' => $id], $inputs, [], 1);
        return DV::depends($id, ['benefit_disburse_policies' => $inputs, 'id' => $id]);
    }

    function getList($arr, $ss)
    {
        $d = (object) $arr;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 20;
        if (!is_numeric($current_page)) $current_page = 1;
        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $benefit_id = $d->benefit_id ?? null;

        $query = DB::table('benefit_disburse_policies as bdp')
            ->join('benefits as b', 'b.id', '=', 'bdp.benefit_id')
            ->selectRaw('bdp.id, bdp.benefit_id, b.name as benefit_name, bdp.target_month, bdp.target_year, bdp.withdraw_rate');

        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->where('b.name', 'like', '%' . $search_value . '%');
        }
        if($benefit_id){
            $query->where('bdp.benefit_id', $benefit_id);
        }
        $count = $query->count();
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getDetails($id)
    {
        $query = DB::table('benefit_disburse_policies as bdp')
            ->join('benefits as b', 'b.id', '=', 'bdp.benefit_id')
            ->selectRaw('bdp.id, bdp.benefit_id, b.name as benefit_name, bdp.target_month, bdp.target_year, bdp.withdraw_rate')
            ->where('bdp.id', $id)
            ->first();
        return $query;
    }

    function delete($id = null , $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $x = DB::table('benefit_disburse_policies')
            ->where('id', $id)
            ->where('branch_id', $ss->branch_id)
            ->delete();
        return DV::depends($x,null,'Error deleting benefit disburse policy');
    }

    function getFormOptions($id, $ss)
    {
        $bdp = null;
        if ($id)   $bdp = self::getDetails($id, $ss);
        return (object) [
            'benefits' => DB::table('benefits')->selectRaw('id,name')->get(),
            "disburse_policy" => $bdp,
        ];
    }
}

