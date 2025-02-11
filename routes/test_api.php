<?php
use Illuminate\Http\Request;
use App\Models\Notifier;
use App\Http\Middleware\CustomRateLimiter;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MobileAppSettingsController;
//use App\Http\Controllers\ApiController;
use App\Http\Controllers\NotificationController;

//Route::post('opi/call', [ApiController::class, 'OPICall']);
Route::post('test/months',  function(Request $req){
    $d = getSQLParts_months($req->month_period,'c');
    return $d;
});

//Route::post('telegram/send', [ApiController::class, 'sendToTelegram']);

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
    
    Route::get('tell-agent/{user_id}/{cat_id?}', function ($user_id = null, $cat_id = 1) {
        // Create custom data
        $custom_data = [
            'date' => now(), // Assuming getNowTime() returns current time
            'color' => '#049716',
            'case' => 'new_merchant'
        ];
    
        // Get category details if cat_id is provided
        $cat = Notifier::getCategory($cat_id);
    
        // Prepare notification data
        $notification_data = [
            [
                'user_class' => 'sales_agent',
                'user_id' => $user_id,
                'title' => 'Successful Deal',
                'message' => $cat ? ('Prospect for ' . $cat->name . ' ID ' . $cat->id . ' has become a merchant') : 'Prospect has become a merchant',
                'persist' => 1, // Assuming you want the notification to persist
                'data' =>null
            ]
        ];
    
        // Send notification and get response
        $response = Notifier::notify_mobile(1, $notification_data, $cat_id);
    
        // Return JSON response
        return response()->json($response);
    });
    
   
    /** begin:: API routes created for testing only */
        Route::post('mobile/notifications/send', [NotificationController::class, 'sendToMobile']);
        Route::get('mobile/notifications/send-get', [NotificationController::class, 'sendToMobile']); 
    /** end:: API routes created for testing only */

    Route::post('contact-info', [MobileAppSettingsController::class, 'getContactInfo']);
 });
//end:: api without Authentication