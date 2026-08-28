<?php

namespace App\Models\Mhr;

use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;

class JobLevel //extends Model
{
    protected $table = 'job_levels';

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
        $ss = $userInfo ?? $this->userInfo;
        $v_rule = [
            'name' => '1|string|0-100|text=name_required::@key;@max;@value',
            'description' => '0|string|0-250',
            'rank' => '1|number|0-100|text=enter_rank',
        ];
        $job_char = ['$','#','@','!','/','.','-','_','=','?'];


        $checkUnque = null;
        $res = DBX::validateObject($arr, $v_rule, true, ['name'=>$job_char,'description'=>$job_char], $ss->lang, false, $checkUnque);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $id = DBX::saveData($ss, 'job_levels', ['id' => $id], $inputs, [], 1, false);
        if($id > 0){
            return DV::depends(1,['job_levels' => $inputs, 'id' => $id]);
        }
        return DV::error('Error saving job level');
    }
    public static function getDetails($id, $ss = null)
    {
        $row = DB::table('job_levels as l')->selectRaw('l.id,l.name,l.description,l.rank')->where('l.id',$id)->first();
        return $row;


    }

    public static function getFormOptions($id, $ss)
    {
        $job_level = null;
        if ($id) {
            $job_level = self::getDetails($id, $ss);
        }
        return (object) [
            'job_levels' => $job_level
        ];
    }
    
    public function delete($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        if (!$id) {
            return DV::error('Level ID is not valid.');
        }
        $exists = DB::table('positions')
            ->where('level_id', $id)
            ->exists();
        if ($exists) {
            return DV::error('Level is assigned to positions.');
        }
        $deleted = DB::table('job_levels')
            ->where('id', $id)
            ->delete();
        return DV::depends($deleted, ['action' => 'deleted'], 'Failed to delete level.');
    }

    function getList($arr, $ss)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 20;
        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $search_id = $d->id ?? null;
        $search_status_id = $d->status_id ?? null;

        $str_search = '1=1';
        $query = DB::table('job_levels as l')
        ->whereRaw($str_search)
        ->selectRaw('l.id, l.name, l.description, l.rank,l.updated_at, l.update_user')
        ->orderBy('l.rank', 'ASC'); 

        if ($search_id) {
            $query->where('l.id', $search_id);
        }
        if ($search_status_id) {
            $query->where('l.description', $search_status_id);
        }
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "l.name LIKE '%{$search_value}%' OR l.description LIKE '%{$search_value}%'";
            $query->whereRaw($str_search);
        }

        $clone_query = clone $query;
        $count = $clone_query->count('l.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach ($rows as $row) {
            setOfficialDates($row, [''],['updated_at'],['']);
        }
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }


}
