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
       $res = $this->stockManager->ReceiveVPO($ss,$req->all());
       return JDV::raw($res);   
    }

    function deleteVPO(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $res = $this->stockManager->deleteVPO($ss,$req->id);
        return JDV::raw($res);   
    }

    function getItemsByGroup(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $rows = $this->stockManager->getItemsByGroup($ss,$req->all());
        return JDV::result($rows);   
    }
    
    //getItemGroups() | getItemGroupList()
    function getGroupList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $rows = $this->stockManager->getGroupList($ss,$req->all());
        return JDV::result($rows);   
    }
 
    function updateItemPrices(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $res = $this->stockManager->updateItemPrices($ss,$req->all());
        return JDV::raw($res);
    }
    function updateItemSKU(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $res = $this->stockManager->updateItemSKU($ss,$req->all());
        return JDV::raw($res);
    }

    function updateItemInfo(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $res = $this->stockManager->updateItemInfo($ss,$req->all());
        return JDV::raw($res);
    }
}
