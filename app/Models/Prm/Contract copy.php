<?php

namespace App\Models\Prm;

use App\Models\prm\GeneralSettings;
use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use XPublicStorage;


class Contract
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'contracts';

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
    /**
     * Required-field checks in form order (tenant → business → unit → deposit → start → end).
     */
    public static function validateSaveContractFieldOrder($arr)
    {
        $tenantId = $arr['tenant_id'] ?? null;
        if ($tenantId === null || $tenantId === '' || !is_numeric($tenantId)) {
            return DV::error('Please select a tenant.');
        }

        $businessTypeId = $arr['business_type_id'] ?? null;
        if ($businessTypeId === null || $businessTypeId === '' || !is_numeric($businessTypeId)) {
            return DV::error('Please select a business type.');
        }

        $spaceId = $arr['space_id'] ?? null;
        if ($spaceId === null || $spaceId === '' || !is_numeric($spaceId)) {
            return DV::error('Please select a valid unit code');
        }

        $deposit = $arr['deposit'] ?? null;
        if ($deposit === null || $deposit === '') {
            return DV::error('Deposit is required');
        }
        if (!is_numeric($deposit)) {
            return DV::error('Deposit is required');
        }

        $startDate = trim(($arr['start_date'] ?? ''));
        if ($startDate === '') {
            return DV::error('Please enter a valid contract start date.');
        }

        $endDate = trim(($arr['end_date'] ?? ''));
        if ($endDate === '') {
            return DV::error('Please enter a valid contract end date.');
        }

        return null;
    }

    /**
     * Modify contract: only business type, deposit, and remarks may change.
     */
    public function updateContractAllowedFields($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        if (!$id) {
            return DV::error('Contract not found.');
        }

        $existing = DB::table('contracts')->where('id', $id)->first();
        if (!$existing) {
            return DV::error('Contract not found.');
        }

        $businessTypeId = $arr['business_type_id'] ?? null;
        if ($businessTypeId === null || $businessTypeId === '' || !is_numeric($businessTypeId)) {
            return DV::error('Please select a business type.');
        }

        $deposit = $arr['deposit'] ?? null;
        if ($deposit === null || $deposit === '') {
            return DV::error('Deposit is required');
        }
        if (!is_numeric($deposit)) {
            return DV::error('Deposit is required');
        }

        $v_rule = [
            'business_type_id' => '1|number|exists=business_types.id|text=Please select a business type.',
            'deposit'          => '1|number|text=Deposit is required',
            'remarks'          => '0|string|0-255',
        ];
        $res = DBX::validateObject($arr, $v_rule, 1, [], $ss->lang, 0, null);
        if ($res->error) {
            return DV::error($res->error);
        }

        $update = [
            'business_type_id' => $res->values['business_type_id'],
            'deposit'          => $res->values['deposit'],
            'remarks'          => $res->values['remarks'] ?? $existing->remarks,
        ];

        $saved = DBX::saveData($ss, 'contracts', ['id' => $id], $update, [], 1);
        if (!$saved) {
            return DV::error('Update failed.');
        }

        return DV::depends(1, ['contracts' => $update, 'id' => $id]);
    }

    public function saveContract($arr = [], $id = null, $ss = null)
{
    $id = $id ?? $this->id;
    $ss = $ss ?? $this->userInfo;
    $subs_id = $ss->subs_id ?? getCurrentSubsId(true);

    if ($id) {
        return $this->updateContractAllowedFields($arr, $id, $ss);
    }

    $orderError = self::validateSaveContractFieldOrder($arr);
    if ($orderError !== null) {
        return $orderError;
    }

    $v_rule = [
        'tenant_id'        => '1|number|exists=tenants.id|text=Please select a tenant.',
        'legal_name'       => '0|string|0-100',
        'business_type_id' => '1|number|exists=business_types.id|text=Please select a business type.',
        'space_id'         => '1|number|exists=building_spaces.id|text=Please select a valid unit code',
        'deposit'          => '1|number|text=Deposit is required',
        'start_date'       => '1|date|text=Please enter a valid contract start date.',
        'end_date'         => '1|date|text=Please enter a valid contract end date.',
        'space_type_id'    => '1|number|exists=space_types.id',
        'status_id'        => '1|number|default = 1',
        'sqm_size'         => '0|number',
        'price'            => '0|number',
        'price_type'       => '0|string|default=sqm',
        'deposit_remarks'  => '0|string|0-255',
        'remarks'          => '0|string|0-255',
    ];
    $legal_name_char = ['@', ',', '.', '#'];
    $res = DBX::validateObject($arr, $v_rule, 1, ['legal_name' => $legal_name_char], $ss->lang, 0, null);
    if ($res->error) return DV::error($res->error);
    $inputs = $res->values;

    // Date rules only after required fields (tenant, business, unit, deposit, start, end) pass validation.
    $start = !empty($inputs['start_date']) ? strtotime($inputs['start_date']) : false;
    $end   = !empty($inputs['end_date']) ? strtotime($inputs['end_date']) : false;
    if ($start === false) {
        return DV::error('Please enter a valid contract start date.');
    }
    if ($end === false) {
        return DV::error('Please enter a valid contract end date.');
    }
    if ($end <= $start) {
        return DV::error('End date must be after start date.');
    }
    $todayStr = date('Y-m-d');
    $endInput = $inputs['end_date'] ?? '';
    if ($endInput !== '' && $endInput < $todayStr) {
        if ($id) {
            $prevEnd = DB::table('contracts')->where('id', $id)->value('end_date');
            $prevEndStr = $prevEnd ? date('Y-m-d', strtotime((string) $prevEnd)) : '';
            if ($prevEndStr !== $endInput) {
                return DV::error('End date cannot be in the past.');
            }
        } else {
            return DV::error('End date cannot be in the past.');
        }
    }
    $minEnd = strtotime('-1 day', strtotime('+1 month', $start));
    $startDay = date('d', $start);
    $calcDay  = date('d', strtotime('+1 month', $start));
    if ($startDay != $calcDay) {
        $minEnd = strtotime('-1 day', strtotime(date('Y-m-t', strtotime('+1 month', $start))));
    }
    if ($end < $minEnd) {
        return DV::error('Contract validity​​​ must be at least 1 month.');
    }
    $space_id  = $inputs['space_id'] ?? null;
    $tenant_id = $inputs['tenant_id'] ?? null;
    $bookingPhoneValidation = self::validateBookingTenantPhone($space_id, $tenant_id, true);
    if (!($bookingPhoneValidation->status ?? false)) {
        return DV::error($bookingPhoneValidation->message ?? 'Please create tenant before creating contract.');
    }
    $dup_id = self::checkDuplicateContract($space_id, $id);
    if ($dup_id) {
        return DV::error('This space already has a contract.');
    }
    $created = !$id;
    if ($created && $space_id && !empty($inputs['start_date']) && !empty($inputs['end_date'])) {
        $latestRenewal = DB::table('contract_renewals')
            ->where('space_id', $space_id)
            ->orderByDesc('start_date')
            ->select('start_date', 'end_date')
            ->first();

        if (!empty($latestRenewal?->start_date)) {
            $newStart = $inputs['start_date'];
            $newEnd = $inputs['end_date'];
            $renewStart = $latestRenewal->start_date;
            $renewEnd = $latestRenewal->end_date ?: $latestRenewal->start_date;
            $isOverlapRenewal = $newStart <= $renewEnd && $newEnd >= $renewStart;

            if ($newStart > $renewStart) {
                return DV::error('Start date must be on or before the last renewal start.');
            }
            if ($isOverlapRenewal) {
                return DV::error('Dates overlap the last renewal for this unit.');
            }
        }
    }
    if ($created) {
        $today = date('Y-m-d');
        $isActiveNow = !empty($inputs['start_date']) && $inputs['start_date'] <= $today;
        $inputs['status_id'] = $isActiveNow
            ? self::getActiveStatusId()
            : self::getPendingStatusId();
    }
    $id = DBX::saveData($ss, 'contracts', ['id' => $id], $inputs, [], 1);
    if ($id) {
        // Only Active contracts occupy the unit; Pending (future start) leaves space Available.
        if ($space_id && (int) ($inputs['status_id'] ?? 0) === (int) self::getActiveStatusId()) {
            self::syncBuildingSpaceOccupiedForSpaceIds([$space_id]);
        }
        self::syncTenantStatusForTenantIds([$tenant_id]);
    }
    if ($id > 0) {
        return DV::depends(1, ['contracts' => $inputs, 'id' => $id]);
    }
    return DV::error($created ? 'Create failed.' : 'Update failed.');
}


    public static function getPendingStatusId()
    {
        $pendingId = DB::table('contract_statuses')
            ->where(function ($q) {
                $q->whereRaw('LOWER(TRIM(name)) = ?', ['pending'])
                    ->orWhereRaw('LOWER(TRIM(status_code)) = ?', ['pending']);
            })
            ->value('id');

        return $pendingId ?: 1;
    }

    public static function getActiveStatusId()
    {
        $activeId = DB::table('contract_statuses')
            ->where(function ($q) {
                $q->whereRaw('LOWER(TRIM(name)) = ?', ['active'])
                    ->orWhereRaw('LOWER(TRIM(status_code)) = ?', ['active']);
            })
            ->value('id');

        return $activeId ?: 1;
    }

    public static function getExpiredStatusId()
    {
        $expiredId = DB::table('contract_statuses')
            ->where(function ($q) {
                $q->whereRaw('LOWER(TRIM(name)) = ?', ['expired'])
                    ->orWhereRaw('LOWER(TRIM(status_code)) = ?', ['expired']);
            })
            ->value('id');

        return $expiredId ?: 2;
    }

    public static function getTerminatedStatusId()
    {
        $terminatedId = DB::table('contract_statuses')
            ->where(function ($q) {
                $q->whereRaw('LOWER(TRIM(name)) = ?', ['terminated'])
                    ->orWhereRaw('LOWER(TRIM(status_code)) = ?', ['terminated']);
            })
            ->value('id');

        return $terminatedId ?: 3;
    }


    public static function getSpaceOccupiedStatusId()
    {
        $id = DB::table('space_statuses')
            ->where(function ($q) {
                $q->whereRaw('LOWER(TRIM(name)) = ?', ['occupied'])
                    ->orWhereRaw('LOWER(TRIM(status_code)) = ?', ['occupied']);
            })
            ->value('id');

        return $id;
    }

    /** Get space_statuses.id for "Available". */
    public static function getSpaceAvailableStatusId()
    {
        $id = DB::table('space_statuses')
            ->where(function ($q) {
                $q->whereRaw('LOWER(TRIM(name)) = ?', ['available'])
                    ->orWhereRaw('LOWER(TRIM(status_code)) = ?', ['available']);
            })
            ->value('id');

        return $id;
    }

    public static function checkDuplicateContract($space_id, $id = null)
    {
        if (!$space_id) return null;


        // Expired or Terminated contracts do not block creating a new contract for the same space.
        $activeId = self::getActiveStatusId();
        $pendingId = self::getPendingStatusId();
        $statusIds = array_filter([$activeId, $pendingId]);

        $query = DB::table('contracts as c')
            ->where('c.space_id', $space_id);

        if (!empty($statusIds)) {
            $query->whereIn('c.status_id', $statusIds);
        }

        if ($id) {
            $query->where('c.id', '<>', $id);
        }

        return $query->value('id');
    }

    public static function datesOverlap($startA, $endA, $startB, $endB): bool
    {
        if (!$startA || !$endA || !$startB || !$endB) {
            return false;
        }
        $startA = date('Y-m-d', strtotime($startA));
        $endA = date('Y-m-d', strtotime($endA));
        $startB = date('Y-m-d', strtotime( $startB));
        $endB = date('Y-m-d', strtotime($endB));

        return $startA <= $endB && $endA >= $startB;
    }

    /**
     * Find a renewal on the same unit (from another contract) whose period overlaps the given range.
     */
    public static function findOverlappingRenewalOnUnit($spaceId, $startDate, $endDate, $excludeContractId, $excludeRenewalId = null)
    {
        $spaceId = $spaceId;
        $excludeContractId = $excludeContractId;
        if ($spaceId <= 0 || !$startDate || !$endDate) {
            return null;
        }

        $startDate = date('Y-m-d', strtotime($startDate));
        $endDate = date('Y-m-d', strtotime( $endDate));

        $query = DB::table('contract_renewals as cr')
            ->join('building_spaces as bs', 'bs.id', '=', 'cr.space_id')
            ->where('cr.space_id', $spaceId)
            ->where('cr.contract_id', '<>', $excludeContractId)
            ->whereRaw('DATE(cr.start_date) <= ?', [$endDate])
            ->whereRaw('DATE(COALESCE(cr.end_date, cr.start_date)) >= ?', [$startDate])
            ->select('bs.code as space_code', 'cr.start_date', 'cr.end_date', 'cr.contract_id');

        if ($excludeRenewalId) {
            $query->where('cr.id', '<>', $excludeRenewalId);
        }

        return $query->first();
    }

    /** Latest renewal whose period has not started yet (start_date after today). */
    public static function getLatestPendingRenewal($contractId)
    {
        $contractId = (int) $contractId;
        if ($contractId <= 0) {
            return null;
        }

        $today = date('Y-m-d');

        return DB::table('contract_renewals')
            ->where('contract_id', $contractId)
            ->whereRaw('DATE(start_date) > ?', [$today])
            ->orderByDesc('id')
            ->first();
    }

    protected static function resolveContractEndDateBeforeRenewal($contractId, $pendingRenewal)
    {
        $previousRenewal = DB::table('contract_renewals')
            ->where('contract_id', $contractId)
            ->where('id', '<', $pendingRenewal->id)
            ->orderByDesc('id')
            ->first();

        if ($previousRenewal && !empty($previousRenewal->end_date)) {
            return date('Y-m-d', strtotime($previousRenewal->end_date));
        }

        $startTs = strtotime($pendingRenewal->start_date);
        if ($startTs === false) {
            return null;
        }

        return date('Y-m-d', strtotime('-1 day', $startTs));
    }

    protected static function syncContractStatusAfterEndDateChange($contract, $endDate)
    {
        if (!$contract || !$endDate) {
            return;
        }

        $today = date('Y-m-d');
        $endDate = date('Y-m-d', strtotime($endDate));
        $startDate = !empty($contract->start_date)
            ? date('Y-m-d', strtotime($contract->start_date))
            : null;
        $terminatedStatusId = self::getTerminatedStatusId();

        if ((int) ($contract->status_id ?? 0) === (int) $terminatedStatusId) {
            return;
        }

        if ($endDate < $today) {
            DB::table('contracts')->where('id', $contract->id)->update([
                'status_id' => self::getExpiredStatusId(),
            ]);
            return;
        }

        if ($startDate && $startDate > $today) {
            DB::table('contracts')->where('id', $contract->id)->update([
                'status_id' => self::getPendingStatusId(),
            ]);
            return;
        }

        DB::table('contracts')->where('id', $contract->id)->update([
            'status_id' => self::getActiveStatusId(),
        ]);
    }

