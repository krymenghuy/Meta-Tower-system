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
            'barCharts'=>self::getEmployeeDataForBarChart($ss),
            'pieCharts'=>self::getTotalStaffComparison($ss),
            'onLeave'=>self::getOnLevels($arr,$ss),
            'benefits'=>self::getBenefits($arr,$ss),
            'warning'=>self::getStaffInWarningCounts($arr,$ss),
            'accounts'=>self::getTotalWalletAndPayrollData($arr,$ss)

        ];
    }

    
    
    static function getStaffInWarningCounts($arr, $ss) {
        $d = (object) $arr;
        $back_days = isset($d->back_days) ? $d->back_days : -90;
        $from_date = convertDate(Carbon::now()->addDays($back_days));
        $dateField = DBX::convertToDate('ew.warning_date');
        $moreWhere = $dateField . " >= '" . $from_date . "'";
    
        $rows = DB::table('emp_warnings AS ew')
            ->leftJoin('employees AS e', 'ew.emp_id', '=', 'e.id')
            ->whereRaw($moreWhere)
            ->select('ew.warning_type', DB::raw('COUNT(ew.emp_id) as total_warnings'))
            ->groupBy('ew.warning_type')
            ->orderByRaw("MIN(ew.warning_date) ASC")
            ->get();
    
        $warning_staff_count = DB::table('emp_warnings AS ew')
            ->whereRaw($moreWhere)
            ->distinct('ew.emp_id')
            ->count('ew.emp_id');
       
        return (object) [
            'warning_counts' => $rows,
            'warning_staff_count' => (object) [
                'count' => $warning_staff_count,
                'title' => 'Warning Staff',
                'subTitle' => 'Last ' . abs($back_days) . ' days'
            ]
        ];
    }
 
    
  
    static function getCards($arr, $ss) {
        $d = (object) $arr;
        $back_days = isset($d->back_days) ? $d->back_days : -90;
        $from_date = convertDate(Carbon::now()->addDays($back_days));
        $dateField = DBX::convertToDate('e.joining_date');
        $moreWhere = $dateField . " >= '" . $from_date . "'";
    
        $rows = DB::table('employees AS e')
            ->join('resignations AS r', 'e.id', '=', 'r.emp_id')  
            ->whereRaw($moreWhere)
            ->select('e.status_id', 'e.emp_type_id', 'e.branch_id', 'e.joining_date', 'r.resign_date', 'r.effective_date')
            ->orderByRaw("e.joining_date ASC")
            ->get();
    
        $new_staff_count = 0;
        $resigned_staff_count = 0;
        $resigning_staff_count = 0;  
        $probation_staff_count = 0;
    
        foreach ($rows as $row) {
            // New staff
            if ($row->status_id == 10) {
                $new_staff_count++;
            }
            // Resigned staff (check if the resign_date is less than or equal to today)
            elseif ($row->status_id == 20 && $row->resign_date <= Carbon::now()) {
                $resigned_staff_count++;
            }
            // Resigning staff (check if the resign_date is in the future)
            elseif ($row->status_id == 20 && $row->resign_date > Carbon::now()) {
                $resigning_staff_count++;
            }
            // Probation staff
            if ($row->emp_type_id == 2) {
                $probation_staff_count++;
            }
        }
    
        return (object) [
            'new_staff_count' => (object) [
                'count' => $new_staff_count,
                'title' => 'New Staff',
                'subTitle' => 'Last ' . abs($back_days) . ' days'
            ],
            'resigned_staff_count' => (object) [
                'count' => $resigned_staff_count,
                'title' => 'Resigned',
                'subTitle' => 'Last ' . abs($back_days) . ' days'
            ],
            'resigning_staff_count' => (object) [
                'count' => $resigning_staff_count,
                'title' => 'Resigning',
                'subTitle' => 'Last ' . abs($back_days) . ' days'
            ],
            'probation_staff_count' => (object) [
                'count' => $probation_staff_count,
                'title' => 'Probation',
                'subTitle' => 'Last ' . abs($back_days) . ' days'
            ],
        ];
    }
    static function countEmployeeByType($arr, $ss){
        $branch_id = $ss->branch_id;
        $back_days = -90;
        $start_date = convertDate(Carbon::now()->addDays($back_days));
        $rows = DB::table('employees AS e')
            ->join('emp_types AS t', 'e.emp_type_id', '=', 't.id')
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
        $ss = $ss ?? auth()->user();
        $currentDate = Carbon::now();
        $startDates = [
            $currentDate->copy()->startOfMonth()->subMonths(2),
            $currentDate->copy()->startOfMonth()->subMonths(1),
            $currentDate->copy()->startOfMonth(),
        ];
    
        $staffCounts = [];
    
        foreach ($startDates as $startDate) {
            $endDate = $startDate->copy()->endOfMonth();
    
            $count = DB::table('employees')
                ->whereRaw("DATE(joining_date) BETWEEN ? AND ?", [$startDate, $endDate])
                ->count();
    
            $staffCounts[] = (object)[
                'month' => $startDate->format('F Y'),
                'count' => $count
            ];
        }
    
        return (object)[
            'title' => 'Total Staff (Last 3 Months)',
            'labels' => array_column($staffCounts, 'month'),
            'values' => array_column($staffCounts, 'count'),
            'colors' => ['#1E90FF', '#32CD32', '#FF4500'] 
        ];
    }
    function getBenefits($arr, $ss)
    {
    $d = (object) $arr;
    $current_year = $d->year ?? date('Y');

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
        ->whereYear('b.update_date', '=', $current_year)
        ->first();

    $result = (object) [
        'total_amount' => $query->total_amount ?? 0,
        'total_bonuses' => $query->total_bonuses ?? 0,
        'total_seniority' => $query->total_seniority ?? 0,
        'total_life_insurance' => $query->total_life_insurance ?? 0,
        'total_other' => $query->total_other ?? 0,
        'lud_bonuses' => $query->lud_bonuses ?? null,
        'lud_seniority' => $query->lud_seniority ?? null,
        'lud_life_insurance' => $query->lud_life_insurance ?? null,
        'lud_other' => $query->lud_other ?? null,
    ];

    return $result;
    }
    public static function getEmployeeDataForBarChart($ss)
    {
        $start_date = Carbon::now()->subMonths(6)->startOfMonth()->format('Y-m-d');
        $end_date = Carbon::now()->endOfMonth()->format('Y-m-d');
    
        $data = DB::table('employees AS e')
            ->selectRaw('
                DATE_FORMAT(e.joining_date, "%Y-%m") AS month,
                COUNT(e.id) AS employee_count,
                SUM(e.salary) AS total_salary
            ')
            ->whereBetween('e.joining_date', [$start_date, $end_date])
            ->groupBy('month')
            ->orderBy('month')
            ->get();
    
        $labels = [];
        $employee_counts = [];
        $total_salaries = [];
    
        foreach ($data as $item) {
            // Convert "2024-01" to "Jan 2024"
            $month_name = Carbon::createFromFormat('Y-m', $item->month)->format('M Y');
            $labels[] = $month_name;
            $employee_counts[] = $item->employee_count;
            $total_salaries[] = $item->total_salary;
        }
        
    
        // Return the data for the bar chart
        return (object)[
            'title' => 'Employee Count and Total Salary Paid in the Last 6 Months',
            'labels' => $labels,
            'employee_counts' => $employee_counts,
            'total_salaries' => $total_salaries
        ];
    }
    function getOnLevels($arr, $ss)
    {
        $subs_id = $ss->subs_id ?? null;
        $d = (object) $arr;
    
        $today = date('Y-m-d');
        $start_date = date('Y-m-d', strtotime('-9 days'));
        $str_dates = "'$today' BETWEEN l.start_date AND l.end_date";
        $col_dates = DBX::formatDate('l.start_date', 'start_date') . ',' . DBX::formatDate('l.end_date', 'end_date');
        $leave_days_calc = "DATEDIFF(l.end_date, l.start_date) + 1 AS leave_days";
    
        $query = DB::table('leaves as l')
            ->join('employees as emp', 'emp.id', '=', 'l.emp_id')
            ->whereRaw("l.start_date >= ? AND l.start_date <= ?", [$start_date, $today])
            ->selectRaw(
                "DATE(l.start_date) AS leave_date, COUNT(DISTINCT emp.id) AS staff_count"
            )
            ->groupByRaw('DATE(l.start_date)')
            ->orderBy('leave_date', 'DESC');
    
        $rows = $query->get();
    
        foreach ($rows as $row) {
            $row->formatted_date = date('d-M-Y', strtotime($row->leave_date));
        }
    
        return $rows;
    }
    public static function getTotalWalletAndPayrollData($arr, $ss) {
        $d = (object) $arr;
        $totalWalletsQuery = DB::table('accounts')
            ->Join('employees AS e', 'accounts.emp_id', '=', 'e.id'); 
        $totalWallets = $totalWalletsQuery->count();
    
        $totalWalletBalance = $totalWalletsQuery->sum('accounts.balance');
    
        $totalPayrollsQuery = DB::table('accounts')
            ->Join('employees AS e', 'accounts.emp_id', '=', 'e.id');
    
        $totalPayrolls = $totalPayrollsQuery->count();
    
        $totalPayrollBalance = $totalPayrollsQuery->sum('accounts.balance');
    
        return (object) [
            'wallets' => (object) [
                'total_count' => $totalWallets,
                'total_balance' => $totalWalletBalance,
                'currency' => 'KHR'
            ],
            'payrolls' => (object) [
                'total_count' => $totalPayrolls,
                'total_balance' => $totalPayrollBalance,
                'currency' => 'KHR'

            ]
        ];
    }

}

