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
            'name' => '1|string|0-250',
            'description' => '1|string|0-250',
            'rank' => '1|number'
        ];

        $checkUnque = ["$branch_id|job_levels|name|id=id|text= job name already exists."];
        $res = validateObject($arr, $v_rule, true, [], $ss->lang, false, $checkUnque);
        if ($res->error) {
            return DV::error($res->error);
        }
        
        $inputs = $res->values;
        $id = saveData($ss, 'job_levels', ['id' => $id], $inputs, [], 1, false);

        return DV::depends($id);
    }

    public function getList($ss)
    {
        $subs_id = $ss->subs_id ?? getCurrentSubsId(true);
        return DB::table('job_levels')
        ->where('subs_id', hex2bin($subs_id))
            ->select('id', 'name', 'description', 'rank', 'branch_id')
            ->get();
    }

    public static function getDetails($id, $ss = null)
    {
        $subs_id = $ss->subs_id ?? getCurrentSubsId(true);
        return DB::table('job_levels')
        ->where('subs_id', hex2bin($subs_id))
            ->where('id', $id)
            ->select('id','name', 'description', 'rank', 'branch_id')
            ->first();
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
        $userInfo = $this->userInfo;
        $subs_id = $userInfo->subs_id ?? getCurrentSubsId(true);

        if (!$id) {
            return DV::error('Job Level ID is required');
        }

        $job_level = DB::table('job_levels')->where('id', $id)->first();
        if (!$job_level) {
            return DV::error('Job Level not found');
        }

        $res = DB::table('job_levels')->where('id', $id)->delete();
        if (!$res) {
            return DV::error('Failed to delete Job Level');
        }

        return DV::depends($id);
    }
    function getJobLevelListPaginate($arr, $ss)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;

        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 5;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }

        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $search_id = $d->id ?? null;

        $str_search = '1=1';

        $query = DB::table('job_levels as jl')
        ->selectRaw('jl.id, jl.name, jl.description, jl.rank');

       
        $query->where('jl.branch_id', $branch_id);
        if ($search_id) {
            $query->whereRaw('jl.id =' . $search_id);
        }
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->whereRaw("jl.name like '%" . $search_value . "%'");
        }
        $query->skip($skip_rows)->take($per_page);
        $count_query = clone $query;
        $count = $count_query->count('jl.id');
        $rows = $query->get();
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }
}
