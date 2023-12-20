<?php

namespace App\Models;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use App\Models\UM;
use App\Models\GeneralSettings;
use DB;
use Carbon\Carbon;
use Sanitizer;
//use Data Validator
use App\Models\DV;
use Illuminate\Pagination\LengthAwarePaginator; 
//use Illuminate\Support\Facades\Log;
class Driver //extends Model
{
    //use HasFactory;
    protected $id = null;
    protected $userInfo = null;

    function __construct($id=null,$userInfo=null){
       $this->id =$id;
       $this->userInfo = $userInfo;
    }
    
    function driverExists($uss,$name,$id) {
        $branch_id = $uss->branch_id;
        $row = null;
        if($id>0)
          $row = DB::table('driver')->where('branch_id',$branch_id)->where('name',$name)->where('id','<>',$id)->selectRaw('id')->take(1)->first();
        else
          $row = DB::table('driver')->where('branch_id',$branch_id)->where('name',$name)->selectRaw('id')->take(1)->first(); 
        return $row? true:false;
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

//return Task object ['deliveries','pickups', delivery_count,'pickup_count']. deliveries is a list of assigned Deliveries, and 'pickups' is list of assigned pickups
//$d = {'driver_id'}
function getMyTasks($id=null,$ss=null){
  $id = $id?$id:$this->id;
  $ss = $ss?$ss:$this->userInfo; 
  $branch_id = $ss->branch_id;
  $driver_id = $id;
  $data = (object)['deliveries'=>[],'pickups'=>[],'pickup_count'=>0,'delivery_count'=>0];
   
  $selectCols ="d.id AS delivery_id,DATE_FORMAT(d.depart_time,'%r')AS depart_time, formatDate(d.depart_time) AS depart_date,IFNULL(d.package_count,0) AS package_count, IFNULL(d.delivered_count,0) AS delivered_count, IFNULL(d.failed_count,0) AS failed_count,d.fleet_tracking_number,ds.id AS trip_status_id, ds.name AS trip_status";
  $rows = DB::table('delivery AS d')->join('delivery_statuses AS ds','ds.id','=','d.status_id')->where('d.branch_id',$branch_id)->where("d.status_id",2)->where('d.driver_id',$driver_id)->selectRaw($selectCols)->orderByRaw("d.depart_time DESC")->get();
  $data->deliveries = $rows;
  //count number of trips, NOT packages
  $data->delivery_count = count($rows);

  $selectCols="o.id AS order_id,o.code AS order_code, o.delivery_type, s.id AS sender_id,s.`name` AS sender_name,s.phone_number AS sender_phone,o.pickup_address,o.loc_lat,o.loc_lng, ps.name AS `status`, o.status_id,formatDate(o.create_date) AS request_date, o.qty,o.actual_pkg_count, o.driver_id,o.completed";
  $rows = DB::table('order AS o')->join('sender AS s','s.id','=','o.sender_id')->join('package_statuses AS ps','ps.id','=','o.status_id')->where('o.branch_id',$branch_id)->where('o.driver_id',$driver_id)->where('o.status_id',2)->selectRaw($selectCols)->orderByRaw("o.create_date DESC")->get();
  $data->pickups = $rows;
  $data->pickup_count = count($rows);
  return $data;
}
//return warehouse object {'id','name','address'}
static function defaultWarehouse($driver_id){
   $rows = DB::table('driver_warehouses dw')->join('warehouses as w','w.id','=','dw.warehouse_id')->where('dw.driver_id',$driver_id)->where('is_default',1)->selectRaw("w.id,w.name,w.address")->take(1)->get();
   return isset($rows[0])?$rows[0]:(object)['id'=>null,'name'=>null,'address'=>null];
}

//return only COUNTs of taks (delivery and Pickup)
function getMyTaskCounts($id=null,$ss=null){
  $id = $id?$id:$this->id;
  $ss = $ss?$ss:$this->userInfo; 
  $branch_id = $ss->branch_id;
  $driver_id =$id;
  $data = (object)['pickup_count'=>0,'delivery_count'=>0];
   
  $selectCols = "COUNT(d.id) AS cnt";
  //$selectCols ="d.id AS delivery_id,DATE_FORMAT(d.depart_time,'%r')AS depart_time, DATE_FORMAT(d.depart_time,'%d %b %Y') AS depart_date,IFNULL(d.package_count,0) AS package_count, IFNULL(d.delivered_count,0) AS delivered_count, IFNULL(d.failed_count,0) AS failed_count,d.fleet_tracking_number,ds.id AS trip_status_id, ds.name AS trip_status";
  $rows = DB::table('delivery AS d')->join('delivery_statuses AS ds','ds.id','=','d.status_id')->where('d.branch_id',$branch_id)->where("d.status_id",2)->where('d.driver_id',$driver_id)->selectRaw($selectCols)->get();
  foreach($rows as $row) $data->delivery_count = $row->cnt;

  $selectCols="COUNT(o.id) AS cnt";
  $rows = DB::table('order AS o')->join('sender AS s','s.id','=','o.sender_id')->join('package_statuses AS ps','ps.id','=','o.status_id')->where('o.branch_id',$branch_id)->where('o.driver_id',$driver_id)->where('o.status_id',2)->selectRaw($selectCols)->get();
  foreach($rows as $row) $data->pickup_count = $row->cnt;
  return $data;
} 

 //return a list of Accepted pickup list accepted by a @driver
 function getAcceptedOrders($id=null,$ss=null) {
  $id = $id?$id:$this->id;
  $ss = $ss?$ss:$this->userInfo;
  $branch_id = $ss->branch_id;
  $driver_id = $id;
  $date = null; // Date('Y-m-d'); //today date
  if (!(bool)strtotime($date)) $date = date('Y-m-d');
  $str_dates ="DATE(o.create_date) = '$date' ";
  //Important NOTE: o.status_id <=3 so that after driver picks order => the Accepted pickup list is updated
  return DB::table('order AS o')->join('sender AS s','s.id','=','o.sender_id')->join('package_statuses AS ps','ps.id','=','o.status_id')->selectRaw("o.id AS order_id,o.code AS order_code, o.delivery_type, o.request_date, o.sender_id,s.name AS sender_name, s.email AS sender_email, s.phone_number AS sender_phone, o.product_type, o.qty,o.actual_pkg_count, o.request_vehicle_type, o.pickup_address, o.status_id, ps.name AS status,o.loc_lat,o.loc_lng" )->where('o.branch_id',$branch_id)->whereRaw($str_dates)->where('o.driver_id',$driver_id)->whereRaw('IFNULL(completed,0)=0 AND o.status_id <3')->get(); 
}

 //return list of avaialable pickup request for driver to accept. This data is specific to driver as to Where the driver is now, and available orders can appear accordingly
 //getAvailablePickupList()
 //$dd ['date'=> default to today, 'loc_lat','loc_lng','include_pending_count'=>0|1,'include_pickup_count'=>0|1,'include_delivery_count'=>0|1 ]
 function getAvailableOrders($arr=[],$id=null,$ss=null) {
        $id = $id?$id:$this->id;
        $ss = $ss?$ss:$this->userInfo;
        $d = (object)$arr; 
        $branch_id = $ss->branch_id;
        $driver_id = $id;
  
        $date = isset($d->date)?$d->date:null; // Date('Y-m-d'); //today date
        if (!(bool)strtotime($date)) $date = date('Y-m-d');
        
        $loc_lat = isset($d->loc_lat)?$d->loc_lat:null;
        $loc_lng = isset($d->loc_lng)?$d->loc_lng:null;
        //optional parameter. show only last 5 orders, etc...
        $show_last_rows = isset($d->show_last_rows)?$d->show_last_rows:null;
        $include_pending_count = isset($d->include_pending_count)?$d->include_pending_count:0;
        $include_pickup_count = isset($d->include_pickup_count)?$d->include_pickup_count:0;
        $include_delivery_count = isset($d->include_delivery_count)?$d->include_delivery_count:0;
        
        $str_dates ="1=1"; //"DATE(o.create_date) = '".$date."' ";
        $data = (object)['items'=>[]];
        if ($show_last_rows > 0)
          $data->items = DB::table('order AS o')->join('sender AS s','s.id','=','o.sender_id')->join('package_statuses AS ps','ps.id','=','o.status_id')->where('o.branch_id',$branch_id)->whereRaw($str_dates)->where("o.status_id",1)->selectRaw('o.id AS order_id, NULL AS distance_km, o.code AS order_code,formatDate(o.create_date) AS request_date, DATE_FORMAT(o.create_date,\'%H:%i\') AS request_time, o.delivery_type,o.sender_id,s.name AS sender_name, s.email AS sender_email, s.phone_number AS sender_phone, o.product_type, o.qty, o.request_vehicle_type, o.pickup_address, o.status_id,ps.name AS status' )->take($show_last_rows)->orderByRaw('o.status_id ASC,o.id DESC')->get(); 
        else
          $data->items = DB::table('order AS o')->join('sender AS s','s.id','=','o.sender_id')->join('package_statuses AS ps','ps.id','=','o.status_id')->where('o.branch_id',$branch_id)->whereRaw($str_dates)->where("o.status_id",1)->selectRaw('o.id AS order_id, NULL AS distance_km, o.code AS order_code,formatDate(o.create_date) AS request_date, DATE_FORMAT(o.create_date,\'%H:%i\') AS request_time, o.delivery_type,o.sender_id,s.name AS sender_name, s.email AS sender_email, s.phone_number AS sender_phone, o.product_type, o.qty, o.request_vehicle_type, o.pickup_address, o.status_id,ps.name AS status' )->orderByRaw('o.status_id ASC,o.id DESC')->get(); 
       
        //count available Orders
        if ($include_pending_count ==1){
            $rows = DB::table("order AS o")->where('o.branch_id',$branch_id)->whereRaw($str_dates)->where("o.status_id",1)->selectRaw("COUNT(o.id) AS cnt")->get();
            foreach($rows as $row) $data->pending_orders_count = $row->cnt;
        }
        
        if ($include_pending_count ==1){
            $rows = DB::table("order AS o")->where('o.branch_id',$branch_id)->whereRaw($str_dates)->where("o.status_id",1)->selectRaw("COUNT(o.id) AS cnt")->get();
            foreach($rows as $row) $data->pending_orders_count = $row->cnt;
        }
        
        if ($include_pickup_count ==1){
            $rows = DB::table("order AS o")->where('o.branch_id',$branch_id)->where('driver_id',$driver_id)->where("o.status_id",2)->selectRaw("COUNT(o.id) AS cnt")->get();
            foreach($rows as $row) $data->pickup_count = $row->cnt;
        }
        //count number of active delivery trips
        if ($include_delivery_count ==1){
            $rows = DB::table("delivery AS d")->where('d.branch_id',$branch_id)->where('d.driver_id',$driver_id)->where("d.status_id",2)->selectRaw("COUNT(d.id) AS cnt")->get();
            foreach($rows as $row) $data->delivery_count = $row->cnt;
        }
        //$sql = DB::table('order AS o')->join('sender AS s','s.id','=','o.sender_id')->join('package_statuses AS ps','ps.id','=','o.status_id')->whereRaw($str_owner)->selectRaw('o.id AS order_id, NULL AS distance_km, o.code AS order_code,formatDate(o.create_date) AS request_date, DATE_FORMAT(o.create_date,\'%H:%i\') AS request_time, o.delivery_type,o.sender_id,s.name AS sender_name, s.email AS sender_email, s.phone_number AS sender_phone, o.product_type, o.qty, o.request_vehicle_type, o.pickup_address, o.status_id,ps.name AS status' )->where('o.branch_id',$branch_id)->where("o.status_id",1)->whereRaw($str_dates)->orderByRaw('o.status_id ASC,o.id DESC')->toSQL();
        //$data->sql = $sql;
        return $data;
  }
  
  //details() returns full details of driver. Used by backend only
  static function details($id,$ss){
    $branch_id = $ss->branch_id;
    // $str_topic_general = $branch_id.topic_prefix('driver')."general";
    // $str_topic_private = $branch_id.topic_prefix('driver')."private$id";
    $cols ='s.id,s.code,s.national_id,s.name,s.sex,s.name_kh,s.address,s.phone_number,s.email,s.emp_type,UPPER(s.shift) as shift, formatDate(date_of_birth) AS date_of_birth, s.vehicle_type, s.vehicle_number,s.driver_license_number,s.status_code, (SELECT warehouse_id FROM driver_warehouses as dw WHERE dw.branch_id = s.branch_id AND dw.driver_id = s.id AND dw.is_default =1 LIMIT 1) AS default_warehouse_id';
    $row = DB::table('driver as s')->selectRaw($cols)->where('s.id',$id)->where('s.branch_id',$branch_id)->take(1)->first();
    if($row) $row->image_url = PublicStorage::getProfilePhoto_url($ss->user_id);
    return $row;
  }

  //returns small details. used in Driver mobile app only
  static function details_mobile($id,$ss){
    $branch_id = $ss->branch_id;
    $str_topic_general = $branch_id.topic_prefix('driver')."general";
    $str_topic_private = $branch_id.topic_prefix('driver')."private$id";
    $row = DB::table('driver as d')->selectRaw("d.id,$branch_id AS branch_id, '$str_topic_general' AS notif_topic_general,'$str_topic_private' AS notif_topic_private,formatDate(d.date_of_birth) AS date_of_birth, UPPER(d.shift) AS shift, d.name,d.name_kh,d.email,d.phone_number,address")->where('d.branch_id',$branch_id)->where('d.id',$id)->take(1)->first();
    if(!$row) return (object)[]; 
    $row->image_url = PublicStorage::getProfilePhoto_url($ss->user_id);
    return $row;
  }

  function getDetails_mobile($id= null, $ss=null){
    $id = $id?$id:$this->id;
    $ss = $ss?$ss:$this->userInfo;
    return self::details_mobile($id,$ss);
  }

  function getDetails($id= null, $ss=null){
    $id = $id?$id:$this->id;
    $ss = $ss?$ss:$this->userInfo;
    return self::details($id,$ss);
  }
  
function saveProfilePicture($photo_data,$file_type = null,$id=null,$ss=null){
  $id = $id?$id:$this->id;
  $ss = $ss?$ss:$this->userInfo;

  $driver = DB::table('driver as s')->where('id',$id)->selectRaw('id,branch_id,photo_file_name')->first();
  $delete_image = (!$photo_data || isImage($photo_data));
  if(!$driver)return DV::error('Driver identity is not correct!');
  if($delete_image){
    PublicStorage::delete($ss->branch_id,'driver','image',$driver->photo_file_name);
    DB::table('driver')->where('id',$id)->update(['photo_file_name'=>null]);
  }
   return PublicStorage::saveImage($ss->branch_id,'driver', null,$photo_data,null,['id'=>$id,'store'=>'driver.photo_file_name']);  
}

function deleteProfilePicture($id=null,$ss=null){
    $id = $id?$id:$this->id;
    $ss = $ss?$ss:$this->userInfo;
    $sender = DB::table('driver as s')->where('id',$id)->selectRaw('id,branch_id,photo_file_name')->first();
    if(!$sender) return DV::error('Driver identity is not correct!');
    PublicStorage::delete($ss->branch_id,'driver','image',$sender->photo_file_name);
    DB::table('driver')->where('id',$id)->update(['photo_file_name'=>null]);
    return DV::success();
}

static function getProfilePicture($id){
  $row = DB::table('driver as s')->where('id',$id)->selectRaw('s.branch_id,s.photo_file_name')->first();
  if(!$row){
     return self::defaultImage(1);
  }
  return PublicStorage::getUrl($row->branch_id,'driver','image').$row->photo_file_name;
}

static function defaultImage($branch_id){
  return PublicStorage::getUrl($branch_id,'driver','image').'def-driver.png';
}
 
 function getDriverInfoById($d){
        $ss = UM::getUserInfoByToken($d);
        if($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task
        $branch_id = $ss->branch_id;
        $id = $d->driver_id;
        $rows = DB::table('driver AS s')->where('branch_id',$branch_id)->where('id',$id)->selectRaw('id,national_id,driver_license_number,code,name,phone_number,email,emp_type,status_code, (SELECT warehouse_id FROM driver_warehouses as dw WHERE dw.branch_id = s.branch_id AND dw.driver_id = s.id AND dw.is_default =1 LIMIT 1) AS default_warehouse_id')->limit(1)->get();
        foreach($rows as $row) return $row;
        return null;
    }

    //$d={'otp_code','login_name'}
    function activateDriver_otp($arr,$ss=null){
      $ss = $ss?$ss:$this->userInfo;
      // $driver_id = $id?$id:$this->id; 
      // $branch_id = $ss->branch_id;
      $d = (object)$arr;
      $otp_code = isset($d->otp_code)?$d->otp_code:null;
      //$user_id = $d->user_id;
      $login_name = isset($d->login_name)? $d->login_name:null;
      $rows = DB::table('um_users AS u')->where('login_name',$login_name)->selectRaw('u.otp_code')->limit(1)->get();
      foreach($rows as $row){
        if ($row->otp_code ==$otp_code) {
          DB::table('um_users')->where('login_name',$login_name)->update(array('otp_code'=>null,'status'=>'active','is_locked'=>0));
          return DV::success(); 
        }else {
           return DV::error('Incorrect otp code');
        }
      }
        return DV::error('Could not find matching otp code');  
  }


  function registerDriver($d){
    // $ss = UM::getUserInfoByToken($d);
    // if($ss->status_code !==200) return $ss; //user not authenticated
    //  //need permission to do this task

    //$app_id = isset($d->app_id)? Sanitizer::sanitize($d->app_id):null;
    //set default options for driver's self registration from mobile phone
     $def_vehicle_type ="Moto bike";
     $def_shift ="HD";
     $def_nationality_id =13;
     $def_sex = "M";

    $app_id =  getAppIdByUserClass('driver');
    $result = (object)array('status'=>'OK','error_message'=>null);
    
    //Make sure the app_id supplied is the Merchant Mobile App
    if (empty($app_id)) return DV::error('App ID is not valid');  

    $branch_id =1; //1 = "Bro Express" // $this->getBranchByApp($app_id);
    $otp_code = null;
    $sender_id= null;
    $sender_code = null;
    $d->phone_number = isset($d->phone_number)? $d->phone_number:null;
    if(!isset($d->id)) $d->id = 0;
    $id = $d->id;

      //Optional parameters
        $d->adr_country_id = isset($d->adr_country_id)?Sanitizer::sanitize($d->adr_country_id):null;
        $d->adr_city_id = isset($d->adr_city_id)?Sanitizer::sanitize($d->adr_city_id):null;
        $d->adr_district_id = isset($d->adr_district_id)? Sanitizer::sanitize($d->adr_district_id):null;
        $d->email = isset($d->email)? Sanitizer::sanitize($d->email,'email'):null;
        
        $salary = isset($d->salary)?Sanitizer::sanitize($d->salary):0;
        $emp_type = isset($d->emp_type)?Sanitizer::sanitize($d->emp_type):$def_emp_type;
        $name = isset($d->name)?$d->name:null;
        $sex = isset($d->sex)?$d->sex:$def_sex;
        $email = isset($d->email)? Sanitizer::sanitize($d->email):null;
        $phone_number = isset($d->phone_number)?Sanitizer::sanitize($d->phone_number):null;

        $shift = isset($d->shift)? Sanitizer::sanitize($d->shift):$def_shift;
        $vehicle_type = isset($d->vehicle_type)? Sanitizer::sanitize($d->vehicle_type):$def_vehicle_type;
        $vehicle_number = isset($d->vehicle_number)?Sanitizer::sanitize($d->vehicle_number):null;
        $driver_license_number = isset($d->driver_license_number)? Sanitizer::sanitize($d->driver_license_number):null;
        $national_id = isset($d->nationality_id)?$d->ationality_id:$def_nationality_id;

        $address = isset($d->address)?Sanitizer::sanitize($d->address):null;
        $work_location_id =isset($d->work_location_id)?Sanitizer::sanitize($d->work_location_id):null;

        $cp_name = isset($d->cp_name)?$d->cp_name:null;
        $cp_phone_number = isset($d->cp_phone_number)?$d->cp_phone_number:null;
        $cp_relationship = isset($d->cp_relationship)? $d->cp_relationship:null;

    if(empty($d->phone_number)) return DV::error('phone_number or login name cannot be empty');

    // if no @name is supplied then use phone number as driver's name
    if(!isset($name) || empty($name)) $name = $d->phone_number;
     
    $ss = (object)array("branch_id"=>$branch_id);
  
   if(!isset($name_kh)) $name_kh = $name;
   //start:: check phone number exists as login name
      $login_name = $d->phone_number;
      $rows = DB::table('um_users AS u')->where('login_name',$login_name)->selectRaw('login_name')->limit(1)->get();
      foreach($rows as $row) return DV::error('Login name or phone number already exists'); 
   //end:: check if phone number exists as login name

   //getDefaultOptions() return object {'price_list_id','cod','cod_fee'}
     //$def = $this->setDefaultOptions($d);   
     DB::table('driver')->insert(array(
      'branch_id'=>$branch_id,
      //'code'=>null,
      'name'=>$name,
      'name_kh'=>$name_kh,
      'sex'=>$sex,
      'emp_type'=>$emp_type, 
      'shift'=>$shift, /** HD, FD **/
      'vehicle_type'=>$vehicle_type,
      'vehicle_number'=>$vehicle_number,
      'driver_license_number'=>$driver_license_number,           
      'national_id'=>$national_id,
      'status_code'=>'active',
      'address'=>$address,
      'salary'=>$salary, 
      // 'adr_country_id'=>$d->adr_country_id,
      // 'adr_city_id'=>$d->adr_city_id,
      // 'adr_district_id'=>$d->adr_district_id,
      'phone_number'=>$phone_number,
      'email'=>$email,
      'cp_name'=>$cp_name,
      'cp_relationship'=>$cp_relationship,
      'cp_phone_number'=>$cp_phone_number,
      'create_user'=>'self register',
      'create_date'=>getNowTime()
    ));

        $driver_id = DB::getPdo()->lastInsertId();
        
        if ($driver_id > 0) {
              $driver_code = $this->getNextDriverCode($ss);
              DB::table('driver')->where('id',$driver_id)->where('branch_id',$branch_id)->update(array(
                  'code'=>$driver_code
              ));

              //begin::create user profile in table umt_users
                     $otp_code = $this->newOTP(6); 
                     $app_id = getAppIdByUserClass('driver');
                     $login_name = $d->phone_number; // user PHONE NUMBER as login name
                     $hpwd= PASSWORD_HASH($d->password,PASSWORD_DEFAULT);
                     $d->subs_id=null;

                     //Make sure role_id =14 is protected from being deleted in table "um_roles"
                     $default_role_id =13; // default_role_id = 13 => "Driver" role. todo: protect role 14 from being deleted or renamed
                    
                    DB::table('um_users')->insert([
                    'otp_code'=>null,
                    'app_id'=>$app_id, /** NOTE that app_id usually depends on @user_class (method $this->getAppIdByUserClass() will returns same app_id for every "user_class" if all user_classes are allowed to log in to the same app) **/
                    'branch_id'=>$branch_id,
                    'login_name'=>$login_name,
                    'full_name'=>$d->name,
                    'official_id'=>$driver_id,
                    'official_code'=>$driver_code,
                    'hpwd'=>$hpwd,
                    'previlege_type'=>isset($d->previlege_type)? $d->previlege_type:'standard', //{'standard','admin'}
                    'user_class'=>'driver', /* user_class = {student,parent,customer,viewer,patient,user}. It is whatever classification meaningful in specific Application Context. It provides directive to use "official_id" to link to meaning table such as Students or Employees or Customers or Parents etc...*/
                    'phone_number'=>$phone_number,
                    'email'=>$email,
                    'subs_id'=>$d->subs_id,
                    'status'=>'active',
                    'is_locked'=>0, // is_locked = 1 => needs activation before can user can make first login
                    'work_location_id'=>$work_location_id,
                    'create_user'=>'self register',
                    'create_date'=>getNowTime(),
                    'create_uid'=>null
                  ]);

                 $d->user_id  = DB::getPdo()->lastInsertId();
                 //$this->UMModel->addRoleMember1($ss,$default_role_id,$d->user_id); 
                 DB::table('um_user_roles')->where('branch_id',$branch_id)->where('role_id',$default_role_id)->where('user_id',$d->user_id)->delete();
                 DB::table('um_user_roles')->insert(array('branch_id'=>$branch_id,'user_id'=>$d->user_id,'role_id'=>$default_role_id,'app_id'=>$app_id));
              //end::create user profile
              
               //When driver user is registerred successfully => create bank accounts
               if ($d->user_id > 0) {
                  if (!isset($d->bank_accounts)) $d->bank_accounts = [];
                  if (!is_array($d->bank_accounts)) $d->bank_accounts = [];
                  
                  //$this->saveBankAccounts($ss,$sender_id,$d->bank_accounts);

                  //begin:: create login's session and access_token => to allow driver's auto login, after registration
                        //UM::setUserSession() is a static function and is the same as UM->createSession() 
                        $sess = UM::setUserSession($app_id,$login_name,$d->user_id,$branch_id);
                        if($sess->status ==='OK') {
                          $result->status ='OK';
                          $result->error_message =null;

                          //start:: get user`s details
                              $user = null;
                              $rows = DB::table('um_users AS u')->selectRaw('u.user_class,u.official_id,u.hpwd, u.id,u.login_name, u.branch_id, u.full_name, u.status, u.is_locked,u.email,u.phone_number,u.otp_code')->where('u.login_name',$login_name)->where('u.app_id',$app_id)->limit(1)->get();
                              foreach($rows as $row) $user = $row;
                              if(!$user) return DV::error("Driver account was created but auto login failed");
                              unset($user->hpwd);
                              $user->access_token = $sess->access_token;
                          //end:: get user's details

                            //start:: encrypt token
                              $encrypter = app(\Illuminate\Contracts\Encryption\Encrypter::class);
                              $user->access_token = $encrypter->encrypt($user->access_token,false);
                            //end:: encrypt token

                          $result->user = $user;
                          return $result;
                        } else {
                          //In case of error creating user's session table "um_sessions"
                          $result->user = (object)['access_token'=>null,'driver_id'=>$driver_id,'driver_code'=>$driver_code]; 
                          $result->status ='Error';
                          $result->error_message =$err;
                          return $result;
                        }
                //end:: create login's session and access_token => to allow driver's auto login, after registration
 
               }

        } else {
           return DV::error('There was a problem in creating your user profile');
        }
       
  }


    //This is to register Driver to company Id ($branch_id =1)
    /***
       $d = {'shift'=>[HD,FD], salary=>0,driver_license_number=>'', 'phone_number'=>'0125456546','vechicle_number'=>'','email'=>''}
    ***/ 
    function registerDriver1($d){
      $app_id = getAppIdByUserClass('driver');
      //$app_id = isset($d->app_id)? $d->app_id:null;
      $result = (object)array('status'=>'OK','error_message'=>null);
      
      //Make sure the app_id supplied is the Driver Mobile App
      //if ($app_id != '584C7FF2122D11EC89909801A8B0D7XKD' || empty($app_id)) return DV::error("App Id is not valid"); 

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
      $d->salary = isset($d->salary)?Sanitizer::sanitize($d->salary):0;
      $d->shift = isset($d->shift)?Sanitizer::sanitize($d->shift):'HD'; //default work shift to FD ="Half Day"
      $d->vehicle_type = isset($d->vehicle_type)?Sanitizer::sanitize($d->vehicle_type):null;
      $d->vehicle_number = isset($d->vehicle_number)?Sanitizer::sanitize($d->vehicle_number):null;
      $d->driver_license_number = isset($d->driver_license_number)? Sanitizer::sanitize($d->driver_license_number):null;
      $d->email = isset($d->email)?Sanitizer::sanitize($d->email,'email'):null;

      $work_shifts =['FD','HD'];
      if(!in_array($d->shift,$work_shifts)) return DV::error('Work shift is not correct');  

      if (strlen($d->vehicle_number)>50) return DV::error('Vehicle number is too long. Max 25 characters');  
      if(!isset($d->phone_number) || empty($d->phone_number)) return DV::error('Phone number or login name cannot be empty');
      

      if(!isset($d->name) || empty($d->name)) return DV::error('Driver name cannot be empty');  

      $ss = (object)array('branch_id'=>$branch_id);
      if ($this->driverExists($ss,$d->name,$d->id)) return DV::error('Driver name already exists');

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
              return DV::error('Login name or phone number for driver already exists');
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
                return DV::success(['code'=>$driver_code,'driver_id'=>$driver_id]);   
          } else {
                return DV::error('There was a problem in creating your profile');
          }
  }
 
  function getComboItems_vehicleType($ss){
    $ss = $ss?$ss:$this->userInfo;  
    $branch_id = $ss?$ss->branch_id : 1;
    return DB::table('vehicle_type AS t')->where('t.branch_id',$branch_id)->selectRaw('t.code, t.name AS vehicle_type')->get();
  }

  //$d ={'loc_lat','loc_lng','driver_id'}
  function saveCurrentLocation($d=[],$driver_id=null,$ss=null){
      $ss = $ss?$ss:$this->userInfo;
      $driver_id = $driver_id?$driver_id:$this->id; 
      $branch_id = $ss->branch_id;
      $loc_lat = isset($d['loc_lat'])?$d['loc_lat']:null;
      $loc_lng = isset($d['loc_lng'])?$d['loc_lng']:null;
      
      DB::table('driver_location')->where('branch_id',$branch_id)->where('driver_id',$driver_id)->delete();
      DB::table('driver_location')->insert([
         'branch_id'=>$branch_id,
         'driver_id'=>$driver_id,
         'loc_lat'=>$loc_lat,
         'loc_lng'=>$loc_lng
      ]);
      return null; 
  }

  static function resetCodes($branch_id,$prefix){
    $i = 1;
    $prefix =$prefix ?? 'HD';
    $branch_id = $branch_id ?? 1;
    $rows = DB::table('driver as s')->selectRaw('s.id,s.name')->orderByRaw('s.create_date')->get();
    foreach($rows as $row){
        DB::table('driver')->where('id',$row->id)->update(['code'=>$prefix.$branch_id.formatNumber($i,5)]);
        $i++;
    }
    $x = DB::table('driver_code_control')->where('prefix',$prefix)->update(['last_id'=>$i]);
    if(!$x){
        DB::table('driver_code_control')->insert(['branch_id'=>$branch_id,'prefix'=>$prefix,'last_id'=>$i]);
    }
    return (object)[
      'status'=>'OK',
      'message'=>$i. ' driver codes were reset',
      'last_id'=>$i
    ];
  }

  function getCurrentLocation($driver_id=null,$ss=null){
      $ss = $ss?$ss:$this->userInfo;
      $driver_id =$driver_id?$driver_id:$this->id;
      $branch_id = $ss->branch_id;
      $rows = DB::table('driver_location AS l')->where('driver_id',$driver_id)->where('branch_id',$branch_id)->selectRaw("driver_id,loc_lat,loc_lng")->limit(1)->get();
      return isset($rows[0])?$rows[0]:null;
  }

  function getNextDriverCode($uss,$len =5){
      $branch_id = $uss->branch_id;
      $prefix='HD';
      $str_prefix = $prefix? 'prefix =\''.$prefix.'\'' : '2=2';
      $row = DB::table('driver_code_control AS c')->where('c.branch_id',$branch_id)->whereRaw($str_prefix)->selectRaw('TRIM(c.prefix) AS prefix,c.last_id')->take(1)->first();
      if($row){
          $num = $row->last_id;
          $prefix = trim($row->prefix);
          $num +=1;
          DB::table('driver_code_control')->where('branch_id',$branch_id)->whereRaw($str_prefix)->update(['last_id'=>$num,'prefix'=>$prefix]);
          return $prefix.$branch_id.formatNumber($num,$len);
      }
      DB::table('driver_code_control')->insert(['branch_id'=>$branch_id,'last_id'=>1,'prefix'=>$prefix]);
      return $prefix.$branch_id.formatNumber(1,$len);
   }
    
   //saveDriver() | updateDriver() | createDriver()
    function save($arr=[], $driver_id=null, $ss=null) {
        // $ss = UM::getUserInfoByToken($d);
        // if($ss->status_code !==200) return $ss; //user not authenticated
        //  //need permission to do this task
        $driver_id =$driver_id?$driver_id:$this->id;
        $ss = $ss?$ss:$this->userInfo;
        $branch_id = $ss->branch_id;
        
        $v_rule = [
          'id' => '0|number|identity=1',
          //'code'=>'0|string|50',
          'name' => '1|string|1-100',
          'name_kh' => '0|string|0-100',
          'date_of_birth' => '1|date',
          'sex' => '1|choice|M,F,O|default=M',
          'phone_number' => '1|phone|1-100',
          'email' => '0|email|0-100',
          'address' => '0|string|0-250',
          'emp_type' => '1|choice|full time,part time',
          'vehicle_type' => '1|string|0-150',
          'vehicle_number' => '0|string|0-100',
          'driver_license_number' => '0|string|50',
          'shift' => '1|choice|FD,HD,fd,hd',
          //'national_id'=>'1|number|exists=loc_countries.id|text=Nationality is not correct',
          'national_id' => '0|number',
          'nationality_id' => '0|number',
          'salary' => '0|number|default=0',
          'default_warehouse_id' => '1|positive|exists=warehouses.id|text=Default warehouse does not exist',
          'allow_fast_delivery' => '0|number|default=1',
          'photo_file_name' => '0|image',
          'photo_file_type' => '0|string|50',
          'cp_phone_number' => '0|phone|0-100',
          'cp_name' => '0|string|0-100',
          'cp_relationship' => '0|string|0-50',
          'status_code'=>'0|choice|active,inactive|default=active'
      ];
      

        $checkUnique = null; //["$branch_id|driver|email|id|text=Driver email is already in use","$branch_id|driver|name|id|text=Driver name already exists"];
        $res = validateObject($arr,$v_rule,true,['email'=>['.','-','@']],$ss->lang,false,$checkUnique);
        if($res->error) return DV::error($res->error);
        //override driver_id with $res->id over the function's param @driver_id
        $driver_id = $res->id;
        $inputs = $res->values;
        $phone_err = $this->checkUniquePerson($branch_id,$inputs['phone_number'],$driver_id); 
        if ($phone_err) return DV::error($phone_err);
        
        $name_kh = $inputs['name_kh']; 
        if(!$name_kh) $inputs['name_kh'] = $inputs['name'];
        $inputs['phone_number'] = str_replace(' ','',$inputs['phone_number']);
        //Set default nationality to "Cambodia"
        $home_country = (new \App\Models\GeneralSettings())::homeCountry($ss->branch_id);
        if(!$home_country) return DV::error("Home country is not yet defined");
        $inputs['nationality_id'] = $home_country->id;
    
        $driver_created = ($driver_id > 0)? 0:1;
        //Do not update driver's code in case of UPDATE existing driver
        //if(!$driver_created) unset($inputs['code']);
        //Remove 'default_warehouse_id' from INSERT fields because table "driver" does have default_warehouse_id colulmn.
        //There is a separate table "driver_warehouses" that store driver and their eligible warehouses
        $default_warehouse_id =$inputs['default_warehouse_id']; 
        unset($inputs['default_warehouse_id']);
        $driver_id = saveData($ss,'driver',['id'=>$driver_id],$inputs,[],1);

        if($driver_id>0){
           if($driver_created){
              $new_code = $this->getNextDriverCode($ss); //formatNumber($driver_id,4);
              DB::table('driver')->where('id',$driver_id)->update(['code'=>$new_code]);
              //set default warehouse for new driver
              self::setDefaultWarehouse($ss,$driver_id,$default_warehouse_id);
           }else{
              //Change user's full_name in table um_users accordingly
              \App\Models\UM::updateUserByOfficialId($driver_id,['full_name'=>$inputs['name']]);
           } 
        }      
       return DV::success(['driver_id'=>$driver_id]);  
    }

    function checkUniquePerson($branch_id,$phone_number,$id=null){
      $str_id ="1=1";
      if(!$phone_number) return 'Phone number cannot be empty';
      if ($id>0) $str_id="s.id <> $id";
      $x = DB::table('sender as s')->where('s.branch_id',$branch_id)->where("s.phone_number",$phone_number)->whereRaw($str_id)->select('id')->take(1)->exists();
      if ($x) return 'Phone number "'.$phone_number.'" has been used by a registered merchant';
      $x = DB::table('driver as s')->where('s.branch_id',$branch_id)->where("s.phone_number",$phone_number)->whereRaw($str_id)->select('id')->take(1)->exists();
      if($x) return 'Phone number "'.$phone_number.'" has been used by another driver';
      return null;
    }

    static function setDefaultWarehouse($ss,$driver_id,$warehouse_id){
      $branch_id = $ss->branch_id;
      DB::table('driver_warehouses')->where('branch_id',$branch_id)->where('driver_id',$driver_id)->where('is_default',1)->delete();
      DB::table('driver_warehouses')->insert([
       'branch_id'=>$branch_id,
       'driver_id'=>$driver_id,
       'warehouse_id'=>$warehouse_id,
       'is_default'=>1
      ]);
      return null;
    }

    /** getDriverBalances() | returns a list of drivers or one particular driver with balance due and package count by finish date */
    function getBalanceDues($arr = [], $id = null, $ss = null)
    {
        $id = $id ? $id : $this->id;
        $ss = $ss ? $ss : $this->userInfo;
        $d = (object)$arr;
          
        $str_dates = '1=1';
        $str_driver = '2=2';
        //$str_search = '3=3';
        $str_pmt_status = 'IFNULL(p.driver_pmt_status_id,0) = 0 AND p.status_id = 8';
        $search_value = isset($d->search_value) ? $d->search_value : null;
        if (!$id) $id = isset($d->driver_id) ? $d->driver_id : null;
        
        $warehouse_id = isset($d->warehouse_id) ? $d->warehouse_id : 0;
        //View group by finish date or group by Driver regardless of date
        $view_name = isset($d->view_name)?$d->view_name:'date';

        $end_date = isset($d->end_date) ? $d->end_date : null;
        $start_date = isset($d->start_date) ? $d->start_date : null;
       
        //if Driver ID is provided then DO NOT use search_value
        if ($id > 0) $search_value = null;
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "(d.code = '$search_value' OR d.name LIKE '%$search_value%' OR d.phone_number LIKE '%$search_value%')";
        } else {
            $end_date = convertDate($end_date);
            $start_date = convertDate($start_date);
            if ((bool)strtotime($start_date) && (bool)strtotime($end_date)) {
                $str_dates = "DATE(p.delivery_time) >= '$start_date' AND DATE(p.delivery_time) <= '$end_date'";
            }else if($end_date){
               $start_date = date('Y-m-d', strtotime(date('Y-m-d') . ' -90 days'));
               $str_dates = "DATE(p.delivery_time) >= '$start_date' AND DATE(p.delivery_time) <= '$end_date'";
            }
            if ($id > 0) $str_driver = 'd.id ='. $id;
      }
       $currency_code = 'USD';

       $driver_trx_id ='HEX(p.driver_trx_id) AS driver_trx_id,';
       $group_by_driver_trx_id ='driver_trx_id,';
       $groupByDate ='';
       $date_col = '';
       if ($view_name ==='date'){
         $date_col = 'formatDate(p.delivery_time) AS finish_date,';
         $groupByDate =',finish_date DESC';
       }
       $rows = DB::table('package as p')
            ->join('driver as d', 'd.id', '=', 'p.driver_id')
            //->where('p.branch_id',$ss->branch_id)
            ->where('p.warehouse_id',$warehouse_id)
            ->whereRaw($str_pmt_status)
            ->whereRaw($str_dates)
            ->whereRaw($str_driver)
            //->whereRaw($str_search)
            ->selectRaw($driver_trx_id.$date_col.'d.id, d.name AS driver_name, d.code AS driver_code, d.phone_number,\'$\' AS currency_symbol,\''.$currency_code.'\' AS currency_code, COUNT(p.id) AS package_count, SUM(CASE cod_changed WHEN 1 THEN 1 ELSE 0 END) AS cod_change_count, SUM(p.driver_total) AS amount')
            ->groupByRaw($group_by_driver_trx_id.'d.id,driver_code,driver_name,d.phone_number'.$groupByDate)->orderByRaw('driver_trx_id DESC')->get();
       
       $total =0;
       $total_count = 0;
       $pending_total = 0;
       $pending_count =0;
       $unpaid_total = 0;
       $unpaid_count = 0;
       $cod_change_count =0;
       foreach($rows as $row){
           if($row->driver_trx_id){
            $row->trx_status = 'Pending';
            $row->trx_remarks ='ចាំការអនុមត័';
            $pending_total += $row->amount;
            $pending_count += $row->package_count;
           }else{
            $row->trx_status = 'Unpaid';
            $row->trx_remarks ='មិនទានិទូទាត់';
            $unpaid_total += $row->amount;
            $unpaid_count += $row->package_count;
           }
           $cod_change_count += $row->cod_change_count;
           $total += $row->amount;
           $total_count += $row->package_count;
           if($row->driver_trx_id){
              $pending_total += $row->amount;
              $pending_count += $row->package_count;
           }
       }
       $packages = null;
       if ($id > 0){
          $p_rows = DB::table('package as p')
          ->join('driver as d', 'd.id', '=', 'p.driver_id')
          ->where('p.warehouse_id',$warehouse_id)
          ->whereRaw('IFNULL(p.driver_pmt_status_id,0) = 0 AND p.status_id = 8 AND IFNULL(p.driver_trx_id,\'\') =\'\'')
          ->whereRaw($str_dates)
          ->whereRaw($str_pmt_status)
          ->whereRaw($str_driver)
          //->whereRaw($str_search)
          ->selectRaw('p.id')->get();

          foreach($p_rows as $row){
            $packages .= ($packages? ',':'').$row->id;
          }
       }

       $exchange_rate =  GeneralSettings::getExchangeRate($end_date);
     
       return (object)[
         'start_date'=>date('d M Y',strtotime($start_date)),
         'end_date'=>date('d M Y',strtotime($end_date)),
         'driver_id'=>$id,
         'total_count'=>$total_count,
         'unpaid_count'=>$unpaid_count,
         'unpaid_total'=>$unpaid_total,
         'total'=>number_format($total,2,'.',''),
         'currency_code'=>$currency_code,
         'items'=>$rows,
         'packages'=>$packages,
         'exchange_info'=>(object)[
            "currency_pair"=>$exchange_rate->currency_pair,
            "buy_rate"=>$exchange_rate->buy_rate
         ]
       ];
    }
  
