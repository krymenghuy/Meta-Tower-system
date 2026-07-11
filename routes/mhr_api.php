<?php

use App\Http\Controllers\CompanyProfileController;
use App\Http\Controllers\Auth\AuthController;

use App\Http\Controllers\Mhr\EmployeeBenefitController;
use App\Http\Middleware\CustomRateLimiter;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Prm\GeneralSettingsController;
use App\Http\Controllers\Mhr\EmployeeController;
use App\Http\Controllers\Mhr\MovementController;
use App\Http\Controllers\Mhr\EmployeeSkillController;
use App\Http\Controllers\Mhr\EmployeeEducationController;
use App\Http\Controllers\Mhr\EmployeeExperienceController;
use App\Http\Controllers\Mhr\EmployeeDocumentController;
use  App\Http\Controllers\Mhr\LeaveController;
use  App\Http\Controllers\Mhr\PayrollController;
use  App\Http\Controllers\Mhr\PayrollListController;
use  App\Http\Controllers\Mhr\DashboardController;
use  App\Http\Controllers\Mhr\BenefitController;
use  App\Http\Controllers\Mhr\AccountController;
use  App\Http\Controllers\Mhr\StaffAttendanceController;


Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('dashboard')->group(function () {
    Route::post('/data', [DashboardController::class, 'getDashboardData']);
    Route::post('/overview-data', [DashboardController::class, 'getOverviewData']);
});



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
    // skills
    Route::post('/skills/list', [EmployeeSkillController::class, 'getList']);
    Route::post('/skills/save', [EmployeeSkillController::class, 'save']);
    Route::post('/skills/delete', [EmployeeSkillController::class, 'delete']);
    Route::post('/skills/details', [EmployeeSkillController::class, 'getDetails']);
    // educations
    Route::post('/educations/list', [EmployeeEducationController::class, 'getList']);
    Route::post('/educations/save', [EmployeeEducationController::class, 'save']);
    Route::post('/educations/delete', [EmployeeEducationController::class, 'delete']);
    Route::post('/educations/details', [EmployeeEducationController::class, 'getDetails']);
    // experiences
    Route::post('/experiences/list', [EmployeeExperienceController::class, 'getList']);
    Route::post('/experiences/save', [EmployeeExperienceController::class, 'save']);
    Route::post('/experiences/delete', [EmployeeExperienceController::class, 'delete']);
    Route::post('/experiences/details', [EmployeeExperienceController::class, 'getDetails']);
    Route::post('/experiences/form-options', [EmployeeExperienceController::class, 'getFormOptions']);
    // document
    Route::post('/documents/list', [EmployeeDocumentController::class, 'getList']);
    Route::post('/documents/save', [EmployeeDocumentController::class, 'save']);
    Route::post('/documents/delete', [EmployeeDocumentController::class, 'delete']);
    Route::post('/documents/details', [EmployeeDocumentController::class, 'getDetails']);
    Route::post('/documents/form-options', [EmployeeDocumentController::class, 'getFormOptions']);
    Route::post('/documents/download', [EmployeeDocumentController::class, 'download']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('emp-event')->group(function () {
    Route::post('/save', [MovementController::class, 'saveEmployeeMovement']);
    Route::post('/list-paginate', [MovementController::class, 'getEmployeeMovementListPaginate']);
    Route::post('/details', [MovementController::class, 'getDetails']);
    Route::post('/delete', [MovementController::class, 'deleteEmployeeMovement']);
    Route::post('/form-options', [MovementController::class, 'getFormOptions']);
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

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('payroll')->group(function () {
    Route::post('/import-staff', [PayrollController::class, 'importStaffList']);
    Route::post('/calculate', [PayrollController::class, 'calculatePayroll']);
    Route::post('/save', [PayrollController::class, 'savePayroll']);
    Route::post('disburse-one', [PayrollListController::class, 'disburseOne']);
    Route::post('disburse-all', [PayrollController::class, 'disburseAll']);
    Route::post('/list-paginate', [PayrollController::class, 'getPayrollListPaginate']);
    Route::post('/details', [PayrollController::class, 'getDetails']);
    Route::post('/delete', [PayrollController::class, 'deletePayroll']);
    Route::post('/form-options', [PayrollController::class, 'getFormOptions']);
    Route::post('/authorize', [PayrollController::class, 'authorizePayroll']);
    //Route::post('/update-disburse', [PayrollController::class, 'updateDisburse']);
    Route::post('/list', [PayrollController::class, 'getPayrollList']);
    Route::post('/staff-list', [PayrollController::class, 'getStaffList']);
    Route::post('/staff/list', [PayrollController::class, 'getStaffList']);
    Route::post('/get-end-date', [PayrollController::class, 'getEndDate']);
    Route::post('/reset', [PayrollController::class, 'reset']);
    Route::post('/reset-reverse', [PayrollController::class, 'resetStatus']);
    Route::post('/reverse', [PayrollController::class, 'reverseTransactions']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('payroll/staff')->group(function () {
    Route::post('/save', [PayrollListController::class, 'addStaff']);
    Route::post('/list', [PayrollListController::class, 'getList']);
    Route::post('/details', [PayrollListController::class, 'getDetails']);
    Route::post('/remove', [PayrollListController::class, 'delete']);
    Route::post('/form-options', [PayrollListController::class, 'getFormOptions']);
    //Route::post('/import', [PayrollListController::class, 'importPayrollList']);
    //Route::post('calculate', [PayrollListController::class, 'calculatePayrollList']);
    Route::post('disburse', [PayrollListController::class, 'disburseOne']);
    //Route::post('disburse-all', [PayrollController::class, 'disburseAll']);
    Route::post('pay-slip', [PayrollListController::class, 'paySlip']);
    Route::post('/list', [PayrollController::class, 'getStaffList']);
    Route::post('/add-deduction', [PayrollListController::class, 'addDeduction']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('emp-benefit')->group(function () {
    Route::post('/import-emp-benefits', [EmployeeBenefitController::class, 'import']);
    Route::post('/save', [EmployeeBenefitController::class, 'saveBenefit']);
    Route::post('/bonus-list', [EmployeeBenefitController::class, 'getBonusList']);
    Route::post('/seniority-list', [EmployeeBenefitController::class, 'getSeniorityList']);
    Route::post('/life_insurance-list', [EmployeeBenefitController::class, 'getLifeInsurancesList']);
    Route::post('/details', [EmployeeBenefitController::class, 'getDetails']);
    Route::post('/delete', [EmployeeBenefitController::class, 'deleteBenefit']);
    Route::post('/form-options', [EmployeeBenefitController::class, 'getFormOptions']);
    Route::post('/all-list', [EmployeeBenefitController::class, 'getAllBenefitList']);
    Route::post('/import', [EmployeeBenefitController::class, 'importBenefit']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('benefit')->group(function () {

    Route::post('/save', [BenefitController::class, 'saveBenefit']);
    Route::post('/list-paginate', [BenefitController::class, 'getBenefitPaginate']);
    Route::post('/details', [BenefitController::class, 'getDetails']);
    Route::post('/delete', [BenefitController::class, 'deleteBenefit']);
    Route::post('/form-options', [BenefitController::class, 'getFormOptions']);

});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('account')->group(function () {

    Route::post('/save', [AccountController::class, 'saveAccount']);
    Route::post('/bulk-create', [AccountController::class, 'bulkCreateAccounts']);
    //Route::post('/save-missing-account-wallet', [AccountController::class, 'saveMissingAccountWallet']);
    Route::post('/payroll-account/list', [AccountController::class, 'getPayrollAccountList']);
    Route::post('/wallet-account/list', [AccountController::class, 'getWalletAccountList']);
    Route::post('/details', [AccountController::class, 'getDetails']);
    Route::post('/delete', [AccountController::class, 'deleteAccount']);
    Route::post('/form-options', [AccountController::class, 'getFormOptions']);
    Route::post('/deposit', [AccountController::class, 'deposit']);
    Route::post('/with-draw', [AccountController::class, 'withdraw']);
    Route::post('/transfer', [AccountController::class, 'transfer']);
    Route::post('/transferTo', [AccountController::class, 'transferTo']);
    Route::post('/get-info', [AccountController::class, 'getAccountInfo']);
    Route::post('/get-confirm', [AccountController::class, 'getConfirmTransfer']);
    Route::post('/print-transaction', [AccountController::class, 'printTransaction']);
    Route::post('/transaction/create', [AccountController::class, 'createTransactions']);
    Route::post('/deposit/form-options', [AccountController::class, 'getFormOptions_deposit']);

});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('attendances')->group(function () {

    Route::post('/save', [StaffAttendanceController::class, 'saveAttendance']);
    Route::post('/list', [StaffAttendanceController::class, 'attendanceList']);
    Route::post('/details', [StaffAttendanceController::class, 'getDetails']);
    Route::post('/delete', [StaffAttendanceController::class, 'deleteAttendance']);
    Route::post('/form-options', [StaffAttendanceController::class, 'getFormOptions']);
    Route::post('/list-paginate', [StaffAttendanceController::class, 'getStaffAttendanceListPaginate']);
    Route::post('/list-paginate2', [StaffAttendanceController::class, 'getStaffAttendanceListPaginate']);
});