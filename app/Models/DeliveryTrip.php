<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Notifier;
use Carbon\Carbon;
use Session;
use DB;

class DeliveryTrip extends Model
{
    use HasFactory;
 
      function getNextFleetNumber($uss,$len =5){
        $branch_id = $uss->branch_id;
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
  
    function getComboItems_delivery_status($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task    
        $rows =DB::table('delivery_statuses AS ds')->selectRaw('ds.id,ds.name AS status_name')->orderByRaw('ds.display_order ASC')->get();
    }
     //various form options data combo items on Package Trail View or "Delivery Trip" view
     function getForm_options_delivery_trip($d) {
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task      

         $branch_id = $ss->branch_id;
          $data = (object)[];

          $deliveryTypes[] = (object)array('name'=>'Normal');
          $deliveryTypes[] = (object)array('name'=>'Fast');
          $data->today_date = date('d M Y');
          $data->deliveryTypes =$deliveryTypes; 
          $data->warehouses  = DB::table('warehouses')->selectRaw('id, name AS warehouse_name')->where('branch_id',$branch_id)->orderByRaw('name ASC')->get();
          $data->vehicle_types  = DB::table('vehicle_type')->selectRaw('code, name AS vehicle_type')->where('branch_id',$branch_id)->orderByRaw('name ASC')->get();
          $data->drivers  = DB::table('driver')->selectRaw('id, name AS driver_name')->where('branch_id',$branch_id)->orderByRaw('name ASC')->get();
          $data->zones  = DB::table('zones')->selectRaw('zone_code,zone_name')->where('branch_id',$branch_id)->get();
          $data->statuses = DB::table('delivery_statuses AS ds')->selectRaw('ds.id AS status_id,ds.name AS status_name')->orderByRaw('ds.display_order ASC')->get();
          return ($data);
      }

    function createDeliveryTrip($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $depart_date = isset($d->depart_date)?convertDate($d->depart_date):getNowTime();
        $delivery_type = isset($d->delivery_type)?$d->delivery_type:null;
        $driver_id = isset($d->driver_id)?sanitize($d->driver_id):null;
        
        $trip_status_id =1; //Pending 
        $fleet_tracking_number = $this->getNextFleetNumber($ss);
        DB::table('delivery')->insert(array(
            'branch_id'=>$branch_id,
            'fleet_tracking_number'=>$fleet_tracking_number,
            'depart_time'=>$depart_date,
            'driver_id'=>$driver_id,
            'status_id'=>$trip_status_id,
            'create_user'=>$ss->login_name,
            'create_date'=>getNowTime()
        ));

        $new_id = DB::getPdo()->lastInsertId();
        if ($new_id >0) {
            if(!isset($d->packages)) $d->packages=[];
            $cs = (array)$d->packages;
            $c;
            $i=0;
            do{
               if(!isset($cs[$c])) break;
               $c = $cs[$i];
                 DB::table('package')->where('p.branch_id',$branch_id)->where('p.id',$c->id)->update(array('delivery_id'=>$new_id));
               $i++;
            }while($c);

        }//end:: ($new_id > 0)
        return null;
    }

    function getDeliveryTrips($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
 
        $warehouse_id = isset($d->warehouse_id)?sanitize($d->warehouse_id):0; 
        $driver_id = isset($d->driver_id)?sanitize($d->driver_id):null;
        //$zone_code =isset($d->zone_code)? sanitize($d->zone_code):null;
        $search_value =isset($d->search_value)? sanitize($d->search_value):null;
        $status_id =isset($d->status_id)? sanitize($d->status_id):null; //must be NULL if value not given
        if (empty($status_id)) $status_id =-1; //status_id = 0 => 'Canceled'
        $delivery_type = isset($d->delivery_type)?sanitize($d->delivery_type):null;

        $date =isset($d->date)? $d->date:null;

        $str_warehouse = null;
        $str_status =null;
        $str_date = null;
        $str_driver = null;
        //$str_zone =null;
        $str_delivery_type =null;

        if (empty($search_value)) {
            $str_date = null; 
            if ((bool)strtotime($date)) $str_date = " AND DATE(IFNULL(d.depart_time,DATE(NOW()))) >='".convertDate($date)."' "; 
            $str_warehouse =" AND h.id ='".$warehouse_id."' ";
            if ($driver_id > 0) $str_driver = " AND d.driver_id ='".$driver_id."' ";
            //if (!empty($zone_code)) $str_zone =" AND d.zone_code ='".$zone_code."' ";
            //On Trip List page, if user does not select any status => show ONLY "On Delivery" trips
            if (empty($status_id)) 
                $str_status =" AND d.status_id =2";
            else if ($status_id != -1) $str_status =" AND d.status_id ='".$status_id."' ";

            if (!empty($delivery_type)) $str_delivery_type =" AND d.delivery_type ='".$delivery_type."' ";
            $more_wheres = " d.status_id >1 ".$str_delivery_type.$str_date.$str_warehouse.$str_status.$str_driver;
        }else{
            $search_value = escape_like_str($search_value);
            $more_wheres =" d.status_id >1 AND (d.fleet_tracking_number ='".$search_value."' OR d.driver_id IN (select id FROM driver WHERE branch_id ='".$branch_id."' AND name LIKE '%".$search_value."%') OR d.id IN (SELECT l.delivery_id FROM package AS l WHERE l.branch_id ='".$branch_id."' AND l.qr_code ='".$search_value."' or l.receiver_phone ='".$search_value."'))";
        }
        $selectCols ="d.id, d.driver_id, d.fleet_tracking_number,d.delivery_type, DATE_FORMAT(d.depart_time,'%d %b %Y') AS depart_date, encode_time(DATE_FORMAT(d.depart_time,'%r')) AS depart_time, d.package_count, d.delivered_count,d.failed_count,d.status_id, ds.name AS status, (SELECT name FROM driver WHERE id =d.driver_id LIMIT 1) AS driver_name,(SELECT SUM(IFNULL(p.driver_total,0)) FROM package AS p WHERE p.branch_id = d.branch_id AND p.delivery_id = d.id) AS driver_total, 'Unsettled' AS pmt_status";
        $rows = DB::table('delivery AS d')->join('delivery_statuses AS ds','ds.id','=','d.status_id')->join('warehouses AS h','h.id','=','d.warehouse_id')->where('d.branch_id',$branch_id)->whereRaw($more_wheres)->selectRaw($selectCols)->orderByRaw('d.create_date DESC')->get(); 
        return $rows;
    }

    function getDeliveryTrips_print($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
 
        $warehouse_id = isset($d->warehouse_id)?sanitize($d->warehouse_id):null; 
        $driver_id = isset($d->driver_id)?sanitize($d->driver_id):null;
        //$zone_code =isset($d->zone_code)? sanitize($d->zone_code):null;
        $search_value =isset($d->search_value)? sanitize($d->search_value):null;
        $status_id =isset($d->status_id)? sanitize($d->status_id):null; // must be null if value not given here
        if (empty($status_id)) $status_id =-1; //status_id = 0 => 'Canceled'
        $delivery_type = isset($d->delivery_type)?sanitize($d->delivery_type):null;
        $date =isset($d->date)? $d->date:null;
         
        $str_warehouse = null;
        $str_status =null;
        $str_date = null;
        $str_driver = null;
        //$str_zone =null;
        $str_delivery_type =null;

        if (empty($search_value)) {
            $str_date = null;
            if ((bool)strtotime($date)) $str_date = " AND DATE(IFNULL(d.depart_time,DATE(NOW()))) >='".convertDate($date)."' "; 
            $str_warehouse =" AND h.id ='".$warehouse_id."' ";
            if ($driver_id > 0) $str_driver = " AND d.driver_id ='".$driver_id."' ";
            //if (!empty($zone_code)) $str_zone =" AND d.zone_code ='".$zone_code."' ";
            if (empty($status_id)) 
               $str_status =" AND d.status_id =2"; //On Delivery trips only
            else if ($status_id != -1) $str_status =" AND d.status_id ='".$status_id."' ";
            if (!empty($delivery_type)) $str_delivery_type =" AND d.delivery_type ='".$delivery_type."' ";
            $more_wheres = "1=1 ".$str_delivery_type.$str_date.$str_warehouse.$str_status.$str_driver;
        }else{
            $search_value = escape_like_str($search_value);
            $more_wheres ="(d.fleet_tracking_number ='".$search_value."' OR d.driver_id IN (select id FROM driver WHERE branch_id ='".$branch_id."' AND name LIKE '%".$search_value."%') OR d.id IN (SELECT l.delivery_id FROM package AS l WHERE l.branch_id ='".$branch_id."' AND l.qr_code ='".$search_value."' or l.receiver_phone ='".$search_value."'))";
        }
        $selectCols ="d.id, d.driver_id, d.fleet_tracking_number,d.delivery_type, DATE_FORMAT(d.depart_time,'%d %b %Y') AS depart_date, encode_time(DATE_FORMAT(d.depart_time,'%r')) AS depart_time, d.package_count, d.delivered_count,d.failed_count, ds.name AS status, dr.name AS driver_name, d.vehicle_type".
        ",(SELECT SUM(IFNULL(base_fee,0)) FROM package WHERE branch_id ='".$branch_id."' AND delivery_id = d.id) AS total_base_fee ".
        ",(SELECT SUM(IFNULL(delivery_fee,0)) FROM package WHERE branch_id ='".$branch_id."' AND delivery_id = d.id) AS total_delivery_fee ".
        ",(SELECT SUM(CASE cod WHEN 1 THEN price ELSE 0 END) AS total FROM package WHERE branch_id ='".$branch_id."' AND delivery_id = d.id) AS total_cod_amount ".
        ",(SELECT SUM(IFNULL(cod_fee,0)) AS total FROM package WHERE branch_id ='".$branch_id."' AND delivery_id = d.id) AS total_cod_fee ".
        ",(SELECT SUM(IFNULL(driver_total,0)) FROM package AS p WHERE branch_id = d.branch_id AND p.delivery_id = d.id) AS driver_total, 'Unsettled' AS pmt_status";
        $rows = DB::table('delivery AS d')->join('delivery_statuses AS ds','ds.id','=','d.status_id')->join('warehouses AS h','h.id','=','d.warehouse_id')->join('driver as dr','dr.id','=','d.driver_id')->where('d.branch_id',$branch_id)->whereRaw($more_wheres)->selectRaw($selectCols)->get(); 
        foreach($rows as $h_row){
            $selectCols ="p.delivery_id,p.id AS package_id,p.qr_code AS barcode,p.sender_name,p.sender_phone,p.package_name, p.product_type,p.dim_x, p.dim_y, p.dim_h, p.billed_kg, p.price, (CASE cod WHEN 1 THEN p.price ELSE 0 END) AS cod_amount, p.cod, p.cod_fee, p.base_fee,p.delivery_fee,p.receiver_name, p.receiver_phone, p.zone_code,p.zone_name, IFNULL(p.forwarding_cost,0) AS forwarding_cost,p.delivery_notes,p.failure_notes, IFNULL(p.driver_total,0) AS driver_total,IFNULL(p.sender_total,0) AS sender_total, p.exchange_rate AS exchange_rate,p.status_id, (SELECT ps.name FROM package_statuses AS ps WHERE ps.id =p.status_id LIMIT 1) AS status, DATE_FORMAT(p.arrival_time,'%d %b %Y %r') AS arrival_time,p.agent_notes";
            $h_row->packages = DB::table('package AS p')->where('branch_id',$branch_id)->where('delivery_id',$h_row->id)->selectRaw($selectCols)->get();
        }
        return $rows;
    }


    //This function is NOT yet used
    function getPackageInfoByBarcode($d) {
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $barcode = isset($d->barcode)?sanitize($d->barcode):null;
        $selectCols ="p.id AS package_id, NULL AS sender_address, p.qr_code AS barcode,p.package_name,p.sender_name,p.sender_phone,p.receiver_phone, p.zone_name,p.zone_code,0 AS cod_amount,0 AS other_fees, p.driver_total,p.delivery_notes, p.status_id";
        $rows = DB::table('package AS p')->where('branch_id',$branch_id)->where('qr_code',$barcode)->selectRaw($selectCols)->limit(1)->get();
        foreach($rows as $row) return $row;
        return null; 
    }

   //This function not yet used
    function cleanEmptyTrip($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id);
        $delivery_id = isset($d->delivery_id)?sanitize($d->delivery_id):null;
        $rows = DB::table('delivery AS d')->join('package AS p','p.delivery_id','d.id')->where('d.branch_id',$branch_id)->where('d.id',$delivery_id)->select('d.id')->limit(1)->get();
        if (count($rows)<=0) DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->delete();
        return null;
    }

