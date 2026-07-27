<?php

namespace App\Models\Mhr;

use DV;
use DBX;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;
class ShiftDetails
{
    protected $id = null;
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
        $arr['day'] = $arr['days'];

        $v_rule = [
            'work_shift_id' => '1|number',
            'day' => '1|string|0-250', // Allows comma-separated days
            'time' => '1|string|0-100',
            'action' => '1|string|0-100',
            'start_time' => '1|string|0-100',
            'session' => '1|string|0-10',
            'end_time' => '1|string|0-100',
            'shift_order_number' => '1|number|0-100',
        ];
        $pos_char = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ',', '|'];
        $checkUnique = ["$branch_id|shiftDetails|name|id=id|text=Shift Detail already exists."];
        $res = DBX::validateObject($arr, $v_rule, true, ['day' => $pos_char], $ss->lang, false, $checkUnique);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        Log::info($inputs['day']);

        // Split multiple days into an array
        $days = explode('|', $inputs['day']);
        $days = array_map('trim', $days); // Remove whitespace from each day
        // Prepare response data
        $savedRows = [];
        foreach ($days as $day) {
            // Update the 'day' field for each row
            $inputs['day'] = $day;

            unset($inputs['days']);
            // Save data for each day
            $savedId = DBX::saveData($ss, 'shift_details', ['id' => $id], $inputs, [], 1);
            if ($savedId > 0) {
                $savedRows[] = ['id' => $savedId, 'shift_details' => $inputs];
            } else {
                return DV::error("Error saving shift details for day: {$day}");
            }
        }

        // Return success with all saved rows
        return DV::depends(1, ['saved_rows' => $savedRows]);
    }


    public function getShiftDetailsListPaginate($arr, $ss)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;

        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 100;
        $skip_rows = ($current_page - 1) * $per_page;

        $work_shift_id = $d->work_shift_id ?? null;
        $str_where = '1=1';
        if($work_shift_id && $work_shift_id !== '') {
            $str_where = 'sd.work_shift_id=\'' .$work_shift_id. '\'';
        }
        $days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        $rows = DB::table('shift_details as sd')
            ->join('work_shifts as ws', 'ws.id', '=', 'sd.work_shift_id')
            ->whereRaw($str_where)
            ->selectRaw('sd.id, sd.work_shift_id, sd.day, sd.time, sd.action, sd.shift_order_number')
            // ->where('ws.id', $work_shift_id)
            ->get();

        $data = [];
        foreach ($days as $day) {
            $ds = self::getScanTimes($rows, $day);
            
            $data[$day] = $ds;
        }

        return $data;
    }

    static function getScanTimes($rows, $day)
    {
        $day = strtolower($day);
        $founds = $rows->filter(function ($x) use ($day) {
            return strtolower($x->day) == $day;
        });
        $xs = [];
        foreach ($founds as $row) {
            $xs[] = $row;
        }
        usort($xs, function ($a, $b) {
            return $a->shift_order_number <=> $b->shift_order_number;
        });
        return $xs;
    }


    static function getUnique_id($rows)
    {
        // return $rows;
        $unique_id = [];
        $newRows = [];

        foreach ($rows as $row) {
            if (!in_array($row->work_shift_id, $unique_id)) {
                $unique_id[] = $row->work_shift_id;
                $newRows[] = $row;
            }
        }
        return $newRows;
    }

    function getDetails($id, $ss)
    {

        $query = DB::table('shift_details as sd')
            ->join('work_shifts as ws', 'ws.id', '=', 'sd.work_shift_id')
            ->selectRaw('sd.id, sd.work_shift_id, sd.day, sd.time,sd.action, ws.name as work_shift_name, sd.session, sd.shift_order_number, sd.start_time, sd.end_time')
            ->where('sd.id', $id)
            ->first();
        return $query;
    }

    function deleteShiftDetails($id = null)
    {
        $id = $id ?? $this->id;
        $query = DB::table('shift_details')
            ->where('id', $id)
            ->delete();
        if (!$query) {
            return DV::error('Shift Details not found');
        }
        return DV::depends($query, null, 'Error deleting shift details');
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
            'shift_details' => $shiftdetails,
        ];
    }
    function getShiftDetail($arr, $ss)
    {
        $d = (object) $arr;

        $search_value = $d->search_value ?? null;

        $str_search = '1=1';

        // Query to fetch attendance records
        $query = DB::table('shift_details as sd')
        ->selectRaw('sd.id,sd.work_shift_id,sd.day, sd.time, sd.action')
        ->where('sd.branch_id', $ss->branch_id);  // Ensure only records for the current branch are fetched

        // Aply search filters if a search value is provided
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->whereRaw("sd.work_shift_id LIKE '%" . $search_value . "%'");
        }
        $rows = $query->get();

        // Return the rows as a result
        return $rows;
    }
}
