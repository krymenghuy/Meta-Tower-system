<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwsePaginator;

class Workshift
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
    function save($arr, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id' => '0|identity=1',
            'name' => '1|string|0-100'
        ];
        $pos_char = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?'];

        $checkUnque = ["$branch_id|work_shifts|name|id=id|text=Work Shift already exists."];
        $res = validateObject($arr, $v_rule, true, ['Title' => $pos_char], $ss->lang, false, $checkUnque);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;

        $id = saveData(
            $ss,
            'work_shifts',
            ['id' => $id],
            $inputs,
            [],
            1, false
        );
        if ($id > 0) {
            return DV::depends($id, ['work_shifts' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving work shifts');
    }
    function getWorkShiftListPaginate($arr, $ss)
    {
        $branch_id = $ss->branch_id;
        $d = (object) $arr;


        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $str_search = '1=1';
        
        $query = DB::table('work_shifts as ws')
            ->whereRaw($str_search)
            ->selectRaw('ws.id, ws.name,ws.update_date,ws.update_user')->orderBy('ws.id', 'ASC');
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->where(function ($q) use ($search_value) {
                $q->where('ws.name', 'LIKE', "%{$search_value}%");
            });
        }
        $clone_query = clone $query;
        $count = $clone_query->count('ws.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }
    function deleteWorkShift($id, $ss)
    {
        if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }
        $branch_id = $ss->branch_id;
        $workShiftExist = DB::table('work_shifts')->where('id', $id)->exists();
        if (!$workShiftExist) {
            return DV::error('Work Shift not found');
        }
        $deleted = DB::table('work_shifts')->where('id', $id)->delete();

        if ($deleted) {
            return DV::result(['message' => 'Work Shift ' . $id . ' deleted successfully']);
        }
        return DV::error('Error deleting the work_shfits');
    }
    static function getDetails($id, $ss)
    {
        $branch_id = $ss->branch_id;
        $row = DB::table('work_shifts as ws')->selectRaw('ws.id,ws.name,ws.update_user,ws.update_date')->where('ws.branch_id', $branch_id)->where('ws.id', $id)->take(1)->first();
        return $row;
    }
    static function getFormOptions($id, $ss)
    {
        $work_shift = null;
        if ($id) {
            $work_shift = self::getDetails($id, $ss);
        }
        return (object) [
            'shifts' => DB::table('work_shifts')->selectRaw('id,name')->get(),
            'work_shifts' => $work_shift,
        ];
    }
}
