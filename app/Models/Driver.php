<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DB;
use Carbon\Carbon;
//use Data Validator
use App\Models\DV;

class Driver extends Model
{
    use HasFactory;
    
    function driverExists($uss,$name,$id) {
        $branch_id = $uss->branch_id;
        $rows = [];
        if($id>0)
          $rows = DB::table('driver')->where('branch_id',$branch_id)->where('name',$name)->where('id','<>',$id)->selectRaw('id')->limit(1)->get();
        else
          $rows = DB::table('driver')->where('branch_id',$branch_id)->where('name',$name)->selectRaw('id')->limit(1)->get(); 
        foreach($rows as $row) return true;
        return false;
    }

    function driverCodeExists($uss,$code,$id) {
        $branch_id = $uss->branch_id;
        $rows = [];
        if($id>0)
          $rows = DB::table('driver')->where('branch_id',$branch_id)->where('code',$code)->where('id','<>',$id)->selectRaw('id')->limit(1)->get();
        else
          $rows = DB::table('driver')->where('branch_id',$branch_id)->where('code',$code)->selectRaw('id')->limit(1)->get(); 
        foreach($rows as $row) return true;
        return false;
    }

  //return driverInfo (name, name_kh, phone_number, address,email) to Driver mobile app
 //when Merchant tries to update their profile info
 function getProfileInfo($d) {
  $ss = getSessionInfo($d);
  if(!$ss) return '#350'; //user not authenticated
  if (!prn_allowed(2)) return '@'; //need permission to do this task
  $branch_id = $ss->branch_id;
  $driver_id = isset($d->driver_id)?$d->driver_id:null;

    $rows = DB::table('driver as d')->selectRaw("d.id,d.name,d.name_kh,d.email,d.phone_number,address")->where('d.branch_id',$branch_id)->where('d.id',$driver_id)->limit(1)->get();
    //  foreach($rows as $row){
    //    $row->bank_accounts = DB::table('sender_bank_accounts AS acc')->where('branch_id',$branch_id)->where('sender_id',$sender_id)->selectRaw('acc.id,acc.is_primary,acc.bank_name, acc.account_number, acc.account_name')->get(); 
    //    return $row;
    //  } 
    foreach($rows as $row){
      $row->image_url = PublicStorage::getProfilePhoto_url($branch_id,'driver',$driver_id);
      return $row;
    }
    return null; 
}


    function getDriverInfoById($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $id = $d->driver_id;
        $rows = DB::table('driver AS s')->where('branch_id',$branch_id)->where('id',$id)->selectRaw('id,national_id,driver_license_number,code,name,phone_number,email,emp_type,status_code, (SELECT warehouse_id FROM driver_warehouses as dw WHERE dw.branch_id = s.branch_id AND dw.driver_id = s.id AND dw.is_default =1 LIMIT 1) AS default_warehouse_id')->limit(1)->get();
        foreach($rows as $row) return $row;
        return null;
    }

    //$d={'otp_code','login_name'}
    function activateDriver_otp($d){
      $ss = getSessionInfo($d);
      if(!$ss) return '#350'; //user not authenticated
      if (!prn_allowed(2)) return '@'; //need permission to do this task
      $branch_id = $ss->branch_id;
      $otp_code = isset($d->otp_code)?$d->otp_code:null;
      //$user_id = $d->user_id;
      $login_name = isset($d->login_name)? $d->login_name:null;
      $result = (object)array('status'=>'OK','error_message'=>null);

      $rows = DB::table('um_users AS u')->where('login_name',$login_name)->selectRaw('u.otp_code')->limit(1)->get();
      foreach($rows as $row){
        if ($row->otp_code ==$otp_code) {
          DB::table('um_users')->where('login_name',$login_name)->update(array('otp_code'=>null,'status'=>'active','is_locked'=>0));
          $result->status ='OK';
          return $result;
        }else {
          $result->status ='Error';
          $result->error_message ='Incorrect otp code';
          return $result;
        }
      }
          $result->status ='Error';
          $result->error_message ='Could not find matching otp code';
          return $result;
  }


