<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\CustomRateLimiter;

use App\Http\Controllers\Auth\MobileAuthController;
use App\Http\Controllers\Tenant\RequestServiceController;


Route::middleware([CustomRateLimiter::class])->prefix('account')->group( function (){
    Route::post('/login',[MobileAuthController::class,'mobileLogin']);
    Route::post('/register',[MobileAuthController::class,'registerMobile']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('request-service')->group(function () {
    Route::post('/save', [RequestServiceController::class, 'saveServiceRequest']);
    Route::post('/list',[RequestServiceController::class, 'getServiceRequestList']);
    Route::post('/details',[RequestServiceController::class, 'serviceRequestDetails']);
    Route::post('/delete',[RequestServiceController::class,'delete']);
    Route::post('/form-options',[RequestServiceController::class,'getFormOptions']);
    Route::post('/cancel',[RequestServiceController::class,'cancelRequest']);
    Route::post('/complete',[RequestServiceController::class,'completeRequest']);
});





