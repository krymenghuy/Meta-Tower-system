<?php

namespace App\Http\Controllers\Abm;

use App\Http\Controllers\Controller;
use App\Models\Abm\Dashboard;
use Illuminate\Http\Request;
use App\Models\UM;
use App\Models\JDV;
class DashBoardController extends Controller
{
    protected $supplier = null;
    function __construct(){
        $this->dashboard = new Dashboard();
    }

   

    function getSuplierListPaginate(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $data = $this->dashboard->getSuplierListPaginate($req->all(),$ss);
        
        return JDV::result($data);
    }

    function setSupplierPriceList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if ($ss->status_code !==200) return JDV::raw($ss); //user not authenticated
        $id = $req->supplier_id? $req->supplier_id:$req->id;
        $supplier = new Supplier($id,$ss);
        $res = $dashboard->setPriceList($req->price_list_id);
        // return JDV::result($res );
        if ($res->status==='OK') return JDV::success(['list_name'=>$res->list_name,'list_id'=>$res->list_id]);
        return JDV::error($res->error_message);
     }
    
    function getHeaderCards(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if ($ss->status_code !==200) return JDV::raw($ss);
         $data = $this->dashboard->getHeaderCards($ss); 
         return JDV::result($data);
     }

     function getBodyCards(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if ($ss->status_code !==200) return JDV::raw($ss);
         $data = $this->dashboard->getBodyCards($ss); 
         return JDV::result($data);
     }

    
}
