<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Account;

class AccountController extends Controller
{
    protected $account;
    public function __construct() {
        $this->account = new Account();
    }

    function getForm_options(Request $request) { 
        $r = $this->account->getForm_options($request);
        return makeJsonResponse($r);
      }
   
      function saveLead(Request $request) { 
         $r = $this->account->save($request); 
         return makeJsonResponse($r);
      }
       
      function deleteLead (Request $request) { 
        $r = $this->account->delete($request);
        return makeJsonResponse($r);
      }
    
    function getAccountList(Request $request) { 
        $r = $this->account->list($request);
        return makeJsonResponse($r);
    }
    
    function getLeadData (Request $request) { 
        $r = $this->account->get($request);
        return makeJsonResponse($r);
    }
}
