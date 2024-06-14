<?php

namespace App\Models\Abm;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use App\Models\DV;
use App\Models\JDV;
use App\Models\UM;
use Sanitizer;
use DB;
  
/** delivery price model PriceModel **/
class SupplierPrice //extends Model
{
    //use HasFactory;
    protected $id = null;
    protected $userInfo = null;
    function __construct($id= null,$userInfo=null){
       $this->id = $id;
       $this->userInfo = $userInfo;
    }
    function getId(){
        return $this->id;
    }
    function getUserInfo(){
        return $this->userInfo;
    }

    function deleteBaseFee($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        //need permission to do this task
        $branch_id = Sanitizer::sanitize($ss->branch_id);
        $sender_id = isset($d->sender_id)?Sanitizer::sanitize($d->sender_id):null;
        $id =isset($d->id)?Sanitizer::sanitize($d->id):0;
        DB::table('sender_base_price')->where('id',$id)->where('branch_id',$branch_id)->delete();
        return null;
    }

    static function price_list_name_exists($name,$id=null){
        $str_id ="1=1";
        if($id>0) $str_id ="id <> $id";
        $rows = DB::table('os_supplier_price_list_names')->where('name',$name)->whereRaw($str_id)->select("id")->take(1)->get();
        return isset($rows[0]);
    }

    function renamePriceList($new_name,$id=null,$ss=null){
       $id = $id?$id:$this->id;
       $ss =$ss?$ss:$this->userInfo;
       $branch_id =$ss->branch_id;
       if(self::price_list_name_exists($new_name,$id)) return DV::error("Price list name $new_name already exists");

       DB::table('os_supplier_price_list_names')->where('id',$id)->where('branch_id',$branch_id)->update(['name'=>$new_name]);
       return DV::success();
    }

    function saveBaseFee($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        //need permission to do this task
        $branch_id = Sanitizer::sanitize($ss->branch_id);
        $sender_id = isset($d->sender_id)?Sanitizer::sanitize($d->sender_id):null;
        $base_fee = isset($d->base_fee)?Sanitizer::sanitize($d->base_fee):0;

        $delivery_type = isset($d->delivery_type)?Sanitizer::sanitize($d->delivery_type):'all';
        $zone_code = isset($d->zone_code)?Sanitizer::sanitize($d->zone_code):'all';
        $id =isset($d->id)?Sanitizer::sanitize($d->id):0;
        if (empty($sender_id)) return "Merchant or vendor identity is not valid";

        $start_date = isset($d->start_date)? convertDate($d->start_date):null;
        $end_date = isset($d->end_date)? convertDate($d->end_date):null;
        if (!(bool)strtotime($start_date)) $start_date = date('Y-m-d');
        
        $never_expires = isset($d->never_expires)?Sanitizer::sanitize($d->never_expires):1;
        if ($never_expires !=1 && $never_expires!=0) return "Never Expire";
        if ($never_expires == 0) {
            if (!(bool)strtotime($end_date)) return "End Date or Expiration Date is not valid";
            if ($start_date >$end_date) return "Start Date must be earlier than End Date";
        }    
        if ($id>0)
            {
                DB::table('sender_base_price')->where('branch_id',$branch_id)->where('id',$id)->update(array(
                    'sender_id'=>$sender_id,
                    'delivery_type'=>$delivery_type,
                    'zone_code'=>$zone_code, 
                    'price'=>$base_fee, 
                    'start_date'=>$start_date,
                    'never_expires'=>$never_expires,
                    'end_date'=>$end_date,
                    'create_user'=>$ss->login_name,
                    'create_date'=>getNowTime(),
                    'update_user'=>$ss->login_name,
                    'update_date'=>getNowTime()
                ));
            }else{
                DB::table('sender_base_price')->insert(array(
                    'branch_id'=>$branch_id,
                    'sender_id'=>$sender_id,
                    'delivery_type'=>$delivery_type,
                    'zone_code'=>$zone_code, 
                    'price'=>$base_fee,
                    'start_date'=>$start_date,
                    'never_expires'=>$never_expires,
                    'end_date'=>$end_date,
                    'create_user'=>$ss->login_name,
                    'create_date'=>getNowTime(),
                    'update_user'=>$ss->login_name,
                    'update_date'=>getNowTime()
                ));
            }

            return null;
    }

    //set Price_list_id for a merchant
    function setMerchantPriceList($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        //need permission to do this task
        $branch_id = Sanitizer::sanitize($ss->branch_id);
        $sender_id = isset($d->sender_id)?$d->sender_id:null;
        $price_list_id = isset($d->price_list_id)?$d->price_list_id:null;
        
        $list_exists = DB::table('os_supplier_price_list_names')->where('id',$price_list_id)->exists();
        if(!$list_exists){
            return "Price List $price_list_id does not exist";
        }

        DB::table('sender')->where('id',$sender_id)->update(array(
        'price_list_id'=>$price_list_id));
        return null;
    }

    //getSenderBaseFees() returns list of base fees or fixed price for all zones for each sender or vendor
    function getSenderBaseFees($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        //need permission to do this task
        $branch_id = Sanitizer::sanitize($ss->branch_id);
        $orderBy ="b.create_date DESC";
        $rows = DB::table('sender_base_price AS b')->join('sender AS s','s.id','=','b.sender_id')->where('b.branch_id',$branch_id)->orderByRaw($orderBy)->selectRaw("b.id,b.sender_id,s.name AS sender_name, s.code AS sender_code, IFNULL(b.price,0) AS base_fee,DATE_FORMAT(b.start_date,'%d %b %Y') AS start_date, DATE_FORMAT(b.end_date,'%d %b %Y') AS end_date, b.never_expires")->get();
        return $rows;
    }

    //param $d {'charge_option','cod_fee_percent','cod_fee','sender_id':null,'never_expires','start_date','end_date'}
    function saveCODFeeCharge($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        //need permission to do this task
        $branch_id = Sanitizer::sanitize($ss->branch_id);
        $sender_id = isset($d->sender_id)?Sanitizer::sanitize($d->sender_id):null;
        $cod_fee_percent = isset($d->cod_fee_percent)?Sanitizer::sanitize($d->cod_fee_percent):0;
        $start_date = isset($d->start_date)? convertDate($d->start_date):null;
        $end_date = isset($d->end_date)? convertDate($d->end_date):null;
        $never_expires =isset( $d->never_expires)? Sanitizer::sanitize($d->never_expires):1;

        $cod_fee = isset($d->cod_fee)?Sanitizer::sanitize($d->cod_fee):0;
        $charge_option = isset($d->charge_option)?strtolower(Sanitizer::sanitize($d->charge_option)):null;
        if (!(bool)strtotime($start_date)) $start_date = date('Y-m-d');
        if ($never_expires !=1 && $never_expires != 0) $never_expires =1;

        if ($charge_option !='percentage' && $charge_option !='fixed') {
            return "Charge Option must be `percentage` or `fixed`";
        }
        if ($charge_option !='percentage') {
            return "allowed Charge Option is only by `percentage`";
        } 

        if ($sender_id > 0) 
        {
            DB::table('sender_cod_charges')->where('sender_id',$sender_id)->where('branch_id',$branch_id)->delete(); 
            DB::table('sender_cod_charges')->insert(array('branch_id'=>$branch_id,'sender_id'=>$sender_id,'cod_fee_percent'=>$cod_fee_percent,'never_expires'=>$never_expires,'start_date'=>$start_date,'end_date'=>$end_date,'create_user'=>$ss->login_name,'create_date'=>getNowTime())); 
        } else{
            //if COD FEE PERCENT apply to all senders in general => there is no expiry date. Save it in table "settings_number" with key ="COD_FEE_PERCENT"
            save_setting($ss,'number','COD_FEE_PERCENT',$cod_fee_percent);
        }
        return null;  
    }

