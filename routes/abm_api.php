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
            Route::get('pending-requests', [NotificationController::class, 'getPendingRequests']);
            Route::get('notifications', [NotificationController::class, 'getNotificationListByUser']);
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
        Route::post('/update-status', [SupplierController::class, 'updateSupplierStatus']);
        Route::post('/list-paginate', [SupplierController::class, 'getSuplierListPaginate']);
    });
    Route::middleware([CustomRateLimiter::class])->prefix('oversea_shipments')->group(function(){
        Route::post('/save', [OverseaShipmentController::class, 'save']);
        Route::post('/Shipment-list', [OverseaShipmentController::class, 'getOverseaShipmentList']);
    
        Route::post('/create-item', [OverseaShipmentController::class, 'createOverseaItem']);
        Route::post('/item-list', [OverseaShipmentController::class, 'getOverseaItemList']);
    });