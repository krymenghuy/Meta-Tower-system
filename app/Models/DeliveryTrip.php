<?php

namespace App\Models;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use App\Models\Notifier;
use App\Models\Driver;
use App\Models\DV;
use App\Models\UM;
use Sanitizer;
use DB;
use App\Models\Tracker;

class DeliveryTrip //extends Model
{
    //use HasFactory;
      protected $id = null;
      protected $userInfo = null;
      function __construct($id=null,$userInfo=null){
        $this->userInfo =$userInfo;
        $this->id=$id;
      }

      function getId(){
        return $this->id;
      }
      function getUserInfo(){
        return $this->userInfo;
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
  
    //@cols can be string or array
    function getPackageProps($branch_id = null, $id = null, $cols = null, $by_col = 'id') {
        if (!$id) return null;
    
        // $defaultFields = [
        //     'p.id',
        //     'p.qr_code AS bar_code',
        //     's.`id` AS sender_id',
        //     'p.driver_id',
        //     'driver_total',
        //     'p.delivery_type',
        //     's.name AS sender_name',
        //     'p.receiver_address',
        //     '(SELECT name FROM driver WHERE id = p.driver_id LIMIT 1) AS driver_name',
        //     'p.status_id',
        //     'ps.name AS status',
        //     'p.outstanding'
        // ];
     
        // if (!$cols) {
        //     $cols = $defaultFields;
        // } else {
            foreach ($cols as &$col) {
                switch (trim(strtolower($col ?? ''))) {
                    case 'status':
                        $col = 'ps.name AS \'status\'';
                        break;
                    case 'sender_name':
                        $col = 's.name AS sender_name';
                        break;
                    case 'cod':
                        $col = 'p.cod';
                        break;
                    case 'cod_fee':
                        $col = 'p.cod_fee';
                        break;
                    case 'sender_phone':
                        $col = 's.phone_number AS sender_phone';
                        break;
                }
            }
        //}
    
        $fields = implode(',', $cols);
    
        $whereClause = $by_col === 'id' ? 'p.id = ' . ($id?$id:0) : 'p.qr_code = \'' . $id . '\'';
        $moreWhereClause = $branch_id > 0 ? 'p.branch_id = ' . $branch_id : '1=1';
    
        return DB::table('package AS p')
            ->whereRaw($moreWhereClause)
            ->whereRaw($whereClause)
            ->join('package_statuses AS ps', 'ps.id', '=', 'p.status_id')
            ->join('sender AS s', 's.id', '=', 'p.sender_id')
            ->selectRaw($fields)
            ->take(1)
            ->first();
    }
     
     //Various form options data combo items on Package Trail View or "Delivery Trip" view
     function getForm_options_delivery_trip($ss) {
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
          $data->statuses = DB::table('delivery_statuses AS ds')->selectRaw('ds.id AS status_id,ds.name AS status_name')->where('used',1)->orderByRaw('ds.display_order ASC')->get();
          return $data;
      }

    function createDeliveryTrip($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task
        $branch_id = $ss->branch_id;
        $depart_date = isset($d->depart_date)?convertDate($d->depart_date):getNowTime();
        //$delivery_type = isset($d->delivery_type)?$d->delivery_type:null;
        $driver_id = isset($d->driver_id)?Sanitizer::sanitize($d->driver_id):null;
        
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

    function getList($arr =[], $ss=null){
        $ss =$ss?$ss:$this->getUserInfo();
        return self::list($arr,$ss);
    } 

    //getDeliveryTrips()
    static function list($arr=[],$ss=null){
        //$ss =$ss?$ss:$this->getUserInfo();
        $branch_id = $ss->branch_id;
        $d = (object)$arr; 
        $warehouse_id = isset($d->warehouse_id)?Sanitizer::sanitize($d->warehouse_id):0; 
        $driver_id = isset($d->driver_id)?Sanitizer::sanitize($d->driver_id):null;
        $start_date = isset($d->start_date)?$d->start_date:null;
        $end_date = isset($d->end_date)?$d->end_date:null;

        //$zone_code =isset($d->zone_code)? Sanitizer::sanitize($d->zone_code):null;
        $search_value =isset($d->search_value)? Sanitizer::sanitize($d->search_value):null;
        $status_id =isset($d->status_id)? Sanitizer::sanitize($d->status_id):null; //must be NULL if value not given
        if ($status_id ===null) $status_id =-1; //because $status_id = 0 it means 'Canceled'
        //$delivery_type = isset($d->delivery_type)?Sanitizer::sanitize($d->delivery_type):null;
 
        $str_warehouse = ' h.id ='.($warehouse_id?$warehouse_id:0);
        $str_status ='';
        $str_date = null;
        $str_driver = null;
        //$str_zone =null;
        //$str_delivery_type =null;

        if (!$search_value) {
            $str_date =null;
            if (!$start_date && !$end_date){
                $str_date =null;
            }else{
                 if((bool)strtotime($start_date)) $end_date = $start_date;
                 else if((bool)strtotime($end_date)) $start_date = $end_date;
                 $str_date = ' AND (DATE(d.depart_time) >=\''.convertDate($start_date).'\' AND DATE(d.depart_time) <=\''.convertDate($end_date).'\')';
            } 
            //$str_warehouse =' h.id ='.($warehouse_id?$warehouse_id:0);
            if ($driver_id > 0) $str_driver = ' AND d.driver_id ='.$driver_id;
            //if (!empty($zone_code)) $str_zone =" AND d.zone_code ='".$zone_code."' ";
            //On Trip List page, if user does not select any status => show ONLY "On Delivery" trips
            if ($status_id == -1 || !$status_id) $str_status ='';     
            else if($status_id > 0) $str_status =' AND d.status_id ='.$status_id;
            
            if (!$str_date) $str_status =' AND d.status_id =2';
            $more_wheres = $str_warehouse.$str_date.$str_status.$str_driver;
        }else{
            $search_value = escape_like_str($search_value);
            $more_wheres ="(d.fleet_tracking_number ='$search_value' OR d.driver_id IN (select id FROM driver WHERE branch_id =$branch_id AND name LIKE '%$search_value%') OR d.id IN (SELECT l.delivery_id FROM package AS l WHERE l.branch_id =$branch_id AND l.qr_code ='$search_value' or l.receiver_phone ='$search_value' OR l.sender_phone='$search_value' OR l.sender_name LIKE '%$search_value%'))";
        }
        $selectCols ='d.id, d.driver_id, d.fleet_tracking_number, formatDate(d.depart_time) AS depart_date, DATE_FORMAT(d.depart_time,\'%r\')  AS depart_time, d.package_count, d.delivered_count,d.failed_count,d.status_id, ds.name AS status, dr.`name` AS driver_name,dr.phone_number AS driver_phone_number,(SELECT SUM(IFNULL(p.driver_total,0)) FROM package AS p WHERE p.branch_id = d.branch_id AND p.delivery_id = d.id) AS driver_total';
        return DB::table('delivery AS d')->join('driver as dr','dr.id','d.driver_id')->join('delivery_statuses AS ds','ds.id','=','d.status_id')->join('warehouses AS h','h.id','=','d.warehouse_id')->where('d.branch_id',$branch_id)->whereRaw($more_wheres)->selectRaw($selectCols)->orderByRaw('d.status_id,d.create_date DESC')->get(); 
    }

    function getDeliveryTrips_print($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task
        $branch_id = $ss->branch_id;
 
        $warehouse_id = isset($d->warehouse_id)?Sanitizer::sanitize($d->warehouse_id):null; 
        $driver_id = isset($d->driver_id)?Sanitizer::sanitize($d->driver_id):null;
        //$zone_code =isset($d->zone_code)? Sanitizer::sanitize($d->zone_code):null;
        $search_value =isset($d->search_value)? Sanitizer::sanitize($d->search_value):null;
        $status_id =isset($d->status_id)? Sanitizer::sanitize($d->status_id):null; // must be null if value not given here
        if (empty($status_id)) $status_id =-1; //status_id = 0 => 'Canceled'
        $delivery_type = isset($d->delivery_type)?Sanitizer::sanitize($d->delivery_type):null;
        
        $start_date = isset($d->start_date)?$d->start_date:null;
        $end_date = isset($d->end_date)?$d->end_date:null;
         
        $str_warehouse = null;
        $str_status =null;
        $str_date = null;
        $str_driver = null;

        if (empty($search_value)) {
            if (!(bool)strtotime($start_date)) $start_date = date('Y-m-d'); else $start_date = convertDate($start_date);
            if (!(bool)strtotime($end_date)) $end_date = date('Y-m-d'); else $end_date = convertDate($end_date);
            $str_date = " AND (DATE(d.depart_time) >='$start_date' AND DATE(d.depart_time) <='$end_date')";

            $str_warehouse =" AND h.id ='".$warehouse_id."' ";
            if ($driver_id > 0) $str_driver = " AND d.driver_id ='".$driver_id."' ";
            //if (!empty($zone_code)) $str_zone =" AND d.zone_code ='".$zone_code."' ";
            //On Trip List page, if user does not select any status => show ONLY "On Delivery" trips
            if (empty($status_id)) 
                $str_status =" AND d.status_id =2";
            else if ($status_id == -1) $str_status =null;     
            else $str_status =" AND d.status_id ='".$status_id."' ";

            //if (!empty($delivery_type)) $str_delivery_type =" AND d.delivery_type ='".$delivery_type."' ";
            $more_wheres = "1=1".$str_date.$str_warehouse.$str_status.$str_driver;
        }else{
            $search_value = escape_like_str($search_value);
            $more_wheres ="(d.fleet_tracking_number ='$search_value' OR d.driver_id IN (select id FROM driver WHERE branch_id =$branch_id AND name LIKE '%$search_value%') OR d.id IN (SELECT l.delivery_id FROM package AS l WHERE l.branch_id ='$branch_id' AND l.qr_code ='$search_value' or l.receiver_phone ='$search_value' OR l.sender_phone='$search_value' OR l.sender_name LIKE '%$search_value%'))";
        }
        $selectCols ="d.id, d.driver_id, d.fleet_tracking_number,d.delivery_type, DATE_FORMAT(d.depart_time,'%d %b %Y') AS depart_date, encode_time(DATE_FORMAT(d.depart_time,'%r')) AS depart_time, d.package_count, d.delivered_count,d.failed_count, ds.name AS status, dr.name AS driver_name, d.vehicle_type".
        ",(SELECT SUM(IFNULL(base_fee,0)) FROM package WHERE branch_id ='".$branch_id."' AND delivery_id = d.id) AS total_base_fee ".
        ",(SELECT SUM(IFNULL(delivery_fee,0)) FROM package WHERE branch_id ='".$branch_id."' AND delivery_id = d.id) AS total_delivery_fee ".
        ",(SELECT SUM(CASE cod WHEN 1 THEN price ELSE 0 END) AS total FROM package WHERE branch_id ='".$branch_id."' AND delivery_id = d.id) AS total_cod_amount ".
        ",(SELECT SUM(IFNULL(cod_fee,0)) AS total FROM package WHERE branch_id ='".$branch_id."' AND delivery_id = d.id) AS total_cod_fee ".
        ",(SELECT SUM(IFNULL(driver_total,0)) FROM package AS p WHERE branch_id = d.branch_id AND p.delivery_id = d.id) AS driver_total, 'Unsettled' AS pmt_status";
        $rows = DB::table('delivery AS d')->join('delivery_statuses AS ds','ds.id','=','d.status_id')->join('warehouses AS h','h.id','=','d.warehouse_id')->join('driver as dr','dr.id','=','d.driver_id')->where('d.branch_id',$branch_id)->whereRaw($more_wheres)->selectRaw($selectCols)->get(); 
        foreach($rows as $h_row){
            $selectCols ="p.delivery_id,p.id AS package_id,p.qr_code AS barcode,p.sender_name,p.sender_phone,p.package_name, p.product_type,p.dim_x, p.dim_y, p.dim_h, p.billed_kg, p.price, (CASE cod WHEN 1 THEN p.price ELSE 0 END) AS cod_amount, p.cod, p.cod_fee, p.base_fee,p.delivery_fee,p.receiver_name, p.receiver_phone,p.zone_code,p.zone_name, IFNULL(p.forwarding_cost,0) AS forwarding_cost,p.delivery_notes,p.failure_notes, IFNULL(p.driver_total,0) AS driver_total,IFNULL(p.sender_total,0) AS sender_total, p.exchange_rate AS exchange_rate,p.status_id, (SELECT ps.name FROM package_statuses AS ps WHERE ps.id =p.status_id LIMIT 1) AS status, DATE_FORMAT(p.arrival_time,'%d %b %Y %r') AS arrival_time,p.delivery_notes,p.failure_notes";
            $h_row->packages = DB::table('package AS p')->where('branch_id',$branch_id)->where('delivery_id',$h_row->id)->selectRaw($selectCols)->get();
        }
        return $rows;
    }


    //This function is NOT yet used
    function getPackageInfoByBarcode($d) {
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task
        $branch_id = $ss->branch_id;
        $barcode = isset($d->barcode)?Sanitizer::sanitize($d->barcode):null;
        $selectCols ="p.id AS package_id, NULL AS sender_address, p.qr_code AS barcode,p.package_name,p.sender_name,p.sender_phone,p.receiver_phone, p.zone_name,p.zone_code,0 AS cod_amount,0 AS other_fees, p.driver_total,p.delivery_notes, p.status_id";
        $rows = DB::table('package AS p')->where('branch_id',$branch_id)->where('qr_code',$barcode)->selectRaw($selectCols)->take(1)->get();
        foreach($rows as $row) return $row;
        return null; 
    }

   //This function not yet used
    function cleanEmptyTrip($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task
        $branch_id = Sanitizer::sanitize($ss->branch_id);
        $delivery_id = isset($d->delivery_id)?Sanitizer::sanitize($d->delivery_id):null;
        $rows = DB::table('delivery AS d')->join('package AS p','p.delivery_id','d.id')->where('d.branch_id',$branch_id)->where('d.id',$delivery_id)->select('d.id')->take(1)->get();
        if (count($rows)<=0) DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->delete();
        return null;
    }

    //getDriverStatusInfo() returns trip object as "{status_id and delivery_id}" for the given @driver_id ONLY WHEN the trip is "Pending" or being scanned out, OR trip is "On Delivery" => showing that the driver is occuied 
    //if @delivery_id is given here => then getDriverStatusInfo() will check if the @driver is occuplied by another trip different from the given @delivery_id, otherwise 
    //otherwise => getDriverStatusInfo() check if driver is busy with any trip currently
    function getDriverStatusInfo($uss,$driver_id,$delivery_id=null){
        $branch_id = $uss->branch_id;
        $str_delivery_id = null;
        if($delivery_id > 0)  $str_delivery_id =" AND d.id <> $delivery_id";
        //the following query 1 record from table "delivery" where driver's status is either (1 = "Pending" or 2 ="On Delivery")
        $rows = DB::table('delivery AS d')->where('d.branch_id',$branch_id)->where('d.driver_id',$driver_id)->whereRaw("d.status_id IN (1,2) $str_delivery_id")->selectRaw("d.id AS delivery_id,d.status_id")->take(1)->get();
        foreach($rows as $row) return $row;
        return null;
    }
    
    function getVehicleTypeByDriver($uss,$driver_id){
        $def_vehicle_type ='motobike'; //refers to table "vehicle_types"
        $branch_id = null;
        $branch_id = $uss->branch_id;
        $rows = DB::table('driver AS d')->where('d.branch_id',$branch_id)->where('d.id',$driver_id)->selectRaw('d.vehicle_type')->take(1)->get();
        foreach($rows as $row) return $row->vehicle_type;
        return  $def_vehicle_type;
    }
 
    function getTripProps($branch_id,$id,$fields ="d.id,d.driver_id"){
        $rows = DB::table('delivery AS d')->where('d.branch_id',$branch_id)->where('d.id',$id)->selectRaw($fields)->take(1)->get();
        foreach($rows as $row) return $row;
        return null;
    }

    function getDriverInfo($driver_id){
        $rows = DB::table('driver AS d')->where('id',$driver_id)->select("d.id","d.name","d.phone_number", "d.vehicle_type")->take(1)->get();
        return isset($rows[0])?$rows[0]:null;
    }

    //Driver App. Driver scan package to update status to Delviered, or to set On Delivery
    //$d={driver_id,barcode}
    function scanPackageOut_driver($ss,$arr){
         //need permission to do this task
        $d = (object)$arr; 
        $branch_id = $ss->branch_id;
        $barcode =  isset($d->barcode)?Sanitizer::sanitize($d->barcode):null;
        $notes = isset($d->notes)?$d->notes:null;
        $d->is_from_mobile =1;
        //$ss->official_id is the driver_id, Assuming driver loged in
        //$d->driver_id = $ss->official_id;
        if(!$barcode) return DV::error("Barcode is not valid");
        $new_driver = $this->getDriverInfo($d->driver_id);
        if(!$new_driver) return DV::error('Driver identity is not valid');

        //begin:: get package's details
            $package = null;
            $cols = "p.id,p.branch_id,p.warehouse_id,p.delivery_id,p.qr_code AS barcode,p.receiver_phone,sender_id,driver_id,p.status_id,p.failed_num";
            $package = DB::table('package AS p')->join('package_statuses AS ps','ps.id','=','p.status_id')->join('sender as s','s.id','=','p.sender_id')->where('p.branch_id',$branch_id)->where('p.qr_code',$barcode)->selectRaw($cols)->take(1)->get()->first();
            if(!$package) return DV::error('Package information is not found. It seems the provided barcode is not correct');
        //end:: get package details
         if($package->status_id ==11){
            return DV::error('កញ្ចប់ទំនិញនេះបានបញ្ជូនត្រឡប់រួចហើយ!');
         }  
         else if($package->status_id == 8){
            return DV::error('កញ្ចប់ទំនិញនេះបានដឹករួចហើយ!');
         }  
         else if($package->status_id ==6) {
             //In case the same Driver => delvier item
             if($package->driver_id == $d->driver_id){
                $d->status_id =8;
                $d->delivery_id = $package->delivery_id;
                /** params for updatePackageStatus_driver() => {delivery_id,barcode,status_id} where @delivery_id is optional param **/
                $res = $this->updatePackageStatus_driver(['driver_id'=>$d->driver_id,'barcode'=>$d->barcode,'status_id'=>8,'notes'=>$notes],$ss);
                if($res->status ==='Error') return DV::error($res->error_message);
                else return DV::success(['on_delivery_count'=>$res->on_delivery_count,'action'=>'deliver','package'=>$this->getPackageDetails($branch_id,$d)]); 
             }else{
                //In case of different Driver scan the same item's barcode => Drivers exchange items on the middle of delivery
                //$new_driver = (object)['name'=>$new_driver_name,'id'=>$d->driver_id];
                $old_driver = (object)['name'=>null,'id'=>$package->driver_id];
                //$res = $this->requestDriverChange($package,$old_driver,$new_driver);
                $res = $this->switchDriver($ss,$package,$old_driver,$new_driver);
                if($res->status ==='Error') return DV::error($res->error_message);
                else return DV::success(['action'=>'request_driver_change','package'=>$this->getPackageDetails($branch_id,$d)]);
             }
            
         }else{
            $m = new \App\Models\BDelivery(null,$ss);
            //make esure the $ss->user_class is a driver to avoid permission check
            $res = $m->b_assignDeliveryDriver($d,$ss);
            if($res->status ==='Error') return DV::error($res->error_message);
            else return DV::success(['package'=>$this->getPackageDetails($branch_id,$d)]);
         }  
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
           return (object)['trip'=>(object)['delivery_id'=>null],'status'=>'Error','error_message'=>'អ្នកដឹកម្នាក់នេះមានជើងដឹកច្រើនមិនទាន់បានបញ្ចប់។​ ដូច្នេះមិនអាចទទួលកញ្ចប់ថ្មីបានទេ','trip'=>null]; 
           \Log::info('Data error: BDelivery::getActiveDeliveryId():61 => Driver '.$driver_id.' has more than one historical trips that are still "on delivery", causing the new package assignment failed by '.$ss->full_name.' at '.getNowTime());
        }else if(isset($rows[0])){
           //\Log::info('use last one trip'); 
           return (object)['trip'=>$rows[0],'status'=>'OK']; 
        } 
        
        $vehicle_type = $this->getVehicleTypeByDriver($ss,$driver_id); 
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
      //\Log::info('new trip id ' . $new_id); 
      $trip = (object)['delivery_id'=>$new_id,'warehouse_id'=>$warehouse_id,'depart_time'=>$depart_time,'fleet_tracking_number'=>$trip_number,'package_count'=>1];
      return (object)['trip'=>$trip,'status'=>'OK'];
    }

    function requestDriverChange($package,$old_driver,$new_driver){
        //get request details,
            $rows = DB::table('request_driver_change AS r')->where('r.barcode',$package->barcode)->where('r.new_driver_id',$new_driver->id)->selectRaw("r.id,LOWER(r.status) AS status")->take(1)->get();
            $req=null;
            foreach($rows as $row) $req = $row;
            if($req){
                if ($req->status == 'approved')
                   return DV::error('This request already approved');
                else if ($req->status == 'pending')
                   return DV::error('សំណើរនេះកំពុងរង់ចាំការអនុញ្ញាត');
                else
                   DB::table('request_driver_change AS r')->where('new_driver_id',$new_driver->id)->where('barcode',$barcode)->delete();       
            }

        $des = "សំណ់ើរសំុដូរអ្នកដឹក ទំនិញលេខ $package->receiver_phone អោយទៅឈ្មោះ $new_driver->name";
        $inputs = array(
            'branch_id'=>$package->branch_id,
            'new_driver_id'=>$new_driver->id,
            'old_driver_id'=>$old_driver->id,
            'barcode'=>$package->barcode,
            'description'=>$des,
            'title'=>'Driver Change Request',
            'status'=>'Pending',
            'create_date'=>getNowTime());

        DB::table('request_driver_change')->insert($inputs);
        
        //begin:: Notify Admin about new Incoming request
            
            $event_data = (object)($inputs);
            $event_data->branch_id = $branch_id;
            $event_data->title ="Request";
            $event_data->message ="មានសំណើរប្តូរទំនិញរវាងអ្នកដឹក";
            $event_data->persist =0;
            $event_data->request_type="request_driver_change";
            //todo: change event_name to "driver_changed"
            $err = Notifier::notify_admin('pending_request_created',$event_data);  
        //end:: Notify Admin about new Incoming request
        return DV::success();
    }
 
    function getRequestInfo($branch_id,$id){
       $rows = DB::table('request_driver_change AS r')->where('branch_id',$branch_id)->where('id',$id)->selectRaw("r.id,r.create_date,r.description,r.title,r.new_driver_id,r.old_driver_id,r.completed,r.status")->take(1)->get();
       foreach($rows as $row) return $row;
       return null;
    }
 
    //$action_by_admin = true (Admin is switching driver for the package, not drivers themselves)
    function switchDriver($ss,$package,$old_driver,$new_driver, $action_by_admin = false){
        $branch_id = isset($package->branch_id)?$package->branch_id:null;
        if (!$branch_id) $branch_id  = $ss->branch_id;
        $m = $this->getActiveDeliveryId($ss,$package->warehouse_id,$new_driver->id);
        if(!$m) return DV::error('Failed to switch driver because Active Trip ID was not found!'); 
        if ($m->status =='Error') return DV::error($m->error_message);
        $x = DB::table('package')->where('qr_code',$package->barcode)->update(array(
           'driver_id'=>$new_driver->id,
           'delivery_id'=>$m->trip->delivery_id,
           'status_id'=>6,
           'outstanding'=>1
         ));

         //Update the new trip info (i.e: the trip that we add the package to). Update information such as Package_count, status, etc
         $tripInfo = $this->updateDeliveryTripData($m->trip->delivery_id,$ss);
          
         //begin:: update previous trip info. Delete the trip if there are no more package
            $prev_trip_deleted = 0;
            $oldTrip = $this->countPackageByStatus($branch_id,$package->delivery_id);
            if ($oldTrip->package_count ==0){
                $prev_trip_deleted =1;
                DB::table('delivery')->where('branch_id',$branch_id)->where('id',$package->delivery_id)->delete();
            } else {
                DB::table('delivery')->where('branch_id',$branch_id)->where('id',$package->delivery_id)->update([
                    'package_count'=>$oldTrip->package_count,
                    'delivered_count'=>$oldTrip->delivered,
                    'failed_count'=>$oldTrip->failed,
                    'status_id'=> ($oldTrip->on_delivery > 0)? 2:3
                ]);
            }  
        //end:: update previous trip info. Delete the trip if there are no more package

        if (empty($package->barcode)) return DV::error('Failed to switch driver because the provided barcode is unexpectedly empty!');
       //Notify Admin about driver exchanging items on the road
            $event_data = (object)['branch_id'=>$branch_id,'delivery_id'=>$m->trip->delivery_id,'barcode'=>$package->barcode,'status_id'=>$package->status_id,'package_id'=>$package->id,'driver_id'=>$new_driver->id,'driver_name'=>$new_driver->name];
            $event_data->title ="Driver Changed";
            $event_data->message ='ទំនិញ '.$package->receiver_phone.' បានប្រគល់អោយអ្នកដឹកថ្មី '.$new_driver->name;

            $des = 'កញ្ចប់ '.$package->barcode.'​ដែលមានលេខភ្ញៀវ '.$package->receiver_phone.' បានប្រគល់អោយអ្នកដឹកថ្មី '.$new_driver->name;
            Tracker::log((object)['user_class'=>'driver','package_id'=>$package->id,'action_name'=>'change_driver','description'=>$des,'user_comment'=>''],$ss); 
 
            $err = Notifier::notify_admin('package_status_changed',$event_data);
       
     //Notify to Merchant and Driver
      /** begin:: get package's details for sending back as object with Notification to mobile and Admin**/ 
            //$d = (object)['branch_id'=>$branch_id,'barcode'=>$package->barcode];
            //todo: check this function "$this->getPackageDetails($d)" for error undefined "$p->receiver_phone"
            //$p = $this->getPackageDetails($d);
            $p = null;
            $rows = DB::table('package as p')->where('qr_code',$package->barcode)->selectRaw("p.id,p.qr_code as barcode, p.receiver_address,p.receiver_phone, p.driver_id,p.sender_id")->take(1)->get();
            foreach($rows as $row) $p = $row;
            if (!$p) return DV::success(['notification_error'=>'Failed to identity package information']);
     /**end::get package's details for sending back as object with Notification to mobile and Admin**/ 

        $cdata = [
            [
                'user_class'=>'driver',
                'target_user_id'=>$new_driver->id,
                'persist'=>1,
                'data'=>$p,
                'title'=>'Delivery',
                'message'=>"ទំនិញលេខ $p->receiver_phone ប្តូរអ្នកដឹកទៅ $new_driver->name" 
            ],
            [
                'user_class'=>'driver',
                'target_user_id'=>$old_driver->id,
                'persist'=>1,
                'data'=>$p,
                'title'=>'Delivery',
                'message'=>"ទំនិញលេខ $p->receiver_phone ត្រូវប្រគល់អោយអ្នកដឹកថ្មី $new_driver->name" 
            ],
            [
                'user_class'=>'merchant',
                'target_user_id'=>$p->sender_id,
                'persist'=>1,
                'data'=>$p,
                'title'=>'Delivery',
                'message'=>"អ្នកដឹកថ្មី $new_driver->name យកទំនិញលេខ $p->receiver_phone" 
            ]
        ];
        Notifier::notify_mobile($branch_id,$cdata);
       
        // the prop "prev_trip_deleted" is to signal if the previous trip has only one package, which has been moved out, so the trip was deleted
       return DV::success(['prev_trip_deleted'=>$prev_trip_deleted,'trip_total'=>$tripInfo->trip_total,'package_count'=>$tripInfo->package_count
         ,'prev_trip_package_count'=>$oldTrip->package_count,
         'prev_trip_status_id'=>$oldTrip->on_delivery > 0? 2:3,
         'status_id'=>$tripInfo->status_id, 
         //'status'=>=>$oldTrip->on_delivery >0? 'On Delivery':'Done', /** property "status" cannot be used for trip's status because api return prop "status" as "OK" or "Error" => causing silent confusion **/
         'trip_status'=>$oldTrip->on_delivery >0? 'On Delivery':'Done', /** status is required for font end page to refresh trip Header Info (Package count, Total Amount) **/
         'prev_trip_total'=>$oldTrip->total
       ]);
    }

    //Approve Driver Change items
    function approveDriverChange($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task
        $branch_id = $ss->branch_id;
        //$package, $old_driver_id,$new_driver_id
        $id = $d->id;
        
        //get request details
            $request = null;
            $rows = DB::table('request_driver_change AS r')->join('package AS p','p.qr_code','=','r.barcode')->where('r.branch_id',$branch_id)->where('r.id',$id)->selectRaw("r.id,r.completed,LOWER(r.status) AS status,r.auth_user,p.branch_id,p.delivery_id, p.warehouse_id,p.receiver_phone,r.new_driver_id,r.old_driver_id,r.barcode")->take(1)->get();
            foreach($rows as $row) $request = $row;
            if(!$request) return DV::error('request details not found!');
            if(strtolower($request->status) =='approved') return DV::error('This request already approved!');
            else if(strtolower($request->status) =='rejected') return DV::error('This request already rejected!');
 
        $m = $this->getActiveDeliveryId($ss,$request->warehouse_id,$request->new_driver_id);
        if(!$m) return DV::error('Failed to switch driver'); 
        if($m->status =='Error') return DV::error($m->error_message);

        DB::table('package')->where('qr_code',$request->barcode)->update(array(
           'driver_id'=>$request->new_driver_id,
           'delivery_id'=>$m->trip->delivery_id
           //'status_id'=>8
       ));
       
        DB::table('request_driver_change')->where('id',$id)->update(array( 
          'status'=>'Approved',
          'completed'=>1,
          'auth_user'=>$ss->login_name,
          'auth_date'=>getNowTime()
        ));

        //begin:: get new drivers name
           $new_driver = $this->getDriverInfo($request->new_driver_id);
         //end:: get new driver name

       //Notify Admin about driver exchanging items on the road
            $event_data = (object)['branch_id'=>$branch_id,'delivery_id'=>$request->delivery_id,'bar_code'=>$request->barcode,'driver_id'=>$new_driver->id,'driver_name'=>$new_driver->name,'request_id'=>$request->id,'request_status'=>$request->status,'request_completed'=>$request->completed];
            $event_data->title ="Request Approved";
            $event_data->message ="ទំនិញ $request->receiver_phone បានប្រគល់អោយអ្នកដឹកថ្មី $new_driver->name";
            $event_data->request_type="request_driver_change";
            //$event_data->persist = 0;
            //todo: change event_name to "driver_changed"
            $err = Notifier::notify_admin('request_status_changed',$event_data);
       //Notify to Merchant and Driver

       $d->barcode = $request->barcode;
       $p = $this->getPackageDetails($branch_id,$d);
        $cdata = [
            [
                'user_class'=>'driver',
                'target_user_id'=>$request->new_driver_id,
                'persist'=>1,
                'data'=>$p,
                'title'=>'Delivery',
                'message'=>"សំណើរដឹកទំនិញលេខ $p->receiver_phone បានទទួលការអនុញាត!" 
            ],
            [
                'user_class'=>'driver',
                'target_user_id'=>$request->old_driver_id,
                'persist'=>1,
                'data'=>$p,
                'title'=>'Delivery',
                'message'=>"ទំនិញលេខ $p->receiver_phone ត្រូវប្រគល់អោយអ្នកដឹកថ្មី $new_driver->name" 
            ],
            [
                'user_class'=>'merchant',
                'target_user_id'=>$p->sender_id,
                'persist'=>1,
                'data'=>$p,
                'title'=>'Delivery',
                'message'=>"អ្នកដឹកថ្មី $new_driver->name ដឹកទំនិញលេខ $p->receiver_phone" 
            ]
        ];
        Notifier::notify_mobile($branch_id,$cdata);
       return DV::success();
    }
    function rejectDriverChange($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task
        $branch_id = $ss->branch_id;
        //$package, $old_driver_id,$new_driver_id
        $id = $d->id;
        
        //get request details
            $request = null;
            $rows = DB::table('request_driver_change AS r')->join('package AS p','p.qr_code','=','r.barcode')->where('r.branch_id',$branch_id)->where('r.id',$id)->selectRaw("r.id,r.status,r.completed,r.auth_user,p.branch_id,p.delivery_id, p.warehouse_id,p.receiver_phone,r.new_driver_id,r.old_driver_id,r.barcode")->take(1)->get();
            foreach($rows as $row) $request = $row;
            if(!$request) return DV::error('The request details were not found!');
            if(strtolower($request->status) =='approved') return DV::error('This request already approved!');
       
        DB::table('request_driver_change')->where('id',$id)->update(array(
          'status'=>'Rejected',
          'completed'=>1,
          'auth_user'=>$ss->login_name,
          'auth_date'=>getNowTime()
        ));

        // //begin:: get new drivers name
        //     $new_driver_name = null;
        //     $rows = DB::table('driver AS d')->where('id',$request->new_driver_id)->selectRaw('name')->take(1)->get();
        //     foreach($rows as $row) $new_driver_name = $row->name;
        //  //end:: get new driver name
        $old_driver = $this->getDriverInfo($request->old_driver_id); 
       //Notify Admin about driver exchanging items on the road
            $event_data = (object)['branch_id'=>$branch_id,'delivery_id'=>$request->delivery_id,'bar_code'=>$request->barcode,'driver_id'=>$old_driver->id,'driver_name'=>$old_driver->name,'request_id'=>$req->id,'request_completed'=>$req->completed,'request_status'=>$req->status];
            $event_data->title ="Request Rejected";
            $event_data->message ="($ss->login_name rejected the request) អ្នកដឹក $old_driver->name បន្តរដឹកទំនិញ $request->receiver_phone";
            $event_data->request_type="driver_change";
            //$event_data->persist = 0;
            //todo: change event_name to "driver_changed"
            $err = Notifier::notify_admin('request_status_changed',$event_data);
       //Notify to Merchant and Driver

        $d->barcode = $request->barcode;
        $p = $this->getPackageDetails($branch_id,$d);
        $cdata = [
            // [
            //     'user_class'=>'driver',
            //     'target_user_id'=>$request->old_driver->id,
            //     'persist'=>1,
            //     'data'=>$p,
            //     'title'=>'Delivery',
            //     'message'=>"អ្នកអាចបន្តរដឹកទំនិញ $p->receiver_phone" 
            // ],
            [
                'user_class'=>'driver',
                'target_user_id'=>$request->new_driver_id,
                'persist'=>1,
                'data'=>$p,
                'title'=>'Request Rejected',
                'message'=>"សំណើរសំុទំនិញលេខ $p->receiver_phone ត្រូវបានបដិសេធ" 
            ]
        ];
        Notifier::notify_mobile($branch_id,$cdata);
       return DV::success();
    }
 
    function getPendingRequests($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task
        $branch_id = $ss->branch_id;
        $rows = DB::table("request_driver_change AS r")->where('branch_id',$branch_id)->selectRaw("r.id,r.status,r.create_date, r.description,r.title,r.completed")->orderByRaw('r.completed ASC, r.status')->get();
        return $rows;
    }

    //scanPackage() on driver app
    function getPackageDetails($branch_id,$arr){
        //$ss = UM::getUserInfoByToken($d);
        //if ($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task
        //$branch_id = $ss->branch_id;
        $d = (object)$arr;
        $barcode =  isset($d->barcode)?Sanitizer::sanitize($d->barcode):null;
        $cols = "p.id,p.delivery_id,p.zone_code,'$barcode' as barcode, p.zone_name,p.receiver_phone,(SELECT fleet_tracking_number FROM delivery WHERE id =p.delivery_id LIMIT 1) as fleet_tracking_number,p.qr_code As barcode,p.delivery_type,DATE_FORMAT(p.arrival_time,'%d %b %Y %r') AS arrival_date,p.sender_id,s.name AS sender_name,s.phone_number AS sender_phone,(SELECT d.name FROM driver AS d WHERE d.id = p.driver_id LIMIT 1) AS driver_name,(SELECT d.phone_number FROM driver AS d WHERE d.id = p.driver_id LIMIT 1) AS driver_phone,p.driver_id,p.receiver_address,p.receiver_phone,p.failed_num,p.billed_kg,p.forwarding_cost,p.price,p.cod,p.df_payer,(IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0)) AS fees,p.sender_total,p.driver_total,p.sender_pmt_status_id,p.driver_pmt_status_id,p.status_id,ps.name AS status";
        $rows = DB::table('package AS p')->join('package_statuses AS ps','ps.id','=','p.status_id')->join('sender as s','s.id','=','p.sender_id')->where('p.branch_id',$branch_id)->where('p.qr_code',$barcode)->selectRaw($cols)->take(1)->get();
        return isset($rows[0])?$rows[0]:null;
    }

    //Scan package out one by one. This is scanned by Admin Staff on Backend system or Scanned by Driver Mobile App
    //param $d = {'warehouse_id','barcode','delivery_type','driver_id','vehicle_type','depart_time'}
    function scanPackageOut($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task
        $branch_id = $ss->branch_id;
        $delivery_id =  isset($d->delivery_id)?Sanitizer::sanitize($d->delivery_id):null;
        $barcode = isset($d->barcode)?Sanitizer::sanitize($d->barcode):null;
        $warehouse_id = isset($d->warehouse_id)?Sanitizer::sanitize($d->warehouse_id):null;
        $delivery_type = isset($d->delivery_type)?Sanitizer::sanitize($d->delivery_type):null;
        $vehicle_type = isset($d->vehicle_type)?Sanitizer::sanitize($d->vehicle_type):null;
        $driver_id = isset($d->driver_id)?Sanitizer::sanitize($d->driver_id):0;
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
        //     $rows = DB::table('package AS p')->where('p.branch_id',$branch_id)->where('p.qr_code',$barcode)->select('p.delivery_type')->take(1)->get();
        //     foreach($rows as $row) $delivery_type = $row->delivery_type;
        // }

        if (strtolower($delivery_type)!='normal' && strtolower($delivery_type) !='fast') {
            $result->status='Error';
            $result->error_message ='Delivery Type is not correct';
            return $result;
        }

        $find_by ="barcode"; // "id"
        if($this->package_in_trip($branch_id, $delivery_id, $barcode,$find_by)) return DV::error('Package already in the list'); 
        
        //begin:: Checking driver's status if he is occupied by another trip or he is scanning out somewhere on another computer or app
            //NOTE: getDriverStatusInfo() will check if the driver is busy with another trip other than the given trip ID ($delivery_id) 
            $m = $this->getDriverStatusInfo($ss,$driver_id,$delivery_id);
            if ($m) {
                if ($m->status_id ===2) return DV::error("The driver is now on another delivery. You can finish that delivery trip before starting a new trip");  
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
        $rows = DB::table('package AS p')->where('branch_id',$branch_id)->where('qr_code',$barcode)->selectRaw($selectCols)->take(1)->get();
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
                    $h_rows = DB::table('delivery AS d')->where('d.branch_id',$branch_id)->where('d.id',$delivery_id)->where('d.driver_id',$driver_id)->selectRaw('d.id,d.status_id')->take(1)->get();
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
 
    //startDeliveryTrip()
    //$d= {'delivery_id','depart_time','driver_id','delivery_type','vehicle_type'}
    function startTrip($arr = [], $ss=null){
        $d = (object)$arr; 
        $ss = $ss?$ss:$this->getUserInfo(); 
        $result = (object)array('status'=>'OK','error_message'=>null,'delivery_id'=>null,'fleet_tracking_number');
        $branch_id = $ss->branch_id;
        $delivery_id = isset($d->delivery_id)?$d->delivery_id:(isset($d->id)?$d->id:null);
        $driver_id = isset($d->driver_id)?$d->driver_id:null;
        //$delivery_type =  isset($d->delivery_type)? Sanitizer::sanitize($d->delivery_type):'Normal';
        $vehicle_type = isset($d->vehicle_type)? Sanitizer::sanitize($d->vehicle_type):null; //default to motobike "code"
        $depart_time = isset($d->depart_time)? convertDate($d->depart_time):null;
        if(!(bool)strtotime($depart_time))  $depart_time = getNowTime();
   
        $rows = DB::table('delivery AS d')->where('branch_id',$branch_id)->where('id',$delivery_id)->take(1)->selectraw("d.id,d.warehouse_id,d.driver_id, d.delivery_type,vehicle_type")->get();
        $d_found = false;
        foreach($rows as $row){
            if (empty($driver_id) || $driver_id <=0) $driver_id = $row->driver_id;
            //$delivery_type =$row->delivery_type;
            if (!$vehicle_type) $vehicle_type = $row->vehicle_type;
            $d_found = true;
        } 

        if(!$d_found){
             return DV::error("Delivery identitier is not valid!");
        }
        if ($driver_id <=0 || empty($driver_id)) {
           return DV::error('Driver or delivery person is required');
        }

        //count total number of packages assigned to this delivery trip give by @delivery_id
         $p_count = $this->getPackageCountByStatus($branch_id,$delivery_id,null);
         if(!is_numeric( $p_count ))  $p_count  =0;
         if ($p_count<=0) {
            return DV::error("It seems that there are no packages assigned to this delivery");
         }

        if (empty($vehicle_type))  $vehicle_type = $this->getVehicleTypeByDriver($ss,$driver_id);
         if (empty($delivery_id) || $driver_id <=0) {
            return DV::error("Delivery identifier is not valid");
         }

        /***
          If getUnpaidPackage() return [] or null then => this trip (given by @delivery_id) cannot be started again because
          all packages cannot change status to "On Delivery"
        ***/
        $unpaid_packages = $this->getUnpaidPackage($delivery_id,1);
        if (!isset($unpaid_packages[0])) return DV::error("Cannot start this delivery because all packages` payments have been settled");
        $on_delivery_status_id =2; //For trip status 1= "Pending", 2="delivery Started or On Delivery"
        
        $trip_number = $this->getNextFleetNumber($ss);
        DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->update(array(
        'fleet_tracking_number'=>$trip_number,   
        'depart_time'=>$depart_time,
        'driver_id'=>$driver_id,
        'vehicle_type'=>$vehicle_type,
        'status_id'=>$on_delivery_status_id,
        'package_count'=>$p_count,
        'failed_count'=>0,
        'delivered_count'=>0,
        "update_user"=>$ss->login_name
        ,'update_date'=>getNowTime()
      ));
        
        $package_status_id =6; //For package status => 5="Arrived Warehouse", 6 = "Delivery Started ..."
        DB::table('package')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->whereRaw("IFNULL(sender_pmt_status_id,0) =0 AND IFNULL(driver_pmt_status_id,0) = 0")->update(array(
            'delivery_time'=>getNowTime(),
            'status_id'=>$package_status_id,
            'driver_id'=>$driver_id,
            //'delivery_type'=>$delivery_type,
            'outstanding'=>1,
            "update_user"=>$ss->login_name
            ,'update_date'=>getNowTime()
        ));

        return DV::success(['delivery_id'=>$delivery_id,'fleet_tracking_number'=>$trip_number]);
    } 

    //getUnpaidPackage() returns one unpaid package per delivery trip. IF there is none  (i.e: it returns []) => then all packages have been settled with merchant or driver => so cannot change status to "On Delivery" => thus cannot start trip again
    function getUnpaidPackage($trip_id, $limit_num =1){
       //$str_limit = "";
       //if($limit_num > 0) $str_limit =" LIMIT $limit_num";
       $str_pmt_status ="(IFNULL(p.driver_pmt_status_id,0) = 0 AND IFNULL(p.sender_pmt_status_id,0) =0)";
       return DB::table('package AS p')->where('delivery_id',$trip_id)->whereRaw($str_pmt_status)->selectRaw("p.status_id")->limit($limit_num)->get();
    }

    //$d= {'delivery_id','failure_notes'}. This function is used to finish delivery Trip prematurely. in case there are some packages not yet delivered then system will set them as failed packages, but user must give reason for the failtures 
    function finishDeliveryTrip($arr,$id=null,$ss=null){
        $ss = $ss?$ss:$this->userInfo;
        $delivery_id = $id?$id:$this->id;
        $d = (object)$arr; 
        $branch_id = $ss->branch_id;
        if(!$delivery_id) $delivery_id = isset($d->delivery_id)? Sanitizer::sanitize($d->delivery_id):null;
       
        $failure_notes =null;
        $ondelivery_status =6; // package status 6 = "Delivery Started " or "On delivery" 
        $ondelivery_count = $this->getPackageCountByStatus($branch_id,$delivery_id,$ondelivery_status);
        if ($ondelivery_count > 0) {
            $failure_notes = isset($d->failure_notes)?Sanitizer::sanitize($d->failure_notes):null;
            if(!$failure_notes || $failure_notes ==='') {
                return DV::error ($ondelivery_count.' packages not yet delivered. So failure notes is required to finish this delivery');
            }
            $failed_status_id =9; //refer to table "package_statuses"
            DB::table('package')->where('branch_id',$branch_id)->where('status_id',$ondelivery_status)->where('delivery_id',$delivery_id)->update(array(
                'failure_notes'=>$failure_notes,
                'arrival_time'=>getNowTime(),
                'outstanding'=>1, //completed delivery => either "delivered" or "returned"
                'status_id'=>$failed_status_id
            ));
        }
         
        $trip_done_status =3;
        DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->update(array(
            'package_count'=>$this->getPackageCountByStatus($branch_id,$delivery_id,null), // All package count
            'failed_count'=>$ondelivery_count,
            'delivered_count'=>$this->getPackageCountByStatus($branch_id,$delivery_id,8), //Delivered package count
            'status_id'=>$trip_done_status,
            "update_user"=>$ss->login_name,
            'update_date'=>getNowTime()
        ));
        return DV::success();
    } 

    function removeScannedPackage($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task
        $branch_id = $ss->branch_id;
        $barcode = isset($d->barcode)?Sanitizer::sanitize($d->barcode):null;
        $delivery_id = isset($d->delivery_id)?Sanitizer::sanitize($d->delivery_id):null;
        $result = (object)array('status'=>'OK','error_message'=>null);
        if (empty($barcode)) return DV::error('Failed to remove package because the barcode not valid');  
        
        $status_id =5; //Arrived at warehouse. Set package's status back to arrived at warehouse
        $outstanding =1;
        DB::table('package')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->where('qr_code',$barcode)->update(array('delivery_id'=>null,'driver_id'=>null,'status_id'=>$status_id,'outstanding'=>$outstanding));
        //$package_count = $this->getPackageCountByStatus($branch_id,$delivery_id,-1);
        // if ($package_count <= 0) {
        //   DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->delete();
        //   $result->trip_removed =1; 
        // }
        $this->updateDeliveryTripData($delivery_id,$ss);
        $result->status ='OK';
        return $result;
    }
 
 
    function getCODFeePercentBySender($branch_id,$sender_id){
        $rows = DB::table('sender as s')->where('s.id',$sender_id)->selectRaw("IFNULL(s.cod_fee,0) as cod_fee_percent")->take(1)->get();
        foreach($rows as $row) return $row->cod_fee_percent; 
        return 0;
    }
    //updatePackageStatus_driver() is used by Driver mobile app to delviery package to receiver or to mark package status as failure with notes
    //param $d = {'driver_id','barcode','status_id','notes',['arrival_time']}
    function updatePackageStatus_driver($arr=[],$ss=null){
        $d = (object)$arr; 
        $max_cod_amount =3000;
        $branch_id = $ss->branch_id;
        $is_from_mobile = isset($d->is_from_mobile)?$d->is_from_mobile:0;
        $status_id = isset($d->status_id)?Sanitizer::sanitize($d->status_id):null;
        $delivery_id = null;
        $barcode = isset($d->barcode)? Sanitizer::sanitize($d->barcode):null;
        if (!isset($barcode)) $barcode = isset($d->bar_code)?$d->bar_code:null;

        $update_cod_amount =0;
        $amount = null;
        /** NOTE that  $driver_input_amount is empty when Driver does not change the COD amount */
        $driver_input_amount = isset($d->amount)?$d->amount:null;
        if(is_numeric($driver_input_amount)){
            $update_cod_amount =1;
            $amount = floatval($driver_input_amount);
            //$amount = floatval(str_replace(',', '.', $driver_input_amount));
        }
       

        $photo_data = isset($d->photo_data)?$d->photo_data:null;
        $notes = isset($d->notes)? Sanitizer::sanitize($d->notes):null;
        if(!$notes) $notes = isset($d->remarks)?$d->remarks:null;

        $arrival_time = getNowTime();

        $result= (object)array('status'=>'OK','error_message'=>null);
        if (!$status_id || !in_array($status_id,[8,9])) return DV::error('Package status is not allowed'); 
        //NOTE: package status => 8 ="Delivered", 9 ="Failed", 10
        if ($status_id ==9){
            if (!$notes) return DV::error("ត្រូវការហេតុផល!"); 
        } else if ($status_id !=8) {
            return DV::error("Only two status allowed. \"Failed\" or \"Delivered\"");
        }
         
        $package_id = null;
        $p1 = $this->getPackageProps($branch_id,$barcode,[
            'p.id',
            'p.delivery_notes',
            'p.delivery_id',
            'p.driver_id',
            'IFNULL(p.price,0) AS price',
            'IFNULL(p.driver_total,0) AS driver_total'],'barcode');
        if(!$p1) return DV::error('barcode does not exist!');
        if($p1->driver_total <= 0 && $p1->price > 0) $p1->driver_total =$p1->price;
        $diff_amounts = is_numeric($driver_input_amount) && (round($p1->driver_total, 2) != round($amount, 2)); 
        $package_id = $p1->id;
        $delivery_id = $p1->delivery_id;
        if(!$delivery_id) return DV::error('It seems the package is not yet assigned to any trip'); 
        if($d->driver_id != $p1->driver_id) return DV::error('Wrong driver identity!');

        $outstanding =1;
        if (in_array($status_id,[8,11])) $outstanding =0; 
        $inputs =[
            'status_id'=>$status_id,
            'delivery_time'=>$arrival_time,
            'outstanding'=>$outstanding,
            'cod_changed'=>$diff_amounts
        ];
        
        if ($status_id ==8){
            $notes = ($p1->delivery_notes ? $p1->delivery_notes . '. ' : '') . ($notes ?? '');
            if ($notes !== null && strlen($notes) > 250) {
                $notes = substr($notes, 0, 250);
            }
            $inputs['delivery_notes'] = $notes;
        }
        $update_notes = $diff_amounts? 'driver driver_name change COD from $'.$p1->driver_total.' to $'.$amount : null; 
        if($status_id ==9)
            $inputs['failure_notes'] = $notes;
        else{
            /** NOTE: if Driver enter negative amount => it means taxi fee. Here is to prevent driver from entering greater then $5 for taxi fee **/
            if ($update_cod_amount ==1 && $amount < -5) return DV::error('Taxi fee cannot exceed 5 USD!');
            if($notes) $inputs['delivery_notes']= $notes;
            //update_notes cannot be NULL and is used only when Driver update package's COD on delviering to receiver
            
            if($status_id == 8) {
                    //if need to update cod_amount
                    if($update_cod_amount ==1){
                        $pg = $this->getPackageProps($branch_id,$package_id,[
                            'p.id',
                            'p.cod',
                            'p.price',
                            'LOWER(p.df_payer) AS df_payer',
                            'IFNULL(p.sender_total,0) AS sender_total',
                            'IFNULL(driver_total,0) AS driver_total',
                            'IFNULL(p.cod_fee,0) AS cod_fee',
                            'IFNULL(p.delivery_fee,0) + IFNULL(p.base_fee,0) AS fees',
                            'base_fee',
                            'delivery_fee',
                            'delivery_id',
                            'sender_id'
                        ],'id');
                        if($pg){
                            $org_total =  (float)$pg->driver_total;
                            //$org_price = is_numeric($pg->price)? $pg->price:0;
                             //Update package's price, cod_fee, and driver_total if driver changes COD amount on delivery
                             $amount =  (float)$amount;
                             //$update_cod_amount = (round($org_total,2) != round($amount,2));
                             $diff_amounts = is_numeric($driver_input_amount) && (round( $org_total, 2) != round($amount, 2));
                             $inputs['cod_changed'] = $diff_amounts;
                             if($diff_amounts){
                                $inputs['df_payer'] = 'sender';
                                //$org_cod_fee = $pg->cod_fee;
                                $org_fees = 0;
                                if ($pg->df_payer ==='receiver') $org_fees = $pg->fees;

                                //In case of change to lower amount => $diff is negative
                                //$diff = $amount - $org_total;   
                                //$org_driver_total = is_numeric($pg->driver_total)? $pg->driver_total:0;
                                //$new_driver_total = $amount;
                                //$new_price = $amount - $org_cod_fee;
                                //This is to assume that when Driver enter amount upon Delivering items to Receiver then it is always: cod=1 and df_payer ="sender"
                                if (abs($amount) > $max_cod_amount) return DV::error('ចំនួន COD ច្រើនពេកហើយ!');
                                if ($amount == 0){
                                    $inputs['df_payer'] = 'sender';
                                    $inputs['cod']= 0;
                                    $inputs['price']= 0;
                                    $inputs['cod_fee']= 0;
                                    $inputs['driver_total']= 0;
                                    $inputs['sender_total']= $pg->fees;
                                    //$inputs['sender_total']= $pg->fees;
                                }else if ($amount > 0) {
                                    $inputs['df_payer'] = 'sender';
                                    $inputs['cod']= 1;
                                    $inputs['price'] = $amount;
                                    $cod_fee_percent = $this->getCODFeePercentBySender($branch_id,$pg->sender_id);
                                    $cod_fee = ROUND($amount * $cod_fee_percent/100,2,-1);
                                  
                                    $inputs['cod_fee'] = $cod_fee;
                                    $inputs['price']= $amount;
                                    $inputs['sender_total'] = $pg->fees + $cod_fee;
                                    $inputs['driver_total']= $amount;
                                }else {
                                    //This case is 'driver enters negative amount'
                                    //NOTE: if Driver enters negative amount, it is considered as Taxi Fee. (requested by Chhunheng)
                                    //if (abs($amount) > 5) return DV::error('Taxi amount cannot exceed 5 USD!');
                                    $inputs['df_payer']= 'sender';
                                    //$inputs['driver_adjust_amount']= $amount;
                                    //$inputs['sender_adjust_amount']= abs($amount);
                                    $inputs['forwarding_cost']= abs($amount);
                                    //amount the sender has to pay Express company
                                    $inputs['sender_total']= $pg->fees + abs($amount);
                                    $inputs['price']= 0;
                                    $inputs['cod']= 0;
                                    $inputs['cod_fee']= 0;
                                    $inputs['driver_total'] = $amount;
                                } 
                                $justNow = Date('d M Y h:m:s');
                                if ($amount < 0)
                                   $update_notes ='ថ្លៃតាក់ស់ី '.abs($amount).' USD. ដោយសារតែអ្នកដឹក driver_name បានដូរ COD ពី $'.$org_total.' ទៅ $'.$amount.'. ទំនិញដឹកបានសំរេចនៅ '.$justNow;
                                else
                                   $update_notes = 'អ្នកដឹក driver_name បានប្តូរ​ COD ពី $'.$org_total.' ទៅ $'. $amount.'. ទំនិញដឹកបានសំរេចនៅ '.$justNow;
                                $inputs['failure_notes'] = '';
                                if($org_total == $amount){
                                    $inputs['cod_changed'] = 0;
                                    $update_notes = null;
                                }
                            }  
                        }
                    }  
            }
        }
        $inputs['failure_notes']=$notes;
        DB::table('package')->where('branch_id',$branch_id)->where('id',$package_id)->update($inputs);
        //keep track of package's update history, espcially updates made by Driver from app
        if($update_notes && $diff_amounts){
             $driver_id = $d->driver_id;
             $driver_name = DB::table('driver as d')->where('d.id',$driver_id)->take(1)->value('name');
             $update_notes = str_replace('driver_name',$driver_name,$update_notes); 
             $xd = (object)['package_id'=>$package_id,'user_class'=>'driver','action_name'=>'change_cod','description'=>$update_notes];
             Tracker::log($xd,$ss);
        }   
     
        $tripInfo = $this->updateDeliveryTripData($delivery_id,$ss);

        // //todo: save photo data attached to this delivery of package, if driver provides it
        // if($photo_data){
        // }

        $result->status='OK';
        $result->error_message =null;
            $p = $this->getPackageProps($branch_id,$package_id,['p.id','status','receiver_name','driver_id','p.driver_total','cod_fee','cod','price','p.forwarding_cost','(SELECT driver.`name` FROM driver WHERE driver.id =p.driver_id LIMIT 1) AS driver_name','sender_phone','s.id AS sender_id','receiver_phone','receiver_address','CASE p.status_id WHEN 9 THEN failure_notes WHEN 11 THEN failure_notes ELSE delivery_notes END AS notes',],'id');
            //if unexpectedly, the $barcode is not valid => just return $result
            if(!$p) return DV::success(['notification_error'=>'Notification failed because package details was not retrieved!']);
  
            $data = (object)['branch_id'=>$branch_id,'user_id'=>$ss->user_id,'delivery_id'=>$delivery_id,'bar_code'=>$barcode,'package_id'=>$p->id,'status_id'=>$status_id,'status'=>$p->status,'driver_id'=>$p->driver_id,'driver_name'=>$p->driver_name,'driver_total'=>$p->driver_total,'forwarding_cost'=>$p->forwarding_cost,'cod'=>$p->cod,'price'=>$p->price,'cod_fee'=>$p->cod_fee,'notes'=>$p->notes,'on_delivery_count'=> $tripInfo->on_delivery_count,'trip_total'=>$tripInfo->trip_total,'trip_status_id'=>$tripInfo->status_id,'trip_status'=>$tripInfo->status,'package_count'=>$tripInfo->package_count,'trip_total'=>$tripInfo->trip_total,'delivered_total'=>$tripInfo->delivered_total];
            if ($status_id ==9)
              $data->message ="$p->driver_name កញ្ចប់លេខ $p->receiver_phone ដឹកមិនបាន។ មូលហេតុៈ $notes"; 
            else if ($status_id==8) 
            {
                $data->message =$p->driver_name. ' ដឹកបានសំរេច កញ្ចប់លេខ '.$p->receiver_phone;
                if($update_cod_amount ==1)
                $data->message .='. '.$update_notes;
            }
            else $data->message =' ស្ថានភាពកញ្ចប់លេខ​ '.$p->receiver_phone.' ផ្លាស់ប្តូរទៅជា '.$p->status;
            
            $data->title ='Delivery';
            $err = Notifier::notify_admin('package_status_changed',$data);

            //begin:: notify to Merchant and Driver (in case Admin updated the status)
            if ($status_id ==8) 
                $p->event_name ='delivery_succeeded';
            else if ($status_id ==9) 
                $p->event_name ='delivery_failed';
            else if ($status_id ==11) 
                $p->event_name ='package_returned';
            else
             $p->event_name ='package_status_changed'; 
            
             //Extend package data's details to include updated Trip information such as trip_status, and driver_total, trip's total
             $dd = $p;
             $dd->trip_status = $tripInfo->status;
             $dd->trip_status_id = $tripInfo->status_id;
             //delivered_total is the total amount of cash for all delivered items by a driver per trip
             $dd->delivered_total = $tripInfo->delivered_total;
             $dd->trip_total = $tripInfo->trip_total;

             $cdata = [
                 [
                     'user_class'=>'merchant',
                     'target_user_id'=>$p->sender_id,
                     'persist'=>1,
                     'data'=>$dd,
                     'title'=>'Delivery',
                     'message'=>$data->message
                 ]
             ];
             
                if($is_from_mobile !=1 && !$is_from_mobile){
                    $cdata[] =  [
                        'user_class'=>'driver',
                        'target_user_id'=>$p->driver_id,
                        'persist'=>1,
                        'data'=>$dd,
                        'title'=>'Delivery',
                        'message'=>"កញ្ចប់លេខ ".$p->receiver_phone." ដឹកបានសំរេច!"
                    ];
                }
                Notifier::notify_mobile($branch_id,$cdata);
            //end:: notify to Merchant and Driver (in case Admin updated the status)
        $driver = new Driver($p->driver_id,$ss);  
        $p->cod_changed = $diff_amounts;
        $p->cod_notes = $update_notes;
        return DV::success(['pacakge'=>$p,'on_delivery_count'=>$tripInfo->on_delivery_count,'trip_total'=>$tripInfo->trip_total,'delivered_total'=>$tripInfo->delivered_total,'trip_status'=>$tripInfo->status,'trip_status_id'=>$tripInfo->status_id,'my_tasks'=>$driver->getMyTasks()]);
    }
     
    //if parameter @rows is given => then do not query for rows again
    //$row is pacakge = {delivery_id,status_id,delivery_type,driver_total,failed_num}
    //returns {count for on_delivery, failed,ctd,returned,total (driver_total), delivered_total }
    function countPackageByStatus($branch_id,$delivery_id,$rows =null){
        if (!$rows) $rows = DB::table("package AS p")->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->selectRaw("p.status_id,delivery_id,p.delivery_type,p.failed_num,IFNULL(p.driver_total,0) AS driver_total")->get();
        $data =(object)['package_count'=>0,'delivered'=>0,'failed'=>0,'returned'=>0,'on_delivery'=>0];
        $cnt_on_delivery =0;
        $cnt_delivered=0;
        $cnt_failed=0;
        $cnt_returned =0;
        $cnt_ctd= 0;
        $total_driver_total =0;
        $delivered_driver_total = 0;
        $cnt=0;
 
        $i=0;
        $c=null;
        do{
           if(!isset($rows[$i])) break;  
           $c = $rows[$i];
            $p_status_id = (int)($c->status_id?$c->status_id:0); 
            if($p_status_id == 6) {
                $cnt_on_delivery++;
                if($c->failed_num >0) $cnt_ctd++; 
            } 
            else if($p_status_id ==8) {
                $cnt_delivered++;
                $delivered_driver_total += $c->driver_total;
            }
            else if($p_status_id ==9) $cnt_failed++;
            else if($p_status_id ==11) $cnt_returned++;  
            //else if($c->status_id = 10)  $countPackageByStatus++; 
          $total_driver_total+= $c->driver_total;  
          $cnt++;  
          $i++;
        }while($c);

        $data->on_delivery = $cnt_on_delivery;
        $data->delivered = $cnt_delivered;
        $data->failed = $cnt_failed;
        $data->returned = $cnt_returned;
        $data->ctd =$cnt_ctd;
        $data->package_count = $cnt;
        $data->total = number_format($total_driver_total,2,'.','');
        $data->delivered_total = $delivered_driver_total;
        return $data;
    }

    //UpdateDeliveryTripData() is called evey time Driver delivers package to customer AS "Delivered" or "Failed"
    function updateDeliveryTripData($delivery_id,$ss=null){
        $branch_id = $ss->branch_id;
        if (!$delivery_id) return (object)['status'=>'Error','error_message'=>'Trip ID does is empty or does not exist'];
        $d = $this->countPackageByStatus($branch_id,$delivery_id);
        if ($d->package_count <=0) {
            DB::table('delivery')->where('id',$delivery_id)->delete();
            return (object)['status'=>'OK','on_delivery_count'=>$d->on_delivery,'failed_count'=>$d->failed,'delivered_count'=>$d->delivered,'status_id'=>null,'status'=>null,'total'=>0,'delivered_total'=>0];
        }

        $inputs =[
            'package_count'=>$d->package_count,
            'failed_count'=>$d->failed, //$this->getPackageCountByStatus($branch_id,$delivery_id,9)
            'delivered_count'=>$d->delivered, //$this->getPackageCountByStatus($branch_id,$delivery_id,8),
            'ctd_count'=>$d->ctd, //$this->getPackageCountByStatus($branch_id,$delivery_id,10), //CTD = "Continue to Deliver" or "Pending"
            'update_user'=>$ss->login_name,
            'update_date'=>getNowTime()
        ];
        $status ='Done';
        $status_id =3;
        if($d->on_delivery > 0) {
            $status_id=2;
            $status ='On Delivery';
        }
        $inputs['status_id']=$status_id;

        DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->update($inputs);
 
        // $delivery_done_status = 3;
        // $more_wheres ="IFNULL(package_count,0) <= (IFNULL(ctd_count,0) + IFNULL(failed_count,0) + IFNULL(delivered_count,0))";
        // DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->whereRaw($more_wheres)->update(array(
        //     'status_id'=>$delivery_done_status
        // ));
        return (object)['status'=>'OK','on_delivery_count'=>$d->on_delivery,'failed_count'=>$d->failed,'delivered_count'=>$d->delivered,'status_id'=>$status_id,'status'=>$status,'trip_total'=>number_format((float)$d->total,2,'.',''),'delivered_total'=>number_format((float)$d->delivered_total,2,'.',''),'package_count'=>$d->package_count];
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


         //removePackageFromTrip()
         //Admin user => remove package from a trip
         //NOTE: remove pacakge from a trip by using the given barcode
         function removePackage($barcode,$delivery_id=null,$ss=null){
            $ss = $ss?$ss:$this->getUserInfo();
            $delivery_id = $delivery_id?$delivery_id:$this->getId();
            $branch_id = $ss->branch_id;
            if(!$delivery_id) return DV::error('Delivery Trip ID is empty or invalid');

            $package_id =null;
            $p = $this->getPackageProps($branch_id,$barcode,['p.id','status_id','delivery_id'],'barcode');
            if(!$p) return DV::error('Package barcode does not exist!');
            if($p->delivery_id != $delivery_id) return DV::error("This package does not belong to this delivery trip $barcode $delivery_id | $p->delivery_id");
            $package_id = $p->id;
             
            if($p->status_id ==8 || $p->status_id ==11) return DV::error('Delivered or Returned package cannot be removed from existing trip!');
            /** Begin:: Check if the package is on Delivery => cannot allow user to take out of Trip **/
                // $rows = DB::table('package AS p')->where('branch_id',$branch_id)->where('qr_code',$barcode)->selectRaw('p.status_id,p.outstanding')->take(1)->get();
                // $current_status_id = null;
                // foreach($rows as $row) $current_status_id = $row->status_id;
                // if ($current_status_id ==6){
                //     $result->error_message = "មិនអាចយកចេញបាន ព្រោះទំនិញកំពុងតែដឹក!";
                //     $result->status ='Error';
                //     return $result;
                // }
            /** end:: Check if the package is on Delivery => cannot allow user to take out of Trip **/
            //$package_id = isset($d->package_id)?$d->package_id:0;
            DB::table('package')->where('branch_id',$branch_id)->where('id',$package_id)->where('delivery_id',$delivery_id)->update(array(
                'outstanding'=>1,
                'status_id'=>5,
                'delivery_id'=>null,
                'driver_id'=>null, // important to set driverId to NULL
                'update_user'=>$ss->login_name,
                'update_date'=>getNowTime()
            ));

             //$status_id = -1; // count packages of all statuses  
             //$cnt = $this->getPackageCountByStatus($branch_id,$delivery_id,$status_id);
             //$package_count = 0;
             $trip_total = 0;
             
             //later can use where @warehouse_id too
             //$rows = DB::table('package AS p')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->selectRaw("COUNT(p.id) AS package_count, SUM(IFNULL(p.driver_total,0)) AS trip_total")->get();
            //  foreach($rows as $row) {
            //     $package_count = $row->package_count;
            //     $trip_total = $row->trip_total;
            //  }

             $countInfo = $this->countPackageByStatus($branch_id,$delivery_id,null);
             /***
              $countInfo is object [
                'total'=>number,
                'delivered_total'=>number,
                'on_delivery'=>count of on_delivery items,
                'failed'=>count of failed items,
                'delivered'=>count of delivered items
              ]
              ***/

              $trip_status = null;
              $status_on_delivery = 6;
              if($countInfo->package_count <=0) {
                 DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->delete();
              }else{
                 if (self::onDelivery($delivery_id)){
                    $trip_status = 2; //trip status ON DELIVERY
                    DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->update(['status_id'=>$trip_status,'package_count'=>$countInfo->package_count,'delivered_count'=> $countInfo->delivered,'failed_count'=> $countInfo->failed]); 
                 }else{
                    $trip_status= 3; // Trip status DONE
                    DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->update(['status_id'=>$trip_status,'package_count'=>$countInfo->package_count,'delivered_count'=> $countInfo->delivered,'failed_count'=> $countInfo->failed]);
                 }
              }
   
                $last_status = 'Unknown';
                if ($trip_status ==2) $last_status = 'On Delivery';
                else if ($trip_status ==3) $last_status ='Done';
                
                return DV::success([
                    'delivery_id'=>$delivery_id,
                    'package_count'=>$countInfo->package_count,
                    'trip_total'=>$countInfo->total,
                    'trip_status'=>$trip_status,
                    'last_status'=>$last_status //Latest trip status or updated trip status
                ]);
         }
        
         //return 0 or 1
         static function onDelivery($delivery_id){
            $is_on_delivery = 0;
            $rows = DB::table('package AS p')->where('delivery_id',$delivery_id)->where('status_id',6)->select('id')->take(1)->get();
            return isset($rows[0])?1:0;
         }

         //addPackageToTrip() is for admin user to add package to a trip (for editing or adjustment purpose)
         //NOTe that scanpackageOut() is for scanning package into a trip preparing to Start a trip
          function addPackage($barcode,$delivery_id=null,$ss=null){
            $delivery_id = $delivery_id?$delivery_id:$this->getId();
            $ss = $ss?$ss:$this->getUserInfo();
            $branch_id = $ss->branch_id;
            $p_status_id = isset($d->status_id)?$d->status_id:null; //package status_id
            $notes = isset($d->notes)?$d->notes:null;
            //todo: set @notes ="Added for advanced editing purpose"
            $outstanding = null;
             
            // $p_status_name = null;
            // $rows = DB::table('package_statuses AS ps')->where('id',$p_status_id)->selectRaw('name,id, outstanding')->take(1)->get();
            // foreach($rows as $row) {
            //     $outstanding = $row->outstanding;
            //     $p_status_name = $row->name;
            // }
            // if (empty($p_status_name)) {
            //     return DV::error("Failed to add package to the trip because package status is not valid");
            // }
            if(!$delivery_id) return DV::error('The given Delivery Trip ID is empty or invalid'); 
            if (!$p_status_id) $p_status_id =6;
            //begin:: get info about the package
                $rows = DB::table('package AS p')->where('branch_id',$branch_id)->where('qr_code',$barcode)->selectRaw('p.branch_id,p.warehouse_id,p.id,p.qr_code AS barcode,p.status_id,p.outstanding,p.driver_id,p.delivery_id,p.receiver_phone,(SELECT `name` from `driver` WHERE id = p.driver_id LIMIT 1) AS driver_name')->take(1)->get();
                $current_status_id = null;
                $pg = null;
                $pg = isset($rows[0])?$rows[0]:null;
                if (!$pg) return DV::error('It seems that the provided barcode is not valid');
                if($pg->delivery_id === $delivery_id) return DV::error('The backage is already in this Delivery Trip');
            //end:: get info about original package
                 
            $msg =null;
            $current_status_id = $pg->status_id;
            $prev_delivery_id = $pg->delivery_id;

            if ($current_status_id ===8)
               $msg = 'Cannot add this package because it has been already delivered to receiver';
            else if ($current_status_id ===11) 
               $msg = 'Failed to add because the package already returned to merchant';
            else if ($current_status_id ===6 && $pg->driver_id > 0)
            {
                //switch driver for this package: (take pacakge from one driver and give it to another driver)
                $old_driver = (object)['name'=>$pg->driver_name,'id'=>$pg->driver_id];
                $new_trip = $this->getTripProps($branch_id,$delivery_id,'d.id,d.driver_id,(SELECT `name` FROM `driver` WHERE id = d.driver_id LIMIT 1) AS driver_name,d.status_id');
                if($new_trip->status_id ===3) return DV::error('Cannot add package because the trip is finished already');
                $new_driver =(object)['name'=>null,'id'=>$new_trip->driver_id];
                //$res = $this->requestDriverChange($package,$old_driver,$new_driver);
                $res = $this->switchDriver($ss,$pg,$old_driver,$new_driver);
                //$res->prev_trip_deleted is to signal that pervious trip has only one package, which has been moved out, so it was deleted
                if($res->status ==='Error') 
                   return DV::error($res->error_message);
                else return DV::success([
                    'prev_delivery_id'=>$prev_delivery_id,
                    'prev_trip_deleted'=>$res->prev_trip_deleted,
                    'prev_trip_package_count'=>$res->prev_trip_package_count,
                    'prev_trip_status_id'=>$res->prev_trip_status_id,
                    'prev_trip_status'=>$res->prev_trip_status_id===3? 'Done':'On Delivery',
                    'prev_trip_total'=>$res->prev_trip_total,
                    'total'=>$res->trip_total,
                    'status_id'=>$res->status_id,
                    //'status'=>$res->status_id ===3? 'Done':'On Delivery', /**NOTE: prop "status" is used by API to return status as "OK" or "Error"=> so it cannot be used as trip 's status text**/
                    'trip_status'=>$res->status_id ===3? 'Done':'On Delivery',
                    'package_count'=>$res->package_count]);
            }  
            
            if ($msg) return DV::error($msg);

            //The following code executes only when the package's status is "At Warehouse" because
            //status_id = 8, 11 => package rejected by the code above
            //status_id =6 and there is already assigned driver to it  => execute SwitchDriver()
            //=> so only status ="On Delivery" or (no driver asssigned) then the following code is executed
             
            // if($this->package_in_trip($branch_id,$delivery_id,$barcode)){
            //     return DV::error("The package with barcode `".$barcode."` already exists in the trip");
            // }

            //todo: Check if we have to allow only  'Delivered' status when adding package to existing trip that has been Done already?

            //$package_id = isset($d->package_id)?$d->package_id:0;
            $rows = DB::table('delivery AS d')->where('branch_id',$branch_id)->where('id',$delivery_id)->selectRaw('d.driver_id,d.status_id,d.depart_time')->take(1)->get();
            $depart_time = null;
            $driver_id = null;
            $trip_status_id = null;
            foreach($rows as $row) {
                $trip_status_id =$row->status_id;
                $driver_id = $row->driver_id;
                $depart_time = $row->depart_time; 
            }
            //todo: Check for depart_time, How long ago before allowing editing the delivery trip data
            
            if (!$driver_id || $driver_id <=0) return DV::error('Failed to add package to the trip because driver identity is missing'); 
            if ($trip_status_id ===3) return DV::error('Cannot add pacakage because the delivery trip is finished!');
             
            $input_array =[
                'outstanding'=>$outstanding,
                'status_id'=> $p_status_id,
                'delivery_id'=>$delivery_id,
                'driver_id'=>$driver_id,
                'update_user'=>$ss->login_name,
                'update_date'=>getNowTime()];
            //if package status is added as "Failed" then record failure_notes
            if ($p_status_id ===9) {
                $input_array['failure_notes'] = $notes; 
            }
            
            DB::table('package')->where('branch_id',$branch_id)->where('qr_code',$barcode)->update($input_array);
            $tripInfo = $this->updateDeliveryTripData($delivery_id,$ss);
            if($tripInfo->status ==='Error') return DV::error($tripInfo->error_message); 
            return DV::success([
                'prev_delivery_id'=>$prev_delivery_id,
                'prev_trip_deleted'=>0,
                'prev_trip_package_count'=>null,
                'prev_trip_status_id'=>null,
                'prev_trip_status'=>null,
                'prev_trip_total'=>null,
                'total'=>$tripInfo->trip_total,
                'status_id'=>$tripInfo->status_id,
                //'status'=>$res->status_id ===3? 'Done':'On Delivery', /**NOTE: prop "status" is used by API to return status as "OK" or "Error"=> so it cannot be used as trip 's status text**/
                'trip_status'=>$tripInfo->status_id ===3? 'Done':'On Delivery',
                'package_count'=>$tripInfo->package_count]);
         }

    //return tripInfo object {'trip_number','driver_name','diver_code','delivery_date','delivery_time','package_count','status','packages'}     
    function getTripInfo($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task
        $branch_id = $ss->branch_id;
        $delivery_id = isset($d->delivery_id)?$d->delivery_id:0;
        $show_all_statuses = isset($d->show_all_statuses)?$d->show_all_statuses:null;
        //By default show only pacakges "On delivery" or "Failed"
        $str_status = '(p.status_id =6 OR p.status_id =9)';
        if ($show_all_statuses == 1) $str_status ='1=1';

        $rows = DB::table('delivery AS d')->join('delivery_statuses AS ds','ds.id','=','d.status_id')->where('d.branch_id',$branch_id)->where('d.id',$delivery_id)->selectRaw('d.fleet_tracking_number,formatDate(d.depart_time) AS depart_date,DATE_FORMAT(d.depart_time,\'%r\') AS depart_time,ds.name AS status, d.package_count,(SELECT name FROM driver WHERE id = d.driver_id LIMIT 1) AS driver_name')->take(1)->get();
        foreach($rows as $row) {
            $selectCols ='\'$\' AS cur, formatDate(p.create_date) AS booking_date, p.delivery_id,p.id AS package_id,p.qr_code AS barcode, p.delivery_type,s.phone_number AS sender_phone, s.name AS sender_name,p.package_name, p.product_type,p.dim_x, p.dim_y, p.dim_h, p.billed_kg, p.price, (CASE p.cod WHEN 1 THEN p.price ELSE 0 END) AS cod_amount, p.cod, p.cod_fee, p.base_fee,p.delivery_fee,p.receiver_name, p.receiver_phone,p.receiver_address, p.zone_code,p.zone_name, IFNULL(p.forwarding_cost,0) AS forwarding_cost,p.delivery_notes,p.failure_notes, IFNULL(p.driver_total,0) AS driver_total,IFNULL(p.sender_total,0) AS sender_total, IFNULL(p.exchange_rate,1) AS exchange_rate,p.status_id, (SELECT ps.name FROM package_statuses AS ps WHERE ps.id =p.status_id LIMIT 1) AS status,p.delivery_notes';
            $row->packages = DB::table('package AS p')->join('sender as s','s.id','=','p.sender_id')->where('p.branch_id',$branch_id)->where('p.delivery_id',$delivery_id)->whereRaw($str_status)->selectRaw($selectCols)->orderByRaw('s.id')->get();
            return $row;
        }
        return null;
    }

    //returns list of packages belong to a trip. This is used on backend system only
    //getPackageListByTripId() returns object {'package_count','status_id','trip_status','trip_total','packages'}    
    function getPackageList($id=null,$ss=null){
        $delivery_id =$id ?? $this->id;
        $ss = $ss?$ss:$this->userInfo;
        $branch_id = $ss->branch_id;
        $delivery_id =$delivery_id ?? -1;
        $selectCols ='formatDate(p.create_date) AS booking_date, formatDate(p.arrival_time) AS arrival_date, p.delivery_id,p.id AS package_id,p.qr_code AS barcode, p.delivery_type, s.`name` AS sender_name,s.phone_number AS sender_phone,p.package_name, p.product_type,p.dim_x, p.dim_y, p.dim_h, p.billed_kg, p.price, (CASE p.cod WHEN 1 THEN p.price ELSE 0 END) AS cod_amount, p.cod, p.cod_fee, p.base_fee,p.delivery_fee, p.df_payer,p.receiver_name, p.receiver_phone, p.zone_code,p.zone_name, IFNULL(p.forwarding_cost,0) AS forwarding_cost,p.delivery_notes,p.failure_notes, IFNULL(p.driver_total,0) AS driver_total,IFNULL(p.sender_total,0) AS sender_total, p.exchange_rate AS exchange_rate, (SELECT ps.name FROM package_statuses AS ps WHERE ps.id =p.status_id LIMIT 1) AS status, formatTime(p.arrival_time) AS arrival_time,p.driver_total,p.failure_notes,p.delivery_notes,p.failed_num,p.status_id';
        $rows= DB::table('package AS p')->join('sender AS s','s.id','=','p.sender_id')->join('delivery as d','d.id','=','p.delivery_id')->where('p.branch_id',$branch_id)->where('d.id',$delivery_id)->selectRaw($selectCols)->orderByRaw('p.sender_id')->get();          

        //"trip_total" is the grand total of the driver_total for all packages in the trip
        $res = $this->countPackageByStatus($branch_id,$delivery_id,$rows);
        $trip_status_id = 3;
        $trip_status = 'Done';
        if ($res->on_delivery > 0){
            $trip_status_id = 2;
            $trip_status='On Delivery';
        } 

        return (object)[
            'packages'=>$rows,
            'trip_total'=>$res->total,
            'status_id'=>$trip_status_id,
            'trip_status'=>$trip_status,
            'package_count'=>$res->package_count
        ];
     }
     
     //returns list of packages belong to a trip. This is used on backend system only for Printing PDF
     //getPackageList_print() | getPackageListByTripId_print()
     function getPackageList_print($arr =[],$id=null,$ss=null){
        $ss = $ss?$ss:$this->userInfo;
        $delivery_id = $id?$id:$this->id;
        $branch_id = $ss->branch_id;
        //$d = (object)$arr;
        $selectCols ='formatDate(p.create_date) AS booking_date,formatDate(p.arrival_time) AS arrival_time, p.qr_code AS barcode,p.sender_name,p.sender_phone,p.receiver_phone, p.zone_name, p.product_type,(CASE cod WHEN 1 THEN p.price ELSE 0 END) AS cod_amount, p.cod_fee, p.base_fee,p.delivery_fee,IFNULL(p.forwarding_cost,0) AS forwarding_cost,p.delivery_notes,p.failure_notes,(SELECT ps.name FROM package_statuses AS ps WHERE ps.id =p.status_id LIMIT 1) AS status,p.failure_notes,p.delivery_notes';
        return DB::table('package AS p')->where('p.branch_id',$branch_id)->where('p.delivery_id',$delivery_id)->whereRaw("(p.status_id=6 OR p.status_id =9)")->selectRaw($selectCols)->orderByRaw('p.sender_id')->get();          
     }

     function package_in_trip($branch_id,$delivery_id=-1,$barcode=null,$find_by='barcode'){
         if(empty($delivery_id)) $delivery_id = -1; //avoid Semantic error or problem
        if ($find_by =='barcode') 
           return DB::table('package AS p')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->where('qr_code',$barcode)->take(1)->exists();
        else // if ($find_by =='id') 
           return DB::table('package AS p')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->where('id',$barcode)->take(1)->exists();
     }

    //return tripInfo and packages list. This function is used by Driver mobile app to show packages by trip identity 
    function getPackageListByTrip($arr,$ss=null){
        $ss = $ss?$ss:$this->userInfo;
        $d = (object)$arr;
        $branch_id = $ss->branch_id;
        $delivery_id = isset($d->delivery_id)?$d->delivery_id:0;
        $on_delivery_status_id = 6;
        //$trip_code = isset($d->fleet_tracking_number)?$d->fleet_tracking_number:null;
        //$delivery_id = isset($d->id)?$d->id:0;

        //$str_driver =null;
        //if ($driver_id > 0) $str_driver = " AND d.driver_id ='".$driver_id."' ";
        
        //$str_status = null; //" AND p.status_id IN (8,9,10,11)";
        $trip_header_cols = 'd.id as delivery_id,d.driver_id,d.fleet_tracking_number, d.warehouse_id, (SELECT w.name FROM warehouses AS w WHERE w.branch_id =d.branch_id AND w.id = d.warehouse_id LIMIT 1) AS from_warehouse_name, d.vehicle_type,formatTime(d.create_date) AS booking_date, formatDate(d.depart_time) AS depart_date, DATE_FORMAT(d.depart_time,\'%r\') AS depart_time, (SELECT name FROM delivery_statuses AS ds WHERE ds.id = d.status_id LIMIT 1) AS trip_status, d.package_count,d.delivered_count, d.failed_count';
        $h_row = DB::table('delivery AS d')->where('d.branch_id',$branch_id)->where('d.id',$delivery_id)->selectRaw($trip_header_cols)->take(1)->first();
        if($h_row){
            $selectCols ='p.delivery_id,p.delivery_type,p.receiver_address,p.receiver_phone,p.qr_code AS barcode,s.`name` AS sender_name,s.phone_number AS sender_phone,p.package_name, p.product_type,p.dim_x, p.dim_y, p.dim_h,p.actual_kg,(IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0)) AS fees,p.billed_kg,p.price,p.cod, p.cod_fee, p.base_fee,p.delivery_fee, p.zone_code,p.zone_name, IFNULL(p.forwarding_cost,0) AS forwarding_cost,p.delivery_notes,p.failure_notes, IFNULL(p.driver_total,0) AS driver_total,IFNULL(p.sender_total,0) AS sender_total, p.exchange_rate AS exchange_rate,p.status_id, (SELECT ps.name FROM package_statuses AS ps WHERE ps.id =p.status_id LIMIT 1) AS status, DATE_FORMAT(p.arrival_time,\'%d %b %Y %r\') AS arrival_time,
            (CASE p.status_id WHEN 9 THEN p.failure_notes WHEN 11 THEN p.failure_notes ELSE p.delivery_notes END) AS remarks,p.agent_notes';
            $h_row->packages = DB::table('package AS p')->join('sender AS s','s.id','=','p.sender_id')->where('p.branch_id',$branch_id)->where('p.delivery_id',$h_row->delivery_id)->where('p.status_id',$on_delivery_status_id)->selectRaw($selectCols)->orderByRaw('p.sender_id')->get();          
            return $h_row;
        } 
        return null;
    }
 
    //deleteNewTrip() is to delete Newly Created Trip without deleting related packages.
    //deleteDeliveryTrip() is to permmantently delete whole trip info including all related packages
    //deleteNewTrip() is to clean out the trip info or delivery rrecord when driver or user quit scanning of packages by pressing Close or Cancel button on the "New Delivery Trip" dialog 
    function deleteNewTrip($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task
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
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task
        $branch_id = $ss->branch_id;
        $delivery_id = isset($d->delivery_id)?$d->delivery_id:0;
        $trip_status_id = null;
        $test_count = 0;  
        $rows = DB::table('package AS p')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->selectRaw('p.id')->take(1)->get();
        foreach($rows as $row) $test_count = 1;
        if ($test_count > 0) {
            //$rows = DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->selectRaw('status_id')->take(1)->get(); 
            //foreach($rows as $row) $trip_status_id = $row->status_id;
            //if ($trip_status_id ==2) {
                return 'មិនអាចលុបជើងដឹកមាបទេ។​ អ្នកអាចដកទំនិញចេញពីជើងដឹកមួយនេះសិនទើបលុបបាន';
            //}
        }
        DB::table('package')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->update(array('delivery_id'=>null,'status_id'=>5,'outstanding'=>1));
        DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->delete();
        return null;
    }

    static function trackChange($ss,$action_name,$des,$table_name,$pk_field,$pk_value){
     try{
        $inputs= ['target_table'=>$table_name,'pk_field'=>$pk_field,'pk_value'=>$pk_value,'action_name'=>$action_name,'description'=>$des];
        $id = saveData($ss,'general_tracks',['id'=>null],$inputs,[],1,false);
        return null;
     }catch(\Exception $e){
        Log::error('Failed to create general track of action done by '.$ss->full_name);
            Log::error($e->getMessage());
            Log::error($e->getTraceAsString());
     }
    }

    function changeDeliveryDriver($arr,$id=null,$ss=null){
        $ss = $ss ??$this->userInfo;
        $delivery_id = $id ?? $this->id;
        $branch_id = $ss->branch_id;
        $d = (object)$arr;
        $delivery_id = $delivery_id ?? (isset($d->delivery_id)?$d->delivery_id:null);
        $driver_id = isset($d->driver_id)?$d->driver_id:null;
        
        $trip = DB::table('delivery as d')->where('id',$delivery_id)->selectRaw('id,status_id,driver_id,fleet_tracking_number')->take(1)->first();
        if(!$trip) return DV::error('Delivery ID does not exist');
        if (!UM::allowed(284)) return DV::error('You need permission number ? to change driver::'.'284');
        if($trip->driver_id == $driver_id) return DV::depends(1);
        if($trip->status_id ==3) return DV::error('Cannot change driver for finished trips');
        $nowTime = getNowTime();
        if(!$driver_id) return DV::error('The provided Driver ID is invalid or empty');
        $driver = DB::table('driver as d')->where('d.id',$driver_id)->selectRaw('id,name,code,LOWER(status_code) AS status_code')->take(1)->first();
        if(!$driver) return DV::error('Driver ID does not exist');
        if ($driver->status_code !='active') return DV::error('The driver is not currently active');
       
        DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->update([
            'driver_id'=>$driver_id,
            'update_user'=>$ss->login_name,
            'update_date'=>$nowTime
        ]);
        DB::table('package')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->update([
            'driver_id'=>$driver_id,
            'update_user'=>$ss->login_name,
            'update_date'=> $nowTime
        ]);

        $old_driver_name = DB::table('driver')->where('id',$trip->driver_id)->take(1)->value('name');
        $des = $ss->full_name.' changed driver from '.$old_driver_name.' to new driver '.$driver->name. '. Trip ID: '.$trip->id.' trip number: '.$trip->fleet_tracking_number.' at '.date('d M Y h:i'); 
        self::trackChange($ss,'change_delivery_driver',$des,'delivery','id',$delivery_id);
        //todo: create notofication and send it to the responsible driver
        return DV::depends(1);
    }

    //count number of packges by a given trip id (e.g: @delivery_id). parameter @status_id is optional. If @status_id is not given then this function returns all package belonging to a given trip  
    function countPackagesByTrip($d =[], $id,$ss=null){
        $id =$id?$id:$this->getId();
        $ss = $ss?$ss:$this->getUserInfo();
        $branch_id = $ss->branch_id;
        $d = (object)$arr;
        $delivery_id = isset($d['delivery_id'])?$d['delivery_id']:0;
        $status_id = isset($d['status_id'])? Sanitizer::sanitize($d['status_id']):null;
        $cnt = $this->getPackageCountByStatus($branch_id,$delivery_id,$status_id);
        return is_numeric($cnt)?$cnt:0;
    }

    function getForm_options_trip_list($data) {
        $ss = UM::getUserInfoByToken($data);
        if ($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task      

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
