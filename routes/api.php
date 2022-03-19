<?php

use Illuminate\Http\Request;
use App\Models\SMS;
use App\Models\Notifier;
use App\Models\UM;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PickupRequestController;
use App\Http\Controllers\Api\PackageController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\UMController;
use App\Http\Controllers\Api\SenderController;
use App\Http\Controllers\Api\DriverController;
use App\Http\Controllers\Api\CompletedPackageController;
use App\Http\Controllers\Api\CompanyProfileController;
use App\Http\Controllers\Api\DeliveryZoneController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\PriceController;
use App\Http\Controllers\Api\DeliveryTripController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\SalesAgentController;
use App\Http\Controllers\Api\MobileAppSettingsController;
use App\Http\Controllers\Api\PromotionController;
use App\Http\Controllers\Api\GeneralSettingsController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\SystemSettingController;
use App\Http\Controllers\Api\ApiController;

//use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PusherController;

use App\Models\PublicStorage;
use App\Models\SystemSetting;
 
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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('broadcast/auth', [PusherController::class, 'pusherAuth']); //->middleware('auth');
 
Route::post('send-message', function(Request $request){
        //    $d =  Notifier::notify_admin('MessageReceived',$request->data);
      
      $data =(object)['message'=>'new order created','branch_id'=>1,'user_id'=>1];
      $d = Notifier::notify_admin('merchant_created_order',$data);
      return response()->json($d);
});

//No rate limit per minute for ajax search function
Route::post('getMerchantsByPriceList', [PriceController::class, 'getMerchantsByPriceList']);
Route::post('getPriceListIdBySearchValue', [PriceController::class, 'getPriceListIdBySearchValue']);

