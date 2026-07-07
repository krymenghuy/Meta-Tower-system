<?php

use App\Http\Controllers\CompanyProfileController;
use App\Http\Controllers\Auth\AuthController;

use App\Http\Middleware\CustomRateLimiter;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Prm\GeneralSettingsController;
use App\Http\Controllers\Mhr\EmployeeController;
use  App\Http\Controllers\Mhr\LeaveController;






//begin:: api without Authentication
Route::middleware([CustomRateLimiter::class])->group(function () {
    // Route::post('logout', [ApiController::class,'logout_mobile']);
    // Route::post('auth/login', [ApiController::class, 'externalLogin']);
    Route::post('admin/login', [AuthController::class, 'apiLogin']);
    //Route::post('auth/login', [AuthController::class, 'apiLogin']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('employee')->group(function () {
    Route::post('/save', [EmployeeController::class, 'saveEmployee']);
    Route::post('/list-paginate', [EmployeeController::class, 'getListPaginate']);
    Route::post('/details', [EmployeeController::class, 'getDetails']);
    Route::post('/form-options', [EmployeeController::class, 'getFormOptions']);
    Route::post('/delete', [EmployeeController::class, 'deleteEmployee']);


});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('leave')->group(function () {
    Route::post('/save', [LeaveController::class, 'saveLeave']);
    Route::post('/list-paginate', [LeaveController::class, 'getLeaveListPaginate']);
    Route::post('/uninformed', [LeaveController::class, 'getLeaveUninformList']);
    Route::post('/details', [LeaveController::class, 'getDetails']);
    Route::post('/delete', [LeaveController::class, 'delete']);
    Route::post('/form-options', [LeaveController::class, 'getFormOptions']);
    Route::post('/update-status', [LeaveController::class, 'updateStatus']);
    Route::post('/list', [LeaveController::class, 'getLeaveList']);
});


