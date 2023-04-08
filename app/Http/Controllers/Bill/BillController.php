<?php

namespace App\Http\Controllers\Bill;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JDV;
use App\Models\UM;
use App\Models\Bill\BillSettings;

class BillController extends Controller
{
    // function saveVendorType(Request $req){
    //    $ss = UM::getUserInfoBytoken($req,-1);
    //    if($ss->status_code !==200) return JDV::raw($ss);
    //    return JDV::result(BillSettings::saveVendorType($req->all(),$ss));  
    // }
    // function deleteVendorType(Request $req){
    //     $ss = UM::getUserInfoBytoken($req,-1);
    //     if($ss->status_code !==200) return JDV::raw($ss);
    //     return JDV::result(BillSettings::deleteVendorType($req->id,$ss));  
    // }
}