    //getDriverStatusInfo() returns trip object as "{status_id and delivery_id}" for the given @driver_id ONLY WHEN the trip is "Pending" or being scanned out, OR trip is "On Delivery" => showing that the driver is occuied 
    function getDriverStatusInfo($uss,$driver_id){
        $branch_id = $uss->branch_id;
        //the following query 1 record from table "delivery" where driver's status is either (1 = "Pending" or 2 ="On Delivery")
        $rows = DB::table('delivery AS d')->where('d.branch_id',$branch_id)->where('d.driver_id',$driver_id)->whereRaw("d.status_id IN (1,2)")->selectRaw("d.id AS delivery_id,d.status_id")->limit(1)->get();
        foreach($rows as $row) return $row;
        return null;
    }
    function getVehicleTypeByDriver($uss,$driver_id){
        $def_vehicle_type ='motobike'; //refers to table "vehicle_types"
        $branch_id = $uss->branch_id;
        $rows = DB::table('driver AS d')->where('d.branch_id',$branch_id)->where('d.id',$driver_id)->selectRaw('d.vehicle_type')->limit(1)->get();
        foreach($rows as $row) return $row->vehicle_type;
        return  $def_vehicle_type;
    }

    //Scan package out one by one. This is scanned by Admin Staff on Backend system or Scanned by Driver Mobile App
    //param $d = {'warehouse_id','barcode','delivery_type','driver_id','vehicle_type','depart_time'}
    function scanPackageOut($d) {
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $delivery_id =  isset($d->delivery_id)?sanitize($d->delivery_id):null;
        $barcode = isset($d->barcode)?sanitize($d->barcode):null;
        $warehouse_id = isset($d->warehouse_id)?sanitize($d->warehouse_id):null;
        $delivery_type = isset($d->delivery_type)?sanitize($d->delivery_type):null;
        $vehicle_type = isset($d->vehicle_type)?sanitize($d->vehicle_type):null;
        $driver_id = isset($d->driver_id)?sanitize($d->driver_id):0;
        $depart_time = isset($d->depart_time)?convertDate($d->depart_time):null;
        if (!(bool)strtotime($depart_time)) $depart_time =getNowTime();

        $new_delivery_id = null;
         
        $result = (object)['status'=>'OK','error_message'=>null];

        // if ($driver_id <=0) {
        //     $result->status='Error';
        //     $result->error_message ='Driver or delivery person is required';
        //     return $result;
        // }
        
        if(empty($vehicle_type)) {
           $vehicle_type = $this->getVehicleTypeByDriver($ss,$driver_id);
        }
        // //Find delivery type when delivery_type not supplied
        // if (empty($delivery_type)) {
        //     $rows = DB::table('package AS p')->where('p.branch_id',$branch_id)->where('p.qr_code',$barcode)->select('p.delivery_type')->limit(1)->get();
        //     foreach($rows as $row) $delivery_type = $row->delivery_type;
        // }

        if (strtolower($delivery_type)!='normal' && strtolower($delivery_type) !='fast') {
            $result->status='Error';
            $result->error_message ='Delivery Type is not correct';
            return $result;
        }

        $find_by ="barcode"; // "id"
        if($this->package_in_trip($branch_id, $delivery_id, $barcode,$find_by)) {
            $result->status='Error';
            $result->error_message ='Package already in the list';
            return $result;
        }  
        
        //begin:: Checking driver's status if he is occupied by another trip or he is scanning out somewhere on another computer or app
            $m = $this->getDriverStatusInfo($ss,$driver_id);
            if ($m) {
                if ($m->status_id ==2) {
                    $result->status='Error';
                    $result->error_message ='The driver is now on another delivery. You can finish that delivery status first before starting a new delivery';
                    return $result;
                }
                // else if ($m->status_id ==1) {
                //     //This context => "Driver has done scanning ,maybe, on another machine or app, and he or someone try to scan packages for him again on other machines " => so cancel the scanning data on previous machine
                //     //This block of code is same as method $this->deleteNewTrip()
                //     $status_id =5; //Arrived at warehouse. Set package's status back to arrived at warehouse
                //     DB::table('package')->where('branch_id',$branch_id)->where('delivery_id',$m->delivery_id)->update(array('delivery_id'=>null,'driver_id'=>null,'status_id'=>$status_id));
                //     DB::table('delivery')->where('branch_id',$branch_id)->where('id',$m->delivery_id)->delete();
                // }
            }
        //end:: checking driver status
         
        $order_id = null;
        $not_allowed_statuses = [8,11]; // 8="Delivered", 11="Returned to store", 9="Failed" 10="Continue to Deliver"
        $selectCols ="p.delivery_id,p.order_id,p.id AS package_id, NULL AS sender_address, p.qr_code AS barcode,p.package_name,p.sender_name,p.sender_phone,p.receiver_address,p.receiver_phone, p.delivery_type, p.zone_name,p.zone_code,(CASE p.cod WHEN 1 THEN IFNULL(p.price,0) ELSE 0 END) AS cod_amount, ( CASE LOWER(p.df_payer) WHEN 'sender' THEN 0 ELSE (IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0)) END ) AS other_fees,p.exchange_rate, p.driver_total, ROUND(IFNULL(p.driver_total,0) * IFNULL(p.exchange_rate,1),2) AS driver_total_khr,p.delivery_notes, p.status_id, IFNULL(p.outstanding,0) AS outstanding";
        $rows = DB::table('package AS p')->where('branch_id',$branch_id)->where('qr_code',$barcode)->selectRaw($selectCols)->limit(1)->get();
        foreach($rows as $row) {
              $p_status = $row->status_id;
              $order_id = $row->order_id; //order_id is not yet used becaue a delivery trip may carry many packages from many different order_id
             //Check if the package already scanned out and is "on delivery"
             if ($p_status ==6)
             {
                $result->status ='Error';
                $result->error_message="This package already scanned out and it is on delivery";
                return $result;
             }

             if (in_array($p_status,$not_allowed_statuses))
             {
                $result->status ='Error';
                $result->error_message="This package might have been delivered or returned to Store";
                return $result;
             }

            //Start:: Create Delivery Trip info, if it is not yet created
                $need_new_trip_info = false;  
                //$delivery_id is provided by javasript sclient method, while $row->delivery_id is existing delivery_id retrieved from "package.delivery_id" given by the @barcode
                if ($delivery_id >0) {
                    //Delivery_status_id >1 => then do not use it as header trip info, so create new trip info. NOTE: status => 1="Pending", 2="On the way",3 ="Done", 4="Delayed" 
                    $h_rows = DB::table('delivery AS d')->where('d.branch_id',$branch_id)->where('d.id',$delivery_id)->where('d.driver_id',$driver_id)->selectRaw('d.id,d.status_id')->limit(1)->get();
                    foreach($h_rows as $h_row){
                       $trip_status_id = $h_row->status_id;
                       if ($trip_status_id >1) 
                         $need_new_trip_info = true; 
                       else $new_delivery_id  = $delivery_id; //$h_row->id;
                    }

                    $new_delivery_id  = $delivery_id;
                } else  $need_new_trip_info = true; //this is ensure $delivery_id > 0 (making sure the following "INSERT into delivery...." executes )

                if ($need_new_trip_info) {
                    $pending_status_id =1; /** delivery status is "Pending" so that protect this Delivery trip from being used by another user who scan package at same time **/
                    DB::table('delivery')->insert(array(
                        'branch_id'=>$branch_id,
                        'warehouse_id'=>$warehouse_id,
                        //'order_id'=>$order_id, //NOTE: one delivery mak carry packages from many different order_id
                        'delivery_type'=>$delivery_type,
                        'vehicle_type'=>$vehicle_type,
                        'driver_id'=>$driver_id,
                        'depart_time'=>$depart_time,
                        'status_id'=>$pending_status_id, //1 ="Pending" waiting for user to click submit to set "Delivery Started or On Delivery"
                        'create_user'=>$ss->login_name,
                        'create_date'=>getNowTime(),
                        'update_user'=>$ss->login_name
                    ));
                    $new_delivery_id = DB::getPdo()->lastInsertId();
                }
            //end:: Create Delivery Trip info, if it is not yet created 
             DB::table('package')->where('branch_id',$branch_id)->where('qr_code',$barcode)->update(array('delivery_id'=>$new_delivery_id));
            //Update package's (delivery_id, driver_id)
            $result->status ='OK';
            $result->delivery_id = $new_delivery_id; //@delivery_id is very IMPORTANT for starting start delivery trip
            //important line to make @delivery_id valid. NOTE data.delivery_id is used to Start New Deliery trip
              $row->delivery_id = $new_delivery_id;
              $result->data = $row;
            $result->error_message=null;
          
            return $result;
        }
        $result->status='Error';
        $result->error_message ='Barcode not found!';
        $result->data = null;
        return $result;
    }

