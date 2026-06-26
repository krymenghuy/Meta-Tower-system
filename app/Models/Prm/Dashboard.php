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
    private static function parseFilter($arr)
    {
        $d = (object)$arr;

        return (object)[
            'building_id' => (int)($d->building_id ?? 1),
            'month' => (int)($d->month ?? date('m')),
            'year' => (int)($d->year ?? date('Y')),
        ];
    }

    public static function getDataDashboard($arr, $ss = null)
    {
        $f = self::parseFilter($arr);

        return (object)[
            'card_top' => self::summarizeDashboardCardTop($f, $ss),
            'cards' => self::summarizeDashboardCards($f, $ss),
            'activities' => self::getActivities($f, $ss),
            'lease_expiry' => self::getLeaseExpiry($f, $ss),
            'occupancy_by_floor' => self::getOccupancyByFloor($f, $ss),
            'revenue_trend' => self::getRevenueTrend($f, $f->month, $f->year),
            'invoice_status' => self::getInvoiceStatus($f->building_id, $f->month, $f->year),
            'revenue_breakdown' => self::getRevenueBreakdown($f, $ss),
            'collection_kpis' => self::getCollectionKPIs($f->building_id, $f->month, $f->year),
        ];
    }

    public static function summarizeDashboardCardTop($f, $ss)
    {
        $d = (object)$f;

        $building_id = $d->building_id ?? null;
        $month = (int)($d->month ?? date('m'));
        $year  = (int)($d->year ?? date('Y'));

        $periodDate = Carbon::createFromDate($year, $month, 1);
        $totalSpaces = DB::table('building_spaces')
            ->where('building_id', $building_id)
            ->count();
        $occupiedSpaces = DB::table('building_spaces')
            ->where('building_id', $building_id)
            ->where('status_id', 3)
            ->count();
        $avgLeaseMonths = DB::table('contracts')
            ->whereNotNull('start_date')
            ->whereNotNull('end_date')
            ->selectRaw('AVG(TIMESTAMPDIFF(MONTH, start_date, end_date)) as avg_months')
            ->value('avg_months');

        $avgLeaseMonths = $avgLeaseMonths ? round($avgLeaseMonths) : 0;
        $occupancyRate = $totalSpaces > 0
            ? round(($occupiedSpaces / $totalSpaces) * 100)
            : 0;
        $monthlyRevenue = DB::table('invoices as i')
            ->join('building_spaces as bs', 'bs.id', '=', 'i.space_id')
            ->where('bs.building_id', $building_id)
            ->whereMonth('i.issue_date', $month)
            ->whereYear('i.issue_date', $year)
            ->sum('i.paid_amount');
        $outstandingAmount = DB::table('invoices as i')
            ->join('building_spaces as bs', 'bs.id', '=', 'i.space_id')
            ->where('bs.building_id', $building_id)
            ->where('i.payment_status_id', 0)
            ->whereMonth('i.issue_date', $month)
            ->whereYear('i.issue_date', $year)
            ->sum('i.due_amount');
        $collectionRate = ($monthlyRevenue + $outstandingAmount) > 0
            ? round(($monthlyRevenue / ($monthlyRevenue + $outstandingAmount)) * 100)
            : 0;

        return (object)[
            'period' => $periodDate->format('F Y'),
            'occupancy_rate' => $occupancyRate,
            'monthly_revenue' => round($monthlyRevenue, 2),
            'collection_rate' => $collectionRate
        ];
    }
   public static function summarizeDashboardCards($f, $ss)
    {
        $d = (object)$f;

        $building_id = (int)($d->building_id ?? 1);
        $month = (int)($d->month ?? date('m'));
        $year  = (int)($d->year ?? date('Y'));
        $result = new \stdClass();
        $totalSpaces = DB::table('building_spaces')
            ->where('building_id', $building_id)
            ->count();
        $occupiedSpaces = DB::table('building_spaces')
            ->where('building_id', $building_id)
            ->where('status_id', 3)
            ->count();
        $vacantSpaces = max($totalSpaces - $occupiedSpaces, 0);
        $avgLeaseMonths = DB::table('contracts')
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
            ->whereMonth('created_at', $month)
            ->whereYear('created_at', $year)
            ->count();
        $occupancyRate = $totalSpaces > 0
            ? round(($occupiedSpaces / $totalSpaces) * 100)
            : 0;
        $prevDate = Carbon::create($year, $month, 1)->subMonth();
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
        $monthlyRevenue = DB::table('invoices as i')
            ->join('building_spaces as bs', 'bs.id', '=', 'i.space_id')
            ->where('bs.building_id', $building_id)
            ->whereMonth('i.issue_date', $month)
            ->whereYear('i.issue_date', $year)
            ->sum('i.paid_amount');
        $outstandingAmount = DB::table('invoices as i')
            ->join('building_spaces as bs', 'bs.id', '=', 'i.space_id')
            ->where('bs.building_id', $building_id)
            ->where('i.payment_status_id', 0)
            ->whereMonth('i.issue_date', $month)
            ->whereYear('i.issue_date', $year)
            ->sum('i.due_amount');
        $overdueInvoices = DB::table('invoices as i')
            ->join('building_spaces as bs', 'bs.id', '=', 'i.space_id')
            ->where('bs.building_id', $building_id)
            ->where('i.payment_status_id', 4)
            ->whereMonth('i.issue_date', $month)
            ->whereYear('i.issue_date', $year)
            ->count();
        $previousRevenue = DB::table('invoices as i')
            ->join('building_spaces as bs', 'bs.id', '=', 'i.space_id')
            ->where('bs.building_id', $building_id)
            ->whereMonth('i.issue_date', $prevDate->month)
            ->whereYear('i.issue_date', $prevDate->year)
            ->sum('i.paid_amount');
        $revenueGrowth = $previousRevenue > 0
            ? round((($monthlyRevenue - $previousRevenue) / $previousRevenue) * 100, 1)
            : 0;
        $result->summary = (object)[
            'occupied_spaces' => $occupiedSpaces,
            'total_spaces' => $totalSpaces,
            'active_tenants' => $activeTenants,
            'new_tenants' => $newTenants,
            'revenue_growth' => $revenueGrowth,
            'outstanding_amount' => round($outstandingAmount, 2),
            'overdue_invoices' => $overdueInvoices,
        ];
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
        $result->kpis = [
            (object)[
                'key' => 'occupancy',
                'title' => 'Occupancy Rate',
                'value' => $occupancyRate . '%',
                'note' => "$occupiedSpaces / $totalSpaces spaces occupied",
                'trend' => $trend,
                'icon' => '🏢',
                'color' => "violet",
                'soft' => "rgba(79,70,229,.11)"
            ],
            (object)[
                'key' => 'tenants',
                'title' => 'Active Tenants',
                'value' => $activeTenants,
                'note' => 'Registered companies',
                'trend' => "+$newTenants new tenants",
                'icon' => '👥',
                'color' => "accent",
                'soft' => "rgba(16,185,129,.12)"
            ],
            (object)[
                'key' => 'revenue',
                'title' => 'Monthly Revenue',
                'value' => '$' . number_format($monthlyRevenue, 2),
                'note' => 'Rent + utilities + service fees',
                'trend' => "↑ {$revenueGrowth}%",
                'icon' => '💳',
                'color' => "violet",
                'soft' => "rgba(14,165,233,.12)"
            ],
            (object)[
                'key' => 'receivables',
                'title' => 'Outstanding',
                'value' => '$' . number_format($outstandingAmount, 2),
                'note' => "$overdueInvoices overdue invoices",
                'trend' => 'Requires follow-up',
                'icon' => '⚠',
                'color' => "violet",
                'soft' => "rgba(239,68,68,.12)"
            ]
        ];

        return $result;
    }
    public static function getCharts($f, $ss)
    {
        $result = new \stdClass();

        $building_id = $f->building_id;
        $month = $f->month;
        $year  = $f->year;

        $result->occupancy_by_floor = self::getOccupancyByFloor($building_id, $ss);
        $result->revenue_trend = self::getRevenueTrend($f, $month, $year);
        $result->invoice_status = self::getInvoiceStatus($building_id, $month, $year);
        $result->revenue_breakdown = self::getRevenueBreakdown($f, $ss);
        $result->collection_kpis = self::getCollectionKPIs($building_id, $month, $year);
        return $result;
    }
     public static function getOccupancyByFloor($f, $ss)
    {
        $d = (object)$f;

        $building_id = $d->building_id ?? null;

        $rows = DB::table('building_spaces')
            ->selectRaw("
                floor_id,
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

            $total = max((int)$r->total, 1);

            return (object)[
                'floor' => 'Floor ' . $r->floor_id,
                'occupied' => round(((int)$r->occupied_count / $total) * 100, 1),
                'booked' => round(((int)$r->booked_count / $total) * 100, 1),
                'available' => round(((int)$r->available_count / $total) * 100, 1),
            ];
        });
    }
    public static function getRevenueTrend($f, $months = 6,$year=null)
    {
        $building_id = $f->building_id;

        $labels = [];
        $rent = [];
        $utility = [];
        $service = [];

        for ($i = $months - 1; $i >= 0; $i--) {

            $date = now()->subMonths($i);
            $month = $date->month;
            $year = $date->year;

            $labels[] = $date->format('M Y');

            $base = DB::table('invoice_items as ii')
                ->join('invoices as i', 'i.id', '=', 'ii.invoice_id')
                ->join('building_spaces as bs', 'bs.id', '=', 'i.space_id')
                ->where('bs.building_id', $building_id)
                ->whereMonth('i.issue_date', $month)
                ->whereYear('i.issue_date', $year);

            $rent[] = (clone $base)->where('ii.type', 'rent')->sum('ii.amount');
            $utility[] = (clone $base)->where('ii.type', 'utility')->sum('ii.amount');
            $service[] = (clone $base)->where('ii.type', 'service')->sum('ii.amount');
        }

        return (object)[
            'labels' => $labels,
            'rent' => $rent,
            'utility' => $utility,
            'service_fee' => $service
        ];
    }
    public static function getRevenueBreakdown($f, $ss)
    {
        $d = (object)$f;

        $building_id = $d->building_id ?? null;
        $month = $d->month ?? date('m');
        $year  = $d->year ?? date('Y');

        $query = DB::table('invoice_items as ii')
            ->join('invoices as i', 'i.id', '=', 'ii.invoice_id')
            ->join('building_spaces as bs', 'bs.id', '=', 'i.space_id')
            ->where('bs.building_id', $building_id)
            ->whereMonth('i.issue_date', $month)
            ->whereYear('i.issue_date', $year);

        $data = (clone $query)->selectRaw("
            SUM(CASE WHEN ii.type = 'rent' THEN ii.amount ELSE 0 END) as rent,
            SUM(CASE WHEN ii.type = 'utility' THEN ii.amount ELSE 0 END) as utility,
            SUM(CASE WHEN ii.type = 'service' THEN ii.amount ELSE 0 END) as service
        ")->first();

        $rent = (float) ($data->rent ?? 0);
        $utility = (float) ($data->utility ?? 0);
        $service = (float) ($data->service ?? 0);

        $total = $rent + $utility + $service;

        return (object)[
            'labels' => ['Rent', 'Utility', 'Service'],
            'values' => $total > 0
                ? [
                    round(($rent / $total) * 100, 1),
                    round(($utility / $total) * 100, 1),
                    round(($service / $total) * 100, 1),
                ]
                : [0, 0, 0]
        ];
    }
    public static function getInvoiceStatus($building_id, $month = null, $year = null)
    {
        $month = (int)($month ?? date('m'));
        $year  = (int)($year ?? date('Y'));

        $data = DB::table('invoices as i')
            ->join('building_spaces as bs', 'bs.id', '=', 'i.space_id')
            ->where('bs.building_id', $building_id)
            ->whereMonth('i.issue_date', $month)
            ->whereYear('i.issue_date', $year)
            ->selectRaw("
                SUM(CASE WHEN i.payment_status_id = 1 THEN 1 ELSE 0 END) as paid,
                SUM(CASE WHEN i.payment_status_id = 2 THEN 1 ELSE 0 END) as unpaid,
                SUM(CASE WHEN i.payment_status_id = 3 THEN 1 ELSE 0 END) as partially_paid,
                SUM(CASE WHEN i.payment_status_id = 4 THEN 1 ELSE 0 END) as overdue
            ")
            ->first();

        $paid = (int) ($data->paid ?? 0);
        $unpaid = (int) ($data->unpaid ?? 0);
        $partially = (int) ($data->partially_paid ?? 0);
        $overdue = (int) ($data->overdue ?? 0);

        $total = $paid + $unpaid + $partially + $overdue;

        if ($total <= 0) {
            return (object)[
                'labels' => ['Paid', 'Unpaid', 'Partially Paid', 'Overdue'],
                'values' => [0, 0, 0, 0],
                'raw' => (object)[
                    'paid' => 0,
                    'unpaid' => 0,
                    'partially_paid' => 0,
                    'overdue' => 0
                ]
            ];
        }

        return (object)[
            'labels' => ['Paid', 'Unpaid', 'Partially Paid', 'Overdue'],
            'values' => [
                round(($paid / $total) * 100, 1),
                round(($unpaid / $total) * 100, 1),
                round(($partially / $total) * 100, 1),
                round(($overdue / $total) * 100, 1),
            ],
            'raw' => (object)[
                'paid' => $paid,
                'unpaid' => $unpaid,
                'partially_paid' => $partially,
                'overdue' => $overdue
            ]
        ];
    }
    public static function getCollectionKPIs($building_id, $month = null, $year = null)
    {
        $month = (int)($month ?? date('m'));
        $year  = (int)($year ?? date('Y'));

        $base = DB::table('invoice_items as ii')
            ->join('invoices as i', 'i.id', '=', 'ii.invoice_id')
            ->join('building_spaces as bs', 'bs.id', '=', 'i.space_id')
            ->where('bs.building_id', $building_id)
            ->whereMonth('i.issue_date', $month)
            ->whereYear('i.issue_date', $year);

        $rentTotal = (clone $base)->sum('i.amount');
        $rentPaid = (clone $base)->where('i.payment_status_id', 1)->sum('i.amount');

        $electricityTotal = (clone $base)->where('ii.type', 'utility')->sum('ii.amount');
        $electricityPaid = (clone $base)->where('ii.type', 'utility')
            ->where('i.payment_status_id', 1)->sum('ii.amount');

        $serviceTotal = (clone $base)->where('ii.type', 'service')->sum('ii.amount');
        $servicePaid = (clone $base)->where('ii.type', 'service')
            ->where('i.payment_status_id', 1)->sum('ii.amount');
        $occupied = DB::table('building_spaces')
            ->where('building_id', $building_id)
            ->where('status_id', 3)
            ->count();
        $totalSpaces = DB::table('building_spaces')
            ->where('building_id', $building_id)
            ->count();
        $occupancyPercent = $totalSpaces > 0
            ? round(($occupied / $totalSpaces) * 100, 1)
            : 0;
        $leaseRenewal = DB::table('contracts as c')
            ->join('building_spaces as bs', 'bs.id', '=', 'c.space_id')
            ->where('bs.building_id', $building_id)
            ->whereBetween('c.end_date', [
                now(),
                now()->addDays(30)
            ])
            ->count();
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
    public static function getActivities($f, $ss)
    {
        $d = (object)$f;

        $building_id = $d->building_id ?? null;
        $month = (int)($d->month ?? date('m'));
        $year  = (int)($d->year ?? date('Y'));
        $result = new \stdClass();
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
            ->whereMonth('i.issue_date', $month)
            ->whereYear('i.issue_date', $year)
            ->count();
        $expiringContracts = DB::table('contracts as c')
            ->join('building_spaces as bs', 'bs.id', '=', 'c.space_id')
            ->where('bs.building_id', $building_id)
            ->whereBetween('c.end_date', [
                Carbon::create($year, $month, 1),
                Carbon::create($year, $month, 1)->addMonth()->endOfMonth()
            ])
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
                'note' => 'No abnormal drop detected this period.'
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
        $result->alerts = [
            (object)[
                'level' => $overdueInvoices > 0 ? 'danger' : 'success',
                'title' => "{$overdueInvoices} overdue invoices",
                'note' => 'Requires collection follow-up.'
            ],
            (object)[
                'level' => 'warning',
                'title' => 'Utility processing',
                'note' => 'Pending meter updates for this period.'
            ],
            (object)[
                'level' => 'success',
                'title' => 'System synced',
                'note' => 'Latest data successfully updated.'
            ]
        ];
        $result->activities = DB::table('invoices as i')
            ->join('tenants as t', 't.id', '=', 'i.tenant_id')
            ->join('building_spaces as bs', 'bs.id', '=', 'i.space_id')
            ->where('bs.building_id', $building_id)
            ->whereMonth('i.created_at', $month)
            ->whereYear('i.created_at', $year)
            ->orderBy('i.created_at', 'desc')
            ->limit(5)
            ->selectRaw("
                CONCAT(t.name, ' invoice updated INV-', i.id) as text,
                DATE_FORMAT(i.created_at, '%h:%i %p') as time
            ")
            ->get();
        return $result;
    }
   public static function getLeaseExpiry($f, $ss)
   {
        $d = (object)$f;
        $building_id = $d->building_id ?? null;
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
        $result = new \stdClass();
        $result->lease_expiry = $rows->map(function ($r) use ($today) {
            $expiry = Carbon::parse($r->expiry);
            $days = $today->diffInDays($expiry, false);
            if ($days < 0) {
                $status = 'Expired';
                $level = 'danger';
            } elseif ($days <= 7) {
                $status = 'Expiring Soon';
                $level = 'warning';
            } elseif ($days <= 30) {
                $status = 'Upcoming';
                $level = 'info';
            } else {
                $status = 'Active';
                $level = 'success';
            }
            return (object)[
                'tenant' => $r->tenant,
                'floor' => 'Floor ' . $r->floor,
                'expiry' => $expiry->format('d M Y'),
                'status' => $status,
                'level' => $level,
                'days_left' => $days
            ];
        });
        return $result;
    }
    static function getFilterOptions($arr,$ss)
    {

        $d = (object)$arr;
        $building_id = $d->building_id ?? null;
        return (object) [
            'years' => GeneralSettings::options_calendar_year($ss),
            'buildings' => GeneralSettings::options_building($ss),
            'months' => GeneralSettings::options_calendar_month($ss),
        ];
    }

}