// Rate Limiting for a whole group of routes= > allow 200 requests per 1 minute
Route::group(['middleware' => 'throttle:200,1'], function () {
        Route::post('pickOrderPackages', [PickupRequestController::class, 'pickOrderPackages']);
        Route::post('deleteOrderPackage', [PickupRequestController::class, 'deleteOrderPackage']);
        Route::post('saveOrderPackageDetails', [PickupRequestController::class, 'saveOrderPackageDetails']);
        Route::post('getOrderPackageDetails', [PickupRequestController::class, 'getOrderPackageDetails']);
        Route::post('getOrderPackageList', [PickupRequestController::class, 'getOrderPackageList']);
        Route::post('getOrderInfo', [PickupRequestController::class, 'getOrderInfo']);
        Route::post('getVendorAddress', [SenderController::class,'getVendorAddress']);
        Route::post('savePickupRequest', [PickupRequestController::class, 'savePickupRequest']);
        Route::post('getPickupList', [PickupRequestController::class, 'getPickupList']);
        Route::post('updateOrderStatus', [PickupRequestController::class, 'updateOrderStatus']);
        Route::post('deletePickup', [PickupRequestController::class, 'deletePickup']);
        Route::post('getPickupInfo', [PickupRequestController::class, 'getPickupInfo']);
        Route::post('getComboItems_vehicleType', [PickupRequestController::class, 'getComboItems_vehicleType']);
        Route::post('getComboItems_sender', [PickupRequestController::class, 'getComboItems_sender']);
        Route::post('getForm_options_pickuplist', [PickupRequestController::class, 'getForm_options_pickuplist']);
        Route::post('assignPickupDriver', [PickupRequestController::class, 'assignPickupDriver']);
        Route::post('changePickupDriver', [PickupRequestController::class, 'changePickupDriver']);
        Route::post('updatePickup', [PickupRequestController::class, 'updatePickup']);
        Route::post('getFormData_pickup_request', [PickupRequestController::class, 'getFormData_pickup_request']);
        Route::post('getSenderPriceInfo', [PickupRequestController::class, 'getSenderPriceInfo']);
        Route::post('returnPackage', [PackageController::class, 'returnPackage']);
        Route::post('getDeliveryItemsBySender', [PackageController::class, 'getDeliveryItemsBySender']); //deliveries list by driver
    
       
        Route::post('getDeliveryItemsByDriver', [PackageController::class, 'getDeliveryItemsByDriver']); //deliveries list by driver
    
        //Route::post('getBillingTransactions', [PackageController::class, 'getBillingTransactions']); //deliveries list by driver
        Route::post('getDeliveryPriceInfo', [PackageController::class, 'getDeliveryPriceInfo_api']);
        Route::post('getPackageDetailsByBarcode', [PackageController::class, 'getPackageDetailsByBarcode']);
        Route::post('getPackageInfo', [PackageController::class, 'getPackageInfo']);
        Route::post('getPackageInfoByBarcode', [DeliveryTripController::class, 'getPackageInfoByBarcode']); //For scanning barcode to start Delivery trip
        Route::post('updatePackageExpandedDetails', [PackageController::class, 'updatePackageExpandedDetails']);
        Route::post('getOutstandingPackageList', [PackageController::class, 'getOutstandingPackageList']);
        Route::post('getOutstandingPackageList_print', [PackageController::class, 'getOutstandingPackageList_print']);
        Route::post('getPackageReceiverInfo', [PackageController::class, 'getPackageReceiverInfo']);
        Route::post('updatePackageReceiverInfo', [PackageController::class, 'updatePackageReceiverInfo']);
        Route::post('getPackageDetails', [PackageController::class, 'getPackageDetails']);
        Route::post('assignDeliveryDriver', [PackageController::class, 'assignDeliveryDriver']); // Assigning Driver also Change package's status automatically to "Delivery Started" 
        
        Route::post('b_assignDeliveryDriver', [DeliveryTripController::class, 'b_assignDeliveryDriver']);
        Route::post('changeDeliveryDriver', [DeliveryTripController::class, 'changeDeliveryDriver']); //Change driver is for Admin user to change driver for a Fleet or deliver trip. This is for simple update of driver only 
        Route::post('getReceiverInfo', [PackageController::class, 'getReceiverInfo']);
       
        Route::post('getDeliveryDetails', [PackageController::class, 'getDeliveryDetails']);
        Route::post('deletePackage', [PackageController::class, 'deletePackage']);
        
        Route::post('createDelivery', [PackageController::class, 'createDelivery']);
        Route::post('updateDelivery', [PackageController::class, 'updateDelivery']);
        Route::post('getDriverNameByCode', [PackageController::class, 'getDriverNameByCode']);
        Route::post('getSenderInfoByCode', [PackageController::class, 'getSenderInfoByCode']);
        //Route::post('deleteDelivery', [PackageController::class, 'deleteDelivery']);
        Route::post('getSenderInfoByOrderCode', [PackageController::class, 'getSenderInfoByOrderCode']);
        Route::post('getComboItems_driver', [PackageController::class, 'getComboItems_driver']);
        Route::post('getForm_options_package_list', [PackageController::class, 'getForm_options_package_list']);
        Route::post('findPersons', [PackageController::class, 'findPersons']);
        Route::post('updatePackageStatus', [PackageController::class, 'updatePackageStatus']);
        Route::post('updatePackageStatus_driver', [DeliveryTripController::class, 'updatePackageStatus_driver']);
        
        Route::post('getComboItems_package_status', [PackageController::class, 'getComboItems_package_status']);
        Route::post('getTripInfo', [DeliveryTripController::class, 'getTripInfo']);
        Route::post('getComboItems_delivery_status', [DeliveryTripController::class, 'getComboItems_delivery_status']);
        Route::post('getOrderDetails', [PackageController::class, 'getOrderDetails']);
        Route::post('performPickup', [PackageController::class, 'performPickup']);
        Route::post('getSenderPromotionInfo', [PackageController::class, 'getSenderPromotionInfo']);
        Route::post('getSenderPriceByZone', [PackageController::class, 'getSenderPriceByZone']);
        Route::post('receivePackages', [PackageController::class, 'receivePackages']);
         
        //begin:: TransactionController
            Route::post('saveTransactionPhoto', [TransactionController::class, 'saveTransactionPhoto']);
            Route::post('getPaymentsFromDriver', [TransactionController::class, 'getPaymentsFromDriver']);
            Route::post('getPaymentsToDriver', [TransactionController::class, 'getPaymentsToDriver']);
            Route::post('getDriverPaymentTransactions', [TransactionController::class, 'getDriverPaymentTransactions']);
            Route::post('deleteTransactionPhoto', [TransactionController::class, 'deleteTransactionPhoto']);
            Route::post('deleteTransaction', [TransactionController::class, 'deleteTransaction']);
            Route::post('deleteCashDisbursement', [TransactionController::class, 'deleteCashDisbursement']);
            Route::post('deletePayment', [TransactionController::class, 'deletePayment']);
            Route::post('receivePayment', [TransactionController::class, 'receivePayment']);
            Route::post('receivePayments', [TransactionController::class, 'receivePayments']);
            Route::post('payToVendor', [TransactionController::class, 'payToVendor']);

            Route::post('getPaymentsFromSender', [TransactionController::class, 'getPaymentsFromSender']);
            Route::post('getVendorTransactions', [TransactionController::class, 'getTransactionList_merchant']);
            Route::post('getSenderPaymentTransactions', [TransactionController::class, 'getSenderPaymentTransactions']);
        //end::TransactionController

        //begin::LocationController
        Route::post('getComboItems_country', [LocationController::class, 'getComboItems_country']);
        Route::post('createCountry', [LocationController::class, 'createCountry']);
        Route::post('saveCountry', [LocationController::class, 'saveCountry']);
        Route::post('saveCity', [LocationController::class, 'saveCity']);
        Route::post('saveDistrict', [LocationController::class, 'saveDistrict']);
        Route::post('saveCommune', [LocationController::class, 'saveCommune']);
        Route::post('getCountryList', [LocationController::class, 'getCountryList']);
        Route::post('getDistrictList', [LocationController::class, 'getDistrictList']);
        Route::post('getCityList', [LocationController::class, 'getCityList']);
        Route::post('getCommuneList', [LocationController::class, 'getCommuneList']);
        Route::post('deleteCountry', [LocationController::class, 'deleteCountry']);
        Route::post('deleteCity', [LocationController::class, 'deleteCity']);
        Route::post('deleteDistrict', [LocationController::class, 'deleteDistrict']);
        Route::post('deleteCommune', [LocationController::class, 'deleteCommune']);
        Route::post('getComboItems_city', [LocationController::class, 'getComboItems_city']);
        Route::post('getComboItems_district', [LocationController::class, 'getComboItems_district']);
        Route::post('getComboItems_commune', [LocationController::class, 'getComboItems_commune']);
        Route::post('getComboItems_zone', [LocationController::class, 'getComboItems_zone']);
         
     //end::LocationController

     //begin:: Delivery ZONE 
        Route::post('getDeliveryZoneList', [DeliveryZoneController::class, 'getDeliveryZoneList']);
        Route::post('saveDeliveryZone', [DeliveryZoneController::class, 'saveDeliveryZone']);
        Route::post('deleteDeliveryZone', [DeliveryZoneController::class, 'deleteDeliveryZone']);
        Route::post('getDeliveryZoneDetails', [DeliveryZoneController::class, 'getDeliveryZoneDetails']);
        Route::post('getZoneName', [DeliveryZoneController::class, 'getZoneName']);
        Route::post('getZoneInfo', [DeliveryZoneController::class, 'getZoneInfo']);

        //getZonePrices() returns senderPriceInfo based on changes in zone_code. getZonePrices() is called on dlgEditReceiverDialog, when user change Destination Zone and prices and fees are adjusted by new @zone_code 
        Route::post('getZonePrices', [PackageController::class, 'getZonePrices']);
        //getPriceInfoByPacakge() is used on Package Trail or Package List. When user click begin Edit button, then getPriceInfoByPacakge() is called to retrieve data as "senderPriceInfo" used for package's price and fees calculation
        Route::post('getPriceInfoByPackage', [PackageController::class, 'getPriceInfoByPackage']);
     //end:: Delivery ZONE Controller

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
     
        Route::post('setMerchantPriceList', [PriceController::class, 'setMerchantPriceList']);
        Route::post('deletePriceZones', [PriceController::class, 'deletePriceZones']);
        Route::post('savePriceLineZones', [PriceController::class, 'savePriceLineZones']);
        Route::post('savePriceLineInfo', [PriceController::class, 'savePriceLineInfo']);
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
            Route::post('getPromotionList', [PromotionController::class, 'getPromotionList']);
            Route::post('savePromotion', [PromotionController::class, 'savePromotion']);
            Route::post('getPromotionInfo', [PromotionController::class, 'getPromotionInfo']);
            Route::post('deletePromotion', [PromotionController::class, 'deletePromotion']);
    //end::PromotionController
     
});