    //return one value "$cod_fee_percent"
    //param $d = {'sender_id':null} //optional @sender_id
    function getCODFeeCharge($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        //need permission to do this task
        $branch_id = Sanitizer::sanitize($ss->branch_id);
        $sender_id = isset($d->sender_id)?Sanitizer::sanitize($d->sender_id):null;
        
        $cod_fee_percent =0;

        if ($sender_id > 0) {
            $str_valid = null;
            $today = date('Y-m-d');
            $str_valid = " AND (IFNULL(c.never_expires,0) =1 OR (DATE(c.end_date) >='".$today."'))"; 
            $more_wheres = "1=1 ".$str_valid;
            $rows =DB::table('sender_cod_charges AS c')->where('branch_id',$branch_id)->where('sender_id',$sender_id)->whereRaw($more_wheres)->selectRaw('c.cod_fee_percent')->limit(1)->get(); 
            foreach($rows as $row) $cod_fee_percent = $row->cod_fee_percent; 
            //$cod_fee_percent =0;
        } else {
            $cod_fee_percent = get_settings_value($ss,'COD_FEE_PERCENT','number');
        }
        return $cod_fee_percent;
    }

    function format_zone_codes($zone_codes){
        return "|".$zone_codes."|";
    }
    function format_sender_ids($ids){
        return "|".$ids."|";
    }

    //$d = $sender_id, $delivery_type, $zone_code, $base_fee, $delivery_fee, $price_per_kg,$never_exires =1, $start_kg =0, $end_kg =0,$start_date = null, $end_date =null
    //savePriceLine()
    function savePriceLine($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        //need permission to do this task

        $result = (object)array('status'=>'OK','error_message'=>null,'data'=>null); //prop "data" is price info or newly added record
        // $price_ops = ['per_kg','fixed'];

        $branch_id = $ss->branch_id;
        $price_list_id = isset($d->price_list_id)?Sanitizer::sanitize($d->price_list_id):null; // if not @sender_id specified => it must be NULL here, not zero
        $item_type = isset($d->item_type)?Sanitizer::sanitize($d->item_type):'none-doc';
        //$zone_code = isset($d->zone_code)?Sanitizer::sanitize($d->zone_code):'all'; //if not zone_code specified => the price is applied to all zones
        $zone_codes = isset($d->zone_codes)?Sanitizer::sanitize($d->zone_codes):null;
        // $sender_ids = isset($d->sender_ids)?Sanitizer::sanitize($d->sender_ids):'all';
        // $base_fee = isset($d->base_fee)?Sanitizer::sanitize($d->base_fee):0;
        // $price_option = isset($d->price_option)?Sanitizer::sanitize($d->price_option):null;
        // $delivery_fee = isset($d->delivery_fee)?Sanitizer::sanitize($d->delivery_fee):0;
        $price_per_kg = isset($d->price_per_kg)?Sanitizer::sanitize($d->price_per_kg):0;
        // $never_exires =isset($d->never_expires)?Sanitizer::sanitize($d->never_expires):1;
        // $start_kg = isset($d->start_kg)? Sanitizer::sanitize($d->start_kg):0;
        // $end_kg =isset($d->end_kg)?Sanitizer::sanitize($d->end_kg):0;
        // $start_date =isset($d->start_date)?$d->start_date:null;
        // $end_date = isset($d->end_date)?$d->end_date:null;
        $id = isset($d->id)?Sanitizer::sanitize($d->id):0;

        // $start_date = convertDate($start_date);
        // $end_date = convertDate($end_date);
        // $sender_id =0;

        // if ($start_kg <0) $start_kg =-1;
        // if ($end_kg <0) $end_kg =-1;
        
        // if ($start_kg <0 && $end_kg <0) {
        //     $start_kg =0;
        //     $end_kg =0;
        // }

        $zone_codes = $this->format_zone_codes($zone_codes);
        $price_list_id = $this->format_sender_ids($price_list_id);
        if (!(bool)strtotime($d->start_date)) $start_date = date('Y-m-d'); 
        //if (!(bool)strtotime($d->end_date)) $end_date = date('Y-m-d');
        $table ='os_supplier_price_list_details';
        //if ($sender_id >0) $table ='sender_price_list'; //This is reason why table "price_list" has sender_id column that is always empty
        //NOTE that start_kg = -1; is open ended on LOWER BOUND. and $end_kg =-1 is open_ended on UPPER BOUND
        // if ($start_kg ==0 && $end_kg ==0) {
        //     $start_kg =-1;
        //     $end_kg = 0;
        // }

        /** allow zone_code ="all" for all is considered as a special zone by itself **/
        // if (empty($zone_code) || strtolower($zone_code) =='all'){
        //     $result->status ='Error';
        //     $result->error_message ="Zone code is not valid";
        //     return $result;
        // }
        if (empty($zone_codes)) $zone_codes ='all';  
        // if (empty($sender_ids)) $sender_ids ='all';
        //validate price_option
        // $price_option = strtolower($price_option); 
        // if (!in_array($price_option,$price_ops)){
        //     $result->status ='Error';
        //     $result->error_message ='Price option is not valid. Price option must be `per_kg` or `fixed`';
        //     return $result;
        // }

        // if ($this->kg_range_exists($ss,$id,$sender_id,$start_kg,$end_kg)) {
        //     $result->status ='Error';
        //     $result->error_message ='kg weight range already exists';
        //     return $result;
        // }
        
        $data = null;

        if ($id>0) {
            $input_array =array(
                'item_type'=>$item_type, //**// 
                'zone_codes'=>$zone_codes,//**// "all" is also a zone_code. it is used for price that applied to all zones
                'price_list_id'=>$price_list_id,
                // 'start_kg'=>$start_kg,
                // 'end_kg'=>$end_kg,
                // 'base_price'=>$base_fee, //base price or minimum price by zone, [and by sender]
                // 'price'=>$delivery_fee, // fixed price, regardless of kg
                'price_per_kg'=>$price_per_kg, //price per kg.
                // 'never_expires'=>$never_exires,
                // 'start_date'=>$start_date,
                // 'end_date'=>$end_date,
                // 'price_option'=>$price_option,
                'create_user'=>$ss->login_name,
                'create_date'=>getNowTime()
            );

           DB::table($table)->where('branch_id',$branch_id)->where('id',$id)->update($input_array);
           $data =(object)$input_array;
           $data->branch_id = $branch_id;
           $data->price_list_detail = $id;
           $data->id =$id; 
        } else {
            $input_array = array(
                'branch_id'=>$branch_id, //**//
                'sender_id'=>$id,
                'item_type'=>$item_type, //**// 
                // 'delivery_type'=>$delivery_type, //**// 
                'zone_codes'=>$zone_codes,//**//
                // 'sender_ids'=>$sender_ids,
                // 'start_kg'=>$start_kg,
                // 'end_kg'=>$end_kg,
                // 'base_price'=>$base_fee, //base price or minimum price, and [by sender]
                // 'price'=>$delivery_fee, // fixed price, regardless of kg
                'price_per_kg'=>$price_per_kg, //price per kg.
                // 'never_expires'=>$never_exires,
                // 'start_date'=>$start_date,
                // 'end_date'=>$end_date,
                // 'price_option'=>$price_option,
                'create_user'=>$ss->login_name,
                'create_date'=>getNowTime()); 
    
            DB::table($table)->insert($input_array);
            $new_id = DB::getPdo()->LastInsertId(); 
            $data = (object)$input_array;
            $data->sender_id = $id;
            $data->id = $new_id;   
        }
        
        $result->status ='OK';
        $result->data= $data;
        return $result;  
    }
    
