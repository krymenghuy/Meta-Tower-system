<?php

namespace App\Http\Controllers;
use App\Models\Notifier;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
   
    function getNotificationListByUser(Request $request){
     $r = Notifier::getNotificationListByUser($request);
       return makeJsonResponse($r);
    }

    function getPendingRequests(Request $request){
        return makeJsonResponse([]);
    }
}
