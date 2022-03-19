<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Notifier;
use Session;
use DB;
use Carbon\Carbon;

class PickupRequest extends Model
{
    use HasFactory;
    //$d = {access_token,code} 
    function getSenderInfoByCode($user_session,$code){ 
       $branch_id = $user_session->branch_id; 
       $rows = DB::table('sender AS s')->where('branch_id',$branch_id)->where('code',$code)->selectRaw('s.id,s.name, s.sender_type_id, s.status_code')->limit(1)->get();
       foreach($rows as $row) return $row;
       return null;
    }
    function getSenderInfoById($user_session,$sender_id){ 
        $branch_id = $user_session->branch_id; 
        $rows = DB::table('sender AS s')->where('branch_id',$branch_id)->where('id',$sender_id)->selectRaw('s.id,s.name, s.sender_type_id, s.status_code')->limit(1)->get();
        foreach($rows as $row) return $row;
        return null;
     }

     //Takes a @delivery_id and transform it into a formal 10-dgit tracking number with some prefix, if any
     function getTrackingNumber($uss,$new_id){
        $num = formatNumber($new_id,10);
        $use_prefix = get_settings_value($uss,'USE_TRACK_PREFIX','number');
        $prefix = null;
        if($use_prefix ==1) $prefix = get_settings_value($uss,'TRACK_PREFIX','string');  
        return $prefix.$num;
    }
   
    function getZoneByCode($branch_id,$zone_code) {
        $rows = DB::table('zones AS z')->where('z.branch_id',$branch_id)->whereRaw("z.zone_code ='".$zone_code."'")->selectRaw('z.zone_code,z.zone_type,z.zone_name,z.city_id,z.district_id,z.commune_id,z.country_id')->limit(1)->get(); 
        foreach($rows as $row) return $row;
        return null;
    }

     function savePickupRequest($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@';
        
        $branch_id = $ss->branch_id;
        if(!isset($d->order_id)) $d->order_id = 0;
          
        $result =(object)[];
        $initial_order_status_id =1; // Pending

        $is_from_mobile = isset($d->is_from_mobile)?$d->is_from_mobile:0; 
        if(!isset($d->receivers)) $d->receivers = [];
        if(!isset($d->sender_id)) $d->sender_id = 0;
        if(!isset($d->product_type)) $d->product_type = null;
        if(!isset($d->request_vehicle_type)) $d->request_vehicle_type =null;
        if(!isset($d->qty)) $d->qty=0;
        if(!isset($d->delivery_type)) $d->delivery_type =null;
        //$delivery_type is defined in case when programmer's get confused with "$d->delivery_type"  
        $delivery_type = $d->delivery_type;
        if (!isset($d->pickup_address)) $d->pickup_address = null;
        if (!isset($d->sender_code)) $d->sender_code = null;
        if (!isset($d->delivery_condition)) $d->delivery_condition ='None';
        $request_pickup_time = isset($d->request_pickup_time)?convertDate($d->request_pickup_time):null;
 
        //get Location latitude and Longtitude from the Sender;s current Location given by Merchant Mobile app
        $d->loc_lat = isset($d->loc_lat)?$d->loc_lat:null;
        $d->loc_lat = isset($d->loc_lat)?$d->loc_lat:null;

        //Request_date = current server time (by time zone "Asia/Bangkok" )
        $d->request_date = getNowTime();
        //Each Delivery order record is stored 10 days, after which If it is not picked => the Order is automatically deleted
        $expiry_date = Carbon::now()->addDay(10);

        /*** THIS CODE FOR TESTING date time and timestamp on server ***/
        //    DB::table('testtable')->delete();
        //    DB::table('testtable')->insert(array('create_date'=>$d->request_date));
        //    $result->status ='Error';
        //    $result->error_message = 'request date = '.$d->request_date;
        //    return $result;

        if (empty($delivery_type)) {
            $result->status ='Error';
            $result->error_message = 'Delivery Type is not correct';
            return $result; // return createError('Sender identity is not correct',)
        }
    
        $sender = $this->getSenderInfoById($ss,$d->sender_id);
        if (!$sender) {
            $result->status ='Error';
            $result->error_message = 'Sender identity is not valid';
            return $result; // return createError('Sender identity is not correct',)
        }
        if(empty($sender->sender_type_id)) $sender->sender_type_id =1;

        // if (!($d->qty >0)) {
        //     $result->status ='Error';
        //     $result->error_message = 'Number of packages must be a positive integer!';
        //     return $result;
        // } 
        if (empty($d->product_type)) {
            $result->status ='Error';
            $result->error_message = 'Product Type cannot be empty!';
            return $result;
        }
         
        if (!isset($d->packages[0]) && $d->qty <=0){
            $result->status ='Error';
            $result->error_message = 'Number of packages is not correct!';
            return $result;
        }

        if (empty($d->request_vehicle_type)){
             $result->status ='Error';
            $result->error_message = 'Requested Vehicle Type cannot be empty!';
            return $result;
        }

        $v_type_exists =DB::table('vehicle_type')->where('branch_id',$branch_id)->where('code',$d->request_vehicle_type)->limit(1)->exists();
           $v_code = strtolower($d->request_vehicle_type);

        if (in_array($v_code,['moto','moto cycle','moto bike']))
              $v_code ='Moto Bike';
        else if (in_array($v_code,['tuk tuk','tuk','tok tok'])) 
              $v_code ='Tuk Tuk';

        if(!$v_type_exists) {
            DB::table('vehicle_type')->insert(array(
                'branch_id'=>$branch_id,
                'code'=>$v_code,
                'name'=>$d->request_vehicle_type
            ));
        }
        
        //$deliveryTypes =['normal','fast'];
        // if (!in_array(strtolower($d->delivery_type),$deliveryTypes)) {
        //     $result->status ='Error';
        //     $result->error_message = 'Delivery Type is not correct!';
        //     return $result;
        // } 
 
        $tracking_number = null;
        if ($d->order_id > 0) {
            DB::table('order')->where('branch_id',$branch_id)->where('id',$d->order_id)->update([
                'delivery_condition'=>$d->delivery_condition, // {VIP,MA,AT,AA,AT}
                //'delivery_type'=>$d->delivery_type, /** @delivery_type = {Normal,Fast,"Pick Morning, Delvier Afternoon","Pick Afternoon, deliver Tomorrow"}**/
                //'code' => $d->order_code,  
                'order_canceled' => 0, //{0,1}
                'request_pickup_time'=>$request_pickup_time,
                'status_id'=>$initial_order_status_id, /** If "order_canceled = true" => "status_id" = 0 which means the order is Canceled **/
                //'entry_type' => 0, // entry_type = 0 => this order data entry done by api called by Merchant, 1 = this order entry is entered by admin staff on behalf of the Merchant
                'sender_id' => $sender->id,
                'sender_type_id' => $sender->sender_type_id,
                'product_type' => $d->product_type,
                'qty' => $d->qty,
                'request_vehicle_type' => $d->request_vehicle_type,
                'pickup_address' => $d->pickup_address,
                'update_user'=>$ss->login_name,
                'update_date'=>getNowTime()
            ]);
           $tracking_number = $d->tracking_number;
        } else {
           
            DB::table('order')->insert([
                'branch_id' => $branch_id,
                'request_date'=>$d->request_date,
                'request_pickup_time'=>$request_pickup_time,
                'code'=>null, //order_code becomes tracking_number when driver picks up the goods,                
                'delivery_condition'=>$d->delivery_condition, // {None,VIP,MA,AT,AA,AT}
                'delivery_type'=>$delivery_type, /** @delivery_type = {Normal,Fast,"Pick Morning, Delvier Afternoon","Pick Afternoon, deliver Tomorrow"}**/
                //'priority_id' => 0,  
                'order_canceled' => 0, //{0,1}
                'status_id'=>$initial_order_status_id, /** If "order_canceled = true" => "status_id" = 0 which means the order is Canceled **/
                //'entry_type' => 0, // entry_type = 0 => this order data entry done by api called by Merchant, 1 = this order entry is entered by admin staff on behalf of the Merchant
                'sender_id' => $sender->id,
                'sender_type_id' => $sender->sender_type_id,
                'product_type' => $d->product_type,
                'qty' => $d->qty,
                'request_vehicle_type' => $d->request_vehicle_type,
                'pickup_address' => $d->pickup_address,
                'loc_lat'=>$d->loc_lat,
                'loc_lng'=>$d->loc_lng,
                'expiry_date'=>$expiry_date,
                'create_user'=>$ss->login_name,
                'create_date'=>getNowTime()
            ]);
            $new_order_id = DB::getPdo()->lastInsertId();
            $d->order_id = $new_order_id;
            $tracking_number = $this->getTrackingNumber($ss,$new_order_id);  
            // $code = formatNumber($d->order_id,10);
            DB::table('order')->where('id',$new_order_id)->where('branch_id',$branch_id)->update(array('code'=>$tracking_number));
        }
          
        $c;
        $i =0 ;
          
        do{
            if (!isset($d->packages[$i])) break;
            $c = (object)$d->packages[$i];

            if(!isset($c->receiver_name)) $c->receiver_name = $c->receiver_phone;
            if(!isset($c->receiver_phone)) $c->receiver_phone =null;
            if(!isset($c->receiver_address)) $c->receiver_address =null;
            if(!isset($c->zone_code)) $c->zone_code =null;
            
            if(!isset($c->billed_kg)) $c->billed_kg =0;
            if(!isset($c->actual_kg)) $c->actual_kg =0;

            $c->delivery_type = isset($c->delivery_type)?$c->delivery_type:null;
            if(!isset($c->delivery_condition)) $c->delivery_condition = $d->delivery_condition;
            $zone = $this->getZoneByCode($branch_id,$c->zone_code);
            //Process package size
                $size = isset($c->size)?$c->size:null;
                if($size){
                    $m = (object)$size;
                    if (isset($m->length)){
                        $c->dim_x =$m->length;
                        $c->dim_y =$m->width;
                        $c->dim_h =$m->height;
                    }
                }
            //end process pacakge size

            if ($d->size)
            $c->price = isset($c->price)?$c->price:0;
            if(!isset($c->zone_code)) $c->zone_code =null;
            $c->cod = isset($c->cod)?$c->cod:0; //default COD = 0 (No)
            $c->df_payer = isset($c->df_payer)?$c->df_payer:'Sender'; // default "def_payer":"Sender" 
            $c->delivery_fee = isset($c->delivery_fee)?$c->delivery_fee:0;
            $c->base_fee = isset($c->base_fee)?$c->base_fee:0;
            $c->cod = isset($c->cod)?$c->cod:0;
            $c->cod_fee = isset($c->cod_fee)?$c->cod_fee:0;
            $c->forwarding_cost = isset($c->forwarding_cost)?$c->forwarding_cost:0;
            
            $p_status_id =1; //Available for Pickup
            DB::table('order_receivers')->insert([
                'order_id' =>$d->order_id, //newly created order_id
                'branch_id' =>$branch_id,
                'sender_id'=>$sender->id,
                'delivery_type'=>$delivery_type,
                'receiver_name' => $c->receiver_name,
                'receiver_phone' =>$c->receiver_phone,
                'zone_code' => $c->zone_code,
                'zone_name'=>$zone->zone_name,  
                'receiver_address' => $c->receiver_address,
                'actual_kg'=> $c->actual_kg,
                'billed_kg'=> $c->billed_kg,
                'dim_x'=>isset($c->dim_x)?$c->dim_x:0,
                'dim_y'=>isset($c->dim_y)?$c->dim_y:0,
                'dim_h'=>isset($c->dim_h)?$c->dim_h:0,
                'cod'=>isset($c->cod)?$c->cod:0,
                'price'=>isset($c->price)?$c->price:0,
                'cod_fee'=>$c->cod_fee,
                'df_payer'=>isset($c->df_payer)?$c->df_payer:'Sender',
                'base_fee'=>$c->base_fee,
                'delivery_fee'=>$c->delivery_fee,
                'forwarding_cost'=>$c->forwarding_cost,
                'status_id'=>$p_status_id,
                'create_user' => $ss->login_name,
                'create_date'=>getNowTime()
            ]);
            $i++;
        }while($c);

        if ($i > 0) DB::table('order')->where('branch_id',$branch_id)->where('id',$d->order_id)->update(array('qty'=>$i));
          
        $result->order_id = $d->order_id;
        $result->tracking_number = $tracking_number; //Not yet shown to Seller until a driver picks the goods
        $result->error_message = null;
        $result->status ='OK'; 
        if ($is_from_mobile) {
            $cnt = $i+1;
            //$columns => get the preset set of columns
            $columns = null;
            $order = self::getProps($branch_id,$d->order_id,$columns);
            if(!$order) $order = (object)[];
            $order->branch_id = $branch_id;

            //Make merchant_id becomes sender_id (that is ID of merchant)
            $order->merchant_id = isset($order->sender_id)?$order->sender_id:null; 
         
            //sender_id is usually the ID of Merchant, But in this context, we use "merchant_id" instead because sender_id is ID of user who fires the event
            //So @sender_id is ID of user who sends the event
            $order->sender_id = $ss->user_id; // a bit confused with "sender_id", but this user_id is sender of event
            //$data = (object)['branch_id'=>$branch_id,'sender_id'=>$ss->user_id,'order_id'=>$d->order_id,'sender_name'=>$sender->name,'qty'=>$d->$cnt];
            if (empty($d->pickup_address)) $d->pickup_address="NA"; else $d->pickup_address =" អសយដ្ឋាននៅ ".$d->pickup_address;
            $order->message ="មានទំនិញត្រូវទៅយកពី ".$sender->name.$d->pickup_address; 
            $err = Notifier::notify_admin('merchant_created_order',$order);
            if ($err) {
                $result->notification_error = $err;
                $result->event_notified =0;
            }else  $result->event_notified =1;
            
        } 
        return $result;
    }

