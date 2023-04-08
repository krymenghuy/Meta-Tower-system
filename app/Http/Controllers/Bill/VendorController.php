<?php

namespace App\Http\Controllers\Bill;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Bill\Vendor;
use App\Models\Bill\BillSettings;
use App\Models\JDV;
use App\Models\UM;

class VendorController extends Controller
{
    function saveVendor(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $vendor = new Vendor($req->id,$ss);
        return JDV::raw($vendor->save($req->all()));
    }

    function deleteVendor(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $vendor = new Vendor($req->id,$ss);
        $res = $vendor->delete();
        return JDV::result($res);
    }

    function getVendorList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        return JDV::result(Vendor::list($req->all(),$ss));
    }

    function getVendorDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        return JDV::result(Vendor::details($req->id,$ss));
    }

    function getComboItems_vendor_type(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        return JDV::result(BillSettings::options_vendor_type($ss));
    }

    function saveVendorType(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        return JDV::raw(BillSettings::saveVendorType($req->all(),$ss));  
     }
     function deleteVendorType(Request $req){
         $ss = UM::getUserInfoBytoken($req,-1);
         if($ss->status_code !==200) return JDV::raw($ss);
         return JDV::raw(BillSettings::deleteVendorType($req->id,$ss));  
     }

}