    function registerDriver($d) {
      $app_id = isset($d->app_id)? $d->app_id:null;
      $result = (object)array('status'=>'OK','error_message'=>null);
      
      //Make sure the app_id supplied is the Driver Mobile App
      if ($app_id != '584C7FF2122D11EC89909801A8B0D7XKD' || empty($app_id)) {
        $result->status ='Error';
        $result->error_message ='App ID is not valid';
        return $result;
      }

      $branch_id =1; //1 = "Pro Express" // $this->getBranchByApp($app_id);
      $otp_code = null;
      $driver_id= null;
      $driver_code = null;

      if(!isset($d->id)) $d->id = 0;
      $id = $d->id;

      // if ($d->adr_country_id) $d->adr_country_id = null;
      // if ($d->adr_city_id) $d->adr_city_id = null;
      // if ($d->adr_district_id) $d->adr_district_id = null;
      //$d->pickup_commission_rate =isset($d->pickup_commission_rate)?$d->pickup_commission_rate:0;
      //$d->delivery_commission_rate = isset($d->delivery_commission_rate )?$d->delivery_commission_rate:0;
      $d->salary = isset($d->salary)?sanitize($d->salary):0;
      $d->shift = isset($d->shift)?sanitize($d->shift):'HD'; //default work shift to FD ="Half Day"
      $d->vehicle_type = isset($d->vehicle_type)?sanitize($d->vehicle_type):null;
      $d->vehicle_number = isset($d->vehicle_number)?sanitize($d->vehicle_number):null;
      $d->driver_license_number = isset($d->driver_license_number)? sanitize($d->driver_license_number):null;
      $d->email = isset($d->email)?sanitize($d->email,'email'):null;

      $work_shifts =['FD','HD'];
      if(!in_array($d->shift,$work_shifts)) {
        $result->status ='Error';
        $result->error_message ='Work shift is not correct';
        return $result;
      }

      if (strlen($d->vehicle_number)>15) {
         return DV::error('Vehicle number is too long. Max 15 characters');
      }
      if(!isset($d->phone_number) || empty($d->phone_number)) {
         return DV::error('Phone number or login name cannot be empty');
      }

      if(!isset($d->name) || empty($d->name)) {
        $result->status ='Error';
        $result->error_message ='Driver name cannot be empty';
        return $result;
      }

      $ss = (object)array('branch_id'=>$branch_id);
      if ($this->driverExists($ss,$d->name,$d->id)) {
          $result->status ='Error';
          $result->error_message ='Driver name already exists';
          return $result;
      }
      $emp_types = ['part time','full time'];
      if (in_array(strtolower($d->emp_type),$emp_types)){
        $d->emp_type ='part time'; // set default to part time
        // $result->status ='Error';
        // $result->error_message ='Employment type is not correct';
        // return $result;
      }

      // if ($this->driverCodeExists($ss,$d->code,$d->id)) {
      //     $result->status ='Error';
      //     $result->error_message ='Driver ID already exists';
      //     return $result;
      // }

      //start:: check phone number exists as login name
            $login_name = $d->phone_number;
            $rows = DB::table('um_users AS u')->where('login_name',$login_name)->selectRaw('login_name')->limit(1)->get();
            foreach($rows as $row){
              $result->status ='Error';
              $result->error_message ='Login name or phone number for driver already exists';
              return $result;
            }
        //end:: check if phone number exists as login name
     if(!isset($d->name_kh)) $d->name_kh = $d->name;
          DB::table('driver')->insert(array(
              'branch_id'=>$branch_id,
              //'code'=>null,
              'name'=>$d->name,
              'name_kh'=>$d->name_kh,
              'sex'=>$d->sex,
              'emp_type'=>$d->emp_type, 
              'shift'=>$d->shift,
              'vehicle_type'=>$d->vehicle_type,
              'vehicle_number'=>$d->vehicle_number,
              'driver_license_number'=>$d->driver_license_number,           
              'national_id'=>$d->national_id,
              'status_code'=>'active',
              'address'=>$d->address,
              'salary'=>$d->salary, 
              // 'adr_country_id'=>$d->adr_country_id,
              // 'adr_city_id'=>$d->adr_city_id,
              // 'adr_district_id'=>$d->adr_district_id,
              'phone_number'=>$d->phone_number,
              'email'=>$d->email,
              'cp_name'=>$d->cp_name,
              'cp_relationship'=>$d->cp_relationship,
              'cp_phone_number'=>$d->cp_phone_number,
              'create_user'=>'self register',
              'create_date'=>getNowTime()
          )); 

          $driver_id = DB::getPdo()->lastInsertId();
          if ($driver_id > 0) {

                      //update driver's code or formal ID
                      $driver_code = $this->getNextDriverCode($ss); //formatNumber($driver_id,4);
                      DB::table('driver')->where('id',$driver_id)->where('branch_id',$branch_id)->update(array(
                          'code'=>$driver_code
                      ));
       
                      $default_role_id = 13; //role_id =13 => "Drivers"// todo: protect role_id 13 from being renamed or deleted
                      $d->user_id  = $driver_id;
                      //$this->UMModel->addRoleMember1($ss,$default_role_id,$d->user_id); 
                      DB::table('um_user_roles')->where('branch_id',$branch_id)->where('role_id',$default_role_id)->where('user_id',$d->user_id)->delete();
                      DB::table('um_user_roles')->insert(array('branch_id'=>$branch_id,'user_id'=>$d->user_id,'role_id'=>$default_role_id,'app_id'=>$app_id));
                  //end::create user profile
                
                $result->status ='OK';
                $result->error_message =null;
                $result->driver_id =$driver_id;
                $result->code = $driver_code; //Official ID of the merchant
                return $result;   
          } else {
                $result->status ='Error';
                $result->error_message ='There was a problem in creating your profile'; // unexpected problem
                return $result;
          }
  }
 
