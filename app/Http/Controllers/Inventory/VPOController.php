<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UM;
use App\Models\JDV;
use App\Models\Inventory\VPO;
  
class VPOController extends Controller
{
    function createPO(Request $req){
       $ss = UM::getUserInfoByToken($req,-1);
       if($ss->status_code !==200) return JDV::raw($ss);
       $res = VPO::createPO($ss,$req->all());
       return JDV::raw($res);  
    }

    function deletePO(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $res = VPO::deletePO($ss,$req->id);
        return JDV::raw($res);  
    }

    function getPOList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $d = $req->all(); /** $d = {search_value, vendor_id,start_date,end_date} **/
        $res = VPO::list($ss,$d);
        return JDV::raw($res);  
    } 
}
