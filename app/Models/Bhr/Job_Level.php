<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class Job_Level //extends Model
{
    protected $table = 'job_levels';
    protected $fillable = ['name', 'description','rank','branch_id','subs_id','created_at', 'updated_at'];

    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function save($arr, $id = null, $ss = null)
    {
         $id = $id ?? $this->id;
        $ss = $userInfo ?? $this->userInfo;
        //$subs_id = $userInfo->subs_id ?? getCurrentSubsId(true);
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id' => '0|identify=1',
            'name' => '1|string|0-100',
            'description' => '1|string|0-250',
            'rank' => '1|number|0-100',
        ];

        $checkUnque = ["$branch_id|job_levels|name|id=id|text= job name already exists."];
        $res = validateObject($arr, $v_rule, true, [], $ss->lang, false, $checkUnque);
        if ($res->error) {
            return DV::error($res->error);
        }
        
        $inputs = $res->values;
        $id = saveData($ss, 'job_levels', ['id' => $id], $inputs, [], 1, false);
        if($id > 0){
            return DV::depends(1,['job_levels' => $inputs, 'id' => $id]);
        }
        return DV::error('error save job level');
    }

    public function getList($arr,$ss)
    {   
        $ss = $ss ?? $this->userInfo;
        $d = (object)$arr;
        $branch_id = $d->branch_id ?? null;
        $query = DB::table('job_levels as j')->where('j.branch_id',$branch_id)->selectRaw('j.id,j.name,j.description,j.rank')->orderBy('j.id','DESC');

        $rows = $query->get();
        return $rows;
       
    }

    public static function getDetails($id, $ss = null)
    {
        $branch_id = $ss->branch_id;
        $row = DB::table('job_levels as j')->selectRaw('j.id,j.name,j.description,j.rank')->where('j.branch_id',$branch_id)->where('j.id',$id)->take(1)->first();
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
    public function deleteJobLevel($id = null)
    {
        $id = $id ?? $this->id;

        $delete = DB::table('job_levels')->where('id', $id)->delete();
    

        return DV::depends($delete,['action','deleted']);
    }
    function getJobLevelListPaginate($arr, $ss)
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

        $str_search = '1=1';

        $query = DB::table('job_levels as j')
        ->whereRaw($str_search)
        ->selectRaw('j.id, j.name, j.description, j.rank, j.updated_at,j.update_user')->orderBy('j.id','DESC');
        if ($search_id) {
            $query->where('j.id', $search_id);
        }
        if ($search_status_id) {
            $query->where('j.description', $search_status_id);
        }
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "j.name like '%{$search_value}%' or j.description like '%{$search_value}%' or j.name like '%{$search_value}%'";
            $query->whereRaw($str_search);
        }
       $clone_query = clone $query;
       $count = $clone_query->count('j.id');
       $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }
}
