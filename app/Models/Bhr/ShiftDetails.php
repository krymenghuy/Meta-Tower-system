<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class ShiftDetails
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
            'work_shift_id' => '1|number',
            'day' => '1|string|0-100',
            'start_time' => '1|string|0-100',
            'end_time' => '1|string|0-100',
        ];

        $res = validateObject($arr, $v_rule, true, ['day' => ['-']], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;

        $id = saveData($ss, 'shift_details', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['shift_details' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving shift details');
    }

    function getShiftDetailsListPaginate($arr, $ss)
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
        $search_id = $d->id ?? null;

        $str_search = '1=1';

        $query = DB::table('shift_details as sd')
            ->join('work_shifts as ws', 'ws.id', '=', 'sd.work_shift_id')
            ->selectRaw('sd.id, sd.work_shift_id, sd.day, sd.start_time, sd.end_time, ws.name as work_shift_name');

        if ($search_id) {
            $query->whereRaw('sd.id =' . $search_id);
        }
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "sd.day like '%" . $search_value . "%' or ws.name like '%" . $search_value . "%'";
            $query->whereRaw($str_search);
        }

        $count = $query->count('sd.id');
        $rows = $query->skip($skip_rows)
            ->take($per_page)
            ->get();


        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getDetails($id, $ss)
    {

        $query = DB::table('shift_details as sd')
            ->join('work_shifts as ws', 'ws.id', '=', 'sd.work_shift_id')
            ->selectRaw('sd.id, sd.work_shift_id, sd.day, sd.start_time, sd.end_time, ws.name as work_shift_name')
            ->where('sd.id', $id)
            ->first();
        return $query;
    }

    function deleteShiftDetails($id, $ss)
    {
        $query = DB::table('shift_details')
            ->where('id', $id)
            ->delete();
        if (!$query) {
            return DV::error('Shift Details not found');
        }
        return $query;
    }

    function getFormOptions($id, $ss)
    {
        $shiftdetails = null;
        if ($id) {
            $shiftdetails = self::getDetails($id, $ss);
        }
        return (object) [

            // 'status' => DB::table('dep_status')->selectRaw('id,name')->get(),
            'shifts' => DB::table('work_shifts')->selectRaw('id,name')->get(),
            'shiftdetails' => $shiftdetails,
        ];
    }
}
