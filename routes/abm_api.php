<?php
use App\Http\Middleware\CustomRateLimiter;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Login\LoginController;
use App\Http\Controllers\Abm\PackageController;
// use App\Http\Controllers\LocationController;
use App\Http\Controllers\Abm\CustomerController;
use App\Http\Controllers\CompanyProfileController;

use App\Http\Controllers\ReportController;
use App\Http\Controllers\Abm\DashboardController;
  
use App\Http\Controllers\MobileAppSettingsController;
use App\Http\Controllers\SocialMediaController;
// use App\Http\Controllers\Abm\GeneralSettingsController;
//use App\Http\Controllers\SystemSettingController;
//use App\Http\Controllers\ApiController;
use App\Http\Controllers\CurrencyController; 
use App\Http\Controllers\WebReportController;

use App\Http\Controllers\NotificationController;
 
 
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
            Route::post('pending-requests', [NotificationController::class, 'getPendingRequests']);
            Route::post('notifications', [NotificationController::class, 'getNotificationListByUser']);
            Route::post('unread-count',[NotificationController::class,'getUnreadCount']);
            Route::post('mark-read-all',[NotificationController::class,'markReadAll']);
    });
 //end:: Admin Notification
  
   Route::middleware(['auth.api', CustomRateLimiter::class])->group(function(){
   Route::post('report-center/report-list', [WebReportController::class, 'getReportList']);
   Route::post('report-center/reports-by-category', [WebReportController::class, 'getReportListByCategory']);
   Route::post('report-center/filter-options', [WebReportController::class, 'getReportFilterOptions']);

    });