  function getComboItems_vehicleType($d){
    $ss = getSessionInfo($d);
    if(!$ss) return '#350'; //user not authenticated
    if (!prn_allowed(2)) return '@'; //need permission to do this task
    $branch_id = $ss->branch_id;
    $rows = DB::table('vehicle_type AS t')->where('t.branch_id',$branch_id)->selectRaw('t.code, t.name AS vehicle_type')->get();
    return $rows;
  }

  function getNextDriverCode($uss,$len =4){
      $branch_id = $uss->branch_id;
      $prefix='';
      $rows = DB::table('driver_code_control AS c')->where('branch_id',$branch_id)->limit(1)->selectRaw('TRIM(c.prefix) AS prefix,c.last_driver_number')->get();
      foreach($rows as $row) {
          $num = $row->last_driver_number;
          $prefix = trim($row->prefix);
          $num +=1;
          DB::table('driver_code_control')->where('branch_id',$branch_id)->update(array('last_driver_number'=>$num));
          return $prefix.$branch_id.formatNumber($num,$len);
      }
      DB::table('driver_code_control')->insert(array('branch_id'=>$branch_id,'last_driver_number'=>1));
      return $prefix.$branch_id.formatNumber(1,$len);
  }
    function saveDriver($d) {
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task

        $branch_id = $ss->branch_id;
        $result =(object)[];
        $driver_id= null;
        $driver_code = null;

        if(!isset($d->id)) $d->id = 0;
        $id = $d->id;

        // if ($d->adr_country_id) $d->adr_country_id = null;
        // if ($d->adr_city_id) $d->adr_city_id = null;
        // if ($d->adr_district_id) $d->adr_district_id = null;
        //$d->pickup_commission_rate =isset($d->pickup_commission_rate)?$d->pickup_commission_rate:0;
        //$d->delivery_commission_rate = isset($d->delivery_commission_rate )?$d->delivery_commission_rate:0;
        $d->salary = isset($d->salary)?sanitize($d->salary):0;
        $d->shift = isset($d->shift)?sanitize($d->shift):'HD'; //default work shift to FD ="Half Day"
        $d->vehicle_type = isset($d->vehicle_type)?sanitize($d->vehicle_type):null;
        $d->vehicle_number = isset($d->vehicle_number)?sanitize($d->vehicle_number):null;
        $d->driver_license_number = isset($d->driver_license_number)? sanitize($d->driver_license_number):null;
        $d->email = isset($d->email)?sanitize($d->email,'email'):null;
        $allow_fast_delivery = isset($d->allow_fast_delivery)?sanitize($d->allow_fast_delivery):0; 
        $default_warehouse_id = isset($d->default_warehouse_id)?$d->default_warehouse_id:null; 

        $work_shifts =['FD','HD'];
        if(!in_array($d->shift,$work_shifts)) {
          return DV::error('Work shift is not correct');
        }

        if(empty($default_warehouse_id )) {
          return DV::error('Default warehouse identity is not valid!');
        }

        if(!isset($d->name) || empty($d->name)) {
          return DV::error('Driver name cannot be empty');
        }

        if ($this->driverExists($ss,$d->name,$d->id)) {
            return DV::error('Driver name already exists');
        }
        
        if (strlen($d->vehicle_number) > 15){
          return DV::error('Vehicle number is too long');
        }  
         
        // if ($this->driverCodeExists($ss,$d->code,$d->id)) {
        //     $result->status ='Error';
        //     $result->error_message ='Driver ID already exists';
        //     return $result;
        // }

       if(!isset($d->name_kh)) $d->name_kh = $d->name;
        
       if ($id > 0) {
            DB::table('driver')->where('id',$id)->where('branch_id',$branch_id)->update(array(
                //'branch_id'=>$branch_id,
                'allow_fast_delivery'=>$allow_fast_delivery,
                'code'=>$d->code,
                'name'=>$d->name,
                'name_kh'=>$d->name_kh,
                'sex'=>$d->sex,
                'emp_type'=>$d->emp_type,
                'shift'=>$d->shift,
                'vehicle_type'=>$d->vehicle_type,
                'vehicle_number'=>$d->vehicle_number,
                'driver_license_number'=>$d->driver_license_number, 
                //'status_code'=>$d->status_code,
                'salary'=>$d->salary, 
                'national_id'=>$d->national_id,
                'address'=>$d->address,
                // 'adr_country_id'=>$d->adr_country_id,
                // 'adr_city_id'=>$d->adr_city_id,
                // 'adr_district_id'=>$d->adr_district_id,
                'phone_number'=>$d->phone_number,
                'email'=>$d->email,
                'cp_name'=>$d->cp_name,
                'cp_relationship'=>$d->cp_relationship,
                'cp_phone_number'=>$d->cp_phone_number,
                'update_user'=>$ss->login_name,
                'update_date'=>getNowTime()
            )); 
          $driver_id = $id;
          $driver_code = $d->code;   
       } else {
            DB::table('driver')->insert(array(
                'branch_id'=>$branch_id,
                'allow_fast_delivery'=>$allow_fast_delivery,
                //'code'=>null,
                'name'=>$d->name,
                'name_kh'=>$d->name_kh,
                'sex'=>$d->sex,
                'emp_type'=>$d->emp_type, 
                'shift'=>$d->shift,
                'vehicle_type'=>$d->vehicle_type,
                'vehicle_number'=>$d->vehicle_number,
                'driver_license_number'=>$d->driver_license_number,           
                'national_id'=>$d->national_id,
                'status_code'=>'active',
                'address'=>$d->address,
                'salary'=>$d->salary, 
                // 'adr_country_id'=>$d->adr_country_id,
                // 'adr_city_id'=>$d->adr_city_id,
                // 'adr_district_id'=>$d->adr_district_id,
                'phone_number'=>$d->phone_number,
                'email'=>$d->email,
                'cp_name'=>$d->cp_name,
                'cp_relationship'=>$d->cp_relationship,
                'cp_phone_number'=>$d->cp_phone_number,
                'create_user'=>$ss->login_name,
                'create_date'=>getNowTime()
            )); 

            $driver_id = DB::getPdo()->lastInsertId();
            $driver_code = $this->getNextDriverCode($ss); //formatNumber($driver_id,4);
            DB::table('driver')->where('id',$driver_id)->where('branch_id',$branch_id)->update(array(
                'code'=>$driver_code
            ));
       }
       DB::table('driver_warehouses')->where('branch_id',$branch_id)->where('driver_id',$driver_id)->where('is_default',1)->delete();
       DB::table('driver_warehouses')->insert(array(
        'branch_id'=>$branch_id,
        'driver_id'=>$driver_id,
        'warehouse_id'=>$default_warehouse_id,
        'is_default'=>1
       ));

       $result->status ='OK';
       $result->error_message =null;
       $result->driver_id =$driver_id;
       $result->code = $driver_code; //Official ID of the merchant
       return $result;   
    }
    
