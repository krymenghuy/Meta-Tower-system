<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sender;
use App\Models\JDV;
use App\Models\UM;

class SenderController extends Controller
{
    protected $senderModel;
    public function __construct(){
        $this->senderModel = new Sender();
    }

    function saveSender(Request $req){
       $ss = UM::getUserInfoByToken($req,-1);
       if($ss->status_code !==200) return JDV::raw($ss);
       $id = $req->Sender_id?$req->sender_id:$req->id;
       $sender = new Sender($id,$ss);
       $res = $sender->save($req->all());
       if ($res->status ==='OK') return JDV::success(['sender'=>$res->sender]);
       return JDV::error($res->error_message);
    }

  //getSenderAddress| getFullAddress
  function getVendorAddress(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
     $id = $req->sender_id?$req->sender_id:$req->id;
     $sender = Sender::details($id,$ss);
     return JDV::result($sender? $sender->address:"");
   }

   function getMerchantLocation(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
       $id = $req->sender_id?$req->sender_id:$req->id;
       $sender = Sender::details($id,$ss);
       $lat = $sender? $sender->loc_lat : '';
       $lng = $sender? $sender->loc_lng : '';
       $address = $sender? $sender->address : '';
       $url = $sender? getLocationUrl($sender->loc_lat,$sender->loc_lng) : '';
       $loc = (object)[
         'lat'=>$lat,
         'lng'=>$lng,
         'map_url'=>$url,
         'address'=>$address
      ];
       return JDV::result($loc);
   }

   //return only first or primary bank account info 
   function getMerchantBankInfo(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if ($ss->status_code !==200) return JDV::raw($ss); //user not authenticated
      $sender = new Sender($req->sender_id,$ss);
      $data = $sender->getBankInfo();
      return JDV::result($data);
    }
   

    function deleteSender(Request $req){
        $ss = UM::getUserInfoByToken($req,253);
        if ($ss->status_code !==200) return JDV::raw($ss); //user not authenticated
        $id = $req->id?$req->id:$req->sender_id;
        $sender = new Sender($id,$ss);
        $res = $sender->delete();
        return JDV::raw($res);
     }

     function deleteSenderSpecial(Request $req){
      $ss = UM::getUserInfoByToken($req,273);
      if ($ss->status_code !==200) return JDV::raw($ss);
      $id = $req->id?$req->id:$req->sender_id;
      $sender = new Sender($id,$ss);
      $id = $req->id?$req->id:$req->sender_id;
      $res = $sender->deleteSpecial($id,$ss);
      return JDV::raw($res);
   }

     function deleteProfilePicture(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if ($ss->status_code !==200) return JDV::raw($ss); //user not authenticated
      $id = $req->id?$req->id:$req->sender_id;
      $sender = new Sender($id,$ss);
      $res = $sender->deleteProfilePicture();
      return JDV::raw($res);
   }

   function saveProfilePicture(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if ($ss->status_code !==200) return JDV::raw($ss); //user not authenticated
      $id = $req->id?$req->id:$req->sender_id;
      $photo = $req->photo;
      $sender = new Sender($id,$ss);
      $res = $sender->saveProfilePicture($photo,$req->file_type);
      return JDV::raw($res);
   }

   function getSenderDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if ($ss->status_code !==200) return JDV::raw($ss); //user not authenticated
        $id = $req->sender_id?$req->sender_id:$req->id;
        $sender = new Sender($id,$ss);
        return JDV::result($sender->getDetails());
     }

     function updateSenderStatus(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if ($ss->status_code !==200) return JDV::raw($ss); //user not authenticated
      $id = $req->id?$req->id:$req->sender_id;
      $sender = new Sender($id,$ss);
      $res = $sender->updateStatus($req->status_code,$id);
      return JDV::raw($res);
   }

   function setPriceList(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if ($ss->status_code !==200) return JDV::raw($ss); //user not authenticated
      $id = $req->sender_id? $req->sender_id:$req->id;
      $sender = new Sender($id,$ss);
      $res = $sender->setPriceList($req->price_list_id);
      if ($res->status==='OK') return JDV::success(['list_name'=>$res->list_name,'list_id'=>$res->list_id]);
      return JDV::error($res->error_message);
   }
 
     function getSenderList(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if ($ss->status_code !==200) return JDV::raw($ss); //user not authenticated
      return JDV::result(Sender::list($req->all(),$ss));
     }

     function getFormOptions(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if ($ss->status_code !==200) return JDV::raw($ss);
         $id = $req->id?$req->id:$req->sender_id;  
         $data = Sender::getFormOptions($id,$ss); 
         return JDV::result($data);
     }
}
