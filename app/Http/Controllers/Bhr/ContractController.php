<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Umt\AuthService;
use App\Models\JDV;
use App\Models\Bhr\Contract;

class ContractController extends Controller
{
    public function createContract(Request $req)
    {
        $user = AuthService::user();
        if(!$user)
        {
            echo "you are not logged in";
            return ;
        }

        // $ss = AuthService::verifyAuth($req, -1);
        // if ($ss->status_code !== 200) {
        //     return JDV::raw($ss);
        // }
        // $id = $req->id ?? $req->emp_id;
        $emp_id = $req->emp_id ?? $req->id;
        $res = Contract::createContract($req->all(),$emp_id,$user);
        return JDV::raw($res);
    }

    }

