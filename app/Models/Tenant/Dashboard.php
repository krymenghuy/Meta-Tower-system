<?php

namespace App\Models\Tenant;

use Vsd\Vsloquent\VSModel;
use DB;
use Carbon\Carbon;

class Dashboard extends VSModel
{
    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    private static function parseFilter($arr)
    {
        $d = (object) $arr;

        return (object)[
            'month' => (int)($d->month ?? date('m')),
            'year'  => (int)($d->year ?? date('Y')),
        ];
    }



    public static function getDataDashboard($arr, $ss = null)
    {
        $f = self::parseFilter($arr);

        // Fetch announcements
        $tenantId = $ss->official_id ?? null;
        $buildingId = DB::table('contracts as c')
            ->join('building_spaces as bs', 'bs.id', '=', 'c.space_id')
            ->where('c.tenant_id', $tenantId)
            ->where('c.status_id', 2)
            ->value('bs.building_id');

        $nowStr = date('Y-m-d H:i:s');
        $annQuery = DB::table('announcements as a')
            ->leftJoin('buildings as b', 'b.id', '=', 'a.building_id')
            ->where('a.status', 'Active')
            ->where(function ($q) use ($nowStr) {
                $q->whereNull('a.publish_date')
                  ->orWhere('a.publish_date', '')
                  ->orWhere('a.publish_date', 'null')
                  ->orWhere('a.publish_date', 'like', '0000%')
                  ->orWhere('a.publish_date', '<=', $nowStr);
            })
            ->where(function ($q) use ($nowStr) {
                $q->whereNull('a.expiry_date')
                  ->orWhere('a.expiry_date', '')
                  ->orWhere('a.expiry_date', 'null')
                  ->orWhere('a.expiry_date', 'like', '0000%')
                  ->orWhereRaw("DATE(a.expiry_date) >= ?", [date('Y-m-d')]);
            });

        if ($buildingId) {
            $annQuery->where(function ($q) use ($buildingId) {
                $q->whereNull('a.building_id')
                  ->orWhere('a.building_id', 0)
                  ->orWhere('a.building_id', $buildingId);
            });
        }

        $queryTenantTeam = DB::table('tenant_team as tt')
                // ->leftJoin('team_member as tm', 'tm.team_id', '=', 'tt.id')
                ->selectRaw('tt.team_name as team_name, tt.member_count as member_count')
                ->where('tt.tenant_id', $tenantId)
                ->get();
        

        $announcements = $annQuery
            ->orderByDesc('a.id')
            ->selectRaw("a.id, a.title, a.description, a.category, a.priority, a.audience, a.publish_date, a.expiry_date, b.name as building_name")
            ->limit(3)
            ->get();

        return (object)[
            'card_top'      => self::summarizeDashboardCardTop($f, $ss),
            'cards'         => self::summarizeDashboardCards($f, $ss),
            'activities'    => self::getActivities($f, $ss),
            'announcements' => $announcements,
            'tenant_team'   => $queryTenantTeam,
        ];
    }

    public static function summarizeDashboardCardTop($f, $ss)
    {
        $tenantId = $ss->official_id ?? null;

        $contract = DB::table('contracts as c')
            ->join('building_spaces as bs', 'bs.id', '=', 'c.space_id')
            ->join('buildings as b', 'b.id', '=', 'bs.building_id')
            ->join('contract_statuses as cs', 'cs.id', '=', 'c.status_id')
            ->where('c.tenant_id', $tenantId)
            ->select(
                'cs.name as contract_status',
                'bs.code as space_code',
                'c.sqm_size',
                'c.price',
                'c.price_type',
                'c.deposit'
            )
            ->latest('c.id')
            ->first();

        if (!$contract) {
            return (object)[];
        }

        $monthlyRent = $contract->price_type === 'sqm'
            ? ($contract->price * $contract->sqm_size)
            : $contract->price;

        return (object)[
            'lease_status' => $contract->contract_status ?? 'N/A',
            'unit_code'    => $contract->space_code ?? 'N/A',
            'monthly_rent' => '$ ' . number_format($monthlyRent, 2),
            'deposit'      => '$ ' . number_format($contract->deposit ?? 0, 2),
        ];
    }