    function saveDriverCommissions($d) {
      $ss = getSessionInfo($d);
      if(!$ss) return '#350'; //user not authenticated
      if (!prn_allowed(2)) return '@'; //need permission to do this task
      $branch_id = $ss->branch_id;
    
      if (!isset($d->salary)) $d->salary = 0;
      if (!isset($d->emp_type)) $d->emp_type =null;
      if (!isset($d->shift)) $d->shift = null;
      if (!isset($d->driver_id)) $d->driver_id = null;
     
      $work_shifts =['FD','HD'];
      // $work_shifts[] = array('shift'=>'FD','shift_name'=>'Full Day');
      // $work_shifts[] = array('shift'=>'HD','shift_name'=>'Half Day');  
      $emp_types =['full time','part time'];
      $d->shift = strtoupper($d->shift);
      if (empty($d->driver_id) || $d->driver_id <=0) return "Driver identity is not valid";

      if (!in_array(strtoupper($d->shift),$work_shifts)) return "Work Shift is not correct";
      if (!in_array(strtolower($d->emp_type),$emp_types)) return "Employment Type is not correct";

      DB::table('driver')->where('branch_id',$branch_id)->where('id',$d->driver_id)->update(array(
        'salary'=>$d->salary,
        'emp_type'=>$d->emp_type,
        'shift'=>$d->shift,
        'update_user'=>$ss->login_name,
        'update_date'=>getNowTime()
      ));

      $cs = $d->rates;
      $i=0;
      $c= null;
      do{
         if(!isset($cs[$i])) break;
          $c = (object)$cs[$i];
          $c->delivery_type = isset($c->delivery_type)?$c->delivery_type:'Normal';
          $c->commission_pickup = isset($c->commission_pickup)?$c->commission_pickup:0;
          $c->commission_delivery = isset($c->commission_delivery)?$c->commission_delivery:0;
          $c->commission_rate_pickup = isset($c->commission_rate_pickup)?$c->commission_rate_pickup:0;
          $c->commission_rate_delivery = isset($c->commission_rate_delivery)?$c->commission_rate_delivery:0;
          $c->commission_per_pickup = isset($c->commission_per_pickup)?$c->commission_per_pickup:1;

          $rows = DB::table('driver_commissions')->where('branch_id',$branch_id)->where('delivery_type',$c->delivery_type)->where('driver_id',$d->driver_id)->limit(1)->get();
          if(COUNT($rows) >=1) {
            DB::table('driver_commissions')->where('branch_id',$branch_id)->where('delivery_type',$c->delivery_type)->where('driver_id',$d->driver_id)->update(array(
              'pickup_commission_rate'=>$c->commission_rate_pickup,
              'delivery_commission_rate'=>$c->commission_rate_delivery,
              'pickup_commission'=>$c->commission_pickup,
              'delivery_commission'=>$c->commission_delivery,
              'commission_per_pickup'=>$c->commission_per_pickup, //default to 1
              'use_rate'=>0,
              'is_current'=>1,
              'create_user'=>$ss->login_name,
              'create_date'=>getNowTime()
            ));  
  
          } else{
              DB::table('driver_commissions')->insert(array(
                'branch_id'=>$branch_id,
                'driver_id'=>$d->driver_id,
                'delivery_type'=>$c->delivery_type,
                'pickup_commission_rate'=>$c->commission_rate_pickup,
                'delivery_commission_rate'=>$c->commission_rate_delivery,
                'pickup_commission'=>$c->commission_pickup,
                'delivery_commission'=>$c->commission_delivery,
                'commission_per_pickup'=>$c->commission_per_pickup,
                'use_rate'=>0,
                'is_current'=>1,
                'create_user'=>$ss->login_name,
                'create_date'=>getNowTime()
              ));  
          }
        
         $i++;
      }while($c);
      return null;
    }