    function getApplicableZones($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        //need permission to do this task
        $branch_id = $ss->branch_id;
        $price_id = isset($d->price_id)?$d->price_id:null;
        $rows = DB::table('price_list AS l')->where('branch_id',$branch_id)->where('id',$price_id)->selectRaw('l.id,l.zone_codes')->limit(1)->get();
        $zone_codes = null;
        foreach($rows AS $row) $zone_codes = $row->zone_codes;   
        if(!$zone_codes) return [];
        $zone_codes = Sanitizer::sanitize($zone_codes);
        $values = "'".str_replace('|','\',\'',$zone_codes)."'";
        $more_wheres = "z.zone_code IN (".$values.")";
        $rows = DB::table('zones as z')->join('loc_districts AS d','d.id','=','z.district_id')->join('loc_cities AS c','c.id','=','z.city_id')->where('z.branch_id',$branch_id)->whereRaw($more_wheres)->selectRaw("z.zone_code,z.zone_name,c.name AS city, d.name AS district")->get();
        return $rows;
    }

    function getApplicableSenders($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        //need permission to do this task
        $branch_id = $ss->branch_id;
        $price_id = isset($d->price_id)?$d->price_id:null;
        $rows = DB::table('price_list AS l')->where('branch_id',$branch_id)->where('id',$price_id)->selectRaw('l.id,l.sender_ids')->limit(1)->get();
        $sender_ids = null;
        foreach($rows AS $row) $sender_ids = $row->sender_ids;   
        if(!$sender_ids) return [];
        $sender_ids = Sanitizer::sanitize($sender_ids);
        $values = "'".str_replace('|','\',\'',$sender_ids)."'";
        $more_wheres = "s.id IN (".$values.")";
        $rows = DB::table('sender as s')->where('s.branch_id',$branch_id)->whereRaw($more_wheres)->selectRaw("s.id,s.code,s.name,s.address, s.phone_number")->get();
        return $rows;
    }

    function kg_range_exists($uss,$sender_id=null,$start_kg=0, $end_kg=0){
        $branch_id = $uss->branch_id;
        $table ='price_list AS l';
        $str_sender =null;
        $str_kg =null;
        if(!is_numeric($sender_id)) $start_kg =null;
        if(!is_numeric($start_kg)) $start_kg =0;
        if (!is_numeric($end_kg)) $end_kg =0;
        if ($sender_id<=0) $sender_id = null;

        if ($sender_id>0) {
            $table ='sender_price_list AS l';
            $str_sender =" AND l.sender_id ='".$sender_id."' ";
        }
       
        if ($start_kg ==0 && $end_kg ==0) {
            $start_kg =-1;
            $end_kg =0;
        }
        $str_kg =" AND l.start_kg =".$start_kg." AND l.end_kg =".$end_kg;

        $more_wheres ="1=1".$str_sender.$str_kg;
        $rows = DB::table($table)->whereRaw($more_wheres)->where('l.branch_id',$branch_id)->selectRaw('l.price')->limit(1)->get();
        foreach($rows as $row) return true;
        return false;  
    }

    function deletePriceLine($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        //need permission to do this task
        $branch_id = $ss->branch_id;
        $id = isset($d->id)?$d->id:0;
        $sender_id = isset($d->sender_id)?$d->sender_id:null;
        $table = 'price_list';
        if($sender_id > 0) $table ='sender_price_list'; 
        DB::table($table)->where('id',$id)->delete();  
        return null;
    }

    function getPriceLineData($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        //need permission to do this task
        $branch_id = $ss->branch_id;
        $sender_id = isset($d->sender_id)? Sanitizer::sanitize($d->sender_id):null;
        $id = isset($d->id)?Sanitizer::sanitize($d->id):null;
        if ($sender_id <=0) $sender_id = null; 
        $str_sender = null;
        $table ='price_list AS l';
        // if($sender_id > 0) {
        //     $table ='sender_price_list AS l';
        //     $str_sender =" AND l.sender_id ='".$sender_id."' ";
        // }
        $more_wheres ="1=1".$str_sender;
        $rows = DB::table($table)->where('l.branch_id',$branch_id)->whereRaw($more_wheres)->where('l.id',$id)->limit(1)->selectRaw("l.id, l.delivery_type,l.zone_codes,l.sender_ids,l.start_kg, l.end_kg,LOWER(l.price_option) AS price_option,l.price AS delivery_fee, l.base_price as base_fee, l.price_per_kg, DATE_FORMAT(l.start_date,'%d %b %Y') AS start_date, DATE_FORMAT(l.end_date,'%d %b %Y') AS end_date, IFNULL(l.never_expires,0) AS never_expires")->get();
        foreach($rows as $row) return $row;
        return null;
    }

    function getCODFees($d) {
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        //need permission to do this task
        $branch_id = $ss->branch_id;
        $search_value = isset($d->search_value)?Sanitizer::sanitize($d->search_value):null;
        $delivery_type = isset($d->delivery_type)?Sanitizer::sanitize($d->delivery_type):'Normal';
        $sender_id = isset($d->sender_id)?$d->sender_id:null;
        if ($sender_id ==0) $sender_id = null;
        $str_search = null;
        $str_sender =null;

        if(!empty($search_value)) {
             if (strtolower($search_value) =='normal' || strtolower($search_value) =='fast') {
                $str_search = " AND c.delivery_type ='".$search_value."' ";
             } else {
                $str_search = " AND (s.phone_number ='".$search_value."' OR s.name LIKE '%".$search_value."%')";
             }
        }
        if (!empty($sender_id)) $str_sender =" AND c.sender_id ='".$sender_id."' ";

        $more_wheres = "1=1".$str_search.$str_sender;
        $rows = DB::table('sender_cod_charges AS c')->join('sender AS s','s.id','=','c.sender_id')->where('delivery_type',$delivery_type)->where('c.branch_id',$branch_id)->selectRaw("c.sender_id,c.id,s.code as sender_code, s.name AS sender_name,c.delivery_type,c.cod_fee_percent,c.never_expires, DATE_FORMAT(c.start_date,'%d %b %Y'),DATE_FORMAT(c.end_date,'%d %b %Y') AS end_date, c.remarks")->whereRaw($more_wheres)->orderByRaw("s.name ASC")->get(); 
        return $rows;
    }
   
