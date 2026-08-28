<?php

namespace App\Models\Mhr;

use DBX;
use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use Vsd\Vsloquent\VSModel;

class Benefit extends VSModel
{
   protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function upsert($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'name' => '1|string|0-150|text=name_required::@key;@max;@value',
            'type_id' => '1|choice|1,2|text=select_type',
        ];
        $res = DBX::validateObject($arr, $v_rule, true, [], $ss->lang , false, null);
        if ($res->error) {
            return DV::error($res->error);
        }
        $inputs = $res->values;
        $exists = DB::table('benefits')
            ->where('name', $inputs['name'])
            ->where('type_id', $inputs['type_id'])
            ->when($id, function ($q) use ($id) {
                $q->where('id', '<>', $id);
            })
            ->exists();

        if ($exists) {
            return DV::error('benefit_name_already_exists');
        }
        $id = DBX::saveData($ss, 'benefits', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['benefits' => $inputs, 'id' => $id]);
        }
        return DV::error('Error saving Benefit');
    }

    public function getBenefitPaginate($arr, $ss)
    {
        $d = (object) $arr;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        $skip_rows = ($current_page - 1) * $per_page;
        $search_value = $d->search_value ?? null;
        $type_id = $d->type_id ?? null;
        $str_search = "1=1";
        $str_moreWhere = '2=2';
        if($search_value){
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(b.name LIKE '%" . $search_value . "%')";
        }
        if($type_id){
            $str_moreWhere .= ' AND b.type_id ='.$type_id;
        }
        $query = DB::table('benefits as b')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw('b.id, b.name,b.type_id,b.updated_at,b.update_user')
            ->orderByRaw('b.id ASC');

        $clone_query = clone $query;
        $count = $clone_query->count('b.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach($rows as $row){
            setOfficialDates($row,[''],['updated_at'],['']);
        }
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public function getDetails($id)
    {
        $row = DB::table('benefits as b')
            ->where('b.id', $id)
            ->selectRaw('b.id,b.name,b.type_id,updated_at')
            ->first();
        if($row){
            setOfficialDates($row,[''],['updated_at'],['']);
        }
        return $row;
    }
    public function deleteBenefit($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        if (!$id) {
            return DV::error('Benefit ID is not valid.');
        }

        $benefitExists = DB::table('benefits')
            ->where('id', $id)
            ->exists();

        if (!$benefitExists) {
            return DV::error('Benefit not found.');
        }

        if (DB::table('emp_benefits')->where('benefit_id', $id)->exists()) {
            return DV::error('Benefit is assigned to employees.');
        }

        if (DB::table('benefit_disburse_policies')->where('benefit_id', $id)->exists()) {
            return DV::error('Benefit is used in disbursement policies.');
        }

        if (DB::table('benefit_disbursements')->where('benefit_id', $id)->exists()) {
            return DV::error('Benefit has disbursement records.');
        }

        $deleted = DB::table('benefits')
            ->where('id', $id)
            ->delete();

        return DV::depends($deleted, ['action' => 'deleted'], 'Failed to delete benefit.');
    }

    public function getFormOptions($id, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $benefits = $id ? self::getDetails($id) : null;
        return (object) [
            'benefits' => $benefits,
            'benefit_types' => [
                ['id' => '1', 'name' => 'Remuneration'],
                ['id' => '2', 'name' => 'Fringe Benefit'],
            ],
        ];
    }

}
