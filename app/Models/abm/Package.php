<?php

namespace App\Models\Abm;
//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use App\Models\DV;
use App\Models\JDV;
use App\Models\UM;
// use App\Models\Dms\Tracker;
use App\Models\Notifier;
//use Session;
use DB;
use Sanitizer;
use App\Models\ErrorManager;

use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Throwable;

//use function PHPUnit\Framework\assertTrue;

class Package //extends Model
{
    // use HasFactory;
    // protected $fillable = ['package_id','order_id','driver_id','status','failure_notes','depart_time','arrival_time','notes'];
    // protected $table = 'delivery';
     
    protected $id = null;
    protected $userInfo = null;
    protected $use_barcode =false;
   
    protected static $overdue_alert_times = [
       '5'=>2,
       '6'=>4,
       '9'=>48
    ];

    function __construct($id=null,$userInfo=null,$use_barcode =false){
         $this->userInfo = $userInfo;
         $this->use_barcode = $use_barcode;
         if(!intval($id)) $this->use_barcode =true;
         if($use_barcode){
           $this->id = DB::table('package')->where('qr_code',$id)->take(1)->value('id');       
           //if(!$row) throw new \Exception("The provided package barcode $id does not exist");
         }else $this->id = $id;
    }

    function getId($barcode=null){
      if ($barcode){
        return DB::table('package')->where('qr_code',$barcode)->take(1)->value('id');
      }
      return $this->id;
    }
    function getUserInfo(){
      return $this->userInfo;
    }

    //getpackageExpandedDetails() = getPackageDetails()
    function getDetails($id=null,$ss=null){
      $ss = $ss?$ss:$this->userInfo;
      $package_id = $id?$id:$this->id; 
      $branch_id = $ss->branch_id;
      return DB::table('package AS p')->where('p.branch_id',$branch_id)->where('p.id',$package_id)->selectRaw('p.id,p.delivery_id, p.sender_pmt_status_id,p.driver_pmt_status_id, p.qr_code AS barcode, p.sender_id,p.sender_name,p.sender_phone,p.dim_x,p.dim_y,p.dim_h,LOWER(p.delivery_type) AS delivery_type,p.zone_code,p.zone_name,p.receiver_phone,p.receiver_address, p.cod, 0 AS cod_fee_percent, LOWER(p.df_payer) AS df_payer, p.cod_fee, p.base_fee, p.delivery_fee, p.driver_adjust_amount,p.forwarding_cost,p.price,p.actual_kg,p.billed_kg,p.agent_notes, IFNULL(p.delivery_notes,\'NA\') AS remarks, p.failure_notes, p.status_id, IFNULL((SELECT name FROM driver WHERE id = p.driver_id LIMIT 1),\'មិនទាន់មាន\') AS driver_name, p.driver_total, p.sender_total,IFNULL(p.driver_pmt_status_id,0) AS driver_pmt_status_id,IFNULL(p.sender_pmt_status_id,0) AS sender_pmt_status_id')->take(1)->first(); 
    } 
 
    /** Return object {"details"=> object,"cod"=>[],"df_payer"=> [],"delivery_type"=>[]} */
    function getDetailsWithOptions($id=null,$ss=null){
      $ss = $ss?$ss:$this->userInfo;
      $package_id = $id?$id:$this->id; 
      $branch_id = $ss->branch_id;
      // $cache_key = 'orderdetails_'.$branch_id.$id;
      // $cache_data = Cache::get($cache_key);
      // if($cache_data) return $cache_data;

      $p = DB::table('package AS p')->where('p.branch_id',$branch_id)->where('p.id',$package_id)->selectRaw('p.id,p.delivery_id, p.sender_pmt_status_id,p.driver_pmt_status_id, p.qr_code AS barcode, p.sender_id,LOWER(p.df_payer) AS df_payer,p.sender_name,p.sender_phone,p.dim_x,p.dim_y,p.dim_h,LOWER(p.delivery_type) AS delivery_type,p.zone_code,p.zone_name,p.receiver_phone,p.receiver_address, p.cod, 0 AS cod_fee_percent, p.cod_fee, p.base_fee, p.delivery_fee, p.driver_adjust_amount,p.forwarding_cost,p.price,p.actual_kg,p.billed_kg,p.agent_notes,IFNULL(p.delivery_notes,\'NA\') AS remarks, p.failure_notes, p.status_id, IFNULL((SELECT name FROM driver WHERE id = p.driver_id LIMIT 1),\'មិនទាន់មាន\') AS driver_name, p.driver_total, p.sender_total,IFNULL(p.driver_pmt_status_id,0) AS driver_pmt_status_id,IFNULL(p.sender_pmt_status_id,0) AS sender_pmt_status_id')->take(1)->first(); 
      $data = (object)[
         'details'=>$p,
         'cod'=>[(object)['cod'=>0,'cod_name'=>'No'],(object)['cod'=>1,'cod_name'=>'Yes']],
         'df_payer'=>[(object)['df_payer'=>'sender'],(object)['df_payer'=>'receiver']],
         'delivery_type'=>[(object)['delivery_type'=>'normal'],(object)['delivery_type'=>'fast']],
         'zone_code'=>DB::table('zones as z')->where('branch_id',$branch_id)->whereRaw('IFNULL(inactive,0) =0')->selectRaw('z.zone_code,CONCAT(zone_code,\' \',z.zone_name) AS zone_name')->get()
      ];
      //Cache::put($cache_key,$data,15);
      return $data;
    } 

    //given a @driver_id, returns a default warehouse info (id,name, map_location). Used for Driver mobile app to identify a target warehouse to bring pickup packages to, or to deliver packages from 
    function getWarehouseByDriver_default($branch_id,$driver_id){
      //NOTE: dw.is_default =1
       $rows = DB::table('driver_warehouses AS dw')->joint('warehouses AS h','h.id','=','dw.warehouse_id')->where('dw.branch_id',$branch_id)->where('dw.driver_id',$driver_id)->where('is_default',1)->selectRaw('h.id,h.name,h.map_location')->take(1)->get();
       return isset($rows[0])?$rows[0]:null; 
    }
    
    //returns a default warehouse_id for a driver or delivery person
    function getWarehouseIdByDriver_default($branch_id,$driver_id){
      $rows = DB::table('driver_warehouses AS dw')->where('dw.branch_id',$branch_id)->where('dw.driver_id',$driver_id)->where('is_default',1)->selectRaw('dw.warehouse_id')->take(1)->get();
      foreach($rows as $row) return $row->warehouse_id;
      return null;  
    }

    function getDetailsByCode($barcode,$ss=null){
      $ss = $ss?$ss:$this->userInfo;  
      $branch_id = $ss->branch_id;
      return DB::table('package AS p')->where('p.branch_id',$branch_id)->where('p.qr_code',$barcode)->selectRaw("p.id AS package_id,p.delivery_id, p.qr_code AS barcode, p.sender_id,p.sender_name,p.sender_phone, p.package_name,p.dim_x,p.dim_y,p.dim_h, p.zone_code,p.zone_name,p.receiver_phone, p.cod, 0 AS cod_fee_percent, p.cod_fee, p.base_fee, p.delivery_fee, p.driver_adjust_amount,p.forwarding_cost,p.price,p.df_payer,p.agent_notes,p.delivery_notes, CASE (p.status_id=9 OR p.status_id=11) WHEN 1 THEN p.failure_notes ELSE p.delivery_notes END AS remarks, p.status_id, (SELECT `name` FROM `driver` WHERE id = p.driver_id LIMIT 1) AS driver_name")->take(1)->get()->first(); 
    }

    //base_price is fixed price set as Promotion for some sellers. NOTE @zone_code is nevery empty. @zone_code ='all' instead of empty
    function getBaseFee($ss,$sender_id,$delivery_type='all',$zone_code='all',$billed_kg=null){
      $branch_id = $ss->branch_id;
      $today = date('Y-m-d');
      if ($sender_id > 0){
        $str_dates = "( DATE(p.end_date) >='".$today."' OR p.never_expires =1)";
        $rows = DB::table('sender_base_price AS p')->where('p.branch_id',$branch_id)->where('p.sender_id',$sender_id)->where('delivery_type',$delivery_type)->where('zone_code',$zone_code)->whereRaw($str_dates)->selectRaw("p.price")->take(1)->get();
        foreach($rows as $row) return is_numeric($row->price)?$row->price:0; 
      } 
      $def_base_fee = get_settings_value($ss,'DEFAULT_BASE_FEE','number');
      return is_numeric($def_base_fee)?$def_base_fee:0;  
    }
    
    //return Object {price_list_id,cod,cod_fee}
    function getPriceListIdBySender($sender_id){
      if(!$sender_id) $sender_id = 0;
      return DB::table('sender AS s')->where('id',$sender_id)->selectRaw($sender_id.' AS sender_id,price_list_id')->take(1)->first();
    } 
 
    //getDeliveryPrice|getDeliveryPriceInfo|getFee|getServiceFee 
    //returns object {'base_fee','delivery_fee','cod_fee_percent'}
    function getPriceInfo($branch_id,$sender_id,$item_type,$zone_code='all',$billed_weight=0,$country_id=0) {
      //$branch_id = $ss->branch_id;
      $delivery_fee =-1;
      // $base_fee =-1;
      $billed_weight= $billed_weight?$billed_weight:0;
      //$today = date('Y-m-d');
      $table ="price_list_details AS l";
      // $table ="price_list AS l";
      
      // $cod_fee_percent =0;
      $dTypes =['doc','non_doc','Doc','non-doc']; 
      $data = (object) ['error_message'=>'Failed to find matched price','status'=>'Error','status_code'=>405];
      $price_list_id =null;
      //NOTE: getPriceListIdBySender() return object {price_list_id,cod,cod_fee}
      $sp = $this->getPriceListIdBySender($sender_id); /** derived price_list_id from table "sender". NOTE that each sender has his or her price_list_is **/
      if($sp){
         $price_list_id = $sp->price_list_id;
        //  if(!is_numeric($cod)) $cod = $sp->cod;
        //  $cod_fee_percent = $sp->cod_fee;
      }
      // if ($cod !=1) $cod_fee_percent=0;

      $str_price_list = null;
      $str_country = null;
      if (!$price_list_id){
        $err ='Failed to identify sender';
        if($sp && !$sp->sender_id)
           $err ='រកមិនឃើញអត្តសញ្ញាណអ្នកផ្ញើរ ឬក៏ អ្នកផ្ញើរមិនទាន់មានតារាងតំលៃ';
        else if(!$sp)
           $err ='អ្នកផ្ញើរមិនទាន់មានតារាងតំលៃ';
       return DV::error($err);
      }
      if(!in_array(strtolower($item_type),$dTypes)) return DV::error('Item type is not correct!');
      ////No need to check Expiry date for price list
      //$str_dates = " AND (l.end_date>='".$today."' OR l.never_expires =1)";
      $billed_weight = floatval($billed_weight);
      $billed_weight = $billed_weight ?? 0;
      // $str_kg = ' AND kg_within(IFNULL(l.start_kg,0),IFNULL(l.end_kg,'.$billed_kg.'),0)=1'; 
      //if ($sender_id > 0) {
         //$table ="sender_price_list AS l"; // |0| is same as |all| for (All Senders) (All Zones)
        $str_price_list =' AND (l.price_list_id=\''.$price_list_id.'\')';
        $str_country =' AND (l.country_id=\''.$country_id.'\')';
        // $str_zone =" AND (l.zone_code LIKE '%|".$zone_code."|%') ";
      //}
      // return JDV::result(['pid'=>$price_list_id,'cid'=>$country_id,'zcod'=>$zone_code]);
      
      $more_wheres = "1=1 ".$str_price_list.$str_country;
      $row = DB::table($table)->where('l.branch_id',$branch_id)->where('l.item_type',$item_type)->whereRaw($more_wheres)->selectRaw("IFNULL(l.price_per_kg,0) AS price_per_kg")->take(1)->first();
      // return JDV::result(['c'=>$country_id,'pl'=>$price_list_id]);
      if(!$row) return DV::error('រកមិនឃើញតំលៃក្នុងតារាងកំណត់');
      // $base_fee = $row->base_fee; //base_price
        // $price_option = Strtolower($row->price_option);
        // if ($price_option =='per_kg' ||  $price_option == "per kg") 
        //  {
      // $billed_kg = $billed_kg - (is_numeric($row->start_kg)?$row->start_kg:0);
      if($billed_weight < 0) $billed_weight =0;
      if (!is_numeric($row->price_per_kg)) $row->price_per_kg =0;
      $delivery_fee = $row->price_per_kg * $billed_weight;
        //  }
        //  else
          //  $delivery_fee = is_numeric($row->price)?$row->price:0;    
      
      //$str_valid = null;//" AND ((DATE(c.start_date) <='".$today."' AND DATE(c.end_date) >='".$today."') OR (c.never_expires =1))";
      $more_wheres = "1=1 "; //.$str_valid;

      //$rows = DB::table('sender_cod_charges AS c')->where('c.branch_id',$branch_id)->where('c.sender_id',$sender_id)->whereRaw("c.delivery_type ='".$delivery_type."'")->whereRaw($more_wheres)->selectRaw("IFNULL(c.cod_fee_percent,0) AS cod_fee_percent")->take(1)->get();
      //foreach($rows as $row) $cod_fee_percent = $row->cod_fee_percent;
      //$ss = (object)['branch_id'=>$branch_id];
      //$cod_fee_percent = get_settings_value($ss,13,'number'); //use cod_fee from table "sender.cod_fee" instead
      $err = null;
      if($delivery_fee < 0 ) $err ='រកមិនឃើញតំលៃក្នុងតារាងកំណត់';
      $data = (object)['status'=>'OK','error_message'=>null,'delivery_fee'=>number_format($delivery_fee,2),'price_per_kg'=>$row->price_per_kg,'billed_weight'=>number_format($billed_weight,2)];
      if ($err) return DV::error($err);  
      // return JDV::result($data);  
      return $data;
    }

