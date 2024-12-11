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
        $id = 111;
        $res = Contract::createContract($id,null);
        return JDV::raw($res);
    }
}
