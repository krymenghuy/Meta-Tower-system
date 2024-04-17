<?php

use Illuminate\Http\Request;
use App\Http\Middleware\CustomRateLimiter;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderImageController;
use App\Http\Controllers\ApiController;
use App\Models\SystemSetting;
     
 //## begin:: driver app api V2
 Route::middleware([CustomRateLimiter::class])->prefix('driver/v2')->group(function(){
    Route::post('login', [ApiController::class, 'externalLogin']);
    Route::post('verify-otp', [ApiController::class, 'verifyOTP']);
    Route::post('reg-driver', [ApiController::class, 'registerDriver']);
    Route::post('reg-send-otp', [ApiController::class,'send_otp_preregister_driver']);
    Route::post('reg-verify-otp', [ApiController::class,'verify_otp_preregister_driver']);

    Route::post('activate-account-otp', [ApiController::class, 'activateDriver_otp']);
    Route::post('forget/send-phone-otp', [ApiController::class,'sendOTPCode_phone_driver']);
    Route::post('forget/verify-otp', [ApiController::class,'matchOTP_driver']);
    //$d = {phone_number,otp_code,password}
    Route::post('forget/reset-pwd', [ApiController::class,'resetPassword_driver']);
    Route::post('send-sms-otp', [ApiController::class,'sendSMS_otp']);
    Route::post('verify-otp', [ApiController::class,'verify_otp']);
 });

 Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('driver/v2')->group(function(){
    Route::post('user-info', [ApiController::class, 'getOfficialId_driver']);
    Route::post('unread-count', [ApiController::class, 'getUnreadCount']);
    Route::post('mark-read', [ApiController::class, 'markRead_driver']);
    Route::post('mark-read-all', [ApiController::class, 'markReadAll']);
    Route::post('failure-remarks', [ApiController::class, 'getRemarksList']);

  // Route::post('deactivate-me', [ApiController::class, 'deactivateMySelf_driver']);
    Route::post('/delivery-remarks', [ApiController::class, 'getDeliveryRemarks']);
    Route::post('deactivate-me', [ApiController::class, 'deactivateMySelf_driver']);

    Route::post('upload-package-photo', [ApiController::class, 'savePackage_photo']);
    Route::post('delete-package-photo', [ApiController::class, 'deletePackage_photo']);
    Route::post('package-photos', [ApiController::class, 'getPackage_photos']);
    //Upload order image.
    //@params $d = {sender_id,'photo_data',[file_type],[order_id]}
    Route::post('save-order-image', [OrderImageController::class, 'saveOrderImage']);
    //@params $d = {order_id,id}. where $id is image id or file id
    Route::post('delete-order-image', [OrderImageController::class, 'deleteOrderImage']);
    Route::post('order-images', [OrderImageController::class, 'getOrderImages']);

    //Driver App => user scan package. This api "api/package-info" returns package info, esp status_id
    Route::post('package-info', [ApiController::class, 'getPackageDetails']);

    Route::post('delete-notifications', [ApiController::class, 'deleteNotifications_driver']);
    //return list of filter status for History View on Driver app
    Route::post('history-filter-statuses', [ApiController::class, 'getComboItems_filter_status_driver']);
    Route::post('history-filter-package-statuses', [ApiController::class, 'getComboItems_filter_package_status_driver']);
 
    Route::post('save-current-location',[ApiController::class,'saveCurrentLocation_driver']);
    Route::post('current-location',[ApiController::class,'getCurrentLocation_driver']);

    //Driver notify to Merchant on 5mn before arrival or On arrival
    //$d = {'merchant_id','in_minute',[message],[order_id]}
        Route::post('pickup-driver-arrive',[ApiController::class,'notifyArrival_pickup_driver']);
        Route::post('notifications', [ApiController::class,'getNotificationListByUser']);
        Route::post('cancel-order', [ApiController::class,'cancelOrder']);
        Route::post('terms-and-conditions', [ApiController::class, 'getTermsAndConditions_driver']);
        Route::post('faq-list', [ApiController::class, 'get_faq_list_driver']);
        Route::post('pending-order-count', [ApiController::class, 'getPendingOrderCount']);
        Route::post('task-counts', [ApiController::class, 'getDriverTaskCounts']);

        Route::post('product-types',function(Request $req){
           return SystemSetting::product_types($req);
        });

        //getOrderDetails() returns order details with payment status. This method is called by both Driver app and Merchant app
        Route::post('ordder-details', [ApiController::class, 'getOrderDetails']);

        Route::post('set-password', [ApiController::class,'setPassword_driver']);
       
        Route::post('changepassword', [ApiController::class,'changePassword_driver']);
        //Driver=> after successfuly verifying OTP code, user submit new password. $d = {login_name,otp_code,password}
        Route::post('setpassword-otp', [ApiController::class,'setPassword_otp']);

         //Driver submit otp_code to update phone number
         Route::post('update-phone', [ApiController::class,'updatePhoneNumber_driver']);

        /** returns availbale pickup list for driver to accept **/
        Route::post('available-orders', [ApiController::class, 'getAvailableOrdersByDriver']);
        Route::post('zones', [ApiController::class, 'getZoneList']);

        // //for Pick and Book package one by one, returns barcode for printing if user(driver) wants
        // Route::post('pick-package', [ApiController::class, 'pickOrderPackage']);

         //for Pick and Book many packages at once, returns array of errors[] if any.
         Route::post('pick-packages', [ApiController::class, 'pickOrderPackages']);

        //$d ={order_id} //Driver app
        Route::post('picked-packages', [ApiController::class, 'getPackageListPerOrder']);
        //$d={order_id,bar_code}
        Route::post('delete-picked-packages', [ApiController::class, 'deleteOrderPakcages']);


        Route::post('pick-order', [ApiController::class, 'pickOrder']);
        /* returns list of accepted pickup list by a driver */
        Route::post('accepted-orders', [ApiController::class, 'getAcceptedOrdersByDriver']);
        ////Route::post('getZoneItems', [ApiController::class, 'getZoneItems']);
        //Route::post('getFormData_pickup_request', [ApiController::class, 'getFormData_pickup_request']);

        /** driver picks package one by one and then start delivery trip without coming to Office **/
        Route::post('pick-package-fast', [ApiController::class, 'pickOrderPackages_fast_delivery']);
        /** returns list of packages delivered by a driver. Each package has status as Delivered or Failed or Returned or Continue to Deliver **/

        Route::post('delivery-packages', [ApiController::class, 'getPackagesByDriver']);
        //Route::post('getPackageListByDriver', [ApiController::class, 'getPackageListByDriver']);

        //Driver find item or package by scanning barcode on home screen
        Route::post('find-items', [ApiController::class,'find_packages']);

        //$d = {sender_id,delivery_type,zone_code,billed_kg,price,df_payer} //Driver
        Route::post('price-info',[ApiController::class,'getPriceInfo_driver']);
        /** driver accepts to go pick up a delivery order **/
        Route::post('accept-order', [ApiController::class, 'acceptPickupRequest']);
        Route::post('exchange-rate', [ApiController::class, 'getExchangeRate']);

        Route::post('active-trips', [ApiController::class, 'getActiveTrips']);
        //returns a list of packages within a given delivery trip given by param @drivery_id
        Route::post('trip-packages', [ApiController::class, 'getPackageListByTrip']);
        Route::post('vehicle-types', [ApiController::class, 'getComboItems_vehicleType']);

        Route::post('update-package-status', [ApiController::class, 'updatePackageStatus_driver']);
        Route::post('finish-delivery', [ApiController::class, 'finishDeliveryTrip_driver']);
        Route::post('start-delivery', [ApiController::class, 'startDeliveryTrip_driver']);
        Route::post('remove-scanned-package', [ApiController::class, 'removeScannedPackage']);
        Route::post('trip-package-count', [ApiController::class, 'countPackagesByTrip']);
        //scan package out one by one for delivery (for driver app). $d = {driver_id,$barcode|$package_id}
        Route::post('scan-out', [ApiController::class, 'scanPackageOut_driver']);
        Route::post('delivery-items', [ApiController::class,'getDeliveryItems_driver_mobile']);

        /** For Old version of Driver app*/
        Route::post('commissions', [ApiController::class, 'getDriverCommissionItems_mobile']);
        /** For new version of Driver app*/
        Route::post('commission-report', [ApiController::class, 'getDriverCommissions']);
        Route::post('commission-summary', [ApiController::class, 'getDriverCommissions']);

        Route::post('update-profile', [ApiController::class, 'updateProfile_driver']);
        Route::post('report-data', [ApiController::class, 'getReportData_driver']);

        Route::post('merchant-list', [ApiController::class, 'getComboItems_merchant_mobile']);
        //Driver creates delivery order for a Merchant
        Route::post('create-delivery-order', [ApiController::class, 'savePickupRequest']);
        Route::post('create-order-photos', [ApiController::class, 'createOrderWithPhotos']);
        Route::post('pick-package-photos', [ApiController::class, 'pickPackagePhotos']);
        //amount of cash a driver has to pay to Express company
        Route::post('balance-due', [ApiController::class, 'getTotalDue_driver']);

        ////Send Simple Notification message for testing only
        //Route::post('sendNotificationMessage', [ApiController::class, 'sendNotificationMessage']);

        Route::post('profile-picture', [ApiController::class, 'getProfilePicture']);
        Route::post('profile-info', [ApiController::class, 'getProfileInfo']);
        Route::post('save-profile-picture', [ApiController::class, 'saveProfilePicture_driver']);
        Route::post('upload-profile-picture', [ApiController::class, 'saveProfilePicture_driver']);
        Route::post('profile-picture-url', [ApiController::class, 'getProfilePictureUrl_driver']);
        Route::post('my-tasks', [ApiController::class, 'getMyTasks']);
        Route::post('my-task-counts', [ApiController::class, 'getMyTaskCounts']);
        //Route::post('commissions', [ApiController::class,'getDriverCommissionItems_mobile']);
        Route::post('transactions', [ApiController::class,'getTransactionList_driver']);
        Route::post('payments', [ApiController::class,'getTransactions_driver']);
        Route::post('settled-items', [ApiController::class, 'getSettledPackages_driver']);
        Route::post('settled-packages', [ApiController::class, 'getSettledPackages_driver_old']);
        //*** $d = {'trx_type','trx_id','file_type','photo_data'}
        Route::post('save-trx-photo', [ApiController::class,'saveTransactionPhoto_driver']);
        //get brand-images ($app_id)
        Route::post('brand-images', [ApiController::class,'getBrandImages_mobile_driver']);
        Route::post('package-statuses',function(Request $request){
            $r =  SystemSetting::package_statuses($request);
            return makeJsonResponse($r);
         });   
    });
  //### end:: driver app api V2

     