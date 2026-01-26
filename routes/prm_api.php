s<?php

use App\Http\Controllers\CompanyProfileController;
use App\Http\Controllers\Auth\AuthController;

use App\Http\Middleware\CustomRateLimiter;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Prm\GeneralSettingsController;

use App\Http\Controllers\Prm\TenantController;
use App\Http\Controllers\Prm\BuildingController;
use App\Http\Controllers\Prm\BuildingSpaceController;
use App\Http\Controllers\Prm\ContractController;
use App\Http\Controllers\Prm\ServiceController;
use App\Http\Controllers\Prm\InvoiceController;
use App\Http\Controllers\Prm\PaymentController;
use App\Http\Controllers\Prm\ServiceRequestController;


use App\Http\Controllers\tenant\AccountStaffController;
use App\Http\Controllers\tenant\ZoneController;
use App\Http\Controllers\tenant\ContractsController;




//begin:: api without Authentication
Route::middleware([CustomRateLimiter::class])->group(function () {
    // Route::post('logout', [ApiController::class,'logout_mobile']);
    // Route::post('auth/login', [ApiController::class, 'externalLogin']);
    Route::post('admin/login', [AuthController::class, 'apiLogin']);
    //Route::post('auth/login', [AuthController::class, 'apiLogin']);
});
//end:: api without Authentication
// Route::post('/employee/attendance/scan',[AttendanceController::class,'scanAttendance']);
// Route::post('/employee/attendance/last-employees-scan',[AttendanceController::class,'getLastEmployeesScan']);
// Route::post('/create-contract', [ContractController::class, 'createContract']);



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
// Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('dashboard')->group(function () {
//     Route::post('/data', [DashboardController::class, 'getDashboardData']);
//     Route::post('/overview-data', [DashboardController::class, 'getOverviewData']);
// });


