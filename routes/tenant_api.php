<?php

use App\Http\Controllers\CompanyProfileController;
use App\Http\Controllers\Auth\AuthController;

use App\Http\Middleware\CustomRateLimiter;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Prm\GeneralSettingsController;

use App\Http\Controllers\Tenant\DashboardController;
use App\Http\Controllers\tenant\ZoneController;
use App\Http\Controllers\Tenant\ContractsController;
use App\Http\Controllers\Tenant\TenantProfileController;
use App\Http\Controllers\Tenant\BookAmenityController;
use App\Http\Controllers\Tenant\RequestServiceController;
use App\Http\Controllers\Tenant\ReceiptController as TenantReceiptController;
use App\Http\Controllers\Tenant\InvoiceController as TenantInvoiceController;
use App\Http\Controllers\Tenant\TeamController;




//begin:: api without Authentication
Route::middleware([CustomRateLimiter::class])->group(function () {
    // Route::post('logout', [ApiController::class,'logout_mobile']);
    // Route::post('auth/login', [ApiController::class, 'externalLogin']);
    Route::post('admin/login', [AuthController::class, 'apiLogin']);
    //Route::post('auth/login', [AuthController::class, 'apiLogin']);
});
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
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('dashboard')->group(function () {
    Route::post('/summary', [DashboardController::class, 'summarizeDashboard']);
    Route::post('/data', [DashboardController::class, 'getDashboardData']);
    Route::post('/charts', [DashboardController::class, 'getCharts']);
    Route::post('/activities', [DashboardController::class, 'getActivities']);
    Route::post('/lease-expiry', [DashboardController::class, 'getLeaseExpiry']);
    Route::post('/filter-options', [DashboardController::class, 'getFilterOptions']);

});
Route::middleware(['auth.api', CustomRateLimiter::class])->group( function (){
    Route::post('/form-option',[GeneralSettingsController::class,'select_options']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('zone')->group(function () {
    Route::post('/save', [ZoneController::class, 'saveZone']);
    Route::post('/list-paginate', [ZoneController::class, 'getListZone']);
    Route::post('/details', [ZoneController::class, 'ZoneDetails']);
    Route::post('/form-options', [ZoneController::class, 'getFormOptions']);
    Route::post('/delete', [ZoneController::class, 'deleteZone']);
    // Route::post('/update-status', [ZoneController::class, 'updateAccountStaffStatus']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('tenantProfile')->group(function () {
    Route::post('/create', [TenantProfileController::class, 'createTenant']);
    Route::post('/profile/photo',[TenantProfileController::class,'getProfilePhoto']);
    Route::post('/profile/photo/delete',[TenantProfileController::class,'deleteProfilePhoto']);
    Route::post('/profile/photo/create',[TenantProfileController::class,'createProfilePhoto']);
    Route::post('/list-paginate', [TenantProfileController::class, 'getListPaginate']);
    Route::post('/details', [TenantProfileController::class, 'getDetails']);
    Route::post('/form-options', [TenantProfileController::class, 'getFormOptions']);
    Route::post('/delete', [TenantProfileController::class, 'delete']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('reservation')->group(function () {
    Route::post('/save', [BookAmenityController::class, 'saveReservation']);
    Route::post('/list-paginate', [BookAmenityController::class, 'getListPaginate']);
    Route::post('/details', [BookAmenityController::class, 'reservationDetails']);
    Route::post('/form-options', [BookAmenityController::class, 'getFormOptions']);
    Route::post('/delete', [BookAmenityController::class, 'deleteReservation']);
    Route::post('/update-status', [BookAmenityController::class, 'updateReservationStatus']);
    Route::post('/get-amenity-info', [BookAmenityController::class, 'getAmenityInfo']);
    Route::post('/cancel', [BookAmenityController::class, 'cancelReservation']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('request-service')->group(function () {
    Route::post('/save', [RequestServiceController::class, 'saveServiceRequest']);
    Route::post('/list',[RequestServiceController::class, 'getServiceRequestList']);
    Route::post('/details',[RequestServiceController::class, 'serviceRequestDetails']);
    Route::post('/delete',[RequestServiceController::class,'delete']);
    Route::post('/form-options',[RequestServiceController::class,'getFormOptions']);
    Route::post('/accept',[RequestServiceController::class,'acceptRequest']);
    Route::post('/reject',[RequestServiceController::class,'rejectRequest']);
    Route::post('/cancel',[RequestServiceController::class,'cancelRequest']);
    Route::post('/complete',[RequestServiceController::class,'completeRequest']);
});


Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('contract')->group(function () {
    Route::post('/save', [ContractsController::class, 'saveContracts']);
    Route::post('/list-paginate', [ContractsController::class, 'getListContracts']);
    Route::post('/details', [ContractsController::class, 'contractsDetails']);
    Route::post('/list-renewals', [ContractsController::class, 'getListRenewals']);
    Route::post('/form-options', [ContractsController::class, 'getFormOptions']);
    Route::post('/delete', [ContractsController::class, 'deleteContracts']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('invoice')->group(function () {
    Route::post('/list-paginate', [TenantInvoiceController::class, 'getListPaginate']);
    Route::post('/details', [TenantInvoiceController::class, 'invoiceDetails']);
    Route::post('/form-options', [TenantInvoiceController::class, 'getFormOptions']);
    Route::post('/save', [TenantInvoiceController::class, 'saveInvoice']);
    Route::post('/receive', [TenantInvoiceController::class, 'receive']);
    Route::post('/delete', [TenantInvoiceController::class, 'deleteInvoice']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('receipt')->group(function () {
    Route::post('/list-paginate', [TenantReceiptController::class, 'getListPaginate']);
    Route::post('/details', [TenantReceiptController::class, 'receiptDetails']);
    Route::post('/form-options', [TenantReceiptController::class, 'getFormOptions']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('team')->group(function () {
    Route::post('/save', [TeamController::class, 'saveTeamTenant']);
    Route::post('/save-member', [TeamController::class, 'saveTeamMember']);
    Route::post('/list', [TeamController::class, 'getTeamList']);
    Route::post('/member-list', [TeamController::class, 'getListTeamMemberPaginate']);
    Route::post('/details', [TeamController::class, 'getTeamDetails']);
    Route::post('/member-details', [TeamController::class, 'getMemberDetails']);
    Route::post('/form-options', [TeamController::class, 'getFormOptions']);
    Route::post('/form-options-member', [TeamController::class, 'getFormOptionsMember']);
    Route::post('/delete', [TeamController::class, 'deleteTeam']);
    Route::post('/delete-member', [TeamController::class, 'deleteTeamMember']);
    Route::post('/profile/photo/delete', [TeamController::class, 'deleteProfilePhoto']);
    Route::post('/profile/photo/save', [TeamController::class, 'saveProfilePhoto']);
    Route::post('/update-status', [TeamController::class, 'updateTeamStatus']);
});



