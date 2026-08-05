<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\CustomRateLimiter;

use App\Http\Controllers\Auth\MobileAuthController;


Route::middleware([CustomRateLimiter::class])->prefix('account')->group( function (){
    Route::post('/login',[MobileAuthController::class,'mobileLogin']);
    Route::post('/register',[MobileAuthController::class,'registerMobile']);
});





