<?php
use App\Http\Controllers\abm\CustomerController;
use Illuminate\Http\Request;
use App\Models\Notifier;
use App\Http\Middleware\CustomRateLimiter;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Login\LoginController;
use App\Http\Controllers\PickupRequestController;
use App\Http\Controllers\OrderImageController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\LocationController;
// use App\Http\Controllers\UMController;
use App\Http\Controllers\SenderController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\CompletedPackageController;
use App\Http\Controllers\CompanyProfileController;
use App\Http\Controllers\DeliveryZoneController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\PriceController; /** PriceController is for actual delivery prices by zone by service type and by weight */
use App\Http\Controllers\PriceListController; /** PriceListController is for quoted proce list */
use App\Http\Controllers\DeliveryTripController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SalesApp\SalesAppDashboardController;
use App\Http\Controllers\SalesAgentController;
use App\Http\Controllers\MobileAppSettingsController;
use App\Http\Controllers\SocialMediaController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\GeneralSettingsController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\SystemSettingController;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\CurrencyController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\RemarksController;
use App\Http\Controllers\WebReportController;

use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SalesCommissionPolicyController;
//use App\Http\Controllers\PusherController;

use App\Http\Controllers\abm\CountryZoneController;

use App\Models\PublicStorage;
use App\Models\SystemSetting;
//use App\Models\PaymentTransaction;

use App\Http\Controllers\ShipmentController;
use App\Http\Controllers\abm\OverseaShipmentController;
use App\Http\Controllers\abm\SupplierController;
use App\Http\Controllers\abm\SalesAgentsController;

/*
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });



Route::post('telegram/send', [ApiController::class, 'sendToTelegram']);

//begin:: Admin notifications
    Route::middleware('auth.api', CustomRateLimiter::class)->group(function(){
            Route::post('pending-requests', [NotificationController::class, 'getPendingRequests']);
            Route::post('notifications', [NotificationController::class, 'getNotificationListByUser']);
            //Route::post('notifications',[ApiController::class,'getNotificationList_admin']);
            Route::post('unread-count',[ApiController::class,'getUnreadCount']);
            Route::post('mark-read-all',[ApiController::class,'markReadAll']);
    });
 //end:: Admin Notification

 Route::middleware([CustomRateLimiter::class])->group(function(){
    Route::post('logout', [ApiController::class,'logout_mobile']);
    Route::post('auth/login', [ApiController::class, 'externalLogin']);
    Route::post('admin/login', [LoginController::class, 'apiLogin']);

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


     //Clear trash => to delete expired data such as expired notitifications
     Route::post('trash/clear',function(Request $req){
        $res = Notifier::clearNotifications(null);
        return response()->json($res);
    });
    Route::get('clear-trash',function(){
        $res = Notifier::clearNotifications(null);
        return response()->json($res);
    });


    //     Route::post('notify-mobile', function(Request $request){
    //         $cdata =[
    //             [
    //                 'user_class'=>'driver',
    //                 'target_user_id'=>28,
    //                 'title'=>'To Driver',
    //                 'message'=>'There is new delivery order',
    //                 'persist'=>0,
    //                 'data'=>null
    //             ],
    //             [
    //                 'user_class'=>'merchant',
    //                 'target_user_id'=>67,
    //                 'title'=>'To Merchant',
    //                 'message'=>'Available Order created',
    //                 'persist'=>0,
    //                 'data'=>null
    //             ]
    //         ];
    //         $res = Notifier::notify_mobile(1,$cdata);
    //         return $res;
    //    });

    /** begin:: API routes created for testing only */
        Route::post('mobile/notifications/send', [NotificationController::class, 'sendToMobile']);
        Route::get('mobile/notifications/send-get', [NotificationController::class, 'sendToMobile']); 
    /** end:: API routes created for testing only */

    Route::post('contact-info', [MobileAppSettingsController::class, 'getContactInfo']);
 });
//end:: api without Authentication

