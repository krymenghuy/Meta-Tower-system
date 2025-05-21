<?php

namespace App\Models\Ypg;

use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;

class TaskType
{
     protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function save($arr, $id = null)
    {
        $id = $id ?? $this->id;
        $ss = $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'title' => '1|string|0-150',
            'description' => '0|string|1-350',
            'status_id' => '1|number|default = 1',
        ];

        $res = DBX::validateObject($arr, $v_rule, true, [], $ss->lang, false);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $d = (object)$inputs;

        $id = DBX::saveData($ss, 'task_types', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends($id, ['task_types' => $inputs, 'id' => $id]);
        }
        return DV::error('Error saving task type');
    }

    public function getList($arr, $ss = null)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $search_value = $d->search_value ?? null;
        $status_id = $d->status_id ?? null;


        $str_search = '1=1';
        $str_moreWhere = '1=1';

        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(ty.title LIKE '%" . $search_value . "%' OR ty.description LIKE '%" . $search_value . "%')";
        }
        if($status_id){
            $str_moreWhere .= ' AND ty.status_id =\'' . $status_id . '\'';
        }


        $query = DB::table('task_types as ty')
            ->join('member_statuses as ms', 'ms.id', '=', 'ty.status_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw('ty.id, ty.title, ty.description, ty.status_id, ms.name as status')
            ->orderBy('ty.id', 'asc');

        $clone_query = clone $query;
        $count = $clone_query->count('ty.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public function getDetails($id, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $query = DB::table('task_types as ty')
            ->join('member_statuses as ms', 'ms.id', '=', 'ty.status_id')
            ->where('ty.id', $id)
            ->selectRaw('ty.id, ty.title, ty.description, ty.status_id, ms.name as status')
            ->first();
        return $query;
    }

    public function getFormOptions($id,$ss)
    {
        $subs_id = $ss->subs_id;
        $task_type = self::getDetails($id) ?? null;

        return (object) [
            'task_type' => $task_type,
            'statuses' => GeneralSettings::options_member_status($ss),
        ];

    }

     public function delete($id)
    {
        $id = $id ?? $this->id;
        if (empty($id)) {
            return DV::error('Invalid ID');
        }
        $res = DB::table('task_types')->where('id', $id)->delete();
        if ($res) {
            return DV::depends(1, ['id' => $id]);
        }
        return DV::error('Error deleting task type');
    }

    function updateStatus($status_id, $id = null, $ss = null)
    {

        $ss = $ss ? $ss : $this->userInfo;
        $x = DB::table('task_types')->where('id', $id)->update([
            'status_id' => $status_id,
            'update_user'=>$ss->full_name,
            'update_date'=>getNowTime(),
            'update_uid'=>$ss->user_id
        ]);
        return DV::depends($x, ['member status', 'updated']);
    }

}

