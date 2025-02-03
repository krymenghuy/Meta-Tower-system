<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Umt\AuthService;
use App\Models\JDV;
use App\Models\Bhr\Contract;

class ContractController extends Controller
{
    public function createContract($qString)
    {
        $user = AuthService::user();
        if (!$user) {
            return JDV::raw(['error' => 'You are not logged in'], 401);
        }
    
        $p = processQueryString($qString);
        $id = $p->id;
        $res = Contract::createContract($id, $user);
    
        return JDV::raw($res);
    }
    

    }