Route::middleware(['auth.api', CustomRateLimiter::class])->group(function(){
   Route::post('report-center/report-list', [WebReportController::class, 'getReportList']);
   Route::post('report-center/filter-options', [WebReportController::class, 'getReportFilterOptions']);

  //*** begin::legacy APIs from previous version
   Route::post('export/packages', [ReportController::class, 'getPackageList_export']);
   Route::post('dashboard/data', [DashboardController::class, 'getDashboardData']);
   Route::post('getPriceInfoByPackage', [PackageController::class, 'getPriceInfoByPackage']);
   Route::post('getZoneName', [DeliveryZoneController::class, 'getZoneName']);
   Route::post('getZoneInfo', [DeliveryZoneController::class, 'getZoneInfo']);

   Route::post('getMerchantsByPriceList', [PriceController::class, 'getMerchantsByPriceList']);
   Route::post('getPriceListIdBySearchValue', [PriceController::class, 'getPriceListIdBySearchValue']);

   Route::post('getMerchantBankInfo', [SenderController::class,'getMerchantBankInfo']);
   Route::post('savePickupRequest', [PickupRequestController::class, 'savePickupRequest']);
   //Route::post('getPickupList', [PickupRequestController::class, 'getPickupList']);
   Route::post('updateOrderStatus', [PickupRequestController::class, 'updateOrderStatus']);
   //Route::post('deletePickup', [PickupRequestController::class, 'deletePickup']);
   Route::post('getPickupInfo', [PickupRequestController::class, 'getPickupInfo']);
   Route::post('getComboItems_vehicleType', [PickupRequestController::class, 'getComboItems_vehicleType']);
   Route::post('getComboItems_sender', [PickupRequestController::class, 'getComboItems_sender']);
   Route::post('getForm_options_pickuplist', [PickupRequestController::class, 'getForm_options_pickuplist']);
   //Route::post('assignPickupDriver', [PickupRequestController::class, 'assignPickupDriver']);
   //Route::post('changePickupDriver', [PickupRequestController::class, 'changePickupDriver']);
   Route::post('updatePickup', [PickupRequestController::class, 'updatePickup']);
   Route::post('getFormData_pickup_request', [PickupRequestController::class, 'getFormData_pickup_request']);
   Route::post('getSenderPriceInfo', [PickupRequestController::class, 'getSenderPriceInfo']);
   Route::post('returnPackage', [PackageController::class, 'returnPackage']);

   //Route::post('getBillingTransactions', [PackageController::class, 'getBillingTransactions']); //deliveries list by driver
   Route::post('getDeliveryPriceInfo', [PackageController::class, 'getDeliveryPriceInfo_api']);
   
   Route::post('getPackageDetailsByBarcode', [PackageController::class, 'getPackageDetailsByBarcode']);
   Route::post('getPackageInfo', [PackageController::class, 'getPackageInfo']);

   Route::post('approveDriverChange', [DeliveryTripController::class, 'approveDriverChange']);
   Route::post('getPendingRequests', [DeliveryTripController::class, 'getPendingRequests']);
   Route::post('rejectDriverChange', [DeliveryTripController::class, 'rejectDriverChange']);

   Route::post('getPackageInfoByBarcode', [DeliveryTripController::class, 'getPackageInfoByBarcode']); //For scanning barcode to start Delivery trip
   Route::post('updatePackageExpandedDetails', [PackageController::class, 'updatePackageExpandedDetails']);
   Route::post('getOutstandingPackageList', [PackageController::class, 'getOutstandingPackageList']);
   Route::post('package/list', [PackageController::class, 'getOutstandingPackageList']);
   Route::post('package/save-label-print-count', [PackageController::class, 'saveLabelPrintCount']);
   Route::post('getOutstandingPackageList_print', [PackageController::class, 'getOutstandingPackageList_print']);
   Route::post('getPackageReceiverInfo', [PackageController::class, 'getPackageReceiverInfo']);
   Route::post('updatePackageReceiverInfo', [PackageController::class, 'updatePackageReceiverInfo']);
   Route::post('getPackageDetails', [PackageController::class, 'getPackageDetails']);
   Route::post('assignDeliveryDriver', [PackageController::class, 'assignDeliveryDriver']); // Assigning Driver also Change package's status automatically to "Delivery Started"

   Route::post('b_assignDeliveryDriver', [DeliveryTripController::class, 'b_assignDeliveryDriver']);
   Route::post('changeDeliveryDriver', [DeliveryTripController::class, 'changeDeliveryDriver']); //Change driver is for Admin user to change driver for a Fleet or deliver trip. This is for simple update of driver only
   Route::post('getReceiverInfo', [PackageController::class, 'getReceiverInfo']);

   Route::post('renamePriceList', [PriceController::class, 'renamePriceList']);
   Route::post('setMerchantPriceList', [PriceController::class, 'setMerchantPriceList']);
   Route::post('getDeliveryDetails', [PackageController::class, 'getDeliveryDetails']);
   Route::post('deletePackage', [PackageController::class, 'deletePackage']);

   Route::post('getDriverNameByCode', [PackageController::class, 'getDriverNameByCode']);
   Route::post('getSenderInfoByCode', [PackageController::class, 'getSenderInfoByCode']);
   //Route::post('deleteDelivery', [PackageController::class, 'deleteDelivery']);
   Route::post('getSenderInfoByOrderCode', [PackageController::class, 'getSenderInfoByOrderCode']);
   Route::post('getComboItems_driver', [PackageController::class, 'getComboItems_driver']);
 
   Route::post('person/find', [PackageController::class, 'findPersons']);
   Route::post('updatePackageStatus', [PackageController::class, 'updatePackageStatus']);
   Route::post('updatePackageStatus_driver', [DeliveryTripController::class, 'updatePackageStatus_driver']);

   Route::post('getComboItems_package_status', [PackageController::class, 'getComboItems_package_status']);
   Route::post('getTripInfo', [DeliveryTripController::class, 'getTripInfo']);
   //Route::post('getComboItems_delivery_status', [GeneralSettingsController::class, 'getComboItems_delivery_status']);
   Route::post('getOrderDetails', [PackageController::class, 'getOrderDetails']);
   Route::post('performPickup', [PackageController::class, 'performPickup']);
   Route::post('getSenderPromotionInfo', [PackageController::class, 'getSenderPromotionInfo']);
   Route::post('getSenderPriceByZone', [PackageController::class, 'getSenderPriceByZone']);

   //begin::DeliveryTripController
        Route::post('getDeliveryTrips_print', [DeliveryTripController::class,'getDeliveryTrips_print']);
        Route::post('removePackageFromTrip', [DeliveryTripController::class,'removePackageFromTrip']);
        Route::post('addPackageToTrip', [DeliveryTripController::class,'addPackageToTrip']);
        Route::post('getPackageListByTripId', [DeliveryTripController::class,'getPackageListByTripId']);
        Route::post('getPackageListByTripId_print', [DeliveryTripController::class,'getPackageListByTripId_print']);
        Route::post('getDeliveryTrips', [DeliveryTripController::class,'getDeliveryTrips']);
        Route::post('getPackagesByTrip', [DeliveryTripController::class, 'getPackagesByTrip']);
        Route::post('deleteDeliveryTrip', [DeliveryTripController::class, 'deleteDeliveryTrip']);
        Route::post('deleteNewTrip', [DeliveryTripController::class, 'deleteNewTrip']);
        Route::post('scanPackageOut', [DeliveryTripController::class, 'scanPackageOut']);
        Route::post('startDeliveryTrip', [DeliveryTripController::class, 'startDeliveryTrip']);
        Route::post('finishDeliveryTrip', [DeliveryTripController::class, 'finishDeliveryTrip']);
        Route::post('createDeliveryTrip', [DeliveryTripController::class, 'createDeliveryTrip']);
        Route::post('getForm_options_delivery_trip', [DeliveryTripController::class, 'getForm_options_delivery_trip']);
        Route::post('removeScannedPackage', [DeliveryTripController::class, 'removeScannedPackage']);
        Route::post('cleanEmptyTrip', [DeliveryTripController::class, 'cleanEmptyTrip']);
  //end::DeliverytripController

  //*** end::legacy APIs from previous version
});
/** end:: CustomRateLimiter WITHOUT any prefix */
Route::middleware([CustomRateLimiter::class])->prefix('shipments')->group(function(){
    Route::post('/save', [ShipmentController::class, 'save']);
    Route::post('/list', [ShipmentController::class, 'getShipmentList']);
});
Route::middleware([CustomRateLimiter::class])->prefix('os_suppliers')->group(function(){
    Route::post('/save', [SupplierController::class, 'save']);
    Route::post('/list', [SupplierController::class, 'getSuplierList']);
    Route::post('/list-paginate', [SupplierController::class, 'getSuplierListPaginate']);
});
Route::middleware([CustomRateLimiter::class])->prefix('oversea_shipments')->group(function(){
    Route::post('/save', [OverseaShipmentController::class, 'save']);
    Route::post('/Shipment-list', [OverseaShipmentController::class, 'getOverseaShipmentList']);

    Route::post('/create-item', [OverseaShipmentController::class, 'createOverseaItem']);
    Route::post('/item-list', [OverseaShipmentController::class, 'getOverseaItemList']);
});
 Route::middleware([CustomRateLimiter::class])->prefix('order')->group(function(){
            Route::post('/list', [PickupRequestController::class, 'getPickupList']);
            Route::post('/delete', [PickupRequestController::class, 'deletePickup']);
            Route::post('/package-details', [PickupRequestController::class, 'getOrderPackageDetails']);
            Route::post('/delete-package', [PickupRequestController::class, 'deleteOrderPackage']);
            Route::post('/save-package', [PickupRequestController::class, 'saveOrderPackageDetails']);

            Route::post('/info', [PickupRequestController::class, 'getOrderInfo']);
            Route::post('/pick', [PickupRequestController::class, 'pickOrderPackages']);
            Route::post('/package-list', [PickupRequestController::class, 'getOrderPackageList']);
            Route::post('/package-photos', [PickupRequestController::class, 'getOrderPackagePhotos']);
            Route::post('/delete-photos', [PickupRequestController::class, 'deletePackagePhotos']);
            Route::post('/change-driver', [PickupRequestController::class, 'changePickupDriver']);
            Route::post('/assign-driver', [PickupRequestController::class, 'assignPickupDriver']);
            //User click "Arrive" button to receive items
            Route::post('/receive', [PickupRequestController::class, 'receivePackages']);
            //Route::post('/merchant-address', [SenderController::class,'getVendorAddress']);
});
 
  //begin::PackageController new
         Route::middleware([CustomRateLimiter::class])->prefix('package')->group(function(){
            Route::post('/delete', [PackageController::class, 'deletePackage']);
            Route::post('/change-sender', [PackageController::class, 'changeSender']);
            Route::post('/change-merchant', [PackageController::class, 'changeSender']);
            Route::post('/price-info', [PackageController::class, 'getDeliveryPriceInfo_api']);
            Route::post('/details', [PackageController::class, 'getPackageDetails']);
         });
        //end::PackageController new


      
        //begin:: TransactionController

            //Route::post('merchant/transaction/save-photo', [TransactionController::class, 'saveTransactionPhoto']);
            //Route::post('driver/payments', [TransactionController::class, 'getPaymentsFromDriver']);

            Route::post('saveTransactionPhoto', [TransactionController::class, 'saveTransactionPhoto']);
            //Route::post('getPaymentsFromDriver', [TransactionController::class, 'getPaymentsFromDriver']);
            //Route::post('getTransactions_driver', [TransactionController::class, 'getTransactions_driver']);
            //Route::post('getPaymentsToDriver', [TransactionController::class, 'getPaymentsToDriver']);
            Route::post('getDriverPaymentTransactions', [TransactionController::class, 'getDriverPaymentTransactions']);

            // Route::post('deleteCashDisbursement', [TransactionController::class, 'deleteCashDisbursement']);
            // Route::post('deletePayment', [TransactionController::class, 'deletePayment']);
            // Route::post('receivePayment', [TransactionController::class, 'receivePayment']);
            // Route::post('receivePayments', [TransactionController::class, 'receivePayments']);
            // Route::post('payToVendor', [TransactionController::class, 'payToVendor']);
            // Route::post('getPaymentsFromSender', [TransactionController::class, 'getPaymentsFromSender']);
            // Route::post('getSenderPaymentTransactions', [TransactionController::class, 'getSenderPaymentTransactions']);
        //end::TransactionController

    //begin::LocationController
    Route::middleware([CustomRateLimiter::class])->prefix('location')->group(function(){
        Route::post('/countries', [LocationController::class, 'getCountryList']);
        Route::post('/cities', [LocationController::class, 'getCityList']);
        Route::post('/districts', [LocationController::class, 'getDistrictList']);
        Route::post('/communes', [LocationController::class, 'getCommuneList']);

        Route::post('/options-country',[LocationController::class,'getComboItems_country']);

        Route::post('/options-city',[LocationController::class,'getComboItems_city']);

        Route::post('/options-district',[LocationController::class,'getComboItems_district']);

        Route::post('/options-commune',[LocationController::class,'getComboItems_commune']);

        Route::post('/country/save',[LocationController::class,'saveCountry']);

        Route::post('/country/delete',[LocationController::class,'deleteCountry']);

        Route::post('/city/save',[LocationController::class,'saveCity']);

        Route::post('/city/delete',[LocationController::class,'deleteCity']);

        Route::post('/district/save',[LocationController::class,'saveDistrict']);

        Route::post('/district/delete',[LocationController::class,'deleteDistrict']);

        Route::post('/commune/save',[LocationController::class,'saveCommune']);

        Route::post('/commune/delete',[LocationController::class,'deleteCommune']);
    });      
    //end::LocationController
    

     //begin:: Delivery ZONE
     Route::middleware([CustomRateLimiter::class])->prefix('zone')->group(function(){
            Route::post('form-options', [DeliveryZoneController::class, 'getFormOptions']);
            Route::post('details', [DeliveryZoneController::class, 'getZoneDetails']);
            Route::post('delete', [DeliveryZoneController::class, 'deleteZone']);
            Route::post('list', [DeliveryZoneController::class, 'getZoneList']);
            Route::post('list-all', [DeliveryZoneController::class, 'getZoneList_all']);
            Route::post('save', [DeliveryZoneController::class, 'saveZone']);
     });

  

    
     //begin::PriceController
        Route::post('getSampleScript', [PriceController::class, 'getSampleScript']);
        Route::post('translateScript', [PriceController::class, 'translateScript']);
        Route::post('getApplicableZones', [PriceController::class, 'getApplicableZones']);
        Route::post('getApplicableSenders', [PriceController::class, 'getApplicableSenders']);
        Route::post('getCODFees', [PriceController::class, 'getCODFees']);
        Route::post('saveCODFeeBySender', [PriceController::class, 'saveCODFeeBySender']); //Save COD Fee by Sender
        Route::post('deleteCODFee', [PriceController::class, 'deleteCODFee']);


        Route::post('removeMerchantFromPriceList', [PriceController::class, 'removeMerchantFromPriceList']);
        Route::post('addMerchantToPriceList', [PriceController::class, 'addMerchantToPriceList']);

        Route::post('merchant/set-price-list', [SenderController::class, 'setPriceList']);
        Route::post('os_suppliers/set-price-list', [SupplierController::class, 'setSupplierPriceList']);
        Route::post('customer/set-price-list', [CustomerController::class, 'setPriceList']);
        Route::post('deletePriceZones', [PriceController::class, 'deletePriceZones']);
        //update only zone_codes list (price_list_id, org_zone_codes,zone_codes)
        Route::post('updateZoneCodes', [PriceController::class, 'updateZoneCodes']);
        Route::post('savePriceLineInfo', [PriceController::class, 'savePriceLineInfo']);
        Route::post('savePriceLineZones', [PriceController::class, 'savePriceLineZones']);

        Route::post('getPriceLineData', [PriceController::class, 'getPriceLineData']);
        Route::post('getPriceList', [PriceController::class, 'getPriceList']);
        Route::post('getPriceList_data', [PriceController::class, 'getPriceList_data']);
        Route::post('deletePriceList', [PriceController::class, 'deletePriceList']);
        Route::post('createPriceList', [PriceController::class, 'createPriceList']);
        Route::post('updatePriceList_kg_marker', [PriceController::class, 'updatePriceList_kg_marker']);
        Route::post('getComboItems_price_list', [PriceController::class, 'getComboItems_price_list']);

        Route::post('deletePriceLine', [PriceController::class, 'deletePriceLine']);
        Route::post('savePriceLine', [PriceController::class, 'savePriceLine']);
        Route::post('getFormOptions_priceline', [PriceController::class, 'getFormOptions_priceline']);
        Route::post('saveCODFeeCharge', [PriceController::class, 'saveCODFeeCharge']); //save default COD fee charge, NOT sender-sepcific (Not used)
        Route::post('getCODFeeCharge', [PriceController::class, 'getCODFeeCharge']);
        Route::post('getSenderBaseFees', [PriceController::class, 'getSenderBaseFees']);
        Route::post('saveBaseFee', [PriceController::class, 'saveBaseFee']);
        Route::post('deleteBaseFee', [PriceController::class, 'deleteBaseFee']);
     //end::PriceController


     //begin:: PromotionController
     Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('promotion')->group(function(){
        Route::post('/list', [PromotionController::class, 'getPromotionList']);
        Route::post('/save', [PromotionController::class, 'savePromotion']);
        Route::post('/details', [PromotionController::class, 'getPromotionInfo']);
        Route::post('delete', [PromotionController::class, 'deletePromotion']);
     });

    //end::PromotionController
 
