<?php

namespace App\Models\Ypg;

use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;

class TaskAssign
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
            'member_id' => '1|number',
            'task_type_id' => '1|number',
            'status_id' => '1|number|default = 1',
            'assign_date' => '1|date',
        ];

        $res = DBX::validateObject($arr, $v_rule, true, [], $ss->lang, false);
        if ($res->error) {
            return DV::error($res->error);
        }

        if(!$id){
            $exist = DB::table('task_assigns')
                ->where('member_id', $arr['member_id'])
                ->where('task_type_id', $arr['task_type_id'])
                ->exists();
            if ($exist) {
                return DV::error('Task assign already exist');
            }
        }

        $inputs = $res->values;
        $d = (object)$inputs;

        $id = DBX::saveData($ss, 'task_assigns', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends($id, ['task_assigns' => $inputs, 'id' => $id]);
        }
        return DV::error('Error saving task assign');
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
            $str_search = "(ty.title LIKE '%" . $search_value . "%' OR m.name LIKE '%" . $search_value . "%')";
        }
        if($status_id){
            $str_moreWhere .= ' AND ta.status_id =\'' . $status_id . '\'';
        }
        $update_date = DBX::formatDate("ty.updated_at", 'update_date');
        $assign_date = DBX::formatDate("ta.assign_date", 'assign_date');

        $query = DB::table('task_assigns as ta')
            ->join('members as m', 'm.id', '=', 'ta.member_id')
            ->join('task_types as ty', 'ty.id', '=', 'ta.task_type_id')
            ->join('statuses as s', 's.id', '=', 'ta.status_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw('
                ta.id,
                ta.member_id,
                ta.task_type_id,
                ta.status_id,
                ' . $assign_date .',
                m.name as member_name,
                ty.title as task_type_title,
                s.name as status,
                ' . $update_date . ',
                ta.update_user
            ')
            ->orderBy('ta.id', 'DESC');

        $clone_query = clone $query;
        $count = $clone_query->count('ta.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public function getDetails($id, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $assign_date = DBX::formatDate("ta.assign_date", 'assign_date');

        $query = DB::table('task_assigns as ta')
            ->join('members as m', 'm.id', '=', 'ta.member_id')
            ->join('task_types as ty', 'ty.id', '=', 'ta.task_type_id')
            ->join('member_statuses as ms', 'ms.id', '=', 'ta.status_id')
            ->where('ta.id', $id)
            ->selectRaw('
                ta.id,
                ta.member_id,
                ta.task_type_id,
                ta.status_id,
                ' . $assign_date . ',
                m.name as member_name,
                ty.title as task_type_title,
                ms.name as status
            ')
            ->first();

        return $query;
    }

    public function getFormOptions($id,$ss)
    {
        $subs_id = $ss->subs_id;
        $task_assign = self::getDetails($id) ?? null;

        return (object) [
            'task_assign' => $task_assign,
            'statuses' => GeneralSettings::options_status($ss),
            'task_types' => GeneralSettings::options_task_type($ss),
            'members' => GeneralSettings::options_member($ss),
        ];

    }

    public function delete($id)
    {
        $id = $id ?? $this->id;
        if (empty($id)) {
            return DV::error('Invalid ID');
        }
        $res = DB::table('task_assigns')->where('id', $id)->delete();
        if ($res) {
            return DV::depends(1, ['id' => $id]);
        }
        return DV::error('Error deleting task assign');
    }

    function updateStatus($status_id, $id = null, $ss = null)
    {

        $ss = $ss ? $ss : $this->userInfo;

        $currentStatus = DB::table('task_assigns')->where('id', $id)->value('status_id');

        if ($currentStatus == $status_id) {
            return DV::error('It is the same current status');
        }
        $x = DB::table('task_assigns')->where('id', $id)->update([
            'status_id' => $status_id,
            'update_user'=>$ss->full_name,
            'update_date'=>getNowTime(),
            'update_uid'=>$ss->user_id
        ]);

        return DV::depends($x, ['task assign status', 'updated']);
    }

}
