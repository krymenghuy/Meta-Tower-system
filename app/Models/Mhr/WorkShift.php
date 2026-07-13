<?php

namespace App\Models\Mhr;

use App\Models\Prm\GeneralSettings;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use DV;
use XPublicStorage;
use Vsd\Vsloquent\VSModel;
class WorkShift extends VSModel
{
     protected $userInfo = null;
    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
    
    function save($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'name' => '1|string|0-100'
        ];
        $pos_char = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?'];

        $checkUnque = ["$branch_id|work_shifts|name|id=id|text=Work Shift already exists."];
        $res = DBX::validateObject($arr, $v_rule, true, ['Title' => $pos_char], $ss->lang, false, $checkUnque);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;

        $id = DBX::saveData(
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
        //$branch_id = $ss->branch_id;
        $d = (object) $arr;


        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $search_value = $d->search_value ?? null;
        $str_search = '1=1';
        $updated = DBX::formatTime('ws.updated_at','updated_at');
        $query = DB::table('work_shifts as ws')
            ->whereRaw($str_search)
            ->selectRaw('ws.id, ws.name,'.$updated.',ws.update_user')->orderBy('ws.id', 'ASC');
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
    function delete($id=null, $ss=null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }
        $branch_id = $ss->branch_id;
        $workShiftExist = DB::table('work_shifts')->where('id', $id)->exists();
        if (!$workShiftExist) {
            return DV::error('Work Shift not found');
        }
        $deleted = DB::table('work_shifts')->where('id', $id)->delete();

        return DV::depends($deleted, null, 'Error deleting work shift');
    }
    static function getDetails($id, $ss)
    {
        $branch_id = $ss->branch_id;
        $row = DB::table('work_shifts as ws')->selectRaw('ws.id,ws.name,ws.update_user,ws.update_date')->where('ws.id', $id)->take(1)->first();
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
