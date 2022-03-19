<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use App\Models\DV;
use Session;
use DB;

class Package extends Model
{
    use HasFactory;
    // protected $fillable = ['package_id','order_id','driver_id','status','failure_notes','depart_time','arrival_time','notes'];
    // protected $table = 'delivery';
 
    //getpackageExpandedDetails() = getPackageDetails()
    function getPackageDetails($d){
      $ss = getSessionInfo($d);
      if(!$ss) return '#350'; //user not authenticated
      if (!prn_allowed(2)) return '@'; //need permission to do this task
      $branch_id = $ss->branch_id;
      $package_id = $d->package_id;

      $rows = DB::table('package AS p')->where('p.branch_id',$branch_id)->where('p.id',$package_id)->selectRaw("p.id AS package_id,p.delivery_id, p.qr_code AS barcode, p.sender_id,p.sender_name,p.sender_phone, p.package_name,p.dim_x,p.dim_y,p.dim_h,p.delivery_type,p.zone_code,p.zone_name,p.receiver_phone,p.receiver_address, p.cod, 0 AS cod_fee_percent, p.cod_fee, p.base_fee, p.delivery_fee, p.driver_adjust_amount,p.forwarding_cost,p.price,p.actual_kg,p.billed_kg,p.df_payer,p.agent_notes,p.delivery_notes, p.status_id, (SELECT name FROM driver WHERE id = p.driver_id LIMIT 1) AS driver_name, p.driver_total, p.sender_total")->limit(1)->get(); 
       foreach($rows as $row) return $row;
       return null; 
    } 
 
    //given a @driver_id, returns a default warehouse info (id,name, map_location). Used for Driver mobile app to identify a target warehouse to bring pickup packages to, or to deliver packages from 
    function getWarehouseByDriver_default($branch_id,$driver_id){
      //NOTE: dw.is_default =1
       $rows = DB::table('driver_warehouses AS dw')->joint('warehouses AS h','h.id','=','dw.warehouse_id')->where('dw.branch_id',$branch_id)->where('dw.driver_id',$driver_id)->where('is_default',1)->selectRaw('h.id,h.name,h.map_location')->limit(1)->get();
       foreach($rows as $row) return $row;
       return null;  
    }
    
    //returns a default warehouse_id for a driver or delivery person
    function getWarehouseIdByDriver_default($branch_id,$driver_id){
      $rows = DB::table('driver_warehouses AS dw')->where('dw.branch_id',$branch_id)->where('dw.driver_id',$driver_id)->where('is_default',1)->selectRaw('dw.warehouse_id')->limit(1)->get();
      foreach($rows as $row) return $row->warehouse_id;
      return null;  
    }

    function getPackageDetailsByBarcode($d){
      $ss = getSessionInfo($d);
      if(!$ss) return '#350'; //user not authenticated
      if (!prn_allowed(2)) return '@'; //need permission to do this task
      $branch_id = $ss->branch_id;
      $barcode = $d->barcode;

      $rows = DB::table('package AS p')->where('p.branch_id',$branch_id)->where('p.qr_code',$barcode)->selectRaw("p.id AS package_id,p.delivery_id, p.qr_code AS barcode, p.sender_id,p.sender_name,p.sender_phone, p.package_name,p.dim_x,p.dim_y,p.dim_h, p.zone_code,p.zone_name,p.receiver_phone, p.cod, 0 AS cod_fee_percent, p.cod_fee, p.base_fee, p.delivery_fee, p.driver_adjust_amount,p.forwarding_cost,p.price,p.df_payer,p.agent_notes,p.delivery_notes, p.status_id, (SELECT `name` FROM `driver` WHERE id = p.driver_id LIMIT 1) AS driver_name")->limit(1)->get(); 
       foreach($rows as $row) return $row;
       return null; 
    }

    //base_price is fixed price set as Promotion for some sellers. NOTE @zone_code is nevery empty. @zone_code ='all' instead of empty
    function getBaseFee($ss,$sender_id,$delivery_type='all',$zone_code='all',$billed_kg=null){
      $branch_id = $ss->branch_id;
      $today = date('Y-m-d');
      if ($sender_id > 0){
        $str_dates = "( DATE(p.end_date) >='".$today."' OR p.never_expires =1)";
        $rows = DB::table('sender_base_price AS p')->where('p.branch_id',$branch_id)->where('p.sender_id',$sender_id)->where('delivery_type',$delivery_type)->where('zone_code',$zone_code)->whereRaw($str_dates)->selectRaw("p.price")->limit(1)->get();
        foreach($rows as $row) return is_numeric($row->price)?$row->price:0; 
      } 
      $def_base_fee = get_settings_value($ss,'DEFAULT_BASE_FEE','number');
      return is_numeric($def_base_fee)?$def_base_fee:0;  
    }
    
    function getPriceListIdBySender($sender_id){
       $rows = DB::table('sender AS s')->where('id',$sender_id)->selectRaw("price_list_id")->limit(1)->get();
       foreach($rows as $row) return $row->price_list_id;
       return null;
    } 

 

    //getDeliveryPrice|getDeliveryPriceInfo|getFee|getServiceFee 
    //returns object {'base_fee','delivery_fee','cod_fee_percent'}
    function getDeliveryPriceInfo($branch_id,$sender_id,$delivery_type,$zone_code='all',$billed_kg=0) {
      //$branch_id = $ss->branch_id;
      $delivery_fee =-1;
      $base_fee =-1;
      $today = date('Y-m-d');
      $table ="price_list AS l";
      
      $data = (object)array('delivery_fee'=>-1,'base_fee'=>-1,'cod_fee_percent'=>-1,'error_message'=>null,'status'=>'OK');

      $price_list_id = $this->getPriceListIdBySender($sender_id); /** derived price_list_id from table "sender". NOTE that each sender has his or her price_list_is **/
      $str_price_list = null;
      if (!$price_list_id){
        if(!$sender_id || $sender_id <=0)
          $data->error_message ="This merchant ID is invalid or empty";
        else
          $data->error_message ="This merchant does not have price list";
        $data->status ='Error';
        return $data;
      }

      $str_zone =" AND (l.zone_codes LIKE '%|".$zone_code."|%' OR  l.zone_codes LIKE '%|0|%') ";
      $str_dates = " AND (l.end_date>='".$today."' OR l.never_expires =1)";
      $str_kg = " AND kg_within(IFNULL(l.start_kg,0),IFNULL(l.end_kg,0),".$billed_kg.")=1"; 
      //if ($sender_id > 0) {
        //$table ="sender_price_list AS l"; // |0| is same as |all| for (All Senders) (All Zones)
        $str_price_list =" AND (l.price_list_id='$price_list_id')";
      //}
      
      $more_wheres = "1=1 ".$str_dates.$str_kg.$str_price_list.$str_zone;
      $rows = DB::table($table)->where('l.branch_id',$branch_id)->whereRaw("delivery_type ='".$delivery_type."'")->whereRaw($more_wheres)->selectRaw("IFNULL(l.base_price,0) AS base_fee,IFNULL(l.price,0) AS price,IFNULL(l.price_per_kg,0) AS price_per_kg,IFNULL(l.start_kg,0) AS start_kg, l.price_option")->limit(1)->get();
      foreach($rows as $row) {
        $base_fee = $row->base_fee; //base_price
        $price_option = Strtolower($row->price_option);
        if ( $price_option =='per_kg' ||  $price_option=="per kg") 
         {
          $billed_kg = $billed_kg - (is_numeric($row->start_kg)?$row->start_kg:0);
          if($billed_kg < 0) $billed_kg =0;
           if (!is_numeric($row->price_per_kg)) $row->price_per_kg =0;
           $delivery_fee = $row->price_per_kg * $billed_kg;
         }
        else
           $delivery_fee = is_numeric($row->price)?$row->price:0;    
      } 
      //$str_valid = null;//" AND ((DATE(c.start_date) <='".$today."' AND DATE(c.end_date) >='".$today."') OR (c.never_expires =1))";
      $more_wheres = "1=1 "; //.$str_valid;
      $cod_fee_percent =0;
      $rows = DB::table('sender_cod_charges AS c')->where('c.branch_id',$branch_id)->where('c.sender_id',$sender_id)->whereRaw("c.delivery_type ='".$delivery_type."'")->whereRaw($more_wheres)->selectRaw("IFNULL(c.cod_fee_percent,0) AS cod_fee_percent")->limit(1)->get();
      foreach($rows as $row) $cod_fee_percent = $row->cod_fee_percent;
      $err = null;
      if($delivery_fee <0 || $base_fee <0) $err ='រកមិនឃើញតំលៃក្នុងតារាងកំណត់';
      $data = (object)array('delivery_fee'=>$delivery_fee,'base_fee'=>$base_fee,'cod_fee_percent'=>$cod_fee_percent);
      if ($err != null) {
        $data->status ='Error';
        $data->error_message =$err;
      }
       return $data;
    }

    function getDeliveryFee($ss,$sender_id,$delivery_type,$zone_code='all',$billed_kg=0){
      $branch_id = $ss->branch_id;
      $delivery_fee =0;
      $today = date('Y-m-d');
      $table ="price_list AS l";
      $str_sender =null;
      $str_zone = " AND (CONCAT('|',l.zone_codes,'|') LIKE '%|".$zone_code."|%') ";
      $str_dates = " AND ( DATE(l.end_date) >='".$today."' OR l.never_expires =1)";
      $str_kg = " AND IFNULL(l.start_kg,0) <=".$billed_kg." AND IFNULL(l.end_kg,0) >=".$billed_kg; 
      if ($sender_id > 0) {
        //$table ="sender_price_list AS l";
        $str_sender =" AND CONCAT('|',l.sender_ids,'|') LIKE '%|".$sender_id."%|'";
      }
      
      $more_wheres = "1=1 ".$str_dates.$str_kg.$str_sender.$str_zone;
      $rows = DB::table($table)->where('l.branch_id',$branch_id)->where('l.delivery_type',$delivery_type)->where('zone_code',$zone_code)->whereRaw($more_wheres)->selectRaw("IFNULL(l.price,0) AS price,IFNULL(l.price_per_kg,0) AS price_per_kg,IFNULL(l.start_kg,0) AS start_kg,l.price_option")->limit(1)->get();
     
      foreach($rows as $row) {
        if (Strtolower($row->price_option) =='per_kg') {
          $billed_kg = $billed_kg - (is_numeric($row->start_kg)?$row->start_kg:0);
          if ($billed_kg  < 0) $billed_kg =0;
          $delivery_fee = $row->price_per_kg * $billed_kg;
        }
        else
           $delivery_fee = $row->price;    
      } 
       return $delivery_fee;  
    }

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

    //getExchangeRate() returns exchange rate based on given @sender_id or @sender_code. It will returns defaul rates from generall settings if there is no matching rates within the current month
    function getExchangeRate($ss,$sender_code_or_id, $findBy){
        $branch_id = $ss->branch_id; 
        if($findBy =='id') {
           if ($sender_code_or_id<=0 || !is_numeric($sender_code_or_id)) $sender_code_or_id =null;
        }

        $rows = [];
        $this_month = date('m');
        $more_wheres = "x.x_month ='".$this_month."'";
        if (!empty($sender_code_or_id)) {
          if ($findBy=='id')
             $rows = DB::table('sender_exchange_rates AS x')->where('branch_id',$branch_id)->where('sender_id',$sender_code_or_id)->whereRaw($more_wheres)->selectRaw('x.buy_rate,x.sell_rate')->limit(1)->get();   
          else 
             $rows = DB::table('sender_exchange_rates AS x')->join('sender AS s','s.id','=','x.sender_id')->where('x.branch_id',$branch_id)->where('s.code',$sender_code_or_id)->whereRaw($more_wheres)->selectRaw('x.buy_rate,x.sell_rate')->limit(1)->get(); 
        } else{
             $rows = DB::table('exchange_rates AS x')->where('x.branch_id',$branch_id)->whereRaw($more_wheres)->selectRaw('x.buy_rate,x.sell_rate')->limit(1)->get();   
        }
       foreach($rows as $row){
          $row->buy_rate = is_numeric($row->buy_rate)?$row->buy_rate:1;
          $row->sell_rate = is_numeric($row->sell_rate)?$row->sell_rate:1;
          return $row;
       }  
       $def_rates =(object)[];
       $def_rates->buy_rate = get_settings_value($ss,'EXCHANGE_RATE_BUY','number');
       $def_rates->sell_rate = get_settings_value($ss,'EXCHANGE_RATE_SELL','number');
       $def_rates->buy_rate = is_numeric( $def_rates->buy_rate )? $def_rates->buy_rate :1; 
       $def_rates->sell_rate = is_numeric( $def_rates->sell_rate )? $def_rates->sell_rate :1;  
       return $def_rates;
    }

    function returnPackage($d){
      $ss = getSessionInfo($d);
      if(!$ss) return '#350'; //user not authenticated
      if (!prn_allowed(2)) return '@'; //need permission to do this task
      $branch_id = $ss->branch_id;
      $package_id = $d->package_id;
      $remarks = isset($d->remarks)?$d->remarks:null;
      $sender_id = null; 
      $status_id = null;
      $res= (object)[];

      //get senderId
         $rows = DB::table('package')->where('id',$package_id)->selectRaw('sender_id, status_id')->limit(1)->get();
         foreach($rows as $row){
           $sender_id = $row->sender_id;
           $status_id = $row->status_id;
         }
      //end of get SenderId
      if (!$sender_id){
        $res->error_message = "Unidentify sender of this package";
        $res->status ='Error';
        return $res;
      }
      //9 == Failed => 11 = Returned
      if($status_id !=9){
         if($status_id ==11) {
            $res->error_message = "The package already returned";
         }else $res->error_message = "Only failed package can be returned";
         $res->status ='Error';
         return $res;
      } 

      $return_date = date('Y-m-d'); 
      DB::table('returned_packages')->where('branch_id',$branch_id)->where('package_id',$package_id)->delete();
      DB::table('returned_packages')->insert(array(
        'branch_id'=>$branch_id,
        'sender_id'=>$sender_id,
        'package_id'=>$package_id,
        'remarks'=>$remarks,
        'create_user'=>$ss->login_name,
        'create_date'=>getNowTime(),
        'return_date'=>$return_date
      ));

      /** 11 = Returned status **/ 
      $return_status_id =11; 
      $res->return_id = DB::getPdo()->lastInsertId();
      if (  $res->return_id  > 0) {
        //set package's Outstanding =0 and status_id to 11
         DB::table('package')->where('branch_id',$branch_id)->where('id',$package_id)->update(array(
           'status_id'=>$return_status_id,
           'outstanding'=>0
         ));
      }
      $res->error_message = NULL;
      $res->status ='OK';
      return $res;
    }

    function getPackageInfo($d){
      $ss = getSessionInfo($d);
      if(!$ss) return '#350'; //user not authenticated
      if (!prn_allowed(2)) return '@'; //need permission to do this task
      $branch_id = $ss->branch_id;
      $package_id = $d->package_id;

      $rows = DB::table('package AS p')->join('delivery AS d','d.id','=','p.delivery_id')->join('package_statuses AS ps','ps.id','=','p.status_id')->where('p.branch_id',$branch_id)->where('p.id',$package_id)->selectRaw("p.id AS package_id,d.id AS delivery_id, p.qr_code AS barcode, p.sender_id,p.sender_name,p.sender_phone, p.package_name,p.dim_x,p.dim_y,p.dim_h, p.receiver_name,p.delivery_type,p.receiver_phone, p.zone_code,p.zone_name,p.receiver_phone, p.cod, 0 AS cod_fee_percent, p.cod_fee, p.base_fee, p.delivery_fee,p.sender_adjust_amount, p.driver_adjust_amount,p.forwarding_cost,p.price,p.df_payer,p.agent_notes,p.delivery_notes, (SELECT `name` FROM driver WHERE id =p.driver_id LIMIT 1) AS driver_name,p.status_id,ps.name AS status")->limit(1)->get(); 
       foreach($rows as $row) return $row;
       return null; 
    } 

    function getDeliveryType($branch_id,$package_id){
       $rows = DB::table('package AS p')->where('branch_id',$branch_id)->where('id',$package_id)->selectRaw('p.delivery_type')->limit(1)->get();
       foreach($rows as $row) return $row->delivery_type;
       return null;
    }
 
    //savePackageDetails SaveExpandedPackageDetails
    function updatePackageExpandedDetails($d){
      $ss = getSessionInfo($d);
      if(!$ss) return '#350'; //user not authenticated
      if (!prn_allowed(2)) return '@'; //need permission to do this task
      $data = (object)array('status'=>'Error','error_message'=>'Action not yet performed','details'=>null);

      $branch_id = $ss->branch_id;
      $package_id = $d->package_id;
      
      $d->dim_x = isset($d->dim_x)?$d->dim_x:0;
      $d->dim_y = isset($d->dim_y)? $d->dim_y:0;
      $d->dim_h = isset($d->dim_h)? $d->dim_h:0;

      $actual_kg = isset($d->actual_kg)?$d->actual_kg:0;
      $receiver_address = isset($d->receiver_address)? $d->receiver_address:null;
      $receiver_phone = isset($d->receiver_phone)?$d->receiver_phone:null;
      //The following are price determinants variables
      $sender_id = isset($d->sender_id)?$d->sender_id:0;
      $delivery_type = isset($d->delivery_type)?sanitize($d->delivery_type):null;
      $zone_code = isset($d->zone_code)?$d->zone_code:null;
      //$zone_name = isset($d->zone_name)?$d->zone_name:null;
      $billed_kg = isset($d->billed_kg)? $d->billed_kg:0;
      $df_payer = isset($d->df_payer)?sanitize($d->df_payer):null; 
      $cod = isset($d->cod)?$d->cod:null;

      $price = isset($d->price)?sanitize($d->price):0;
      $base_fee = isset($d->base_fee)?sanitize($d->base_fee):0;
      $cod_fee = isset($d->cod_fee)?sanitize($d->cod_fee):0;
      $delivery_fee = isset($d->delivery_fee)?sanitize($d->delivery_fee):0;
      $forwarding_cost = isset($d->forwarding_cost)?sanitize($d->forwarding_cost):0;

      $driver_total = isset($d->driver_total)?$d->driver_total:0;
      $sender_total = isset($d->sender_total)?$d->sender_total:0;

      $deliveryTypes =['normal','fast'];
      if (!in_array(strtolower($delivery_type),$deliveryTypes)) {
        $data->error_message = "Delivery Type is not correct";
        $data->status ='Error';
        return $data;
      } 

      if ($cod !=0 && $cod !=1) {
        $data->error_message = "COD must be Yes or No";
        $data->status ='Error';
        return $data;
      } 

      if (strtolower($df_payer) !='sender' && strtolower($df_payer)!='receiver') {
        $data->error_message = "DFP must be Sender or Receiver";
        $data->status ='Error';
        return $data;
      } 
      
       if (!isset($package_id) || empty($package_id) || $package_id <=0) {
          $data->error_message = "Package identity is not valid";
          $data->status ='Error';
          return $data;
       }
       $zone = $this->getZoneByCode($ss,$zone_code);
       if ($zone ==null) {
        $data->error_message = "Zone code is not valid ";
        $data->status ='Error';
        return $data;
       } 
      //begin::calculation of package pricing to sender and driver
        $cod_amount =0;
        $delivery_fee = 0;
        $cod_fee = 0;
        $cod_fee_percent =0;
        $other_fees =0;
        $base_fee =0;
        $pInfo = $this->getDeliveryPriceInfo($branch_id,$sender_id,$delivery_type,$zone_code,$billed_kg);
        if ($pInfo) {
            $delivery_fee = $pInfo->delivery_fee;
            $base_fee =$pInfo->base_fee;
            $cod_fee_percent = $pInfo->cod_fee_percent;
        }

          // $data->error_message = "testing value: cod_percent = ".$pInfo->cod_fee_percent. "  cod_fee = ".$cod_fee."  base_fee =".$base_fee." delivery_fee = ".$delivery_fee;
          // $data->status ='Error';
          // return $data;
       

        if ($cod ==1 || strtolower($cod) =='yes') {
          $cod_amount = $price;
          $cod_fee = ($price + $base_fee + $delivery_fee) * $cod_fee_percent/100; 
        }
        $driver_total = $cod_amount;
        $sender_total = $cod_fee + $forwarding_cost; //Seller always has to pay forwarding cost or Taxi fee  
        if (strtolower($df_payer) == 'sender') 
            $sender_total += $base_fee + $delivery_fee;
        else 
           $driver_total += $base_fee + $delivery_fee;
      //end::calculation of package pricing to sender and driver
        
      DB::table('package')->where('branch_id',$branch_id)->where('id',$package_id)->update(array(
         'cod'=>$cod,
         'price'=>$price,
         'df_payer'=>$df_payer,
         'delivery_type'=>$delivery_type,
         'zone_code'=>$zone_code,
         'zone_name'=>$zone->zone_name,
         'receiver_phone'=>$receiver_phone,
         'receiver_address'=>$receiver_address, 
         'cod_fee'=>$cod_fee,
         'base_fee'=>$base_fee,
         'delivery_fee'=>$delivery_fee,
         'dim_x'=>$d->dim_x, // width,
         'dim_y'=>$d->dim_y,
         'dim_h'=>$d->dim_h,
         'actual_kg'=>$actual_kg,
         'billed_kg'=>$billed_kg,
         'forwarding_cost'=>$forwarding_cost,
         'delivery_notes'=>$d->delivery_notes,
         'driver_total'=>$driver_total,
         'sender_total'=>$sender_total,
        //  'driver_id'=>$d->driver_id,
        //  'status_id'=>$d->status_id,
         'update_user'=>$ss->login_name,
         'update_date'=>getNowTime()
      ));
     
      //After saving expanded detail, then return the expanded detail back to client for Refresh display
      $rows = DB::table('package AS p')->where('p.branch_id',$branch_id)->where('p.id',$package_id)->selectRaw("p.id AS package_id,p.delivery_id, p.qr_code AS barcode, p.sender_id,p.sender_name,p.sender_phone, p.package_name,p.dim_x,p.dim_y,p.dim_h,p.delivery_type, p.zone_code,p.zone_name,p.receiver_phone,p.receiver_address, p.cod, 0 AS cod_fee_percent, p.cod_fee, p.base_fee, p.delivery_fee, p.driver_adjust_amount,p.sender_adjust_amount,p.forwarding_cost,p.price,p.actual_kg,p.billed_kg,p.df_payer,p.agent_notes,p.delivery_notes,p.sender_total, p.driver_total, p.status_id, (SELECT name FROM driver WHERE id = p.driver_id LIMIT 1) AS driver_name")->limit(1)->get();
      foreach($rows as $row) {
        $data->details = $row;
        $data->status='OK';
        $data->error_message =null;
        return $data;
      }
      return null;  
    }

    function getPackageReceiverInfo($d){
      $ss = getSessionInfo($d);
      if(!$ss) return '#350'; //user not authenticated
      if (!prn_allowed(2)) return '@'; //need permission to do this task
      $branch_id = $ss->branch_id;
      $package_id = $d->package_id;
      $rows = DB::table('package AS p')->where('p.branch_id',$branch_id)->where('p.id',$package_id)->selectRaw("p.id, DATE_FORMAT(p.delivery_time,'%d %b %Y %r') AS delivery_time, p.sender_id, p.delivery_type,IFNULL(p.billed_kg,0) AS billed_kg, p.receiver_name, p.receiver_phone, p.zone_code,p.zone_name,p.base_fee,p.delivery_fee, p.billed_kg,s.name AS sender_name, s.phone_number AS sender_phone, (SELECT name FROM package_statuses AS ps WHERE ps.id =p.status_id LIMIT 1) AS status")->join('sender as s','s.id','=','p.sender_id')->limit(1)->get();
      foreach($rows as $row) return $row;
      return null;
    }

    //getDeliveryPrice|getDeliveryPriceInfo|getFee|getServiceFee 
    function getDeliveryPriceInfo_api($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $sender_id = isset($d->sender_id)?$d->sender_id:null;
        $delivery_type =isset( $d->delivery_type)? $d->delivery_type:null;
        $zone_code = isset($d->zone_code)?$d->zone_code:null;
        $billed_kg = isset($d->billed_kg)?$d->billed_kg:0;

        return $this->getDeliveryPriceInfo($branch_id,$sender_id,$delivery_type,$zone_code,$billed_kg); 
    }

