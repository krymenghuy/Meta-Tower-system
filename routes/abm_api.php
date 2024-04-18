<?php
use App\Http\Middleware\CustomRateLimiter;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Login\LoginController;
 
use App\Http\Controllers\Dms\WebReportController;

use App\Http\Controllers\Dms\NotificationController;

// use App\Http\Controllers\abm\CustomerController;
use App\Http\Controllers\ShipmentController;
use App\Http\Controllers\abm\OverseaShipmentController;
use App\Http\Controllers\abm\SupplierController;
use App\Http\controllers\abm\CustomerController;
 
 //begin:: api without Authentication
    Route::middleware([CustomRateLimiter::class])->group(function(){
        // Route::post('logout', [ApiController::class,'logout_mobile']);
        // Route::post('auth/login', [ApiController::class, 'externalLogin']);
        Route::post('admin/login', [LoginController::class, 'apiLogin']);
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