    // function getUnpaidPackages($arr = [], $id = null, $ss = null)
    // {
    //     $id = $id ? $id : $this->id;
    //     $ss = $ss ? $ss : $this->userInfo;
    //     $d = (object)$arr;
          
    //     $str_dates = '1=1';
    //     $str_driver = '2=2';
    //     $str_search = '3=3';
    
    //     $search_value = isset($d->search_value) ? $d->search_value : null;
    //     if (!$id) $id = isset($d->driver_id) ? $d->driver_id : null;
        
    //     //View group by finish date or group by Driver regardless of date
    //     $view_name = isset($d->view_name)?$d->view_name:'date';

    //     $start_date = convertDate(isset($d->start_date) ? $d->start_date : null);
    //     $end_date = convertDate(isset($d->end_date) ? $d->end_date : null);
        
    //     //if Driver ID is provided then DO NOT use search_value
    //     if ($id > 0) $search_value = null;
    //     if ($search_value) {
    //         $search_value = escape_like_str($search_value);
    //         $str_search = "(d.code = '$search_value' OR d.name LIKE '%$search_value%' OR d.phone_number LIKE '%$search_value%')";
    //     } else {
    //         if ((bool)strtotime($start_date) && (bool)strtotime($end_date)) {
    //             $str_dates = "DATE(p.delivery_time) >= '$start_date' AND DATE(p.delivery_time) <= '$end_date'";
    //         }
    //         if ($id > 0) $str_driver = 'd.id ='. $id;
    //    }
      
