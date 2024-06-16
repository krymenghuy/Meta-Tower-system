<?php
use App\Http\Middleware\CustomRateLimiter;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Login\LoginController;
 
use App\Http\Controllers\Dms\WebReportController;

use App\Http\Controllers\NotificationController;
use App\Http\Controllers\UMController; 

use App\Http\Controllers\abm\PackageController;
use App\Http\Controllers\abm\InvoiceController;
use App\Http\Controllers\abm\ShipmentController;
use App\Http\Controllers\abm\SupplierController;
use App\Http\controllers\abm\CustomerController;
use App\Http\Controllers\abm\CountryZoneController;
use App\Http\controllers\abm\AffiliateController;
use App\Http\controllers\abm\PriceController;
use App\Http\controllers\abm\SupplierPriceController;
use App\Http\controllers\abm\GeneralSettingsController;
use App\Http\controllers\abm\SpecialChargeController;
use App\Http\controllers\abm\PaymentController;
use App\Http\controllers\abm\DashboardController;
 
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
        Route::post('/save', [AffiliateController::class, 'saveSalesAgent']);
        Route::post('/sa-list', [AffiliateController::class, 'getSalesAgentList']);
        Route::post('/cp-list', [AffiliateController::class, 'getContactPersonList']);
        Route::post('/form-options', [AffiliateController::class, 'getFormOptions']);
        Route::post('/save-profile-picture', [AffiliateController::class, 'saveProfilePicture']);
        Route::post('/delete-profile-picture', [AffiliateController::class, 'deleteProfilePicture']);

        Route::post('/update-status', [AffiliateController::class, 'updateStatus']);
        Route::post('/list-paginate', [AffiliateController::class, 'getListPaginate']);
        Route::post('/delete', [AffiliateController::class, 'deleteSalesAgent']);
    });
    Route::middleware([CustomRateLimiter::class])->prefix('oversea_shipments')->group(function(){
        Route::post('/save', [ShipmentController::class, 'save']);
        Route::post('/Shipment-list', [ShipmentController::class, 'getOverseaShipmentList']);
        Route::post('/Shipment-list-paginate', [ShipmentController::class, 'ListPaginate']);
        Route::post('/Shipment-list-BillValidate', [ShipmentController::class, 'ListForBillValidate']);
        Route::post('/form-options', [ShipmentController::class, 'getFormOptions']);
        Route::post('/form-options-payment', [ShipmentController::class, 'getFormOptionsForPayment']);
        Route::post('/item-details', [ShipmentController::class, 'getItemDetails']);
        Route::post('/update-status', [ShipmentController::class, 'updateStatus']);
        Route::post('/update-carrier-info', [ShipmentController::class, 'updateCarrierInfo']);
    
        Route::post('/create-item', [ShipmentController::class, 'createOverseaItem']);
        Route::post('/item-list', [ShipmentController::class, 'getOverseaItemList']);
        Route::post('/delete-item', [ShipmentController::class, 'deleteOrderitem']);

        Route::post('/import', [ShipmentController::class, 'import']);

    });
    Route::middleware([CustomRateLimiter::class])->prefix('payment')->group(function(){
        Route::post('/save', [PaymentController::class, 'save']);
        Route::post('/save-many', [PaymentController::class, 'saveMany']);
        Route::post('/details', [PaymentController::class, 'details']);
        Route::post('/delete-special-charge', [PaymentController::class, 'deleteSpecileCharge']);
    });

    Route::middleware([CustomRateLimiter::class])->prefix('special-charge')->group(function(){
        Route::post('/save', [SpecialChargeController::class, 'save']);
        Route::post('/list-paginate', [SpecialChargeController::class, 'ListPaginate']);
        Route::post('/delete-special-charge', [SpecialChargeController::class, 'deleteSpecileCharge']);
    });
    //begin:: PackageController
    Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('package')->group(function(){
        // Route::post('/receiver-info', [PackageController::class, 'getReceiverInfo']);
        // Route::post('/details',[PackageController::class, 'getPackageDetails']);
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
        Route::post('/list',[InvoiceController::class,'getInvoiceList']);
        Route::post('/list-paginate',[InvoiceController::class,'getInvoiceListPaginate']);
        Route::post('/form-options',[InvoiceController::class,'getFormOptions']);
        Route::post('/delete',[InvoiceController::class,'deleteInvoice']);
        Route::post('/Shipment-list-paginate', [InvoiceController::class, 'ListPaginate']);

    });

    //CustomerPrice
    Route::post('savePriceLineZones', [PriceController::class, 'savePriceLineZones']);
    Route::post('getPriceList_data', [PriceController::class, 'getPriceList_data']);
    Route::post('savePriceLineInfo', [PriceController::class, 'savePriceLineInfo']);
    Route::post('updateZoneCodes', [PriceController::class, 'updateZoneCodes']);
    Route::post('deletePriceZones', [PriceController::class, 'deletePriceZones']);

    Route::post('deletePriceList', [PriceController::class, 'deletePriceList']);
    Route::post('createPriceList', [PriceController::class, 'createPriceList']);
    Route::post('updatePriceList_kg_marker', [PriceController::class, 'updatePriceList_kg_marker']);
    Route::post('getComboItems_price_list', [PriceController::class, 'getComboItems_price_list']);

    //SupplierPrice
    Route::post('saveSupplierPriceLineZones', [SupplierPriceController::class, 'savePriceLineZones']);
    Route::post('getSupplierPriceList_data', [SupplierPriceController::class, 'getPriceList_data']);
    Route::post('saveSupplierPriceLineInfo', [SupplierPriceController::class, 'savePriceLineInfo']);
    Route::post('updateSupplierZoneCodes', [SupplierPriceController::class, 'updateZoneCodes']);
    Route::post('deleteSupplierPriceZones', [SupplierPriceController::class, 'deletePriceZones']);

    Route::post('deleteSupplierPriceList', [SupplierPriceController::class, 'deletePriceList']);
    Route::post('createSupplierPriceList', [SupplierPriceController::class, 'createPriceList']);
    Route::post('updateSupplierPriceList_kg_marker', [SupplierPriceController::class, 'updatePriceList_kg_marker']);
    Route::post('getComboItems_supplier_price_list', [SupplierPriceController    ::class, 'getComboItems_price_list']);
    
    
    Route::prefix('dashboard')->group(function(){
        Route::post('/cards', [DashboardController::class, 'getHeaderCards']);
        Route::post('/body-cards', [DashboardController::class, 'getBodyCards']);
    });
   //begin:: Counties_Zone_Code
    Route::prefix('country')->group(function(){
        Route::post('/save',[CountryZoneController::class,'save']);
        Route::post('/delete',[CountryZoneController::class,'delete']);
        Route::post('/list-all',[CountryZoneController::class,'getCountryZoneList_all']);
        Route::post('/list',[CountryZoneController::class,'getCountryZoneList_paginate']);
        Route::post('/details',[CountryZoneController::class,'details']);
        
    });


    Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('settings')->group(function(){
        Route::post('/options-country-zone', [GeneralSettingsController::class, 'getComboItems_country_zone']);
    });