   function deleteCODFee($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        //need permission to do this task
        $branch_id = $ss->branch_id;
        $id = isset($d->id)?Sanitizer::sanitize($d->id):null;
        DB::table('sender_cod_charges')->where('branch_id',$branch_id)->where('id',$id)->delete();
        return null;
   } 

   function saveCODFeeBySender($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        //need permission to do this task
        $branch_id = $ss->branch_id;
        $id = isset($d->id)?Sanitizer::sanitize($d->id):null;
        $cod_fee_percent = isset($d->cod_fee_percent)?Sanitizer::sanitize($d->cod_fee_percent):0;
        $remarks = isset($d->remarks)?Sanitizer::sanitize($d->remarks):null;
        $delivery_type = isset($d->delivery_type)?Sanitizer::sanitize($d->delivery_type):null;
        $start_date = isset($d->start_date)?convertDate($d->start_date):date('Y-m-d');
        $end_date = isset($d->end_date)?convertDate($d->end_date):date('Y-m-d');
        $never_exires = isset($d->necer_expires)?Sanitizer::sanitize($d->never_expires):1; //default to 1
        $sender_id = isset($d->sender_id)?Sanitizer::sanitize($d->sender_id):null;

        if ($id > 0) {
            DB::table('sender_cod_charges')->update(array(
             'cod_fee_percent'=>$cod_fee_percent,
             'remarks'=>$remarks,
             'delivery_type'=>$delivery_type,
             'start_date'=>$start_date,
             'never_expires'=>$never_exires,
             'end_date'=>$end_date,
             'create_user'=>$ss->login_name,
             'create_date'=>getNowTime(),
             'update_user'=>$ss->login_name,
             'update_date'=>getNowTime()
            ));
        }else {
            DB::table('sender_cod_charges')->insert(array(
                'branch_id'=>$branch_id,
                'sender_id'=>$sender_id,
                'cod_fee_percent'=>$cod_fee_percent,
                'delivery_type'=>$delivery_type,
                'remarks'=>$remarks,
                'start_date'=>$start_date,
                'never_expires'=>$never_exires,
                'end_date'=>$end_date,
                'create_user'=>$ss->login_name,
                'create_date'=>getNowTime(),
                'update_user'=>$ss->login_name,
                'update_date'=>getNowTime()
            ));
        }
   }

    function getPriceList($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        //need permission to do this task
        $branch_id = $ss->branch_id;
        $sender_id = isset($d->sender_id)?$d->sender_id:null;
        $delivery_type = isset($d->delivery_type)?$d->delivery_type:null;
        $zone_code = isset($d->zone_code)?Sanitizer::sanitize($d->zone_code):null;
        $search_value = isset($d->search_value)?$d->search_value:null;
        //if ($zone_code==0 || strtolower($zone_code)=='all') $zone_code = null;
        $str_sender = null;
        $table ='price_list AS l';
         
        $str_zone = null;
        if (strtolower($zone_code) != 'all') $str_zone =" AND (l.zone_codes LIKE '%|".$zone_code."|%')";
        if (!empty($sender_id)) $str_sender = " AND (l.sender_ids LIKE '%|".$sender_id."|%')";
        $str_delivery_type = " AND l.delivery_type ='".$delivery_type."' ";

        $more_wheres ="1=1 ".$str_delivery_type.$str_sender.$str_zone;
        $rows =[];
        $rows = DB::table($table)->where('l.branch_id',$branch_id)->whereRaw($more_wheres)->selectRaw("l.id,l.sender_ids,l.zone_codes,l.delivery_type AS delivery_type,l.start_kg, l.end_kg,l.base_price AS base_fee,l.price_per_kg,l.price AS delivery_fee,LOWER(l.price_option) AS price_option, DATE_FORMAT(l.start_date,'%d %b %Y') AS start_date,DATE_FORMAT(l.end_date,'%d %b %Y') AS end_date, l.never_expires")->get();
        return $rows;
    }

    //returns array of unique zone_codes
    function getUnique_country($rows){
        // $unique_zones = [];
        $unique_country = [];
        //  foreach($rows as $row){
        //     if(!in_array($row->country_id,$unique_zones) ){
        //         $unique_zones[] = $row->zone_code;
        //     }    
        //  }
         foreach($rows as $row){
            if(!in_array($row->country_id,$unique_country)){
                $unique_country[] = $row->country_id;
            }    
         }
         return $unique_country;
    }

    //returns data for a given price_list by price_list_id
    function getPriceList_data($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        //need permission to do this task
        $branch_id = $ss->branch_id;
        $price_list_id = isset($d->price_list_id)?$d->price_list_id:null;
        $zone_codes = isset($d->zone_codes)?$d->zone_codes:null;
        $country_id = isset($d->country_id)?$d->country_id:null;
       
        $str_zones = null;
        $str_country = null;
        //todo: later, we can set str_zones to be " AND WHERE Match(l.zone_codes) AGAINST('$zone_codes')"
        // if (!empty($zone_codes)) $str_zones =" l.zone_code LIKE '%|".$zone_codes."|%')";
        $str_zones = $zone_codes? 'l.zone_code =\''.$zone_codes.'\'' : '1=1';
        $str_country = $country_id? 'l.country_id =\''.$country_id.'\'' : '1=1';
        // return JDV::result($country_id);
        $rows =[];
        $kg_marker =0;
        $rows = DB::table('os_supplier_price_list_names')->where('branch_id',$branch_id)->where('id',$price_list_id)->selectRaw("id,kg_marker")->get();
        foreach($rows as $row) $kg_marker = $row->kg_marker;

        $str_kg_marker = null;
        // if ($kg_marker > 0) $str_kg_marker = "AND (l.start_kg =$kg_marker OR l.end_kg = $kg_marker)";
        // $more_wheres ="1=1 ".$str_zones;
    
        /** $rows query conditions are, for example => assuming x = price_list('A').kg_marker, then (start_kg =x OR end_kg =x) **/
          $rows = DB::table('os_supplier_price_list_details AS l')
          ->join('loc_countries AS c','c.id','=','l.country_id')
          ->where('l.branch_id',$branch_id)
          ->where('l.price_list_id',$price_list_id)
          ->whereRaw($str_zones)
          ->whereRaw($str_country)
          ->selectRaw("l.id,l.zone_code,l.country_id,c.name as country_name,l.price_list_id,l.item_type ,IFNULL(l.price_per_kg,0) AS price_per_kg")
          ->orderBy('l.id','DESC')->get();
        // return JDV::result($rows);

          $unique_country = $this->getUnique_country($rows);
        //$m = $this->getPriceListItems($zone_codes,$rows,$kg_marker =0);
            //$m->below->data->zone_codes;
            //$m->below->data->fast_items;
            //$m->below->data->normal_items;
 
            //$m->above->data->zone_codes;
            //$m->above->data->fast_items;
            //$m->above->data->normal_items;

        $m=null;
        $ret_rows = [];
        if($country_id==null) {
            foreach($unique_country as $country_id){
                $m = $this->getPriceListItems($country_id,$rows);
                $ret_rows[] = $m;  
            }   
            if($m==null) return DV::error('Customer price list don\'t have yet! Plese create price list befor add item.');
            // return JDV::result($country_id); 
            // $country_id
            return $ret_rows;
        }else{
            foreach($unique_country as $country_id){
                $m = $this->getPriceListItems($country_id,$rows);
            }   
            if($m==null) return DV::error('Customer price list don\'t have yet! Plese create price list befor add item.');
            // return JDV::result($country_id); 
            // $country_id
            return $m;
        }
        
    }
 
