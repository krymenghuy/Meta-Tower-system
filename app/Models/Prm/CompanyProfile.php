<?php

namespace App\Models\Prm;
use App\Models\Prm\GeneralSettings;
use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use Vsd\Vsloquent\VSModel;
use XPublicStorage;



class CompanyProfile extends VSModel //extends Model
{
    protected $table = 'company_profiles';
    protected $userInfo = null;
    protected static $img_dir = 'company_profiles';
    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;

    }

    function upsert($arr = [], $id = null, $ss = null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id ?? null;
        
        $v_rule = [
        'name' => '1|string|1-150',
        'phone_number' => '1|phone|0-80',
        'email' => '0|email|0-100',
        'first_cp_name' => '0|string|0-100',
        'second_cp_name' => '0|string|0-100',
        'address' => '0|string|0-250',
        'first_cp_phone' => '0|phone|0-50',
        'second_cp_phone' => '0|phone|0-50',
        'logo' => '0|image'
        ];

        $email_char = ['@', '.'];
        $address_char = ['@', ',', '.', '#'];
        $name_char = ['@', '.', '#'];

        $res = DBX::validateObject($arr, $v_rule, 1, ['logo' => GeneralSettings::$image_chars, 'email' => $email_char, 'address' => $address_char,  'first_cp_name' => $name_char, 'second_cp_name' => $name_char], $ss->lang, 0, null);
        if ($res->error)
        return DV::error($res->error);
        $inputs = $res->values;
        $d = (object) $inputs;
        $email =$d->email ?? null;
        if ($email !== null && $email !== '') {
                if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    return DV::error('Invalid email format.');
                }
        }

        $phone_number = isset($d->phone_number) ? str_replace(' ', '', $d->phone_number) : null;
        $inputs['phone_number'] = $phone_number;

        $address = $d ->address ?? null;
         if(!$address){
            return DV::error('Address is required.');
        }

        $logo = $d ->logo ?? null;
        unset($inputs['logo']);
        $create = !$id;
        $id = DBX::saveData($ss,'company_profiles',['id'=>$id],input, []);
        if($create){
            $id->branch_id = $branch_id;
            $id->save();
            $cp_id = $id->id;
            $customer_id = Company::upsert(['name'=>$d->name, 'customer_type_id'=>1, 'phone_number'=>$phone_number, 'email'=>$email, 'address'=>$address, 'branch_id'=>$branch_id], null, $ss);

            if($cp_id > 0){
                $id->customer_id = $customer_id;
                $id->save();
            }
        }

        return DV::depends($customer_id, null, 'Failed to update company information');
    }



 


   


}