    function updatePackageReceiverInfo($d){
      $ss = getSessionInfo($d);
      if(!$ss) return '#350'; //user not authenticated
      if (!prn_allowed(2)) return '@'; //need permission to do this task
      $branch_id = $ss->branch_id;
      $package_id = isset($d->package_id)?$d->package_id:0;
      $d->receiver_name = isset($d->receiver_name)?$d->receiver_name:null;
      $d->receiver_phone = isset($d->receiver_phone)?$d->receiver_phone:null;
      $d->zone_code = isset($d->zone_code)?$d->zone_code:null;
      $d->base_fee = isset($d->base_fee)?$d->base_fee:0;
      $d->delivery_fee = isset($d->delivery_fee)?$d->delivery_fee:0;

      $zone_name = null;
      $zone = $this->getZoneByCode($ss,$d->zone_code);
      if ($zone != null) $zone_name = $zone->zone_name; 
      DB::table('package')->where('branch_id',$branch_id)->where('id',$package_id)->update(array(
        'receiver_name'=>$d->receiver_name,
        'receiver_phone'=>$d->receiver_phone,
        'zone_code'=>$d->zone_code,
        'zone_name'=>$zone_name,
        'base_fee'=>$d->base_fee,
        'delivery_fee'=>$d->delivery_fee,
        'update_user'=>$ss->login_name,
        'update_date'=>getNowTime() 
      ));

      return null;
    }

    function createDelivery($data){
      $ss = getSessionInfo($data);
      if(!$ss) return '#350'; //user not authenticated
      if (!prn_allowed(2)) return '@'; //need permission to do this task

        $branch_id = $ss->branch_id;
        $result = (object)[];
        if(empty($data->sender_code)) $data->sender_code =null;
        if (empty($data->zone_code)) {
          $result->error_message ="Zone code is not correct";
          $result->status ='Error';
         return $result;
        } 
       
       $driver_id = null; 
       $d = $this->getDriverInfoByCode($ss,$data->driver_code);
     //   if($d ==null) {
     //     $result->error_message ="Driver information is not correct";
     //     $result->status ='Error';
     //     return $result;
     //   } 
       if ($d != null) $driver_id = $d->driver_id;

       $sender = $this->getSenderInfoByCode($data); /** $data->acc_tk_dms, $data->sender_code**/
 
       if ($sender==null) {
         $result->error_message ="Sender or Merchant information is not valid";
         $result->status ='Error';
         return $result;
       }
       if (empty($data->receiver_phone)) {
         $result->error_message ="Receiver phone number cannot be empty";
         $result->status ='Error';
         return $result;
       }
 
       if (empty($data->zone_code)) {
         $result->error_message ="Destination Zone code cannot be empty";
         $result->status ='Error';
         return $result;
       }
       
        $data->depart_time = date('Y-m-d',strtotime($data->depart_time));
        if(!(bool)strtotime($data->depart_time)) $data->depart_time = date('Y-m-d');
        if(empty($data->delivery_type)) $data->delivery_type= 'Normal';
        $order_id = null;
        $def_status ='pending'; // status_name "Pending"
        
        $order_code = isset($d->order_code)?$d->order_code:null;
        $order_id = isset($order_id)?$order_id:0;
        $rows= [];
        $def_delivery_type =null;
        if ($order_id > 0)
           $rows = DB::table('order')->selectRaw('code,id,request_vehicle_type, delivery_type')->where('branch_id',$branch_id)->where('id',$order_id)->limit(1)->get();
        else
           $rows = DB::table('order')->selectRaw('code,id,request_vehicle_type, delivery_type')->where('branch_id',$branch_id)->where('code',$order_code)->limit(1)->get();   
        foreach($rows as $row) {
           $order_id = $row->id;
           $order_code = $row->code;
           $def_delivery_type = $row->delivery_type;
           $vehicle_type = $row->request_vehicle_type;
        }

        if (empty($data->delivery_type)) $data->delivery_type = $def_delivery_type;

        DB::table('delivery')->insert(array(
            'branch_id'=>$branch_id,
            'delivery_type'=>$data->delivery_type,
            'depart_time'=>$data->depart_time,
            'sender_id'=>$sender->id,
            'order_id'=>$order_id,
            'driver_id'=>$driver_id,
            'destination_zone_code'=>$data->zone_code,
            'receiver_address'=>$data->receiver_address,
            'destination_map_location'=>$data->destination_map_location,
            'receiver_phone'=>$data->receiver_phone,
            'delivery_notes'=>$data->delivery_notes,
            'status'=>$def_status, //{IP,'Delivered','TBD','Partially Delivered','Returned'}
            'package_count'=>0,
            'delivered_count'=>0,
            'create_user'=>1 //session('user_name'),
            ,'create_date'=>getNowTime()
 
        ));
        
        $new_id = DB::getPdo()->lastInsertId();
 
        //$c = {'collect_pmt','df_payer_type','dimemsion','weight_kg','cubic_meter-size','delivery_fee','price','qr_code'} 
        if($new_id > 0) {
            $i= 0;
            $c;
            do{
               if(!isset($data->packages[$i])) break;
               $c = (object)$data->packages[$i];
 
                if (!isset($c->package_name)) $c->package_name =$data->receiver_phone;
                if (!isset($c->product_type)) $c->product_type =null;
                if (!isset($c->dimension)) $c->dimension =null;
                if (!isset($c->weight_kg)) $c->weight_kg =0;
                if (!isset($c->price)) $c->price =0;
                if (!isset($c->qr_code)) $c->qr_code =null;
 
                if (!isset($c->df_payer_type)) $c->df_payer_type ='merchant';
                if (!isset($c->delivery_fee)) $c->delivery_fee =0;
                if (!isset($c->cubic_meter_size)) $c->cubic_meter_size =0;
                if (!isset($c->cod)) $c->cod =0;
 
                if(!is_numeric($c->weight_kg)) $c->weight_kg =0;
                $def_status ='pending';
                $zone = $this->getZoneInfo($data->zone_code);
                if (!$zone) $zone = (object)array('zone_name'=>null,'zone_code'=>null,'country_id'=>null,'city_id'=>null,'district_id'=>null,'commune_id'=>null); 
                $qr_code = $this->createQRCode($ss,10);
                DB::table('package')->insert(array(
                    'branch_id'=>$branch_id,
                    'delivery_id'=>$new_id,
                    'dimension'=>$c->dimension,
                    'weight_kg'=>$c->weight_kg,
                    'price'=>$c->price,
                    'qr_code'=>$qr_code,
                    'product_type'=>$c->product_type,
                    //'df_payer_type'=>$c->df_payer_type, /** COD or non-COD (Cash On Delivery) **/
                  
                    'cubic_meter_size'=>$c->cubic_meter_size,
                    'status'=>$def_status,
                    //'receiver_phone'=>$data->receiver_phone,
                    //'receiver_address'=>$data->receiver_address,
                    'cod'=>$c->cod, /** Cash on Delivery => COD = {0,1} which means COD or Non-COD**/
                    'df_payer'=>$c->df_payer,
                    'delivery_fee'=>$c->delivery_fee,
                    'receiver_address'=>$c->receiver_address,
                    'receiver_phone'=>$c->receiver_phone,
                    'receiver_name'=>$c->receiver_name,
                    'zone_code'=>$c->zone_code,
                    'zone_name'=>$zone->zone_name,
                    'district_id'=>$zone->district_id, 
                    'commune_id'=>$zone->commune_id,
                    'city_id'=>$zone->city_id,
                    'country_id'=>$zone->country_id,
                    'create_user'=>session('login_name'),
                    'create_date'=>date('Y-m-d')
                ));  
               $i++;
            }while($c);
             
             $tracking_number = $this->getTrackingNumber($ss,$new_id);
            //begin:: update delviery.package_count, delviered_count
             $cnt = $this->getPackageCountByStatus($ss,$new_id,null);
             $delivered_status_id =8;
             $delivered_cnt = $this->getPackageCountByStatus($ss,$new_id,$delivered_status_id);
             DB::table('delivery')->where('branch_id',$branch_id)->where('id',$new_id)->update(array(
                 'delivered_count'=>$delivered_cnt,
                 'package_count'=>$cnt,
                 'tracking_number'=>$tracking_number
             ));
           //end:: update delviery.package_count, delviered_count
        }
 
        $result->status ='OK';
        $result->error_message =null;
        $result->delivery_id = $new_id;
        return $result;
     }
 
     //return random nummber at a specified range ($min,$max)
    function getRandomNumbers($min, $max, $total) {
        $temp_arr = array();
        while(sizeof($temp_arr) < $total) $temp_arr[rand($min, $max)] = true;
        return $temp_arr;
    }
 
    //returns {'zone_name','price','base_price','sender_base_price','price_per_kg','cod_fee_percent','cod_fee':0}
    function getZonePrices($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        //$allowable_statuses = ['pending','delayed','failed','delivered','otw','pd']; 
        return null;
       ///////////

        $branch_id = sanitize($ss->branch_id);
        $zone_code = isset($d->zone_code)?$d->zone_code:null;
        $sender_id = isset($d->sender_id)? sanitize($d->sender_id):0; //optional
        $billed_kg = isset($d->billed_kg)?sanitize($d->billed_kg):0; //optional
        $delivery_type = isset($d->delivery_type)?sanitize($d->delivery_type):'Normal'; //Default to "Normal"

        $cod_fee_percent =0;
        $cod_fee =0;
        if ($sender_id>0) {
            $rows = DB::table('sender_cod_charges AS c')->where('branch_id',$branch_id)->where('sender_id',$sender_id)->selectRaw('c.cod_fee_percent, 0 AS cod_fee')->limit(1)->get();
            foreach($rows as $row) {
              $cod_fee = $row->cod_fee;
              $cod_fee_percent = $row->cod_fee_percent;
            } 

            $more_wheres =" l.start_kg <=".$billed_kg." AND l.end_kg >= ".$billed_kg;
            $rows = DB::table('sender_price_list AS l')->where('branch_id',$branch_id)->where('l.sender_id',$sender_id)->where('l.zone_code',$zone_code)->where('l.delivery_type',$delivery_type)->whereRaw($more_wheres)->selectRaw('(SELECT z.zone_name FROM zones AS z WHERE z.branch_id =l.branch_id AND z.zone_code =l.zone_code LIMIT 1) AS zone_name, l.price,l.base_price, l.price_per_kg')->limit(1)->get();
            foreach($rows as $row) {
              $row->cod_fee_percent = $cod_fee_percent;
              $row->cod_fee = $cod_fee;
              //$row->base_price is base_price in table "sender_price_list.base_price"
              $row->sender_base_price = $this->getSenderBasePrice($ss,$sender_id); /** base_price from table "sender_base_price" where there is some validity period **/
              return $row;
            }
        } 

        //In the following case: there is no sender_id specified or there is no price info for the given @sender_id in the given (@zone_code,@deliery_type)
            $rows = DB::table('price_list AS l')->where('branch_id',$branch_id)->where('l.zone_code',$zone_code)->where('l.delivery_type',$delivery_type)->whereRaw($more_wheres)->selectRaw('(SELECT z.zone_name FROM zones AS z WHERE z.branch_id =l.branch_id AND z.zone_code =l.zone_code LIMIT 1) AS zone_name, l.price,l.base_price AS base_fee, l.price_per_kg')->limit(1)->get();
            foreach($rows as $row) {
              $row->cod_fee_percent = $cod_fee_percent;
              $row->cod_fee = $cod_fee;
              $row->sender_base_price = $row->base_price;
              return $row;
            }
            $def_data = (object)array('error_message'=>'Price information in zone code `'.$zone_code.'` not found!');
            $def_data->zone_name = null;
            $rows = DB::table('zones AS z')->where('z.branch_id',$branch_id)->where('z.zone_code',$zone_code)->selectRaw('z.zone_name')->limit(1)->get();
            foreach($rows as $row) $def_data->zone_name = $row->zone_name;
            return $def_data;
    }

    function getSenderBasePrice($uss,$sender_id){
      $branch_id = sanitize($uss->branch_id);
      $today = date('Y-m-d');
      $more_wheres = "( (DATE(l.start_date) <='".$today."' AND DATE(l.end_date) >='".$today."') OR IFNULL(l.neverExpires,0) =0) ";
      $rows = DB::table('sender_base_price AS l')->where('branch_id',$branch_id)->where('sender_id',$sender_id)->whereRaw($more_wheres)->selectRaw('IFNULL(l.price,0) AS price')->limit(1)->get();
      foreach($rows as $row) return $row->price; 
      return 0;
    }

    function getZoneInfo($uss,$zone_code){
        $branch_id = $uss->branch_id;
        $rows = DB::table('zones AS z')->where('z.branch_id',$branch_id)->where('zone_code',$zone_code)->selectRaw('z.zone_code,z.zone_name,z.country_id,z.city_id,z.district_id,z.commune_id')->limit(1)->get();
        foreach($rows as $row) return $row;
        return null; 
    }

    //create UNIQUE 10digit QR code. $uss is user_session_info
    function createQRCode($uss,$len=12){
        $branch_id = $uss->branch_id;
        $user_id = $uss->user_id; //login_name
        return strtoupper(uniqid($branch_id.$user_id));
        // for ($randomNumber = mt_rand(1, 8), $i = 1; $i < 10; $i++) {
        //    $randomNumber .= mt_rand(0, 8);
        // }
        // return $branch_id.$result;
    }

     //return UNIQUE random  string at a given length
      function getUniqueString($length)
      {
            $random= "";

        srand((double)microtime()*1000000);

        $data = "AbcDE123IJKLMN67QRSTUVWXYZ";
        $data .= "aBCdefghijklmn123opq45rs67tuv89wxyz";
        $data .= "0FGH45OP89";

        for($i = 0; $i < $length; $i++)
        {
            $random .= substr($data, (rand()%(strlen($data))), 1);
        }
        return $random;
    }
 
    //Takes a @delivery_id and transform it into a formal 10-dgit tracking number with some prefix, if any
    function getTrackingNumber($uss,$delivery_id){
        $num = formatNumber($delivery_id,7);
        $use_prefix = get_settings_value($uss,'USE_TRACK_PREFIX','number');
        $prefix = '';
        if($use_prefix ==1) $prefix =get_settings_value($uss,'TRACK_PREFIX','string');  
        return $prefix.$num;
    }

    // //Set formal tracking number for a given delivery_id 
    // function setTrackingNumber($uss,$delivery_id) {
    //     $num = formatNumber($delivery_id,7);
    //     $branch_id = $uss->branch_id;
    //     $use_prefix = get_settings_value($uss,'USE_TRACK_PREFIX','number');
    //     $prefix = '';
    //     if($use_prefix ==1) $prefix = get_settings_value($uss,'TRACK_PREIX','string');  
    //     $tracking_number = $prefix.$num;
    //     DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->update(array(
    //         'tracking_number'=>$tracking_number
    //     ));
    //     return null;
    // }
 
    function getDriverInfoByCode($uss,$code){
        $branch_id = $uss->branch_id;
        $rows = DB::select(DB::raw("SELECT d.id as driver_id, d.name, d.phone_number FROM `driver` AS d WHERE d.branch_id ='".$branch_id."' AND d.code ='".$code."' LIMIT 1"));
        foreach($rows as $row) return $row;
        return null;
      }

      //This is for Chaning Driver and is used by Admin User to change Driver for a deliver trip (Fleet)
      function changeDeliveryDriver($data) {
        $ss = getSessionInfo($data);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        //$allowable_statuses = ['pending','delayed','failed','delivered','otw','pd']; 
        $branch_id = sanitize($ss->branch_id);
        $driver_id = $data->driver_id;
        $delivery_id = isset($data->delivery_id)?$data->delivery_id:0;
        $package_id = isset($data->package_id)?$data->package_id:0;
        
        if($delivery_id <=0) {
          $rows = DB::table('package AS p')->where('branch_id',$branch_id)->where('id',$package_id)->selectRaw('p.delivery_id')->limit(1)->get();
          foreach($rows as $row) $delivery_id = $row->delivery_id; 
        }
        //Failed to find delivery_id for this package
        if($delivery_id <=0 || empty($delivery_id)) return "Delivery trip identity is not valid";  

        //begin:: check if delivery status
            $rows = DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->selectRaw("status_id")->limit(1)->get();
            $status_id = null;
            foreach($rows as $row) $status_id = $row->status_id; //status_id
            
            // if ($status_id == 8) {
            //   if ($driver_id <=0 || empty($driver_id)) {
            //       return "Cannot unassign driver when delviery is already delivered!";
            //   }
            // }
       //end:: Check delivery status

        // if(!in_array($status, $allowable_statuses)) {
        //   return "Cannot change driver because the delviery status prevents this change!";
        // } 
        DB::table('delivery')->where('id',$delivery_id)->where('branch_id',$branch_id)->update(array('driver_id'=>$driver_id));
        DB::table('package')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->update(array('driver_id'=>$driver_id));
        return null;
      }

      //assignDeliveryDriver() is to assign driver for a fleet or Delivery Trip
      //by assigning a driver to a fleet => then the fleet status is changed to "Delivery Started"
      //so assiging driver also means to set Fleet's status to "Delivery Started" 
      function assignDeliveryDriver($data) {
        $ss = getSessionInfo($data);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        //$allowable_statuses = ['pending','delayed','failed','delivered','otw','pd']; 
        $branch_id = sanitize($ss->branch_id);
        $driver_id = $data->driver_id;
        $delivery_id = isset($data->delivery_id)?$data->delivery_id:0;
        $package_id = isset($data->package_id)?$data->package_id:0;
        $depart_time = isset($data->depart_time)?convertDate($data->depart_time):getNowTime();

        if($delivery_id <=0) {
          $rows = DB::table('package AS p')->where('branch_id',$branch_id)->where('id',$package_id)->selectRaw('p.delivery_id')->limit(1)->get();
          foreach($rows as $row) $delivery_id = $row->delivery_id; 
        }
        //Failed to find delivery_id for this package
        if($delivery_id <=0 || empty($delivery_id)) return "Delivery trip identity is not valid";  

        //begin:: check if delivery status
            $rows = DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->selectRaw("status_id")->limit(1)->get();
            $status_id = null;
            foreach($rows as $row) $status_id = $row->status_id; //status_id
            
            // if ($status_id == 8) {
            //   if ($driver_id <=0 || empty($driver_id)) {
            //       return "Cannot unassign driver when delviery is already delivered!";
            //   }
            // }
       //end:: Check delivery status

        // if(!in_array($status, $allowable_statuses)) {
        //   return "Cannot change driver because the delviery status prevents this change!";
        // } 
        $status_id = 5; //Arrived at Warehouse 
        
        DB::table('package')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->update(array('driver_id'=>null));
        if ($driver_id <=0) //$status_id =5; //Driver = To be Assigned and Delivery and pacakge's Status = 5 (Arrive at Warehouse) 
           DB::table('delivery')->where('id',$delivery_id)->where('branch_id',$branch_id)->update(array('driver_id'=>null,'status_id'=>$status_id));
        else{
          $status_id =6; //Delivery Started
          DB::table('delivery')->where('id',$delivery_id)->where('branch_id',$branch_id)->update(array('driver_id'=>$driver_id,'status_id',$status_id,'depart_time'=>$depart_time));
          DB::table('package')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->update(array('driver_id'=>$driver_id));
        }
        return null;
      }

      function getOutstandingPackageList($data) {    
        $ss = getSessionInfo($data);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
         
        $branch_id = sanitize($ss->branch_id);
        $data->warehouse_id = isset($data->warehouse_id)?sanitize($data->warehouse_id):0;
        $data->date = convertDate($data->date);
        $data->delivery_type = isset($data->delivery_type)?$data->delivery_type:null;
        if($data->delivery_type ==0) $data->delivery_type =null;
        $data->zone_code = sanitize($data->zone_code);
        $data->driver_id = sanitize($data->driver_id);
        $data->sender_id = sanitize($data->sender_id);
        $data->status_id = isset($data->status_id)?sanitize($data->status_id):-1;
        if(empty($data->status_id)) $data->status_id =-1;
        $search_value =isset($data->search_value)?escape_like_str(sanitize($data->search_value)):null;
         
          //$succeeded_status ="delivered"; /* outstanding delvieries => select all packages that has status different from "delivered" */
          $str_driver = null;
          $str_warehouse =null;
          $str_zone ='';
          $str_sender =null;
          $str_status = null; //status_id = 4 (Picked and Booked), status_id = 5 (Arrived at warehouse) 
          $str_delivery_type = null;
          $str_search = null;
          if (!empty($search_value)) { 
            $str_search = " AND (p.qr_code ='".$search_value."') OR p.receiver_phone ='".$search_value."'  OR s.phone_number ='".$search_value."' OR s.name ='%".$search_value."%' OR p.order_id IN (SELECT `id` FROM `order` WHERE code ='".$search_value."') ";
            $more_wheres = " p.status_id > 4 AND p.status_id NOT IN (8,11) ".$str_search;
          }
          else{
            if (!empty($data->delivery_type)) $str_delivery_type =" AND p.delivery_type ='".$data->delivery_type."' ";
            if(!empty($data->warehouse_id)) $str_warehouse =" AND p.warehouse_id ='".$data->warehouse_id."' ";
            if ($data->driver_id > 0) $str_driver = " AND p.driver_id ='".$data->driver_id."' ";
            if (empty($data->driver_id) || $data->driver_id <=0) $str_driver = null; // " AND IFNULL(p.driver_id,0) = 0";
            if ($data->sender_id > 0) $str_sender = " AND p.sender_id ='".$data->sender_id."' ";
            if (!empty($data->zone_code)) $str_zone = " AND p.zone_code ='".$data->zone_code."' ";
            if ($data->status_id != -1 && !empty($data->status_id)) $str_status = " AND p.status_id ='".$data->status_id."' ";
            $str_date = null;
            if ((bool)strtotime($data->date)) $str_date = " AND DATE(p.create_date) >= '".$data->date."' ";
            $more_wheres = " p.status_id > 4 AND p.status_id NOT IN (8,11) ".$str_warehouse.$str_delivery_type.$str_driver.$str_zone.$str_sender.$str_date.$str_status;
          }          
         
          $select_cols ="p.id As package_id,p.delivery_id, p.order_id, DATE_FORMAT(p.pickup_time,'%d %b %Y') AS pickup_time,p.zone_code, p.delivery_type, p.qr_code AS barcode,p.delivery_condition, 
           DATE_FORMAT(p.arrival_time,'%d %b %Y') AS `arrival_time`, s.sender_type_id, st.name AS sender_type, (select x.name from driver as x WHERE x.id = p.driver_id LIMIT 1) AS driver_name, p.driver_id,
          p.status_id,(SELECT ds.name FROM package_statuses AS ds WHERE ds.id = p.status_id LIMIT 1) AS status, p.sender_id, s.phone_number AS sender_phone, p.receiver_id, p.receiver_address, p.receiver_name, p.receiver_phone,p.zone_name, s.name AS sender_name, IFNULL(p.driver_total,0) AS driver_total, IFNULL(p.sender_total,0) AS sender_total";

          $rows = DB::table('package AS p')->join('sender AS s','s.id','=','p.sender_id')->join('sender_type AS st','st.id','=','s.sender_type_id')->selectRaw($select_cols)->where('p.branch_id',$branch_id)->where('p.outstanding',1)->whereRaw($more_wheres)->orderByRaw('p.create_date DESC, p.delivery_id DESC')->get();
          return $rows; 
         }
  
