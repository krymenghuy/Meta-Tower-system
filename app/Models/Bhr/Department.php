<?php

namespace App\Models\Bhr;


use \Illuminate\Support\Facades\DB;
use App\Models\DV;

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

    public static function details($id, $ss = null)
    {
        $subs_id = $ss->subs_id ?? getCurrentSubsId(true);
        return DB::table('departments')
            ->where('subs_id', hex2bin($subs_id))
            ->where('id', $id)
            ->select('id', 'name', 'branch_id', 'create_user', 'created_at', 'create_uid', 'update_uid', 'updated_at', 'update_user')
            ->first();
    }

    public static function getFormOptions($id, $ss)
    {
        $department = null;
        if ($id > 0) {
            $department = self::details($id, $ss);
        }
        return (object)[
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
}