<?php

namespace App\Http\Controllers\Invoice;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JDV;
use App\Models\UM;
use App\Models\Invoice\Customer;

class CustomerController extends Controller
{
    function getCustomerInfo(Request $req){
        $ss = UM::getUserInfoByToken($req, -1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $row =Customer::Info($ss->branch_id,$req->id);
        return JDV::result($row);
    }
}