    //    $currency_code = 'USD';
      
    //    $cols = 'p.id,p.qr_code as barcode,d.name as driver_name,p.receiver_address,formatTime(p.arrival_time) AS arrival_date,formatTime(p.delivery_time) as finish_date,p.delivery_type,p.receiver_phone,p.cod,p.cod_fee,p.price,p.zone_code,p.zone_name,p.sender_name,p.sender_phone,p.forwarding_cost,p.df_payer,p.zone_code,p.driver_total,p.delivery_fee,p.base_fee,p.cod_changed,p.status_id,CASE p.status_id WHEN 8 THEN \'Success\' WHEN 9 THEN \'Failed\' WHEN 11 THEN \'Returned\' END AS status';
    //    $rows = DB::table('package as p')
    //    ->join('driver as d', 'd.id', '=', 'p.driver_id')
    //    ->whereRaw('IFNULL(p.driver_pmt_status_id,0) = 0 AND p.status_id = 8 AND IFNULL(p.driver_trx_id,\'\') =\'\'')
    //    ->whereRaw($str_dates)
    //    ->whereRaw($str_driver)
    //    ->whereRaw($str_search)
    //    ->selectRaw($cols)->get();

    //    $exchange_rate = GeneralSettings::getExchangeRate(date('Y-m-d'));
    //    $currency_pair = 'USDKHR';
    //    return (object)[
    //      'driver_id'=>$id, 
    //      'currency_code'=>$currency_code,
    //      'items'=>$rows,
    //      'exchange_info'=>(object)[
    //        "currency_pair"=>$currency_pair,
    //        "buy_rate"=>$exchange_rate->buy_rate
    //      ]
    //    ];
    // }