Route::middleware(['auth.api', CustomRateLimiter::class])->group( function (){
    Route::post('/form-option',[GeneralSettingsController::class,'select_options']);
});


Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('tenant')->group(function () {
    Route::post('/create', [TenantController::class, 'createTenant']);
    Route::post('/profile/photo',[TenantController::class,'getProfilePhoto']);
    Route::post('/profile/photo/delete',[TenantController::class,'deleteProfilePhoto']);
    Route::post('/profile/photo/create',[TenantController::class,'createProfilePhoto']);
    Route::post('/list-paginate', [TenantController::class, 'getListPaginate']);
    Route::post('/details', [TenantController::class, 'getDetails']);
    Route::post('/form-options', [TenantController::class, 'getFormOptions']);
    Route::post('/delete', [TenantController::class, 'delete']);
    Route::post('/update-status', [TenantController::class, 'updateMemberStatus']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('building-space')->group(function () {
    Route::post('/save', [BuildingSpaceController::class, 'saveBuildingSpace']);
    Route::post('/list-paginate', [BuildingSpaceController::class, 'getListPaginate']);
    Route::post('/details', [BuildingSpaceController::class, 'getDetails']);
    Route::post('/form-options', [BuildingSpaceController::class, 'getFormOptions']);
    Route::post('/delete', [BuildingSpaceController::class, 'delete']);
    Route::post('/update-status', [BuildingSpaceController::class, 'updateBuildingSpaceStatus']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('account-staff')->group(function () {
    Route::post('/save', [AccountStaffController::class, 'saveAccountStaff']);
    Route::post('/list-paginate', [AccountStaffController::class, 'getListAccountStaff']);
    Route::post('/details', [AccountStaffController::class, 'accountStaffDetails']);
    Route::post('/form-options', [AccountStaffController::class, 'getFormOptions']);
    Route::post('/delete', [AccountStaffController::class, 'deleteAccountStaff']);
    Route::post('/update-status', [AccountStaffController::class, 'updateAccountStaffStatus']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('zone')->group(function () {
    Route::post('/save', [ZoneController::class, 'saveZone']);
    Route::post('/list-paginate', [ZoneController::class, 'getListZone']);
    Route::post('/details', [ZoneController::class, 'ZoneDetails']);
    Route::post('/form-options', [ZoneController::class, 'getFormOptions']);
    Route::post('/delete', [ZoneController::class, 'deleteZone']);
    // Route::post('/update-status', [ZoneController::class, 'updateAccountStaffStatus']);
});


Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('building')->group(function () {
    Route::post('/save', [BuildingController::class, 'saveBuilding']);
    Route::post('/list-floor', [BuildingController::class, 'getListFloor']);
    Route::post('/list-paginate', [BuildingController::class, 'getListBuilding']);
    Route::post('/details', [BuildingController::class, 'buildingDetails']);
    Route::post('/form-options', [BuildingController::class, 'getFormOptions']);
    Route::post('/delete', [BuildingController::class, 'deleteBuilding']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('contract')->group(function () {
    Route::post('/save', [ContractController::class, 'saveContract']);
    Route::post('/list-paginate', [ContractController::class, 'getListPaginate']);
    Route::post('/details', [ContractController::class, 'contractDetails']);
    Route::post('/form-options', [ContractController::class, 'getFormOptions']);
    Route::post('/delete', [ContractController::class, 'deleteContract']);

});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('service-request')->group(function () {
    Route::post('/save', [ServiceRequestController::class, 'saveServiceRequest']);
    Route::post('/list',[ServiceRequestController::class, 'getServiceRequestListPaginate']);
    Route::post('/details',[ServiceRequestController::class, 'serviceRequestDetails']);
    Route::post('/delete',[ServiceRequestController::class,'delete']);
    Route::post('/update-status',[ServiceRequestController::class,'updateStatus']);
    Route::post('/from-options',[ServiceRequestController::class,'getFormOptions']);

});


Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('service')->group(function () {
    Route::post('/save', [ServiceController::class, 'saveService']);
    Route::post('/list-paginate', [ServiceController::class, 'getListPaginate']);
    Route::post('/details', [ServiceController::class, 'serviceDetails']);
    Route::post('/form-options', [ServiceController::class, 'getFormOptions']);
    Route::post('/delete', [ServiceController::class, 'deleteService']);
    Route::post('/update-status', [ServiceController::class, 'updateServiceStatus']);
});



Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('invoice')->group(function () {
    Route::post('/save', [InvoiceController::class, 'saveInvoice']);
    Route::post('/list-paginate', [InvoiceController::class, 'getListPaginate']);
    Route::post('/details', [InvoiceController::class, 'invoiceDetails']);
    Route::post('/form-options', [InvoiceController::class, 'getFormOptions']);
    Route::post('/delete', [InvoiceController::class, 'deleteInvoice']);
    Route::post('/update-status', [InvoiceController::class, 'updateInvoiceStatus']);
});


Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('contracts')->group(function () {
    Route::post('/save', [ContractsController::class, 'saveContracts']);
    Route::post('/list-paginate', [ContractsController::class, 'getListContracts']);
    Route::post('/details', [ContractsController::class, 'contractsDetails']);
    Route::post('/form-options', [ContractsController::class, 'getFormOptions']);
    Route::post('/delete', [ContractsController::class, 'deleteContracts']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('payments')->group(function () {
    Route::post('/save', [PaymentController::class, 'savePayment']);
    Route::post('/list-paginate', [PaymentController::class, 'getListPayment']);
    Route::post('/details', [PaymentController::class, 'paymentDetails']);
    Route::post('/form-options', [PaymentController::class, 'getFormOptions']);
    Route::post('/delete', [PaymentController::class, 'deletePayment']);
    Route::post('/update-status', [PaymentController::class, 'updatePaymentStatus']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('settings')->group(function () {
    Route::post('/options-floors', [GeneralSettingsController::class, 'getOptions_floors']);
    // Route::post('/options-program', [StudentController::class, 'getOptions_program']);

});


