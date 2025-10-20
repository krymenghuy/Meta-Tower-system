<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant\AccountStaff;
use JDV;
use XAuthService;
use Illuminate\Http\Request;


class AccountStaffController extends Controller
{ 
    protected $acc_staff;
    public function saveAccountStaff(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
         $id = $req->staff_id ?? $req->id;
        $acc_staff = new AccountStaff($id,$ss);
        $res = $acc_staff->saveAccountStaff($req->all(),$id);
        return JDV::raw($res);

    }

    public function getListAccountStaff(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $acc_staff = new AccountStaff();
        return JDV::result($acc_staff->getListAccountStaff($req->all(),$ss));
    }

    public function accountStaffDetails(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $acc_staff = new AccountStaff();
        return JDV::result($acc_staff->accountStaffDetails($req->id,$ss));
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
