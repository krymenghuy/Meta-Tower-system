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
        'image'         => '0|file|0-5000|ext=jpg,jpeg,png,gif,webp|text=Image must be jpg, jpeg, png, gif or webp',
        'address'       => '0|string|0-350',
        'sex'           => '1|choice|F,M',           // ← required
    ];

    $email_char  = ['@','.','-','_'];
    $address_char = ['@',',','.','#'];

    $res = DBX::validateObject($arr,$v_rule,1,['email' => $email_char, 'address' => $address_char],$ss->lang ?? 'en',0,null);

    if ($res->error) {
        return DV::error($res->error);
    }

    $inputs = $res->values;

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

    // ── Remove image from mass assignment (we handle it separately)
    $imageFile = null;
    if (isset($arr['image']) && is_object($arr['image'])) {
        $imageFile = $arr['image'];
    }
    unset($inputs['image']);
    $id = DBX::saveData($ss, 'tenants', ['id' => $id], $inputs, [], 1);

    if (!$id || $id <= 0) {
        return DV::error('Error saving tenant record');
    }

    // ── Handle image **after** we have the ID
    if ($imageFile) {
        $img_res = XPublicStorage::saveFile($imageFile, self::$img_dir, $id);

        if ($img_res->error ?? false) {
            return DV::error('Tenant saved but image upload failed: ' . ($img_res->error ?? 'unknown error'));
        }
        DB::table('tenants')
            ->where('id', $id)
            ->update(['image_path' => $img_res->file_path]);
    }

    return DV::depends(1, [
        'tenants' => $inputs,
        'id'      => $id
    ]);
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
            ->selectRaw("t.id,t.name,t.legal_name,t.image,t.national_id,passport_number,t.sex,t.phone_number,t.email,t.address,$updated_at,t.update_user")->orderBy('t.id','DESC');
        $clone_query = clone $query;
        $count = $clone_query->count('t.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows,$count,$per_page,$current_page);

    }

    public static function getDetails($id){
        return DB::table('tenants as t')
            ->where('t.id',$id)
            ->selectRaw('t.id,t.name,t.national_id,passport_number,t.image,t.sex,t.legal_name,t.phone_number,t.email,t.address')
            ->first();
    }

    public static function getFormOptions($id){
        $details = $id ? self::getDetails($id) : null;
        return (object) [
            'tenants' => $details,
        ];
    }

    public function delete($id = null){
        $id = $id ?? $this->id;
        $deleted = DB::table('tenants')->where('id',$id)->delete();
        return $deleted ? DV::depends($deleted,['action'=>'deleted']) : DV::error('Delete failed.');
    }
}
