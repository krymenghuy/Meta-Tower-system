<?php

namespace App\Models\Tenant;

use App\Models\Prm\GeneralSettings;
use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use XPublicStorage;
use App\Models\CompanyProfile;
use App\Models\Prm\Tenant;
class Contracts  //extends Model
{
    protected $id = null;
    protected $userInfo = null;
    protected static $imag_dir = 'contracts';
    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function saveContracts($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'name' => '1|string|0-150',
            'name_kh' => '1|string|0-150',
            'phone_number' => '1|phone|0-20',
            'email' => '1|email|1-50',
            'address' => '1|string|0-250',
            'remarks' => '1|string|0-250',
            'tenant_id' => '1|number',
            // 'code' => '1|number',
            // 'contract_id' => '1|number|0=50',
        ];
        $email_char = ['@', '.', '-', '_'];
        $address_char = ['@', ',', '.', '#'];

        $res = DBX::validateObject($arr, $v_rule, true, [], $ss->lang, false);
        if ($res->error) return DV::error($res->error);

        $inputs = $res->values;
        $d = (object) $inputs;
        $d->phone_number = str_replace(' ', ' ', $d->phone_number);
        $inputs['phone_number'] = $d->phone_number;

        if ($id > 0) {
            return DV::depends(1, ['contracts' => $inputs, 'id' => $id]);
        }

        return DV::error('Failed to save member');
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

    public function getListContracts($arr, $ss = null)
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
        $tenant_id = $ss->official_id ?? null;
        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(bs.code LIKE '%" . $search_value . "%')";
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
            ->where('c.tenant_id', $tenant_id)
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


    public function contractDetails($id, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $row = DB::table('contracts as c')
            ->join('tenants as t', 't.id', '=', 'c.tenant_id')
            ->where('c.id', $id)
            ->selectRaw('c.id,c.name,c.phone_number,c.name_kh,c.code,c.email,c.address,c.remarks,c.tenant_id,c.update_user')->first();
        return $row;
    }

    public function getFormOptions($id, $ss)
    {
        $contracts = $id ? self::contractDetails($id) : null;
        return (object)[
            'contracts' => $contracts,
            'statuses'  => GeneralSettings::options_contract_status($ss),
            'business_types'   => GeneralSettings::options_business_type($ss),


        ];
    }
    public function deleteContracts($id)
    {
        $id = $id ?? $this->id;
        $deleted = Db::table('contracts')->where('id', $id)->delete();
        if ($deleted) {
            return DV::depends(1, ['id' => $id]);
        }
        return DV::error('Error delete contract...!!');
    }
    
}