//um::controller
Route::post('createApplication', [UMController::class, 'createApplication']);
Route::post('encryptData', [UMController::class, 'encryptData']);
Route::post('createPermission', [UMController::class, 'createPermission']);
Route::post('getModuleList', [UMController::class, 'getModuleList']);
Route::post('saveRole', [UMController::class, 'saveRole']);
Route::post('role_exists', [UMController::class, 'role_exists']);
Route::post('deleteRole', [UMController::class, 'deleteRole']);
Route::post('addRoleMember', [UMController::class, 'addRoleMember']);
Route::post('removeRoleMember', [UMController::class, 'removeRoleMember']);
Route::post('getUserRoles', [UMController::class, 'getUserRoles']);
Route::post('getRoleList', [UMController::class, 'getRoleList']);
Route::post('getRoleMembers', [UMController::class, 'getRoleMembers']);
Route::post('getRoleById', [UMController::class, 'getRoleById']);
Route::post('getUserList', [UMController::class, 'getUserList']);
Route::post('getUserExtendedDetails', [UMController::class, 'getUserExtendedDetails']);
Route::post('saveUser', [UMController::class, 'saveUser']);
Route::post('getUserInfo', [UMController::class, 'getUserInfo']);
Route::post('deleteUser', [UMController::class, 'deleteUser']);
Route::post('setUserStatus', [UMController::class, 'setUserStatus']);
Route::post('unlockUser', [UMController::class, 'unlockUser']);
Route::post('setLockStatus', [UMController::class, 'setLockStatus']);
Route::post('user_exists', [UMController::class, 'user_exists']);
Route::post('verifyUser', [UMController::class, 'verifyUser']);
Route::post('changePassword', [UMController::class, 'changePassword']);
Route::post('setPassword', [UMController::class, 'setPassword']);
Route::post('changeLoginName', [UMController::class, 'changeLoginName']);
Route::post('createLoginSession', [UMController::class, 'createLoginSession']);
Route::post('getComboItems_user', [UMController::class, 'getComboItems_user']);
Route::post('getComboItems_role', [UMController::class, 'getComboItems_role']);
Route::post('getComboItems_workloc', [UMController::class, 'getComboItems_workloc']);
Route::post('getAccessibleModules_current_user', [UMController::class, 'getAccessibleModules_current_user']);
Route::post('getAccessibleModules', [UMController::class, 'getAccessibleModules']);
Route::post('addAccessibleModule', [UMController::class, 'addAccessibleModule']);
Route::post('getPermissionsByRole', [UMController::class, 'getPermissionsByRole']);
Route::post('findPermissions', [UMController::class, 'findPermissions']);
Route::post('addPermissionToRole', [UMController::class, 'addPermissionToRole']);
Route::post('removePermissionFromRole', [UMController::class, 'removePermissionFromRole']);
Route::post('getPermissionsByLoginName', [UMController::class, 'getPermissionsByLoginName']);
Route::post('getPermissionsByUserId', [UMController::class, 'getPermissionsByUserId']);
Route::post('getPermissionsByRoleId', [UMController::class, 'getPermissionsByRoleId']);
Route::post('localizePermissions', [UMController::class, 'localizePermissions']);
Route::post('allowed', [UMController::class, 'allowed']);
Route::post('accessibleModule', [UMController::class, 'accessibleModule']);
Route::post('getComboItems_module', [UMController::class, 'getComboItems_module']);
Route::post('removeAccessibleModule', [UMController::class, 'removeAccessibleModule']);
Route::post('getComboItems_userclass', [UMController::class, 'getComboItems_userclass']);
Route::post('logout', [UMController::class, 'logout']);
//end::controller