//begin::SenderController
    Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('merchant')->group(function(){
        Route::post('/delivery-items', [PackageController::class, 'getDeliveryItemsBySender']); 
        Route::post('/save', [SenderController::class, 'saveSender']);
        Route::post('/delete', [SenderController::class, 'deleteSender']);
        Route::post('/delete-special', [SenderController::class, 'deleteSenderSpecial']);
        Route::post('/save-profile-picture', [SenderController::class, 'saveProfilePicture']);
        Route::post('/delete-profile-picture', [SenderController::class, 'deleteProfilePicture']);
        Route::post('/list', [SenderController::class, 'getSenderList']);
        Route::post('/list-all', [SenderController::class, 'getSenderList_all']);
        Route::post('/form-options', [SenderController::class, 'getFormOptions']);
        Route::post('/filter-options', [PackageController::class, 'getFilterOptions']);
        Route::post('/details', [SenderController::class, 'getSenderDetails']);
        Route::post('/update-status', [SenderController::class, 'updateSenderStatus']);
        Route::post('/payment/form-options', [TransactionController::class, 'getPaymentFormOptions']);
        Route::post('/payment/pay', [TransactionController::class, 'makePayment']);
        Route::post('/payment/receive', [TransactionController::class, 'receivePayment']);
        Route::post('/payment/delete', [TransactionController::class, 'deleteTransaction']);
        Route::post('/outstanding-balances', [TransactionController::class, 'getOutstandingPayments_merchant']);
        Route::post('/payment/list', [TransactionController::class, 'getTransactions_merchant']);
        Route::post('/address', [SenderController::class,'getVendorAddress']);
        Route::post('/location', [SenderController::class,'getMerchantLocation']);
        //Route::post('updateSenderStatus', [SenderController::class, 'updateSenderStatus']);
    });
