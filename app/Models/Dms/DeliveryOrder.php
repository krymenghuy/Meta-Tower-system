<?php

namespace App\Models\Dms;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use DB;

class DeliveryOrder //extends Model
{
    //use HasFactory;

    protected $id = null, $userInfo =null;
    function __construct($id=null,$userInfo = null){
       $this->id = $id;
       $this->userInfo = $userInfo;
    }

    function getUserInfo(){
        return $this->userInfo;
    }

    function getId(){
        return $this->id;
    }
    
    function getDetails($id=null,$ss=null,$show_attachments=false){
       $id = $id?$id:$this->getId();
       $ss= $ss?$ss:$this->getUserInfo();
       return self::details($id,$ss,false,$show_attachments);
    }

    function getDetailsByTrackingNumber($tracking_number,$ss=null,$show_attachments=false){
      $ss= $ss?$ss:$this->getUserInfo();
      return self::details($tracking_number,$ss,true,$show_attachments);
    }

    //$arr = ['show_attachments'=>0|1,'use_tracking_number'=>0|1]
    static function details($order_id,$ss,$use_tracking_number=false,$show_attachments=true) {
        $branch_id = $ss->branch_id;
        //NOTE: If use_tracking_number =1 => then use parameter $id as tracking_number
        
        if ($use_tracking_number) 
        {
            $rows =  DB::table('order AS o')->where('branch_id',$branch_id)->where('o.code',$order_id)->take(1)->selectRaw('o.id')->take(1)->get();
            foreach($rows as $row) $order_id = $row->id; //get order_id based on the given tracking_number 
        }
        
        //Get header data about order request pickup(pickup_type, request_date, sender_id, sender_code, product_type,number of packages)
        $header_row = null;
        $h_rows = DB::table('order AS o')->join('sender AS s','s.id','=','o.sender_id')->where('o.branch_id',$branch_id)->where('o.id',$order_id)->selectRaw("o.id AS order_id, o.qty,o.actual_pkg_count, o.code AS tracking_number, o.pickup_method, DATE_FORMAT(o.request_date,'%d %b %Y %r') AS request_date, o.sender_id, s.name AS sender_name, s.phone_number AS sender_phone, o.status_id, (SELECT ps.name FROM package_statuses AS ps WHERE ps.id=o.status_id LIMIT 1) AS status")->take(1)->get();
        foreach($h_rows as $row) $header_row = $row;

        //return a string error message when there is no order record or pickup record found!
        if (!$header_row) return DV::error('No pickup information found for this tracking number');
          
        //begin:: Check if at least one package has been booked into "package" table
        $cnt =0;
        $rows = DB::table("package AS p")->where('p.branch_id',$branch_id)->where('p.order_id',$order_id)->selectRaw("p.id")->take(1)->get();
        foreach($rows as $row) $cnt = 1;
        if ($cnt >0) //This case: order has been booked in "delivery" table and packages are stored in "package" table
        {
           //These query based on 2 tables: "package","package_statuses"
           $header_row->packages = DB::table('package AS p')->join('package_statuses AS ps','ps.id','=','p.status_id')->where('p.branch_id',$branch_id)->where('p.order_id',$order_id)->selectRaw("p.id,p.qr_code AS barcode,CONCAT(IFNULL(p.dim_x,0),'cm x ',IFNULL(p.dim_y,0),'cm x ',IFNULL(p.dim_h,0),'cm') AS size,p.dim_x, p.dim_y, p.dim_h,p.billed_kg,p.actual_kg,p.price, p.receiver_address,p.receiver_phone, p.receiver_name, p.package_name, p.zone_code,p.zone_name,p.df_payer,p.base_fee, p.sender_adjust_amount, IFNULL(p.driver_adjust_amount,0) AS driver_adjust_amount, p.delivery_fee, p.cod, p.cod_fee,p.status_id,ps.name AS status,IFNULL(p.sender_confirmed,0) AS sender_confirmed,IFNULL(p.sender_pmt_status_id,0) AS sender_pmt_status_id, NULL AS img_data")->orderBy('p.id','DESC')->get();
           return $header_row;
        } 
        else //order.status_id <4=> 4 = "Picked and Booked"
        {
          $header_row->packages = DB::table('order_receivers AS r')->join('order AS o','r.order_id','o.id')->where('o.branch_id',$branch_id)->where('o.id',$order_id)->selectRaw("r.id, CONCAT(IFNULL(r.dim_x,0),'cm x ',IFNULL(r.dim_y,0),'cm x ',IFNULL(r.dim_h,0),'cm') AS size, r.dim_x, r.dim_y, r.dim_h,r.billed_kg,r.actual_kg,r.price, r.receiver_address,r.receiver_phone, r.receiver_name, r.package_name, r.zone_code,r.zone_name, r.cod, r.df_payer, 0 AS base_fee, 0 AS adjust_amount, r.delivery_fee, r.cod_fee,1 AS status_id,'Not picked Yet' AS status")->orderBy('r.id','DESC')->get();
          if ($show_attachments===1 || $show_attachments) {
            foreach($header_row->packages as $row) $row->image_urls =self::package_attactments($row->id,$branch_id);     
          }
          return $header_row;
        }
        //end::Check if the request order has been booked as delivery

        return [];
   }

   static function package_attactments($id,$branch_id){
      $urls = [];
      $rows = DB::table('package_attachments AS tt')->where('tt.branch_id',$branch_id)->where('tt.package_id',$id)->selectRaw('tt.id,tt.file_name,tt.file_type')->orderBy('tt.id','DESC')->get(); 
        foreach($rows as $row) $urls[] = PublicStorage::getUrl($branch_id,"merchant","image").$row->file_name;
      return $urls; 
   }

    //  function getFirstAttachment_package($branch_id,$id){
    //     $rows = DB::table('package_attachments AS tt')->where('tt.branch_id',$branch_id)->where('tt.package_id',$id)->selectRaw('tt.file_name,tt.file_type')->take(1)->get(); 
    //     foreach($rows as $row) {
    //       $content = readFileContent($row->file_name);   
    //       //$p = "data".getEncodedChar(':')."image".getEncodedChar("/").$row->photo_file_type.";"."base64".getEncodedChar(',');
    //       //****Return for javascript client
    //       //return $p.base64_encode($content);
    //       //**** return direct from server
    //        return "data:image/jpg;base64,".base64_encode($content);
    //     }
    //     return null;
    //   }

}