    //$d= {'delivery_id','depart_time','driver_id','delivery_type','vehicle_type'}
    function startDeliveryTrip($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $result = (object)array('status'=>'OK','error_message'=>null,'delivery_id'=>null,'fleet_tracking_number');

        $branch_id = $ss->branch_id;
        $delivery_id = isset($d->delivery_id)? sanitize($d->delivery_id):null;
        $driver_id = isset($d->driver_id)?$d->driver_id:null;
        $delivery_type =  isset($d->delivery_type)? sanitize($d->delivery_type):'Normal';
        $vehicle_type = isset($d->vehicle_type)? sanitize($d->vehicle_type):null; //default to motobike "code"
        $depart_time = isset($d->depart_time)? convertDate($d->depart_time):null;
        if(!(bool)strtotime($depart_time))  $depart_time = getNowTime();
   
        $rows = DB::table('delivery AS d')->where('branch_id',$branch_id)->where('id',$delivery_id)->limit(1)->selectraw("d.id,d.warehouse_id,d.driver_id, d.delivery_type,vehicle_type")->get();
        $d_found = false;
        foreach($rows as $row){
            if (empty($driver_id) || $driver_id <=0) $driver_id = $row->driver_id;
            $delivery_type =$row->delivery_type;
            if (!$vehicle_type) $vehicle_type = $row->vehicle_type;
            $d_found = true;
        } 

        if(!$d_found){
            $result->status ='Error';
            $result->error_message = "Delivery identitier is not valid!";
            return $result;
        }
        if ($driver_id <=0 || empty($driver_id)) {
            $result->status='Error';
            $result->error_message ='Driver or delivery person is required';
            return $result;
        }

        //count total number of packages assigned to this delivery trip give by @delivery_id
         $p_count = $this->getPackageCountByStatus($branch_id,$delivery_id,null);
         if(!is_numeric( $p_count ))  $p_count  =0;
         if ($p_count<=0) {
            $result->status ='Error';
            $result->error_message = "It seems that there are no packages assigned to this delivery";
            return $result;
         }

        if (empty($vehicle_type))  $vehicle_type = $this->getVehicleTypeByDriver($ss,$driver_id);
         if (empty($delivery_id) || $driver_id <=0) {
            $result->status ='Error';
            $result->error_message = "Delivery identifier is not valid";
            return $result;
         }

        $on_delivery_status_id =2; //For trip status 1= "Pending", 2="delivery Started or On Delivery"
        
        $trip_number = $this->getNextFleetNumber($ss);
        DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->update(array(
        'fleet_tracking_number'=>$trip_number,   
        'depart_time'=>$depart_time,
        'driver_id'=>$driver_id,
        'delivery_type'=>$delivery_type,
        'vehicle_type'=>$vehicle_type,
        'status_id'=>$on_delivery_status_id,
        'package_count'=>$p_count,
        'failed_count'=>0,
        'delivered_count'=>0,
        "update_user"=>$ss->login_name
        ,'update_date'=>getNowTime()
      ));
        
        $package_status_id =6; //For package status => 5="Arrived Warehouse", 6 = "Delivery Started ..."
        DB::table('package')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->update(array(
            'delivery_time'=>getNowTime(),
            'status_id'=>$package_status_id,
            'driver_id'=>$driver_id,
            'delivery_type'=>$delivery_type,
            'outstanding'=>1,
            "update_user"=>$ss->login_name
            ,'update_date'=>getNowTime()
        ));

        $result->status ='OK';
        $result->error_message = null;
        $result->delivery_id = $delivery_id;
        $result->fleet_tracking_number = $trip_number;
        return $result;
    } 

