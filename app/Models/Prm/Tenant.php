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

    public function createTenant($arr = [],$id = null, $ss = null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $v_rule = [
            'name' => '1|string|0-200|text=Tenant name must be provided',
            'legal_name' => '0|string|0-250',
            'phone_number' => '0|phone|0-23',
            'email' => '0|email|1-50',
            'address' => '0|string|0-350',
        ];
        $email_char = ['@','.','-','_'];
        $address_char = ['@',',','.','#'];
        $res = DBX::validateObject($arr,$v_rule,1,['email'=>$email_char,'address'=> $address_char],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        if(!$id) {
            $exist
        }

    }
}
