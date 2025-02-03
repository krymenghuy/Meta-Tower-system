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
        // $ss = AuthService::verifyAuth($req, -1);
        // if ($ss->status_code !== 200) {
        //     return JDV::raw($ss);
        // }
        // $id = $req->id ?? $req->emp_id;
        $branch_id = $req->branch_id ?? 1;
        $emp_id = $req->emp_id ?? 1;
        $res = Contract::createContract($req->all(),$emp_id);
        return JDV::raw($res);
    }

    }

