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
    $str_id = "1=1";
    if (!$phone_number) return 'Phone number cannot be empty';
    if ($id > 0) $str_id = "t.id <> $id";
    $x = DB::table('tenants as t')->where('t.phone_number', $phone_number)->whereRaw($str_id)->select('id')->take(1)->exists();
    if ($x) return 'phone number"' . $phone_number . '" has been used by another tenant';
    return null;
}
 public function createTenant($arr = [], $id = null, $ss = null)
{
    $id   = $id   ?? $this->id;
    $ss   = $ss   ?? $this->userInfo;
    $branch_id = $ss->branch_id;
    $v_rule = [
        'name'          => '1|string|0-100|text=Tenant name must be provided',
        'sex'           => '1|choice|F,M',
        'date_of_birth' => '1|date',
        'nationality_id'=> '1|number',
        'legal_name'    => '1|string|0-100',
        'national_id'   => '1|string|0-50',
        'passport_number' => '0|string|0-50',
        'phone_number'  => '1|phone|0-20',
        'email'         => '0|email|1-50',
        'address'       => '0|string|0-350',
        'photo' => '0|image'
    ];

    $email_char  = ['@','.','-','_'];
    $address_char = ['@',',','.','#'];
    $legal_name_char = ['@',',','.','#'];

    $res = DBX::validateObject($arr,$v_rule,1,['photo'=>GeneralSettings::$image_chars,'email' => $email_char, 'address' => $address_char,'passport_number' => $email_char, 'legal_name' => $legal_name_char],$ss->lang,0,null);
    if ($res->error) {
        return DV::error($res->error);
    }

    $inputs = $res->values;
    $d = (object) $inputs;

    $d->phone_number = str_replace(' ', '', $inputs['phone_number']);
        $inputs['phone_number'] = $d->phone_number;
        $phone_check = $this->checkUniqueTenantByPhone($d->phone_number, $id);
        if ($phone_check) return DV::error($phone_check);

    $national_id = $d->national_id ?? null;

    $nid_check = $this->checkUniqueTenantByNID($national_id, $id);
        if ($nid_check) return DV::error($nid_check);


    $photo = $d->photo ?? null;
    unset($inputs['photo']);
    $delete_prev_image = ($id > 0 && (!$photo || isImage($photo)));

    $created = !$id;
    $id = DBX::saveData($ss, 'tenants', ['id' => $id], $inputs, [], 1);
    if ($id && $created) {

            $prefix = 'T-';
            $res = setOfficialCode($branch_id, 'tenant_code_control', 'tenants', ['id' => $id], $prefix, 4, null);

        }
    if ($id > 0) {
        if ($delete_prev_image) {
            $file_name = DB::table('tenants as t')->where('t.id', $id)->take(1)->value('t.photo_file_name');
            if ($file_name) {
                XPublicStorage::delete([
                    'branch_id' => null,
                    'subs_id'   => $ss->subs_id,
                    'dir'       => self::$img_dir
                ], 'images', $file_name);
            }

            DB::table('tenants')->where('id', $id)->update(['photo_file_name' => null]);
        }
       XPublicStorage::saveImage(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], null, $photo, null, ['id' => $id, 'store' => 'tenants.photo_file_name']);
        $hasActive = DB::table('contracts')
            ->where('tenant_id', $id)
            ->whereDate('end_date', '>=', now())
            ->exists();

        DB::table('tenants')->where('id', $id)
            ->update(['status_id' => $hasActive ? 2 : 1]);
       return DV::depends(1, ['tenants' => $inputs, 'id' => $id]);
    }
    return DV::error('Failed to save tenant');
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
        $updated_at = DBX::formatTime("t.updated_at", 'updated_at');
        $start_date = DBX::formatDate("c.start_date", 'start_date');
        $end_date = DBX::formatDate("c.end_date", 'end_date');
        $date_of_birth = DBX::formatDate("t.date_of_birth", 'date_of_birth');
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
                t.id,t.name,t.sex,$date_of_birth,t.nationality_id,
                t.legal_name,t.code,t.photo_file_name,t.national_id,
                t.passport_number,t.phone_number,t.email,t.address,
                t.status_id,ts.name as status,
                bt.name as business_type,
                bs.code as space_code,
                $start_date,$end_date,$updated_at,t.update_user
            ")
            ->orderBy('t.status_id', 'asc')
            ->orderBy('t.created_at', 'desc');

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
        $rows = DB::table('contracts as c')
        ->join('building_spaces as bs', 'bs.id', '=', 'c.space_id')
        ->join('buildings as b', 'b.id', '=', 'bs.building_id')
        ->where('c.tenant_id', $id)
        ->selectRaw('c.id,c.start_date,c.end_date,c.tenant_id')
        ->orderByDesc('c.start_date')
        ->get();
        return $rows;

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
            'c.price',
            'c.sqm_size',
            'c.start_date',
            'c.end_date'
        )
        ->orderByDesc('c.start_date')
        ->get()
        ->map(function ($contract) use ($ss, &$allMonths) {
            $months = Contract::generateContractMonths(
                null,
                $contract->start_date,
                $contract->end_date,
                $ss
            );
            foreach ($months as $month) {
                $allMonths[] = array_merge($month, [
                    'contract_id' => $contract->contract_id,
                    'space_id'    => $contract->space_id,
                    'space_code'  => $contract->space_code,
                ]);
            }

            return (object) [
                'contract_id' => $contract->contract_id,
                'space_id'    => $contract->space_id,
                'space_code'  => $contract->space_code,
                'price'       => $contract->price,
                'sqm_size'    => $contract->sqm_size,
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