    public static function summarizeDashboardCards($f, $ss)
    {
        $d = (object)$f;
        $tenantId = $ss->official_id ?? null;

        $month = (int)($d->month ?? date('m'));
        $year  = (int)($d->year ?? date('Y'));

        $activeLease = DB::table('contracts')
            ->where('tenant_id', $tenantId)
            ->where('status_id', 2)
            ->count();

        $unpaidAmount = DB::table('invoices as i')
            ->join('contracts as c', 'c.space_id', '=', 'i.space_id')
            ->where('c.tenant_id', $tenantId)
            ->where('i.payment_status_id', 2)
            ->whereMonth('i.issue_date', $month)
            ->whereYear('i.issue_date', $year)
            ->sum('i.due_amount');

        $activeBookings = DB::table('reservations')
            ->where('tenant_id', $tenantId)
            ->whereIn('status_id', [1, 2])
            ->count();

        $pendingRequests = DB::table('service_requests')
            ->where('tenant_id', $tenantId)
            ->where('status_id', 1)
            ->count();

        $inProgressRequests = DB::table('service_requests')
            ->where('tenant_id', $tenantId)
            ->where('status_id', 2)
            ->count();

        $completedRequests = DB::table('service_requests')
            ->where('tenant_id', $tenantId)
            ->where('status_id', 4)
            ->count();

        return (object)[
            'kpis' => [
                (object)[
                    'key' => 'lease',
                    'title' => 'Active Lease',
                    'value' => $activeLease,
                    'note' => $activeLease ? 'Current rental agreement' : 'No active lease',
                    'trend' => $activeLease ? 'Good standing' : 'Inactive',
                    'icon' => '🏢',
                    'color' => '#2563eb',
                    'soft' => '#dbeafe'
                ],
                (object)[
                    'key' => 'balance',
                    'title' => 'Unpaid Amount',
                    'value' => '$' . number_format($unpaidAmount, 2),
                    'note' => $unpaidAmount ? 'Payment required' : 'No unpaid invoices',
                    'trend' => $unpaidAmount ? 'Unpaid' : 'Paid',
                    'icon' => '💳',
                    'color' => '#9333ea',
                    'soft' => '#f3e8ff'
                ],
                (object)[
                    'key' => 'booking',
                    'title' => 'Amenity Booking',
                    'value' => $activeBookings,
                    'note' => $activeBookings ? 'Active bookings' : 'No active bookings',
                    'trend' => $activeBookings ? 'Upcoming' : 'Available',
                    'icon' => '📅',
                    'color' => '#16a34a',
                    'soft' => '#dcfce7'
                ],
                (object)[
                    'key' => 'service_request',
                    'title' => 'Service Requests',
                    'value' => $pendingRequests + $inProgressRequests,
                    'note' => "$pendingRequests pending, $inProgressRequests in progress",
                    'trend' => ($pendingRequests + $inProgressRequests) ? 'In progress' : 'Clear',
                    'icon' => '🛠️',
                    'color' => '#ea580c',
                    'soft' => '#ffedd5'
                ]
            ]
        ];
    }

    public static function getActivities($f, $ss)
    {
        $tenantId = $ss->official_id ?? null;

        return (object)[
            'activities' => DB::table('invoices as i')
                ->where('i.tenant_id', $tenantId)
                ->orderByDesc('i.created_at')
                ->limit(5)
                ->selectRaw("
                    CONCAT('Invoice INV-', i.id, ' updated') as text,
                    DATE_FORMAT(i.created_at, '%h:%i %p') as time
                ")
                ->get()
        ];
    }

    public static function getFilterOptions($arr, $ss)
    {
        return (object)[
            'years' => GeneralSettings::options_calendar_year($ss),
            'buildings' => GeneralSettings::options_building($ss),
            'months' => GeneralSettings::options_calendar_month($ss),
        ];
    }
}