<?php
use Illuminate\Http\Request;
use App\Models\Notifier;
use App\Http\Middleware\CustomRateLimiter;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderImageController;
use App\Http\Controllers\MobileAppSettingsController;
use App\Http\Controllers\ApiController;
use App\Models\SystemSetting;

//use App\Models\PaymentTransaction;
   
 //begin:: api without Authentication
    Route::middleware([CustomRateLimiter::class])->group(function(){
        Route::post('logout', [ApiController::class,'logout_mobile']);
        Route::post('auth/login', [ApiController::class, 'externalLogin']);
        //Route::post('admin/login', [LoginController::class, 'apiLogin']);
        Route::post('contact-info', [MobileAppSettingsController::class, 'getContactInfo']);
    });
//end:: api without Authentication

//##begin:: Merchant app api V2
     Route::withoutMiddleware([CustomRateLimiter::class])->prefix('merchant/v2')->group(function(){
        Route::post('login', [ApiController::class, 'externalLogin']);
        Route::post('contact-info', [MobileAppSettingsController::class, 'getContactInfo']);
        Route::post('forget/send-phone-otp', [ApiController::class,'sendOTPCode_phone_merchant']);
        Route::post('forget/verify-otp', [ApiController::class,'matchOTP_merchant']);
        //$d = {phone_number,otp_code,password}
        Route::post('forget/reset-pwd', [ApiController::class,'resetPassword_merchant']);

          //Merchant or Sender downloads App and enter phone number and submit (api/reg-send-otp)
          Route::post('send-sms', [ApiController::class,'sendSMS']);
          Route::post('reg-send-otp', [ApiController::class,'send_otp_preregister_sender']);
          //After receiving otp by code, merchant enter OTP code in Mobile app and submit for verifying otp code
          Route::post('reg-verify-otp', [ApiController::class,'verify_otp_preregister_sender']);
          //After successfully verifying OTP code, register merchant by creating login name using his or her phone number
          Route::post('reg-merchant', [ApiController::class, 'registerSender']);

          Route::post('send-otp', [ApiController::class,'sendOTPCode_phone_merchant']);
              //$d = {delivery_type,zone_code,billed_kg,price,df_payer} //Merchant
              Route::post('price-info', [ApiController::class, 'getDeliveryPriceInfo']);
              Route::post('reg-merchant', [ApiController::class, 'registerSender']);

     });

     Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('merchant/v2')->group(function(){
                Route::post('user-info', [ApiController::class, 'getOfficialId_merchant']);
                Route::post('unread-count', [ApiController::class, 'getUnreadCount']);
                Route::post('mark-read', [ApiController::class, 'markRead_sender']);
                Route::post('mark-read-all', [ApiController::class, 'markReadAll']);
                Route::post('delete-notifications', [ApiController::class, 'deleteNotifications_sender']);
                Route::post('deactivate-me', [ApiController::class, 'deactivateMySelf_merchant']);
                Route::post('upload-package-photo', [ApiController::class, 'savePackage_photo']);
                //@params $d = {'barcode','id'}. Where id is the id of the photo or attachment
                Route::post('delete-package-photo', [ApiController::class, 'deletePackage_photo']);
                Route::post('package-photos', [ApiController::class, 'getPackage_photos']);
                //Upload order image.
                //@params $d = {'photo_data',[file_type],[order_id]}
                Route::post('save-order-image', [OrderImageController::class, 'saveOrderImage']);
                //@params $d = {order_id,id}. where $id is image id or file id
                Route::post('delete-order-image', [OrderImageController::class, 'deleteOrderImage']);
                Route::post('order-images', [OrderImageController::class, 'getOrderImages']);

              
                 //return list of filter status for History View on Merchant app
                 Route::post('history-filter-statuses', [ApiController::class, 'getComboItems_filter_status_sender']);
                 Route::post('history-filter-package-statuses', [ApiController::class, 'getComboItems_filter_package_status_sender']);
                /** for testing of calculating distance between two points in km or mile **/
                Route::post('distance',function(Request $request){
                    $d = Notifier::point2point_distance($request->lat1,$request->lon1,$request->lat2,$request->ln2,'K');
                    return response()->json($d."km");
                });
  
                    Route::post('changepassword', [ApiController::class,'changePassword_merchant']);
                    //Merchant=> after successfuly verifying OTP code, user submit new password. $d = {app_id,otp_code,password}
                    Route::post('setpassword-otp', [ApiController::class,'setPassword_otp']);

                    //returns list of COUNTS for Merchant's app home screen
                    Route::post('order-summary-counts', [ApiController::class,'getOrderSummaryCounts']);
                    Route::post('order-summary-list', [ApiController::class,'getOrderSummary_list']);

                    //PackageModel->findPackages_quick
                    Route::post('find-items', [ApiController::class,'find_packages']);

                    //Merchant submit otp_code to update phone number
                    Route::post('update-phone', [ApiController::class,'updatePhoneNumber_merchant']);

                    //param = {'user_class'= merchant }
                    Route::post('notifications', [ApiController::class,'getNotificationListByUser']);
                    //check if phone_number already in use? if not, send otp and wait to be verified
                    // name "register-send-otp" causes mysterious error of "cookie humans_2190 =1 ...", maybe word "register" is blocked
                    //##Registration merchant V2
                  
                    Route::post('outstanding-orders', [ApiController::class,'getOutstandingDeliveryOrders']);
                    /** for old version of Merchant App (HouXpress) */
                    Route::post('merchant-address', [ApiController::class,'getMerchantAddress']);

                    //return product-types for Merchant App
                    Route::post('product-types',function(Request $req){
                       return SystemSetting::product_types($req);
                    });

                    Route::post('send-sms-otp', [ApiController::class,'sendSMS_otp']);
                    Route::post('verify-otp', [ApiController::class,'verify_otp']);
                    Route::post('save-trx-photo', [ApiController::class,'saveTransactionPhoto_sender']);
                    Route::post('transactions', [ApiController::class,'getTransactionList_merchant']);
                    Route::post('payments', [ApiController::class,'getTransactions_merchant']);
                    Route::post('delivery-items', [ApiController::class,'getDeliveryItems_sender_mobile']);
                    Route::post('confirm-correct-amounts', [ApiController::class,'confirmCorrectAmounts']);
                    //maybe used for both Merchant and Driver apps
                    //brand-images {$app_id}
                    Route::post('brand-images', [ApiController::class,'getBrandImages_mobile_merchant']);
                    Route::post('promotions', [ApiController::class,'getPromotionList_merchant']);
                    Route::post('update-bank-account', [ApiController::class,'updateBankAccount']);
                    Route::post('add-bank-accounts', [ApiController::class,'addBankAccounts']);
                    Route::post('delete-bank-account', [ApiController::class,'deleteBankAccount']);
                    Route::post('save-profile-picture', [ApiController::class, 'saveProfilePicture_sender']);
                    Route::post('upload-profile-picture', [ApiController::class, 'saveProfilePicture_sender']);
                    Route::post('update-profile', [ApiController::class, 'updateProfile_sender']);
                    Route::post('profile-picture', [ApiController::class, 'getProfilePicture']);
                    Route::post('profile-picture-url', [ApiController::class, 'getProfilePictureUrl_sender']);
                    Route::post('profile-info', [ApiController::class, 'getProfileInfo']);
                    Route::post('bank-accounts', [ApiController::class, 'getBankAccounts_sender']);

                 
                    //update bank accounts by submitting array of accounts @bank_accounts
                    Route::post('save-bank-accounts', [ApiController::class, 'saveMerchantProfile_bank']);

                    Route::post('terms-and-conditions', [ApiController::class, 'getTermsAndConditions_merchant']);
                    Route::post('faq-list', [ApiController::class, 'get_faq_list_sender']);
                    Route::post('activate-account-otp', [ApiController::class, 'activateSender_otp']);
                    Route::post('zones', [ApiController::class, 'getZoneList']);

                    Route::post('exchange-rate', [ApiController::class, 'getExchangeRate']);
                    Route::post('/address', [ApiController::class, 'getMerchantAddress']);
                    //Merchant create delivery order from Mobile app
                    Route::post('create-delivery-order', [ApiController::class, 'savePickupRequest']);
                    Route::post('delivery-orders', [ApiController::class, 'getPickupListBySender']);
 
                     //Merchant to estimate price. $d = {delivery_type,zone_code,billed_kg,price,df_payer} //Merchant
                     Route::post('estimate-price', [ApiController::class, 'estimatePrice']);

                    //getOrderDetails() returns order details with payment status. This method is called by both Driver app and Merchant app
                    Route::post('order-details', [ApiController::class, 'getOrderDetails_sender']);

                    //This method currently avaialble only for driver app
                    //Route::post('vehicle-types', [ApiController::class, 'getComboItems_vehicleType']);
                    Route::post('set-password', [ApiController::class,'setPassword_sender']);
                    Route::post('settled-items', [ApiController::class, 'getSettledPackages_sender']);
                    Route::post('settled-packages', [ApiController::class, 'getSettledPackages_sender_old']);
                    Route::post('get-notifications', [ApiController::class,'getNotificationList_sender']);
                    Route::post('package-statuses',function(Request $request){
                        $r =  SystemSetting::package_statuses($request);
                        return makeJsonResponse($r);
                     });
                    Route::post('logout', [ApiController::class,'logout_mobile']);
                });
    //##end:: Merchant app api V2
 
  
 
 