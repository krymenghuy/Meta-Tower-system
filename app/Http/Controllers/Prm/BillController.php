<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use App\Models\Prm\Bill;
use Illuminate\Http\Request;
use JDV;
use XAuthService;

class BillController extends Controller
{
    protected $bills;
    public function __construct(){
        $this->bills = new Bill();
    }

    public function saveBill(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->vendor_id;
        $bill = new Bill($id, $ss);
        $res = $bill->saveBill($req->all());
        return JDV::raw($res);
    }
     public function getListPaginate(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
       
        return JDV::result($this->bills->getListPaginate($req->all(),$ss));
    }

    public function billDetails(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        if(!isset($req->id) || !is_numeric($req->id)){
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->bills->billDetails($req->id));

    }
    public function getFormOptions(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        return JDV::result($this->bills->getFormOptions($req->id,$ss));
    }
    
    public  function deletebill(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        if(!isset($req->id) || !is_numeric($req->id)){
            return JDV::error('Invalid ID');
        }
        return JDV::raw($this->bills->deleteBill($req->id,$ss));
    }
     public function option_select_all_vendor_info(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !== 200){
            return JDV::raw($ss);
        }
         $vendor_id = $req->vendor_id ?? $req->id;
        return JDV::result($this->vendors->getVendorInfo($vendor_id,$ss));
    }
    public function updateBillStatus(Request $req){
        $ss = XAuthService::verifyAuth($req,-1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $id = $req->id ?? null;
        return JDV::raw($this->bills->updateBillStatus($req->status_id,$id,$ss));

    }


}
