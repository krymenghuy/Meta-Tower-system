<?php

namespace App\Models\Bhr;

use App\Models\DV;
use App\Models\JDV;
use App\Models\Bhr\Dashboard;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\DBX;

class Dashboard
{
    protected $id = null;
    protected $userInfo = null;
    function __construct($id=null,$userInfo=null){
        $this->id=$id;
        $this->userInfo =$userInfo;
    }

    function countEmployees($arr, $ss)
    {
        $d = (object) $arr;

        $count_department = DB::table('departments')->count();
        $count_position = DB::table('positions')->count();


        $counts = DB::table('employees as e')
            ->select('e.status_id', DB::raw('COUNT(*) as count'))
            ->groupBy('e.status_id')
            ->get()
            ->keyBy('status_id');


        $empTypeCounts = DB::table('employees as e')
            ->join('emp_types as t', 'e.emp_type_id', '=', 't.id')
            ->whereNotIn('e.status_id', [20, 21])
            ->select('t.name', 'e.emp_type_id', DB::raw('COUNT(*) as count'))
            ->groupBy('e.emp_type_id', 't.name')
            ->get();


        $currentMonth = date('Y-m'); // Format: YYYY-MM
        $newEmployees = DB::table('employees as e')
            ->whereRaw("DATE_FORMAT(e.joining_date, '%Y-%m') = ?", [$currentMonth])
            ->count();

        return [
            'count_department' => $count_department,
            'count_position' => $count_position,
            'total' => $counts->sum('count'),
            'active' => $counts->has(10) ? $counts->get(10)->count : 0,
            'resigned' => $counts->has(20) ? $counts->get(20)->count : 0,
            'terminated' => $counts->has(21) ? $counts->get(21)->count : 0,
            'new_employees' => $newEmployees,
            'emp_types' => $empTypeCounts->map(function ($item) {
                return [
                    'name' => $item->name,
                    'count' => $item->count,
                ];
            }),
        ];
    }


    function getDepartments() {

        $departmentCount = DB::table('departments')->count();
        $positionCount = DB::table('positions')->count();


        $query = DB::table('departments as d')
            ->join('positions as p', 'p.department_id', '=', 'd.id')
            ->join('employees as e', 'e.position_id', '=', 'p.id')
            ->select(
                'd.id as department_id',
                'd.name as department_name',
                'p.title as position_title',
                DB::raw('COUNT(e.id) as total_employee_count'),
                DB::raw('SUM(CASE WHEN e.emp_type_id = 3 AND e.status_id NOT IN (20, 21) THEN 1 ELSE 0 END) as staff_count'),
                DB::raw('SUM(CASE WHEN e.emp_type_id = 1 AND e.status_id NOT IN (20, 21) THEN 1 ELSE 0 END) as internship_count'),
                DB::raw('SUM(CASE WHEN e.emp_type_id = 2 AND e.status_id NOT IN (20, 21) THEN 1 ELSE 0 END) as in_probation_count')
            )
            ->whereNotIn('e.status_id', [20, 21])
            ->groupBy('d.id', 'd.name', 'p.title')
            ->orderBy('d.name')
            ->orderBy('p.title');

        $departmentData = $query->get();

        
        return [
            'department_count' => $departmentCount,
            'position_count' => $positionCount,
            'department_data' => $departmentData
        ];
    }


}

