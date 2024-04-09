<?php

namespace App\Http\Controllers\abm;

use App\Http\Controllers\Controller;
use App\Models\abm\Supplier;
use Illuminate\Http\Request;
use App\Models\UM;
use App\Models\JDV;
class SupplierController extends Controller
{
    protected $shipment = null;
    function __construct(){
        $this->shipment = new Supplier();
    }
    function save(Request $req){

        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code != 200) return JDV::raw($ss);
        $id = $req->id;
        $save = $this->shipment->save($req->all(),$id,$ss);    
        return JDV::raw($save);
    }

    function getSuplierList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $data = $this->shipment->getSuplierList();
        
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
}
