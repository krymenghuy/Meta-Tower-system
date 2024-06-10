<?php

namespace App\Http\Controllers\Abm;

use App\Http\Controllers\Controller;
use App\Models\Abm\OsShipment;
use App\Models\Abm\OsItem;
use App\Models\Abm\ShipmentEnrollment;
use Illuminate\Http\Request;
use App\Models\UM;
use App\Models\JDV;

class OsShipmentController extends Controller
{
    protected $shipment = null;
    function __construct(){
        $this->shipment = new OsShipment();
        $this->item = new OsItem();
        $this->shipmentEnroll = new ShipmentEnrollment(); //test import
    }
    function save(Request $req){

        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code != 200) return JDV::raw($ss);
        $id = $req->id;
        $save = $this->shipment->save($req->all(),$id,$ss);    
        return JDV::raw($save);
    }

    function getOverseaShipmentList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $data = $this->shipment->getOverseaShipmentList();
        
        return JDV::result($data);
    }

    function ListPaginate(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $data = $this->shipment->ListPaginate($req->all(),$ss);
        
        return JDV::result($data);
    }

    function updateStatus(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !== 200) return JDV::raw($ss);
         $status_id = $req->status_id;
         $qr_code = $req->qr_code;
         $id = $req->id ?? $req->shipment_id;
         $res = $this->shipment->updateStatus($status_id,$qr_code,$id);
         return JDV::raw($res); 
    }

    function updateCarrierInfo(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !== 200) return JDV::raw($ss);
         $id = $req->id ?? $req->shipment_id;
         $res = $this->shipment->updateCarrierInfo($req->all(),$id);
         return JDV::raw($res); 
    }
    
    function ListForBillValidate(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $data = $this->shipment->ListForBillValidate($req->all(),$ss);
        
        return JDV::result($data);
    }

    function createOverseaItem(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code != 200) return JDV::raw($ss);
        $id = $req->id;
        $save = $this->item->createOverseaItem($req->all(),$id,$ss);    
        return JDV::raw($save);
    }

    function getOverseaItemList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);   
        $id = $req->id;
        $data = $this->item->getOverseaItemList($id,$ss);
        
        return JDV::result($data);
    }

    function getItemDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id;
        $data = $this->item->getItemDetails($req->all(),$id,$ss);
        return JDV::result($data); 
    }

    function deleteOrderitem(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $res = $this->item->deleteOrderitem($req->all(),$ss);
        return JDV::raw($res);  
    }

    function getFormOptions(Request $req) {
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !== 200) return JDV::raw($ss);
        $id = $req->id;
        return JDV::result($this->shipment->getFormOptions($id,$ss));
    }

    function getFormOptionsForPayment(Request $req) {
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !== 200) return JDV::raw($ss);
        $id = isset($req->id) ? $req->id : null;
        return JDV::result($this->shipment->getFormOptionsForPayment($id,$req->all(),$ss));
    }

    

    function import(Request $req) {
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !== 200) return JDV::raw($ss);
        $id = $req->id;
        // $d = $req->file;
        return JDV::raw($this->shipmentEnroll->import($req->all(),$ss,$id));
    }
}
