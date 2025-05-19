<?php

namespace App\Models\Ypg;

use DV;
use DBX;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class ScanPlan
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function save($arr = [], $id = null, $ss = null) {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'shift_details_id' => '1|number',
            'scan_time' => '1|string|0-100',
            'action' => '1|string|0-100',
        ];

        $res = DBX::validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;

        $id = DBX::saveData($ss,'scan_plan', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['scan_plan' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving scan plan');
    }

    function getScanPlanListPaginate($arr, $ss) {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;

        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }

        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $search_id = $d->id ?? null;

        $str_search = '1=1';

        $query = DB::table('scan_plan as sp')
            ->join('shift_details as sd', 'sd.id', '=', 'sp.shift_details_id')
            ->join('work_shifts as ws', 'ws.id', '=', 'sd.work_shift_id')
            ->selectRaw('sp.id, sp.shift_details_id,ws.name as work_shift_name,sd.day, sd.start_time, sd.end_time, sp.scan_time, sp.action');

        if ($search_id) {
            $query->whereRaw('sp.id =' . $search_id);
        }
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "sd.day like '%" . $search_value . "%'  or ws.name like '%" . $search_value . "%' or sp.scan_time like '%" . $search_value . "%' or sp.action like '%" . $search_value . "%'";
            $query->whereRaw($str_search);
        }
        $query->skip($skip_rows)->take($per_page);
        $count_query = clone $query;
        $count = $count_query->count('sp.id');
        $rows = $query->get();


        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getDetails($id,$ss){
        $query = DB::table('scan_plan as sp')
            ->join('shift_details as sd', 'sd.id', '=', 'sp.shift_details_id')
            ->join('work_shifts as ws', 'ws.id', '=', 'sd.work_shift_id')
            ->selectRaw('sp.id, sp.shift_details_id,ws.name as work_shift_name,sd.day, sd.start_time, sd.end_time, sp.scan_time, sp.action')
            ->where('sp.id',$id)
            ->first();
        return $query;
    }

    function deleteScanPlan($id, $ss){
        $query = DB::table('scan_plan')
            ->where('id', $id)
            ->delete();
        if (!$query) {
            return DV::error('Scan Plan not found');
        }
        return DV::depends($query, null, 'Error deleting scan plan');
    }

    function getFormOptions($id, $ss){
        $scan_plan = null;
        if ($id) {
            $scan_plan = self::getDetails($id, $ss);
        }
        return (object) [
            'Work Shift' => DB::table('work_shifts')->selectRaw('id,name')->get(),
            'scan_plan' => $scan_plan,
        ];
    }
}
