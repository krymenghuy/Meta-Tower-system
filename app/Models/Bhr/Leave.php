<?php

namespace App\Models\Bhr;

use App\Models\DV;
use App\Models\Bhr\Employee;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;
class Leave
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'leave';


    function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function save($arr, $id=null, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id' => '0|identity=1',
            'emp_id' => '0|number|exists=employees.id',
            'leave_date' => '1|date',
            'return_date' => '1|date',
            'leave_type_id' => '1|number',
            'remarks' => '0|string|250',
            // 'has_returned' =>'number|default=0',
            'status_id' => '1|number|default = 2',

        ];
        $img_char = ['+',':',',',';','/','\\','=','?'];
        $checkUnque = ["$branch_id|leaves|emp_id|id=id|text=Employee has already Leave "];


        $res = validateObject($arr, $v_rule, true, [], $ss->lang,false,$checkUnque);

        if ($res->error) 
            return DV::error($res->error);

        $inputs = $res->values;
        $d = (object) $inputs;
        if(!$d->emp_id) return DV::error('Employee is required for leave');
        $leave_created = $id > 0 ? 0 : 1;
        $leave_created = !$id;

        $id = saveData($ss,'leaves', ['id' => $id], $inputs, [], 1,false);
     
        if ($id > 0) {
            return DV::depends(1, ['leaves' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving leave management');
    }

    function getLeaveListPaginate($arr, $ss)
    {
        $branch_id = $ss->branch_id;
        $d = (object) $arr;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
    
        $status_id = $d->status_id ?? null;
        $search_value = $d->search_value ?? null;
        $start_date = $d->start_date ?? null;
        $end_date = $d->end_date ?? null;
    
        $str_search = '1=1';
        $str_status = '1=1';
        $str_dates = '1=1';
    
        if ($search_value) {
            $str_search = "(l.reason LIKE '%" . $search_value . "%')";
        }
        if ($status_id) {
            $str_status = 'l.status_id = \'' . $status_id . '\'';
        } else {
            $end_date = convertDate($end_date);
            $start_date = convertDate($start_date);
            if ((bool) strtotime($start_date) && (bool) strtotime($end_date)) {
                $str_dates = "DATE(l.created_at) BETWEEN '$start_date' AND '$end_date'";
            } elseif ($end_date) {
                $start_date = date('Y-m-d', strtotime(date('Y-m-d') . '-90 days'));
                $str_dates = "DATE(l.created_at) BETWEEN '$start_date' AND '$end_date'";
            }
        }
        
        $skip_rows = ($current_page - 1) * $per_page;
    
        $query = DB::table('leaves as l')
            ->join('employees as emp', 'emp.id', '=', 'l.emp_id')
            ->join('positions as p', 'p.id', '=', 'emp.positions_id')
            ->join('leave_types as lt', 'lt.id', '=', 'l.leave_type_id')
            ->join('leave_statuses as ls', 'ls.id', '=', 'l.status_id')
            ->where('l.branch_id', $branch_id)
            ->where('l.status_id',2)
            ->whereRaw($str_search)
            ->whereRaw($str_status)
            ->whereRaw($str_dates)
            ->selectRaw('l.id, emp.name as employee, p.title, l.leave_type_id, lt.name as leave_type, l.leave_date, l.return_date, ls.name as status, l.remarks, l.update_user, l.update_date,l.status_id')
            ->orderBy('l.id', 'DESC');
    
        $clone_query = clone $query;
        $count = $clone_query->count('l.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
    
       
    
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }
    



    function getDetails($id ,$ss =null)
    {
        $branch_id = $ss->branch_id;

        $leave = DB::table('leaves as l')
        ->join('employees as emp', 'emp.id', '=', 'l.emp_id')
        ->join('positions as p', 'p.id', '=', 'emp.positions_id')
        ->join('leave_types as lt', 'lt.id', '=', 'l.leave_type_id')
        ->join('leave_statuses as ls', 'ls.id', '=', 'l.status_id')
        ->where('l.id', $id)
        ->where('l.status_id',2)
        ->selectRaw('l.id, emp.name as employee, p.title, l.leave_type_id, lt.name as leave_type, l.leave_date, l.return_date, ls.name as status, l.remarks, l.update_user, l.update_date')
        ->first();

       
        return $leave;
    }

    function delete($id, $ss)
    {
        $id = $id ?? $this->id;
        $branch_id = $ss->branch_id;

        $delete = DB::table('leaves')->where('id',$id)->delete();
        return DV::depends($delete,['action','deleted']);


    }

    function getFormOptions($id, $ss)
    {
        $leave = null;
        if ($id) {
            $leave = self::getDetails($id, $ss);
        }
        return (object) [

            'employees' => DB::table('employees')->selectRaw('id,name')->get(),
            'positions' => DB::table('positions')->selectRaw('id,title')->get(),
            'status' => DB::table('leave_statuses')->selectRaw('id,name,code')->get(),

            'leave' => $leave,
        ];

    }







}
