<?php
use Illuminate\Http\Request;
use App\Models\Notifier;
use App\Http\Middleware\CustomRateLimiter;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MobileAppSettingsController;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\NotificationController;

Route::post('opi/call', [ApiController::class, 'OPICall']);
Route::post('test/months',  function(Request $req){
    $d = getSQLParts_months($req->month_period,'c');
    return $d;
});

Route::post('telegram/send', [ApiController::class, 'sendToTelegram']);

Route::middleware([CustomRateLimiter::class])->group(function(){
    Route::post('tell-merchant', function(Request $request){
        $id = $request->id;
        //$e=(object)['branch_id'=>1,'target_user_id'=>$id,'title'=>'Tell Merchant','message'=>'Special Offers for delivery services'];
    
        $custom_data = ['event_name'=>'order_accepted','order_id'=>873,'prop_name'=>'value of prop','phone_number'=>'012565657'];
        $data =[
            [
               'user_class'=>'merchant',
               'target_user_id'=>$id,
               'persist'=>0,
               'title'=>'Dear Hou Express Merchants',
               'message'=>'We are ready to offer you special services',
               'data'=>$custom_data
            ]
        ];
        $res = Notifier::notify_mobile(1,$data);
        return response()->json($res);
    });
    
    Route::get('tell-agent', function(Request $request){
        $id = $request->id ?? $request->user_id;
        $official_id = $request->official_id;
        //$e=(object)['branch_id'=>1,'target_user_id'=>$id,'title'=>'Tell Merchant','message'=>'Special Offers for delivery services'];
        $custom_data = ['event_name'=>'deal_won','lead_id'=>0,'phone_number'=>'012565657'];
        $data =[
            [
               'user_class'=>'sales_agent',
               'user_id'=>$id,
               'target_user_id'=>$official_id, /** This official_id is optional */
               'persist'=>0,
               'title'=>$request->title ?? 'Hou Xpress Agent',
               'message'=>$request->message ?? 'Sample notification to agent',
               'data'=>$custom_data
            ]
        ];
        $res = Notifier::notify_mobile(1,$data);
        return response()->json($res);
    });
   
     
    /** begin:: API routes created for testing only */
        Route::post('mobile/notifications/send', [NotificationController::class, 'sendToMobile']);
        Route::get('mobile/notifications/send-get', [NotificationController::class, 'sendToMobile']); 
    /** end:: API routes created for testing only */

    Route::post('contact-info', [MobileAppSettingsController::class, 'getContactInfo']);
 });
//end:: api without Authentication