<?php

namespace App\Models\Prm;

use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use XPublicStorage;

class Tenant
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'tenants';
    public function __construct($id = null, $userInfo = null){
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
function checkUniqueTenantByNID($nid, $id = null)
{
    if(!$nid) return null;
    $str_id = '1=1';
    if (!$nid) return 'National ID cannot be empty';
    if ($id > 0) $str_id = "t.id <> $id";
    $x = DB::table('tenants as t')->where('t.national_id', $nid)->whereRaw($str_id)->select('id')->take(1)->exists();
    if ($x) return 'National ID ?? has been used by another Tenant::'. $nid;
    return null;
}
function checkUniqueTenantByPhone($phone_number, $id = null)
{
    if (empty($phone_number)) {
        return 'Phone number cannot be empty';
    }
    $query = DB::table('tenants')
        ->where('phone_number', $phone_number);
    if ($id) {
        $query->where('id', '<>', $id);
    }
    if ($query->exists()) {
        return 'Phone number "' . $phone_number . '" has already been used by another tenant';
    }
    return null;
}
 public function createTenant($arr = [], $id = null, $ss = null)
{
    $id = $id ?? $this->id;
    $ss = $ss ?? $this->userInfo;
    $branch_id = $ss->branch_id;
    $v_rule = [
        'name'            => '1|string|0-30|text=Tenant name must be provided',
        'sex'             => '1|choice|F,M',
        'date_of_birth'   => '1|date',
        'nationality_id'  => '1|number',
        'legal_name'      => '1|string|0-100',
        'national_id'     => '0|string|0-50',
        'passport_number' => '0|string|0-50',
        'phone_number'    => '0|string',
        'email'           => '0|email',
        'address'         => '0|string',
        'photo'           => '0|image'
    ];
    $email_char = ['@', '.'];
    $address_char = ['@', '.', '#'];
    $name_char = ['@', '.', '#'];
    $passport_char = ['-','_', '.', '#'];
    $res = DBX::validateObject($arr,$v_rule,1,['photo' => GeneralSettings::$image_chars,'email' => $email_char,'address' => $address_char,'passport_number' => $passport_char,'legal_name' => $name_char],$ss->lang,0,null);
    if ($res->error) return DV::error($res->error);
    $inputs = $res->values;
    $d = (object) $inputs;
    $dob = $d->date_of_birth ?? null;
    if ($dob) {
        $birth = new \DateTime($dob);
        $today = new \DateTime();
        if ($birth > $today) return DV::error('Date of birth cannot be in the future.');
        $age = $today->diff($birth)->y;
        if ($age < 18) return DV::error('Tenant must be 18 years or older.');
        if ($age > 120) return DV::error('Invalid date of birth age.');

    }
    $nationality_id = $d->nationality_id ?? null;
    if ($nationality_id === 14) {
        $national_id = $d->national_id ?? null;
        if (empty($national_id)) {
            return DV::error('National ID is required for Khmer nationality.');
        }
        $nid_check = $this->checkUniqueTenantByNID($national_id, $id);
        if ($nid_check) return DV::error($nid_check);
    }
    if ($nationality_id !== 14) {
        $passport = $d->passport_number ?? null;
        if (empty($passport)) {
            return DV::error('Passport is required for foreign nationality.');
        }
    }
    $phone_number = isset($d->phone_number)? str_replace(' ', '', $d->phone_number): null;
    $phone_check = $this->checkUniqueTenantByPhone($phone_number, $id);
    if ($phone_check) return DV::error($phone_check);
    $inputs['phone_number'] = $phone_number;
    $photo = $d->photo ?? null;
    unset($inputs['photo']);
    $delete_prev_image = ($id > 0 && (!$photo || isImage($photo)));
    $created = !$id;
    $id = DBX::saveData($ss, 'tenants', ['id' => $id], $inputs, [], 1);
    if (!$id) {
        return DV::error('Failed to save tenant');
    }
    if ($created) {
        setOfficialCode($branch_id,'tenant_code_control','tenants',['id' => $id],'T-',4,null);
    }
    if ($delete_prev_image) {
        $file_name = DB::table('tenants')
            ->where('id', $id)
            ->value('photo_file_name');
        if ($file_name) {
            XPublicStorage::delete(['branch_id' => null,'subs_id'   => $ss->subs_id,'dir'=> self::$img_dir], 'images', $file_name);
        }
        DB::table('tenants')->where('id', $id)->update(['photo_file_name' => null]);
    }

    XPublicStorage::saveImage(['branch_id' => null,'subs_id'   => $ss->subs_id,'dir'=> self::$img_dir],null,$photo,null,['id' => $id, 'store' => 'tenants.photo_file_name']);
    $hasActive = DB::table('contracts')->where('tenant_id', $id)->whereDate('end_date', '>=', now())->exists();
    DB::table('tenants')->where('id', $id)->update(['status_id' => $hasActive ? 2 : 1]);
    return DV::depends(1, ['tenants' => $inputs, 'id' => $id]);
}

    public function getListPaginate($arr, $ss = null){
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $status_id = $d->status_id ?? null;
        $search_value = $d->search_value ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if(!is_numeric($current_page)){
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $str_search = "1=1";
        $str_moreWhere = "2=2";
        if($search_value){
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(t.name LIKE '%" . $search_value ."%' OR t.phone_number LIKE '%" . $search_value . "%' OR t.legal_name LIKE '%" . $search_value . "%' OR t.code LIKE '%" . $search_value . "%')";
        }
        if($status_id){
            $str_moreWhere .= ' AND t.status_id =' . $status_id;
        }
        $lastContract = DB::table('contracts')
            ->selectRaw('MAX(id) as id, tenant_id')
            ->groupBy('tenant_id');

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
                t.id,t.name,t.sex,t.date_of_birth,t.nationality_id,
                t.legal_name,t.code,t.photo_file_name,t.national_id,
                t.passport_number,t.phone_number,t.email,t.address,
                t.status_id,ts.name as status,
                bt.name as business_type,
                bs.code as space_code,
                c.start_date,c.end_date,t.updated_at,t.update_user
            ")
            ->orderBy('t.status_id', 'asc')
            ->orderBy('t.id', 'desc');

            // ->orderBy('t.id','DESC');
        $clone_query = clone $query;
        $count = $clone_query->count('t.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach($rows as $row){

            $row->image_url = '';
            if($row->photo_file_name){
                $row->image_url = self::profilePicture($row->id,$ss);
            }
            unset($row->photo_file_name);
            $row = setOfficialDates($row, ['date_of_birth','start_date','end_date'], ['updated_at'], []);
        }
        return new LengthAwarePaginator($rows,$count,$per_page,$current_page);

    }

    static function profilePicture($id,$ss){
        $col_subs_id = DBX::getHex('t.subs_id','subs_id');
        $row = DB::table('tenants as t')->where('t.id',$id)->selectRaw($col_subs_id.',t.branch_id,t.photo_file_name')->first();
        $def_image = self::defaultPhoto($row ? $row->subs_id : null);
        $url = '';
        if($row){
            $url = XPublicStorage::getUrl(['subs_id'=>$row->subs_id,'dir'=>self::$img_dir],'image').$row->photo_file_name;
            return validateUrl($url,$def_image);
        }else return $def_image;
    }

     static function createProfilePicture($photo_data,$file_type = null, $id = null, $ss = null){
        $id = $id ?? $id;
        $ss = $ss ?? $ss;
        $col_subs_id = DBX::getHEX('t.subs_id','subs_id');
        $tenant = DB::table('tenants as t')->where('t.id',$id)->selectRaw($col_subs_id.',t.id,t.branch_id,t.photo_file_name')->first();
        $delete_image = (!$photo_data || isImage($photo_data));
        if(!$tenant){
            return DV::error('Tenant identify is not correct!');
        }
        if($delete_image){
            XPublicStorage::delete(['subs_id'=>$ss->subs_id,'dir'=>self::$img_dir],'image',$tenant->photo_file_name);
            DB::table('tenants')->where('id',$id)->update(['photo_file_name'=>null]);
        }
        $res = XPublicStorage::saveImage(['subs_id'=>$ss->subs_id,'dir'=>self::$img_dir],null,$photo_data,null,['id'=>$id,'store'=>'tenants.photo_file_name']);
        if($res->status ==='Error') return $res;
        $img = self::profilePicture($id,$ss);
        return DV::depends(1,['image_url'=>$img]);
    }

    function deleteProfilePicture($id=null,$ss=null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $tenant = DB::table('tenants as t')->where('id',$id)->selectRaw('id,photo_file_name')->first();
        if(!$tenant) return DV::error('Tenant identify is not correct!');
        XPublicStorage::delete(['subs_id'=>$ss->subs_id,'dir'=>self::$img_dir],'image',$tenant->photo_file_name);
        DB::table('tenants')->where('id',$id)->update(['photo_file_name'=>null]);
        return DV::success();
    }


    static function defaultPhoto($subs_id)
    {
        return url('') . '/assets/images/meta/default_tenant.jpg';
    }
    public static function getDetails($id, $ss = null){
        $start_date = DBX::formatDate("c.start_date", 'start_date');
        $end_date = DBX::formatDate("c.end_date", 'end_date');
        $date_of_birth = DBX::formatDate("t.date_of_birth", 'date_of_birth');
        $row = DB::table('tenants as t')
            ->leftJoin('contracts as c', 'c.tenant_id', '=', 't.id')
            ->leftJoin('building_spaces as bs','bs.id','=','c.space_id')
            ->join('tenant_statuses as ts','ts.id','=','t.status_id')
            ->where('t.id',$id)
            ->selectRaw("t.id,t.name,t.code,t.national_id,passport_number,$date_of_birth,t.nationality_id,t.photo_file_name,t.sex,t.status_id,ts.name as status,t.legal_name,t.phone_number,t.email,t.address,c.price,c.price_type,c.sqm_size,$start_date,$end_date,bs.code as space_code ")
            ->first();
            if($row){
                $img = self::profilePicture($id,$ss);
                $row->image_url = $img;
                $row->photo = $img;
            } else $row = null;
        return $row;
    }

    public static function getFormOptions($id,$ss){
        $details = $id ? self::getDetails($id) : null;
        return (object) [
            'tenant' => $details,
            'nationalities' => GeneralSettings::options_nationality($ss),
            'statuses' => GeneralSettings::options_tenant_status($ss),

        ];
    }

    public function delete($id = null,$ss = null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $hasContract = DB::table('contracts')->where('tenant_id', $id)->exists();
        if ($hasContract) {
            return DV::error('Cannot delete this tenant because an active contract exists.');
        }
        $deleted = DB::table('tenants')->where('id',$id)->delete();
        return $deleted ? DV::depends($deleted,['action'=>'deleted']) : DV::error('Delete failed.');
    }


    public function getLeaseHistory($id = null,$ss = null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

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
                    'unit_code' => $r->space_code ?? $c->space_code ?? null,
                    'building_name' => $r->building_name ?? $c->building_name ?? null,
                    'sqm_size' => $c->sqm_size ?? null,
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

        public function getActiveSpaces($id = null,$ss = null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $today = date('Y-m-d');
        $str_date = DBX::whereDate('c.end_date','>=',$today);
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
    public function getTenantInfo($id = null,$ss = null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $tenant = DB::table('tenants')
        ->where('id',$id)
        ->select('id','name','legal_name','email','phone_number')->first();
        $spaces = $this->getActiveSpaces($id,$ss);
        return (object)[
            'tenant'=>$tenant,
            'spaces'=>$spaces
        ];
    }

    public function getTenantWithSpacesAndServiceRequest($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $tenant = DB::table('tenants')
            ->where('id', $id)
            ->select('id', 'name', 'legal_name', 'email', 'phone_number')
            ->first();

        $spaces = DB::table('contracts as c')
            ->join('building_spaces as bs', 'bs.id', '=', 'c.space_id')
            ->where('c.tenant_id', $id)
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
            'tenant'  => $tenant,
            'spaces'  => $spaces,
            'service' => $services,
        ];
    }


    public function getTenantWithSpacesAndMonths($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $tenant = DB::table('tenants')
            ->where('id', $id)
            ->select('id', 'name', 'legal_name', 'email', 'phone_number')
            ->first();

        $allMonths = [];

        $spaces = DB::table('contracts as c')
            ->join('building_spaces as bs', 'bs.id', '=', 'c.space_id')
            ->where('c.tenant_id', $id)
            ->select(
                'c.id as contract_id',
                'bs.id as space_id',
                'bs.code as space_code',
                'bs.sqm_size as space_sqm_size',
                'bs.price_type',
                'c.price',
                'c.sqm_size',
                'c.start_date',
                'c.end_date'
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
                ];
            })
            ->values();

        return (object) [
            'tenant' => $tenant,
            'spaces' => $spaces,
            'months' => $allMonths,
        ];
    }



}
