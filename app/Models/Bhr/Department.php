<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
class Department //extends Model
{
    protected $table = 'departments';
    protected $fillable = ['name', 'branch_id', 'subs_id', 'create_user', 'update_user', 'create_date', 'update_uid', 'create_uid'];

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

        $v_rule = [
            'name' => '1|string|0-250'

        ];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang, false, null);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $id = saveData($ss, 'departments', ['id' => $id], $inputs, [], 1, false);

        return DV::depends($id);
    }

    public function getList($ss)
    {
        $subs_id = $ss->subs_id ?? getCurrentSubsId(true);
        return DB::table('departments')
            ->where('subs_id', hex2bin($subs_id))
            ->select('id', 'name', 'branch_id')
            ->get();
    }

    public static function getDetails($id, $ss = null)
    {
        $subs_id = $ss->subs_id ?? getCurrentSubsId(true);
        return DB::table('departments')
            ->where('subs_id', hex2bin($subs_id))
            ->where('id', $id)
            ->select('id', 'name', 'branch_id')
            ->first();
    }

    public static function getFormOptions($id, $ss)
    {
        $department = null;
        if ($id > 0) {
            $department = self::getDetails($id, $ss);
        }
        return (object) [
            'department' => $department
        ];
    }

    public function deleteDepartment($id = null)
    {
        $id = $id ?? $this->id;
        $userInfo = $this->userInfo;
        $subs_id = $userInfo->subs_id ?? getCurrentSubsId(true);

        if (!$id) {
            return DV::error('Department ID is required');
        }

        $department = DB::table('departments')->where('id', $id)->first();
        if (!$department) {
            return DV::error('Department not found');
        }

        $res = DB::table('departments')->where('id', $id)->delete();
        if (!$res) {
            return DV::error('Failed to delete Department');
        }

        return DV::depends($id);
    }
    function getDepartmentListPaginate($arr, $ss)
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

        $query = DB::table('departments as d')
            ->selectRaw('d.id, d.name');

        if ($search_id) {
            $query->whereRaw('d.id =' . $search_id);


            $query->where('d.branch_id', $branch_id);
            if ($search_value) {
                $search_value = escape_like_str($search_value);
                $query->whereRaw("d.name like '%" . $search_value . "%'");
            }
            $query->skip($skip_rows)->take($per_page);
            $count_query = clone $query;
            $count = $count_query->count('d.id');
            $rows = $query->get();
            return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
        }
    }
}