  static function getCODNotes($track_rows,$package_id){
     foreach($track_rows as $row){
      if($row->package_id == $package_id) return $row->description;
     }
     return null;
  }

function getUnpaidPackages($arr = [], $id = null, $ss = null)
{
    $branch_id = 1;
    // Default values and object conversion
    $id = $id ?? $this->id;
    $ss = $ss ?? $this->userInfo;
    $d = (object)$arr;

    // Extract search parameters
    $search_value = $d->search_value ?? null;
    $driver_id = ($id > 0) ? $id : ($d->driver_id ?? null);

    // Date conversions
    $start_date = convertDate($d->start_date ?? null);
    $end_date = convertDate($d->end_date ?? null);

    // Construct search, date, and driver conditions
    $str_search = $search_value 
                  ? "d.code = '" . escape_like_str($search_value) . "' OR d.name LIKE '%" . escape_like_str($search_value) . "%' OR d.phone_number LIKE '%" . escape_like_str($search_value) . "%'" 
                  : '1=1';
    
    $str_dates = ($start_date && $end_date) 
                 ? "DATE(p.delivery_time) BETWEEN '$start_date' AND '$end_date'" 
                 : '1=1';

    $str_driver = ($driver_id && $driver_id > 0) 
                  ? "d.id = $driver_id" 
                  : '1=1';
    $cols = 'p.id,p.qr_code as barcode,d.name as driver_name,p.receiver_address,formatTime(p.arrival_time) AS arrival_date,formatTime(p.delivery_time) as finish_date,p.delivery_type,p.receiver_phone,p.cod,p.cod_fee,p.price,p.zone_code,p.zone_name,p.sender_name,p.sender_phone,p.forwarding_cost,p.df_payer,p.zone_code,p.driver_total,p.delivery_fee,p.base_fee,p.cod_changed,p.status_id,CASE p.status_id WHEN 8 THEN \'Success\' WHEN 9 THEN \'Failed\' WHEN 11 THEN \'Returned\' END AS status';

    $rows = DB::table('package as p')
               ->join('driver as d', 'd.id', '=', 'p.driver_id')
               ->whereNull('p.driver_pmt_status_id')
               ->where('p.status_id', 8)
               ->whereNull('p.driver_trx_id')
               ->whereRaw($str_dates)
               ->whereRaw($str_driver)
               ->whereRaw($str_search)
               ->selectRaw($cols)
               ->get();
     $track_rows = DB::table('package as p')->join('package_tracks as pt','pt.package_id','=','p.id')->join('driver as d','d.id','=','p.driver_id')->where('p.branch_id',$branch_id)->whereRaw($str_dates)->where('action_name','change_cod')->whereRaw($str_driver)->selectRaw('pt.package_id,pt.description')->get();          
     foreach($rows as $row){
       $row->cod_notes = null;
       if($row->cod_changed ==1){
          $row->cod_notes = self::getCODNotes($track_rows,$row->id);  
       }
     }
    // Currency and exchange rate information
    $exchange_rate = GeneralSettings::getExchangeRate(date('Y-m-d'));
    $currency_pair = 'USDKHR';

    return (object)[
        'driver_id' => $driver_id,
        'currency_code' => 'USD',
        'items' => $rows,
        'exchange_info' => (object)[
            "currency_pair" => $currency_pair,
            "buy_rate" => $exchange_rate->buy_rate
        ]
    ];
}
 
