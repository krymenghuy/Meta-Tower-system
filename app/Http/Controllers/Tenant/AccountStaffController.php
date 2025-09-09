<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant\AccountStaff;
use JDV;
use XAuthService;
use Illuminate\Http\Request;


class AccountStaffController extends Controller
{
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
}
