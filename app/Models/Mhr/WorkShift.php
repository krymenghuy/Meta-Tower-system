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

    function upsert($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'name' => '1|string|0-150|text=name_required::@key;@max;@value'
        ];
        $pos_char = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?'];
        $res = DBX::validateObject($arr, $v_rule, true, ['Title' => $pos_char], $ss->lang, false, null);
        if ($res->error) {
            return DV::error($res->error);
        }
        $inputs = $res->values;
        $err = self::checkDuplicateName($inputs['name'], $id, $branch_id);
        if ($err) {
            return DV::error($err);
        }
        $id = DBX::saveData($ss,'work_shifts',['id' => $id],$inputs,[],1, false);
        if ($id > 0) {
            return DV::depends($id, ['work_shifts' => $inputs, 'id' => $id]);
        }
        return DV::error('Error saving work shifts');
    }
    static function checkDuplicateName($name, $id, $branch_id)
    {
        $query = DB::table('work_shifts as ws')
            ->where('ws.branch_id', $branch_id)
            ->where('ws.name', $name);

        if ($id) {
            $query->where('ws.id', '<>', $id);
        }

        $test = $query->select('id')->first();
        if ($test) {
            return 'work_shift_exist';
        }

        return null;
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
        $str_search = "1=1";
        $str_moreWhere = '2=2';
        if($search_value){
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(ws.name LIKE '%" . $search_value . "%')";
        }
        $query = DB::table('work_shifts as ws')
            ->whereRaw($str_search)
            ->selectRaw('ws.id, ws.name,ws.updated_at,ws.update_user')
            ->orderBy('ws.id','ASC');
        $clone_query = clone $query;
        $count = $clone_query->count('ws.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach($rows as $row){
            setOfficialDates($row,[''],['updated_at'],['']);
        }
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }
public function delete($id = null, $ss = null)
{
    $id = $id ?? $this->id;
    $ss = $ss ?? $this->userInfo;

    $workShiftExist = DB::table('work_shifts')
        ->where('id', $id)
        ->exists();
    if (!$workShiftExist) {
        return DV::error('Work Shift not found');
    }
    $employeeExist = DB::table('employees')
        ->where('work_shift_id', $id)
        ->exists();
    if ($employeeExist) {
        return DV::error('work_shift_is_assigned_to_employee');
    }
    $deleted = DB::table('work_shifts')
        ->where('id', $id)
        ->delete();
    return DV::depends($deleted, null, 'Error deleting work shift');
}
    static function getDetails($id, $ss)
    {
        $branch_id = $ss->branch_id;
        $row = DB::table('work_shifts as ws')->selectRaw('ws.id,ws.name')->where('ws.id', $id)->first();
        return $row;
    }
    static function getScanTimes($rows, $day)
    {
        $filtered = [];
        $day = strtolower($day);
        foreach ($rows as $row) {
            if (strtolower($row->day ?? '') === $day) {
                $filtered[] = $row;
            }
        }
        return $filtered;
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
