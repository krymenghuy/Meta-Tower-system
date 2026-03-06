<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use App\Models\Prm\Vendor;
use Illuminate\Http\Request;
use JDV;
use XAuthService;

class VendorController extends Controller
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
}