    //if $cols is NULL => use defeaul cols defined in this method
    static function getProps($branch_id=null,$id=null,$cols=null){
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

    //$d = {'request_date','sender_id','status_id'}
     function getPickupList($d) {
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@';

        $branch_id = $ss->branch_id;
        $start_date = isset($d->start_date)?$d->start_date:null;
        $start_date = convertDate($start_date);

        $end_date = isset($d->end_date)?$d->end_date:null;
        $end_date = convertDate($end_date);

        $delivery_type = isset($d->delivery_type)?sanitize($d->delivery_type):null;
        //if (!(bool)strtotime($date)) $date = date('Y-m-d');
        $status_id = isset($d->status_id)?$d->status_id:-1; //NULL =  by default, user did not choose anything, -1: All statuses
        $sender_id = isset($d->sender_id)?sanitize($d->sender_id):null;
        $driver_id = isset($d->driver_id)?sanitize($d->driver_id):null;
        $str_sender= null;
        $str_driver = null;
        $str_status = null;
        $str_dates = null;
        $str_search = null;
        $str_delivery_type =null;

        if (!empty($d->search_value)) {
            $str_search =" AND (o.code ='".$d->search_value."' OR s.phone_number ='".$d->search_value."' OR s.name LIKE '%".escape_like_str($d->search_value)."%') ";
            $more_wheres ="1=1 ".$str_search;
        } else {
            if ($status_id ==-1) 
               $str_status = null;
            else if ($status_id ==0) 
               $str_status = " AND o.status_id =0";
            else if ($status_id > 0) 
              $str_status = " AND o.status_id ='".sanitize($status_id)."' ";
            if($sender_id > 0) $str_sender = " AND o.sender_id ='".$sender_id."' ";
            if($driver_id > 0) $str_driver = " AND o.driver_id ='".$driver_id."' "; 
            if ((bool)strtotime($start_date) && (bool)strtotime($end_date)) {
                $str_dates = " AND DATE(o.request_date) >='". $start_date."' AND DATE(o.request_date) <= '".$end_date."' ";     
            }
            if (!empty($delivery_type)) $str_delivery_type = " AND o.delivery_type ='".$delivery_type."'";
            if ($status_id ==5) //NOTE that order.completed =1 also means order.status_id = 5 //if status ="Arrived warehouse" => query includes "Completed" Order as well 
              $more_wheres = " o.completed =1 ".$str_dates.$str_sender.$str_delivery_type.$str_driver;
            else 
              $more_wheres = " IFNULL(o.completed,0) = 0 ".$str_dates.$str_driver.$str_sender.$str_status.$str_delivery_type;
        }
        //CASE sign(IFNULL(o.status_id,0) -4) WHEN 1 THEN (SELECT COUNT(p.id) FROM package AS p WHERE p.branch_id ='".$branch_id."' AND p.order_id = o.id) ELSE o.qty END AS qty
        $rows = DB::table('order AS o')->join('sender AS s','s.id','=','o.sender_id')->join('package_statuses AS ps','ps.id','=','o.status_id')->where('o.branch_id',$branch_id)->whereRaw($more_wheres)->selectRaw("o.id as order_id,IFNULL(o.completed,0) AS completed,o.delivery_type, o.delivery_condition, o.code as order_code, o.request_vehicle_type, o.sender_id, s.name AS sender_name, s.phone_number AS sender_phone, DATE_FORMAT(o.request_date,'%d %b %Y') AS request_date, encode_time(DATE_FORMAT(o.request_date,'%r')) AS request_time,o.qty, o.product_type, o.pickup_address, o.status_id, ps.name AS order_status, (SELECT d.name FROM driver as d WHERE d.id = o.driver_id LIMIT 1) AS driver_name")->orderByRaw('ps.display_order ASC,o.create_date DESC')->get();
        return $rows;
    }
    //getPickupRequests Delivery Order List that not yet completed AT WAREHOUSE
    function getOutstandingDeliveryOrders($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@';
        $branch_id = $ss->branch_id;
        $sender_id = $d->sender_id;
        $rows = DB::table('order AS o')->join('sender AS s','s.id','=','o.sender_id')->join('package_statuses AS ps','ps.id','=','o.status_id')->selectRaw("o.code AS order_code,o.id AS order_id, DATE_FORMAT(o.create_date,'%d %b %Y') AS request_date,o.qty,ps.name AS status, (SELECT CONCAT(name,'||',phone_number) FROM driver WHERE id = o.driver_id LIMIT 1) AS driver_info")->where('o.branch_id',$branch_id)->where('sender_id',$sender_id)->whereRaw('IFNULL(completed,0) =0')->whereRaw("o.status_id <5")->orderByRaw('o.create_date DESC')->get(); 
        foreach($rows as $row) {
            $row->driver_name = null;
            $row->driver_phone = null;
            if($row->driver_info) {
                $st = explode('||',$row->driver_info);
                $row->driver_name = isset($st[0])?$st[0]:null;
                $row->driver_phone = isset($st[1])?$st[1]:null;
                $row->driver_info = null;
            } 
        }
        return $rows;
    }
     /***
        $lat1 //latitude of first point
        $lon1 //longitude of first point 
        $lat2 //latitude of second point
        $lon2 //longitude of second point 
        $unit //unit- km or mile  
      ***/
    //getDistance() | getDistanceBetween2Points()
    function point2point_distance($lat1, $lon1, $lat2, $lon2, $unit='K') 
    { 
        $theta = $lon1 - $lon2; 
        $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta)); 
        $dist = acos($dist); 
        $dist = rad2deg($dist); 
        $miles = $dist * 60 * 1.1515;
        $unit = strtoupper($unit);

