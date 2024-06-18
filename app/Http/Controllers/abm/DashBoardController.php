<?php

namespace App\Http\Controllers\Abm;

use App\Http\Controllers\Controller;
use App\Models\Abm\Dashboard;
use App\Models\Abm\Supplier;
use Illuminate\Http\Request;
use App\Models\UM;
use App\Models\JDV;
class DashBoardController extends Controller
{
    protected $supplier = null, $dashboard;
    function __construct(){
        $this->dashboard = new Dashboard();
    }
    // function getSuplierListPaginate(Request $req){
    //     $ss = UM::getUserInfoByToken($req,-1);
    //     if($ss->status_code !==200) return JDV::raw($ss);
    //     $data = $this->dashboard->getSuplierListPaginate($req->all(),$ss);
        
    //     return JDV::result($data);
    // }

    function setSupplierPriceList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if ($ss->status_code !==200) return JDV::raw($ss); //user not authenticated
        $id = $req->supplier_id? $req->supplier_id:$req->id;
        $supplier = new Supplier($id,$ss);
        $res = $supplier->setPriceList($req->price_list_id);
        // return JDV::result($res );
        if ($res->status==='OK') return JDV::success(['list_name'=>$res->list_name,'list_id'=>$res->list_id]);
        return JDV::error($res->error_message);
     }
    
    function getCards(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if ($ss->status_code !==200) return JDV::raw($ss);
         $data = $this->dashboard->getCards($ss); 
         return JDV::result($data);
     }

     //GetSummaryData()
     function getOverviewData(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if ($ss->status_code !==200) return JDV::raw($ss);
         $data = $this->dashboard->getoverviewData($ss); 
         return JDV::result($data);
     }

    
}
