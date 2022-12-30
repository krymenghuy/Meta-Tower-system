<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SalesAgent;

class SalesAgentController extends Controller
{
    protected $salesAgentModel;
    public function __construct()
    {
        $this->salesAgentModel = new SalesAgent();
    }

    function saveSalesAgent(Request $request) {
        $r = $this->salesAgentModel->saveSalesAgent($request); 
        if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
         else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
   }

   function deleteSalesAgent(Request $request) {
    $r = $this->salesAgentModel->deleteSalesAgent($request); 
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
   }

   function getSalesAgentList(Request $request) {
    $r = $this->salesAgentModel->getSalesAgentList($request); 
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
   }
   
   function getFormData_salesAgent(Request $request) {
        $r = $this->salesAgentModel->getFormData_salesAgent($request); 
        if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
   }
   function getSalesAgentById(Request $request) {
    $r = $this->salesAgentModel->getSalesAgentById($request); 
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  }
  function updateSalesAgentStatus(Request $request) {
    $r = $this->salesAgentModel->updateSalesAgentStatus($request); 
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  }

}