         //GetOutStandingPackageList_print() returns data for pdf printing only
         function getOutstandingPackageList_print($data) {    
          $ss = getSessionInfo($data);
          if(!$ss) return '#350'; //user not authenticated
          if (!prn_allowed(2)) return '@'; //need permission to do this task
           
          $branch_id = sanitize($ss->branch_id);
          $data->warehouse_id = isset($data->warehouse_id)?sanitize($data->warehouse_id):0;
          $data->date = isset($data->date)? $data->date:null;
          $data->delivery_type = isset($data->delivery_type)?$data->delivery_type:null;
          if($data->delivery_type ==0) $data->delivery_type =null;
          $data->zone_code = sanitize($data->zone_code);
          $data->driver_id = sanitize($data->driver_id);
          $data->sender_id = sanitize($data->sender_id);
          $data->status_id = sanitize($data->status_id);
          if(empty($data->status_id)) $data->status_id =-1;
          $data->search_value =isset($data->search_value)?$data->search_value:null;
          $data->search_value = escape_like_str(sanitize(trim($data->search_value)));
  
            //$succeeded_status ="delivered"; /* outstanding delvieries => select all packages that has status different from "delivered" */
            $str_driver = null;
            $str_warehouse =null;
            $str_zone ='';
            $str_sender =null;
            $str_status = null; //status_id = 4 (Picked and Booked), status_id = 5 (Arrived at warehouse) 
            $str_delivery_type = null;
            $str_search = null;
            if (!empty($data->search_value)) { 
              $str_search = " AND (p.qr_code ='".$data->search_value."') OR p.receiver_phone ='".$data->search_value."'  OR s.phone_number ='".$data->search_value."' OR s.name ='%".$data->search_value."%' OR p.order_id IN (SELECT `id` FROM `order` WHERE code ='".$data->search_value."')";
              $more_wheres = " p.status_id > 4 AND p.status_id NOT IN (8,11) ".$str_search;
            }
            else{
              if (!empty($data->delivery_type)) $str_delivery_type =" AND p.delivery_type ='".$data->delivery_type."' ";
              if(!empty($data->warehouse_id)) $str_warehouse =" AND p.warehouse_id ='".$data->warehouse_id."' ";
              if ($data->driver_id > 0) $str_driver = " AND p.driver_id ='".$data->driver_id."' ";
              if ($data->driver_id ==-1) $str_driver = " AND IFNULL(p.driver_id,0) = 0";
              if ($data->sender_id > 0) $str_sender = " AND p.sender_id ='".$data->sender_id."' ";
              if (!empty($data->zone_code)) $str_zone = " AND p.zone_code ='".$data->zone_code."' ";
              if ($data->status_id != -1) $str_status = " AND p.status_id ='".$data->status_id."' ";
              $str_date = null;
              if ((bool)strtotime($data->date)) $str_date = " AND DATE(p.create_date) >= '".$data->date."' ";
              $more_wheres = " p.status_id > 4 AND p.status_id NOT IN (8,11) ".$str_warehouse.$str_delivery_type.$str_driver.$str_zone.$str_sender.$str_date.$str_status;
            }          
           
            $select_cols ="'$' AS cur, p.qr_code AS barcode,DATE_FORMAT(p.create_date,'%d %b %Y') AS booking_date, s.name AS sender_name, s.phone_number AS sender_phone,p.zone_name,p.receiver_phone, 
            (select x.name from driver as x WHERE x.id = p.driver_id LIMIT 1) AS driver_name, p.delivery_type,
            (SELECT ds.name FROM package_statuses AS ds WHERE ds.id = p.status_id LIMIT 1) AS status, IFNULL(p.driver_total,0) AS driver_total";
  
            $rows = DB::table('package AS p')->join('sender AS s','s.id','=','p.sender_id')->join('sender_type AS st','st.id','=','s.sender_type_id')->selectRaw($select_cols)->where('p.branch_id',$branch_id)->where('p.outstanding',1)->whereRaw($more_wheres)->orderByRaw('p.create_date DESC, p.delivery_id DESC')->get();
            return $rows; 
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

      public function getDeliveryDetails($data) {
        $ss = getSessionInfo($data);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task

          $branch_id = $ss->branch_id;
          $delivery_id = $data->delivery_id;
          //delivery_type = {Normal,Fast}
          $rows= DB::select(DB::raw("SELECT d.id as delivery_id, d.delivery_type, s.name as sender_name, DATE_FORMAT(d.depart_time,'%d %b %Y %r') AS depart_time, DATE_FORMAT(d.arrival_time,'%d %b %Y %r') AS arrival_time, d.package_count, d.sender_id, s.code AS sender_code, 
          (SELECT `name` FROM `driver` WHERE id = IFNULL(p.driver_id,0) LIMIT 1) AS driver_name, p.driver_id,
          (SELECT `code` FROM `driver` WHERE id = IFNULL(p.driver_id,0) LIMIT 1) AS driver_code,
          p.zone_code,destination_map_location,d.delivery_notes, p.receiver_phone,p.receiver_address,p.receiver_name, d.taxi_fee
          FROM `delivery` AS d INNER JOIN `sender` AS s ON s.id = d.sender_id WHERE d.branch_id ='".$branch_id."' AND s.branch_id ='".$branch_id."' AND d.id ='".$delivery_id."' LIMIT 1"));
          
          $data = (object)['deliveryInfo'=>null,'packages'=>[]];
          foreach($rows as $row) {
              $data->deliveryInfo = $row;
              $data->packages = DB::select(DB::raw("SELECT p.id, p.qr_code, p.package_name,p.dimension,p.weight_kg, p.price,p.delivery_fee, IFNULL(p.cod,0) AS cod, p.dimension_x, dimension_y, p.dimension_z,p.cubic_meter_size FROM `package` AS p WHERE p.branch_id ='".$branch_id."' AND p.delivery_id ='".$delivery_id."' ")); 
              return ($data);
          }
          return ($data);
      }

      function updateDelivery($data){
        $ss = getSessionInfo($data);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task

        $branch_id = $ss->branch_id;
          $result = (object)[];
          if(empty($data->sender_code)) $data->sender_code =null;
          if (empty($data->delivery_id) || !is_numeric($data->delivery_id) ) {
              $result->error_message ="Delivery identifier is not correct";
              $result->status ='Error';
             return ($result);
          }
  
          $delivery_id = $data->delivery_id;
  
          if (empty($data->zone_code)) {
            $result->error_message ="Zone code is not correct";
            $result->status ='Error';
             return ($result);
          } 
         
         $driver_id = null; 
         $d = $this->getDriverInfoByCode($ss,$data->driver_code);
          //   if($d ==null) {
          //     $result->error_message ="Driver information is not correct";
          //     $result->status ='Error';
          //     return ($result);
          //   } 
         if ($d != null) $driver_id = $d->driver_id;
         $sender = $this->getSenderInfoByCode($data);
   
         if ($sender==null) {
           $result->error_message ="Sender or Merchant information is not valid";
           $result->status ='Error';
           return ($result);
         }
         if (empty($data->receiver_phone)) {
           $result->error_message ="Receiver phone number cannot be empty";
           $result->status ='Error';
           return $result;
         }
   
         if (empty($data->zone_code)) {
           $result->error_message ="Destination Zone code cannot be empty";
           $result->status ='Error';
           return $result;
         }
   
          $data->depart_time = date('Y-m-d',strtotime($data->depart_time));
          if(!(bool)strtotime($data->depart_time)) $data->depart_time = date('Y-m-d');
          $order_id = null;
          $def_status ='IP';
          DB::table('delivery')->where('branch_id',$branch_id)->where('id',$data->delivery_id)->update(array(
              'depart_time'=>$data->depart_time,
              'delivery_type'=>$data->delivery_type,
              'sender_id'=>$sender->id,
              'order_id'=>$order_id,
              'driver_id'=>$driver_id,
              'destination_zone_code'=>$data->zone_code,
              'receiver_address'=>$data->receiver_address,
              'destination_map_location'=>$data->destination_map_location,
              'receiver_phone'=>$data->receiver_phone,
              'delivery_notes'=>$data->delivery_notes,
              'status'=>$def_status, //{IP,'Delivered','TBD','Partially Delivered','Returned'}
              'package_count'=>0,
              'delivered_count'=>0,
              'create_user'=>$ss->login_name,
              'create_date'=>getNowTime()
   
          ));
           
          //$c = {'collect_pmt','df_payer_type','dimemsion','weight_kg','cubic_meter-size','delivery_fee','price','qr_code'} 
          if($delivery_id > 0) {
              $i= 0;
              $c;
              do{
                 if(!isset($data->packages[$i])) break;
                 $c = (object)$data->packages[$i];
   
                 if (!isset($c->package_name)) $c->package_name =$data->receiver_phone;
                  if (!isset($c->product_type)) $c->product_type =null;
                  if (!isset($c->dimension)) $c->dimension =null;
                  if (!isset($c->weight_kg)) $c->weight_kg =0;
                  if (!isset($c->price)) $c->price =0;
                  if (!isset($c->qr_code)) $c->qr_code =null;
   
                  if (!isset($c->df_payer_type)) $c->df_payer_type ='merchant';
                  if (!isset($c->delivery_fee)) $c->delivery_fee =0;
                  if (!isset($c->cubic_meter_size)) $c->cubic_meter_size =0;
                  if (!isset($c->collect_pmt)) $c->collect_pmt =0;
   
                  if(!is_numeric($c->weight_kg)) $c->weight_kg =0;
                  $def_status ='IP';
  
                  $qr_code_exists = DB::table('package')->where('branch_id',$branch_id)->where('qr_code',$c->qr_code)->limit(1)->exists();  
                  if ($c->qr_code ==null || !$qr_code_exists) {
  
                      $qr_code = $this->createQRCode($ss,7);
                      DB::table('package')->insert(array(
                          'branch_id'=>$branch_id,
                          'delivery_id'=>$delivery_id,
                          'dimension'=>$c->dimension,
                          'weight_kg'=>$c->weight_kg,
                          'price'=>$c->price,
                          'qr_code'=>$qr_code,
                          'product_type'=>$c->product_type,
                          //'df_payer_type'=>$c->df_payer_type,
                          'delivery_fee'=>$c->delivery_fee,
                          'cubic_meter_size'=>$c->cubic_meter_size,
                          'status'=>$def_status,
                          //'receiver_phone'=>$data->receiver_phone,
                          //'receiver_address'=>$data->receiver_address,
                          'cod'=>$c->cod,
                          'create_user'=>$ss->login_name,
                          'create_date'=>getNowTime()
                      ));    
                  } else {
                      DB::table('package')->where('branch_id',$branch_id)->where('qr_code',$c->qr_code)->where('delivery_id',$delivery_id)->update(array(
                          'dimension'=>$c->dimension,
                          'weight_kg'=>$c->weight_kg,
                          'price'=>$c->price,
                          'product_type'=>$c->product_type,
                          //'df_payer_type'=>$c->df_payer_type,
                          'delivery_fee'=>$c->delivery_fee,
                          'cubic_meter_size'=>$c->cubic_meter_size,
                          'status'=>$def_status,
                          //'receiver_phone'=>$data->receiver_phone,
                          //'receiver_address'=>$data->receiver_address,
                          'cod'=>$c->cod,
                          'update_user'=>$ss->login_name,
                          'update_date'=>getNowTime()
                          
                      ));    
                  }
  
                  $i++;
              }while($c);
   
              //begin:: update delviery.package_count, delviered_count
               $cnt = $this->getPackageCountByStatus($ss,$delivery_id,null);
               $delivered_status_id =8;
               $failed_status_id =9;
               $delivered_cnt = $this->getPackageCountByStatus($ss,$delivery_id,$delivered_status_id);
               $failed_cnt = $this->getPackageCountByStatus($ss,$delivery_id,$failed_status_id);
               DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->update(array(
                   'delivered_count'=>$delivered_cnt,
                   'failed_count'=>$failed_cnt,
                   'package_count'=>$cnt
               ));
             //end:: update delviery.package_count, delviered_count
          }
          $result->status ='OK';
          $result->error_message =null;
          $result->delivery_id = $delivery_id;
          return ($result);
       }


      //return COUNT of packages for an Order with status = "Picked and Booked" only 
      //NOTE that Order with status =4 (Picked and Booked) has items or packages stored in table "order_receivers" 
      function countPackagesByOrder($order_id){
          $rows = DB::table('order_receivers AS r')->where('r.order_id',$order_id)->selectRaw("COUNT(r.id) AS cnt")->get();
          foreach($rows as $row) return $row->cnt;
          return 0;
      } 
     
      function getPackageListPerOrder($order_id){
         $cols ="r.id,r.qr_code AS bar_code,r.receiver_name,receiver_phone,receiver_address,cod,df_payer,price,base_fee,delivery_fee,cod_fee,status_id,outstanding,sender_total,driver_total";
         return DB::table('order_receivers AS r')->where('r.order_id',$order_id)->selectRaw($cols)->get();
      }

      //Driver App, on Pick and Book screen, user can clicks on List button and delete some items or all items
      function deleteOrderPakcages($order_id,$bar_code=null){
        $more_where = null;
        if (empty($bar_code)) $more_where ="1=1";
        else $more_where =" qr_code ='$bar_code'";
        DB::table("order_receivers")->where('order_id',$order_id)->whereRaw($more_where)->delete();
        DB::table("package")->where('order_id',$order_id)->whereRaw($more_where)->delete();
        return null;
      }

    //@status is integer. Refer to table "package_statuses" 
      function getPackageCountByStatus($uss,$delivery_id,$status_id=-1) {
          $branch_id = $uss->branch_id;
          $str_status ='';
          if(empty($status_id) || strtolower($status_id) == -1) $str_status =null;
          else $str_status =" AND p.status_id ='".$status_id."' ";
          $more_wheres = "1=1 ".$str_status;
          $rows = DB::table('package AS p')->where('p.branch_id',$branch_id)->where('delivery_id',$delivery_id)->whereRaw($more_wheres)->selectRaw('COUNT(p.id) AS cnt')->get();          
          foreach($rows as $row) return $row->cnt;
          return 0;
      }
  
      //deleteDeliveryTask()
      public function deleteDelivery($data) {
        $ss = getSessionInfo($data);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
          
          $branch_id = $ss->branch_id;
          $id = $data->delivery_id;
          DB::table('package')->where('branch_id',$branch_id)->where('delivery_id',$id)->delete();
          DB::table('delivery')->where('branch_id',$branch_id)->where('id',$id)->delete();
          DB::table('order')->where('branch_id',$branch_id)->where('id',$order_id)->update(array('a'));
         return (null);
      }
   
    function getSenderInfoByCode($data) {
          $ss = getSessionInfo($data); /** $data->acc_tk_dms is access_token required for getSessionInfo() to work **/
          if(!$ss) return '#350'; //user not authenticated
          if (!prn_allowed(2)) return '@'; //need permission to do this task

          $branch_id = $ss->branch_id;
          $sender_code = $data->sender_code;
          if(empty($sender_code)) $sender_code =null;
          $exchange_rate = $this->getExchangeRate($ss,$sender_code,'code')->buy_rate; 
          $rows = DB::table('sender AS s')->where('s.branch_id',$branch_id)->where('s.code',$sender_code)->selectRaw($exchange_rate." AS exchange_rate,s.name, s.id, s.phone_number, s.address, s.map_location, s.sender_type")->limit(1)->get();
          foreach($rows as $row) return $row;
          return null;
      }
   
     public function getSenderInfoByOrderCode($data) {
        $ss = getSessionInfo($data);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task

         $branch_id = $ss->branch_id;
          $order_code = $data->order_code;
          $q =DB::table('order')->select('sender_id')->where('code',$order_code)->where('branch_id',$branch_id)->get();
          $sender_id = null;
          foreach($q as $row) $sender_id =$row->sender_id; 
          if ($sender_id ==null) return (null);
             
          $rows = DB::select(DB::raw("SELECT s.name, s.id, s.phone_number, s.address, s.map_location, s.sender_type FROM `sender` AS s WHERE s.branch_id ='".sanitize($branch_id)."' AND s.id ='".sanitize($sender_id)."' LIMIT 1"));
          foreach($rows as $row) return $row;
          return null;  
      }
  
      public function getDriverNameByCode($data) {
        $ss = getSessionInfo($data);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task

          $branch_id = $ss->branch_id;
          $code = $data->driver_code;
          $rows = DB::select(DB::raw("SELECT d.name FROM `driver` AS d WHERE d.branch_id ='".sanitize($branch_id)."' AND d.code ='".sanitize($code)."' LIMIT 1"));
          foreach($rows as $row) return ($row->name);
          return (null);
      }
  
      public function getComboItems_driver($data){
        $ss = getSessionInfo($data);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task

          $branch_id = $ss->branch_id;
          $rows = DB::table('driver AS d')->selectRaw('d.id,d.name AS driver_name')->where('branch_id',$branch_id)->get();
          return ($rows);
      }
  
      //various form options data combo items on Package Trail View or "Package List" view
      function getForm_options_package_list($data) {
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
          $data->senders  = DB::table('sender')->selectRaw('id, name AS sender_name')->where('branch_id',$branch_id)->orderByRaw('name ASC')->get();
          $data->zones  = DB::table('zones')->selectRaw("zone_code,CONCAT(zone_code,' | ',zone_name) AS zone_name")->where('branch_id',$branch_id)->get();
          $data->statuses = DB::table('package_statuses AS s')->where('stage','delivery')->selectRaw('s.id,s.name AS status_name')->orderByRaw('s.display_order ASC')->get();
          return ($data);
      }
   
      //Find Driver or Sender (Merchant or store name) or Receiver (Customers) by id, name, phone number 
      public function findPersons($d) {
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task

        $branch_id = $ss->branch_id;
          $role = isset($d->role)?$d->role:null;
          $search_value = isset($d->search_value)?$d->search_value:null;
          //$findBy = $data->findBy;
          $role =strtolower($role);
          $rows = [];
          if (empty($search_value)) return [];
          $search_value =escape_like_str($search_value);
          $str_search = " d.name LIKE '%".$search_value."%' OR d.code ='".$search_value."' OR d.phone_number ='".$search_value."'";
          if($role=='driver'){
            $rows = DB::table('driver AS d')->where('branch_id',$branch_id)->whereRaw($str_search)->selectRaw("id, d.code AS code, d.name AS `name`,'Driver' AS `role`, d.phone_number, d.email")->get();
          } else if ($role =='sender') {
            $rows = DB::table('sender AS d')->where('branch_id',$branch_id)->whereRaw($str_search)->selectRaw("id, d.code AS code, d.name AS `name`,'Merchant' AS `role`, d.phone_number, d.email")->get();
          } 
          // else if ($role =='receiver') {
          //     $rows = DB::select(DB::raw("SELECT d.code AS code, d.name AS `name` FROM `receiver` as d WHERE d.branch_id ='".$branch_id."' AND (d.name LIKE '%".escape_like_str($search_value)."%' OR d.code ='".$search_value."' OR d.phone_number ='".$search_value."')"));  
          // }
          
          return $rows;
      }
  
      function getPackageStatusInfo($branch_id,$barcode) {
           $rows = DB::table('package AS p')->join('package_statuses AS ps','ps.id','=','p.status_id')->where('p.branch_id',$branch_id)->where('qr_code',$barcode)->selectRaw('p.order_id,p.status_id,ps.name AS status')->limit(1)->get();
           foreach($rows as $row) return $row; 
           return null;
      }

      function deletePackage($data) {
        $ss = getSessionInfo($data);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task

          $branch_id = $ss->branch_id;
          $delivery_id = $data->delivery_id;
          $barcode = isset($data->barcode)?$data->barcode:null;
          $package_id = isset($data->package_id)?$data->package_id:null;
          $package_id = trim($package_id);
          $statusInfo = $this->getPackageStatusInfo($branch_id,$barcode);
          if($statusInfo ==null) return "Cannot find barcode of the package for deleting";
          if ($statusInfo->status_id ==8) return "Cannot delete package that has been delivered to receiver";
          if ($statusInfo->status_id ==11) return "Cannot delete package that has been returned to Store";
          $order_id = $statusInfo->order_id; 
          if(empty($barcode)) 
            DB::table('package')->where('branch_id',$branch_id)->where('id',$package_id)->delete();
          else
            DB::table('package')->where('branch_id',$branch_id)->where('qr_code',$barcode)->delete();

            //begin:: update delviery.package_count, delviered_count
              $cnt = $this->getPackageCountByStatus($ss,$delivery_id,null); //count all packages related to a delivery trip
              $delivered_status_id =8;
              $delivered_cnt = $this->getPackageCountByStatus($ss,$delivery_id,$delivered_status_id);
              DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->update(array(
                  'delivered_count'=>$delivered_cnt,
                  'package_count'=>$cnt
              ));
           //end:: update delviery.package_count, delviered_count
           //update order.qty, if order_id exists
            if ($order_id >0) 
               DB::statement("UPDATE `order` SET qty =(SELECT COUNT(p.id) FROM package AS p WHERE p.branch_id ='".$branch_id."' AND p.order_id ='".$order_id."') WHERE branch_id ='".$branch_id."' AND id ='".$order_id."' "); 
            
          return null;
      }
  
     function getComboItems_package_status($data=null){
        // $ss = getSessionInfo($data);
        // if(!$ss) return '#350'; //user not authenticated
        // if (!prn_allowed(2)) return '@'; //need permission to do this task
          $rows = DB::table('package_statuses')->where('stage','delivery')->selectRaw('id,name AS status_name')->get();
          return ($rows);
      }
      function updatePackageStatus($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
           $branch_id = $ss->branch_id;
           $delivery_id = isset($d->delivery_id)?$d->delivery_id:null;
           $package_id =isset($d->package_id)? $d->package_id:null;
           $update_trip_status =$d->update_trip_status?$d->update_trip_status:0;//whether or not to allow updating the trip status 
           //$barcode = isset($data->barcode)?$data->barcode:null;
           $status_id = $d->status_id; //Status code in varchar(20)
           $failure_notes = isset($d->failure_notes)?$d->failure_notes:null;
           $trip_status_id =null;
           
           $result = (object)array('status'=>'OK','error_message'=>null,'trip_status_id'=>null);
           
           //if user try to change pacakge status to 6 ="On Delivery"=> This is not allowed if the trip has been Finished. This is allowed only when the Trip is still On Delivery 
            if ($status_id ==6){
               $rows = DB::table('delivery AS d')->where('d.branch_id',$branch_id)->where('d.id',$delivery_id)->selectRaw('d.status_id')->limit(1)->get();
               foreach($rows as $row) $trip_status_id = $row->status_id;
               if ($trip_status_id != 2) {
                  $result->status ='Error';
                  $result->error_message =  "មិនអាចដូរស្ថានភាពនេះទេ! ព្រោះការដឹកត្រូវបានបញ្ចប់ហើយ"; 
                  return $result;
               }
            }

           if($status_id ==9) {
             if (empty($failure_notes)) {
                $rows = DB::table('package AS p')->where('branch_id',$branch_id)->where('id',$package_id)->select('p.failure_notes')->limit(1)->get();
                foreach($rows as $row) $failure_notes = $row->failure_notes;
                //if(empty($failure_notes)) $failure_notes ='Failed';
             } 
             if(empty($failure_notes)) {
                $result->status ='Error';
                $result->error_message= "ត្រូវការហេតុផលសំរាប់ Failed Package";
                return $result;
             }
           }

           $outstanding =1;
           if ($status_id ==8 || $status_id ==11) $outstanding =0; 
            //  //get $outstanding value based on a given @status_id 
            //     $rows = DB::table('package_statuses')->where('id',$status_id)->selectRaw('outstanding')->limit(1)->get();
            //     foreach($rows as $row) $outstanding = $row->outstanding;
            //  //end of getting outstanding value
           DB::table('package')->where('branch_id',$branch_id)->where('id',$package_id)->update(array(
               'status_id'=>$status_id,
               'outstanding'=>$outstanding,
               'failure_notes'=>$failure_notes, //$failure_notes is NULL when $status_id != 9
               'arrival_time'=>getNowTime(),
               'update_user'=>$ss->login_name,
               'update_date'=>getNowTime()
           ));

          //  //If status is "Failed" => update package.failture_notes
          //     if ($status_id ==9)  {
          //       DB::table('package')->where('branch_id',$branch_id)->where('id',$package_id)->update(array(
          //         'failure_notes'=>$failure_notes,
          //         'update_user'=>$ss->login_name,
          //         'update_date'=>getNowTime()
          //       ));
          //     }

          //funtion $this->updateDeliveryStatus() returns latest trip's status_id (3) then trip is DONE, otherwise return NULL
           
          if ($update_trip_status ==1 || $update_trip_status==true){
             //$on_delivery_status = 6;
             $cnt = $this->getPackageCountByStatus($ss,$delivery_id,6); //count packages that are "On delivery", if count = 0 => update trip status to DONE
             if ($cnt ==0){
               DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->update(array(
                 'status_id'=>3
               )); 
               $result->trip_status_id = 3; //if not remaining "On Delivery" => then trip is "DONE"
             } 
          }
          $result->status ='OK';
          $result->error_message = null;
          return $result;
      }
  
      function getReceiverInfo($data) {
        $ss = getSessionInfo($data);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
          $id = sanitize($data->package_id);
          $branch_id = sanitize($ss->branch_id);
          $rows = DB::table('package AS p')->where('branch_id',$branch_id)->where('id',$id)->selectRaw('p.delivery_id,p.receiver_name,p.receiver_phone,p.receiver_address,p.zone_code')->limit(1)->get();
          foreach($rows as $row) return $row;
          return null;
      }
 
      public function updatePakackgeStatus($data) {
        $ss = getSessionInfo($data);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task

          $id = $data->package_id;
          $branch_id = $ss->branch_id;
          
          //start:: get delivery_id
              $rows = DB::table('package')->where('id',$id)->selectRaw('delivery_id')->where('branch_id',$branch_id)->limit(1)->get();
              $delivery_id = 0;
              foreach($rows as $row) $delivery_id = $row->delivery_id;
          //end::  get delivery_id
  
          DB::table('package')->where('id',$id)->where('branch_id',$branch_id)->update(array(
             'status'=>$status_code,
             'update_user'=>$ss->login_name,
             'update_date'=>getNowTime()
          ));
          
          //update delivery.delivered_count and "status"
          $delivered_status_id = 8;
           $delivered_count = $this->getPackageCountByStatus($ss,$delivery_id, $delivered_status_id);
           $cnt = $this->getPackageCountByStatus($delivery_id,null);
           $new_status ='Delivered';
           if($cnt > $delivered_count && $delivered_count > 0) 
             $new_status ='pd';
           else if ($cnt == $delivered_count && $delivered_count >0) 
              $new_status ='delivered';
           else $new_status ='ip';
  
           DB::table('delivery')->where('id',$id)->where('branch_id',$branch_id)->update(array(
                'delivered_count'=>$delivered_count,
                'status'=>$new_status
           ));
          return (null);
      }

      //this method use either parameter "tracking_number" or "order_id", NOT both at same time.  $data = {'tracking_number','order_id','show_attachments'}. If @tracking_number is supplied => use @tracking_number to find order_id and use the found @order_id to query result
      function getOrderDetails($data) {
          $ss = getSessionInfo($data);
          if(!$ss) return '#350'; //user not authenticated
          if (!prn_allowed(2)) return '@'; //need permission to do this task
            $branch_id = $ss->branch_id;
            $order_id = sanitize(isset($data->order_id)?sanitize($data->order_id):0);
            $tracking_number = isset($data->tracking_number)?sanitize($data->tracking_number):null;// This is order_code
            $show_attachments = isset($data->show_attachments)?$data->show_attachments:0;
            if($show_attachments ==true) $show_attachments =1;

            $result = (object)([]);

            if (!empty($tracking_number) && $order_id <=0) 
            {
                $rows =  DB::table('order AS o')->where('branch_id',$branch_id)->where('o.code',$tracking_number)->limit(1)->select('o.id')->get();
                foreach($rows as $row) $order_id = $row->id; //get order_id based on the given tracking_number 
            }
            //NOTE: "order.code" is used "tracking_number"
            //Get header data about order request pickup(pickup_type, request_date, sender_id, sender_code, product_type,number of packages)
            $header_row = null;
            $h_rows = DB::table('order AS o')->join('sender AS s','s.id','=','o.sender_id')->where('o.branch_id',$branch_id)->where('o.id',$order_id)->selectRaw("o.id AS order_id, o.code AS tracking_number, o.pickup_method, DATE_FORMAT(o.request_date,'%d %b %Y %r') AS request_date, o.sender_id, s.name AS sender_name, s.phone_number AS sender_phone, o.status_id, (SELECT ps.name FROM package_statuses AS ps WHERE ps.id=o.status_id LIMIT 1) AS status")->limit(1)->get();
        
            foreach($h_rows as $row) $header_row = $row;
            //return a string error message when there is no order record or pickup record found!
            if ($header_row == null) return 'No pickup information found for this tracking number';
              
            //begin:: Check if at least one package has been booked into table "package" 
            $cnt =0;
            $rows = DB::table("package AS p")->where('p.branch_id',$branch_id)->where('p.order_id',$order_id)->selectRaw("p.id")->limit(1)->get();
            foreach($rows as $row) $cnt = 1;
            if ($cnt >0) //This case: order has been booked in "delivery" table and packages are stored in "package" table
            {
               //These query based on 2 tables: "package","package_statuses"
               $header_row->packages = DB::table('package AS p')->join('package_statuses AS ps','ps.id','=','p.status_id')->where('p.branch_id',$branch_id)->where('p.order_id',$order_id)->selectRaw("p.id,p.qr_code AS barcode,CONCAT(IFNULL(p.dim_x,0),'cm x ',IFNULL(p.dim_y,0),'cm x ',IFNULL(p.dim_h,0),'cm') AS size,p.dim_x, p.dim_y, p.dim_h,p.billed_kg,p.actual_kg,p.price, p.receiver_address,p.receiver_phone, p.receiver_name, p.package_name, p.zone_code,p.df_payer,p.base_fee, p.sender_adjust_amount, IFNULL(p.driver_adjust_amount,0) AS driver_adjust_amount, p.delivery_fee, p.cod, p.cod_fee,p.status_id,ps.name AS status,IFNULL(p.sender_confirmed,0) AS sender_confirmed,IFNULL(p.sender_pmt_status_id,0) AS sender_pmt_status_id, NULL AS img_data")->get();
               return $header_row;
            } 
            else //order.status_id <4=> 4 = "Picked and Booked"
            {
              $header_row->packages = DB::table('order_receivers AS r')->join('order AS o','r.order_id','o.id')->where('o.branch_id',$branch_id)->where('o.id',$order_id)->selectRaw("r.id, CONCAT(IFNULL(r.dim_x,0),'cm x ',IFNULL(r.dim_y,0),'cm x ',IFNULL(r.dim_h,0),'cm') AS size, r.dim_x, r.dim_y, r.dim_h,r.billed_kg,r.actual_kg,r.price, r.receiver_address,r.receiver_phone, r.receiver_name, r.package_name, r.zone_code, r.cod, r.df_payer, 0 AS base_fee, 0 AS adjust_amount, r.delivery_fee, r.cod_fee,1 AS status_id,'Not picked Yet' AS status")->get();
              if ($show_attachments==1) {
                foreach($header_row->packages as $iRow) {
                  $iRow->img_data = $this->getFirstAttachment_package($branch_id,$iRow->id);     
                }
              }
              return $header_row;
            }
            //end::Check if the request order has been booked as delivery

            return [];
      }
     
      function getFirstAttachment_package($branch_id,$id){
        $rows = DB::table('package_attachments AS tt')->where('tt.branch_id',$branch_id)->where('tt.package_id',$id)->selectRaw('tt.file_name,tt.file_type')->limit(1)->get(); 
        foreach($rows as $row) {
          $content = readFileContent($row->file_name);   
          //$p = "data".getEncodedChar(':')."image".getEncodedChar("/").$row->photo_file_type.";"."base64".getEncodedChar(',');
          //****Return for javascript client
          //return $p.base64_encode($content);
          //**** return direct from server
           return "data:image/jpg;base64,".base64_encode($content);
        }
        return null;
      }

      function findOrders($data) {
        $ss = getSessionInfo($data);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
          $branch_id = $ss->branch_id;
          $order_code = sanitize(isset($data->order_code)?$data->order_code:0);

          //Get order details (This is like header data, and items are list of receivers that later become list of packages for the given @order_id )
          $h_rows = DB::table('order AS o')->join('sender AS s','s.id','=','o.sender_id')->selectRaw("o.id AS order_id,o.status_id, (SELECT os.name FROM package_statuses AS os WHERE os.id = o.status_id LIMIT 1) AS status, o.code as order_code, s.id AS sender_id, s.name AS sender_name, s.code AS sender_code, s.phone_number AS sender_phone, 
          (SELECT name FROM sender_type AS t WHERE t.id = s.sender_type_id LIMIT 1) AS sender_type,
          DATE_FORMAT(o.request_date,'%d %b %Y %r') AS request_date, o.qty, 0.product_type, o.request_vehicle_type, o.order_canceled, o.pickup_address, o.pickup_location, o.pickup_time")->where('o.branch_id',$branch_id)->where('o.code',$order_code)->limit(1)->get();

          //BEGIN:: IF order has become delivery record. Check if the order_id exists in table "delivery". If so, the pickup request becomes a delivery data
              $rows = DB::table('delivery AS d')->selectRaw("d.status")->where('d.branch_id',$branch_id)->where('d.order_code',$order_code)->limit(1)->get();
               //$delivery_status = null;
             $order_status =null;
            foreach($rows as $row)  //In this case: The order has become delivery with some status (delivery.status)
            {
              //$delivery_status = $row->status; /** todo: later, may check if Delivery status = something and do something**/
              //Assign deliveries to be the given @order_id 
              foreach($h_rows as $h_row) {
                 $order_status = $h_row->status;
                  $deliveries = DB::table('delivery AS d')->join('sender AS s','s.id','=','d.sender_id')->join('package AS p','p.delivery_id','=','d.id')->selectRaw("d.fleet_tracking_number, p.qr_code AS barcode,p.status, d.id AS delivery_id, d.fleet_tracking_number, s.id AS sender_id, s.name AS sender_name, s.code AS sender_code, s.phone_number AS sender_phone, 
                  (SELECT name FROM sender_type AS t WHERE t.id = s.sender_type_id LIMIT 1) AS sender_type,
                  DATE_FORMAT(o.depart_time,'%d %b %Y %r') AS delivery_date, d.package_count, d.delivered_count, d.failed_count,
                  p.receiver_name, p.receiver_phone,p.receiver_address_p.zone_code, NULL AS zone_name,
                  p.driver_id, (SELECT d1.name FROM `driver` AS d1 WHERE d1.id =p.driver_id LIMIT1) AS driver_name,
                  p.delivery_fee,p.df_payer,p.cod,p.failure_notes, p.status")->where('d.branch_id',$branch_id)->where('d.order_code',$order_code)->get();                  
                 $h_row->deliveries = $deliveries; // One order or pickup => has one ore many delvieries, each delivery is simply a package (bar_code, sender_info,receiver_info, delivery_date, etc)
                 return $h_row;   
              }
                            
            } 
          //END::IF order has become delivery record.

          foreach($h_rows as $h_row)  {
             $h_row->receivers = DB::table("order_receivers AS r")->join('order AS o','o.id','=','r.order_id')->selectRaw(" NULL AS barcode, 'Not Available' AS tracking_number, r.receiver_name,r.receiver_phone,r.receiver_address,r.zone_code,'".$order_status."' AS status")->where('o.branch_id',$branch_id)->where('order_code',$order_code)->get();
             return $h_row;
          }
          return null;
    }

    function getOrderInfo($uss,$order_id){
      $branch_id = $uss->branch_id;
      $select_cols ="o.id,o.status_id,o.sender_id,o.code, o.request_date,o.qty, o.product_type, o.sender_type_id";
      $rows = DB::table('order AS o')->join('sender AS s','s.id','=','o.sender_id')->where('o.branch_id',$branch_id)->where('o.id',$order_id)->selectRaw($select_cols)->limit(1)->get();
      foreach($rows as $row) return $row;
      return null;
  }
  
  //Vendor confirm that packages are correct in terms of fees and cod.
  //param $package_ids ="12|35|101" is used  when vendor check some packages and press "confirm" button
  //param $order_id is used when all packages in the delivery Order are correct | confirmTransaction (vendor) 
  function confirmCorrectAmounts($d){
    $ss = getSessionInfo($d);
    if(!$ss) return '#350'; //user not authenticated
    if (!prn_allowed(2)) return '@'; //need permission to do this task
    $branch_id = $ss->branch_id;
    $order_id = isset($d->order_id)?$d->order_id:0;
    
    if (empty($order_id) || $order_id <=0) {
      $package_ids= isset($d->package_ids)?$d->package_ids:0;
      $ids = 0;
      if (strpos($d->package_ids,'|')>=0) $ids = str_replace('|',',',$package_ids);
      $ids = '('. $ids.')';
      $more_wheres ="id IN ".$ids;
      DB::table('package')->where('branch_id',$branch_id)->whereRaw($more_wheres)->update(array(
        'sender_confirmed'=>1
      ));
    } else {
      $more_wheres ="order_id ='".$order_id."' ";
      DB::table('package')->where('branch_id',$branch_id)->whereRaw($more_wheres)->update(array(
        'sender_confirmed'=>1
      ));
    } 
    return null; 
  }
   
  function getSenderInfo($uss,$sender_id){
      $branch_id = $uss->branch_id;
      $exchange_rate  = $this->getExchangeRate($uss,$sender_id,"id")->buy_rate; //get exchangeRateBySenderId()
      $select_cols =$exchange_rate." AS exchange_rate,s.id,s.name,s.code,s.email,s.phone_number, s.address, (SELECT name FROM sender_type WHERE id = s.sender_type_id LIMIT 1) AS sender_type";
      $rows = DB::table('sender AS s')->where('s.branch_id',$branch_id)->where('s.id',$sender_id)->selectRaw($select_cols)->limit(1)->get();
      foreach($rows as $row) return $row;
      return null;
  }
 
 function getZoneCode($uss, $zone_name,$commune_id,$district_id,$city_id=null) {
    $branch_id = $uss->branch_id;
    $rows = DB::table('zones AS z')->where('branch_id',$branch_id)->where('zone_name',$zone_name)->selectRaw('z.zone_code')->limit(1)->get();
    foreach($rows as $row) return $row;
    $rows = DB::table('zones AS z')->where('branch_id',$branch_id)->where('commune_id',$commune_id)->selectRaw('z.zone_code')->limit(1)->get();
    foreach($rows as $row) return $row;
    $rows = DB::table('zones AS z')->where('branch_id',$branch_id)->where('district_id',$district_id)->selectRaw('z.zone_code')->limit(1)->get();
    foreach($rows as $row) return $row;
    $rows = DB::table('zones AS z')->where('branch_id',$branch_id)->where('city_id',$city_id)->selectRaw('z.zone_code')->limit(1)->get();
    foreach($rows as $row) return $row;
    
    return null;
 }

 function getTaxByProductCode($code) {
   return 0;
 }

 function getZoneByCode($uss,$zone_code) {
   $branch_id = $uss->branch_id;
   $rows = DB::table('zones AS z')->where('z.branch_id',$branch_id)->whereRaw("z.zone_code ='".$zone_code."'")->selectRaw('z.zone_code,z.zone_type,z.zone_name,z.city_id,z.district_id,z.commune_id,z.country_id')->limit(1)->get(); 
   foreach($rows as $row) return $row;
   return null;
 }

 function pickOrder($d){
    $ss = getSessionInfo($d);
    if(!$ss) return '#350'; //user not authenticated
    if (!prn_allowed(2)) return '@'; //need permission to do this task
    $branch_id = $ss->branch_id;
    $order_id = isset($d->order_id)?$d->order_id:0;
    $driver_id = isset($d->driver_id)?$d->driver_id:0;
    $notes = isset($d->notes)?$d->notes:null;
    $qty = isset($d->qty)?$d->qty:0; //default number of package 0

    if($order_id <=0) {
      return DV::error('request order identifier is not correct!');  
    }

    $result = (Object)([]);
    if($qty <=0) {
      return DV::error('Number of packages is not correct!'); 
    }
    $picked_status_id =3; // Picked but not booking any packages
    $pickup_time = getNowTime();
    DB::table('order')->where('branch_id',$branch_id)->where('id',$order_id)->update(array('pickup_time'=>$pickup_time,'qty'=>$qty,'status_id'=>$picked_status_id,'driver_id'=>$driver_id,'pickup_notes'=>$notes));
    
    //begin:: From Driver App=> Notify backend system, and Merchant App 
       $order = self::getOrderProps(null,$order_id,['o.code AS order_code','o.driver_name','status_id','status','completed','s.name AS sender_name','(SELECT `name` FROM `driver` WHERE `id`= o.driver_id LIMIT 1) AS driver_name','s.phone_number AS sender_phone_number']);
       if ($order) {
          $message = "$order->driver_name បានទទួលទំនិញ ពីអ្នកលក់ $order->sender_name($order->sender_phone_number)  នៅ $order->pickup_address";
          $event_data = (object)['branch_id'=>$branch_id,'order_id'=>$order_id,'order_code'=>$order->order_code,'sender_id'=>$ss->user_id,'status'=>$order->status,'status_id'=>$status_id,'completed'=>$order->completed,'driver_id'=>$order->driver_id,'driver_name'=>$order->driver_name,'message'=>$message];
          Notifier::notify_admin('order_status_changed',$event_data);

          //set target_user_id (that is which merchant to receive the notification)
          $event_data->target_user_id = $this->getUserId('merchant',$order->sender_id,'user_id');
          if ($event_data->target_user_id > 0){
            Notifier::notify_merchant('order_picked',$event_data);  
          } else return DV::success(['notification_error'=>'failed to notify merchant because merchant identity was invalid']);
          
       }else {
         return DV::success(["notification_error"=>"Unexpectedly, the orderid $order_id is invalid"]);
       }
    //end:: From Driver App=> Notify backend system, and Merchant App

    return DV::success();
  }
 
  //return um_users.id based on a given @sender_id or @driver_id
  function getUserId($user_class,$id,$prop){
     $rows = [];
     if($user_class =='merchant' || $user_class=='sender')
       $rows = DB::table('um_users AS u')->where('official_id',$id)->where('user_class',$user_class)->selectRaw($prop)->limit(1)->get();
     else if($user_class =='driver')
       $rows = DB::table('um_users AS u')->where('official_id',$id)->where('user_class',$user_class)->selectRaw($prop)->limit(1)->get();
     foreach($rows as $row) return $row->{$prop};
     return null;    
  }

    //if $cols is NULL => use defeaul cols defined in this method
    static function getOrderProps($branch_id=null,$id=null,$cols=null){
      if(!$id) return null;
      if(!$cols) 
        $cols = ["`o`.`id` AS order_id","o.`sender_id`","o.driver_id","o.`code` as order_code","DATE_FORMAT(request_date,'%d %b %Y') AS request_date","DATE_FORMAT(request_date,'%r') AS request_time","o.delivery_type","o.product_type","o.request_vehicle_type AS vehicle_type","o.qty","s.name AS sender_name","pickup_address","(SELECT name FROM driver WHERE id = o.driver_id) AS driver_name","o.delivery_condition","status_id","ps.name AS status","o.completed"];
      else {
          $indx = array_search('status',$cols,true);
          if($indx >=0){
              $cols[$indx] = 'ps.name AS status';
          }
      }
      $fields = implode(',',$cols);
      $more_where ="1=1";
      if($branch_id >0) $more_where ="o.branch_id =$branch_id"; 
      $rows = DB::table('order AS o')->whereRaw($more_where)->where('o.id',$id)->join('package_statuses AS ps','ps.id','=','o.status_id')->join('sender AS s','s.id','=','o.sender_id')->selectRaw($fields)->limit(1)->get();
      foreach($rows as $row) return $row;
      return null;  
  }
   
  function getZoneName($ss,$zone_code){
    $branch_id = $ss->branch_id;
    $rows = DB::table('zones')->where('branch_id',$branch_id)->where('zone_code',$zone_code)->selectRaw('zone_name')->limit(1)->get();
    foreach($rows as $row) return $row->zone_name;
    return null;
  }
 
  function getBilledWeight($dim_x, $dim_y, $dim_h, $actual_weight, $adjusted_kg =0) {
     if (!is_numeric($dim_x)) $dim_x = 0;
     if (!is_numeric($dim_y)) $dim_y = 0;
     if (!is_numeric($dim_h)) $dim_h = 0;
     if (!is_numeric($actual_weight)) $actual_weight = 0;
     
      $b = ($dim_x * $dim_y * $dim_h)/6015;
      if ($b > $actual_weight) 
        return ($b + $adjusted_kg);
      else
         return ($actual_weight + $adjusted_kg);  
  }
  
      function getCODFeeCharge($ss, $sender_id) {
        $branch_id = $ss->branch_id;
        $today = Date('Y-m-d');
        $more_where = "1=1 AND ((IFNULL(c.never_expires,0) =1) OR (DATE(c.start_date) <='".$today."' AND DATE(c.end_date) >='".$today."' ) )";
        //$more_where = "1=1 AND ((DATE(c.start_date) <='".$today."' AND IFNULL(c.never_expires,0) =1) OR (DATE(c.start_date) <='".$today."' AND DATE(c.end_date) >='".$today."' ) )";
        $rows = DB::table("sender_cod_charges AS c")->where('c.branch_id',$branch_id)->where('sender_id',$sender_id)->whereRaw($more_where)->selectRaw("cod_fee_percent, 0 AS cod_fee")->limit(1)->get();
        foreach($rows as $row) {
          return (is_numeric($row->cod_fee_percent)?$row->cod_fee_percent:0);
        } 
        $defaul_cod_fee_charge = get_settings_value($ss,'COD_FEE_PERCENT','number');
        return $defaul_cod_fee_charge;
      }

      // //base_price is fixed price set as Promotion for some sellers. NOTE @zone_code is nevery empty. @zone_code ='all' instead of empty
      // function getBaseFee($ss, $sender_id, $zone_code = 'all'){
      //   $branch_id = $ss->branch_id;
      //   $today = Date('Y-m-d');
      //   $more_where = "1=1 AND ((IFNULL(f.never_expires,0) =1) OR (DATE(f.start_date) <='".$today."' AND DATE(f.end_date) >='".$today."' ) )";
      //   //$more_where = "1=1 AND ((DATE(f.start_date) <='".$today."' AND IFNULL(f.never_expires,0) =1) OR (DATE(f.start_date) <='".$today."' AND DATE(f.end_date) >='".$today."' ) )";
      //   $str_zone = null;
      //   if (!empty($zone_code)) $str_zone =" AND f.zone_code ='".$zone_code."' ";
      //   $more_where .= $str_zone.
      //   $rows = DB::table("sender_base_price AS f")->where('f.branch_id',$branch_id)->where('f.sender_id',$sender_id)->whereRaw($more_where)->selectRaw("f.price")->limit(1)->get();
      //   foreach($rows as $row) {
      //     return (is_numeric($row->price)?$row->price:0);
      //   } 
      //   return 0;
      // }

      function getSenderPriceList($uss,$sender_id, $zone_code=null, $delivery_type=null, $billed_kg =null){
        $branch_id = $uss->branch_id;
        $today = Date('Y-m-d');
        $str_zone =null;
        $str_delivery_type =null;
        $str_kg = null;
        
        if (!empty($zone_code)) $str_zone =" AND f.zone_code ='".$zone_code."' ";
        if (!empty($delivery_type)) $str_delivery_type =" AND f.delivery_type ='".$delivery_type."' ";
        if (is_numeric($billed_kg)) $str_kg = " AND f.start_kg <=".$billed_kg." AND f.end_kg >=".$billed_kg;
        $more_where = "1=1 AND ((IFNULL(f.never_expires,0) =1) OR (DATE(f.start_date) <='".$today."' AND DATE(f.end_date) >='".$today."' ) )".$str_zone.$str_delivery_type.$str_kg;
         
        // "sender_price_list.base_price AS base_fee" or "price_list.base_price AS base_fee" is used as default base_fee. But the base price from "sender_base_price.price" takes highest priority
        // "sender_price_list.base_price AS base_fee" or "price_list.base_price AS base_fee" is base_fee by ZONE code, while "sender_base_price.price" is fixed price for all zone codes for a specific sender
        $rows = DB::table("sender_price_list AS f")->where('f.branch_id',$branch_id)->where('f.sender_id',$sender_id)->whereRaw($more_where)->selectRaw("f.sender_id,f.zone_code,f.delivery_type,f.base_price AS base_fee, f.price_per_kg,f.price,f.start_kg,f.end_kg")->get();
        if (!isset($rows[0])) {
            $rows = DB::table("price_list AS f")->where('f.branch_id',$branch_id)->whereRaw($more_where)->selectRaw( "'".$sender_id. "' AS sender_id,f.zone_code,f.delivery_type,f.base_price AS base_fee, f.price_per_kg,f.price,f.start_kg,f.end_kg")->get();
        }

        if (!isset($rows[0])) {
            $price_per_kg = get_settings_value($uss,'PRICE_PER_KG','number');
            $price = 0; 
            $data[] = (object)array('sender_id'=>$sender_id,'zone_code'=>'all','price_per_kg'=>$price_per_kg,'price'=>$price,'start_kg'=>0,'end_kg'=>0);
            return $data; 
        }
          return $rows;
      }

      /** getSenderPriceInfo, getPriceInfoByPackakage() returns senderPriceInfo = {'sender_id','cod_fee_percent','base_fee','price_per_kg','price_list'}  **/
      /** @default_base_price, @price_per_kg, @price is retrieved from table "sender_price_list.base_price" or "price_list.base_price" BASED ON given (@sender_id,zone_code,delivery_type) **/
      /** @cod_fee_percent is retrieved from table "sender_cod_fee_charges" within a valitity period or never expires **/
      function getPriceInfoByPackage($d){
          $ss = getSessionInfo($d);
          if(!$ss) return '#350'; //user not authenticated
          if (!prn_allowed(2)) return '@'; //need permission to do this task
          $branch_id = $ss->branch_id;
          $data = (object)array('sender_id'=>0,'cod_fee_percent'=>0,'cod_fee'=>0,'base_fee'=>0,'price_per_kg'=>0,'price_list'=>[]);
          $package_id = isset($d->package_id)? sanitize($d->package_id):0;
          $rows = DB::table('package AS p')->where('p.branch_id',$branch_id)->where('p.id',$package_id)->selectRaw('p.sender_id,p.delivery_type,p.zone_code,p.billed_kg')->limit(1)->get();
          foreach($rows as $row){
            $sender_id = $row->sender_id;
            $zone_code = $row->zone_code;
            $delivery_type = $row->delivery_type;
            $billed_kg = $row->billed_kg;

            $p = $this->getDeliveryPriceInfo($branch_id,$sender_id,$delivery_type,$zone_code,$billed_kg);
            $data->sender_id = $sender_id; 
            $data->cod_fee_percent = $p->cod_fee_percent; //$this->getCODFeeCharge($ss,$sender_id);
            $data->base_fee = $p->base_fee;

            if(!is_numeric($data->price_per_kg)) $data->price_per_kg =0;

            //$data->$price =0; //found price that matches when all conditions are specified
            $data->price_list =[];// $this->getSenderPriceList($ss,$sender_id,$zone_code,$delivery_type,null);
            return $data;
          }
           return $data;
      }

  //Called extrnally
  function getSenderPriceByZone1($d) {
      $ss = getSessionInfo($d);
      if(!$ss) return '#350'; //user not authenticated
      if (!prn_allowed(2)) return '@'; //need permission to do this task
      return $this->getSenderPriceByZone($ss);
  }

  // if there is specific sender_price_list, it returns that list. Otherwise, returns general "price_list" by zone. sometimes @zone_code ="all"
  function getSenderPriceByZone($ss,$sender_id,$billed_kg =0, $zone_code='all'){
    $branch_id = $ss->branch_id;
    $data = (object)(array('base_price'=>0,'price'=>0,'price_per_kg'=>0));
    $today = Date('Y-m-d');
    $more_where = "1=1 AND ((DATE(f.start_date) <='".$today."' AND IFNULL(f.never_expires,0) =1) OR (DATE(f.start_date) <='".$today."' AND DATE(f.end_date) >='".$today."' ) )";
    $str_zone = null;
    $str_weight =null;

    //In price_list table => price_List.zone_code ='all' in case that the price applied to all zones
    if(!empty($zone_code))  $str_zone = " AND f.zone_code ='".$zone_code."' ";
    if($billed_kg >0) $str_weight = " AND ((f.start_kg=0 AND f.end_kg =0) OR (f.start_kg <= ".$billed_kg." AND f.end_kg >=".$billed_kg. "))"; 
    $more_where .= $str_zone.$str_weight;
    $rows =[];
    if($sender_id >0) {
      $rows = DB::table("sender_price_list AS f")->where('f.branch_id',$branch_id)->where('f.sender_id',$sender_id)->whereRaw($more_where)->selectRaw("f.price,f.price_per_kg")->limit(1)->get();
    } else {
      $rows = DB::table("price_list AS f")->where('f.branch_id',$branch_id)->whereRaw($more_where)->selectRaw("f.price,f.price_per_kg")->limit(1)->get();
    }
 
    foreach($rows as $row) {
      $rows = DB::table('sender_base_price AS f')->where('f.branch_id',$branch_id)->where('f.sender_id',$sender_id)->whereRaw($more_where)->selectRaw("f.price")->limit(1)->get();
      $row->base_price= 0;
      foreach($rows as $r) $row->base_price = $r->price; //base price or minimum price
      return $row;
    }  
    return $data; //default price_info
  }

   //Pick order request for FAST delivery. Driver must enter each package's details (receiver phone, receiver address, zone name, delivery_fee, df_payer, price, COD, taxi fee, COD_fee)
   //param: $d = {'driver_id','delivery_type','delivery_condition','order_id','packages':[{ zone_name,zone_code,city_id,district_id,commune_id, receiver_phone, receiver-address, delivery_fee, df_payer, price, cod, cod_fee, forwarding_cost, dim_x, dim_y, dim_h, actual_kg, billed_kg}]}
   function pickOrderPackages_fast_delivery($d){
    $ss = getSessionInfo($d);
    if(!$ss) return '#350'; //user not authenticated
    if (!prn_allowed(2)) return '@'; //need permission to do this task
    $branch_id = $ss->branch_id;

    $delivery_types = ['fast'];
    $result = (object)array();
    $order_id = isset($d->order_id)?sanitize($d->order_id):0;
    
    $d->delivery_condition = isset($d->delivery_condition)?sanitize($d->delivery_condition):null;
    $d->delivery_type= isset($d->delivery_type)?sanitize($d->delivery_type):'Fast';
  
    //depart_time is always the current server's time  => timezone = (Asia/Bangkok)
    $d->depart_time = getNowTime();
    //$d->depart_time = isset($d->depart_time)?convertDate($d->depart_time):getNowTime();
    $d->vehicle_type = isset($d->vehicle_type)?sanitize($d->vehicle_type):'motobike';
   
    if (!(bool)strtotime($d->depart_time)) $d->depart_time = date('Y-m-d');
    
    if(!in_array(strtolower($d->delivery_type),$delivery_types)) {
      return DV::error('Delivery Type must be Fast');
    }
    
     if(!isset($d->packages[0])) {
       return DV::error('Failed to start a trip because there are no package information provided');
     }

    $delivery_type = $d->delivery_type;

    if(empty($d->driver_id) || $d->driver_id <=0) {
       return DV::error('Driver or delivery person identity is required for Fast delivery');
     }

    $order = $this->getOrderInfo($ss,$order_id);
    if($order ==null) {
       return DV::error('Order identifier is not valid');
    } 
    $sender = $this->getSenderInfo($ss,$order->sender_id);
    
    $warehouse_id = $this->getWarehouseIdByDriver_default($branch_id,$d->driver_id);

    $fleet_tracking_number = null;
    $delivery_id =null;
    //##begin::create delivery record if not yet exists
        $rows = DB::table('delivery AS d')->where('branch_id',$branch_id)->where('order_id',$order_id)->selectRaw('d.id AS delivery_id, d.fleet_tracking_number')->limit(1)->get();
        foreach($rows as $row) {
          $delivery_id = $row->delivery_id;
          $fleet_tracking_number  = $row->fleet_tracking_number;
        }
        if ($delivery_id == null) {
            $fleet_tracking_number = $this->getNextFleetNumber($ss); //Allow creating fleet number for FAST delivery
            $def_trip_status_id = 2; //Fast delivery, so trip's status_id is 2 = "Delivery Started" //This is Trip status, not package status. 0 = "Canceled",1="Pending",2="On the way",3 ="Done" 4= Delayed
            DB::table('delivery')->insert(array(
              'branch_id'=>$branch_id,
              'warehouse_id'=>$warehouse_id,
              'depart_time'=>$d->depart_time,
              'delivery_type'=>$d->delivery_type,
              'vehicle_type'=>$d->vehicle_ype,
              'fleet_tracking_number'=>$fleet_tracking_number, //Fleet_tracking_number is used by Delivery Company to track each driver on the trip
              'order_id'=>$order_id,
              'driver_id'=>$d->driver_id,
              'status_id'=>$def_trip_status_id, /** trip 's status here is 1 = "Pending", waiting for driver tp press "Start Fast Deliver" button **/
              'create_date'=>getNowTime(),
              'create_user'=>$ss->login_name,
              'update_user'=>$ss->login_name,
              'update_date'=>getNowTime()
          ));
          $delivery_id = DB::getPdo()->lastInsertId();
        }  
    //##end::create dlviery record if not yet exists
  
    $i = 0;
    $success_count =0;
    $c;
    do{
       if (!isset($d->packages[$i])) break;
       $c = (object)($d->packages[$i]);
       if(!isset($c->receiver_phone)) $c->receiver_phone = null;  
       
         if(empty($c->receiver_phone)) {
            $result->status ='Error';
            $result->error_message ='At least of the package does not have receiver phone number';
            return $result;
         }

       if(!isset($c->receiver_name)) $c->receiver_name = $c->receiver_phone; 
       if(!isset($c->receiver_address)) $c->receiver_address = null; 
        
       //if @zone_code is supplied => use @zone_code to derive commune_id. Otherwise, use @district_id and @commune_id to derive @zone_code
       $zone_code = isset($c->zone_code)?$c->zone_code:null;
       $zone_name = isset($c->zone_name)?$c->zone_name:null;
       $city_id = isset($c->city_id)?$c->city_id:0;
       $district_id = isset($c->district_id)?$c->district_id:0;
       $commune_id = isset($c->commune_id)?$c->commune_id:0;
       $package_name= null;
       //if no package name specified then use receiver's phone number as package name
       if(!isset($c->package_name)) $package_name = $c->receiver_phone;
   
       //$c->delivery_condition = isset($c->delivery_condition)?$c->delivery_condition:'MA';
       //$c->delivery_type = isset($c->delivery_type)?$c->delivery_type:'Normal'; 
       $c->delivery_fee = isset($c->delivery_fee)?sanitize($c->delivery_fee):0;
       $c->price = isset($c->price)?sanitize($c->price):0;
       $c->cod = isset($c->cod)?sanitize($c->cod):0;
       $c->cod_fee = isset($c->cod_fee)?sanitize($c->cod_fee):0;
       $c->df_payer = isset($c->df_payer)?sanitize($c->df_payer):null;
       $c->forwarding_cost = isset($c->forwarding_cost)?sanitize($c->forwarding_cost):0;
       $c->dim_x = isset($c->dim_x)?sanitize($c->dim_x):0;
       $c->dim_y = isset($c->dim_y)?sanitize($c->dim_y):0;
       $c->dim_h = isset($c->dim_h)?sanitize($c->dim_h):0;
       //$c->weight_kg = isset($c->weight_kg)?sanitize($c->weight_kg):0;
       $c->actual_kg = isset($d->actual_kg)?sanitize($c->actual_kg):0;
       $c->billed_kg = isset($d->billed_kg)?sanitize($c->billed_kg):null; 
     
       //if ($c->billed_kg <=0) $c->billed_kg = $c->weight_kg;
       if ($c->actual_kg <=0) $c->actual_kg = $c->billed_kg;
       
       if(strtolower($c->df_payer) != 'sender' && strtolower($c->df_payer) != 'receiver') {
          $result->status ='Error';
          $result->error_message = 'Delivery Fee Payer must be either a Sender or Receiver. The input value is '.$c->df_payer;
          return $result;
       }

       //Here is a bit tricky. package status "5" = "Arrived at Warehouse", but in fact, packages are not brought to warehouse.
       //Here driver enter package into with status "5" and then press "Start Fast Delivery" button (in this sense, packase status changed to "6" ="Delivery Started" ) to start delviery immediately
       //So goods not arrived at Warhouse,
      $package_status_id =5; 
   
     //$product_type = $order->product_type;
     $order_code = $order->code;
     $sender_type_id = $order->sender_type_id;
     
     //set default $sender_type-id = 1 (Normal) If this is data is not supplied
     if($sender_type_id) $sender_type_id =1;

     $bar_code = $this->createQRCode($ss,7);
     $cod_fee = 0;
     $tax_amount =0;
     if(!isset($c->product_code)) $c->product_code = null; 
     $tax_percent =$this->getTaxByProductCode($c->product_code);
     $tax_amount = ($c->price * $tax_percent/100);
 
     $zone = $this->getZoneByCode($ss,$c->zone_code);
     if ($zone ==null) {
        $result->status ='Error';
        $result->error_message ='Failed to identify the destination zone for some packages';
        return $result;
     }
 
     $systematic_billed_kg = $this->getBilledWeight($c->dim_x,$c->dim_y,$c->dim_h, $c->actual_kg);
     if ($c->billed_kg==null) $c->billed_kg = $systematic_billed_kg;
     
     $driver_total =0;
     $sender_total=0;
     $base_fee = 0 ;
     $cod_amount =0; 
     $applied_fixed_Price =0;

     $p = $this->getDeliveryPriceInfo($branch_id,$sender->id,$d->delivery_type,$c->zone_code,$c->billed_kg);
     if($p){
       $base_fee = $p->base_fee;
       $delivery_fee = $p->delivery_fee;
       $cod_fee_percent = $p->cod_fee_percent;
     } 

      if ($c->cod ==1) {
        $cod_fee = ($base_fee + $delivery_fee) * $cod_fee_percent/100;
        $cod_amount = $c->price;
      }
      $driver_total = $cod_amount;
      $sender_total = $cod_fee;

      if ($c->df_payer =='sender') {
         $driver_total += $base_fee + $delivery_fee;
      }else{
         $sender_total+= $base_fee + $delivery_fee + $c->forwarding_cost; 
      }

      if ($base_fee > 0) {
          $applied_fixed_Price =1;  
      } else {
          $applied_fixed_Price = 0;  
      }
 
      if (isset($d->size))
      {
         $m = (object)$c->size;
         $c->dim_x = $m->length;
         $c->dim_y = $m->width;
         $c->dim_h = $m->height;
      } 
       //todo: delete package (order_id,receiver_phone)??? or allow driver to review package list and delete the duplicate package???
       DB::table('package')->insert(array(
         'branch_id'=>$branch_id,
         'warehouse_id'=>$warehouse_id,
         'order_id'=>$order_id,
         'delivery_id'=>$delivery_id,
         'driver_id'=>$d->driver_id,
         'arrival_time'=>getNowTime(),
         'pickup_time'=>getNowTime(),
         'tracking_number'=>$order_code, //order_code becomes tracking number, For seller or sender to track all their packages 
         'sender_id'=>$sender->id, 
         'sender_email'=>$sender->email,
         'sender_phone'=>$sender->phone_number,
         'sender_type'=>$sender->sender_type,
         'delivery_condition'=>$d->delivery_condition,
         'delivery_type'=>$d->delivery_type, //must be "Fast"
         'qr_code'=>$bar_code,
         'package_name'=>$package_name,
         'receiver_name'=>$c->receiver_name,
         'receiver_address'=>empty($c->receiver_address)? $zone->zone_name:$c->receiver_address,
         'receiver_phone'=>$c->receiver_phone,
         'zone_code'=>$zone->zone_code,
         'zone_name'=>$zone->zone_name,
         //'map_location'=>$zone->map_location,
         'delivery_fee'=>$delivery_fee,
         'base_fee'=>$base_fee,
         //'applied_fixed_price'=>$applied_fixed_Price,
         'df_payer'=>$c->df_payer,
         'dim_x'=>$c->dim_x,
         'dim_y'=>$c->dim_y,
         'dim_h'=>$c->dim_h,
         'actual_kg'=>$c->actual_kg,
         'billed_kg'=>$c->billed_kg,
         'price'=>$c->price, //price of package that needs to be collected from reeciver
         'cod'=>$c->cod,
         'cod_fee'=>$cod_fee,
         'tax_amount'=>$tax_amount,
         'tax_percent'=>$tax_percent,
         'driver_total'=>$driver_total,
         'sender_total'=>$sender_total,
         'forwarding_cost'=>$c->forwarding_cost,
         "exchange_rate"=>$sender->exchange_rate,
         'status_id'=>$package_status_id, //5 = "Arrived At warehouse", but waiting for Driver to press "Start Delivery" button to start Fast Delivery
         'create_user'=>$ss->login_name,
         'create_date'=>getNowTime()
        )); 
        //$new_package_id = DB::getPdo()->lastInsertId();
        $success_count++; 
        $i++;
    } while($c);
    
    $pickup_time = getNowTime();
    $completed =1; //delivery order is completed at stage of Arrived At Warehouse
    $order_status_id = 5; // Order.status_id =5 => Assuming that the Package is arrived at Warehouse (For Fast Delivery)
    DB::table('order')->where('branch_id',$branch_id)->where('id',$order_id)->update(array('pickup_time'=>$pickup_time,'qty'=>$success_count,'driver_id'=>$d->driver_id,'completed'=>$completed,'status_id'=>$order_status_id));
    // DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->update(array(
    //   'package_count'=>$success_count,
    //   'delivered_count'=>0,
    //   'failed_count'=>0
    // ));

     $result->package_count = $success_count; 
     $result->status ='OK';
     $result->delivery_id = $delivery_id;
     $result->fleet_tracking_number = $fleet_tracking_number;
     $result->error_message = null;
     return $result;
 }

  //Pick request delivery order @data = {"pick_and_arrive",order_id,delivery_type,receiver_name,receiver_phone,receiver_address, zone_code,price, cod,df_payer, actual_kg,billed_kg, length, width, height }
  function pickOrderPackage($d){
     $ss = getSessionInfo($d);
     if(!$ss) return '#350'; //user not authenticated
     if (!prn_allowed(2)) return '@'; //need permission to do this task
     $branch_id = $ss->branch_id;

     $delivery_types = ['normal','fast'];
     $result = (object)array();
     $order_id = isset($d->order_id)?sanitize($d->order_id):0;
     $pick_and_arrive = isset($d->pick_and_arrive)?$d->pick_and_arrive:0;
     //$d->delivery_date = isset($d->delivery_date)?convertDate($d->delivery_date):null;
     //if (!(bool)strtotime($d->delivery_date)) $d->delivery_date = date('Y-m-d');

     $receiver_name = isset($d->receiver_name)?sanitize($d->receiver_name):null;
     $receiver_phone = isset($d->receiver_phone)?sanitize($d->receiver_phone):null;
     $receiver_address = isset($d->receiver_address)?sanitize($d->receiver_address):null;
     //if @zone_code is supplied => use @zone_code to derive commune_id. Otherwise, use @district_id and @commune_id to derive @zone_code
     $zone_code = isset($d->zone_code)?sanitize($d->zone_code):null;
     $zone_name = isset($d->zone_name)?sanitize($d->zone_name):null;
     $city_id = isset($d->city_id)?sanitize($d->city_id):0;
     $district_id = isset($d->district_id)?sanitize($d->district_id):0;
     $commune_id = isset($d->commune_id)?sanitize($d->commune_id):0;
     $package_name= null;
     //if no package name specified then use receiver's phone number as package name
     if(!isset($d->package_name)) $package_name = $d->receiver_phone;

     $d->delivery_condition = isset($d->delivery_condition)?sanitize($d->delivery_condition):"None";
     $d->delivery_type = isset($d->delivery_type)?sanitize($d->delivery_type):null; 
     $d->delivery_fee = isset($d->delivery_fee)?sanitize($d->delivery_fee):0;
     $d->price = isset($d->price)?sanitize($d->price):0;
     $d->cod = isset($d->cod)?sanitize($d->cod):0;
     $d->cod_fee = isset($d->cod_fee)?sanitize($d->cod_fee):0;
     $d->df_payer = isset($d->df_payer)?sanitize($d->df_payer):null;
     $d->forwarding_cost = isset($d->forwarding_cost)?sanitize($d->forwarding_cost):0;
    //  $d->dim_x = isset($d->dim_x)?sanitize($d->dim_x):0;
    //  $d->dim_y = isset($d->dim_y)?sanitize($d->dim_y):0;
    //  $d->dim_h = isset($d->dim_h)?sanitize($d->dim_h):0;

     $d->actual_kg = isset($d->actual_kg)?sanitize($d->actual_kg):0;
     $d->billed_kg = isset($d->billed_kg)?sanitize($d->billed_kg):0; 
     if ($d->actual_kg <=0) $d->actual_kg = $d->billed_kg;
     
     if(strtolower($d->df_payer) != 'sender' && strtolower($d->df_payer) != 'receiver') return DV::error('Delivery Fee Payer must be either a Sender or Receiver. The input value is '.$d->df_payer); 
     
     $deliveryTypes = ['normal','fast'];
     if (!in_array(strtolower($d->delivery_type), $delivery_types)) return DV::error('Delivery Type must be either Normal or Fast'); 

     if (strtolower($d->delivery_type) =='fast'){
        if(!isset($d->driver_id) || $d->driver_id <=0) {
          return DV::error('Driver or delivery person is required for Fast delivery');
        }
     }

     $order = $this->getOrderInfo($ss,$order_id);
     if($order ==null) return DV::error('Order identifier is not valid');  
     $sender = $this->getSenderInfo($ss,$order->sender_id);
     
     //$zone = $this->getZoneCode($ss,$d->zone_code,$d->commune_id,$d->district_id,$d->city_id);
     $zone = $this->getZoneByCode($ss,$zone_code);
     if ($zone ==null) return DV::error('Failed to identify the destination zone'); 
 
     
     $package_status_id =4; // status = "Picked and Booked" into the system, but not yet arrrived at Warehouse 
     $qty = $order->qty;
     $delivery_fee = 0;
     $cod_fee =0;

      //$product_type = $order->product_type;
      $order_code = $order->code;
      $sender_type_id = $order->sender_type_id;
      
      if(empty($d->billed_kg)) {
        $systematic_billed_kg = $this->getBilledWeight($d->dim_x,$d->dim_y,$d->dim_h, $d->actual_kg);
        $d->billed_kg = $systematic_billed_kg;
      }
 
      if (!isset($d->product_code)) $d->product_code =null;
      $tax_percent = $this->getTaxByProductCode($d->product_code);
      $tax_amount = $d->price * $tax_percent/100;
     
      //begin::calculation of package pricing to sender and driver
            $cod = isset($d->cod)?$d->cod:0;
            $forwarding_cost = isset($d->forwarding_cost)?$d->forwarding_cost:0; 
            $price = isset($d->price)?$d->price:0;
            $df_payer = isset($d->df_payer)?$d->df_payer:null;
            $cod_amount =0;
            $delivery_fee = 0;
            $cod_fee = 0;
            $cod_fee_percent =0;
            $other_fees =0;
            $base_fee =0;
            $sender_id = isset($d->sender_id)?$d->sender_id:null;
            $delivery_type = isset($d->delivery_type)?$d->delivery_type:null;
            $pInfo = $this->getDeliveryPriceInfo($branch_id,$sender_id,$delivery_type,$zone_code,$d->billed_kg);
            if ($pInfo) {
                $delivery_fee = $pInfo->delivery_fee;
                $base_fee =$pInfo->base_fee;
                $cod_fee_percent = $pInfo->cod_fee_percent;
            }
 
            if ($cod ==1 || strtolower($cod) =='yes') {
              $cod_amount = is_numeric($d->price)?$d->price:0;
              $cod_fee = ($price + $base_fee + $delivery_fee) * $cod_fee_percent/100; 
            }
            $driver_total = $cod_amount;
            $sender_total = $cod_fee + $forwarding_cost; //Seller always has to pay forwarding cost or Taxi fee  
            if (strtolower($df_payer) == 'sender') 
                $sender_total += $base_fee + $delivery_fee;
            else 
              $driver_total += $base_fee + $delivery_fee;
    //end::calculation of package pricing to sender and driver
 
       //Process package size
          if (isset($d->size))
          {
              $m =(object)$d->size;
              if (isset($m->length)) {
                $c->dim_x = $m->length;
                $c->dim_y = $m->width;
                $c->dim_h = $m->height;
              } 
          }
       //process package size    
                
       $warehouse_id = $this->getWarehouseIdByDriver_default($branch_id,$d->driver_id);
       if (!$warehouse_id) return DV::error("It seems you do not have a correct warehouse assignment"); 

       //$package_name = getNowTime();
       $pickup_time = getNowTime();
       $bar_code = $this->createQRCode($ss,7);
      //todo: delete package (order_id,receiver_phone)??? or allow driver to review package list and delete the duplicate package???
      $table ="order_receivers";
      if ($pick_and_arrive ==1 || $pick_and_arrive ==true) $table ="package";
      DB::table($table)->insert(array(
          'branch_id'=>$branch_id,
          'warehouse_id'=>$warehouse_id,
          'order_id'=>$order_id,
          'delivery_id'=>null,
          'driver_id'=>$d->driver_id,
          'arrival_time'=>getNowTime(), /** When driver books package detail => also set arrival time (even package not yet arrive Warehouse) in order for function "getDeliveryItemsBySender()" returns correct list of packages  **/
          'pickup_time'=>$pickup_time,
          'tracking_number'=>$order_code, //order_code becomes tracking number, For seller or sender to track all their packages 
          'sender_id'=>$sender->id, 
          'outstanding'=>1,
          "exchange_rate"=>$sender->exchange_rate,
          'sender_email'=>$sender->email,
          'sender_phone'=>$sender->phone_number,
          'sender_type'=>$sender->sender_type,
          //'delivery_condition'=>$d->delivery_condition,
          'delivery_type'=>$d->delivery_type,
          'qr_code'=>$bar_code,
          //'package_name'=>$package_name,
          'receiver_name'=>$d->receiver_name,
          'receiver_address'=>$d->receiver_address,
          'receiver_phone'=>$d->receiver_phone,
          'zone_code'=>$zone->zone_code,
          'zone_name'=>$zone_name,
          //'map_location'=>$d->map_location,
          'delivery_fee'=>$delivery_fee,
          'base_fee'=>$base_fee,
          'df_payer'=>$d->df_payer,
          'dim_x'=>$d->dim_x,
          'dim_y'=>$d->dim_y,
          'dim_h'=>$d->dim_h,
          'actual_kg'=>$d->actual_kg,
          'billed_kg'=>$d->billed_kg,
          'price'=>$d->price,
          'cod'=>$d->cod,
          'cod_fee'=>$cod_fee,
          'forwarding_cost'=>$d->forwarding_cost,
          'tax_amount'=>$tax_amount,
          'tax_percent'=>$tax_percent,
          'driver_total'=>$driver_total,
          'sender_total'=>$sender_total,
          'status_id'=>$package_status_id, //4 = "Picked and Booked"
          'create_user'=>$ss->login_name,
          'create_date'=>getNowTime()
      ));
        $new_package_id = DB::getPdo()->lastInsertId();
        $p_count = $this->countPackagesByOrder($order_id);

        $order_status_id =4; /** Picked and booked **/
        if ($pick_and_arrive==1) $order_status_id =5; /** arrived at warehouse **/
        DB::table('order')->where('id',$order_id)->update(array(
          'qty'=>$p_count,
          'status_id'=>$order_status_id
        ));
      return DV::success(["order_id"=>$order_id,"package_id"=>$new_package_id,"bar_code"=>$bar_code]);
  }

  //performPickup() is for Admin user to perform Pickup on behelf of a driver who uses Driver mobile app. 
  //It is assumed that when Admin user perform picks up, the goods alread Arrived at Warehouse (status_id =5)
  function performPickup($d){
    $ss = getSessionInfo($d);
    if(!$ss) return '#350'; //user not authenticated
    if (!prn_allowed(2)) return '@'; //need permission to do this task
    $branch_id = $ss->branch_id;

    $delivery_types = ['normal','fast'];
    $result = (object)array();

    $order_id = isset($d->order_id)? $d->order_id:0;
    $sender_id = isset($d->sender_id)? $d->sender_id:0;
    $d->to_warehouse_id = isset($d->to_warehouse_id)?$d->to_warehouse_id:0;
    $d->pick_on_arrival = isset($d->pick_on_arrival)?$d->pick_on_arrival:0;
    $pickup_date = $d->pickup_date;
    $driver_id = $d->driver_id; //This is a driver who picked up the goods. If @driver_id =0 => The goods are brought in Office by the Sellers themselves
   
    if($d->to_warehouse_id <=0) {
      $result->status ='Error';
      $result->error_message ='Receiving Warehouse identity is not valid';
      return $result;
    }

    if(!(bool)strtotime($pickup_date)) $pickup_date = getNowTime();

    $order = $this->getOrderInfo($ss,$order_id);
    if($order ==null) {
       $result->status ='Error';
       $result->error_message ='Order identifier is not valid';
       return $result;
    } 

    $sender = $this->getSenderInfo($ss,$order->sender_id);
    if($sender ==null) {
      $result->status ='Error';
      $result->error_message ='Sender or merchant identity is not valid';
      return $result;
   } 

    // //begin::create delivery record if not yet exists
    //     $rows = DB::table('delivery AS d')->where('branch_id',$branch_id)->where('order_id',$order_id)->selectRaw('d.id AS delivery_id')->limit(1)->get();
    //     $delivery_id =null;
    //     foreach($rows as $row) $delivery_id = $row->delivery_id;
    //     if ($delivery_id == null) {
    //           $d->delivery_date = isset($d->delivery_date)?$d->delivery_date:null;
    //           if(!(bool)strtotime($d->delivery_date)) $d->delivery_date = getNowTime();

    //           $fleet_tracking_number = null; //$this->getNextFleetNumber($ss);
    //           $def_trip_status_id =1; // 0= Cancel, 1= "Pending", 2= "On the way", 3="Done" 4="Delayed"
    //           DB::table('delivery')->insert(array(
    //             'branch_id'=>$branch_id,
    //             'depart_time'=>$d->delivery_date,
    //             'warehouse_id'=>$d->to_warehouse_id,
    //             'fleet_tracking_number'=>$fleet_tracking_number, //Fleet_tracking_number is used by Delivery Company to track each driver on the trip
    //             'order_id'=>$order_id,
    //             'driver_id'=>null, //No driver yet on Pickup time
    //             'status_id'=>$def_trip_status_id, 
    //             'create_date'=>getNowTime(),
    //             'create_user'=>$ss->login_name,
    //             'update_user'=>$ss->login_name,
    //             'update_date'=>getNowTime()
    //         ));
    //         $delivery_id = DB::getPdo()->lastInsertId();
    //     }  
    // //end::create delivery record if not yet exists

    //Update pickup driver in table "order"
      $pickup_method = ($driver_id<=0 || empty($driver_id))?'None':'Driver';
      // if ($d->pick_on_arrival==1) =>  Delivery Order is processed up to Arrived At Warehouse, but not yet delivered
      $completed =0;
      if ($d->pick_on_arrival==1) $completed =1; 
      DB::table('order')->where('branch_id',$branch_id)->where('id',$order_id)->update(array('driver_id'=>$driver_id,'pickup_method'=>$pickup_method,'status_id'=>4,'completed'=>$completed));
    //end::create dlviery record if not yet exists
    
    //Clear all package list belonging to this order_id before re-creating new package list
    DB::table('package')->where('branch_id',$branch_id)->where('order_id',$order_id)->delete();
    $errors = [];
    $success_count =0; 
    $i = 0;
    $c;
    do {
       if (!isset($d->packages[$i])) break;
          $c = (object)($d->packages[$i]);
          $delivery_type = isset($c->delivery_type)?$c->delivery_type:'Normal'; 
          if(!isset($c->receiver_name)) $c->receiver_name = $c->receiver_phone;

          if (!isset($c->commune_id)) $c->commune_id =0;
          if (!isset($c->district_id)) $c->district_id =0;
          if (!isset($c->city_id)) $c->city_id =0;
          $receiver_name = $c->receiver_name;
          $receiver_phone = $c->receiver_phone;
          $receiver_address = isset($c->receiver_address)? sanitize($c->receiver_address):null;
          //if @zone_code is supplied => use @zone_code to derive commune_id. Otherwise, use @district_id and @commune_id to derive @zone_code
          $zone_code = isset($c->zone_code)?sanitize($c->zone_code):null;
          $zone_name = isset($c->zone_name)?sanitize($c->zone_name):null;
          $df_payer = isset($c->df_payer)?sanitize($c->df_payer):null;

          $city_id = isset($c->city_id)?sanitize($c->city_id):0;
          $district_id = isset($c->district_id)?sanitize($c->district_id):0;
          $commune_id = isset($c->commune_id)?sanitize($c->commune_id):0;
          $package_name= null;
          //if no package name specified then use receiver's phone number as package name
          if(!isset($c->package_name)) $package_name = sanitize($c->receiver_phone);
      
          $c->delivery_condition = isset($c->delivery_condition)? sanitize($c->delivery_condition):0;
          //$c->delivery_fee = isset($c->delivery_fee)?sanitize($c->delivery_fee):0;
          $c->price = isset($c->price)?sanitize($c->price):0;
          $c->cod = isset($c->cod)?sanitize($c->cod):0;
          //$c->cod_fee = isset($c->cod_fee)?sanitize($c->cod_fee):0;
          $c->df_payer = isset($c->df_payer)?sanitize($c->df_payer):null;
          $c->forwarding_cost = isset($c->forwarding_cost)?sanitize($c->forwarding_cost):0;
          $c->dim_x = isset($c->dim_x)?sanitize($c->dim_x):0;
          $c->dim_y = isset($c->dim_y)?sanitize($c->dim_y):0;
          $c->dim_h = isset($c->dim_h)? sanitize($c->dim_h):0;
          $c->delivery_notes = isset($c->delivery_notes)? sanitize($c->delivery_notes):null;
          //$c->weight_kg = isset($c->weight_kg)?$c->weight_kg:0;
          $price = isset($c->price)?sanitize($c->price):0;
          $c->actual_kg = isset($c->actual_kg)?$c->actual_kg:0;  
          $zone =null;
          if(strtolower($c->df_payer) != 'sender' && strtolower($c->df_payer) != 'receiver') {
            $errors[] = "Item for receiver ".$c->receiver_phone." failed because Delivery Fee Payer is not correct";
          }else if(!in_array(strtolower($delivery_type),$delivery_types)) {
             $errors[] = "Item for receiver ".$c->receiver_phone." failed because Delivery Type is not correct. Delivery Type must be Normal or Fast";
          } else {

          if (!empty($c->zone_code)) {
                $zone = $this->getZoneByCode($ss,$c->zone_code);
                if ($zone ==null) {
                   $errors[] = "Item for receiver ".$c->receiver_phone." failed because Delivery Zone Code is not correct!";
                } 
            } else $zone = (object)array('zone_name'=>null,'zone_code'=>null,'district_id'=>null,'commune_id'=>null,'city_id'=>null);
           
          }
         
          if ($zone) {
            $package_status_id =4; //By default on picking up goods = > status_id = 4 //"Picked and booked"
             
            $actual_kg =0;
            $billed_kg = 0;
            $cod_fee =0;

            if ($d->pick_on_arrival ==1 || $d->pick_on_arrival == true) $package_status_id = 5; //(Arrived at warehouse)
           
            $qty = $order->qty;
             //$product_type = $order->product_type;
             $order_code = $order->code;
             $sender_type_id = $order->sender_type_id;
             $bar_code = $this->createQRCode($ss,7);
   
             if ($c->cod ==1) {
               $cod_fee_percent = $this->getCODFeeCharge($ss,$sender->id);
               $cod_fee = $c->price * $cod_fee_percent/100;
             }
             
             //$systematic_billed_kg  = $this->getBilledWeight($c->dim_x,$c->dim_y,$c->dim_h,$c->actual_kg);
             if(!is_numeric($c->billed_kg)) $c->billed_kg =0;
             $billed_kg = $c->billed_kg;
              
             if (!isset($c->product_code)) $c->product_code = null;
             $tax_percent = $this->getTaxByProductCode($c->product_code);
             $tax_amount = $c->price * $tax_percent/100;
        
      //begin::calculation of package pricing to sender and driver
            $cod = isset($c->cod)?$c->cod:0;
            $forwarding_cost = isset($c->forwarding_cost)?$c->forwarding_cost:0;
            $cod_amount =0;
            $delivery_fee = 0;
            $cod_fee = 0;
            $cod_fee_percent =0;
            $other_fees =0;
            $base_fee =0;
            $pInfo = $this->getDeliveryPriceInfo($branch_id,$sender_id,$delivery_type,$zone_code,$billed_kg);
            if ($pInfo) {
                $delivery_fee = $pInfo->delivery_fee;
                $base_fee =$pInfo->base_fee;
                $cod_fee_percent = $pInfo->cod_fee_percent;
            }
 
            if ($cod ==1 || strtolower($cod) =='yes') {
              $cod_amount = is_numeric($c->price)?$c->price:0;
              $cod_fee = ($price + $base_fee + $delivery_fee) * $cod_fee_percent/100; 
            }
            $driver_total = $cod_amount;
            $sender_total = $cod_fee + $forwarding_cost; //Seller always has to pay forwarding cost or Taxi fee  
            if (strtolower($df_payer) == 'sender') 
                $sender_total += $base_fee + $delivery_fee;
            else 
              $driver_total += $base_fee + $delivery_fee;

    //end::calculation of package pricing to sender and driver

      //begin::Process package size
        if (isset($c->size))
        {
              $m =(object)$c->size;
              if(isset($m->length)){
                $c->dim_x = $m->length;
                $c->dim_y = $m->width;
                $c->dim_h = $m->height;
              }
             
        }
      //end::process package size
                 DB::table('package')->insert(array(
                   'branch_id'=>$branch_id,
                   'order_id'=>$order_id,
                   'delivery_id'=>null,
                   'warehouse_id'=>$c->to_warehouse_id,
                   'arrival_time'=>getNowTime(), /** package's status here is "Picked and Booked" but we just set arrival_time to now(). This date can be left to NULL also fine **/
                   'pickup_time'=>convertDate($pickup_date),
                   'pickup_driver_id'=>$driver_id, //Driver who came to pick up the package => used for commission, if any
                   'tracking_number'=>$order_code, //order_code becomes tracking number, For seller or sender to track all their packages 
                   'sender_id'=>$sender->id,
                   'sender_name'=>$sender->name, 
                   'sender_email'=>$sender->email,
                   'sender_phone'=>$sender->phone_number,
                   'sender_type'=>$sender->sender_type,
                   'delivery_condition'=>$c->delivery_condition,
                   'delivery_type'=>$c->delivery_type,
                   'qr_code'=>$bar_code,
                   'package_name'=>$package_name,
                   'receiver_name'=>$c->receiver_name,
                   'receiver_address'=>empty($receiver_address)? $zone->zone_name:$receiver_address,
                   'receiver_phone'=>$c->receiver_phone,
                   'zone_code'=>$zone->zone_code,
                   'zone_name'=>$zone->zone_name,
                   //'map_location'=>$d->map_location,
                   'base_fee'=>$c->base_fee, //$base_fee,
                   'delivery_fee'=>$c->delivery_fee,
                   'delivery_notes'=>$c->delivery_notes,
                   //'applied_fixed_price'=>$applied_fixed_Price,
                   'df_payer'=>$c->df_payer,
                   'dim_x'=>$c->dim_x,
                   'dim_y'=>$c->dim_y,
                   'dim_h'=>$c->dim_h,
                   'actual_kg'=>$c->actual_kg,
                   'billed_kg'=>$c->billed_kg,
                   'price'=>$c->price,
                   'cod'=>$cod,
                   'cod_fee'=>$cod_fee,
                   'driver_total'=>$driver_total,
                   'sender_total'=>$sender_total,
                   'exchange_rate'=>$sender->exchange_rate,
                   'forwarding_cost'=>$c->forwarding_cost,
                   'tax_percent'=>$tax_percent,
                   'tax_amount'=>$tax_amount,
                   'status_id'=>$package_status_id, //4 = "Picked and Booked"
                   'create_user'=>$ss->login_name,
                   'create_date'=>getNowTime()
                )); 
                //$new_package_id = DB::getPdo()->lastInsertId();
                $success_count++;
            
          } 
          // else //$zone ==null
          // {
            
          // }
 

      $i++;
    }while($c);
    
    //update number of package in table "order.qty"
    DB::update(DB::raw("UPDATE `order` SET qty = (SELECT COUNT(p.id) FROM package AS p WHERE p.branch_id = `order`.branch_id AND p.order_id =`order`.`id`) WHERE id ='".$order_id."' AND branch_id ='".$branch_id."'"));

    $result->status ='OK';
    $result->errors = $errors;
    $result->error_count = count($errors);
    $result->success_count = $success_count;
    $result->delivery_id = null;

    $status_id =3; //Picked
    if ($d->pick_on_arrival ==1) {
      $status_id =5;//Arrived At Warehouse
      $result->completed =1;  
    }
    $result->status_id = $status_id;
    $result->status = $this->getPackageStatus($status_id);
    return $result;
 }
 
 function getPackageStatus($id){
    $rows = DB::table('package_statuses AS ss')->where('id',$id)->limit(1)->selectRaw('ss.id,ss.name')->get();
    foreach($rows as $row) return $row->name;
    return '(Unknown Status)';
 }

 //$d = {driver_id,delivery_date,[sender_id],[zone_code]}
 function getPackagesByDriver($d){
    $ss = getSessionInfo($d);
    if(!$ss) return '#350'; //user not authenticated
    if (!prn_allowed(2)) return '@'; //need permission to do this task
    $branch_id = $ss->branch_id;
    $driver_id = sanitize(isset($d->driver_id)?$d->driver_id:null);
    $delivery_date = isset($d->delivery_date)?$d->delivery_date:null;
    $sender_id = sanitize(isset($d->sender_id)?$d->sender_id:null);
    $zone_name = sanitize(isset($d->zone_name)?$d->zone_name:null);
    $zone_code = sanitize(isset($d->zone_name)?$d->zone_code:null);
    $receiver_phone = sanitize(isset($d->receiver_phone)?$d->receiver_phone:null);
 
    $delivery_date = convertDate($delivery_date);    
    if (!(bool)strtotime($delivery_date)) $delivery_date = date('Y-m-d');
    
    $str_date = " AND DATE(d.depart_time) ='".$delivery_date."' ";
    $str_sender = null;
    $str_receiver_phone =null;
    $str_zone = null;
    if ($sender_id > 0) $str_sender =" AND p.sender_id ='".$sender_id."' ";
    if (!empty($receiver_phone)) $str_receiver_phone =" AND p.receiver_phone ='".$receiver_phone."' ";
    if (!empty($zone_name)) $str_zone ="AND p.zone_name ='".$zone_name."' ";

    $more_where ="1=1 AND p.status_id IN (6,9)"; //= "1=1 ".$str_date.$str_sender.$str_receiver_phone.$str_zone;
    $select_cols ="p.delivery_id,DATE_FORMAT(d.depart_time,'%d %b %Y %r') AS depart_time, p.driver_id, s.name AS sender_name, s.address AS sender_address, s.phone_number AS sender_phone, p.receiver_address, p.receiver_phone, p.zone_code, p.zone_name, p.cod, p.price, p.df_payer, p.delivery_fee,p.delivery_type, p.forwarding_cost, p.cod_fee, (IFNULL(p.delivery_fee,0) + IFNULL(p.cod_fee,0) + (CASE p.cod WHEN 1 THEN p.price ELSE 0 END) ) AS total, 'Phnom Penh' AS origin, 'Moto' AS vehicle_type";
    $rows = DB::table('package AS p')->join('sender AS s','s.id','=','p.sender_id')->join('package_statuses AS ps','ps.id','=','p.status_id')->join('delivery AS d','d.id','=','p.delivery_id')->where('p.branch_id',$branch_id)->where('p.driver_id',$driver_id)->whereRaw($more_where)->selectRaw($select_cols)->get();
    return $rows;
  }
 
  function getSenderPromotionInfo($d){
    $ss = getSessionInfo($d);
    if(!$ss) return '#350'; //user not authenticated
    if (!prn_allowed(2)) return '@'; //need permission to do this task
    $branch_id = $ss->branch_id;
    $sender_id = isset($ss->sender_id)? sanitize($ss->sender_id):0;

    $result = (object)(['promo_code'=>null,'data']);
    $fixed_price = 0;
    $cod_fee_percent = 0.05;
    $rows = DB::table('sender_fixed_price AS p')->where('p.sender_id',$sender_id)->where('branch_id',$branch_id)->selectRaw('p.price')->limit(1)->get();
    foreach($rows as $row) $fixed_price = $row->price;
    $rows = DB::table('sender_cod_charges AS c')->where('c.sender_id',$sender_id)->where('branch_id',$branch_id)->selectRaw('c.cod_fee_percent')->limit(1)->get();
    foreach($rows as $row) $cod_fee_charge = $row->cod_fee_percent;
    
    $result->fixed_price = $fixed_price;
    $result->cod_fee_percent = $cod_fee_percent;
    $result->price_per_kg = get_settings_value($ss,'PRICE_PER_KG','number');
    if ($result->fixed_price > 0) $result->promo_code ='FIXED_PRICE'; //Fixed price for all Destinations 
    
    return $result;
  }

  function createOrder_default($uss,$d) {
      $branch_id = $uss->branch_id;
      $d->branch_id = $branch_id;
      $result = (object)array('order'=>null,'error_message'=>null);

      if (!isset($d->pickup_time)) $d->pickup_time = getNowTime();
      if (!isset($d->qty)) $d->qty =1;
      if(!isset($d->product_type)) $d->product_type ='Generic';
      if (!isset($d->pickup_method)) $d->pickup_method ='None';
      if (!isset($d->request_date)) $d->request_date = null;
      if (isset($d->delivery_condition)) $d->delivery_condition ='Normal';
      if (!isset($d->delivery_type)) $d->delivery_type ='Normal';
      if(!isset($d->pickup_notes)) $d->pickup_notes = 'No pickup';
      if(!isset($d->order_cancled)) $d->order_canceled =0;
      if (!isset($d->request_vehicle_type)) $d->request_vehicle_type ='Moto';
      if (!isset($d->sender_type_id)) $d->sender_type_id =null;
      //if (!isset($d->sender_type)) $d->sender_type = null;
      $d->request_date = convertDate($d->request_date);
      if (!(bool)strtotime($d->request_date)) $d->request_date = getNowTime();
      $rows = DB::table('sender_type AS t')->join('sender AS s','s.sender_type_id','=','t.id')->where('t.branch_id',$branch_id)->where('s.id',$d->sender_id)->limit(1)->selectRaw('t.name AS sender_type, t.id AS sender_type_id')->get();
      foreach($rows as $row) {
        //$d->sender_type = $row->sender_type;
        $d->sender_type_id = $row->sender_type_id;
      }
      if (empty($d->sender_type_id)) {
          $result->error_message ="Failed to create default order request because the Sender Type was invalid. Make sure the sender has valid identity and the sender has valid sender type";
          return $result;
      } 
      DB::table('order')->insert((array)$d);
      $new_order_id = DB::getPdo()->lastInsertId();
      $d->id = $new_order_id; // This is  "order_id"
      if ($new_order_id > 0)  
         {
           $d->code = $this->getTrackingNumber($uss,$new_order_id);
           DB::table('order')->where('branch_id',$branch_id)->where('id',$new_order_id)->update(array('code'=>$d->code));
           $result->order = $d;
         }

      else $result->error_message ="Failed to create default order request due to some unexpected problem";   
      return $result;
  }

  //When pickup Status = "Picked" or "Picked and Booked" => Admin User can receive packages, meaning that the packages has Arrived at Warehouse
  function receivePackages($d){
    $ss = getSessionInfo($d);
    if(!$ss) return '#350'; //user not authenticated
    if (!prn_allowed(2)) return '@'; //need permission to do this task
    $branch_id = $ss->branch_id;
  
    $delivery_types = ['normal','fast'];
    $result = (object)array();

    //if @allow_create_order ==1 => order or pickup request is automatically created, if @order_id = 0 or empty.
    $allow_create_order = isset($d->allow_create_order)?$d->allow_create_order:0;
    
    $warehouse_id = isset($d->warehouse_id)?sanitize($d->warehouse_id):null;
    $order_id = isset($d->order_id)? $d->order_id:0;
    $sender_id = isset($d->sender_id)? $d->sender_id:0;
    $d->pick_on_arrival = isset($d->pick_on_arrival)?$d->pick_on_arrival:0;
    $pickup_date = isset($d->pickup_date)?$d->pickup_date:null;
    
    $d->delivery_date = isset($d->delivery_date)?$d->delivery_date:null;
    $driver_id = $d->driver_id; //This is a driver who picked up the goods. If @driver_id =0 => The goods are brought in Office by the Sellers themselves
   
    if(!(bool)strtotime($d->delivery_date)) $d->delivery_date = getNowTime();
    if(!(bool)strtotime($pickup_date)) $pickup_date = getNowTime();
   
    $sender = $this->getSenderInfo($ss,$sender_id);
    if($sender ==null) {
      $result->status ='Error';
      $result->error_message ='Sender or merchant identity is not valid';
      return $result;
    } 
  
    //if no warehouse_id provided, get it from driver_id
    if (empty($warehouse_id) || $warehouse_id <=0) {
      $warehouse_id = $this->getWarehouseIdByDriver_default($branch_id,$driver_id);
    }

    if (empty($warehouse_id) || $warehouse_id <=0) {
      $result->status ='Error';
      $result->error_message ='Warehouse identity is not valid';
      return $result;
    }

    //NOTE: $allow_create_order = 1 in context of receiving packages that are brought in by Seller directly, no driver pickup and No pickup request order
    $order = null;
    if ($allow_create_order !=1) 
    {
        $order = $this->getOrderInfo($ss,$order_id);
        if($order ==null) {
          $result->status ='Error';
          $result->error_message ='Order identifier is not valid';
          return $result;
        } 
      } else {
          if($order_id > 0) $order = $this->getOrderInfo($ss,$order_id);
          if ($order_id <=0 || $order == null) {
            $m = (object)array('sender_id'=>$sender->id,'pickup_time'=>$pickup_date,'request_date'=>$d->delivery_date);
            $mResult = $this->createOrder_default($ss,$m);

            //Error in creating default order request 
            if (!empty($mResult->error_message)) {
                $result->status ='Error';
                $result->error_message =$mResult->error_message;
                return $result;
            } else $order = $mResult->order;
          }

      }
     
     if ($order ==null) {
        if ($allow_create_order ==1)
            $result->error_message ="Failed to create default order or default pickup request";
        else $result->error_message ="Order request or pickup request does not exist";

        $result->status ='Error';
        return $result;     
    }

    if (!isset($d->packages[0])) {
      $result->error_message ="មិនឃើញមានកញ្ចប់ទំនិញដែលត្រូវទទួល";
      $result->status ='Error';
      return $result;   
    }
    
    if ($order_id <=0) $order_id = $order->id; 

    // //Update pickup driver in table "order"
    //   $pickup_method = ($driver_id<=0 || empty($driver_id))?'None':'Driver';
    //   DB::table('order')->where('branch_id',$branch_id)->where('id',$order_id)->update(array('driver_id'=>$driver_id,'pickup_method'=>$pickup_method,'status_id'=>4));
    // //end::create dlviery record if not yet exists
    
    $delivery_type =null;
    $last_new_barcode =null; // this barcode is passed back to client caller, and it is used to refresh display on Client browser in case that only one package is verified or received by clicking on the small "Print Barcode" button, Not by clickin on OK button
    $errors = [];
    $success_count =0; 
    $i = 0;
    $c;
    do {
       if (!isset($d->packages[$i])) break;
          $c = (object)($d->packages[$i]);
          $delivery_type = isset($c->delivery_type)?$c->delivery_type:null; 
          if(!isset($c->receiver_name)) $c->receiver_name = $c->receiver_phone;
  
          if (!isset($c->commune_id)) $c->commune_id =0;
          if (!isset($c->district_id)) $c->district_id =0;
          if (!isset($c->city_id)) $c->city_id =0;
          $receiver_name = $c->receiver_name;
          $receiver_phone = $c->receiver_phone;
          $receiver_address = isset($c->receiver_address)? sanitize($c->receiver_address):null;
          //if @zone_code is supplied => use @zone_code to derive commune_id. Otherwise, use @district_id and @commune_id to derive @zone_code
          $delivery_type = isset($c->delivery_type)?sanitize($c->delivery_type):null;
          $zone_code = isset($c->zone_code)?sanitize($c->zone_code):null;
          $zone_name = isset($c->zone_name)?sanitize($c->zone_name):null;
          $city_id = isset($c->city_id)?sanitize($c->city_id):0;
          $district_id = isset($c->district_id)?sanitize($c->district_id):0;
          $commune_id = isset($c->commune_id)?sanitize($c->commune_id):0;
          $package_name= null;
          //if no package name specified then use receiver's phone number as package name
          if(!isset($c->package_name)) $package_name = sanitize($c->receiver_phone);
      
          $c->delivery_condition = isset($c->delivery_condition)? sanitize($c->delivery_condition):0;
          //$c->delivery_fee = isset($c->delivery_fee)?sanitize($c->delivery_fee):0;
          $c->price = isset($c->price)?sanitize($c->price):0;
          $c->cod = isset($c->cod)?sanitize($c->cod):0;
          //$c->cod_fee = isset($c->cod_fee)?sanitize($c->cod_fee):0;
          $c->dim_h = isset($c->dim_h)? sanitize($c->dim_h):0;
          $c->df_payer = isset($c->df_payer)?sanitize($c->df_payer):null;
          $c->forwarding_cost = isset($c->forwarding_cost)?sanitize($c->forwarding_cost):0;
          $c->dim_x = isset($c->dim_x)?sanitize($c->dim_x):0;
          $c->dim_y = isset($c->dim_y)?sanitize($c->dim_y):0;

          $c->delivery_notes = isset($c->delivery_notes)? sanitize($c->delivery_notes):null;
            
          $zone =null;
          if(strtolower($c->df_payer) != 'sender' && strtolower($c->df_payer) != 'receiver') {
            $errors[] = "Delivery Fee Payer or DFP is not correct";
          }else if(!in_array(strtolower($delivery_type),$delivery_types)) {
             $errors[] = "Delivery Type is not correct. Delivery Type must be Normal or Fast";
          } else {

          $zone = $this->getZoneByCode($ss,$c->zone_code);
            if (empty($zone)) {
                   $errors[] = "Delivery Zone Code is not correct!";
                 
            } //else $zone = (object)array('zone_name'=>'Unknown','zone_code'=>null,'district_id'=>null,'commune_id'=>null,'city_id'=>null);
          }
         
          //assuming one one package is received at one time
          if (empty($c->receiver_phone)) {
            $errors[] ="Receiver phone cannot be empty";  
          }
          if ($zone && !empty($c->receiver_phone)) {
            $package_status_id =5; //By default when Receiving Packages => status_id = 5 //"Arrived At Warehouse"
            $actual_kg = isset($c->actual_kg)?$c->actual_kg:0;
           
              //begin::calculation of package pricing to sender and driver
                  $cod_amount =0;
                  $delivery_fee = 0;
                  $cod_fee = 0;
                  $cod_fee_percent =0;
                  $other_fees =0;
                  $base_fee =0;
                  $price = isset($c->price)?$c->price:0;
                  $billed_kg = isset($c->billed_kg)?$c->billed_kg:0;
                  $cod = isset($c->cod)?$c->cod:0;
  
                if (!isset($c->product_code)) $c->product_code = null;

                $tax_percent = $this->getTaxByProductCode($c->product_code);
                $tax_amount = $c->price * $tax_percent/100;

                  $pInfo = $this->getDeliveryPriceInfo($branch_id,$sender_id,$delivery_type,$c->zone_code,$billed_kg);
                  if ($pInfo) {
                      $delivery_fee = $pInfo->delivery_fee;
                      $base_fee =$pInfo->base_fee;
                      $cod_fee_percent = $pInfo->cod_fee_percent;
                  }

                    // $data->error_message = "testing value: cod_percent = ".$pInfo->cod_fee_percent. "  cod_fee = ".$cod_fee."  base_fee =".$base_fee." delivery_fee = ".$delivery_fee;
                    // $data->status ='Error';
                    // return $data;
                 
                  if ($cod ==1 || strtolower($cod) =='yes') {
                    $cod_amount = $price;
                    $cod_fee = ($price + $base_fee + $delivery_fee) * $cod_fee_percent/100; 
                  }
                  $driver_total = $cod_amount;
                  $sender_total = $cod_fee + $c->forwarding_cost; //Seller always has to pay forwarding cost or Taxi fee  
                  if (strtolower($c->df_payer) == 'sender') 
                      $sender_total += $base_fee + $delivery_fee;
                  else 
                    $driver_total += $base_fee + $delivery_fee;
               //end::calculation of package pricing to sender and driver

             //$qty = isset($order->qty)?$order->qty:1;
             //$product_type = $order->product_type;
             $order_code = $order->code;
             $sender_type_id = $order->sender_type_id;
              
                 if (isset($c->size))
                 {
                   if(!empty($c->size)) {
                      $m = (object)$c->size;
                      if(isset($m->length)) {
                        $c->dim_x = isset($m->length)?$m->length:0;
                        $c->dim_y = isset($m->width)?$m->width:0;
                        $c->dim_h = isset($m->height)?$m->height:0;
                      }  
                   }
  
                 }    

                 //Add new package, if the package's barcode is empty 
                 $c->barcode = isset($c->barcode)?$c->barcode:null;
                 if (empty($c->barcode)) {
                     $c->barcode = $this->createQRCode($ss,7);
                     $last_new_barcode = $c->barcode;
                      DB::table('package')->insert(array(
                        'branch_id'=>$branch_id,
                        'warehouse_id'=>$warehouse_id,
                        'qr_code'=>$c->barcode,
                        'order_id'=>$order_id,
                        'delivery_id'=>null,
                        'driver_id'=>$driver_id,
                        'arrival_time'=>getNowTime(),
                        'pickup_time'=>convertDate($pickup_date),
                        'pickup_driver_id'=>$driver_id, //Driver who came to pick up the package => used for commission, if any
                        'tracking_number'=>$order_code, //order_code becomes tracking number, For seller or sender to track all their packages 
                        'sender_id'=>$sender->id,
                        'exchange_rate'=>$sender->exchange_rate,
                        'sender_name'=>$sender->name, 
                        'sender_email'=>$sender->email,
                        'sender_phone'=>$sender->phone_number,
                        'sender_type'=>$sender->sender_type,
                        'delivery_condition'=>$c->delivery_condition,
                        'delivery_type'=>$delivery_type,
                        'package_name'=>$package_name,
                        'receiver_name'=>$c->receiver_name,
                        'receiver_address'=>empty($receiver_address)? $zone->zone_name:$receiver_address,
                        'receiver_phone'=>$c->receiver_phone,
                        'zone_code'=>$c->zone_code,
                        'zone_name'=>$zone->zone_name,
                        //'map_location'=>$d->map_location,
                        'base_fee'=>$base_fee,
                        'delivery_fee'=>$delivery_fee,
                        'delivery_notes'=>$c->delivery_notes,
                        //'applied_fixed_price'=>$applied_fixed_Price,
                        'df_payer'=>$c->df_payer,
                        'dim_x'=>$c->dim_x,
                        'dim_y'=>$c->dim_y,
                        'dim_h'=>$c->dim_h,
                        'actual_kg'=>$actual_kg,
                        'billed_kg'=>$billed_kg,
                        'price'=>$c->price,
                        'cod'=>$c->cod,
                        'cod_fee'=>$cod_fee,
                        'driver_total'=>$driver_total,
                        'sender_total'=>$sender_total,
                        'forwarding_cost'=>$c->forwarding_cost,
                        'tax_percent'=>$tax_percent,
                        'tax_amount'=>$tax_amount,
                        'status_id'=>$package_status_id, //4 = "Picked and Booked"
                        'create_user'=>$ss->login_name,
                        'create_date'=>getNowTime()
                    ));
                 } else {
                        DB::table('package')->where('branch_id',$branch_id)->where('qr_code',$c->barcode)->update(array(
                          //'delivery_id'=>$delivery_id,
                          //'tracking_number'=>$order_code, //order_code becomes tracking number, For seller or sender to track all their packages 
                          //'sender_id'=>$sender->id, 
                          //'sender_name'=>$sender->name,
                          //'sender_email'=>$sender->email,
                          //'sender_phone'=>$sender->phone_number,
                          //'sender_type'=>$sender->sender_type,
                          //'delivery_condition'=>$c->delivery_condition,
                          //'warehouse_id'=>$warehouse_id, //no need to update, only insert is enough
                          'exchange_rate'=>$sender->exchange_rate,
                          'delivery_type'=>$delivery_type,
                          //'qr_code'=>$bar_code,
                          'package_name'=>$package_name,
                          'receiver_name'=>$c->receiver_name,
                          'receiver_address'=>empty($receiver_address)? $zone->zone_name:$receiver_address,
                          'receiver_phone'=>$c->receiver_phone,
                          'zone_code'=>$c->zone_code,
                          'zone_name'=>$zone->zone_name,
                          //'map_location'=>$d->map_location,
                          'base_fee'=>$base_fee, //$base_fee,
                          'delivery_fee'=>$delivery_fee,
                          'delivery_notes'=>$c->delivery_notes,
                          //'applied_fixed_price'=>$applied_fixed_Price,
                          'df_payer'=>$c->df_payer,
                          'dim_x'=>$c->dim_x,
                          'dim_y'=>$c->dim_y,
                          'dim_h'=>$c->dim_h,
                          'actual_kg'=>$actual_kg,
                          'billed_kg'=>$billed_kg,
                          'price'=>$c->price,
                          'cod'=>$c->cod,
                          'cod_fee'=>$c->cod_fee, //$cod_fee,
                          'forwarding_cost'=>$c->forwarding_cost,
                          'tax_percent'=>$tax_percent,
                          'tax_amount'=>$tax_amount,
                          'driver_total'=>$driver_total,
                          'sender_total'=>$sender_total,
                          'status_id'=>$package_status_id, //4 = "Picked and Booked"
                          'create_user'=>$ss->login_name,
                          'create_date'=>getNowTime(),
                          'arrival_time'=>getNowTime()
                      ));
                 }   
                 
                //$new_package_id = DB::getPdo()->lastInsertId();
                $success_count++;
            
          } 
          // else //$zone ==null
          // {
            
          // }
      $i++;
    }while($c);
    
    //update number of package in table "order.qty"
    DB::update(DB::raw("UPDATE `order` SET completed =1, status_id =5, qty = (SELECT COUNT(p.id) FROM package AS p WHERE p.branch_id = `order`.branch_id AND p.order_id =`order`.`id`) WHERE id ='".$order_id."' AND branch_id ='".$branch_id."'"));
 
    if ($success_count <=0) {
      $result->status ='Error';
      $result->error_message = isset($errors[0])?$errors[0]:'Some problem occured during receiving package';
      return $result;
    }

    $result->status ='OK';
    $result->order_id = $order_id;
    $result->errors = $errors;
    $result->error_count = count($errors);
    $result->success_count = $success_count;
    $result->delivery_id = null;
    $result->last_new_barcode = $last_new_barcode;  
    $status_id =3; //Picked
    if ($d->pick_on_arrival ==1) $status_id =4;//Picked and Booked
    $result->status_id = $status_id;
    $result->status = $this->getPackageStatus($status_id);
    return $result;
  }

  //returns list of items delivered by driver.  Billing transaction or invoices to both driver and sender
  //@d = {'sender_id', or 'driver_id','date' } // @sender_id or @driver_id
  function getDeliveryItemsByDriver($d){
    $ss = getSessionInfo($d);
    if(!$ss) return '#350'; //user not authenticated
    if (!prn_allowed(2)) return '@'; //need permission to do this task
    $branch_id = sanitize($ss->branch_id);
    $driver_id = isset($d->driver_id)?sanitize($d->driver_id):null;
    $sender_id = isset($d->sender_id)?sanitize($d->sender_id):null;
    $start_date = isset($d->start_date)?$d->start_date:null;
    $end_date = isset($d->end_date)?$d->end_date:null;
    $status_id = isset($d->status_id)?$d->status_id:null;
    $driver_pmt_status_id = isset($d->driver_pmt_status_id)?$d->driver_pmt_status_id:null;
    $delivery_type = isset($d->delivery_type)?$d->delivery_type:null;
    //if (!(bool)strtotime($start_date)) $start_date = date('Y-m-d');
    //if (!(bool)strtotime($end_date)) $end_date = date('Y-m-d');

    $str_agent = null;
    $str_dates = null;
    $str_status =null; //package status id
    $str_pmt_status =null;
    $str_delivery_type =null;
    if (empty($status_id)) $str_status =" p.status_id=8"; // or (8,9,11) Delivered,Failed,Returned
    else if ($status_id ==-1) $str_status="1=1"; //Show for all pacakge statuses
    else $str_status =" p.status_id ='".$status_id."' ";
    if (empty($driver_pmt_status_id)) $str_pmt_status =" AND IFNULL(p.driver_pmt_status_id,0) = 0";
    else if ($driver_pmt_status_id ==-1) $str_pmt_status=""; //Show both Paid and Unpaid
    else $str_pmt_status = " AND IFNULL(p.driver_pmt_status_id,0) ='".$driver_pmt_status_id."' ";
    
    if (!empty($delivery_type)) $str_delivery_type =" AND p.delivery_type ='". $delivery_type."' ";
    $more_wheres =  $str_status.$str_pmt_status.$str_delivery_type;
    //NOTE: VERY IMPORTANT fields for driver's net total calcualtion are "cod_amount","fees","driver_adjust_amount"
    $selectCols ="p.id AS package_id, p.qr_code AS barcode,p.sender_name, p.sender_phone, p.receiver_name, p.receiver_phone, p.receiver_address, p.zone_code, p.zone_name,  
    CASE p.status_id WHEN 8 THEN DATE_FORMAT(p.arrival_time,'%d %b %Y') ELSE DATE_FORMAT(p.create_date,'%d %b %Y') END AS delivery_date,
    CASE p.cod WHEN 1 THEN (ifnull(p.price,0) - ifnull(p.cod_fee,0)) ELSE 0 END AS cod_amount,
    ifnull(p.cod_fee,0) AS cod_fee, 
    IFNULL(p.base_fee,0) AS base_fee,
    IFNULL(p.delivery_fee,0) AS delivery_fee,
    p.df_payer,
    (IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0)) AS fees,
    IFNULL(p.driver_adjust_amount,0) AS driver_adjust_amount, 
    IFNULL(p.forwarding_cost,0) AS forwarding_cost,
    0 AS paid_to_sender,
    0 AS paid_by_driver,
    IFNULL(p.driver_total,0) AS driver_total, 
    IFNULL(p.sender_total,0) AS sender_total,
    IFNULL(p.driver_pmt_status_id,0) AS driver_pmt_status_id,
    p.driver_pmt_notes,
    '$' AS cur,
    IFNULL(p.sender_net_amount,0) AS sender_net_amount,
    p.status_id,ps.name AS status";

    //if ((bool)strtotime($start_date)) 
    if((bool)strtotime($start_date)) $str_dates =" AND DATE(p.arrival_time) >='".convertDate($start_date)."' ";
    if((bool)strtotime($end_date)) $str_dates .=" AND DATE(p.arrival_time) <='".convertDate($end_date)."' ";
    
    if($sender_id > 0) 
      $str_agent =" AND p.sender_id ='".$sender_id."' ";
    else if ($driver_id > 0) 
      $str_agent = " AND p.driver_id ='".$driver_id."' ";
    else return [];  
    $more_wheres .= $str_agent.$str_dates;
    $rows = DB::table('package AS p')->join('package_statuses AS ps','ps.id','=','p.status_id')->where('p.branch_id',$branch_id)->whereRaw($more_wheres)->selectRaw($selectCols)->get();
    return $rows;
  }
  
  function getDeliveryItemsBySender($d){
    $ss = getSessionInfo($d);
    if(!$ss) return '#350'; //user not authenticated
    if (!prn_allowed(2)) return '@'; //need permission to do this task
    $branch_id = sanitize($ss->branch_id);
    $sender_id = isset($d->sender_id)?sanitize($d->sender_id):null;
    //$driver_id = isset($d->driver_id)?sanitize($d->driver_id):null;
    $use_default_dates = isset($d->use_default_dates)?$d->use_default_dates:0;
    $start_date = isset($d->start_date)?$d->start_date:null;
    $end_date = isset($d->end_date)?$d->end_date:null;
    $status_id = isset($d->status_id)?$d->status_id:null;

    $sender_pmt_status_id = isset($d->settled)?$d->settled:null; // 0 , 1
    if (empty($sender_pmt_status_id)) $sender_pmt_status_id = isset($d->sender_pmt_status_id)?$d->sender_pmt_status_id:null;
    $delivery_type = isset($d->delivery_type)?$d->delivery_type:null;
    
    $str_dates = null;
    //$use_default_dates = 1 = > when dates are not supplied then use today dates to query package list
    if ($use_default_dates ==1){
      if (!(bool)strtotime($start_date)) $start_date = date('Y-m-d');
      if (!(bool)strtotime($end_date)) $end_date = date('Y-m-d');
      $str_dates = " AND DATE(p.arrival_time) >= '".$start_date."' AND DATE(p.arrival_time) <= '".$end_date."' ";
    } else {
      if ((bool)strtotime($start_date) && (bool)strtotime($end_date)) $str_dates = " AND DATE(p.arrival_time) >= '".convertDate($start_date)."' AND DATE(p.arrival_time) <= '".convertDate($end_date)."' ";
    } 
 
    $str_agent = null;
    $str_status =null; //package status id
    $str_pmt_status =null;
    $str_delivery_type =null;
    if (empty($status_id)) $str_status =" p.status_id IN (7,8,9,10,11)"; // or (8,9,11) Delivered,Failed,Returned
    else if ($status_id ==-1) $str_status= "1=1"; //Show for all pacakge statuses
    else $str_status =" p.status_id ='".$status_id."' ";
    if (empty($sender_pmt_status_id)) $str_pmt_status =" AND IFNULL(p.sender_pmt_status_id,0) = 0";
    else if ($sender_pmt_status_id ==-1) $str_pmt_status=""; //Show both Paid and Unpaid
    else $str_pmt_status = " AND IFNULL(p.sender_pmt_status_id,0) ='".$sender_pmt_status_id."' ";
    
    if (!empty($delivery_type)) $str_delivery_type =" AND p.delivery_type ='". $delivery_type."' ";
    $more_wheres_pickup =  $str_status.$str_delivery_type;
    $more_wheres_pickup .=$str_dates;
    //NOTE $more_wheres_pickup does not include WHERE p.sender_pmt_status_id = 1
    $more_wheres =  $more_wheres_pickup.$str_pmt_status;
    //NOTE: VERY IMPORTANT fields for driver's net total calcualtion are "cod_amount","fees","driver_adjust_amount"
    //sender_confirmed =1 => vendor has confirmed that the package'detailed prices and fees are correct
    // $selectCols_order ="SELECT p.id AS package_id, 0 AS sender_confirmed, NULL AS barcode,p.sender_name, p.sender_phone, p.receiver_name, p.receiver_phone, p.receiver_address,p.df_payer,p.zone_code, p.zone_name,IFNULL(p.price,0) AS price,  
    // CASE p.status_id WHEN 8 THEN DATE_FORMAT(p.create_date,'%d %b %Y') ELSE DATE_FORMAT(p.create_date,'%d %b %Y') END AS delivery_date,
    // CASE p.cod WHEN 1 THEN (ifnull(p.price,0) - ifnull(p.cod_fee,0)) ELSE 0 END AS cod_amount,
    // ifnull(p.cod_fee,0) AS cod_fee, 
    // IFNULL(p.base_fee,0) AS base_fee,
    // IFNULL(p.delivery_fee,0) AS delivery_fee,
    // (IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0)) AS fees,
    // 0 AS sender_adjust_amount, 
    // 0 AS forwarding_cost,
    // 0 AS paid_to_sender,
    // 0 AS paid_by_driver,
    // 0 AS driver_total, 
    // 0 AS sender_total,
    // 0 AS sender_pmt_status_id,
    //  NULL AS sender_pmt_notes,
    // '$' AS cur,
    // 0 AS sender_net_amount,
    // p.status_id,ps.name AS `status` FROM order_receivers AS p INNER JOIN `order` AS `o` ON o.id = p.order_id INNER JOIN package_statuses as ps ON ps.id = p.status_id WHERE p.branch_id ='".$branch_id."' AND IFNULL(o.completed,0) =0 AND p.sender_id ='".$sender_id."' ".$more_wheres_pickup;
   
    $selectCols ="p.id AS package_id, IFNULL(p.sender_confirmed,0) AS sender_confirmed, p.qr_code AS barcode,p.sender_name, p.sender_phone, p.receiver_name, p.receiver_phone, p.receiver_address,p.df_payer,p.zone_code, p.zone_name,IFNULL(p.price,0) AS price,  
    CASE p.status_id WHEN 8 THEN DATE_FORMAT(p.arrival_time,'%d %b %Y') ELSE DATE_FORMAT(p.create_date,'%d %b %Y') END AS delivery_date,
    CASE p.cod WHEN 1 THEN (ifnull(p.price,0) - ifnull(p.cod_fee,0)) ELSE 0 END AS cod_amount,
    ifnull(p.cod_fee,0) AS cod_fee, 
    IFNULL(p.base_fee,0) AS base_fee,
    IFNULL(p.delivery_fee,0) AS delivery_fee,
    (IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0)) AS fees,
    IFNULL(p.sender_adjust_amount,0) AS sender_adjust_amount, 
    IFNULL(p.forwarding_cost,0) AS forwarding_cost,
    0 AS paid_to_sender,
    0 AS paid_by_driver,
    IFNULL(p.driver_total,0) AS driver_total, 
    IFNULL(p.sender_total,0) AS sender_total,
    IFNULL(p.sender_pmt_status_id,0) AS sender_pmt_status_id,
    p.sender_pmt_notes,
    '$' AS cur,
    IFNULL(p.sender_net_amount,0) AS sender_net_amount,
    p.status_id,ps.name AS `status`";
    //if ((bool)strtotime($start_date)) 
    //if((bool)strtotime($start_date)) $str_dates =" AND DATE(p.create_date) >='".convertDate($start_date)."' ";
    //if((bool)strtotime($end_date)) $str_dates .=" AND DATE(p.create_date) <='".convertDate($end_date)."' ";
   
    //$sql = $selectCols_order." UNION ".$selectCols;
    $rows = DB::table('package AS p')->join('package_statuses AS ps','ps.id','=','p.status_id')->where('p.branch_id',$branch_id)->where('p.sender_id',$sender_id)->whereRaw($more_wheres)->selectRaw($selectCols)->get();
    //$rows = DB::select(DB::raw($sql));
    return $rows;
  }
  
  
    //retutns list of COUNTS of packages with status starting from "Arrived at Warehouse" to end of process
    function getPackageCounts_summary($d){
      $ss = getSessionInfo($d);
      if(!$ss) return '#350'; //user not authenticated
      if (!prn_allowed(2)) return '@'; //need permission to do this task
      $branch_id = $ss->branch_id;
      //$status_id = isset($d->status_id)? sanitize($d->status_id):null;
      $sender_id = isset($d->sender_id)? sanitize($d->sender_id):null;
      //$status_id <=4, higher status => use packageModel->getPackageCounts_summary()  
      $data = (object)['at_warehouse_count'=>0,'on_delivery_count'=>0,'failed_count'=>0,'returned_count'=>0,'delivered_count'=>0];
      
      $last_10_days =  Carbon::now()->addDay(-10);
      $last_10_days = convertDate($last_10_days);

      //Status_id <=4  => query from table "order" by summing up the "qty" 
      $rows = DB::select(DB::raw("SELECT COUNT(p.id) AS cnt,p.status_id, ps.name AS `status` from `package` AS `p`
      INNER JOIN  package_statuses AS ps ON ps.id = p.status_id
      WHERE p.branch_id =$branch_id AND p.sender_id ='$sender_id' AND (p.status_id=5 OR p.status_id=6) AND DATE(p.arrival_time) >= '$last_10_days' 
      GROUP BY p.status_id,ps.`name`"));
       
      foreach($rows as $row){
          if($row->status_id ==5) 
            $data->at_warehouse_count = $row->cnt; //last 3 days
          else if ($row->status_id ==6)
             $data->on_delivery_count = $row->cnt; //last 3 days 
          // else if ($row->status_id ==8)
          //    $data->delivered_count = $row->cnt; 
          // else if ($row->status_id ==9)
          //    $data->failed_count = $row->cnt;
          // else if ($row->status_id ==11)
          //    $data->returned_count = $row->cnt;    
      }

      /*** For "Delivered", "Failed","Returned" => COUNT within @today's date only. @status_id (8,9,11) ***/
      $today = date('Y-m-d');
      $rows = DB::select(DB::raw("SELECT COUNT(p.id) AS cnt,p.status_id, ps.name AS `status` from `package` AS `p`
      INNER JOIN  package_statuses AS ps ON ps.id = p.status_id
      WHERE p.branch_id =$branch_id AND p.sender_id ='$sender_id' AND (p.status_id=8 OR p.status_id=9 OR p.status_id =11) AND DATE(p.arrival_time) = '$today' 
      GROUP BY p.status_id,ps.`name`"));
        foreach($rows as $row){
           if ($row->status_id ==8)
             $data->delivered_count = $row->cnt; 
           else if ($row->status_id ==9)
             $data->failed_count = $row->cnt;
           else if ($row->status_id ==11)
             $data->returned_count = $row->cnt; /** todo: later "returned" items based on return_date, not create_date **/    
      }
       return $data;
  }

  //Upload attachment for package | upload and doc or image related to a package
  function savePackageAttachment($d){
    $ss = getSessionInfo($d);
    if(!$ss) return '#350'; //user not authenticated
    if (!prn_allowed(2)) return '@'; //need permission to do this task

    $result = (object)array('error_message'=>null,'status'=>'OK');

    $branch_id = sanitize($ss->branch_id); 
    $package_id = isset($d->package_id)?sanitize($d->package_id):null;
     
    if (empty($package_id) || $package_id <=0) {
      $result->error_message ='Package identity is not valid';
      $result->status ='Error';
      return $result;
    }

    $file_content = isset($d->file_content)?$d->file_content:null;
    if(!$file_content) $file_content = isset($d->img_data)?$d->img_data:null;

    if (empty($file_content)) {
      $result->error_message ='It seems that there is no chosen file';
      $result->status ='Error';
      return $result;
    }

    $file_type = isset($d->file_type)? sanitize($d->file_type):null;       
    $allowed_file_types = ['jpg','png','jpeg','svg'];

      //$dir = getcwd(). '/storage/companies/'.$branch_id.'_data/identity/';
      $dir = getcwd(). '/uploads/companies/'.$branch_id.'_data/package_uploads/';
      //DB::table('um_branches')->where('branch_id',1)->update(array('photo_file_name'=>$dir));   
      $fileName =$dir.$branch_id."_pkg_img_".date('Ymd_hms');
      $mResult = createFile($file_type,$fileName,$file_content);   
      ////DB::table('um_branches')->where('branch_id',$branch_id)->update(array('photo_file_name'=>$mResult->error)); 
      if (!$mResult->error)
      {
        DB::table('package_attachments')->insert(array(
          'branch_id'=>$branch_id,
          'package_id'=>$id,
          'file_type'=>$file_type,
          'file_name'=>$mResult->filename,
          'create_user'=>$ss->login_name,
          'create_date'=>getNowTime()
        ));
        
        $new_id = DB::getPdo()->lastInsertId();
        if ($new_id > 0) {
          $result->error_message =null;
          $result->status ='OK';    
        } else {
          $result->error_message ='Upload failed due to unexpected problem';
          $result->status ='Error';    
        }
      } 
      else 
      {
        $result->error_message =$mResult->error;
        $result->status ='Error';
        return $result;
      }		  
        
      return $result;

   }

  function getPackageCountBySenderAndStatus_today($branch_id,$sender_id,$status_id){
      $today = date('Y-m-d');
      $rows = DB::select(DB::raw("SELECT COUNT(p.id) AS cnt FROM `package` AS `p`
      WHERE p.branch_id =$branch_id AND p.sender_id ='$sender_id' AND p.status_id=$status_id AND DATE(p.arrival_time)='$today'"));
      foreach($rows as $row) return $row->cnt;
      return 0;
   }

      //retutns list of COUNTS of packages with status starting from "Arrived at Warehouse" to end of process
      /***
       *These two methods called by Merchan App, on Home Screen's Order Summary 
       *getDeliverySummary_list() returns list of packages based on @status_id >=5. From "Arrived Warehouse" or above
       *getOrderSummary_list()  returns list of packages based on @status_id <=4. From "Arrived Warehouse" or above
       * ***/

      function getOrderSummaryList_available($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        //$status_id = isset($d->status_id)? sanitize($d->status_id):null;
        $sender_id = isset($d->sender_id)? sanitize($d->sender_id):null;
        $status_id = 1; //isset($d->status_id)? sanitize($d->status_id):null;
  
        //if ($status_id <=4) return [];
 
        $last_date =  Carbon::now()->addDay(-3);
        $last_date = convertDate($last_date);

        $rows = DB::select(DB::raw("SELECT DATE_FORMAT(o.create_date,'%d %b %Y %r') AS booking_date, o.id AS order_id,o.code AS order_code,o.qty, o.sender_id, o.pickup_address, o.product_type, o.delivery_type, o.request_vehicle_type, o.status_id, ps.name AS `status` FROM `order` AS `o`
        INNER JOIN package_statuses AS ps ON ps.id = o.status_id
        WHERE o.branch_id =$branch_id AND o.sender_id = '$sender_id' AND o.status_id =$status_id AND DATE(o.create_date) >='$last_date'"));
        return $rows;
    }

    function getOrderSummaryList_accepted($d){
      $ss = getSessionInfo($d);
      if(!$ss) return '#350'; //user not authenticated
      if (!prn_allowed(2)) return '@'; //need permission to do this task
      $branch_id = $ss->branch_id;
      //$status_id = isset($d->status_id)? sanitize($d->status_id):null;
      $sender_id = isset($d->sender_id)? sanitize($d->sender_id):null;
      $status_id = 2; 
      //isset($d->status_id)? sanitize($d->status_id):null;

      //if ($status_id <=4) return [];

      $last_10_days =  Carbon::now()->addDay(-3);
      $last_10_days = convertDate($last_10_days);

      //Status_id <=4  => query from table "order" by summing up the "qty" 
      $rows = DB::select(DB::raw("SELECT DATE_FORMAT(o.create_date,'%d %b %Y %r') AS booking_date, o.id AS order_id,o.code AS order_code, o.sender_id, o.pickup_address, o.product_type, o.delivery_type, o.request_vehicle_type,o.qty, o.driver_id, o.status_id, ps.name AS `status`, d.name AS driver_name, d.code AS driver_code FROM `order` AS `o`
      INNER JOIN package_statuses AS ps ON ps.id = o.status_id
      INNER JOIN driver AS d ON d.id = o.driver_id 
      WHERE o.branch_id =$branch_id AND o.sender_id = '$sender_id' AND o.status_id =$status_id AND DATE(o.create_date) >='$last_10_days'"));
      return $rows;
  }

  function getOrderSummaryList_picked($d){
    $ss = getSessionInfo($d);
    if(!$ss) return '#350'; //user not authenticated
    if (!prn_allowed(2)) return '@'; //need permission to do this task
    $branch_id = $ss->branch_id;
    //$status_id = isset($d->status_id)? sanitize($d->status_id):null;
    $sender_id = isset($d->sender_id)? sanitize($d->sender_id):null;
    //$status_id = 3 or 4 

    //isset($d->status_id)? sanitize($d->status_id):null;

    //if ($status_id <=4) return [];

    $last_10_days =  Carbon::now()->addDay(-3);
    $last_10_days = convertDate($last_10_days);

    $rows = DB::select(DB::raw("SELECT o.id AS order_id,DATE_FORMAT(o.create_date,'%d %b %Y %r') AS booking_date,o.code As order_code, o.sender_id, o.pickup_address, o.product_type, o.delivery_type, o.request_vehicle_type,o.qty, o.driver_id, o.status_id, ps.name AS `status`, d.code AS driver_code, d.name AS driver_name,d.phone_number AS driver_phone FROM `order` AS `o`
    INNER JOIN package_statuses AS ps ON ps.id = o.status_id
    INNER JOIN driver AS d ON d.id = o.driver_id 
    WHERE o.branch_id =$branch_id AND o.sender_id = '$sender_id' AND (o.status_id = 3 OR o.status_id=4) AND DATE(o.create_date)>='$last_10_days'"));
    return $rows;
}

function getOrderSummarylist_at_warehouse($d){
      $ss = getSessionInfo($d);
      if(!$ss) return '#350'; //user not authenticated
      if (!prn_allowed(2)) return '@'; //need permission to do this task
      $branch_id = $ss->branch_id;
      //$status_id = isset($d->status_id)? sanitize($d->status_id):null;
      $sender_id = isset($d->sender_id)? sanitize($d->sender_id):null;
      $status_id = isset($d->status_id)? sanitize($d->status_id):null;
      $status_id = 5;

      $last_10_days =  Carbon::now()->addDay(-3);
      $last_10_days = convertDate($last_10_days);

      $rows = DB::select(DB::raw("SELECT p.id,DATE_FORMAT(p.create_date,'%d %b %Y  %r') AS booking_date,p.delivery_type,p.sender_id,p.sender_name, p.receiver_name,p.receiver_phone,p.zone_code, 
      p.df_payer,
      cod,price,
      IFNULL(p.cod_fee,0) AS cod_fee, 
      get_cod_amount(p.cod,p.price,p.cod_fee) AS cod_amount,
      (p.base_fee + IFNULL(p.delivery_fee,0)) AS fee,
      ifnull(p.sender_total,0) AS sender_total,
      p.failure_notes, 
      p.billed_kg, p.status_id, ps.name AS `status`,NULL AS driver_code, NULL AS driver_name FROM `package` AS `p`
      INNER JOIN  package_statuses AS ps ON ps.id = p.status_id
      WHERE p.branch_id =$branch_id AND p.sender_id ='$sender_id' AND  p.status_id =$status_id AND DATE(p.arrival_time) >= '$last_10_days'"));
     return $rows;

  }
  
  //get list of on_delivery packages (LAST TEN DAYS)
  function getOrderSummaryList_on_delivery($d){
    $ss = getSessionInfo($d);
    if(!$ss) return '#350'; //user not authenticated
    if (!prn_allowed(2)) return '@'; //need permission to do this task
    $branch_id = $ss->branch_id;
    //$status_id = isset($d->status_id)? sanitize($d->status_id):null;
    $sender_id = isset($d->sender_id)? sanitize($d->sender_id):null;
    $status_id = isset($d->status_id)? sanitize($d->status_id):null;
    $status_id = 6;

    $last_10_days = convertDate(Carbon::now()->addDay(-3));

    $rows = DB::select(DB::raw("SELECT p.id,DATE_FORMAT(p.create_date,'%d %b %Y') AS booking_date,p.delivery_type,p.sender_id,p.sender_name, p.receiver_name,p.receiver_phone,p.zone_code,
      p.df_payer,
      cod,price,
      IFNULL(p.cod_fee,0) AS cod_fee, 
      get_cod_amount(p.cod,p.price,p.cod_fee) AS cod_amount,
      (p.base_fee + IFNULL(p.delivery_fee,0)) AS fee,
      ifnull(p.sender_total,0) AS sender_total,
      p.failure_notes, 
      p.billed_kg, p.status_id, ps.name AS `status`,d.code AS driver_code, d.name AS driver_name FROM `package` AS `p`
    INNER JOIN  package_statuses AS ps ON ps.id = p.status_id
    INNER JOIN `driver` as `d` ON d.id = p.driver_id
    WHERE p.branch_id =$branch_id AND p.sender_id ='$sender_id' AND  p.status_id =$status_id AND DATE(p.arrival_time) >= '$last_10_days'"));
    return $rows;
 }

    //get list of delviered pacakges (TODAY)
    function getOrderSummaryList_delivered($d){
      $ss = getSessionInfo($d);
      if(!$ss) return '#350'; //user not authenticated
      if (!prn_allowed(2)) return '@'; //need permission to do this task
      $branch_id = $ss->branch_id;
      //$status_id = isset($d->status_id)? sanitize($d->status_id):null;
      $sender_id = isset($d->sender_id)? sanitize($d->sender_id):null;
      $status_id = isset($d->status_id)? sanitize($d->status_id):null;
      $status_id = 8;

      $today = convertDate(getNowTime());

      $rows = DB::select(DB::raw("SELECT p.id,DATE_FORMAT(p.create_date,'%d %b %Y') AS booking_date,p.delivery_type,p.sender_id,p.sender_name, p.receiver_name,p.receiver_phone,p.zone_code,
      p.df_payer,
      cod,price,
      IFNULL(p.cod_fee,0) AS cod_fee, 
      get_cod_amount(p.cod,p.price,p.cod_fee) AS cod_amount,
      (p.base_fee + IFNULL(p.delivery_fee,0)) AS fee,
      ifnull(p.sender_total,0) AS sender_total,
      p.failure_notes, 
      p.billed_kg, p.status_id, ps.name AS `status`,d.code AS driver_code, d.name AS driver_name FROM `package` AS `p`
      INNER JOIN  package_statuses AS ps ON ps.id = p.status_id
      INNER JOIN `driver` as `d` ON d.id = p.driver_id
      WHERE p.branch_id =$branch_id AND p.sender_id ='$sender_id' AND  p.status_id =$status_id AND DATE(p.delivery_time) = '$today'"));
      return $rows;
    }

    //get List of failed packages (LAST 10 DAYS)
    function getOrderSummaryList_failed($d){
      $ss = getSessionInfo($d);
      if(!$ss) return '#350'; //user not authenticated
      if (!prn_allowed(2)) return '@'; //need permission to do this task
      $branch_id = $ss->branch_id;
      //$status_id = isset($d->status_id)? sanitize($d->status_id):null;
      $sender_id = isset($d->sender_id)? sanitize($d->sender_id):null;
      $status_id = isset($d->status_id)? sanitize($d->status_id):null;
      $status_id = 9;

      $today = convertDate(getNowTime());
      $rows = DB::select(DB::raw("SELECT p.id,p.delivery_type,p.sender_id,DATE_FORMAT(p.create_date,'%d %b %Y') AS booking_date, p.sender_name, p.receiver_name,p.receiver_phone,p.zone_code,
      p.df_payer,
      cod,price,
      IFNULL(p.cod_fee,0) AS cod_fee, 
      get_cod_amount(p.cod,p.price,p.cod_fee) AS cod_amount,
      (p.base_fee + IFNULL(p.delivery_fee,0)) AS fee,
      ifnull(p.sender_total,0) AS sender_total,
      p.failure_notes,p.billed_kg, p.status_id, ps.name AS `status`,d.code AS driver_code, d.name AS driver_name FROM `package` AS `p`
      INNER JOIN  package_statuses AS ps ON ps.id = p.status_id
      INNER JOIN `driver` as `d` ON d.id = p.driver_id
      WHERE p.branch_id =$branch_id AND p.sender_id ='$sender_id' AND  p.status_id =$status_id AND DATE(p.delivery_time) >= '$today'"));
      return $rows;
    }

    //get List of failed packages (LAST 10 DAYS)
    function getOrderSummaryList_returned($d){
      $ss = getSessionInfo($d);
      if(!$ss) return '#350'; //user not authenticated
      if (!prn_allowed(2)) return '@'; //need permission to do this task
      $branch_id = $ss->branch_id;
      //$status_id = isset($d->status_id)? sanitize($d->status_id):null;
      $sender_id = isset($d->sender_id)? sanitize($d->sender_id):null;
      $status_id = isset($d->status_id)? sanitize($d->status_id):null;
      $status_id = 11;

      $today = convertDate(Carbon::now());
      $rows = DB::select(DB::raw("SELECT p.id,p.delivery_type,p.sender_id,DATE_FORMAT(p.create_date,'%d %b %Y') AS booking_date, p.sender_name, p.receiver_name,p.receiver_phone,p.zone_code,
      p.df_payer,
      cod,price,
      IFNULL(p.cod_fee,0) AS cod_fee, 
      get_cod_amount(p.cod,p.price,p.cod_fee) AS cod_amount,
      (p.base_fee + IFNULL(p.delivery_fee,0)) AS fee,
      ifnull(p.sender_total,0) AS sender_total,
      p.failure_notes,p.billed_kg, p.status_id, ps.name AS `status`,d.code AS driver_code, d.name AS driver_name FROM `package` AS `p`
      INNER JOIN  package_statuses AS ps ON ps.id = p.status_id
      INNER JOIN `driver` as `d` ON d.id = p.driver_id
      WHERE p.branch_id =$branch_id AND p.sender_id ='$sender_id' AND  p.status_id =$status_id AND DATE(p.create_date) >= '$today'")); //todo: later use "return_date"
      return $rows;
    }

    //Seachbox on Home screen of Merchant's mbile app => to find packages by recever phone or by scanning/entering barcode 
    function findPackages_quick($d){
      $ss = getSessionInfo($d);
      if(!$ss) return '#350'; //user not authenticated
      if (!prn_allowed(2)) return '@'; //need permission to do this task
      $branch_id = $ss->branch_id;

      $find_by = isset($d->find_by)?$d->find_by:null;
      $search_value = isset($d->search_value)?$d->search_value:null;
      $sender_id = isset($d->sender_id)?$d->sender_id:null;

       $allowed_cols = ['phone','receiver_phone','phone_number','barcode','bar_code'];
       $result = (object)['status'=>'OK','error_message'=>null];

       if(empty($search_value)) return [];
       if(!in_array($find_by,$allowed_cols)){
          $result->status ='Error';
          $result->error_message ="find_by value is not correct!";
          return $result;   
       }
       if ($find_by =='phone' || $find_by=='phone_number') $find_by ='receiver_phone';
       if ($find_by =='barcode') $find_by ='bar_code';
       
        $today = convertDate(Carbon::now());
        if ($find_by =='receiver_phone'){
           
            $rows = DB::select(DB::raw("SELECT p.id,p.delivery_type,p.sender_id,DATE_FORMAT(p.create_date,'%d %b %Y') AS booking_date, p.sender_name, p.receiver_name,p.receiver_phone,p.zone_code,
            p.df_payer,
            cod,price,
            IFNULL(p.cod_fee,0) AS cod_fee, 
            get_cod_amount(p.cod,p.price,p.cod_fee) AS cod_amount,
            (p.base_fee + IFNULL(p.delivery_fee,0)) AS fee,
            ifnull(p.sender_total,0) AS sender_total,
            p.failure_notes,p.billed_kg, p.status_id, ps.name AS `status`,d.code AS driver_code, d.name AS driver_name FROM `package` AS `p`
            INNER JOIN  package_statuses AS ps ON ps.id = p.status_id
            INNER JOIN `driver` as `d` ON d.id = p.driver_id LIMIT 10"));
            //WHERE p.branch_id =$branch_id AND p.sender_id ='$sender_id' AND p.receiver_phone='$search_value' AND DATE(p.create_date) >= '$today'
            return $rows;
        } else if ($find_by =='bar_code'){
            $rows = DB::select(DB::raw("SELECT p.id,p.delivery_type,p.sender_id,DATE_FORMAT(p.create_date,'%d %b %Y') AS booking_date, p.sender_name, p.receiver_name,p.receiver_phone,p.zone_code,
            p.df_payer,
            cod,price,
            IFNULL(p.cod_fee,0) AS cod_fee, 
            get_cod_amount(p.cod,p.price,p.cod_fee) AS cod_amount,
            (p.base_fee + IFNULL(p.delivery_fee,0)) AS fee,
            ifnull(p.sender_total,0) AS sender_total,
            p.failure_notes,p.billed_kg, p.status_id, ps.name AS `status`,d.code AS driver_code, d.name AS driver_name FROM `package` AS `p`
            INNER JOIN  package_statuses AS ps ON ps.id = p.status_id
            INNER JOIN `driver` as `d` ON d.id = p.driver_id
            WHERE p.branch_id =$branch_id AND p.sender_id ='$sender_id' AND p.qr_code='$search_value' AND DATE(p.create_date) >= '$today'"));
            return $rows;
        } 
        return [];
    }
}
