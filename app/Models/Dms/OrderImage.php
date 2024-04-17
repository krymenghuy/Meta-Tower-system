<?php

namespace App\Models;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use DB;

use function PHPUnit\Framework\fileExists;

class OrderImage //extends Model
{
    //use HasFactory;

    //List order header info (or just order information without items or images)
    //@params $d = {sender_id,start_date,end_date,order_id,}
    static function list($ss,$d){
        $branch_id = $ss->branch_id;

        $search_value = isset($d['search_value'])?$d['search_value']:null;
        $sender_id =isset($d['sender_id'])?$d['sender_id']:null;
        $start_date = isset($d['start_date'])? convertDate($d['start_date']):date('Y-m-d');
        $end_date = isset($d['end_date'])? convertDate($d['end_date']): date('Y-m-d');
        
        if (!(bool)($start_date)) $start_date = date('Y-m-d');
        if (!(bool)($end_date)) $end_date = date('Y-m-d');
         
        $str_dates = "DATE(o.create_date)>= '$start_date' AND DATE(o.create_date) <='$end_date'";
  
        $str_sender ="1=1";
        if($sender_id>0) $str_sender ="s.id =$sender_id";

        $str_search ="1=1";
        if($search_value) $str_search ="(o.code ='$search_value' OR s.phone_number = '$search_value')";
        $rows = DB::table('order as o')->join('sender as s','s.id','=','o.sender_id')->whereRaw($str_sender)->whereRaw($str_dates)->where('o.branch_id',$branch_id)->where('o.detail_type','images')->selectRaw("o.id,o.code,DATE_FORMAT(o.request_date,'%d %b %Y') as order_date,DATE_FORMAT(o.request_date,'%r') as order_time, o.qty,o.detail_type,o.sender_id,s.name as sender_name,s.price_list_id,s.phone_number as sender_phone,s.address,s.loc_lat,s.loc_lng")->get();
        return $rows;
    }

    //$d = {order_id}
    static function listImagesByOrder($ss,$d){
        $branch_id = $ss->branch_id;
        $order_id =isset($d['order_id'])?$d['order_id']:0;
        if(!$order_id) $order_id=isset($d['id'])?$d['id']:null;
        $rows = DB::table("order_images as img")->join('order as o','o.id','=','img.order_id')->where('o.id',$order_id)->where('img.branch_id',$branch_id)->selectRaw("img.id,img.file_name,img.file_type,file_size_kb")->get();
        
        //NOTE: event in case Driver is the one who upload order images, all order-images are saved in directory "companies/1_data/merchant"
        $img_folder = "merchant";
        $base_url = PublicStorage::getUrl($branch_id,$img_folder,"image");
        $default_image =$base_url."/def_image.png";
        $dir = PublicStorage::getDiskPath($branch_id,$img_folder,"image");
        
        foreach($rows as $row){
            $file = $dir.$row->file_name;
            if (fileExists($file))   
               $row->image_url = $base_url.$row->file_name;
            else
               $row->image_url = $default_image; 
        }
        return $rows;
    }

      //$d = {sender_id,$start_date,$end_date}
      static function listImages($ss,$d){
        $branch_id = $ss->branch_id;
        $sender_id =isset($d['sender_id'])?$d['sender_id']:null;
        $start_date = isset($d['start_date'])? convertDate($d['start_date']):date('Y-m-d');
        $end_date = isset($d['end_date'])? convertDate($d['end_date']): date('Y-m-d');
        
        if (!(bool)($start_date)) $start_date = date('Y-m-d');
        if (!(bool)($end_date)) $end_date = date('Y-m-d');
         
        $str_dates = "DATE(img.create_date)>= '$start_date' AND DATE(img.create_date) <='$end_date'";
  
        $str_sender ="1=1";
        if($sender_id>0) $str_sender ="o.sender_id =$sender_id";
        $rows = DB::table("order_images as img")->join('order as o','o.id','=','img.order_id')->whereRaw($str_sender)->whereRaw($str_dates)->where('img.branch_id',$branch_id)->selectRaw("img.id,img.file_name,img.file_type,file_size_kb")->get();
        
        //NOTE: event in case Driver is the one who upload order images, all order-images are saved in directory "companies/1_data/merchant"
        $img_folder = "merchant";
        $base_url = PublicStorage::getUrl($branch_id,$img_folder,"image");
        foreach($rows as $row){
            $row->image_url = $base_url.$row->file_name;
        }
        return $rows;
    }
}
