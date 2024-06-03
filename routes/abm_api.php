<?php
use App\Http\Middleware\CustomRateLimiter;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Login\LoginController;
 
use App\Http\Controllers\Dms\WebReportController;

use App\Http\Controllers\NotificationController;
use App\Http\Controllers\UMController; 

use App\Http\Controllers\abm\PackageController;
use App\Http\Controllers\abm\InvoiceController;
use App\Http\Controllers\abm\OsShipmentController;
use App\Http\Controllers\abm\OsSupplierController;
use App\Http\controllers\abm\CustomerController;
use App\Http\Controllers\abm\CountryZoneController;
use App\Http\controllers\abm\OsAffiliateController;
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
    Route::middleware(['auth.api', CustomRateLimiter::class])->group(function(){
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
    Route::post('os_suppliers/set-price-list', [OsSupplierController::class, 'setSupplierPriceList']);
    // Route::post('getComboItems_price_list', [PriceController::class, 'getComboItems_price_list']);


    Route::middleware([CustomRateLimiter::class])->prefix('os_suppliers')->group(function(){
        Route::post('/save', [OsSupplierController::class, 'save']);
        Route::post('/list', [OsSupplierController::class, 'getSuplierList']);
        Route::post('/form-options', [OsSupplierController::class, 'getFormOptions']);
        Route::post('/save-profile-picture', [OsSupplierController::class, 'saveProfilePicture']);
        Route::post('/delete-profile-picture', [OsSupplierController::class, 'deleteProfilePicture']);

        Route::post('/update-status', [OsSupplierController::class, 'updateSupplierStatus']);
        Route::post('/list-paginate', [OsSupplierController::class, 'getSuplierListPaginate']);
        Route::post('/delete', [OsSupplierController::class, 'deleteOrderitem']);
        Route::post('/delete',[OsSupplierController::class,'delete']);

    });
    Route::middleware([CustomRateLimiter::class])->prefix('os-sales-agents')->group(function(){
        Route::post('/save', [OsAffiliateController::class, 'saveSalesAgent']);
        Route::post('/sa-list', [OsAffiliateController::class, 'getSalesAgentList']);
        Route::post('/cp-list', [OsAffiliateController::class, 'getContactPersonList']);
        Route::post('/form-options', [OsAffiliateController::class, 'getFormOptions']);
        Route::post('/save-profile-picture', [OsAffiliateController::class, 'saveProfilePicture']);
        Route::post('/delete-profile-picture', [OsAffiliateController::class, 'deleteProfilePicture']);

        Route::post('/update-status', [OsAffiliateController::class, 'updateStatus']);
        Route::post('/list-paginate', [OsAffiliateController::class, 'getListPaginate']);
        Route::post('/delete', [OsAffiliateController::class, 'deleteSalesAgent']);
    });
    Route::middleware([CustomRateLimiter::class])->prefix('oversea_shipments')->group(function(){
        Route::post('/save', [OsShipmentController::class, 'save']);
        Route::post('/Shipment-list', [OsShipmentController::class, 'getOverseaShipmentList']);
        Route::post('/Shipment-list-paginate', [OsShipmentController::class, 'ListPaginate']);
        Route::post('/Shipment-list-BillValidate', [OsShipmentController::class, 'ListForBillValidate']);
        Route::post('/form-options', [OsShipmentController::class, 'getFormOptions']);
        Route::post('/item-details', [OsShipmentController::class, 'getItemDetails']);
        Route::post('/update-status', [OsShipmentController::class, 'updateStatus']);
        Route::post('/update-carrier-info', [OsShipmentController::class, 'updateCarrierInfo']);
    
        Route::post('/create-item', [OsShipmentController::class, 'createOverseaItem']);
        Route::post('/item-list', [OsShipmentController::class, 'getOverseaItemList']);
        Route::post('/delete-item', [OsShipmentController::class, 'deleteOrderitem']);

        Route::post('/import', [OsShipmentController::class, 'import']);

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
    Route::prefix('invoice')->group(function(){
        Route::post('/save',[InvoiceController::class,'save']);
        Route::post('/list',[InvoiceController::class,'list']);
        Route::post('/list-paginate',[InvoiceController::class,'list-paginate']);
        Route::post('/detail',[InvoiceController::class,'detailInvoice']);
        Route::post('/delete',[InvoiceController::class,'deleteInvoice']);
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