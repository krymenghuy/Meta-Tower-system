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

    function sendToMobile(Request $req){
        $cdata = [
            [
                'user_class'=>'parent',
                'target_user_id'=>$req->official_id,
                'persist'=>1,
                'data'=>[],
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

    function sendChildInvoice(){}
}
