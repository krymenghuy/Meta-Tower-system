<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\MIStockManager;
use App\Models\JDV;
use App\Models\UM;


class MIStockController extends Controller
{
    protected $stockManager =null;

    function __construct(){
        $this->stockManager = new MIStockManager();
    }

    function ReceiveVPO(Request $req){
       $ss = UM::getUserInfoByToken($req,-1);
       if($ss->status_code !==200) return JDV::raw($ss);
       $res = $this->stockManager->ReceiveVPO($req->all(),$ss);
       return JDV::raw($res);   
    }

    function deleteVPO(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $res = $this->stockManager->deleteVPO($req->id,$ss);
        return JDV::raw($res);   
    }

    function getItemsByGroup(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $rows = $this->stockManager->getItemsByGroup($req->all(),$ss);
        return JDV::result($rows);   
    }
    
    //getItemGroups() | getItemGroupList()
    function getGroupList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $rows = $this->stockManager->getGroupList($req->all(),$ss);
        return JDV::result($rows);   
    }
 
    function updateItemPrices(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $item = new Item($req->id,$ss);
        $res = $item->setPrices($req->all());
        return JDV::raw($res);
    }
    /**
     * set UOM for daily stock summary for each item
    */
    function updateStockUOM(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $item = new Item($req->id,$ss);
        $res = $item->setStockUOM($req->all());
        return JDV::raw($res);
    }
    function updateItemInfo(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $item = new Item($req->id,$ss);
        $res =$item->updateBasicInfo($req->all(),$ss);
        return JDV::raw($res);
    }
}
