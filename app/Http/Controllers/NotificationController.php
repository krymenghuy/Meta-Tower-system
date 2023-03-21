<?php

namespace App\Http\Controllers;
use App\Models\Notifier;
use Illuminate\Http\Request;
use App\Models\UM;
use App\Models\JDV;

class NotificationController extends Controller
{
   
    function getNotificationListByUser(Request $req){
       $ss = UM::getUserInfoByToken($req,-1);
       if($ss !==200) return JDV::raw($ss);
       $rows = Notifier::getNotificationListByUser($ss->user_id);
       return JDV::result($rows);
    }

    function getPendingRequests(Request $req){
        return JDV::result([]);
    }
}
