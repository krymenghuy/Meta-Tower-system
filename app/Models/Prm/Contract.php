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
    public function saveContract($arr = [], $id = null, $ss = null)
{
    $id = $id ?? $this->id;
    $ss = $ss ?? $this->userInfo;
    $subs_id = $ss->subs_id ?? getCurrentSubsId(true);

    $v_rule = [
        'tenant_id'        => '1|number|exists=tenants.id',
        'legal_name'       => '0|string|0-100',
        'business_type_id' => '1|number|exists=business_types.id',
        'space_type_id'    => '1|number|exists=space_types.id',
        'status_id'        => '1|number|default = 1',
        'space_id'         => '1|number|exists=building_spaces.id',
        'sqm_size'         => '0|number',
        'price'            => '0|number',
        'price_type'       => '0|string|default=sqm',
        'start_date'       => '1|date',
        'end_date'         => '1|date',
        'deposit'          => '0|number',
        'deposit_remarks'  => '0|string|0-255',
        'remarks'          => '0|string|0-255',
    ];

    $legal_name_char = ['@', ',', '.', '#'];

    $res = DBX::validateObject($arr, $v_rule, 1, ['legal_name' => $legal_name_char], $ss->lang, 0, null);
    if ($res->error) return DV::error($res->error);

    $inputs = $res->values;

   $start = strtotime($inputs['start_date']);
    $end   = strtotime($inputs['end_date']);

    if ($end <= $start) {
        return DV::error('End date must be after start date.');
    }

    $minEnd = strtotime('-1 day', strtotime('+1 month', $start));
    $startDay = date('d', $start);
    $calcDay  = date('d', strtotime('+1 month', $start));

    if ($startDay != $calcDay) {
        $minEnd = strtotime('-1 day', strtotime(date('Y-m-t', strtotime('+1 month', $start))));
    }
    if ($end < $minEnd) {
        return DV::error('Contract must be at least 1 calendar month.');
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
    if ($created) {
        $today = date('Y-m-d');
        $isActiveNow = !empty($inputs['start_date']) && $inputs['start_date'] <= $today;
        $inputs['status_id'] = $isActiveNow
            ? self::getActiveStatusId()
            : self::getPendingStatusId();
    }
    $id = DBX::saveData($ss, 'contracts', ['id' => $id], $inputs, [], 1);
    if ($id) {
        $occupiedStatusId = self::getSpaceOccupiedStatusId();
        if ($space_id && $occupiedStatusId) {
            DB::table('building_spaces')
                ->where('id', $space_id)
                ->update(['status_id' => $occupiedStatusId]);
        }
        $hasActive = DB::table('contracts')
            ->where('tenant_id', $tenant_id)
            ->whereDate('end_date', '>=', date('Y-m-d'))
            ->exists();
        DB::table('tenants')
            ->where('id', $tenant_id)
            ->update(['status_id' => $hasActive ? 2 : 3]);
    }
    if ($id > 0) {
        return DV::depends(1, ['contracts' => $inputs, 'id' => $id]);
    }
    return DV::error($created ? 'Create failed.' : 'Update failed.');
}
    // public function saveContract($arr = [], $id = null, $ss = null)
    // {
    //     $id = $id ?? $this->id;
    //     $ss = $ss ?? $this->userInfo;
    //     $subs_id = $ss->subs_id ?? getCurrentSubsId(true);

    //     $v_rule = [
    //         'tenant_id'        => '1|number|exists=tenants.id',
    //         'legal_name'       => '0|string|0-100',
    //         'business_type_id' => '1|number|exists=business_types.id',
    //         'space_type_id'    => '1|number|exists=space_types.id',
    //         'status_id'        => '1|number|default = 1', //-- 1=active, 2=expired, 3=terminated
    //         'space_id'         => '1|number|exists=building_spaces.id',
    //         // 'space_status_id'  => '1|number|in=3,4', // Reserved | Occupied
    //         'sqm_size'         => '0|number',
    //         'price'            => '0|number',
    //         'price_type'       => '0|string|default=sqm',
    //         'start_date'       => '1|date',
    //         'end_date'         => '1|date',
    //         'deposit'   => '0|number',
    //         'deposit_remarks'  => '0|string|0-255',
    //         'remarks'          => '0|string|0-255',
    //     ];
    //     $legal_name_char = ['@', ',', '.', '#'];

    //     $res = DBX::validateObject($arr, $v_rule, 1, ['legal_name' => $legal_name_char], $ss->lang, 0, null);
    //     if ($res->error) return DV::error($res->error);
    //     // $allowSign = ['$', '#', '@', '!', '.', '-', '_', '=', '?'];
    //     $inputs = $res->values;
    //     $d = (object) $arr;
    //     $space_id = $d->space_id;
    //     $tenant_id = $inputs['tenant_id'] ?? null;
    //     $bookingPhoneValidation = self::validateBookingTenantPhone( $space_id, $tenant_id, true);
    //     if (!($bookingPhoneValidation->status ?? false)) {
    //         return DV::error($bookingPhoneValidation->message ?? 'Please create tenant before creating contract.');
    //     }
    //     $dup_id = self::checkDuplicateContract($space_id ?? null, $id);
    //     if ($dup_id) {
    //         return DV::error('This space already has a contract.');
    //     }
    //     $created = !$id;
    //     if ($created) {
    //         // New contract is Active when start date is today/past, otherwise Pending.
    //         $today = date('Y-m-d');
    //         $isActiveNow = !empty($inputs['start_date']) && $inputs['start_date'] <= $today;
    //         $inputs['status_id'] = $isActiveNow ? self::getActiveStatusId() : self::getPendingStatusId();
    //     }
    //     $id = DBX::saveData($ss, 'contracts', ['id' => $id], $inputs, [], 1);
    //     if ($id) {
    //         // Mark the unit (space) as Occupied when a contract uses it
    //         $occupiedStatusId = self::getSpaceOccupiedStatusId();
    //         if ($space_id && $occupiedStatusId) {
    //             DB::table('building_spaces')->where('id', $space_id)->update(['status_id' => $occupiedStatusId]);
    //         }
    //         $hasActive = DB::table('contracts')
    //             ->where('tenant_id', $inputs['tenant_id'])
    //             ->whereDate('end_date', '>=', now())
    //             ->exists();

    //         DB::table('tenants')->where('id', $inputs['tenant_id'])
    //             ->update(['status_id' => $hasActive ? 2 : 3]); // 2=Active, 3=Inactive
    //     }
    //     if ($id > 0) {
    //         return DV::depends(1, ['contracts' => $inputs, 'id' => $id]);
    //     }

    //     return DV::error($created ? 'Create failed.' : 'Update failed.');
    // }

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

    protected static function getActiveStatusId()
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
    protected static function getSpaceAvailableStatusId()
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
        $today = date('Y-m-d');
        $activeStatusId = self::getActiveStatusId();
        $pendingStatusId = self::getPendingStatusId();
        $expiredStatusId = self::getExpiredStatusId();

        // Pending -> Active when contract starts.
        DB::table('contracts')
            ->where('status_id', $pendingStatusId)
            ->whereDate('start_date', '<=', $today)
            ->whereDate('end_date', '>=', $today)
            ->update(['status_id' => $activeStatusId]);

        // Active/Pending -> Expired when contract end date has passed.
        DB::table('contracts')
            ->whereIn('status_id', [$activeStatusId, $pendingStatusId])
            ->whereDate('end_date', '<', $today)
            ->update(['status_id' => $expiredStatusId]);
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
                $endTs = strtotime($row->end_date);
                $row->renew_start_date = date('Y-m-d', strtotime('+1 day', $endTs));
                setOfficialDates($row, ['start_date', 'end_date','renew_start_date'], [], []);

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
        $id = $id ?? $this->id;
        $contract = DB::table('contracts')->where('id', $id)->first();
        if (!$contract) {
            return DV::error('Contract not found.');
        }

        DB::beginTransaction();
        try {
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
                $terminatedStatusId = self::getTerminatedStatusId();
                $hasActive = DB::table('contracts')
                    ->where('tenant_id', $tenant_id)
                    ->whereDate('end_date', '>=', now())
                    ->where('status_id', '!=', $terminatedStatusId)
                    ->exists();
                DB::table('tenants')->where('id', $tenant_id)
                    ->update(['status_id' => $hasActive ? 2 : 3]); // 2=Active, 3=Inactive
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
                $availableId = self::getSpaceAvailableStatusId();
                if ($availableId) {
                    DB::table('building_spaces')->where('id', $space_id)->update(['status_id' => $availableId]);
                }
            }

            $tenant_id = $contract->tenant_id ?? null;
            if ($tenant_id) {
                $hasActive = DB::table('contracts')
                    ->where('tenant_id', $tenant_id)
                    ->where('id', '!=', $id)
                    ->whereDate('end_date', '>=', now())
                    ->where('status_id', '!=', $terminatedStatusId)
                    ->exists();
                DB::table('tenants')->where('id', $tenant_id)
                    ->update(['status_id' => $hasActive ? 2 : 3]); // 2=Active, 3=Inactive
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
        $new_space_id = !empty($inputs['space_id']) ? $inputs['space_id'] : $old->space_id;
        if ($new_space_id != $old->space_id) {
            $dup_id = self::checkDuplicateContract($new_space_id, $old->id);
            if ($dup_id) {
                return DV::error('The selected unit already has a contract.');
            }
        }
        $unitChanged = $new_space_id != $old->space_id;
        $updateContract = [
            'end_date'   => $inputs['end_date'],
            'price'      => $inputs['price'] ?? $old->price,
            'price_type' => $inputs['price_type'] ?? $old->price_type,
            'remarks'    => $inputs['remarks'] ?? $old->remarks,
        ];
        if (!$unitChanged) {
            $updateContract['space_id'] = $new_space_id;
        }
        DB::beginTransaction();
        $updated = DBX::saveData($ss, 'contracts', ['id' => $old->id], $updateContract, [], 1);
        if (!$updated) {
            DB::rollBack();
            return DV::error('Renew failed');
        }
        if (!$unitChanged && $new_space_id) {
            $occupiedId = self::getSpaceOccupiedStatusId();
            if ($occupiedId) {
                DB::table('building_spaces')
                    ->where('id', $new_space_id)
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
            'remarks'       => trim((string)($inputs['remarks'] ?? '')),
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

        return DV::depends(1, [
            'contract_id' => $old->id
        ]);
    }
    // public function renewContract($arr = [], $id = null, $ss = null)
    // {
    //     $id = $id ?? $this->id;
    //     $ss = $ss ?? $this->userInfo;

    //     if (!$id) return DV::error('Contract not found');

    //     $old = DB::table('contracts')->where('id', $id)->first();
    //     if (!$old) return DV::error('Contract not found');
    //     if ($old->status_id == 3) {
    //         return DV::error('Terminated contract cannot be renewed');
    //     }


    //     $v_rule = [
    //         'start_date' => '1|date',
    //         'end_date'   => '1|date',
    //         'price'      => '0|number',
    //         'price_type' => '0|string|default=sqm',
    //         'remarks'    => '0|string|0-255',
    //         'space_id'   => '0|number|exists=building_spaces.id',
    //     ];

    //     $res = DBX::validateObject($arr, $v_rule, 1, [], $ss->lang, 0, null);
    //     if ($res->error) return DV::error($res->error);

    //     $inputs = $res->values;

    //     $today = date('Y-m-d');

    //     if ($old->status_id == 1 && strtotime($inputs['start_date']) < strtotime($old->end_date)) {
    //         return DV::error('New start date must be on or after current end date');
    //     }
    //     if ($old->status_id == 2 && $inputs['start_date'] < $today) {
    //         return DV::error('Renew start date must be today or later');
    //     }

    //     if ($inputs['end_date'] < $today) {
    //         return DV::error('End date cannot be in the past');
    //     }

    //     if ($inputs['end_date'] <= $inputs['start_date']) {
    //         return DV::error('End date must be after start date');
    //     }

    //     $new_space_id = isset($inputs['space_id']) && $inputs['space_id'] ? $inputs['space_id'] : $old->space_id;
    //     if ($new_space_id && $new_space_id != $old->space_id) {
    //         $dup_id = self::checkDuplicateContract($new_space_id, $old->id);
    //         if ($dup_id) {
    //             return DV::error('The selected unit already has a contract.');
    //         }
    //     }

    //     // Renew = update existing contract (new period); do NOT insert a new row in contracts.
    //     // Renewal data (period, date, etc.) is stored only in contract_renewals.
    //     // When unit code is changed on renew: do NOT update contract.space_id yet; it will be updated
    //     // when current date equals the renewal start_date (see applyPendingRenewalUnitChanges).
    //     $unitChanged = $new_space_id && $old->space_id !== $new_space_id;
    //     $updateContract = [
    //         'start_date' => $inputs['start_date'],
    //         'end_date'   => $inputs['end_date'],
    //         'price'      => $inputs['price'] ?? $old->price,
    //         'price_type' => $inputs['price_type'] ?? $old->price_type,
    //         'remarks'    => $inputs['remarks'] ?? $old->remarks,
    //     ];
    //     if (!$unitChanged) {
    //         $updateContract['space_id'] = $new_space_id ?: $old->space_id;
    //     }

    //     DB::beginTransaction();

    //     $updated = DBX::saveData($ss, 'contracts', ['id' => $old->id], $updateContract, [], 1);
    //     if (!$updated) {
    //         DB::rollBack();
    //         return DV::error('Renew failed');
    //     }

    //     // When unit code is unchanged on renew: set new space to Occupied (contract already updated above).
    //     // When unit code is changed: defer space status and contract.space_id update until renewal start_date.
    //     if (!$unitChanged && $new_space_id) {
    //         $occupiedId = self::getSpaceOccupiedStatusId();
    //         if ($occupiedId) {
    //             DB::table('building_spaces')->where('id', $new_space_id)->update(['status_id' => $occupiedId]);
    //         }
    //     }

    //     // Store renewal record only in contract_renewals (not in contracts table)
    //     $now = getNowTime();
    //     $renewalRow = [
    //         'contract_id'   => $old->id,
    //         'space_id'     => $new_space_id ?: $old->space_id,
    //         'renewal_date' => $today,
    //         'start_date'   => $inputs['start_date'],
    //         'end_date'     => $inputs['end_date'],
    //         'status'       => 'active',
    //         'remarks'      => trim((string) ($inputs['remarks'] ?? '')),
    //         'created_at'   => $now,
    //         'updated_at'   => $now,
    //         'create_uid'   => $ss->user_id ?? null,
    //         'update_uid'   => $ss->user_id ?? null,
    //         'create_user'  => $ss->full_name ?? null,
    //         'update_user'  => $ss->full_name ?? null,
    //     ];
    //     if (isset($ss->branch_id) && $ss->branch_id !== null && $ss->branch_id !== '') {
    //         $renewalRow['branch_id'] = $ss->branch_id;
    //     }
    //     DB::table('contract_renewals')->insert($renewalRow);

    //     DB::commit();

    //     return DV::depends(1, [
    //         'contract_id' => $old->id
    //     ]);
    // }

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


    // static function generateContractMonths($contract_id, $start_date = null, $end_date = null, $ss = null)
    // {
    //     if (!$start_date || !$end_date) {
    //         $contract = DB::table('contracts')
    //             ->where('id', $contract_id)
    //             ->select('start_date', 'end_date')
    //             ->first();

    //         $start_date = $contract->start_date;
    //         $end_date   = $contract->end_date;
    //     }

    //     try {
    //         $start = \Carbon\Carbon::parse($start_date)->startOfDay();
    //         $end   = \Carbon\Carbon::parse($end_date)->endOfDay();
    //     } catch (\Exception $e) {
    //         \Log::error("Invalid date format in generateContractMonths", [
    //             'contract_id' => $contract_id,
    //             'start_date'  => $start_date,
    //             'end_date'    => $end_date,
    //             'error'       => $e->getMessage()
    //         ]);
    //         return [];
    //     }

    //     if ($end->lt($start)) {
    //         \Log::warning("Contract end date is before start date", [
    //             'contract_id' => $contract_id,
    //             'start'       => $start_date,
    //             'end'         => $end_date
    //         ]);
    //         return [];
    //     }

    //     $months = [];
    //     $current = $start->copy()->startOfMonth();

    //     while ($current->lte($end)) {
    //         $monthStart = $current->copy()->startOfMonth();
    //         $monthEnd   = $current->copy()->endOfMonth();

    //         if ($current->format('Y-m') === $start->format('Y-m') && $start->day > 1) {
    //             $monthStart = $start->copy();
    //         }
    //         if ($monthEnd->gt($end)) {
    //             $monthEnd = $end->copy();
    //         }
    //         $monthLabel = $current->format('M Y');

    //         $months[] = [
    //             'month'      => $monthLabel,
    //             'start_date' => $monthStart->format('j-M-Y'),
    //             'end_date'   => $monthEnd->format('j-M-Y'),
    //         ];

    //         $current->addMonthNoOverflow();
    //     }

    //     return $months;
    // }

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
            // Even if end_date is a string "2025-04-29", Carbon::parse handles it.
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
