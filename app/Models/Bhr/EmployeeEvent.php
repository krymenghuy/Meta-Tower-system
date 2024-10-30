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
            'emp_id' => '1|number|exist=employees.id',
            'event_id' => '1|number|exist=events.id',
            'event_date' => '1|date',
            'remarks' => '0|string|250',
            'impact_id'=> '0|number'
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
        $sort_by = $d->sort_by ?? 'ee.id';
        $sort_order = $d->sort_order ?? 'asc';
        $search_id = $d->id ?? null;
        $search_status_id = $d->status_id ?? null;
        $search_event_id = $d->event_id ?? null;


        $str_search = '1=1';

        $query = DB::table('emp_events as ee')
            ->join('employees as emp', 'emp.id', '=', 'ee.emp_id')
            ->join('positions as p', 'p.id', '=', 'emp.position_id')
            ->join('events as e', 'e.id', '=', 'ee.event_id')
            ->selectRaw('ee.id, ee.emp_id, ee.event_id, e.name as event,e.impact,formatDate(ee.event_date) as event_date, ee.remarks, emp.name as emp_name, p.title as position, emp.photo_file_name as emp_photo')
            ->where('ee.branch_id', $ss->branch_id);

        if ($search_id) {
            $query->where('ee.id', $search_id);
        }
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "e.name like '%" . $search_value . "%' or ee.remarks like '%" . $search_value . "%' or emp.name like '%" . $search_value . "%' or p.title like '%" . $search_value . "%'";
        }
        if ($search_status_id) {
            $query->where('ee.impact_id', $search_status_id);
        }
        if ($search_event_id) {
            $query->where('ee.event_id', $search_event_id);
        }
        $query->whereRaw($str_search);

        $query->orderBy($sort_by, $sort_order);

        $count = $query->count('ee.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            $row->image_url = '';
            if ($row->emp_photo) {
                $row->image_url = Employee::profilePicture($row->emp_id);
            }
            unset($row->emp_photo);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getDetails($id, $ss) {
        $query = DB::table('emp_events as ee')
            ->join('employees as emp', 'emp.id', '=', 'ee.emp_id')
            ->join('positions as p', 'p.id', '=', 'emp.position_id')
            ->join('events as e', 'e.id', '=', 'ee.event_id')
            ->selectRaw('ee.id, ee.emp_id, ee.event_id, e.name as event,e.impact,ee.event_date, ee.remarks, emp.name as emp_name, p.title as position, emp.photo_file_name as emp_photo')
            ->where('ee.branch_id', $ss->branch_id)
            ->where('ee.id', $id)
            ->first();

        if ($query) {
            $query->image_url = '';
            if ($query->emp_photo) {
                $query->image_url = Employee::profilePicture($query->emp_id);
            }
            unset($query->emp_photo);
        } else {
            $query = null;
        }
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

            'sort_by' => [
                ['id' => 'emp.name', 'name' => 'By Name'],
                ['id' => 'ee.event_date', 'name' => 'By Date'],

            ],

            'employees' => GeneralSettings::options_employee(10,$ss),
            'events' => DB::table('events')->selectRaw('id,name')->get(),


            'emp_event' => $emp_event,
        ];

    }

}
