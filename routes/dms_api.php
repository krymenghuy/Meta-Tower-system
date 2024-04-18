<?php
use App\Http\Middleware\CustomRateLimiter;
use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\Login\LoginController;
use App\Http\Controllers\Dms\PickupRequestController;
use App\Http\Controllers\Dms\OrderImageController;
use App\Http\Controllers\Dms\PackageController;
// use App\Http\Controllers\LocationController;

use App\Http\Controllers\Dms\SenderController;
use App\Http\Controllers\Dms\LeadController;
use App\Http\Controllers\Dms\DriverController;
use App\Http\Controllers\Dms\CompletedPackageController;
use App\Http\Controllers\Dms\CompanyProfileController;
use App\Http\Controllers\Dms\DeliveryZoneController;
use App\Http\Controllers\Dms\ReportController;
use App\Http\Controllers\Dms\PriceController; /** PriceController is for actual delivery prices by zone by service type and by weight */
use App\Http\Controllers\Dms\PriceListController; /** PriceListController is for quoted proce list */
use App\Http\Controllers\Dms\PosterController;
use App\Http\Controllers\Dms\DeliveryTripController;
use App\Http\Controllers\Dms\DashboardController;
use App\Http\Controllers\Dms\SalesAgentController;
use App\Http\Controllers\Dms\CommentController;
use App\Http\Controllers\Dms\MobileAppSettingsController;
use App\Http\Controllers\Dms\SocialMediaController;
use App\Http\Controllers\Dms\PromotionController;
use App\Http\Controllers\Dms\GeneralSettingsController;
use App\Http\Controllers\Dms\TransactionController;
use App\Http\Controllers\Dms\SystemSettingController;
//use App\Http\Controllers\ApiController;
use App\Http\Controllers\Dms\CurrencyController;
use App\Http\Controllers\Dms\CategoryController;
use App\Http\Controllers\Dms\RemarksController;
use App\Http\Controllers\Dms\WebReportController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\UMController;
use App\Http\Controllers\Dms\SalesCommissionPolicyController;
 

 //begin:: api without Authentication
    Route::middleware([CustomRateLimiter::class])->group(function(){
        // Route::post('logout', [ApiController::class,'logout_mobile']);
        // Route::post('auth/login', [ApiController::class, 'externalLogin']);
        Route::post('admin/login', [LoginController::class, 'apiLogin']);
        Route::post('vs-encrypt038111', [UMController::class, 'encryptData']);
        //Route::post('contact-info', [MobileAppSettingsController::class, 'getContactInfo']);
    });
    Route::post('admin/login', [LoginController::class, 'apiLogin']);

//end:: api without Authentication

