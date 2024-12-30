<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use App\Models\DBX;

class Benefit //extends Model
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function save($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'name' => '1|string',
            'type_id' => '1|choice|1,2|default=1',
        ];
        $checkUnque = ["$branch_id|benefits|name|id=id|text=Benefit already exists."];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang , false, $checkUnque);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;

        $id = saveData($ss, 'benefits', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['benefits' => $inputs, 'id' => $id]);
        }
        return DV::error('Error saving Benefit');
    }

    public function getBenefitPaginate($arr, $ss)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        $skip_rows = ($current_page - 1) * $per_page;
        $last_update = DBX::formatDate('b.update_date', 'update_date');

        $search_value = $d->search_value ?? null;
        $search_id = $d->id ?? null;

        $query = DB::table('benefits as b')
            ->selectRaw('b.id, b.name,b.type_id,' . $last_update . ',b.update_user');

        if ($search_id) {
            $query->where('b.id', $search_id);
        }
        if ($search_value) {
            $query->where('b.name', 'like', '%' . $search_value . '%');
        }
        $clone_query = clone $query;
        $count = $clone_query->count('b.id');
        //$allRows = $query->get();
        $rows = $query->skip($skip_rows)
            ->take($per_page)
            ->get();
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public function getDetails($id, $ss=null)
    {
        $branch_id = $ss->branch_id;
        $row = DB::table('benefits as b')
            ->selectRaw('
                b.id,
                b.name,
                b.type_id
            ')
        ->where('b.id', $id)->where('b.branch_id', $branch_id)->first();
        return $row;
    }

    function deleteBenefit($id = null)
    {
        $id = $id ?? $this->id;

        $delete = DB::table('benefits')->where('id', $id)->delete();
        return DV::depends($delete, ['action', 'deleted']);
    }

    public function getFormOptions($id, $ss)
    {
        $benefits = null;
        if ($id) {
            $benefits = $this->getDetails($id, $ss);
        }
        return (object) [
            'benefits' => $benefits,
        ];
    }

}