    //$d= {'delivery_id','failure_notes'}. This function is used to finish delivery Trip prematurely. in case there are some packages not yet delivered then system will set them as failed packages, but user must give reason for the failtures 
    function finishDeliveryTrip($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $delivery_id = isset($d->delivery_id)? sanitize($d->delivery_id):null;
        //$driver_id = $d->driver_id;
        $failure_notes =null;
        $outstanding_status =6; // package status 6 = "Delivery Started " or "On delivery" 
        $outstanding_count = $this->getPackageCountByStatus($branch_id,$delivery_id,$outstanding_status);
        if ($outstanding_count > 0) {
            $failure_notes = isset($d->failure_notes)?sanitize($d->failure_notes):null;
            if(empty($failure_notes)) {
                return $outstanding_count." packages not yet delivered. So failure notes is required to finish this delivery";
            }
            $failed_status_id =9; //refer to table "package_statuses"
            DB::table('package')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->update(array(
                'failure_notes'=>$failure_notes,
                'arrival_time'=>getNowTime(),
                'outstanding'=>1, //completed delivery => either "delivered" or "failed"
                'status_id'=>$failed_status_id
            ));
        }
         
        $trip_done_status =3;
        DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->update(array(
            'package_count'=>$this->getPackageCountByStatus($branch_id,$delivery_id,null), // All package count
            'failed_count'=>$outstanding_count,
            'delivered_count'=>$this->getPackageCountByStatus($branch_id,$delivery_id,8), //Delivered package count
            'status_id'=>$trip_done_status,
            "update_user"=>$ss->login_name,
            'update_date'=>getNowTime()
        ));
        return null;
    } 

