<?php

namespace App\Models\Mhr;

use Illuminate\Support\Facades\DB;
use DBX;
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
        $cards = self::getDashboardCards($arr,$ss);
        return (object)[
            'doughnutChart'=>self::countEmployee(0,$ss),
            'cards'=>$cards,
            'barCharts'=>self::getEmployeeDataForBarChart($ss),
            'pieCharts'=>self::getTotalStaffComparison($ss),
            'onLeave'=>self::getOnLevels($arr,$ss),
            'benefits'=>self::getBenefits($arr,$ss),
            'accounts'=>self::getTotalWalletAndPayrollData($arr,$ss)

        ];
    }

    public static function getDashboardCards($arr, $ss) {
        $d = (object) $arr;
        $back_days = isset($d->back_days) ? $d->back_days : -90;
        $from_date = convertDate(Carbon::now()->addDays($back_days));
        $to_date = convertDate(Carbon::now());
        $dateCheck = [$from_date, $to_date];
        $moreWheres = "emp.joining_date >= '$from_date' AND emp.joining_date <= '$to_date'"; //"emp.joining_date >= '2024-09-19' AND emp.joining_date <= '2024-12-18'"

        $employee_rows = DB::table('employees AS emp')
            ->whereRaw($moreWheres)
            ->select('emp.id', 'emp.status_id', 'emp.emp_type_id', 'emp.joining_date')
            ->orderBy('emp.joining_date', 'ASC')
            ->get();

        $new_staff_count = 0;
        $new_probation_count = 0;
        $new_intern_count = 0;
        $terminated_staff_count = 0;

        foreach ($employee_rows as $emp) {
            if ($emp->status_id == 10) {
                switch ($emp->emp_type_id) {
                    case 1:
                        $new_intern_count++;
                        break;
                    case 2:
                        $new_probation_count++;
                        break;
                    case 3:
                        $new_staff_count++;
                        break;
                }
            } elseif ($emp->status_id == 30) {
                $terminated_staff_count++;
            }
        }



        $staff_counts = DB::table('employees as emp')
        ->join('resignations as res', 'emp.id', '=', 'res.emp_id')
        ->where('emp.status_id', 20)
        ->selectRaw("
            SUM(CASE WHEN res.effective_date >= '$from_date' AND res.effective_date <= '$to_date' THEN 1 ELSE 0 END) as resigned_count,
            SUM(CASE WHEN res.effective_date >= '$from_date' AND res.effective_date > '$to_date' THEN 1 ELSE 0 END) as resigning_count")
        ->first();

        $resigned_staff_count = $staff_counts->resigned_count;
        $resigning_staff_count = $staff_counts->resigning_count;


        $warning_rows = DB::table('emp_warnings AS ew')
            ->join('employees AS emp', 'ew.emp_id', '=', 'emp.id')
            ->whereBetween('ew.warning_date', [$from_date, $to_date])
            ->select('ew.warning_type', DB::raw('COUNT(ew.emp_id) as total_warnings'))
            ->groupBy('ew.warning_type')
            ->orderByRaw("MIN(ew.warning_date) ASC")
            ->get();

        $warning_staff_count = DB::table('emp_warnings AS ew')

            ->distinct('ew.id')
            ->count('ew.id');
        // $exit_form_count = DB::table('exit_forms as ef')
        // ->join('employees as emp', 'ef.emp_id', '=', 'emp.id')
        // ->where('emp.status_id', 20)
        // ->count();


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
                'count' => $new_probation_count,
                'title' => 'Probations',
                'subTitle' => 'Last ' . abs($back_days) . ' days'
            ],
            'intern_staff_count' => (object) [
                'count' => $new_intern_count,
                'title' => 'Interns',
                'subTitle' => 'Last ' . abs($back_days) . ' days'
            ],
            'warning_counts' => $warning_rows,
            'warning_staff_count' => (object) [
                'count' => $warning_staff_count,
                'title' => 'Warnings',
                'subTitle' => 'Last ' . abs($back_days) . ' days'
            ],
            'exit_form_count' => (object) [
                'count' => 1,//$exit_form_count,
            ]
        ];
    }




static function countEmployee($arr, $ss)
{
    //$branch_id = $ss->branch_id;
    $back_days = -90;
    //$start_date = convertDate(Carbon::now()->addDays($back_days));

    $rows = DB::table('employees AS emp')
        ->join('emp_types AS t', 'emp.emp_type_id', '=', 't.id') // Join with emp_types table
        // ->where('emp.branch_id', $branch_id) // Filter by branch
        // ->whereRaw("DATE(emp.joining_date) >= ?", [$start_date])
        ->selectRaw("t.name AS category, COUNT(emp.id) AS count") // Group by employment type
        ->groupBy('t.name')
        ->get();

    $labels = [];
    $values = [];
    $colors = [];
    $base_colors = ['#2b3991', '#cab54a', '#32BCD3', '#cab54a', '#ECF140'];

    $total = 0;
    $staff_total = 0;
    $intern_total = 0;
    $probation_total = 0;

    foreach ($rows as $index => $row) {
        $labels[] = $row->category;
        $values[] = $row->count;
        $colors[] = $base_colors[$index % count($base_colors)];

        // Categorize counts
        switch (strtolower($row->category)) {
            case 'staff':
                $staff_total += $row->count;
                break;
            case 'intern':
                $intern_total += $row->count;
                break;
            case 'probation':
                $probation_total += $row->count;
                break;
        }

        $total += $row->count;
    }

    return (object)[
        'title' => 'Total Staff : ' . $total . '',
        'total' => $total,
        'staff_total' => $staff_total,
        'intern_total' => $intern_total,
        'probation_total' => $probation_total,
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
    public static function getBenefits($arr, $ss)
    {

        $data = DB::table('emp_benefits as eb')
            ->join('benefits as b', 'eb.benefit_id', '=', 'b.id')
            ->selectRaw('
                b.name AS benefit_name,
                eb.update_user AS updated_by,
                b.type_id AS benefit_type,
                SUM(eb.amount) AS total_amount
            ')
            ->groupBy('b.name', 'b.type_id', 'eb.update_user')
            ->orderBy('b.name')
            ->get();

        return $data;
    }

    public static function getEmployeeDataForBarChart($ss)
    {
        $data = DB::table('payrolls as p')
            ->selectRaw('
                p.month,
                p.year,
                SUM(p.total) as total_salary,
                MAX(p.head_count) as max_head_count
            ')
            ->groupBy('p.month', 'p.year')
            ->orderByRaw('p.year ASC, p.month ASC')
            ->limit(12)
            ->get();

        $labels = [];
        $employee_counts = [];
        $total_salaries = [];

        foreach ($data as $item) {
            // Convert "2024-01" to "Jan 2024"
            $month_name = Carbon::createFromFormat('Y-m', $item->year . '-' . $item->month)->format('M Y');
            $labels[] = $month_name;
            $employee_counts[] = $item->max_head_count;
            $total_salaries[] = $item->total_salary;
        }

        return (object)[
            'title' => 'Employee Count and Total Salary Paid in the Last 12 Months',
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
    public static function getTotalWalletAndPayrollData($arr, $ss)
    {
        $d = (object) $arr;

        $totalWallets = DB::table('accounts')
            ->where('account_type', 'wallet')
            ->count();

        $totalWalletBalance = DB::table('accounts')
            ->where('account_type', 'wallet')
            ->sum('balance');

        $totalPayrolls = DB::table('accounts')
            ->where('account_type', 'payroll')
            ->count();

        $totalPayrollBalance = DB::table('accounts')
            ->where('account_type', 'payroll')
            ->sum('balance');

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
