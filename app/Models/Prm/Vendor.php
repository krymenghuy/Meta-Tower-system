<?php

namespace App\Models\Prm;
use App\Models\Prm\GeneralSettings;
use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use XPublicStorage;


class Vendor //extends Model
{

    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'vendors';
    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;

    }

    public function saveVendor($arr = [], $id = null, $ss = null)
{
    $id = $id ?? $this->id;
    $ss = $ss ?? $this->userInfo;

    $v_rule = [
        'name' => '1|string|1-150',
        'phone' => '0|string|0-50',
        'email' => '0|string|0-100',
        'address' => '0|string|0-255',
        'contact_person' => '0|string|0-100',
        'vendor_type_id' => '0|number|exists=vendor_types.id',
        'status_id' => '0|number|default=1',
        'remarks' => '0|string|0-255'
    ];

    $email_char  = ['@','.','-','_'];
    $address_char = ['@',',','.','#'];

    $res = DBX::validateObject($arr, $v_rule, 1, ['email'=>$email_char,'address'=>$address_char], $ss->lang, 0, null);
    if ($res->error)
        return DV::error($res->error);

    $inputs = $res->values;

    // check exist name
    $exist = DB::table('vendors')
        ->whereRaw('LOWER(name)=?', [strtolower($inputs['name'])])
        ->when($id, function($q) use ($id){
            $q->where('id','<>',$id);
        })
        ->exists();

    if($exist)
        return DV::error('Vendor name already exists!');

    $id = DBX::saveData($ss, 'vendors', ['id'=>$id], $inputs, [], 1);

    if ($id > 0) {
        return DV::depends(1, ['vendors'=>$inputs, 'id'=>$id]);
    }

    return DV::error('Error saving vendor!');
}
}