    function removeScannedPackage($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $barcode = isset($d->barcode)?sanitize($d->barcode):null;
        $delivery_id = isset($d->delivery_id)?sanitize($d->delivery_id):null;
        $result = (object)array('status'=>'OK','error_message'=>null);
        if (empty($barcode)) {
            $result->status='Error';
            $result->error_message='Failed to remove package because the barcode not valid';
            return $result;
        } 
        $status_id =5; //Arrived at warehouse. Set package's status back to arrived at warehouse
        $outstanding =1;
        DB::table('package')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->where('qr_code',$barcode)->update(array('delivery_id'=>null,'driver_id'=>null,'status_id'=>$status_id,'outstanding'=>$outstanding));
        //$package_count = $this->getPackageCountByStatus($branch_id,$delivery_id,-1);
        // if ($package_count <= 0) {
        //   DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->delete();
        //   $result->trip_removed =1; 
        // }
        $result->status ='OK';
        return $result;
    }

    //updatePackageStatus_driver() is used by Driver mobile app to delviery package to receiver or to mark package status as failure with notes
    //param $d = {'delivery_id','barcode','status_id','failure_notes',['arrival_time']}
    function updatePackageStatus_driver($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $is_from_mobile = isset($d->is_from_mobile)?$d->is_from_mobile:0;
        $status_id = isset($d->status_id)?sanitize($d->status_id):null;
        $delivery_id = isset($d->delivery_id)? sanitize($d->delivery_id):null;
        $barcode = isset($d->barcode)? sanitize($d->barcode):null;
        if (!isset($barcode)) $barcode = isset($d->bar_code)?$d->bar_code:null;
        $failure_notes = isset($d->failure_notes)?sanitize($d->failure_notes):null;
        $arrival_time = isset($d->arrival_time)? convertDate($d->arrival_time):null;
        if(!(bool)strtotime( $arrival_time))  $arrival_time = getNowTime();

        

        //$driver_id = $d->driver_id;
        $result= (object)array('status'=>'OK','error_message'=>null);
        if (empty($status_id) || ($status_id !=8 && $status_id !=9)){
            $result->status='Error';
            $result->error_message ="Package status is not allowed";
            return $result;
        }
         //package status => 8 ="Delivered", 9 ="Failed", 10
        if ($status_id ==9){
            if (empty($failure_notes)){
                $result->status='Error';
                $result->error_message ="Failure reason is required";
                return $result;
            }
        } else if ($status_id !=8) {
            $result->status='Error';
            $result->error_message ="Only two status allowed. Failed or Delivered";
            return $result;
        }
        $outstanding =1;
        if ($status_id==8 || $status_id==11) $outstanding =0;
        DB::table('package')->where('branch_id',$branch_id)->where('qr_code',$barcode)->update(array(
            'status_id'=>$status_id,
            'arrival_time'=>$arrival_time,
            'outstanding'=>$outstanding,
            'update_user'=>$ss->login_name,
            'update_date'=>getNowTime()
        ));
        if(!$delivery_id || $delivery_id <=0) {
            $rows = DB::table('package')->where('branch_id',$branch_id)->where('qr_code',$barcode)->selectRaw('delivery_id')->limit(1)->get();
            foreach($rows as $row) $delivery_id = $row->delivery_id;
        } 
        $this->updateDeliveryTripData($ss,$delivery_id);
        $result->status='OK';
        $result->error_message =null;
        
        if ($is_from_mobile==1) {
            
            $data = (object)['branch_id'=>$branch_id,'sender_id'=>$ss->user_id,'delivery_id'=>$delivery_id,'bar_code'=>$barcode,'status_id'=>$status_id,'user_name'=>$ss->login_name];
            if ($status_id ==9)
              $data->message ="ការបញ្ជូនមិនបាន។ ".$failure_notes; 
            else if ($status_id==8) 
                $data->message ="ដឹកបានសំរេច កញ្ចប់លេខ ".$barcode;
            else $data->message ="ស្ថានភាពកញ្ចប់លេខ​ ".$barcode." ផ្លាស់ប្តូរទៅជា ".$status;
            $err = Notifier::notify_admin('package_status_changed',$data);
            if ($err) {
                $result->notification_error = $err;
                $result->event_notified =0;
            }else  $result->event_notified =1;
 
        }
        return $result;
    }
    
    //updateDeliveryTripData() is called evey time Driver delivers package to customer AS "Delivered" or "Failed"
    function updateDeliveryTripData($ss,$delivery_id){
        $branch_id = $ss->branch_id;
        DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->update(array(
            'failed_count'=>$this->getPackageCountByStatus($branch_id,$delivery_id,9),
            'delivered_count'=>$this->getPackageCountByStatus($branch_id,$delivery_id,8),
            'ctd_count'=>$this->getPackageCountByStatus($branch_id,$delivery_id,10), //CTD = "Continue to Deliver" or "Pending"
            'update_user'=>$ss->login_name,
            'update_date'=>getNowTime()
        ));

        $delivery_done_status = 3;
        $more_wheres ="IFNULL(package_count,0) <= (IFNULL(ctd_count,0) + IFNULL(failed_count,0) + IFNULL(delivered_count,0))";
        DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->whereRaw($more_wheres)->update(array(
            'status_id'=>$delivery_done_status
        ));
        return null;
    }

