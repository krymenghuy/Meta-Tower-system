<?php

namespace App\Http\Controllers\Ypg;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use XAuthService;
use JDV;
use App\Models\Ypg\Contract;

class ContractController extends Controller
{
    public function createContract($qString)
    {
        $user = XAuthService::user();
        if (!$user) {
            return JDV::raw(['error' => 'You are not logged in'], 401);
        }
    
        $p = processQueryString($qString);
        $id = $p->id;
        $res = Contract::createContract($id, $user);
    
        return JDV::raw($res);
    }
    

    }