//begin::SenderController
    Route::post('saveSender', [SenderController::class, 'saveSender']);
    Route::post('deleteSender', [SenderController::class, 'deleteSender']);
    Route::post('getSenderList', [SenderController::class, 'getSenderList']);
    Route::post('getFormData_senderdialog', [SenderController::class, 'getFormData_senderdialog']);
    Route::post('getSenderById', [SenderController::class, 'getSenderById']);
    Route::post('updateSenderStatus', [SenderController::class, 'updateSenderStatus']);
    //Route::post('updateSenderStatus', [SenderController::class, 'updateSenderStatus']);
//end::SenderController

//begin::DriverController
    Route::post('saveDriverCommissions', [DriverController::class, 'saveDriverCommissions']);
    Route::post('getDriverCommissions', [DriverController::class, 'getDriverCommissions']);
    Route::post('saveDriver', [DriverController::class, 'saveDriver']);
    Route::post('deleteDriver', [DriverController::class, 'deleteDriver']);
    Route::post('getDriverList', [DriverController::class, 'getDriverList']);
    Route::post('getFormData_driverdialog', [DriverController::class, 'getFormData_driverdialog']);
    Route::post('getDriverById', [DriverController::class, 'getDriverById']);
    Route::post('updateDriverStatus', [DriverController::class, 'updateDriverStatus']);
//end::DriverController

//begin::SystemSettingController
    Route::post('getComboItems_price_list',[SystemSettingController::class,'getComboItems_price_list']);

//end::SystemSettingController

//begin::CompletedPackageController
    Route::post('getCompletedPackageList', [CompletedPackageController::class, 'getCompletedPackageList']);
    Route::post('getCompletedPackageList_print', [CompletedPackageController::class, 'getCompletedPackageList_print']);
    Route::post('deleteCompletedPackage', [CompletedPackageController::class, 'deleteCompletedPackage']);
    Route::post('getFormData_completed_delivery', [CompletedPackageController::class, 'getFormData_completed_delivery']);
    Route::post('updateAgentPackage', [CompletedPackageController::class, 'updateAgentPackage']);
//end::CompletedPackageController
 
//begin::CompanyProfileController
    Route::post('saveCompanyLogo', [CompanyProfileController::class, 'saveCompanyLogo']);
    Route::post('getCompanyLogo', [CompanyProfileController::class, 'getCompanyLogo']);
    Route::post('deleteCompanyLogo', [CompanyProfileController::class, 'deleteCompanyLogo']);
    Route::post('saveCompanyInfo', [CompanyProfileController::class, 'saveCompanyInfo']);
    Route::post('getCompanyInfo', [CompanyProfileController::class, 'getCompanyInfo']);
    Route::post('getBrandImages_driver', [CompanyProfileController::class, 'getBrandImages_driver']);
    Route::post('getBrandImages_sender', [CompanyProfileController::class, 'getBrandImages_sender']);
//end::CompanyProfileController

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

//begin::DashboardController
 Route::post('dbs_getPackageCounts', [DashboardController::class, 'getPackageCounts']);
 Route::post('dbs_getData_card1', [DashboardController::class, 'getData_card1']);
 
//end::DashboardController

//begin::SalesAgentController
Route::post('saveSalesAgent', [SalesAgentController::class, 'saveSalesAgent']);
Route::post('deleteSalesAgent', [SalesAgentController::class, 'deleteSalesAgent']);
Route::post('getSalesAgentList', [SalesAgentController::class, 'getSalesAgentList']);
Route::post('getFormData_salesAgent', [SalesAgentController::class, 'getFormData_salesAgent']);
Route::post('getSalesAgentById', [SalesAgentController::class, 'getSalesAgentById']);
Route::post('updateSalesAgentStatus', [SalesAgentController::class, 'updateSalesAgentStatus']);
//end::SalesAgentController

//begin::ReportController
    Route::prefix('rpt')->group(function(){
        Route::post('rpt_getSummaryData', [ReportController::class, 'getSummaryData']);
    });
//end::ReportController

