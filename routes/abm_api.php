<?php
use App\Http\Middleware\CustomRateLimiter;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Login\LoginController;
 
use App\Http\Controllers\Dms\WebReportController;

use App\Http\Controllers\NotificationController;
use App\Http\Controllers\UMController; 

// use App\Http\Controllers\abm\CustomerController;
use App\Http\Controllers\ShipmentController;
use App\Http\Controllers\abm\OverseaShipmentController;
use App\Http\Controllers\abm\SupplierController;
use App\Http\controllers\abm\CustomerController;
use App\Http\Controllers\abm\CountryZoneController;
use App\Http\controllers\abm\OsSalesAgentController;
use App\Http\controllers\abm\PriceController;
use App\Http\controllers\abm\GeneralSettingsController;
use App\Http\controllers\abm\SpecialChargeController;
 
 //begin:: api without Authentication
    Route::middleware([CustomRateLimiter::class])->group(function(){
        // Route::post('logout', [ApiController::class,'logout_mobile']);
        // Route::post('auth/login', [ApiController::class, 'externalLogin']);
        Route::post('admin/login', [LoginController::class, 'apiLogin']);
        Route::post('vs-encrypt038111', [UMController::class, 'encryptData']);
        //Route::post('contact-info', [MobileAppSettingsController::class, 'getContactInfo']);
    });
//end:: api without Authentication

//begin:: Admin notifications
    Route::middleware('auth.api', CustomRateLimiter::class)->group(function(){
            Route::post('pending-requests', [NotificationController::class, 'getPendingRequests']);
            Route::post('notifications', [NotificationController::class, 'getNotificationListByUser']);
            Route::get('unread-count',[NotificationController::class,'getUnreadCount']);
            Route::get('mark-read-all',[NotificationController::class,'markReadAll']);
    });
 //end:: Admin Notification
  
    Route::middleware(['auth.api', CustomRateLimiter::class])->group(function(){
        Route::post('report-center/report-list', [WebReportController::class, 'getReportList']);
        Route::post('report-center/reports-by-category', [WebReportController::class, 'getReportListByCategory']);
        Route::post('report-center/filter-options', [WebReportController::class, 'getReportFilterOptions']);

    });

     //begin::PriceController
    Route::post('os_suppliers/set-price-list', [SupplierController::class, 'setSupplierPriceList']);
    // Route::post('getComboItems_price_list', [PriceController::class, 'getComboItems_price_list']);


    Route::middleware([CustomRateLimiter::class])->prefix('os_suppliers')->group(function(){
        Route::post('/save', [SupplierController::class, 'save']);
        Route::post('/list', [SupplierController::class, 'getSuplierList']);
        Route::post('/form-options', [SupplierController::class, 'getFormOptions']);
        Route::post('/save-profile-picture', [SupplierController::class, 'saveProfilePicture']);
        Route::post('/delete-profile-picture', [SupplierController::class, 'deleteProfilePicture']);

        Route::post('/update-status', [SupplierController::class, 'updateSupplierStatus']);
        Route::post('/list-paginate', [SupplierController::class, 'getSuplierListPaginate']);
        Route::post('/delete', [SupplierController::class, 'deleteOrderitem']);
        Route::post('/delete',[SupplierController::class,'delete']);

    });
    Route::middleware([CustomRateLimiter::class])->prefix('os-sales-agents')->group(function(){
        Route::post('/save', [OsSalesAgentController::class, 'saveSalesAgent']);
        Route::post('/sa-list', [OsSalesAgentController::class, 'getSalesAgentList']);
        Route::post('/cp-list', [OsSalesAgentController::class, 'getContactPersonList']);
        Route::post('/form-options', [OsSalesAgentController::class, 'getFormOptions']);
        // Route::post('/save-profile-picture', [OsSalesAgentController::class, 'saveProfilePicture']);
        Route::post('/update-status', [OsSalesAgentController::class, 'updateStatus']);
        Route::post('/list-paginate', [OsSalesAgentController::class, 'getListPaginate']);
        Route::post('/delete', [OsSalesAgentController::class, 'deleteSalesAgent']);
    });
    Route::middleware([CustomRateLimiter::class])->prefix('oversea_shipments')->group(function(){
        Route::post('/save', [OverseaShipmentController::class, 'save']);
        Route::post('/Shipment-list', [OverseaShipmentController::class, 'getOverseaShipmentList']);
        Route::post('/Shipment-list-paginate', [OverseaShipmentController::class, 'ListPaginate']);
        Route::post('/Shipment-list-BillValidate', [OverseaShipmentController::class, 'ListForBillValidate']);
        Route::post('/form-options', [OverseaShipmentController::class, 'getFormOptions']);
        Route::post('/item-details', [OverseaShipmentController::class, 'getItemDetails']);
        Route::post('/update-status', [OverseaShipmentController::class, 'updateStatus']);
        Route::post('/update-carrier-info', [OverseaShipmentController::class, 'updateCarrierInfo']);
    
        Route::post('/create-item', [OverseaShipmentController::class, 'createOverseaItem']);
        Route::post('/item-list', [OverseaShipmentController::class, 'getOverseaItemList']);
        Route::post('/delete-item', [OverseaShipmentController::class, 'deleteOrderitem']);

        Route::post('/import', [OverseaShipmentController::class, 'import']);

    });
    Route::middleware([CustomRateLimiter::class])->prefix('special-charge')->group(function(){
        Route::post('/save', [SpecialChargeController::class, 'save']);
        Route::post('/list-paginate', [SpecialChargeController::class, 'ListPaginate']);
        Route::post('/delete-special-charge', [SpecialChargeController::class, 'deleteSpecileCharge']);
    });
    //begin:: PackageController
    Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('package')->group(function(){
        // Route::post('/receiver-info', [PackageController::class, 'getReceiverInfo']);
        // Route::post('/details', [PackageController::class, 'getPackageDetails']);
        // Route::post('/details-with-options', [PackageController::class, 'getPackageDetailsWithOptions']);
        // Route::post('/details-by-barcode', [PackageController::class, 'getPackageDetailsByBarcode']);
        // Route::post('/info', [PackageController::class, 'getPackageInfo']);
        // Route::post('/update', [PackageController::class, 'updatePackageExpandedDetails']);
        Route::post('/price-info', [PackageController::class, 'getDeliveryPriceInfo_api']);
    });
    //end:: packageController
    Route::prefix('customers')->group(function(){
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

    
    Route::post('savePriceLineZones', [PriceController::class, 'savePriceLineZones']);
    Route::post('getPriceList_data', [PriceController::class, 'getPriceList_data']);
    Route::post('savePriceLineInfo', [PriceController::class, 'savePriceLineInfo']);
    Route::post('updateZoneCodes', [PriceController::class, 'updateZoneCodes']);
    Route::post('deletePriceZones', [PriceController::class, 'deletePriceZones']);

    
   //begin:: Counties_Zone_Code

    Route::prefix('country')->group(function(){
        Route::post('/save',[CountryZoneController::class,'save']);
        Route::post('/delete',[CountryZoneController::class,'delete']);
        Route::post('/list-all',[CountryZoneController::class,'getCountryZoneList_all']);
        Route::post('/details',[CountryZoneController::class,'details']);
        
    });

    Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('settings')->group(function(){
        Route::post('/options-country-zone', [GeneralSettingsController::class, 'getComboItems_country_zone']);
    });