//end::SenderController

   //begin:: Counties_Zone_Code

   Route::prefix('country')->group(function(){
    Route::post('/save',[CountryZoneController::class,'save']);
    Route::post('/delete',[CountryZoneController::class,'delete']);
    Route::post('/list-all',[CountryZoneController::class,'getCountryZoneList_all']);
    Route::post('/details',[CountryZoneController::class,'details']);

});

Route::prefix('customer')->group(function(){
    Route::post('/save',[CustomerController::class,'save']);
    Route::post('/save-sc',[CustomerController::class,'save_sc']);
    Route::post('/delete',[CustomerController::class,'deleteCustomer']);
    Route::post('/list-all',[CustomerController::class,'getList_all']);
    Route::post('/details',[CustomerController::class,'getCustomerDetails']);
    Route::post('/form-options',[CustomerController::class,'getFormOptions']);
    Route::post('/list',[CustomerController::class,'getList']);
    Route::post('/set-price-list', [CustomerController::class, 'setPriceList']);
    Route::post('/save-profile-picture', [CustomerController::class, 'saveProfilePicture']);
    Route::post('/delete-profile-picture', [CustomerController::class, 'deleteProfilePicture']);
});

Route::prefix('sales-agents')->group(function(){
    Route::post('/save', [SalesAgentsController::class, 'saveSalesAgents']);
    // Route::post('/delete', [SalesAgentsController::class, 'deleteSalesAgent']);
    // Route::post('/update-status', [SalesAgentController::class, 'updateStatus']);
     Route::post('/list', [SalesAgentController::class, 'getList']);
    // Route::post('/form-options', [SalesAgentController::class, 'getFormOptions']);
    // Route::post('/details', [SalesAgentController::class, 'getDetails']);
    // Route::post('/commission-policy', [SalesAgentController::class, 'getCommissionPolicyDetails']);
});

 
//begin::DriverController
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('driver')->group(function(){
        Route::post('/delivery-items', [PackageController::class, 'getDeliveryItemsByDriver']); //deliveries list by driver
        Route::post('/balances', [DriverController::class, 'getDriverBalanceDues']);
        Route::post('/payment/form-options', [TransactionController::class, 'getPaymentFormOptions']);
       //Driver/form-options
       Route::post('form-options', [DriverController::class, 'getFormOptions']);
       Route::post('/save', [DriverController::class, 'saveDriver']);
       Route::post('/delete', [DriverController::class, 'deleteDriver']);
       Route::post('/list', [DriverController::class, 'getDriverList']);
       Route::post('update-status', [DriverController::class, 'updateDriverStatus']);
       Route::post('/details', [DriverController::class, 'getDetails']);
        Route::post('/payment/pay', [TransactionController::class, 'makePayment']);
        Route::post('/payment/receive', [TransactionController::class, 'receivePayment']);
        Route::post('/payment/settle-zero', [TransactionController::class, 'settleZero_driver']);
        Route::post('/payment/list', [TransactionController::class, 'getTransactions_driver']);
        Route::post('/payment/delete-photo', [TransactionController::class, 'deleteTransactionPhoto']);
        Route::post('/payment/delete', [TransactionController::class, 'deleteTransaction']);
        Route::post('/payment/authorize', [TransactionController::class, 'authorizePayment_driver']);
        /** authorized all does not always means all. In fact, it auhorize selected transactions, can be many depends on user selected filters */
        Route::post('/payment/bulk-authorize', [TransactionController::class, 'authorizePayments_driver']);
        Route::post('/commissions/save', [DriverController::class, 'saveDriverCommissions']);
        Route::post('/commissions', [DriverController::class, 'getDriverCommissions']);
    });
 
 
    
  