    /** return settled packages based on $trx_id. This method is used on backend's Driver Payment, when user clicks on Package count to view list of settled or paid packages */
    function getSettledPackages($trx_id, $id = null, $ss = null)
    {
        $id = $id ? $id : $this->id;
        $ss = $ss ? $ss : $this->userInfo;
      
       $str_driver = $id> 0? 'p.driver_id ='.$id:'2=2';
       $currency_code = 'USD';

       $cols = 'p.id,p.qr_code as barcode,d.name as driver_name,p.receiver_address,formatTime(p.arrival_time) AS arrival_date,formatTime(p.delivery_time) as finish_date,p.delivery_type,p.receiver_phone,p.cod,p.cod_fee,p.price,p.zone_code,p.zone_name,p.sender_name,p.sender_phone,p.forwarding_cost,p.df_payer,p.zone_code,p.driver_total,p.delivery_fee,p.base_fee,p.status_id,p.driver_pmt_status_id,p.driver_pmt_notes, p.sender_pmt_status_id,CASE p.status_id WHEN 8 THEN \'Success\' WHEN 9 THEN \'Failed\' WHEN 11 THEN \'Returned\' END AS status';
       $rows = DB::table('package as p')
       ->join('driver as d', 'd.id', '=', 'p.driver_id')
       //->whereRaw('p.driver_pmt_status_id = 1')
       ->whereRaw('p.driver_trx_id = UNHEX(\''.$trx_id.'\')')
       ->whereRaw($str_driver)
       ->selectRaw($cols)->get();

       //$exchange_rate = GeneralSettings::getExchangeRate(date('Y-m-d'));
       //$currency_pair = 'USDKHR';
       return (object)[
         'currency_code'=>$currency_code,
         'items'=>$rows
       ];
    }

