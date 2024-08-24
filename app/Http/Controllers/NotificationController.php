<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Models\Notifier;
use Illuminate\Http\Request;
use App\Models\JDV;
use App\Services\Umt\AuthService;

class NotificationController extends Controller
{
    function getNotificationListByUser(Request $req){
      $ss = AuthService::verifyAuth($req,-1);
      if($ss->status_code !==200) return JDV::result([]);
      $rows = Notifier::getNotificationListByUser($req->all(),$ss);
      return JDV::result($rows);
    }

    function getPendingRequests(Request $req){
        return JDV::result([]);
    }

    function getUnreadCount(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $cnt = Notifier::getUnreadCount($ss->user_id,$ss->user_class);
        return JDV::result(['count'=>$cnt]);
    }

    function markReadAll(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $res = Notifier::markReadAll($ss->user_id);
        return JDV::raw($res);
    }

    function sendToMobile(Request $req){
        $subs_id = $req->subs_id;
        $cdata = [
            [
                'subs_id'=>$subs_id,
                'category'=>$req->category,
                'user_class'=>$req->user_class?$req->user_class:'merchant',
                'user_id'=>$req->user_id,
                'target_user_id'=>$req->official_id,
                'persist'=> $req->persists,
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
   
        $res = Notifier::notify_mobile(['subs_id'=>$subs_id,'branch_id'=>1],$cdata);
        return JDV::raw($res);
    }
}