    function updateDriverStatus($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task

       $branch_id = $ss->branch_id;
       $id = $d->driver_id;
       if(!isset($d->status_code)) $d->status_code ='active';
       DB::table('driver')->where('branch_id',$id)->where('id',$id)->update(array(
           'status_code'=>$d->status_code
       ));
       return null;
    }
  
  function getDriverCommissions($d){
    $ss = getSessionInfo($d);
    if(!$ss) return '#350'; //user not authenticated
    if (!prn_allowed(2)) return '@'; //need permission to do this task
    $branch_id = $ss->branch_id;
  
    $data = (object)(array('rates'=>[],'salary'=>0,'emp_type'=>null,'shift'=>null,'driver_id'=>null,'driver_name'=>null,'driver_code'=>null)); 
    $rows = DB::table('driver AS d')->where('d.branch_id',$branch_id)->where('id',$d->driver_id)->limit(1)->selectRaw('d.id, d.name, d.code,d.emp_type,d.shift,IFNULL(d.salary,0) AS salary')->get();
    foreach($rows as $row) {
      $data->driver_id = $row->id;
      $data->driver_code = $row->code;
      $data->driver_name = $row->name;
      $data->salary = $row->salary;
      $data->shift = strtoupper($row->shift);
      $data->emp_type = strtolower($row->emp_type);
    }
    $rows = DB::table('driver_commissions AS c')->where('c.branch_id',$branch_id)->where('c.driver_id',$d->driver_id)->selectRaw('c.driver_id,c.delivery_type,c.pickup_commission, c.delivery_commission,c.use_rate, c.is_current')->get();
    
    $data->rates = $rows;
    return $data;
  }

  function driver_in_use($uss,$id) {
      $branch_id = $uss->branch_id;
      $rows = DB::table('order')->where('branch_id',$branch_id)->where('driver_id',$id)->selectRaw('driver_id')->limit(1)->get();
      if(count($rows) >0) return true;
      $rows = DB::table('delivery')->where('branch_id',$branch_id)->where('driver_id',$id)->selectRaw('driver_id')->limit(1)->get();
      if(count($rows) >0) return true;
      return false;
  } 

  function deleteLogin_by_officialId($user_class,$official_id=-1){
    $login_name = null;
    $user_id = null;
    $rows = DB::table('um_users as u')->where('u.official_id',$official_id)->where('user_class',$user_class)->selectRaw('u.login_name, u.id as user_id')->limit(1)->get();
    foreach($rows as $row) {
      $login_name = $row->login_name;
      $user_id = $row->user_id;
    }
    
    DB::table('um_user_roles')->where('user_id',$user_id)->delete();
    DB::table('um_users')->where('id',$user_id)->delete();
  }

  function deleteDriver($d){
    $ss = getSessionInfo($d);
    if(!$ss) return '#350'; //user not authenticated
    if (!prn_allowed(2)) return '@'; //need permission to do this task

      $branch_id = $ss->branch_id;
      $id = $d->driver_id;
      if ($this->driver_in_use($ss,$id)) {
          return "Cannot delete this driver because there are some pickups or delviery tasks done already";
      } 
     
      DB::table('driver')->where('branch_id',$branch_id)->where('id',$id)->delete();
      DB::table('driver_commissions')->where('branch_id',$branch_id)->where('driver_id',$id)->delete();

      //delete data from table "um_users" and "um_user_roles"
      $this->deleteLogin_by_officialId('driver',$id);
      return null;
  }

  function getDriverById($d) {
    $ss = getSessionInfo($d);
    if(!$ss) return '#350'; //user not authenticated
    if (!prn_allowed(2)) return '@'; //need permission to do this task
    $branch_id = $ss->branch_id;
    $id = $d->driver_id;
      /***
        $users = DB::table('users')
            ->join('contacts', 'users.id', '=', 'contacts.user_id')
            ->join('orders', 'users.id', '=', 'orders.user_id')
            ->select('users.*', 'contacts.phone', 'orders.price')
            ->get();  
        ***/
     $rows = DB::table('driver as s')->selectRaw("s.id,s.code,s.national_id,s.name,s.sex,s.name_kh,s.address,s.phone_number,encode_email(s.email) AS email,s.emp_type,s.shift, s.vehicle_type, s.vehicle_number,s.driver_license_number,s.status_code, (SELECT warehouse_id FROM driver_warehouses as dw WHERE dw.branch_id = s.branch_id AND dw.driver_id = s.id AND dw.is_default =1 LIMIT 1) AS default_warehouse_id")->where('s.branch_id',$branch_id)->where('s.id',$id)->limit(1)->get();
     foreach($rows as $row) return $row;
     return null;
 }

