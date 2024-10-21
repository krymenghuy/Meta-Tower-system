<?php

namespace App\Models\Bhr;

use App\Models\DV;
use DB;
use App\Models\DBX;
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
        $start_date =isset($d->start_date) ?  convertDate($d->start_date) : null;
        $end_date = isset($d->end_date) ? convertDate($d->end_date) : null;

        $str_search = '1=1';

         $query = DB::table('payrolls as pay')
            ->join('employees as e', 'e.id', '=', 'pay.emp_id')
            ->join('positions as pos', 'pos.id', '=', 'e.position_id')
            ->join('statuses as s', 's.id', '=', 'pay.status_id')
            // ->join('emp_roles as er', 'er.id', '=', 'e.emp_role_id')
            ->selectRaw('pay.id,
                        e.id as emp_id,
                        e.name,
                        e.name_kh,
                        e.email,
                        e.phone_number,
                        e.position_id as emp_position_id,
                        pos.title as position,
                        pay.rate,
                        formatDate(pay.start_date) as start_date,
                        formatDate(pay.end_date) as end_date,
                        pay.salary,
                        pay.status_id,
                        s.name as status,
                        e.photo_file_name as emp_photo')
            ->where('pay.branch_id', $branch_id);


        if ($search_id) {
            $query->where('pay.id', $search_id);
        }
        if ($search_position_id) {
            $query->where('e.position_id', $search_position_id);
        }
        if ($search_status_id) {
            $query->where('pay.status_id', $search_status_id);
        }

        if ($start_date) {
            $query->where('pay.start_date', '>=', $start_date);
        }
        if ($end_date) {
            $query->where('pay.end_date', '<=', $end_date);
        }


        if ($search_value) {
            $str_search = "CONCAT(e.name,' ',e.name_kh) like '%{$search_value}%' or
            e.email like '%{$search_value}%' or
            e.phone_number like '%{$search_value}%' or
            pos.title like '%{$search_value}%' or
            pay.rate like '%{$search_value}%' or
            pay.start_date like '%{$search_value}%' or
            pay.end_date like '%{$search_value}%' or
            pay.salary like '%{$search_value}%' or
            er.name like '%{$search_value}%'";
        }

        $query->whereRaw($str_search);

        $query->orderBy($sort_by, $sort_order);

        $count = $query->count('pay.id');
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


    function getDetails($id, $ss)
    {
        $row =  DB::table('payrolls as pay')
        ->join('employees as e', 'e.id', '=', 'pay.emp_id')
        ->join('positions as pos', 'pos.id', '=', 'e.position_id')
        ->join('statuses as s', 's.id', '=', 'pay.status_id')
        // ->join('emp_roles as er', 'er.id', '=', 'e.emp_role_id')
        ->selectRaw('pay.id,
                    e.id as emp_id,
                    e.name,
                    e.name_kh,
                    e.email,
                    e.phone_number,
                    e.position_id as emp_position_id,
                    pos.title as position,
                    pay.rate,
                    pay.start_date,
                    pay.end_date,
                    pay.salary,
                    pay.status_id,
                    s.name as status,
                    e.photo_file_name as emp_photo')
            ->where('pay.id', $id)->first();
            if ($row) {
                $row->image_url = Employee::profilePicture($id);
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
                ['id' => 'e.name', 'name' => 'By Name'],
                ['id' => 'pos.title', 'name' => 'By Position'],
                ['id' => 'pay.salary', 'name' => 'By Salary'],
                ['id' => 'pay.rate', 'name' => 'By  Rate'],

            ],
            'employees' => GeneralSettings::options_employee(10,$ss),
            'status' => DB::table('statuses')->selectRaw('id,name')->get(),
            'payrolls' => $payroll,
        ];

    }

    function updateStatus($status_id, $id = null, $ss = null)
    {

        $ss = $ss ? $ss : $this->userInfo;
        $x = DB::table('payrolls')->where('id', $id)->update([
            'status_id' => $status_id,
            'update_user'=>$ss->full_name,
            'update_date'=>getNowTime(),
            'update_uid'=>$ss->user_id
        ]);
        return DV::depends($x, ['Payroll  status', 'updated']);
    }
}
