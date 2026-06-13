<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Staff;
use JDV;
use XAuthService;
use Illuminate\Http\Request;


class StaffController extends Controller
{ 
    protected $staffs;
    public function __construct(){
        $this->staffs = new Staff();
    }

    public function saveStaff(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $id = $req->staff_id ?? $req->id;
        $staff = new Staff($id,$ss);
        $res = $staff->saveStaff($req->all(),$id);
        return JDV::raw($res);

    }


    public function getListStaff(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        return JDV::result($this->staffs->getListPaginate($req->all(),$ss));
    }

    public function getDetails(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !== 200){
            return JDV::raw($ss);
        }
        if(!isset($req->id) || !is_numeric($req->id)){
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->staffs->getDetails($req->id));
    }
    public function getFormOptions(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $acc_staff = new AccountStaff();
        return JDV::result($acc_staff->getFormOptions($req->id,$ss));
    }

    public function deleteAccountStaff(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->staff_id;
        $acc_staff = new AccountStaff();
        $res = $acc_staff->deleteAccountStaff($id);
        return JDV::raw($res);

    }
    public function updateAccountStaffStatus(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->staff_id;
        $acc_staff = new AccountStaff();
        $res = $acc_staff->updateAccountStaffStatus($req->status_id,$id,$ss);
        return JDV::raw($res);
    }
}
