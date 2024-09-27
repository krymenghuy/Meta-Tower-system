<?php

namespace App\Models\Bhr;

use App\Models\Bhr\GeneralSettings;
use App\Models\DBX;
use App\Models\DV;
use App\Models\PublicStorage;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;

class Payroll
{
    protected $id = null;
    protected static $img_dir = 'payrolls';
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
            'emp_id' => '1|number',
            'rate' => '0|numeric|0-100',
            'start_date' => '1|date',
            'end_date' => '1|date',
            'salary' => '1|numeric|0-1000000',
            'status_id' => '1|number|default = 1',
        ];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;

        $id = saveData($ss, 'payrolls', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['payrolls' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving payroll');
    }

    function getPayrollListPaginate($arr, $ss)
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
    $sort_by = $d->sort_by ?? 'pay.id';
    $sort_order = $d->sort_order ?? 'asc';
    $search_position_id = $d->position_id ?? null;
    $search_status_id = $d->status_id ?? null;

    $query = DB::table('payrolls as pay')
        ->join('employees as e', 'e.id', '=', 'pay.emp_id')
        ->join('positions as pos', 'pos.id', '=', 'e.positions_id')
        ->join('statuses as s', 's.id', '=', 'pay.status_id')
        ->join('sessions as sec', 'sec.id', '=', 'e.session_id')
        ->selectRaw('pay.id,
                    e.id as emp_id,
                    e.first_name,
                    e.last_name,
                    e.email,
                    e.phone_number,
                    e.positions_id as emp_position_id,
                    pos.name as position,
                    e.session_id as emp_section_id,
                    sec.name as section,
                    pay.rate,
                    pay.start_date,
                    pay.end_date,
                    pay.salary,
                    pay.status_id,
                    s.name as status,
                    e.photo_file_name as emp_photo')
        ->where('pay.branch_id', $branch_id);

    if ($search_id) {
        $query->where('pay.id', $search_id);
    }

    if ($search_position_id) {
        $query->where('pos.id', $search_position_id);
    }

    if ($search_status_id) {
        $query->where('s.id', $search_status_id);
    }

    if ($search_value) {
        $search_value = DB::raw('%' . $search_value . '%');
        $query->where(function ($q) use ($search_value) {
            $q->where('e.first_name', 'like', $search_value)
                ->orWhere('e.last_name', 'like', $search_value)
                ->orWhere('pos.name', 'like', $search_value)
                ->orWhere('s.name', 'like', $search_value)
                ->orWhere('pay.rate', 'like', $search_value)
                ->orWhere('pay.start_date', 'like', $search_value)
                ->orWhere('pay.end_date', 'like', $search_value)
                ->orWhere('pay.working_hours', 'like', $search_value)
                ->orWhere('pay.salary', 'like', $search_value);
        });
    }

    $query->orderBy($sort_by, $sort_order);

    $count = $query->count('pay.id');
    $rows = $query->skip($skip_rows)->take($per_page)->get();

    foreach ($rows as $row) {
        $row->image_url = '';
        if ($row->emp_photo) {
            $row->image_url = Employee::getProfilePicture($row->emp_id);
        }
        unset($row->emp_photo);
    }

    return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
}


    function getDetails($id, $ss)
    {
        $row =  DB::table('payrolls as pay')
        ->join('employees as e', 'e.id', '=', 'pay.emp_id')
        ->join('positions as pos', 'pos.id', '=', 'e.positions_id')
        ->join('statuses as s', 's.id', '=', 'pay.status_id')
        ->join('sessions as sec', 'sec.id', '=', 'e.session_id')
        ->selectRaw('pay.id,
                    e.id as emp_id,
                    e.first_name,
                    e.last_name,
                    e.email,
                    e.phone_number,
                    e.positions_id as emp_position_id,
                    pos.name as position,
                    e.session_id as emp_section_id,
                    sec.name as section,
                    pay.rate,
                    pay.start_date,
                    pay.end_date,
                    pay.salary,
                    pay.status_id,
                    s.name as status,
                    e.photo_file_name as emp_photo')
            ->where('pay.id', $id)->first();
            if ($row) {
                $row->image_url = Employee::getProfilePicture($id);
            } else {
                $row = null;
            }

            return $row;
    }



    function deletePayroll($id, $ss)
    {

        // Ensure $id is numeric and valid
        if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        // Assuming $ss contains branch_id or other necessary info
        $branch_id = $ss->branch_id;

        // Build and execute the query
        $query = DB::table('payrolls')
            ->where('id', $id)
            ->delete();
        if (!$query) {
            return DV::error('Payroll not found');
        }
        // Return the query result
        return $query;

    }

    function getFormOptions($id, $ss)
    {
        $payroll = null;
        if ($id) {
            $payroll = self::getDetails($id, $ss);
        }
        return (object) [
            'sort_by' => [
                ['id' => 'pay.name', 'name' => 'By Name'],
                ['id' => 'pay.email', 'name' => 'By Email'],
                ['id' => 'pay.phone_number', 'name' => 'By Phone Number'],
                ['id' => 'pos.name', 'name' => 'By Position'],
                ['id' => 'pay.rate', 'name' => 'By  Rate'],
                ['id' => 'pay.salary', 'name' => 'By Salary'],
                ['id' => 'pay.start_date', 'name' => 'By Start Date'],
                ['id' => 'pay.end_date', 'name' => 'By End Date'],
                ['id' => 'pay.working_hours', 'name' => 'By Working Hours'],
                ['id' => 'pay.photo_file_name', 'name' => 'By Photo'],

            ],
            'status' => DB::table('statuses')->selectRaw('id,name')->get(),
            'positions' => DB::table('positions')->selectRaw('id,name')->get(),
            'employees' => DB::table('employees')->selectRaw('id,CONCAT(first_name," ",last_name) as name')->get(),

            'payrolls' => $payroll,
        ];

    }
}