//  Set building_spaces to Available when no Active/Pending contract remains on that space.

    public static function syncBuildingSpaceAvailabilityForSpaceIds($spaceIds): void
    {
        $availableId = self::getSpaceAvailableStatusId();
        if (!$availableId) {
            return;
        }

        $seen = [];
        foreach ($spaceIds as $sid) {
            $sid = $sid;
            if ($sid <= 0 || isset($seen[$sid])) {
                continue;
            }
            $seen[$sid] = true;

            if (self::checkDuplicateContract($sid, null)) {
                continue;
            }

            DB::table('building_spaces')->where('id', $sid)->update(['status_id' => $availableId]);
        }
    }

    /** Set building_spaces to Occupied when a live Active contract exists on that space (not Pending). */
    public static function syncBuildingSpaceOccupiedForSpaceIds($spaceIds): void
    {
        $occupiedId = self::getSpaceOccupiedStatusId();
        if (!$occupiedId) {
            return;
        }

        $activeStatusId = self::getActiveStatusId();
        $today = date('Y-m-d');
        $seen = [];
        foreach ($spaceIds as $sid) {
            $sid = (int) $sid;
            if ($sid <= 0 || isset($seen[$sid])) {
                continue;
            }
            $seen[$sid] = true;

            $hasLiveActive = DB::table('contracts')
                ->where('space_id', $sid)
                ->where('status_id', $activeStatusId)
                ->whereDate('start_date', '<=', $today)
                ->whereDate('end_date', '>=', $today)
                ->exists();

            if ($hasLiveActive) {
                DB::table('building_spaces')->where('id', $sid)->update(['status_id' => $occupiedId]);
            }
        }
    }

    /** Recalculate tenants.status_id: Active (2) vs Inactive (3); mirrors deleteContract / terminate semantics. */
    public static function syncTenantStatusForTenantIds($tenantIds): void
    {
        $ids = [];
        foreach ($tenantIds as $tid) {
            $tid = $tid;
            if ($tid > 0) {
                $ids[$tid] = true;
            }
        }
        if ($ids === []) {
            return;
        }

        $terminatedStatusId = self::getTerminatedStatusId();
        $today = date('Y-m-d');
        foreach (array_keys($ids) as $tenant_id) {
            $hasActive = DB::table('contracts')
                ->where('tenant_id', $tenant_id)
                ->whereDate('end_date', '>=', $today)
                ->where('status_id', '!=', $terminatedStatusId)
                ->exists();
            DB::table('tenants')->where('id', $tenant_id)
                ->update(['status_id' => $hasActive ? 2 : 3]);
        }
    }

    /** Date-based Pending→Active, Active/Pending→Expired; sync spaces and affected tenant statuses. */
    public static function applyAutomaticContractRollups(): void
    {
        $today = date('Y-m-d');
        $activeStatusId = self::getActiveStatusId();
        $pendingStatusId = self::getPendingStatusId();
        $expiredStatusId = self::getExpiredStatusId();

        $activatingTenantIds = DB::table('contracts')
            ->where('status_id', $pendingStatusId)
            ->whereDate('start_date', '<=', $today)
            ->whereDate('end_date', '>=', $today)
            ->pluck('tenant_id');

        $activatingSpaceIds = DB::table('contracts')
            ->where('status_id', $pendingStatusId)
            ->whereDate('start_date', '<=', $today)
            ->whereDate('end_date', '>=', $today)
            ->pluck('space_id');

        DB::table('contracts')
            ->where('status_id', $pendingStatusId)
            ->whereDate('start_date', '<=', $today)
            ->whereDate('end_date', '>=', $today)
            ->update(['status_id' => $activeStatusId]);

        self::syncBuildingSpaceOccupiedForSpaceIds($activatingSpaceIds);

        $expiringSpaceIds = DB::table('contracts')
            ->whereIn('status_id', [$activeStatusId, $pendingStatusId])
            ->whereDate('end_date', '<', $today)
            ->pluck('space_id');
        $expiringTenantIds = DB::table('contracts')
            ->whereIn('status_id', [$activeStatusId, $pendingStatusId])
            ->whereDate('end_date', '<', $today)
            ->pluck('tenant_id');

        DB::table('contracts')
            ->whereIn('status_id', [$activeStatusId, $pendingStatusId])
            ->whereDate('end_date', '<', $today)
            ->update(['status_id' => $expiredStatusId]);

        self::syncBuildingSpaceAvailabilityForSpaceIds($expiringSpaceIds);

        self::syncTenantStatusForTenantIds(array_merge(
            $activatingTenantIds->all(),
            $expiringTenantIds->all(),
        ));
    }

    public function getListPaginate($arr, $ss = null)
    {

        $d = (object) $arr;
        $search_value = $d->search_value ?? null;
        $tenant_id = $d->tenant_id ?? null;
        $status_id = $d->status_id ?? null;
        $space_type_id = $d->space_type_id ?? null;
        $business_type_id = $d->business_type_id ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;

        self::applyAutomaticContractRollups();

        $str_search = '1=1';
        $str_moreWhere = '2=2';
        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(t.name LIKE '%" . $search_value . "%'  OR t.phone_number LIKE '%" . $search_value . "%' OR bs.code LIKE '%" . $search_value . "%' )";
        }
        if ($tenant_id) {
            $str_moreWhere .= ' AND c.tenant_id = ' . $tenant_id;
        }
        if ($status_id) {
            $str_moreWhere .= ' AND c.status_id =' . $status_id;
        }
        if ($space_type_id) {
            $str_moreWhere .= ' AND c.space_type_id = ' . $space_type_id;
        }
        if ($business_type_id) {
            $str_moreWhere .= ' AND c.business_type_id = ' . $business_type_id;
        }
        $start_date = DBX::formatDate("c.start_date", 'start_date');
        $end_date = DBX::formatDate("c.end_date", 'end_date');
        $updated_at = DBX::formatTime("c.updated_at", 'updated_at');
        $lastRenewalDate = "(SELECT DATE_FORMAT(cr.renewal_date,'%d-%b-%Y') FROM contract_renewals cr WHERE cr.contract_id = c.id ORDER BY cr.id DESC LIMIT 1) AS last_renewal_date";
        $pendingRenewalId = "(SELECT cr.id FROM contract_renewals cr WHERE cr.contract_id = c.id AND DATE(cr.start_date) > CURDATE() ORDER BY cr.id DESC LIMIT 1) AS pending_renewal_id";
        $pendingRenewalStart = "(SELECT DATE_FORMAT(cr.start_date,'%d-%b-%Y') FROM contract_renewals cr WHERE cr.contract_id = c.id AND DATE(cr.start_date) > CURDATE() ORDER BY cr.id DESC LIMIT 1) AS pending_renewal_start_date";
        $selectCols = 'c.id,c.tenant_id,t.name as tenant_name,t.code,t.email,t.phone_number,c.legal_name,c.status_id,cs.name as status,' . $start_date . ',' . $end_date . ',' . $lastRenewalDate . ',' . $pendingRenewalId . ',' . $pendingRenewalStart . ',c.business_type_id,bt.name as business_type,c.space_type_id,st.name as space_type,c.space_id, bs.code as space_code,c.sqm_size,c.price,c.price_type,c.deposit,c.remarks,c.update_user,' . $updated_at . '';
        $query = DB::table('contracts as c')
            ->join('tenants as t', 't.id', '=', 'c.tenant_id')
            ->join('contract_statuses as cs', 'cs.id', '=', 'c.status_id')
            ->join('building_spaces as bs', 'bs.id', '=', 'c.space_id')
            ->join('business_types as bt', 'bt.id', '=', 'c.business_type_id')
            ->join('space_types as st', 'st.id', '=', 'c.space_type_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw($selectCols)
            ->orderByRaw('c.id desc');


        $clone_query = clone $query;
        $count = $clone_query->count('c.id');
        $rows  = $query->skip($skip_rows)->take($per_page)->get();
        // $today = date('Y-m-d');
        // foreach($rows as $row){
        //     if($row->end_date < $today){
        //         $row->status_id = 2;
        //         DB::table('contracts as c')->where('c.id',$row->id)->where('status_id','<',3)->update(['status_id'=>2]);
        //     }
        // }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }


    public function getListRenewalsPaginate($arr, $ss = null)
    {
        $d = (object) $arr;
        $contract_id = isset($d->contract_id) && is_numeric($d->contract_id) ?  $d->contract_id : null;
        $search_value = $d->search_value ?? null;
        $current_page = isset($d->current_page) && is_numeric($d->current_page) ? $d->current_page : 1;
        $per_page = isset($d->per_page) && is_numeric($d->per_page) ? $d->per_page : 10;
        if ($current_page < 1) {
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;

        $str_where = '1=1';
        if ($contract_id) {
            $str_where .= ' AND cr.contract_id = ' . $contract_id;
        }
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_where .= " AND (cr.remarks LIKE '%" . $search_value . "%')";
        }
        if ($ss && isset($ss->branch_id) && $ss->branch_id !== null && $ss->branch_id !== '') {
            $str_where .= ' AND (cr.branch_id IS NULL OR cr.branch_id = ' . $ss->branch_id . ')';
        }

        $renewal_date = DBX::formatDate('cr.renewal_date', 'renewal_date');
        $start_date = DBX::formatDate('cr.start_date', 'start_date');
        $end_date = DBX::formatDate('cr.end_date', 'end_date');
        $updated_at = DBX::formatTime('cr.updated_at', 'updated_at');

        $selectCols = 'cr.id, cr.contract_id, cr.space_id, ' . $renewal_date . ', ' . $start_date . ', ' . $end_date . ', cr.status, cr.remarks, cr.update_user, ' . $updated_at . ', c.tenant_id, t.name as tenant_name, bs.code as space_code';

        $query = DB::table('contract_renewals as cr')
            ->join('contracts as c', 'c.id', '=', 'cr.contract_id')
            ->join('tenants as t', 't.id', '=', 'c.tenant_id')
            ->join('building_spaces as bs', 'bs.id', '=', 'cr.space_id')
            ->whereRaw($str_where)
            ->selectRaw($selectCols)
            ->orderByRaw('cr.id desc');

        $clone_query = clone $query;
        $count = $clone_query->count('cr.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public static function contractDetails($id)
    {
        $pendingRenewal = self::getLatestPendingRenewal($id);
        $latestLiveRenewal = DB::table('contract_renewals')
            ->where('contract_id', $id)
            ->whereRaw('DATE(start_date) <= CURDATE()')
            ->orderByDesc('id')
            ->select('space_id', 'start_date', 'end_date')
            ->first();

        $row =  DB::table('contracts as c')
            ->join('tenants as t', 't.id', '=', 'c.tenant_id')
            ->join('building_spaces as bs', 'bs.id', '=', 'c.space_id')
            ->join('business_types as bt', 'bt.id', '=', 'c.business_type_id')
            ->join('space_types as st', 'st.id', '=', 'c.space_type_id')
            ->where('c.id', $id)
            ->selectRaw('
                            c.id,
                            c.tenant_id,
                            c.legal_name,
                            c.space_id,
                            c.status_id,
                            c.business_type_id,
                            c.space_type_id,
                            c.sqm_size,
                            c.price,
                            c.price_type,
                            c.deposit,
                            c.start_date,
                            c.end_date,
                            c.remarks,
                            bs.code as space_code,
                            t.name as tenant_name,
                            bt.name as business_name,
                            st.name as space_name
                            ')
            ->first();
            if ($row) {
                $renewalSpaceId = $latestLiveRenewal->space_id ?? null;
                if (!empty($renewalSpaceId) && $renewalSpaceId > 0) {
                    $renewalSpaceCode = DB::table('building_spaces')
                        ->where('id',  $renewalSpaceId)
                        ->value('code');
                    if (!empty($renewalSpaceCode)) {
                        $row->space_id = $renewalSpaceId;
                        $row->space_code = $renewalSpaceCode;
                    }
                }

                if ($pendingRenewal) {
                    $priorEndDate = self::resolveContractEndDateBeforeRenewal($id, $pendingRenewal);
                    $row->pending_renewal_id = $pendingRenewal->id;
                    $row->pending_renewal_start_date = $pendingRenewal->start_date;
                    $row->pending_renewal_end_date = $pendingRenewal->end_date;
                    $row->pending_renewal_space_id = $pendingRenewal->space_id;
                    $row->pending_renewal_remarks = $pendingRenewal->remarks ?? '';
                    $row->current_contract_end_date = $priorEndDate;
                    $row->renew_start_date = date('Y-m-d', strtotime($pendingRenewal->start_date));
                } else {
                    $endTs = strtotime($row->end_date);
                    $row->renew_start_date = date('Y-m-d', strtotime('+1 day', $endTs));
                }

                setOfficialDates($row, ['start_date', 'end_date', 'renew_start_date'], [], []);
                if ($pendingRenewal) {
                    setOfficialDates($row, ['pending_renewal_start_date', 'pending_renewal_end_date', 'current_contract_end_date'], [], []);
                }
            }
        return $row;
    }

    public static function getFormOptions($id, $ss, $space_id = null, $include_space_ids = [], $restrict_to_include_spaces = false)
    {
        $contract_details = $id ? self::contractDetails($id) : null;
        $current_space_id = $contract_details->space_id ?? $space_id;
        $normalizedIncludeIds = [];
        foreach ( $include_space_ids as $sid) {
            $sid = $sid;
            if ($sid > 0) {
                $normalizedIncludeIds[$sid] = true;
            }
        }
        if (!empty($current_space_id)) {
            $normalizedIncludeIds[ $current_space_id] = true;
        }
        if ($restrict_to_include_spaces && !empty($normalizedIncludeIds)) {
            $building_spaces = GeneralSettings::options_building_space_rows_by_ids(array_keys($normalizedIncludeIds));
        } else {
            $building_spaces = GeneralSettings::options_building_space($ss, $current_space_id);
        }
        if (!empty($normalizedIncludeIds)) {

            $alreadyLoadedById = $building_spaces
                ->filter(function ($row) {
                    return ($row->id ?? 0) > 0;
                })
                ->keyBy('id');
            $missingIds = array_keys(array_diff_key($normalizedIncludeIds, $alreadyLoadedById->all()));
            if (!empty($missingIds)) {
                foreach (GeneralSettings::options_building_space_rows_by_ids($missingIds) as $row) {
                    $building_spaces->push($row);
                }
            }
        }
        return (object) [
            'contract_details' => $contract_details,
            'tenants'      => GeneralSettings::options_tenant($ss),
            'legal_names'      => GeneralSettings::options_legal($ss),
            'statuses'      => GeneralSettings::options_contract_status($ss),
            'space_types'      => GeneralSettings::options_space_type($ss),
            'building_spaces'      => $building_spaces,
            'business_types'   => GeneralSettings::options_business_type($ss)
        ];
    }
    public static function deleteContract($id = null)
    {
        if ($id === null || $id === '' || !is_numeric($id)) {
            return DV::error('Invalid ID.');
        }
        $contract = DB::table('contracts')->where('id', $id)->first();
        if (!$contract) {
            return DV::error('Contract not found.');
        }

        $sid = $contract->status_id;
        $canDelete = in_array($sid, [
             self::getPendingStatusId(),
             self::getExpiredStatusId(),
             self::getTerminatedStatusId(),
        ], true);
        if (!$canDelete) {
            return DV::error('Only pending, expired, or terminated contracts can be deleted.');
        }

        DB::beginTransaction();
        try {
            DB::table('contract_renewals')->where('contract_id', $id)->delete();

            $deleted = DB::table('contracts')->where('id', $id)->delete();
            if (!$deleted) {
                DB::rollBack();
                return DV::error('Deleted failed.');
            }

            $space_id = $contract->space_id ?? null;
            if ($space_id) {
                DB::table('space_bookings')->where('space_id', $space_id)->delete();
            }
            if ($space_id && !self::checkDuplicateContract($space_id, null)) {
                $availableId = self::getSpaceAvailableStatusId();
                if ($availableId) {
                    DB::table('building_spaces')->where('id', $space_id)->update(['status_id' => $availableId]);
                }
            }

            $tenant_id = $contract->tenant_id ?? null;
            if ($tenant_id) {
                self::syncTenantStatusForTenantIds([$tenant_id]);
            }

            DB::commit();

            return DV::depends($deleted, ['action' => 'deleted']);
        } catch (\Throwable $e) {
            DB::rollBack();

            return DV::error('Delete failed.');
        }
    }

    public static function normalizePhone($phone)
    {
        $value = trim($phone);
        return preg_replace('/\D+/', '', $value);
    }

    public static function getLatestBookingBySpaceId($space_id)
    {
        if (!$space_id) return null;
        return DB::table('space_bookings')
            ->where('space_id', $space_id)
            ->orderByDesc('id')
            ->first();
    }

    public static function findTenantByNormalizedPhone($booking_phone)
    {
        return DB::table('tenants')
            ->select('id', 'name', 'phone_number')
            ->get()
            ->first(function ($row) use ($booking_phone) {
                $tenant_phone = self::normalizePhone($row->phone_number ?? '');
                return $tenant_phone === $booking_phone;
            });
    }

    public static function phoneValidationResponse($status, $message = null, $extra = [])
    {
        return (object) array_merge([
            'status' => $status,
            'message' => $message,
        ], $extra);
    }

    public static function validateBookingTenantPhone($space_id, $tenant_id = null, $strictTenantMatch = false)
    {
        $booking = self::getLatestBookingBySpaceId($space_id);
        if (!$booking) {
            return self::phoneValidationResponse(true, 'No booking found for this space.', [
                'has_booking' => false,
            ]);
        }

        $booker_phone_raw = $booking->booker_phone ?? '';
        $booker_phone = self::normalizePhone($booker_phone_raw);
        if ($booker_phone === '') {
            return self::phoneValidationResponse(false, 'Booking phone number is empty. Please update booking or create tenant first.', [
                'has_booking' => true,
            ]);
        }

        if ($strictTenantMatch && $tenant_id) {
            $tenant_phone_raw = DB::table('tenants')->where('id', $tenant_id)->value('phone_number');
            $tenant_phone = self::normalizePhone($tenant_phone_raw);
            if ($tenant_phone !== '' && $tenant_phone === $booker_phone) {
                return self::phoneValidationResponse(true, null, ['has_booking' => true]);
            }
            return self::phoneValidationResponse(false, 'Selected tenant phone number does not match booking phone number. Please create/select the correct tenant first.', [
                'has_booking' => true,
            ]);
        }

        $tenant = self::findTenantByNormalizedPhone($booker_phone);
        if (!$tenant) {
            return self::phoneValidationResponse(false, 'Tenant', [
                'has_booking' => true,
                'booker_phone' => $booker_phone_raw,
            ]);
        }

        $relatedBookings = DB::table('space_bookings as sb')
            ->join('building_spaces as bs', 'bs.id', '=', 'sb.space_id')
            ->select('sb.space_id', 'bs.code', 'sb.booker_phone')
            ->orderByDesc('sb.id')
            ->get();

        $relatedSpaces = [];
        $seenSpaceIds = [];
        foreach ($relatedBookings as $row) {
            $normalizedPhone = self::normalizePhone($row->booker_phone ?? '');
            $spaceId = ($row->space_id ?? 0);
            if ($spaceId <= 0 || $normalizedPhone !== $booker_phone || isset($seenSpaceIds[$spaceId])) {
                continue;
            }
            $seenSpaceIds[$spaceId] = true;
            $relatedSpaces[] = (object) [
                'id' => $spaceId,
                'code' => $row->code ?? '',
            ];
        }

        return self::phoneValidationResponse(true, 'Booking phone matched with tenant.', [
            'has_booking' => true,
            'booker_phone' => $booker_phone_raw,
            'tenant_id' => $tenant->id,
            'tenant_name' => $tenant->name,
            'spaces' => $relatedSpaces,
        ]);
    }

    public static function getBookingSpacesByTenantId($tenant_id)
    {
        $tenant_id = $tenant_id;
        if ($tenant_id <= 0) {
            return [];
        }

        $tenantPhoneRaw = DB::table('tenants')->where('id', $tenant_id)->value('phone_number');
        $tenantPhone = self::normalizePhone($tenantPhoneRaw ?? '');
        if ($tenantPhone === '') {
            return [];
        }

        $rows = DB::table('space_bookings as sb')
            ->join('building_spaces as bs', 'bs.id', '=', 'sb.space_id')
            ->select('sb.space_id', 'bs.code', 'sb.booker_phone')
            ->orderByDesc('sb.id')
            ->get();

        $spaces = [];
        $seen = [];
        foreach ($rows as $row) {
            $spaceId = ($row->space_id ?? 0);
            if ($spaceId <= 0 || isset($seen[$spaceId])) {
                continue;
            }
            $bookingPhone = self::normalizePhone($row->booker_phone ?? '');
            if ($bookingPhone !== $tenantPhone) {
                continue;
            }
            $seen[$spaceId] = true;
            $spaces[] = (object) [
                'id' => $spaceId,
                'code' => $row->code ?? '',
            ];
        }

        return $spaces;
    }

    /**
     * Set contract status to Terminated (only when Active). Frees the building space and updates tenant status.
     */
    public function terminateContract($id, $ss = null)
    {
        $terminatedStatusId = self::getTerminatedStatusId();
        $activeStatusId = self::getActiveStatusId();

        $contract = DB::table('contracts')->where('id', $id)->first();
        if (!$contract) {
            return DV::error('Contract not found');
        }
        if ($contract->status_id ===  $terminatedStatusId) {
            return DV::error('Contract is already terminated');
        }
        if ($contract->status_id !==  $activeStatusId) {
            return DV::error('Only active contracts can be terminated');
        }

        DB::beginTransaction();
        try {
            $updated = DBX::saveData($ss, 'contracts', ['id' => $id], ['status_id' => $terminatedStatusId], [], 1);
            if (!$updated) {
                DB::rollBack();
                return DV::error('Failed to terminate contract');
            }

            $space_id = $contract->space_id ?? null;
            if ($space_id) {
                self::syncBuildingSpaceAvailabilityForSpaceIds([$space_id]);
            }

            $tenant_id = $contract->tenant_id ?? null;
            if ($tenant_id) {
                self::syncTenantStatusForTenantIds([$tenant_id]);
            }

            DB::commit();
            return DV::depends(1, ['id' => $id]);
        } catch (\Throwable $e) {
            DB::rollBack();
            return DV::error('Failed to terminate contract.');
        }
    }
    public function renewContract($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        if (!$id) return DV::error('Contract not found');

        $old = DB::table('contracts')->where('id', $id)->first();
        if (!$old) return DV::error('Contract not found');
        if ($old->status_id == 3) {
            return DV::error('Terminated contract cannot be renewed');
        }
        if (self::getLatestPendingRenewal($old->id)) {
            return DV::error('This contract already has a pending renewal. Modify or cancel it first.');
        }
        $latestRenewal = DB::table('contract_renewals')
            ->where('contract_id', $old->id)
            ->orderByDesc('id')
            ->select('space_id')
            ->first();
        $effectiveOldSpaceId = !empty($latestRenewal->space_id)
            ? $latestRenewal->space_id
            : $old->space_id;
        $v_rule = [
            'start_date' => '1|date',
            'end_date'   => '1|date',
            'price'      => '0|number',
            'price_type' => '0|string|default=sqm',
            'remarks'    => '0|string|0-255',
            'space_id'   => '0|number|exists=building_spaces.id',
        ];

        $res = DBX::validateObject($arr, $v_rule, 1, [], $ss->lang, 0, null);
        if ($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $today = date('Y-m-d');
        $start = strtotime($inputs['start_date']);
        $end   = strtotime($inputs['end_date']);
        $todayTS = strtotime(date('Y-m-d'));

        if ($end <= $start) {
            return DV::error('End date must be after start date');
        }

        if ($end < $todayTS) {
            return DV::error('End date cannot be in the past');
        }


        $minEnd = strtotime('+1 month', $start);

        // fix month-end cases (31 Jan → Feb end)
        if (date('d', $start) != date('d', $minEnd)) {
            $minEnd = strtotime(date('Y-m-t', $minEnd));
        }

        if ($end < strtotime('-1 day', $minEnd)) {
            return DV::error('Contract must be at least 1 month');
        }
        $new_space_id = !empty($inputs['space_id']) ? $inputs['space_id'] : $effectiveOldSpaceId;
        if ($new_space_id != $effectiveOldSpaceId) {
            $dup_id = self::checkDuplicateContract($new_space_id, $old->id);
            if ($dup_id) {
                return DV::error('The selected unit already has a contract.');
            }
        }
        $overlapRenewal = self::findOverlappingRenewalOnUnit(
            $new_space_id,
            $inputs['start_date'],
            $inputs['end_date'],
            (int) $old->id
        );
        if ($overlapRenewal) {
            $unitCode = trim(($overlapRenewal->space_code ?? ''));
            $msg = 'Renewal dates overlap an existing contract period for unit '
                . ($unitCode !== '' ? $unitCode : 'this unit')
                . '.';
            $conflictStart = $overlapRenewal->start_date
                ? date('d-M-Y', strtotime( $overlapRenewal->start_date))
                : '';
            $conflictEnd = $overlapRenewal->end_date
                ? date('d-M-Y', strtotime( $overlapRenewal->end_date))
                : $conflictStart;
            if ($conflictStart !== '' && $conflictEnd !== '') {
                $msg .= ' (' . $conflictStart . ' – ' . $conflictEnd . ')';
            }
            return DV::error($msg);
        }
        // Always honor negotiated contract price on renewal (not building-space list price).
        $renewPrice = $old->price;
        $renewPriceType = $old->price_type;
        $updateContract = [
            'end_date'   => $inputs['end_date'],
            'price'      => $renewPrice,
            'price_type' => $renewPriceType,
            // 'remarks'    => $inputs['remarks'] ?? $old->remarks,
        ];
        $contractSpaceId = $old->space_id;
        $renewalSpaceId = $new_space_id;
        // Only sync contracts.space_id when renewal unit is already the live contract unit.
        // If renewal unit differs (pending move from a prior renewal), defer until start_date.
        if ($renewalSpaceId === $contractSpaceId && $renewalSpaceId > 0) {
            $updateContract['space_id'] = $renewalSpaceId;
        }
        DB::beginTransaction();
        $updated = DBX::saveData($ss, 'contracts', ['id' => $old->id], $updateContract, [], 1);
        if (!$updated) {
            DB::rollBack();
            return DV::error('Renew failed');
        }
        if ($renewalSpaceId === $contractSpaceId && $renewalSpaceId > 0) {
            $occupiedId = self::getSpaceOccupiedStatusId();
            if ($occupiedId) {
                DB::table('building_spaces')
                    ->where('id', $renewalSpaceId)
                    ->update(['status_id' => $occupiedId]);
            }
        }
        $now = getNowTime();
        $renewalRow = [
            'contract_id'   => $old->id,
            'space_id'      => $new_space_id,
            'renewal_date'  => $today,
            'start_date'    => $inputs['start_date'],
            'end_date'      => $inputs['end_date'],
            'status'        => 'active',
            'remarks'       => trim(($inputs['remarks'] ?? '')),
            'created_at'    => $now,
            'updated_at'    => $now,
            'create_uid'    => $ss->user_id ?? null,
            'update_uid'    => $ss->user_id ?? null,
            'create_user'   => $ss->full_name ?? null,
            'update_user'   => $ss->full_name ?? null,
        ];

        if (!empty($ss->branch_id)) {
            $renewalRow['branch_id'] = $ss->branch_id;
        }

        DB::table('contract_renewals')->insert($renewalRow);

        DB::commit();

        self::syncContractStatusAfterEndDateChange($old, $inputs['end_date']);
        self::syncTenantStatusForTenantIds([$old->tenant_id]);

        return DV::depends(1, [
            'contract_id' => $old->id
        ]);
    }

    /**
     * Cancel the latest renewal that has not started yet; restore contract end date (and status).
     */
    public function cancelPendingRenewal($id, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        if (!$id) {
            return DV::error('Contract not found');
        }

        $contract = DB::table('contracts')->where('id', $id)->first();
        if (!$contract) {
            return DV::error('Contract not found');
        }

        $pending = self::getLatestPendingRenewal($id);
        if (!$pending) {
            return DV::error('No pending renewal to cancel.');
        }

        $restoreEndDate = self::resolveContractEndDateBeforeRenewal($id, $pending);
        if (!$restoreEndDate) {
            return DV::error('Unable to determine the previous contract end date.');
        }

        DB::beginTransaction();
        try {
            DB::table('contract_renewals')->where('id', $pending->id)->delete();

            $updated = DBX::saveData($ss, 'contracts', ['id' => $id], [
                'end_date' => $restoreEndDate,
            ], [], 1);

            if (!$updated) {
                DB::rollBack();
                return DV::error('Failed to cancel renewal.');
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            return DV::error('Failed to cancel renewal.');
        }

        $contract->end_date = $restoreEndDate;
        self::syncContractStatusAfterEndDateChange($contract, $restoreEndDate);
        self::syncBuildingSpaceAvailabilityForSpaceIds([$contract->space_id, $pending->space_id]);
        self::syncTenantStatusForTenantIds([$contract->tenant_id]);

        return DV::depends(1, ['contract_id' => $id, 'action' => 'cancelled_renewal']);
    }

    /**
     * Update a renewal that has not started yet (dates, unit, remark).
     */
    public function updatePendingRenewal($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        if (!$id) {
            return DV::error('Contract not found');
        }

        $contract = DB::table('contracts')->where('id', $id)->first();
        if (!$contract) {
            return DV::error('Contract not found');
        }

        $pending = self::getLatestPendingRenewal($id);
        if (!$pending) {
            return DV::error('No pending renewal to modify.');
        }

        $previousRenewal = DB::table('contract_renewals')
            ->where('contract_id', $contract->id)
            ->where('id', '<', $pending->id)
            ->orderByDesc('id')
            ->select('space_id')
            ->first();
        $effectiveOldSpaceId = !empty($previousRenewal->space_id)
            ? $previousRenewal->space_id
            : $contract->space_id;

        $v_rule = [
            'start_date' => '1|date',
            'end_date'   => '1|date',
            'remarks'    => '0|string|0-255',
            'space_id'   => '0|number|exists=building_spaces.id',
        ];

        $res = DBX::validateObject($arr, $v_rule, 1, [], $ss->lang, 0, null);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $today = date('Y-m-d');
        $start = strtotime($inputs['start_date']);
        $end   = strtotime($inputs['end_date']);
        $todayTS = strtotime($today);

        if (date('Y-m-d', $start) <= $today) {
            return DV::error('Renewal has already started and cannot be modified.');
        }

        if ($end <= $start) {
            return DV::error('End date must be after start date');
        }

        if ($end < $todayTS) {
            return DV::error('End date cannot be in the past');
        }

        $minEnd = strtotime('+1 month', $start);
        if (date('d', $start) != date('d', $minEnd)) {
            $minEnd = strtotime(date('Y-m-t', $minEnd));
        }
        if ($end < strtotime('-1 day', $minEnd)) {
            return DV::error('Contract must be at least 1 month');
        }

        $new_space_id = !empty($inputs['space_id']) ? $inputs['space_id'] : $effectiveOldSpaceId;
        if ($new_space_id != $effectiveOldSpaceId) {
            $dup_id = self::checkDuplicateContract($new_space_id, $contract->id);
            if ($dup_id) {
                return DV::error('The selected unit already has a contract.');
            }
        }

        $overlapRenewal = self::findOverlappingRenewalOnUnit(
            $new_space_id,
            $inputs['start_date'],
            $inputs['end_date'],
            (int) $contract->id,
            (int) $pending->id
        );
        if ($overlapRenewal) {
            $unitCode = trim(($overlapRenewal->space_code ?? ''));
            $msg = 'Renewal dates overlap an existing contract period for unit '
                . ($unitCode !== '' ? $unitCode : 'this unit')
                . '.';
            return DV::error($msg);
        }

        $renewPrice = $contract->price;
        $renewPriceType = $contract->price_type;
        $updateContract = [
            'end_date'   => $inputs['end_date'],
            'price'      => $renewPrice,
            'price_type' => $renewPriceType,
        ];
        $contractSpaceId = $contract->space_id;
        $renewalSpaceId = $new_space_id;
        if ($renewalSpaceId === $contractSpaceId && $renewalSpaceId > 0) {
            $updateContract['space_id'] = $renewalSpaceId;
        }

        $now = getNowTime();
        $renewalUpdate = [
            'space_id'   => $new_space_id,
            'start_date' => $inputs['start_date'],
            'end_date'   => $inputs['end_date'],
            'remarks'    => trim(($inputs['remarks'] ?? '')),
            'updated_at' => $now,
            'update_uid' => $ss->user_id ?? null,
            'update_user' => $ss->full_name ?? null,
        ];

        DB::beginTransaction();
        try {
            $updated = DBX::saveData($ss, 'contracts', ['id' => $contract->id], $updateContract, [], 1);
            if (!$updated) {
                DB::rollBack();
                return DV::error('Failed to update renewal.');
            }

            DB::table('contract_renewals')
                ->where('id', $pending->id)
                ->update($renewalUpdate);

            if ($renewalSpaceId === $contractSpaceId && $renewalSpaceId > 0) {
                $occupiedId = self::getSpaceOccupiedStatusId();
                if ($occupiedId) {
                    DB::table('building_spaces')
                        ->where('id', $renewalSpaceId)
                        ->update(['status_id' => $occupiedId]);
                }
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            return DV::error('Failed to update renewal.');
        }

        self::syncContractStatusAfterEndDateChange($contract, $inputs['end_date']);
        self::syncTenantStatusForTenantIds([$contract->tenant_id]);

        return DV::depends(1, [
            'contract_id' => $contract->id,
            'renewal_id'  => $pending->id,
        ]);
    }


    public static function applyPendingRenewalUnitChanges()
    {
        $today = date('Y-m-d');
        $availableId = self::getSpaceAvailableStatusId();
        $occupiedId = self::getSpaceOccupiedStatusId();
        if (!$occupiedId) {
            return;
        }

        $pending = DB::table('contract_renewals as cr')
            ->join('contracts as c', 'c.id', '=', 'cr.contract_id')
            ->whereRaw('DATE(cr.start_date) = ?', [$today])
            ->whereColumn('c.space_id', '!=', 'cr.space_id')
            ->whereNotNull('cr.space_id')
            ->select('cr.contract_id', 'cr.space_id as new_space_id', 'c.space_id as old_space_id')
            ->get();

        foreach ($pending as $row) {
            $contractId = $row->contract_id;
            $newSpaceId = $row->new_space_id;
            $oldSpaceId = $row->old_space_id;
            if ($newSpaceId === $oldSpaceId) {
                continue;
            }
            DB::beginTransaction();
            try {
                DB::table('contracts')->where('id', $contractId)->update(['space_id' => $newSpaceId]);
                if ($oldSpaceId && $availableId) {
                    DB::table('building_spaces')->where('id', $oldSpaceId)->update(['status_id' => $availableId]);
                }
                if ($newSpaceId && $occupiedId) {
                    DB::table('building_spaces')->where('id', $newSpaceId)->update(['status_id' => $occupiedId]);
                }
                DB::commit();
            } catch (\Throwable $e) {
                DB::rollBack();
            }
        }
    }

    static function getTenantInfo($arr = [], $ss = null)
    {
        $d = (object) $arr;
        $tenant_id = $d->tenant_id ?? null;

        if (!$tenant_id) {
            return null;
        }

        $row = DB::table('tenants AS t')
            ->where('t.id', $tenant_id)
            ->selectRaw(
                '
                t.id AS tenant_id,
                t.name AS tenant_name,
                t.sex,
                t.legal_name,
                t.phone_number'

            )
            ->take(1)
            ->get()
            ->first();

        if (!$row) {
            return null;
        }
        return $row;
    }


    static function generateContractMonths($contract_id, $start_date = null, $end_date = null, $ss = null)
    {
        // 1. Fetch contract boundaries if not provided
        if (!$start_date || !$end_date) {
            $contract = DB::table('contracts')
                ->where('id', $contract_id)
                ->select('start_date', 'end_date')
                ->first();

            if (!$contract) return [];

            $start_date = $contract->start_date;
            $end_date   = $contract->end_date;
        }

        // 2. Query the last payment
        $lastPaidEntry = DB::table('invoice_items as ii')
            ->join('contracts as c', 'ii.item_id', '=', 'c.id')
            ->where('c.id', $contract_id)
            ->orderBy('ii.created_at', 'DESC')
            ->select('ii.end_date')
            ->first();

        if ($lastPaidEntry && !empty($lastPaidEntry->end_date)) {

            // We add 1 day to start the next period.
            $start_date = \Carbon\Carbon::parse($lastPaidEntry->end_date)->addDay()->format('Y-m-d');

            \Log::info("Adjusting start date based on last payment", [
                'contract_id' => $contract_id,
                'last_end_date' => $lastPaidEntry->end_date,
                'new_start_date' => $start_date
            ]);
        }

        try {
            $start = \Carbon\Carbon::parse($start_date)->startOfDay();
            $end   = \Carbon\Carbon::parse($end_date)->endOfDay();
        } catch (\Exception $e) {
            \Log::error("Date parsing failed", ['error' => $e->getMessage()]);
            return [];
        }

        // 3. If contract is fully paid (start > end), return empty
        if ($start->gt($end)) {
            return [];
        }

        $months = [];
        $current = $start->copy()->startOfMonth();

        while ($current->lte($end)) {
            $monthStart = $current->copy()->startOfMonth();
            $monthEnd   = $current->copy()->endOfMonth();

            // Adjust for mid-month start dates
            if ($monthStart->lt($start)) {
                $monthStart = $start->copy();
            }

            // Adjust for contract end date
            if ($monthEnd->gt($end)) {
                $monthEnd = $end->copy();
            }

            $months[] = [
                'month'      => $current->format('M Y'),
                'start_date' => $monthStart->format('j-M-Y'),
                'end_date'   => $monthEnd->format('j-M-Y'),
            ];

            $current->addMonthNoOverflow()->startOfMonth();
        }

        return $months;
    }
}
