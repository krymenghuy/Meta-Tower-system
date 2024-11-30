<?php

namespace App\Models\Bhr;

use App\Models\DV;
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

    function save($arr, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $arr['day'] = $arr['days'];
        // Validation rules
        $v_rule = [
            'id' => '0|identity=1',
            'work_shift_id' => '1|number',
            'day' => '0|string|0-250', // Allows comma-separated days
            'time' => '1|string|0-100',
            'action' => '1|string|0-100',
        ];
        $pos_char = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ',', '|'];
        $checkUnique = ["$branch_id|shiftDetails|name|id=id|text=Shift Detail already exists."];
        // Validate input
        $res = validateObject($arr, $v_rule, true, ['day' => $pos_char], $ss->lang, false, $checkUnique);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
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
            $savedId = saveData($ss, 'shift_details', ['id' => $id], $inputs, [], 1);
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

        $search_value = $d->search_value ?? null;
        $work_shift_id = $d->work_shift_id ?? null;

        $days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        $rows = DB::table('shift_details as sd')
            ->join('work_shifts as ws', 'ws.id', '=', 'sd.work_shift_id')
            ->selectRaw('sd.id, sd.work_shift_id, sd.day, sd.time, sd.action')
            ->where('ws.id', $work_shift_id)->get();

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
            ->selectRaw('sd.id, sd.work_shift_id, sd.day, sd.time,sd.action, ws.name as work_shift_name')
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
            'shift_details' => $shiftdetails,
        ];
    }
}