    function getDeliveryPriceInfo_magicEntry($arr =[],$ss=null){
      $ss = $ss?$ss:$this->userInfo;
      $d = (object)$arr; 
      $branch_id = $ss->branch_id;

      $order_id = isset($d->order_id)?$d->order_id:null; 
      $sender_id = isset($d->sender_id)?$d->sender_id:null;
      $delivery_type = isset($d->delivery_type)?$d->delivery_type:null;
      $zone_code = isset($d->zone_code)?$d->zone_code:null;
      $price = isset($d->price)?$d->price:0;
      $billed_kg = isset($d->billed_kg)?$d->billed_kg:0;
      $cod = isset($d->cod)?$d->cod:null;
      $df_payer = isset($d->df_payer)?strtolower($d->df_payer):null;
      
      if (!$sender_id) {
         $order = $this->getOrderInfo($ss,$order_id);
         if ($order) $sender_id = $order->sender_id;
      }

      $m = $this->getDeliveryPriceInfo($branch_id,$sender_id,$delivery_type,$zone_code,$billed_kg,$cod);
      if($m->status ==='Error') return DV::error($m->error_message);
      $amount_to_sender = 0;
      $fees = 0;
      $driver_total =0;
      $cod_fee =0;
      $fees = $m->base_fee + $m->delivery_fee; 

    if ($cod === 1 || $cod == 1){
      $cod_fee = ($price + $fees) * $m->cod_fee_percent/100;
    }
    else {
      $price =0;
      $cod_fee=0;
    }

    if ($df_payer === 'sender'){
        $amount_to_sender = $price - $cod_fee - $fees;
        $driver_total = $price;
     }else{
        $amount_to_sender = $price - $cod_fee;
        $driver_total = $price + $fees;
     }
     
      //$fees is revenue to Company, so add $cod_fee to it
      $fees += $cod_fee;
      return (object)[
        'status'=>'OK',
        'error_message'=>null,
        'sender_id'=>$sender_id,
        'order_id'=>$order_id,
        'driver_total'=>number_format($driver_total,2,'.',''),
        'amount_to_sender'=>number_format($amount_to_sender,2,'.',''),
        'additional'=>$m->delivery_fee,
        'base_fee'=>$m->base_fee,
        'fees'=>number_format($fees,2,'.','')
        //,'data'=>json_encode(['zone_code'=>$zone_code,'delivery_type'=>$delivery_type,'billed_kg'=>$billed_kg,'price'=>$price])
      ];
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
      $rows = DB::table($table)->where('l.branch_id',$branch_id)->where('l.delivery_type',$delivery_type)->where('zone_code',$zone_code)->whereRaw($more_wheres)->selectRaw("IFNULL(l.price,0) AS price,IFNULL(l.price_per_kg,0) AS price_per_kg,IFNULL(l.start_kg,0) AS start_kg,l.price_option")->take(1)->get();
     
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

      $rows = DB::table('trip_num_control AS c')->where('c.branch_id',$branch_id)->where('op_month',$op_month)->where('op_year',$op_year)->take(1)->selectRaw('TRIM(c.prefix) AS prefix,c.last_trip_number')->get();
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

  function changeSender($arr,$id=null,$ss=null){
      $d = (object)$arr; 
      $package_id = $id?$id:$this->id;
      $ss = $ss?$ss:$this->userInfo;
      $branch_id = $ss->branch_id;
      if(!$package_id) $package_id = $d->package_id;
      //New sender_id, not the previous one
      $new_sender_id = $d->sender_id;

      if (empty($package_id)) return DV::error('Package identity is not valid');
      $sender = $this->getSenderInfo($ss,$new_sender_id);
      if (!$sender) return DV::error('New merchant identity is not valid');
      $new_sender_name = $sender->name;

      $cols = 'p.id,p.qr_code AS barcode,p.sender_id,p.sender_name,p.receiver_phone,p.price, IFNULL(p.forwarding_cost,0) AS forwarding_cost,p.cod,p.df_payer,(p.delivery_fee + p.base_fee) AS fees,p.cod_fee,p.delivery_type,p.zone_code,p.billed_kg,p.sender_pmt_status_id';
      $package = DB::table('package as p')->join('sender as s','s.id','=','p.sender_id')->where('p.id',$package_id)->selectRaw($cols)->first();
      if (!$package) return DV::error('Failed to retrieve package information');
      if ($package->sender_pmt_status_id===1) return DV::error('Cannot change the merchant because there is already a payment transaction with the existing merchant');
      $old_sender_name = $package->sender_name;
      $cod_amount =0;
      $cod_fee = 0;
      $delivery_fee =0;
      $base_fee =0;
      $cod_fee_percent =0;
      $cod = $sender->cod;
      $forwarding_cost = $package->forwarding_cost;
      $df_payer = $package->df_payer;
      $price = $package->price;
      //if ($cod ===1) $cod_fee_percent = getCODFeeCharge($ss,$sender->id);

      $pInfo = $this->getDeliveryPriceInfo($branch_id,$new_sender_id,$package->delivery_type,$package->zone_code,$package->billed_kg,$cod);
      if ($pInfo->status === 'OK') {
          $delivery_fee = $pInfo->delivery_fee;
          $base_fee =$pInfo->base_fee;
          $cod_fee_percent = $pInfo->cod_fee_percent;
      }else return DV::error('Failed to change merchant. Problem with price list: '.$pInfo->error_message);
 
      if ($cod ==1 || strtolower($cod) =='yes') {
        $cod_amount = $price;
        $cod_fee = ($price + $base_fee + $delivery_fee) * $cod_fee_percent/100; 
      }
      $driver_total = $cod_amount;
      $sender_total = $cod_fee + $forwarding_cost; //Seller always has to pay forwarding cost or Taxi fee  
      if (strtolower($df_payer) === 'sender') 
          $sender_total += $base_fee + $delivery_fee;
      else 
         $driver_total += $base_fee + $delivery_fee;

      $inputs = [
        'sender_id'=>$sender->id,
        'sender_name'=>$sender->name,
        'sender_phone'=>$sender->phone_number,
        'sender_type'=>$sender->sender_type,
        'cod'=>$cod,
        'cod_fee'=>$cod_fee,
        'base_fee'=>$base_fee,
        'delivery_fee'=>$delivery_fee,
        //'df_payer'=>$df_payer
      ];
      $id = saveData($ss,'package',['id'=>$package_id],$inputs,[],1,false);
      $action ='change_sender';
      $des =$ss->full_name. ' បានប្តូរអ្នកផ្ញើរកញ្ចប់លេខ '.$package->barcode.' (receiver phone: '.$package->receiver_phone.') ពី '.$old_sender_name.' ទៅ '.$new_sender_name;
      Tracker::log((object)['package_id'=>$id,'user_class'=>$ss->user_class,'action_name'=>$action,'description'=>$des,'user_comment'=>''],$ss);
      return DV::depends($id,$inputs);
  }

    //getExchangeRate() returns exchange rate based on given @sender_id or @sender_code. It will returns defaul rates from generall settings if there is no matching rates within the current month
    function getExchangeRate($ss,$sender_code_or_id, $findBy){
        $branch_id = $ss->branch_id; 
        if($findBy =='id') {
           if ($sender_code_or_id<=0 || !is_numeric($sender_code_or_id)) $sender_code_or_id =null;
        }

        $rows = [];
        $this_month = date('m');
        $more_wheres = "x.x_month ='$this_month'";
        if (!empty($sender_code_or_id)) {
          if ($findBy==='id')
             $rows = DB::table('sender_exchange_rates AS x')->where('branch_id',$branch_id)->where('sender_id',$sender_code_or_id)->whereRaw($more_wheres)->selectRaw('x.buy_rate,x.sell_rate')->take(1)->get();   
          else 
             $rows = DB::table('sender_exchange_rates AS x')->join('sender AS s','s.id','=','x.sender_id')->where('x.branch_id',$branch_id)->where('s.code',$sender_code_or_id)->whereRaw($more_wheres)->selectRaw('x.buy_rate,x.sell_rate')->take(1)->get(); 
        } else{
             $rows = DB::table('exchange_rates AS x')->where('x.branch_id',$branch_id)->whereRaw($more_wheres)->selectRaw('x.buy_rate,x.sell_rate')->take(1)->get();   
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

    function returnToStore($arr,$id=null,$ss=null){
      $ss =$ss?$ss:$this->userInfo;  
      $branch_id = $ss->branch_id;
      
      $d = (object)$arr;
      $package_id = $id?$id:$this->id;
      if(!$package_id) $package_id = isset($d->package_id)? $d->package_id:0;
      $remarks = isset($d->remarks)?$d->remarks:null;
      $sender_id = null; 
      $status_id = null;
        
      //get senderId
         $pInfo = DB::table('package')->where('id',$package_id)->selectRaw('sender_id, status_id')->take(1)->get()->first();
         if(!$pInfo) return Dv::error("Failed to identify package information");
         $sender_id = $pInfo->sender_id;
         $status_id = $pInfo->status_id;
      //end of get SenderId

      if (!$sender_id) return DV::error("Failed to identify sender of this package"); 
      //9 == Failed => 11 = Returned
      if($status_id !=9){
         if($status_id ==11) {
            return DV::error("The package already returned");
         }else return DV::error("Only failed package can be returned"); 
      }
     
     $nowTime = getNowTime();
     //Use || to separate system remarks and user's remarks. system remarks || user remarks
     $overall_remarks = 'Returned by '.$ss->full_name.' at '.date('d M Y h:m',strtotime($nowTime)).'||'.$remarks;
     $inputs = [
      'branch_id'=>$branch_id,
      'sender_id'=>$sender_id,
      'package_id'=>$package_id,
      'remarks'=>$overall_remarks,
      'create_user'=>$ss->login_name,
      'create_date'=>$nowTime,
      'return_date'=>$nowTime
     ]; 

     $return_id = DB::table('returned_packages')->where('branch_id',$branch_id)->where('package_id',$package_id)->take(1)->value('id');
     $return_id = saveData($ss,'returned_packages',['id'=>$return_id],$inputs,[],1,true);
     
     if($return_id){
          //set package's Outstanding =0 and status_id to 11
          DB::table('package')->where('branch_id',$branch_id)->where('id',$package_id)->update([
            'status_id'=>11,
            'outstanding'=>0,
            'return_notes'=>$overall_remarks,
            'delivery_time'=>$nowTime  /* delivery_time can be "failed_date", "success_date" or "returned_date" depending on p.status_id */
          ]);
     }
     return DV::depends($return_id,['remarks'=>$overall_remarks],'Failed to save Return transaction');
    }

    function getPackageInfo($id=null){  
      $id = $id?$id:$this->id;
      $remarks = ',CASE p.status_id =9 WHEN 1 THEN p.failure_notes ELSE p.delivery_notes END AS remarks';
      return DB::table('package AS p')->join('delivery AS d','d.id','=','p.delivery_id')->join('package_statuses AS ps','ps.id','=','p.status_id')->where('p.id',$id)->selectRaw("p.id AS package_id,d.id AS delivery_id,p.sender_pmt_status_id,p.driver_pmt_status_id, p.qr_code AS barcode, p.sender_id,p.sender_name,p.sender_phone,p.dim_x,p.dim_y,p.dim_h, p.receiver_name,p.delivery_type,p.receiver_phone, p.zone_code,p.zone_name,p.receiver_phone,IFNULL(p.receiver_address,p.remarks) AS receiver_address, p.cod, 0 AS cod_fee_percent, p.cod_fee, p.base_fee, p.delivery_fee,p.sender_adjust_amount, p.driver_adjust_amount,p.forwarding_cost,p.price,p.df_payer,p.agent_notes".$remarks.", (SELECT `name` FROM driver WHERE id =p.driver_id LIMIT 1) AS driver_name,p.status_id,ps.name AS status")->take(1)->first(); 
    } 

    function getDeliveryType($package_id){
       return DB::table('package AS p')->where('id',$package_id)->take(1)->value('p.delivery_type');
    }
  
    //create history of package updates such as in cases like:
    /***
      1. "cod_change": Driver update COD amount from Driver's app => it is important to keep track what changes made by Driver from mobile app
      2. "package_status_change" When Admin Change
      3. update after settle payment with Merchant, or Driver: COD change, price change, df_payer, billed_kg
      @d = {'package_id','update_name','description'}  
     ***/
    static function trackPackageUpdate($ss,$d){
        $branch_id = $ss->branch_id; 
        DB::table('package_updates')->insert([
          'branch_id'=>$branch_id,
          'create_uid'=>$ss->user_id,
          'create_user'=>$ss->login_name,
          'create_date'=>getNowTime(),
          'create_user_class'=>$ss->user_class,
          'description'=>$d->description,
          'update_name'=>$d->update_name,
          'package_id'=>$d->package_id
        ]);
        return DV::success();
    }
    
    //savePackageDetails SaveExpandedPackageDetails updatePackageDetails()
    function saveDetails($arr=[],$id=null,$ss=null){
      $id =$id?$id:$this->id;
      $ss =$ss?$ss:$this->userInfo;
      $branch_id = $ss->branch_id;
      
      $v_rule = [
        'receiver_address'=>'0|string|0-250',
        'receiver_phone'=>'1|phone|1-35',
        'sender_id'=>'1|number|exists=sender.id',
        'delivery_type'=>'1|choice|normal,fast,Normal,Fast|default=normal',
        'zone_code'=>'1|string|exists=zones.zone_code',
        'dim_x'=>'0|number|default=0',
        'dim_y'=>'0|number|default=0',
        'dim_h'=>'0|number|default=0',
        'actual_kg' =>'0|number|default=0',
        'billed_kg'=>'1|number|default=0',
        'df_payer'=>'1|choice|sender,receiver,Sender,Receiver',
        'cod'=>'1|choice|0,1|default=1',
        'price'=>'1|number|0-1000|default=0',
        'base_fee'=>'0|number|default=0',
        'cod_fee'=>'0|number|default=0', 
        'delivery_fee'=>'0|number|default=0',
        'forwarding_cost'=>'0|number|default=0',
        'driver_total'=>'0|number|default=0',
        'sender_total'=>'0|number|default=0',
        'remarks'=>'0|string|0-250',
        'delivery_notes'=>'0|string|0-250'
      ];
      
      $res = validateObject($arr,$v_rule,true,['email'=>['@','-','.']],$ss->lang,false,null);
      if($res->error) return DV::error($res->error);
      $inputs = $res->values;
      $d = (object)$inputs;
      $inputs['delivery_notes'] = $d->delivery_notes ?? $d->remarks;
      $inputs['receiver_phone'] = str_replace(' ','',$d->receiver_phone?$d->receiver_phone:'');
       if (!$id) {
          return DV::error("Package identity is not valid");
       }
       $sender = DB::table('sender as s')->where('s.id',$d->sender_id)->selectRaw('s.id,s.name,s.sender_type_id,s.phone_number,s.address')->first();
       //$sender = self::getSenderInfo($ss,$d->sender_id); 
       if(!$sender) return DV::error('Merchant identity does not exist');

       $p = $this->getPackageProps($branch_id,$id,"p.id,p.status_id,p.sender_pmt_status_id,p.driver_pmt_status_id",'id');
       if(!$p) return DV::error("Package identity is not valid");
       if ($p->sender_pmt_status_id ==1) return DV::error('Cannot modify package information because payment has been settled with merchant');
       if($p->driver_pmt_status_id ==1) return DV::error('Cannot modify package information because payment has been settled with driver');
       if($p->status_id ==8){
          unset($inputs['receiver_phone'],$inputs['receiver_address'],$inputs['zone_code'],$inputs['sender_id']);
       }
       //if($p->status_id ==9) $inputs['failure_notes'] = $d->delivery_notes;

       $zone = $this->getZoneByCode($ss->branch_id,$d->zone_code);
       if ($zone ==null) return DV::error("The provided Zone Code is not valid ");
       //NOTE: zone_name in table pacakge.zone_name is also updated
       $inputs['zone_name'] = $zone->zone_name;

      //begin::calculation of package pricing to sender and driver
        $cod_amount =0;
        $delivery_fee = 0;
        $cod_fee = 0;
        $cod_fee_percent =0;
        //$other_fees =0;
        $base_fee =0;
        if ($d->price > 0) $d->cod =1; else $d->cod =0;
        $pInfo = $this->getDeliveryPriceInfo($branch_id,$d->sender_id,$d->delivery_type,$d->zone_code,$d->billed_kg,$d->cod);
        if($pInfo->status ==='Error') return DV::error($pInfo->error_message);
        if ($pInfo) {
            $delivery_fee = $pInfo->delivery_fee;
            $base_fee =$pInfo->base_fee;
            $cod_fee_percent = $pInfo->cod_fee_percent;
        }
           
        if ($d->cod ==1 || strtolower($d->cod) =='yes') {
          $cod_amount = $d->price;
          $cod_fee = ($d->price + $base_fee + $delivery_fee) * $cod_fee_percent/100; 
        }
        $driver_total = $cod_amount;
        $sender_total = $cod_fee + $d->forwarding_cost; //Seller always has to pay forwarding cost or Taxi fee  
        if (strtolower($d->df_payer) == 'sender') 
            $sender_total += $base_fee + $delivery_fee;
        else 
           $driver_total += $base_fee + $delivery_fee;
      //end::calculation of package pricing to sender and driver

      $inputs['cod'] = $d->cod;
      $inputs['price'] = $d->price;
      $inputs['cod_fee'] = $cod_fee;
      $inputs['base_fee'] = $base_fee;
      $inputs['delivery_fee'] = $delivery_fee;
      $inputs['driver_total'] =$driver_total;
      $inputs['sender_total'] = $sender_total;
      $inputs['sender_name'] = $sender->name;
      $inputs['sender_phone'] = $sender->phone_number;
      $inputs['receiver_address'] = $d->receiver_address?$d->receiver_address:$zone->zone_name;
      $id = saveData($ss,'package',['id'=>$id],$inputs,[],1,false);
       
      //DB::statement(DB::raw("update `package` set failure_notes = delivery_notes WHERE status_id =9 AND id ='$id'"));
      
      //After saving expanded detail, then return the expanded detail back to client for Refresh display
      //$row= DB::table('package AS p')->where('p.branch_id',$branch_id)->where('p.id',$id)->selectRaw('p.id,p.delivery_id, p.qr_code AS barcode, p.sender_id,p.sender_name,p.sender_phone, p.package_name,p.dim_x,p.dim_y,p.dim_h,p.delivery_type, p.zone_code,p.zone_name,p.receiver_phone,p.receiver_address, p.cod, 0 AS cod_fee_percent, p.cod_fee, p.base_fee, p.delivery_fee, p.driver_adjust_amount,p.sender_adjust_amount,p.forwarding_cost,p.price,p.actual_kg,p.billed_kg,p.df_payer,p.agent_notes,p.delivery_notes as remarks,p.sender_total, p.driver_total, p.status_id, (SELECT name FROM driver WHERE id = p.driver_id LIMIT 1) AS driver_name,p.dim_x,p.dim_y,p.dim_h')->take(1)->first();
      $row = self::getDetails($id,$ss);
      return DV::depends($id,['details'=>$row],'Failed to update pacakge');
    }

    function getPackageReceiverInfo($id=null){
      $package_id = $id?$id:$this->id;
      return DB::table('package AS p')->where('p.id',$package_id)->selectRaw("p.id, formatTime(p.delivery_time) AS delivery_time, p.sender_id, p.delivery_type,IFNULL(p.billed_kg,0) AS billed_kg, p.receiver_name, p.receiver_phone, p.zone_code,p.zone_name,p.base_fee,p.delivery_fee, p.billed_kg,s.name AS sender_name, s.phone_number AS sender_phone, (SELECT name FROM package_statuses AS ps WHERE ps.id =p.status_id LIMIT 1) AS status")->join('sender as s','s.id','=','p.sender_id')->take(1)->get()->first();
    }

    //getDeliveryPrice|getDeliveryPriceInfo|getFee|getServiceFee 
    function getDeliveryPriceInfo_api($arr=[],$ss=null){
        $ss =$ss?$ss:$this->userInfo;  
        $branch_id = $ss->branch_id;
        $d = (object)$arr;
        $sender_id = isset($d->sender_id)?$d->sender_id:null;
        $item_type =isset( $d->item_type)? $d->item_type:null;
        // $zone_code = isset($d->zone_code)?$d->zone_code:null;
        $billed_kg = isset($d->billed_kg)?$d->billed_kg:0;
        // $cod = isset($d->cod)?$d->cod:0;
        $d_res = $this->getDeliveryPriceInfo($branch_id,$sender_id,$delivery_type,$zone_code,$billed_kg,$cod);
        return DV::depends( $d_res->status ==='OK', $d_res, $d_res->error_message);
    }

    function updateReceiverInfo($arr =[], $id=null,$ss=null){
      $package_id= $id?$id:$this->id;
      $ss =$ss?$ss:$this->userInfo;  
      $branch_id = $ss->branch_id;
      $d = (object)$arr;

      if(!$package_id) $package_id = isset($d->package_id)?$d->package_id:0;
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

      return DV::success();
    }

    function createDelivery($arr,$ss=null){
       $ss = $ss?$ss:$this->userInfo;
       $branch_id = $ss->branch_id;
       $v_rule = [
          'sender_code'=>'1|string|1-35|exists=`sender`.code',
          'driver_code'=>'1|string|1-35|exists=`driver`.code',
          'zone_code'=>'1|string|1-35|exists=`zones`.zone_code|text=Destination Zone code cannot be empty',
          'receiver_phone'=>'1|phone',
          'delivery_type'=>'0|choice|Normal,Fast|default=Normal',
          'delivery_notes'=>'0|string|0-350',
          'receiver_address'=>'0|string|0-350',
          'destination_map_location'=>'0|string|0-800',
          'depart_time'=>'0|string|0-35',
          'packages'=>'1|array'

       ];
       $res = validateObject($arr,$v_rule,false,[],$ss->lang,false,null);
       if($res->error) return DV::error($res->error);
       $inputs =$res->values;
       $data = (object)$inputs;

       $driver_id = null; 
       $driver = $this->getDriverInfoByCode($ss,$data->driver_code);
       if ($driver) $driver_id = $driver->driver_id;

       $sender = $this->getSenderInfoByCode($ss,$data->sender_code);
 
       if (!$sender) return DV::error('Sender or Merchant information is not valid');
        
        $data->depart_time = getNowTime();
        if(!(bool)strtotime($data->depart_time)) $data->depart_time = date('Y-m-d');
        
        $order_id = null;
        $def_status ='pending'; // status_name "Pending"
        
        $order_code = isset($driver->order_code)?$driver->order_code:null;
        $order_id = isset($order_id)?$order_id:0;
        $m_order = null;
        $def_delivery_type =null;
        if ($order_id > 0)
           $m_order = DB::table('order')->selectRaw('code,id,request_vehicle_type, delivery_type')->where('id',$order_id)->take(1)->get()->first();
        else
           $m_order = DB::table('order')->selectRaw('code,id,request_vehicle_type, delivery_type')->where('code',$order_code)->take(1)->get()->first();   
        if($m_order){
          $order_id = $m_order->id;
          $order_code = $m_order->code;
          $def_delivery_type = $m_order->delivery_type;
          //$vehicle_type = $m_order->request_vehicle_type;
        }
         
        if (!$data->delivery_type) $data->delivery_type = $def_delivery_type;
        
        $inputs['depart_time'] = getNowTime();
        $inputs['sender_id'] = $sender->id;
        $inputs['order_id'] = $order_id;
        $inputs['driver_id'] = $driver_id;
        $inputs['destination_zone_code'] = $data->zone_code;
        $inputs['status'] = $def_status;
        $inputs['package_count'] = 0;
        $inputs['delivered_count'] = 0;
 
        $new_id = saveData($ss,'delivery',['id'=>null],$inputs,[],1,false);
 
        //$c = {'collect_pmt','df_payer_type','dimemsion','billed_kg','cubic_meter-size','delivery_fee','price','qr_code'} 
        if($new_id > 0) {
            $items = $data->packages;
            $i= 0;
            $c = null;

            do{
               if(!isset($items[$i])) break;
               $c = (object)$items[$i];
                if (!isset($c->package_name)) $c->package_name =$data->receiver_phone;
                if (!isset($c->product_type)) $c->product_type =null;
                if (!isset($c->dimension)) $c->dimension =null;
                if (!isset($c->billed_kg)) $c->billed_kg =0;
                if (!isset($c->price)) $c->price =0;
                if (!isset($c->qr_code)) $c->qr_code =null;
 
                if (!isset($c->df_payer_type)) $c->df_payer_type ='merchant';
                if (!isset($c->delivery_fee)) $c->delivery_fee =0;
                if (!isset($c->cubic_meter_size)) $c->cubic_meter_size =0;
                if (!isset($c->cod)) $c->cod =0;
 
                if(!is_numeric($c->billed_kg)) $c->billed_kg =0;
                $def_status ='pending';
                $zone = $this->getZoneInfo($ss->$branch_id,$c->zone_code);
                if (!$zone) $zone = (object)array('zone_name'=>null,'zone_code'=>null,'country_id'=>null,'city_id'=>null,'district_id'=>null,'commune_id'=>null); 
                
                $nowTime = getNowTime();
                DB::table('package')->insert([
                    'branch_id'=>$branch_id,
                    'delivery_id'=>$new_id,
                    'dimension'=>$c->dimension,
                    'billed_kg'=>$c->billed_kg,
                    'price'=>$c->price,
                    'qr_code'=>'0',
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
                    'create_user'=>$ss->full_name,
                    'create_uid'=>$ss->user_id,
                    'create_date'=>$nowTime,
                    'update_user'=>$ss->full_name,
                    'update_uid'=>$ss->user_id,
                    'update_date'=>$nowTime
                ]);
                self::setBarcode(DB::getPdo()->lastInsertId()); 
               $i++;
            }while($c);
             
             $tracking_number = $this->getTrackingNumber($ss,$new_id);
            //begin:: update delviery.package_count, delviered_count
             $cnt = $this->getPackageCountByStatus($ss,$new_id,null);
             $delivered_status_id =8;
             $delivered_cnt = $this->getPackageCountByStatus($ss,$new_id,$delivered_status_id);
             DB::table('delivery')->where('branch_id',$branch_id)->where('id',$new_id)->update([
                 'delivered_count'=>$delivered_cnt,
                 'package_count'=>$cnt,
                 'tracking_number'=>$tracking_number
             ]);
           //end:: update delviery.package_count, delviered_count
        }
        return DV::depends($new_id,['delivery_id'=>$new_id],'Failed to create delivery trip');
     }
 
     //return random nummber at a specified range ($min,$max)
    function getRandomNumbers($min, $max, $total) {
        $temp_arr = array();
        while(sizeof($temp_arr) < $total) $temp_arr[rand($min, $max)] = true;
        return $temp_arr;
    }
 
     
    function getSenderBasePrice($uss,$sender_id){
      $branch_id = Sanitizer::sanitize($uss->branch_id);
      $today = date('Y-m-d');
      $more_wheres = "( (DATE(l.start_date) <='".$today."' AND DATE(l.end_date) >='".$today."') OR IFNULL(l.neverExpires,0) =0) ";
      $rows = DB::table('sender_base_price AS l')->where('branch_id',$branch_id)->where('sender_id',$sender_id)->whereRaw($more_wheres)->selectRaw('IFNULL(l.price,0) AS price')->take(1)->get();
      foreach($rows as $row) return $row->price; 
      return 0;
    }

    function getZoneInfo($uss,$zone_code){
        $branch_id = $uss->branch_id;
        $rows = DB::table('zones AS z')->where('z.branch_id',$branch_id)->where('zone_code',$zone_code)->selectRaw('z.zone_code,z.zone_name,z.country_id,z.city_id,z.district_id,z.commune_id')->take(1)->get();
        foreach($rows as $row) return $row;
        return null; 
    }

    //create UNIQUE 10digit QR code. $uss is user_session_info
    function createQRCode($package_id=null){
      $unique_string = substr(uniqid(), 0, 5) . substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 5);
      if($package_id>0) substr($unique_string,0,10-strlen($package_id.'')).$package_id;
      return strtoupper($unique_string);
    }

     //If no error, return object {'barcode'}, otherwise, returns object {status='Error','error_message'=>'sdfdsgdg'}
     static function setBarcode($package_id,$table_name="package",$col_name="qr_code"){
        $unique_string = substr(uniqid(), 0, 5) . substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 5);
        $barcode = strtoupper(substr($unique_string,0,10-strlen($package_id.'')).$package_id);
        DB::table($table_name)->where('id',$package_id)->update([$col_name=>$barcode]);
        return (object)['barcode'=>$barcode];
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
      function changeDeliveryDriver($arr,$id=null,$ss=null) {
        $ss = $ss?$ss:$this->userInfo;
        $package_id =$id?$id:$this->id;
        $d = (object)$arr;
        //$allowable_statuses = ['pending','delayed','failed','delivered','otw','pd']; 
        $branch_id = Sanitizer::sanitize($ss->branch_id);
        $driver_id = $d->driver_id;
        $delivery_id = isset($d->delivery_id)?$d->delivery_id:0;
        if(!$package_id) $package_id = isset($d->package_id)?$d->package_id:0;
        
        $cols ='id,receiver_phone,qr_code as barcode,driver_total,sender_total,cod,df_payer,driver_id,(SELECT `name` from driver WHERE id =driver_id LIMIT 1) AS old_driver_name,status_id';
        $package = self::getPackageProps($branch_id,$package_id,$cols,'id');
        if(!$package) return DV::error('package ID is not valid');
        $driver = DB::table('driver as d')->where('id',$driver_id)->selectRaw('id,name,phone_number');
        if(!$driver) return DV::error('New driver ID does not exist');

        if($delivery_id <=0) {
          $delivery_id = DB::table('package AS p')->where('branch_id',$branch_id)->where('id',$package_id)->take(1)->value('delivery_id');
          
        }
        //Failed to find delivery_id for this package
        if($delivery_id <=0 || empty($delivery_id)) return "Delivery trip identity is not valid";  

        //begin:: check if delivery status
            //$rows = DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->selectRaw("status_id")->take(1)->get();
            //$status_id = null;
            //foreach($rows as $row) $status_id = $row->status_id; //status_id
            
            // if ($status_id == 8) {
            //   if ($driver_id <=0 || empty($driver_id)) {
            //       return "Cannot unassign driver when delviery is already delivered!";
            //   }
            // }
       //end:: Check delivery status

        // if(!in_array($status, $allowable_statuses)) {
        //   return "Cannot change driver because the delviery status prevents this change!";
        // } 
        DB::table('delivery')->where('id',$delivery_id)->where('branch_id',$branch_id)->update(['driver_id'=>$driver_id]);
        DB::table('package')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->update(['driver_id'=>$driver_id]);
        
        $action ='change_driver_delivery';
        $des =$ss->full_name. ' បានប្តូរអ្នកដឹកកញ្ចប់លេខ '.$package->barcode.' (receiver phone: '.$package->receiver_phone.') ពីអ្នកដឹក '.$package->old_driver_name.' ទៅ '.$driver->name;
        Tracker::log((object)['user_class'=>$ss->user_class,'action_name'=>$action,'description'=>$des,'user_comment'=>''],$ss);
        return null;
      }

      //assignDeliveryDriver() is to assign driver for a fleet or Delivery Trip
      //by assigning a driver to a fleet => then the fleet status is changed to "Delivery Started"
      //so assiging driver also means to set Fleet's status to "Delivery Started" 
      function assignDeliveryDriver($arr,$id = null, $ss =null){
        $ss = $ss?$ss:$this->userInfo;
        $package_id = $id?$id:$this->id;
        $d = (object)$arr;
        //$allowable_statuses = ['pending','delayed','failed','delivered','otw','pd']; 
        $branch_id = $ss->branch_id;
        $driver_id = $d->driver_id;
        $delivery_id = isset($d->delivery_id)?$d->delivery_id:0;
        if(!$package_id) $package_id = isset($d->package_id)?$d->package_id:0;
        $depart_time = getNowTime();
        
        $cols ='id,receiver_phone,qr_code as barcode,driver_total,sender_total,cod,df_payer,driver_id,(SELECT `name` from driver WHERE id =driver_id LIMIT 1) AS old_driver_name,status_id';
        $package = self::getPackageProps($branch_id,$package_id,$cols,'id');
        if(!$package) return DV::error('package ID is not valid');
        
        $driver = DB::table('driver as d')->where('id',$driver_id)->selectRaw('id,name,phone_number');
        $unassign_case =0;
        if(!$driver) $unassign_case =1;

        if($delivery_id <=0) {
          $delivery_id  = DB::table('package AS p')->where('branch_id',$branch_id)->where('id',$package_id)->take(1)->value('delivery_id');
        }
        //Failed to find delivery_id for this package
        if($delivery_id <=0 || empty($delivery_id)) return "Delivery trip identity is not valid";  

        //begin:: check if delivery status
            //$status_id  = DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->take(1)->value("status_id"); 
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
        
        DB::table('package')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->update(['driver_id'=>null]);
        if (!$driver_id || $driver_id<=0) //$status_id =5; //Driver = To be Assigned and Delivery and pacakge's Status = 5 (Arrive at Warehouse) 
           DB::table('delivery')->where('id',$delivery_id)->where('branch_id',$branch_id)->update(array('driver_id'=>null,'status_id'=>$status_id));
        else{
          $status_id =6; //Delivery Started
          DB::table('delivery')->where('id',$delivery_id)->where('branch_id',$branch_id)->update(array('driver_id'=>$driver_id,'status_id',$status_id,'depart_time'=>$depart_time));
          DB::table('package')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->update(['driver_id'=>$driver_id,'delivery_time'=>$depart_time]);
        }
        
        $action =null;
        if($unassign_case){
          $action ='unassign_driver_delivery';
          $des =$ss->full_name. ' បានដកកញ្ចប់លេខ '.$package->barcode.' (receiver phone: '.$package->receiver_phone.') ពីអ្នកដឹក'.$package->old_driver_name;
        }else if($package->driver_id > 0 && $driver->id > 0 && $package->driver_id != $driver->id){
          $action ='change_driver_delivery';
          $des =$ss->full_name. ' បានប្តូរអ្នកដឹកកញ្ចប់លេខ '.$package->barcode.' (receiver phone: '.$package->receiver_phone.') ពីអ្នកដឹក '.$package->old_driver_name.' ទៅ '.$driver->name;
        }else{
          $action ='assign_driver_delivery';
          $des =$ss->full_name. ' បានដាក់កញ្ចប់លេខ '.$package->barcode.' (receiver phone: '.$package->receiver_phone.') អោយអ្នកដឹក '.$driver->name;
        }
        Tracker::log((object)['user_class'=>$ss->user_class,'action_name'=>$action,'description'=>$des,'user_comment'=>''],$ss);
 
        return null;
      }

      // function getOutstandingPackageList($filter=[],$ss=null) {  
      //   $ss = $ss ?? $this->userInfo;
      //   $data = (object)$filter;  
      //   $branch_id =$ss->branch_id;
      //   $fresh = isset($data->fresh)? $data->fresh:0;
      //   $data->warehouse_id = isset($data->warehouse_id)?Sanitizer::sanitize($data->warehouse_id):0;
      //   $start_date = isset($data->start_date)?$data->start_date:'';
      //   $end_date = isset($data->end_date)? $data->end_date:'';
      //   $data->delivery_type = isset($data->delivery_type)?$data->delivery_type:null;
      //   if($data->delivery_type ==0) $data->delivery_type =null;
      //   $data->zone_code = Sanitizer::sanitize(isset($data->zone_code)? $data->zone_code:null);
      //   $data->driver_id = Sanitizer::sanitize(isset($data->driver_id)? $data->driver_id : null);
      //   $data->sender_id = Sanitizer::sanitize(isset($data->sender_id)? $data->sender_id : null);
      //   $data->status_id = isset($data->status_id)?Sanitizer::sanitize($data->status_id):-1;
      //   if(!isset($data->status_id)) $data->status_id =-1;
      //   $search_value =isset($data->search_value)?escape_like_str(Sanitizer::sanitize($data->search_value)):null;
         
      //   $cache_key = 'pglist_';
      //   foreach($data as $key => $val) $cache_key .= $val;
      //   $cache_key = str_replace(['/','-','?','@','|'],'',$cache_key);
      //   // $fresh =1 then user just have Deleted on package in Package Trail, so we do not use Cached data to return
      //   if(!$fresh){
      //     $cache_data = Cache::get($cache_key); 
      //     if ($cache_data) {
      //       //Log::info('Cached pglist. key = '.$cache_key); 
      //       return $cache_data;
      //     }
      //   }
       
      //     //$succeeded_status ="delivered"; /* outstanding delvieries => select all packages that has status different from "delivered" */
      //     $str_driver = null;
      //     $str_warehouse =null;
      //     $str_zone ='';
      //     $str_sender =null;
      //     $str_status = null; //status_id = 4 (Picked and Booked), status_id = 5 (Arrived at warehouse) 
      //     $str_delivery_type = null;
      //     $str_search = null;
      //     if ($search_value) { 
      //       $str_search = " AND (p.qr_code ='$search_value' OR p.receiver_phone LIKE '%$search_value%'  OR s.phone_number LIKE '%".$search_value."%' OR s.name LIKE '%".$search_value."%' OR p.order_id = (SELECT `id` FROM `order` WHERE code ='".$search_value."' LIMIT 1))";
      //       $more_wheres = " p.status_id > 4 ".$str_search;
      //     }
      //     else{

      //       $start_date = convertDate($start_date);
      //       $end_date = convertDate($end_date);
      //       if ((bool)strtotime($start_date) && (bool)strtotime($end_date)){
      //         $str_dates = "AND (DATE(p.arrival_time) >='$start_date' AND DATE(p.arrival_time) <='$end_date')";
      //      }else if ((bool)strtotime($start_date))
      //          $str_dates = "AND (DATE(p.arrival_time) >='$start_date' AND DATE(p.arrival_time) <='$start_date')";
      //      else if ((bool)strtotime($end_date))
      //          $str_dates = "AND (DATE(p.arrival_time) >='$end_date' AND DATE(p.arrival_time) <='$end_date')";
      //      else
      //          $str_dates =null;
      //       if ($data->status_id >0) $str_status = ' AND p.status_id ='.$data->status_id;
   
      //       if ($data->delivery_type) $str_delivery_type =" AND p.delivery_type ='".$data->delivery_type."' ";
      //       if($data->warehouse_id >0) $str_warehouse =" AND p.warehouse_id =$data->warehouse_id ";
      //       if ($data->driver_id > 0) $str_driver = " AND p.driver_id =$data->driver_id ";
      //       if (!$data->driver_id || $data->driver_id <=0) $str_driver = null; // " AND IFNULL(p.driver_id,0) = 0";
      //       if ($data->sender_id > 0) $str_sender = " AND p.sender_id =$data->sender_id ";
      //       if ($data->zone_code) $str_zone = " AND p.zone_code ='$data->zone_code' ";
            
      //       $more_wheres = " p.status_id > 4 AND p.outstanding =1 ".$str_warehouse.$str_delivery_type.$str_driver.$str_zone.$str_sender.$str_dates.$str_status;
      //     }
      //     $str_since = 'AND DATE(p.delivery_date) >=\''.Carbon::now()->addDay(-60).'\' AND p.branch_id ='.$branch_id>0? $branch_id:1;
      //     $select_cols ="p.id As package_id,p.delivery_id, p.order_id, DATE_FORMAT(p.pickup_time,'%d %b %Y') AS pickup_time,p.zone_code, p.delivery_type, p.qr_code AS barcode,p.delivery_notes,p.failure_notes, CASE (p.status_id =9 OR p.status_id=11) WHEN 1 THEN p.failure_notes ELSE delivery_notes END AS remarks,p.delivery_condition, 
      //      DATE_FORMAT(p.arrival_time,'%d %b %Y') AS `arrival_time`, s.sender_type_id, st.name AS sender_type, (select x.name from driver as x WHERE x.id = p.driver_id LIMIT 1) AS driver_name, p.driver_id,
      //     p.status_id,(SELECT ds.name FROM package_statuses AS ds WHERE ds.id = p.status_id LIMIT 1) AS status, p.sender_id, s.phone_number AS sender_phone, p.receiver_id, p.receiver_address, p.receiver_name, p.receiver_phone,p.zone_name, s.name AS sender_name, IFNULL(p.driver_total,0) AS driver_total, IFNULL(p.sender_total,0) AS sender_total";
      //     $rows = DB::table('package AS p')->join('sender AS s','s.id','=','p.sender_id')->join('sender_type AS st','st.id','=','s.sender_type_id')->selectRaw($select_cols)->whereRaw($str_since)->whereRaw($more_wheres)->orderByRaw('p.create_date DESC, p.delivery_id DESC')->get();
      //     if ($cache_key) Cache::put($cache_key,$rows,15);
      //     return $rows; 
      //   }
  
      //    //GetOutStandingPackageList_print() returns data for pdf printing only
      //    function getOutstandingPackageList_print($arr=[],$ss=null) {
      //     $ss = $ss ?? $this->userInfo;   
      //     $data = (object)$arr;   
      //     $branch_id = Sanitizer::sanitize($ss->branch_id);
      //     $data->warehouse_id = isset($data->warehouse_id)?Sanitizer::sanitize($data->warehouse_id):0;
      //     $start_date = isset($data->start_date)?$data->start_date:null;
      //     $end_date = isset($data->end_date)? $data->end_date:null;
      //     $data->delivery_type = isset($data->delivery_type)?$data->delivery_type:null;
      //     if($data->delivery_type ==0) $data->delivery_type =null;
      //     $data->zone_code = Sanitizer::sanitize($data->zone_code);
      //     $data->driver_id = Sanitizer::sanitize($data->driver_id);
      //     $data->sender_id = Sanitizer::sanitize($data->sender_id);
      //     $data->status_id = Sanitizer::sanitize($data->status_id);
      //     if(empty($data->status_id)) $data->status_id =-1;
      //     $data->search_value =isset($data->search_value)?$data->search_value:null;
      //     $data->search_value = escape_like_str(Sanitizer::sanitize(trim($data->search_value)));
  
      //     // $is_default_view = true;
      //     // if ((bool)strtotime($start_date)) 
      //     // {
      //     //    $is_default_view = false;
      //     //    if (!(bool)strtotime($end_date)) $end_date = $start_date;
      //     // }

      //     // $is_default_view = false;
      //     // if (!(bool)strtotime($start_date)) 
      //     //    $is_default_view = true;
      //     // else if (!(bool)strtotime($end_date)){
      //     //    $end_date = $start_date;    
      //     // }
 
      //      //$succeeded_status ="delivered"; /* outstanding delvieries => select all packages that has status different from "delivered" */
      //       $str_driver = null;
      //       $str_warehouse =null;
      //       $str_zone ='';
      //       $str_dates =null;
      //       $str_sender =null;
      //       $str_status = null; //status_id = 4 (Picked and Booked), status_id = 5 (Arrived at warehouse) 
      //       $str_delivery_type = null;
      //       $str_search = null;
      //       if (!empty($data->search_value)) { 
      //         $str_search = " AND (p.qr_code ='".$data->search_value."') OR p.receiver_phone ='".$data->search_value."'  OR s.phone_number ='".$data->search_value."' OR s.name ='%".$data->search_value."%' OR p.order_id IN (SELECT `id` FROM `order` WHERE code ='".$data->search_value."')";
      //         $more_wheres = " p.status_id > 4 AND p.status_id NOT IN (8,11) ".$str_search;
      //       }
      //       else{

      //         $start_date = convertDate($start_date);
      //         $end_date = convertDate($end_date);
      //        if ((bool)strtotime($start_date) && (bool)strtotime($end_date)){
      //           $str_dates = "AND (DATE(p.arrival_time) >='$start_date' AND DATE(p.arrival_time) <='$end_date')";
      //        }else if ((bool)strtotime($start_date))
      //            $str_dates = "AND (DATE(p.arrival_time) >='$start_date' AND DATE(p.arrival_time) <='$start_date')";
      //        else if ((bool)strtotime($end_date))
      //            $str_dates = "AND (DATE(p.arrival_time) >='$end_date' AND DATE(p.arrival_time) <='$end_date')";
      //        else
      //            $str_dates =null;
                
      //        if ($data->status_id >0) $str_status = " AND p.status_id =$data->status_id";
    
      //        if ($data->delivery_type) $str_delivery_type =" AND p.delivery_type ='".$data->delivery_type."' ";
      //        if($data->warehouse_id >0) $str_warehouse =" AND p.warehouse_id =$data->warehouse_id ";
      //        if ($data->driver_id > 0) $str_driver = " AND p.driver_id =$data->driver_id ";
      //        if (!$data->driver_id || $data->driver_id <=0) $str_driver = null; // " AND IFNULL(p.driver_id,0) = 0";
      //        if ($data->sender_id > 0) $str_sender = " AND p.sender_id =$data->sender_id ";
      //        if ($data->zone_code) $str_zone = " AND p.zone_code ='$data->zone_code' ";
             
      //         $more_wheres = " p.status_id > 4 ".$str_warehouse.$str_delivery_type.$str_driver.$str_zone.$str_sender.$str_dates.$str_status;
      //       }          
           
      //       $select_cols ="'$' AS cur, p.qr_code AS barcode,DATE_FORMAT(p.create_date,'%d %b %Y') AS booking_date, s.name AS sender_name, s.phone_number AS sender_phone,p.zone_name,p.receiver_phone, 
      //       (select x.name from driver as x WHERE x.id = p.driver_id LIMIT 1) AS driver_name, p.delivery_type,
      //       (SELECT ds.name FROM package_statuses AS ds WHERE ds.id = p.status_id LIMIT 1) AS status, IFNULL(p.driver_total,0) AS driver_total";
  
      //       return DB::table('package AS p')->join('sender AS s','s.id','=','p.sender_id')->join('sender_type AS st','st.id','=','s.sender_type_id')->selectRaw($select_cols)->where('p.branch_id',$branch_id)->where('p.outstanding',1)->whereRaw($more_wheres)->orderByRaw('p.create_date DESC, p.delivery_id DESC')->get();
             
      //      }
        
      //    //get count packages per trip based on multiple statuses   
      //    function getPackageCountByStatuses($uss,$delivery_id,$status_ids=-1){
      //      $branch_id = $uss->branch_id;
      //      $more_wheres =" p.status_id IN (".$status_ids.")";
      //      DB::table('package AS p')->where('branch_id',$branch_id)->where('delivery_id',$delivery_id)->whereRaw($more_wheres)->selectRaw("COUNT(p.id) AS cnt")->get();
      //      foreach($rows as $row) return is_numeric($row->cnt)?$row->cnt:0;
      //      return 0;
      //     } 

      //     //updateDeliveryStatus() returns trip status id (3) only in case the trip is DONE, other returns NULL  
      //    function updateDeliveryStatus($uss,$delivery_id){
      //          $branch_id = $uss->branch_id;
      //          if ($delivery_id <=0 || $delivery_id) return null;
      //          $delivered_status_id =8; //For package status only, Not delivery status
      //          $failed_status_id =9;
      //          $cnt = $this->getPackageCountByStatus($uss,$delivery_id,-1); //count all packages
      //          $delivered_cnt = $this->getPackageCountByStatus($uss,$delivery_id,$delivered_status_id);
      //          $failed_and_returned_count = $this->getPackageCountByStatuses($uss,$delivery_id,'9,11');
      //          $trip_status_id =null; //The trip is 2 = "On Delivery" (In process ofe delivery for each package)

      //          if ($cnt <=  $delivered_cnt + $failed_and_returned_count) $trip_status_id =3; //Trip Finished AS "Done"
      //          DB::table('delivery')->where('id',$delivery_id)->where('branch_id',$branch_id)->update(array(
      //            'delivered_count'=>$delivered_cnt,
      //            'failed_count'=>$failed_and_returned_count,
      //            'package_count'=>$cnt
      //          ));
      //          //If all packages are delviered => then also update trip's status to 3 ="Done" automatically
      //          if($trip_status_id ==3){
      //             DB::table('delivery')->where('id',$delivery_id)->where('branch_id',$branch_id)->update(array(
      //               'status_id'=>$trip_status_id
      //             ));
      //          }
      //          return $trip_status_id;
      //    }

      
      //    function getDeliveryDetails($delivery_id){
      //     $delivery_id =$delivery_id?$delivery_id:0;
      //     //delivery_type = {Normal,Fast}
      //     $rows= DB::select(DB::raw('SELECT d.id as delivery_id, d.delivery_type, s.name as sender_name, formatTime(d.depart_time) AS depart_time, formatTime(d.arrival_time) AS arrival_time, d.package_count, d.sender_id, s.code AS sender_code, 
      //     (SELECT `name` FROM `driver` WHERE id = IFNULL(p.driver_id,0) LIMIT 1) AS driver_name, p.driver_id,
      //     (SELECT `code` FROM `driver` WHERE id = IFNULL(p.driver_id,0) LIMIT 1) AS driver_code,
      //     p.zone_code,destination_map_location,d.delivery_notes, p.receiver_phone,p.receiver_address,p.receiver_name, d.taxi_fee
      //     FROM `delivery` AS d INNER JOIN `sender` AS s ON s.id = d.sender_id WHERE d.id ='.$delivery_id.' LIMIT 1'));
          
      //     $data = (object)['deliveryInfo'=>null,'packages'=>[]];
      //     foreach($rows as $row) {
      //         $data->deliveryInfo = $row;
      //         $data->packages = DB::select(DB::raw("SELECT p.id, p.qr_code, p.package_name,p.dimension,p.billed_kg, p.price,p.delivery_fee, IFNULL(p.cod,0) AS cod, p.dimension_x, dimension_y, p.dimension_z,p.cubic_meter_size FROM `package` AS p WHERE p.branch_id ='".$branch_id."' AND p.delivery_id =".$delivery_id)); 
      //         return ($data);
      //     }
      //     return ($data);
      // }

    //   function updateDelivery($arr = [], $ss = null){
    //     $ss = $ss ?? $this->userInfo;
    //     $d = (object)$arr;
    //     $delivery_id = isset($d->delivery_id)?$d->delivery_id:0;  
    //     $branch_id = $ss->branch_id;
    //       $result = (object)[];
    //       if(!isset($d->sender_code)) $d->sender_code =null;
    //       if (!$delivery_id) {
    //          return DV::error('Trip ID is not valid or empty');
    //       }
   
    //     if (empty($d->zone_code)) return DV::error('Zone code is not correct'); 
         
    //      $driver_id = null; 
    //      $d = $this->getDriverInfoByCode($ss,$d->driver_code);
    //      if ($d != null) $driver_id = $d->driver_id;
    //      $sender = $this->getSenderInfoByCode($ss,$d->sender_code);
   
    //      if ($sender==null) return DV::error('Sender or Merchant information is not valid'); 
    //      if (!isset($d->receiver_phone)) return DV::error('Receiver phone number cannot be empty');
    //      if (!isset($d->zone_code)) return DV::error('Destination Zone code cannot be empty'); 
   
    //       $d->depart_time = date('Y-m-d',strtotime(isset($d->depart_time)?$d->depart_time:getNowTime()));
    //       if(!(bool)strtotime($d->depart_time)) $d->depart_time = getNowTime();
    //       $order_id = null;
    //       $def_status ='IP';
    //       DB::table('delivery')->where('branch_id',$branch_id)->where('id',$d->delivery_id)->update(array(
    //           'depart_time'=>$d->depart_time,
    //           'delivery_type'=>$d->delivery_type,
    //           'sender_id'=>$sender->id,
    //           'order_id'=>$order_id,
    //           'driver_id'=>$driver_id,
    //           'destination_zone_code'=>$d->zone_code,
    //           'receiver_address'=>$d->receiver_address,
    //           'destination_map_location'=>$d->destination_map_location,
    //           'receiver_phone'=>$d->receiver_phone,
    //           'delivery_notes'=>$d->delivery_notes,
    //           'status'=>$def_status, //{IP,'Delivered','TBD','Partially Delivered','Returned'}
    //           'package_count'=>0,
    //           'delivered_count'=>0,
    //           'create_user'=>$ss->login_name,
    //           'create_date'=>getNowTime()
   
    //       ));
           
    //       //$c = {'collect_pmt','df_payer_type','dimemsion','billed_kg','cubic_meter-size','delivery_fee','price','qr_code'} 
    //       if($delivery_id > 0) {
    //           $i= 0;
    //           $c = null;
    //           do{
    //              if(!isset($d->packages[$i])) break;
    //              $c = (object)$d->packages[$i];
   
    //              if (!isset($c->package_name)) $c->package_name =$d->receiver_phone;
    //               if (!isset($c->product_type)) $c->product_type =null;
    //               if (!isset($c->dimension)) $c->dimension =null;
    //               if (!isset($c->billed_kg)) $c->billed_kg =0;
    //               if (!isset($c->price)) $c->price =0;
    //               if (!isset($c->qr_code)) $c->qr_code =null;
   
    //               if (!isset($c->df_payer_type)) $c->df_payer_type ='merchant';
    //               if (!isset($c->delivery_fee)) $c->delivery_fee =0;
    //               if (!isset($c->cubic_meter_size)) $c->cubic_meter_size =0;
    //               if (!isset($c->collect_pmt)) $c->collect_pmt =0;
   
    //               if(!is_numeric($c->billed_kg)) $c->billed_kg =0;
    //               $def_status ='IP';
  
    //               $qr_code_exists = DB::table('package')->where('branch_id',$branch_id)->where('qr_code',$c->qr_code)->take(1)->exists();  
    //               if ($c->qr_code ==null || !$qr_code_exists) {
  
                     
    //                   DB::table('package')->insert(array(
    //                       'branch_id'=>$branch_id,
    //                       'delivery_id'=>$delivery_id,
    //                       'dimension'=>$c->dimension,
    //                       'billed_kg'=>$c->billed_kg,
    //                       'price'=>$c->price,
    //                       'qr_code'=>"0",
    //                       'product_type'=>$c->product_type,
    //                       //'df_payer_type'=>$c->df_payer_type,
    //                       'delivery_fee'=>$c->delivery_fee,
    //                       'cubic_meter_size'=>$c->cubic_meter_size,
    //                       'status'=>$def_status,
    //                       //'receiver_phone'=>$data->receiver_phone,
    //                       //'receiver_address'=>$data->receiver_address,
    //                       'cod'=>$c->cod,
    //                       'create_user'=>$ss->login_name,
    //                       'create_date'=>getNowTime()
    //                   ));
    //                   self::setBarcode(DB::getPdo()->lastInsertId());  
    //               } else {
    //                   DB::table('package')->where('branch_id',$branch_id)->where('qr_code',$c->qr_code)->where('delivery_id',$delivery_id)->update(array(
    //                       'dimension'=>$c->dimension,
    //                       'billed_kg'=>$c->billed_kg,
    //                       'price'=>$c->price,
    //                       'product_type'=>$c->product_type,
    //                       //'df_payer_type'=>$c->df_payer_type,
    //                       'delivery_fee'=>$c->delivery_fee,
    //                       'cubic_meter_size'=>$c->cubic_meter_size,
    //                       'status'=>$def_status,
    //                       //'receiver_phone'=>$data->receiver_phone,
    //                       //'receiver_address'=>$data->receiver_address,
    //                       'cod'=>$c->cod,
    //                       'update_user'=>$ss->login_name,
    //                       'update_date'=>getNowTime()
    //                   ));    
    //               }
  
    //               $i++;
    //           }while($c);
   
    //           //begin:: update delviery.package_count, delviered_count
    //            $cnt = $this->getPackageCountByStatus($ss,$delivery_id,null);
    //            $delivered_status_id =8;
    //            $failed_status_id =9;
    //            $delivered_cnt = $this->getPackageCountByStatus($ss,$delivery_id,$delivered_status_id);
    //            $failed_cnt = $this->getPackageCountByStatus($ss,$delivery_id,$failed_status_id);
    //            DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->update(array(
    //                'delivered_count'=>$delivered_cnt,
    //                'failed_count'=>$failed_cnt,
    //                'package_count'=>$cnt
    //            ));
    //          //end:: update delviery.package_count, delviered_count
    //       }
    //       return DV::depends(1,['delivery_id'=>$delivery_id]);
    //  }
 
      //return COUNT of packages for an Order with status = "Picked and Booked" only 
      //NOTE that Order with status =4 (Picked and Booked) has items or packages stored in table "order_receivers" 
      function countPackagesByOrder($order_id){
          $rows = DB::table('order_receivers AS r')->where('r.order_id',$order_id)->selectRaw("COUNT(r.id) AS cnt")->get();
          foreach($rows as $row) return $row->cnt;
          return 0;
      } 
     
      function getPackageListPerOrder($order_id){
         $cols ="r.id,r.qr_code AS bar_code,r.zone_code,r.zone_name,r.receiver_name,receiver_phone,receiver_address,cod,df_payer,price,base_fee,delivery_fee,cod_fee,status_id,outstanding,sender_total,driver_total";
         return DB::table('order_receivers AS r')->where('r.order_id',$order_id)->selectRaw($cols)->get();
      }

      //Driver App, on Pick and Book screen, user can click on List button and delete some items or all items
      function deleteOrderPakcages($order_id,$bar_code=null){
        $more_where = null;
        if (!$bar_code) $more_where ="1=1";
        else $more_where ="qr_code ='$bar_code'";
        DB::table("order_receivers")->where('order_id',$order_id)->whereRaw($more_where)->delete();
        DB::table("package")->where('order_id',$order_id)->whereRaw($more_where)->delete();
        return DV::success();
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
        $ss = UM::getUserInfoByToken($data);
        if ($ss->status_code !==200) return $ss; //user not authenticated
         
          
          $branch_id = $ss->branch_id;
          $id = $data->delivery_id;
          DB::table('package')->where('branch_id',$branch_id)->where('delivery_id',$id)->delete();
          DB::table('delivery')->where('branch_id',$branch_id)->where('id',$id)->delete();
          DB::table('order')->where('branch_id',$branch_id)->where('id',$id)->update(array('a'));
         return (null);
      }
   
    function getSenderInfoByCode($ss,$sender_code) {
          $exchange_rate = $this->getExchangeRate($ss,$sender_code,'code')->buy_rate; 
          return DB::table('sender AS s')->where('s.code',$sender_code)->selectRaw($exchange_rate." AS exchange_rate,s.name, s.id, s.phone_number, s.address, s.map_location, s.sender_type")->take(1)->get()->first();
    }
   
     public function getSenderInfoByOrderCode($data) {
        $ss = UM::getUserInfoByToken($data);
        if ($ss->status_code !==200) return $ss; //user not authenticated
         

         $branch_id = $ss->branch_id;
          $order_code = $data->order_code;
          $q =DB::table('order')->select('sender_id')->where('code',$order_code)->where('branch_id',$branch_id)->get();
          $sender_id = null;
          foreach($q as $row) $sender_id =$row->sender_id; 
          if ($sender_id ==null) return (null);
             
          $rows = DB::select(DB::raw("SELECT s.name, s.id, s.phone_number, s.address, s.map_location, s.sender_type FROM `sender` AS s WHERE s.branch_id ='".Sanitizer::sanitize($branch_id)."' AND s.id ='".Sanitizer::sanitize($sender_id)."' LIMIT 1"));
          foreach($rows as $row) return $row;
          return null;  
      }
  
      public function getDriverNameByCode($data) {
        $ss = UM::getUserInfoByToken($data);
        if ($ss->status_code !==200) return $ss; //user not authenticated
         

          $branch_id = $ss->branch_id;
          $code = $data->driver_code;
          $rows = DB::select(DB::raw("SELECT d.name FROM `driver` AS d WHERE d.branch_id ='".Sanitizer::sanitize($branch_id)."' AND d.code ='".Sanitizer::sanitize($code)."' LIMIT 1"));
          foreach($rows as $row) return ($row->name);
          return (null);
      }
  
      public function getComboItems_driver($data){
        $ss = UM::getUserInfoByToken($data);
        if ($ss->status_code !==200) return $ss; //user not authenticated
         

          $branch_id = $ss->branch_id;
          $rows = DB::table('driver AS d')->selectRaw('d.id,d.name AS driver_name')->where('branch_id',$branch_id)->get();
          return ($rows);
      }
  
      //various form options data combo items on Package Trail View or "Package List" view
      function getFilterOptions($ss=null) {
          $ss = $ss?$ss:$this->userInfo;
          $branch_id = $ss->branch_id;
          $data = (object)[];

          $deliveryTypes[] = (object)array('name'=>'Normal');
          $deliveryTypes[] = (object)array('name'=>'Fast');

          $data->deliveryTypes =$deliveryTypes; 
          $data->warehouses  = DB::table('warehouses')->selectRaw('id, `name` AS warehouse_name')->where('branch_id',$branch_id)->orderByRaw('name ASC')->get();
          $data->drivers  = DB::table('driver')->selectRaw('id, name AS driver_name, status_code')->where('branch_id',$branch_id)->orderByRaw('name ASC')->get();
          $data->senders  = DB::table('sender AS s')->selectRaw('s.id,s.status_code, CONCAT(s.code,\' | \', s.`name`) AS sender_name')->where('branch_id',$branch_id)->orderByRaw('name ASC')->get();
          $data->zones  = DB::table('zones')->selectRaw("zone_code,CONCAT(zone_code,' | ',zone_name) AS zone_name")->where('branch_id',$branch_id)->get();
          $data->statuses = DB::table('package_statuses AS s')->where('stage','delivery')->selectRaw('s.id,s.name AS status_name')->orderByRaw('s.display_order ASC')->get();
          return ($data);
      }
   
      //Find Driver or Sender (Merchant or store name) or Receiver (Customers) by id, name, phone number 
      function findPersons($arr,$ss=null) {
         $ss = $ss?$ss:$this->userInfo;
         $branch_id = $ss->branch_id;
          
          $d = (object)$arr;
          $role = isset($d->role)?$d->role:null;
          $search_value = isset($d->search_value)?$d->search_value:null;
          //$findBy = $data->findBy;
          $role =strtolower($role);
          $rows = [];
          if (empty($search_value)) return [];
          $search_value =escape_like_str($search_value);
          $str_search = " d.name LIKE '%".$search_value."%' OR d.code ='".$search_value."' OR d.phone_number ='".$search_value."'";
          if($role=='driver'){
            $rows = DB::table('driver AS d')->where('branch_id',$branch_id)->whereRaw($str_search)->selectRaw("id, d.code AS code, d.name AS `name`,'Driver' AS `role`, d.phone_number, d.email")->take(15)->get();
          } else if ($role =='sender') {
            $rows = DB::table('sender AS d')->where('branch_id',$branch_id)->whereRaw($str_search)->selectRaw("id, d.code AS code, d.name AS `name`,'Merchant' AS `role`, d.phone_number, d.email")->take(15)->get();
          } 
          // else if ($role =='receiver') {
          //     $rows = DB::select(DB::raw("SELECT d.code AS code, d.name AS `name` FROM `receiver` as d WHERE d.branch_id ='".$branch_id."' AND (d.name LIKE '%".escape_like_str($search_value)."%' OR d.code ='".$search_value."' OR d.phone_number ='".$search_value."')"));  
          // }
          
          return $rows;
      }
  
      function getPackageStatusInfo($branch_id,$barcode) {
           $rows = DB::table('package AS p')->join('package_statuses AS ps','ps.id','=','p.status_id')->where('p.branch_id',$branch_id)->where('qr_code',$barcode)->selectRaw('p.order_id,p.status_id,ps.name AS status')->take(1)->get();
           foreach($rows as $row) return $row; 
           return null;
      }

      static function track_deleted($package_id){
          // Get the package data based on the provided $package_id
          $package = DB::table('package')->where('id', $package_id)->first();

          if ($package) {
              // Insert the package data into the deleted_package table
              DB::table('deleted_package')->insert((array) $package);

              // Optionally, you can also delete the original record from the package table
              DB::table('package')->where('id', $package_id)->delete();

              // Return a success message or status
              return 'Package copied to deleted_package table.';
          } else {
              // Handle the case where the package with the provided ID doesn't exist
              return 'Package not found.';
          }
      }

      function deleteSpecial($id,$ss){
         $tables = ['package_id'=>['package_tracks','returned_packages','package_attachments','package_updates']];
         $qr_code = DB::table('package')->where('id',$id)->take(1)->value('qr_code');
         foreach($tables as $key=>$tbl_list){
           foreach($tbl_list as $tbl){
                try{
                  DB::table($tbl)->where($key,$id)->delete();
                }catch(\Exception $e){
                  Log::error('Error sanitizing string at method package->deleteSpecial('.$id.') '.": {$e->getMessage()}\r\n{$e->getTraceAsString()}");
                }
            }
          }
         DB::table('order_receivers')->where('qr_code',$qr_code)->delete();
         $x = DB::statement(DB::Raw('DELETE FROM delivery WHERE id NOT IN (select DISTINCT delivery_id FROM package as p WHERE branch_id ='.$ss->branch_id.')'));
         return DV::depends($x,['id'=>$id]);
      }
      //delete package by ID
      function deleteById($id=null,$ss=null){
        $id = $id?$id:$this->id;
        $ss = $ss?$ss:$this->userInfo;

        if(!$id) return DV::error("Failed to identify pacakge by ID");
        $cols = 'p.id,p.branch_id,p.qr_code AS bar_code,p.receiver_phone,p.status_id,p.sender_pmt_status_id, p.driver_pmt_status_id,HEX(p.driver_trx_id) AS driver_trx_id,HEX(p.sender_trx_id) AS sender_trx_id,p.outstanding,delivery_id,p.driver_id,order_id';
        $pInfo = DB::table('package as p')->where('id',$id)->selectRaw($cols)->take(1)->get()->first();
        ///throw new \Exception("dd = ".$pInfo->status_id);
        if(!$pInfo) return DV::error('Failed to identify pacakge by its ID');
        if($pInfo->status_id ==6) return DV::error('Cannot delete the package because it is already "On Delivery"');
        if($pInfo->sender_pmt_status_id ==1) return DV::error('Cannot delete the package. There is payment transaction with merchant');
        if($pInfo->driver_pmt_status_id ==1) return DV::error('Cannot delete the package. There is payment transaction with driver');
        if ($pInfo->driver_trx_id) return DV::error('Cannot delete the package because there is Driver Payment waiting for Approval');
        if ($pInfo->sender_trx_id) return DV::error('Cannot delete the package because there is one merchant payment transaction with it'); 
        if ($pInfo->status_id == 8 && !UM::allowed(280)) return DV::error('You need permission number 280 to delete Delivered package');
        if ($pInfo->status_id == 11 && !UM::allowed(279)) return DV::error('You need permission number 279 to delete Returned package');
        $delivery_id = $pInfo->delivery_id;
        $branch_id = $pInfo->branch_id;
      $deleted = false;
      try{
          $nowTime = getNowTime();
          $package = DB::table('package')->where('id',$pInfo->id)->first();
          $package->create_user = $ss->full_name;
          $package->create_date = $nowTime;
          $package->update_user = $ss->full_name;
          $package->update_date = $nowTime;
          $package->create_uid = $ss->user_id;
          $package->update_uid = $ss->user_id;
          if($package){
            DB::table('deleted_package')->where('id',$pInfo->id)->delete();
            DB::table('deleted_package')->insert((array) $package);
            $deleted = DB::table('package')->where('id',$pInfo->id)->delete();
          }
       }catch(\Exception $e){
           ErrorManager::sendTelegram(['message'=>$e->getMessage()],$ss);
           Log::error($e->getMessage());
           Log::error('Stack trace: ' . $e->getTraceAsString());
           return DV::error('Failed to delete the package. But dont worry! the issue is tracked and will be resolved');
       }
         
        if($deleted && $delivery_id > 0){
            //begin:: update delviery.package_count, delviered_count
              $cnt = $this->getPackageCountByStatus($ss,$delivery_id,null); //count all packages related to a delivery trip
              if($delivery_id>0){
                $delivered_status_id =8;
                $delivered_cnt = $this->getPackageCountByStatus($ss,$delivery_id,$delivered_status_id);
                DB::table('delivery')->where('id',$delivery_id)->update([
                    'delivered_count'=>$delivered_cnt,
                    'package_count'=>$cnt
                ]);
              }
            //end:: update delviery.package_count, delviered_count

            if($pInfo->status_id ==6 || ($pInfo->driver_pmt_status_id !=1 && ($pInfo->status_id ==8 || $pInfo->status_id ==9))){
              $cdata =[
                [
                  'user_class'=>'driver',
                  'target_user_id'=>$pInfo->driver_id,
                  'title'=>'Package Deleted',
                  'message'=>$ss->full_name. " បានលុបកញ្ចប់ទំនិញរបស់អ្នក នៅ ".date('d M Y h:m'),
                  'persist'=>1,
                  'data'=>$pInfo
                ]
              ]; 
              Notifier::notify_mobile($branch_id,$cdata);
            }
        }

        $order_id = $pInfo->order_id;
        if($deleted && $order_id > 0){
          //Update order.qty, if order_id exists
          $branch_id = $branch_id?$branch_id:1;
          DB::statement('UPDATE `order` SET qty =(SELECT COUNT(p.id) FROM package AS p WHERE p.branch_id ='.$branch_id.' AND p.order_id ='.$order_id.') WHERE branch_id ='.$branch_id.' AND id ='.$order_id); 
        }
          
          $des = $ss->full_name.' deleted package id '.$pInfo->id.' receiver phone '.$pInfo->receiver_phone.' barcode "'.$pInfo->bar_code.'" at '.getNowTime();
          $xd = (object)['package_id'=>$pInfo->id,'user_class'=>$ss->user_class,'action_name'=>'delete_package','description'=>$des];
          Tracker::log($xd,$ss);
          return DV::success();
      }
 
    function delete($barcode_or_id,$byCol="id",$ss=null){
          $id = null;
          $ss = $ss?$ss:$this->userInfo;
          if(!$byCol) $byCol="id";
          if($byCol==='barcode'){
            $id = DB::table("package")->where("qr_code",$barcode_or_id)->take(1)->value('id');
          }else if ($byCol==='id'){
             $id = $barcode_or_id?$barcode_or_id:$this->id;
          }
         if($id > 0)
            return $this->deleteById($id,$ss);   
         else return DV::error('The provided barcode or package ID is not correct');   
      }

      // function deletePackage($data) {
      //   $ss = UM::getUserInfoByToken($data);
      //   if ($ss->status_code !==200) return $ss; //user not authenticated
          
      //     $branch_id = $ss->branch_id;
      //     $delivery_id = $data->delivery_id;
      //     $barcode = isset($data->barcode)?$data->barcode:null;
      //     $package_id = isset($data->package_id)?$data->package_id:null;
      //     $package_id = trim($package_id);
      //     $statusInfo = $this->getPackageStatusInfo($branch_id,$barcode);
      //     if($statusInfo ==null) return "Cannot find barcode of the package for deleting";
      //     if ($statusInfo->status_id ==8) return "Cannot delete package that has been delivered to receiver";
      //     if ($statusInfo->status_id ==11) return "Cannot delete package that has been returned to Store";
      //     $order_id = $statusInfo->order_id; 
          
      //     $val = $package_id>0?$package_id:$barcode;
      //     $byCol = 'id';
      //     if($package_id>0) $byCol ='id'; else $byCol ='barcode';

      //     $p1 = $this->getPackageProps($branch_id,$val,"p.id,p.qr_code AS barcode,p.status_id,p.sender_pmt_status_id,p.driver_pmt_status_id",$byCol);
      //     if(!$p1)  return DV::error("Package identity is not valid");
      //     if(empty($package_id)) $package_id = $p1->id;
      //     if (empty($bar_code)) $bar_code = $p1->barcode;
      //     if ($p1->sender_pmt_status_id ==1 || $p1->driver_pmt_status_id==1) return DV::error('Cannot delete package because payment has been settled with driver or merchant');
 
      //     DB::table('package')->where('branch_id',$branch_id)->where('id',$package_id)->delete();
      //       //begin:: update delviery.package_count, delviered_count
      //         $cnt = $this->getPackageCountByStatus($ss,$delivery_id,null); //count all packages related to a delivery trip
      //         $delivered_status_id =8;
      //         $delivered_cnt = $this->getPackageCountByStatus($ss,$delivery_id,$delivered_status_id);
      //         DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->update(array(
      //             'delivered_count'=>$delivered_cnt,
      //             'package_count'=>$cnt
      //         ));
      //      //end:: update delviery.package_count, delviered_count
      //      //update order.qty, if order_id exists
      //       if ($order_id >0) 
      //          DB::statement("UPDATE `order` SET qty =(SELECT COUNT(p.id) FROM package AS p WHERE p.branch_id ='".$branch_id."' AND p.order_id ='".$order_id."') WHERE branch_id ='".$branch_id."' AND id ='".$order_id."' "); 
            
      //       //delete package_updates history   
      //       DB::table('package_updates')->where('branch_id',$branch_id)->where('package_id',$package_id)->delete();
      //     return null;
      // }
  
     function getComboItems_package_status($data=null){
        // $ss = UM::getUserInfoByToken($data);
        // if ($ss->status_code !==200) return $ss; //user not authenticated
        //  
          $rows = DB::table('package_statuses')->where('stage','delivery')->selectRaw('id,name AS status_name')->get();
          return ($rows);
      }

      //Action by Admin => Admin updates or change package's status from "On Delivery" to "Delivered" or "Failed"
      //$arr = ["status_id","update_trip_status"=>0|1,"failure_notes"=>"sdfdsf"]
      function updateStatus($arr= [],$id = null,$ss=null){
           $package_id = $id? $id:$this->id;
           $ss = $ss?$ss:$this->userInfo;
           $branch_id = $ss->branch_id;
           $d = (object)$arr;
           $remarks = $d->failure_notes ?? (isset($d->remarks)? $d->remarks:null);

           $cols = 'p.id,p.qr_code as barcode,p.delivery_id,p.status_id,p.driver_pmt_status_id,p.sender_pmt_status_id,p.receiver_phone';
           $pInfo = $this->getPackageProps($branch_id,$id,$cols,"id");
           if(!$pInfo) return DV::error('Failed to identify package ID');
           $delivery_id = $pInfo->delivery_id;
            
           $update_trip_status =$d->update_trip_status?$d->update_trip_status:1;//whether or not to allow updating the trip status 
           //$barcode = isset($data->barcode)?$data->barcode:null;
           $status_id = $d->status_id; //Status code in varchar(20)
          //  $failure_notes = isset($d->failure_notes)?$d->failure_notes:null;
           $trip_status_id =null;
           if ($pInfo->status_id == $status_id) return DV::depends(1);
           if ($status_id ==9  && !UM::allowed(281)) return DV::error('You need permission 281 to change Status to Failed',$ss->lang);
           else if ($status_id ==8 && !UM::allowed(282)) return DV::error('You need permission 282 to change Status to Delivered',$ss->lang);
           else if ($status_id ==9){
              if(!$remarks) return DV::error('Please provide reason for failed delivery');
           }
           $result = (object)array('status'=>'OK','error_message'=>null,'trip_status_id'=>null);
           if (empty($status_id)) return DV::error('Status is not correct');
           //if user try to change pacakge status to 6 ="On Delivery"=> This is not allowed if the trip has been Finished. This is allowed only when the Trip is still On Delivery 
            if ($status_id ==6){
               $row = DB::table('delivery AS d')->where('d.branch_id',$branch_id)->where('d.id',$delivery_id)->selectRaw('d.status_id')->take(1)->first();
               if($row) $trip_status_id = $row->status_id;
               if ($trip_status_id != 2) return DV::error('មិនអាចដូរស្ថានភាពនេះទេ! ព្រោះការដឹកត្រូវបានបញ្ចប់ហើយ');
            }

           $the_package = null; 
           //$org_status_id = null;

           if($status_id ==9) {
            $the_package = DB::table('package AS p')->where('p.branch_id',$branch_id)->where('id',$package_id)->selectRaw('p.failure_notes, p.status_id, HEX(p.driver_trx_id) AS driver_trx_id,p.driver_pmt_status_id, p.sender_pmt_status_id')->first();
            if(!$the_package) return DV::error('Package identity is not valid');

             //$failure_notes = $the_package->failure_notes;
             //$org_status_id = $the_package->status_id;
             if ($the_package->sender_pmt_status_id ==1) return DV::error('Cannot change status because it has been settled with the merchant');
             if ($the_package->driver_trx_id) return DV::error('Cannot change status because driver settlement is in waiting for approval now');
             if ($the_package->driver_pmt_status_id ==1) return DV::error('Cannot change status because it has been settled with the driver');
             //if ($org_status_id ==8) return DV::error('Cannot change status of a pacakge that is already delivered to customer');
             if(empty($remarks)) return DV::error('ត្រូវការហេតុផលសំរាប់ Failed Package');
           }

           $outstanding =1;
           if ($status_id ==8 || $status_id ==11) $outstanding =0; 
            //  //get $outstanding value based on a given @status_id 
            //     $rows = DB::table('package_statuses')->where('id',$status_id)->selectRaw('outstanding')->take(1)->get();
            //     foreach($rows as $row) $outstanding = $row->outstanding;
            //  //end of getting outstanding value
           $nowTime = getNowTime();
           DB::table('package')->where('branch_id',$branch_id)->where('id',$package_id)->update([
               'status_id'=>$status_id,
               'outstanding'=>$outstanding,
               'failure_notes'=>$remarks, //$failure_notes is NULL when $status_id != 9
               'delivery_time'=>$nowTime,
               'update_user'=>$ss->login_name,
               'update_date'=>$nowTime
           ]);
           $p_status = DB::table('package_statuses')->where('id',$status_id)->take(1)->value('name');
           $des = $ss->full_name.' change package status to '.$p_status.' ('.$status_id.') for package id '.$pInfo->id.' receiver phone '.$pInfo->receiver_phone.' barcode "'.$pInfo->barcode.'" at '.getNowTime(). '. The original status ID was '.$pInfo->status_id;
           $xd = (object)['package_id'=>$pInfo->id,'user_class'=>$ss->user_class,'action_name'=>'change_package_status','description'=>$des];
           Tracker::log($xd,$ss);
           
          //funtion $this->updateDeliveryStatus() returns latest trip's status_id (3) then trip is DONE, otherwise return NULL 
          //### begin:: Update delivery trip's status based on number of remaining items with "On Delivery" status
            if ($update_trip_status ==1 || $update_trip_status==true){
              //$on_delivery_status = 6;
              $cnt = $this->getPackageCountByStatus($ss,$delivery_id,6); //count packages that are "On delivery", if count = 0 => update trip status to DONE
              if ($cnt ==0){
                DB::table('delivery')->where('branch_id',$branch_id)->where('id',$delivery_id)->update(array(
                  'status_id'=>3
                )); 
                $result->trip_status_id = 3; //if no remaining "On Delivery" items => then trip is "DONE"
              } 
            }
        //### end:: Update delivery trip's status based on number of remaining items with "On Delivery" status
     
        $p = $this->getPackageProps($branch_id,$package_id,"p.status_id,ps.name AS status,p.driver_id,p.sender_id,p.receiver_name,(SELECT s.`phone_number` FROM `sender` AS s WHERE s.id = p.sender_id LIMIT 1) AS sender_phone,s.id AS sender_id,p.receiver_phone,receiver_address,p.qr_code AS barcode",'id');
           
           //if unexpectedly, the $barcode is not valid => just return $result
           //if(!$p) return $result;
        
          //##begin:: notification to other Admin users 
          $p->barcode ='';
              $data = (object)['branch_id'=>$branch_id,'user_id'=>$ss->user_id,'delivery_id'=>$delivery_id,'barcode'=>$p->barcode,'status_id'=>$status_id,'status'=>$p->status];
              $event_name =null;

              if ($status_id ===9)
               {
                $data->message ="កញ្ចប់ $p->receiver_phone ដឹកមិនបានសំរេច។ $falure_notes (By Admin $ss->login_name)"; 
                $event_name =='delivery_failed';
               }
              else if ($status_id===8) 
                {
                  $data->message ="ដឹកបានសំរេច កញ្ចប់លេខ $p->receiver_phone (By Admin $ss->login_name)";
                  $event_name ='delivery_succeeded';
                }
              else if ($status_id===10) 
              {
                  $data->message ="កញ្ចប់លេខ ".$p->receiver_phone." បន្តរដឹក! (By Admin $ss->login_name)";
                  $event_name ='delivery_retry';
              }
              else if ($status_id===11) 
              {
                  $data->message ="កញ្ចប់លេខ ".$p->receiver_phone." បញ្ជូនត្រឡប់! (By Admin $ss->login_name)";
                  $event_name ='package_returned';
              }
              else{
                $data->message ="ស្ថានភាពកញ្ចប់លេខ​ $p->receiver_phone ផ្លាស់ប្តូរទៅជា $p->status (By Admin $ss->login_name)";
                $event_name='package_status_changed';
              } 
              $data->title ="Delivery";
              $err = Notifier::notify_admin('package_status_changed',$data);
         //##end:: notification to other Admin users 

          //begin:: notify to Merchant and Driver mobile app
              $p->event_name = $event_name;
              $cdata = [
                  [
                      'user_class'=>'merchant',
                      'target_user_id'=>$p->sender_id,
                      'persist'=>1,
                      'data'=>$p,
                      'title'=>'Delivery',
                      'message'=> $data->message 
                  ],
                    [
                      'user_class'=>'driver',
                      'target_user_id'=>$p->driver_id,
                      'persist'=>1,
                      'data'=>$p,
                      'title'=>'Delivery',
                      'message'=>$data->message." (Action by Admin)"
                  ]
                ];
                Notifier::notify_mobile($branch_id,$cdata);
          //end:: notify to Merchant and Driver (in case Admin updated the status)

          return DV::success(['trip_status_id'=>$result->trip_status_id]);
      }
  //@cols can be string or array
  function getPackageProps($branch_id=null,$id=null,$cols=null,$by_col ='id'){
       
    if(!$id) return null;
    $fields ="p.id,ps.name as status";

    if(!is_string($cols)){
            if(!isset($cols[0])) 
                $cols = ["p.id","p.qr_code AS bar_code","s.`id` AS sender_id","p.driver_id","p.delivery_type","s.name AS sender_name","p.receiver_address","(SELECT name FROM driver WHERE id = p.driver_id) AS driver_name","p.status_id","ps.name AS status","p.outstanding"];
            else {
                $i=0;
                $c;
                $fields ='';  
                do{
                   if(!isset($cols[$i])) break;
                   $c = $cols[$i];
                    if ($c=='status') $c = 'ps.name AS `status`';
                    else if($c=='sender_name') $c ='s.name AS sender_name';
                    else if($c=='cod') $c ='p.cod';
                    else if($c=='cod_fee') $c ='p.cod_fee';
                    else if ($c =='sender_phone') $c ='s.phone_number AS sender_phone';
                    $fields .= ($fields?',':'').$c;

                   $i++;
                }while($c);
            }  
    } else{
        if(!$cols) $fields = "p.id,p.qr_code AS bar_code,s.`id` AS sender_id,p.driver_id,p.delivery_type, s.name AS sender_name,p.driver_total,p.receiver_address,(SELECT name FROM driver WHERE id = p.driver_id) AS driver_name,p.status_id,ps.name AS status,p.outstanding";
        else $fields = $cols;
    }
     
    $more_where ="1=1";
    $where1 ="p.id ='$id'";
    if($by_col !='id') $where1 ="p.qr_code ='$id'";

    if($branch_id >0) $more_where ="p.branch_id =$branch_id"; 
    $rows = DB::table('package AS p')->whereRaw($more_where)->whereRaw($where1)->join('package_statuses AS ps','ps.id','=','p.status_id')->join('sender AS s','s.id','=','p.sender_id')->selectRaw($fields)->take(1)->get();
    foreach($rows as $row) return $row;
    return null;  
}

       function getReceiverInfo($data) {
        $ss = UM::getUserInfoByToken($data);
        if ($ss->status_code !==200) return $ss; //user not authenticated
         
          $id = Sanitizer::sanitize($data->package_id);
          $branch_id = Sanitizer::sanitize($ss->branch_id);
          $rows = DB::table('package AS p')->where('branch_id',$branch_id)->where('id',$id)->selectRaw('p.delivery_id,p.receiver_name,p.receiver_phone,p.receiver_address,p.zone_code')->take(1)->get();
          foreach($rows as $row) return $row;
          return null;
      }
 
      public function updatePakackgeStatus($data) {
        $ss = UM::getUserInfoByToken($data);
        if ($ss->status_code !==200) return $ss; //user not authenticated
         

          $id = $data->package_id;
          $branch_id = $ss->branch_id;
          
          //start:: get delivery_id
              $rows = DB::table('package')->where('id',$id)->selectRaw('delivery_id')->where('branch_id',$branch_id)->take(1)->get();
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

      //Currently method getOrderDetails() here is NOT used
      //this method use either parameter "tracking_number" or "order_id", NOT both at same time.  $data = {'tracking_number','order_id','show_attachments'}. If @tracking_number is supplied => use @tracking_number to find order_id and use the found @order_id to query result
      function getOrderDetails($arr=[],$ss=null) {
            $data = (object)$arr;
            $ss = $ss?$ss:$this->getUserInfo();
            $branch_id = $ss->branch_id;
            $order_id = isset($data->order_id)?$data->order_id:null;
            $tracking_number = isset($data->tracking_number)?Sanitizer::sanitize($data->tracking_number):null;// This is order_code
            $show_attachments = isset($data->show_attachments)?$data->show_attachments:0;
            if($show_attachments ==true) $show_attachments =1;

            $result = (object)([]);

            if (!empty($tracking_number) && $order_id <=0) 
            {
                $rows =  DB::table('order AS o')->where('branch_id',$branch_id)->where('o.code',$tracking_number)->take(1)->select('o.id')->get();
                foreach($rows as $row) $order_id = $row->id; //get order_id based on the given tracking_number 
            }
            //NOTE: "order.code" is used "tracking_number"
            //Get header data about order request pickup(pickup_type, request_date, sender_id, sender_code, product_type,number of packages)
            $header_row = null;
            $h_rows = DB::table('order AS o')->join('sender AS s','s.id','=','o.sender_id')->where('o.branch_id',$branch_id)->where('o.id',$order_id)->selectRaw("o.id AS order_id, o.qty,o.actual_pkg_count, o.code AS tracking_number, o.pickup_method, DATE_FORMAT(o.request_date,'%d %b %Y %r') AS request_date, o.sender_id, s.name AS sender_name, s.phone_number AS sender_phone, o.status_id, (SELECT ps.name FROM package_statuses AS ps WHERE ps.id=o.status_id LIMIT 1) AS status")->take(1)->get();
        
            foreach($h_rows as $row) $header_row = $row;
            //return a string error message when there is no order record or pickup record found!
            if ($header_row == null) return 'No pickup information found for this tracking number';
              
            //begin:: Check if at least one package has been booked into table "package" 
            $cnt =0;
            $rows = DB::table("package AS p")->where('p.branch_id',$branch_id)->where('p.order_id',$order_id)->selectRaw("p.id")->take(1)->get();
            foreach($rows as $row) $cnt = 1;
            if ($cnt >0) //This case: order has been booked in "delivery" table and packages are stored in "package" table
            {
               //These query based on 2 tables: "package","package_statuses"
               $header_row->packages = DB::table('package AS p')->join('package_statuses AS ps','ps.id','=','p.status_id')->where('p.branch_id',$branch_id)->where('p.order_id',$order_id)->selectRaw("p.id,p.qr_code AS barcode,CONCAT(IFNULL(p.dim_x,0),'cm x ',IFNULL(p.dim_y,0),'cm x ',IFNULL(p.dim_h,0),'cm') AS size,p.dim_x, p.dim_y, p.dim_h,p.billed_kg,p.actual_kg,p.price, p.receiver_address,p.receiver_phone, p.receiver_name, p.package_name, p.zone_code,p.zone_name,p.df_payer,p.base_fee, p.sender_adjust_amount, IFNULL(p.driver_adjust_amount,0) AS driver_adjust_amount, p.delivery_fee, p.cod, p.cod_fee,p.status_id,ps.name AS status,IFNULL(p.sender_confirmed,0) AS sender_confirmed,IFNULL(p.sender_pmt_status_id,0) AS sender_pmt_status_id, NULL AS img_data")->get();
               return $header_row;
            } 
            else //order.status_id <4=> 4 = "Picked and Booked"
            {
              $header_row->packages = DB::table('order_receivers AS r')->join('order AS o','r.order_id','o.id')->where('o.branch_id',$branch_id)->where('o.id',$order_id)->selectRaw("r.id, CONCAT(IFNULL(r.dim_x,0),'cm x ',IFNULL(r.dim_y,0),'cm x ',IFNULL(r.dim_h,0),'cm') AS size, r.dim_x, r.dim_y, r.dim_h,r.billed_kg,r.actual_kg,r.price, r.receiver_address,r.receiver_phone, r.receiver_name, r.package_name, r.zone_code,r.zone_name, r.cod, r.df_payer, 0 AS base_fee, 0 AS adjust_amount, r.delivery_fee, r.cod_fee,1 AS status_id,'Not picked Yet' AS status")->get();
              if ($show_attachments==1) {
                foreach($header_row->packages as $iRow) {
                  $iRow->img_data = self::getFirstAttachment($branch_id,$iRow->id);     
                }
              }
              return $header_row;
            }
            //end::Check if the request order has been booked as delivery

            return [];
      }
      function getFirstAttachment($branch_id,$id){
        $one_file = DB::table('package_attachments AS tt')->where('tt.branch_id',$branch_id)->where('tt.package_id',$id)->selectRaw('tt.file_name,tt.user_class,tt.file_type')->take(1)->first(); 
        if($one_file && $one_file->file_name) return PublicStorage::getUrl($branch_id,$one_file->user_class,$one_file->category).$one_file->file_name;
        return null;
      }

      function findOrders($data) {
        $ss = UM::getUserInfoByToken($data);
        if ($ss->status_code !==200) return $ss; //user not authenticated
         
          $branch_id = $ss->branch_id;
          $order_code = Sanitizer::sanitize(isset($data->order_code)?$data->order_code:0);

          //Get order details (This is like header data, and items are list of receivers that later become list of packages for the given @order_id )
          $h_rows = DB::table('order AS o')->join('sender AS s','s.id','=','o.sender_id')->selectRaw("o.id AS order_id,o.status_id, (SELECT os.name FROM package_statuses AS os WHERE os.id = o.status_id LIMIT 1) AS status, o.code as order_code, s.id AS sender_id, s.name AS sender_name, s.code AS sender_code, s.phone_number AS sender_phone, 
          (SELECT name FROM sender_type AS t WHERE t.id = s.sender_type_id LIMIT 1) AS sender_type,
          DATE_FORMAT(o.request_date,'%d %b %Y %r') AS request_date, o.qty, 0.product_type, o.request_vehicle_type, o.order_canceled, o.pickup_address, o.pickup_location, o.pickup_time")->where('o.branch_id',$branch_id)->where('o.code',$order_code)->take(1)->get();

          //BEGIN:: IF order has become delivery record. Check if the order_id exists in table "delivery". If so, the pickup request becomes a delivery data
              $rows = DB::table('delivery AS d')->selectRaw("d.status")->where('d.branch_id',$branch_id)->where('d.order_code',$order_code)->take(1)->get();
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
      $select_cols ="o.id,o.status_id,o.sender_id,o.code, o.request_date,o.qty, o.product_type, o.sender_type_id,o.driver_id";
      $rows = DB::table('order AS o')->join('sender AS s','s.id','=','o.sender_id')->where('o.branch_id',$branch_id)->where('o.id',$order_id)->selectRaw($select_cols)->take(1)->get();
      foreach($rows as $row) return $row;
      return null;
  }
  
  //Vendor confirm that packages are correct in terms of fees and cod.
  //param $package_ids ="12|35|101" is used  when vendor check some packages and press "confirm" button
  //param $order_id is used when all packages in the delivery Order are correct | confirmTransaction (vendor) 
  function confirmCorrectAmounts($arr,$ss=null){
    $ss = $ss?$ss:$this->userInfo;
    //$package_ids = $id?$id:$this->id;
    $d = (object)$arr; 
    $branch_id = $ss->branch_id;
    $package_ids = isset($d->package_ids)?$d->package_ids:[];
    $order_id = isset($d->order_id)?$d->order_id:0;
    if(!isset($package_ids[0])) return DV::error('No packages provided');

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
    return DV::success(); 
  }
   
  function getSenderInfo($uss,$sender_id){
      $branch_id = $uss->branch_id;
      $exchange_rate  = $this->getExchangeRate($uss,$sender_id,"id")->buy_rate; //get exchangeRateBySenderId()
      $select_cols =$exchange_rate.' AS exchange_rate,s.id,s.name, s.cod ,s.code,s.email,s.phone_number, s.address, (SELECT name FROM sender_type WHERE id = s.sender_type_id LIMIT 1) AS sender_type';
      $rows = DB::table('sender AS s')->where('s.branch_id',$branch_id)->where('s.id',$sender_id)->selectRaw($select_cols)->take(1)->get();
      foreach($rows as $row) return $row;
      return null;
  }
 
 function getZoneCode($uss, $zone_name,$commune_id,$district_id,$city_id=null) {
    $branch_id = $uss->branch_id;
    $rows = DB::table('zones AS z')->where('branch_id',$branch_id)->where('zone_name',$zone_name)->selectRaw('z.zone_code')->take(1)->get();
    foreach($rows as $row) return $row;
    $rows = DB::table('zones AS z')->where('branch_id',$branch_id)->where('commune_id',$commune_id)->selectRaw('z.zone_code')->take(1)->get();
    foreach($rows as $row) return $row;
    $rows = DB::table('zones AS z')->where('branch_id',$branch_id)->where('district_id',$district_id)->selectRaw('z.zone_code')->take(1)->get();
    foreach($rows as $row) return $row;
    $rows = DB::table('zones AS z')->where('branch_id',$branch_id)->where('city_id',$city_id)->selectRaw('z.zone_code')->take(1)->get();
    foreach($rows as $row) return $row;
    
    return null;
 }

 function getTaxByProductType($code=null) {
   return 0;
 }

//  function getZoneByCode($ss,$zone_code) {
//    $branch_id = $ss->branch_id;
//    return DB::table('zones AS z')->where('z.branch_id',$branch_id)->where('z.zone_code',$zone_code)->selectRaw('z.zone_code,z.zone_type,z.zone_name,z.city_id,z.district_id,z.commune_id,z.country_id')->first();
//  }

static function list($arr,$ss=null) {   
  $d = (object)$arr;
  
  $is_overdue_alert = isset($d->is_overdue_alert)? $d->is_overdue_alert:0;
  if($is_overdue_alert){
    $status_id = $d->status_id;
    return self::list_overdue($arr,$status_id,$ss); 
    return;
  }

  $fresh = isset($d->fresh)?$d->fresh:1;
  $str_dates = '5=5';
  $current_page =isset($d->current_page)?$d->current_page:1;
  $per_page =isset($d->per_page)?$d->per_page:10;
  if(!is_numeric($current_page)) $current_page=1;
  $skip_rows = ($current_page -1) * $per_page;

  $branch_id = Sanitizer::sanitize($ss->branch_id);
  $use_date =isset($d->use_date)? $d->use_date: 'arrival_date'; /** use_date =arrival_date|finish_date */
  $warehouse_id = isset($d->warehouse_id)?Sanitizer::sanitize($d->warehouse_id):1;

  $d->sender_id = Sanitizer::sanitize(isset($d->sender_id) ? $d->sender_id: null);
  $d->zone_code = Sanitizer::sanitize(isset($d->zone_code) ? $d->zone_code: null);
  //$back_days = isset($d->back_days)?$d->back_days:0;
  //$since_date ='1=1';

  $start_date = isset($d->start_date)? convertDate($d->start_date): null;
  $end_date = isset($d->end_date)? convertDate($d->end_date): null;
  $d->delivery_type = isset($d->delivery_type)?$d->delivery_type:null;
  if($d->delivery_type ==0) $d->delivery_type =null;
  $d->driver_id = isset($d->driver_id)?$d->driver_id:null;
  $d->pickup_driver_id = isset($d->pickup_driver_id)?$d->pickup_driver_id:null;

  $d->status_id = isset($d->status_id)?$d->status_id:null;
  if(empty($d->status_id)) $d->status_id =-1;
  $str_order ='p.arrival_time DESC, p.status_id';

  $d->search_value =isset($d->search_value)? $d->search_value:null;
  $d->search_value = escape_like_str($d->search_value);

  $cache_key = 'opglist_';
  foreach($d as $key => $val) $cache_key .= $val;
  $cache_key = str_replace(['/','-','?','@','|'],'',$cache_key);
  $cache_data = null;
  if(!$fresh){
    $cache_data = Cache::get($cache_key); 
    if ($cache_data) {
      //Log::info('Cached triplist. key = '.$cache_key); 
      return $cache_data;
    }
  }
    //$succeeded_status ="delivered"; /* outstanding delvieries => select all packages that has status different from "delivered" */
   
    $str_driver = null;
    $str_pickup_driver = null;
    //$str_warehouse =null;
    
    $str_sender =null;
    $str_status = ' AND p.status_id IN (5,6,9)'; //status_id = 4 (Picked and Booked), status_id = 5 (Arrived at warehouse) 
    $str_delivery_type = null;
    $str_zone = ''; // $d->zone_code? 'p.zone_code =\''.$d->zone_code.'\' ':'7=7'; 
    $str_search = null;
    $search_value = $d->search_value;
    $str_outstanding = '';
    if ($search_value) { 
       $search_value = escape_like_str($search_value);
       $search_by_driver = ' OR p.driver_id = (SELECT d.id FROM driver as d WHERE d.name =\''.$search_value.'\' OR d.code =\''.$search_value.'\' LIMIT 1 ) ';
       $str_search = " AND (p.qr_code ='$search_value' OR p.receiver_phone LIKE '%$search_value%'  OR s.phone_number LIKE '%".$search_value."%' OR s.name LIKE '%".$search_value."%' OR p.order_id = (SELECT `id` FROM `order` WHERE code ='".$search_value."' LIMIT 1) $search_by_driver)";
       $more_wheres = '1=1 '.$str_search;
       $str_status ='1=1'; //Allow search all statuses in Package trail
    }
    else{
      $str_outstanding = '  AND IFNULL(p.outstanding,0) =1 ';
      if ($d->delivery_type) $str_delivery_type =" AND p.delivery_type ='".$d->delivery_type."' ";
      if ($d->driver_id > 0) $str_driver = ' AND p.driver_id ='.$d->driver_id;
      if ($d->pickup_driver_id > 0) $str_pickup_driver = ' AND p.pickup_driver_id ='.$d->pickup_driver_id;
      if ($d->driver_id ==-1) $str_driver = ' AND IFNULL(p.driver_id,0) = 0';
      if ($d->sender_id > 0) $str_sender = ' AND p.sender_id ='.$d->sender_id;
      if ($d->zone_code) $str_zone = " AND p.zone_code ='".$d->zone_code."' ";
      if ($d->status_id > 0) $str_status = ' AND p.status_id ='.$d->status_id;
              
    //If $driver_id is not Selected, and pickup_driver is selected to filter => use "arrival_date"
    if((!$d->driver_id || $d->driver_id ==-1) && $d->pickup_driver_id > 0)  $use_date ='arrival_date';
    if ((bool)strtotime($start_date) || (bool)strtotime($end_date)){
        if($use_date === 'finish_date'){
           $str_dates = "DATE(p.delivery_time) BETWEEN '$start_date' AND '$end_date'";
        }else $str_dates = "DATE(p.arrival_time) BETWEEN '$start_date' AND '$end_date'";
    }
      $more_wheres = 'p.warehouse_id = '.$warehouse_id.$str_outstanding.$str_delivery_type.$str_driver.$str_pickup_driver.$str_zone.$str_sender.$str_status;
    }
    $select_cols ='p.id,p.label_print_count,p.collectible,p.delivery_id, p.order_id, p.zone_code, formatTime(p.delivery_time) AS finish_time, p.delivery_type, p.qr_code AS barcode,p.delivery_notes, p.failure_notes,p.return_notes,'.'CASE IFNULL(p.failure_notes,\'\') WHEN \'\' THEN p.delivery_notes ELSE p.failure_notes END AS remarks,'.
    'HEX(p.driver_pmt_status_id) as driver_pmt_status_id, 
    formatTime(p.arrival_time) AS `arrival_time`, formatTime(p.last_checkout_time) AS last_checkout_time, formatTime(p.first_checkout_time) AS first_checkout_time, s.sender_type_id, st.name AS sender_type, (select x.name from driver as x WHERE x.id = p.driver_id LIMIT 1) AS driver_name, p.driver_id,'.
    '(select x.name from driver as x WHERE x.id = p.pickup_driver_id LIMIT 1) AS pickup_driver_name,'.
    '(IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0) +IFNULL(p.cod_fee,0)) AS fees, 
        (CASE p.cod WHEN 1 THEN (IFNULL(p.price,0) - IFNULL(p.cod_fee,0)) ELSE 0 END) AS cod_amount,
     p.status_id,IFNULL(p.driver_pmt_status_id,0) AS driver_pmt_status_id, IFNULL(p.sender_pmt_status_id,0) AS sender_pmt_status_id,ps.`name` AS status, p.sender_id, s.phone_number AS sender_phone, p.receiver_id, p.receiver_address, p.receiver_name, p.receiver_phone,p.zone_name, s.name AS sender_name, IFNULL(p.driver_total,0) AS driver_total, IFNULL(p.sender_total,0) AS sender_total';

    $query = DB::table('package AS p')->join('package_statuses as ps','ps.id','=','p.status_id')->join('sender AS s','s.id','=','p.sender_id')->join('sender_type AS st','st.id','=','s.sender_type_id')->selectRaw($select_cols)->whereRaw($str_dates)->where('p.branch_id',$branch_id)->whereRaw($more_wheres)->orderByRaw($str_order);
    $count_query = clone $query;
    $count = $count_query->count('p.id');
    $rows = $query->skip($skip_rows)->take($per_page)->get();
    
    $overdue_queries = [
      ['status_id'=>'5','hours_ago'=> self::$overdue_alert_times['5']],
      ['status_id'=>'6','hours_ago'=>self::$overdue_alert_times['6']],
      ['status_id'=>'9','hours_ago'=>self::$overdue_alert_times['9']]
    ];
    $countInfo = [];
    foreach($overdue_queries as $q){
      $status_id = $q['status_id'];
      $hours_ago = $q['hours_ago'];
      $date_field = 'p.arrival_time';
      if($status_id ==6) $date_field = 'p.last_checkout_time';
      else if ($status_id ==9) $date_field = 'p.delivery_time';
      $str_time = 'TIMESTAMPDIFF(HOUR,'.$date_field.', NOW()) >='.$hours_ago;
      $cnt  = DB::table('package as p')->join('sender as s','s.id','=','p.sender_id')->where('p.branch_id',$branch_id)->whereRaw($str_time)->where('p.status_id',$status_id)->count();  
      $countInfo[$status_id] = (object)['count'=>$cnt,'hours_ago'=>$hours_ago]; 
    } 
      
    $summary = (object)[
       'overdue_aw'=>(object)[
          'title'=>'Overdue AW',
          'value'=> $countInfo['5']->count.' pcs',
          'alert_color'=> $countInfo['5']->count > 0 ? 'text-danger':'text-success',
          'time_ago'=>'Over '.$countInfo['5']->hours_ago.'h'
       ],
       'overdue_od'=>(object)[
        'title'=>'Overdue OD',
        'value'=> $countInfo['6']->count. ' pcs',
        'alert_color'=> $countInfo['6']->count > 0 ? 'text-danger':'text-success',
        'time_ago'=>'Over '.$countInfo['6']->hours_ago.'h'
       ],
       'overdue_failed'=>(object)[
        'title'=>'Overdue Failed',
        'value'=> $countInfo['9']->count. ' pcs',
        'alert_color'=> $countInfo['9']->count > 0 ? 'text-danger':'text-success',
        'time_ago'=>'Over '.$countInfo['9']->hours_ago.'h'
     ]
    ];
    $total_overdue_count = $countInfo['5']->count + $countInfo['6']->count +$countInfo['9']->count;
    $data = (object)[
      'summary'=>$summary,
      'is_overdue_list'=>0,
      'status_id'=>'',
      'total_overdue_count'=>$total_overdue_count,
      'list'=>new LengthAwarePaginator($rows, $count, $per_page, $current_page)
    ];
    Cache::put($cache_key,$data,30);
    //Log::info('No cache cpglist '.$cache_key);
    return $data;
 }


 static function listAll($arr,$ss=null) {   
  $d = (object)$arr;

  $fresh = isset($d->fresh)?$d->fresh:0;
  $str_dates = '5=5';
  
  // $current_page =isset($d->current_page)?$d->current_page:1;
  // $per_page =isset($d->per_page)?$d->per_page:10;
  // if(!is_numeric($current_page)) $current_page=1;
  // $skip_rows = ($current_page -1) * $per_page;

  $branch_id = Sanitizer::sanitize($ss->branch_id);
  $use_date =isset($d->use_date)? $d->use_date: 'arrival_date'; /** use_date =arrival_date|finish_date */
  $warehouse_id = isset($d->warehouse_id)?Sanitizer::sanitize($d->warehouse_id):1;

  $d->sender_id = Sanitizer::sanitize(isset($d->sender_id) ? $d->sender_id: null);
  $d->zone_code = Sanitizer::sanitize(isset($d->zone_code) ? $d->zone_code: null);
  //$back_days = isset($d->back_days)?$d->back_days:0;
  //$since_date ='1=1';

  $start_date = isset($d->start_date)? convertDate($d->start_date): null;
  $end_date = isset($d->end_date)? convertDate($d->end_date): null;
  $d->delivery_type = isset($d->delivery_type)?$d->delivery_type:null;
  if($d->delivery_type ==0) $d->delivery_type =null;
  $d->driver_id = isset($d->driver_id)?$d->driver_id:null;
  $d->pickup_driver_id = isset($d->pickup_driver_id)?$d->pickup_driver_id:null;

  $d->status_id = isset($d->status_id)?$d->status_id:null;
  if(empty($d->status_id)) $d->status_id =-1;
  $str_order ='p.arrival_time DESC, p.status_id';

  $d->search_value =isset($d->search_value)? $d->search_value:null;
  $d->search_value = escape_like_str($d->search_value);

  $cache_key = 'opglist_';
  foreach($d as $key => $val) $cache_key .= $val;
  $cache_key = str_replace(['/','-','?','@','|'],'',$cache_key);
  $cache_data = null;
  if(!$fresh){
    $cache_data = Cache::get($cache_key); 
    if ($cache_data) {
      //Log::info('Cached triplist. key = '.$cache_key); 
      return $cache_data;
    }
  }
    //$succeeded_status ="delivered"; /* outstanding delvieries => select all packages that has status different from "delivered" */
   
    $str_driver = null;
    $str_pickup_driver = null;
    //$str_warehouse =null;
    
    $str_sender =null;
    $str_status = ' AND p.status_id IN (5,6,9)'; //status_id = 4 (Picked and Booked), status_id = 5 (Arrived at warehouse) 
    $str_delivery_type = null;
    $str_zone = ''; // $d->zone_code? 'p.zone_code =\''.$d->zone_code.'\' ':'7=7'; 
    $str_search = null;
    $search_value = $d->search_value;
    if ($search_value) { 
       $search_value = escape_like_str($search_value);
       $str_search = " AND (p.qr_code ='$search_value' OR p.receiver_phone LIKE '%$search_value%'  OR s.phone_number LIKE '%".$search_value."%' OR s.name LIKE '%".$search_value."%' OR p.order_id = (SELECT `id` FROM `order` WHERE code ='".$search_value."' LIMIT 1))";
       $more_wheres = " IFNULL(p.outstanding,0) =1 AND p.status_id IN (5,6,9) ".$str_search;
    }
    else{
      if ($d->delivery_type) $str_delivery_type =" AND p.delivery_type ='".$d->delivery_type."' ";
      if ($d->driver_id > 0) $str_driver = ' AND p.driver_id ='.$d->driver_id;
      if ($d->pickup_driver_id > 0) $str_pickup_driver = ' AND p.pickup_driver_id ='.$d->pickup_driver_id;
      if ($d->driver_id ==-1) $str_driver = ' AND IFNULL(p.driver_id,0) = 0';
      if ($d->sender_id > 0) $str_sender = ' AND p.sender_id ='.$d->sender_id;
      if ($d->zone_code) $str_zone = " AND p.zone_code ='".$d->zone_code."' ";
      if ($d->status_id > 0) $str_status = ' AND p.status_id ='.$d->status_id;
              
    //If $driver_id is not Selected, and pickup_driver is selected to filter => use "arrival_date"
    if((!$d->driver_id || $d->driver_id ==-1) && $d->pickup_driver_id > 0)  $use_date ='arrival_date';
    if ((bool)strtotime($start_date) || (bool)strtotime($end_date)){
        if($use_date === 'finish_date'){
           $str_dates = "DATE(p.delivery_time) >= '$start_date' AND DATE(delivery_time) <='$end_date'";
        }else $str_dates = "DATE(p.arrival_time) >= '$start_date' AND DATE(arrival_time) <='$end_date'";
    }
      $more_wheres = 'p.warehouse_id = '.$warehouse_id.' AND IFNULL(p.outstanding,0) =1 '.$str_delivery_type.$str_driver.$str_pickup_driver.$str_zone.$str_sender.$str_status;
    }
    $select_cols ='p.id,p.collectible,p.delivery_id, p.order_id, p.zone_code, formatTime(p.delivery_time) AS finish_time, p.delivery_type, p.qr_code AS barcode,p.delivery_notes, p.failure_notes, CASE IFNULL(p.failure_notes,\'\') WHEN \'\' THEN p.delivery_notes ELSE p.failure_notes END AS remarks,HEX(p.driver_pmt_status_id) as driver_pmt_status_id, 
    formatTime(p.arrival_time) AS `arrival_time`, formatTime(p.last_checkout_time) AS last_checkout_time, formatTime(p.first_checkout_time) AS first_checkout_time, s.sender_type_id, st.name AS sender_type, (select x.name from driver as x WHERE x.id = p.driver_id LIMIT 1) AS driver_name, p.driver_id,'.
    '(select x.name from driver as x WHERE x.id = p.pickup_driver_id LIMIT 1) AS pickup_driver_name,'.
    '(IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0) +IFNULL(p.cod_fee,0)) AS fees, 
        (CASE p.cod WHEN 1 THEN (IFNULL(p.price,0) - IFNULL(p.cod_fee,0)) ELSE 0 END) AS cod_amount,
     p.status_id,IFNULL(p.driver_pmt_status_id,0) AS driver_pmt_status_id, IFNULL(p.sender_pmt_status_id,0) AS sender_pmt_status_id,ps.`name` AS status, p.sender_id, s.phone_number AS sender_phone, p.receiver_id, p.receiver_address, p.receiver_name, p.receiver_phone,p.zone_name, s.name AS sender_name, IFNULL(p.driver_total,0) AS driver_total, IFNULL(p.sender_total,0) AS sender_total';

    $query = DB::table('package AS p')->join('package_statuses as ps','ps.id','=','p.status_id')->join('sender AS s','s.id','=','p.sender_id')->join('sender_type AS st','st.id','=','s.sender_type_id')->selectRaw($select_cols)->whereRaw($str_dates)->where('p.branch_id',$branch_id)->whereRaw($more_wheres)->orderByRaw($str_order);
    //$count_query = clone $query;
    //$count = $count_query->count('p.id');
    $rows =  $query->get();
    
    //$summary = (object)[];

    // $data = (object)[
    //   'summary'=>$summary,
    //   'list'=>new LengthAwarePaginator($rows, $count, $per_page, $current_page)
    // ];
    Cache::put($cache_key,$rows,30);
    //Log::info('No cache cpglist '.$cache_key);
    return $rows;
 }
 
 static function saveLabelPrintCount($count, $id){
    DB::table('package')->where('id',$id)->update(['label_print_count'=>$count]);
    return DV::success();
 }

 /** List overdue package, for example, over 72 hours ago */
 static function list_overdue($arr, $status_id, $ss=null) { 
  $filter_status_id = $status_id;  
  $wheres = [
    '5'=>'TIMESTAMPDIFF(HOUR, p.arrival_time, NOW()) >='.self::$overdue_alert_times['5'].' AND p.status_id ='.$status_id,
    '6'=>'TIMESTAMPDIFF(HOUR, p.last_checkout_time, NOW()) >='.self::$overdue_alert_times['6'].' AND p.status_id ='.$status_id,
    '9'=>'TIMESTAMPDIFF(HOUR, p.delivery_time, NOW()) >='.self::$overdue_alert_times['9'].' AND p.status_id ='.$status_id
  ]; 
  
  $str_where = $wheres[$status_id];

  $d = (object)$arr;
  $current_page =isset($d->current_page)?$d->current_page:1;
  $per_page =isset($d->per_page)?$d->per_page:10;
  if(!is_numeric($current_page)) $current_page=1;
  $skip_rows = ($current_page -1) * $per_page;

   $branch_id = Sanitizer::sanitize($ss->branch_id);
   //$warehouse_id = isset($d->warehouse_id)?Sanitizer::sanitize($d->warehouse_id):1;
   
   $str_order ='p.arrival_time DESC, p.status_id';
     
    $select_cols ='p.id,p.collectible,p.delivery_id, p.order_id, p.zone_code, formatTime(p.delivery_time) AS finish_time, p.delivery_type, p.qr_code AS barcode,p.delivery_notes, p.failure_notes, CASE IFNULL(p.failure_notes,\'\') WHEN \'\' THEN p.delivery_notes ELSE p.failure_notes END AS remarks,HEX(p.driver_pmt_status_id) as driver_pmt_status_id, 
    formatTime(p.arrival_time) AS `arrival_time`, formatTime(p.last_checkout_time) AS last_checkout_time, formatTime(p.first_checkout_time) AS first_checkout_time, s.sender_type_id, st.name AS sender_type, (select x.name from driver as x WHERE x.id = p.driver_id LIMIT 1) AS driver_name, p.driver_id,'.
    '(select x.name from driver as x WHERE x.id = p.pickup_driver_id LIMIT 1) AS pickup_driver_name,'.
    '(IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0) +IFNULL(p.cod_fee,0)) AS fees, 
        (CASE p.cod WHEN 1 THEN (IFNULL(p.price,0) - IFNULL(p.cod_fee,0)) ELSE 0 END) AS cod_amount,
     p.status_id,IFNULL(p.driver_pmt_status_id,0) AS driver_pmt_status_id, IFNULL(p.sender_pmt_status_id,0) AS sender_pmt_status_id,ps.`name` AS status, p.sender_id, s.phone_number AS sender_phone, p.receiver_id, p.receiver_address, p.receiver_name, p.receiver_phone,p.zone_name, s.name AS sender_name, IFNULL(p.driver_total,0) AS driver_total, IFNULL(p.sender_total,0) AS sender_total';

    $query = DB::table('package AS p')->join('package_statuses as ps','ps.id','=','p.status_id')->join('sender AS s','s.id','=','p.sender_id')->join('sender_type AS st','st.id','=','s.sender_type_id')->whereRaw($str_where)->where('p.branch_id',$branch_id)->selectRaw($select_cols)->orderByRaw($str_order);
    $count_query = clone $query;
    $count = $count_query->count('p.id');
    $rows = $query->skip($skip_rows)->take($per_page)->get();
    
    $overdue_queries = [
      ['status_id'=>'5','hours_ago'=> self::$overdue_alert_times['5']],
      ['status_id'=>'6','hours_ago'=>self::$overdue_alert_times['6']],
      ['status_id'=>'9','hours_ago'=>self::$overdue_alert_times['9']]
    ];
    $countInfo = [];
    foreach($overdue_queries as $q){
      $status_id = $q['status_id'];
      $hours_ago = $q['hours_ago'];
      $date_field = 'p.arrival_time';
      if($status_id ==6) $date_field = 'p.last_checkout_time';
      else if ($status_id ==9) $date_field = 'p.delivery_time';
      $str_time = 'TIMESTAMPDIFF(HOUR,'.$date_field.', NOW()) >='.$hours_ago;
      $cnt  = DB::table('package as p')->join('sender as s','s.id','=','p.sender_id')->where('p.branch_id',$branch_id)->whereRaw($str_time)->where('p.status_id',$status_id)->count();  
      $countInfo[$status_id] = (object)['count'=>$cnt,'hours_ago'=>$hours_ago]; 
    } 
      
    $summary = (object)[
       'overdue_aw'=>(object)[
          'title'=>'Overdue AW',
          'value'=> $countInfo['5']->count.' pcs',
          'alert_color'=> $countInfo['5']->count > 0 ? 'text-danger':'text-success',
          'time_ago'=>'Over '.$countInfo['5']->hours_ago.'h'
       ],
       'overdue_od'=>(object)[
        'title'=>'Overdue OD',
        'value'=> $countInfo['6']->count. ' pcs',
        'alert_color'=> $countInfo['6']->count > 0 ? 'text-danger':'text-success',
        'time_ago'=>'Over '.$countInfo['6']->hours_ago.'h'
       ],
       'overdue_failed'=>(object)[
        'title'=>'Overdue Failed',
        'value'=> $countInfo['9']->count. ' pcs',
        'alert_color'=> $countInfo['9']->count > 0 ? 'text-danger':'text-success',
        'time_ago'=>'Over '.$countInfo['9']->hours_ago.'h'
     ]
    ];

    $total_overdue_count = $countInfo['5']->count + $countInfo['6']->count +$countInfo['9']->count;
    $data = (object)[
      'is_overdue_list'=>1,
      'status_id'=>$filter_status_id,
      'total_overdue_count'=>$total_overdue_count,
      'summary'=>$summary,
      'list'=>new LengthAwarePaginator($rows, $count, $per_page, $current_page)
    ]; 
    return $data;
}

function getZoneByCode($branch_id, $zone_code) {
  $zones = Cache::get('zones', null);
  if (!$zones) {
      $zones = DB::table('zones AS z')
          ->where('z.branch_id', $branch_id)
          ->selectRaw('z.zone_code, z.zone_type, z.zone_name, z.city_id, z.district_id, z.commune_id, z.country_id')
          ->get();

      Cache::put('zones', $zones, 180); // Cache the zones data for 3 minutes
  }

  $filtered_zones = $zones->filter(function($z) use($zone_code) {
      return $z->zone_code == $zone_code;
  });

  if ($filtered_zones->isNotEmpty()) {
      return $filtered_zones->first(); // Return the first item in the filtered array
  } else {
      return null; // Return null if no matching zone is found
  }
}
 
 function getOrderPackageCount($order_id){
   $rows = DB::table('order_receivers AS r')->where('r.order_id',$order_id)->selectRaw("COUNT(r.id) AS cnt")->get();
   foreach($rows as $row) return $row->cnt;
   return 0;
 }

 function pickOrder($arr,$ss=null){
    $ss = $ss?$ss:$this->userInfo;
    $d = (object)$arr;  
    $branch_id = $ss->branch_id;
    $order_id = isset($d->order_id)?$d->order_id:0;
    $driver_id = isset($d->driver_id)?$d->driver_id:0;
    $notes = isset($d->notes)?$d->notes:null;
    $qty = isset($d->qty)?$d->qty:0; //default number of package 0

    if($order_id <=0) {
       return DV::error('Order ID is not correct!');  
    }
 
    if($qty <=0) {
       return DV::error('Number of packages is not correct!'); 
    }

    $picked_status_id =3; // Picked but not booking any packages
    $cnt = $this->getOrderPackageCount($order_id);
    if ($cnt >0){
      $picked_status_id =4; /* Picked and Booked */ 
      $qty = $cnt;
    }else if(!is_numeric($qty)){
      return DV::error('Number of packages is not correct.សូមប្រើលេខឡាតាំង'); 
    }

    $pickup_time = getNowTime();
    DB::table('order')->where('branch_id',$branch_id)->where('id',$order_id)->update(array('pickup_time'=>$pickup_time,'qty'=>$qty,'status_id'=>$picked_status_id,'driver_id'=>$driver_id,'pickup_notes'=>$notes));
    
      //begin:: From Driver App=> Notify backend system, and Merchant App 
       $order = self::getOrderProps(null,$order_id,['qty','o.code AS order_code','driver_name','o.driver_id','s.`id` AS sender_id','status_id','status','completed','s.name AS sender_name','s.phone_number AS sender_phone_number','pickup_address']);
      if ($order) {
              $message = "$order->driver_name បានទទួលទំនិញ ពីអ្នកលក់ $order->sender_name($order->sender_phone_number)  នៅ $order->pickup_address";
              $event_data = (object)['branch_id'=>$branch_id,'order_id'=>$order_id,'order_code'=>$order->order_code,'sender_id'=>$ss->user_id,'status'=>$order->status,'qty'=>$order->qty,'status_id'=>$order->status_id,'completed'=>$order->completed,'driver_id'=>$order->driver_id,'driver_name'=>$order->driver_name,'message'=>$message,'title'=>'Order Picked'];
              Notifier::notify_admin('order_status_changed',$event_data);

              //begin::notify merchant that their order has been picked by Driver (From Driver app)
               $order->event_name ='order_picked';
                $cdata = [
                    [
                      'target_user_id'=>$order->sender_id,
                      'user_class'=>'merchant',
                      'title'=>'Order Picked',
                      'message'=>"ទំនិញ​ $order->qty កញ្ចប់ ត្រូវបានយកចេញទៅ. Order $order->order_code. driver $order->driver_name",
                      'data'=>$order,
                      'persist'=>1
                    ]
                  ];
                  Notifier::notify_mobile($branch_id,$cdata);
       //end::notify merchant
 
       }else {
         return DV::success(["notification_error"=>"Unexpectedly, the order id $order_id is invalid"]);
       }
    //end:: From Driver App=> Notify backend system, and Merchant App

    return DV::success();
  }
 
  //return um_users.id based on a given @sender_id or @driver_id
  function getUserProp($user_class,$id,$prop){
     $rows = [];
     if($user_class =='merchant' || $user_class=='sender')
       $rows = DB::table('um_users AS u')->where('official_id',$id)->where('user_class',$user_class)->selectRaw($prop)->take(1)->get();
     else if($user_class =='driver')
       $rows = DB::table('um_users AS u')->where('official_id',$id)->where('user_class',$user_class)->selectRaw($prop)->take(1)->get();
     foreach($rows as $row) return $row->{$prop};
     return null;    
  }

    //if $cols is NULL => use defeaul cols defined in this method
    static function getOrderProps($branch_id=null,$id=null,$cols=null){
      if(!$id) return null;
      if(!$cols)
        $cols = ["`o`.`id` AS order_id","o.qty","s.`id` AS sender_id","o.driver_id","o.`code` as order_code","DATE_FORMAT(request_date,'%d %b %Y') AS request_date","DATE_FORMAT(request_date,'%r') AS request_time","o.delivery_type","o.product_type","o.request_vehicle_type AS vehicle_type","o.qty","s.name AS sender_name","pickup_address","(SELECT name FROM driver WHERE id = o.driver_id) AS driver_name","o.delivery_condition","status_id","ps.name AS status","o.completed"];
      else {
          $indx = array_search('status',$cols,true);
          if($indx >=0) $cols[$indx] = 'ps.name AS status';
          $indx = array_search('driver_name',$cols,true);
          if($indx >=0) $cols[$indx] = '(SELECT dr.`name` FROM `driver` AS dr WHERE dr.id = o.driver_id LIMIT 1) AS driver_name'; //here d
        
      }
      $fields = implode(',',$cols);
      $more_where ="1=1";
      if($branch_id >0) $more_where ="o.branch_id =$branch_id"; 
      $rows = DB::table('order AS o')->whereRaw($more_where)->where('o.id',$id)->join('package_statuses AS ps','ps.id','=','o.status_id')->join('sender AS s','s.id','=','o.sender_id')->selectRaw($fields)->take(1)->get();
      foreach($rows as $row) return $row;
      return null;  
  }
   
  function getZoneName($ss,$zone_code){
    $branch_id = $ss->branch_id;
    $rows = DB::table('zones')->where('branch_id',$branch_id)->where('zone_code',$zone_code)->selectRaw('zone_name')->take(1)->get();
    foreach($rows as $row) return $row->zone_name;
    return null;
  }

  function getBilledWeight($dim_x, $dim_y, $dim_h, $actual_weight = 0, $adjusted_kg = 0) {
    // Ensure that the dimensions and weights are valid numbers
    $dim_x = floatval($dim_x);
    $dim_x = $dim_x ?? 0;
    $dim_y = floatval($dim_y);
    $dim_y = $dim_y ?? 0;
    $dim_h = floatval($dim_h);
    $dim_h = $dim_h ?? 0;
    $actual_weight = floatval($actual_weight);
    $actual_weight = $actual_weight ?? 0;
    $adjusted_kg = floatval($adjusted_kg);
    $adjusted_kg = $adjusted_kg ?? 0;
    try {
        // Calculate the billed weight
        $billed_weight = ($dim_x * $dim_y * $dim_h) / 6015;

        // Choose the greater of billed weight and actual weight
        $final_weight = max($billed_weight, $actual_weight);

        // Add the adjusted weight
        return $final_weight + $adjusted_kg;
    } catch (Throwable $e) {
        Log::error($e->getMessage());
        Log::error($e->getTraceAsString());
        return 0;
    }
 }

  
      function getCODFeeCharge($ss, $sender_id) {
        $branch_id = $ss->branch_id;
        $today = Date('Y-m-d');
        $more_where = "1=1 AND ((IFNULL(c.never_expires,0) =1) OR (DATE(c.start_date) <='".$today."' AND DATE(c.end_date) >='".$today."' ) )";
        //$more_where = "1=1 AND ((DATE(c.start_date) <='".$today."' AND IFNULL(c.never_expires,0) =1) OR (DATE(c.start_date) <='".$today."' AND DATE(c.end_date) >='".$today."' ) )";
        $rows = DB::table("sender_cod_charges AS c")->where('c.branch_id',$branch_id)->where('sender_id',$sender_id)->whereRaw($more_where)->selectRaw("cod_fee_percent, 0 AS cod_fee")->take(1)->get();
        foreach($rows as $row) {
          return (is_numeric($row->cod_fee_percent)?$row->cod_fee_percent:0);
        } 
        $defaul_cod_fee_charge = 0;// get_settings_value($ss,'COD_FEE_PERCENT','number');
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
      //   $rows = DB::table("sender_base_price AS f")->where('f.branch_id',$branch_id)->where('f.sender_id',$sender_id)->whereRaw($more_where)->selectRaw("f.price")->take(1)->get();
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
      function getPriceInfoByPackage($arr=[],$id=null,$ss=null){
          $ss =$ss?$ss:$this->userInfo;
          $package_id =$id?$id:$this->id;
          $d = (object)$arr;  
          $branch_id = $ss->branch_id;
          $cod = isset($d->cod)?$d->cod:null;

          $data = (object)array('sender_id'=>0,'cod_fee_percent'=>0,'cod_fee'=>0,'base_fee'=>0,'price_per_kg'=>0,'price_list'=>[]);
          if($package_id) $package_id = isset($d->package_id)? Sanitizer::sanitize($d->package_id):0;
          $rows = DB::table('package AS p')->where('p.branch_id',$branch_id)->where('p.id',$package_id)->selectRaw('p.sender_id,p.delivery_type,p.zone_code,p.billed_kg')->take(1)->get();
          foreach($rows as $row){
            $sender_id = $row->sender_id;
            $zone_code = $row->zone_code;
            $delivery_type = $row->delivery_type;
            $billed_kg = $row->billed_kg;

            $p = $this->getDeliveryPriceInfo($branch_id,$sender_id,$delivery_type,$zone_code,$billed_kg,$cod);
            if($p->status ==='Error') return DV::error($p->error_message);
            $data->sender_id = $sender_id; 
            $data->cod_fee_percent = $p->cod_fee_percent; //$this->getCODFeeCharge($ss,$sender_id);
            $data->base_fee = $p->base_fee;
            $data->price_per_kg = floatval($data->price_per_kg);
            $data->price_per_kg = $data->price_per_kg ?? 0;
            //$data->$price =0; //found price that matches when all conditions are specified
            $data->price_list =[];// $this->getSenderPriceList($ss,$sender_id,$zone_code,$delivery_type,null);
            return $data;
          }
           return DV::depends(1,$data);
      }

  //Called extrnally
  function getSenderPriceByZone1($d) {
      $ss = UM::getUserInfoByToken($d);
      if ($ss->status_code !==200) return $ss; //user not authenticated
       
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
      $rows = DB::table("sender_price_list AS f")->where('f.branch_id',$branch_id)->where('f.sender_id',$sender_id)->whereRaw($more_where)->selectRaw("f.price,f.price_per_kg")->take(1)->get();
    } else {
      $rows = DB::table("price_list AS f")->where('f.branch_id',$branch_id)->whereRaw($more_where)->selectRaw("f.price,f.price_per_kg")->take(1)->get();
    }
 
    foreach($rows as $row) {
      $rows = DB::table('sender_base_price AS f')->where('f.branch_id',$branch_id)->where('f.sender_id',$sender_id)->whereRaw($more_where)->selectRaw("f.price")->take(1)->get();
      $row->base_price= 0;
      foreach($rows as $r) $row->base_price = $r->price; //base price or minimum price
      return $row;
    }  
    return $data; //default price_info
  }

   //Pick order request for FAST delivery. Driver must enter each package's details (receiver phone, receiver address, zone name, delivery_fee, df_payer, price, COD, taxi fee, COD_fee)
   //param: $d = {'driver_id','delivery_type','delivery_condition','order_id','packages':[{ zone_name,zone_code,city_id,district_id,commune_id, receiver_phone, receiver-address, delivery_fee, df_payer, price, cod, cod_fee, forwarding_cost, dim_x, dim_y, dim_h, actual_kg, billed_kg}]}
   function pickOrderPackages_fast_delivery($arr, $ss=null){
    $ss = $ss?$ss:$this->userInfo;
    $d = (object)$arr; 
    $branch_id = $ss->branch_id;

    $delivery_types = ['fast'];
    $result = (object)[];
    $order_id = isset($d->order_id)?Sanitizer::sanitize($d->order_id):0;
    
    $d->delivery_condition = isset($d->delivery_condition)?Sanitizer::sanitize($d->delivery_condition):null;
    $d->delivery_type= isset($d->delivery_type)?Sanitizer::sanitize($d->delivery_type):'Fast';
  
    //depart_time is always the current server's time  => timezone = (Asia/Bangkok)
    $d->depart_time = getNowTime();
    //$d->depart_time = isset($d->depart_time)?convertDate($d->depart_time):getNowTime();
    $d->vehicle_type = isset($d->vehicle_type)?Sanitizer::sanitize($d->vehicle_type):'motobike';
   
    if (!(bool)strtotime($d->depart_time)) $d->depart_time = date('Y-m-d');
    
    if(!in_array(strtolower($d->delivery_type),$delivery_types)) {
      return DV::error('Delivery Type must be Fast');
    }
    
     if(!isset($d->packages[0])) {
       return DV::error('Failed to start a trip because there are no package information provided');
     }

    //$delivery_type = $d->delivery_type;

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
        $rows = DB::table('delivery AS d')->where('branch_id',$branch_id)->where('order_id',$order_id)->selectRaw('d.id AS delivery_id, d.fleet_tracking_number')->take(1)->get();
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
    $c = null;
    do{
       if (!isset($d->packages[$i])) break;
       $c = (object)($d->packages[$i]);
       if(!isset($c->receiver_phone)) $c->receiver_phone = null;  
       
         if(empty($c->receiver_phone)) return DV::error('At least of the package does not have receiver phone number'); 
       if(!isset($c->receiver_name)) $c->receiver_name = $c->receiver_phone; 
       if(!isset($c->receiver_address)) $c->receiver_address = null; 
        
       //if @zone_code is supplied => use @zone_code to derive commune_id. Otherwise, use @district_id and @commune_id to derive @zone_code
      //  $zone_code = isset($c->zone_code)?$c->zone_code:null;
      //  $zone_name = isset($c->zone_name)?$c->zone_name:null;
      //  $city_id = isset($c->city_id)?$c->city_id:0;
      //  $district_id = isset($c->district_id)?$c->district_id:0;
      //  $commune_id = isset($c->commune_id)?$c->commune_id:0;
       $package_name= null;
       //if no package name specified then use receiver's phone number as package name
       if(!isset($c->package_name)) $package_name = $c->receiver_phone;
   
       //$c->delivery_condition = isset($c->delivery_condition)?$c->delivery_condition:'MA';
       //$c->delivery_type = isset($c->delivery_type)?$c->delivery_type:'Normal'; 
       $c->delivery_fee = isset($c->delivery_fee)?Sanitizer::sanitize($c->delivery_fee):0;
       $c->price = isset($c->price)?Sanitizer::sanitize($c->price):0;
       $c->cod = isset($c->cod)?Sanitizer::sanitize($c->cod):null;
       $c->cod_fee = isset($c->cod_fee)?Sanitizer::sanitize($c->cod_fee):0;
       $c->df_payer = isset($c->df_payer)?Sanitizer::sanitize($c->df_payer):null;
       $c->forwarding_cost = isset($c->forwarding_cost)?Sanitizer::sanitize($c->forwarding_cost):0;
       $c->dim_x = isset($c->dim_x)?Sanitizer::sanitize($c->dim_x):0;
       $c->dim_y = isset($c->dim_y)?Sanitizer::sanitize($c->dim_y):0;
       $c->dim_h = isset($c->dim_h)?Sanitizer::sanitize($c->dim_h):0;
       //$c->billed_kg = isset($c->billed_kg)?Sanitizer::sanitize($c->billed_kg):0;
       $c->actual_kg = isset($d->actual_kg)?Sanitizer::sanitize($c->actual_kg):0;
       $c->billed_kg = isset($d->billed_kg)?Sanitizer::sanitize($c->billed_kg):null; 
     
       //if ($c->billed_kg <=0) $c->billed_kg = $c->billed_kg;
       if ($c->actual_kg <=0) $c->actual_kg = $c->billed_kg;
       
       if(strtolower($c->df_payer) != 'sender' && strtolower($c->df_payer) != 'receiver') return DV::error('Delivery Fee Payer must be either a Sender or Receiver. The input value is '.$c->df_payer); 

       //Here is a bit tricky. package status "5" = "Arrived at Warehouse", but in fact, packages are not brought to warehouse.
       //Here driver enter package into with status "5" and then press "Start Fast Delivery" button (in this sense, packase status changed to "6" ="Delivery Started" ) to start delviery immediately
       //So goods not arrived at Warhouse,
      $package_status_id =5; 
   
     //$product_type = $order->product_type;
     $order_code = $order->code;
     $sender_type_id = $order->sender_type_id;
     
     //set default $sender_type-id = 1 (Normal) If this is data is not supplied
     if($sender_type_id) $sender_type_id =1;

     //$bar_code = $this->createQRCode($ss);
     $cod_fee = 0;
     $tax_amount =0;
     if(!isset($c->product_code)) $c->product_code = null; 
     $tax_percent =$this->getTaxByProductType($c->product_code);
     $tax_amount = ($c->price * $tax_percent/100);
 
     $zone = $this->getZoneByCode($ss->branch_id,$c->zone_code);
     if ($zone ==null) return DV::error('Failed to identify the destination zone for some packages'); 
 
     $systematic_billed_kg = $this->getBilledWeight($c->dim_x,$c->dim_y,$c->dim_h, $c->actual_kg);
     if ($c->billed_kg==null) $c->billed_kg = $systematic_billed_kg;
     
     $driver_total =0;
     $sender_total=0;
     $base_fee = 0 ;
     $cod_amount =0; 
     //$applied_fixed_Price =0;

     $p = $this->getDeliveryPriceInfo($branch_id,$sender->id,$d->delivery_type,$c->zone_code,$c->billed_kg,$c->cod);
     if($p){
       $base_fee = $p->base_fee;
       $delivery_fee = $p->delivery_fee;
       $cod_fee_percent = $p->cod_fee_percent;
       if($c->cod==null) $c->cod = $p->cod;
     } 

      if ($c->cod ==1) {
        $cod_fee = ($base_fee + $delivery_fee) * $cod_fee_percent/100;
        $cod_amount = $c->price;
      }

      //Assume that Sender/Seller always has to pay for Taxi fee
      $driver_total = $cod_amount;
      $sender_total = $cod_fee + $c->forwarding_cost;

      if ($c->df_payer =='receiver') {
         $driver_total += $base_fee + $delivery_fee;
      }else{
         $sender_total+= $base_fee + $delivery_fee; 
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
         'qr_code'=>'0',//Wait until package is created
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
        self::setBarcode(DB::getPdo()->lastInsertId());   
        //$new_package_id = DB::getPdo()->lastInsertId();
        $success_count++; 
        $i++;
    } while($c);
    
    $pickup_time = getNowTime();
    $completed =1; //delivery order is completed at stage of Arrived At Warehouse
    $order_status_id = 5; // Order.status_id =5 => Assuming that the Package is arrived at Warehouse (For Fast Delivery)
    DB::table('order')->where('branch_id',$branch_id)->where('id',$order_id)->update(array('pickup_time'=>$pickup_time,'qty'=>$success_count,'driver_id'=>$d->driver_id,'completed'=>$completed,'status_id'=>$order_status_id));
     
     return DV::success(['delivery_id'=>$delivery_id,'package_count'=>$success_count,'fleet_tracking_number'=>$fleet_tracking_number]);
 }

 /** Validate data for each package that is created by Merchant or Driver or Admin. If one package failed, the Order WILL NOT be saved  
     * @order = {"warehouse_id""sender_id","product_type","delivery_type"}
    */
    function validatePackages($ss,$order,$items){
      $branch_id = $ss->branch_id;
      $max_price = 1000;
      $c = null;
      $i = 0;
      $success_count = 0;
      
    $packageModel = new \App\Models\Package();
    $success_items = []; 
    $sender_id = $order->sender_id; 
   do{
         $c = isset($items[$i])? (object)$items[$i]:null;
         if(!$c) break;
          $c->order_id = isset($order->id)? $order->id: (isset($order->order_id)? $order->order_id:null); 
          $c->product_type = isset($c->product_type)? $c->product_type: $order->product_type;
          $remarks = isset($c->remarks)?$c->remarks:'';
         if(!isset($c->delivery_notes))  $c->delivery_notes = $remarks;
          $c->warehouse_id = isset($order->warehouse_id)?$order->warehouse_id:null;
          if (!isPhoneNumber($c->receiver_phone)) return DV::error('Receiver phone is not correct');
          if (!isset($c->warehouse_id)) return DV::error('No warehouse ID provided for package with reeiver phone '.$c->receiver_phone);
          $c->df_payer = isset($c->df_payer)? $c->df_payer :null;
          if(!in_array(strtolower($c->df_payer),['sender','receiver'])) return DV::error('Fee payer must be Sender or Receiver'); 
          $c->forwarding_cost = floatval(isset($c->forwarding_cost)?$c->forwarding_cost:0);
          $c->forwarding_cost =  $c->forwarding_cost ?? 0;
          $c->billed_kg = floatval(isset($c->billed_kg) ? $c->billed_kg:0);
            $c->billed_kg = $c->billed_kg ?? 0;             
            $c->dim_x = floatval(isset($c->dim_x) ? $c->dim_x:  0);
            $c->dim_x  =$c->dim_x ?? 0;
            $c->dim_y = floatval(isset($c->dim_y) ? $c->dim_y:  0);
            $c->dim_y = $c->dim_y ?? 0;
            $c->dim_h = floatval(isset($c->dim_h) ? $c->dim_h: 0);
            $c->dim_h = $c->dim_h ?? 0;
            $c->actual_kg = floatval(isset($c->actual_kg) ? $c->actual_kg: 0);
            $c->actual_kg = $c->actual_kg ?? 0;
          $c->delivery_type = isset($c->delivery_type)?$c->delivery_type:$order->delivery_type;
          if (!in_array(strtolower($c->delivery_type),['normal','fast'])) return DV::error('Service type must be either Normal or Fast'); 
          
          $c->zone_code = isset($c->zone_code)?$c->zone_code:null;
          $zone = $this->getZoneByCode($branch_id,$c->zone_code);
          if(!$zone) return DV::error('Zone code ? does not exist. Given zone code is '.(!$c->zone_code? 'Empty':$c->zone_code).'::'.$c->zone_code);
          if (!DeliveryZone::isCovered($zone->zone_code)) return DV::error('Zone ? is not within our coverage area::'.$zone->zone_name.' ('.$zone->zone_code.')');
          
          $c->zone_name = $zone->zone_name;
          if(!isset($c->receiver_phone)) return DV::error('Receiver phone number is required');
          $c->receiver_phone = str_replace(' ','',$c->receiver_phone);
          if(!isset($c->receiver_name)) $c->receiver_name = $c->receiver_phone;
          /** If no receiver address then use remarks as receiver address */
          if(!isset($c->receiver_address)) $c->receiver_address = $remarks;
          if (!$c->receiver_address) $c->receiver_address = $c->zone_name; 
          $c->billed_kg = floatval($c->billed_kg)?$c->billed_kg:0;
          if ($c->billed_kg ==null){
              $systematic_billed_kg = $this->getBilledWeight($c->dim_x,$c->dim_y,$c->dim_h, $c->actual_kg);
              $c->billed_kg = $systematic_billed_kg;
          }

           //Process package size
           $size = isset($c->size)?$c->size:null;
           if($size){
               $m = (object)$size;
               if (isset($m->length)){
                   $c->dim_x =$m->length;
                   $c->dim_y =$m->width;
                   $c->dim_h =$m->height;
               }
           }else{
                   $c->dim_x =0;
                   $c->dim_y =0;
                   $c->dim_h =0;
           }
         //end process pacakge size

          $p = $packageModel->getDeliveryPriceInfo($branch_id,$sender_id,$c->delivery_type,$c->zone_code,$c->billed_kg,$c->cod);
          
          if($p->status ==='Error'){
             return DV::error($p->error_message);
          }else{
            $base_fee = $p->base_fee;
            $delivery_fee = $p->delivery_fee;
            $cod_fee_percent = is_numeric($p->cod_fee_percent)?$p->cod_fee_percent:0;
            if(!isset($c->cod)) $c->cod = $p->cod;
          }

           if(!is_numeric($c->price)) $c->price =0;

           /** ensure the price and cod are always correct and consistent */
           $c->cod_fee =0;
          
           if($c->price > 0) 
           {
              if ($c->price >$max_price) return DV::error('ថ្លៃទំនិញធំបំផុតគឺ '.$max_price.' USD');
              $c->cod =1;
           }
           else{
              if($c->price < 0) return DV::error('ថ្លៃទំនិញមិនត្រឹមត្រូវ');
               $c->cod =0;  
           }
           $cod_amount =0;
           if ($c->cod ==1) {
             $c->cod_fee = ($c->price + $base_fee + $delivery_fee) * $cod_fee_percent/100;
             $cod_amount = $c->price;
           }
           //assume that Seller/Merrchant always has to pay taxi fee
           $driver_total = $cod_amount;
           $sender_total = $c->cod_fee + $c->forwarding_cost;
     
           if (strtolower($c->df_payer) ==='receiver') {
              $driver_total += $base_fee + $delivery_fee;
           }else{
              $sender_total += $base_fee + $delivery_fee; 
           }
           $c->delivery_fee = $delivery_fee;
           $c->base_fee = $base_fee;
           $c->sender_total = $sender_total;
           $c->driver_total = $driver_total;
           $c->outstanding =0;
           if(!isset($c->status_id)) $c->status_id =1;
           $c->sender_id = $sender_id;
           unset($c->size);
           $success_items[] = $c;
           $success_count++;
           $i++;
    }while($c);

    return (object)[
      'status'=>'OK',
      'status_code'=>200,
      'success_items'=>$success_items,
      'success_count'=>$success_count
    ];
  }
 
 //pick-packages()| pickPackages()  
 function pickOrderPackages($arr,$ss=null){
     $ss = $ss?$ss:$this->userInfo;
     $d = (object)$arr;
     $branch_id = $ss->branch_id;
     $order_id =isset($d->order_id)?$d->order_id:null;
     if(!$order_id) $order_id = isset($d->id)?$d->id:null;
     if(!$order_id) return DV::error('No order ID provided');
     if (strtolower($ss->user_class !=='driver')) return DV::error('It seems you are not a driver');
     $driver_id = $ss->official_id; 
     $packages = isset($d->packages)?$d->packages:[];
     
     $order = DB::table('order as o')->where('o.id',$order_id)->selectRaw('o.id,o.warehouse_id,o.driver_id,o.delivery_type,o.sender_id,o.product_type')->first();
     if (!$order) return DV::error('Failed to identity Order information!');
     if ($driver_id != $order->driver_id) return DV::error('It seems that the Order was not assigned to you as a driver');
     $sender = DB::table('sender as s')->where('id',$order->sender_id)->selectRaw('id,name,phone_number,code,status_code')->first();
     if(!$sender) return DV::error('Sender or merchant identity is not valid');
     if(strtolower($sender->status_code) ==='inactive') return DV::error('The merchant ? with phone number ? is currently inactive::'.$sender->code.';'.$sender->phone_number);

     $data = $this->validatePackages($ss,$order,$packages);
     if ($data->status ==='Error') return DV::error($data->error_message); 
     $items = $data->success_items;
     $def_warehouse = GeneralSettings::getDefaultWarehouse($ss);
     if (!$def_warehouse) return DV::error('Default warehouse is not yet set');
     $warehouse_id = $def_warehouse->id; 
     DB::table('order_receivers')->where('branch_id',$branch_id)->where('order_id',$order_id)->delete();
     $c =null;
     $i =0;
     $success_count = 0;  
     do{
         if (!isset($items[$i])) break;
         $c =$items[$i];
         $c->warehouse_id = $warehouse_id;
         $c->order_id = $order_id;
         $c->sender_id = $sender->id;
         $c->sender_name = $sender->name;
         $c->sender_phone = $sender->phone_number;
         $new_package_id = saveData($ss,'order_receivers',['id'=>null],(array)$c,[],1,false);
         if($new_package_id){
            self::setBarcode($new_package_id);
            $success_count++;
         }
         $i++;
     }while($c);

     if ($success_count ==0) return DV::error('មិនមានទំនិញត្រូវបានទទួល'); 
     return DV::success(['success_count'=>$success_count,'message'=>'បានទទួល '.$success_count.' កញ្ចប់']);  
 }
  
  //Pick request delivery order @data = {"pick_and_arrive",order_id,delivery_type,receiver_name,receiver_phone,receiver_address, zone_code,price, cod,df_payer, actual_kg,billed_kg, length, width, height }
  //parameter @order = {'id','[driver_id]'} where $driver_id is optional (not yet used)
  function pickOrderPackage($ss,$order,$driver_id,$d){   
    $branch_id = $ss->branch_id;
     $delivery_types = ['normal','fast','Normal','Fast'];
     $order_id = $order->id;

     $pick_and_arrive = isset($d->pick_and_arrive)?$d->pick_and_arrive:0;
  
     $bar_code = null; 
     //$bar_code = isset($d->barcode)?Sanitizer::sanitize($d->barcode):null;
     $receiver_name = isset($d->receiver_name)?Sanitizer::sanitize($d->receiver_name):null;
     $receiver_phone = isset($d->receiver_phone)?Sanitizer::sanitize($d->receiver_phone):null;
     $receiver_address = isset($d->receiver_address)?Sanitizer::sanitize($d->receiver_address):null;
     //if @zone_code is supplied => use @zone_code to derive commune_id. Otherwise, use @district_id and @commune_id to derive @zone_code
     $zone_code = isset($d->zone_code)?Sanitizer::sanitize($d->zone_code):null;
     $zone_name = isset($d->zone_name)?Sanitizer::sanitize($d->zone_name):null;
     $city_id = isset($d->city_id)?Sanitizer::sanitize($d->city_id):0;
     $district_id = isset($d->district_id)?Sanitizer::sanitize($d->district_id):0;
     $commune_id = isset($d->commune_id)?Sanitizer::sanitize($d->commune_id):0;
     $package_name= null;
     //if no package name specified then use receiver's phone number as package name
     if(!isset($d->package_name)) $package_name = $d->receiver_phone;

     $d->delivery_condition = isset($d->delivery_condition)?Sanitizer::sanitize($d->delivery_condition):"None";
     $d->delivery_type = isset($d->delivery_type)?Sanitizer::sanitize($d->delivery_type):null; 
     $d->delivery_fee = isset($d->delivery_fee)?Sanitizer::sanitize($d->delivery_fee):0;
     $d->price = isset($d->price)?Sanitizer::sanitize($d->price):0;
     $d->cod = isset($d->cod)?Sanitizer::sanitize($d->cod):null;
     $d->cod_fee = isset($d->cod_fee)?Sanitizer::sanitize($d->cod_fee):0;
     $d->df_payer = isset($d->df_payer)?Sanitizer::sanitize($d->df_payer):null;
     $d->forwarding_cost = isset($d->forwarding_cost)?Sanitizer::sanitize($d->forwarding_cost):0;

     //NOTE: that we use $d->size instead of $d->dim_x, $d->dim_y, $d->dim_h. $d->size = {'width':0,'height','length'}
        $p_width = 0; // isset($d->dim_x)?$d->dim_x:0;
        $p_length = 0 ; //isset($d->dim_y)?$d->dim_y:0;
        $p_height =0 ; //isset($d->dim_h)?$d->dim_h:0;

     $d->actual_kg = isset($d->actual_kg)?Sanitizer::sanitize($d->actual_kg):0;
     $d->billed_kg = isset($d->billed_kg)?Sanitizer::sanitize($d->billed_kg):0; 
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
     $sender_id = $sender->id;
     
     //$zone = $this->getZoneCode($ss,$d->zone_code,$d->commune_id,$d->district_id,$d->city_id);
     $zone = $this->getZoneByCode($ss->branch_id,$zone_code);
     if ($zone ==null) return DV::error("Failed to identify the destination zone $zone_code"); 
      
     $package_status_id =4; // status = "Picked and Booked" into the system, but not yet arrrived at Warehouse 
     $qty = $order->qty;
     $delivery_fee = 0;
     $cod_fee =0;

      //$product_type = $order->product_type;
      $order_code = $order->code;
      $sender_type_id = $order->sender_type_id;
      
       //Process package size
          if (isset($d->size))
          {
              $m =(object)$d->size;
              if (isset($m->length)) {
                $p_length = $m->length;
                $p_width = $m->width;
                $p_height = $m->height;
              } 
          }
     //process package size

      if(!isset($d->billed_kg)) {
        $d->actual_kg = isset($d->actual_kg)?$d->actual_kg:0;
        $systematic_billed_kg = $this->getBilledWeight($p_width,$p_length,$p_height,$d->actual_kg);
        $d->billed_kg = $systematic_billed_kg;
      }
      if (!$d->billed_kg || $d->billed_kg <=0 ) $d->billed_kg = isset($d->actual_kg)?$d->actual_kg:0;

      if (!isset($d->product_type)) $d->product_type =null;
      $tax_percent = $this->getTaxByProductType($d->product_type);
      $tax_amount = $d->price * $tax_percent/100;
     
      //begin::calculation of package pricing to sender and driver
            //$cod = isset($d->cod)?$d->cod:null;
            $forwarding_cost = isset($d->forwarding_cost)?$d->forwarding_cost:0; 
            $price = isset($d->price)?$d->price:0;
            $df_payer = isset($d->df_payer)?$d->df_payer:null;
            $cod_amount =0;
            $delivery_fee = 0;
            $cod_fee = 0;
            $cod_fee_percent =0;
            $other_fees =0;
            $base_fee =0;
            //$sender_id = isset($d->sender_id)?$d->sender_id:null;
            //$delivery_type = isset($d->delivery_type)?$d->delivery_type:null;
            $pInfo = $this->getDeliveryPriceInfo($branch_id,$sender_id,$d->delivery_type,$zone_code,$d->billed_kg,$d->cod);
            if ($pInfo) {
                $delivery_fee = $pInfo->delivery_fee;
                $base_fee =$pInfo->base_fee;
                $cod_fee_percent = $pInfo->cod_fee_percent;
                //If Driver did not specify cod, then use merchant's cod as default
                if($d->cod ==null) $d->cod = $pInfo->cod;
            }
            //return DV::error(var_dump(['sender_id'=>$sender_id,'delivery_type'=>$d->delivery_type,'zone_code'=>$d->zone_code,'billed_kg'=>$d->billed_kg])); 
            if ($d->cod ==1 || strtolower($d->cod) =='yes') {
              $cod_amount = is_numeric($d->price)?$d->price:0;
              $cod_fee = ($price + $base_fee + $delivery_fee) * $cod_fee_percent/100; 
            }

             //We assume that the Seller/Sender always has to pay forwarding cost or Taxi fee
             $sender_total = $cod_fee + $forwarding_cost;
             $driver_total = $cod_amount;
            
            if (strtolower($df_payer) == 'sender') 
                $sender_total += $base_fee + $delivery_fee;
            else 
                $driver_total += $base_fee + $delivery_fee;
    //end::calculation of package pricing to sender and driver
           
                
       $warehouse_id = $this->getWarehouseIdByDriver_default($branch_id,$driver_id);
       if (!$warehouse_id) return DV::error("It seems you do not have a correct warehouse assignment"); 

       //$package_name = getNowTime();
       $pickup_time = getNowTime();
 
       if (!$bar_code) $bar_code = $this->createQRCode(null);
      
      //todo: delete package (order_id,receiver_phone)??? or allow driver to review package list and delete the duplicate package???
      $table ="order_receivers";
      if ($pick_and_arrive ==1 || $pick_and_arrive ==true) $table ="package";
      DB::table($table)->insert(array(
          'branch_id'=>$branch_id,
          'warehouse_id'=>$warehouse_id,
          'order_id'=>$order_id,
          'delivery_id'=>null,
          'driver_id'=>$driver_id,
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
          'zone_code'=>$zone_code,
          'zone_name'=>$zone->zone_name,
          //'map_location'=>$d->map_location,
          'delivery_fee'=>$delivery_fee,
          'base_fee'=>$base_fee,
          'df_payer'=>$d->df_payer,
          'dim_x'=>$p_width,
          'dim_y'=>$p_length,
          'dim_h'=>$p_height,
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
      return DV::success(['package_id'=>$new_package_id,'bar_code'=>$bar_code,'barcode'=>$bar_code]);  
      //return DV::success(["order_id"=>$order_id,"package_id"=>$new_package_id,"bar_code"=>$bar_code,'cod'=>$d->cod,'base_fee'=>$pInfo->base_fee,'delivery_fee'=>$pInfo->delivery_fee,'driver_total'=>$driver_total,'zone_code'=>$zone_code]);
  }

  //performPickup() is for Admin user to perform Pickup on behelf of a driver who uses Driver mobile app. 
  //It is assumed that when Admin user perform picks up, the goods alread Arrived at Warehouse (status_id =5)
  function performPickup($d){
    $ss = UM::getUserInfoByToken($d);
    if ($ss->status_code !==200) return $ss; //user not authenticated
     
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
    //     $rows = DB::table('delivery AS d')->where('branch_id',$branch_id)->where('order_id',$order_id)->selectRaw('d.id AS delivery_id')->take(1)->get();
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
          $receiver_address = isset($c->receiver_address)? Sanitizer::sanitize($c->receiver_address):null;
          //if @zone_code is supplied => use @zone_code to derive commune_id. Otherwise, use @district_id and @commune_id to derive @zone_code
          $zone_code = isset($c->zone_code)?Sanitizer::sanitize($c->zone_code):null;
          $zone_name = isset($c->zone_name)?Sanitizer::sanitize($c->zone_name):null;
          $df_payer = isset($c->df_payer)?Sanitizer::sanitize($c->df_payer):null;

          $city_id = isset($c->city_id)?Sanitizer::sanitize($c->city_id):0;
          $district_id = isset($c->district_id)?Sanitizer::sanitize($c->district_id):0;
          $commune_id = isset($c->commune_id)?Sanitizer::sanitize($c->commune_id):0;
          $package_name= null;
          //if no package name specified then use receiver's phone number as package name
          if(!isset($c->package_name)) $package_name = Sanitizer::sanitize($c->receiver_phone);
      
          $c->delivery_condition = isset($c->delivery_condition)? Sanitizer::sanitize($c->delivery_condition):0;
          //$c->delivery_fee = isset($c->delivery_fee)?Sanitizer::sanitize($c->delivery_fee):0;
          $c->price = isset($c->price)?Sanitizer::sanitize($c->price):0;
          $c->cod = isset($c->cod)?Sanitizer::sanitize($c->cod):0;
          //$c->cod_fee = isset($c->cod_fee)?Sanitizer::sanitize($c->cod_fee):0;
          $c->df_payer = isset($c->df_payer)?Sanitizer::sanitize($c->df_payer):null;
          $c->forwarding_cost = isset($c->forwarding_cost)?Sanitizer::sanitize($c->forwarding_cost):0;
          $c->dim_x = isset($c->dim_x)?Sanitizer::sanitize($c->dim_x):0;
          $c->dim_y = isset($c->dim_y)?Sanitizer::sanitize($c->dim_y):0;
          $c->dim_h = isset($c->dim_h)? Sanitizer::sanitize($c->dim_h):0;
          $c->delivery_notes = isset($c->delivery_notes)? Sanitizer::sanitize($c->delivery_notes):null;
          //$c->billed_kg = isset($c->billed_kg)?$c->billed_kg:0;
          $price = isset($c->price)?Sanitizer::sanitize($c->price):0;
          $c->actual_kg = isset($c->actual_kg)?$c->actual_kg:0;  
          $zone =null;
          if(strtolower($c->df_payer) != 'sender' && strtolower($c->df_payer) != 'receiver') {
            $errors[] = "Item for receiver ".$c->receiver_phone." failed because Delivery Fee Payer is not correct";
          }else if(!in_array(strtolower($delivery_type),$delivery_types)) {
             $errors[] = "Item for receiver ".$c->receiver_phone." failed because Delivery Type is not correct. Delivery Type must be Normal or Fast";
          } else {

          if (!empty($c->zone_code)) {
                $zone = $this->getZoneByCode($ss->branch_id,$c->zone_code);
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
             ////$bar_code = $this->createQRCode($ss);
   
             if ($c->cod ==1) {
               $cod_fee_percent = $this->getCODFeeCharge($ss,$sender->id);
               $cod_fee = $c->price * $cod_fee_percent/100;
             }
             
             //$systematic_billed_kg  = $this->getBilledWeight($c->dim_x,$c->dim_y,$c->dim_h,$c->actual_kg);
             if(!is_numeric($c->billed_kg)) $c->billed_kg =0;
             $billed_kg = $c->billed_kg;
              
             if (!isset($c->product_code)) $c->product_code = null;
             $tax_percent = $this->getTaxByProductType($c->product_code);
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
            $pInfo = $this->getDeliveryPriceInfo($branch_id,$sender_id,$delivery_type,$zone_code,$billed_kg,$cod);
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
                   'qr_code'=>'0',
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
                self::setBarcode(DB::getPdo()->lastInsertId());  
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
    $rows = DB::table('package_statuses AS ss')->where('id',$id)->take(1)->selectRaw('ss.id,ss.name')->get();
    foreach($rows as $row) return $row->name;
    return '(Unknown Status)';
 }

 //$d = {driver_id,delivery_date,[sender_id],[zone_code]}
 function getPackagesByDriver($arr,$ss=null){
    $ss = $ss?$ss:$this->userInfo;
    $branch_id = $ss->branch_id;
    $d = (object)$arr;
    $driver_id = Sanitizer::sanitize(isset($d->driver_id)?$d->driver_id:null);
    $delivery_date = isset($d->delivery_date)?$d->delivery_date:null;
    $sender_id = Sanitizer::sanitize(isset($d->sender_id)?$d->sender_id:null);
    $zone_name = Sanitizer::sanitize(isset($d->zone_name)?$d->zone_name:null);
    //$zone_code = Sanitizer::sanitize(isset($d->zone_name)?$d->zone_code:null);
    $receiver_phone = Sanitizer::sanitize(isset($d->receiver_phone)?$d->receiver_phone:null);
 
    $delivery_date = convertDate($delivery_date);    
    if (!(bool)strtotime($delivery_date)) $delivery_date = date('Y-m-d');
    
    // $str_date = " AND DATE(d.depart_time) ='".$delivery_date."' ";
    // $str_sender = null;
    // $str_receiver_phone =null;
    // $str_zone = null;
    if ($sender_id > 0) $str_sender =" AND p.sender_id ='".$sender_id."' ";
    if (!empty($receiver_phone)) $str_receiver_phone =" AND p.receiver_phone ='".$receiver_phone."' ";
    if (!empty($zone_name)) $str_zone ="AND p.zone_name ='".$zone_name."' ";

    $more_where ="1=1 AND p.status_id IN (6,9)"; //= "1=1 ".$str_date.$str_sender.$str_receiver_phone.$str_zone;
    $select_cols ="p.delivery_id,DATE_FORMAT(d.depart_time,'%d %b %Y %r') AS depart_time, p.driver_id, s.name AS sender_name, s.address AS sender_address, s.phone_number AS sender_phone, p.receiver_address, p.receiver_phone, p.zone_code, p.zone_name, p.cod, p.price, p.df_payer, p.delivery_fee,p.delivery_type, p.forwarding_cost, p.cod_fee, (IFNULL(p.delivery_fee,0) + IFNULL(p.cod_fee,0) + (CASE p.cod WHEN 1 THEN p.price ELSE 0 END) ) AS total, 'Phnom Penh' AS origin, 'Moto' AS vehicle_type";
    return DB::table('package AS p')->join('sender AS s','s.id','=','p.sender_id')->join('package_statuses AS ps','ps.id','=','p.status_id')->join('delivery AS d','d.id','=','p.delivery_id')->where('p.branch_id',$branch_id)->where('p.driver_id',$driver_id)->whereRaw($more_where)->selectRaw($select_cols)->get();
  }
 
  function getSenderPromotionInfo($d){
    $ss = UM::getUserInfoByToken($d);
    if ($ss->status_code !==200) return $ss; //user not authenticated
     
    $branch_id = $ss->branch_id;
    $sender_id = isset($ss->sender_id)? Sanitizer::sanitize($ss->sender_id):0;

    $result = (object)(['promo_code'=>null,'data']);
    $fixed_price = 0;
    $cod_fee_percent = 0.05;
    $rows = DB::table('sender_fixed_price AS p')->where('p.sender_id',$sender_id)->where('branch_id',$branch_id)->selectRaw('p.price')->take(1)->get();
    foreach($rows as $row) $fixed_price = $row->price;
    $rows = DB::table('sender_cod_charges AS c')->where('c.sender_id',$sender_id)->where('branch_id',$branch_id)->selectRaw('c.cod_fee_percent')->take(1)->get();
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
      $rows = DB::table('sender_type AS t')->join('sender AS s','s.sender_type_id','=','t.id')->where('t.branch_id',$branch_id)->where('s.id',$d->sender_id)->take(1)->selectRaw('t.name AS sender_type, t.id AS sender_type_id')->get();
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

  function package_exists($branch_id,$barcode){
     $rows = DB::table('package as p')->where('p.branch_id',$branch_id)->where('p.qr_code',$barcode)->selectRaw('id')->take(1)->get();
     if(isset($rows[0])) return true; 
     return false;
   }

  //This method is currently NOT used
   //Admin Receive Packages || Arrive | package Arrive| user click Arrive| Admin click "Arrive" button
  //When pickup Status = "Picked" or "Picked and Booked" => Admin User can receive packages, meaning that the packages has Arrived at Warehouse
  function receivePackages($arr = [], $ss =null){
    $ss = $ss?$ss:$this->userInfo;
    $branch_id = $ss->branch_id;
    $d = (object)$arr;

    $delivery_types = ['normal','fast'];
     
    //if @allow_create_order ==1 => order or pickup request is automatically created, if @order_id = 0 or empty.
    $allow_create_order = isset($d->allow_create_order)?$d->allow_create_order:0;
    
    $warehouse_id = isset($d->warehouse_id)?Sanitizer::sanitize($d->warehouse_id):null;
    $order_id = isset($d->order_id)? $d->order_id:0;
    $sender_id = isset($d->sender_id)? $d->sender_id:0;
    $d->pick_on_arrival = isset($d->pick_on_arrival)?$d->pick_on_arrival:0;
    $pickup_date = isset($d->pickup_date)?$d->pickup_date:null;
    
    $d->delivery_date = isset($d->delivery_date)?$d->delivery_date:null;
    $driver_id = isset($d->driver_id)?$d->driver_id:null; //This is a driver who picked up the goods. If @driver_id =0 => The goods are brought in Office by the Sellers themselves
   
    if(!(bool)strtotime($d->delivery_date)) $d->delivery_date = getNowTime();
    if(!(bool)strtotime($pickup_date)) $pickup_date = getNowTime();
 
    $sender = $this->getSenderInfo($ss,$sender_id);
    if(!$sender) return DV::error('Sender or merchant identity is not valid');
     
    //if no warehouse_id provided, get it from driver_id
    if (!$warehouse_id || $warehouse_id <=0) $warehouse_id = $this->getWarehouseIdByDriver_default($branch_id,$driver_id);
 
    if (!$warehouse_id || $warehouse_id <=0) return DV::error('Warehouse identity is not valid');
    //NOTE: $allow_create_order = 1 in context of receiving packages that are brought in by Seller directly, no driver pickup and No pickup request order
      $order = null;
      if ($allow_create_order !=1) 
      {
        $order = $this->getOrderInfo($ss,$order_id);
        if(!$order) return DV::error('Order identifier is not valid');  
      } else {
          if($order_id > 0) $order = $this->getOrderInfo($ss,$order_id);
          if ($order_id <=0 || $order == null) {
            $m = (object)array('sender_id'=>$sender->id,'pickup_time'=>$pickup_date,'request_date'=>$d->delivery_date);
            $mResult = $this->createOrder_default($ss,$m);
            //Error in creating default order request 
            if ($mResult->error_message) {
              return DV::error($mResult->error_message);
            } else $order = $mResult->order;
          }
      }
     
     if (!$order || $order ===null) {
        if ($allow_create_order ==1)
           return DV::error("Failed to create default order or default pickup request");
        else return DV::error("Order request or pickup request does not exist");  
    }

    if (!isset($d->packages[0])) return DV::error("មិនឃើញមានកញ្ចប់ទំនិញដែលត្រូវទទួល");  
    
    if ($order_id <=0) $order_id = $order->id; 

    // //Update pickup driver in table "order"
    //   $pickup_method = ($driver_id<=0 || empty($driver_id))?'None':'Driver';
    //   DB::table('order')->where('branch_id',$branch_id)->where('id',$order_id)->update(array('driver_id'=>$driver_id,'pickup_method'=>$pickup_method,'status_id'=>4));
    // //end::create dlviery record if not yet exists
    
    $driver_id = $order->driver_id;
    $delivery_type =null;
    $last_new_barcode =null; // this barcode is passed back to client caller, and it is used to refresh display on Client browser in case that only one package is verified or received by clicking on the small "Print Barcode" button, Not by clickin on OK button
    $errors = [];
    $success_count =0; 
    $i = 0;
    $c = null;
    do {
       if (!isset($d->packages[$i])) break;
          $c = (object)($d->packages[$i]);
          $delivery_type = isset($c->delivery_type)?$c->delivery_type:null; 
          $receiver_phone = isset($c->receiver_phone)?$c->receiver_phone:null;
          //if(!isset($c->receiver_name)) $c->receiver_name = $receiver_phone;
  
          if (!isset($c->commune_id)) $c->commune_id =0;
          if (!isset($c->district_id)) $c->district_id =0;
          if (!isset($c->city_id)) $c->city_id =0;
          $receiver_name = isset($c->receiver_name)?$c->receiver_name:$receiver_phone;
          //$receiver_phone = $c->receiver_phone;
          $receiver_address = isset($c->receiver_address)? Sanitizer::sanitize($c->receiver_address):null;
          //if @zone_code is supplied => use @zone_code to derive commune_id. Otherwise, use @district_id and @commune_id to derive @zone_code
          $delivery_type = isset($c->delivery_type)?Sanitizer::sanitize($c->delivery_type):null;
          // $zone_code = isset($c->zone_code)?Sanitizer::sanitize($c->zone_code):null;
          // $zone_name = isset($c->zone_name)?Sanitizer::sanitize($c->zone_name):null;
          // $city_id = isset($c->city_id)?Sanitizer::sanitize($c->city_id):0;
          // $district_id = isset($c->district_id)?Sanitizer::sanitize($c->district_id):0;
          // $commune_id = isset($c->commune_id)?Sanitizer::sanitize($c->commune_id):0;
          $package_name= null;
          //if no package name specified then use receiver's phone number as package name
          if(!isset($c->package_name)) $package_name = Sanitizer::sanitize($receiver_phone);
      
          $c->delivery_conditions = isset($c->delivery_conditions)? Sanitizer::sanitize($c->delivery_conditions):'';
          //$c->delivery_fee = isset($c->delivery_fee)?Sanitizer::sanitize($c->delivery_fee):0;
          $c->price = isset($c->price)?Sanitizer::sanitize($c->price):0;
          $c->cod = isset($c->cod)?Sanitizer::sanitize($c->cod):0;
          //$c->cod_fee = isset($c->cod_fee)?Sanitizer::sanitize($c->cod_fee):0;
        
          $c->df_payer = isset($c->df_payer)?Sanitizer::sanitize($c->df_payer):null;
          $c->forwarding_cost = isset($c->forwarding_cost)?Sanitizer::sanitize($c->forwarding_cost):0;
          $c->dim_x = isset($c->dim_x)?Sanitizer::sanitize($c->dim_x):0;
          $c->dim_y = isset($c->dim_y)?Sanitizer::sanitize($c->dim_y):0;
          $c->dim_h = isset($c->dim_h)? Sanitizer::sanitize($c->dim_h):0;

          $c->delivery_notes = isset($c->delivery_notes)? Sanitizer::sanitize($c->delivery_notes):null;
            
          $zone =null;
          if(strtolower($c->df_payer) != 'sender' && strtolower($c->df_payer) != 'receiver') {
            $errors[] = "Delivery Fee Payer or DFP is not correct";
          }else if(!in_array(strtolower($delivery_type),$delivery_types)) {
             $errors[] = "Delivery Type is not correct. Delivery Type must be Normal or Fast";
          } else {
 
          $zone = $this->getZoneByCode($ss->branch_id,$c->zone_code);
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
                  //$other_fees =0;
                  $base_fee =0;
                  $price = isset($c->price)?$c->price:0;
                  $billed_kg = isset($c->billed_kg)?$c->billed_kg:0;
                  $cod = isset($c->cod)?$c->cod:0;
  
                if (!isset($c->product_type)) $c->product_type = null;

                $tax_percent = $this->getTaxByProductType($c->product_type);
                $tax_amount = $c->price * $tax_percent/100;

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

                  $pInfo = $this->getDeliveryPriceInfo($branch_id,$sender_id,$delivery_type,$c->zone_code,$billed_kg,$cod);
                  if ($pInfo) {
                      $delivery_fee = $pInfo->delivery_fee;
                      $base_fee =$pInfo->base_fee;
                      $cod_fee_percent = $pInfo->cod_fee_percent;
                      if(!$cod) $cod = $pInfo->cod; 
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
             //$sender_type_id = $order->sender_type_id;
              
                 //Add new package, if the package's barcode is empty 
                 $c->barcode = isset($c->barcode)?$c->barcode:null;
              
                 if (empty($c->barcode) || !$this->package_exists($branch_id,$c->barcode)) { 
                     //if(empty($c->barcode)) $c->barcode = $this->createQRCode($ss);
                     $nowTime = getNowTime();
                     $last_new_barcode = $c->barcode;
                      DB::table('package')->insert(array(
                        'branch_id'=>$branch_id,
                        'warehouse_id'=>$warehouse_id,
                        'qr_code'=>'0',
                        'order_id'=>$order_id,
                        'delivery_id'=>null,
                        'driver_id'=>null,
                        'pickup_time'=>convertDate($pickup_date),
                        'pickup_driver_id'=>$driver_id, //Driver who came to pick up the package => used for commission, if any
                        'tracking_number'=>$order_code, //order_code becomes tracking number, For seller or sender to track all their packages 
                        'sender_id'=>$sender->id,
                        'exchange_rate'=>$sender->exchange_rate,
                        'sender_name'=>$sender->name, 
                        'sender_email'=>$sender->email,
                        'sender_phone'=>$sender->phone_number,
                        'sender_type'=>$sender->sender_type,
                        'delivery_condition'=>$c->delivery_conditions,
                        'delivery_type'=>$delivery_type,
                        'package_name'=>$package_name,
                        'receiver_name'=>$receiver_name,
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
                        'create_user'=>$ss->full_name,
                        'create_uid'=>$ss->user_id,
                        'create_date'=>$nowTime,
                        'update_user'=>$ss->full_name,
                        'update_date'=>$nowTime,
                        'update_uid'=>$ss->user_id,
                        'arrival_time'=>$nowTime
                    ));
                    self::setBarcode(DB::getPdo()->lastInsertId());
                 } else {
                        $nowTime = getNowTime(); 
                        DB::table('package')->where('branch_id',$branch_id)->where('qr_code',$c->barcode)->update(array( 
                          'exchange_rate'=>$sender->exchange_rate,
                          'delivery_type'=>$delivery_type,
                          //'qr_code'=>$bar_code,
                          'package_name'=>$package_name,
                          'receiver_name'=>$receiver_name,
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
                          'cod_fee'=>$cod_fee, //$cod_fee,
                          'forwarding_cost'=>$c->forwarding_cost,
                          'tax_percent'=>$tax_percent,
                          'tax_amount'=>$tax_amount,
                          'driver_total'=>$driver_total,
                          'sender_total'=>$sender_total,
                          'status_id'=>$package_status_id, //4 = "Picked and Booked"
                          'create_user'=>$ss->full_name,
                          'create_uid'=>$ss->user_id,
                          'create_date'=>$nowTime,
                          'update_user'=>$ss->full_name,
                          'update_date'=>$nowTime,
                          'update_uid'=>$ss->user_id,
                          'arrival_time'=>$nowTime
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
    
    //Update number of package in table "order.qty"
    DB::update(DB::raw("UPDATE `order` SET completed =1, status_id =5, qty = (SELECT COUNT(p.id) FROM package AS p WHERE p.branch_id = `order`.branch_id AND p.order_id =`order`.`id`) WHERE id ='".$order_id."' AND branch_id ='".$branch_id."'"));
 
    if ($success_count <= 0) return DV::error(isset($errors[0])?$errors[0]:'Some problem occured during receiving package'); 
  
    $status_id =3; //Picked
    if ($d->pick_on_arrival ==1) $status_id =4;//Picked and Booked
    //$result->status_id = $status_id;
    $status = $this->getPackageStatus($status_id);

    $order = self::getOrderProps($branch_id,$order_id,['qty','o.code AS order_code','driver_name','s.`id` AS sender_id','o.driver_id','(SELECT d.`name` FROM `driver` AS d WHERE d.id =o.driver_id LIMIT 1) driver_name','o.status_id','status','o.completed']);
    //begin:: notify other Web Admin
      $message = "Order លេខ ".$order->order_code." មកដល់ឃ្លាំង $success_count កញ្ចប់!";
      $event_data = (object)['branch_id'=>$branch_id,'order_id'=>$order_id,'order_code'=>$order->order_code,'status'=>$order->status,'status_id'=>$order->status_id,'completed'=>$order->completed,'driver_id'=>$order->driver_id,'driver_name'=>$order->driver_name,'message'=>$message,'title'=>'Packages Arrived'];
      Notifier::notify_admin('order_status_changed',$event_data);   
    //end:: notify other Web Admin

    //begin:: notify to Merchant
        $order->event_name ='order_status_changed';
        //return DV::error(var_dump($order));
        $cdata=[
          [
            'user_class'=>'merchant',
            'target_user_id'=>$order->sender_id,
            'persist'=>1,
            'data'=>$order,
            'title'=>'At Warehouse',
            'message'=>"Your order $order->order_code ដល់ឃ្លាំង!" 
          ]
        ];
        Notifier::notify_mobile($branch_id,$cdata);
    //end::notify to Maerchant

    return DV::depends(1,[
       'order_id'=>$order_id,
       'errors'=>$errors,
       'error_count'=>count($errors),
       'success_count'=>$success_count,
       'delivery_id'=>null,
       'last_new_barcode'=>$last_new_barcode,
       'status_id'=>$status_id,
       'status'=>$status
    ]);
  }

  function getDeliveryItemsByDriver($arr,$ss=null){
    $ss =$ss?$ss:$this->userInfo;
    $d = (object)$arr;
    $d->sender_id = isset($d->sender_id)?$d->sender_id:null;
    /** if $is_from_mobile => driver _id is required */
    $is_from_mobile = in_array(strtolower($ss->user_class),['driver','merchant']);

    $branch_id = $ss->branch_id;
    $driver_id = null;
    $is_from_mobile = in_array(strtolower($ss->user_class),['merchant','driver']);
    if($is_from_mobile) 
      $driver_id = $ss->official_id;
    else $driver_id = isset($d->driver_id)? Sanitizer::sanitize($d->driver_id):null;
    
    $start_date = isset($d->start_date)? convertDate($d->start_date):null;
    $end_date = isset($d->end_date)? convertDate($d->end_date):null;

    $cache_key = 'delivertitemsd_'.$driver_id;
    foreach($d as $key => $value) $cache_key .= $value;
    $cache_key = sha1($cache_key);
    $cache_data = Cache::get($cache_key);
    if($cache_data !==null) return $cache_data;

    /* Initial delivery status_id is -1 (all statuses invluding on delivery, delivered, failed, returned etc ) */
    $status_id = -1;
    if(isset($d->status_id)) $status_id = $d->status_id;
    if($status_id == -1) $status_id = null;
    
    $str_pmt_status ='1=1';
    $str_status ='2=2'; 
    $str_sender = '3=3';
    $str_dates = '4=4';
    $str_delivery_type ='5=5';
    $str_driver = '6=6';
    $str_search = '2=2';

    $search_value = isset($d->search_value)?$d->search_value:null;
    if($search_value)
    {
      $search_value = escape_like_str( $search_value);
      $str_search = "(p.receiver_phone = '$search_value' OR s.phone_number ='$search_value'  OR d.`name` LIKE '%$search_value%' OR s.`name` LIKE '%$search_value%')";
    }else{

       $default_view = (!$start_date && !$end_date && !$driver_id);
       if($default_view){
          return [];
         //$str_pmt_status ='IFNULL(p.driver_pmt_status_id,0) =0 AND p.status_id =8';
       
       }else {
          $end_date = convertDate($end_date)?? date('Y-m-d');
          $start_date = convertDate($start_date)?? convertDate($end_date);

          /** $driver_pmt_status_id = 0 or empty => "Unpiad", $driver_pmt_status_id = -1 => " All pmt statuses" */
          $driver_pmt_status_id  = isset($d->driver_pmt_status_id)?$d->driver_pmt_status_id:0;
          if(isset($d->pmt_status_id)) $driver_pmt_status_id = $d->pmt_status_id;
          if($driver_pmt_status_id ==2)
             $str_pmt_status ='IFNULL(p.driver_pmt_status_id,0) = 0 AND p.driver_trx_id IS NOT NULL'; 
          else if ($driver_pmt_status_id ==0) 
            $str_pmt_status ='IFNULL(p.driver_pmt_status_id,0) =0 AND p.driver_trx_id IS NULL'; 
          else if ($driver_pmt_status_id ==1)
            $str_pmt_status ='p.driver_pmt_status_id = 1';

          $end_date = convertDate($end_date);
          $start_date = convertDate($start_date);
          if($status_id > 8)
            $str_dates = 'DATE(p.delivery_time) >=\''.$start_date.'\' AND DATE(p.delivery_time) <= \''.$end_date.'\'';
          else $str_dates = 'DATE(p.arrival_time) >=\''.$start_date.'\' AND DATE(p.arrival_time) <= \''.$end_date.'\'';

          $delivery_type = isset($d->delivery_type)?$d->delivery_type:null;
          $str_delivery_type = $delivery_type? 'p.delivery_type =\''.$delivery_type.'\'': '2=2';
          if ($status_id > 0) $str_status ='p.status_id ='.$status_id;
          $str_sender = $d->sender_id > 0? 'p.sender_id ='.$d->sender_id : '3=3';
          $str_driver = $driver_id > 0? 'p.driver_id ='.$driver_id : '5=5';
       } 
        
    }
   
    $remarks = ',CASE (p.status_id =9 || p.status_id =11) WHEN 1 THEN p.failure_notes ELSE p.delivery_notes END AS notes'; 
    $selectCols ='HEX(p.driver_trx_id) driver_trx_id,p.id AS package_id, p.qr_code AS barcode,p.delivery_type, s.name AS sender_name, s.phone_number AS sender_phone, p.receiver_name, p.receiver_phone, IFNULL(p.receiver_address,p.zone_name) AS receiver_address'.$remarks.', p.zone_code, p.zone_name,  
    formatTime(p.arrival_time) AS arrival_date,
    formatTime(p.arrival_time) AS arrival_time,
    formatTime(p.delivery_time) AS finish_date,
    formatTime(trip.depart_time) AS depart_time,formatTime(p.delivery_time) AS delivery_time,'.
    ' \'\' AS driver_pmt_info,\'\' AS sender_pmt_info,'.
    //'CASE p.driver_trx_id WHEN NULL THEN null ELSE (SELECT CONCAT(formatTime(r.payment_date),\'|\',r.create_user ) FROM cash_receipts as r WHERE r.payer_id = p.driver_id AND r.trx_id =p.driver_trx_id LIMIT 1) END AS driver_pmt_info,'.
    //'CASE p.sender_trx_id WHEN NULL THEN null ELSE (SELECT CONCAT(formatTime(r.payment_date),\'|\',r.create_user ) FROM cash_disbursements AS r WHERE r.payee_id = p.sender_id AND r.trx_id =p.sender_trx_id LIMIT 1) END AS sender_pmt_info,'.
    'CASE p.cod WHEN 1 THEN IFNULL(p.price,0) ELSE 0 END AS cod_amount,p.price,
    p.cod,IFNULL(p.cod_fee,0) AS cod_fee,
    IFNULL(p.base_fee,0) AS base_fee,
    IFNULL(p.delivery_fee,0) AS delivery_fee,
    LOWER(p.df_payer) AS df_payer,
    ROUND(IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0),2) AS fees,
    IFNULL(p.driver_adjust_amount,0) AS driver_adjust_amount, 
    IFNULL(p.forwarding_cost,0) AS forwarding_cost,
    0 AS paid_to_sender,
    p.driver_total AS paid_by_driver,
    IFNULL(p.driver_total,0) AS driver_total, 
    IFNULL(p.sender_total,0) AS sender_total,
    IFNULL(p.driver_pmt_status_id,0) AS driver_pmt_status_id,
    p.sender_pmt_status_id,
    p.driver_pmt_notes,
    d.name AS driver_name,
    d.code as driver_code,
    d.phone_number AS driver_phone,
    \'USD\' AS currency,
    \'$\' AS cur,
    p.billed_kg,
    p.actual_kg,
    getPackageLastUpdateNotes(p.id,\'change_cod\') AS cod_change_notes,
    IFNULL(p.sender_net_amount,0) AS sender_net_amount,
    CASE p.status_id WHEN 9 THEN p.failure_notes WHEN 11 THEN p.failure_notes ELSE p.delivery_notes END notes,
    p.status_id,ps.name AS status';
    
    $max_rows = 1000;
    $query = DB::table('package AS p')->join('package_statuses AS ps','ps.id','=','p.status_id')->join('driver AS d','d.id','=','p.driver_id')->join('delivery AS trip','trip.id','=','p.delivery_id')->join('sender as s','s.id','=','p.sender_id')->where('p.branch_id',$branch_id)->whereRaw($str_search)->whereRaw($str_status)->whereRaw($str_dates)->whereRaw($str_delivery_type)->whereRaw($str_driver)->whereRaw($str_sender)->whereRaw($str_pmt_status)->selectRaw($selectCols)->take($max_rows);
    //Log::info($query->toSql());
    //$count = $query->count('p.id');
    $data = $query->get();
    Cache::put($cache_key,$data,10);
    return $data;

    // $unpaid_amount = 0;
    // $unpaid_count = 0;
    // if ($driver_id > 0){
    //   //Get unpaid balance for that Driver only
    //   $dInfo = self::getDriverDueInfo($driver_id);
    //   if($dInfo){
    //     $unpaid_amount = $dInfo->amount;
    //     $unpaid_count = $dInfo->package_count;
    //   }
    // }else{
    //    //Get Unpaid Balance for all Drivers by filters
    //    foreach($rows as $row){
    //       if($row->driver_pmt_status_id ==0 && $row->status_id ==8){
    //          $unpaid_amount += $row->driver_total;
    //       }
    //    }
    // }
    // return (object)[
    //    'package_count'=>$count,
    //    'unpaid_amount'=>$unpaid_amount,
    //    'unpaid_count'=>$unpaid_count,
    //    'items'=>$rows
    // ];
  }

  //returns list of items delivered by driver. This is used by both Backend view and Mobile Driver App 
  //@d = {'sender_id', or 'driver_id','date' } // @sender_id or @driver_id
  function getDeliveryItemsByDriver_mobile($arr,$ss=null){
    $ss =$ss?$ss:$this->userInfo;
    $d = (object)$arr;
    $d->sender_id = isset($d->sender_id)?$d->sender_id:null;
    /** if $is_from_mobile => driver _id is required */
    $is_from_mobile = in_array(strtolower($ss->user_class),['driver','merchant']);
    
    $branch_id = $ss->branch_id;
    $driver_id = null;
    if($is_from_mobile) 
       $driver_id = $ss->official_id;
    else $driver_id = isset($d->driver_id)?Sanitizer::sanitize($d->driver_id):null;
    
    //$sender_id = isset($d->sender_id)? Sanitizer::sanitize($d->sender_id):null;
    $start_date = isset($d->start_date)? convertDate($d->start_date):null;
    $end_date = isset($d->end_date)? convertDate($d->end_date):null;

    /* Initial delivery status_id is -1 (all statuses invluding on delivery, delivered, failed, returned etc ) */
    $status_id = -1;
    if(isset($d->status_id)) $status_id = $d->status_id;
    if($status_id == -1) $status_id = null;
     
    $str_pmt_status ='1=1';
    $str_status ='9=9'; 
    $str_sender = '8=8';
    $str_dates = '7=7';
    $str_delivery_type ='3=3';
    $str_driver = '6=6';
 
    $search_value = isset($d->search_value)?$d->search_value:null;

    $cache_key = 'drivdelivertitemmobile_'.$driver_id;
    foreach($d as $key => $value) $cache_key .= $value;
    $cache_key = sha1($cache_key);
    $cache_data = Cache::get($cache_key);
    if($cache_data !==null) return $cache_data;

    $str_search = '2=2';
    if($search_value)
    {
      $search_value = escape_like_str( $search_value);
      $str_search = "(p.receiver_phone = '$search_value' OR s.phone_number ='$search_value'  OR d.`name` LIKE '%$search_value%' OR s.`name` LIKE '%$search_value%')";
    }else{

      $default_view = (!$start_date && !$end_date);
      if($default_view){
       $str_pmt_status ='IFNULL(p.driver_pmt_status_id,0) =0 AND p.status_id =8';
      }else {
         $start_date = convertDate($start_date) ?? date('Y-m-d');
         $end_date = convertDate($end_date) ?? date('Y-m-d');

         /** $driver_pmt_status_id = 0 or empty => "Unpiad", $driver_pmt_status_id = -1 => " All pmt statuses" */
         $driver_pmt_status_id  = isset($d->driver_pmt_status_id)?$d->driver_pmt_status_id:0;
         if(isset($d->pmt_status_id)) $driver_pmt_status_id = $d->pmt_status_id;
         if($driver_pmt_status_id ==2)
            $str_pmt_status ='IFNULL(p.driver_pmt_status_id,0) = 0 AND p.driver_trx_id IS NOT NULL'; 
         else if ($driver_pmt_status_id ==0) 
           $str_pmt_status ='IFNULL(p.driver_pmt_status_id,0) =0 AND p.driver_trx_id IS NULL'; 
         else if ($driver_pmt_status_id ==1)
           $str_pmt_status ='p.driver_pmt_status_id = 1';

         $end_date = convertDate($end_date);
         $start_date = convertDate($start_date);
         if($status_id > 8)
           $str_dates = 'DATE(p.delivery_time) >=\''.$start_date.'\' AND DATE(p.delivery_time) <= \''.$end_date.'\'';
         else $str_dates = 'DATE(p.arrival_time) >=\''.$start_date.'\' AND DATE(p.arrival_time) <= \''.$end_date.'\'';

         $delivery_type = isset($d->delivery_type)?$d->delivery_type:null;
         $str_delivery_type = $delivery_type? 'p.delivery_type =\''.$delivery_type.'\'': '2=2';
         if ($status_id > 0) $str_status ='p.status_id ='.$status_id;
         $str_sender = $d->sender_id > 0? 'p.sender_id ='.$d->sender_id : '3=3';
      } 
     
    }
    $str_driver = $driver_id > 0? 'p.driver_id ='.$driver_id : '5=5';
    $remarks = ',CASE (p.status_id =9 || p.status_id =11) WHEN 1 THEN p.failure_notes ELSE p.delivery_notes  END AS notes'; 
    $selectCols ='HEX(p.driver_trx_id) driver_trx_id,p.id AS package_id, p.qr_code AS barcode,p.delivery_type, s.name AS sender_name, s.phone_number AS sender_phone, p.receiver_name, p.receiver_phone, IFNULL(p.receiver_address,p.zone_name) AS receiver_address'.$remarks.', p.zone_code, p.zone_name,  
    formatTime(p.arrival_time) AS arrival_date,
    formatTime(p.arrival_time) AS arrival_time,
    formatTime(p.delivery_time) AS finish_date,
    formatTime(trip.depart_time) AS depart_time,formatTime(p.delivery_time) AS delivery_time,'.
    ' \'\' AS driver_pmt_info,\'\' AS sender_pmt_info,'.
    //'CASE p.driver_trx_id WHEN NULL THEN null ELSE (SELECT CONCAT(formatTime(r.payment_date),\'|\',r.create_user ) FROM cash_receipts as r WHERE r.payer_id = p.driver_id AND r.trx_id =p.driver_trx_id LIMIT 1) END AS driver_pmt_info,'.
    //'CASE p.sender_trx_id WHEN NULL THEN null ELSE (SELECT CONCAT(formatTime(r.payment_date),\'|\',r.create_user ) FROM cash_disbursements AS r WHERE r.payee_id = p.sender_id AND r.trx_id =p.sender_trx_id LIMIT 1) END AS sender_pmt_info,'.
    'CASE p.cod WHEN 1 THEN IFNULL(p.price,0) ELSE 0 END AS cod_amount,p.price,
    p.cod,IFNULL(p.cod_fee,0) AS cod_fee,
    IFNULL(p.base_fee,0) AS base_fee,
    IFNULL(p.delivery_fee,0) AS delivery_fee,
    LOWER(p.df_payer) AS df_payer,
    ROUND(IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0),2) AS fees,
    IFNULL(p.driver_adjust_amount,0) AS driver_adjust_amount, 
    IFNULL(p.forwarding_cost,0) AS forwarding_cost,
    0 AS paid_to_sender,
    p.driver_total AS paid_by_driver,
    IFNULL(p.driver_total,0) AS driver_total, 
    IFNULL(p.sender_total,0) AS sender_total,
    IFNULL(p.driver_pmt_status_id,0) AS driver_pmt_status_id,
    p.sender_pmt_status_id,
    p.driver_pmt_notes,
    d.name AS driver_name,
    d.code as driver_code,
    d.phone_number AS driver_phone,
    \'$\' AS cur,
    p.billed_kg,
    p.actual_kg,
    getPackageLastUpdateNotes(p.id,\'change_cod\') AS cod_change_notes,
    IFNULL(p.sender_net_amount,0) AS sender_net_amount,
    CASE p.status_id WHEN 9 THEN p.failure_notes WHEN 11 THEN p.failure_notes ELSE p.delivery_notes END notes,
    p.status_id,ps.name AS status';
    
    $max_rows = 1000;
    $query = DB::table('package AS p')->join('package_statuses AS ps','ps.id','=','p.status_id')->join('driver AS d','d.id','=','p.driver_id')->join('delivery AS trip','trip.id','=','p.delivery_id')->join('sender as s','s.id','=','p.sender_id')->where('p.branch_id',$branch_id)->whereRaw($str_search)->whereRaw($str_status)->whereRaw($str_dates)->whereRaw($str_delivery_type)->whereRaw($str_driver)->whereRaw($str_sender)->whereRaw($str_pmt_status)->selectRaw($selectCols)->take($max_rows);
    // $count = $query->count('p.id');
    $rows = $query->get();
    Cache::put($cache_key,$rows,12);
    return $rows;
    // $unpaid_amount = 0;
    // $unpaid_count = 0;
    // if ($driver_id > 0){
    //   //Get unpaid balance for that Driver only
    //   $dInfo = self::getDriverDueInfo($driver_id);
    //   if($dInfo){
    //     $unpaid_amount = $dInfo->amount;
    //     $unpaid_count = $dInfo->package_count;
    //   }
    // }else{
    //    //Get Unpaid Balance for all Drivers by filters
    //    foreach($rows as $row){
    //       if($row->driver_pmt_status_id ==0 && $row->status_id ==8){
    //          $unpaid_amount += $row->driver_total;
    //       }
    //    }
    // }
    // return (object)[
    //    'package_count'=>$count,
    //    'unpaid_amount'=>$unpaid_amount,
    //    'unpaid_count'=>$unpaid_count,
    //    'items'=>$rows
    // ];
  }

  //return amount due from each driver since 31 days ago
//getAmountDue by driver and this method is used in Driver Mobile App
static function getDriverDueInfo($driver_id){
  if (!$driver_id) return (object)[
    'amount'=>0,
    'package_count'=>0
  ];
  $last_week_date = convertDate(Carbon::now()->addDay(-31));
  $more_wheres = 'DATE(p.delivery_time) >= \''.$last_week_date.'\' AND IFNULL(p.driver_pmt_status_id,0) = 0 AND p.status_id = 8';
  $row = DB::table('package AS p')->where('p.driver_id', $driver_id)->whereRaw($more_wheres)->selectRaw('SUM(IFNULL(p.driver_total,0)) AS total,COUNT(p.id) AS item_count')->get()->first();
  return (object)[
     'amount'=> ($row? $row->total: 0),
     'package_count'=> ($row? $row->item_count:0)
  ];
 }
 
  function getDeliveryItemsBySender_mobile($arr,$ss=null){
    $ss =$ss?$ss:$this->userInfo;   
    $branch_id =  $ss->branch_id;
    $d = (object)$arr;
    $sender_id = null;
    $is_from_mobile = in_array(strtolower($ss->user_class),['merchant','driver']);
    if($is_from_mobile)
      $sender_id = $ss->official_id; 
    else
      $sender_id = isset($d->sender_id)? Sanitizer::sanitize($d->sender_id):null;
    // $use_default_dates = isset($d->use_default_dates)?$d->use_default_dates:0;
    $start_date = isset($d->start_date)? convertDate($d->start_date):null;
    $end_date = isset($d->end_date)? convertDate($d->end_date):null;
    $status_id = isset($d->status_id)?$d->status_id:null;
    $delivery_type = isset($d->delivery_type)?$d->delivery_type:null;

    /**WHEN $sender_pmt_status_id = 0 or empty => "Unpaid". WHEN $sender_pmt_status_id = -1 => "All Pmt Statuses" */
    $sender_pmt_status_id = isset($d->sender_pmt_status_id)?$d->sender_pmt_status_id:null;
   
    //$view_type = isset($d->view)?$d->view:'default';
    $is_from_mobile = isset($d->is_from_mobile)?$d->is_from_mobile:0;

    $search_value = isset($d->search_value)?$d->search_value:null;

    $cache_key = 'delivitemsendermobile_'.$sender_id;
    foreach($d as $key => $value) $cache_key .= $value;
    $cache_key = sha1($cache_key);
    $cache_data = Cache::get($cache_key);
    if($cache_data !==null) return $cache_data;

    $str_search = '2=2';
    $str_pmt_status ='5=5';
    $str_delivery_type ='3=3';
    $str_dates = '2=2';
    $str_status ='6=6';
   
    if($search_value)
    {
      $search_value = escape_like_str( $search_value);
      $str_search = '(p.receiver_phone = \''.$search_value.'\' OR s.phone_number =\''.$search_value.'\'  OR d.`name` LIKE \'%'.$search_value.'%\' OR s.`name` LIKE \'%'.$search_value.'%\')';
    }else{
   
      $default_view = (!$start_date && !$end_date);
      if ($default_view){
          $str_pmt_status  ='IFNULL(p.sender_pmt_status_id,0) = 0 AND p.status_id = 8';
      }else{
          $end_date = convertDate($end_date) ?? date('Y-m-d');
          $start_date = convertDate($start_date) ?? convertDate($end_date);
          $str_delivery_type = $delivery_type? 'p.delivery_type =\''.$delivery_type.'\'' : '3=3';
          if ($status_id > 0) $str_status ='p.status_id = '.$status_id;
          
          if ($status_id < 8 || !$status_id){
             $str_dates = 'DATE(p.arrival_time) >= \''.convertDate($start_date).'\' AND DATE(p.arrival_time) <= \''.convertDate($end_date).'\' ';
          }else if ($status_id >= 8){
             $str_dates = 'DATE(p.delivery_time) >= \''.convertDate($start_date).'\' AND DATE(p.delivery_time) <= \''.convertDate($end_date).'\' ';
          }
          if ($sender_pmt_status_id !== null && $sender_pmt_status_id >=0 ){
            $str_pmt_status  ='IFNULL(p.sender_pmt_status_id,0) = '.$sender_pmt_status_id;
          }
      } 
     
      //if ($d->driver_id > 0) $str_driver =' p.sender_id ='.$d->driver_id;
    }
    
    if ($sender_id > 0) $str_sender =' p.sender_id ='.$sender_id;
    $view_type ='default';
    $remarks = ',CASE (p.status_id =9 or p.status_id =11) WHEN 1 THEN p.failure_notes ELSE p.delivery_notes  END AS notes';
    $selectCols = '\''.$view_type.'\' AS view, p.id AS package_id, IFNULL(p.sender_confirmed,0) AS sender_confirmed, p.qr_code AS barcode,p.delivery_type,s.`name` AS sender_name, s.phone_number AS sender_phone, p.receiver_name, p.receiver_phone, IFNULL(p.receiver_address,p.zone_name) As receiver_address'.$remarks.',p.zone_code, p.zone_name,  
    CASE p.status_id WHEN 8 THEN formatDate(p.arrival_time) ELSE formatDate(p.delivery_time) END AS delivery_date,
    CASE p.cod WHEN 1 THEN (IFNULL(p.price,0) - ifnull(p.cod_fee,0)) ELSE 0 END AS cod_amount,
    p.cod,
    p.df_payer,
    IFNULL(p.price,0) AS price,
    IFNULL(p.sender_adjust_amount,0) AS sender_adjust_amount,
    IFNULL(p.forwarding_cost,0) AS forwarding_cost,
    formatTime(p.arrival_time) AS arrival_date,
    formatTime(p.delivery_time) AS finish_date,
    ifnull(p.cod_fee,0) AS cod_fee, 
    IFNULL(p.base_fee,0) AS base_fee,
    IFNULL(p.delivery_fee,0) AS delivery_fee,
    (IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0)) AS fees,
    0 AS paid_to_sender,
    0 AS paid_by_driver,
    IFNULL(p.driver_total,0) AS driver_total, 
    p.sender_total AS sender_total,
    IFNULL(p.sender_pmt_status_id,0) AS sender_pmt_status_id,
    p.sender_pmt_notes,
    d.name AS driver_name,
    d.code as driver_code,
    d.phone_number AS driver_phone,
    \'$\' AS cur,
    IFNULL(p.sender_net_amount,0) AS sender_net_amount,
    p.billed_kg,
    p.actual_kg,
    p.status_id,ps.name AS `status`';
    $max_row = 2000;
    
    $rows = DB::table('package AS p')->join('package_statuses AS ps','ps.id','=','p.status_id')->join('driver AS d','d.id','=','p.driver_id')->join('sender as s','s.id','=','p.sender_id')->where('p.branch_id',$branch_id)->whereRaw($str_search)->whereRaw($str_sender)->whereRaw($str_delivery_type)->whereRaw($str_pmt_status)->whereRaw($str_dates)->whereRaw($str_status)->selectRaw($selectCols)->take($max_row)->get();
    $count =0;
    $unpaid_amount  =0;
    foreach($rows as $row){
      $sender_amt = self::getMerchantBalance($row);
      if($row->status_id ==8 && !$row->sender_pmt_status_id){ 
         $unpaid_amount += $sender_amt;
      }
      //  /** For HOU Merchant App => sender_total is amount to be paid to Sender or merchant */
      //  $sender_total = $row->price - $row->base_fee - $row->delivery_fee;
      // $row->sender_total = $sender_total;
      $row->sender_total =$sender_amt;
      $count++;
    } 
    $data = (object)[
       'unpaid_amount'=>number_format($unpaid_amount,2,'.',''),
       'package_count'=>$count,
       'packages'=>$rows
    ];
    Cache::put($cache_key,$data,12);
    return $data;
  }

  function getDeliveryItemsBySender($arr,$ss=null){
    $ss =$ss?$ss:$this->userInfo;   
    $branch_id =  $ss->branch_id;
    $d = (object)$arr;
    $d->driver_id = isset($d->driver_id)? $d->driver_id:null;
    $sender_id = null;
    $is_from_mobile = in_array(strtolower($ss->user_class),['merchant','driver']);
    if($is_from_mobile)
      $sender_id = $ss->official_id; 
    else
      $sender_id = isset($d->sender_id)? Sanitizer::sanitize($d->sender_id):null;
    // $use_default_dates = isset($d->use_default_dates)?$d->use_default_dates:0;
    $start_date = isset($d->start_date)? convertDate($d->start_date):null;
    $end_date = isset($d->end_date)? convertDate($d->end_date):null;
    $status_id = isset($d->status_id)?$d->status_id:null;
    $delivery_type = isset($d->delivery_type)?$d->delivery_type:null;

    /**WHEN $sender_pmt_status_id = 0 or empty => "Unpaid". WHEN $sender_pmt_status_id = -1 => "All Pmt Statuses" */
    $sender_pmt_status_id = isset($d->sender_pmt_status_id)?$d->sender_pmt_status_id:0;
    if (!$sender_pmt_status_id) $sender_pmt_status_id = isset($d->pmt_status_id)?$d->pmt_status_id:0;

    //$view_type = isset($d->view)?$d->view:'default';
    $is_from_mobile = isset($d->is_from_mobile)?$d->is_from_mobile:0;

    $search_value = isset($d->search_value)?$d->search_value:null;

    $cache_key = 'delivertitemss_'.$sender_id;
    foreach($d as $key => $value) $cache_key .= $value;
    $cache_key = sha1($cache_key);
    $cache_data = Cache::get($cache_key);
    if($cache_data !==null) return $cache_data;

    $str_search = '2=2';
    $str_driver = '5=5';
    $str_pmt_status ='5=5';
    $str_delivery_type ='3=3';
    $str_dates = '2=2';
    $str_status ='6=6';
    $str_sender = '9=9';

    if($search_value)
    {
      $search_value = escape_like_str( $search_value);
      $str_search = "(p.receiver_phone = '$search_value' OR s.phone_number ='$search_value'  OR d.`name` LIKE '%$search_value%' OR s.`name` LIKE '%$search_value%')";
    }else{
   
      $default_view = (!$start_date && !$end_date && !$sender_id);
      if ($default_view){
          return [];
          //$str_pmt_status  ='IFNULL(p.sender_pmt_status_id,0) = 0 AND p.status_id = 8';
      }else{
          $end_date = convertDate($end_date)?? date('Y-m-d');
          $start_date = convertDate($start_date)?? convertDate($end_date);
          $str_delivery_type = $delivery_type? 'p.delivery_type =\''.$delivery_type.'\'' : '3=3';
          if ($status_id > 0) $str_status ='p.status_id = '.$status_id;
          
          if ($status_id < 8 || !$status_id){
            $str_dates = 'DATE(p.arrival_time) >= \''.convertDate($start_date).'\' AND DATE(p.arrival_time) <= \''.convertDate($end_date).'\' ';
          }else if ($status_id >= 8){
            $str_dates = 'DATE(p.delivery_time) >= \''.convertDate($start_date).'\' AND DATE(p.delivery_time) <= \''.convertDate($end_date).'\' ';
          }
          if ($sender_pmt_status_id >=0){
            $str_pmt_status  ='IFNULL(p.sender_pmt_status_id,0) = '.$sender_pmt_status_id;
          }

           if($d->driver_id > 0) $str_driver ='p.driver_id ='.$d->driver_id;
      } 
     
      if ($sender_id > 0) $str_sender =' p.sender_id ='.$sender_id;
    }
  
    $view_type ='default';
    $remarks = ',CASE (p.status_id =9 or p.status_id =11) WHEN 1 THEN p.failure_notes ELSE p.delivery_notes  END AS notes';
    $selectCols = '\''.$view_type.'\' AS view, p.id AS package_id, IFNULL(p.sender_confirmed,0) AS sender_confirmed, p.qr_code AS barcode,p.delivery_type,s.`name` AS sender_name, s.phone_number AS sender_phone, p.receiver_name, p.receiver_phone, IFNULL(p.receiver_address,p.zone_name) As receiver_address'.$remarks.',p.df_payer,p.zone_code, p.zone_name,IFNULL(p.price,0) AS price,  
    CASE p.status_id WHEN 8 THEN formatDate(p.arrival_time) ELSE formatDate(p.delivery_time) END AS delivery_date,
    CASE p.cod WHEN 1 THEN (IFNULL(p.price,0) - ifnull(p.cod_fee,0)) ELSE 0 END AS cod_amount,
    p.cod,
    formatTime(p.arrival_time) AS arrival_date,
    formatTime(p.delivery_time) AS finish_date,
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
    d.name AS driver_name,
    d.code as driver_code,
    d.phone_number AS driver_phone,
    \'USD\' AS currency,
    \'$\' AS cur,
    IFNULL(p.sender_net_amount,0) AS sender_net_amount,
    p.billed_kg,
    p.actual_kg,
    p.status_id,ps.name AS `status`';
    $max_row = 1500;
    $query = DB::table('package AS p')->join('package_statuses AS ps','ps.id','=','p.status_id')->join('driver AS d','d.id','=','p.driver_id')->join('sender as s','s.id','=','p.sender_id')->where('p.branch_id',$branch_id)->whereRaw($str_search)->whereRaw($str_sender)->whereRaw($str_dates)->whereRaw($str_driver)->whereRaw($str_sender)->whereRaw($str_delivery_type)->whereRaw($str_pmt_status)->whereRaw($str_status)->selectRaw($selectCols)->take($max_row);
    //Log::info($query->toSql());
    $rows = $query->get();
    Cache::put($cache_key,$rows,10);
    return $rows;
  }
  
  /** calculate sender's balance for settlement */
  static function getMerchantBalance($item){
     $cod_amount = 0;
     if($item->cod == 1){
       $cod_amount = $item->price;
     }
     if($item->price > 0) $cod_amount = $item->price - (isset($item->cod_fee)?$item->cod_fee:0);
     $fees = $item->base_fee + $item->delivery_fee;
     if (strtolower($item->df_payer =='sender')){
        $cod_amount -= $fees;
     }
     $taxi_fee = isset($item->forwarding_cost)?$item->forwarding_cost:0;
     $cod_amount -= $taxi_fee;
     return $cod_amount;
  }
    /**
     * getOrderSummaryCounts()
     * Summary counts
     * retutns list of COUNTS of packages with status starting from "Arrived at Warehouse" to end of process
    */
    function getPackageCounts_summary($sender_id=0, $ss=null){
      $branch_id = $ss->branch_id;
      $cache_key ='ordersummarycount5_'.$branch_id.$sender_id;
      $cache_data = Cache::get($cache_key);
      if($cache_data !== null) return $cache_data;

      //$status_id <=4, higher status => use packageModel->getPackageCounts_summary()  
      $data = (object)['at_warehouse_count'=>0,'on_delivery_count'=>0,'failed_count'=>0,'returned_count'=>0,'delivered_count'=>0];
      
      $last_10_days = date('Y-m-d'); //convertDate(Carbon::now()->addDay(-3));
      //$last_10_days = convertDate($last_10_days);

      //Status_id <=4  => query from table "order" by summing up the "qty" 
      $query = DB::table('package as p')->join('package_statuses as ps','ps.id','=','p.status_id')->join('sender as s','s.id','=','p.sender_id')->selectRaw('COUNT(p.id) AS cnt,p.status_id, ps.`name` AS `status`')->where('s.id',$sender_id)->where('p.branch_id',$branch_id)->groupByRaw('p.`status_id`,ps.`name`');
      // $rows = DB::select(DB::raw('SELECT COUNT(p.id) AS cnt,p.status_id, ps.name AS `status` from `package` AS `p`
      // INNER JOIN  package_statuses AS ps ON ps.id = p.status_id INNER JOIN `sender` AS s ON s.id = p.sender_id
      // WHERE p.branch_id ='.$branch_id.' AND s.id ='.$sender_id.' AND (p.status_id=5 OR p.status_id=6) AND DATE(p.arrival_time) = \''.$last_10_days.'\' 
      // GROUP BY p.status_id,ps.`name`'));
      $rows = $query->whereIn('p.status_id',[5,6])->whereRaw('DATE(p.arrival_time) = \''.$last_10_days.'\'')->get(); 
      foreach($rows as $row){
          if($row->status_id ==5) 
            $data->at_warehouse_count = $row->cnt;
          else if ($row->status_id ==6)
             $data->on_delivery_count = $row->cnt; 
      }

      /*** For "Delivered", "Failed","Returned" => COUNT within @today's date only. @status_id (8,9,11) ***/
      //$today = date('Y-m-d');
      //$last_10_days =  date('Y-m-d'); //convertDate(Carbon::now()->addDay(-3));
     
      // $rows = DB::select(DB::raw('SELECT COUNT(p.id) AS cnt,p.status_id, ps.name AS `status` from `package` AS `p`
      // INNER JOIN package_statuses AS ps ON ps.id = p.status_id
      // WHERE p.branch_id ='.$branch_id.' AND p.sender_id ='.$sender_id.' AND (p.status_id=8 OR p.status_id=9 OR p.status_id =11) AND DATE(p.delivery_time) = \''.$last_10_days.'\' 
      // GROUP BY p.status_id,ps.`name`'));

      $str_finish_date = 'DATE(p.delivery_time) = \''.$last_10_days.'\'';
      $select_statuses = [8,9,11];
      $rows = DB::table('package as p')->join('package_statuses as ps','ps.id','=','p.status_id')->join('sender as s','s.id','=','p.sender_id')->selectRaw('p.id,p.cod,p.price,p.df_payer,p.base_fee,p.forwarding_cost,p.delivery_fee, p.status_id, ps.`name` AS `status`')->whereIn('p.status_id',$select_statuses)->where('s.id',$sender_id)->where('p.branch_id',$branch_id)->whereRaw($str_finish_date)->get();
      //$rows = DB::table('package as p')->join('package_statuses as ps','ps.id','=','p.status_id')->join('sender as s','s.id','=','p.sender_id')->selectRaw('COUNT(p.id) AS cnt, p.status_id, ps.`name` AS `status`')->whereIn('p.status_id',$select_statuses)->where('s.id',$sender_id)->where('p.branch_id',$branch_id)->whereRaw($str_finish_date)->groupByRaw('p.`status_id`,ps.`name`')->get(); 
        $merchant_balance_due =0;
        foreach($rows as $row){
           if($row->status_id ==8)
           {
            $data->delivered_count++;
            $sender_amount = self::getMerchantBalance($row);
            $merchant_balance_due +=$sender_amount;
           } 
           else if ($row->status_id ==9)
             $data->failed_count++;
           else if ($row->status_id ==11)
             $data->returned_count++; /** todo: later "returned" items based on return_date, not create_date **/    
      }
       $data->balance_due = number_format($merchant_balance_due,2,'.','');
       $data->currency_code ='USD';
       Cache::put($cache_key,$data,10);
       return $data;
  }

  //Upload attachment for package | upload and doc or image related to a package
  function savePackageAttachment($arr,$id=null,$ss=null){
    $ss =$ss?$ss:$this->userInfo;
    $package_id = $id?$id:$this->id;
    $d = (object)$arr;
    $branch_id = Sanitizer::sanitize($ss->branch_id); 
      
    if ( !$package_id) return DV::error('Package identity is not valid');

    $file_content = isset($d->file_content)?$d->file_content:null;
    if(!$file_content) $file_content = isset($d->img_data)?$d->img_data:null;

    if (!$file_content) return DV::error('It seems that there is no chosen file'); 

    $file_type = isset($d->file_type)? Sanitizer::sanitize($d->file_type):null;       
    //$allowed_file_types = ['jpg','png','jpeg','svg'];

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
        return DV::depends($new_id,null,'Failed to save package attachment');
      }
      return DV::error($mResult->error);
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

  /** pending_count = available_count + accepted_count => statuses = [1,2]*/     
  function getOrderSummaryList_pending($sender_id,$ss){
        $branch_id = $ss->branch_id;
        $status_id = 1; //isset($d->status_id)? Sanitizer::sanitize($d->status_id):null;
        $last_date =  date('Y-m-d');
        //$last_date = convertDate($last_date);
        return DB::select(DB::raw("SELECT DATE_FORMAT(o.create_date,'%d %b %Y %r') AS booking_date, o.id AS order_id,o.code AS order_code,o.qty, o.actual_pkg_count, o.sender_id, o.pickup_address, o.product_type, o.delivery_type, o.request_vehicle_type, o.status_id, ps.name AS `status` FROM `order` AS `o`
        INNER JOIN package_statuses AS ps ON ps.id = o.status_id
        WHERE o.branch_id =$branch_id AND o.sender_id =$sender_id AND o.status_id IN (1,2) AND DATE(o.create_date) ='$last_date'")); 
    }

      function getOrderSummaryList_available($sender_id,$ss){
        $branch_id = $ss->branch_id;
        $status_id = 1; //isset($d->status_id)? Sanitizer::sanitize($d->status_id):null;
        $last_date =  date('Y-m-d');
        //$last_date = convertDate($last_date);
        return DB::select(DB::raw("SELECT DATE_FORMAT(o.create_date,'%d %b %Y %r') AS booking_date, o.id AS order_id,o.code AS order_code,o.qty, o.actual_pkg_count, o.sender_id, o.pickup_address, o.product_type, o.delivery_type, o.request_vehicle_type, o.status_id, ps.name AS `status` FROM `order` AS `o`
        INNER JOIN package_statuses AS ps ON ps.id = o.status_id
        WHERE o.branch_id =$branch_id AND o.sender_id =$sender_id AND o.status_id =$status_id AND DATE(o.create_date) ='$last_date'")); 
    }

    function getOrderSummaryList_accepted($sender_id,$ss){
      $branch_id = $ss->branch_id;
      $status_id = 2; 
      $last_10_days = date('Y-m-d');
       
      //Status_id <=4  => query from table "order" by summing up the "qty" 
      return DB::select(DB::raw("SELECT DATE_FORMAT(o.create_date,'%d %b %Y %r') AS booking_date, o.id AS order_id,o.code AS order_code, o.sender_id, o.pickup_address, o.product_type, o.delivery_type, o.request_vehicle_type,o.qty,o.actual_pkg_count, o.driver_id, o.status_id, ps.name AS `status`, d.name AS driver_name,d.phone_number AS driver_phone, d.code AS driver_code FROM `order` AS `o`
      INNER JOIN package_statuses AS ps ON ps.id = o.status_id
      INNER JOIN driver AS d ON d.id = o.driver_id 
      WHERE o.branch_id =$branch_id AND o.sender_id =$sender_id AND o.status_id =$status_id AND DATE(o.create_date) ='$last_10_days'"));
  }

  /** Combine statuses [3,4]*/
  function getOrderSummaryList_picked($sender_id,$ss){
    $branch_id = $ss->branch_id;
    $last_10_days =  date('Y-m-d');
    return DB::select(DB::raw("SELECT o.id AS order_id,formatDate(o.create_date) AS booking_date,o.code As order_code, o.sender_id, o.pickup_address, o.product_type, o.delivery_type, o.request_vehicle_type,o.qty,o.actual_pkg_count, o.driver_id, o.status_id, ps.name AS `status`, d.code AS driver_code, d.name AS driver_name,d.phone_number AS driver_phone FROM `order` AS `o`
    INNER JOIN package_statuses AS ps ON ps.id = o.status_id
    INNER JOIN driver AS d ON d.id = o.driver_id 
    WHERE o.branch_id =$branch_id AND o.sender_id = '$sender_id' AND o.status_id IN (3,4) AND DATE(o.create_date) = '$last_10_days'"));
    //$at_warehouse_count = DB::table('packages as p')->where('p.status_id',5)->where('p.sender_id',$sender_id)->whereRaw('DATE(p.arrival_time) =\''.$last_10_days.'\'')->count('p.id');
}

function getOrderSummarylist_at_warehouse($sender_id,$ss){  
      $branch_id = $ss->branch_id;
      $status_id = 5;
      $cache_key = 'ordersummarycount_atw_'.$branch_id.$sender_id;
      $cache_data = Cache::get($cache_key);
      if($cache_data !==null) return $cache_data;

      $last_10_days =  date('Y-m-d');
      $rows =  DB::select(DB::raw('SELECT p.id,formatDate(p.arrival_time) As arrival_date,formatDate(p.create_date) AS booking_date,p.delivery_type,p.sender_id,p.sender_name, p.receiver_name,p.receiver_phone,p.zone_code,p.zone_name, 
      p.receiver_address,
      p.df_payer,
      p.cod,p.price,
      IFNULL(p.cod_fee,0) AS cod_fee,
      (p.base_fee + IFNULL(p.delivery_fee,0)) AS fee,
      format_amount(\'$\',
       get_cod_amount(p.cod,p.price,p.cod_fee) - IFNULL(p.forwarding_cost,0) -  (CASE LOWER(p.df_payer) WHEN \'sender\' THEN (IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0)) ELSE 0 END)
      ) AS sender_total,'.
      'CASE p.failed_num > 0 WHEN 1 THEN p.failure_notes ELSE p.delivery_notes END AS notes,
      CONCAT(p.billed_kg,\' kg\') AS billed_kg, p.status_id, ps.name AS `status`,NULL AS driver_code, NULL AS driver_name, NULL AS driver_phone FROM `package` AS `p`
      INNER JOIN  package_statuses AS ps ON ps.id = p.status_id
      WHERE p.branch_id =\''.$branch_id.'\' AND p.sender_id ='.$sender_id.' AND  p.status_id ='.$status_id.' AND DATE(p.arrival_time) >= \''.$last_10_days.'\''));
     Cache::put($cache_key,$rows,15);
     return $rows;
  }
  
  /** On merchant Mobile App, in Order Summary counts => We combine "At Warehouse Count" with "On-delviery Count" under label "On Delivery" */
  function getOrderSummaryList_on_delivery($sender_id,$ss){  
    $branch_id = $ss->branch_id;
    $last_10_days = date('Y-m-d');
    $str_statuses = ' AND p.status_id IN (5,6) ';
    $cache_key = 'ordersummarylist6_'.$branch_id.$sender_id;
    $cache_data = Cache::get($cache_key);
    if($cache_data) return $cache_data;
 $rows = DB::select(DB::raw('
 SELECT 
     p.id,
     formatDate(p.arrival_time) AS arrival_date, 
     formatDate(p.create_date) AS booking_date,
     p.delivery_type,
     p.sender_id,
     p.sender_name, 
     p.receiver_name,
     p.receiver_phone,
     p.zone_code,
     p.zone_name,
     p.receiver_address,
     p.df_payer,
     p.cod,
     p.price,
     IFNULL(p.cod_fee,0) AS cod_fee,
     (p.base_fee + IFNULL(p.delivery_fee,0)) AS fee,
     format_amount(\'$\',
         get_cod_amount(p.cod,p.price,p.cod_fee) - IFNULL(p.forwarding_cost,0) - 
         CASE LOWER(p.df_payer) 
             WHEN \'sender\' THEN IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0) 
             ELSE 0 
         END
     ) AS sender_total,
     CASE 
         WHEN p.failed_num > 0 THEN p.failure_notes 
         ELSE p.delivery_notes 
     END AS notes, 
     p.billed_kg, 
     p.status_id, 
     ps.name AS `status`,
     COALESCE(d.code, \'NA\') AS driver_code, 
     COALESCE(d.name, \'មិនទាន់មានអ្នកដឹក\') AS driver_name,
     COALESCE(d.phone_number, \'NA\') AS driver_phone 
 FROM 
     `package` AS `p`
 INNER JOIN  
     package_statuses AS ps ON ps.id = p.status_id
 LEFT JOIN 
     `driver` as `d` ON d.id = p.driver_id
 WHERE 
     p.branch_id = \''.$branch_id.'\' 
     AND p.sender_id = '.($sender_id > 0 ? $sender_id : 0) . $str_statuses.' 
     AND DATE(p.arrival_time) = \''.$last_10_days.'\''));
    Cache::put($cache_key,$rows,15);
    return $rows;  
  }

    //get list of delviered pacakges (TODAY)
    function getOrderSummaryList_delivered($sender_id,$ss){  
      $branch_id = $ss->branch_id;
      $cache_key = 'ordersummarylistd8_'.$branch_id.$sender_id;
      $cache_data = Cache::get($cache_key);
      if($cache_data) return $cache_data;

      $status_id = 8;
      $last_10_days = date('Y-m-d');
      $cols ='p.id, formatDate(p.arrival_time) AS arrival_date, formatDate(p.delivery_time) AS finish_date, formatDate(p.create_date) AS booking_date,p.delivery_type,p.sender_id,p.sender_name, p.receiver_name,p.receiver_phone,p.zone_code, p.zone_name,'.
      'p.receiver_address,'.
      'p.df_payer,'.
      'p.cod,p.price,'.
      'IFNULL(p.cod_fee,0) AS cod_fee,'. 
      '(p.base_fee + IFNULL(p.delivery_fee,0)) AS fee,'.
      "format_amount('$',
        get_cod_amount(p.cod,p.price,p.cod_fee) - IFNULL(p.forwarding_cost,0) - CASE LOWER(p.df_payer) WHEN 'sender' THEN (IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0)) ELSE 0 END 
      ) AS sender_total,".
      'CASE p.status_id WHEN 9 THEN p.failure_notes WHEN 11 THEN p.failure_notes ELSE p.delivery_notes END notes,'. 
      'p.billed_kg, p.status_id, ps.name AS `status`,d.code AS driver_code, d.name AS driver_name,d.phone_number as driver_phone';

      $query = DB::table('package as p')->join('package_statuses as ps','ps.id','=','p.status_id')->join('sender as s','s.id','=','p.sender_id')->join('driver as d','d.id','=','p.driver_id')->selectRaw($cols)->where('s.id',$sender_id)->where('p.branch_id',$branch_id);
      $rows = $query->where('p.status_id',$status_id)->whereRaw("DATE(p.delivery_time) = '$last_10_days'")->get();
      Cache::put($cache_key,$rows,15);
      return $rows;
    }

    //get List of failed packages (LAST 10 DAYS)
    function getOrderSummaryList_failed($sender_id,$ss){  
      $branch_id = $ss->branch_id;
      $cache_key = 'ordersummarylistf9_'.$branch_id.$sender_id;
      $cache_data = Cache::get($cache_key);
      if($cache_data) return $cache_data;

      $status_id = 9;
      $last_10_days = date('Y-m-d');
      $cols ='p.id, formatDate(p.arrival_time) AS arrival_date, formatDate(p.delivery_time) AS finish_date, formatDate(p.create_date) AS booking_date,p.delivery_type,p.sender_id,p.sender_name, p.receiver_name,p.receiver_phone,p.zone_code, p.zone_name,'.
      'p.receiver_address,'.
      'p.df_payer,'.
      'p.cod,p.price,'.
      'IFNULL(p.cod_fee,0) AS cod_fee,'. 
      '(p.base_fee + IFNULL(p.delivery_fee,0)) AS fee,'.
      "format_amount('$',
        get_cod_amount(p.cod,p.price,p.cod_fee) - IFNULL(p.forwarding_cost,0) - CASE LOWER(p.df_payer) WHEN 'sender' THEN (IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0)) ELSE 0 END 
      ) AS sender_total,".
      'CASE p.status_id WHEN 9 THEN p.failure_notes WHEN 11 THEN p.failure_notes ELSE p.delivery_notes END notes,'. 
      'p.billed_kg, p.status_id, ps.name AS `status`,d.code AS driver_code, d.name AS driver_name,d.phone_number as driver_phone';

      $query = DB::table('package as p')->join('package_statuses as ps','ps.id','=','p.status_id')->join('sender as s','s.id','=','p.sender_id')->join('driver as d','d.id','=','p.driver_id')->selectRaw($cols)->where('s.id',$sender_id)->where('p.branch_id',$branch_id);
      $rows = $query->where('p.status_id',$status_id)->whereRaw("DATE(p.delivery_time) = '$last_10_days'")->get();
      Cache::put($cache_key,$rows,15);
      return $rows;
    }

    //get List of failed packages (LAST 10 DAYS)
    function getOrderSummaryList_returned($sender_id,$ss){  
      $branch_id = $ss->branch_id;
      $cache_key = 'ordersummarylistr11_'.$branch_id.$sender_id;
      $cache_data = Cache::get($cache_key);
      if($cache_data) return $cache_data;

      $status_id = 11;
      $last_10_days = date('Y-m-d');
      $cols ='p.id, formatDate(p.arrival_time) AS arrival_date, formatDate(p.delivery_time) AS finish_date, formatDate(p.create_date) AS booking_date,p.delivery_type,p.sender_id,p.sender_name, p.receiver_name,p.receiver_phone,p.zone_code, p.zone_name,'.
      'p.receiver_address,'.
      'p.df_payer,'.
      'p.cod,p.price,'.
      'IFNULL(p.cod_fee,0) AS cod_fee,'. 
      '(p.base_fee + IFNULL(p.delivery_fee,0)) AS fee,'.
      "format_amount('$',
        get_cod_amount(p.cod,p.price,p.cod_fee) - IFNULL(p.forwarding_cost,0) - CASE LOWER(p.df_payer) WHEN 'sender' THEN (IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0)) ELSE 0 END 
      ) AS sender_total,".
      'CASE p.status_id WHEN 9 THEN p.failure_notes WHEN 11 THEN p.failure_notes ELSE p.delivery_notes END notes,'. 
      'p.billed_kg, p.status_id, ps.name AS `status`,d.code AS driver_code, d.name AS driver_name,d.phone_number as driver_phone';

      $query = DB::table('package as p')->join('package_statuses as ps','ps.id','=','p.status_id')->join('sender as s','s.id','=','p.sender_id')->join('driver as d','d.id','=','p.driver_id')->selectRaw($cols)->where('s.id',$sender_id)->where('p.branch_id',$branch_id);
      $rows = $query->where('p.status_id',$status_id)->whereRaw("DATE(p.delivery_time) = '$last_10_days'")->get();
      Cache::put($cache_key,$rows,15);
      return $rows;
    }


    /**
      * Seachbox on Home screen of Merchant's mbile app => to find packages by recever phone or by scanning/entering barcode 
      * findItems()
    */
    function findPackages_quick($arr, $ss=null){ 
      $ss =$ss?$ss:$this->userInfo;
      $d = (object)$arr;
      $branch_id = $ss->branch_id;
      // $official_id = isset($ss->official_id)?$ss->official_id:null;
      // $user_class = isset($ss->user_class)? strtolower($ss->user_class):null;
      $user_class = strtolower($ss->user_class);
      $str_owner ='3=3';
      if ($user_class =='merchant') $str_owner = 'p.sender_id ='.($ss->official_id ?? 0);
      else if ($user_class =='driver') $str_owner = 'p.driver_id ='.($ss->official_id ?? 0);  
      $find_by = isset($d->find_by) ? $d->find_by: null;
      $search_value = isset($d->search_value)? $d->search_value:null;
         
       $str_search = '1=1';
       $search_value = trim(escape_like_str($search_value));
       if(empty($search_value)) return [];
       if (in_array($find_by,['phone_number','phone'])) $str_search ='(p.receiver_phone = \''.$search_value.'\' OR s.phone_number = \''.$search_value.'\')';
       else{
        $str_search = '(p.qr_code =\''.$search_value.'\' OR s.name LIKE \'%'.$search_value.'%\' OR s.phone_number = \''.$search_value.'\' OR p.receiver_phone =\''.$search_value.'\')';
       }
       
        $max_rows = 200;
        $cols = 'p.id,p.qr_code as barcode,p.delivery_type,p.sender_id,formatDate(p.arrival_time) AS arrival_date,formatDate(p.delivery_time) AS finish_date, formatDate(p.create_date) AS booking_date, p.sender_name, p.receiver_name,p.receiver_phone,p.zone_code,
        p.df_payer,
        p.cod,p.price,
        IFNULL(p.cod_fee,0) AS cod_fee,
        p.base_fee,p.delivery_fee,
        get_cod_amount(p.cod,p.price,p.cod_fee) AS cod_amount,
        (p.base_fee + IFNULL(p.delivery_fee,0)) AS fees,
        s.phone_number as sender_phone,
        ifnull(p.sender_total,0) AS sender_total,
        ifnull(p.driver_total,0) AS driver_total,
        ifnull(p.forwarding_cost,0) AS taxi_fee,
        CASE (p.status_id =11 OR p.status_id =9) WHEN 1 THEN p.failure_notes ELSE \'\' END AS failure_notes,
        p.delivery_notes, p.failed_num, p.billed_kg, p.status_id, ps.name AS `status`, (SELECT `name` FROM driver as d WHERE d.id = p.driver_id LIMIT 1) AS driver_name';
        $rows = DB::table('package as p')->join('package_statuses as ps','ps.id','=','p.status_id')->join('sender as s','s.id','=','p.sender_id')->where('p.branch_id',$branch_id)->whereRaw($str_search)->whereRaw($str_owner)->selectRaw($cols)->take($max_rows)->get();
        foreach($rows as $row){
          $row->sender_total = self::getMerchantBalance($row);
        }
        return $rows;
      }
 
   //$d = {'barcode',id}
   //deletePackagePhoto()
   function deletePhoto($image_id,$id=null,$ss=null){
    $id = $id?$id:$this->getId();
    $ss = $ss?$ss:$this->getUserInfo();
    $branch_id = $ss->branch_id;
    //$barcode = isset($d->barcode)?$d->barcode:null; 
    $row= DB::table('package_attachments as l')->where('l.id',$image_id)->selectRaw('l.id,l.file_name,l.user_class,l.category')->take(1)->get()->first();
      if($row)
      {
        $err = PublicStorage::delete($branch_id,$ss->user_class,"image",$row->file_name);
        if($err) return DV::error($err);
        return DV::success();
      }
      return DV::error('Failed to find the target file');
   }

   /** return all photos belonging to a package, unless the the @user_class is given. If user_class ==='merchant' => returns only photos uploaded by merchant **/
   //@params @d = {[user_class],[category],package_id,barcode}. Either use "package_id" or "barcode"
   function getPhotos($barcode=null,$ss=null){
        $package_id = $this->getId($barcode);
        $ss = $ss?? $this->userInfo;
        $branch_id =$ss->branch_id;
        
        /** if param @user_class  if provided then returns photos that belong to the user_class (i.e: Driver or Merchant) only **/
        $user_class = $ss->user_class;
        //Category = {image,document}
        $category = 'image'; // isset($d->category)?$d->category:null; 
 
        $str_cat="1=1";
        $str_user_class ="1=1";
        if($user_class) $str_user_class = " l.user_class='$user_class' ";
        if(in_array($category,['image','document'])){
          $str_cat=" l.category ='$category'";
        } 

        $rows = DB::table('package_attachments as l')->where('l.branch_id',$branch_id)->where('package_id',$package_id)->whereRaw($str_user_class)->whereRaw($str_cat)->selectRaw("l.id,l.user_class,l.category,l.file_name")->get();
        $imgs = [];
      
        foreach($rows as $row){
          $user_class = strtolower($row->user_class);
          $category = strtolower($row->category);
          $file_name = $row->file_name;
          $url = PublicStorage::getUrl($branch_id,$user_class,$category).$file_name;
          $imgs[] = (object)['image_url'=>$url,'category'=>$row->category,'owner'=>$row->user_class];
        }
        return $imgs; 
   }
 
   //SavePackagePhoto()
   //$photoInfo = ['photo_data','file_type']
   function savePhoto($photoInfo, $id=null,$ss=null){
    $id = $id?$id : $this->id;
    $ss = $ss?$ss : $this->userInfo;
    $branch_id = $ss->branch_id;
    $user_class =$ss->user_class;
    
    $d = (object)$photoInfo;
    $category ='image';

    $barcode = isset($d->barcode)?$d->barcode:null;
    $file_type = isset($d->file_type)?$d->file_type:null;
    $photo_data = isset($d->photo_data)?$d->photo_data:null;
    //Allow driver to oprtionally save photo upon delivering packages to customer 
    if(!isImage($photo_data)) return DV::success(['image_url'=>null]);

    $p = null;
    if($barcode) $p = DB::table('package as p')->where('qr_code',$barcode)->selectRaw('id,qr_code as barcode')->first();
    else $p = DB::table('package as p')->where('id',$id)->selectRaw('id,qr_code as barcode')->first(); 
    if(!$p) return DV::error("package ID or barcode is not valid");

     $res = PublicStorage::saveImage($branch_id,$user_class,$file_type,$photo_data);
      if($res->status === 'OK')
      {
          $file_name = $res->file_name;
          $file_url = PublicStorage::getUrl($branch_id,$user_class,$category).$file_name;
          DB::table('package_attachments')->insert([
            'branch_id'=>$branch_id,
            'package_id'=>$id,
            'user_class'=>$user_class,
            'file_name'=>$file_name,
            'file_type'=>$file_type,
            'category'=>$category,
            'create_user'=>$ss->full_name,
            'create_date'=>getNowTime()
          ]);  
          return DV::success(['image_url'=>$file_url]);

      }else return DV::error($res->error_message);
  
   }
}
