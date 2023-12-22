<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use App\Models\DV;
//use Session;
use Sanitizer;
//use Carbon\Carbon;
//use App\Models\UM;
use DB;

//BDelivery Model is delivery in which Driver is pre-assigned directly from "Package Trail" and once driver is assigned to delivery trip, the Trip status is changed to "On Delivery" until driver update each package's status to be "Failed" or  "Delivered"
class BDelivery //extends Model
{
    //use HasFactory;
    protected $id = null, $userInfo = null;
    function __construct($id =null,$userInfo=null)
    {
         $this->id = $id;
         $this->userInfo = $userInfo;
    }

    function getVehicleTypeByDriver($branch_id,$driver_id){
        $def_vehicle_type ='moto bike'; //refers to table "vehicle_types"
        $row = DB::table('driver AS d')->where('d.branch_id',$branch_id)->where('d.id',$driver_id)->selectRaw('d.vehicle_type')->take(1)->first();
        return $row? $row->vehicle_type: $def_vehicle_type;
    }

    function getNextFleetNumber($uss,$len =5){
        $branch_id = $uss->branch_id;
        $prefix='';
        $op_month = date('m'); //month number 1,2,3,....7 
        $op_year = date('Y'); //four digit year such as 2022
        $last_two_digit = substr($op_year, -2);
        $str_m = $op_month;
        if($op_month <10) $str_m ='0'.$op_month;
        $rows = DB::table('trip_num_control AS c')->where('c.branch_id',$branch_id)->where('op_month',$op_month)->where('op_year',$op_year)->take(1)->selectRaw('TRIM(c.prefix) AS prefix,c.last_trip_number')->get();
        foreach($rows as $row) {
            $num = $row->last_trip_number;
            $prefix = trim($row->prefix);
            $num +=1;
            DB::table('trip_num_control')->where('branch_id',$branch_id)->where('op_month',$op_month)->where('op_year',$op_year)->update(['last_trip_number'=>$num]);
            return $prefix.$branch_id.$last_two_digit.$str_m.formatNumber($num,$len);
        }
        DB::table('trip_num_control')->insert(array('branch_id'=>$branch_id,'last_trip_number'=>1,'op_month'=>$op_month,'op_year'=>$op_year)); 
        return $prefix.$branch_id.$last_two_digit.$str_m.formatNumber(1,$len);
    }
   
    //returns object {'delivery_id','depart_time','package_count'}
    function getActiveDeliveryId($ss,$warehouse_id, $driver_id){
        $branch_id = $ss->branch_id;
        //$warehouse_id = $ss->warehouse_id;
        $trip_status_id = 2; //On Delivery
        //$today = date('Y-m-d');
        $str_today = '5=5'; //'DATE(depart_time) =\''.$today.'\'';
        $rows = DB::table('delivery AS d')->where('d.branch_id',$branch_id)->where('d.driver_id',$driver_id)->whereRaw($str_today)->where('d.status_id',$trip_status_id)->selectRaw('d.id AS delivery_id,warehouse_id,fleet_tracking_number,depart_time,package_count')->take(2)->get();
        if(count($rows) > 1){
           return (object)['status'=>'Error','error_message'=>'អ្នកដឹកម្នាក់នេះមានជើងដឹកច្រើនមិនទាន់បានបញ្ចប់។​ ដូច្នេះមិនអាចទទួលកញ្ចប់ថ្មីបានទេ','trip'=>null]; 
           \Log::info('Data error: BDelivery::getActiveDeliveryId():61 => Driver '.$driver_id.' has more than one historical trips that are still "on delivery", causing the new package assignment failed by '.$ss->full_name.' at '.getNowTime());
        }else if(isset($rows[0])){
           //\Log::info('use last one trip'); 
           return (object)['trip'=>$rows[0],'status'=>'OK']; 
        } 
        
        $vehicle_type = $this->getVehicleTypeByDriver($branch_id,$driver_id); 
        $on_delivery_status_id = 2; //On Delivery
        $trip_number = $this->getNextFleetNumber($ss);
     
        $depart_time = getNowTime();
        if (!$warehouse_id || $warehouse_id<=0) $warehouse_id =1;
        DB::table('delivery')->insert([
        'branch_id'=>$branch_id,
        'warehouse_id'=>$warehouse_id,
        'depart_time'=>getNowTime(),   
        'fleet_tracking_number'=>$trip_number,   
        'depart_time'=>$depart_time,
        'driver_id'=>$driver_id,
        //'delivery_type'=>$delivery_type,
        'vehicle_type'=>$vehicle_type,
        'status_id'=>$on_delivery_status_id,
        'package_count'=>1,
        'failed_count'=>0,
        'delivered_count'=>0,
        'create_date'=>getNowTime(),
        'create_user'=>$ss->full_name,
         'update_user'=>$ss->full_name
        ,'update_date'=>$depart_time
      ]);
      $new_id = DB::getPdo()->lastInsertId();
      \Log::info('new trip id ' . $new_id); 
      $trip = (object)['delivery_id'=>$new_id,'warehouse_id'=>$warehouse_id,'depart_time'=>$depart_time,'fleet_tracking_number'=>$trip_number,'package_count'=>1];
      return (object)['trip'=>$trip,'status'=>'OK'];
    }