//end::DriverController

//begin::SystemSettingController
    Route::post('getComboItems_price_list',[SystemSettingController::class,'getComboItems_price_list']);
    Route::post('magic-entry/calculate', [PackageController::class, 'getDeliveryPriceInfo_magicEntry']);
    Route::post('magic-entry/data', [SystemSettingController::class, 'getData_magicEntry']);
    Route::post('magic-entry/order-info', [PickupRequestController::class, 'getOrderInfo_magicEntry']);
    //returns list of orders belonging to a Merchant on selected on Magic Entry form
    Route::post('magic-entry/order-list',[SystemSettingController::class,'getOrderListByMerchant']);
//end::SystemSettingController

 //begin:: PackageController
 Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('package')->group(function(){
    Route::post('/receiver-info', [PackageController::class, 'getReceiverInfo']);
    Route::post('/details', [PackageController::class, 'getPackageDetails']);
    Route::post('/details-with-options', [PackageController::class, 'getPackageDetailsWithOptions']);
    Route::post('/details-by-barcode', [PackageController::class, 'getPackageDetailsByBarcode']);
    Route::post('/info', [PackageController::class, 'getPackageInfo']);
    Route::post('/update', [PackageController::class, 'updatePackageExpandedDetails']);
    Route::post('/price-info', [PackageController::class, 'getDeliveryPriceInfo_api']);
 });
 //end:: packageController