//begin:: Admin notifications
    Route::middleware('auth.api', CustomRateLimiter::class)->group(function(){
        Route::post('pending-requests', [NotificationController::class, 'getPendingRequests']);
        Route::post('notifications', [NotificationController::class, 'getNotificationListByUser']);
        //Route::post('notifications',[ApiController::class,'getNotificationList_admin']);
        Route::post('unread-count',[ApiController::class,'getUnreadCount']);
        Route::post('mark-read-all',[ApiController::class,'markReadAll']);
    });
 //end:: Admin Notification
  
   Route::middleware(['auth.api', CustomRateLimiter::class])->group(function(){
   Route::post('report-center/report-list', [WebReportController::class, 'getReportList']);
   Route::post('report-center/reports-by-category', [WebReportController::class, 'getReportListByCategory']);
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
   Route::post('package/list', [PackageController::class, 'getOutstandingPackageList']);
   Route::post('package/save-label-print-count', [PackageController::class, 'saveLabelPrintCount']);

   Route::post('package/list-print', [PackageController::class, 'getOutstandingPackageList_print']);
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

    // //begin::LocationController
    // Route::middleware([CustomRateLimiter::class])->prefix('location')->group(function(){
    //     Route::post('/countries', [LocationController::class, 'getCountryList']);
    //     Route::post('/cities', [LocationController::class, 'getCityList']);
    //     Route::post('/districts', [LocationController::class, 'getDistrictList']);
    //     Route::post('/communes', [LocationController::class, 'getCommuneList']);

    //     Route::post('/options-country',[LocationController::class,'getComboItems_country']);

    //     Route::post('/options-city',[LocationController::class,'getComboItems_city']);

    //     Route::post('/options-district',[LocationController::class,'getComboItems_district']);

    //     Route::post('/options-commune',[LocationController::class,'getComboItems_commune']);

    //     Route::post('/country/save',[LocationController::class,'saveCountry']);

    //     Route::post('/country/delete',[LocationController::class,'deleteCountry']);

    //     Route::post('/city/save',[LocationController::class,'saveCity']);

    //     Route::post('/city/delete',[LocationController::class,'deleteCity']);

    //     Route::post('/district/save',[LocationController::class,'saveDistrict']);

    //     Route::post('/district/delete',[LocationController::class,'deleteDistrict']);

    //     Route::post('/commune/save',[LocationController::class,'saveCommune']);

    //     Route::post('/commune/delete',[LocationController::class,'deleteCommune']);
    // });      
    // //end::LocationController

     //begin:: Delivery ZONE
     Route::middleware([CustomRateLimiter::class])->prefix('zone')->group(function(){
            Route::post('form-options', [DeliveryZoneController::class, 'getFormOptions']);
            Route::post('details', [DeliveryZoneController::class, 'getZoneDetails']);
            Route::post('delete', [DeliveryZoneController::class, 'deleteZone']);
            Route::post('list', [DeliveryZoneController::class, 'getZoneList']);
            Route::post('list-all', [DeliveryZoneController::class, 'getZoneList_all']);
            Route::post('save', [DeliveryZoneController::class, 'saveZone']);
     });
    
//** begin::PriceController
        // Route::post('getApplicableZones', [PriceController::class, 'getApplicableZones']);
        // Route::post('getApplicableSenders', [PriceController::class, 'getApplicableSenders']);
        // Route::post('getCODFees', [PriceController::class, 'getCODFees']);
        // Route::post('saveCODFeeBySender', [PriceController::class, 'saveCODFeeBySender']); //Save COD Fee by Sender
        // Route::post('deleteCODFee', [PriceController::class, 'deleteCODFee']);


        Route::post('removeMerchantFromPriceList', [PriceController::class, 'removeMerchantFromPriceList']);
        Route::post('addMerchantToPriceList', [PriceController::class, 'addMerchantToPriceList']);

        Route::post('merchant/set-price-list', [SenderController::class, 'setPriceList']);
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
        Route::post('/reverse-to-lead', [SenderController::class, 'reverseToLead']);
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
 
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('sales-module/comments')->group(function(){
    Route::post('/list', [CommentController::class, 'getComments']);
    Route::post('/delete', [CommentController::class, 'deleteComment']);
    Route::post('/save', [CommentController::class, 'saveComment']);
});

//begin::MobileAppSettingController
    Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('mobile-settings')->group(function(){
        Route::post('/brand-images', [MobileAppSettingsController::class, 'getBrandImages']);
        Route::post('/save-brand-image', [MobileAppSettingsController::class, 'saveBrandImage']);
        Route::post('/delete-brand-image', [MobileAppSettingsController::class, 'deleteBrandImage']);
        Route::post('/connect-with-us', [CompanyProfileController::class, 'getConnectWithUsInfo']);
        Route::post('/terms-and-conditions', [MobileAppSettingsController::class, 'getTermsAndConditions']);
        Route::post('/save-terms-and-conditions', [MobileAppSettingsController::class, 'saveTermsAndConditions']);
        Route::post('/privacy-content', [MobileAppSettingsController::class, 'getPrivacyContent']);
        Route::post('/save-privacy-content', [MobileAppSettingsController::class, 'savePrivacyContent']);
    });
//end::MobileAppsettingsController
  
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('mobile-settings/social-media')->group(function(){
    Route::post('/save',[SocialMediaController::class,'save']);
    Route::post('/list',[SocialMediaController::class,'list']);
    Route::post('list-all',[SocialMediaController::class,'listAll']);
    Route::post('/details',[SocialMediaController::class,'details']);
    Route::post('/delete',[SocialMediaController::class,'delete']);
});
  
//begin::ReportController
    Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('rpt')->group(function(){
        Route::post('rpt_getSummaryData', [ReportController::class, 'getSummaryData']); 
    });
   
//end::ReportController
 
    // Route::group(['middleware' => 'cors'], function(){
    //     Route::post('package-photos-all', [ApiController::class, 'getPackagePhotos']);
    // });
 

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


Route::middleware('auth.api',CustomRateLimiter::class)->prefix('sales-module/posters')->group(function(){
    Route::post('/form-options', [PosterController::class, 'getFormOptions']);
    Route::post('/save', [PosterController::class, 'savePoster']);
    Route::post('/delete', [PosterController::class, 'deletePoster']);
    Route::post('/list', [PosterController::class, 'list']);
    Route::post('/details', [PosterController::class, 'getDetails']);
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
    Route::post('/save-profile-picture', [LeadController::class,'saveProfilePicture']);
    Route::post('/delete-profile-picture', [LeadController::class,'deleteProfilePicture']);
});

Route::middleware('auth.api',CustomRateLimiter::class)->prefix('sales-module/agent')->group(function(){
    Route::post('/save', [SalesAgentController::class, 'saveSalesAgent']);
    Route::post('/delete', [SalesAgentController::class, 'deleteSalesAgent']);
    Route::post('/update-status', [SalesAgentController::class, 'updateStatus']);
    Route::post('/list', [SalesAgentController::class, 'getList']);
    Route::post('/form-options', [SalesAgentController::class, 'getFormOptions']);
    Route::post('/details', [SalesAgentController::class, 'getDetails']);
    Route::post('/target-count', [SalesAgentController::class, 'getTargetCount']);
    Route::post('/payments', [SalesAgentController::class, 'getPayments']);
    Route::post('/commission-policy', [SalesAgentController::class, 'getCommissionPolicyDetails']);
    Route::post('/commission-summaries', [SalesAgentController::class, 'getCommissionSummaries']);
    Route::post('/closed-commissions', [SalesAgentController::class, 'getClosedCommissionSummaries']);
    Route::post('/live-commissions', [SalesAgentController::class, 'getLiveCommissionSummary']);
    
});
Route::middleware('auth.api',CustomRateLimiter::class)->prefix('sales-module/commission')->group(function(){
    Route::post('/pay', [SalesAgentController::class, 'makeCommissionPayment']);
    Route::post('/delete-payment', [SalesAgentController::class, 'deleteCommissionPayment']);
    Route::post('/payments', [SalesAgentController::class, 'getCommissionPayments']);
    Route::post('/monthly-payment', [SalesAgentController::class, 'getPaymentsByClosingId']);
    Route::post('/payment-form-options', [SalesAgentController::class, 'getPaymentFormOptions']);
    Route::post('/summaries', [SalesAgentController::class, 'getCommissionSummaries_backend']);
    Route::post('/close-summary', [SalesAgentController::class, 'closeCommissionSummary']);
    Route::post('/reopen-summary', [SalesAgentController::class, 'reopenCommissionSummary']);
    Route::post('/target-count-info', [SalesAgentController::class, 'getTargetCountInfo_realtime']);
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
    Route::post('/closed-summaries', [SalesAgentController::class, 'getClosedCommissionSummaries']);
    Route::post('/transactions', [SalesAgentController::class, 'getCommissionPayments']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('settings')->group(function(){
    Route::post('/options-mobile-app', [GeneralSettingsController::class, 'options_mobile_app']);
    Route::post('/options-driver', [GeneralSettingsController::class, 'getComboItems_driver']);
    Route::post('/options-active-driver', [GeneralSettingsController::class, 'options_driver_active']);
    Route::post('/options-active-merchant', [GeneralSettingsController::class, 'options_merchant_active']);
    Route::post('/options-delivery-zone', [GeneralSettingsController::class, 'getComboItems_delivery_zone']);
    Route::post('/options-warehouse', [GeneralSettingsController::class, 'getComboItems_warehouse']);
    Route::post('/options-delivery-status', [GeneralSettingsController::class, 'getComboItems_delivery_status']);
    Route::post('/options-pmt-status', [GeneralSettingsController::class, 'getComboItems_pmt_status']);
    Route::post('/options-complete-status', [GeneralSettingsController::class, 'getComboItems_complete_status']);
    Route::post('/options-sales-agent', [GeneralSettingsController::class, 'getComboItems_sales_agent']); 
    Route::post('/options-agent-status', [GeneralSettingsController::class, 'options_agent_status']); 
    Route::post('/options-sender', [PickupRequestController::class, 'getComboItems_sender']);
    Route::post('/options-calendar-month', [GeneralSettingsController::class, 'getOptions_calendar_month']);
    Route::post('/options-lead-status', [GeneralSettingsController::class, 'options_lead_status']);
 
    Route::post('/options-trxtype', function(){
    return [
         (object)['trx_type'=>'disbursement','name'=>'Money Out'],
         (object)['trx_type'=>'receipt','name'=>'Money In'],
    ];
  });

});