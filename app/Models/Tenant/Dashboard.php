<?php

namespace App\Models\Tenant;
use Vsd\Vsloquent\VSModel;
use XBranch;
use DB;
use Vsd\Database\DBX;
use carbon\Carbon;
class Dashboard extends VSModel
{
    function __construct($id = null,$userInfo = null){
        $this->id = $id;
        $this->userInfo = $userInfo;

    }
    private static function parseFilter($arr){
        $d = (object) $arr;
        return (object)[
            'month'=> (int)($d->month ?? date('m')),
            'year'=> (int)($d->year ?? date('Y')),
        ];
    }
       public static function getDataDashboard($arr, $ss = null)
    {
        $f = self::parseFilter($arr);
        return (object)[
            'card_top' => self::summarizeDashboardCardTop($f, $ss),
            'cards' => self::summarizeDashboardCards($f, $ss),
            'activities' => self::getActivities($f, $ss),

            
        ];
    }

    public static function summarizeDashboardCardTop($f, $ss)
    {
        $id = $ss->official_id ?? null;

        $contract = DB::table('contracts as c')
            ->join('building_spaces as bs', 'bs.id', '=', 'c.space_id')
            ->join('buildings as b', 'b.id', '=', 'bs.building_id')
            ->join('contract_statuses as cs', 'cs.id', '=', 'c.status_id')
            ->where('c.tenant_id', $id)
            ->select(
                'c.id as contract_id',
                'cs.name as contract_status',
                'bs.code as space_code',
                'b.name as building_name',
                'c.sqm_size',
                'c.price',
                'c.price_type',
                'bs.sqm_size as space_sqm_size',
                'c.deposit'
            )
            ->latest('c.id')
            ->first();

        if (!$contract) {
            return (object)[];
        }

        $monthlyRent = $contract->price_type === 'sqm'
            ? $contract->price * $contract->sqm_size
            : $contract->price;

        return (object)[
            'lease_status' => $contract->contract_status ?? 'N/A',
            'unit_code'    => $contract->space_code ?? 'N/A',
            'monthly_rent' => '$ ' . number_format($monthlyRent ?? 0, 2),
            'deposit'      => '$ ' . number_format($contract->deposit ?? 0, 2),
        ];
    }
    public static function summarizeDashboardCards($f, $ss)
    {
        $tenantId = $ss->official_id ?? null;
        $building_id = (int)($d->building_id ?? 1);
        $month = (int)($d->month ?? date('m'));
        $year  = (int)($d->year ?? date('Y'));
        $result = new \stdClass();

        $activeLease = DB::table('contracts')
            ->where('tenant_id', $tenantId)
            ->where('status_id', 2)
            ->count();

        $tenantId = $ss->official_id;

        $invoice_unpaid = DB::table('invoices as i')
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
        $upcoming = DB::table('reservations')
            ->where('tenant_id', $tenantId)
            ->where('status_id', 1)
            ->count();

        $inProgress = DB::table('reservations')
            ->where('tenant_id', $tenantId)
            ->where('status_id', 2)
            ->count();

        $openRequests = DB::table('service_requests')
            ->where('tenant_id', $tenantId)
            ->whereIn('status_id', [1, 2])
            ->count();
        $pending = DB::table('service_requests')
            ->where('tenant_id', $tenantId)
            ->where('status_id', 1)
            ->count();

        $accepted = DB::table('service_requests')
            ->where('tenant_id', $tenantId)
            ->where('status_id', 2)
            ->count();

        $completed = DB::table('service_requests')
            ->where('tenant_id', $tenantId)
            ->where('status_id', 4)
            ->count();

        $result->kpis = [
            (object)[
                'key' => 'lease',
                'title' => 'Active Lease',
                'value' => $activeLease,
                'note' => 'Current rental agreement',
                'trend' => $activeLease > 0
                    ? 'Good standing'
                    : 'No active lease',
                'icon' => '🏢',
                'color' => '#2563eb',
                'soft' => '#dbeafe'
            ],

            (object)[
                'key' => 'balance',
                'title' => 'Unpaid Amount',
                'value' => '$' . number_format($invoice_unpaid, 2),
                'note' => $invoice_unpaid > 0
                    ? 'Payment required'
                    : 'No unpaid invoices',
                'trend' => $invoice_unpaid > 0
                    ? 'Unpaid'
                    : 'Paid',
                'icon' => '💳',
                'color' => '#9333ea',
                'soft' => '#f3e8ff'
            ],

            (object)[
                'title' => 'Amenity Booking',
                'value' => $activeBookings,
                'note' => $activeBookings
                    ? "$upcoming upcoming, $inProgress in progress"
                    : 'No active bookings',
                'trend' => $activeBookings
                    ? 'Upcoming'
                    : 'Available',
                'icon' => '📅',
                'color' => '#16a34a',
                'soft' => '#dcfce7'
            ],
            (object)[
                'title' => 'Service Requests',
                'value' => $openRequests,
                'note' => "$pending pending, $accepted in progress",
                'trend' => $openRequests > 0
                    ? 'In progress'
                    : 'No active requests',
                'icon' => '🛠️',
                'color' => '#ea580c',
                'soft' => '#ffedd5'
            ]
        ];

        return $result;
    }
    public static function getActivities($f, $ss)
    {
        $d = (object)$f;

        $building_id = $d->building_id ?? null;
        $month = (int)($d->month ?? date('m'));
        $year  = (int)($d->year ?? date('Y'));
        $result = new \stdClass();
       $tenantId = $ss->official_id;

       return $result->activities = DB::table('invoices as i')
            ->where('i.tenant_id', $tenantId)
            ->orderByDesc('i.created_at')
            ->limit(5)
            ->selectRaw("
                CONCAT('Invoice INV-', i.id, ' has been updated') as text,
                DATE_FORMAT(i.created_at, '%h:%i %p') as time
            ")
            ->get();

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
