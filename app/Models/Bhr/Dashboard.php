<?php

namespace App\Models\Bhr;

use App\Models\Bhr\Dashboard;
use Illuminate\Support\Facades\DB;
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

        $d_activeCount = DB::table('departments')->where('inactive', 0)->count();
        $d_inactiveCount = DB::table('departments')->where('inactive', 1)->count();

        $p_activeCount = DB::table('positions')->where('inactive', 0)->count();
        $p_inactiveCount = DB::table('positions')->where('inactive', 1)->count();

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

        $currentMonth = date('Y-m');
        $lastThreeMonths = [
            date('Y-m', strtotime('-1 month')),
            date('Y-m', strtotime('-2 months')),
            date('Y-m', strtotime('-3 months')),
        ];

        $allMonths = collect([$currentMonth, ...$lastThreeMonths])->reverse(); // Reverse to calculate from oldest to newest

        $formattedMonthlyData = [];
        $cumulativeTotal = 0;

        $allMonths->each(function ($month) use (&$formattedMonthlyData, &$cumulativeTotal) {
            $totalForMonth = DB::table('employees as e')
                ->leftJoin('resignations as r', 'e.id', '=', 'r.emp_id')
                ->leftJoin('rejoins as re', 'e.id', '=', 're.emp_id')
                ->where(function ($query) use ($month) {
                    $query->whereRaw("DATE_FORMAT(e.joining_date, '%Y-%m') = ?", [$month])
                       
                        ->orWhere(function ($subQuery) use ($month) {
                            $subQuery->whereRaw("DATE_FORMAT(re.rejoin_date, '%Y-%m') = ?", [$month]);
                        });
                })
                ->count();

            $formattedMonth = date('M Y', strtotime($month));
            $cumulativeTotal += $totalForMonth;

            $formattedMonthlyData[$formattedMonth] = $totalForMonth;
            $formattedMonthlyData["total_$formattedMonth"] = $cumulativeTotal;
        });

        return [
                'd_activeCount' => $d_activeCount,
                'd_inactiveCount' => $d_inactiveCount,
                'p_activeCount' => $p_activeCount,
                'p_inactiveCount' => $p_inactiveCount,
                'total' => $counts->sum('count'),
                'active' => $counts->has(10) ? $counts->get(10)->count : 0,
                'resigned' => $counts->has(20) ? $counts->get(20)->count : 0,
                'terminated' => $counts->has(21) ? $counts->get(21)->count : 0,
                'emp_types' => $empTypeCounts->map(function ($item) {
                    return [
                        'name' => $item->name,
                        'count' => $item->count,
                    ];
                }),
                'monthly_totals' => $formattedMonthlyData,
        ];
    }


    function getDepartments() {

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
            'department_data' => $departmentData
        ];
    }

    function getLevels($arr, $ss)
    {
        $subs_id = $ss->subs_id ?? null;
        $d = (object) $arr;

        $total_payroll = DB::table('accounts as a')
            ->where('a.id', '<>', 1) // Exclude rows where id = 1
            ->selectRaw('SUM(a.balance) as total_payroll')
            ->first();


        $total_wallet =  DB::table('wallet_accounts as w')
            ->selectRaw(' SUM(w.balance) as total_wallet')
            ->first();

        $count_warning = DB::table('emp_warnings')->count();
        $start_date = $d->start_date ?? null;
        $end_date = $d->end_date ?? null;

        $str_dates = '1=1';

        // Determine date filter: use today's date if no date range is provided, otherwise use the specified range
        $today = date('Y-m-d');
        if ($start_date && $end_date) {
            $end_date = convertDate($end_date);
            $start_date = convertDate($start_date);

            if (strtotime($start_date) && strtotime($end_date)) {
                // Check if there is any overlap between the leave period and the given date range
                $str_dates = "(
                    (l.start_date BETWEEN '$start_date' AND '$end_date') OR
                    (l.end_date BETWEEN '$start_date' AND '$end_date') OR
                    (l.start_date <= '$start_date' AND l.end_date >= '$end_date')
                )";
            }
        } else {
            $str_dates = "'$today' BETWEEN l.start_date AND l.end_date";
        }

        $col_dates = DBX::formatDate('l.start_date', 'start_date') . ',' . DBX::formatDate('l.end_date', 'end_date');
        $leave_days_calc = "DATEDIFF(l.end_date, l.start_date) + 1 AS leave_days";

        $query = DB::table('leaves as l')
            ->join('employees as emp', 'emp.id', '=', 'l.emp_id')
            ->join('positions as p', 'p.id', '=', 'emp.position_id')
            ->whereRaw($str_dates) // Apply date filter
            ->selectRaw(
                'l.id, emp.id as emp_id, emp.name as emp_name, p.title as emp_position, ' .
                $col_dates . ', l.remarks, emp.photo_file_name as emp_photo, ' . $leave_days_calc
            )
            ->orderBy('l.id', 'DESC');

        $rows = $query->get();
        $count = $query->count();

        foreach ($rows as $row) {
            $row->image_url = '';
            if (!empty($row->emp_id) && !empty($row->emp_photo)) {
                $row->image_url = Employee::profilePicture($row->emp_id);
            }
            unset($row->emp_photo);
        }

        return [

            'data' => $rows,
            'count' => $count,
            'total_payroll' => DBX::cutDigit($total_payroll->total_payroll),
            'total_wallet' => DBX::cutDigit($total_wallet->total_wallet),
            'count_warning' => $count_warning,
        ];
    }

    function getBenefits($arr, $ss)
    {
        $d = (object) $arr;

        $query = DB::table('emp_benefits as b')
            ->selectRaw('
                SUM(b.amount) as total_amount,
                SUM(CASE WHEN b.benefit_type_id = 1 THEN b.amount ELSE 0 END) as total_bonuses,
                SUM(CASE WHEN b.benefit_type_id = 2 THEN b.amount ELSE 0 END) as total_seniority,
                SUM(CASE WHEN b.benefit_type_id = 3 THEN b.amount ELSE 0 END) as total_life_insurance,
                SUM(CASE WHEN b.benefit_type_id = 4 THEN b.amount ELSE 0 END) as total_other,
                MAX(CASE WHEN b.benefit_type_id = 1 THEN DATE_FORMAT(b.update_date, "%d %b %Y") ELSE NULL END) as lud_bonuses,
                MAX(CASE WHEN b.benefit_type_id = 2 THEN DATE_FORMAT(b.update_date, "%d %b %Y") ELSE NULL END) as lud_seniority,
                MAX(CASE WHEN b.benefit_type_id = 3 THEN DATE_FORMAT(b.update_date, "%d %b %Y") ELSE NULL END) as lud_life_insurance,
                MAX(CASE WHEN b.benefit_type_id = 4 THEN DATE_FORMAT(b.update_date, "%d %b %Y") ELSE NULL END) as lud_other
            ')
            ->first();

        // Format numeric values
        $result = [
            'total_amount' => DBX::cutDigit($query->total_amount),
            'total_bonuses' => DBX::cutDigit($query->total_bonuses),
            'total_seniority' => DBX::cutDigit($query->total_seniority),
            'total_life_insurance' => DBX::cutDigit($query->total_life_insurance),
            'total_other' => DBX::cutDigit($query->total_other),
            'lud_bonuses' => $query->lud_bonuses,
            'lud_seniority' => $query->lud_seniority,
            'lud_life_insurance' => $query->lud_life_insurance,
            'lud_other' => $query->lud_other,
        ];

        return $result;
    }

}

