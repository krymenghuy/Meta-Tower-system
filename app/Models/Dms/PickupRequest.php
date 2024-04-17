<?php

namespace App\Models\Dms;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use App\Models\Dms\Notifier;
use App\Models\Dms\PublicStorage;
use App\Models\Dms\DeliveryZone;
use App\Models\Dms\UM;
use DB;
use Sanitizer;
//use Localization;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use function PHPUnit\Framework\fileExists;

class PickupRequest //extends Model
{
    //use HasFactory;
    protected $id = null;
    protected $userInfo =null;
    protected static $package_photo_dir ='package';
    function __construct($id=null,$userInfo=null){
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    //$d = {access_token,code} 
    function getSenderInfoByCode($user_session,$code){ 
       $branch_id = $user_session->branch_id; 
       $rows = DB::table('sender AS s')->where('branch_id',$branch_id)->where('code',$code)->selectRaw('s.id,s.name, s.sender_type_id, s.status_code')->limit(1)->get();
       foreach($rows as $row) return $row;
       return null;
    }
    function getSenderInfoById($user_session,$sender_id){ 
        $branch_id = $user_session->branch_id; 
        return DB::table('sender AS s')->where('branch_id',$branch_id)->where('id',$sender_id)->selectRaw('s.id,s.sales_agent_id,s.name,s.phone_number,s.sender_type_id, s.status_code,s.address,s.loc_lat,s.loc_lng')->limit(1)->first();
     }
    //createQuickOrder()| createDeliveryOrder
    /** @d = {sender_id,product_type,vechicle_type,[qty]} **/ 
    function createOrderQuick($ss,$d){
        $branch_id = $ss->branch_id;
        $delivery_type = "Normal";
        $initial_order_status_id =1;
        $sender_id = $d['sender_id'];
        $detail_type = isset($d['detail_type'])?$d['detail_type']:null;
        $sender =  $this->getSenderInfoById($ss,$sender_id);
        if(!$sender) return DV::error("Sender ID is not valid");
        if(strtolower($sender->status_code) !=='active') return DV::error('Merchant '.$sender->name.' is not active. You may have to change mechant status first'); 
        $expiry_date = Carbon::now()->addDay(10);
        
        $vehicle_type = isset($d['vechile_type'])?$d['vechile_type']:"motobike";
        $pickup_address = isset($d['pickup_address'])?$d['pickup_address']:"";

        if (!$pickup_address)  $pickup_address = $sender->address;
        $d['loc_lat'] = isset($d['loc_lat'])?$d['loc_lat']:0;
        $d['loc_lng'] = isset($d['loc_lng'])?$d['loc_lng']:0;
        $qty = isset($d['qty'])?$d['qty']:0;
        if ($qty >1000) return DV::error('It seems too many packages');

        $nowTime = getNowTime();
        DB::table('order')->insert([
             'detail_type'=>$detail_type,
            'branch_id' => $branch_id,
            'request_date'=>getNowTime(),
            'request_pickup_time'=>getNowTime(),
            'code'=>null, //order_code becomes tracking_number when driver picks up the goods,                
            //'delivery_condition'=>, // {None,VIP,MA,AT,AA,AT}
            'delivery_type'=>$delivery_type, /** @delivery_type = {Normal,Fast,"Pick Morning, Delvier Afternoon","Pick Afternoon, deliver Tomorrow"}**/
            //'priority_id' => 0,  
            'order_canceled' => 0, //{0,1}
            'status_id'=>$initial_order_status_id, /** If "order_canceled = true" => "status_id" = 0 which means the order is Canceled **/
            //'entry_type' => 0, // entry_type = 0 => this order data entry done by api called by Merchant, 1 = this order entry is entered by admin staff on behalf of the Merchant
            'sender_id' => $sender->id,
            'sender_type_id' => $sender->sender_type_id,
            'product_type' => $d['product_type'],
            'qty' =>$qty,
            'request_vehicle_type' => $vehicle_type,
            'pickup_address' => $pickup_address,
            'loc_lat'=>$d['loc_lat'],
            'loc_lng'=>$d['loc_lng'],
            'expiry_date'=>$expiry_date,
            'create_uid'=>$ss->user_id,
            'create_user'=>$ss->full_name,
            'create_date'=>$nowTime,
            'update_date'=>$nowTime,
            'update_user'=>$ss->full_name,
            'update_uid'=>$ss->user_id
        ]);
        $new_order_id = DB::getPdo()->lastInsertId();
        if($new_order_id>0){
            $order_code = $this->getTrackingNumber($ss,$new_order_id);
            DB::table('order')->where('id',$new_order_id)->where('branch_id',$branch_id)->update(['code'=>$order_code]);
            return DV::success(['id'=>$new_order_id,'code'=>$order_code]);
        }else return DV::error("Failed to create order");
    }

    function getOrderImages($arr =[],$id = null,$ss = null){
        $ss = $ss ?? $this->userInfo;
        $order_id = $id ?? $this->id;
        $sender_id = 0;
        $d = (object)$arr;
        $branch_id = $ss->branch_id;
   
        $order_id = isset($d->order_id)?$d->order_id:0;
        if($ss->user_class ==='merchant')  $sender_id =$ss->official_id;
        else $sender_id = isset($d->sender_id)?$d->sender_id:0;
        $start_date = isset($d->start_date)? convertDate($d->start_date):null;
        $end_date = isset($d->end_date)? convertDate($d->end_date):null;
        $str_dates = '3=3';
        $str_sender = '4=4';

        $today = date('Y-m-d');
        if (!$order_id && !$sender_id){
            //Error: When order_id is NOT provided, we need to have sender_id in order and use start_date and end_date to track Photos of items belonging to their merchant or sender
            return [];
        }else if ($sender_id > 0){
             //If no orderID then use start_date and end_date and Merchant ID
             if (!(bool)($start_date)) $start_date = date('Y-m-d', strtotime($today. '-3 days'));
             if (!(bool)($end_date)) $end_date =$today;
             $str_dates = 'DATE(img.create_date)>= \''.$start_date.'\' AND DATE(img.create_date) <=\''.$end_date.'\'';
             $str_sender = 's.id = '.$sender_id;
        }
        
        $str_order ='o.id ='.($order_id?$order_id:0);
        $rows = DB::table('order as o')->join('sender as s','s.id','=','o.sender_id')->join('order_images as img','o.id','=','img.order_id')->where('img.inactive',0)->whereRaw($str_order)->whereRaw($str_dates)->whereRaw($str_sender)->selectRaw('img.id,img.file_name,img.package_id,img.create_user,formatDate(img.create_date) as create_date')->get();    
        //NOTE: event in case Driver is the one who upload order images, all order-images are saved in directory "companies/1_data/merchant"
        $base_url = PublicStorage::getUrl($branch_id,self::$package_photo_dir,'image');
        foreach($rows as $row){
            unset($row->file_name);
            $row->image_url = $base_url.$row->file_name;
        }
        return $rows;
    }
 
    function countImages($order_id){
       $count = DB::table('order_images as oi')->where('order_id',$order_id)->count('oi.id');
       return $count;
    }

    /** $photo_ids is, for example,: "3|67|120|260" */
    function deletePackagePhotos($photo_ids, $id = null, $ss = null){
        $ss = $ss?? $this->userInfo;
        //$order_id = $id ?? $this->id;
        $ids = explode('|',$photo_ids);
        $branch_id = $ss->branch_id;
        $query = DB::table('order_images')->whereIn('id',$ids)->where('branch_id',$branch_id);   
        $rows = $query->selectRaw('id,order_id,file_name')->get();
        $errors = [];
        $order_id = isset($rows[0])? $rows[0]->order_id: null;
        $sender = null;
        if($order_id) $sender = DB::table('sender as s')->join('order as o','o.sender_id','=','s.id')->where('o.id',$order_id)->selectRaw('s.name,s.phone_number')->take(1)->first();
        foreach($rows as $row){
            $dir = PublicStorage::getDiskPath($branch_id,self::$package_photo_dir,'image');
            $path = $dir.$row->file_name;
            $err = PublicStorage::deleteFile($path);
            if(!$err){
                 $x = DB::table('order_images')->where('id',$row->id)->update(['inactive'=>1]);
                 if($x){ 
                   $sender_name = $sender? ' merchant named '.$sender->name: 'Unknown Merchant'; 
                   $des = $ss->full_name.' deleted package photo id '.$row->id.' from '.$sender_name.' at '.date('d M Y h:i'); 
                   self::trackChange($ss,'delete_package_photo',$des,'order_images','id',$row->id);
                 }
            }
            $errors[] = $err;
        }

        $img_count = DB::table('order_images AS img')->where('img.order_id',$order_id)->where('inactive',0)->count('img.id');
        $data = (object)[
            'branch_id'=>$branch_id,
            'user_id'=>$ss->user_id,
            'title'=>'Package Photo Deleted',
            'order_id'=>$order_id,
            'img_count'=> $img_count,
            'message'=>$ss->full_name.' បានលុបរូបថត ក្នុងបញ្ជាលេខ '.$order_id.' នៅ '.date('d M Y h:i')
        ];
        Notifier::notify_admin('package_photo_deleted',$data);
        return DV::success();
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

    function deleteOrderImage_internal($branch_id,$file_name,$file_id=0){
        $x = DB::table('order_images')->where('id',$file_id)->where('branch_id',$branch_id)->delete();
        $dir = PublicStorage::getDiskPath($branch_id,self::$package_photo_dir,'image');
        $path = $dir.$file_name;
        $err = PublicStorage::deleteFile($path);
        return $x;
     }

     //DeleteOrder()|delete image order only
    function deleteImageOrder($id=null,$ss =null){
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $order_id = $id ?? $this->id;
        $rows = DB::table('order_images')->where('order_id',$order_id)->where('branch_id',$branch_id)->selectRaw("id,file_name,file_type")->get();
        foreach($rows as $file){
            $this->deleteOrderImage_internal($branch_id,$file->file_name,$file->id);
        }
        $x = DB::table('order')->where('id',$order_id)->where('branch_id',$branch_id)->delete();
        return DV::depends($x); 
    }

    //Get last image order (o.detail_type ='images')
    //return one $order object {id,code} on a given date. default date is today. One merchant should have one image order per day 
    function getLastOrder($sender_id,$date=null){
       if(!$date) $date = date('Y-m-d');
       return DB::table("order as o")->whereRaw("DATE(o.request_date) ='$date'")->where('sender_id',$sender_id)->where('o.detail_type','images')->selectRaw("o.id,o.code")->take(1)->orderByRaw("o.id DESC")->get()->first();
    }

    //$d = {branch_id,$sender_id,$user_class,$order_id,$photo_data}
    //returns object {image_url, order_id,order_number,[product_type]}
    function saveOrderImage($d,$ss){
        $branch_id = $ss->branch_id;
        $user_class = $ss->user_class;
        $sender_id = isset($d['sender_id'])?$d['sender_id']:null;
        $order_id = isset($d['order_id'])?$d['order_id']:null;
        $photo_data = $d['photo_data'];
        $product_type = isset($d['product_type'])?$d['product_type']:'Generic';
        $file_type = isset($d['file_type'])?$d['file_type']:'png';
         
        $res = PublicStorage::saveImage($branch_id,$user_class,$file_type,$photo_data,true);
        if($res->status ==='OK'){
            $image_url = PublicStorage::getUrl($branch_id,$user_class,"image");
            $image_url .= $res->file_name;
            
            $order = $this->getLastOrder($sender_id,date('Y-m-d'));
            if (!$order){
                //if order_id is supplied => use the order_id
                if($order_id>0) $order = $this->getProps($branch_id,$order_id,['o.id','o.code','sender_id','o.qty','o.create_date','detail_type']); //$this->getOrderInfo_local($branch_id,$order_id);
                if(!$order){
                    //Save order info. Save order.order_type ="image"
                    $o_res = $this->createOrderQuick($ss,[
                        "detail_type"=>"images", /** It is image order **/  
                        "sender_id"=>$sender_id,
                        "sender_type_id"=>1,
                        "product_type"=>$product_type,
                        "qty"=>1
                      ]);
                      if ($o_res->status ==='Error') return DV::error($o_res->error_message);
                      $order = (object)['id'=>$o_res->id,'code'=>$o_res->code];
                }
            }

            //Save image info associated with the $order
            DB::table("order_images")->insert([
                "branch_id"=>$branch_id,
                "order_id"=>$order->id,
                "file_name"=>$res->file_name,
                "file_type"=>$file_type,
                "create_uid"=>$ss->user_id,
                "create_user"=>$ss->login_name,
                "create_date"=>getNowTime()
            ]);
            $image_id =DB::getPdo()->lastInsertId();
            
          //Update Quantity of order items (image items) in table "order.qty"
            $cnt = $this->countImages($order->id);
            DB::table('order')->where('id',$order->id)->update(['qty'=>$cnt]);
            
            $order->image_count =$cnt;
            //Notifiy Admin that new image created
             $cdata = [
                'user_id'=>$ss->user_id,
                'branch_id'=>$branch_id,
                'message'=>"New order by picture",
                "title"=>"New Image Order",
                'order'=>$order,
                'image_count'=>$cnt,
                'img'=>[
                    'id'=>$image_id,
                    'image_url'=>$image_url
                ]
             ];
             $err = Notifier::notify_admin('order_image_created',$cdata);
            return DV::success(["notif_error"=>$err,"image_url"=>$image_url,"order_id"=>$order->id,"create_date"=>date('d M Y'),"order_number"=>$order->code,"id"=>$image_id]);
        }else return DV::error($res->error_message);
     }
  
     //@params $d = {order_id,id}. where $id is image id or file id
     function deleteOrderImage($ss,$file_id){
        $branch_id = $ss->branch_id;
        $order = getDataRow("order_images",["id"=>$file_id],"order_id as id,file_name,id as file_id");
        if(!$order) return DV::error("It seems that the file ID does not exist");
        //$x = DB::table('order_images')->where('id',$file_id)->where('branch_id',$branch_id)->delete();
        $x = $this->deleteOrderImage_internal($branch_id,$order->file_name,$file_id); 
        if ($x){
            $order_auto_deleted =false;
            //Update Quantity of order items (image items) in table "order.qty"
            $cnt = $this->countImages($order->id);
            if ($cnt > 0) DB::table('order')->where('id',$order->id)->update(['qty'=>$cnt]);
            else{
                $order_auto_deleted=true;
                DB::table('order')->where('id',$order->id)->delete();
            }

            //Notifiy Admin that new image created
            $cdata = [
                'user_id'=>$ss->user_id,
                'branch_id'=>$branch_id,
                'message'=>"Order Image deleted",
                "title"=>"Image Order Deleted",
                'order_auto_deleted'=> $order_auto_deleted,
                'order_id'=>$order->id,
                 "image_id"=>$file_id,
                 "id"=>$file_id,
                 //"file_id"=>$file_id,
                 "image_count"=>$cnt
             ];
             $err = Notifier::notify_admin('order_image_deleted',$cdata);
             return DV::success(['id'=>$file_id]);
        }
        return DV::error("Something went wrong during delete operation");
     }
     //Takes a @delivery_id and transform it into a formal 10-dgit tracking number with some prefix, if any
     function getTrackingNumber($uss,$new_id){
        $num = formatNumber($new_id,10);
        $use_prefix = get_settings_value($uss,'USE_TRACK_PREFIX','number');
        $prefix = null;
        if($use_prefix ==1) $prefix = get_settings_value($uss,'TRACK_PREFIX','string');  
        return $prefix.$num;
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
  
    static function processVehicleType($branch_id,$vehicle_type){
        if (!$vehicle_type) return DV::error('Choose vehicle type for picking up');
        $v_type_exists =DB::table('vehicle_type AS v')->where('v.branch_id',$branch_id)->where('v.code',$vehicle_type)->selectRaw('v.id')->take(1)->exists();
        $v_code = strtolower($vehicle_type);

        if (in_array($v_code,['moto','moto cycle','moto bike']))
              $v_code ='Moto Bike';
        else if (in_array($v_code,['tuk tuk','tuk','tok tok'])) 
              $v_code ='Tuk Tuk';

        if(!$v_type_exists) {
            try{
                DB::table('vehicle_type')->insert([
                    'branch_id'=>$branch_id,
                    'code'=>$v_code,
                    'name'=>$vehicle_type
                ]);
            }catch(\Exception $e){
                $errorMessage = 'Failed to create new Vehicle Type "'.$vehicle_type.'"';
                Log::error($errorMessage);
                Log::error('Error Message: ' . $e->getMessage());
                Log::error('Stack Trace: ' . $e->getTraceAsString());
            }
        }
        return (object)[
            'status'=>'OK',
            'status_code'=>200,
            'code'=>$v_code,
            'name'=>$vehicle_type
        ];
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
        
      $packageModel = new \App\Models\Dms\Package();
      $success_items = []; 
      $sender_id = $order->sender_id;
      if (!$sender_id) return DV::error('The provided Merchant ID is empty and is not correct'); 
     do{
           $c = isset($items[$i])? (object)$items[$i]:null;
           if(!$c) break;
            $c->order_id = isset($order->id)? $order->id: (isset($order->order_id)? $order->order_id:null); 
            $c->product_type = isset($c->product_type) ? $c->product_type: $order->product_type;
            $remarks = isset($c->remarks) ? $c->remarks: '';
            if(!isset($c->delivery_notes)) $c->delivery_notes = $remarks;
            $c->warehouse_id = isset($order->warehouse_id) ? $order->warehouse_id:  null;
            if (!isPhoneNumber($c->receiver_phone)) return DV::error('Receiver phone is not correct');
            if (!$c->warehouse_id) return DV::error('No warehouse ID provided for package with reeiver phone '.$c->receiver_phone);
            /** Default df_payer to "sender". NOTE: that mobile app does not send df_payer via "create-delivery-order" */
            $c->df_payer = isset($c->df_payer)? $c->df_payer : 'sender';
            if(!in_array(strtolower($c->df_payer),['sender','receiver'])) return DV::error('Fee payer must be Sender or Receiver. Given value is '.$c->df_payer); 
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
            $c->delivery_type = isset($c->delivery_type) ? $c->delivery_type: $order->delivery_type;
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
            if(!isset($c->receiver_address)) $c->receiver_address = $c->zone_name;
            if (!$c->receiver_address) $c->receiver_address = $c->zone_name; 
            if (!$c->delivery_notes) $c->delivery_notes = $remarks;
            $c->billed_kg = floatval($c->billed_kg)?$c->billed_kg:0; 
            if (!$c->billed_kg){
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
               return DV::error($p->error_message.' Zone: '.$c->zone_code);
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

    /** returns object {"latitude","longtitude"} */
    function getLocation($googleMapLink) {
        // Define regular expression patterns for both types of Google Maps links
        $patterns = [
            '/@([-0-9.]+),([-0-9.]+)/',  // Matches links with @latitude,longitude
            '/\/place\/([-0-9.]+),([-0-9.]+)/'  // Matches links with /place/latitude,longitude
        ];
    
        foreach ($patterns as $pattern) {
            // Perform a regular expression match and return the result if successful
            if (preg_match($pattern, $googleMapLink, $matches)) {
                return (object)['latitude' => $matches[1], 'longitude' => $matches[2]];
            }
        }
    
        // Return false if no match is found
        return false;
    }
    //createDeliveryOrder() | saveOrder() | saveDeliveryOrder() | create delivery order | create request | Pickup
     function savePickupRequest($ss, $arr=null){
        $ss = $ss?$ss:$this->userInfo;
        if(!$ss) return DV::error('It seems authentication failed!');
        $branch_id = $ss->branch_id;

        $v_rule = [
            'sender_id'=>'1|number|exists=sender.id',
            'product_type'=>'1|string|1-150|exists=product_types.name',
            'request_vehicle_type'=>'1|string|1-150',
            'qty'=>'0|number|default=0',
            'delivery_type'=>'1|choice|Normal,normal,Fast,fast',
            'pickup_address'=>'0|string|0-500',
            'receivers'=>'0|array', 
            'packages'=>'0|array',
            'loc_lat'=>'0|number',
            'loc_lng'=>'0|number',
            'use_default_location'=>'1|number|default=1'
        ];
        /** Address_chars contains all chars used in map and normal address */
        $address_map_chars = ['/', ':', ',', '!', '@', '?', '=', '&', '[', ']', '(', ')', '!', '.', '/', ':', '?', '=', '&', '#', '[', ']', '@', '!', '$', "'", '(', ')', '*', '+', ',', ';', '%'];
        $res = validateObject($arr,$v_rule,true,['pickup_address'=>$address_map_chars],$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        $inputs =$res->values;
        $d = (object)$inputs;

        $w = GeneralSettings::getDefaultWarehouse($ss);
        if(!$w) return DV::error('Cannot find a correct Branch or warehouse for this order');
        $warehouse_id = $w->id;
        $inputs['warehouse_id'] =$warehouse_id;
        $d->warehouse_id = $warehouse_id;
        unset( $inputs['use_default_location']);  
        if(!isset($d->order_id)) $d->order_id = 0;
         
        //From External source OR $is_from_mobile = isset($d->is_from_mobile)?$d->is_from_mobile:0;
        $is_from_mobile = in_array(strtolower($ss->user_class),['driver','merchant']);
        $sender_id = $d->sender_id;

        $sender_id = ($is_from_mobile && strtolower($ss->user_class) =='merchant')? $ss->official_id : $d->sender_id;
        $sender = $this->getSenderInfoById($ss,$sender_id);
        if (!$sender) return DV::error('Sender identity is not valid');
        $inputs['sender_id'] = $sender->id;

        $d->packages = isset($d->packages)? $d->packages:null;
        if(!$d->packages) $d->packages = $d->receivers?$d->receivers:[];
  
        $pickup_address = $d->pickup_address;
        $use_default_location = $d->use_default_location;

        $request_pickup_time = getNowTime();
        $booking_channel = $ss->user_class;
        $inputs['booking_channel'] = $booking_channel;
        $inputs['request_pickup_time'] = $request_pickup_time;
        //Request_date = current server time (by time zone "Asia/Bangkok" )
        $inputs['request_date'] = $request_pickup_time;
        //Each Delivery order record is stored 10 days, after which If it is not picked => the Order is automatically deleted
        $inputs['expiry_date'] = Carbon::now()->addDay(10);
     
        if ($d->qty > 700) return DV::error('ចំនួនកញ្ចប់ដូចជាច្រើនលើសពីធម្មតា');
        else if ($d->qty <=0) return DV::error('សូមបញ្ចូលចំនួនកញ្ចប់ដែលត្រឹមត្រូវ');
        //if (!$d->delivery_type) return DV::error('Delivery Type is not valid');

        if(strtolower($sender->status_code) !=='active') return DV::error('Merchant '.$sender->name.' is not an active merchant!');  
        if(empty($sender->sender_type_id)) $sender->sender_type_id =1;

        if(!$pickup_address) $pickup_address = $sender->address;
        $inputs['pickup_address']=$pickup_address;

        if($is_from_mobile || $is_from_mobile == 1){
            $pickup_address = (isURL($pickup_address))? ' តាមផែនទី':$pickup_address;
        }
        
        if (isURL($pickup_address)){
            $loc = self::getLocation($pickup_address);
            if($loc){
                $inputs['loc_lat'] = $loc->latitude;
                $inputs['loc_lng'] = $loc->longitude;
            }
        }else{
            //If use default location saved in the Merchant's profile
            if ($use_default_location){
                $inputs['loc_lat'] = $sender->loc_lat ?? 11.5597855;
                $inputs['loc_lng'] = $sender->loc_lng ?? 104.9217169;
            }
        }
        
        if(!$pickup_address) return DV::error('Pickup address is required');
        if(!is_numeric($d->qty)) $d->qty =0;
        // if ($is_from_mobile && ($d->qty > 0 && $d->qty < 5 && !isset($d->packages[$d->qty-1]))) {
        //    return DV::error('Please enter the details of each item',$ss->lang);
        // } 
        $order = (object)['branch_id'=>$branch_id,'warehouse_id'=>$warehouse_id,'sender_id'=>$sender->id,'delivery_type'=>$d->delivery_type,'product_type'=>$d->product_type];
        $item_res = $this->validatePackages($ss,$order,$d->packages);
        if ($item_res->status ==='Error') return DV::error($item_res->error_message);

        $v_res = self::processVehicleType($branch_id,$d->request_vehicle_type);
        if($v_res->status ==='Error') return DV::error($v_res->error_message);
        $items = $item_res->success_items;

        $inputs['request_vehicle_type'] = $v_res->code;
        $inputs['sender_type_id'] = $sender->sender_type_id;
        $inputs['order_canceled'] =0;
        $inputs['status_id'] =1; /** Pending */
        unset($inputs['packages'],$inputs['receivers']);

        $order_id = null;
        $order_id = saveData($ss,'order',['id'=>$order_id],$inputs,[],1,false);
        if($order_id > 0){
            $tracking_number = $this->getTrackingNumber($ss,$order_id);  
            DB::table('order')->where('id',$order_id)->where('branch_id',$branch_id)->update(['code'=>$tracking_number]);
            $order->id = $order_id;
            $order->sender_id = $sender_id;
            $order->code = $tracking_number;
            $order->qty = $d->qty;
        }

        $c =null;
        $i =0;  
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
            }

            $i++;
        }while($c);
        
        /** Make sure the getOrderDetails_one() returns one row, but this row bust be exactly the same as those rows returned by getList() or getPickupList() */
        $order_id = $order->id;
        if ($i > 0) DB::table('order')->where('id',$order->id)->update(['qty'=>$i,'actual_pkg_count'=>$i]);
        $result = (object)[
            'order_id' => $order_id,
            'tracking_number'=>$tracking_number,
            'error_message'=>null,
            'status'=>'OK',
            'status_code'=>200
        ];

        $order = self::getOrderDetails_one($order_id);
        $order->id = $order_id;
        if ($is_from_mobile==1 || $is_from_mobile==true) {
            //$cnt = $i+1;
            //Make merchant_id becomes sender_id (that is ID of merchant)
            $order->merchant_id = isset($order->sender_id)?$order->sender_id:null;
            $order->user_id = $ss->user_id;
            $order->role_name = null;
            $pickup_address = $pickup_address? 'នៅ '.$pickup_address:''; 
            $order->title ="Order Created";
            $order->message ="ត្រូវទៅយកទំនិញពី ".$sender->name.$pickup_address;
            //$order->branch_id is a MUST in order for the event "order_created" to broadcast 
            $order->branch_id = $branch_id;
            Notifier::notify_admin('order_created',$order);
        }

          //begin:: Notify to mobile app users
                    $order->event_name = strtolower($ss->user_class) =='merchant'? 'merchant_created_order': 'order_created';
                    $cdata =[
                        // [
                        //     'user_class'=>'driver',
                        //     'target_user_id'=>$order->driver_id,
                        //     'title'=>'Available Order',
                        //     'message'=> "Order $order->order_code created",
                        //     'persist'=>1,
                        //     'data'=>$order
                        // ],
                        [
                            'user_class'=>'merchant',
                            'target_user_id'=>$order->sender_id?$order->sender_id:-1,
                            'title'=>'Order Created',
                            'message'=> ($is_from_mobile == 1)? 'Order '.$order->order_code.' for '.$order->qty.' items created by '.$ss->user_class.' '.$ss->full_name:'Your delivery order '.$order->order_code.' created by Admin '.$ss->full_name,
                            'persist'=>1,
                            'data'=>$order
                        ]
                    ];
                    Notifier::notify_mobile($branch_id,$cdata);
           //end::Notify to mobile app users
        return $result;
    }
 
    /**
     * Create Order with images | createImageOrder | createOrderImages | createOrderWithPhotos
     * Driver uploads a list of photos, and then backend create new Order just like Merchant Ordering delivery services, but the items are photos
    */
    function createOrderWithPhotos($ss, $arr=null){
        $ss = $ss?$ss:$this->userInfo;
        if(!$ss) return DV::error('It seems authentication failed!');
        $branch_id = $ss->branch_id;
        $v_rule = [
            'order_id'=>'0|number',
            'sender_id'=>'1|number|exists=sender.id',
            'product_type'=>'1|string|1-150|exists=product_types.name',
            'request_vehicle_type'=>'1|string|1-150',
            //'qty'=>'0|number|default=0',
            'delivery_type'=>'1|choice|Normal,normal,Fast,fast',
            'pickup_address'=>'0|string|0-500',
            'loc_lat'=>'0|number',
            'loc_lng'=>'0|number',
            'use_default_location'=>'1|number|default=1',
            'photos'=>'0|array'
        ];
        /** Address_chars contains all chars used in map and normal address */
        $address_map_chars = ['/', ':', ',', '!', '@', '?', '=', '&', '[', ']', '(', ')', '!', '.', '/', ':', '?', '=', '&', '#', '[', ']', '@', '!', '$', "'", '(', ')', '*', '+', ',', ';', '%'];
        $image_char = ['+',':',',',';','=','/','\\','?'];
        $photos = isset($arr['photos'])?$arr['photos']:[];
        unset($arr['photos']);
        $res = validateObject($arr,$v_rule,true,['photos'=>$image_char,'photo'=>$image_char,'image'=>$image_char,'pickup_address'=>$address_map_chars],$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        $inputs =$res->values;
        $d = (object)$inputs;
        $order_id = $d->order_id;
        $w = GeneralSettings::getDefaultWarehouse($ss);
        if(!$w) return DV::error('Cannot find a correct Branch or warehouse for this order');
        $warehouse_id = $w->id;
        $inputs['warehouse_id'] =$warehouse_id;
        $d->warehouse_id = $warehouse_id;
        unset($inputs['use_default_location'],$inputs['order_id']);  
        //if(!isset($d->order_id)) $d->order_id = 0;
         
        //From External source OR $is_from_mobile = isset($d->is_from_mobile)?$d->is_from_mobile:0;
        $is_from_mobile = in_array(strtolower($ss->user_class),['driver','merchant']);
        $sender_id = $d->sender_id;

        $sender_id = $is_from_mobile && strtolower($ss->user_class) =='merchant'? $ss->official_id : $d->sender_id;
        $sender = $this->getSenderInfoById($ss,$sender_id);
        if (!$sender) return DV::error('Sender identity is not valid');
        $inputs['sender_id'] = $sender->id;
  
        $pickup_address = $d->pickup_address;
        $use_default_location = $d->use_default_location;

        $request_pickup_time = getNowTime();
        $booking_channel = $ss->user_class;
        $inputs['driver_id'] =$ss->official_id;/** This is suppose to be driver ID from Driver Mobile App */
        $inputs['status_id'] =2; /** Accepted by Driver */
        $inputs['booking_channel'] = $booking_channel;
        $inputs['request_pickup_time'] = $request_pickup_time;
        //Request_date = current server time (by time zone "Asia/Bangkok" )
        $inputs['request_date'] = $request_pickup_time;
        //Each Delivery order record is stored 10 days, after which If it is not picked => the Order is automatically deleted
        $inputs['expiry_date'] = Carbon::now()->addDay(10);
          
        if(strtolower($sender->status_code) !=='active') return DV::error('Merchant '.$sender->name.' is not an active merchant!');  
        if(empty($sender->sender_type_id)) $sender->sender_type_id =1;

        if(!$pickup_address) $pickup_address = $sender->address;
        $inputs['pickup_address']=$pickup_address;

        if($is_from_mobile || $is_from_mobile == 1){
            $pickup_address = (isURL($pickup_address))? ' តាមផែនទី':$pickup_address;
        }
        
        if (isURL($pickup_address)){
            $loc = self::getLocation($pickup_address);
            if($loc){
                $inputs['loc_lat'] = $loc->latitude;
                $inputs['loc_lng'] = $loc->longitude;
            }
        }else{
            //If use default location saved in the Merchant's profile
            if ($use_default_location){
                $inputs['loc_lat'] = $sender->loc_lat ?? 11.5597855;
                $inputs['loc_lng'] = $sender->loc_lng ?? 104.9217169;
            }
        }
        
        if(!$pickup_address) return DV::error('Pickup address is required');
        // if ($is_from_mobile && ($d->qty > 0 && $d->qty < 5 && !isset($d->packages[$d->qty-1]))) {
        //    return DV::error('Please enter the details of each item',$ss->lang);
        // } 
        $order = (object)['branch_id'=>$branch_id,'warehouse_id'=>$warehouse_id,'sender_id'=>$sender->id,'delivery_type'=>$d->delivery_type,'product_type'=>$d->product_type];
        /** processOrderImages| processOrderPhotos */
        $item_res = self::processItemPhotos($photos);
        if ($item_res->status ==='Error') return DV::error($item_res->error_message);
       
        $v_res = self::processVehicleType($branch_id,$d->request_vehicle_type);
        if($v_res->status ==='Error') return DV::error($v_res->error_message);
        $success_photos = $item_res->success_items;
        $d->qty = count($success_photos);
        if ($d->qty <=0) return DV::error('No photos provided!');
        $inputs['qty'] = $d->qty;
        $inputs['request_vehicle_type'] = $v_res->code;
        $inputs['sender_type_id'] = $sender->sender_type_id;
        $inputs['order_canceled'] =0;
        //$inputs['status_id'] =2; /** Accepted by Driver */
        unset($inputs['photos']);

        $order_id = null;
        $order_id = saveData($ss,'order',['id'=>$order_id],$inputs,[],1,false);
        if($order_id > 0){
            $tracking_number = $this->getTrackingNumber($ss,$order_id);  
            DB::table('order')->where('id',$order_id)->where('branch_id',$branch_id)->update(['code'=>$tracking_number]);
            $order->id = $order_id;
            $order->sender_id = $sender_id;
            $order->code = $tracking_number;
            $order->qty = $d->qty;
        }

        $c =null;
        $i =0;  
        do{
            if (!isset($success_photos[$i])) break;
            $c =$success_photos[$i];
            $img_res = PublicStorage::saveImage($branch_id,self::$package_photo_dir,null,$c['image'],null,null);
            if($img_res->status =='OK'){
                $image_id = saveData($ss,'order_images',['id'=>null],['order_id'=>$order_id,'file_name'=>$img_res->file_name,'file_type'=>$img_res->extension],[],1,false);
            }
            $i++;
        }while($c);
        
        /** Make sure the getOrderDetails_one() returns one row, but this row bust be exactly the same as those rows returned by getList() or getPickupList() */
        $order_id = $order->id;
        if ($i > 0) DB::table('order')->where('id',$order->id)->update(['qty'=>$i,'actual_pkg_count'=>$i]);
        $result = (object)[
            'order_id' => $order_id,
            'tracking_number'=>$tracking_number,
            'error_message'=>null,
            'status'=>'OK',
            'status_code'=>200
        ];

        $order = self::getOrderDetails_one($order_id);
        $order->id = $order_id;
        if ($is_from_mobile==1 || $is_from_mobile==true) {
            $order->merchant_id = isset($order->sender_id)?$order->sender_id:null;
            $pickup_address = $pickup_address? 'នៅ '.$pickup_address:''; 
            $order->title ="Order by Photos";
            $order->message ="អ្នកដឹកបានបង្ក់ើត order សំរាប់ ".$sender->name.$pickup_address;
            $order->branch_id = $branch_id; 
            Notifier::notify_admin('order_created',$order);
        }

          //begin:: Notify to mobile app users
                    $order->event_name ='order_created';
                    $cdata =[
                        // [
                        //     'user_class'=>'driver',
                        //     'target_user_id'=>$order->driver_id,
                        //     'title'=>'Available Order',
                        //     'message'=> "Order $order->order_code created",
                        //     'persist'=>1,
                        //     'data'=>$order
                        // ],
                        [
                            'user_class'=>'driver',
                            'target_user_id'=>$order->sender_id?$order->sender_id:-1,
                            'title'=>'Order Created',
                            'message'=> ($is_from_mobile == 1)? 'Order '.$order->order_code.' for '.$order->qty.' items created by '.$ss->user_class.' '.$ss->full_name:'Your delivery order '.$order->order_code.' created by Admin '.$ss->full_name,
                            'persist'=>1,
                            'data'=>$order
                        ]
                    ];
                    Notifier::notify_mobile($branch_id,$cdata);
           //end::Notify to mobile app users
        return $result;
    }

    //if $cols is NULL => use defeaul cols defined in this method
    //getOrderProps()
    static function getProps($branch_id=null,$id=null,$cols=null){
        if(!$id) return null;
        if(!$cols) 
          $cols = ["o.qty","`o`.`id` AS order_id","s.`id` AS sender_id","o.driver_id","o.`code` as order_code","DATE_FORMAT(request_date,'%d %b %Y') AS request_date","DATE_FORMAT(request_date,'%r') AS request_time","o.delivery_type","o.product_type","o.request_vehicle_type AS vehicle_type","o.qty","s.name AS sender_name","pickup_address","(SELECT name FROM driver WHERE id = o.driver_id) AS driver_name","status_id","ps.name AS status","o.completed"];
        else {
            $indx = array_search('status',$cols,true);
            if($indx){
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

    static function countPackagePhotos($rows,$order_id){
        $found_rows = $rows->filter(function($row) use($order_id){
            return $row->id == $order_id;
        });
        return  isset($found_rows[0])? $found_rows[0]->image_count : 0;
    }

    static function getOrderDetails_one($id){
        $row = DB::table('order AS o')->join('sender AS s','s.id','=','o.sender_id')->join('package_statuses AS ps','ps.id','=','o.status_id')->where('o.id',$id)->selectRaw('o.id as order_id,booking_channel,IFNULL(o.completed,0) AS completed,o.delivery_type, o.code as order_code, o.request_vehicle_type, o.sender_id, s.code as sender_code,s.name AS sender_name, s.phone_number AS sender_phone, formatDate(o.request_date) AS request_date,  DATE_FORMAT(o.request_date,\'%r\') AS request_time,o.qty, o.product_type,o.loc_lat,o.loc_lng, o.pickup_address, o.status_id, ps.name AS order_status, (SELECT d.name FROM driver as d WHERE d.id = o.driver_id LIMIT 1) AS driver_name,o.create_user,formatTime(o.create_date) As create_date')->first();
        if(!$row) return $row;
        $row->map_url = getLocationUrl($row->loc_lat,$row->loc_lng);
        return $row;
    }
    //getPickupList() | $arr = {'start_date','end_date','sender_id','status_id',[delivery_type],[driver_id].[sender_id] }
     function getList($arr =[],$ss=null){
        $ss = $ss ?? $this->userInfo;
        $d = (object)$arr;
        $branch_id = $ss->branch_id;
        $start_date = isset($d->start_date)?$d->start_date:null;
        $start_date = convertDate($start_date);

        $end_date = isset($d->end_date)?$d->end_date:null;
        $end_date = convertDate($end_date);

        $delivery_type = isset($d->delivery_type)?Sanitizer::sanitize($d->delivery_type):null;
        //if (!(bool)strtotime($date)) $date = date('Y-m-d');
        $status_id = isset($d->status_id)?$d->status_id:-1; //NULL =  by default, user did not choose anything, -1: All statuses
        $sender_id = isset($d->sender_id)?Sanitizer::sanitize($d->sender_id):null;
        $driver_id = isset($d->driver_id)?Sanitizer::sanitize($d->driver_id):null;
        $str_sender= null;
        $str_driver = null;
        $str_status = null;
        $str_dates = null;
        $str_search = null;
        $str_delivery_type =null;
        
        $cache_key = 'orderlist_';
        foreach($d as $key => $value) $cache_key .= $value;
        $cache_key = sha1($cache_key);
        $cache_data = Cache::get($cache_key);
        if($cache_data) return $cache_data;
        
        $search_value = isset($d->search_value)?$d->search_value:null;
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $search_by_package = ' OR o.id IN (SELECT order_id FROM order_receivers as r WHERE r.receiver_phone =\''.$search_value.'\')';
            $str_search =' AND (o.code =\''.$search_value.'\' OR s.phone_number =\''.$search_value.'\' OR s.name LIKE \'%'.$search_value.'%\' '.$search_by_package.') ';
            $more_wheres ="1=1 ".$str_search;
        } else {
            if ($status_id ==-1) 
               $str_status = null;
            else if ($status_id ==0) 
               $str_status = " AND o.status_id =0";
            else if ($status_id > 0) 
              $str_status = " AND o.status_id ='".Sanitizer::sanitize($status_id)."' ";
            if($sender_id > 0) $str_sender = " AND o.sender_id ='".$sender_id."' ";
            if($driver_id > 0) $str_driver = " AND o.driver_id ='".$driver_id."' "; 
            if ((bool)strtotime($start_date) && (bool)strtotime($end_date)) {
                $str_dates = ' AND DATE(o.request_date) >=\''.$start_date.'\' AND DATE(o.request_date) <= \''.$end_date.'\' ';     
            }
            if (!empty($delivery_type)) $str_delivery_type = ' AND o.delivery_type =\''.$delivery_type.'\'';
            if ($status_id ==5) //NOTE that order.completed =1 also means order.status_id = 5 //if status ="Arrived warehouse" => query includes "Completed" Order as well 
              $more_wheres = ' o.completed =1 '.$str_dates.$str_sender.$str_delivery_type.$str_driver;
            else 
              $more_wheres = ' IFNULL(o.completed,0) = 0 '.$str_dates.$str_driver.$str_sender.$str_status.$str_delivery_type;
        }
        //CASE sign(IFNULL(o.status_id,0) -4) WHEN 1 THEN (SELECT COUNT(p.id) FROM package AS p WHERE p.branch_id ='".$branch_id."' AND p.order_id = o.id) ELSE o.qty END AS qty
        $rows = DB::table('order AS o')->join('sender AS s','s.id','=','o.sender_id')->join('package_statuses AS ps','ps.id','=','o.status_id')->where('o.branch_id',$branch_id)->whereRaw($more_wheres)->selectRaw('o.id,booking_channel,IFNULL(o.completed,0) AS completed,o.delivery_type, o.code as order_code, o.request_vehicle_type, o.sender_id, s.name AS sender_name,s.code AS sender_code, s.phone_number AS sender_phone, formatDate(o.request_date) AS request_date,DATE_FORMAT(o.request_date,\'%r\') AS request_time,o.qty, o.product_type, o.loc_lat,o.loc_lng, o.pickup_address, o.status_id, ps.name AS order_status,o.driver_id, (SELECT d.name FROM driver as d WHERE d.id = o.driver_id LIMIT 1) AS driver_name,o.create_user,formatTime(o.create_date) As create_date')->orderByRaw('ps.display_order ASC,o.id DESC')->get();
        $img_rows = DB::table('order AS o')->join('sender AS s','s.id','=','o.sender_id')->join('package_statuses AS ps','ps.id','=','o.status_id')->join('order_images as img','img.order_id','=','o.id')->where('o.branch_id',$branch_id)->whereRaw($more_wheres)->where('img.inactive',0)->selectRaw('o.id,COUNT(img.id) AS image_count')->groupByRaw('o.id')->get();      
        foreach($rows as $row){
            $row->map_url = getLocationUrl($row->loc_lat,$row->loc_lng);
            $row->image_count = self::countPackagePhotos($img_rows,$row->id);
        }
        if($cache_key) Cache::put($cache_key,$rows,10);    
        return $rows;
    }
    //getPickupRequests Delivery Order List that not yet completed AT WAREHOUSE
    function getOutstandingDeliveryOrders($sender_id,$ss=null){
        $ss = $ss ?? $this->userInfo;  
        $branch_id = $ss->branch_id;
        $rows = DB::table('order AS o')->join('sender AS s','s.id','=','o.sender_id')->join('package_statuses AS ps','ps.id','=','o.status_id')->selectRaw("o.code AS order_code,o.id AS order_id, formatDate(o.create_date) AS request_date,o.qty,ps.name AS status, (SELECT CONCAT(name,'||',phone_number) FROM driver WHERE id = o.driver_id LIMIT 1) AS driver_info")->where('o.branch_id',$branch_id)->where('sender_id',$sender_id)->whereRaw('IFNULL(completed,0) =0')->whereRaw("o.status_id <5")->orderBy('o.id','DESC')->get(); 
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
 
     
    //return count of Pending Orders
    function getPendingOrderCount($ss=null){
        $ss = $ss ?? $this->userInfo;
        $rows = DB::table("order AS o")->where('o.branch_id',$ss->branch_id)->where("o.status_id",1)->selectRaw("COUNT(o.id) AS cnt")->get();
        if(!isset($rows[0])) return 0;
        return $rows[0]->cnt;
    }
  
   function getComboItems_delivery_condition($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        
        $branch_id = $ss->branch_id;
         $rows = DB::table('delivery_conditions AS c')->where('branch_id',$branch_id)->selectRaw("name,display_name")->get();
         return $rows;
      }
     function getComboItems_product_type($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        
        $branch_id = $ss->branch_id;
        $rows = DB::table('product_types AS pt')->where('branch_id',$branch_id)->selectRaw("id,name AS product_type")->get();
        return $rows;
     }
     
     function getFormData_pickup_request($ss){
        $ss = $ss ?? $this->userInfo; 
        $branch_id = $ss->branch_id;
        $data = (object)array();
        $str_status = 's.status_code =\'Active\'';
        $data->senders = DB::table('sender AS s')->where('branch_id',$branch_id)->whereRaw($str_status)->selectRaw("s.id, CONCAT(s.name,' | ',s.code) AS name")->orderByRaw('s.name ASC')->get();
        $data->warehouses = DB::table('warehouses AS h')->where('h.branch_id',$branch_id)->selectRaw('h.id,h.name AS warehouse_name')->orderByRaw('h.name ASC')->get();
        $data->zones = DB::table('zones AS z')->where('z.branch_id',$branch_id)->selectRaw("z.zone_code, CONCAT(z.zone_code,' | ',z.zone_name) AS zone_name")->orderByRaw('z.zone_name ASC')->get();
        $data->warehouses = DB::table('warehouses AS h')->where('h.branch_id',$branch_id)->selectRaw('h.id,h.name AS warehouse_name')->orderByRaw('h.name ASC')->get();
        $data->vehicle_types = DB::table('vehicle_type AS v')->where('v.branch_id',$branch_id)->selectRaw("lower(code) AS code,name AS vehicle_type")->get();
        $data->conditions = DB::table('delivery_conditions AS c')->where('branch_id',$branch_id)->selectRaw("name,display_name")->get();
        $data->product_types = DB::table('product_types AS pt')->where('branch_id',$branch_id)->selectRaw("name AS product_type")->get();
        return $data;
     }

     //getPickupInfo()
     function getDetails($id=null) {
        $order_id =$id?$id:$this->id; 
        //$branch_id = $ss->branch_id;
        if(!$order_id) $order_id = 0;
        $rows = DB::select(DB::raw("SELECT o.id as order_id, o.delivery_condition, o.delivery_type,o.code as order_code, o.request_vehicle_type, o.sender_id,
         s.name as sender_name, s.code AS sender_code, DATE_FORMAT(o.request_date,'%d %b %Y %T') AS request_date, o.qty, o.product_type,
          o.pickup_address, (SELECT `name` FROM package_statuses WHERE id = o.status_id LIMIT 1) AS order_status, 
          o.status_id, (SELECT d.name FROM driver as d WHERE d.id = o.driver_id LIMIT 1) AS driver_name 
          FROM `order` AS o INNER JOIN sender as s ON s.id = o.sender_id WHERE o.id =".Sanitizer::sanitize($order_id)." LIMIT 1"));
       return isset($rows[0])?$rows[0]:null;
    }

    //Admin user assigns a driver to pickup. If the item already picked up, then this is not allowed
    function assignPickupDriver($arr = [], $id=null, $ss = null) {
        $ss = $ss ?? $this->userInfo;
        $order_id = $id ?? $this->id; 
        $branch_id = $ss->branch_id;
        $d = (object)$arr;  
        $result =(object)['status'=>'OK','error_message'=>null];
        $is_from_mobile = (strtolower($ss->user_class) =='driver');
        
        $order= DB::table('order')->where('branch_id',$branch_id)->where('id',$order_id)->selectRaw('status_id,qty,driver_id')->take(1)->first();
        if(!$order) return DV::error('Order ID does not exist');
         $status_id = $order->status_id;
         if ($status_id >= 3) return DV::error('Cannot assign driver to this delivery order because it has been picked up or booked already');

        $driver_id = isset($d->driver_id)?$d->driver_id:null;
        $to_change_driver = ($order->driver_id > 0 && $driver_id > 0 && $order->driver_id != $driver_id);
        $remove_driver = ($order->driver_id > 0 && !$driver_id);
        $assign_driver = (!$order->driver_id && $driver_id > 0);

        $driver = null; 
        if ($driver_id > 0 ) $driver = DB::table('driver')->where('branch_id',$branch_id)->where('id',$driver_id)->selectRaw('id,name,phone_number')->take(1)->first();
        if($driver_id > 0 && !$driver) return DV::error('Driver identity '.$driver_id.' is not correct!');
        $driver_name = $driver->name;
        //$driver_phone =$driver->phone_number;

        if ($to_change_driver){
            //$status_id =2; //Use original status of the `order`
            return $this->changePickupDriver_internal($branch_id,$order_id,$driver_id);
        }else if ($remove_driver){
            $status_id =1;
            DB::table('order')->where('id',$order_id)->where('branch_id',$branch_id)->update([
                'driver_id'=>null,
                'status_id'=>$status_id //status = 'Available for Pickup'
            ]);
            DB::table('order_receivers')->where('order_id',$order_id)->where('branch_id',$branch_id)->update([
                'pickup_driver_id'=>$d->driver_id
            ]);
        }else if ($assign_driver){
            $status_id =2;
            DB::table('order')->where('id',$order_id)->where('branch_id',$branch_id)->update([
                'driver_id'=>$d->driver_id,
                'status_id'=>2 //status = 'Accepted'
            ]);
            DB::table('order_receivers')->where('order_id',$order_id)->where('branch_id',$branch_id)->update([
                'pickup_driver_id'=>$d->driver_id
            ]);
        }

        $status_name = DB::table('package_statuses AS ss')->where('ss.id',$status_id)->selectRaw('name')->take(1)->value('name');
        // if($status_id > 2){
        //     DB::table('delivery')->where('branch_id',$branch_id)->where('order_id',$order_id)->delete();
        //     DB::table('package')->where('branch_id',$branch_id)->where('order_id',$order_id)->delete();
        //     DB::table('order_receivers')->where('branch_id',$branch_id)->where('order_id',$order_id)->delete();
        // }  
          
        if($is_from_mobile==1 && $driver_id){
            //In case Driver accepts Delivery Order
            $msg = $driver_name.' accepted to pick up an order';
            $data =(object)['branch_id'=>$branch_id,'user_id'=>$ss->user_id,'order_id'=>$order_id,'driver_id'=>$d->driver_id,'driver_name'=>$driver_name,'message'=>$msg,'accept_time'=>getNowTime()];
            $err = Notifier::notify_admin('driver_accepted_order',$data);
            if ($err) {
                $result->notification_error = $err;
                $result->event_notified =0;
            }else  $result->event_notified =1;
    
        }else{
           //In case Admin Assign driver to pickup
           $data =$this->getOrderInfo_local($branch_id,$order_id,0);
           if (!$data) return DV::depends(1,['driver_id'=>$driver_id,'driver_name'=>$driver_name,'statusInfo'=>(object)['status_id'=>$status_id,'status'=>$status_name]]);
           //if qty = 0 then set it to 1 by default in notification
           $data->qty = $data->qty>0?$data->qty:1;
           $pickup_address = strpos($data->pickup_address, 'https://map') !== false ? 'តាមផែនទី' : $data->pickup_address;
          //begin::inform Web Admin for Live update of Driver Change
            $message = "Order numbered $data->order_code driver assigned to $driver_name";
            $event_data = (object)['branch_id'=>$branch_id,'order_id'=>$order_id,'order_code'=>$data->order_code,'status'=>$data->status,'status_id'=>$data->status_id,'completed'=>$data->completed,'driver_id'=>$data->driver_id,'driver_name'=>$driver_name,'message'=>$message];
            Notifier::notify_admin('pickup_driver_changed',$event_data);
          //end:: inform Web Admin for Live update
    
           //begin::Notify Merchant and Driver

           //end::Notify Merchant and Driver
              $data->event_name = 'order_accepted';
              $cdata = [
                  [
                     //'event_name'=>'pickup_assigned',
                     'user_class'=>'driver',
                     'target_user_id'=>$driver_id,
                     'persist'=>1,
                     'data'=>$data,
                     'title'=>'Pickup',
                     'message'=>"មានទំនិញ $data->qty កញ្ចប់ត្រូវទៅយកពី​​ $data->sender_name នៅ $pickup_address. Tel: $data->sender_phone"
                  ],
                  [
                    'user_class'=>'merchant',
                    'target_user_id'=>$data->sender_id,
                    'persist'=>1,
                    'data'=>$data,
                    'title'=>'Order Accepted',
                    'message'=>"អ្នកបើកបរ $driver->phone_number នឹងមកយកទំនិញ"
                  ]
              ];
              Notifier::notify_mobile($branch_id,$cdata);
           //Notify driver that he has pickup assignment
        }   
        return DV::depends(1,['driver_id'=>$d->driver_id,'driver_name'=>$driver_name,'statusInfo'=>(object)['status_id'=>$status_id,'status'=>$status_name]]);
    }

    // //Admin user changes pickup Driver (in case of updating or correction only). Otherwise, Admin user must use "assignPickupDriver()" method 
    // function changePickupDriver($arr,$id=null,$ss=null) {
    //     $ss = $ss ?? $this->userInfo;
    //     $order_id = $id ?? $this->id;
    //     $d = (object)$arr;
    //     $branch_id = $ss->branch_id;
    //     $order_id = $d->order_id;
    //     $driver_id = isset($d->driver_id)?$d->driver_id:null;
    //     return $this->changePickupDriver_internal($branch_id,$order_id,$driver_id);   
    // }

    //Change pickup driver (this method is used internally)
    function changePickupDriver_internal($branch_id,$order_id,$driver_id,) {
        $status_id = 1;
        $prev_driver_id = null;
        //$sender_name =null;
        $order_code = null;
        $prev_driver = null;
        if(!$driver_id) return DV::error('Driver identity is not valid');
        //Get previous driver and order info
        $row= DB::table('driver AS d')->join('order AS o','o.driver_id','=','d.id')->join('sender AS s','s.id','=','o.sender_id')->join('package_statuses AS ps','ps.id','=','o.status_id')->where('o.branch_id',$branch_id)->where('o.id',$order_id)->selectRaw("o.id as order_id, d.phone_number, d.name AS name,o.sender_id,o.driver_id,o.code AS order_code,s.name AS sender_name,s.phone_number as sender_phone,o.status_id,ps.`name` AS `status`,o.pickup_address,o.completed")->take(1)->first();
        if(!$row) return DV::error('Order identity is not correct or this order does not have driver assigned yet!');
        $prev_driver = $row;
        $status_id = $row->status_id;
        $prev_driver_id = $row->driver_id;
        //$sender_name = $row->sender_name;
        $order_code = $row->order_code;
        $orderStatus = (object)['status_id' =>$status_id,'status'=>$row->status];  
        if (empty($prev_driver_id) || $prev_driver_id <=0) return DV::error('Because there was no driver assigned to this Delivery Order yet, so you can assign a driver instead of changing driver');
        DB::table('order')->where('branch_id',$branch_id)->where('id',$order_id)->update([
            'driver_id'=>$driver_id 
        ]);
 
        //get new deriver's details
        $new_driver = DB::table('driver as d')->where('id',$driver_id)->selectRaw('id,code,name,phone_number')->take(1)->first();
        if(!$new_driver) return DV::error('New driver ID '.$driver_id.' does not exist');
        $data = $prev_driver;  //$this->getOrderInfo_local($branch_id,$order_id,0);
        $data->new_driver_id = $driver_id;
        $data->event_name ='driver_changed';
      
        //inform previous driver and new driver 
        //begin::inform Web Admin for Live update of Driver Change
            $message = 'Order numbered '.$order_code.' to be picked by new driver '.$new_driver->name;
            $event_data = (object)['branch_id'=>$branch_id,'order_id'=>$order_id,'order_code'=>$data->order_code,'status'=>$data->status,'status_id'=>$data->status_id,'completed'=>$data->completed,'driver_id'=>$driver_id,'driver_name'=>$new_driver->name,'message'=>$message];
            Notifier::notify_admin('pickup_driver_changed',$event_data);
        //end:: inform Web Admin for Live update

        //Make notifications to Merchant and Driver ONLY if the Delivery Order is NOT YET PICKED
        if($status_id < 3){
            $cdata =[
                [
                 'user_class'=>'driver',
                 'target_user_id'=>$prev_driver->driver_id,
                 'persist'=>1,
                 'data'=>$data,
                 'title'=>'Driver Changed',
                 'message'=>"$order_code មិនបាច់ទៅយកទំនិញនេះទេ!"
                ],
                [
                 'user_class'=>'driver',
                 'target_user_id'=>$driver_id,
                 'persist'=>1,
                 'data'=>$data,
                 'title'=>'Driver Changed',
                 'message'=>"មានទំនិញត្រូវទៅយកពី​​ $data->sender_name នៅ $data->pickup_address.លេខអ្នកលក់: $data->sender_phone"
                ],
                [
                 'user_class'=>'merchant',
                 'target_user_id'=>$data->sender_id,
                 'persist'=>1,
                 'data'=>$data,
                 'title'=>'Driver Changed',
                 'message'=>"អ្នកដឹកថ្មី​ $new_driver->name នឹងមកយកទំនិញនៅទីតាំង $data->pickup_address"
                ]
             ];
             Notifier::notify_mobile($branch_id,$cdata); 
        }
        return DV::depends(1,['driver_id'=>$driver_id,'driver_name'=>$new_driver->name,'statusInfo'=>$orderStatus]);
    }

    static function processItemPhotos($photos){
         if (!$photos)  return (object)[
            'status'=>'OK',
            'status_code'=>200,
            'success_items'=>[]
        ];

         $success_items =[];
         $i =0;
         foreach($photos as $item){
            $img = isset($item['image'])?$item['image']:null;
            if(isImage($img)){
               $success_items[] = $item;
            }else{
                $remarks = ': '.isset($item['remarks'])?$item['remarks']:$i;
                return DV::error('Some image data is not acceptable as photo'.$remarks);
            }
            $i++;
         }

         return (object)[
             'status'=>'OK',
             'status_code'=>200,
             'success_items'=>$success_items
         ];
    }

    function updatePickup($d) {
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        

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

    //UpdateOrderStatus Update Order status or Pickup status $d = {'order_id','status_id'}
    function updateStatus($arr,$id=null,$ss=null) {
        $ss = $ss?$ss:$this->userInfo;
        $order_id  =$id?$id:$this->id;
        $branch_id = $ss->branch_id;
        $d = (object)$arr;

        $status_id = Sanitizer::sanitize($d->status_id);
        $driver_id = Sanitizer::sanitize($d->driver_id);
        $driver_id  =$driver_id ?$driver_id :0;
         
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
         $order = null;     
         $rows = DB::table('order AS o')->where('o.branch_id',$branch_id)->where('o.id',$order_id)->selectRaw('o.id,o.status_id,o.code AS order_code,o.sender_id,o.driver_id')->limit(1)->get();   
         foreach($rows as $row) {
             $order = $row;
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
        if(!$driver_id) $driver_id=0;
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
         
              //begin::Notify "order_status_changed"
                if($current_status_id != $status_id){
                    $message = "Order numbered ".$order_code." changed status to \"".$status."\"";
                    $event_data = (object)['branch_id'=>$branch_id,'order_id'=>$order_id,'order_code'=>$order_code,'sender_id'=>$ss->user_id,'status'=>$status,'status_id'=>$status_id,'completed'=>$completed,'driver_id'=>$driver_id,'driver_name'=>$driver_name,'message'=>$message];
                    Notifier::notify_admin('order_status_changed',$event_data);   
                }
              //end:: notify_order_status_cahnged

               $result = ['status_name'=>$status,'status_id'=>$status_id,'driver_id'=>$driver_id,'driver_name'=>$driver_name];

              //begin::notify concerned Merchant and Driver 
                $cdata = [
                    [
                        'user_class'=>'driver',
                        'target_user_id'=> $result['driver_id'],
                        'title'=>'Order Status',
                        'message'=>'Admin changed status order '. $order_code.' to '. $result['status_name'],
                        'data'=>['event_name'=>'order_status_changed']
                    ],
                    [
                        'user_class'=>'merchant',
                        'target_user_id'=> $order->sender_id,
                        'title'=>'Order Status',
                        'message'=>'Admin changed status order '. $order_code.' to '.$result['status_name'],
                        'data'=>['event_name'=>'order_status_changed']
                    ]
                ];
                Notifier::notify_mobile($branch_id,$cdata);
              //end::notify concerned Merchant and Driver 

                  //   $result->status ='OK';//Status is method's result status
            //   $result->error_message = null; 
            //   $result->status_id = $status_id;
            //   $result->status_name = $status; // status_name is Order status
            //   $result->driver_id = $driver_id;
            //   $result->driver_name = $driver_name;
              return DV::depends(1,$result,null); 
     }

    function getPickupInfo_quick($uss,$id){
        $branch_id = $uss->branch_id;
        $rows = DB::table('order AS p')->where('p.branch_id',$branch_id)->where('p.id',$id)->selectRaw('p.id,p.sender_id, p.code AS order_code, p.driver_id,p.qty, p.status_id, p.request_date,p.sender_id')->limit(1)->get();
        foreach($rows as $row) return $row;
        return null;
    }
    
     //Delete Order or Pickup transaction
     function delete($id=null,$filter=[], $ss=null) {
        $id = $id?$id:$this->id;
        $ss=$ss?$ss:$this->userInfo;

        $branch_id = $ss->branch_id;
        $order_code = null;
        $p = $this->getPickupInfo_quick($ss,$id);
        if (!$p) return DV::error("The provided pickup request identity is not valid!");
        $order_code = $p->order_code;

        if($p->status_id != 1 && $p->status_id != 0) return DV::error('Only "pending" or "Canceled" orders can be deleted!');
        DB::table('order')->where('branch_id',$branch_id)->where('id',$id)->delete();

            //Notify to other admin on other browsers
                    $message = "Order numbered ".$p->order_code." is deleted";
                    $event_data = (object)['branch_id'=>$branch_id,'order_id'=>$p->id,'order_code'=>$p->order_code,'driver_id'=>$p->driver_id,'message'=>$message,'title'=>'Order Deleted'];
                    Notifier::notify_admin('order_deleted',$event_data);   
           //Notify to other admin on other browsers
                  
             //begin:: Notify to mobile app users
                  $p->event_name ="order_deleted"; 
                  $cdata =[
                    // [
                    //     'user_class'=>'driver',
                    //     'target_user_id'=>$p->driver_id,
                    //     'title'=>'Order Deleted',
                    //     'message'=> "Order $order_code ត្រូវបានលុបចោល",
                    //     'persist'=>1,
                    //     'data'=>$p
                    // ],
                    [
                        'user_class'=>'merchant',
                        'target_user_id'=>$p->sender_id,
                        'title'=>'Order Deleted',
                        'message'=> "Order $order_code ត្រូវបានលុបចោល",
                        'persist'=>1,
                        'data'=>$p
                    ]
                ];
                Notifier::notify_mobile($branch_id,$cdata);
           //end::Notify to mobile app users
        return DV::depends(1,['orders'=>$this->getList($filter)]);        
    } 

    function getComboItems_vehicleType($ss=null){  
       $str_branch = $ss? $ss->branch_id : '1=1';
       return  DB::select(DB::raw('SELECT v.id, v.name as vehicle_type FROM `vehicle_type` AS v WHERE '.$str_branch));
    }

    function getComboItems_sender($data){
        $ss = UM::getUserInfoByToken($data);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        

        $branch_id = $ss->branch_id;
        $rows = DB::select(DB::raw("SELECT s.id, s.name as sender_name FROM `sender` AS s WHERE s.branch_id ='".Sanitizer::sanitize($branch_id)."' order by s.name ASC"));
        return ($rows);
     }

     function getForm_options_pickuplist($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task

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
         $dim_x = floatval($dim_x) ?? 0;
         $dim_y = floatval($dim_y) ?? 0;
         $dim_h = floatval($dim_h) ?? 0;
         $actual_weight = floatval($actual_weight) ?? 0;
         $adjusted_kg = floatval($adjusted_kg) ?? 0;
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

     //getOrderInfo_magicEntry() returns object {'order_id','order_code','package_count','sender_name','sender_phone'}
     function getOrderInfo_magicEntry($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task
        $branch_id = Sanitizer::sanitize($ss->branch_id);
        $order_id = Sanitizer::sanitize($d->order_id);
        $rows = DB::table('order AS o')->join('sender AS s','s.id','=','o.sender_id')->where('o.id',$order_id)->where('o.branch_id',$branch_id)->selectRaw("o.id as order_id, o.sender_id,o.code as order_code,o.qty, o.actual_pkg_count AS package_count,s.name as sender_name,s.phone_number as sender_phone")->limit(1)->get();
        foreach($rows as $row) return $row;
        return null; 
     } 

     function getOrderInfo($id =null,$ss=null){
        $ss = $ss ?? $this->userInfo;
        $order_id = $id ?? $this->id;
        $branch_id = $ss->branch_id;

        $row = DB::table('order AS o')->where('o.branch_id',$branch_id)->where('o.id',$order_id)->join('sender AS s','s.id','=','o.sender_id')->selectRaw("o.id AS order_id,o.status_id, o.code AS order_code, s.id AS sender_id, s.name AS sender_name, s.code As sender_code, DATE_FORMAT(o.request_date,'%d %b %Y %r') AS request_date")->take(1)->first();
        if($row) {
            //$sender_id = $row->sender_id;
            $status_id = $row->status_id; 
            if ($status_id < 5) // Perform Pickup for a particular Pickup Request (select packages from table "order_receivers")
               $row->packages = DB::table("order_receivers AS r")->join('sender AS s','s.id','=','r.sender_id')->join('package_statuses AS ps','ps.id','r.status_id')->where('r.branch_id',$branch_id)->where('r.order_id',$order_id)->selectRaw('r.id AS package_id,NULL as barcode,r.sender_id AS sender_id, r.receiver_address,r.receiver_phone,r.receiver_name, r.package_name,r.zone_code,LOWER(r.delivery_type) AS delivery_type,r.zone_name,CONCAT(dim_x,\' \',dim_y,\' \',dim_h) AS size, r.actual_kg, r.billed_kg, 0 AS base_fee, r.delivery_fee,r.df_payer,r.price,r.cod,r.cod_fee,r.forwarding_cost,ps.name AS status')->get();
            else //if ($status_id >=5) //select packages from table "package"
               $row->packages = DB::table("package AS r")->join('package_statuses AS ps','ps.id','=','r.status_id')->where('r.branch_id',$branch_id)->where('r.order_id',$order_id)->selectRaw('r.id AS package_id,r.qr_code AS barcode,r.sender_id,r.receiver_address,r.receiver_phone,r.receiver_name, r.package_name,r.zone_code,LOWER(r.delivery_type) AS delivery_type,r.zone_name,CONCAT(dim_x,\' \', dim_y,\' \', dim_h) AS size, r.actual_kg, r.billed_kg, r.base_fee, r.delivery_fee,r.df_payer,r.price,r.cod,r.cod_fee,r.forwarding_cost,r.delivery_notes, ps.name AS status')->get();
            return $row;
        }
        return null;
     }

     //getOrderInfo internal use only
     function getOrderInfo_local($branch_id,$order_id,$include_packages = 0){
        $rows = DB::table('order AS o')->where('o.branch_id',$branch_id)->where('o.id',$order_id)->join('sender AS s','s.id','=','o.sender_id')->join('package_statuses AS ps','ps.id','=','o.status_id')->selectRaw("o.id AS order_id,o.driver_id,o.qty,o.status_id, o.code AS order_code, s.id AS sender_id, s.name AS sender_name,s.phone_number AS sender_phone,s.code As sender_code, DATE_FORMAT(o.request_date,'%d %b %Y %r') AS request_date,o.pickup_address, o.loc_lat,o.loc_lng,o.completed,ps.`name` AS `status`")->limit(1)->get();
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
     function getOrderPackageList($id=null,$ss =null){
        $ss = $ss ?? $this->userInfo;
        $order_id = $id ?? $this->id;
        $branch_id = $ss->branch_id;
        $status_id = null;
        $sender_id = null;
        $row = DB::table('order AS o')->where('branch_id',$branch_id)->where('id',$order_id)->selectRaw('status_id,sender_id')->take(1)->first();
        if($row){
            $status_id = $row->status_id;
            $sender_id = $row->sender_id;
        }else return [];
        if(empty($status_id)) $order_id =-1;
        if ($status_id < 5) // Perform Pickup for a particular Pickup Request (select packages from table "order_receivers")
           $table ='order_receivers';
        else //select packages from table "package"
           $table ='package';
        return DB::table($table.' AS r')->join('package_statuses AS ps','ps.id','=','r.status_id')->join('sender AS s','s.id','=','r.sender_id')->where('r.branch_id',$branch_id)->where('r.order_id',$order_id)->selectRaw('r.id AS package_id,r.status_id,r.qr_code as barcode,r.delivery_type,\''.$sender_id.'\' AS sender_id,s.name AS sender_name, r.receiver_address,r.delivery_notes As remarks,r.receiver_phone,r.receiver_name, r.package_name,LOWER(r.delivery_type) AS delivery_type,r.zone_code,r.zone_name,CONCAT(dim_x,\' \',dim_y,\' \',dim_h) AS size, r.actual_kg, r.billed_kg, IFNULL(r.base_fee,0) AS base_fee, r.delivery_fee,r.df_payer,r.price,r.cod,r.cod_fee,r.forwarding_cost,ps.name AS status, (IFNULL(r.base_fee,0) + IFNULL(r.delivery_fee,0)) AS fees, CASE r.cod WHEN 1 THEN (IFNULL(r.price,0) - IFNULL(r.cod_fee,0)) ELSE 0 END AS cod_amount, ROUND(driver_total,2) AS driver_total')->get();
     }
 
     function getOrderPackagePhotos($id=null,$ss =null){
        $ss = $ss ?? $this->userInfo;
        $order_id =$id ?? $this->id;
        $branch_id = $ss->branch_id;

        $rows = DB::table("order_images as img")->join('order as o','o.id','=','img.order_id')->where('o.id',$order_id)->where('img.inactive',0)->where('img.branch_id',$branch_id)->selectRaw('img.id,img.file_name,package_id,qr_code as barcode')->get();
        $img_folder = 'package';
        $base_url = PublicStorage::getUrl($branch_id,$img_folder,'image');
        $default_image =$base_url.'/def_image.png';
        $dir = PublicStorage::getDiskPath($branch_id,$img_folder,'image');
        foreach($rows as $row){
            $filePath = $dir.$row->file_name;
            if (fileExists($filePath))   
               $row->image_url = $base_url.$row->file_name;
            else
               $row->image_url = $default_image; 
        }
        return $rows;
     }

     //Returns one package's details for editing on Pickup List (when user Reveive packages)
     function getOrderPackageDetails($arr =[], $id = null,$ss = null){
        $ss = $ss ?? $this->userInfo;
        $order_id  = $id ?? $this->id;
        $branch_id = $ss->branch_id;

        $d = (object)$arr;
        $package_id = isset($d->package_id)?Sanitizer::sanitize($d->package_id):null;
        $status_id = null;

        $rows = DB::table('order AS o')->where('branch_id',$branch_id)->where('o.id',$order_id)->selectRaw('status_id')->limit(1)->get();
        foreach($rows as $row) $status_id = $row->status_id;
        if(empty($status_id)) $order_id =-1;
        $table = 'order_receivers';
        if ($status_id >=5)   $table = 'package';
        $get_image_id = $table === 'order_receivers'? ',(SELECT img.id FROM order_images as img WHERE img.package_id = r.id LIMIT 1) As image_id':'';
        return DB::table($table.' AS r')->join('package_statuses AS ps','ps.id','=','r.status_id')->join('sender as s','s.id','=','r.sender_id')->where('r.branch_id',$branch_id)->where('r.order_id',$order_id)->where('r.id',$package_id)->selectRaw('r.id AS package_id,r.status_id,r.qr_code AS barcode,r.delivery_type,r.zone_code,r.zone_name,r.sender_id,s.name AS sender_name,r.receiver_address,r.delivery_notes AS remarks,r.receiver_phone,r.receiver_name, r.package_name,r.zone_code,LOWER(r.delivery_type) AS delivery_type,r.zone_name,CONCAT(dim_x,\' \', dim_y,\' \', dim_h) AS size, r.actual_kg, r.billed_kg,r.base_fee, r.delivery_fee,r.df_payer,r.price,r.cod,r.cod_fee,r.forwarding_cost,r.delivery_notes, ps.name AS status,(IFNULL(r.base_fee,0) + IFNULL(r.delivery_fee,0)) AS fees, CASE r.cod WHEN 1 THEN (IFNULL(r.price,0) - IFNULL(r.cod_fee,0)) ELSE 0 END AS cod_amount,r.driver_total,r.sender_total'.$get_image_id)->take(1)->first(); 
     }
 
     function deleteOrderPackage($arr=[],$ss){
        $d = (object)$arr;
        $ss = $ss?$ss:$this->userInfo;
        $branch_id = $ss->branch_id;
        $order_id = isset($d->order_id)? Sanitizer::sanitize($d->order_id):null;
        $package_id = isset($d->package_id)? Sanitizer::sanitize($d->package_id):null;
        
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
        
        /*** deleting package will affect driver's commission, company's revenue, etc ***/

        $count = 0;
        if($status_id >=5){
            DB::table('package')->where('branch_id',$branch_id)->where('order_id',$order_id)->where('id',$package_id)->delete();
            $count = DB::table('package as p')->where('p.order_id',$order_id)->count('p.id');
        } else {
            DB::table('order_receivers')->where('branch_id',$branch_id)->where('order_id',$order_id)->where('id',$package_id)->delete();
            $count = DB::table('order_receivers as r')->where('r.order_id',$order_id)->count('r.id'); 
        }       
        DB::table('order')->where('id',$order_id)->update([
            'qty'=>$count,
            'actual_pkg_count'=>$count
        ]);

        try{
           DB::table('order_images')->where('package_id',$package_id)->update(['package_id'=>null,'qr_code'=>null]); 
        }catch(\Throwable $e){
           Log::error($e->getMessage());
           Log::error($e->getTraceAsString());
        }

        return DV::depends(1,['package_count'=>$count]);
     }

     function createQRCode($uss,$package_id=null){
        $unique_string = substr(uniqid(), 0, 5) . substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 5);
        if($package_id>0) substr($unique_string,0,10-strlen($package_id.'')).$package_id;
        return strtoupper($unique_string);
     }
 
     ///IMPORTANT NOTE: there is method setBarcode() in Package model too.
     //NOte that the default table_name = "order_receivers" here, but in package model, the default table_name ="package"
     //If no error, return object {'barcode'}, otherwise, returns object {status='Error','error_message'=>'sdfdsgdg'}
     static function setBarcode($package_id,$table_name='order_receivers',$col_name='qr_code'){
        $unique_string = substr(uniqid(), 0, 5) . substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 5);
        $barcode = strtoupper(substr($unique_string,0,10-strlen($package_id.'')).$package_id);
        DB::table($table_name)->where('id',$package_id)->update([$col_name=>$barcode]);
        return (object)['barcode'=>$barcode];
      }

     //Save pakcage detail either to table "order_receivers" or "package" table
     //updateOrderPackageDetails | updateOrderPackageInfo
     function saveOrderPackageDetails($arr,$ss){
        $v_rule= [
            'order_id'=>'1|number|text=Order ID does not exist',
            'image_id'=>'0|number',
            'sender_id'=>'0|number|sender.id|text=Merchant identity does not exist',
            'package_id'=>'0|number',
            'barcode'=>'0|string|0-50',
            'delivery_type'=>'1|string|0-15',
            'zone_code'=>'1|string|0-25',
            'receiver_phone'=>'0|phone|0-100',
            'price'=>'0|number|0-1000|default=0',
            'cod'=>'0|string|1-2|default=0',
            'size'=>'0|string|0-100',
            'df_payer'=>'0|choice|sender,receiver,Sender,Receiver',
            'receiver_address'=>'0|string|300',
            'remarks'=>'0|string|250',
            'delivery_notes'=>'0|string|250',
            'base_fee'=>'0|number|0-10|default=0',
            'delivery_fee'=>'0|number|0-10|default=0',
            'actual_kg'=>'0|number|0-10|default=0',
            'billed_kg'=>'0|number|0-10|default=0',
            'forwarding_cost'=>'0|number|0-10|default=0'

        ];
        $res = validateObject($arr,$v_rule,true,[],$ss->lang,false,null);
        if($res->error) return DV::error($res->error);

        $d = (object)$res->values;
         
        //$branch_id = $ss->branch_id;
        $order_id = $d->order_id;
        //$sender_id = $d->sender_id;
        $package_id = $d->package_id;
        $image_id = $d->image_id;
        unset($d->image_id);
        $barcode = $d->barcode;
        $warehouse =  GeneralSettings::getDefaultWarehouse($ss);
        if(!$warehouse) return DV::error('Failed to identify default warehouse');
        $warehouse_id = $warehouse->id;
        $d->product_type = isset($d->product_type)?$d->product_type:'';
        $str_package_count = ',(SELECT COUNT(r.id) FROM order_receivers AS r WHERE r.order_id = o.id) AS package_count';
        $orderInfo = DB::table('order as o')->where('id',$order_id)->selectRaw('o.id,o.sender_id,driver_id'.$str_package_count)->take(1)->first();
        if(!$orderInfo) return DV::error('Order Information is missing');
        $pickup_driver_id = $orderInfo->driver_id; 
        $order = (object)['order_id'=>$orderInfo->id,'sender_id'=>$orderInfo->sender_id,'product_type'=>$d->product_type,'delivery_type'=>$d->delivery_type,'warehouse_id'=>$warehouse_id];
        $p_res = self::validatePackages($ss,$order,[$d]);
        if ($p_res->status ==='Error') return DV::error($p_res->error_message);
        $item = null;
        if($p_res->success_items[0]){
            $item = $p_res->success_items[0];
        }
        if (!$item) return DV::error('Package data was not acceptable maybe it is not completely correct!');
        $item->order_id = $order_id;
        $item->outstanding =1;
        $item->pickup_driver_id = $pickup_driver_id;
        $item->qr_code = isset($item->barcode)? $item->barcode:null;
        if(!isset( $item->status_id)) $item->status_id =1;

        /** This line is important to avoid deleting existing delivery_notes booked by Merchant or Driver app */
        if(!isset($item->delivery_notes)) unset($item->delivery_notes);
        //if(!isset($item->remarks)) unset($item->remarks);
        unset($item->barcode);
        unset($item->package_id);
        $table = 'order_receivers';
        $is_insert = !$package_id;
        $package_id = saveData($ss,$table,['id'=>$package_id],(array)$item,[],1,false); 
        if ($package_id)
        { 
            if (!isset($item->qr_code)){
              $b = self::setBarcode($package_id);
              $barcode = $b->barcode;
            }
            if($image_id && $table === 'order_receivers'){
                DB::table('order_images')->where('order_id',$order_id)->where('id',$image_id)->update([
                    'package_id'=>$package_id,
                    'qr_code'=>$barcode
                ]);
            }
        }

        $item->size = $d->dim_x." ".$d->dim_y." ".$d->dim_h; 
        $item->barcode = $barcode;
        $item->fees = $item->base_fee + $item->delivery_fee + $item->cod_fee;
        $item->package_id = $package_id;

        //actual_pkg_count is the COUNT of actual packages with details
        $pkg_count = $orderInfo->package_count;
        if ($is_insert){
            $pkg_count++;
            DB::table('order')->where('id',$order_id)->update(['qty'=>$pkg_count,'actual_pkg_count'=>$pkg_count]);
        }
        return DV::depends($package_id,[
            'package'=>(object)$item, /** Newly created pacakge details **/
            'package_id'=>$package_id,
            'barcode'=>$barcode,
            'package_count'=>$pkg_count,
            'delivery_type'=>$item->delivery_type
        ],'Failed to save package information');
     }

     function getSenderPriceInfo($arr = [], $ss = null){
        $ss = $ss ?? $this->userInfo;
        //$branch_id = $ss->branch_id;
        $d = (object)$arr;
        $sender_id = isset($d->sender_id)?$d->sender_id:0;
        $cod_fee_percent = $this->getCODFeeCharge($ss,$sender_id);
        $base_fee_all_zones = $this->getBaseFee($ss,$sender_id,'all'); //Fixed price or base delivery fee
        $price_list = $this->getSenderPriceList($ss,$sender_id);
        $senderInfo = (object)array('sender_id'=>$sender_id,'cod_fee_percent'=>$cod_fee_percent,'base_fee'=>$base_fee_all_zones,'price_list'=>$price_list);
        //$result->price_per_kg = get_settings_value($uss,'PRICE_PER_KG','number');
        return $senderInfo;
      }  
 
     //driver accept Order
     function acceptPickupRequest($ss,$dd){
        $d = (object)$dd;
         //need permission to do this task
        $branch_id = $ss->branch_id;
        $order_id = Sanitizer::sanitize($d->order_id);
        $driver_id = $ss->official_id;

        $loc_lat = isset($d->loc_lat)?Sanitizer::sanitize($d->loc_lat):null;
        $loc_lng = isset($d->loc_lng)?Sanitizer::sanitize($d->loc_lng):null;

        $status_id = 2;
        $driver = null;
        $order = null;
        $rows = DB::table('driver AS d')->where('branch_id',$branch_id)->where('d.id',$driver_id)->selectRaw('d.name,d.phone_number, d.code')->limit(1)->get();
        foreach($rows as $row) $driver = $row;
        
        $rows = DB::table('order AS o')->where('o.id',$order_id)->selectRaw("o.loc_lat,o.loc_lng")->limit(1)->get();
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
       
        $m = DB::table('order')->where('id',$order_id)->where('branch_id',$branch_id)->update(array('driver_id'=>$driver_id,'status_id'=>$status_id,'completed'=>0));
        
        $cols =["o.driver_id","completed","o.loc_lat","o.loc_lng","o.id AS order_id","o.code AS order_code","o.delivery_type", "o.request_date", "o.sender_id","s.name AS sender_name", "s.email AS sender_email", "s.phone_number AS sender_phone","o.product_type", "o.qty","o.request_vehicle_type","o.pickup_address","o.status_id","status","o.loc_lat","o.loc_lng"];
        $order = self::getProps($branch_id,$order_id,$cols);
           
            //Notify to other admin on other browsers
                   $message = "Order numbered ".$order->order_code." is accepted by $driver->name";
                   $event_data = (object)['branch_id'=>$branch_id,'order_id'=>$order_id,'order_code'=>$order->order_code,'status'=>$order->status,'status_id'=>$order->status_id,'completed'=>$order->completed,'driver_id'=>$order->driver_id,'driver_name'=>$driver->name,'message'=>$message,'title'=>"Order Accepted"];
                   Notifier::notify_admin('order_status_changed',$event_data);   
            //Notify to other admin on other browsers

            if($order){
                  
                    //begin::notify Admin that an order is accepted by driver
                        $message = "$driver->name កំពុងទៅយកទំនិញពី​ $order->sender_name នៅ $order->pickup_address";
                        $event_data = (object)['branch_id'=>$branch_id,'order_id'=>$order_id,'order_code'=>$order->order_code,'sender_id'=>$ss->user_id,'status'=>$order->status,'status_id'=>$order->status_id,'completed'=>$order->completed,'driver_id'=>$order->driver_id,'driver_name'=>$driver->name,'title'=>'Order Accepted','message'=>$message];
                        $err_text = Notifier::notify_admin('order_status_changed',$event_data);
                    
                        // if (!$err_text) 
                        //     return DV::success(["event_notified"=>1]); 
                        // else{
                        //     return DV::success(["event_notified"=>0,"notification_error"=>$err_text]); 
                        // }
                   //end::notify Admin that an order is accepted by driver

                   //begin:: Notify to Merchant, the owner of delivery order
                            $order->event_name ='order_accepted';
                            $cdata = [
                                    [
                                        'user_class'=>'merchant',
                                        'target_user_id'=>$order->sender_id,
                                        'title'=>'Order Accepted',
                                        'message'=>"Order $order->order_code អ្នកដឹក $driver->name នឹងមកយកទំនិញ នៅ $order->pickup_address",
                                        'persist'=>1,
                                        'data'=>$order
                                    ]
                            ];
                            $res = Notifier::notify_mobile($branch_id,$cdata);
                     //end:: Notify to Merchant, the owner of delivery order  

                    //return DV::error('noti_err' + var_dump($res));
            }
            else {
                return DV::error("Unexpectedly, the order_id $order_id was invalid!");
                //This case: "driver acceped Order but $order_id is not valid". This should never happens
            }
        //get the accepted Order to display in Driver App's My Task tab
         return DV::success(["order"=>$order]);
    }

    /** pickItemPhotos | pickOrder with photos */
    function pickPackagePhotos($photos = [], $id=null,$ss=null){
        $order_id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        
        $item_res = self::processItemPhotos($photos);
        if ($item_res->status ==='Error') return DV::error($item_res->error_message);
        $success_photos = $item_res->success_items;
        $qty = count($success_photos);
        if ($qty <=0) return DV::error('មិនឃើញមានរូបភាពកញ្ចប់ទំនិញ');
        //$order = self::getOrderDetails_one($order_id);
        $order = DB::table('order AS o')->join('sender as s','s.id','=','o.sender_id')->where('o.id',$order_id)->selectRaw('o.id,s.name AS sender_name,o.code,o.status_id,o.sender_id,o.loc_lat,o.loc_lng')->take(1)->first();
        if(!$order) return DV::error('Order ID does not exist');
        if($order->status_id >=3) return DV::error('Order is already picked');
        $c =null;
        $i =0;
        $success_count = 0;  
        do{
            if (!isset($success_photos[$i])) break;
            $c =$success_photos[$i];
            $img_res = PublicStorage::saveImage($branch_id,self::$package_photo_dir,null,$c['image'],null,null);
            if($img_res->status =='OK'){
                $image_id = saveData($ss,'order_images',['id'=>null],['order_id'=>$order_id,'file_name'=>$img_res->file_name,'file_type'=>$img_res->extension],[],1,false);
                $success_count++;
            }
            $i++;
        }while($c);
        
        /** Make sure the getOrderDetails_one() returns one row, but this row bust be exactly the same as those rows returned by getList() or getPickupList() */
        $picked_status_id =3;
        if ($i > 0) DB::table('order')->where('id',$order->id)->update(['status_id'=>$picked_status_id,'qty'=>$success_count,'actual_pkg_count'=>$success_count]);
        $img_count = DB::table('order_images as img')->where('img.order_id',$order_id)->where('img.inactive',0)->count('img.id');
        $data = (object)[
            'branch_id'=>$branch_id,
            'order_id'=>$order_id,
            'user_id'=>$ss->user_id,
            'title'=>'Photo Picked',
            'img_count'=>$img_count,
            'message'=>$order->code. ': អ្នកដឹក '.$ss->full_name.' បានផ្ញើររូបថត '.$success_count.' កញ្ចប់ពីអ្នកលក់ '.$order->sender_name.' នៅម៉ោង '.date('d M Y h:i')
        ];
        Notifier::notify_admin('package_photo_picked',$data);
        return DV::depends(1,['order'=>$order]);
    }

    //Pick Order's pacakges. If array "packages" is empty then status =3 ("Picked"), if there are array "packages" then status_id =4 "Pick and booked", but not yet arrived Warehouse  
    function pickOrderPackages($arr =[], $id = null, $ss= null){
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $order_id = $id ?? $this->id;
        $d = (object)$arr;
        $order_id = $order_id ?? (isset($d->order_id)?$d->order_id:0);
        $driver_id = isset($d->driver_id)? Sanitizer::sanitize($d->driver_id):null;

        //$pacakges = isset($d->packages)? $d->packages:[];
        $pickup_method = 'None'; //No driver picks up 
        $status_id = 3; //Picked without details
        $result = (object)array('status'=>'OK','error_message'=>null);
        
        $orderInfo = DB::table('order AS o')->where('o.branch_id',$branch_id)->where('o.id',$order_id)->selectRaw('o.id,o.id AS order_id, o.code AS order_code,sender_id,driver_id,status_id,completed, (SELECT `dr`.`name` FROM `driver` AS `dr` WHERE `dr`.id = o.id LIMIT 1) AS driver_name')->take(1)->first();
        if (!$orderInfo) return DV::error('Order identity '.$order_id.' is not valid');   
        if ($orderInfo->status_id >=5 || $orderInfo->completed ==1) return DV::error('This delivery order is already arrived at Warehouse');
        $pacakge_count = DB::table('order_receivers as r')->where('r.order_id',$orderInfo->order_id)->where('branch_id',$branch_id)->count('r.id');
        if ($pacakge_count > 0) $status_id = 4; /** Picked with details of packages */
        //If no driver is supplied => use driver_id already set in table "order"
        if(empty($driver_id) || $driver_id <=0) {
            $driver_id = $orderInfo->driver_id;
        }
        if ($driver_id >0)  $pickup_method ='Driver';
        DB::table('order')->where('branch_id',$branch_id)->where('id',$order_id)->update([
            'status_id'=>$status_id,
            'completed'=>0,
            'driver_id'=>$driver_id,
            'pickup_method'=>$pickup_method
        ]);
        DB::table('order_receivers')->where('branch_id',$branch_id)->where('order_id',$order_id)->update([
            'status_id'=>$status_id,
            'driver_id'=>$driver_id
        ]);
        DB::table('package')->where('branch_id',$branch_id)->where('order_id',$order_id)->delete();
        $status = DB::table('package_statuses AS ps')->where('id',$status_id)->selectRaw('ps.name AS status')->take(1)->value('name');
        $data = (object)array('status_id'=>$status_id,'status'=>$status,'driver_id'=>$driver_id,'completed'=>0); 
        $result = DV::success(['data'=>$data]);
        
       //Notify to other admin on other browsers
            $message = "Order numbered ".$orderInfo->order_code." is picked by Admin";
            $event_data = (object)['branch_id'=>$branch_id,'order_id'=>$order_id,'order_code'=>$orderInfo->order_code,'sender_id'=>$ss->user_id,'status'=>$status,'status_id'=>$status_id,'completed'=>$orderInfo->completed,'driver_id'=>$driver_id,'driver_name'=>$orderInfo->driver_name,'message'=>$message];
            Notifier::notify_admin('order_status_changed',$event_data);   
        //Notify to other admin on other browsers
            $orderInfo->event_name ='order_picked';
            $cdata =[
                [
                    'user_class'=>'merchant',
                    'target_user_id'=>$orderInfo->sender_id,
                    'title'=>'Order Picked',
                    'message'=>'Order លេខ '.$orderInfo->order_code.' បានយកចេញទៅហើយ!',
                    'persist'=>1,
                    'data'=>$orderInfo
                ],
                [
                    'user_class'=>'driver',
                    'target_user_id'=>$orderInfo->driver_id,
                    'title'=>'Pickup',   //'Order Picked',
                    'message'=>'អ្នកទទួលទំនិញ​ order '.$orderInfo->order_code.' (action by Admin)', //"Order លេខ ".$orderInfo->order_code." បានយកចេញទៅហើយ!",
                    'persist'=>1,
                    'data'=>$orderInfo
                ],
            ];
         $res = Notifier::notify_mobile($branch_id,$cdata);    
        //begin::notify Driver and Merchant
           
        //end::notify Driver and Merchant
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
        //if (isset($d->delivery_condition)) $d->delivery_condition ='Normal';
        if (!isset($d->delivery_type)) $d->delivery_type ='Normal';
        if(!isset($d->pickup_notes)) $d->pickup_notes = 'No pickup';
        if(!isset($d->order_canceled)) $d->order_canceled =0;
        if (!isset($d->request_vehicle_type)) $d->request_vehicle_type ='Motobike';
        if (!isset($d->sender_type_id)) $d->sender_type_id = null;
        if (!isset($d->driver_id)) $d->driver_id = null;
        $d->request_date = convertDate($d->request_date);
        if (!(bool)strtotime($d->request_date)) $d->request_date = getNowTime();
   
        if (empty($d->sender_type_id)) {
            $result->error_message ="Failed to create default order request because the Sender Type was invalid. Make sure the sender has valid identity and the sender has valid sender type";
            return $result;
        }

        DB::table('order')->insert((array)$d);
        $new_order_id = DB::getPdo()->lastInsertId();
        $d->id = $new_order_id;
        if ($new_order_id > 0)  
           {
             $d->code = $this->getTrackingNumber($uss,$new_order_id);
             DB::table('order')->where('branch_id',$branch_id)->where('id',$new_order_id)->update(['code'=>$d->code]);
             $result->status ='OK';
             $result->order = $d;
           }
  
        else $result->error_message ="Failed to create default order request due to some unexpected problem";   
        return $result;
    }

    function getTaxByProductType($product_type=null){
       return 0;
    }

    static function packageExists($branch_id,$barcode){ 
      $id = DB::table('package as p')->where('p.branch_id',$branch_id)->where('qr_code',$barcode)->take(1)->vale('id');
      return $id>0?true:false; 
    }
 
    //return COUNTING data for `orders` status_id <=4 (lower than "Picked and Booked") 
    //Higher than "Picked and Booked" => use packageModel->getPackageCounts_summary()
    //getPackageCountsByMerchant()|getOrderSummaryCounts
    function getPackageCounts_order($sender_id=null,$ss=null){
         //need permission to do this task
        $branch_id = $ss->branch_id;

        $cache_key = 'ordersummarycounts_'.$branch_id.$sender_id;
        $cache_data = Cache::get($cache_key);
        if($cache_data) return $cache_data;

        //Assuming that $ss->user_class ='merchant' 
        //$status_id <=4, higher status => use packageModel->getPackageCounts_summary()  
        $data = (object)['available_count'=>0,'accepted_count'=>0,'picked_count'=>0];
        
        $last_10_days = date('Y-m-d');
        //Status_id <=4  => query from table "order" by summing up the "qty"
        $query = DB::table('order AS o')->join('package_statuses AS ps','ps.id','=','o.status_id')->selectRaw('SUM(IFNULL(o.qty,0)) AS cnt,o.status_id, ps.name AS `status`')->where('o.branch_id',$branch_id)->where('o.sender_id',$sender_id)->groupByRaw('o.status_id,ps.name'); 
       
        // $rows = DB::select(DB::raw("SELECT SUM(IFNULL(o.qty,0)) AS cnt,o.status_id, ps.name AS `status` from `order` AS `o`
        // INNER JOIN package_statuses AS ps ON ps.id = o.status_id
        // WHERE o.branch_id =$branch_id AND o.sender_id =$sender_id AND DATE(o.create_date) >= '$last_10_days' AND o.status_id > 0 AND o.status_id <=4')
        // GROUP BY o.status_id,ps.name"));
        
        $rows = $query->whereRaw('DATE(o.create_date) = \''.$last_10_days.'\'')->whereRaw('o.status_id IN (1,2,3,4)')->get();
        $picked_count =0;
        foreach($rows as $row){
            if($row->status_id ==1) 
              $data->available_count = $row->cnt;
            else if ($row->status_id ==2)
               $data->accepted_count = $row->cnt; 
            else if (in_array($row->status_id,[3,4])){
               $picked_count += $row->cnt;
            }
        } 
        $data->picked_count = $picked_count;
        Cache::put($cache_key,$data,10);
        return $data;
    }
   
    function createQuickOrder($arr,$ss=null){
        $ss =$ss?$ss:$this->userInfo;
        $v_rule = [
        'warehouse_id'=>'1|number|exists=warehouses.id',    
        'sender_id'=>'1|number|exists=sender.id|Merchant or sender identity is not correct',
        'product_type'=>'1|string|0-150',
        'request_vehicle_type'=>'1|string|1-100',
        'pickup_address'=>'0|string|800',
        'qty'=>'1|number|0-1000|text=Number of packages should be within reasonable amount|default=0',
        'status_id'=>'1|number|default=1',
        'detail_type'=>'0|choice|images|items|default=items'
      ];
      $address_map_chars = ['/', ':', ',', '!', '@', '?', '=', '&', '[', ']', '(', ')', '!', '.', '/', ':', '?', '=', '&', '#', '[', ']', '@', '!', '$', "'", '(', ')', '*', '+', ',', ';', '%'];
      $res = validateObject($arr,$v_rule,true,['pickup_address'=>$address_map_chars],$ss->lang,false,null);
      if($res->error) return DV::error($res->error);
      $inputs = $res->values;
      $inputs['request_date'] = getNowTime();
      $loc = self::getLocation($inputs['pickup_address']);
      if($loc){
        $inputs['loc_lat'] = $loc->lattitude;
        $inputs['loc_lng'] = $loc->longitude;
      }else{
        $inputs['loc_lat'] = null;
        $inputs['loc_lng'] = null;
      }
      $order_id = saveData($ss,'order',['id'=>null],$inputs,[],1,false);
      if($order_id){
        $order_code = $this->getTrackingNumber($ss,$order_id);
        DB::table('order')->where('id',$order_id)->update(['code'=>$order_code]);
      }
      return DV::depends($order_id,['order_id'=>$order_id],'Failed to create quick order');
    } 
 
    static function getWarehouseIdByDriver_default($driver_id){
       return DB::table('driver_warehouses as dw')->join('warehouses as w','w.id','=','dw.warehouse_id')->where('driver_id',$driver_id)->where('is_default',1)->take(1)->selectRaw('driver_id,warehouse_id,is_default')->first();
    }
    static function getDriverInfo($driver_id){
        return DV::table('driver as d')->where('id',$driver_id)->selectRaw('d.id,d.name,d.code,d.status_code')->take(1)->first();
    }

    static function getExchangeRate($ss,$sender_code_or_id, $findBy){
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


    /** When user Click on Arrive button | ReceiveOrderPackages | arrive at warehouse */
    function receivePackages($arr = [],$id = null, $ss =null){
        $ss = $ss?$ss:$this->userInfo;
        $id = $id?$id:$this->id;
        $branch_id = $ss->branch_id;
        $d = (object)$arr;
        $driver_id = null;
        $sender_id = null;
        $driver = null; /* NOTE: This is pickup driver*/  
        $order = DB::table('order as o')->where('id',$id)->selectRaw('o.id,o.sender_id,o.product_type,o.delivery_type,o.driver_id,o.status_id,o.warehouse_id')->first();
        if(!$order){
            //if @allow_create_order ==1 => order or pickup request is automatically created, if @order_id = 0 or empty.
            $allow_create_order = isset($d->allow_create_order)?$d->allow_create_order:0;
            if(!$allow_create_order) return DV::error('The order identity does not exist');
            
            $warehouse_id = isset($d->warehouse_id)? Sanitizer::sanitize($d->warehouse_id):null;
            $sender_id = isset($d->sender_id)? $d->sender_id:null;
            $driver_id = isset($d->driver_id)?$d->driver_id:null;

            $driver = null; 
            if ($driver_id> 0){
                $driver = self::getDriverInfo($driver_id);
                if(!$driver) return DV::error('Driver identity does not exist');
                if(strtolower($driver->status_code) !== 'active') return DV::error('Driver is not currently active');

                $warehouse= self::getWarehouseIdByDriver_default($driver_id);
                if($warehouse->id != $warehouse_id) return DV::error('Warehouse identity is not valid or the driver is not registered for delivery job at the warehouse');
                if (!$warehouse_id || $warehouse_id <=0) return DV::error('Warehouse identity is not valid');
            }
           
            $sender = self::getSenderInfoById($ss,$sender_id);
            if(!$sender) return DV::error('Sender or merchant identity is not valid');
            if(strtolower($sender->status_code) !== 'active') return DV::error('Sender or merchant is not currently active');
         
            $pickup_date = getNowTime();
            $delivery_date = date('Y-m-d');
            $m = (object)['warehouse_id'=>$warehouse_id,'sender_id'=>$sender_id,'sender_type_id'=>$sender->sender_type_id,'pickup_time'=>$pickup_date,'request_date'=>$delivery_date];
            $mResult = $this->createOrder_default($ss,$m);
            //Error in creating default order request 
            if ($mResult->error_message) {
              return DV::error($mResult->error_message);
            } else $order = $mResult->order;         
        }
        $sender_id = $sender_id ?? $order->sender_id;
        if(!$sender_id){
            Log::error('PickupRequest->receivePackages(): The $sender_id is unexpected empty or NULL so it was not possible to check if the merchant has Sales_agent_id or not');
            return DV::error('Merchant ID is unexpectedly missing or empty. This issue is now informed to technical team for resolving');
        } 
        $sales_agent_id = self::getSalesAgentId($sender_id);
        if(!$driver_id) $driver_id = $order->driver_id;
        $cols = 'zone_name,sender_name,r.branch_id,r.qr_code,r.sender_id,receiver_phone,receiver_address,cod,forwarding_cost,delivery_type,zone_code,df_payer,price,dim_x,dim_y,dim_h,billed_kg,actual_kg,cod_fee,delivery_notes,tax_percent,tax_amount';
        $packages = DB::table('order_receivers as r')->where('r.order_id',$order->id)->selectRaw($cols)->get();
        if(!isset($packages[0])) return DV::error("មិនឃើញមានកញ្ចប់ទំនិញដែលត្រូវទទួល");  
       
        $last_new_barcode =null; // this barcode is passed back to client caller, and it is used to refresh display on Client browser in case that only one package is verified or received by clicking on the small "Print Barcode" button, Not by clickin on OK button
        $errors = [];
        $success_count =0; 
        $i = 0;
        $c = null;  
        $p_res = self::validatePackages($ss,$order,$packages);
        if($p_res->status ==='Error') return DV::error($p_res->error_message);
        $items = $p_res->success_items;
        do {
           if (!isset($items[$i])) break;
              $c = $items[$i];
              $c->driver_id = null;
              $c->pickup_driver_id = $driver_id;
              $c->order_id = $order->id;
              $c->status_id = 5;
              /** IMPORTANT: to set "outstanding" =1 for the item to appear in Pacakge Trail */
              $c->outstanding =1;
              $c->arrival_time = getNowTime();
              $last_new_barcode = $c->qr_code;
              $id = saveData($ss,'package',['id'=>null],(array)($c),[],1,false);
              if ($id){
                $success_count++;
                if ($sales_agent_id) self::createSalesCommissionItem($ss,$id,$sales_agent_id,$sender_id);
              }
           $i++;                
        } while($c); 
        
        if ($success_count <=0) 
           return DV::error(isset($errors[0])?$errors[0]:'0 packages received at warehouse. Some problem occured during receiving packages'); 
        else {
             //update number of package in table "order.qty"
            DB::update(DB::raw("UPDATE `order` SET completed =1, status_id =5, qty = (SELECT COUNT(p.id) FROM package AS p WHERE p.branch_id = `order`.branch_id AND p.order_id =`order`.`id`) WHERE id ='".$order->id."' AND branch_id ='".$branch_id."'"));
            return DV::depends(1,[
                'order_id'=>$order->id,
                //'errors'=>$errors,
                //'error_count'=>count($errors),
                'success_count'=>$success_count,
                'last_new_barcode'=>$last_new_barcode
             ]);
        }
    }
    
    static function getSalesAgentId($sender_id){ 
       return DB::table('sender as s')->where('s.id',$sender_id)->take(1)->value('sales_agent_id');
    }

    static function getAgentCommission($sales_agent_id){
       $amount = DB::table('sales_agents')->where('id',$sales_agent_id)->take(1)->value('commission');
       return $amount ?? 0;  
    }
    static function createSalesCommissionItem($ss,$package_id,$sales_agent_id,$sender_id){
        //if ($sales_agent_id){
            $nowTime = getNowTime();
            $inputs = [
                'package_id'=>$package_id,
                'branch_id'=>$ss->branch_id,
                'sales_agent_id'=>$sales_agent_id,
                'sender_id'=>$sender_id,
                'comm_amount'=>self::getAgentCommission($sales_agent_id),
                'comm_pmt_status_id'=>1, /** 0=Pending, 1 = verified and Unpaid 2= Paid */
                'create_user'=>$ss->full_name,
                'create_uid'=>$ss->user_id,
                'update_user'=>$ss->full_name,
                'update_uid'=>$ss->user_id,
                'update_date'=>$nowTime,
                'create_date'=>$nowTime
            ];
            $row = DB::table('package_sales_commissions')->where('package_id',$package_id)->selectRaw('comm_pmt_status_id')->first();
            if ($row) 
              DB::table('package_sales_commissions')->where('package_id',$package_id)->update($inputs);
            else DB::table('package_sales_commissions')->insert($inputs); 
        //}
        return DV::depends(1);
    }

    function getFormOptions($ss){
        return (object)[
          'warehouses'=>GeneralSettings::options_warehouse($ss),
          'senders'=>GeneralSettings::options_sender($ss),
          'zones'=>GeneralSettings::options_zone($ss),
          'vehicle_types'=>GeneralSettings::options_vehicle_type($ss),
          'product_types'=>GeneralSettings::options_product_type($ss)
        ];
    }
}