 function getDriverList($d){
    $ss = getSessionInfo($d);
    if(!$ss) return '#350'; //user not authenticated
    if (!prn_allowed(2)) return '@'; //need permission to do this task

     $branch_id = $ss->branch_id;
     $emp_type = isset($d->emp_type)?$d->emp_type:null;
     $shift = isset($d->shift)?$d->shift:null;
     $status_code = isset($d->status_code)?$d->status_code:null;
     $search_value = isset($d->search_value)?$d->search_value:null;
         $str_emp_type = null;
         $str_shift = null;
         $str_search =null;
         $str_status =null;
         $more_wheres ="1=1 ";
         if (empty($search_value)) {
            if(!empty($shift) && $shift != '0') $str_shift = " AND s.shift ='".$shift."' ";
            if(!empty($emp_type)) $str_emp_type ="AND s.emp_type ='".sanitize($emp_type)."' ";
            if(!empty($status_code)) $str_status ="AND s.status_code ='".sanitize($status_code)."' ";
            $more_wheres .=$str_emp_type.$str_status.$str_shift;
         } else {
            $str_search = "AND (s.name LIKE '%".escape_like_str($search_value)."%' OR s.phone_number ='".sanitize($search_value)."' )"; 
            $more_wheres .=$str_search;
         }
         $rows = DB::table('driver as s')->selectRaw("'Default Warehouse' AS warehouse_name,s.id,s.code,s.national_id,s.status_code,s.name,s.name_kh,s.sex,s.driver_license_number,s.vehicle_type,s.vehicle_number,s.address,s.phone_number,encode_email(s.email) AS email,s.emp_type,salary,s.shift, s.delivery_commission_type,s.pickup_commission_type,s.role")->where('s.branch_id',$branch_id)->whereRaw($more_wheres)->get();
         //$rows = DB::table('driver as s')->join('driver_warehouses AS dw','dw.driver_id','=','s.id')->join('warehouses AS h','dw.warehouse_id','=','h.id')->selectRaw("h.name AS warehouse_name,s.id,s.code,s.national_id,s.status_code,s.name,s.name_kh,s.sex,s.driver_license_number,s.vehicle_type,s.vehicle_number,s.address,s.phone_number,encode_email(s.email) AS email,s.emp_type,salary,s.shift, s.delivery_commission_type,s.pickup_commission_type,s.role")->where('s.branch_id',$branch_id)->whereRaw($more_wheres)->get();
    return $rows;
 }
    function getFormData_driverdialog($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task

        $branch_id = $ss->branch_id;
        $data= (object)[];

        $work_shifts =[];
         $work_shifts[] = array('shift'=>'FD','shift_name'=>'Full Day');
        $work_shifts[] = array('shift'=>'HD','shift_name'=>'Half Day'); 

        $data->shifts = $work_shifts;
        $data->warehouses = DB::table('warehouses')->selectRaw('id, name as warehouse_name')->where('branch_id',$branch_id)->get();
        $data->emp_types = DB::table('employment_types')->selectRaw('name AS emp_type')->get();
        $data->driver_statuses = DB::table('driver_statuses')->selectRaw('code as status_code,name as status_name')->get();
        $data->vehicle_types = DB::table('vehicle_type')->where('branch_id',$branch_id)->selectRaw('`code`,`name` AS vehicle_type')->get();
        return $data;
    }

    //getPackageListByDriver() returns list of packages (ordered by Fleet_tracking_number) that are delivered by a driver given by the paramater @driver_id
    //This method is used for api method to return list of packages delvered by a driver 
    function getPackageListByDriver($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $depart_date = isset($d->depart_date)? convertDate($d->depart_date):null; //depart_time or depart_date
        $booking_date = isset($d->booking_date)? convertDate($d->booking_date):null;
        $arrival_date = isset($d->arrival_date)? convertDate($d->arrival_date):date('Y-m-d');

        $driver_id = isset($d->driver_id)?sanitize($d->driver_id):null;
        $str_date_arrival =" AND DATE(p.arrival_time) ='".$arrival_date."' ";
        $str_date_booking =null;
        $str_date_depart = null;
        if ((bool)strtotime($booking_date)) $str_date_booking =" AND DATE(p.create_date) ='".$booking_date."' ";
        if ((bool)strtotime($depart_date)) $str_date_depart =" AND DATE(d.depart_time) ='".$depart_date."' ";

        $str_status =" AND p.status_id IN (8,9,11)"; // Driver's delivery history => show only ("Delivered","failed","Returned" items)
        $more_wheres ="1=1".$str_status.$str_date_booking.$str_date_depart; //.$str_date_arrival
        $selectCols ="d.id AS delivery_id, d.fleet_tracking_number, d.driver_id, DATE_FORMAT(d.create_date,'%d %b %Y %r') AS booking_date,d.warehouse_id,p.qr_code AS barcode,p.sender_name,p.sender_phone,p.package_name, p.product_type,p.dim_x, p.dim_y, p.dim_h, p.billed_kg, p.price,p.cod, p.cod_fee, p.base_fee,p.delivery_fee, p.zone_code,p.zone_name, IFNULL(p.forwarding_cost,0) AS forwarding_cost,p.delivery_notes,p.failure_notes, IFNULL(p.driver_total,0) AS driver_total,IFNULL(p.sender_total,0) AS sender_total, p.exchange_rate AS exchange_rate,p.status_id, (SELECT ps.name FROM package_statuses AS ps WHERE ps.id =p.status_id LIMIT 1) AS status, DATE_FORMAT(p.delivery_time,'%d %b %Y %r') AS delivery_time,p.agent_notes,d.status_id AS trip_status_id, ds.name AS trip_status, h.name AS from_warehouse_name, 'Motobike' AS vehicle_type";
        $rows = DB::table('delivery AS d')->join('delivery_statuses AS ds','ds.id','=','d.status_id')->join('package AS p','p.delivery_id','=','d.id')->join('warehouses AS h','h.id','=','d.warehouse_id')->where('p.branch_id',$branch_id)->where('d.driver_id',$driver_id)->whereRaw($more_wheres)->selectRaw($selectCols)->orderByRaw('p.create_date DESC,d.id ASC,p.sender_id')->get(); 
        return $rows;
      }