//begin::ReportController

    //getMobileBrandImages()
     Route::post('getMobileBrandImages', [MobileAppSettingsController::class, 'getMobileBrandImages']);
     Route::post('saveBrandImage', [MobileAppSettingsController::class, 'saveBrandImage']);
     Route::post('deleteBrandImage', [MobileAppSettingsController::class, 'deleteBrandImage']);
//end::ReportController


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
        //##begin:: Merchant app api V1
            Route::prefix('merchant/v1')->group(function(){
              
            /** for testing of calculating distance between two points in km or mile **/    
            Route::post('distance',function(Request $request){
                $d = Notifier::point2point_distance($request->lat1,$request->lon1,$request->lat2,$request->ln2,'K');
                return response()->json($d."km"); 
            });  

            /** for testing: sending event from api to Web Admin System **/    
            Route::post('send-event',function(Request $request){
                $data = (object)['order_id'=>$request->order_id,'merchant_name'=>$request->merchant_name]; 
                $result = Notifier::notify_admin($request->event_name,$data);
                return response()->json($result); 
            });      
                // Route::post('private-storage',function(){
                //     //access to private storage 
                //     //$path = Storage::disk('private')->path('');
                //     return getStoragePath(true);
                // });

                // Route::post('public-storage',function(){
                //     //access to private storage 
                //     //$path = Storage::disk('private')->path('');
                //     return getStoragePath(false);
                // });
               
                Route::post('public-storage',function(){
                    return PublicStorage::getUrl(1,'merchant','image');
                });
              
                Route::post('storage-url',function(){
                    //$path =  getStorageUrl();
                    $path = $_SERVER['SERVER_NAME']; // $_SERVER['PHP_SELF'];
                    return $path;
                });

                Route::post('send-sms', [ApiController::class,'sendSMS']);
                Route::post('notify-merchant',function(){
                   $d = (object)['message'=>'test message','title'=>'Driver Assigned','image_url'=>"https://bellard.org/bpg/2.png"];
                   return Notifier::notify_merchant($d);
                });
                
                // Route::post('get-auth-code',function(){
                //     return response()->json(SMS:: _getAuthCode ());
                // });

                // Route::post('get-atk',function(){
                //     return response()->json(SMS:: _getAccessToken());
                // });
            
                Route::post('changepassword', [ApiController::class,'changePassword_merchant']); 
                //Merchant=> after successfuly verifying OTP code, user submit new password. $d = {app_id,otp_code,password} 
                Route::post('setpassword-otp', [ApiController::class,'setPassword_otp']);

                //returns list of COUNTS for Merchant's app home screen
                Route::post('order-summary-counts', [ApiController::class,'getOrderSummaryCounts']);  
                Route::post('order-summary-list', [ApiController::class,'getOrderSummary_list']);
                Route::post('find-items', [ApiController::class,'findPackages_quick']);
                
                //Merchant submit otp_code to update phone number
                Route::post('update-phone', [ApiController::class,'updatePhoneNumber_merchant']);
                
                //param = {'user_class'= merchant }
                Route::post('notifications', [ApiController::class,'getNotificationListByMerchant']);
                //check if phone_number already in use? if not, send otp and wait to be verified
                // name "register-send-otp" causes mysterious error of "cookie humans_2190 =1 ...", maybe word "register" is blocked  
                Route::post('reg-send-otp', [ApiController::class,'send_otp_preregister']);
                Route::post('reg-verify-otp', [ApiController::class,'verify_otp_preregister']);
                Route::post('send-otp', [ApiController::class,'send_otp']);
                Route::post('outstanding-orders', [ApiController::class,'getOutstandingDeliveryOrders']);
                Route::post('merchant-address', [ApiController::class,'getVendorAddress']);
                
                //return product-types for Merchant App
                Route::post('product-types',function(Request $request){
                    $um = new UM();
                    $user =  $um->getUserInfoByToken($request,'merchant');  
                    if ($user =='#350') return makeJsonResponse(null,350);
                    $r = SystemSetting::product_types($request);
                    return $r;
                });  

                Route::post('send-sms-otp', [ApiController::class,'sendSMS_otp']);
                Route::post('verify-otp', [ApiController::class,'verify_otp']);
                Route::post('save-trx-photo', [ApiController::class,'saveTransactionPhoto_sender']);
                Route::post('transactions', [ApiController::class,'getTransactions_sender']);
                Route::post('delivery-items', [ApiController::class,'getDeliveryItems_sender']);
                Route::post('confirm-correct-amounts', [ApiController::class,'confirmCorrectAmounts']); 
                //maybe used for both Merchant and Driver apps
                //brand-images {$app_id}
                Route::post('brand-images', [ApiController::class,'getBrandImages_mobile']);    
                Route::post('promotions', [ApiController::class,'getPromotionList_merchant']); 
                Route::post('update-bank-account', [ApiController::class,'updateBankAccount']);
                Route::post('add-bank-accounts', [ApiController::class,'addBankAccounts']);
                Route::post('delete-bank-account', [ApiController::class,'deleteBankAccount']); 
                Route::post('save-profile-picture', [ApiController::class, 'saveProfilePicture_sender']);
                Route::post('upload-profile-picture', [ApiController::class, 'saveProfilePicture_sender']);
                Route::post('update-profile', [ApiController::class, 'updateProfile_sender']); 
                Route::post('profile-picture', [ApiController::class, 'getProfilePicture_sender']);
                Route::post('profile-picture-url', [ApiController::class, 'getProfilePictureUrl_sender']); 
                Route::post('profile-info', [ApiController::class, 'getProfileInfo_sender']);
                Route::post('bank-accounts', [ApiController::class, 'getBankAccounts_sender']);

                Route::post('reg-merchant', [ApiController::class, 'registerSender']);
                //update bank accounts by submitting array of accounts @bank_accounts
                Route::post('save-bank-accounts', [ApiController::class, 'saveMerchantProfile_bank']); 

                Route::post('terms-and-conditions', [ApiController::class, 'getTermsAndConditions_merchant']);  
                Route::post('activate-account-otp', [ApiController::class, 'activateSender_otp']);
                Route::post('zones', [ApiController::class, 'getZoneList_sender']);
  
                Route::post('exchange-rate', [ApiController::class, 'getExchangeRate_sender']);
                //Merchant create delivery order from Mobile app
                Route::post('create-delivery-order', [ApiController::class, 'savePickupRequest']);
                Route::post('delivery-orders', [ApiController::class, 'getPickupListBySender']); 

                 //$d = {app_id,sender_id,delivery_type,zone_code,billed_kg} //Merchant
                 Route::post('price-info', [ApiController::class, 'getDeliveryPriceInfo']);
                 //Merchant to estimate price. $d = {app_id,sender_id,delivery_type,zone_code,billed_kg} //Merchant
                 Route::post('estimate-price', [ApiController::class, 'estimatePrice']);

                //getOrderDetails() returns order details with payment status. This method is called by both Driver app and Merchant app
                Route::post('ordder-details', [ApiController::class, 'getOrderDetails_sender']);
                ////Route::post('order-details-sender', [ApiController::class, 'getOrderDetails_sender']); 

                //This method currently avaialble only for driver app
                //Route::post('vehicle-types', [ApiController::class, 'getComboItems_vehicleType']); 

                Route::post('login', [ApiController::class, 'externalLogin']);
                Route::post('set-password', [ApiController::class,'setPassword_sender']);
                Route::post('settled-packages', [ApiController::class, 'getSettledPackages']);
                Route::post('get-notifications', [ApiController::class,'getNotificationList_sender']);
                Route::post('package-statuses',function(Request $request){
                    $r =  SystemSetting::package_statuses($request);
                    return makeJsonResponse($r);
                 });
                Route::post('logout', [ApiController::class,'logout_mobile']);
                
            });
         //##end:: Merchant app api V1

         //##begin:: driver app api V1
          Route::prefix('driver/v1')->group(function(){
           
            Route::post('notify-admin',function(Request $request){
                $data = (object)['order_id'=>125,'merchant_name'=>'Super shop ONE']; 
               Notifier::notify_admin('onOrderCreated',$data);
            });

                Route::post('notifications', [ApiController::class,'getNotificationListByDriver']);
                Route::post('cancel-order', [ApiController::class,'cancelOrder']);
                Route::post('terms-and-conditions', [ApiController::class, 'getTermsAndConditions_driver']);
                
                Route::post('pending-order-count', [ApiController::class, 'getPendingOrdersCount']);
                Route::post('task-counts', [ApiController::class, 'getDriverTaskCounts']);

                Route::post('product-types',function(Request $request){
                    $um = new UM();
                    $user =  $um->getUserInfoByToken($request,'driver');  
                    if ($user =='#350') return makeJsonResponse(null,350);
                    $r = SystemSetting::product_types($request);
                    return $r;
                });   

                Route::post('profile-info', [ApiController::class,'getProfileInfo_driver']);    
                //Route::post('notify_driver', [ApiController::class,'notify_driver']);              

                //getOrderDetails() returns order details with payment status. This method is called by both Driver app and Merchant app
                Route::post('ordder-details', [ApiController::class, 'getOrderDetails']);

                Route::post('set-password', [ApiController::class,'setPassword_driver']);
                Route::post('verify-otp', [ApiController::class, 'verifyOTP']);

                Route::post('reg-driver', [ApiController::class, 'registerDriver']);    
                Route::post('activate-account-otp', [ApiController::class, 'activateDriver_otp']);          
                Route::post('login', [ApiController::class, 'externalLogin']);
               
                Route::post('changepassword', [ApiController::class,'changePassword_driver']);
                //Driver=> after successfuly verifying OTP code, user submit new password. $d = {app_id,otp_code,password} 
                Route::post('setpassword-otp', [ApiController::class,'setPassword_otp']);

                 //Driver submit otp_code to update phone number
                 Route::post('update-phone', [ApiController::class,'updatePhoneNumber_driver']);

                /** returns availbale pickup list for driver to accept **/
                Route::post('available-orders', [ApiController::class, 'getAvailablePickupList']);  
                Route::post('zones', [ApiController::class, 'getZoneList_driver']);
                //for Pick and Book, returns barcode for printing if user(driver) wants
                Route::post('pick-package', [ApiController::class, 'pickOrderPackage']);
                
                //$d ={order_id} //Driver app
                Route::post('picked-packages', [ApiController::class, 'getPackageListPerOrder']);
                //$d={order_id,bar_code}
                Route::post('delete-picked-packages', [ApiController::class, 'deleteOrderPakcages']);
                
                //Route::post('pick-packages', [ApiController::class, 'pickOrderPackages']);
                Route::post('pick-order', [ApiController::class, 'pickOrder']);
                /* returns list of accepted pickup list by a driver */
                Route::post('accepted-orders', [ApiController::class, 'getAcceptedPickupListByDriver']); 
                ////Route::post('getZoneItems', [ApiController::class, 'getZoneItems']);  
                //Route::post('getFormData_pickup_request', [ApiController::class, 'getFormData_pickup_request']); 
                
                /** driver picks package one by one and then start delivery trip without coming to Office **/
                Route::post('pick-package-fast', [ApiController::class, 'pickOrderPackages_fast_delivery']); 
                /** returns list of packages delivered by a driver. Each package has status as Delivered or Failed or Returned or Continue to Deliver **/  
                
                Route::post('delivery-packages', [ApiController::class, 'getPackagesByDriver']);
                //Route::post('getPackageListByDriver', [ApiController::class, 'getPackageListByDriver']);

                //$d = {app_id,sender_id,delivery_type,zone_code,billed_kg} //Driver
                Route::post('price-info', [ApiController::class, 'getDeliveryPriceInfo']); 
                /** driver accepts to go pick up a delivery order **/
                Route::post('accept-order', [ApiController::class, 'acceptPickupRequest']);     
                Route::post('exchange-rate', [ApiController::class, 'getExchangeRate_driver']);

                Route::post('active-trips', [ApiController::class, 'getActiveTrips']); 
                //returns a list of packages within a given delivery trip given by param @drivery_id
                Route::post('trip-packages', [ApiController::class, 'getPackageListByTrip']);
                Route::post('vehicle-types', [ApiController::class, 'getComboItems_vehicleType']); 

                Route::post('update-package-status', [ApiController::class, 'updatePackageStatus_driver']); 
                Route::post('finish-delivery', [ApiController::class, 'finishDeliveryTrip_driver']); 
                Route::post('start-delivery', [ApiController::class, 'startDeliveryTrip_driver']);
                Route::post('remove-scanned-package', [ApiController::class, 'removeScannedPackage']);  
                Route::post('trip-package-count', [ApiController::class, 'countPackagesByTrip']);
                //scan package out one by one for delivery (for driver app)
                Route::post('scan-out', [ApiController::class, 'scanPackageOut_driver']);
                Route::post('commissions', [ApiController::class, 'getCommissions_driver']);
                Route::post('update-profile', [ApiController::class, 'updateProfile_driver']); 
                Route::post('report-data', [ApiController::class, 'getReportData_driver']);

                Route::post('merchant-list', [ApiController::class, 'getComboItems_merchant']);
                //driver creates delivery order for a Merchant
                Route::post('create-delivery-order', [ApiController::class, 'savePickupRequest_driver']);
                //amount of cash a driver has to pay to Express company
                Route::post('balance-due', [ApiController::class, 'getTotalDue_driver']);
                
                ////Send Simple Notification message for testing only
                //Route::post('sendNotificationMessage', [ApiController::class, 'sendNotificationMessage']);

                Route::post('profile-picture', [ApiController::class, 'getProfilePicture_driver']);
                Route::post('profile-info', [ApiController::class, 'getProfileInfo_driver']);
                Route::post('save-profile-picture', [ApiController::class, 'saveProfilePicture_driver']);
                Route::post('upload-profile-picture', [ApiController::class, 'saveProfilePicture_driver']);
                Route::post('profile-picture-url', [ApiController::class, 'getProfilePictureUrl_driver']);
                Route::post('transactions', [ApiController::class,'getPaymentsFromDriver']);
                //*** $d = {'trx_type','trx_id','file_type','photo_data'}
                Route::post('save-trx-photo', [ApiController::class,'saveTransactionPhoto_driver']);
                //get brand-images ($app_id)
                Route::post('brand-images', [ApiController::class,'getBrandImages_mobile']); 
                Route::post('package-statuses',function(Request $request){
                    $r =  SystemSetting::package_statuses($request);
                    return makeJsonResponse($r);
                 });

                 Route::post('send-sms-otp', [ApiController::class,'sendSMS_otp']);
                 Route::post('verify-otp', [ApiController::class,'verify_otp']);
                 Route::post('logout', [ApiController::class,'logout_mobile']);
 
            });
            //##end:: driver app api V1

            Route::prefix('v1')->group(function(){               
            Route::post('getOutstandingDeliveryOrders', [ApiController::class,'getOutstandingDeliveryOrders']);    
            Route::post('getVendorAddress', [ApiController::class,'getVendorAddress']);  
            Route::post('getProductTypeList', [ApiController::class,'getComboItems_product_type']);   
            Route::post('auth_test', [ApiController::class,'auth_test']);               
            Route::post('notify_driver', [ApiController::class,'notify_driver']); 
            Route::post('sendSMS_otp', [ApiController::class,'sendSMS_otp']);    
            Route::post('saveTransactionPhoto_sender', [ApiController::class,'saveTransactionPhoto_sender']);
            Route::post('getTransactions_sender', [ApiController::class,'getTransactions_sender']);
            Route::post('getDeliveryItems_sender', [ApiController::class,'getDeliveryItems_sender']);
            Route::post('setPassword_driver', [ApiController::class,'setPassword_driver']);
            Route::post('setPassword_sender', [ApiController::class,'setPassword_sender']);     
          
            Route::post('updateBankAccount', [ApiController::class,'updateBankAccount']);  
            Route::post('addBankAccounts', [ApiController::class,'addBankAccounts']);  
            Route::post('deleteBankAccount', [ApiController::class,'deleteBankAccount']);  
            Route::post('saveProfilePicture_sender', [ApiController::class, 'saveProfilePicture_sender']);  
            Route::post('getProfilePicture_sender', [ApiController::class, 'getProfilePicture_sender']);  
            Route::post('updateSenderProfile_bank', [ApiController::class, 'updateSenderProfile_bank']);    
            Route::post('getTermsAndConditions', [ApiController::class, 'getTermsAndConditions']);
            Route::post('updateSenderProfile', [ApiController::class, 'updateSenderProfile']);    
            Route::post('activateSender', [ApiController::class, 'activateSender_otp']);
            Route::post('activateDriver', [ApiController::class, 'activateDriver_otp']);          
            Route::post('registerSender', [ApiController::class, 'registerSender']);
            Route::post('registerDriver', [ApiController::class, 'registerDriver']);    
            Route::post('getZoneList_driver', [ApiController::class, 'getZoneList_driver']);
            Route::post('getZoneList_sender', [ApiController::class, 'getZoneList_sender']);
            Route::post('externalLogin', [ApiController::class, 'externalLogin']);
            Route::post('verifyOTP', [ApiController::class, 'verifyOTP']);
            Route::post('savePickupRequest', [ApiController::class, 'savePickupRequest']);
            Route::post('getPickupListBySender', [ApiController::class, 'getPickupListBySender']); 
            Route::post('getSenderInfoDetails', [ApiController::class, 'getSenderInfoDetails']); 
            Route::post('getOrderDetails', [ApiController::class, 'getOrderDetails']); 
            Route::post('getOrderDetails_sender', [ApiController::class, 'getOrderDetails_sender']); 
            Route::post('getFormData_pickup_request', [ApiController::class, 'getFormData_pickup_request']); 
            Route::post('pickOrderPackage', [ApiController::class, 'pickOrderPackage']);
            Route::post('pickOrder', [ApiController::class, 'pickOrder']);
            Route::post('getZoneItems', [ApiController::class, 'getZoneItems']);  
            Route::post('getAvailablePickupList', [ApiController::class, 'getAvailablePickupList']);  
            Route::post('getAcceptedPickupListByDriver', [ApiController::class, 'getAcceptedPickupListByDriver']); 
            Route::post('pickOrderPackages_fast_delivery', [ApiController::class, 'pickOrderPackages_fast_delivery']);    
            Route::post('getPackagesByDriver', [ApiController::class, 'getPackagesByDriver']);
            Route::post('acceptPickupRequest', [ApiController::class, 'acceptPickupRequest']);     
            Route::post('getSenderProfile', [ApiController::class, 'getSenderProfile']);
            Route::post('getPackageListByDriver', [ApiController::class, 'getPackageListByDriver']);
            Route::post('getExchangeRate_sender', [ApiController::class, 'getExchangeRate_sender']);
            Route::post('getExchangeRate_driver', [ApiController::class, 'getExchangeRate_driver']);
            Route::post('getActiveTrips', [ApiController::class, 'getActiveTrips']); 
            Route::post('getPackageListByTrip', [ApiController::class, 'getPackageListByTrip']);
            Route::post('getVehicleTypeOptions', [ApiController::class, 'getComboItems_vehicleType']); 
            Route::post('updatePackageStatus_driver', [ApiController::class, 'updatePackageStatus_driver']); 
            Route::post('finishDeliveryTrip_driver', [ApiController::class, 'finishDeliveryTrip_driver']); 
            Route::post('startDeliveryTrip_driver', [ApiController::class, 'startDeliveryTrip_driver']);
            Route::post('removeScannedPackage', [ApiController::class, 'removeScannedPackage']);  
            Route::post('countPackagesByTrip', [ApiController::class, 'countPackagesByTrip']);
            Route::post('scanPackageOut_driver', [ApiController::class, 'scanPackageOut_driver']);
            Route::post('getCommissions_driver', [ApiController::class, 'getCommissions_driver']);
            Route::post('getReportData_driver', [ApiController::class, 'getReportData_driver']);
            Route::post('getTotalDue_driver', [ApiController::class, 'getTotalDue_driver']);
            
            //Send Simple Notification message for testing only
            Route::post('sendNotificationMessage', [ApiController::class, 'sendNotificationMessage']);
              
         });
    });

//end::API routes for external calls


