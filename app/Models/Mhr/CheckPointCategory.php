<?php

namespace App\Models\Mhr;

use DBX;
use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use Vsd\Vsloquent\VSModel;

class CheckPointCategory extends VSModel
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
            'name_kh' => '1|string|0-150|text=name_required::@key;@max;@value',
            'description' => '0|string|0-300',
        ];
         $name_char = ['$','#','@','!','/','.','-','_','=','?'];
        $res = DBX::validateObject($arr, $v_rule, true, ['name'=>$name_char,'name_kh'=>$name_char,'description'=>$name_char], $ss->lang , false, null);
        if ($res->error) {
            return DV::error($res->error);
        }
        $inputs = $res->values;
        $exists = DB::table('check_point_categories')
            ->where('name', $inputs['name'])
            ->when($id, function ($q) use ($id) {
                $q->where('id', '<>', $id);
            })
            ->exists();

        if ($exists) {
            return DV::error('Category name already exists.');
        }
        $id = DBX::saveData($ss, 'check_point_categories', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['check_point_categories' => $inputs, 'id' => $id]);
        }
        return DV::error('Error saving Category');
    }

    public function getListPaginate($arr, $ss)
    {
        $d = (object) $arr;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        $skip_rows = ($current_page - 1) * $per_page;
        $search_value = $d->search_value ?? null;
        $str_search = "1=1";
        if($search_value){
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(cpc.name LIKE '%" . $search_value . "%' OR cpc.name_kh LIKE '%" . $search_value . "%')";
        }
        $query = DB::table('check_point_categories as cpc')
            ->whereRaw($str_search)
            ->selectRaw('cpc.id, cpc.name,cpc.name_kh,cpc.description,cpc.updated_at,cpc.update_user');

        $clone_query = clone $query;
        $count = $clone_query->count('cpc.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach($rows as $row){
            setOfficialDates($row,[''],['updated_at'],['']);
        }
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public function getDetails($id)
    {
        $row = DB::table('check_point_categories as cpc')
            ->where('cpc.id', $id)
            ->selectRaw('cpc.id,cpc.name,cpc.name_kh,cpc.description,cpc.updated_at')
            ->first();
        if($row){
            setOfficialDates($row,[''],['updated_at'],['']);
        }
        return $row;
    }

    function deleteCheckPointCategory($id = null,$ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $delete = DB::table('check_point_categories')->where('id', $id)->delete();
        return $delete ? DV::depends($delete,['action'=>'deleted']): DV::error('Deleted failed.');
    }

    public function getFormOptions($id, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $check_point_categories = $id ? self::getDetails($id) : null;
        return (object) [
            'check_point_categories' => $check_point_categories,
        ];
    }

    public function getList($arr, $ss = null)
    {
        $d = (object) $arr;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $search_value = $d->search_value ?? null;
        $str_search = "1=1";
        if($search_value){
            $search_value = escape_like_str($search_value);
            $str_search = "(cpc.name LIKE '%" . $search_value . "%')";
        }
        return DB::table('check_point_categories as cpc')
            ->where('cpc.branch_id', $branch_id)
            ->whereRaw($str_search)
            ->selectRaw('cpc.id, cpc.name,cpc.name_kh,cpc.description')
            ->get();
    }

}