      //returns Active or Ongoing trip of a driver
      function getActiveTrips($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $driver_id = isset($d->driver_id)?$d->driver_id:0;
        $trip_status_id =2; // Deliery Started or "Shipping" or "On the way" or "On-going"
        $selectCols ="d.id AS delivery_id,DATE_FORMAT(d.depart_time,'%r')AS depart_time, DATE_FORMAT(d.depart_time,'%d %b %Y') AS depart_date,IFNULL(d.package_count,0) AS package_count, IFNULL(d.delivered_count,0) AS delivered_count, IFNULL(d.failed_count,0) AS failed_count,d.fleet_tracking_number,ds.id AS trip_status_id, ds.name AS trip_status";
        $rows = DB::table('delivery AS d')->join('delivery_statuses AS ds','ds.id','=','d.status_id')->where('d.branch_id',$branch_id)->where("d.status_id",$trip_status_id)->where('d.driver_id',$driver_id)->selectRaw($selectCols)->orderByRaw("d.depart_time DESC")->get();
        return $rows;
      }

      //getPackageListByTrip() returns ab object with header, and packages. "header" is trip details, "packages" is list of packages per trip
      function getPackageListByTrip($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $delivery_id = isset($d->delivery_id)?$d->delivery_id:0;
        //$trip_code = isset($d->fleet_tracking_number)?$d->fleet_tracking_number:null;
        //$delivery_id = isset($d->id)?$d->id:0;
         
        $driver_id =0;// isset($d->driver_id)?sanitize($d->driver_id):0;
        $str_driver =null;
        if ($driver_id > 0) $str_driver = " AND d.driver_id ='".$driver_id."' ";
        $more_wheres ="1=1".$str_driver;
        $selectCols ="d.id AS delivery_id,d.fleet_tracking_number, DATE_FORMAT(d.depart_time,'%d %b %Y %r') AS depart_time, d.driver_id,d.package_count,d.delivered_count,d.failed_count,d.status_id AS trip_status_id, ds.name AS trip_status";
        $rows = DB::table('delivery AS d')->join('delivery_statuses AS ds','ds.id','=','d.status_id')->where('d.branch_id',$branch_id)->where('d.id',$delivery_id)->whereRaw($more_wheres)->selectRaw($selectCols)->limit(1)->get();
        foreach($rows as $row) {
          $str_status = null; //" AND p.status_id IN (8,9,10,11)";
          $more_wheres ="1=1".$str_status;
          $selectCols ="d.id AS delivery_id, d.fleet_tracking_number, d.driver_id, DATE_FORMAT(d.create_date,'%d %b %Y %r') AS booking_date,d.warehouse_id,p.qr_code AS barcode,p.sender_name,p.sender_phone,p.package_name,p.receiver_name,p.receiver_phone, p.product_type,p.dim_x, p.dim_y, p.dim_h, p.billed_kg, p.price,p.cod, p.cod_fee, p.base_fee,p.delivery_fee, p.zone_code,p.zone_name, IFNULL(p.forwarding_cost,0) AS forwarding_cost,p.delivery_notes,p.failure_notes, IFNULL(p.driver_total,0) AS driver_total,IFNULL(p.sender_total,0) AS sender_total, p.exchange_rate AS exchange_rate,p.status_id, (SELECT ps.name FROM package_statuses AS ps WHERE ps.id =p.status_id LIMIT 1) AS status, DATE_FORMAT(p.delivery_time,'%d %b %Y %r') AS delivery_time,p.agent_notes,d.status_id AS trip_status_id, ds.name AS trip_status, h.name AS from_warehouse_name, 'Motobike' AS vehicle_type";
          $row->packages = DB::table('delivery AS d')->join('delivery_statuses AS ds','ds.id','=','d.status_id')->join('package AS p','p.delivery_id','=','d.id')->join('warehouses AS h','h.id','=','d.warehouse_id')->where('p.branch_id',$branch_id)->where('d.id',$delivery_id)->whereRaw($more_wheres)->selectRaw($selectCols)->orderByRaw('p.create_date DESC,d.id ASC,p.sender_id')->get();          
          return $row;
        }
        return null;        
      }  

