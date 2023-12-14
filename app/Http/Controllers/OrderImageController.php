<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\OrderImage;
use App\Models\JDV;
use App\Models\UM;
use App\Models\PickupRequest;
use Config;

class OrderImageController extends Controller
{
   protected $pickupRequestModel;

   function __construct(){
     $this->pickupRequestModel = new PickupRequest();
   }

    function getOrderList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);  
        if ($ss->status_code !=200) return JDV::raw($ss);
        $sender_id = $req->sender_id;
        $order_id = isset($req->order_id)?$req->order_id:$req->id;
        $start_date =  $req->start_date;
        $end_date =  $req->end_date;
        //retrieve a list of image orders (e.g : order.item_type )
        $rows = OrderImage::list($ss,['start_date'=>$start_date,'end_date'=>$end_date,'sender_id'=>$sender_id]);
        return JDV::result($rows);
  }

  function getImagesByOrder(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);  
    if ($ss->status_code !=200) return JDV::raw($ss);

    $order_id = $req->order_id;
    $order_id = isset($req->order_id)?$req->order_id:$req->id;
    //retrieve a list of image orders (e.g : order.item_type )
    $rows = OrderImage::listImagesByOrder($ss,['order_id'=>$order_id]);
    return JDV::result($rows);
  }

  function getImages(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);  
        if ($ss->status_code !=200) return JDV::raw($ss);

        $sender_id = $req->sender_id;
        $order_id = isset($req->order_id)?$req->order_id:$req->id;
        $start_date =  $req->start_date;
        $end_date =  $req->end_date;
        //retrieve a list of image orders (e.g : order.item_type )
        $rows = OrderImage::listImages($ss,['start_date'=>$start_date,'end_date'=>$end_date,'sender_id'=>$sender_id,'order_id'=>$order_id]);
        return JDV::result($rows);
  }

  //Upload package image| image order| saveImageOrder()
  function saveOrderImage(Request $request){
    $ss = UM::getUserInfoByToken($request,-1);
    if ($ss->status_code !==200) return JDV::raw($ss);
    $branch_id = $ss->branch_id;

    //$request->sender_id = $user->official_id;
    //$request->decrypted =1;
    $sender_id = $ss->official_id;
    $allowed_image_types = Config::get('app.allowed_image_types');
   
    //Set default file_type to PNG
    $file_type = $request->file_type?$request->file_type:"png";
    if (!in_array($file_type,$allowed_image_types)) return api_response(["error_message"=>"Image file $file_type is not allowed"]);
    if(!isset($request->photo_data)){
      return JDV::error("Please choose a correct photo or image");
    }

    $d = [
      'branch_id'=>$branch_id,
      'user_class'=>$ss->user_class,
      'sender_id'=>$ss->official_id,
      'file_type'=>$file_type,
      'photo_data'=>$request->photo_data,
      //"order_id"=>$request->order_id,
      'sender_id'=>$sender_id
    ];

     //$d = {branch_id,$sender_id,$user_class,$order_id,$photo_data}
     //returns object {image_url,order_id,order_number} 
      $res = $this->pickupRequestModel->saveOrderImage($d,$ss);        
      //$r = PublicStorage::saveImage($sender->branch_id,$sender->id,$request->file_type,$request->photo_data);
      // if($r ==='#350') 
      //   return api_response($r,350);
      // else if ($r =='@') return api_response($r,360);
      //   return api_response($r);
      if ($res->status==='OK'){
        return JDV::success([
           "id"=>$res->id,
           "create_date"=>$res->create_date,
           "image_url"=>$res->image_url,
           "order_id"=>$res->order_id,
           "order_number"=>$res->order_number,
           "notif_error"=>$res->notif_error
        ]);
      }else return response()->json($res);
  }

  //  //Upload package image| image order. Driver upload image order for the merchant 
  //  function saveOrderImage_drive(Request $request){
  //   $ss = UM::getUserInfoByToken($request,-1);  
  //   if ($ss->status_code !==200) return JDV::raw($ss);
  //   $request->driver_id = $driver->id;
  //   $request->decrypted =1;
  //   $sender_id = $request->sender_id;
  //   //Set default file_type to PNG
  //   $allowed_image_types = Config::get('app.allowed_image_types');
   
  //   //Set default file_type to PNG
  //   $file_type = $request->file_type?$request->file_type:"png";
  //   if (!in_array($file_type,$allowed_image_types)) return api_response(["error_message"=>"Image file $file_type is not allowed"]);

  //   if(!$sender_id){
  //     $res = (object)["error_message"=>"Sender ID is not correct"];
  //     return api_response($res);
  //   }

  //   if(!isset($request->photo_data)){
  //     $res = (object)["error_message"=>"Please choose a correct photo or image"];
  //     return api_response($res);
  //   }

  //   $d = [
  //     'branch_id'=>$driver->branch_id,
  //     'user_class'=>'merchant',
  //     'sender_id'=>$sender_id,
  //     'file_type'=>$file_type,
  //     'photo_data'=>$request->photo_data,
  //     "order_id"=>$request->order_id
  //   ]; 
  //    //$d = {branch_id,$sender_id,$user_class,$order_id,$photo_data}
  //    //returns object {image_url,order_id,order_number} 
  //    $res = $this->pickupRequestModel->saveOrderImage($driver,$d);

  //    if ($res->status==='OK'){
  //     return api_response([
  //        "id"=>$res->id,
  //        "image_url"=>$res->image_url,
  //        "order_id"=>$res->order_id,
  //        "order_number"=>$res->order_number
  //     ]);
  //   }else return response()->json($r);

  // }

  function deleteOrderImage(Request $request){
    $ss = UM::getUserInfoByToken($request,-1);  
   if ($ss->status_code !=200) return JDV::raw($ss);
    $file_id = $request->id;
    $res = $this->pickupRequestModel->deleteOrderImage($ss,$file_id);
    if($res->status ==='OK'){
          //$order_id = $request->order_id;
          $start_date =  $request->start_date;
          $end_date =  $request->end_date;
          //if(!$order_id) $order_id = $request->id;
          $r = $this->pickupRequestModel->getOrderImages($ss,['start_date'=>$start_date,'end_date'=>$end_date,'order_id'=>null]);
          return api_response($r);
    }
    return JDV::error($res->error_message);
  }
   
    function getOrderImages(Request $request){
        $ss = UM::getUserInfoByToken($request,-1);  
        if ($ss->status_code !=200) return JDV::raw($ss);
        
        $order_id = $request->order_id;
        $start_date =  $request->start_date;
        $end_date =  $request->end_date;
        if(!$order_id) $order_id = $request->id;
        $r = $this->pickupRequestModel->getOrderImages($ss,['start_date'=>$start_date,'end_date'=>$end_date,'order_id'=>$order_id]);
        return api_response($r);
    }

  // function getOrderImages_driver(Request $request){
  //   $ss = UM::getUserInfoByToken($request,-1);  
  //     if ($ss->status_code !==200) return JDV::raw($ss);
  //     $request->driver_id = $driver->id;
  //       $request->decrypted =1;
  //     $order_id = $request->order_id;
  //     $start_date =  $request->start_date;
  //     $end_date =  $request->end_date;
  //     if(!$order_id) $order_id = $request->id;
  //     $r = $this->pickupRequestModel->getOrderImages($ss,['start_date'=>$start_date,'end_date'=>$end_date,'order_id'=>$order_id]);
  //   return api_response($r);
  // }


}
