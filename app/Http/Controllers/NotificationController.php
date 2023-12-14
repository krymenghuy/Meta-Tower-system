<?php

namespace App\Http\Controllers;
use App\Models\Notifier;
use Illuminate\Http\Request;
use App\Models\JDV;
use App\Models\UM;

class NotificationController extends Controller
{
   
    function getNotificationListByUser(Request $req){
     $ss = UM::getUserInfoByToken($req,-1);
     if($ss->status_code !==200) return JDV::raw($ss);
      $rows = Notifier::getNotificationListByUser($ss);
      return JDV::result($rows);
    }

    function getPendingRequests(Request $req){
        return JDV::result([]);
    }

    function sendToMobile(Request $req){
        $cdata = [
            [
                'user_class'=>$req->user_class?$req->user_class:'merchant',
                'user_id'=>$req->user_id,
                'persist'=>0,
                'data'=>['invoice_id'=>101,'amount'=>350],
                'title'=>$req->title?$req->title:'Test Title',
                'message'=>$req->message?$req->message:'Test message from Admin'
            ]
            // ,
            // [
            //     'user_class'=>'student',
            //     'target_user_id'=>$req->official_id,
            //     'persist'=>1,
            //     'data'=>[],
            //     'title'=>'Test Title',
            //     'message'=>'Message to students'
            // ]
        ];

        $res= Notifier::notify_mobile(1,$cdata);
        return JDV::raw($res);
    }
}