    function getOrderProp($order_id,$prop){
       $rows = DB::table('order')->where('id',$order_id)->selectRaw($prop)->limit(1)->get();
       foreach($rows as $row) return $row->{$prop}; 
       return null;
    }

    //driver reject or cancel an order after being assigned to,
    //$d={'order_id',['driver_id']}
    function cancelOrder($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $order_id = isset($d->order_id)?$d->order_id:0;
        $driver_id = isset($d->driver_id)?$d->driver_id:0;
        $status_id = $this->getOrderProp($order_id,'status_id');
        if($status_id >2) return "Cannot cancel because the order is already picked"; 
        DB::table('order')->where('branch_id',$branch_id)->where('id',$order_id)->update(array(
          'driver_id'=>null,
          'status_id'=>1
        ));
        //todo: later: add condition WHERE driver_id = @driver_id so that only driver who is assigned to pickup can Cancel Order 
        return null;
    } 

     //Called by merchant mobile app to update user profile quickly
   function updateProfile_driver($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = isset($ss->branch_id)? sanitize($ss->branch_id):null;
        $result = (object)array('error_message'=>null,'status'=>'OK', 'change_phone_number'=>0);
        
        $driver_id = isset($d->driver_id)?$d->driver_id:null;
        $name = isset($d->name)?$d->name:null;
        $phone_number = isset($d->phone_number)?$d->phone_number:null;
        $address = isset($d->address)?$d->address:null;
        $email = isset($d->name)?$d->name:null;
        
        $required_fields =['name','phone_number'];
        $res = nonEmptyFields($d,$required_fields);
        if($res->status =='Error') return $res;
        
        if ($this->driverExists($ss,$name,$driver_id)) {
          return DV::error('It seems this name is already in use by another driver');
        }

        //Check if merchant changed his phoner number
           $dr = self::getDriverProps($driver_id,["phone_number"]);
           $org_phone_number =null;
           if($dr) $org_phone_number  = $dr->phone_number;

          if (!empty($org_phone_number) && !empty($phone_number) && ($org_phone_number != $phone_number)){
              $new_otp_code = $this->newOTP();
              $res = PendingTask::create('change_phone_number',$branch_id,$ss->user_id,$org_phone_number,$phone_number,$new_otp_code);
              if ($res->status=='OK'){
                $m = SMS::send($org_phone_number,"លេខសំងាត់ $new_otp_code សំរាប់ប្តូរលេខទូរសព្ទ័");
                if ($m->status =='Error') {
                  $result->sms_error = $m->error_message;
                } 
                $result->otp_code = $new_otp_code;
                $result->change_phone_number = 1;
              }else return $res;
          }
        //end of checking Phone number changing

        //// use dynamic arrays of fields to be updates
        // $inputs = [];
        // //Do not update phone number field, because it requires OTP code verification first
        // foreach($d as $prop => $value){
        //     if ($prop !='phone_numner')
        //       if(!empty($value)) $input[] = [$prop=>$value];   
        // }
 
        DB::table('driver')->where('branch_id',$branch_id)->where('id',$driver_id)->update(array(
          'name'=>$name,
          //'name_kh'=>$name_kg,
          'address'=>$address
          //,'email'=>$email
        ));

        //if(!isset($result->change_phone_number)) $result->change_phone_number =1;
        return $result;
  }
  function newOTP($length=6)
  {
      return join('', array_map(function($value) { return $value == 1 ? mt_rand(1, 9) : mt_rand(0, 9); }, range(1, $length)));
  }

  function getDriverProps($id,$props){
    $cols = implode(',',$props);
    $rows = DB::table('driver')->where('id',$id)->selectRaw($cols)->limit(1)->get();
    foreach($rows as $row) return $row;
    return null;
  }

    // function updateProfile_driver($d){
    //   $ss = getSessionInfo($d);
    //   if(!$ss) return '#350'; //user not authenticated
    //   if (!prn_allowed(2)) return '@'; //need permission to do this task
    //   $branch_id = $ss->branch_id;
    //   $id = isset($d->id)?$d->id:null;
    //   if(!$id) $id = isset($d->driver_id)?$d->driver_id:null;
      
    //   if(empty($id)) return DV::error('Driver identity is not valid');
      
    //   //$order_id = isset($d->order_id)?$d->order_id:0;
    //   DB::table('driver')->where('id',$id)->update(array(
    //     'name'=>$name
    //   )); 
    //   return DV::success();

    // }

    function getTermsAndConditions($d){
      //$ss = getSessionInfo($d);
      //if(!$ss) return '#350'; //user not authenticated
      //if (!prn_allowed(2)) return '@'; //need permission to do this task
      //$branch_id = $ss->branch_id;

      return "Here some terms and condition text for driver";
   } 

}
