<?php

use App\Http\Middleware\CustomRateLimiter;
use Illuminate\Support\Facades\Route;
use App\Http\controllers\Bhr\DashboardController;
use App\Http\controllers\Bhr\EmployeeController;
use App\Http\Controllers\Login\LoginController;
use App\Http\Controllers\CompanyProfileController;
use App\Http\Controllers\Bhr\DepartmentController;
//begin:: api without Authentication
Route::middleware([CustomRateLimiter::class])->group(function () {
    // Route::post('logout', [ApiController::class,'logout_mobile']);
    // Route::post('auth/login', [ApiController::class, 'externalLogin']);
    Route::post('admin/login', [LoginController::class, 'apiLogin']);
});
//end:: api without Authentication

//begin::CompanyProfileController
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('company')->group(function () {
    Route::post('/save-logo', [CompanyProfileController::class, 'saveCompanyLogo']);
    Route::post('/logo-url', [CompanyProfileController::class, 'getCompanyLogo']);
    Route::post('/delete-logo', [CompanyProfileController::class, 'deleteCompanyLogo']);
    Route::post('/save-details', [CompanyProfileController::class, 'saveCompanyInfo']);
    Route::post('/details', [CompanyProfileController::class, 'getCompanyInfo']);
    Route::post('/info', [CompanyProfileController::class, 'getCompanyInfo']);
});
//end::CompanyProfileController

Route::prefix('dashboard')->group(function () {
    Route::post('/cards', [DashboardController::class, 'getCards']);
    Route::post('/overview-data', [DashboardController::class, 'getOverviewData']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('employee')->group(function () {

    Route::post('/save', [EmployeeController::class, 'saveEmployee']);
    Route::post('/list', [EmployeeController::class, 'getEmployeeList']);
    Route::post('/filter-options', [EmployeeController::class, 'getFilterOptions']);
    Route::post('/form-options', [EmployeeController::class, 'getFormOptions']);


    //Route::post('updateSenderStatus', [SenderController::class, 'updateSenderStatus']);
});

// Department routes

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('department')->group(function () {
    Route::post('/save', [DepartmentController::class, 'saveDepartment']);
    Route::post('/list', [DepartmentController::class, 'getDepartmentList']);
    Route::post('/options/{id}', [DepartmentController::class, 'getFormOptions']);
    Route::post('/delete', [DepartmentController::class, 'deleteDepartment']);
});