    //assignDriver ahead of time. pre-assignDriver() pre-assign driver | pre assign driver to a package(s)
    //$d = {driver_id,barcode|pacakge_id};
    function b_assignDeliveryDriver($arr,$ss) {
        //$ss = UM::getUserInfoByToken($d);
        $ss = $ss?$ss:$this->userInfo;
        //if ($ss->status_code !==200) return $ss; //user not authenticated
        $d = (object)$arr;
        //$allowable_statuses = ['pending','delayed','failed','delivered','otw','pd']; 
        $branch_id =Sanitizer::sanitize($ss->branch_id);
        $driver_id = isset($d->driver_id)?$d->driver_id:null;
        $warehouse_id = null; //isset($d->warehouse_id)?$d->warehouse_id:null; //optional or not necessary
        $package_id = isset($d->package_id)?$d->package_id:null;
        $barcode  =isset($d->barcode)?$d->barcode:null;
        //$result = (object)array('status'=>'OK','error_message'=>null);
        $admin_assigned = (strtolower($ss->user_class) =='driver')? 0:1;

        //if(!isset($d->is_from_mobile)) $d->is_from_mobile = 0;
        $d->is_from_mobile = in_array(strtolower($ss->user_class),['driver']);
        $continue_to_deliver = 0;

        if($driver_id <=0) $driver_id = null;

        //No need to get warehouse_id here. Get $warehouse_id from pacakage info
        //if(empty($warehouse_id) || $warehouse_id <=0) DV::error("Warehouse ID not valid"); 

        //$depart_time =getNowTime(); //isset($d->depart_time)?convertDate($d->depart_time):getNowTime();
        $package = null;
        //if $package_id is not supplied then use the supplied $barcode to get $package_id
        if(!$package_id || $package_id <=0){
           $row = DB::table('package AS p')->where('p.branch_id',$branch_id)->where('p.qr_code',$barcode)->selectRaw('p.id,p.warehouse_id,p.delivery_id,p.qr_code AS barcode, p.driver_id, status_id,driver_pmt_status_id, sender_pmt_status_id')->take(1)->first();
          if($row) {
             $package = $row;
             $package_id = $row->id; 
           }
        }else {
            //if $barcode is not supplied then use the supplied $package_id to get $barcode
            $row = DB::table('package AS p')->where('p.branch_id',$branch_id)->where('p.id',$package_id)->selectRaw('p.id,p.warehouse_id,p.delivery_id,qr_code AS barcode, driver_id, status_id,driver_pmt_status_id, sender_pmt_status_id,IFNULL(failed_num,0) AS failed_num')->take(1)->first();
            if($row){
                $package = $row;
                $barcode = $row->barcode;
            }
        }
        if(!$package) return DV::error('Package identity such as barcode or package ID is not valid');
        $warehouse_id = $package->warehouse_id;
        $continue_to_deliver =  ($package->status_id ==9);
        //if no driver is supplied => reset the package's status to "Arrived At Warehouse"
        if (!$driver_id) {
            DB::table('package')->where('branch_id',$branch_id)->where('id',$package_id)->update([
                'driver_id'=>null,
                'status_id'=>5,
                'outstanding'=>1,
                /** for pre-assigning driver case: => the `delivery`.`depart_time` is equal to the last time any package is assigned to the driver **/
                //'depart_time'=>getNowTime(),
                'delivery_id'=>null //important to update it to NULL
            ]);
            $this->deleteTripIfEmpty($branch_id,$package->delivery_id);
            if($package->driver_id > 0){
                $driver = DB::table('driver AS d')->where('id',$package->driver_id)->selectRaw('id,name,phone_number')->take(1)->first();
                if ($driver){
                    $msg = $ss->full_name.' removed driver ID '.$driver->name.'('.$driver->id.') from package ID '.$package->id;
                    $data = (object)['user_class'=>$ss->user_class,'package_id'=>$package->id,'action_name'=>'remove_driver','description'=>$msg,'user_comment'=>''];
                    Tracker::log($data,$ss);
                }
            }
            return DV::success();
        } 
        
        //get driver 's name
        $driver =null;
        $rows = DB::table('driver AS d')->where('id',$driver_id)->selectRaw('name,phone_number')->limit(1)->get();
        foreach($rows as $row) $driver = $row;
        if(!$driver) return DV::error('Driver identity is not correct');

        $continue_to_deliver = 0;
        if($package->status_id ==8) return DV::error('Cannot assign driver because the item is already delivered');
            
        else if($package->status_id ==11) DV::error('Cannot assign driver because the item is already returned to vendor');  
        else if($package->status_id ==9) {
             //if previous status is "Failed" and user assign driver to delviery again => so it means "Continue to Deliver" or try delivery again
             $continue_to_deliver = 1;
        }
        $m_res = $this->getActiveDeliveryId($ss,$warehouse_id,$driver_id);
        if ($m_res->status ==='Error') return DV::error($m_res->error_message);
        $m = $m_res->trip;
        $delivery_id = $m->delivery_id;
        if(empty($m->warehouse_id)) return DV::error("Warehouse ID happens to be invalid!");
        
        $status_id = 6; //package's status 6 => On Delivery or Delivery Started 
        $inputs = ['warehouse_id'=>$m->warehouse_id,'driver_id'=>$driver_id,'delivery_id'=>$delivery_id,'status_id'=>$status_id];
        if($continue_to_deliver == 1) $inputs['failed_num'] = 1;
 
        $x = DB::table('package')->where('branch_id',$branch_id)->where('id',$package_id)->update($inputs);
        $trip_status_id=2;
        $this->updateDelivery_package_count($branch_id,$delivery_id,$trip_status_id);

        //begin::notify to concerned driver
                $cols = ['receiver_name','receiver_address','p.status_id','status','driver_name','receiver_phone','sender_name','sender_id','sender_phone'];
                $p = $this->getPackageProps($branch_id,$package_id,$cols,"id");
                 
                $p->event_name ='delivery_assigned';
                $again= null;
                if($continue_to_deliver==1) $again ='ម្តងទៀត';

                $driver_msg ="មានទំនិញត្រូវដឹកជូនភ្ញៀវទៅ $p->receiver_address";
                $merchant_msg ="កញ្ចប់ភ្ញៀវលេខ $p->receiver_phone កំពុងដឹកចេញ".$again."ទៅ $p->receiver_address ។​អ្នកដឹក $driver->name";
                
                $cdata = [];
                //if Driver scans package from mobile app=> No need to notify the driver himself. But if Admin assign driver (i.e: $is_from_mobile ==0) then 
                //inform the concerned driver
                if($d->is_from_mobile !=1) {
                   $cdata[] =   [
                                    'user_class'=>'driver',
                                    'target_user_id'=>$driver_id,
                                    'title'=>'Delivery Assignment',
                                    'message'=>$driver_msg,
                                    'persist'=>1,
                                    'data'=>$p
                                ];
                }else{
                    //Notidy Admin as driver scans package one by one from Mobile app.
                    $event_data = (object)['branch_id'=>$branch_id,'user_id'=>$ss->user_id,'delivery_id'=>$delivery_id,'bar_code'=>$barcode,'status_id'=>$p->status_id,'status'=>$p->status,"driver_id"=>$driver_id,"driver_name"=>$p->driver_name];
                    $event_data->title ="Delivery";
                    $event_data->message ="អ្នកដឹក $driver->name បានយកទំនិញចេញ. Package $p->receiver_phone scanned out";
                    $err = Notifier::notify_admin('package_status_changed',$event_data);
                }
                $cdata[] = [
                                'user_class'=>'merchant',
                                'target_user_id'=>$p->sender_id,
                                'title'=>'Delivery Assignment',
                                'message'=>$merchant_msg,
                                'persist'=>1,
                                'data'=>$p
                            ];

                $res = Notifier::notify_mobile($branch_id,$cdata);
       //end::notify to concerned driver

        $des =null;
        if($admin_assigned)
           $des = $ss->full_name. ' បានដាក់កញ្ចប់លេខ '.$barcode.' ទៅអោយអ្នកដឹក '.$driver->name. '។​ លេខអ្នកទទួល '.$p->receiver_phone;
        else 
           $des = 'អ្នកដឹកឈ្មោះ '.$driver->name.' បានយកកញ្ចប់លេខ '.$barcode.' ដឹកចេញ ទៅអោយភ្ញៀវ '.$p->receiver_phone;
        Tracker::log((object)['user_class'=>'driver','package_id'=>$package->id,'action_name'=>'change_driver','description'=>$des,'user_comment'=>''],$ss); 
        return DV::success();
      }