    function getPackageCountByStatus($branch_id,$delivery_id,$status_id=null) {
        $rows = [];
        if($status_id > 0)
          $rows = DB::table('package AS p')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->where('p.status_id',$status_id)->selectRaw("COUNT(p.id) AS cnt")->get();
        else
         $rows = DB::table('package AS p')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->selectRaw("COUNT(p.id) AS cnt")->get();
        foreach($rows as $row) return is_numeric($row->cnt)?$row->cnt:0;
        return 0; 
    }

    function getFailedPackagesCount($branch_id,$delivery_id){
       $rows = DB::table('package AS p')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->where('p.outstanding',1)->whereRaw("p.status_id <> 8")->selectRaw("COUNT(p.id) AS outstanding_count")->get();
       foreach($rows as $row) return is_numeric($row->outstanding_count)?$row->outstanding_count:0;
       return 0; 
    }

    function updateDelivery_package_count($branch_id,$delivery_id){
        $rows = DB::table('package AS p')->where('delivery_id',$delivery_id)->where('branch_id',$branch_id)->selectRaw("COUNT(p.id) AS cnt")->get();
        foreach($rows as $row){
            $cnt = $row->cnt;
           DB::table('Delivery')->where('id',$delivery_id)->where('branch_id',$branch_id)->update(array(
               'package_count'=>$cnt
           )); 
        }
    }


         //Admin user => remove package from a trip
         function removePackageFromTrip($d){
            $ss = getSessionInfo($d);
            if(!$ss) return '#350'; //user not authenticated
            if (!prn_allowed(2)) return '@'; //need permission to do this task
            $branch_id = $ss->branch_id;
            $delivery_id = isset($d->delivery_id)?$d->delivery_id:0;
            $barcode = isset($d->barcode)?$d->barcode:0;
            $result = (object)[];
            /** Begin:: Check if the package is on Delivery => cannot allow user to take out of Trip **/
                // $rows = DB::table('package AS p')->where('branch_id',$branch_id)->where('qr_code',$barcode)->selectRaw('p.status_id,p.outstanding')->limit(1)->get();
                // $current_status_id = null;
                // foreach($rows as $row) $current_status_id = $row->status_id;
                // if ($current_status_id ==6){
                //     $result->error_message = "មិនអាចយកចេញបាន ព្រោះទំនិញកំពុងតែដឹក!";
                //     $result->status ='Error';
                //     return $result;
                // }
            /** end:: Check if the package is on Delivery => cannot allow user to take out of Trip **/
            //$package_id = isset($d->package_id)?$d->package_id:0;
            DB::table('package')->where('branch_id',$branch_id)->where('qr_code',$barcode)->where('delivery_id',$delivery_id)->update(array(
                'outstanding'=>1,
                'status_id'=>5,
                'delivery_id'=>null,
                'driver_id'=>null, // important to set driverId to NULL
                'update_user'=>$ss->login_name,
                'update_date'=>getNowTime()
            ));

             //$status_id = -1; // count packages of all statuses  
             //$cnt = $this->getPackageCountByStatus($branch_id,$delivery_id,$status_id);
             $package_count = 0;
             $driver_total = 0;
             //later can use where @warehouse_id too
             $rows = DB::table('package AS p')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->selectRaw("COUNT(p.id) AS package_count, SUM(IFNULL(p.driver_total,0)) AS driver_total")->get();
             foreach($rows as $row) {
                 $package_count = $row->package_count;
                 $driver_total = $row->driver_total;
             }

             $status_on_delivery = 6;
             $trip_status = null; 
             $has_on_delivery_item = DB::table('package AS p')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->where('status_id',$status_on_delivery)->limit(1)->exists();
             if($has_on_delivery_item==true || $has_on_delivery_item > 0) 
                {
                    $trip_status = 2; //trip status ON DELIVERY
                    DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->update(array('status_id'=>$trip_status)); 
                }
              else {
                    $trip_status= 3; // Trip status DONE
                    DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->update(array('status_id'=>$trip_status)); 
              }  

                if($package_count <=0) {
                    DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->delete();
                    $result->package_count = 0;
                }

                $last_status = 'Unknown';
                if ($trip_status ==2) $last_status = 'On Delivery';
                else if ($trip_status ==3) $last_status ='Done';
                
                $result->package_count = $package_count; // package_count ( all statuses including Delivered, Failed, On Delivery)
                $result->total = $driver_total; // Total that driver has to collect from receivers of all packages 
                $result->status_id = $trip_status;
                $result->status = $last_status;
                $result->error_message = null;
                $result->status ='OK';
                return $result;
         }
        
         //addPackageToTrip() is for admin user to add package to a trip (for editing or adjustment purpose)
         //NOTe that scanpackageOut() is for scanning package into a trip preparing to Start a trip
          function addPackageToTrip($d){
            $ss = getSessionInfo($d);
            if(!$ss) return '#350'; //user not authenticated
            if (!prn_allowed(2)) return '@'; //need permission to do this task
            $branch_id = $ss->branch_id;
            $delivery_id = isset($d->delivery_id)?$d->delivery_id:0;
            $barcode = isset($d->barcode)?$d->barcode:0;
            $p_status_id = isset($d->status_id)?$d->status_id:null; //package status_id
            $notes = isset($d->notes)?$d->notes:null;
            //todo: set @notes ="Added for advanced editing purpose"
            $outstanding = null;
            $p_status_name = null;
            $rows = DB::table('package_statuses AS ps')->where('id',$p_status_id)->selectRaw('name,id, outstanding')->limit(1)->get();
            foreach($rows as $row) {
                $outstanding = $row->outstanding;
                $p_status_name = $row->name;
            }
            if (empty($p_status_name)) {
                return "Failed to add package to the trip because package status is not valid";
            }
            $rows = DB::table('package AS p')->where('branch_id',$branch_id)->where('qr_code',$barcode)->selectRaw('p.status_id,p.outstanding')->limit(1)->get();
            $current_status_id = null;
            foreach($rows as $row) $current_status_id = $row->status_id;
            $msg;
            if ($current_status_id ==8)
               $msg = "Cannot add this package because it has been already delivered to receiver";
            else if ($current_status_id ==11) 
               $msg = "Failed to add because the package already returned to merchant";
            else if ($current_status_id ==6)
               $msg = "Failed to add because the package now On Delivery";                 
            if (!empty($msg)) return $msg;

            if($this->package_in_trip($branch_id,$delivery_id,$barcode)){
                return "No need to add because the package with barcode `".$barcode."` already exists in the trip";
            }
            //todo: Check if we have to allow only  "Delivered" status when adding package to existing trip that has been Done already?

            //$package_id = isset($d->package_id)?$d->package_id:0;
            $rows = DB::table('delivery AS d')->where('branch_id',$branch_id)->where('id',$delivery_id)->selectRaw('d.driver_id,d.status_id,d.depart_time')->limit(1)->get();
            $depart_time = null;
            $driver_id = null;
            $trip_status_id = null;
            foreach($rows as $row) {
                $trip_status_id =$row->status_id;
                $driver_id = $row->driver_id;
                $depart_time = $row->depart_time; 
            }
            //todo: Check for depart_time, How long ago before allowing editing the delivery trip data
            
            if (!$driver_id || $driver_id <=0) return "Failed to add package to the trip because driver identity is missing"; 
            $input_array =[
                'outstanding'=>$outstanding,
                'status_id'=> $p_status_id,
                'delivery_id'=>$delivery_id,
                'driver_id'=>$driver_id,
                'update_user'=>$ss->login_name,
                'update_date'=>getNowTime()];
            //if package status is added as "Failed" then record failure_notes
            if ($p_status_id ==9) {
                $input_array['failure_notes'] = $notes; 
            }
            DB::table('package')->where('branch_id',$branch_id)->where('qr_code',$barcode)->update($input_array);
            return null;
         }

