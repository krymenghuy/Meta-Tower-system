
<?php
use App\Http\Middleware\CustomRateLimiter;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\LeadController; 
use App\Http\Controllers\PriceListController; /** PriceListController is for quoted proce list */
use App\Http\Controllers\PosterController;
use App\Http\Controllers\SalesApp\SalesAppDashboardController;
use App\Http\Controllers\SalesAgentController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\SalesModule\SalesModuleReportController;
 
  
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('sales-app/agent/comments')->group(function(){
    Route::post('/list', [CommentController::class, 'getComments_mobile']);
    Route::post('/delete', [CommentController::class, 'deleteComment']);
    Route::post('/save', [CommentController::class, 'saveComment']);
});
 

Route::middleware([CustomRateLimiter::class])->prefix('sales-app')->group(function(){
    Route::post('/banners', [SalesAgentController::class,'getBrandImages_mobile']);
    Route::post('/login', [SalesAgentController::class, 'login']);
    Route::post('terms-and-conditions', [ApiController::class, 'getTermsAndConditions_salesapp']); 
    Route::post('/posters/list', [PosterController::class, 'list']);
    Route::post('/posters/details', [PosterController::class, 'getDetails']);   
});

//There is authenencation
Route::middleware(CustomRateLimiter::class)->prefix('sales-app/agent')->group(function(){
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
});

Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('sales-app/agent')->group(function(){
   Route::post('/save-profile-picture', [SalesAgentController::class, 'saveProfilePhoto']);
   Route::post('/delete-profile-picture', [SalesAgentController::class, 'deleteProfilePhoto']);
   Route::post('/profile-info', [SalesAgentController::class, 'getProfileInfo']);
   Route::post('/update-profile', [SalesAgentController::class, 'updateProfile']);
   Route::post('/save-bank-account', [SalesAgentController::class, 'saveBankAccount']);
   Route::post('/bank-account', [SalesAgentController::class, 'getBankAccount']);
   Route::post('/update-phone', [SalesAgentController::class,'updatePhoneNumber']);
   Route::post('/register', [SalesAgentController::class, 'register']);
   Route::post('/register/send-otp', [SalesAgentController::class,'send_otp_preregister']);
   Route::post('/register/verify-otp', [SalesAgentController::class,'verify_otp_preregister']);
   Route::post('/deactivate', [SalesAgentController::class, 'deactivate']);
   //Route::post('/package-summary', [SalesAgentController::class, 'getSummaryPackagesByMonth']);
   Route::post('/commission-summary', [SalesAgentController::class, 'getCommissionSummary_mobile']);
   Route::post('/package-count-by-merchant', [SalesModuleReportController::class, 'getPackageCountByMerchant_monthly']);
   Route::post('/commission-payments', [SalesAgentController::class, 'getCommissionPaymentByMonth']);
   Route::post('/price-list', [PriceListController::class, 'options_price_list']);
   Route::post('/price-list-details', [PriceListController::class, 'getItems']);

   Route::post('/notifications/list', [ApiController::class,'getNotificationListByUser']);
   Route::post('/notifications/unread-count', [ApiController::class,'getUnreadCount']);
   Route::post('/notifications/read-all', [ApiController::class,'markReadAll']);
   
   //Route::post('mark-read', [ApiController::class, 'markRead_driver']);
   //Route::post('mark-read-all', [ApiController::class, 'markReadAll']);
});

Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('sales-app/merchant')->group(function(){
    Route::post('/list', [SalesAgentController::class,'getMerchantList']);
    Route::post('/list-all', [SalesAgentController::class,'getMerchantList_all']);
});

Route::prefix('/sales-app/lead')->group(function(){
    Route::post('/options-business-type', [LeadController::class, 'getOptions_business_type']);
    Route::post('/options-category', [LeadController::class, 'getOptions_category']);
});

Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('sales-app/lead')->group(function(){

    Route::post('/list', [LeadController::class, 'getList_paginate']);
    Route::post('/list-all', [LeadController::class, 'getList_all']);
    Route::post('/details', [LeadController::class, 'getDetails']);
    Route::post('/delete', [LeadController::class, 'deleteLead']);
    Route::post('/save', [LeadController::class, 'saveLead']);
    Route::post('/options-status', [LeadController::class, 'getOptions_status']); 
    Route::post('/submit-for-review', [LeadController::class, 'submitForReview']);
    Route::post('/update-status', [LeadController::class, 'updateStatus']);
});