     function getPackageProps($branch_id=null,$id=null,$cols=null,$by_col ='id'){
        if(!$id) return null;
        if(!$cols) 
          $cols = ["p.id","p.qr_code AS bar_code","s.`id` AS sender_id","p.driver_id","p.delivery_type","s.name AS sender_name","p.receiver_address","(SELECT name FROM driver WHERE id = p.driver_id) AS driver_name","p.status_id","ps.name AS status","o.outstanding"];
        else {
            $indx = array_search('status',$cols,true);
            if($indx >=0){
                $cols[$indx] = 'ps.name AS status';
            }
            
            $indx = array_search('driver_name',$cols);
            if($indx >=0){
                $cols[$indx] ="(SELECT name FROM driver WHERE id = p.driver_id LIMIT 1) AS driver_name";
            }
             //*** This cause silent error missing columns driver_id  etc.. 
            // $indx = array_search('sender_name',$cols,true);
            // if($indx >=0){
            //     $cols[$indx] = 's.name AS sender_name';
            // }

            // $indx = array_search('sender_phone',$cols,true);
            // if($indx >=0){
            //     $cols[$indx] = 's.phone_number AS sender_phone';
            // }
        }
        $fields = implode(',',$cols);
        $more_where ="1=1";
        $where1 ="p.id ='$id'";
        if($by_col !='id') $where1 ="p.qr_code ='$id'";

        if($branch_id >0) $more_where ="p.branch_id =$branch_id"; 
        $rows = DB::table('package AS p')->whereRaw($more_where)->whereRaw($where1)->join('package_statuses AS ps','ps.id','=','p.status_id')->join('sender AS s','s.id','=','p.sender_id')->selectRaw($fields)->limit(1)->get();
        foreach($rows as $row) return $row;
        return null;  
    }