//begin::CompletedPackageController
   Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('completed-package')->group(function(){
      Route::post('form-options', [CompletedPackageController::class, 'getFormOptions']);
      Route::post('/list-all', [CompletedPackageController::class, 'getListAll']);
      Route::post('/list', [CompletedPackageController::class, 'getList']);
      Route::post('/delete', [CompletedPackageController::class, 'deletePackage']);
      //Route::post('updateAgentPackage', [CompletedPackageController::class, 'updateAgentPackage']);
   });
//end::CompletedPackageController

//begin::CompanyProfileController
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('company')->group(function(){
    Route::post('/save-logo', [CompanyProfileController::class, 'saveCompanyLogo']);
    Route::post('/logo-url', [CompanyProfileController::class, 'getCompanyLogo']);
    Route::post('/delete-logo', [CompanyProfileController::class, 'deleteCompanyLogo']);
    Route::post('/save-details', [CompanyProfileController::class, 'saveCompanyInfo']);
    Route::post('/details', [CompanyProfileController::class, 'getCompanyInfo']);
    Route::post('/info', [CompanyProfileController::class, 'getCompanyInfo']);
});
//end::CompanyProfileController

//begin::MobileAppSettingController
    Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('mobile-settings')->group(function(){
        Route::post('/brand-images', [MobileAppSettingsController::class, 'getBrandImages']);
        Route::post('/save-brand-image', [MobileAppSettingsController::class, 'saveBrandImage']);
        Route::post('/delete-brand-image', [MobileAppSettingsController::class, 'deleteBrandImage']);
        Route::post('/connect-with-us', [CompanyProfileController::class, 'getConnectWithUsInfo']);
    });
//end::MobileAppsettingsController
  
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('mobile-settings/social-media')->group(function(){
    Route::post('/save',[SocialMediaController::class,'save']);
    Route::post('/list',[SocialMediaController::class,'list']);
    Route::post('list-all',[SocialMediaController::class,'listAll']);
    Route::post('/details',[SocialMediaController::class,'details']);
    Route::post('/delete',[SocialMediaController::class,'delete']);
});

Route::middleware([CustomRateLimiter::class])->prefix('sales-app')->group(function(){
    Route::post('/banners', [SalesAgentController::class,'getBrandImages_mobile']);
    Route::post('/login', [SalesAgentController::class, 'login']);
});

Route::middleware(CustomRateLimiter::class)->prefix('sales-app')->group(function(){
    Route::post('forget/send-phone-otp', [SalesAgentController::class,'forget_send_otp']);
    Route::post('forget/verify-otp', [SalesAgentController::class,'forget_verify_otp']);
    //$d = {phone_number,otp_code,password}
    Route::post('forget/reset-pwd', [SalesAgentController::class,'forget_reset_password']);
});

Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('sales-app')->group(function(){
   Route::post('/home/cards', [SalesAppDashboardController::class, 'getCards']);
   Route::post('/home/current-month', [SalesAppDashboardController::class, 'getCurrentMonthData']);
   Route::post('/home/line-chart', [SalesAppDashboardController::class, 'getLineChartData']);
   Route::post('/commission-policy', [SalesAgentController::class, 'getCommissionPolicyDetails']);

   Route::post('/profile-info', [SalesAgentController::class, 'getProfileInfo']);
   Route::post('/update-profile', [SalesAgentController::class, 'updateProfile']);
   Route::post('/ca', [SalesAgentController::class, 'updateProfile']);
   Route::post('update-phone', [SalesAgentController::class,'updatePhoneNumber']);
   Route::post('/register', [SalesAgentController::class, 'register']);
   Route::post('/register/send-otp', [SalesAgentController::class,'send_otp_preregister']);
   Route::post('/register/verify-otp', [SalesAgentController::class,'verify_otp_preregister']);
   Route::post('/deactivate', [SalesAgentController::class, 'deactivate']);
   //Route::post('/package-summary', [SalesAgentController::class, 'getSummaryPackagesByMonth']);
   Route::post('/commission-summary', [SalesAgentController::class, 'getCommissionSummary']);
   Route::post('/price-list', [PriceListController::class, 'options_price_list']);
   Route::post('/price-list-details', [PriceListController::class, 'getItems']);
});

Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('sales-app/merchant')->group(function(){
    Route::post('/list', [SalesAgentController::class,'getMerchantList']);
    Route::post('/list-all', [SalesAgentController::class,'getMerchantList_all']);
});

Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('sales-app/lead')->group(function(){
    Route::post('/list', [LeadController::class, 'getList_paginate']);
    Route::post('/list-all', [LeadController::class, 'getList_all']);
    Route::post('/details', [LeadController::class, 'getDetails']);
    Route::post('/delete', [LeadController::class, 'deleteLead']);
    Route::post('/save', [LeadController::class, 'saveLead']);
    Route::post('/options-status', [LeadController::class, 'getOptions_status']);
    Route::post('/options-category', [LeadController::class, 'getOptions_category']);
    Route::post('/options-business-type', [LeadController::class, 'getOptions_business_type']);
    Route::post('/submit-for-review', [LeadController::class, 'submitForReview']);
    Route::post('/update-status', [LeadController::class, 'updateStatus']);
});