        if ($unit == "K") 
        {
            return ($miles * 1.609344); 
        } 
        else if ($unit == "N") 
        {
        return ($miles * 0.8684);
        } 
        else 
        {
        return $miles;
      }
    }   

     //return list of avaialable pickup request for driver to accept
     function getAvailablePickupList($d) {
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@';

        $branch_id = $ss->branch_id;
        $driver_id = $d->driver_id;

        $date = null; // Date('Y-m-d'); //today date
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
          $data->items = DB::table('order AS o')->join('sender AS s','s.id','=','o.sender_id')->join('package_statuses AS ps','ps.id','=','o.status_id')->selectRaw("o.id AS order_id, NULL AS distance_km, o.code AS order_code,DATE_FORMAT(o.create_date,'%d %b %Y') AS request_date, DATE_FORMAT(o.create_date,'%r') AS request_time, o.delivery_type,o.sender_id,s.name AS sender_name, s.email AS sender_email, s.phone_number AS sender_phone, o.product_type, o.qty, o.request_vehicle_type, o.pickup_address, o.status_id,ps.name AS status" )->where('o.branch_id',$branch_id)->whereRaw($str_dates)->where("o.status_id",1)->limit($show_last_rows)->orderByRaw("o.create_date DESC")->get(); 
        else
          $data->items = DB::table('order AS o')->join('sender AS s','s.id','=','o.sender_id')->join('package_statuses AS ps','ps.id','=','o.status_id')->selectRaw("o.id AS order_id, NULL AS distance_km, o.code AS order_code,DATE_FORMAT(o.create_date,'%d %b %Y') AS request_date, DATE_FORMAT(o.create_date,'%r') AS request_time, o.delivery_type,o.sender_id,s.name AS sender_name, s.email AS sender_email, s.phone_number AS sender_phone, o.product_type, o.qty, o.request_vehicle_type, o.pickup_address, o.status_id,ps.name AS status" )->where('o.branch_id',$branch_id)->where("o.status_id",1)->whereRaw($str_dates)->orderByRaw("o.create_date DESC")->get(); 
       
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
        return $data;
    }

    //return count of Pending Orders
    function getPendingOrdersCount($branch_id){
        $rows = DB::table("order AS o")->where('o.branch_id',$branch_id)->where("o.status_id",1)->selectRaw("COUNT(o.id) AS cnt")->get();
        foreach($rows as $row) return $row->cnt;
        return 0;
    }

    function getDriverTaskCounts($branch_id, $driver_id){
        $data = (object)['pickup_count'=>0,'delivery_count'=>0];
        $rows = DB::table("order AS o")->where('o.branch_id',$branch_id)->where('driver_id',$driver_id)->where("o.status_id",2)->selectRaw("COUNT(o.id) AS cnt")->get();
        foreach($rows as $row) $data->pickup_count = $row->cnt;
        
        //count number of active delivery trips
        $rows = DB::table("delivery AS d")->where('d.branch_id',$branch_id)->where('d.driver_id',$driver_id)->where("d.status_id",2)->selectRaw("COUNT(d.id) AS cnt")->get();
        foreach($rows as $row) $data->delivery_count = $row->cnt;
        return $data;
    }

    //return a list of Accepted pickup list accepted by a @driver
    function getAcceptedPickupListByDriver($d) {
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@';

        $branch_id = $ss->branch_id;
        $driver_id = $d->driver_id;
        $date = null; // Date('Y-m-d'); //today date
        if (!(bool)strtotime($date)) $date = date('Y-m-d');
        $str_dates ="DATE(o.create_date) = '".$date."' ";
        
        $rows = DB::table('order AS o')->join('sender AS s','s.id','=','o.sender_id')->join('package_statuses AS ps','ps.id','=','o.status_id')->selectRaw("o.id AS order_id,o.code AS order_code, o.delivery_type, o.request_date, o.sender_id,s.name AS sender_name, s.email AS sender_email, s.phone_number AS sender_phone, o.product_type, o.qty, o.request_vehicle_type, o.pickup_address, o.status_id, ps.name AS status" )->where('o.branch_id',$branch_id)->whereRaw($str_dates)->where('o.driver_id',$driver_id)->get(); 
        return $rows;
    }

      function getComboItems_delivery_condition($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@';
        $branch_id = $ss->branch_id;
         $rows = DB::table('delivery_conditions AS c')->where('branch_id',$branch_id)->selectRaw("name,display_name")->get();
         return $rows;
      }
     function getComboItems_product_type($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@';
        $branch_id = $ss->branch_id;
        $rows = DB::table('product_types AS pt')->where('branch_id',$branch_id)->selectRaw("id,name AS product_type")->get();
        return $rows;
     }    
     function getFormData_pickup_request($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@';
        $branch_id = $ss->branch_id;
        $data = (object)array();
        $data->senders = DB::table('sender AS s')->where('branch_id',$branch_id)->selectRaw("s.id, CONCAT(s.name,' | ',s.code) AS name")->orderByRaw('s.name ASC')->get();
        $data->warehouses = DB::table('warehouses AS h')->where('h.branch_id',$branch_id)->selectRaw('h.id,h.name AS warehouse_name')->orderByRaw('h.name ASC')->get();
        $data->zones = DB::table('zones AS z')->where('z.branch_id',$branch_id)->selectRaw("z.zone_code, CONCAT(z.zone_code,' | ',z.zone_name) AS zone_name")->orderByRaw('z.zone_name ASC')->get();
        $data->warehouses = DB::table('warehouses AS h')->where('h.branch_id',$branch_id)->selectRaw('h.id,h.name AS warehouse_name')->orderByRaw('h.name ASC')->get();
        $data->vehicle_types = DB::table('vehicle_type AS v')->where('v.branch_id',$branch_id)->selectRaw("lower(code) AS code,name AS vehicle_type")->get();
        $data->conditions = DB::table('delivery_conditions AS c')->where('branch_id',$branch_id)->selectRaw("name,display_name")->get();
        $data->product_types = DB::table('product_types AS pt')->where('branch_id',$branch_id)->selectRaw("name AS product_type")->get();
         
        return $data;
     }

     function getPickupInfo($d) {
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@';
        $id = $d->order_id; 
        $branch_id = $ss->branch_id;
        $rows = DB::select(DB::raw("SELECT o.id as order_id, o.delivery_condition, o.delivery_type,o.code as order_code, o.request_vehicle_type, o.sender_id,
         s.name as sender_name, s.code AS sender_code, DATE_FORMAT(o.request_date,'%d %b %Y %T') AS request_date, o.qty, o.product_type,
          o.pickup_address, (SELECT `name` FROM package_statuses WHERE id = o.status_id LIMIT 1) AS order_status, 
          o.status_id, (SELECT d.name FROM driver as d WHERE d.id = o.driver_id LIMIT 1) AS driver_name 
          FROM `order` AS o INNER JOIN sender as s ON s.id = o.sender_id WHERE o.branch_id ='".sanitize($branch_id)."' AND o.id ='".sanitize($id)."' LIMIT 1"));
       foreach($rows as $row) return ($row);
       return (null);
    }

    //Admin user assigns a driver to pickup. If the item already picked up, then this is not allowed
    function assignPickupDriver($d) {
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@';

        $branch_id = $ss->branch_id;
        $order_id = $d->order_id;
        $result =(object)['status'=>'OK','error_message'=>null];
        $d->is_from_mobile = isset($d->is_from_mobile)?$d->is_from_mobile:0;
        
        $target_user_id = $d->driver_id;
        $rows = DB::table('driver')->where('branch_id',$branch_id)->where('id',$d->driver_id)->limit(1)->selectRaw('id,name,phone_number')->get();
        $driver_name;
        foreach($rows as $row) $driver_name = $row->name;  
        if(empty($driver_name)) return DV::error("Driver identity is not correct!"); 

        $status_id = 1;
        $rows = DB::table('order')->where('branch_id',$branch_id)->where('id',$order_id)->selectRaw('status_id')->limit(1)->get();
        foreach($rows as $row) $status_id = $row->status_id;
        if ($status_id >= 3) {
            $result->error_message = "Cannot assign driver to this delviery order because it has been picked up or booked already";
            $result->status ='Error';
            return $result;
        }
        if($status_id > 2){
            DB::table('delivery')->where('branch_id',$branch_id)->where('order_id',$order_id)->delete();
            DB::table('package')->where('branch_id',$branch_id)->where('order_id',$order_id)->delete();
            DB::table('order_receivers')->where('branch_id',$branch_id)->where('order_id',$order_id)->delete();
        }  
        DB::table('order')->where('branch_id',$branch_id)->where('id',$order_id)->update([
            'driver_id'=>$d->driver_id,
            'status_id'=>2 //status = 'Accepted'
        ]);

        $status_name= null;
        $rows = DB::table('package_statuses AS ss')->where('ss.id',2)->selectRaw('name')->limit(1)->get();
        foreach($rows as $row) $status_name = $row->name;
        $result->statusInfo = (object)array('status_id'=>2,'status'=>$status_name);
        $result->error_message = null;
        $result->status ='OK';
        
        if($d->is_from_mobile==1){
            //In case Driver accepts Delivery Order
            $msg = $driver_name." accepted to pick up an order";
            $data =(object)['branch_id'=>$branch_id,'user_id'=>$ss->user_id,'order_id'=>$order_id,'driver_id'=>$d->driver_id,'driver_name'=>$driver_name,'message'=>$msg,'accept_time'=>getNowTime()];
            $err = Notifier::notify_admin('driver_accepted_order',$data);
            if ($err) {
                $result->notification_error = $err;
                $result->event_notified =0;
            }else  $result->event_notified =1;
    
        }else{
           //In case Admin Assign driver to pickup
           //{'branch_id','event_name','message','title','image_url',['driver_id'] or [user_id]}
           $message ="You got pickup assignment";
           $eventInfo = (object)['branch_id'=>$branch_id,'target_user_id'=>$target_user_id,'event_name'=>'pickup_assigned','message'=>$message,'title'=>'Pickup Assigned','image_url'=>null];
           $data = (array)$this->getOrderInfo_local($branch_id,$order_id,0);
           $result->notification_status = Notifier::notify_driver($eventInfo,$data);
        }
               
        return $result;
    }

    //Admin user changes pickup Driver (in case of updating or correction only). Otherwise, Admin user must use "assignPickupDriver()" method 
    function changePickupDriver($d) {
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@';

        $branch_id = $ss->branch_id;
        $order_id = $d->order_id;
        $d_exists = DB::table('driver')->where('branch_id',$branch_id)->where('id',$d->driver_id)->limit(1)->exists();
        
        if(!$d_exists){
           return "Driver identity is not correct!";
        }
        $status_id = 1;
        $prev_driver_id = null;
        $rows = DB::table('order')->where('branch_id',$branch_id)->where('id',$order_id)->selectRaw('driver_id,status_id')->limit(1)->get();
        foreach($rows as $row) {
            $status_id = $row->status_id;
            $prev_driver_id = $row->driver_id;
        }
        if (empty($prev_driver_id) || $prev_driver_id <=0) {
            return "Because there was no driver assigned to this Delivery Order yet, so you can assign a driver instead of changing driver";
        }  
        DB::table('order')->where('branch_id',$branch_id)->where('id',$order_id)->update([
            'driver_id'=>$d->driver_id 
        ]);

        $data = (object)['branch_id'=>$branch_id,'sender_id'=>$ss->user_id,'previous_driver_id'=>$prev_driver_id,'new_driver_id'=>$d->driver_id,'message'=>'អ្នកបើកបរត្រូវបានផ្លាស់ប្តូរ'];
        $err = Notifier::notify_admin('driver_changed',$data);
        return null;
    }

    function updatePickup($d) {
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@';

        $branch_id = $ss->branch_id;
        $id = $d->order_id;
        if($d->order_id <=0) return ("Order identifier is not valid");
        if(empty($d->request_vehicle_type)) return ("Vehicle Type cannot be empty");
        DB::table('order')->where('branch_id',$branch_id)->where('id',$id)->update(array(
            'request_vehicle_type'=>$d->request_vehicle_type,
             'delivery_type'=>$d->delivery_type,
             'product_type'=>$d->product_type,
             'qty'=>$d->qty,
             'pickup_address'=>$d->pickup_address
        ));
        return (null);
    }

    //Update Order status or Pickup status $d = {'order_id','status_id'}
    function updateOrderStatus($d) {
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@';

        $branch_id = $ss->branch_id;
        $order_id = $d->order_id;
        $status_id = sanitize($d->status_id);
        $driver_id = sanitize($d->driver_id);
        $result = (object)array('status'=>'OK','error_message'=>null);
        
        if (empty($status_id) || $status_id ==-1) return DV::error('Status is not correct!');

        /* delete from table "delivery" and "package" when user changes order Status to below 3. NOTE status_id =3 => Picked, but not yet booked */
        //$status_id = 3 // Picked, but not yet booked
        if ($status_id <=3) {
            DB::table('delivery')->where('branch_id',$branch_id)->where('order_id',$order_id)->delete();
            DB::table('package')->where('branch_id',$branch_id)->where('order_id',$order_id)->delete();
            DB::table('order_receivers')->where('branch_id',$branch_id)->where('order_id',$order_id)->update(array(
                'driver_id'=>$driver_id,
                'status_id'=>$status_id
            ));
        } else if ($status_id ==0 || $status_id ==1) {
            //status_id ==1 => alvailable for Pickup => so remove driver_id
            $driver_id = null;
        }
       
         $current_status_id = null;
         $order_code =null;      
         $rows = DB::table('order AS o')->where('o.branch_id',$branch_id)->where('o.id',$order_id)->selectRaw('o.status_id,o.code AS order_code')->limit(1)->get();   
         foreach($rows as $row) {
            $current_status_id = $row->status_id;
            $order_code = $row->order_code;
         }

        if ($current_status_id == null || $order_id <=0 || empty($order_id)) return DV::error('Delivery Order identity is not valid');

        if ($current_status_id < $status_id){
             if ($status_id >3) return DV::error('Status is allowed to be changed up to `Picked` or lower status'); 
        }

        if ($status_id ==3 || $status_id ==4) {
           if (empty($driver_id) || $driver_id <=0) return DV::error('Driver is required for pickup');  
        }

        $completed =0;
        if ($status_id > 4) $completed =1;  //status_id =4 "Picked and Booked"
        DB::table('order')->where('branch_id',$branch_id)->where('id',$order_id)->update(['status_id'=>$status_id,'driver_id'=>$driver_id,'completed'=>$completed]);
        //If status ="Available for Pickup" => remove existng driver from Delviery Order
        if ($status_id ==1){
            DB::table('order')->where('branch_id',$branch_id)->where('id',$order_id)->update(['driver_id'=>null]);
        }
        $driver_name = null;
        $status = null;
        $rows = DB::table('driver AS d')->where('branch_id',$branch_id)->where('id',$driver_id)->limit(1)->selectRaw('id,code,name')->get();
        foreach($rows as $row) $driver_name = $row->name; 

        $rows = DB::table('package_statuses AS ss')->where('id',$status_id)->limit(1)->selectRaw('name')->get();
        foreach($rows as $row) $status = $row->name; 
             
              $result->status ='OK';//Status is method's result status
              $result->error_message = null; 
              $result->status_id = $status_id;
              $result->status_name = $status; // status_name is Order status
              $result->driver_id = $driver_id;
              $result->driver_name = $driver_name;

              //begin::Notify "order_status_changed"
                if($current_status_id != $status_id){
                    $message = "Order numbered ".$order_code." changed status to \"".$status."\"";
                    $event_data = (object)['branch_id'=>$branch_id,'order_id'=>$order_id,'order_code'=>$order_code,'sender_id'=>$ss->user_id,'status'=>$status,'status_id'=>$status_id,'completed'=>$completed,'driver_id'=>$driver_id,'driver_name'=>$driver_name,'message'=>$message];
                    Notifier::notify_admin('order_status_changed',$event_data);   
                }
              //end:: notify_order_status_cahnged
              return $result;
    } 

    function getPickupInfo_quick($uss,$id){
        $branch_id = $uss->branch_id;
        $rows = DB::table('order AS p')->where('p.branch_id',$branch_id)->where('p.id',$id)->selectRaw('p.id, p.status_id, p.request_date,p.sender_id')->limit(1)->get();
        foreach($rows as $row) return $row;
        return null;
    }

     //Delete Order or Pickup transaction
     function deletePickup($d) {
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@';

        $id = $d->order_id;
        $branch_id = $ss->branch_id;
        $p = $this->getPickupInfo_quick($ss,$id);
        if ($p == null) return "The provided pickup request identity is not valid!";
        if($p->status_id != 1 && $p->status_id != 0) return ("Pending or Canceled orders can be deleted!");
        DB::table('order')->where('branch_id',$branch_id)->where('id',$id)->delete();
        return null; 
    } 

    function getComboItems_vehicleType($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; 
       $branch_id = $ss->branch_id;
       $rows = DB::select(DB::raw("SELECT v.id, v.name as vehicle_type FROM `vehicle_type` AS v WHERE v.branch_id ='". sanitize($branch_id)."' "));
       return ($rows);
    }

    function getComboItems_sender($data){
        $ss = getSessionInfo($data);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@';

        $branch_id = $ss->branch_id;
        $rows = DB::select(DB::raw("SELECT s.id, s.name as sender_name FROM `sender` AS s WHERE s.branch_id ='".sanitize($branch_id)."' order by s.name ASC"));
        return ($rows);
     }

     function getForm_options_pickuplist($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task

        $branch_id = $ss->branch_id;
        $data = (object)[];
        $data->zones = DB::table('zones AS z')->selectRaw("z.zone_code,CONCAT(z.zone_code,' | ',z.zone_name) AS zone_name")->where('z.branch_id',$branch_id)->orderByRaw('z.zone_name ASC')->get();
        $data->warehouses = DB::table('warehouses AS h')->selectRaw('h.id,h.name as warehouse_name')->where('branch_id',$branch_id)->orderByRaw('h.name ASC')->get();
        $data->senders = DB::table('sender AS s')->selectRaw('s.id,s.name as sender_name')->where('s.branch_id',$branch_id)->orderByRaw('s.name ASC')->get();
        $data->drivers = DB::table('driver AS d')->selectRaw('d.id,d.name as driver_name')->where('d.branch_id',$branch_id)->orderByRaw('d.name ASC')->get();
        $status_filter ="os.id <=5";
        $data->order_statuses = DB::table('package_statuses AS os')->whereRaw($status_filter)->selectRaw('os.id AS status_id,os.name as status_name, os.display_order')->orderByRaw('os.display_order ASC')->get();
        $data->drivers = DB::table('driver AS d')->selectRaw('d.id, d.code,d.name AS driver_name')->get();
        return ($data);
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

      //base_price is fixed price set as Promotion for some sellers. NOTE @zone_code is nevery empty. @zone_code ='all' instead of empty
      function getBaseFee($ss, $sender_id, $zone_code = 'all'){
        $branch_id = $ss->branch_id;
        $today = Date('Y-m-d');
        $more_where = "1=1 AND ((IFNULL(f.never_expires,0) =1) OR (DATE(f.start_date) <='".$today."' AND DATE(f.end_date) >='".$today."' ) )";
        //$more_where = "1=1 AND ((DATE(f.start_date) <='".$today."' AND IFNULL(f.never_expires,0) =1) OR (DATE(f.start_date) <='".$today."' AND DATE(f.end_date) >='".$today."' ) )";
        $str_zone = null;
        if (!empty($zone_code)) $str_zone =" AND f.zone_code ='".$zone_code."' ";
        $more_where .= $str_zone.
        $rows = DB::table("sender_base_price AS f")->where('f.branch_id',$branch_id)->where('f.sender_id',$sender_id)->whereRaw($more_where)->selectRaw("f.price")->limit(1)->get();
        foreach($rows as $row) {
          return (is_numeric($row->price)?$row->price:0);
        } 
        return 0;
      }

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

     function getOrderInfo($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $order_id = sanitize($d->order_id);
        //$context = isset($d->context)?$d->context:0; //context = {0,1} //0= perform Pickup, 1= Receive Packages (at warehouse)

        $rows = DB::table('order AS o')->where('o.branch_id',$branch_id)->where('o.id',$order_id)->join('sender AS s','s.id','=','o.sender_id')->selectRaw("o.id AS order_id,o.status_id, o.code AS order_code, s.id AS sender_id, s.name AS sender_name, s.code As sender_code, DATE_FORMAT(o.request_date,'%d %b %Y %r') AS request_date")->limit(1)->get();
        foreach($rows as $row) {
            $sender_id = $row->sender_id;
            $status_id = $row->status_id; 
            if ($status_id <5) // Perform Pickup for a particular Pickup Request (select packages from table "order_receivers")
               $row->packages = DB::table("order_receivers AS r")->join('sender AS s','s.id','=','r.sender_id')->join('package_statuses AS ps','ps.id','r.status_id')->where('r.branch_id',$branch_id)->where('r.order_id',$order_id)->selectRaw("r.id AS package_id,NULL as barcode,r.sender_id AS sender_id, r.receiver_address,r.receiver_phone,r.receiver_name, r.package_name,r.zone_code,LOWER(r.delivery_type) AS delivery_type,r.zone_name,CONCAT(dim_x,' ',dim_y,' ',dim_h) AS size, r.actual_kg, r.billed_kg, 0 AS base_fee, r.delivery_fee,r.df_payer,r.price,r.cod,r.cod_fee,r.forwarding_cost,ps.name AS status")->get();
            else //if ($status_id >=5) //select packages from table "package"
               $row->packages = DB::table("package AS r")->join('package_statuses AS ps','ps.id','=','r.status_id')->where('r.branch_id',$branch_id)->where('r.order_id',$order_id)->selectRaw("r.id AS package_id,r.qr_code AS barcode,r.sender_id,r.receiver_address,r.receiver_phone,r.receiver_name, r.package_name,r.zone_code,LOWER(r.delivery_type) AS delivery_type,r.zone_name,CONCAT(dim_x,' ', dim_y,' ', dim_h) AS size, r.actual_kg, r.billed_kg, r.base_fee, r.delivery_fee,r.df_payer,r.price,r.cod,r.cod_fee,r.forwarding_cost,r.delivery_notes, ps.name AS status")->get();
               //get COD_Fee percent
               //$cod_fee_percent = $this->getCODFeeCharge($ss,$sender_id);
               //$base_fee_all_zones = $this->getBaseFee($ss,$sender_id,'all'); //Fixed price or base delivery fee
               //$price_list = $this->getSenderPriceList($ss,$sender_id);
               //$row->senderInfo = (object)array('sender_id'=>$sender_id,'cod_fee_percent'=>$cod_fee_percent,'base_fee'=>$base_fee_all_zones,'price_list'=>$price_list);

            return $row;
        }
        return null;
     }

     //getOrderInfo internal use only
     function getOrderInfo_local($branch_id,$order_id,$include_packages = 0){
        $rows = DB::table('order AS o')->where('o.id',$order_id)->join('sender AS s','s.id','=','o.sender_id')->selectRaw("o.id AS order_id,o.status_id, o.code AS order_code, s.id AS sender_id, s.name AS sender_name, s.code As sender_code, DATE_FORMAT(o.request_date,'%d %b %Y %r') AS request_date")->limit(1)->get();
        foreach($rows as $row) {
            if ($include_packages==1) {
                $sender_id = $row->sender_id;
                $status_id = $row->status_id; 
                if ($status_id <5) // Perform Pickup for a particular Pickup Request (select packages from table "order_receivers")
                   $row->packages = DB::table("order_receivers AS r")->join('sender AS s','s.id','=','r.sender_id')->join('package_statuses AS ps','ps.id','r.status_id')->where('r.branch_id',$branch_id)->where('r.order_id',$order_id)->selectRaw("r.id AS package_id,NULL as barcode,r.sender_id AS sender_id, r.receiver_address,r.receiver_phone,r.receiver_name, r.package_name,r.zone_code,LOWER(r.delivery_type) AS delivery_type,r.zone_name,CONCAT(dim_x,' ',dim_y,' ',dim_h) AS size, r.actual_kg, r.billed_kg, 0 AS base_fee, r.delivery_fee,r.df_payer,r.price,r.cod,r.cod_fee,r.forwarding_cost,ps.name AS status")->get();
                else //if ($status_id >=5) //select packages from table "package"
                   $row->packages = DB::table("package AS r")->join('package_statuses AS ps','ps.id','=','r.status_id')->where('r.branch_id',$branch_id)->where('r.order_id',$order_id)->selectRaw("r.id AS package_id,r.qr_code AS barcode,r.sender_id,r.receiver_address,r.receiver_phone,r.receiver_name, r.package_name,r.zone_code,LOWER(r.delivery_type) AS delivery_type,r.zone_name,CONCAT(dim_x,' ', dim_y,' ', dim_h) AS size, r.actual_kg, r.billed_kg, r.base_fee, r.delivery_fee,r.df_payer,r.price,r.cod,r.cod_fee,r.forwarding_cost,r.delivery_notes, ps.name AS status")->get();
                   
            }
           
            return $row;
        }
        return null;
     }
     
     //getOrderpackages() | getPackageList
     function getOrderPackageList($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $order_id = sanitize($d->order_id);
        $status_id = null;
        $sender_id = null;
        $rows = DB::table('order AS o')->where('branch_id',$branch_id)->where('id',$order_id)->selectRaw('status_id,sender_id')->limit(1)->get();
        foreach($rows as $row) {
            $status_id = $row->status_id;
            $sender_id = $row->sender_id;
        }
        if(empty($status_id)) $order_id =-1;
        $rows = [];
        if ($status_id <5) // Perform Pickup for a particular Pickup Request (select packages from table "order_receivers")
          $rows= DB::table("order_receivers AS r")->join('package_statuses AS ps','ps.id','=','r.status_id')->join('sender AS s','s.id','=','r.sender_id')->where('r.branch_id',$branch_id)->where('r.order_id',$order_id)->selectRaw("r.id AS package_id,r.status_id, NULL as barcode,r.delivery_type, r.zone_code,r.zone_name,'".$sender_id."' AS sender_id,s.name AS sender_name, r.receiver_address,r.receiver_phone,r.receiver_name, r.package_name,r.zone_code,LOWER(r.delivery_type) AS delivery_type, r.zone_name,CONCAT(dim_x,' ',dim_y,' ',dim_h) AS size, r.actual_kg, r.billed_kg, 0 AS base_fee, r.delivery_fee,r.df_payer,r.price,r.cod,r.cod_fee,r.forwarding_cost,r.delivery_notes,ps.name AS status, (IFNULL(r.base_fee,0) + IFNULL(r.delivery_fee,0)) AS fees, CASE r.cod WHEN 1 THEN (IFNULL(r.price,0) - IFNULL(r.cod_fee,0)) ELSE 0 END AS cod_amount")->get();
        else //select packages from table "package"
          $rows = DB::table("package AS r")->join('package_statuses AS ps','ps.id','=','r.status_id')->join('sender as s','s.id','=','r.sender_id')->where('r.branch_id',$branch_id)->where('r.order_id',$order_id)->selectRaw("r.id AS package_id,r.status_id,r.qr_code AS barcode,r.delivery_type,r.zone_code,r.zone_name,'".$sender_id."' AS sender_id,s.name AS sender_name,r.receiver_address,r.receiver_phone,r.receiver_name, r.package_name,r.zone_code,LOWER(r.delivery_type) AS delivery_type,r.zone_name,CONCAT(dim_x,' ', dim_y,' ', dim_h) AS size, r.actual_kg, r.billed_kg, r.base_fee, r.delivery_fee,r.df_payer,r.price,r.cod,r.cod_fee,r.forwarding_cost,r.delivery_notes, ps.name AS status,(IFNULL(r.base_fee,0) + IFNULL(r.delivery_fee,0)) AS fees, CASE r.cod WHEN 1 THEN (IFNULL(r.price,0) - IFNULL(r.cod_fee,0)) ELSE 0 END AS cod_amount")->get();
        return $rows;
     }

     //Returns one package's details for editing on Pickup List (when user Reveive packages)
     function getOrderPackageDetails($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $order_id = isset($d->order_id)?sanitize($d->order_id):null;
        $package_id = isset($d->package_id)?sanitize($d->package_id):null;
        $status_id = null;

        $rows = DB::table('order AS o')->where('branch_id',$branch_id)->where('o.id',$order_id)->selectRaw('status_id')->limit(1)->get();
        foreach($rows as $row) $status_id = $row->status_id;
        if(empty($status_id)) $order_id =-1;
        $rows = [];
        if ($status_id <5) // Perform Pickup for a particular Pickup Request (select packages from table "order_receivers")
          $rows= DB::table("order_receivers AS r")->join('sender AS s','s.id','=','r.sender_id')->join('package_statuses AS ps','ps.id','=','r.status_id')->where('r.branch_id',$branch_id)->where('r.order_id',$order_id)->where('r.id',$package_id)->selectRaw("r.id AS package_id,r.status_id, NULL as barcode,r.delivery_type, r.zone_code,r.zone_name, r.sender_id,s.name AS sender_name, r.receiver_address,r.receiver_phone,r.receiver_name, r.package_name,r.zone_code,LOWER(r.delivery_type) AS delivery_type, r.zone_name,CONCAT(dim_x,' ',dim_y,' ',dim_h) AS size, r.actual_kg, r.billed_kg, 0 AS base_fee, r.delivery_fee,r.df_payer,r.price,r.cod,r.cod_fee,r.forwarding_cost,ps.name AS status,(IFNULL(r.base_fee,0) + IFNULL(r.delivery_fee,0)) AS fees, CASE r.cod WHEN 1 THEN (IFNULL(r.price,0) - IFNULL(r.cod_fee,0)) ELSE 0 END AS cod_amount")->limit(1)->get();
        else //select packages from table "package"
          $rows = DB::table("package AS r")->join('package_statuses AS ps','ps.id','=','r.status_id')->join('sender as s','s.id','=','r.sender_id')->where('r.branch_id',$branch_id)->where('r.order_id',$order_id)->where('r.id',$package_id)->selectRaw("r.id AS package_id,r.status_id,r.qr_code AS barcode,r.delivery_type,r.zone_code,r.zone_name,r.sender_id,s.name AS sender_name,r.receiver_address,r.receiver_phone,r.receiver_name, r.package_name,r.zone_code,LOWER(r.delivery_type) AS delivery_type,r.zone_name,CONCAT(dim_x,' ', dim_y,' ', dim_h) AS size, r.actual_kg, r.billed_kg, r.base_fee, r.delivery_fee,r.df_payer,r.price,r.cod,r.cod_fee,r.forwarding_cost,r.delivery_notes, ps.name AS status,(IFNULL(r.base_fee,0) + IFNULL(r.delivery_fee,0)) AS fees, CASE r.cod WHEN 1 THEN (IFNULL(r.price,0) - IFNULL(r.cod_fee,0)) ELSE 0 END AS cod_amount")->limit(1)->get();
        foreach($rows as $row) return $row;
        return [];
     }
 
     function deleteOrderPackage($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $order_id = isset($d->order_id)?sanitize($d->order_id):null;
        $sender_id = isset($d->sender_id)?sanitize($d->sender_id):null;
        $package_id = isset($d->package_id)?sanitize($d->package_id):null;
        
        $result = (object)array('status'=>'OK','error_message'=>null);
        $rows = DB::table('order AS o')->where('branch_id',$branch_id)->where('o.id',$order_id)->selectRaw('status_id')->limit(1)->get();
        foreach($rows as $row) $status_id = $row->status_id;
        if(empty($status_id)) {
           $result->error_message = "Cannot delete item because order identity is not valid";
           $result->status ='Error';
           return $result;
        }

        if($status_id >5){
          $result->error_message = "Cannot delete package with status higher than `Arrived Warehouse`";
          $result->status ='Error';
          return $result;
        }
        
        if($status_id >=5){
           DB::table('package')->where('branch_id',$branch_id)->where('order_id',$order_id)->where('id',$package_id)->delete();
        } else {
            DB::table('order_receivers')->where('branch_id',$branch_id)->where('order_id',$order_id)->where('id',$package_id)->delete();
        }
        $result->error_message=null;
        $result->status ='OK';
        return $result;
     }

     //Save pakcage detail either to table "order_receivers" or "package" table
     function saveOrderPackageDetails($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $order_id = isset($d->order_id)?sanitize($d->order_id):null;
        $sender_id = isset($d->sender_id)?sanitize($d->sender_id):null;
        $package_id = isset($d->package_id)?sanitize($d->package_id):null;

        $delivery_type = isset($d->delivery_type)?$d->delivery_type:null;
        $zone_code = isset($d->zone_code)?$d->zone_code:null;
        $receiver_phone = isset($d->receiver_phone)?$d->receiver_phone:null;
        $price = isset($d->price)?$d->price:null;
        $cod = isset($d->cod)?$d->cod:null;
        $size = isset($d->size)?$d->size:null;
        $df_payer = isset($d->df_payer)?$d->df_payer:null;
        $receiver_address = isset($d->receiver_address)?$d->receiver_address:null;
        $base_fee = isset($d->base_fee)?$d->base_fee:null;
        $delivery_fee = isset($d->delivery_fee)?$d->delivery_fee:null;
        $actual_kg = isset($d->actual_kg)?$d->actual_kg:null;
        $billed_kg = isset($d->billed_kg)?$d->billed_kg:null;
        $status_id = null;
        
        if (!$zone_code) $zone_code = isset($d->zone_name)?sanitize($d->zone_name):null;
        $result = (object)array('status'=>'OK','error_message'=>null);

        if(!in_array(strtolower($delivery_type),['normal','fast'])) {
            $result->status ='Error';
            $result->error_message ='Delivery type is not valid';  
            return $result;
        }

        if(!in_array(strtolower($df_payer),['sender','receiver'])) {
            $result->status ='Error';
            $result->error_message ='DFP option is not valid';  
            return $result;
        }

        if(!$order_id) {
            $result->status ='Error';
            $result->error_message ='Order identity is not valid';  
            return $result;
        }

        if(!$sender_id) {
            $result->status ='Error';
            $result->error_message ='Vendor identity is not valid';  
            return $result;
        }

        $zone = $this->getZoneByCode($branch_id,$zone_code);
        if(!$zone) {
          $result->status ='Error';
          $result->error_message ='Zone is not valid';  
          return $result;
        }

        if(!$receiver_phone) {
            $result->status ='Error';
            $result->error_message ='Receiver phone is not valid';  
            return $result;
          }
  
        $rows = DB::table('order AS o')->where('branch_id',$branch_id)->where('o.id',$order_id)->selectRaw('status_id')->limit(1)->get();
        foreach($rows as $row) $status_id = $row->status_id;
        if(empty($status_id)) $order_id =-1;
        $d->cod_fee = isset($d->cod_fee)?$d->cod_fee:0;
        //Process package size
            $size = isset($d->size)?$d->size:null;
            if($size){
                $m = (object)$size;
                if (isset($m->length)){
                    $d->dim_x =$m->length;
                    $d->dim_y =$m->width;
                    $d->dim_h =$m->height;
                }
            }
       //end process pacakge size

        $input_array = array(
            'order_id'=>$order_id,
            'sender_id'=>$sender_id,
            //'status_id'=>$status_id, // For Insert @status_id =1; //Avaialble for pickup. for UPDATE => do not update status
            'delivery_type'=>$delivery_type,
            'zone_code'=>$zone_code,
            'zone_name'=>$zone->zone_name,
            'receiver_phone'=>$receiver_phone,
            'price'=>$price,
            'df_payer'=>$df_payer,
            'receiver_address'=>$receiver_address,
            'cod'=>$cod,
            'base_fee'=>$base_fee,
            'delivery_fee'=>$delivery_fee,
            'dim_x'=>$d->dim_x,
            'dim_y'=>$d->dim_y,
            'dim_h'=>$d->dim_h,
            'billed_kg'=>$billed_kg,
            'actual_kg'=>$actual_kg    
        );

        if (empty($package_id) || $package_id <=0) //CREATE
        {
            if($status_id <5) //order_receivers table
            {
                $p_status_id = 1;
                $input_array['status_id'] = $p_status_id;
                $input_array['branch_id'] = $branch_id;
                $input_array['create_user'] = $ss->login_name;
                $input_array['create_date'] = getNowTime();
                DB::table('order_receivers')->insert($input_array);
                $package_id = DB::getPdo()->lastInsertId();

            }else//Package table
            {
                $p_status_id = 5;
                $input_array['branch_id'] = $branch_id;
                $input_array['status_id'] = $p_status_id; //Avaiable or pickup
                $input_array['create_user'] = $ss->login_name;
                $input_array['create_date'] = getNowTime();
                DB::table('package')->insert($input_array);
                $package_id = DB::getPdo()->lastInsertId();
            }
        } else //UPDATE
        {
            if($status_id <5) //order_receivers table
            { 
                DB::table('order_receivers')->where('id',$package_id)->where('branch_id',$branch_id)->update($input_array); 
            }else//Package table
            {
                DB::table('package')->where('id',$package_id)->where('branch_id',$branch_id)->update($input_array);
            }
        }
        $input_array['size'] = $d->dim_x." ".$d->dim_y." ".$d->dim_h;
        //@fees Not include @tax_fee,  @cod_fee and @cod_amount
        $fees = $d->base_fee + $d->delivery_fee; 
        
        $input_array['fees'] = $fees;
        $driver_total = 0;
        $sender_total =0;

        if(!is_numeric($d->cod_fee)) $d->cod_fee =0;
        if(strtolower($df_payer) =='receiver') {
         $driver_total += $fees; 
        } else {
            $sender_total +=0;
        }
        if ($d->cod ==1) {
            $driver_total += $price; 
        }

        $input_array['driver_total'] = $driver_total;
        $input_array['sender_total'] = $sender_total;
        $input_array['package_id'] = $package_id;
        $result->data = $input_array;
        $result->package_id = $package_id;
        $result->status ='OK';
        $result->error_message = null;
        return $result;
     }

     function getSenderPriceInfo($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $sender_id = isset($d->sender_id)?$d->sender_id:0;

        $cod_fee_percent = $this->getCODFeeCharge($ss,$sender_id);
        $base_fee_all_zones = $this->getBaseFee($ss,$sender_id,'all'); //Fixed price or base delivery fee
        $price_list = $this->getSenderPriceList($ss,$sender_id);
        $senderInfo = (object)array('sender_id'=>$sender_id,'cod_fee_percent'=>$cod_fee_percent,'base_fee'=>$base_fee_all_zones,'price_list'=>$price_list);
        //$result->price_per_kg = get_settings_value($uss,'PRICE_PER_KG','number');
        return $senderInfo;
      }  
 
     function acceptPickupRequest($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $order_id = sanitize($d->order_id);
        $driver_id = sanitize($d->driver_id);

        $loc_lat = isset($d->loc_lat)?sanitize($d->loc_lat):null;
        $loc_lng = isset($d->loc_lng)?sanitize($d->loc_lng):null;

        $status_id = 2;
        $driver = null;
        $order = null;
        $rows = DB::table('driver AS d')->where('branch_id',$branch_id)->where('d.id',$driver_id)->selectRaw('d.name,d.phone_number, d.code')->limit(1)->get();
        foreach($rows as $row) $driver = $row;

        $rows = DB::table('order')->where('branch_id',$branch_id)->where('id',$order_id)->selectRaw('code,loc_lat,loc_lng')->limit(1)->get();
        foreach($rows as $row) $order = $row; 
        if(!$order) return "Order identity is not correct!";           
        if (empty($driver)) return "Driver identity is not correct!";
        
        $pickup_loc_lat = $order->loc_lat;
        $pickup_loc_lng = $order->loc_lng;
         //**** restrict distance between driver and Seller shop */
        // if(is_numeric($pickup_loc_lng) && is_numeric($pickup_loc_lat)){
        //     $dis_km = $this->point2point_distance($loc_lat,$loc_lng,$pickup_loc_lat,$pickup_loc_lng,'K');
        //     $x = 5;
        //     if($dis_km >$x) return "Cannot accept order at distance more than ".$x."km";
        // }
       
        $m = DB::table('order')->where('id',$order_id)->where('branch_id',$branch_id)->update(array('driver_id'=>$driver_id,'status_id'=>$status_id)); 
        if ($m >0) {
         
            $order = self::getProps($branch_id,$order_id,['s.name AS sender_name','o.pickup_address','o.code','status_id','status','completed','o.sender_id','o.driver_id','(SELECT dr.`name` FROM `driver` AS dr WHERE id = o.driver_id LIMIT 1) AS driver_name']);
           
            if($order){
                  
                    $message = "$driver->name នឺងទៅយកទំនិញពី​ $order->sender_name នៅ $order->pickup_address";
                    $event_data = (object)['branch_id'=>$branch_id,'order_id'=>$order_id,'order_code'=>$order->code,'sender_id'=>$ss->user_id,'status'=>$order->status,'status_id'=>$order->status_id,'completed'=>$order->completed,'driver_id'=>$order->driver_id,'driver_name'=>$order->driver_name,'message'=>$message];
                    $err_text = Notifier::notify_admin('driver_accepted_order',$event_data);
                    if (!$err_text) 
                        return DV::success(["event_notified"=>1]); 
                    else{
                        return DV::success(["event_notified"=>0,"notification_error"=>$err_text]); 
                    }
            }
            else {
                return DV::error("Unexpectedly, the order_id $order_id was invalid!");
                //This case: "driver acceped Order but $order_id is not valid". This should never happens
            }
            
        } 
        // else{
        //   //this case table "order.status_id" already equals "2" , order already accepted by this driver
        // } 
        return DV::success();
    }

    //Pick Order's pacakges. If array "packages" is empty then status =3 ("Picked"), if there are array "packages" then status_id =4 "Pick and booked", but not yet arrived Warehouse  
    function pickOrderPackages($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $order_id = isset($d->order_id)? sanitize($d->order_id):null;
        $driver_id = isset($d->driver_id)?sanitize($d->driver_id):null;
        $pacakges = isset($d->packages)? $d->packages:[];
        $pickup_method = 'None'; //No driver picks up 
        $status_id = 4; //Picked and Booked
        if (!isset($pacakges[0]) || empty($pacakges)) $status_id =3;
        $result = (object)array('status'=>'OK','error_message'=>null);

        $rows = DB::table('order AS o')->where('o.branch_id',$branch_id)->where('o.id',$order_id)->selectRaw('o.id AS order_id, o.code AS order_code,driver_id,status_id,completed, (SELECT `dr`.`name` FROM `driver` WHERE `dr`.id = o.id LIMIT 1) AS driver_name')->limit(1)->get();
        $orderInfo = null;
        foreach($rows as $row) $orderInfo = $row;
        if (!$orderInfo)  {
          return DV::error("Order identity is not valid");
        } 
        if ($orderInfo->status_id >=5 || $orderInfo->completed ==1) {
            return DV::error("This delivery order is already arrived at Warehouse");
        }

        //If no driver is supplied => use driver_id already set in table "order"
        if(empty($driver_id) || $driver_id <=0) {
            $driver_id = $orderInfo->driver_id;
        }
        if ($driver_id >0)  $pickup_method ='Driver';
        DB::table('order')->where('branch_id',$branch_id)->where('id',$order_id)->update(array(
            'status_id'=>$status_id,
            'completed'=>0,
            'driver_id'=>$driver_id,
            'pickup_method'=>$pickup_method
        ));
        DB::table('order_receivers')->where('branch_id',$branch_id)->where('order_id',$order_id)->update(array(
            'status_id'=>$status_id,
            'driver_id'=>$driver_id
        ));
        DB::table('package')->where('branch_id',$branch_id)->where('order_id',$order_id)->delete();
        $rows = DB::table('package_statuses AS ps')->where('id',$status_id)->limit(1)->selectRaw('ps.name AS status')->get();
        $status = null;
        foreach ($rows as $row) $status = $row->status;
        $data = (object)array('status_id'=>$status_id,'status'=>$status,'driver_id'=>$driver_id,'completed'=>0); 
        $result = DV::success(['data'=>$data]);
        
       //Notify to other admin on other browsers
            $message = "Order numbered ".$order_code." is picked by Admin";
            $event_data = (object)['branch_id'=>$branch_id,'order_id'=>$order_id,'order_code'=>$orderInfo->order_code,'sender_id'=>$ss->user_id,'status'=>$status,'status_id'=>$status_id,'completed'=>$orderInfo->completed,'driver_id'=>$driver_id,'driver_name'=>$orderInfo->driver_name,'message'=>$message];
            Notifier::notify_admin('order_status_changed',$event_data);   
        //Notify to other admin on other browsers
        return $result;
    }
 
    //return COUNTING data for `orders` status_id <=4 (lower than "Picked and Booked") 
    //Higher than "Picked and Booked" => use packageModel->getPackageCounts_summary()
    function getPackageCounts_order($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        //$status_id = isset($d->status_id)? sanitize($d->status_id):null;
        $sender_id = isset($d->sender_id)? sanitize($d->sender_id):null;
        //$status_id <=4, higher status => use packageModel->getPackageCounts_summary()  
        $data = (object)['available_count'=>0,'accepted_count'=>0,'picked_count'=>0];
        
        $last_10_days = convertDate(Carbon::now()->addDay(-3));
        //Status_id <=4  => query from table "order" by summing up the "qty" 
        $rows = DB::select(DB::raw("SELECT SUM(o.qty) AS cnt,o.status_id, ps.name AS `status` from `order` AS `o`
        INNER JOIN package_statuses AS ps ON ps.id = o.status_id
        WHERE o.branch_id =$branch_id AND o.sender_id =$sender_id AND DATE(create_date) >= '$last_10_days' AND (o.status_id>0 AND o.status_id <=4)
        GROUP BY o.status_id,ps.name"));
        
        $picked_count =0;
        foreach($rows as $row){
            if($row->status_id ==1) 
              $data->available_count = $row->cnt;
            else if ($row->status_id ==2)
               $data->accepted_count = $row->cnt; 
            else if ($row->status_id <=4){
               $picked_count += $row->cnt;
            }
        } 
        $data->picked_count = $picked_count;
        return $data;
    }
 
}