    //deleteTripIfEmpty() will delete trip if it is empty, otherwise it will update trip info such as Package Count, delivered_count, Failed count
     function deleteTripIfEmpty($branch_id, $delivery_id){
        $exists = DB::table('package')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->limit(1)->exists();
        if(!$exists || $exists ==0) 
            DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->delete();
        else {
            $ss = (object)['branch_id'=>$branch_id];
            $this->updateDeliveryStatus($ss,$delivery_id);
        }    
        return null;
     }

     //update data field "delivery.package_count". If @status_id is supplied then also update field "delivery.status_id" 
     function updateDelivery_package_count($branch_id,$delivery_id,$status_id =null){
            $rows = DB::table('package AS p')->where('p.delivery_id',$delivery_id)->selectRaw("COUNT(p.id) AS cnt")->get();
            foreach($rows as $row) {
                $inputs = ['package_count'=>$row->cnt];
                if ($status_id>0) $inputs = ['package_count'=>$row->cnt,'status_id'=>$status_id];
                DB::table("delivery")->where('id',$delivery_id)->update($inputs);
            }
            // DB::statement(DB::raw("UPDATE `delivery` SET 
            // package_count = (SELECT COUNT(p.id) FROM package AS p WHERE p.branch_id ='$branch_id' AND p.delivery_id ='$delivery_id')
            // WHERE delivery.branch_id = '$branch_id' AND delivery.id ='$delivery_id' 
            // "
            // ));
     }
      //get count packages per trip based on multiple statuses   
      function getPackageCountByStatuses($uss,$delivery_id,$status_ids=-1){
            $branch_id = $uss->branch_id;
            $more_wheres =" p.status_id IN (".$status_ids.")";
            DB::table('package AS p')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->whereRaw($more_wheres)->selectRaw("COUNT(p.id) AS cnt")->get();
            foreach($rows as $row) return is_numeric($row->cnt)?$row->cnt:0;
            return 0;
       } 

       //updateDeliveryStatus() returns trip status id (3) only in case the trip is DONE, other returns NULL  
      function updateDeliveryStatus($uss,$delivery_id){
            $branch_id = $uss->branch_id;
            if ($delivery_id <=0 || $delivery_id) return null;
            $delivered_status_id =8; //For package status only, Not delivery status
            $failed_status_id =9;
            $cnt = $this->getPackageCountByStatus($uss,$delivery_id,-1); //count all packages
            $delivered_cnt = $this->getPackageCountByStatus($uss,$delivery_id,$delivered_status_id);
            $failed_and_returned_count = $this->getPackageCountByStatuses($uss,$delivery_id,'9,11');
            $trip_status_id =null; //The trip is 2 = "On Delivery" (In process ofe delivery for each package)

            if ($cnt <=  $delivered_cnt + $failed_and_returned_count) $trip_status_id =3; //Trip Finished AS "Done"
            DB::table('delivery')->where('id',$delivery_id)->where('branch_id',$branch_id)->update(array(
              'delivered_count'=>$delivered_cnt,
              'failed_count'=>$failed_cnt,
              'package_count'=>$cnt
            ));
            //If all packages are delviered => then also update trip's status to 3 ="Done" automatically
            if($trip_status_id ==3){
               DB::table('delivery')->where('id',$delivery_id)->where('branch_id',$branch_id)->update(array(
                 'status_id'=>$trip_status_id
               ));
            }
            return $trip_status_id;
      }
 
}
