<?php

namespace App\Models\Prm;

use Carbon\Carbon;
use Vsd\Database\DBX;
use DB;
use Vsd\Vsloquent\VSModel;
use XBranch;
class Dashboard extends VSModel
{
    function __construct($id = null, $userInfo = null){
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public static function summarizeDashboardCards($building_id, $ss)
    {
        $subs_id = $ss->subs_id;
        $bin_subs_id = hex2bin($subs_id);
        \Log::info($building_id);
        $building_id = (int)($building_id ?? 1);
        
        $result = new \stdClass();
        $today = Carbon::today();
        $currentMonth = $today->month;
        $currentYear = $today->year;
        $totalSpaces = DB::table('building_spaces')
            ->where('building_id', $building_id)
            ->count();

        $occupiedSpaces = DB::table('building_spaces')
            ->where('building_id', $building_id)
            ->where('status_id', 3)
            ->count();

        $vacantSpaces = max($totalSpaces - $occupiedSpaces, 0);
        $avgLeaseMonths = DB::table('contracts')
            // ->where('building_id', $building_id)
            ->whereNotNull('start_date')
            ->whereNotNull('end_date')
            ->selectRaw('AVG(TIMESTAMPDIFF(MONTH, start_date, end_date)) as avg_months')
            ->value('avg_months');

        $avgLeaseMonths = $avgLeaseMonths ? round($avgLeaseMonths) : 0;
        $avgLeaseTerm = $avgLeaseMonths . ' months';
       

        $activeTenants = DB::table('tenants')
            ->where('status_id', 2)
            ->count();

        $newTenants = DB::table('tenants')
            ->whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->count();

        $occupancyRate = $totalSpaces > 0
            ? round(($occupiedSpaces / $totalSpaces) * 100)
            : 0;

        /* =========================
        REVENUE DATA
        ========================== */

        $monthlyRevenue = DB::table('invoices')
            ->whereMonth('issue_date', $currentMonth)
            ->whereYear('issue_date', $currentYear)
            ->sum('amount');

        $outstandingAmount = DB::table('invoices')
            ->where('payment_status_id', 0)
            ->sum('due_amount');

        $overdueInvoices = DB::table('invoices')
            ->where('payment_status_id', 4)
            ->whereDate('due_date', '<', $today)
            ->count();

        $previousRevenue = DB::table('invoices')
            ->whereMonth('issue_date', $today->copy()->subMonth()->month)
            ->whereYear('issue_date', $today->copy()->subMonth()->year)
            ->sum('amount');

        $revenueGrowth = $previousRevenue > 0
            ? round((($monthlyRevenue - $previousRevenue) / $previousRevenue) * 100, 1)
            : 0;

        $collectionRate = ($monthlyRevenue + $outstandingAmount) > 0
            ? round(($monthlyRevenue / ($monthlyRevenue + $outstandingAmount)) * 100)
            : 0;

        /* =========================
        PERIOD
        ========================== */

        $result->period = $today->format('F Y');

        /* =========================
        SUMMARY (TOP CARDS)
        ========================== */

        $result->summary = (object)[
            'occupancy_rate' => $occupancyRate,
            'occupied_spaces' => $occupiedSpaces,
            'total_spaces' => $totalSpaces,
            'active_tenants' => $activeTenants,
            'new_tenants' => $newTenants,
            'monthly_revenue' => round($monthlyRevenue, 2),
            'revenue_growth' => $revenueGrowth,
            'outstanding_amount' => round($outstandingAmount, 2),
            'overdue_invoices' => $overdueInvoices,
            'collection_rate' => $collectionRate
        ];

        /* =========================
        MINI STATS
        ========================== */

        $result->mini_stats = [
            (object)[
                'label' => 'Average Lease Term',
                'value' => $avgLeaseTerm
            ],
            (object)[
                'label' => 'Revenue / Tenant',
                'value' => '$' . ($activeTenants > 0 ? round($monthlyRevenue / $activeTenants, 2) : 0)
            ],
            (object)[
                'label' => 'Available Units',
                'value' => $vacantSpaces
            ],
            (object)[
                'label' => 'Overdue Invoices',
                'value' => $overdueInvoices
            ]
        ];

        /* =========================
        KPI CARDS
        ========================== */

        $result->kpis = [

    (object)[
        'key' => 'occupancy',
        'title' => 'Occupancy Rate',
        'value' => $occupancyRate . '%',
        'note' => "$occupiedSpaces / $totalSpaces spaces occupied",
        'trend' => '↑ +2% this month',
        'icon' => '🏢',
        'color' => '#4F46E5',          // violet
        'soft'  => 'rgba(79,70,229,.11)'
    ],

    (object)[
        'key' => 'tenants',
        'title' => 'Active Tenants',
        'value' => $activeTenants,
        'note' => 'Registered companies',
        'trend' => "+$newTenants new tenants",
        'icon' => '👥',
        'color' => '#10B981',          // green
        'soft'  => 'rgba(16,185,129,.12)'
    ],

    (object)[
        'key' => 'revenue',
        'title' => 'Monthly Revenue',
        'value' => '$' . number_format($monthlyRevenue, 2),
        'note' => 'Rent + utilities + service fees',
        'trend' => "↑ {$revenueGrowth}% vs last month",
        'icon' => '💳',
        'color' => '#0EA5E9',          // blue
        'soft'  => 'rgba(14,165,233,.12)'
    ],

    (object)[
        'key' => 'receivables',
        'title' => 'Outstanding',
        'value' => '$' . number_format($outstandingAmount, 2),
        'note' => "$overdueInvoices overdue invoices",
        'trend' => 'Requires follow-up',
        'icon' => '⚠',
        'color' => '#EF4444',          // red
        'soft'  => 'rgba(239,68,68,.12)'
    ]
];
            return $result;
        }
    public static function getCharts($building_id, $ss){
    $result = new \stdClass();

    $result->occupancy_by_floor = DB::table('building_spaces')
        ->selectRaw("
            CONCAT('Floor ', floor_id) as floor,
            COUNT(*) as total,
            ROUND(SUM(CASE WHEN status_id = 3 THEN 1 ELSE 0 END) / COUNT(*) * 100, 1) as occupied,
            ROUND(SUM(CASE WHEN status_id = 2 THEN 1 ELSE 0 END) / COUNT(*) * 100, 1) as booked,
            ROUND(SUM(CASE WHEN status_id = 1 THEN 1 ELSE 0 END) / COUNT(*) * 100, 1) as available
        ")
        ->where('building_id', $building_id)
        ->groupBy('floor_id')
        ->orderBy('floor_id')
        ->get();

    $result->revenue_trend = (object)[
        'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        'rent' => [68000, 70000, 73500, 76000, 82000, 86520],
        'electricity' => [9000, 10000, 11000, 10500, 11500, 12000],
        'service_fee' => [5000, 5300, 5600, 5900, 6200, 6500]
    ];

    $result->invoice_status = (object)[
        'labels' => ['Paid', 'Pending', 'Overdue'],
        'values' => [70, 20, 10]
    ];

    $result->revenue_breakdown = (object)[
        'labels' => ['Rent', 'Electricity', 'Service Fee'],
        'values' => [72, 18, 10]
    ];

    $result->collection_kpis = [
        (object)[
            'title' => 'Rent Collection',
            'value' => 96,
            'color' => '#4F46E5',
        'soft' => '#818CF8'
        ],
        (object)[
            'title' => 'Electricity Collection',
            'value' => 94
        ],
        (object)[
            'title' => 'Service Fee Collection',
            'value' => 92
        ],
        (object)[
            'title' => 'Occupancy Rate',
            'value' => 91
        ],
        (object)[
            'title' => 'Lease Renewal',
            'value' => 88
        ]
    ];

    return $result;
}
public static function getActivities($building_id, $ss)
{
    $result = new \stdClass();

    $result->insights = [
        (object)[
            'level' => 'success',
            'title' => 'Occupancy remains above 90%',
            'note' => 'Meta Tower continues to perform above target.'
        ],
        (object)[
            'level' => 'success',
            'title' => 'Revenue increased 8.4%',
            'note' => 'Growth is mainly driven by rental and electricity billing.'
        ],
        (object)[
            'level' => 'warning',
            'title' => '4 lease agreements expire within 30 days',
            'note' => 'Renewal follow-up should be prioritized.'
        ],
        (object)[
            'level' => 'danger',
            'title' => '18 invoices remain overdue',
            'note' => 'Collection team should review high-risk accounts.'
        ]
    ];

    $result->alerts = [
        (object)[
            'level' => 'danger',
            'title' => '18 overdue invoices',
            'note' => 'Requires collection follow-up.'
        ],
        (object)[
            'level' => 'warning',
            'title' => '3 utility readings pending',
            'note' => 'Electricity billing is not fully completed.'
        ],
        (object)[
            'level' => 'success',
            'title' => '12 payments received today',
            'note' => 'Cash collection has been updated.'
        ]
    ];

    $result->activities = [
        (object)[
            'text' => 'ABC Consulting paid invoice INV-24081',
            'time' => '10:45 AM'
        ],
        (object)[
            'text' => 'XYZ Ltd renewed lease contract',
            'time' => '09:30 AM'
        ],
        (object)[
            'text' => 'June electricity bills generated',
            'time' => 'Yesterday'
        ],
        (object)[
            'text' => 'New tenant moved into Floor 6',
            'time' => 'Yesterday'
        ]
    ];

    return $result;
}
public static function getLeaseExpiry($building_id, $ss)
{
    $result = new \stdClass();

    $result->lease_expiry = [
        (object)[
            'tenant' => 'ABC Consulting',
            'floor' => '5',
            'expiry' => '15 Jul',
            'status' => 'Due Soon',
            'level' => 'warning'
        ],
        (object)[
            'tenant' => 'XYZ Ltd',
            'floor' => '7',
            'expiry' => '20 Jul',
            'status' => 'Pending',
            'level' => 'info'
        ],
        (object)[
            'tenant' => 'Meta Lab',
            'floor' => '2',
            'expiry' => '28 Jul',
            'status' => 'Review',
            'level' => 'success'
        ]
    ];

    return $result;
}

 static function getFilterOptions($arr,$ss)
    {

        $d = (object)$arr;
        $building_id = $d->building_id ?? null;
        return (object) [
            'buildings' => GeneralSettings::options_building($ss),
        ];
    }

}