    function getPriceListItems($country_id,$rows){
        $i=0;
        $c=0;

        //  $below = (object)[];
        //  $above = (object)[];

         $data = (object)['doc_items'=>(object)[],'non_doc_items'=>(object)[]];
        //  $below_data = (object)['fast_items'=>(object)[],'normal_items'=>(object)[]];

         //$below_items_fast = [];
         //$below_items_normal = [];

         //$above_items_fast = [];
         //$above_items_normal = [];
         
        do{
           if(!isset($rows[$i])) break;
           $c = $rows[$i];

           $item_type = strtolower($c->item_type); 
              if($c->country_id == $country_id) {
                //    $above_data->zone_code = $zone_code;
                //    $below_data->zone_code = $zone_code;
                   
                   //It depends on price_option. If price_option ='fixed' => $price = $c->price,
                   //if price_option = 'per_kg' then $price = $c->price_per_kg
                   $price =0;
                //    if ($c->price_option =='fixed') 
                //     $price = $c->price;
                //    else 
                   $price = $c->price_per_kg;

                //    if($c->end_kg >0 && $c->end_kg == $kg_marker) //Case: Below X kg. Example "3 kg or below"
                //    {  
                      if ($item_type =='doc')  
                          $data->doc_items = (object)array('id'=>$c->id,'zone_code'=>$c->zone_code,'price_per_kg'=>$price,'price_list_id'=>$c->price_list_id,'country_name'=>$c->country_name,'country_id'=>$c->country_id,'item_type'=>$item_type);
                      else   
                          $data->non_doc_items = (object)array('id'=>$c->id,'zone_code'=>$c->zone_code,'price_per_kg'=>$price,'price_list_id'=>$c->price_list_id,'country_name'=>$c->country_name,'county_id'=>$c->country_id,'item_type'=>$item_type);
                //    }
                //    else if($c->start_kg > 0 && $c->start_kg == $kg_marker) //Case Above X kg. Example "Above 3 kg"
                //    {
                //     if ($delivery_type =='fast')  
                //        $above_data->fast_items = (object)array('id'=>$c->id,'base_fee'=>$c->base_fee,'delivery_fee'=>$price,'price_option'=>$c->price_option);
                //     else   
                //        $above_data->normal_items = (object)array('id'=>$c->id,'base_fee'=>$c->base_fee,'delivery_fee'=>$price,'price_option'=>$c->price_option);
                //     }
              } 

           $i++;
        }while($c);
        
        /***
          above
            ->data
                ->zone_codes
                ->fast_items: ['id'=>0,'base_fee'=>0,'delivery_fee'=>0,'price_option'=>'Fixed']
                ->notmal_tems 
          below
             ->data
                ->zone_codes
                ->fast_items: ['id'=>0,'base_fee'=>0,'delivery_fee'=>0,'price_option'=>'Fixed']
                ->notmal_tems
        ***/

        $data = (object)['data'=>$data];
        // return JDV::result($data);

        return $data;
    }

