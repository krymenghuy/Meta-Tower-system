<?php

namespace App\Models\Bhr;

use Illuminate\Support\Facades\DB;
use App\Models\DBX;
use Carbon\Carbon;


class Dashboard
{
    protected $id = null;
    protected $userInfo = null;
    function __construct($id=null,$userInfo=null){
        $this->id=$id;
        $this->userInfo =$userInfo;
    }
    public function getData($arr,$ss=null){
        $ss = $ss ?? $this->userInfo;
        $cards = self::getCards($arr,$ss);
        return (object)[
            'doughnutChart'=>self::countEmployeeByType(0,$ss),
            'cards'=>$cards,
            'barCharts'=>self::getMovementCountForPieChart($ss),
            'pieCharts'=>self::getTotalStaffComparison($ss),
            'onLeave'=>self::getLevels($arr,$ss)
        ];
    }
    static function countEmployeeByType($arr, $ss){
        $branch_id = $ss->branch_id;
        $back_days = -90;
        $start_date = convertDate(Carbon::now()->addDays($back_days));
        $rows = DB::table('employees AS e')
            ->join('emp_types AS t', 'e.emp_type_id', '=', 't.id')
            // ->where('e.branch_id', $branch_id)
            ->whereRaw("DATE(e.joining_date) >= ?", [$start_date])
            ->selectRaw("t.name AS category,COUNT(e.id) AS count")
            ->groupBy('t.name')
            ->get();
    
        $labels = [];
        $values = [];
        $colors = [];
        $base_colors = ['#cab54a', '#2b3991','#32BCD3', '#3795E0', '#ECF140'];
    
        $total = 0;
    
        foreach ($rows as $index => $row) {
            $labels[] = $row->category;  
            $values[] = $row->count;    
            $colors[] = $base_colors[$index % count($base_colors)];
    
            $total += $row->count; 
        }
    
        return (object)[
            'title' => 'Total '.$total.' Employees',
            'total' => $total,
            'labels' => $labels,
            'values' => $values,
            'colors' => $colors
        ];
    }
    
    public static function getTotalStaffComparison($ss = null) {
        $ss = $ss ?? auth()->user(); // Replace this with your session or authentication logic if needed
    
        // Get the current date
        $currentDate = Carbon::now();
        
        // Calculate the start dates for the last 3 months
        $startDates = [
            $currentDate->copy()->startOfMonth()->subMonths(2), // 3 months ago
            $currentDate->copy()->startOfMonth()->subMonths(1), // 2 months ago
            $currentDate->copy()->startOfMonth(),              // Current month
        ];
    
        // Prepare an array for storing monthly staff counts
        $staffCounts = [];
    
        // Loop through each month to fetch data
        foreach ($startDates as $startDate) {
            $endDate = $startDate->copy()->endOfMonth();
    
            $count = DB::table('employees')
                ->whereRaw("DATE(joining_date) BETWEEN ? AND ?", [$startDate, $endDate])
                ->count();
    
            $staffCounts[] = (object)[
                'month' => $startDate->format('F Y'), // Format month and year
                'count' => $count
            ];
        }
    
        // Return data formatted for the bar chart
        return (object)[
            'title' => 'Total Staff (Last 3 Months)',
            'labels' => array_column($staffCounts, 'month'),
            'values' => array_column($staffCounts, 'count'),
            'colors' => ['#1E90FF', '#32CD32', '#FF4500'] // Example colors for the chart
        ];
    }
    
  
    
