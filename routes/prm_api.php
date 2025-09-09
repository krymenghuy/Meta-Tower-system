<?php

use App\Http\Controllers\Ypg\DashboardController;
use App\Http\Controllers\CompanyProfileController;
use App\Http\Controllers\Login\LoginController;

use App\Http\Middleware\CustomRateLimiter;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Ypg\ReportController;
use App\Http\Controllers\Ypg\GeneralSettingsController;

use App\Http\Controllers\Ypg\MemberController;

use App\Http\Controllers\Ypg\TaskTypeController;
use App\Http\Controllers\Ypg\TaskAssignController;
use App\Http\Controllers\Ypg\DeceasedRegistrationController;
use App\Http\Controllers\Ypg\GraveSlotController;
use App\Http\Controllers\tenant\AccountStaffController;

//begin:: api without Authentication
Route::middleware([CustomRateLimiter::class])->group(function () {
    // Route::post('logout', [ApiController::class,'logout_mobile']);
    // Route::post('auth/login', [ApiController::class, 'externalLogin']);
    Route::post('admin/login', [LoginController::class, 'apiLogin']);
    //Route::post('auth/login', [LoginController::class, 'apiLogin']);
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
Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('dashboard')->group(function () {
    Route::post('/data', [DashboardController::class, 'getDashboardData']);
    Route::post('/overview-data', [DashboardController::class, 'getOverviewData']);
});


Route::middleware(['auth.api', CustomRateLimiter::class])->group( function (){
    Route::post('/form-option',[GeneralSettingsController::class,'select_options']);
});
Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('reports')->group(function(){
    Route::post('/list',[ReportController::class,'getReportList']);
    Route::post('member/list-by-status', [ReportController::class, 'getMemberListByStatus']);
    Route::post('/expired-members', [ReportController::class, 'getExpiredMembers']);
    Route::post('/task-assign', [ReportController::class, 'getTaskAssign']);
    Route::post('/grave-ownership' , [ReportController::class, 'getGraveOwnership']);
    Route::post('/unused-grave-slot', [ReportController::class, 'getUnusedGraveSlot']);
    Route::post('/deceased-registration', [ReportController::class, 'getDeceasedRegistration']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('member')->group(function () {
    Route::post('/save', [MemberController::class, 'saveMember']);
    Route::post('/profile/photo',[MemberController::class,'getProfilePhoto']);
    Route::post('/profile/photo/delete',[MemberController::class,'deleteProfilePhoto']);
    Route::post('/profile/photo/save',[MemberController::class,'saveProfilePhoto']);
    Route::post('/list-paginate', [MemberController::class, 'getListMember']);
    Route::post('/details', [MemberController::class, 'memberDetails']);
    Route::post('/form-options', [MemberController::class, 'getFormOptions']);
    Route::post('/delete', [MemberController::class, 'deleteMember']);
    Route::post('/update-status', [MemberController::class, 'updateMemberStatus']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('grave-slot')->group(function () {
    Route::post('/save', [GraveSlotController::class, 'saveGrave']);
    Route::post('/photo', [GraveSlotController::class, 'getPhoto']);
    Route::post('/photo/save', [GraveSlotController::class, 'savePhoto']);
    Route::post('/photo/delete', [GraveSlotController::class, 'deletePhoto']);
    Route::post('/list-paginate', [GraveSlotController::class, 'getListGrave']);
    Route::post('/details', [GraveSlotController::class, 'getGraveDetails']);
    Route::post('/form-options', [GraveSlotController::class, 'getFormOptions']);
    Route::post('/delete', [GraveSlotController::class, 'deleteGrave']);
     Route::post('/update-status', [GraveSlotController::class, 'updateGraveStatus']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('task-type')->group(function () {
    Route::post('/save', [TaskTypeController::class, 'save']);
    Route::post('/list-paginate', [TaskTypeController::class, 'getList']);
    Route::post('/details', [TaskTypeController::class, 'getDetails']);
    Route::post('/form-options', [TaskTypeController::class, 'getFormOptions']);
    Route::post('/delete', [TaskTypeController::class, 'delete']);
    Route::post('/update-status', [TaskTypeController::class, 'updateStatus']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('task-assign')->group(function () {
    Route::post('/save', [TaskAssignController::class, 'save']);
    Route::post('/list-paginate', [TaskAssignController::class, 'getList']);
    Route::post('/details', [TaskAssignController::class, 'getDetails']);
    Route::post('/form-options', [TaskAssignController::class, 'getFormOptions']);
    Route::post('/delete', [TaskAssignController::class, 'delete']);
    Route::post('/update-status', [TaskAssignController::class, 'updateStatus']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('deceased-registration')->group(function () {
    Route::post('/save', [DeceasedRegistrationController::class, 'save']);
    Route::post('/list-paginate', [DeceasedRegistrationController::class, 'getList']);
    Route::post('/details', [DeceasedRegistrationController::class, 'getDetails']);
    Route::post('/form-options', [DeceasedRegistrationController::class, 'getFormOptions']);
    Route::post('/delete', [DeceasedRegistrationController::class, 'delete']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('account-staff')->group(function () {
    Route::post('/save', [AccountStaffController::class, 'saveAccountStaff']);
    Route::post('/list-paginate', [AccountStaffController::class, 'getListAccountStaff']);
    Route::post('/details', [AccountStaffController::class, 'accountStaffDetails']);
    Route::post('/form-options', [AccountStaffController::class, 'getFormOptions']);
    Route::post('/delete', [AccountStaffController::class, 'deleteAccountStaff']);
});
   

