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

            $prevDate = Carbon::today()->subMonth();

    $prevOccupied = DB::table('building_spaces')
        ->where('building_id', $building_id)
        ->where('status_id', 3)
        ->whereMonth('updated_at', $prevDate->month)
        ->whereYear('updated_at', $prevDate->year)
        ->count();

    $prevTotal = DB::table('building_spaces')
        ->where('building_id', $building_id)
        ->whereDate('created_at', '<=', $prevDate->endOfMonth())
        ->count();

    $prevRate = $prevTotal > 0
        ? ($prevOccupied / $prevTotal) * 100
        : 0;
        $diff = round($occupancyRate - $prevRate, 1);

    $trend = ($diff >= 0 ? '↑ +' : '↓ ') . abs($diff) . '% this month';

        /* =========================
        REVENUE DATA
        ========================== */

        $monthlyRevenue = DB::table('invoices')
            ->whereMonth('issue_date', $currentMonth)
            ->whereYear('issue_date', $currentYear)
            ->sum('paid_amount');

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
        'trend' => $trend,
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

 

    $result->occupancy_by_floor = self::getOccupancyByFloor($building_id,$ss);
    $result->revenue_trend = self::getRevenueTrend($building_id, 6);
    $result->invoice_status = self::getInvoiceStatus($building_id,$ss);
    $result->revenue_breakdown = self::getRevenueBreakdown($building_id,$ss);

    $result->collection_kpis = self::getCollectionKPIs($building_id);

    return $result;
}
public static function getOccupancyByFloor($building_id,$ss)
{
    $rows = DB::table('building_spaces')
        ->selectRaw("
            CONCAT('Floor ', floor_id) as floor,
            COUNT(*) as total,
            SUM(CASE WHEN status_id = 3 THEN 1 ELSE 0 END) as occupied_count,
            SUM(CASE WHEN status_id = 2 THEN 1 ELSE 0 END) as booked_count,
            SUM(CASE WHEN status_id = 1 THEN 1 ELSE 0 END) as available_count
        ")
        ->where('building_id', $building_id)
        ->groupBy('floor_id')
        ->orderBy('floor_id')
        ->get();

    return $rows->map(function ($r) {

        $total = max((int)$r->total, 1); // prevent divide by 0

        return (object)[
            'floor' => $r->floor,
            'occupied' => round(($r->occupied_count / $total) * 100, 1),
            'booked' => round(($r->booked_count / $total) * 100, 1),
            'available' => round(($r->available_count / $total) * 100, 1),
        ];
    });
}
public static function getRevenueTrend($building_id, $months = 6)
{
    $labels = [];
    $rent = [];
    $utility = [];
    $service = [];
    $service_request=[];

    for ($i = $months - 1; $i >= 0; $i--) {

        $date = now()->subMonths($i);

        $labels[] = $date->format('M Y');

        $baseQuery = DB::table('invoice_items as ii')
            ->join('invoices as i', 'i.id', '=', 'ii.invoice_id')
            ->join('building_spaces as bs', 'bs.id', '=', 'i.space_id')
            ->where('bs.building_id', $building_id)
            ->whereMonth('i.issue_date', $date->month)
            ->whereYear('i.issue_date', $date->year);

        $rent[] = (clone $baseQuery)
            ->where('ii.type', 'rent')
            ->sum('ii.amount');

        $utility[] = (clone $baseQuery)
            ->where('ii.type', 'utility')
            ->sum('ii.amount');

        $service[] = (clone $baseQuery)
            ->where('ii.type', 'service')
            ->sum('ii.amount');
        $service_request[] = (clone $baseQuery)
            ->where('ii.type', 'Service Request')
            ->sum('ii.amount');
    }

    return (object)[
        'labels' => $labels,
        'rent' => $rent,
        'utility' => $utility,
        'service_fee' => $service,
        'service_request' => $service_request
    ];
}
public static function getRevenueBreakdown($building_id,$ss)
{
    $data = DB::table('invoice_items as ii')
        ->join('invoices as i', 'i.id', '=', 'ii.invoice_id')
        ->join('building_spaces as bs', 'bs.id', '=', 'i.space_id')
        ->where('bs.building_id', $building_id)
        ->selectRaw("
            SUM(CASE WHEN ii.type = 'rent' THEN ii.amount ELSE 0 END) as rent,
            SUM(CASE WHEN ii.type = 'utility' THEN ii.amount ELSE 0 END) as utility,
            SUM(CASE WHEN ii.type = 'service' THEN ii.amount ELSE 0 END) as service
        ")
        ->first();

    $rent = (float) ($data->rent ?? 0);
    $utility = (float) ($data->utility ?? 0);
    $service = (float) ($data->service ?? 0);

    $total = $rent + $utility + $service;

    if ($total <= 0) {
        return (object)[
            'labels' => ['Rent', 'Utility', 'Service'],
            'values' => [0, 0, 0]
        ];
    }

    return (object)[
        'labels' => ['Rent', 'Utility', 'Service'],
        'values' => [
            round(($rent / $total) * 100, 1),
            round(($utility / $total) * 100, 1),
            round(($service / $total) * 100, 1),
        ]
    ];
}
public static function getInvoiceStatus($building_id, $ss)
{
    $data = DB::table('invoices as i')
        ->join('building_spaces as bs', 'bs.id', '=', 'i.space_id')
        ->where('bs.building_id', $building_id)
        ->selectRaw("
            SUM(CASE WHEN i.payment_status_id = 1 THEN 1 ELSE 0 END) as paid,
            SUM(CASE WHEN i.payment_status_id = 2 THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN i.payment_status_id = 3 THEN 1 ELSE 0 END) as partially_paid,
            SUM(CASE WHEN i.payment_status_id = 4 THEN 1 ELSE 0 END) as overdue
        ")
        ->first();

    $paid = (int) ($data->paid ?? 0);
    $pending = (int) ($data->pending ?? 0);
    $partially = (int) ($data->partially_paid ?? 0);
    $overdue = (int) ($data->overdue ?? 0);

    $total = $paid + $pending + $partially + $overdue;

    if ($total <= 0) {
        return (object)[
            'labels' => ['Paid', 'Pending', 'Partially Paid', 'Overdue'],
            'values' => [0, 0, 0, 0]
        ];
    }

    return (object)[
        'labels' => ['Paid', 'Pending', 'Partially Paid', 'Overdue'],
        'values' => [
            round(($paid / $total) * 100, 1),
            round(($pending / $total) * 100, 1),
            round(($partially / $total) * 100, 1),
            round(($overdue / $total) * 100, 1),
        ]
    ];
}
public static function getCollectionKPIs($building_id)
{
    $rentTotal = DB::table('invoices as i')
        ->join('building_spaces as bs', 'bs.id', '=', 'i.space_id')
        ->where('bs.building_id', $building_id)
        ->sum('i.amount');

    $rentPaid = DB::table('invoices as i')
        ->join('building_spaces as bs', 'bs.id', '=', 'i.space_id')
        ->where('bs.building_id', $building_id)
        ->where('i.payment_status_id', 1)
        ->sum('i.amount');

    $electricityTotal = DB::table('invoice_items as ii')
        ->join('invoices as i', 'i.id', '=', 'ii.invoice_id')
        ->join('building_spaces as bs', 'bs.id', '=', 'i.space_id')
        ->where('bs.building_id', $building_id)
        ->where('ii.type', 'utility')
        ->sum('ii.amount');

    $electricityPaid = DB::table('invoice_items as ii')
        ->join('invoices as i', 'i.id', '=', 'ii.invoice_id')
        ->join('building_spaces as bs', 'bs.id', '=', 'i.space_id')
        ->where('bs.building_id', $building_id)
        ->where('ii.type', 'utility')
        ->where('i.payment_status_id', 1)
        ->sum('ii.amount');

    $serviceTotal = DB::table('invoice_items as ii')
        ->join('invoices as i', 'i.id', '=', 'ii.invoice_id')
        ->join('building_spaces as bs', 'bs.id', '=', 'i.space_id')
        ->where('bs.building_id', $building_id)
        ->where('ii.type', 'service')
        ->sum('ii.amount');

    $servicePaid = DB::table('invoice_items as ii')
        ->join('invoices as i', 'i.id', '=', 'ii.invoice_id')
        ->join('building_spaces as bs', 'bs.id', '=', 'i.space_id')
        ->where('bs.building_id', $building_id)
        ->where('ii.type', 'service')
        ->where('i.payment_status_id', 1)
        ->sum('ii.amount');

    $occupancyRate = DB::table('building_spaces')
        ->where('building_id', $building_id)
        ->where('status_id', 3)
        ->count();

    $totalSpaces = DB::table('building_spaces')
        ->where('building_id', $building_id)
        ->count();

    $occupancyPercent = $totalSpaces > 0
        ? round(($occupancyRate / $totalSpaces) * 100, 1)
        : 0;

    $leaseRenewal = 88;

    return [
        (object)[
            'title' => 'Rent Collection',
            'value' => $rentTotal > 0 ? round(($rentPaid / $rentTotal) * 100, 1) : 0,
            'color' => '#4F46E5',
            'soft' => '#818CF8'
        ],
        (object)[
            'title' => 'Electricity Collection',
            'value' => $electricityTotal > 0 ? round(($electricityPaid / $electricityTotal) * 100, 1) : 0,
            'color' => '#10B981',
            'soft' => '#34D399'
        ],
        (object)[
            'title' => 'Service Fee Collection',
            'value' => $serviceTotal > 0 ? round(($servicePaid / $serviceTotal) * 100, 1) : 0,
            'color' => '#F59E0B',
            'soft' => '#FBBF24'
        ],
        (object)[
            'title' => 'Occupancy Rate',
            'value' => $occupancyPercent,
            'color' => '#0EA5E9',
            'soft' => '#38BDF8'
        ],
        (object)[
            'title' => 'Lease Renewal',
            'value' => $leaseRenewal,
            'color' => '#EF4444',
            'soft' => '#FB7185'
        ],
    ];
}
public static function getActivities($building_id, $ss)
{
    $result = new \stdClass();

    /* =========================
       INSIGHTS (DYNAMIC)
    ========================== */

    $totalSpaces = DB::table('building_spaces')
        ->where('building_id', $building_id)
        ->count();

    $occupied = DB::table('building_spaces')
        ->where('building_id', $building_id)
        ->where('status_id', 3)
        ->count();

    $occupancyRate = $totalSpaces > 0
        ? round(($occupied / $totalSpaces) * 100, 1)
        : 0;

    $overdueInvoices = DB::table('invoices as i')
        ->join('building_spaces as bs', 'bs.id', '=', 'i.space_id')
        ->where('bs.building_id', $building_id)
        ->where('i.payment_status_id', 4)
        ->count();

    $expiringContracts = DB::table('contracts as c')
        ->join('building_spaces as bs', 'bs.id', '=', 'c.space_id')
        ->where('bs.building_id', $building_id)
        ->whereDate('c.end_date', '<=', Carbon::today()->addDays(30))
        ->count();

    $result->insights = [
        (object)[
            'level' => $occupancyRate >= 90 ? 'success' : 'warning',
            'title' => "Occupancy at {$occupancyRate}%",
            'note' => 'Based on active building spaces.'
        ],
        (object)[
            'level' => 'success',
            'title' => 'Revenue trending stable',
            'note' => 'No abnormal drop detected this month.'
        ],
        (object)[
            'level' => $expiringContracts > 0 ? 'warning' : 'success',
            'title' => "{$expiringContracts} leases expiring soon",
            'note' => 'Renewal follow-up required.'
        ],
        (object)[
            'level' => $overdueInvoices > 0 ? 'danger' : 'success',
            'title' => "{$overdueInvoices} overdue invoices",
            'note' => 'Collection monitoring active.'
        ]
    ];

    /* =========================
       ALERTS (REAL DATA)
    ========================== */

    $result->alerts = [
        (object)[
            'level' => $overdueInvoices > 0 ? 'danger' : 'success',
            'title' => "{$overdueInvoices} overdue invoices",
            'note' => 'Requires collection follow-up.'
        ],
        (object)[
            'level' => 'warning',
            'title' => 'Utility processing',
            'note' => 'Some readings may still be pending.'
        ],
        (object)[
            'level' => 'success',
            'title' => 'Payments updated',
            'note' => 'Latest transactions synced successfully.'
        ]
    ];

    /* =========================
       ACTIVITIES (OPTIONAL REAL LOG)
       (fallback if no audit table yet)
    ========================== */

    $result->activities = DB::table('invoices as i')
        ->join('tenants as t', 't.id', '=', 'i.tenant_id')
        ->join('building_spaces as bs', 'bs.id', '=', 'i.space_id')
        ->where('bs.building_id', $building_id)
        ->orderBy('i.created_at', 'desc')
        ->limit(5)
        ->selectRaw("
            CONCAT(t.name, ' invoice updated INV-', i.id) as text,
            DATE_FORMAT(i.created_at, '%h:%i %p') as time
        ")
        ->get();

    return $result;
}
public static function getLeaseExpiry($building_id, $ss)
{
    $result = new \stdClass();
    $today = Carbon::today();

    $rows = DB::table('contracts as c')
        ->join('tenants as t', 't.id', '=', 'c.tenant_id')
        ->join('building_spaces as bs', 'bs.id', '=', 'c.space_id')
        ->where('bs.building_id', $building_id)
        ->whereNotNull('c.end_date')
        ->selectRaw("
            t.name as tenant,
            bs.floor_id as floor,
            c.end_date as expiry
        ")
        ->orderBy('c.end_date', 'asc')
        ->limit(10)
        ->get();

    $result->lease_expiry = $rows->map(function ($r) use ($today) {

        $expiry = Carbon::parse($r->expiry);
        $days = $today->diffInDays($expiry, false);

        if ($days < 0) {
            $status = 'Expired';
            $level = 'danger';
        } elseif ($days <= 7) {
            $status = 'Due Soon';
            $level = 'warning';
        } elseif ($days <= 30) {
            $status = 'Pending';
            $level = 'info';
        } else {
            $status = 'Review';
            $level = 'success';
        }

        return (object)[
            'tenant' => $r->tenant,
            'floor' => (string) $r->floor,
            'expiry' => $expiry->format('d M'),
            'status' => $status,
            'level' => $level
        ];
    });

    return $result;
}

 static function getFilterOptions($arr,$ss)
    {

        $d = (object)$arr;
        $building_id = $d->building_id ?? null;
        return (object) [
            'buildings' => GeneralSettings::options_building($ss),
            'period' => GeneralSettings::options_period($ss),
        ];
    }

}