    static function getCards($arr, $ss) {
        // $subs_id = $ss->subs_id ?? getCurrentSubsId(true);
        // $bin_subs_id = hex2bin($subs_id);
        // $branch_ids = getAccessBranches($ss, null);
        $d = (object) $arr;
        $back_days = isset($d->back_days) ? $d->back_days : -90;
    
        $from_date = convertDate(Carbon::now()->addDays($back_days));
        $dateField = DBX::convertToDate('e.joining_date');
        $moreWhere = $dateField . " >= '" . $from_date . "'";
    
        $rows = DB::table('employees AS e')
            // ->where('e.subs_id', $bin_subs_id)
            // ->whereIn('e.branch_id', $branch_ids)
            ->whereRaw($moreWhere)
            ->select('e.status_id', 'e.emp_type_id', 'e.branch_id', 'e.joining_date')
            ->orderByRaw("e.joining_date ASC")
            ->get();
    
        $total_employees = 0;
        $active_employees = 0;
        $resigned_employees = 0;
        $terminated_employees = 0;
    
        $branches = [];
        $emp_types = [];
        $days_count = 0;
    
        $first_date = isset($rows[0]) ? $rows[0]->joining_date : $from_date;
    
        foreach ($rows as $row) {
            if ($row->status_id == 10) {
                $active_employees++;
            } elseif ($row->status_id == 20) {
                $resigned_employees++;
            } elseif ($row->status_id == 30) {
                $terminated_employees++;
            }
    
            if (!in_array($row->branch_id, $branches)) {
                $branches[] = $row->branch_id;
            }
    
            if (!isset($emp_types[$row->emp_type_id])) {
                $emp_types[$row->emp_type_id] = 1;
            } else {
                $emp_types[$row->emp_type_id]++;
            }
    
            $total_employees++;
        }
    
        $days_count = dateDiff_days(convertDate($first_date), date('Y-m-d'));
    
        return (object) [
            'total_employees' => (object) [
                'count' => $total_employees,
                'title' => 'Total Employees',
                'subTitle' => 'Last ' . abs($back_days) . ' days'
            ],
            'active_employees' => (object) [
                'count' => $active_employees,
                'title' => 'Active Employees',
                'subTitle' => 'Last ' . abs($back_days) . ' days'
            ],
            'resigned_employees' => (object) [
                'count' => $resigned_employees,
                'title' => 'Resigned Employees',
                'subTitle' => 'Last ' . abs($back_days) . ' days'
            ],
            'terminated_employees' => (object) [
                'count' => $terminated_employees,
                'title' => 'Terminated Employees',
                'subTitle' => 'Last ' . abs($back_days) . ' days'
            ],
            'branch_count' => (object) [
                'count' => count($branches),
                'title' => 'Branches with Employees',
                'subTitle' => 'Last ' . abs($back_days) . ' days'
            ],
            'emp_type_distribution' => (object) [
                'types' => $emp_types,
                'title' => 'Employee Type Distribution',
                'subTitle' => 'Last ' . abs($back_days) . ' days'
            ]
        ];
    }
    public static function getMovementCountForPieChart($ss)
{
    $back_days = -90;
    $start_date = Carbon::now()->addDays($back_days)->format('Y-m-d');

    
    $movements = DB::table('emp_events  AS em')
        ->join('events AS mt', 'em.event_id', '=', 'mt.id')
        ->whereRaw('DATE(em.event_date) >= ?', [$start_date])
        ->selectRaw('
            mt.name AS movement_type,
            COUNT(em.id) AS movement_count
        ')
        ->groupBy('mt.name')
        ->get();

    $labels = [];
    $values = [];
    $colors = [];

    // Define some colors for the pie chart segments
    $base_colors = ['#ff9999', '#66b3ff', '#99ff99', '#ffcc99', '#c2c2f0'];

    // Populate labels, values, and colors
    foreach ($movements as $index => $movement) {
        $labels[] = $movement->movement_type; // Movement type (e.g., Promotion, Demotion)
        $values[] = $movement->movement_count; // Count of movements for that type
        $colors[] = $base_colors[$index % count($base_colors)]; // Cycle through colors
    }

    // Return the data for the pie chart
    return (object)[
        'title' => 'Employee Movements in the Last 3 Months',
        'labels' => $labels,
        'values' => $values,
        'colors' => $colors
    ];
}

  

    

    function countEmployees($arr, $ss)
    {
        $d = (object) $arr;

        $d_activeCount = DB::table('departments')->where('inactive', 0)->count();
        $d_inactiveCount = DB::table('departments')->where('inactive', 1)->count();

        $p_activeCount = DB::table('positions')->where('inactive', 0)->count();
        $p_inactiveCount = DB::table('positions')->where('inactive', 1)->count();

        $total_payroll = DB::table('accounts as a')
            ->where('a.id', '<>', 1) // Exclude rows where id = 1
            ->selectRaw('SUM(a.balance) as total_payroll')
            ->first();


        $total_wallet =  DB::table('wallet_accounts as w')
            ->selectRaw(' SUM(w.balance) as total_wallet')
            ->first();

        $start_date = $d->start_date ?? null;
        $end_date = $d->end_date ?? null;

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

        $dates = [
            'cm' => date('Y-m'),
            'l1m' => date('Y-m', strtotime('-1 month')),
            'l2m' => date('Y-m', strtotime('-2 months')),
            'l3m' => date('Y-m', strtotime('-3 months')),
        ];

        $formattedDates = array_map(function ($date) {
            return date('M Y', strtotime($date));
        }, $dates);

        $monthlyCounts = [];

        foreach ($dates as $key => $month) {
            $joiningCount = DB::table('employees as e')
            ->whereRaw("DATE_FORMAT(e.joining_date, '%Y-%m') = ?", [$month])
            ->whereIn('e.status_id', [10, 20])
            ->count();

            $afterRisign = DB::table('resignations as r')
                ->join('employees as e', 'r.emp_id', '=', 'e.id')
                ->whereRaw("DATE_FORMAT(r.effective_date, '%Y-%m') < ?", [$month])
                ->where('e.status_id', 20)
                ->count();

            $monthlyCount =  $joiningCount - $afterRisign ;
            $monthlyCounts["count_$key"] = $monthlyCount;
        }

        $total_l3m = $monthlyCounts['count_l3m'] ?? 0;
        $total_l2m = $total_l3m + ($monthlyCounts['count_l2m'] ?? 0);
        $total_l1m = $total_l2m + ($monthlyCounts['count_l1m'] ?? 0);
        $total_cm = $total_l1m + ($monthlyCounts['count_cm'] ?? 0);

        return [
            'd_activeCount' => $d_activeCount,
            'd_inactiveCount' => $d_inactiveCount,
            'p_activeCount' => $p_activeCount,
            'p_inactiveCount' => $p_inactiveCount,
            'total_payroll' => $total_payroll->total_payroll,
            'total_wallet' => $total_wallet->total_wallet,
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
            'monthly_totals' => [
                'count_l3m' => $monthlyCounts['count_l3m'] ?? 0,
                'total_l3m' => $total_l3m,
                'count_l2m' => $monthlyCounts['count_l2m'] ?? 0,
                'total_l2m' => $total_l2m,
                'count_l1m' => $monthlyCounts['count_l1m'] ?? 0,
                'total_l1m' => $total_l1m,
                'count_cm' => $monthlyCounts['count_cm'] ?? 0,
                'total_cm' => $total_cm,
            ],
            'dates' => [
                'l3m' => $formattedDates['l3m'],
                'l2m' => $formattedDates['l2m'],
                'l1m' => $formattedDates['l1m'],
                'cm' => $formattedDates['cm'],
            ]
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

        $today = date('Y-m-d');
        if ($start_date && $end_date) {
            $end_date = convertDate($end_date);
            $start_date = convertDate($start_date);

            if (strtotime($start_date) && strtotime($end_date)) {
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
            ->whereRaw($str_dates)
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

        return $rows;
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

        $result = [
            'total_amount' => $query->total_amount,
            'total_bonuses' => $query->total_bonuses,
            'total_seniority' => $query->total_seniority,
            'total_life_insurance' => $query->total_life_insurance,
            'total_other' => $query->total_other,
            'lud_bonuses' => $query->lud_bonuses,
            'lud_seniority' => $query->lud_seniority,
            'lud_life_insurance' => $query->lud_life_insurance,
            'lud_other' => $query->lud_other,
        ];

        return $result;
    }

}