    // function getBalanceDues($arr = [],$id=null,$ss=null){
    //   $id = $id?$id:$this->id;
    //   $ss = $ss?$ss:$this->userInfo;
    //   $d = (object)$arr;
      
    //   $current_page =isset($d->current_page)?$d->current_page:1;
    //   $per_page =isset($d->per_page)?$d->per_page:10;
    //   if(!is_numeric($current_page)) $current_page=1;
    //   $skip_rows = ($current_page -1) * $per_page;

    //   $str_dates = '1=1';
    //   $str_driver ='2=2';
    //   $str_search ='3=3';

    //   $search_value = isset($d->search_value)?$d->search_value:'';
    //   if(!$id) $id = isset($d->driver_id)?$d->driver_id:'';

    //   $start_date = convertDate(isset($d->start_date)?$d->start_date:null);
    //   $end_date = convertDate(isset($d->end_date)?$d->end_date:null);
    //   if($search_value){
    //       $search_value = escape_like_str($search_value);
    //       $str_search = '(d.code = \''.$search_value.'\' OR d.name LIKE \'%'.$search_value.'%\' OR d.phone_number LIKE \'%'.$search_value.'%\' )'; 
    //   } else{
    //      if((bool)strtotime( $start_date) && (bool)strtotime($end_date)){
    //         $str_dates = 'DATE(p.delivery_time) >=\''.$start_date.'\' AND DATE(p.delivery_time) <= \''.$end_date.'\'';
    //      }
    //      if($id > 0) $str_driver ='d.id ='.$id;
    //   }

    //   $query = DB::table('package as p')->join('driver as d','d.id','=','p.driver_id')->whereRaw($str_dates)->whereRaw($str_driver)->whereRaw($str_search)->whereRaw('IFNULL(p.driver_pmt_status_id,0) =0 AND p.status_id =8')->selectRaw('formatDate(d.delivery_time) AS finish_date, d.id, d.name AS driver_name, d.code AS driver_code,COUNT(p.id) AS package_count, SUM(p.driver_total) AS amount')->groupByRaw('finish_date DESC,d.id,driver_code,driver_name');
    //   $count_query = clone $query;
    //   $count = $count_query->count();
    //   $rows = $query->skip($skip_rows)->take($per_page)->get();
    //   return new LengthAwarePaginator($rows, $count, $per_page, $current_page);

    // }

