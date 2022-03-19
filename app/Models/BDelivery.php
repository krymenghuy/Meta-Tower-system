<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Session;
use Carbon\Carbon;
use DB;

//BDelivery Model is delivery in which Driver is pre-assigned directly from "Package Trail" and once driver is assigned to delivery trip, the Trip status is changed to "On Delivery" until driver update each package's status to be "Failed" or  "Delivered"
class BDelivery extends Model
{
    use HasFactory;

    function getVehicleTypeByDriver($branch_id,$driver_id){
        $def_vehicle_type ='motobike'; //refers to table "vehicle_types"
        $rows = DB::table('driver AS d')->where('d.branch_id',$branch_id)->where('d.id',$driver_id)->selectRaw('d.vehicle_type')->limit(1)->get();
        foreach($rows as $row) return $row->vehicle_type;
        return  $def_vehicle_type;
    }

    function getNextFleetNumber($branch_id,$len =5){
        $prefix='';
        $op_month = date('m'); //month number 1,2,3,....7 
        $op_year = date('Y'); //four digit year such as 2022
  
        $rows = DB::table('trip_num_control AS c')->where('c.branch_id',$branch_id)->where('op_month',$op_month)->where('op_year',$op_year)->limit(1)->selectRaw('TRIM(c.prefix) AS prefix,c.last_trip_number')->get();
        foreach($rows as $row) {
            $num = $row->last_trip_number;
            $prefix = trim($row->prefix);
            $num +=1;
            DB::table('trip_num_control')->where('branch_id',$branch_id)->where('op_month',$op_month)->where('op_year',$op_year)->update(array('last_trip_number'=>$num));
            return $prefix.$branch_id.formatNumber($num,$len);
        }
        DB::table('trip_num_control')->insert(array('branch_id'=>$branch_id,'last_trip_number'=>1,'op_month'=>$op_month,'op_year'=>$op_year));
        return $prefix.$branch_id.formatNumber(1,$len);
    }
   
    //returns object {'delivery_id','depart_time','package_count'}
    function getActiveDeliveryId($ss,$warehouse_id, $driver_id){
        $branch_id = $ss->branch_id;
        //$warehouse_id = $ss->warehouse_id;
        $trip_status_id = 2; //On Delivery
        $today = date('Y-m-d');
        $rows = DB::table('delivery AS d')->where('branch_id',$branch_id)->where('driver_id',$driver_id)->whereRaw("DATE(depart_time) ='$today'")->where('status_id',$trip_status_id)->selectRaw('id AS delivery_id,fleet_tracking_number,depart_time,package_count')->limit(1)->get();
        foreach($rows as $row) return $row;

        $vehicle_type = $this->getVehicleTypeByDriver($branch_id,$driver_id); 
        $on_delivery_status_id = 2; //On Delivery
        $trip_number = $this->getNextFleetNumber($branch_id);
     
        $depart_time = getNowTime();
        if (!$warehouse_id || $warehouse_id<=0) $warehouse_id =1;
        DB::table('delivery')->insert(array(
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
        "update_user"=>$ss->login_name
        ,'update_date'=>getNowTime()
      ));
      $new_id = DB::getPdo()->lastInsertId();
      return (object)array('delivery_id'=>$new_id,'depart_time'=>$depart_time,'fleet_tracking_number'=>$trip_number,'package_count'=>1);
    }

    //assignDriver ahead of time. pre-assignDriver() pre-assign driver | pre assign driver to a package(s)
    function b_assignDeliveryDriver($d) {
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        //$allowable_statuses = ['pending','delayed','failed','delivered','otw','pd']; 
        $branch_id = sanitize($ss->branch_id);
        $driver_id = isset($d->driver_id)?$d->driver_id:null;
        $warehouse_id = isset($d->warehouse_id)?$d->warehouse_id:null;
        $package_id = isset($d->package_id)?$d->package_id:null;
        $barcode  =isset($d->barcode)?$d->barcode:null;
        $result = (object)array('status'=>'OK','error_message'=>null);

        if(empty($warehouse_id) || $warehouse_id <=0) {
            $result->status ='Error';
            $result->error_message ="Warehouse ID not valid";
            return $result;
        } 

        $depart_time =getNowTime(); //isset($d->depart_time)?convertDate($d->depart_time):getNowTime();
        $package = null;
        if(empty($package_id) || $package_id <=0){
           $rows = DB::table('package')->where('branch_id',$branch_id)->where('qr_code',$barcode)->selectRaw('id,delivery_id,qr_code AS barcode, driver_id, status_id,driver_pmt_status_id, sender_pmt_status_id')->limit(1)->get();
           foreach($rows as $row) {
             $package = $row;
             $package_id = $row->id; 
           }
        }else {
            $rows = DB::table('package')->where('branch_id',$branch_id)->where('id',$package_id)->selectRaw('id,delivery_id,qr_code AS barcode, driver_id, status_id,driver_pmt_status_id, sender_pmt_status_id')->limit(1)->get();
            foreach($rows as $row){
                $package = $row;
                $barcode = $row->barcode;
            }
        }

        //if no driver is supplied => reset the package's status to "Arrived At Warehouse"
        if (empty($driver_id)) {
            DB::table('package')->where('branch_id',$branch_id)->where('id',$package_id)->update(array(
                'driver_id'=>null,
                'status_id'=>5,
                /** for pre-assigning driver case: => the `delivery`.`depart_time` is equal to the last time any package is assigned to the driver **/
                'depart_time'=>getNowTime(),
                'delivery_id'=>null, //important to update it to NULL
                'update_user'=>$ss->login_name,
                'update_date'=>getNowTime()
            ));
            $this->deleteTripIfEmpty($branch_id,$package->delivery_id);
            $result->status='OK';
            $result->error_message =null;
            return $result;
        } 

        if($package->status_id ==8) {
            $result->status='Error';
            $result->error_message ='Cannot assign driver because the item is already delivered';
            return $result;
        }
        if($package->status_id ==11) {
            $result->status='Error';
            $result->error_message ='Cannot assign driver because the item is already returned to vendor';
            return $result;
        }
 
        $m = $this->getActiveDeliveryId($ss,$warehouse_id,$driver_id);
        $delivery_id = $m->delivery_id;    
        $status_id = 6; //package's status 6 => On Delivery or Delivery Started 
        DB::table('package')->where('branch_id',$branch_id)->where('id',$package_id)->update(array('driver_id'=>$driver_id,'delivery_id'=>$delivery_id,'status_id'=>$status_id));
        $this->updateDelivery_package_count($branch_id,$delivery_id);

        $result->status='OK';
        $result->error_message =null;
        return $result;
      }

     function deleteTripIfEmpty($branch_id, $delivery_id){
        $exists = DB::table('package')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->limit(1)->exists();
        if(!$exists || $exists ==0) DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->delete();
        return null;
     }

     function updateDelivery_package_count($branch_id,$delivery_id){
            $rows = DB::table('package AS p')->where('p.delivery_id',$delivery_id)->selectRaw("COUNT(p.id) AS cnt")->get();
            foreach($rows as $row) {
                DB::table("delivery")->where('id',$delivery_id)->update(array('package_count'=>$row->cnt));
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
