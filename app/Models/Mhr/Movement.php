<?php

namespace App\Models\Mhr;

use DBX;
use DV;
use Vsd\Vsloquent\VSModel;

use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\Prm\GeneralSettings;
class Movement extends VSModel
{
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
    
    public function upsert($arr = [], $id = null,$ss = null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'emp_id' => '1|number|exist=employees.id',
            'event_id' => '1|number|exist=events.id',
            'event_date' => '1|date',
            'remarks' => '0|string|250',
            'impact'=> '0|number'
        ];

        $res = DBX::validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;

        $id = DBX::saveData($ss, 'emp_events', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['sender' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving data');
    }

    public function getEventListPaginate($arr, $ss)
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
        $event = $d->event_id ?? null;
        $employee = $d->emp_id ?? null;
        $str_where  = '2=2';
        $str_search = '1=1';
        if ($search_value) {
            $skip_rows=0;
            $search_value = escape_like_str($search_value);
            $str_search = "emp.name like '%" . $search_value . "'";
        }
        if($event){
            $str_where = 'ee.event_id =\''.$event.'\'';
        }
        if($employee){
            $str_where .= ' AND ee.emp_id =\'' . $employee . '\'';

        }
        $col_event_date = DBX::formatDate('ee.event_date', 'event_date');
        $query = DB::table('emp_events as ee')
        ->join('employees as emp', 'emp.id', '=', 'ee.emp_id')
        ->join('positions as p', 'p.id', '=', 'emp.position_id')
        ->join('events as e', 'e.id', '=', 'ee.event_id')
        ->where('ee.branch_id', $branch_id)
        ->whereRaw($str_search)
        ->whereRaw($str_where)
            ->selectRaw('
        ee.id,
        ee.emp_id,
        ee.event_id,
        ee.impact,
        e.name as event,
        '.$col_event_date.',
        ee.remarks,
        ee.update_user,
        ee.updated_at,
        emp.name as emp_name,
        p.name as position,
        emp.photo_file_name as emp_photo
    ')        ->orderBy('ee.id','DESC');
        $clone_query = clone $query;

        $count = $clone_query->count('ee.id');
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

    public function getDetails($id, $ss) {
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

    public function deleteEmpEvent($id = null) {
        $id = $id ?? $this->id;
        $branch_id = $ss->branch_id;
        $query = DB::table('emp_events')
            ->where('id', $id)
            ->delete();
        if (!$query) {
            return DV::error('Invalid ID');
        }
        return DV::depends($query, null, 'Error deleting employee event');
    }

    public function getFormOptions($id, $ss){
        $emp_event = null;
        if ($id) {
            $emp_event = self::getDetails($id, $ss);
        }
        return (object) [

            'employees' => GeneralSettings::options_employee(10,$ss),
            'events' => DB::table('events')->selectRaw('id,name')->get(),


            'emp_event' => $emp_event,
        ];

    }

}
