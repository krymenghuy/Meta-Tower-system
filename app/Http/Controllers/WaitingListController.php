<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\WaitingList;

class WaitingListController extends Controller
{
    protected $waitingListModel;
    public function __construct() {
        $this->waitingListModel = new WaitingList();
    }

    function saveApplicant(Request $filter) { 
         $r = $this->waitingListModel->saveApplicant($filter);
         if($r =='#350') 
           return makeJsonResponse($r,350); // user not authenticated
         else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task

         return makeJsonResponse($r);
    }

    

    function getApplicantList(Request $filter) { 
        $r = $this->waitingListModel->getApplicantList($filter);
        if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task

        return makeJsonResponse($r);
   }

}
