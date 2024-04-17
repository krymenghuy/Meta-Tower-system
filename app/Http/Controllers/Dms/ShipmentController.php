<?php

namespace App\Http\Controllers;

use App\Models\Shipment;
use Illuminate\Http\Request;
use App\Models\UM;
use App\Models\JDV;

class ShipmentController extends Controller
{
    //
    protected $shipment = null;
    function __construct(){
        $this->shipment = new Shipment();
    }
    function save(Request $req){

        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code != 200) return JDV::raw($ss);
        $id = $req->id;
        $save = $this->shipment->save($req->all(),$id,$ss);    
        return JDV::raw($save);
    }

    // function ListPaginate(Request $req){
    //     $ss = UM::getUserInfoByToken($req,-1);
    //     if($ss->status_code !=200) return JDV::raw($ss);
    //     $list = $this->shipment->listPaginate($req->all(),$ss);
    //     return JDV::result($list);
    // }
   
    // function getFormOptions(Request $req){
    //     $ss = UM::getUserInfoByToken($req,-1);
    //     if($ss->status_code !==200) return JDV::raw($ss);
    //     $shipment = new shipment();
    //     $data = $shipment->getFormOptions($req->id,$ss);
    //     return JDV::result($data);
    // }

    function getShipmentList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $shipment = new shipment();
        $data = $shipment->getShipmentList();
        
        return JDV::result($data);
    }

    // function details(Request $req ){

    //     $ss = UM::getUserInfoByToken($req,-1);
    //     if($ss->status_code != 200) return JDV::raw($ss); 
    //     $detail = $this->shipment->details($req->id,$ss);
    //     return JDV::raw($detail);

    // }

    // function delete(Request $req ){

    //     $ss = UM::getUserInfoByToken($req,-1);
    //     if($ss->status_code != 200) return JDV::raw($ss); 
    //     $del = $this->shipment->delete($req->id,$ss);
    //     return JDV::raw($del);

    // }

    // function getFormOptionFilter(Request $req){
    //     $ss = UM::getUserInfoByToken($req,-1);
    //     if($ss->status_code !=200) return $ss;
    //     $options = $this->shipment->options_filter($ss);
    //     return JDV::result($options);
    // }
}
