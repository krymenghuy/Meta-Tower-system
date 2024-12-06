<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class BenefitCategory //extends Model
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
    function getProps($id, $props = [])
    {
        $cols = is_array($props) ? implode(',', $props) : $props;
        $row = DB::table('benefits')->where('id', $id)->selectRaw($cols)->first();
        return $row;
    }
    public function save($id = null, $ss = null, $arr)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $id = $id ?? $this->id;

        $v_rule = [
            'id' => '0|identity=1',
            'name' => '0|string|1-255'
        ];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang, false, null);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $name = $inputs['name'];

        $existingBenefitCategory = DB::table('benefits')
        ->where('name', $name)
            ->where('branch_id', $branch_id)
            ->first();

        if ($existingBenefitCategory && (!$id || $id != $existingBenefitCategory->id)) {
            return DV::error('This Category already exists.');
        }

        if ($id) {
            $existingById = DB::table('benefits')->where('id', $id)->first();
            if (!$existingById) {
                return DV::error('Benefit Category ID not found.');
            }
        }
        $inputs['branch_id'] = $branch_id;

        $savedId = saveData($ss, 'benefits', ['id' => $id], $inputs, [], 1, false);

        if ($savedId > 0) {
            return DV::success(['id' => $savedId], 'Save successful');
        } else {
            return DV::error('Save failed');
        }
    }

    public function getBenefitCategoryListPaginate($arr, $ss)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $search_id = $d->id ?? null;

        $query = DB::table('benefits as b')
            ->selectRaw('
            b.id,
            b.name
        ')
            ->where('b.branch_id', $branch_id);

        if ($search_id) {
            $query->where('b.id', $search_id);
        }
        if ($search_value) {
            $query->where('b.name', 'like', '%' . $search_value . '%');
        }
        $clone_query = clone $query;
        $count = $clone_query->count('b.id');
        // $allRows = $query->get();
        $rows = $query->skip($skip_rows)
            ->take($per_page)
            ->get();
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }



    public function getDetails($id, $ss)
    {
        $branch_id = $ss->branch_id;
        $row = DB::table('benefits as b')
            ->selectRaw('
                b.id,
                b.name
            ')
        ->where('b.branch_id', $branch_id)->where('b.id', $id)->take(1)->first();
        return $row;
    }

    function deleteBenefitCategory($id, $ss)
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
    function getBenefitCategoryList($arr, $ss = null)
    {
        $d = (object) $arr;

        $search_value = $d->search_value ?? null;

        $query = DB::table('benefits as b')
            ->selectRaw('b.id, b.name')
            ->where('b.branch_id', $ss->branch_id);
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->whereRaw("b.name LIKE '%" . $search_value . "%'");
        }
        $rows = $query->get();
        return $rows;
    }
}
