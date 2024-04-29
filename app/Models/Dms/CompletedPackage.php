<?php

namespace App\Models\Dms;
 
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
//use Carbon\Carbon;
use Sanitizer;
use DB;
use Illuminate\Pagination\LengthAwarePaginator; 
//use App\Models\PublicStorage;
//use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class CompletedPackage //extends Model
{
    //use HasFactory;
    protected $id = null, $userInfo = null;
    function __construct($id=null,$userInfo=null)
    {
       $this->id = $id;
       $this->userInfo = $userInfo;
      
    }

    // function update($arr,$id=null,$ss=null){
    //   $ss = $ss?$ss:$this->userInfo;
    //   $id = $id?$id:$this->id;
    //   return DV::error('Cannot modify completed package');
    // }

    function quickInfo($id) {
        return DB::table('package AS p')->join('package_statuses AS ps','ps.id','=','p.status_id')->where('p.id',$id)->selectRaw("p.id, p.package_name, p.qr_code AS barcode,p.driver_pmt_status_id,p.sender_pmt_status_id,p.returned, ps.`name` as `status`, p.status_id")->take(1)->first();
    }

    function delete($id=null,$ss=null) {
        $ss = $ss?$ss:$this->userInfo;
        $id = $id? $id: $this->id;
        //$branch_id = $ss->branch_id;
        $p = $this->quickInfo($id);
        if(!$p) return DV::error('Package ID does not exist');
        $pg = new \App\Models\Package($id,$ss);
        return $pg->deleteById($id,$ss);
        // if($p->driver_pmt_status_id ==1 || $p->sender_pmt_status_id ==1) return DV::error('Cannot delete the package because it has been settled payment with driver or merchant');
        // $x = DB::table('package')->where('branch_id',$branch_id)->where('id',$id)->delete();
        // return DV::depends($x,null,'Failed to delete the completed package');
    }

    static function list($arr,$ss=null) {   
        $d = (object)$arr;
        
        $str_dates = '5=5';
        $current_page =isset($d->current_page)?$d->current_page:1;
        $per_page =isset($d->per_page)?$d->per_page:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;

        $branch_id = Sanitizer::sanitize($ss->branch_id);
        $use_date =isset($d->use_date)? $d->use_date: 'finish_date'; /** use_date =arrival_date|finish_date */
        $warehouse_id = isset($d->warehouse_id)?Sanitizer::sanitize($d->warehouse_id):1;

        $d->sender_id = Sanitizer::sanitize($d->sender_id);
        //$back_days = isset($d->back_days)?$d->back_days:0;
        //$since_date ='1=1';
      
        $start_date = isset($d->start_date)? convertDate($d->start_date): null;
        $end_date = isset($d->end_date)? convertDate($d->end_date): null;
        $driver_pmt_status_id = isset($d->driver_pmt_status_id)?  $d->driver_pmt_status_id: 0;
        $sender_pmt_status_id = isset($d->sender_pmt_status_id)?  $d->sender_pmt_status_id: 0;
        $d->delivery_type = isset($d->delivery_type)?$d->delivery_type:null;
        if($d->delivery_type ==0) $d->delivery_type =null;
        //$d->zone_code = isset($d->zone_code)?$d->zone_code:null;
        $d->driver_id = isset($d->driver_id)?$d->driver_id:null;
        $d->pickup_driver_id = isset($d->pickup_driver_id)?$d->pickup_driver_id:null;

        $d->status_id = isset($d->status_id)?$d->status_id:null;
        if(empty($d->status_id)) $d->status_id =-1;
        $str_order ='p.delivery_time DESC, p.status_id';
   
        $d->search_value =isset($d->search_value)?$d->search_value:null;
        $d->search_value = escape_like_str($d->search_value);
 
        $cache_key = 'cpglist_';
        foreach($d as $key => $val) $cache_key .= $val;
        $cache_key = str_replace(['/','-','?','@','|'],'',$cache_key);
        $cache_data = Cache::get($cache_key); 
        if ($cache_data) {
          //Log::info('Cached triplist. key = '.$cache_key); 
          return $cache_data;
        }

          //$succeeded_status ="delivered"; /* outstanding delvieries => select all packages that has status different from "delivered" */
         
          $str_driver = null;
          $str_pickup_driver = null;
          //$str_warehouse =null;
          $str_zone ='';
          $str_driver_pmt = '1=1';
          $str_sender_pmt = '1=1';
          $str_sender =null;
          $str_status = ' AND p.status_id IN (8,11)'; //status_id = 4 (Picked and Booked), status_id = 5 (Arrived at warehouse) 
          $str_delivery_type = null;

          $str_search = null;
          $search_value = $d->search_value;
          if ($search_value) { 
             $search_value = escape_like_str($search_value);
             $str_search = " AND (p.qr_code ='$search_value' OR p.receiver_phone LIKE '%$search_value%'  OR s.phone_number LIKE '%".$search_value."%' OR s.name LIKE '%".$search_value."%' OR p.order_id = (SELECT `id` FROM `order` WHERE code ='".$search_value."' LIMIT 1))";
             $more_wheres = " IFNULL(p.outstanding,0) =0 AND p.status_id IN (8,11) ".$str_search;
          }
          else{
            $str_driver_trx_id = $driver_pmt_status_id ==0? ' AND p.driver_trx_id IS NULL' : '';
            if (in_array($driver_pmt_status_id, [0,1])) $str_driver_pmt = 'IFNULL(p.driver_pmt_status_id,0) = '.$driver_pmt_status_id.$str_driver_trx_id;
            if (in_array($sender_pmt_status_id, [0,1])) $str_sender_pmt = 'IFNULL(p.sender_pmt_status_id,0) = '.$sender_pmt_status_id;
            if ($d->delivery_type) $str_delivery_type =" AND p.delivery_type ='".$d->delivery_type."' ";
            if ($d->driver_id > 0) $str_driver = ' AND p.driver_id ='.$d->driver_id;
            if ($d->pickup_driver_id > 0) $str_pickup_driver = ' AND p.pickup_driver_id ='.$d->pickup_driver_id;
            if ($d->driver_id ==-1) $str_driver = ' AND IFNULL(p.driver_id,0) = 0';
            if ($d->sender_id > 0) $str_sender = ' AND p.sender_id ='.$d->sender_id;
            //if ($d->zone_code) $str_zone = " AND p.zone_code ='".$d->zone_code."' ";
            if ($d->status_id > 0) $str_status = ' AND p.status_id ='.$d->status_id;
                    
          //If $driver_id is not Selected, and pickup_driver is selected to filter => use "arrival_date"
          if((!$d->driver_id || $d->driver_id ==-1) && $d->pickup_driver_id > 0)  $use_date ='arrival_date';
          if ((bool)strtotime($start_date) || (bool)strtotime($end_date)){
              if($use_date === 'finish_date'){
                 $str_dates = "DATE(p.delivery_time) BETWEEN '$start_date' AND '$end_date'";
              }else $str_dates = "DATE(p.arrival_time) BETWEEN '$start_date' AND '$end_date'";
          }
            $more_wheres = 'p.warehouse_id = '.$warehouse_id.' AND IFNULL(p.outstanding,0) =0 '.$str_delivery_type.$str_driver.$str_pickup_driver.$str_zone.$str_sender.$str_status;
          }
          $select_cols ='p.id,p.collectible,p.delivery_id, p.order_id, p.zone_code, formatTime(p.delivery_time) AS finish_time, p.delivery_type, p.qr_code AS barcode,p.delivery_notes, p.failure_notes,p.return_notes,'.' CASE IFNULL(p.failure_notes,\'\') WHEN \'\' THEN p.delivery_notes ELSE p.failure_notes END AS remarks,'.'HEX(p.driver_pmt_status_id) as driver_pmt_status_id, 
          formatTime(p.arrival_time) AS `arrival_time`, formatTime(p.last_checkout_time) AS last_checkout_time, formatTime(p.first_checkout_time) AS first_checkout_time, s.sender_type_id, st.name AS sender_type, (select x.name from driver as x WHERE x.id = p.driver_id LIMIT 1) AS driver_name, p.driver_id,'.
          '(select x.name from driver as x WHERE x.id = p.pickup_driver_id LIMIT 1) AS pickup_driver_name,'.
          '(IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0) +IFNULL(p.cod_fee,0)) AS fees, 
              (CASE p.cod WHEN 1 THEN (IFNULL(p.price,0) - IFNULL(p.cod_fee,0)) ELSE 0 END) AS cod_amount,
           p.status_id,IFNULL(p.driver_pmt_status_id,0) AS driver_pmt_status_id, IFNULL(p.sender_pmt_status_id,0) AS sender_pmt_status_id,ps.`name` AS status, p.sender_id, s.phone_number AS sender_phone, p.receiver_id, p.receiver_address, p.receiver_name, p.receiver_phone,p.zone_name, s.name AS sender_name, IFNULL(p.driver_total,0) AS driver_total, IFNULL(p.sender_total,0) AS sender_total';

          $query = DB::table('package AS p')->join('package_statuses as ps','ps.id','=','p.status_id')->join('sender AS s','s.id','=','p.sender_id')->join('sender_type AS st','st.id','=','s.sender_type_id')->selectRaw($select_cols)->whereRaw($str_dates)->whereRaw($str_driver_pmt)->whereRaw($str_sender_pmt)->where('p.branch_id',$branch_id)->whereRaw($more_wheres)->orderByRaw($str_order);
          $count_query = clone $query;
          $count = $count_query->count('p.id');
          $rows = $query->skip($skip_rows)->take($per_page)->get();
          $data = new LengthAwarePaginator($rows, $count, $per_page, $current_page);
          Cache::put($cache_key,$data,30);
          //Log::info('No cache cpglist '.$cache_key);
          return $data;
         }

         static function listAll($arr,$ss=null) {   
          $d = (object)$arr;
          
          $str_dates = '5=5';
          $branch_id = Sanitizer::sanitize($ss->branch_id);
          $use_date =isset($d->use_date)? $d->use_date: 'finish_date'; /** use_date =arrival_date|finish_date */
          $warehouse_id = isset($d->warehouse_id)?Sanitizer::sanitize($d->warehouse_id):1;
  
          $d->sender_id = Sanitizer::sanitize($d->sender_id);
          //$back_days = isset($d->back_days)?$d->back_days:0;
          //$since_date ='1=1';
        
          $start_date = isset($d->start_date)? convertDate($d->start_date): null;
          $end_date = isset($d->end_date)? convertDate($d->end_date): null;
          $driver_pmt_status_id = isset($d->driver_pmt_status_id)?  $d->driver_pmt_status_id: 0;
          $sender_pmt_status_id = isset($d->sender_pmt_status_id)?  $d->sender_pmt_status_id: 0;
          $d->delivery_type = isset($d->delivery_type)?$d->delivery_type:null;
          if($d->delivery_type ==0) $d->delivery_type =null;
          //$d->zone_code = isset($d->zone_code)?$d->zone_code:null;
          $d->driver_id = isset($d->driver_id)?$d->driver_id:null;
          $d->pickup_driver_id = isset($d->pickup_driver_id)?$d->pickup_driver_id:null;
  
          $d->status_id = isset($d->status_id)?$d->status_id:null;
          if(empty($d->status_id)) $d->status_id =-1;
          $str_order ='p.delivery_time DESC, p.status_id';
     
          $d->search_value =isset($d->search_value)?$d->search_value:null;
          $d->search_value = escape_like_str($d->search_value);
   
            //$succeeded_status ="delivered"; /* outstanding delvieries => select all packages that has status different from "delivered" */
           
            $str_driver = null;
            $str_pickup_driver = null;
            //$str_warehouse =null;
            $str_zone ='';
            $str_sender =null;
            $str_status = ' AND p.status_id IN (8,11)'; //status_id = 4 (Picked and Booked), status_id = 5 (Arrived at warehouse) 
            $str_delivery_type = null;
  
            $str_search = null;
            $search_value = $d->search_value;
            if ($search_value) { 
               $search_value = escape_like_str($search_value);
               $str_search = " AND (p.qr_code ='$search_value' OR p.receiver_phone LIKE '%$search_value%'  OR s.phone_number LIKE '%".$search_value."%' OR s.name LIKE '%".$search_value."%' OR p.order_id = (SELECT `id` FROM `order` WHERE code ='".$search_value."' LIMIT 1))";
               $more_wheres = " IFNULL(p.outstanding,0) =0 AND p.status_id IN (8,11) ".$str_search;
            }
            else{
              if (in_array($driver_pmt_status_id, [0,1])) $str_driver_pmt = 'IFNULL(p.driver_pmt_status_id,0) = '.$driver_pmt_status_id;
              if (in_array($sender_pmt_status_id, [0,1])) $str_sender_pmt = 'IFNULL(p.sender_pmt_status_id,0) = '.$sender_pmt_status_id;
              if ($d->delivery_type) $str_delivery_type =" AND p.delivery_type ='".$d->delivery_type."' ";
              if ($d->driver_id > 0) $str_driver = ' AND p.driver_id ='.$d->driver_id;
              if ($d->pickup_driver_id > 0) $str_pickup_driver = ' AND p.pickup_driver_id ='.$d->pickup_driver_id;
              if ($d->driver_id ==-1) $str_driver = ' AND IFNULL(p.driver_id,0) = 0';
              if ($d->sender_id > 0) $str_sender = ' AND p.sender_id ='.$d->sender_id;
              //if ($d->zone_code) $str_zone = " AND p.zone_code ='".$d->zone_code."' ";
              if ($d->status_id > 0) $str_status = ' AND p.status_id ='.$d->status_id;
            
            //If $driver_id is not Selected, and pickup_driver is selected to filter => use "arrival_date"
            if((!$d->driver_id || $d->driver_id ==-1) && $d->pickup_driver_id > 0)  $use_date ='arrival_date';  
            if ((bool)strtotime($start_date) || (bool)strtotime($end_date)){
                if($use_date === 'finish_date'){
                   $str_dates = "DATE(p.delivery_time) >= '$start_date' AND DATE(delivery_time) <='$end_date'";
                }else $str_dates = "DATE(p.arrival_time) >= '$start_date' AND DATE(arrival_time) <='$end_date'";
            }
              $more_wheres = 'p.warehouse_id = '.$warehouse_id.' AND IFNULL(p.outstanding,0) =0 '.$str_delivery_type.$str_driver.$str_pickup_driver.$str_zone.$str_sender.$str_status;
            }          
           
            $select_cols ='p.id,p.collectible,p.delivery_id, p.order_id, p.zone_code, formatTime(p.delivery_time) AS finish_time, p.delivery_type, p.qr_code AS barcode,p.delivery_notes, p.failure_notes, CASE IFNULL(p.failure_notes,\'\') WHEN \'\' THEN p.delivery_notes ELSE p.failure_notes END AS remarks,HEX(p.driver_pmt_status_id) as driver_pmt_status_id, 
            formatTime(p.arrival_time) AS `arrival_time`, formatTime(p.last_checkout_time) AS last_checkout_time, formatTime(p.first_checkout_time) AS first_checkout_time, s.sender_type_id, st.name AS sender_type, (select x.name from driver as x WHERE x.id = p.driver_id LIMIT 1) AS driver_name, p.driver_id,'.
            '(select x.name from driver as x WHERE x.id = p.pickup_driver_id LIMIT 1) AS pickup_driver_name,'.
            '(IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0) +IFNULL(p.cod_fee,0)) AS fees, 
                (CASE p.cod WHEN 1 THEN (IFNULL(p.price,0) - IFNULL(p.cod_fee,0)) ELSE 0 END) AS cod_amount,
             p.status_id,IFNULL(p.driver_pmt_status_id,0) AS driver_pmt_status_id, IFNULL(p.sender_pmt_status_id,0) AS sender_pmt_status_id,ps.`name` AS status, p.sender_id, s.phone_number AS sender_phone, p.receiver_id, p.receiver_address, p.receiver_name, p.receiver_phone,p.zone_name, s.name AS sender_name, IFNULL(p.driver_total,0) AS driver_total, IFNULL(p.sender_total,0) AS sender_total';
            return DB::table('package AS p')->join('package_statuses as ps','ps.id','=','p.status_id')->join('sender AS s','s.id','=','p.sender_id')->join('sender_type AS st','st.id','=','s.sender_type_id')->selectRaw($select_cols)->whereRaw($str_dates)->whereRaw($str_driver_pmt)->whereRaw($str_sender_pmt)->where('p.branch_id',$branch_id)->whereRaw($more_wheres)->orderByRaw($str_order)->get();

           }
 
    // //Now allow user to update  package's agent_notes (Notes by driver because driver is an agent)
    // //agent_notes such as "Customer paid through ABA bank or ACLEDA bank directly and change COD status"
    // function updateAgentPackage($d){
    //     $ss = UM::getUserInfoByToken($d);
    //     if ($ss->status_code !==200) return $ss; //user not authenticated
    //      //need permission to do this task

    //     $branch_id = $ss->branch_id;
    //     if(!isset($d->package_id)) $d->package_id = 0;
    //     $p = $this->quickInfo($d->package_id);
    //     if($p == null) {
    //         return "Package identifier is not valid";
    //     }
    //     $d->agent_notes = isset($d->agent_notes)?$d->agent_notes:null;
    //     if (empty($d->agent_notes)) return 'No agent notes provided';        
    //     DB::table('package')->where('branch_id',$branch_id)->where('id',$d->package_id)->update(array('agent_notes'=>$d->agent_notes));
    //     return null; 
    // }

    function getFormOptions($id=null,$ss){
        $branch_id = $ss->branch_id;
      return (object)[
          'warehouses'=>GeneralSettings::options_warehouse($ss),
          'zones'=>DB::table('zones as z')->whereRaw('IFNULL(inactive,0) =0')->selectRaw('z.zone_code, CONCAT(zone_code, \' \',zone_name) AS zone_name')->get(),
          'senders'=>DB::table('sender AS s')->where('s.branch_id',$branch_id)->selectRaw("s.id,s.name AS sender_name")->get(),
          'drivers'=>DB::table('driver AS d')->where('d.branch_id',$branch_id)->selectRaw("d.id,d.name AS driver_name")->get(),
          'statuses'=>DB::table('package_statuses AS ss')->where('ss.stage','delivery')->where('outstanding',0)->selectRaw("ss.id,ss.name")->get()
      ];  
    }
}
