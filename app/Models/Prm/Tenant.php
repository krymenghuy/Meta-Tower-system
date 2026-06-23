<?php

namespace App\Models\Prm;

use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use XPublicStorage;
use XBranch;
use Carbon\Carbon;
use App\Models\CompanyProfile;

class Tenant
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'tenants';
    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public static function liveContractSubquery()
    {
        return DB::table('contracts')
            ->whereIn('status_id', [Contract::getActiveStatusId(), Contract::getPendingStatusId()])
            ->whereDate('end_date', '>=', date('Y-m-d'))
            ->selectRaw('MAX(id) as id, tenant_id')
            ->groupBy('tenant_id');
    }

    function checkUniqueTenantByNID($nid, $id = null)
    {
        if (!$nid) return null;
        $str_id = '1=1';
        if (!$nid) return 'National ID cannot be empty';
        if ($id > 0) $str_id = "t.id <> $id";
        $x = DB::table('tenants as t')->where('t.national_id', $nid)->whereRaw($str_id)->select('id')->take(1)->exists();
        if ($x) return 'A tenant with National ID '.$nid.' already exists in the system.';
        return null;
    }
    function checkUniqueTenantByPassport($passport, $id = null)
    {
        if (!$passport) return null;
        $str_id = '1=1';
        if (!$passport) return 'Passport number cannot be empty';
        if ($id > 0) {
            $str_id = "t.id <> $id";
        }
        $x = DB::table('tenants as t')->where('t.passport_number', $passport)->whereRaw($str_id)->select('id')->take(1)->exists();
        if ($x) return 'A tenant with this Passport number ' . $passport. ' already exists in the system.';
        return null;
    }
    function checkUniqueTenantByPhone($phone_number, $id = null)
    {
        if (empty($phone_number)) {
            return 'Phone number cannot be empty.';
        }
        $query = DB::table('tenants')
            ->where('phone_number', $phone_number);
        if ($id) {
            $query->where('id', '<>', $id);
        }
        if ($query->exists()) {
            return 'This phone number ' . $phone_number . ' is already associated with another tenant.';
        }
        return null;
    }
    public function createTenant($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'name'            => '1|string|0-150|text=name_required::@key;@max;@value',
            'name_kh'         => '1|string|0-150|text=name_required::@key;@max;@value',
            'sex'             => '1|choice|F,M|text=select_gender',
            'date_of_birth'   => '1|date|text=date_of_birth_required',
            'legal_name'      => '1|string|0-150|text=legal_name_required',
            'nationality_id'  => '1|number|text=nationality_required',
            'national_id'     => '0|string|0-20',
            'nid_issue_date'   => '0|date',
            'passport_number' => '0|string|0-20',
            'phone_number'    => '1|string|1-20|text=phone_number_required',
            'email'           => '0|email|1-30',
            'address'         => '1|string|text=enter_address',
            'photo'           => '0|image'
        ];
        $email_char = ['@', '.'];
        $address_char = ['@', ',', '.', '#'];
        $name_char = ['@', '.', '#'];
        $res = DBX::validateObject($arr, $v_rule, 1, ['photo' => GeneralSettings::$image_chars, 'email' => $email_char, 'address' => $address_char,  'legal_name' => $name_char], $ss->lang, 0, null);
        if ($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $d = (object) $inputs;
        $dob = $d->date_of_birth ?? null;
        $email = $d->email ?? null;
        $nid_issue_date = convertDate($inputs['nid_issue_date'] ?? null);
        $inputs['nid_issue_date'] = $nid_issue_date;
        if ($email !== null && $email !== '') {
                if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    return DV::error('Invalid email format.');
                }
        }
        if ($dob) {
            $birth = new \DateTime($dob);
            $today = new \DateTime();
            if ($birth > $today) return DV::error('date_of_birth_cannot_be_in_the_future');
            $age = $today->diff($birth)->y;
            if ($age < 18) return DV::error('tenant_must_be_18');
            if ($age > 120) return DV::error('invalid_date_of_birth_age');
        }
        $nationality_id = $d->nationality_id ?? null;
        if ($nationality_id === 14) {
            $national_id = $d->national_id ?? null;
            $nid_issue_date = $d->nid_issue_date ?? null;
            $passport = $d->passport_number ?? null;
            $nid_issue_date = $d->nid_issue_date ?? null;

            if (empty($national_id)) {
                return DV::error('national_id_required');
            }
            if (empty($nid_issue_date)) {
                return DV::error('nid_issue_date');
            }
            $nid_check = $this->checkUniqueTenantByNID($national_id, $id);
            if ($nid_check) return DV::error($nid_check);
            $passport_check = $this->checkUniqueTenantByPassport($passport, $id);
            if ($passport_check) return DV::error($passport_check);
        }
        if ($nationality_id !== 14) {
            $passport = $d->passport_number ?? null;
            $national_id = $d->national_id ?? null;
            $nid_issue_date = $d->nid_issue_date ?? null;
            if (empty($passport)) {
                return DV::error('passport_number_required');
            }
            $inputs['nid_issue_date'] = null;
            $nid_check = $this->checkUniqueTenantByNID($national_id, $id);
            if ($nid_check) return DV::error($nid_check);
            $passport_check = $this->checkUniqueTenantByPassport($passport, $id);
            if ($passport_check) return DV::error($passport_check);
        }
        $phone_number = isset($d->phone_number) ? str_replace(' ', '', $d->phone_number) : null;
        $phone_check = $this->checkUniqueTenantByPhone($phone_number, $id);
        if ($phone_check) return DV::error($phone_check);
        $inputs['phone_number'] = $phone_number;
        $address = $d->address ?? null;
        if(!$address){
            return DV::error('address_required');
        }
        $photo = $d->photo ?? null;
        unset($inputs['photo']);
        $delete_prev_image = ($id > 0 && (!$photo || isImage($photo)));
        $created = !$id;
        $id = DBX::saveData($ss, 'tenants', ['id' => $id], $inputs, [], 1);
        if (!$id) {
            return DV::error('create_failed');
        }
        if ($created) {
            setOfficialCode($branch_id, 'tenant_code_control', 'tenants', ['id' => $id], 'T-', 4, null);
        }
        if ($delete_prev_image) {
            $file_name = DB::table('tenants')
                ->where('id', $id)
                ->value('photo_file_name');
            if ($file_name) {
                XPublicStorage::delete(['branch_id' => null, 'subs_id'   => $ss->subs_id, 'dir' => self::$img_dir], 'images', $file_name);
            }
            DB::table('tenants')->where('id', $id)->update(['photo_file_name' => null]);
        }

        XPublicStorage::saveImage(['branch_id' => null, 'subs_id'   => $ss->subs_id, 'dir' => self::$img_dir], null, $photo, null, ['id' => $id, 'store' => 'tenants.photo_file_name']);
        // 2=Active, 3=Inactive (historical/expired contracts only); 1=Pending when tenant has never had a contract
        $today = date('Y-m-d');
        $terminatedStatusId = Contract::getTerminatedStatusId();
        $hasLiveContract = DB::table('contracts')
            ->where('tenant_id', $id)
            ->whereDate('end_date', '>=', $today)
            ->where('status_id', '!=', $terminatedStatusId)
            ->exists();
        $hadContract = DB::table('contracts')->where('tenant_id', $id)->exists();
        $tenantStatusId = $hasLiveContract ? 2 : ($hadContract ? 3 : 1);
        DB::table('tenants')->where('id', $id)->update(['status_id' => $tenantStatusId]);
        return DV::depends(1, ['tenants' => $inputs, 'id' => $id]);
    }

    public function getListPaginate($arr, $ss = null)
    {
        Contract::applyPendingRenewalUnitChanges();
        Contract::applyAutomaticContractRollups();

        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $status_id = $d->status_id ?? null;
        $search_value = $d->search_value ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $str_search = "1=1";
        $str_moreWhere = "2=2";
        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(t.name LIKE '%" . $search_value . "%' OR t.phone_number LIKE '%" . $search_value . "%' OR t.legal_name LIKE '%" . $search_value . "%' OR t.code LIKE '%" . $search_value . "%')";
        }
        if ($status_id) {
            $str_moreWhere .= ' AND t.status_id =' . $status_id;
        }
        $lastContract = self::liveContractSubquery();

        $query = DB::table('tenants as t')
            ->join('tenant_statuses as ts', 'ts.id', '=', 't.status_id')
            ->leftJoinSub($lastContract, 'lc', function ($join) {
                $join->on('lc.tenant_id', '=', 't.id');
            })
            ->leftJoin('contracts as c', 'c.id', '=', 'lc.id')
            ->leftJoin('building_spaces as bs', 'bs.id', '=', 'c.space_id')
            ->leftJoin('business_types as bt', 'bt.id', '=', 'c.business_type_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw("
                t.id,t.name,t.name_kh,t.sex,t.tenant_type,t.date_of_birth,t.nationality_id,
                t.legal_name,t.code,t.photo_file_name,t.national_id,t.nid_issue_date,
                t.passport_number,t.phone_number,t.email,t.address,
                t.status_id,ts.name as status,
                bt.name as business_type,
                bs.code as space_code,
                c.start_date,c.end_date,t.updated_at,t.update_user
            ")
            ->orderBy('t.status_id', 'asc')
            ->orderBy('t.created_at', 'desc');

        // ->orderBy('t.id','DESC');
        $clone_query = clone $query;
        $count = $clone_query->count('t.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach ($rows as $row) {

            $row->image_url = '';
            if ($row->photo_file_name) {
                $row->image_url = self::profilePicture($row->id, $ss);
            }
            unset($row->photo_file_name);
            $row = setOfficialDates($row, ['date_of_birth', 'start_date', 'end_date'], ['updated_at'], []);
        }
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    static function profilePicture($id, $ss)
    {
        $col_subs_id = DBX::getHex('t.subs_id', 'subs_id');
        $row = DB::table('tenants as t')->where('t.id', $id)->selectRaw($col_subs_id . ',t.branch_id,t.photo_file_name')->first();
        $def_image = self::defaultPhoto($row ? $row->subs_id : null);
        $url = '';
        if ($row) {
            $url = XPublicStorage::getUrl(['subs_id' => $row->subs_id, 'dir' => self::$img_dir], 'image') . $row->photo_file_name;
            return validateUrl($url, $def_image);
        } else return $def_image;
    }

    static function createProfilePicture($photo_data, $file_type = null, $id = null, $ss = null)
    {
        $id = $id ?? $id;
        $ss = $ss ?? $ss;
        $col_subs_id = DBX::getHEX('t.subs_id', 'subs_id');
        $tenant = DB::table('tenants as t')->where('t.id', $id)->selectRaw($col_subs_id . ',t.id,t.branch_id,t.photo_file_name')->first();
        $delete_image = (!$photo_data || isImage($photo_data));
        if (!$tenant) {
            return DV::error('Tenant identify is not correct!');
        }
        if ($delete_image) {
            XPublicStorage::delete(['subs_id' => $ss->subs_id, 'dir' => self::$img_dir], 'image', $tenant->photo_file_name);
            DB::table('tenants')->where('id', $id)->update(['photo_file_name' => null]);
        }
        $res = XPublicStorage::saveImage(['subs_id' => $ss->subs_id, 'dir' => self::$img_dir], null, $photo_data, null, ['id' => $id, 'store' => 'tenants.photo_file_name']);
        if ($res->status === 'Error') return $res;
        $img = self::profilePicture($id, $ss);
        return DV::depends(1, ['image_url' => $img]);
    }

    function deleteProfilePicture($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $tenant = DB::table('tenants as t')->where('id', $id)->selectRaw('id,photo_file_name')->first();
        if (!$tenant) return DV::error('Tenant identify is not correct!');
        XPublicStorage::delete(['subs_id' => $ss->subs_id, 'dir' => self::$img_dir], 'image', $tenant->photo_file_name);
        DB::table('tenants')->where('id', $id)->update(['photo_file_name' => null]);
        return DV::success();
    }


    static function defaultPhoto($subs_id)
    {
        return url('') . '/assets/images/default/placeholder.svg';
    }

    public static function getDetails($id, $ss = null)
    {
        Contract::applyPendingRenewalUnitChanges();
        Contract::applyAutomaticContractRollups();

        $start_date = DBX::formatDate("c.start_date", 'start_date');
        $end_date = DBX::formatDate("c.end_date", 'end_date');
        $date_of_birth = DBX::formatDate("t.date_of_birth", 'date_of_birth');
        $nid_issue_date = DBX::formatDate("t.nid_issue_date", 'nid_issue_date');
        $lastContract = self::liveContractSubquery();
        $row = DB::table('tenants as t')
            ->leftJoinSub($lastContract, 'lc', function ($join) {
                $join->on('lc.tenant_id', '=', 't.id');
            })
            ->leftJoin('contracts as c', 'c.id', '=', 'lc.id')
            ->leftJoin('building_spaces as bs', 'bs.id', '=', 'c.space_id')
            ->join('tenant_statuses as ts', 'ts.id', '=', 't.status_id')
            ->where('t.id', $id)
            ->selectRaw("t.id,t.branch_id,t.name,t.name_kh,t.code,t.national_id,passport_number,$date_of_birth,$nid_issue_date,t.nationality_id,t.photo_file_name,t.sex,t.tenant_type,t.status_id,ts.name as status,t.legal_name,t.phone_number,t.email,t.address,c.price,c.price_type,c.sqm_size,c.deposit,$start_date,$end_date,bs.code as space_code")
            ->first();
        if ($row) {
            $img = self::profilePicture($id, $ss);
            $row->image_url = $img;
            $row->photo = $img;
            $row->monthly_price = $row->price_type === 'sqm'
            ? $row->sqm_size * $row->price
            : $row->price;
            $row->monthly_price = number_format($row->monthly_price, 2);
           $row->lease_term = Carbon::parse($row->start_date)
                ->diffInMonths(Carbon::parse($row->end_date)) . ' ខែ';
        } else $row = null;
        return $row;
    }

    public static function getFormOptions($id, $ss)
    {
        $details = $id ? self::getDetails($id) : null;
        return (object) [
            'tenant' => $details,
            'nationalities' => GeneralSettings::options_nationality($ss),
            'statuses' => GeneralSettings::options_tenant_status($ss),

        ];
    }

    public function delete($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $tenant = DB::table('tenants')->where('id', $id)->first();
        if (!$tenant) {
            return DV::error('Tenant not found or already deleted.');
        }

        $hasActiveContract = DB::table('contracts')
            ->where('tenant_id', $id)
            ->where('status_id', '!=', Contract::getTerminatedStatusId())
            ->exists();

        if ($hasActiveContract) {
            return DV::error('Cannot delete tenant with active contracts.');
        }

        $documents = DB::table('tenant_documents')->where('tenant_id', $id)->get();
        foreach ($documents as $doc) {
            $tenantDoc = new TenantDocument($doc->id, $ss);
            $tenantDoc->deleteTenantDocument($ss,$doc->id);
        }

        $deleted = DB::table('tenants')->where('id', $id)->delete();

        return $deleted
            ? DV::depends($deleted, ['action' => 'deleted'])
            : DV::error('Delete failed.');
    }


    public function getLeaseHistory($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        Contract::applyPendingRenewalUnitChanges();
        Contract::applyAutomaticContractRollups();

        // 1) Contracts for this tenant (used as header + "current period" baseline)
        $contract_start = DBX::formatDate("c.start_date", 'contract_start_date');
        $contract_end = DBX::formatDate("c.end_date", 'contract_end_date');
        $contract_updated_at = DBX::formatTime("c.updated_at", 'contract_updated_at');

        $contracts = DB::table('contracts as c')
            ->join('building_spaces as bs', 'bs.id', '=', 'c.space_id')
            ->join('buildings as b', 'b.id', '=', 'bs.building_id')
            ->join('contract_statuses as cs', 'cs.id', '=', 'c.status_id')
            ->join('business_types as bt', 'bt.id', '=', 'c.business_type_id')
            ->join('space_types as st', 'st.id', '=', 'c.space_type_id')
            ->where('c.tenant_id', $id)
            ->selectRaw(
                'c.id as contract_id,'
                    . 'cs.name as contract_status,'
                    . $contract_start . ',' . $contract_end . ','
                    . 'bt.name as business_type,'
                    . 'st.name as space_type,'
                    . 'bs.code as space_code,'
                    . 'b.name as building_name,'
                    . 'c.sqm_size,c.price,c.price_type,'
                    . 'bs.sqm_size as space_sqm_size,'
                    . 'c.deposit,c.deposit_remarks,'
                    . 'c.update_user,'
                    . $contract_updated_at
            )
            ->orderByDesc('c.start_date')
            ->get();

        if ($contracts->isEmpty()) {
            return [];
        }

        $contractIds = $contracts->pluck('contract_id')->filter()->values()->all();

        // 2) Renewal rows (old renewals + each renewal period)
        $renewal_date = DBX::formatDate("cr.renewal_date", 'renewal_date');
        $renewal_start = DBX::formatDate("cr.start_date", 'renewal_start_date');
        $renewal_end = DBX::formatDate("cr.end_date", 'renewal_end_date');
        $renewal_updated_at = DBX::formatTime("cr.updated_at", 'updated_at');

        $renewals = DB::table('contract_renewals as cr')
            ->leftJoin('building_spaces as bs', 'bs.id', '=', 'cr.space_id')
            ->leftJoin('buildings as b', 'b.id', '=', 'bs.building_id')
            ->whereIn('cr.contract_id', $contractIds)
            ->selectRaw(
                'cr.id as renewal_id,'
                    . 'cr.contract_id,'
                    . $renewal_date . ',' . $renewal_start . ',' . $renewal_end . ','
                    . 'cr.remarks,'
                    . 'cr.update_user,'
                    . $renewal_updated_at . ','
                    . 'bs.code as space_code,'
                    . 'b.name as building_name'
            )
            ->orderByDesc('cr.id')
            ->get();

        // Group renewals for quick lookup
        $renewalsByContractId = [];
        foreach ($renewals as $r) {
            $cid = (int) ($r->contract_id ?? 0);
            if (!$cid) continue;
            if (!isset($renewalsByContractId[$cid])) {
                $renewalsByContractId[$cid] = [];
            }
            $renewalsByContractId[$cid][] = $r;
        }

        // 3) Build flat renewal entries (one list for UI table)
        $entries = [];
        foreach ($contracts as $c) {
            $cid = (int) $c->contract_id;
            $contractRenewals = $renewalsByContractId[$cid] ?? [];

            // Latest renewal id (we ordered desc, so first is latest)
            $latestRenewalId = !empty($contractRenewals)
                ? (int) ($contractRenewals[0]->renewal_id ?? 0)
                : null;

            if (empty($contractRenewals)) {
                $entries[] = (object) [
                    'contract_id' => $cid,
                    'contract_status' => $c->contract_status ?? 'active',
                    'contract_start_date' => $c->contract_start_date ?? null,
                    'contract_end_date' => $c->contract_end_date ?? null,
                    'business_type' => $c->business_type ?? null,
                    'space_type' => $c->space_type ?? null,
                    'unit_code' => $c->space_code ?? null,
                    'building_name' => $c->building_name ?? null,
                    'sqm_size' => $c->sqm_size ?? null,
                    'space_sqm_size' => $c->space_sqm_size ?? null,
                    'price' => $c->price ?? null,
                    'price_type' => $c->price_type ?? 'sqm',
                    'deposit' => $c->deposit ?? null,
                    'deposit_remarks' => $c->deposit_remarks ?? null,
                    'renewal_id' => null,
                    'renewal_date' => null,
                    'renewal_start_date' => $c->contract_start_date ?? null,
                    'renewal_end_date' => $c->contract_end_date ?? null,
                    'remarks' => null,
                    'update_user' => $c->update_user ?? null,
                    'updated_at' => $c->contract_updated_at ?? null,
                    'is_initial' => true,
                    'is_current' => true,
                ];
                continue;
            }

            foreach ($contractRenewals as $r) {
                $isCurrentByPeriod =
                    (string) ($r->renewal_start_date ?? '') === (string) ($c->contract_start_date ?? '') &&
                    (string) ($r->renewal_end_date ?? '') === (string) ($c->contract_end_date ?? '');

                $isCurrentByLatestId =
                    ($latestRenewalId !== null) && (int) ($r->renewal_id ?? 0) === (int) $latestRenewalId;

                $entries[] = (object) [
                    'contract_id' => $cid,
                    'contract_status' => $c->contract_status ?? 'active',
                    'contract_start_date' => $c->contract_start_date ?? null,
                    'contract_end_date' => $c->contract_end_date ?? null,
                    'business_type' => $c->business_type ?? null,
                    'space_type' => $c->space_type ?? null,
                    // Tenant contract history should always show contract unit code, not renewal switched unit.
                    'unit_code' => $c->space_code ?? null,
                    'building_name' => $r->building_name ?? $c->building_name ?? null,
                    'sqm_size' => $c->sqm_size ?? null,
                    'space_sqm_size' => $c->space_sqm_size ?? null,
                    'price' => $c->price ?? null,
                    'price_type' => $c->price_type ?? 'sqm',
                    'deposit' => $c->deposit ?? null,
                    'deposit_remarks' => $c->deposit_remarks ?? null,

                    'renewal_id' => $r->renewal_id ?? null,
                    'renewal_date' => $r->renewal_date ?? null,
                    'renewal_start_date' => $r->renewal_start_date ?? null,
                    'renewal_end_date' => $r->renewal_end_date ?? null,
                    'remarks' => $r->remarks ?? null,
                    'update_user' => $r->update_user ?? null,
                    'updated_at' => $r->updated_at ?? null,
                    'is_initial' => false,
                    'is_current' => $isCurrentByPeriod || $isCurrentByLatestId,
                ];
            }
        }

        return $entries;
    }

    public function getActiveSpaces($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $today = date('Y-m-d');
        $str_date = DBX::whereDate('c.end_date', '>=', $today);
        $rows = DB::table('contracts as c')
            ->join('building_spaces as bs', 'bs.id', '=', 'c.space_id')
            ->where('c.tenant_id', $id)
            ->whereRaw($str_date)
            ->selectRaw('
                bs.id,
                bs.code as space_code,
                c.price
                ')
            ->get();
        return $rows;
    }
    public function getTenantInfo($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $tenant = DB::table('tenants')
            ->where('id', $id)
            ->select('id', 'name','name_kh', 'legal_name', 'email', 'phone_number')->first();
        $spaces = $this->getActiveSpaces($id, $ss);
        return (object)[
            'tenant' => $tenant,
            'spaces' => $spaces
        ];
    }

    public function getTenantWithSpacesAndServiceRequest($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $tenant = DB::table('tenants')
            ->where('id', $id)
            ->select('id', 'name', 'name_kh', 'legal_name', 'email', 'phone_number')
            ->first();

        // by status, with a date guard for contracts whose status auto-update lags.
        $today = date('Y-m-d');
        $spaces = DB::table('contracts as c')
            ->join('building_spaces as bs', 'bs.id', '=', 'c.space_id')
            ->where('c.tenant_id', $id)
            ->where('c.status_id', '=', Contract::getActiveStatusId())
            ->whereRaw(DBX::whereDate('c.end_date', '>=', $today))
            ->select(
                'c.id as contract_id',
                'bs.id as space_id',
                'bs.code as space_code',
                'c.price',
                'c.sqm_size',
                'c.start_date',
                'c.end_date'
            )
            ->get();

        $services = GeneralSettings::options_service_request_type(null);

        return (object) [
            'tenant'              => $tenant,
            'spaces'              => $spaces,
            'service'             => $services,
            'service_categories'  => GeneralSettings::options_service_categories($ss),
        ];
    }

    public function getTenantWithSpacesAndMonths($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $tenant = DB::table('tenants')
            ->where('id', $id)
            ->select('id', 'name', 'name_kh', 'legal_name', 'email', 'phone_number')
            ->first();

        // 1. Fetch Service Requests with status_id = 2 (Approved/Completed)
        $serviceRequests = DB::table('service_requests as sr')
            ->leftJoin('building_spaces as bs', 'bs.id', '=', 'sr.space_id')
            ->leftJoin('services as s', 's.id', '=', 'sr.service_id')
            ->where('sr.tenant_id', $id)
            ->whereIn('sr.status_id', [2,4])
            ->select(
                'sr.id as request_id',
                'sr.code',
                'sr.service_id',
                's.name as service_name',
                'sr.space_id',
                'bs.code as space_code',
                'sr.total_price',
                'sr.price',
                'sr.duration_hours',
                'sr.request_date',
                'sr.unit_type',
            )
            ->get();

        foreach ($serviceRequests as $serviceRequest) {

            $serviceRequest->unit_type = $serviceRequest->unit_type == '1' ? 'One Time' : ($serviceRequest->unit_type == '2' ? 'Hour' : '');
        }

        $allMonths = [];

        $spaces = DB::table('contracts as c')
            ->join('building_spaces as bs', 'bs.id', '=', 'c.space_id')
            ->leftJoin('buildings as b', 'b.id', '=', 'bs.building_id')
            ->where('c.tenant_id', $id)
            ->where('c.status_id', '=', Contract::getActiveStatusId())
            ->select(
                'c.id as contract_id',
                'bs.id as space_id',
                'bs.code as space_code',
                'bs.sqm_size as space_sqm_size',
                'bs.price_type',
                'c.price',
                'c.sqm_size',
                'c.start_date',
                'c.end_date',
                'c.deposit',
                'b.name as building_name'
            )
            ->orderByDesc('c.start_date')
            ->get()
            ->map(function ($contract) use ($ss, &$allMonths) {

                // Calculate effective price based on price_type
                $effective_price = ($contract->price_type === 'total')
                    ? $contract->price
                    : ($contract->price * $contract->space_sqm_size);

                // Generate months for this contract
                $months = Contract::generateContractMonths(
                    $contract->contract_id,
                    $contract->start_date,
                    $contract->end_date,
                    $ss
                );

                foreach ($months as $month) {
                    $allMonths[] = array_merge($month, [
                        'contract_id' => $contract->contract_id,
                        'space_id'    => $contract->space_id,
                        'space_code'  => $contract->space_code,
                        'effective_price' => $effective_price
                    ]);
                }

                return (object) [
                    'contract_id' => $contract->contract_id,
                    'space_id'    => $contract->space_id,
                    'space_code'  => $contract->space_code,
                    'price'       => $contract->price,
                    'sqm_size'        => $contract->space_sqm_size,
                    'price_type'      => $contract->price_type,
                    'effective_price' => $effective_price,
                    'start_date'  => $contract->start_date,
                    'end_date'    => $contract->end_date,
                    'deposit'     => $contract->deposit,
                    'building_name'=> $contract->building_name,
                ];
            })
            ->values();

        return (object) [
            'tenant'           => $tenant,
            'spaces'           => $spaces,
            'months'           => $allMonths,
            'service_requests' => $serviceRequests,
        ];
    }
     function getList($arr, $ss){
        $d = (object) $arr;
        $status_id = $d->status_id ?? null;
        $building_id = $d->building_id ?? null;
        $str_search = '1=1';
        if($status_id){
            $str_search .= " AND t.status_id = $status_id";
        }
        if($building_id){
            $str_search .= " AND bs.building_id = $building_id";
        }
        $rows = DB::table('tenants as t')
        ->whereRaw($str_search)
            ->selectRaw("t.id,t.name,t.name_kh,t.code,t.national_id,t.passport_number,t.date_of_birth,t.nationality_id,t.sex,t.tenant_type,t.status_id,t.legal_name,t.phone_number,t.email,t.address")->get();
            foreach($rows as $row){
                setOfficialDates($row, ['start_date', 'date_of_birth' ,'end_date'], [''], []);

            }
        return (object) [
            'list' => $rows,
            'company_profile' => Report::getCompanyInfo($ss),
        ];
    }
     static function contractFormOption($id,$ss)
    {
        $tenant = null;
        if ($id) {
             $tenant = Tenant::getDetails($id, $ss);
        }else return DV::error('Branch Can not be Empty!');

        $x = new CompanyProfile($ss);
        $p = (object) $x->getDetails($ss);

        if ($p){
            $tenant->issue_date = date('d-M-Y');
            $tenant->com_rep_name = $p->first_cp_name;
            $tenant->com_rep_sex =  $p->first_cp_sex;
            $tenant->com_rep_nid = $p->first_cp_nid;
            $tenant->com_rep_dob =$p->first_cp_dob;
            $tenant->com_rep_address = $p->first_cp_address;
        }
        return (object)[
            'contractInfo' => $tenant,
            'nationalities' => GeneralSettings::options_nationality($ss),
        ];
    }


}