    //saveDriverCommissions()
    function saveCommissions($arr=[],$id=null,$ss=null){
      $driver_id = $id?$id:$this->id;
      $ss = $ss?$ss:$this->userInfo; 
      $branch_id = $ss->branch_id;

      $d = (object)$arr;
      if (!isset($d->salary)) $d->salary = 0;
      if (!isset($d->emp_type)) $d->emp_type =null;
      if (!isset($d->shift)) $d->shift = null;
       
      $work_shifts =['FD','HD'];
      // $work_shifts[] = array('shift'=>'FD','shift_name'=>'Full Day');
      // $work_shifts[] = array('shift'=>'HD','shift_name'=>'Half Day');  
      $emp_types =['full time','part time'];
      $d->shift = strtoupper($d->shift);
      if (empty($driver_id) || $driver_id <=0) return DV::error("Driver identity is not valid");

      if (!in_array(strtoupper($d->shift),$work_shifts)) return DV::error("Work Shift is not correct");
      if (!in_array(strtolower($d->emp_type),$emp_types)) return DV::error("Employment Type is not correct");

      DB::table('driver')->where('branch_id',$branch_id)->where('id',$driver_id)->update(array(
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

          $rows = DB::table('driver_commissions')->where('branch_id',$branch_id)->where('delivery_type',$c->delivery_type)->where('driver_id',$driver_id)->limit(1)->get();
          if(COUNT($rows) >=1) {
            DB::table('driver_commissions')->where('branch_id',$branch_id)->where('delivery_type',$c->delivery_type)->where('driver_id',$driver_id)->update(array(
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
                'driver_id'=>$driver_id,
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
      return DV::success();
    }

    static function getOutstandingBalanceError($id){
      if (!$id) return null;
      $row = DB::table('package as p')->join('driver as s','s.id','=','p.driver_id')->where('s.id',$id)->whereRaw('IFNULL(p.driver_pmt_status_id,0) =0')->whereRaw('p.driver_id > 0')->selectRaw('COUNT(p.id) AS item_count,SUM(IFNULL(p.driver_total,0)) AS amount')->get()->first();
      if(!$row) return null;
      if ($row->item_count > 0 ) return 'មិន​អាច​លុប ឬ​បិទ​គណនី​នេះ​បាន​ទេ ព្រោះ​មាន​កញ្ចប់ '.$row->item_count.' ដែល​មិន​ទាន់​បាន​ទូទាត់​ប្រាក់';
      return null;
   }

    //updateDriverStatus()
    function updateStatus($status_code,$id = null, $ss= null){
       $ss =$ss?$ss:$this->userInfo;
       $id =$id?$id:$this->id;
       $branch_id = $ss->branch_id;
       if(in_array(strtolower($status_code),['inactive','locked','disabled'])){
        $err = self::getOutstandingBalanceError($id);
        if($err) return DV::error($err);
       }
       DB::table('driver')->where('id',$id)->where('branch_id',$branch_id)->update([
           'status_code'=>$status_code
       ]);
       $um = new \App\Models\UM();
       $user_id = DB::table('um_users')->where('official_id',$id)->take(1)->value('id');
       $update_profile = false;
       $res = $um->setUserStatus($status_code,$user_id,$update_profile);
       return $res;
    }
  
  //getDriverCommissions()
  function getCommissions($id=null,$ss=null){
    $driver_id = $id?$id:$this->id;
    $ss =$ss?$ss:$this->userInfo;
    $branch_id = $ss->branch_id;
  
    $data = (object)(array('rates'=>[],'salary'=>0,'emp_type'=>null,'shift'=>null,'driver_id'=>null,'driver_name'=>null,'driver_code'=>null)); 
    $rows = DB::table('driver AS d')->where('d.branch_id',$branch_id)->where('id',$driver_id)->take(1)->selectRaw('d.id, d.name, d.code,d.emp_type,d.shift,IFNULL(d.salary,0) AS salary')->get();
    foreach($rows as $row) {
      $data->driver_id = $row->id;
      $data->driver_code = $row->code;
      $data->driver_name = $row->name;
      $data->salary = $row->salary;
      $data->shift = strtoupper($row->shift);
      $data->emp_type = strtolower($row->emp_type);
    }
    $rows = DB::table('driver_commissions AS c')->where('c.branch_id',$branch_id)->where('c.driver_id',$driver_id)->selectRaw('c.driver_id,c.delivery_type,c.pickup_commission, c.delivery_commission,c.use_rate, c.is_current')->get();
    $data->rates = $rows;
    return $data;
  }

  function driver_in_use($uss,$id) {
      $branch_id = $uss->branch_id;
      if (!$id) return false; 
      $row = DB::table('order')->where('branch_id',$branch_id)->where('driver_id',$id)->selectRaw('driver_id')->limit(1)->first();
      if($row) return true;
      $row = DB::table('package as p')->where('p.branch_id',$branch_id)->where('p.driver_id',$id)->selectRaw('id')->limit(1)->first();
      if( $row) return true;
      $row = DB::table('delivery')->where('branch_id',$branch_id)->where('driver_id',$id)->selectRaw('driver_id')->limit(1)->first();
      if( $row) return true;
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

  //deleteDriver()
  function delete($id=null,$ss=null){
      $id = $id?$id:$this->id;
      $ss =$ss?$ss:$this->userInfo; 
      $branch_id = $ss->branch_id;
      $err = self::getOutstandingBalanceError($id);
      if($err) return DV::error($err);
      if ($this->driver_in_use($ss,$id)) {
          return DV::error("Cannot delete this driver because there are some pickups or delviery tasks done already");
      }
      DB::table('driver')->where('branch_id',$branch_id)->where('id',$id)->delete();
      DB::table('driver_commissions')->where('branch_id',$branch_id)->where('driver_id',$id)->delete();

      //delete data from table "um_users" and "um_user_roles"
      $this->deleteLogin_by_officialId('driver',$id);
      return DV::success();
  }

//   function getDriverById($d) {
//     $ss = UM::getUserInfoByToken($d);
//     if($ss->status_code !==200) return $ss; //user not authenticated
//      //need permission to do this task
//     $branch_id = $ss->branch_id;
//     $id = $d->driver_id;
//       /***
//         $users = DB::table('users')
//             ->join('contacts', 'users.id', '=', 'contacts.user_id')
//             ->join('orders', 'users.id', '=', 'orders.user_id')
//             ->select('users.*', 'contacts.phone', 'orders.price')
//             ->get();  
//         ***/
//      $rows = DB::table('driver as s')->selectRaw("s.id,s.code,s.national_id,s.name,s.sex,s.name_kh,s.address,s.phone_number,encode_email(s.email) AS email,s.emp_type,s.shift, s.vehicle_type, s.vehicle_number,s.driver_license_number,s.status_code, (SELECT warehouse_id FROM driver_warehouses as dw WHERE dw.branch_id = s.branch_id AND dw.driver_id = s.id AND dw.is_default =1 LIMIT 1) AS default_warehouse_id")->where('s.branch_id',$branch_id)->where('s.id',$id)->limit(1)->get();
//      foreach($rows as $row) return $row;
//      return null;
//  }

  //getDriverList() | list()
  function getList($arr =[],$ss=null){
    $ss = $ss?$ss:$this->userInfo;
    return self::list($arr,$ss);
  }

  static function listAll($arr, $ss){
    $branch_id = $ss->branch_id;
    $d = (object)$arr;
    $emp_type = isset($d->emp_type)?$d->emp_type:null;
    $shift = isset($d->shift)?$d->shift:null;
    $status_code = isset($d->status_code)?$d->status_code:null;
    $search_value = isset($d->search_value)?$d->search_value:null;
        $str_emp_type = null;
        $str_shift = null;
        $str_search =null;
        $str_status =null;
        $more_wheres ="1=1";
        if (!$search_value) {
           if(!empty($shift) && $shift != '0') $str_shift = " AND s.shift ='".$shift."' ";
           if(!empty($emp_type)) $str_emp_type =" AND s.emp_type ='".Sanitizer::sanitize($emp_type)."' ";
           if(!empty($status_code)) $str_status =" AND s.status_code ='".Sanitizer::sanitize($status_code)."' ";
           $more_wheres .=$str_emp_type.$str_status.$str_shift;
        } else {
           $search_value = escape_like_str($search_value);
           $str_search = ' AND (s.code =\''.$search_value.'\' OR s.name LIKE \'%'.$search_value.'%\' OR s.phone_number =\''.$search_value.'\' )'; 
           $more_wheres .=$str_search;
        }
        $cols = '\'Default Warehouse\' AS warehouse_name,s.id,s.branch_id,s.code,s.national_id,s.status_code,s.name,s.name_kh,s.sex,s.driver_license_number,s.vehicle_type,s.vehicle_number,s.address,s.phone_number,s.email,s.emp_type,salary,s.shift, s.delivery_commission_type,s.pickup_commission_type,s.role,s.photo_file_name';
        $query = DB::table('driver as s')->selectRaw($cols)->where('s.branch_id',$branch_id)->whereRaw($more_wheres)->orderBy('s.id','DESC');
        return $query->get();
  }

 //getDriverList() | list()
 static function list($arr, $ss){
     $branch_id = $ss->branch_id;
     $d = (object)$arr;

     $current_page =isset($d->current_page)?$d->current_page:1;
     $per_page =isset($d->per_page)?$d->per_page:10;
     if(!is_numeric($current_page)) $current_page=1;
     $skip_rows = ($current_page -1) * $per_page;

     $emp_type = isset($d->emp_type)?$d->emp_type:null;
     $shift = isset($d->shift)?$d->shift:null;
     $status_code = isset($d->status_code)?$d->status_code:null;
     $search_value = isset($d->search_value)?$d->search_value:null;
         $str_emp_type = null;
         $str_shift = null;
         $str_search =null;
         $str_status =null;
         $more_wheres ="1=1";
         if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = ' AND (s.code =\''.$search_value.'\' OR s.name LIKE \'%'.$search_value.'%\' OR s.phone_number =\''.$search_value.'\' )'; 
            $more_wheres .=$str_search;
         } else {
            if($shift && $shift != '0') $str_shift = ' AND s.shift =\''.$shift.'\' ';
            if($emp_type) $str_emp_type =' AND s.emp_type =\''.Sanitizer::sanitize($emp_type).'\' ';
            if($status_code) $str_status =' AND s.status_code =\''.Sanitizer::sanitize($status_code).'\' ';
            $more_wheres .=$str_emp_type.$str_status.$str_shift;
         }
         $cols = '\'Default Warehouse\' AS warehouse_name,s.id,s.branch_id,s.code,s.national_id,s.status_code,s.name,s.name_kh,s.sex,s.driver_license_number,s.vehicle_type,s.vehicle_number,s.address,s.phone_number,s.email,s.emp_type,salary,s.shift, s.delivery_commission_type,s.pickup_commission_type,s.role,s.photo_file_name';
         $query = DB::table('driver as s')->selectRaw($cols)->where('s.branch_id',$branch_id)->whereRaw($more_wheres)->orderBy('s.id','DESC');
         $count_query = clone $query;
         $count = $count_query->count('s.id');
         $acive_count = $count_query->where('status_code','active')->count('s.id');
         $rows = $query->skip($skip_rows)->take($per_page)->get();
         
         foreach($rows as $row){
           $row->image_url = '';
           $row->mobile_login = \App\Models\UM::getAccountInfo($row->id,'official_id','driver');
           if($row->photo_file_name) $row->image_url = PublicStorage::getUrl($row->branch_id,'driver','image').$row->photo_file_name;
           unset($row->photo_file_name);
           if(!$row->image_url) $row->image_url =self::defaultImage($ss->branch_id);
         }
         return (object)[
           'driver_count'=>$count,
           'active_count' =>$acive_count,
           'inactive_count'=>($count - $acive_count),
           'data'=>new LengthAwarePaginator($rows, $count, $per_page, $current_page)
         ];
   }
 
    static function getFormOptions($ss){
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
    function getPackageListByDriver($ss, $d){
        // $ss = UM::getUserInfoByToken($d);
        // if($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task
        $branch_id = $ss->branch_id;
        $depart_date = isset($d->depart_date)? convertDate($d->depart_date):null; //depart_time or depart_date
        //$booking_date = isset($d->booking_date)? convertDate($d->booking_date):null;
        //$delviery_date = isset($d->delviery_date)? convertDate($d->delviery_date):date('Y-m-d');

        $driver_id = isset($d->driver_id)?Sanitizer::sanitize($d->driver_id):null;
        //$str_date_arrival =" AND DATE(p.arrival_time) ='".$arrival_date."' ";
        ///$str_date_booking =null;
        $str_date_depart = null;
        ////if ((bool)strtotime($booking_date)) $str_date_booking =" AND DATE(p.create_date) ='$booking_date' ";
        if ((bool)strtotime($depart_date)) $str_date_depart =" AND DATE(d.depart_time) ='$depart_date' ";

        $str_status =" AND p.status_id IN (8,9,11)"; // Driver's delivery history => show only ("Delivered","failed","Returned" items)
        $more_wheres ="1=1".$str_status.$str_date_depart; //.$str_date_arrival
        $selectCols ="d.id AS delivery_id, d.fleet_tracking_number, d.driver_id, DATE_FORMAT(d.create_date,'%d %b %Y %r') AS booking_date,d.warehouse_id,p.qr_code AS barcode,p.sender_name,p.sender_phone,p.package_name, p.product_type,p.dim_x, p.dim_y, p.dim_h, p.billed_kg, p.price,p.cod, p.cod_fee, p.base_fee,p.delivery_fee, p.zone_code,p.zone_name, IFNULL(p.forwarding_cost,0) AS forwarding_cost,p.delivery_notes,p.failure_notes, IFNULL(p.driver_total,0) AS driver_total,IFNULL(p.sender_total,0) AS sender_total, p.exchange_rate AS exchange_rate,p.status_id, (SELECT ps.name FROM package_statuses AS ps WHERE ps.id =p.status_id LIMIT 1) AS status, DATE_FORMAT(p.delivery_time,'%d %b %Y %r') AS delivery_time,p.agent_notes,d.status_id AS trip_status_id, ds.name AS trip_status, h.name AS from_warehouse_name, 'Moto bike' AS vehicle_type";
        return DB::table('delivery AS d')->join('delivery_statuses AS ds','ds.id','=','d.status_id')->join('package AS p','p.delivery_id','=','d.id')->join('warehouses AS h','h.id','=','d.warehouse_id')->where('p.branch_id',$branch_id)->where('d.driver_id',$driver_id)->whereRaw($more_wheres)->selectRaw($selectCols)->orderByRaw('p.create_date DESC,d.id ASC,p.sender_id')->get(); 
       
      }

      //returns Active or Ongoing trip of a driver
      function getActiveTrips($id=null,$ss=null){
        $driver_id =$id?$id:$this->id;
        $ss = $ss?$ss:$this->userInfo;
        $branch_id = $ss->branch_id;
        $trip_status_id =2; // Deliery Started or "Shipping" or "On the way" or "On-going"
        $selectCols ="d.id AS delivery_id,DATE_FORMAT(d.depart_time,'%r')AS depart_time, DATE_FORMAT(d.depart_time,'%d %b %Y') AS depart_date,IFNULL(d.package_count,0) AS package_count, IFNULL(d.delivered_count,0) AS delivered_count, IFNULL(d.failed_count,0) AS failed_count,d.fleet_tracking_number,ds.id AS trip_status_id, ds.name AS trip_status";
        return DB::table('delivery AS d')->join('delivery_statuses AS ds','ds.id','=','d.status_id')->where('d.branch_id',$branch_id)->where("d.status_id",$trip_status_id)->where('d.driver_id',$driver_id)->selectRaw($selectCols)->orderByRaw("d.depart_time DESC")->get();
      }

      //getPackageListByTrip() returns ab object with header, and packages. "header" is trip details, "packages" is list of packages per trip
      function getPackageListByTrip($d){
        $ss = UM::getUserInfoByToken($d);
        if($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task
        $branch_id = $ss->branch_id;
        $delivery_id = isset($d->delivery_id)?$d->delivery_id:0;
        //$trip_code = isset($d->fleet_tracking_number)?$d->fleet_tracking_number:null;
        //$delivery_id = isset($d->id)?$d->id:0;
         
        $driver_id =0;// isset($d->driver_id)?Sanitizer::sanitize($d->driver_id):0;
        $str_driver =null;
        if ($driver_id > 0) $str_driver = " AND d.driver_id ='".$driver_id."' ";
        $more_wheres ="1=1".$str_driver;
        $selectCols ="d.id AS delivery_id,d.fleet_tracking_number, DATE_FORMAT(d.depart_time,'%d %b %Y %r') AS depart_time, d.driver_id,d.package_count,d.delivered_count,d.failed_count,d.status_id AS trip_status_id, ds.name AS trip_status";
        $rows = DB::table('delivery AS d')->join('delivery_statuses AS ds','ds.id','=','d.status_id')->where('d.branch_id',$branch_id)->where('d.id',$delivery_id)->whereRaw($more_wheres)->selectRaw($selectCols)->limit(1)->get();
        foreach($rows as $row) {
          $str_status = null; //" AND p.status_id IN (8,9,10,11)";
          $more_wheres ="1=1".$str_status;
          $selectCols ="d.id AS delivery_id,s.phone_number AS sender_phone,p.delivery_type,d.fleet_tracking_number, d.driver_id, DATE_FORMAT(d.create_date,'%d %b %Y %r') AS booking_date,d.warehouse_id,p.qr_code AS barcode,p.sender_name,p.sender_phone,p.package_name,p.receiver_name,p.receiver_phone, p.product_type,p.dim_x, p.dim_y, p.dim_h, p.billed_kg, p.price,p.cod, p.cod_fee, p.base_fee,p.delivery_fee, p.zone_code, 
          (CASE p.status_id WHEN 9 THEN p.failure_notes WHEN 11 THEN p.failure_notes ELSE p.delivery_notes END) AS remarks, p.zone_name, IFNULL(p.forwarding_cost,0) AS forwarding_cost,p.delivery_notes,p.receiver_address,p.failure_notes, IFNULL(p.driver_total,0) AS driver_total,IFNULL(p.sender_total,0) AS sender_total, p.exchange_rate AS exchange_rate,p.status_id, ps.`name` AS status, DATE_FORMAT(p.delivery_time,'%d %b %Y %r') AS delivery_time,p.agent_notes,d.status_id AS trip_status_id, ds.name AS trip_status, h.name AS from_warehouse_name, 'Moto bike' AS vehicle_type";
          $row->packages = DB::table('delivery AS d')->join('delivery_statuses AS ds','ds.id','=','d.status_id')->join('package AS p','p.delivery_id','=','d.id')->join('warehouses AS h','h.id','=','d.warehouse_id')->join('sender AS s','s.id','=','p.sender_id')->join('package_statuses AS ps','ps.id','=','p.status_id')->where('p.branch_id',$branch_id)->where('d.id',$delivery_id)->whereRaw($more_wheres)->selectRaw($selectCols)->orderByRaw('p.create_date DESC,d.id ASC,p.sender_id')->get();          
          return $row;
        }
        return null;        
      }  

     function getOrderProps($branch_id=null,$id=null,$cols=null){
        if(!$id) return null;
        if(!$cols) 
            $cols = ["`o`.`id` AS order_id","s.`id` AS sender_id","o.driver_id","o.`code` as order_code","DATE_FORMAT(request_date,'%d %b %Y') AS request_date","DATE_FORMAT(request_date,'%r') AS request_time","o.delivery_type","o.product_type","o.request_vehicle_type AS vehicle_type","o.qty","s.name AS sender_name","pickup_address","(SELECT name FROM driver WHERE id = o.driver_id) AS driver_name","o.delivery_condition","status_id","ps.name AS status","o.completed"];
        else {
            $indx = array_search('status',$cols,true);
            if($indx >=0) $cols[$indx] = 'ps.name AS status';
            $indx = array_search('driver_name',$cols,true);
            if($indx >=0) $cols[$indx] = '(SELECT dr.`name` FROM `driver` AS dr WHERE dr.id = o.driver_id LIMIT 1) AS driver_name'; //here d
          
        }
        $fields = implode(',',$cols);
        $more_where ="1=1";
        if($branch_id >0) $more_where ="o.branch_id =$branch_id"; 
        $rows = DB::table('order AS o')->whereRaw($more_where)->where('o.id',$id)->join('package_statuses AS ps','ps.id','=','o.status_id')->join('sender AS s','s.id','=','o.sender_id')->selectRaw($fields)->limit(1)->get();
        foreach($rows as $row) return $row;
        return null;  
      }

    //driver reject or cancel an order after being assigned to,
    //$d={'order_id',['driver_id']}
    function cancelOrder($arr,$ss=null){
        $ss = $ss?$ss:$this->userInfo;
        $branch_id = $ss->branch_id;
        $d = (object)$arr;
        $order_id = isset($d->order_id)?$d->order_id:null;
        // $driver_id = isset($d->driver_id)?$d->driver_id:null;
        // $remarks_id = isset($d->remarks_id)?$d->remarks_id:null;
        // $remarks = isset($d->remarks)?$d->remarks:null;
       
        $order = $this->getOrderProps($branch_id,$order_id,['o.id','o.code as order_code','o.status_id','ps.name AS status','o.driver_id','o.sender_id','o.qty','o.completed']);
        if(!$order) return DV::error("Order identity is not valid");
    
        $status_id = $order->status_id;
        if($status_id >2) return "Cannot cancel because the order is already picked"; 
        DB::table('order')->where('branch_id',$branch_id)->where('id',$order_id)->update(array(
          'driver_id'=>null,
          'status_id'=>1
        ));
        //todo: save $remarks in table "remarks (cateogry, remarks, id)" and save remarks in table "cancel_orders" 
        //todo: later: add condition WHERE driver_id = @driver_id so that only driver who is assigned to pickup can Cancel Order 
      
        //begin::From driver app => notify admin backend
            $message ="$order->driver_name មិនទទួល order លេខ $order->order_code";
            $event_data = (object)['branch_id'=>$branch_id,'order_id'=>$order_id,'order_code'=>$order->order_code,'status'=>'Available for Pickup','status_id'=>1,'completed'=>$order->completed,'driver_id'=>null,'driver_name'=>'Driver Canceled','message'=>$message,'title'=>"Order Canceled"];
            Notifier::notify_admin('order_status_changed',$event_data);
       //end::From driver app => notify admin backend

         //begin::From driver app => notify admin backend
            $order->event_name ='order_canceled';
            $cdata =[
              [
                'user_class'=>'merchant',
                'target_user_id'=>$order->sender_id,
                'title'=>'Order Canceled',
                 'message'=>"Order $order->order_code មិនទាន់មានអ្នកដឹកទទួលយក!",
                'persist'=>1,
                'data'=>$order
              ]
            ]; 
            $err = Notifier::notify_mobile($branch_id,$cdata);
       //end::From driver app => notify admin backend

        return DV::success();
    } 

   /*** send_otp_preregister($d). $d = {'phone_number'} => send_otp_preregister() will check if the phone number is already in use, 
        if the phone_number not yet in use then create OTP in templory table "temp_otp" waiting to be verified (otp_code is deleted after verified correctly or 1 minute later)      
    ***/
    //api/reg-send-otp
    //$d = {phone_number}
    function send_otp_preregister($arr = []){
      $d = (object)$arr;
      //Generate new 6-digit OTP code
      $otp_code = $this->newOTP(6); 
      //$app_id = isset($d->app_id)? Sanitizer::sanitize($d->app_id):null;
      $app_id = getAppIdByUserClass($d->user_class);  
      //Make sure the app_id supplied is the Merchant Mobile App
      if (empty($app_id)) {
         return DV::error('App ID is not valid');
      }

      $branch_id =1; //1 = "Pro Express" // $this->getBranchByApp($app_id);
      $d->phone_number = isset($d->phone_number)? $d->phone_number:null;
      if (empty($d->phone_number)){
         return DV::error('Phone number cannot be empty');
      } 
      
      //Check if the phone_number is already in use
      $number_in_use = DB::table('um_users AS u')->where('app_id',$app_id)->where('login_name',$d->phone_number)->limit(1)->exists();
      if ($number_in_use) return DV::error('Phone number is already in use');
       
       //$text = get_settings_value($ss,'OTP_SMS_TEMPLATE','string'); //get sms template from settings storage table
       $text ='អរគុណសំរាប់ការចុះឈ្មោះ​។ លេខសម្ងាត់ #'; //for faster 
       $text = str_replace('#',$otp_code,$text); 
      
       $m_result = SMS::send($d->phone_number,$text,null); 
       if ($m_result->status === 'Error') 
          return DV::error($m_result->error_message); 
       else{
            //Save OTP_CODE after successfully sent otp_code sms 
            $expiry_time = Carbon::now()->addSeconds(60);
            DB::table('temp_otp')->where('app_id',$app_id)->where('phone_number',$d->phone_number)->delete();
            DB::table('temp_otp')->insert(array(
              'branch_id'=>$branch_id,
              'app_id'=>$app_id,
              'phone_number'=>$d->phone_number,
              'otp_code'=>$otp_code,
              'expiry_time'=>$expiry_time
            ));
            return DV::depends(1,['otp_code'=>$otp_code]);
         }  
    }

  function verify_otp_preregister($arr=[]){
    $d = (object)$arr;
        $phone_number = isset($d->phone_number)?$d->phone_number:null;
        $otp_code = isset($d->otp_code)?$d->otp_code:null;
        $app_id = getAppIdByUserClass($d->user_class);
        if (empty($phone_number)) return DV::error("Phone number cannot be empty $phone_number"); 

        if (empty($otp_code)) return DV::error('otp code cannot be empty'); 

        $exists = DB::table('temp_otp')->where('app_id',$app_id)->where('phone_number',$phone_number)->where('otp_code',$otp_code)->limit(1)->exists();
        if ($exists) DB::table('temp_otp')->where('app_id',$app_id)->where('phone_number',$phone_number)->where('otp_code',$otp_code)->delete();
        
        return DV::success(['data'=>($exists)?1:0]);
  }
  
  //Called by merchant mobile app to update user profile quickly
   function updateProfile_driver($arr,$id = null, $ss=null){
        $driver_id = $id?$id:$this->id;
        $ss =$ss?$ss:$this->userInfo; 
        $d = (object)$arr;
        $branch_id = isset($ss->branch_id)? Sanitizer::sanitize($ss->branch_id):null;
        $result = (object)array('error_message'=>null,'status'=>'OK', 'change_phone_number'=>0);
        
        //$driver_id = isset($d->driver_id)?$d->driver_id:null;
        $name = isset($d->name)?$d->name:null;
        $phone_number = isset($d->phone_number)?$d->phone_number:null;
        $address = isset($d->address)?$d->address:null;
        //$email = isset($d->name)?$d->name:null;
        
        $required_fields =['name','phone_number'];
        $res = nonEmptyFields($d,$required_fields);
        if($res->status =='Error') return $res;
        
        if ($this->driverExists($ss,$name,$driver_id)) return DV::error('It seems this name is already in use by another driver');
         
        //Check if driver changed his phoner number
           $dr = self::getDriverProps($driver_id,["phone_number"]);
           $org_phone_number =null;
           if($dr) $org_phone_number  = $dr->phone_number;

          if (!empty($org_phone_number) && !empty($phone_number) && ($org_phone_number != $phone_number)){
              $new_otp_code = $this->newOTP();
              $res = PendingTask::create('change_phone_number',$branch_id,$ss->user_id,$org_phone_number,$phone_number,$new_otp_code);
              if ($res->status==='OK'){
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
 
        DB::table('driver')->where('branch_id',$branch_id)->where('id',$driver_id)->update([
          'name'=>$name,
          //'name_kh'=>$name_kg,
          'address'=>$address
          //,'email'=>$email
        ]);
        //if(!isset($result->change_phone_number)) $result->change_phone_number =1;
        $result->status ='OK';
        $result->status_code =200;
        $result->error_message ='';
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
 
  function getTermsAndConditions($d){
      //$ss = UM::getUserInfoByToken($d);
      //if($ss->status_code !==200) return $ss; //user not authenticated
      // //need permission to do this task
      //$branch_id = $ss->branch_id;

      return "Here some terms and condition text for driver";
   } 

}