//begin::ReportController
    Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('rpt')->group(function(){
        Route::post('rpt_getSummaryData', [ReportController::class, 'getSummaryData']); 
    });
   
//end::ReportController


    // //getMobileBrandImages()
    //  Route::post('getMobileBrandImages', [MobileAppSettingsController::class, 'getMobileBrandImages']);
    //  Route::post('saveBrandImage', [MobileAppSettingsController::class, 'saveBrandImage']);
    //  Route::post('deleteBrandImage', [MobileAppSettingsController::class, 'deleteBrandImage']);


/***### ROUTES FOR EXTERNAL API (V1) ##****/
//begin::API routes for external calls

        //// ***Allow 3 API calls per 10 minutes ***/
        // Route::group(['middleware' => 'cors','middleware' => 'throttle:3,10'], function(){
        //     Route::prefix('v1')->group(function(){
        //         Route::post('externalLogin', [ApiController::class, 'externalLogin']);
        //         Route::post('savePickupRequest', [ApiController::class, 'savePickupRequest']);
        //         Route::post('getPickupList', [PickuprequestController::class, 'getPickupList']);
        //     });
        // });
    Route::group(['middleware' => 'cors'], function(){
        Route::post('package-photos-all', [ApiController::class, 'getPackagePhotos']);
    });

//end::API routes for external calls

//begin::Currency APIs
    Route::prefix('currency')->group(function(){
        Route::post('options-month', [CurrencyController::class,'getComboItems_x_month']);
        Route::post('save', [CurrencyController::class,'saveCurrency']);
        Route::post('delete', [CurrencyController::class,'deleteCurrency']);
        Route::post('list', [CurrencyController::class,'getCurrencies']);
        Route::post('create-currency-pair', [CurrencyController::class,'createCurrencyPair']);
        Route::post('delete-currency-pair', [CurrencyController::class,'deleteCurrencyPair']);
        Route::post('exchange-rate-info', [CurrencyController::class,'getExchangeRateInfo']);
        Route::post('delete-exchange-rate', [CurrencyController::class,'deleteExchangeRate']);
        Route::post('exchange-rate-list', [CurrencyController::class,'getExchangeRates']);
        Route::post('save-exchange-rate', [CurrencyController::class,'saveExchangeRate']);
        Route::post('apply-exchange-rate', [CurrencyController::class,'applyExchangeRate']);
        Route::post('currency-pairs-list', [CurrencyController::class,'getCurrencyPairs']);
    });
//begin::Currency APIs

//begin::Category APIs
    Route::prefix('category')->group(function(){
        Route::post('save', [CategoryController::class,'saveCategory']);
        Route::post('delete', [CategoryController::class,'deleteCategory']);
        Route::post('list', [CategoryController::class,'getCategories']);
        Route::post('list-paginate', [CategoryController::class,'getCategories_paginate']);
        Route::post('details', [CategoryController::class,'getCategoryDetails']);
    });
//begin::Category APIs

//begin::Remarks APIs
Route::prefix('remarks')->group(function(){
    Route::post('save', [RemarksController::class,'saveRemarks']);
    Route::post('delete', [RemarksController::class,'deleteRemarks']);
    Route::post('list', [RemarksController::class,'getRemarksList']);
    Route::post('list-paginate', [RemarksController::class,'getRemarksList_paginate']);
    Route::post('details', [RemarksController::class,'getRemarksDetails']);
});
//begin::Remarks APIs

//begin::OrderImageController APIs
Route::prefix('img-order')->group(function(){
    //returns a list of image orders (order.detail_type ='images')
    Route::post('list', [OrderImageController::class,'getOrderList']);
     //returns list of images per order
    Route::post('images', [OrderImageController::class,'getImagesByOrder']);
    //find images by [sender_id, start_date,end_date,order_id] and returns a list of iamges

    Route::post('list-images', [OrderImageController::class,'getImages']);
    Route::post('delete-image', [OrderImageController::class,'deleteOrderImage']);
    Route::post('delete-order', [ApiController::class,'deleteImageOrder']);

});
  
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

    // Route::post('notify-admin',function(Request $request){
    //     $data = (object)['order_id'=>125,'merchant_name'=>'Super shop ONE'];
    //    Notifier::notify_admin('onOrderCreated',$data);
    // });

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
 
                    // Route::post('public-storage',function(){
                    //     return PublicStorage::getUrl(1,'merchant','image');
                    // });

                    // Route::post('storage-url',function(){
                    //     //$path =  getStorageUrl();
                    //     $path = $_SERVER['SERVER_NAME']; // $_SERVER['PHP_SELF'];
                    //     return $path;
                    // });
                  
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

