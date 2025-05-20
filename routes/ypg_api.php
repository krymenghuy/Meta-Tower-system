<?php

use App\Http\Controllers\Ypg\DashboardController;
use App\Http\Controllers\CompanyProfileController;
use App\Http\Controllers\Login\LoginController;
use App\Http\Middleware\CustomRateLimiter;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Ypg\ReportController;
use App\Http\Controllers\Ypg\GeneralSettingsController;

//begin:: api without Authentication
Route::middleware([CustomRateLimiter::class])->group(function () {
    // Route::post('logout', [ApiController::class,'logout_mobile']);
    // Route::post('auth/login', [ApiController::class, 'externalLogin']);
    Route::post('admin/login', [LoginController::class, 'apiLogin']);
    //Route::post('auth/login', [LoginController::class, 'apiLogin']);
});
//end:: api without Authentication
Route::post('/employee/attendance/scan',[AttendanceController::class,'scanAttendance']);
Route::post('/employee/attendance/last-employees-scan',[AttendanceController::class,'getLastEmployeesScan']);
Route::post('/create-contract', [ContractController::class, 'createContract']);

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

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('non-staff')->group(function () {
    Route::post('/promotion/form-options', [EmployeeController::class, 'getFormOptions_non_staff']);
    Route::post('/promote',[EmployeeController::class,'promoteNonStaff']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->group( function (){
    Route::post('/form-option',[GeneralSettingsController::class,'select_options']);
});
Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('reports')->group(function(){
    Route::post('/list',[ReportController::class,'getReportList']);
    Route::post('employee/list-by-branch', [ReportController::class, 'getEmployeeList']);
    Route::post('employee/list-by-type', [ReportController::class, 'getEmployeeListByType']);
    Route::post('employee/attendance-report', [ReportController::class, 'getEmployeeAttendance']);
    Route::post('employee/attendance-summary', [ReportController::class, 'getEmployeeAttendanceSummary']);
    Route::post('employee/payroll-expenses-by-month', [ReportController::class, 'getPayrollExpensesByMonth']);
    Route::post('employee/payroll-list', [ReportController::class, 'getPayrollList']);
    Route::post('employee/employee-benefits-report', [ReportController::class, 'getEmployeeBenefitsReport']);
    Route::post('employee/employee-account-report', [ReportController::class, 'getEmployeeAccountReport']);
    Route::post('employee/for-each-account', [ReportController::class, 'getForEachAccount']);
    Route::post('employee/wallet-account-list', [ReportController::class, 'getWalletAccountList']);
    Route::post('employee/payslip-print', [ReportController::class, 'getPayslipPrint']);
    Route::post('employee/employee-movement-report', [ReportController::class, 'getEmployeeMovementReport']);
    Route::post('employee/print-employee-cv', [ReportController::class, 'getPrintEmployeeCV']);
});