    //return tripInfo object {'trip_number','driver_name','diver_code','delivery_date','delivery_time','package_count','status','packages'}     
    function getTripInfo($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $delivery_id = isset($d->delivery_id)?$d->delivery_id:0;
        $rows = DB::table('delivery AS d')->join('delivery_statuses AS ds','ds.id','=','d.status_id')->where('d.branch_id',$branch_id)->where('d.id',$delivery_id)->selectRaw("d.fleet_tracking_number,DATE_FORMAT(d.depart_time,'%d %b %Y') AS depart_date,DATE_FORMAT(d.depart_time,'%r') AS depart_time,ds.name AS status, d.package_count,(SELECT name FROM driver WHERE id = d.driver_id LIMIT 1) AS driver_name")->limit(1)->get();
        foreach($rows as $row) {
            $selectCols ="'$' AS cur, DATE_FORMAT(p.create_date,'%d %b %Y') AS booking_date, p.delivery_id,p.id AS package_id,p.qr_code AS barcode, p.delivery_type, p.sender_name,p.sender_phone,p.package_name, p.product_type,p.dim_x, p.dim_y, p.dim_h, p.billed_kg, p.price, (CASE cod WHEN 1 THEN p.price ELSE 0 END) AS cod_amount, p.cod, p.cod_fee, p.base_fee,p.delivery_fee,p.receiver_name, p.receiver_phone, p.zone_code,p.zone_name, IFNULL(p.forwarding_cost,0) AS forwarding_cost,p.delivery_notes,p.failure_notes, IFNULL(p.driver_total,0) AS driver_total,IFNULL(p.sender_total,0) AS sender_total, IFNULL(p.exchange_rate,4000) AS exchange_rate,p.status_id, (SELECT ps.name FROM package_statuses AS ps WHERE ps.id =p.status_id LIMIT 1) AS status,p.delivery_notes";
            $row->packages = DB::table('package AS p')->where('p.branch_id',$branch_id)->where('p.delivery_id',$delivery_id)->selectRaw($selectCols)->orderByRaw('p.sender_id')->get();
            return $row;
        }
        return null;
    }

     //returns list of packages belong to a trip. This is used on backend system only    
     function getPackageListByTripId($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $delivery_id = isset($d->delivery_id)?$d->delivery_id:0;
        $selectCols ="DATE_FORMAT(p.create_date,'%d %b %Y') AS booking_date, p.delivery_id,p.id AS package_id,p.qr_code AS barcode, p.delivery_type, p.sender_name,p.sender_phone,p.package_name, p.product_type,p.dim_x, p.dim_y, p.dim_h, p.billed_kg, p.price, (CASE cod WHEN 1 THEN p.price ELSE 0 END) AS cod_amount, p.cod, p.cod_fee, p.base_fee,p.delivery_fee,p.receiver_name, p.receiver_phone, p.zone_code,p.zone_name, IFNULL(p.forwarding_cost,0) AS forwarding_cost,p.delivery_notes,p.failure_notes, IFNULL(p.driver_total,0) AS driver_total,IFNULL(p.sender_total,0) AS sender_total, p.exchange_rate AS exchange_rate,p.status_id, (SELECT ps.name FROM package_statuses AS ps WHERE ps.id =p.status_id LIMIT 1) AS status, DATE_FORMAT(p.arrival_time,'%d %b %Y %r') AS arrival_time,p.agent_notes";
        $rows = DB::table('package AS p')->where('p.branch_id',$branch_id)->where('p.delivery_id',$delivery_id)->selectRaw($selectCols)->orderByRaw('p.sender_id')->get();          
        return $rows;
     }
     
     //returns list of packages belong to a trip. This is used on backend system only for Printing PDF
     function getPackageListByTripId_print($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $delivery_id = isset($d->delivery_id)?$d->delivery_id:0;
        $selectCols ="DATE_FORMAT(p.create_date,'%d %b %Y') AS booking_date, p.qr_code AS barcode,p.sender_name,p.sender_phone,p.receiver_phone, p.zone_name, p.product_type,(CASE cod WHEN 1 THEN p.price ELSE 0 END) AS cod_amount, p.cod_fee, p.base_fee,p.delivery_fee,IFNULL(p.forwarding_cost,0) AS forwarding_cost,p.delivery_notes,p.failure_notes,(SELECT ps.name FROM package_statuses AS ps WHERE ps.id =p.status_id LIMIT 1) AS status,p.agent_notes";
        $rows = DB::table('package AS p')->where('p.branch_id',$branch_id)->where('p.delivery_id',$delivery_id)->selectRaw($selectCols)->orderByRaw('p.sender_id')->get();          
        return $rows;
     }

     function package_in_trip($branch_id,$delivery_id=-1,$barcode=null,$find_by='barcode'){
         if(empty($delivery_id)) $delivery_id = -1; //avoid Semantic error or problem
        if ($find_by =='barcode') 
           return DB::table('package AS p')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->where('qr_code',$barcode)->limit(1)->exists();
        else // if ($find_by =='id') 
           return DB::table('package AS p')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->where('id',$barcode)->limit(1)->exists();
     }

