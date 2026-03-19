<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use App\Models\Prm\Bill;
use Illuminate\Http\Request;
use JDV;
use XAuthService;

class BillController extends Controller
{
    protected $vendors;
    public function __construct(){
        $this->vendors = new Vendor();
    }

    public function saveVendor(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->vendor_id;
        $vendor = new Vendor($id, $ss);
        $res = $vendor->saveVendor($req->all());
        return JDV::raw($res);
    }
     public function getListPaginate(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
       
        return JDV::result($this->vendors->getListPaginate($req->all(),$ss));
    }

    public function vendorDetails(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        if(!isset($req->id) || !is_numeric($req->id)){
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->vendors->vendorDetails($req->id));

    }
    public function getFormOptions(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        return JDV::result($this->vendors->getFormOptions($req->id,$ss));
    }
    


    public  function deleteVendor(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        if(!isset($req->id) || !is_numeric($req->id)){
            return JDV::error('Invalid ID');
        }
        return JDV::raw($this->vendors->deleteVendor($req->id,$ss));
    }
     public function option_select_all_vendor_info(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !== 200){
            return JDV::raw($ss);
        }
         $vendor_id = $req->vendor_id ?? $req->id;
        return JDV::result($this->vendors->getVendorInfo($vendor_id,$ss));
    }
    public function updateVendorStatus(Request $req){
        $ss = XAuthService::verifyAuth($req,-1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $id = $req->id ?? null;
        return JDV::raw($this->vendors->updateVendorStatus($req->status_id,$id,$ss));

    }


}
