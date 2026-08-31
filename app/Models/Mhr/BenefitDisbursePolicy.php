<?php

namespace App\Models\Mhr;

use App\Models\Prm\GeneralSettings;
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
        $str_search = '1=1';
        $str_moreWhere = '2=2';
        $benefit_id = $d->benefit_id ?? null;
        $target_year = $d->target_year ?? null;
        if($search_value){
            $search_value = escape_like_str($search_value);
            $str_search = "(b.name LIKE '%" .$search_value . "%')";
        }
        if($benefit_id){
            $str_moreWhere .= ' AND bdp.benefit_id = '. $benefit_id;
        }
        if($target_year){
            $str_moreWhere .= ' AND bdp.target_year = '. $target_year;
        }
        $query = DB::table('benefit_disburse_policies as bdp')
            ->join('benefits as b', 'b.id', '=', 'bdp.benefit_id')
            ->whereRaw($str_moreWhere)
            ->whereRaw($str_search)
            ->selectRaw('bdp.id, bdp.benefit_id, b.name as benefit_name, bdp.target_month, bdp.target_year, bdp.withdraw_rate');
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
            'years' => GeneralSettings::options_calendar_year($ss),
            "disburse_policy" => $bdp,
        ];
    }
}

