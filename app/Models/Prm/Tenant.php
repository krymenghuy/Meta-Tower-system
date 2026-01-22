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

 public function createTenant($arr = [], $id = null, $ss = null)
{
    $id   = $id   ?? $this->id;
    $ss   = $ss   ?? $this->userInfo;

    $v_rule = [
        'name'          => '1|string|0-200|text=Tenant name must be provided',
        'legal_name'    => '0|string|0-250',
        'national_id'   => '0|string|0-100',
        'passport_number' => '0|string|0-100',
        'phone_number'  => '0|phone|0-23',
        'email'         => '0|email|1-50',
        'address'       => '0|string|0-350',
        'sex'           => '1|choice|F,M',           // ← required
        'photo' => '0|image'
    ];

    $email_char  = ['@','.','-','_'];
    $address_char = ['@',',','.','#'];
    $legal_name_char = ['@',',','.','#'];

    $res = DBX::validateObject($arr,$v_rule,1,['photo'=>GeneralSettings::$image_chars,'email' => $email_char, 'address' => $address_char, 'legal_name' => $legal_name_char],$ss->lang ?? 'en',0,null);

    if ($res->error) {
        return DV::error($res->error);
    }

    $inputs = $res->values;
    $d = (object) $inputs;

    // ── Duplicate check (only for create, not update)
    if (!$id) {
        $exists = DB::table('tenants')
            ->where('phone_number', $inputs['phone_number'] ?? '')
            ->where('name', $inputs['name'])
            ->exists();

        if ($exists) {
            return DV::error('Create failed: This Tenant already exists (same name + phone number)');
        }
    }

     $photo = $d->photo ?? null;
    unset($inputs['photo']);
    $delete_prev_image = ($id > 0 && (!$photo || isImage($photo)));

    $created = !$id;
    $id = DBX::saveData($ss, 'tenants', ['id' => $id], $inputs, [], 1);

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
       return DV::depends(1, ['tenants' => $inputs, 'id' => $id]);
    }
    return DV::error('Failed to save tenant');
}

    public function getListPaginate($arr, $ss = null){
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $search_value = isset($arr['search_value']) ? $arr['search_value'] : null;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if(!is_numeric($current_page)){
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $search_value = $d->search_value ?? null;
        $str_search = "1=1";
        if($search_value){
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(t.name LIKE '%" . $search_value ."%' OR t.phone_number LIKE '%" . $search_value . "%' OR t.legal_name LIKE '%" . $search_value . "%' OR t.address LIKE '%" . $search_value . "%')";
        }
        $updated_at = DBX::formatTime("t.updated_at", 'updated_at');
        $query = DB::table('tenants as t')
            ->whereRaw($str_search)
            ->selectRaw("t.id,t.name,t.legal_name,t.photo_file_name,t.national_id,passport_number,t.sex,t.phone_number,t.email,t.address,$updated_at,t.update_user")->orderBy('t.id','DESC');
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
        $row = DB::table('tenants as t')
            ->where('t.id',$id)
            ->selectRaw('t.id,t.name,t.national_id,passport_number,t.photo_file_name,t.sex,t.legal_name,t.phone_number,t.email,t.address')
            ->first();
            if($row){
                $img = self::profilePicture($id,$ss);
                $row->image_url = $img;
                $row->photo = $img;
            } else $row = null;
        return $row;
    }

    public static function getFormOptions($id){
        $details = $id ? self::getDetails($id) : null;
        return (object) [
            'tenant' => $details,
        ];
    }

    public function delete($id = null){
        $id = $id ?? $this->id;
        $deleted = DB::table('tenants')->where('id',$id)->delete();
        return $deleted ? DV::depends($deleted,['action'=>'deleted']) : DV::error('Delete failed.');
    }
}
