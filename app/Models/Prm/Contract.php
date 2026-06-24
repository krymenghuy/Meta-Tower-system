<?php

namespace App\Models\Prm;

use App\Models\Prm\GeneralSettings;
use App\Models\CompanyProfile;
use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use XPublicStorage;
use PhpOffice\PhpWord\TemplateProcessor;
use Carbon\Carbon;
use XBranch;
use XSubscriber;
use XSubscription;

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
            return DV::error('required_select_tenant');
        }

        $businessTypeId = $arr['business_type_id'] ?? null;
        if ($businessTypeId === null || $businessTypeId === '' || !is_numeric($businessTypeId)) {
            return DV::error('select_business_type');
        }

        $spaceId = $arr['space_id'] ?? null;
        if ($spaceId === null || $spaceId === '' || !is_numeric($spaceId)) {
            return DV::error('select_unit_code');
        }

        $deposit = $arr['deposit'] ?? null;
        if ($deposit === null || $deposit === '') {
            return DV::error('select_deposit');
        }
        if (!is_numeric($deposit)) {
            return DV::error('select_deposit');
        }

        $startDate = trim(($arr['start_date'] ?? ''));
        if ($startDate === '') {
            return DV::error('select_start_date');
        }

        $endDate = trim(($arr['end_date'] ?? ''));
        if ($endDate === '') {
            return DV::error('select_end_date');
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
            return DV::error('contract_not_found.');
        }

        $existing = DB::table('contracts')->where('id', $id)->first();
        if (!$existing) {
            return DV::error('contract_not_found.');
        }

        $businessTypeId = $arr['business_type_id'] ?? null;
        if ($businessTypeId === null || $businessTypeId === '' || !is_numeric($businessTypeId)) {
            return DV::error('select_business_type');
        }

        $deposit = $arr['deposit'] ?? null;
        if ($deposit === null || $deposit === '') {
            return DV::error('select_deposit');
        }
        if (!is_numeric($deposit)) {
            return DV::error('select_deposit');
        }

        $v_rule = [
            'business_type_id' => '1|number|exists=business_types.id|text=select_business_type',
            'deposit'          => '1|number|text=select_deposit',
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

        self::autoSaveDeposit($id, $existing->tenant_id, $res->values['deposit'], $existing->start_date, $res->values['remarks'] ?? $existing->remarks, $ss);

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
            'tenant_id'        => '1|number|exists=tenants.id|text=select_tenant',
            'legal_name'       => '0|string|0-100',
            'business_type_id' => '1|number|exists=business_types.id|text=select_business_type',
            'space_id'         => '1|number|exists=building_spaces.id|text=select_unit_code',
            'deposit'          => '1|number|text=select_deposit',
            'start_date'       => '1|date|text=select_start_date',
            'end_date'         => '1|date|text=select_end_date',
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
            return DV::error('select_start_date');
        }
        if ($end === false) {
            return DV::error('select_end_date');
        }
        if ($end <= $start) {
            return DV::error('end_date_must_be_after_start_date');
        }
        $todayStr = date('Y-m-d');
        $endInput = $inputs['end_date'] ?? '';
        if ($endInput !== '' && $endInput < $todayStr) {
            if ($id) {
                $prevEnd = DB::table('contracts')->where('id', $id)->value('end_date');
                $prevEndStr = $prevEnd ? date('Y-m-d', strtotime((string) $prevEnd)) : '';
                if ($prevEndStr !== $endInput) {
                    return DV::error('end_date_cannot_be_in_the_past');
                }
            } else {
                return DV::error('end_date_cannot_be_in_the_past.');
            }
        }
        $minEnd = strtotime('-1 day', strtotime('+1 month', $start));
        $startDay = date('d', $start);
        $calcDay  = date('d', strtotime('+1 month', $start));
        if ($startDay != $calcDay) {
            $minEnd = strtotime('-1 day', strtotime(date('Y-m-t', strtotime('+1 month', $start))));
        }
        if ($end < $minEnd) {
            return DV::error('end_date_must_be_at_least_one_month_after_start_date');
        }
        $space_id  = $inputs['space_id'] ?? null;
        $tenant_id = $inputs['tenant_id'] ?? null;
        $bookingPhoneValidation = self::validateBookingTenantPhone($space_id, $tenant_id, true);
        if (!($bookingPhoneValidation->status ?? false)) {
            return DV::error($bookingPhoneValidation->message ?? 'select_tenant_before_create_contract');
        }
        $dup_id = self::checkDuplicateContract($space_id, $id);
        if ($dup_id) {
            return DV::error('this_space_already_has_a_contract');
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
                    return DV::error('start_date_must_be_on_or_before_the_last_renewal_start');
                }
                if ($isOverlapRenewal) {
                    return DV::error('dates_overlap_the_last_renewal_for_this_unit');
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

            self::autoSaveDeposit($id, $tenant_id, $inputs['deposit'], $inputs['start_date'], $inputs['remarks'] ?? null, $ss);
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
        $startB = date('Y-m-d', strtotime($startB));
        $endB = date('Y-m-d', strtotime($endB));

        return $startA <= $endB && $endA >= $startB;
    }

    /**
     * Find a renewal on the same unit (from another contract) whose period overlaps the given range.
     */
    public static function findOverlappingRenewalOnUnit($spaceId, $startDate, $endDate, $excludeContractId)
    {
        $spaceId = $spaceId;
        $excludeContractId = $excludeContractId;
        if ($spaceId <= 0 || !$startDate || !$endDate) {
            return null;
        }

        $startDate = date('Y-m-d', strtotime($startDate));
        $endDate = date('Y-m-d', strtotime($endDate));

        return DB::table('contract_renewals as cr')
            ->join('building_spaces as bs', 'bs.id', '=', 'cr.space_id')
            ->where('cr.space_id', $spaceId)
            ->where('cr.contract_id', '<>', $excludeContractId)
            ->whereRaw('DATE(cr.start_date) <= ?', [$endDate])
            ->whereRaw('DATE(COALESCE(cr.end_date, cr.start_date)) >= ?', [$startDate])
            ->select('bs.code as space_code', 'cr.start_date', 'cr.end_date', 'cr.contract_id')
            ->first();
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
        $selectCols = 'c.id,c.tenant_id,t.name as tenant_name,t.code,t.email,t.phone_number,c.legal_name,c.status_id,cs.name as status,' . $start_date . ',' . $end_date . ',' . $lastRenewalDate . ',c.business_type_id,bt.name as business_type,c.space_type_id,st.name as space_type,c.space_id, bs.code as space_code,c.sqm_size,c.price,c.price_type,c.deposit,c.remarks,c.update_user,' . $updated_at . '';
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
        $latestRenewal = DB::table('contract_renewals')
            ->where('contract_id', $id)
            ->orderByDesc('id')
            ->select('space_id')
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
                            t.phone_number,
                            t.email,
                            bt.name as business_name,
                            st.name as space_name
                            ')
            ->first();
        if ($row) {
            $renewalSpaceId = $latestRenewal->space_id ?? null;
            if (!empty($renewalSpaceId) && $renewalSpaceId > 0) {
                $renewalSpaceCode = DB::table('building_spaces')
                    ->where('id',  $renewalSpaceId)
                    ->value('code');
                if (!empty($renewalSpaceCode)) {
                    $row->space_id = $renewalSpaceId;
                    $row->space_code = $renewalSpaceCode;
                }
            }
            $endTs = strtotime($row->end_date);
            $row->renew_start_date = date('Y-m-d', strtotime('+1 day', $endTs));
            setOfficialDates($row, ['start_date', 'end_date', 'renew_start_date'], [], []);

            $row->refund_details = DB::table('deposit_refunds')
                ->where('contract_id', $id)
                ->orderBy('id', 'desc')
                ->first();

            $deposit = DB::table('deposits as d')
                ->leftJoin('deposit_statuses as ds', 'ds.id', '=', 'd.status_id')
                ->where('d.contract_id', $id)
                ->select('ds.status_code')
                ->first();
            $row->deposit_status = $deposit->status_code ?? 'pending';
        }
        return $row;
    }

    public static function getFormOptions($id, $ss, $space_id = null, $include_space_ids = [], $restrict_to_include_spaces = false)
    {
        $contract_details = $id ? self::contractDetails($id) : null;
        $current_space_id = $contract_details->space_id ?? $space_id;
        $normalizedIncludeIds = [];
        foreach ($include_space_ids as $sid) {
            $sid = $sid;
            if ($sid > 0) {
                $normalizedIncludeIds[$sid] = true;
            }
        }
        if (!empty($current_space_id)) {
            $normalizedIncludeIds[$current_space_id] = true;
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
            return DV::error('invalid_id');
        }
        $contract = DB::table('contracts')->where('id', $id)->first();
        if (!$contract) {
            return DV::error('contract_not_found');
        }

        $sid = $contract->status_id;
        $canDelete = in_array($sid, [
            self::getPendingStatusId(),
            self::getExpiredStatusId(),
            self::getTerminatedStatusId(),
        ], true);
        if (!$canDelete) {
            return DV::error('only_pending_expired_or_terminated_contracts_can_be_deleted');
        }

        DB::beginTransaction();
        try {
            DB::table('contract_renewals')->where('contract_id', $id)->delete();
            DB::table('deposits')->where('contract_id', $id)->delete();
            DB::table('deposit_refunds')->where('contract_id', $id)->delete();

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
    public function terminateContract($id, $ss = null, $data = [])
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

        $hasPendingDeposit = DB::table('deposits as d')
            ->leftJoin('deposit_statuses as ds', 'ds.id', '=', 'd.status_id')
            ->where('d.contract_id', $id)
            ->where(function ($q) {
                $q->whereIn(DB::raw('LOWER(TRIM(ds.status_code))'), ['pending', 'unpaid'])
                  ->orWhereNull('d.status_id');
            })
            ->exists();

        if ($hasPendingDeposit) {
            return DV::error('Cannot terminate contract because the deposit is still pending/unpaid.');
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

            // Parse and validate refund details
            $depositAmount = isset($data['deposit_amount']) ? floatval($data['deposit_amount']) : 0;
            $deductAmount = isset($data['deduct_amount']) ? floatval($data['deduct_amount']) : 0;
            $refundAmount = isset($data['refund_amount']) ? floatval($data['refund_amount']) : ($depositAmount - $deductAmount);
            if ($refundAmount < 0) {
                $refundAmount = 0;
            }
            $remarks = $data['remarks'] ?? null;

            if ($deductAmount > $depositAmount) {
                DB::rollBack();
                return DV::error('Deduction cannot exceed deposit amount.');
            }

            // Save deposit refund details
            DB::table('deposit_refunds')->insert([
                'contract_id' => $id,
                'deposit_amount' => $depositAmount,
                'deduct_amount' => $deductAmount,
                'refund_amount' => $refundAmount,
                'remarks' => $remarks,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Update associated deposits to Refunded status
            $refundedDepositStatusId = DB::table('deposit_statuses')
                ->where(function ($q) {
                    $q->whereRaw('LOWER(TRIM(name)) = ?', ['refunded'])
                        ->orWhereRaw('LOWER(TRIM(status_code)) = ?', ['refunded']);
                })
                ->value('id') ?? 3;

            DB::table('deposits')
                ->where('contract_id', $id)
                ->update([
                    'status_id' => $refundedDepositStatusId,
                    'update_user' => $ss->full_name ?? 'Admin',
                    'updated_at' => getNowTime(),
                ]);

            DB::commit();
            return DV::depends(1, ['id' => $id]);
        } catch (\Throwable $e) {
            DB::rollBack();
            return DV::error('Failed to terminate contract: ' . $e->getMessage());
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
                ? date('d-M-Y', strtotime($overlapRenewal->start_date))
                : '';
            $conflictEnd = $overlapRenewal->end_date
                ? date('d-M-Y', strtotime($overlapRenewal->end_date))
                : $conflictStart;
            if ($conflictStart !== '' && $conflictEnd !== '') {
                $msg .= ' (' . $conflictStart . ' – ' . $conflictEnd . ')';
            }
            return DV::error($msg);
        }
        // Always honor negotiated contract price on renewal (not building-space list price).
        $renewPrice = $old->price;
        $renewPriceType = $old->price_type;
        // Renewal remark is stored on contract_renewals only; do not overwrite contracts.remarks.
        $updateContract = [
            'end_date'   => $inputs['end_date'],
            'price'      => $renewPrice,
            'price_type' => $renewPriceType,
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

        self::syncTenantStatusForTenantIds([$old->tenant_id]);

        return DV::depends(1, [
            'contract_id' => $old->id
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
            // \Log::error("Date parsing failed", ['error' => $e->getMessage()]);
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
    static function createContract($d, $ss)
    {
        $id = $d->id;
        $tenant_address = $d->address ?? null;
        $tenant = DB::table('tenants as t')
            ->join('contracts as c', 'c.tenant_id', '=', 't.id')
            ->join('building_spaces as bs', 'bs.id', '=', 'c.space_id')
            ->join('buildings as b', 'b.id', '=', 'bs.building_id')
            ->where('t.id', $id)
            ->selectRaw("t.id,t.branch_id,t.name,t.name_kh,t.code,t.national_id,t.passport_number,t.date_of_birth,t.nationality_id,t.sex,t.tenant_type,t.status_id,t.legal_name,t.phone_number,t.email,t.address,c.start_date,c.end_date,bs.code as unit_code,bs.floor_id,b.name as building,c.sqm_size,c.price,c.price_type,c.deposit")
            ->first();
        if (!$tenant) {
            return DV::error("tenant_does_not_exist::{$id}");
        }

        $x = new CompanyProfile($ss);
        $p = (object) $x->getDetails($ss);

        $p->branches = [
            (object) ['address_kh' => $p->address_kh ?? '', 'address' => $p->address ?? '', 'phone_number' => $p->phone_number ?? '', 'email' => $p->email ?? ''],
            (object) ['address_kh' => 'ផ្ទះលេខ១២ ផ្លូវ៤៥៤ សង្កាត់ទួលទំពូងទី១ ខណ្ឌចំការមន រាជធានីភ្នំពេញ', 'address' => '#16, St.454, Sangkat Toul Tum Poung 1, Khan Chamkarmon, Phnom Penh', 'phone_number' => $p->phone_number ?? '', 'email' => $p->email ?? ''],
        ];

        $com_rep_name = $p->first_cp_name ?? 'CP Name';
        $com_rep_nid = $p->first_cp_nid ?? '(ID Card)';
        $com_rep_sex = $p->first_cp_sex ?? 'Sex';
        $com_rep_title = match ($com_rep_sex) {
            'M' => 'លោក',
            'F' => 'កញ្ញា',
            default => '',
        };
        $com_rep_full_name = $com_rep_title . ' ' . ($com_rep_name ?? '');
        $com_rep_dob = $p->first_cp_dob ?? '';
        $com_rep_nid_issue_date = $p->first_cp_nid_issue_date ?? '';
        $com_rep_address = $p->first_cp_address ?? '';
        $com_address = $p->billing_address ?? '';

        $tenant_name = $tenant->name_kh;
        $tenant_sex = $tenant->sex ?? '(Sex)';
        $tenant_title = match ($tenant_sex) {
            'M' => 'លោក',
            'F' => 'កញ្ញា',
            default => '',
        };
        $tenant_full_name = $tenant_title . ' ' . ($tenant_name ?? '');
        $tenant_nid = $tenant->national_id ?? '';
        $tenant_phone = $tenant->phone_number ?? '';
        $tenant_address = $tenant_address ?? $tenant->address;
        $start_date = $tenant->start_date ?? '';
        $end_date = $tenant->end_date ?? '';
        $lease_term = Carbon::parse($start_date)
            ->diffInMonths(Carbon::parse($end_date));
        $unit = $tenant->unit_code ?? '';
        $floor = $tenant->floor_id ?? '';
        $building = $tenant->building ?? '';
        $monthly_price = $tenant->price_type === 'sqm'
            ? $tenant->sqm_size * $tenant->price
            : $tenant->price;
        $deposit = $tenant->deposit;


        $price_text = number_format($monthly_price, 2);

        $data = [
            'issue_date' => getKhmerDate(null),
            'kh_issue_date' => self::getKhmerLunarDate(null),
            'com_address' => $com_address,
            'com_rep_full_name' => $com_rep_full_name,
            'com_rep_name' => $com_rep_name,
            'com_rep_sex' => self::getSex($com_rep_sex),
            'com_rep_dob' => getKhmerDate($com_rep_dob),
            'com_rep_nid' => $com_rep_nid,
            'com_rep_nid_issue_date' => getKhmerDate($com_rep_nid_issue_date),
            'com_rep_address' => $com_rep_address,

            'tenant_full_name' => $tenant_full_name,
            'tenant_name' => $tenant_name,
            'tenant_code' => $tenant->code ?? '(ID)',
            'tenant_sex' => self::getSex($tenant_sex),


            'tenant_phone' => $tenant_phone,
            'tenant_nid' => $tenant_nid,
            'tenant_nid_issue_date' => getKhmerDate($com_rep_nid_issue_date),

            'building' => $building,
            'unit' => $unit,
            'floor' => $floor == 0 ? 'ជាន់ផ្ទាល់ដី' : 'ជាន់ទី ' . convertToKhmerNumerals($floor),
            'start_date' => $start_date ? getKhmerDate($start_date) : '',
            'end_date' => $end_date ? getKhmerDate(self::calculateEndDate($end_date)) : '',
            'lease_term' => $lease_term . ' ខែ',

            // 'position' => $emp_position,
            // 'salary_level' => $emp_salary,
            // 'khr_amount' => $emp_salary,
            // 'khr_amount_in_word' => self::convertToKhmerWords($emp_salary),
            'monthly_price' => '$' . $monthly_price,
            'deposit' => '$' . $deposit,
            'deposit_in_word' => self::convertToKhmerWords($deposit) . 'ដុល្លារសហរដ្ឋអាមេរិក',
            'monthly_in_word' => self::convertToKhmerWords($monthly_price) . 'ដុល្លារសហរដ្ឋអាមេរិក',
            'tenant_address' => $tenant_address,
            'tenant_dob' => getKhmerDate($tenant->date_of_birth ?? null),
            'signature_date' => getKhmerDate(null),
        ];
        // dd($data);

        // Define the template path
        $templatePath = base_path('/storage/doc_templates/staff_contract_unlimited.docx');
        if (!file_exists($templatePath)) {
            \Log::error("Contract Template file not found at {$templatePath}");
            return DV::error('Contract_template_not_found');
        }

        // Load the template
        $templateProcessor = new TemplateProcessor($templatePath);

        // Replace placeholders with actual values
        foreach ($data as $key => $value) {
            $templateProcessor->setValue($key, $value);
        }

        // Create a temporary file in memory
        $tempFile = tempnam(sys_get_temp_dir(), 'contract');
        $templateProcessor->saveAs($tempFile);

        // Set headers for force download
        $fileName = 'contract_' . $data['tenant_code'] . '.docx';
        header('Content-Description: File Transfer');
        header('Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        header('Content-Disposition: attachment; filename="' . $fileName . '"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($tempFile));

        // Prevent buffer issues
        ob_clean();
        flush();
        readfile($tempFile);

        // Delete temporary file
        unlink($tempFile);
        exit;
    }
    static function getSex($sex)
    {
        if ($sex === 'M') return 'ប្រុស';
        else if ($sex === 'F') return 'ស្រី';
        else 'មិនប្រាប់';
    }
    static function calculateEndDate($startDate)
    {
        if (!$startDate) {
            return null;
        }
        return Carbon::parse($startDate)->addMonths(3)->format('Y-m-d');
    }
    public static function convertToKhmerWords($number)
    {
        $ones = [
            '',
            'មួយ',
            'ពីរ',
            'បី',
            'បួន',
            'ប្រាំ',
            'ប្រាំមួយ',
            'ប្រាំពីរ',
            'ប្រាំបី',
            'ប្រាំបួន'
        ];

        if ($number == 0) {
            return 'សូន្យ';
        }

        $number = (int) str_replace(',', '', $number);

        $result = '';

        $millions = floor($number / 1000000);
        if ($millions > 0) {
            $result .= self::convertToKhmerWords($millions) . 'លាន';
            $number %= 1000000;
        }

        $thousands = floor($number / 1000);
        if ($thousands > 0) {
            $result .= self::convertToKhmerWordsBelow1000($thousands) . 'ពាន់';
            $number %= 1000;
        }

        if ($number > 0) {
            $result .= self::convertToKhmerWordsBelow1000($number);
        }

        return trim($result);
    }
    // static function convertToKhmerWords($number) {
    //     $khmerDigits = ['0' => 'សូន្យ', '1' => 'មួយ', '2' => 'ពីរ', '3' => 'បី', '4' => 'បួន', '5' => 'ប្រាំ', '6' => 'ប្រាំមួយ', '7' => 'ប្រាំពីរ', '8' => 'ប្រាំបី', '9' => 'ប្រាំបួន'];
    //     $khmerUnits = ['', 'ម៉ឺន', 'សែន', 'លាន', 'កោដិ'];

    //     // Convert the number to an integer if it ends with .00
    //     if (strpos($number, '.') !== false) {
    //         $number = rtrim(rtrim($number, '0'), '.'); // Remove trailing .00 or .0
    //     }

    //     // Split the number into integer and decimal parts
    //     $parts = explode('.', strval($number));
    //     $integerPart = $parts[0];

    //     // Convert the integer part
    //     $integerInWords = '';
    //     $length = strlen($integerPart);

    //     for ($i = 0; $i < $length; $i++) {
    //         $digit = $integerPart[$i];
    //         $position = $length - $i - 1;

    //         if ($digit !== '0') {
    //             $integerInWords .= $khmerDigits[$digit] . ' ' . ($khmerUnits[$position % 4] ?? '') . ' ';
    //         }

    //         if ($position % 4 === 0 && $position !== 0) {
    //             $integerInWords .= 'លាន ';
    //         }
    //     }

    //     return trim($integerInWords);
    // }

    private static function convertToKhmerWordsBelow1000($number)
    {
        $ones = [
            '',
            'មួយ',
            'ពីរ',
            'បី',
            'បួន',
            'ប្រាំ',
            'ប្រាំមួយ',
            'ប្រាំពីរ',
            'ប្រាំបី',
            'ប្រាំបួន'
        ];

        $result = '';

        $hundreds = floor($number / 100);
        if ($hundreds > 0) {
            $result .= $ones[$hundreds] . 'រយ';
            $number %= 100;
        }

        $tens = floor($number / 10);
        if ($tens > 0) {
            if ($tens == 1) {
                $result .= 'ដប់';
            } else {
                $result .= $ones[$tens] . 'សិប';
            }
            $number %= 10;
        }

        if ($number > 0) {
            $result .= $ones[$number];
        }

        return $result;
    }
    public static function getKhmerLunarDate($date = null)
    {
        $date = $date ? Carbon::parse($date) : Carbon::now();

        // Week days
        $weekDays = [
            'Sunday' => 'ថ្ងៃអាទិត្យ',
            'Monday' => 'ថ្ងៃចន្ទ',
            'Tuesday' => 'ថ្ងៃអង្គារ',
            'Wednesday' => 'ថ្ងៃពុធ',
            'Thursday' => 'ថ្ងៃព្រហស្បតិ៍',
            'Friday' => 'ថ្ងៃសុក្រ',
            'Saturday' => 'ថ្ងៃសៅរ៍',
        ];

        // Lunar days (simplified mapping example)
        $lunarDays = [
            1 => '១កើត',
            2 => '២កើត',
            3 => '៣កើត',
            4 => '៤កើត',
            5 => '៥កើត',
            6 => '៦កើត',
            7 => '៧កើត',
            8 => '៨កើត',
            9 => '៩កើត',
            10 => '១០កើត',
            11 => '១១កើត',
            12 => '១២កើត',
            13 => '១៣កើត',
            14 => '១៤កើត',
            15 => '១៥កើត',
            16 => '១រោច',
            17 => '២រោច',
            18 => '៣រោច',
            19 => '៤រោច',
            20 => '៥រោច',
            21 => '៦រោច',
            22 => '៧រោច',
            23 => '៨រោច',
            24 => '៩រោច',
            25 => '១០រោច',
            26 => '១១រោច',
            27 => '១២រោច',
            28 => '១៣រោច',
            29 => '១៤រោច',
            30 => '១៥រោច',
        ];

        // Khmer months (example)
        $months = [
            1 => 'មករា',
            2 => 'កុម្ភៈ',
            3 => 'មិនា',
            4 => 'មេសា',
            5 => 'ឧសភា',
            6 => 'មិថុនា',
            7 => 'កក្កដា',
            8 => 'សីហា',
            9 => 'កញ្ញា',
            10 => 'តុលា',
            11 => 'វិច្ឆិកា',
            12 => 'ធ្នូ',
        ];

        // Zodiac years (cycle example)
        $zodiac = [
            'Rat' => 'ឆ្នាំជូត',
            'Ox' => 'ឆ្នាំឆ្លូវ',
            'Tiger' => 'ឆ្នាំខាល',
            'Rabbit' => 'ឆ្នាំថោះ',
            'Dragon' => 'ឆ្នាំរោង',
            'Snake' => 'ឆ្នាំម្សាញ់',
            'Horse' => 'ឆ្នាំមមី',
            'Goat' => 'ឆ្នាំមមែ',
            'Monkey' => 'ឆ្នាំវក',
            'Rooster' => 'ឆ្នាំរកា',
            'Dog' => 'ឆ្នាំច',
            'Pig' => 'ឆ្នាំកុរ',
        ];

        $dayName = $weekDays[$date->format('l')];

        $day = (int) $date->format('j');
        $lunarDay = $lunarDays[$day] ?? '';

        $month = $months[(int) $date->format('n')];

        // Simple zodiac calculation (not fully astronomically exact)
        $zodiacKeys = array_values($zodiac);
        $zodiacIndex = ($date->year - 4) % 12;
        $yearZodiac = $zodiacKeys[$zodiacIndex] ?? '';

        $buddhistYear = self::toKhmerNumber($date->year + 543);
        return "{$dayName} {$lunarDay} ខែ{$month} {$yearZodiac} សប្តស័ក ព.ស. {$buddhistYear}";
    }
    public static function toKhmerNumber($number)
    {
        $map = ['0' => '០', '1' => '១', '2' => '២', '3' => '៣', '4' => '៤', '5' => '៥', '6' => '៦', '7' => '៧', '8' => '៨', '9' => '៩'];

        return strtr($number, $map);
    }

    public static function autoSaveDeposit($contractId, $tenantId, $amount, $startDate, $remarks, $ss)
    {
        $existing = DB::table('deposits')->where('contract_id', $contractId)->first();

        $saveData = [
            'contract_id'  => $contractId,
            'tenant_id'    => $tenantId,
            'amount'       => $amount,
            'deposit_date' => $startDate,
            'remarks'      => $remarks,
        ];

        if (!$existing) {
            $saveData['status_id']   = 1;
            $saveData['paid_amount'] = 0.00;
        }

        $where = $existing ? ['id' => $existing->id] : [];
        DBX::saveData($ss, 'deposits', $where, $saveData, [], 1);
    }
}
