<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class EmployeeEvent
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function save($arr,$ss = null){
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id' => '0|identity=1',
            'emp_id' => '1|number',
            'event_id' => '1|number',
            'remarks' => '0|string|250',
            'impact_id' => '1|number|default = 1',
        ];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;

        $id = saveData($ss, 'emp_events', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['sender' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving data');
    }

    function getEventListPaginate($arr, $ss) {
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

        $query = DB::table('emp_events as ee')
            ->join('events as e', 'e.id', '=', 'ee.event_id')
            ->join('event_impacts as ei', 'ei.id', '=', 'ee.impact_id')
            ->selectRaw('ee.id, ee.emp_id, ee.event_id, ee.impact_id, e.name, ei.name as impact, ee.remarks')
            ->where('ee.branch_id', $ss->branch_id);

        if ($search_id) {
            $query->where('ee.id', $search_id);
        }
        if ($search_value) {
            $query->where('ee.event_id', $search_value);
        }
        $query->skip($skip_rows)->take($per_page);
        $count_query = clone $query;
        $count = $count_query->count('e.id');
        $rows = $query->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getDetails($id, $ss) {
        $query = DB::table('emp_events as ee')
            ->join('events as e', 'e.id', '=', 'ee.event_id')
            ->join('event_impacts as ei', 'ei.id', '=', 'ee.impact_id')
            ->selectRaw('ee.id, ee.emp_id, ee.event_id, ee.impact_id, e.name, ei.name as impact, ee.remarks')
            ->where('ee.branch_id', $ss->branch_id)
            ->where('ee.id', $id)
            ->first();
        return $query;
    }

    function deleteEmpEvent($id, $ss) {
        $branch_id = $ss->branch_id;
        $query = DB::table('emp_events')
            ->where('id', $id)
            ->delete();
        if (!$query) {
            return DV::error('Invalid ID');
        }
        return $query;
    }

    function getFormOptions($id, $ss){
        $emp_event = null;
        if ($id) {
            $emp_event = self::getDetails($id, $ss);
        }
        return (object) [

            'employees' => DB::table('employees')->selectRaw('id,name')->get(),
            'impacts' => DB::table('event_impacts')->selectRaw('id,name')->get(),
            'events' => DB::table('events')->selectRaw('id,name')->get(),
            'emp_event' => $emp_event,
        ];

    }
}
