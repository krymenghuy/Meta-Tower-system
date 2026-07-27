<?php

namespace App\Models\Mhr;

use DV;
use DBX;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class CheckPoint
{
    protected $id;
    protected $userInfo;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function getProps($id, $props = [])
    {
        $columns = is_array($props) ? implode(',', $props) : $props;
        return DB::table('check_points')->where('id', $id)->selectRaw($columns)->first();
    }

    public function save($id, $ss, $arr)
    {
        $id = $this->id ?? ($arr['id'] ?? null);
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $validationRules = [
            'name' => '1|string|0-150',
            'name_kh' => '1|string|0-150',
            'category_id' => '1|number',
            'description' => '0|string|0-300',
        ];

        $restrictedChars = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ','];

        $validationResult = DBX::validateObject($arr, $validationRules, true, ['name' => $restrictedChars], $ss->lang, false);

        if ($validationResult->error) {
            return DV::error($validationResult->error);
        }

        $inputs = $validationResult->values;

        $exists = DB::table('check_points')
            ->where('category_id', $inputs['category_id'])
            ->where('name', $inputs['name'])
            ->when($id, function ($q) use ($id) {
                $q->where('id', '<>', $id);
            })
            ->exists();

        if ($exists) {
            return DV::error('Checkpoint name already exists.');
        }

        $id = DBX::saveData($ss, 'check_points', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['check_points' => $inputs, 'id' => $id]);
        }
        return DV::error('Error saving Checkpoint');
    }

    public function getList($arr, $ss = null)
    {
        //$branch_id = $ss->branch_id;
        $d = (object) $arr;

        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $search_value = $d->search_value ?? null;
        $category_id = $d->category_id ?? null;
        $str_search = "1=1";
        $str_moreWhere = '2=2';
        if($search_value){
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(cp.name LIKE '%" . $search_value . "%' OR cp.name_kh LIKE '%" . $search_value . "%')";
        }
        if($category_id){
            $str_moreWhere .= ' AND cp.category_id ='.$category_id;
        }
        $query = DB::table('check_points as cp')
            ->join('check_point_categories as cpc', 'cpc.id', '=', 'cp.category_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw('cp.id, cp.name,cp.name_kh, cpc.name as category_name,cp.description, cp.updated_at, cp.update_user')
            ->orderBy('cp.id','DESC');
        $clone_query = clone $query;
        $count = $clone_query->count('cp.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach($rows as $row){
            setOfficialDates($row,[''],['updated_at'],['']);
        }
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public static function getDetails($id)
    {
        return DB::table('check_points as cp')
            ->join('check_point_categories as cpc', 'cpc.id', '=', 'cp.category_id')
            ->selectRaw('cp.id, cp.name,cp.name_kh,cp.description, cp.category_id, cpc.name as category_name')
            ->where('cp.id', $id)->get()
            ->first();
    }

    public function delete($id = null)
    {
        $id = $id ?? $this->id;
        $deleted = DB::table('check_points')->where('id', $id)->delete();

        return $deleted
            ? DV::depends($deleted, ['action' => 'deleted'])
            : DV::error('Delete failed.');
    }

    public static function getFormOptions($id)
    {
        $checkPoints = $id ? self::getDetails($id) : null;

        return (object) [
            'check_point_categories' => DB::table('check_point_categories')->select('id', 'name')->get(),
            'check_points' => $checkPoints,
        ];
    }

    public function getExitFormList($arr, $ss = null)
    {
        $params = (object) $arr;
        $branch_id = $ss->branch_id;

        $query = DB::table('check_points as cp')
            ->where('cp.branch_id', $branch_id)
            ->selectRaw('cp.id, cp.name');

        if (!empty($params->search_value)) {
            $query->where('cp.name', 'LIKE', "%{$params->search_value}%");
        }

        return $query->get();
    }
}