    //return tripInfo and packages list. This function is used by Driver mobile app to packages by trip identity 
    function getPackageListByTrip($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $delivery_id = isset($d->delivery_id)?$d->delivery_id:0;
        //$trip_code = isset($d->fleet_tracking_number)?$d->fleet_tracking_number:null;
        //$delivery_id = isset($d->id)?$d->id:0;

        //$str_driver =null;
        //if ($driver_id > 0) $str_driver = " AND d.driver_id ='".$driver_id."' ";
        
        $str_status = null; //" AND p.status_id IN (8,9,10,11)";
        $trip_header_cols = "d.id as delivery_id,d.driver_id,d.fleet_tracking_number, d.warehouse_id, (SELECT w.name FROM warehouses AS w WHERE w.branch_id =d.branch_id AND w.id = d.warehouse_id LIMIT 1) AS from_warehouse_name, d.vehicle_type,DATE_FORMAT(d.create_date,'%d %b %Y %r') AS booking_date, DATE_FORMAT(d.depart_time,'%d %b %Y') AS depart_date, DATE_FORMAT(d.depart_time,'%r') AS depart_time, (SELECT name FROM delivery_statuses AS ds WHERE ds.id = d.status_id LIMIT 1) AS trip_status, d.package_count,d.delivered_count, d.failed_count";
        $h_rows = DB::table('delivery AS d')->where('d.branch_id',$branch_id)->where('d.id',$delivery_id)->selectRaw($trip_header_cols)->limit(1)->get();
        foreach($h_rows as $h_row){
            $selectCols ="p.delivery_id,p.qr_code AS barcode,p.sender_name,p.sender_phone,p.package_name, p.product_type,p.dim_x, p.dim_y, p.dim_h, p.billed_kg, p.price,p.cod, p.cod_fee, p.base_fee,p.delivery_fee, p.zone_code,p.zone_name, IFNULL(p.forwarding_cost,0) AS forwarding_cost,p.delivery_notes,p.failure_notes, IFNULL(p.driver_total,0) AS driver_total,IFNULL(p.sender_total,0) AS sender_total, p.exchange_rate AS exchange_rate,p.status_id, (SELECT ps.name FROM package_statuses AS ps WHERE ps.id =p.status_id LIMIT 1) AS status, DATE_FORMAT(p.arrival_time,'%d %b %Y %r') AS arrival_time,p.agent_notes";
            $h_row->packages = DB::table('package AS p')->where('p.branch_id',$branch_id)->where('p.delivery_id',$h_row->delivery_id)->selectRaw($selectCols)->orderByRaw('p.sender_id')->get();          
            return $h_row;
        } 
        return null;
    }

    //deleteNewTrip() is to delete Newly Created Trip without deleting related packages.
    //deleteDeliveryTrip() is to permmantently delete whole trip info including all related packages
    //deleteNewTrip() is to clean out the trip info or delivery rrecord when driver or user quit scanning of packages by pressing Close or Cancel button on the "New Delivery Trip" dialog 
    function deleteNewTrip($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $delivery_id = isset($d->delivery_id)?$d->delivery_id:0;
       
        $status_id =5; //Arrived at warehouse. Set package's status back to arrived at warehouse
        DB::table('package')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->update(array('delivery_id'=>null,'driver_id'=>null,'status_id'=>$status_id,'Outstanding'=>1));
        DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->delete();
        return null;
    }

    //deleteNewTrip() is to delete Newly Created Trip without delting related packages.
    //deleteDeliveryTrip() is to permmantently delete whole trip info including all related packages
    function deleteDeliveryTrip($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $delivery_id = isset($d->delivery_id)?$d->delivery_id:0;
        $trip_status_id = null;
        $test_count = 0;  
        $rows = DB::table('package AS p')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->selectRaw('p.id')->limit(1)->get();
        foreach($rows as $row) $test_count = 1;
        if ($test_count > 0) {
            //$rows = DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->selectRaw('status_id')->limit(1)->get(); 
            //foreach($rows as $row) $trip_status_id = $row->status_id;
            //if ($trip_status_id ==2) {
                return "មិនអាចលុបជើងដឹកមាបទេ។​ អ្នកអាចដកទំនិញចេញពីជើងដឹកមួយនេះសិនទើបលុបបាន";
            //}
        }
        DB::table('package')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->update(array('delivery_id'=>null,'status_id'=>5,'outstanding'=>1));
        DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->delete();
        return null;
    }

    function changeDeliveryDriver($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $delivery_id = isset($d->delivery_id)?$d->delivery_id:null;
        $driver_id = isset($d->driver_id)?$d->driver_id:null;
        DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->update(array(
            'driver_id'=>$driver_id,
            'update_user'=>$ss->login_name,
            'update_date'=>getNowTime()
        ));
        DB::table('package')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->update(array(
            'driver_id'=>$driver_id,
            'update_user'=>$ss->login_name,
            'update_date'=>getNowTime()
        ));
        //todo: create notofication and send it to the responsible driver

    }

    //count number of packges by a given trip id (e.g: @delivery_id). parameter @status_id is optional. If @status_id is not given then this function returns all package belonging to a given trip  
    function countPackagesByTrip($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $delivery_id = isset($d->delivery_id)?$d->delivery_id:0;
        $status_id = isset($d->status_id)?sanitize($d->status_id):null;
        $cnt = $this->getPackageCountByStatus($branch_id,$delivery_id,$status_id);
        return is_numeric($cnt)?$cnt:0;
    }

    function getForm_options_trip_list($data) {
        $ss = getSessionInfo($data);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task      

         $branch_id = $ss->branch_id;
          $data = (object)[];

          $deliveryTypes[] = (object)array('name'=>'Normal');
          $deliveryTypes[] = (object)array('name'=>'Fast');

          $data->deliveryTypes =$deliveryTypes; 
          $data->warehouses  = DB::table('warehouses')->selectRaw('id, name AS warehouse_name')->where('branch_id',$branch_id)->orderByRaw('name ASC')->get();
          $data->drivers  = DB::table('driver')->selectRaw('id, name AS driver_name')->where('branch_id',$branch_id)->orderByRaw('name ASC')->get();
          //$data->zones  = DB::table('zones')->selectRaw('zone_code,zone_name')->where('branch_id',$branch_id)->get();
          $data->statuses = DB::table('delivery_statuses AS ds')->selectRaw('ds.id,s.name AS status_name')->orderByRaw('s.display_order ASC')->get();
          return ($data);
      }

   
}