    //savePrices() | savePriceLine()
    function savePriceLineInfo($arr=[],$id=null,$ss=null){
        $id = $id?$id:$this->id;
        $ss = $ss?$ss:$this->userInfo;

        //need permission to do this task
        $branch_id = $ss->branch_id;
        $v_rule = [
            'price_list_id'=>'1|number',
            'zone_codes'=>'1|string|1000',
            'item_type'=>'1|choice|doc,non_doc',
            // 'section'=>'1|choice|above,below',
            // 'base_fee'=>'1|number|default=0',
            // 'price'=>'1|number|default=0',
            'price_per_kg'=>'1|number|default=0',
            // 'price_option'=>'1|choice|fixed,per_kg,per kg' 
        ];

        $res = validateObject($arr,$v_rule,true,['zone_code'=>['-',',']],$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $d = (object)$inputs;
        $price_list_id = $d->price_list_id; 
        //$price_list_id = isset($d->price_list_id)?$d->price_list_id:null;
        $zone_codes =  $d->zone_codes;
        $item_type = $d->item_type;
        // $section =  $d->section; /** @section = {'above','below'} **/
        // $base_fee = Sanitizer::sanitize(isset($d->base_fee)?$d->base_fee:0);
        $price = $d->price_per_kg;
        //if(!$price) $price = isset($d->price)?$d->price:0;
        
        // $price_option = isset($d->price_option)?$d->price_option:'fixed'; //default to "fixed"
 
        // unset($inputs['delivery_fee']);
 
        // //ensure that zone_codes do not have space and is valid
        // $zons =  explode(',', $zone_codes);
        // $valid_zone_codes =[];
        // foreach($zons as $zcode){
        //    if (!empty($zcode))  
        //    if (!DV::validZoneCode($branch_id,$zcode)) return DV::error("zone code \"$zcode\" does not exists");
        //    $valid_zone_codes[] = trim($zcode);
        // }
        // if(!isset($valid_zone_codes[0])) return DV::error("No valid zone codes provided");
        // $zone_codes = implode('|',$valid_zone_codes);

        // $kg_marker =0;
        //get kg_marker based on the given @price_list_id
        // $rows = DB::table('os_supplier_price_list_names AS n')->where('n.branch_id',$branch_id)->where('id',$price_list_id)->selectRaw('kg_marker')->limit(1)->get();
        // foreach($rows as $row) $kg_marker = $row->kg_marker;

        //determine $more_wheres clause, depending on whether the given @section is "below" or "above" the kg_marker
        // $start_kg = -1;
        // $end_kg = -1;
        
        // if ($section =='below')
        //  {
        //     $start_kg = -1;
        //     $end_kg = $kg_marker; 
        //     $more_wheres ="l.end_kg =".$kg_marker;
        //  }
        // else 
        //   {
        //     $start_kg = $kg_marker;
        //     $end_kg = -1; 
        //     $more_wheres ="l.start_kg =".$kg_marker;
        //   }
          
          //$more_wheres .=" AND l.section ='$section'";

        // $price_per_kg =0;
        // if (strtolower($price_option) =='fixed') 
        //    $price_per_kg = 0;
        // else if (strtolower($price_option) =='per_kg' || strtolower($price_option) =='per kg')
           $price_per_kg = $price;
 
        $rows = DB::table('os_supplier_price_list_details AS l')->where('branch_id',$branch_id)->where('zone_code',$zone_codes)->where('item_type',$item_type)->get();
        //if the pricing condition already exist => then UPDATE (base_fee, delivery_fee, price_option) of the existing one
        foreach($rows as $row) {
          $qres = DB::table('os_supplier_price_list_details')->where('branch_id',$branch_id)->where('zone_code',$zone_codes)->where('item_type',$item_type)->where('price_list_id',$price_list_id)
          ->update([
            //   'base_price'=>$base_fee,
              'price_per_kg'=>$price_per_kg,
            //   'price'=>$price, // price
            //   'price_option'=>$price_option,
              'create_user'=>$ss->login_name,
              'create_date'=>getNowTime()
          ]);  
          if ($qres >0) return DV::success(['id'=>$row->id]);
          else return DV::error('No data has been updated!');
        } 

        //Create or insert new price line or (price condition) if it odes not exist yet
        DB::table('os_supplier_price_list_details')->insert([
            'branch_id'=>$branch_id,
            'price_list_id'=>$price_list_id,
            'item_type'=>$item_type,
            'zone_code'=>$zone_codes,
            // 'section'=>$section,
            // 'start_kg'=>$start_kg,
            // 'end_kg'=>$end_kg,
            // 'base_price'=>$base_fee,
            // 'price'=>$price,
            'price_per_kg'=>$price_per_kg,
            // 'price_option'=>$price_option,
            'create_user'=>$ss->login_name,
            'create_date'=>getNowTime()
        ]);
        $new_id = DB::getPdo()->LastInsertId(); 
           //Either UPDATE or INSERT, when successful => then returns @id of the price_line or Price_condition 
           return DV::depends(1,['id'=>$new_id]);
    }

    function updateZoneCodes($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        //need permission to do this task
        $branch_id = $ss->branch_id;
        $price_list_id = $d->price_list_id;
        $org_zone_codes = $d->org_zone_codes;
        $zone_codes = $d->zone_codes;
        $country_id = $d->country_id;
        $doc_price = $d->doc_price;
        $non_doc_price = $d->non_doc_price;

        // $zons = explode(',',$zone_codes);
        // $new_codes = [];
        // foreach($zons as $c){
        //     if($c && !in_array($c, $new_codes)){
                if (!$this->zone_code_exists($branch_id,$zone_codes)) return DV::error("Zone code \"$d\" does not exist!");
        //         $new_codes[] = $c;
        //     }
        // }
        // $zone_codes = "|".implode('|',$new_codes)."|";

        $max_zone_len = 1000; 
        if (strlen($zone_codes) >$max_zone_len) return DV::error("zone codes input is too long. Maximum $max_zone_len characters allowed!");

        $res = DB::table('os_supplier_price_list_details')->where('branch_id',$branch_id)->where('zone_code',$org_zone_codes)->where('country_id',$country_id)->where('item_type','doc')->where('price_list_id',$price_list_id)->update(array(
            'zone_code'=>$zone_codes,
            'country_id'=>$country_id,
            'price_per_kg'=>$doc_price,
            'create_user'=>$ss->login_name,
            'create_date'=>getNowTime()
        ));

        $res = DB::table('os_supplier_price_list_details')->where('branch_id',$branch_id)->where('zone_code',$org_zone_codes)->where('item_type','non_doc')->where('country_id',$country_id)->where('price_list_id',$price_list_id)->update(array(
            'zone_code'=>$zone_codes,
            'country_id'=>$country_id,
            'price_per_kg'=>$non_doc_price,
            'create_user'=>$ss->login_name,
            'create_date'=>getNowTime()
        ));
        if($res>0) return DV::success();
        return DV::error('No zone codes updated. It is most likely because UDATE conditions were not matched'); 
    }

    function zone_code_exists($branch_id,$zone){
        $rows = DB::table('loc_countries As c')->where('c.branch_id',$branch_id)->where('c.standard_zone',$zone)->selectRaw("standard_zone")->limit(1)->get();
        foreach($rows as $row) return true;
        return false;
    }

    //$section ={above, below}, $kg_marker =5 kg
    function zone_price_exists($branch_id,$delivery_type,$price_list_id,$zone_code,$kg_marker=null, $section =null){
        if(!$kg_marker || !$section) return false;
        $table ='price_list AS l';
        
        $more_where ="price_list_id ='$price_list_id' AND (l.zone_codes LIKE '%|".$zone_code."|%')";
        if ($section=='below') $str_kg ="AND l.end_kg >= $kg_marker";
        else if ($section =='above')  $str_kg ="AND l.start_kg <= $kg_marker";
        else return false;
        $more_where .= $str_kg;
 
        $rows = DB::table($table)->where('l.branch_id',$branch_id)->whereRaw("delivery_type ='".$delivery_type."'")->whereRaw($more_where)->selectRaw("l.id")->limit(1)->get();
        if ($rows[0]) return true;
        return false;
    }

    //$d = {price_list_id,zone_codes}
    //@zone_codes is can be separated by coma or vertical bar |
    function savePriceLineZones($d) {
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        //need permission to do this task
        $branch_id = $ss->branch_id;
        $price_list_id = isset($d->price_list_id)?$d->price_list_id:null;
        $zone_codes = isset($d->zone_codes)?$d->zone_codes:null;
        $country_id = isset($d->country_id)?$d->country_id:null;
        $doc_price = isset($d->doc_price)?$d->doc_price:0;
        $non_doc_price = isset($d->non_doc_price)?$d->non_doc_price:0;
        $sender_ids =null;// $d->sender_ids;
         
        // $sp ='|';
        // if(strpos(',',$zone_codes)>=0 ) $sp =',';
        // $zz = explode($sp,$zone_codes);
        // $new_codes =[];
        // $zone_codes =null;
        // foreach($zz as $code){
        //   if(!empty($code)){
        //         if(!in_array($code,$new_codes))  
        //         {
                    if (!$this->zone_code_exists($branch_id,$zone_codes)) return DV::error("zone code \"$d\" does not exist!");
                    //if ($this->zone_price_exists($branch_id,$delivery_type, $price_list_id,$code,$kg_marker,'below'))
        //             $new_codes[] = $code;  
        //             $zone_codes .= '|'.trim($code);
        //         }
        //   } 
        // }
        // $zone_codes .= '|';

        // $max_zone_len = 1000; 
        // if (strlen($zone_codes) >$max_zone_len) return DV::error("zone codes input is too long. Maximum $max_zone_len characters allowed!"); 

        $result = (object)array('status'=>'OK','error_message'=>null);
        // $kg_marker =-1;
        // $rows = DB::table('os_supplier_price_list_names AS l')->where('branch_id',$branch_id)->where('id',$price_list_id)->selectRaw("l.id,l.kg_marker")->limit(1)->get();
        // foreach($rows as $row){
        //    $kg_marker = $row->kg_marker;

        // } 
        // return JDV::result($kg_marker);

        // if($kg_marker ==-1) return DV::error('Price list ID is not valid');
        
        /** below kg_marker/FAST **/
        $item_type = 'doc';
        // $section ='below';
        // $end_kg = $kg_marker;
        // $start_kg = -1;
        DB::table('os_supplier_price_list_details')->insert(array(
            'branch_id'=>$branch_id,
            'price_list_id'=>$price_list_id,
            'zone_code'=>$zone_codes,
            'country_id'=>$country_id,
            'item_type'=>$item_type,
            // 'section'=>$section,
            // 'start_kg'=>$start_kg,
            // 'end_kg'=>$end_kg,
            // 'base_price'=>0,
            // 'price'=>0,
            'price_per_kg'=>$doc_price,
            // 'price_option'=>'Fixed',
            'create_user'=>$ss->login_name,
            'create_date'=>getNowTime()
        ));


       /** below kg_marker/NORMAL **/
        $item_type = 'non_doc';
        // $section ='below';
        // $end_kg = $kg_marker;
        // $start_kg = -1;
        DB::table('os_supplier_price_list_details')->insert(array(
            'branch_id'=>$branch_id,
            'price_list_id'=>$price_list_id,
            'zone_code'=>$zone_codes,
            'country_id'=>$country_id,
            // 'sender_ids'=>$sender_ids,
            // 'section'=>$section,
            'item_type'=>$item_type,
            // 'start_kg'=>$start_kg,
            // 'end_kg'=>$end_kg,
            // 'base_price'=>0,
            // 'price'=>0,
            'price_per_kg'=>$non_doc_price,
            // 'price_option'=>'Fixed',
            'create_user'=>$ss->login_name,
            'create_date'=>getNowTime()
        ));

        $result->status ='OK';
        $result->error_message = null;
        return $result;
    }

    function deletePriceZones($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        //need permission to do this task
        $branch_id = $ss->branch_id;
        $zone_codes = isset($d->zone_codes)?$d->zone_codes:null;
        DB::table('os_supplier_price_list_details')->where('branch_id',$branch_id)->where('zone_code',$zone_codes)->delete();
        return null;
    }

    //return list of merchants based on a given price_list_id
    function getMerchantsByPriceList($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        //need permission to do this task
        $branch_id = $ss->branch_id;
        $search_value = isset($d->search_value)?$d->search_value:null;
        $price_list_id = isset($d->price_list_id)?$d->price_list_id:-1;
        $str_search ="1=1 ";
        $sql_is_member = ",(s.price_list_id = $price_list_id) AS is_member";
        if(!empty($search_value))  $str_search .=" AND (s.name LIKE '%$search_value%' OR s.phone_number ='$search_value')";
        // if (empty($search_value))
        //    $str_search .= " AND s.price_list_id ='$price_list_id'";
        // else
        //    $str_search .=" AND (s.name LIKE '%$search_value%' OR s.phone_number ='$search_value')";
        
        $rows = DB::table('sender AS s')->where('s.branch_id',$branch_id)->whereRaw($str_search)->selectRaw("s.id,s.code,s.name, getPriceListName(s.price_list_id) AS price_list_name, s.phone_number $sql_is_member")->orderByRaw("is_member DESC, s.name ASC")->get();
        //->where('s.price_list_id',$price_list_id)
        return $rows;
    }

    function removeMerchantFromPriceList($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        //need permission to do this task
        $branch_id = $ss->branch_id;
        $price_list_id = isset($d->price_list_id)?$d->price_list_id:null;
        $sender_id = isset($d->sender_id)?$d->sender_id:null;
        DB::table('sender')->where('branch_id',$branch_id)->where('id',$sender_id)->update(array(
            'price_list_id'=>null
        ));
        return null;
    }

    function getPriceListIdBySearchValue($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        //need permission to do this task
        $branch_id = $ss->branch_id;
        $search_value = isset($d->search_value)?$d->search_value:null;
        $result = (object)['status'=>'OK','error_message'=>null];

        if (empty($search_value)) {
            $result->status ='Error';
            $result->error_message ="Search by exact merchant name or merchant ID!";
            return $result;
        }
        $search_value = trim($search_value);
        $more_where =" ( s.name ='$search_value' OR s.`code`='$search_value') ";
        $rows = DB::table('sender AS s')->where('s.branch_id',$branch_id)->whereRaw($more_where)->selectRaw("price_list_id")->limit(1)->get();
        foreach($rows as $row){
           
            $result->price_list_id =$row->price_list_id;

            if (!$row->price_list_id) {
                $result->status ='Error';
                $result->error_message ="This merchant does not have price list assigned!";
                return $result;
            } else {
                $result->status ='OK';
                return $result;
            }
        }
        $result->status ='Error';
        $result->error_message ="No matched merchants found!";
        return $result;
    }
    function addMerchantToPriceList($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        //need permission to do this task
        $branch_id = $ss->branch_id;
        $price_list_id = isset($d->price_list_id)?$d->price_list_id:null;
        $sender_id = isset($d->sender_id)?$d->sender_id:null;
        DB::table('sender')->where('branch_id',$branch_id)->where('id',$sender_id)->update(array(
            'price_list_id'=>$price_list_id
        ));
        return null;
    }

    function createPriceList($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        //need permission to do this task
        $branch_id = $ss->branch_id;
        $name = isset($d->name)?$d->name:null;
        $kg_marker = isset($d->kg_marker)?$d->kg_marker:0; 
        $result = (object)[];
        
        $exists = DB::table('os_supplier_price_list_names')->where('branch_id',$branch_id)->where('name',$name)->limit(1)->exists();
        if($exists) {
            $result->error_message = "The provided Price List name already in use";
            $result->status = 'Error';
            return $result;
        }

        if (!is_numeric($kg_marker) || $kg_marker < 0 ) {
            $result->error_message = "Weight Marker must be a number";
            $result->status = 'Error';
            return $result;
        }

        DB::table('os_supplier_price_list_names')->insert(array(
            'branch_id'=>$branch_id,
            'name'=>$name,
            'kg_marker'=>$kg_marker,
            'create_user'=>$ss->login_name,
            'create_date'=>getNowTime()
        ));
        $new_id = DB::getPdo()->LastInsertId(); 
        $result->error_message = null;
        $result->status = 'OK';
        $result->id = $new_id;
        return $result;
    }

    //$d = {'id' } or $d = {'price_list_id'}
    function deletePriceList($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        //need permission to do this task
        $branch_id = $ss->branch_id;
        $id = isset($d->id)?$d->id:null;
        if(!$id) $id = isset($d->price_list_id)?$d->price_list_id:0;

        DB::table('os_supplier_price_list_names')->where('branch_id',$branch_id)->where('id',$id)->delete();
        DB::table('price_list')->where('branch_id',$branch_id)->where('price_list_id',$id)->delete();
        return null;
    }

    //update kg_marker for a given price list (version of the price list)
    function updatePriceList_kg_maker($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        //need permission to do this task
        $branch_id = $ss->branch_id;
        $id = isset($d->id)?$d->id:0; 
        $kg_marker = isset($d->kg_marker)?$d->kg_marker:0;
        DB::table('price_settings')->where('branch_id',$branch_id)->where('id',$id)->update(array(
            'kg_maker'=>$kg_marker,
            'create_user'=>$ss->login_name,
            'create_date'=>getNowTime()
        ));

        //make correction of kg range in table "price_list"
        DB::statement(DB::raw("UPDATE price_list SET start_kg = $kg_marker WHERE branch_id='$id' AND price_list_id='$id' AND start_kg >0"));
        DB::statement(DB::raw("UPDATE price_list SET end_kg = $kg_marker WHERE branch_id='$id' AND price_list_id='$id' AND end_kg >0"));
        return null;
    }

    function getComboItems_price_list($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        //need permission to do this task
        $branch_id = $ss->branch_id;
        $rows = DB::table('os_supplier_price_list_names AS ps')->where('ps.branch_id',$branch_id)->selectRaw("id,name,kg_marker")->get();
        return $rows;
    }

    function getSampleScript($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        //need permission to do this task
        $branch_id = $ss->branch_id;
        $script = '
        #
        type = fast
        base_price = 1
        zone=A35, A15, A25, A37
        kg_marker = 3
        below_price = 0
        above_price = 1.5
        price_option = fixed
        #';
        return $script;
    }

    //convert price script to appropriate array of objects
    //ScriptToObjects() | scriptToArray()
    function scriptToArray($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //User not authenticated
        //need permission to do this task
        $branch_id = $ss->branch_id;
        $p_script = isset($d->p_script)?$d->p_script:null;
        
        $line_number = 0;
        $err_cnt =0;
        $errors = [];
        $rows = [];
        $data =[];
        $ss = preg_split("/#/",$p_script);
        foreach($ss as $p){
          $line_number++; //not exact line number yet
          $ps = preg_split("/\r\n|\n|\r/", $p);
                foreach($ps as $c){
                    $parts =  preg_split("/=/",$c);
                    $var_name = isset($parts[0])?$parts[0]:null;
                    $value = isset($parts[1])?$parts[1]:null;
                    $var_name = strtolower(trim($var_name));
                    if(!empty($var_name))
                    $data[$var_name]=trim($value);
                }
                $data = (object)$data;
                if (!isset($data->base_fee)) $data->base_fee = isset($data->base_price)?$data->base_price:0;
                $err = $this->getObjectError($data);
                if ($err != null) {
                    $errors[] = 'Line '.$line_number.'. '. $err; 
                    $err_cnt++;
                }
                
                $rows[] = $data;
        }
        $result = (object)array('rows'=>$rows,'errors'=>$errors,'error_count'=>$err_cnt);
        return $result;
    }
    
    //validateRow() | getRowError() returns NULL if there is no problem
    function getObjectError($row){
        //convert object to associative array
        $row = (array)$row;
        $required_fields = ['type','base_price','kg_marker','above_price','below_price','price_option'];
        foreach($required_fields as $prop){
           if(!isset($row[$prop])) return $prop." is missing for some price section";
           else {
               $err = $this->getValueError($prop,$row[$prop]);
               if ($err !=null) return $err;
           }
        }
       return null;  
    }

    function getValueError($prop, $value){
        $prop = strtolower($prop);
        switch($prop){
            case 'type':{
                if (strtolower($value) != 'normal' && strtolower($value) != 'fast') return "\"type\" must be either Normal or Fast";
                break;
            }
            case 'base_price':{
                if ($value <0) return "base_price cannot be negative";
                break;
            }
            case 'kg_marker':{
                if ($value <0) return "kg_marker cannot be negative";
                break;
            }
            case 'above_price':{
                if ($value <0) return "above_price is not correct";
                break;
            }
            case 'below_price':{
                if ($value <0) return "below_price is not correct";
                break;
            }
            case 'price_option':{
                if ($value <0) return "price_option must be either \"fixed\" or \"per_kg\" ";
                break;
            }
            default:{
                return null;
                break;
            }
        }  
        return null;
    } 

    function translateScript($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        //need permission to do this task
        $branch_id = $ss->branch_id;
        $p_script = isset($d->p_script)?$d->p_script:null;
        
        $data =[];
        $ss = preg_split("/#/",$p_script);
        foreach($ss as $p){
        //echo $p.'\n';
        $ps = preg_split("/\r\n|\n|\r/", $p);
                foreach($ps as $c){
                    $parts =  preg_split("/=/",$c);
                    $var_name = isset($parts[0])?$parts[0]:null;
                    $value = isset($parts[1])?$parts[1]:null;
                    $var_name = strtolower(trim($var_name));
                    if(!empty($var_name))
                    $data[$var_name]=trim($value);
                }
        }
        $data = (object)$data;
        if (!isset($data->base_fee)) $data->base_fee = isset($data->base_price)?$data->base_price:0;
        $zones =null;
        $zones = $this->getFriendlyZoneNames($data->zone);
        $dType = "សេវាដឹកធម្មតា";
        $additional_charge = null;
        $data->price_option = trim(strtolower($data->price_option));
        if ($data->price_option =='per_kg' || $data->price_option =='per kg') {
            $additional_charge = '$'.$data->above_price. ' ក្នុងមួយគីឡូៗ ដែលលើស។';
        } else  $additional_charge = 'ត្រូវបង់សេវាបន្ថែម $'.$data->above_price;

        if(strtolower($data->type)=='fast') $dType ='សេវាដឹករហស័';
        $text ='ក្នុងករណី "'.$dType.'" នៅក្នុងតំបន់ '.$zones.'. ត្រូវប្រើតំលៃដូចខាងក្រោមនេះ<br>';
        $text .='តំលៃគោលគឺ $'.$data->base_fee.'<br><ul>';
        $text .='<li>បើទំនិញមានទំងន់ '.$data->kg_marker.'kg ចុះក្រោម, ត្រូវបង់សេវាសរុប​ $'.($data->base_fee + $data->below_price).'</li>';
        $text .='<li>បើទំនិញធ្ងន់ជាង'.$data->kg_marker.'kg '.$additional_charge.'</li></ul>';
        return $text;
    }

    function getFriendlyZoneNames($zone_codes){
       return $zone_codes;
    }

    function getFormOptions_priceline($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        //need permission to do this task
        $branch_id = $ss->branch_id;
        $data = (object)array('senders'=>[],'zones'=>[]);
        $data->senders = DB::table('sender AS s')->selectRaw('s.name AS sender_name, s.id')->where('s.branch_id',$branch_id)->orderByRaw('s.name ASC')->get();
        $data->zones = DB::table('zones AS z')->selectRaw("z.zone_name,z.zone_code")->where('z.branch_id',$branch_id)->orderByRaw('z.zone_code ASC')->get();

        return $data;
    }

    /** GetExchangeRateByMerchant() returns exchange rate based on a given merchant or sender ID */
    function getExchangeRateBySender($arr,$ss=null){
        $ss = $ss?$ss:$this->userInfo;
        $branch_id = $ss->branch_id;
        $d = (object)$arr;
        $sender_id = isset($d->sender_id)?Sanitizer::sanitize($d->sender_id):0;
        // $date = date('y-m-d');
        // $month_num = date('m');
        $more_wheres =null;
        $default_rates = (object)array('buy_rate'=>4100,'sell_rate'=>4100);

        //$more_wheres = "x.x_month ='".$month_num."' ";
        $more_wheres  = "1=1";

        if ($sender_id > 0) {
            $rows = DB::table('sender_exchange_rates AS x')->where('branch_id',$branch_id)->where('sender_id',$sender_id)->whereRaw($more_wheres)->selectRaw("x.buy_rate,x.sell_rate")->limit(1)->get();
        } else
        $rows = DB::table('exchange_rates AS x')->where('branch_id',$branch_id)->whereRaw($more_wheres)->selectRaw("x.buy_rate,x.sell_rate")->limit(1)->get();
        foreach($rows as $row) return $row;
            $default_rates->sell_rate = get_settings_value($ss,'EXCHANGE_RATE_SELL','number'); //use USD to buy KHR
            $default_rates->buy_rate = get_settings_value($ss,'EXCHANGE_RATE_BUY','number'); //use KHR to buy USD
        return $default_rates;
    }
}
