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
        //$subs_id = $userInfo->subs_id ?? getCurrentSubsId(true);
        $branch_id = $ss->branch_id;
        $v_rule = [
            'name' => '1|string|0-100|text=name_required::@key;@max;@value',
            'description' => '0|string|0-250',
            'rank' => '1|number|0-100|text=enter_rank',
        ];
        $job_char = ['$','#','@','!','/','.','-','_','=','?'];


        $checkUnque = ["$branch_id|job_levels|name|id=id|text=Job Level already exists."];
        $res = DBX::validateObject($arr, $v_rule, true, ['name'=>$job_char,'description'=>$job_char], $ss->lang, false, $checkUnque);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $id = DBX::saveData($ss, 'job_levels', ['id' => $id], $inputs, [], 1, false);
        if($id > 0){
            return DV::depends(1,['job_levels' => $inputs, 'id' => $id]);
        }
        return DV::error('error save job level');
    }

    // public function getList($arr,$ss)
    // {
    //     $ss = $ss ?? $this->userInfo;
    //     $d = (object)$arr;
    //     $query = DB::table('job_levels as j')->selectRaw('j.id,j.name,j.description,j.rank')->orderBy('j.rank','ASC');

    //     $rows = $query->get();
    //     return $rows;

    // }

    public static function getDetails($id, $ss = null)
    {
        $branch_id = $ss->branch_id;
        $row = DB::table('job_levels as j')->selectRaw('j.id,j.name,j.description,j.rank')->where('j.id',$id)->first();
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

        $delete = DB::table('job_levels')->where('id', $id)->delete();
        return DV::depends($delete, null, 'Error deleting job level');
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
        $update_date = DBX::updatedAt();
        //$create_date = DBX::createdAt();
        $col_update_date = DBX::formatTime($update_date,'update_date');
        //$col_create_date = DBX::formatTime($create_date,'create_date');
        $query = DB::table('job_levels as j')
        ->whereRaw($str_search)
        ->selectRaw('j.id, j.name, j.description, j.rank,'.$col_update_date.', j.update_user')
        ->orderBy('j.rank', 'ASC'); // Sort by rank in ascending order
            // ->orderBy('sr.id', 'DESC');

        if ($search_id) {
            $query->where('j.id', $search_id);
        }
        if ($search_status_id) {
            $query->where('j.description', $search_status_id);
        }
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "j.name LIKE '%{$search_value}%' OR j.description LIKE '%{$search_value}%'";
            $query->whereRaw($str_search);
        }

        $clone_query = clone $query;
        $count = $clone_query->count('j.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }


}