Route::middleware([CustomRateLimiter::class])->prefix('quick-order')->group(function(){
    Route::post('/create', [PickupRequestController::class, 'createQuickOrder']);
    Route::post('/form-options', [PickupRequestController::class, 'getFormOptions']);
});

Route::middleware('auth.api',CustomRateLimiter::class)->prefix('sales-module/price-list')->group(function(){
    Route::post('/form-options', [PriceListController::class, 'getFormOptions']);
    Route::post('/save-item', [PriceListController::class, 'saveItem']);
    Route::post('/item-details', [PriceListController::class, 'getItemDetails']);
    Route::post('/delete-item', [PriceListController::class, 'deleteItem']);

    Route::post('/save', [PriceListController::class, 'savePriceList']);
    Route::post('/delete', [PriceListController::class, 'deletePriceList']);
    Route::post('/items', [PriceListController::class, 'getItems']);
});
 
Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('sales-module/lead')->group(function(){
    Route::post('/details', [LeadController::class,'getLeaddetails']);
    Route::post('/form-options', [LeadController::class,'getFormOptions']);
    Route::post('/save', [LeadController::class,'saveLead']);
    Route::post('/delete', [LeadController::class,'deleteLead']);
    Route::post('/delete-special', [LeadController::class,'deleteSpecial']);
    Route::post('/list-paginate', [LeadController::class,'getList_paginate']);
    Route::post('/list-all', [LeadController::class,'getList_all']);
    Route::post('/update-status', [LeadController::class,'updateStatus']);
    Route::post('/convert-to-merchant',[LeadController::class,'convertToMerchant']);
});

Route::middleware('auth.api',CustomRateLimiter::class)->prefix('sales-module/agent')->group(function(){
    Route::post('/save', [SalesAgentController::class, 'saveSalesAgent']);
    Route::post('/delete', [SalesAgentController::class, 'deleteSalesAgent']);
    Route::post('/update-status', [SalesAgentController::class, 'updateStatus']);
    Route::post('/list', [SalesAgentController::class, 'getList']);
    Route::post('/form-options', [SalesAgentController::class, 'getFormOptions']);
    Route::post('/details', [SalesAgentController::class, 'getDetails']);
    Route::post('/commission-policy', [SalesAgentController::class, 'getCommissionPolicyDetails']);
});

Route::middleware('auth.api',CustomRateLimiter::class)->prefix('sales-module/commission-policy')->group(function(){
    Route::post('/save-item', [SalesCommissionPolicyController::class, 'saveItem']);
    Route::post('/item-details', [SalesCommissionPolicyController::class, 'getItemDetails']);
    Route::post('/items', [SalesCommissionPolicyController::class, 'getItems']);
    Route::post('/delete-item', [SalesCommissionPolicyController::class, 'deleteItem']);
 
    Route::post('/delete', [SalesCommissionPolicyController::class, 'deletePolicy']);
    Route::post('/save', [SalesCommissionPolicyController::class, 'savePolicy']);
    Route::post('/item-form-options', [SalesCommissionPolicyController::class, 'getItemFormOptions']);
    Route::post('/form-options', [SalesCommissionPolicyController::class, 'getFormOptions']);
});

Route::middleware('auth.api',CustomRateLimiter::class)->prefix('sales-module')->group(function(){
    Route::post('/commission-policy', [SalesAgentController::class, 'getCommissionPolicyDetails']);
});
 
Route::middleware('auth.api',CustomRateLimiter::class)->prefix('sales-module/commission-payments')->group(function(){
    Route::post('/form-options', [SalesAgentController::class, 'getPaymentFormOptions']);
    Route::post('/summary', [SalesAgentController::class, 'getCommissionSummary']);
    Route::post('/transactions', [SalesAgentController::class, 'getCommissionPayments']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('settings')->group(function(){
    Route::post('/options-driver', [GeneralSettingsController::class, 'getComboItems_driver']);
    Route::post('/options-delivery-zone', [GeneralSettingsController::class, 'getComboItems_delivery_zone']);
    Route::post('/options-warehouse', [GeneralSettingsController::class, 'getComboItems_warehouse']);
    Route::post('/options-delivery-status', [GeneralSettingsController::class, 'getComboItems_delivery_status']);
    Route::post('/options-pmt-status', [GeneralSettingsController::class, 'getComboItems_pmt_status']);
    Route::post('/options-complete-status', [GeneralSettingsController::class, 'getComboItems_complete_status']);
    Route::post('/options-sales-agent', [GeneralSettingsController::class, 'getComboItems_sales_agent']); 
    Route::post('/options-agent-status', [GeneralSettingsController::class, 'options_agent_status']); 

    Route::post('/options-sender', [PickupRequestController::class, 'getComboItems_sender']);
    Route::post('/options-lead-status', [GeneralSettingsController::class, 'options_lead_status']);
    Route::post('/options-trxtype', function(){
    return [
         (object)['trx_type'=>'disbursement','name'=>'Money Out'],
         (object)['trx_type'=>'receipt','name'=>'Money In'],
    ];
  });
    
});