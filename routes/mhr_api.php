<?php

use App\Http\Controllers\CompanyProfileController;
use App\Http\Controllers\Auth\AuthController;

use App\Http\Middleware\CustomRateLimiter;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Prm\GeneralSettingsController;
use App\Http\Controllers\Mhr\EmployeeController;
use App\Http\Controllers\Mhr\EmployeeSkillController;
use  App\Http\Controllers\Mhr\LeaveController;
use  App\Http\Controllers\Mhr\PayrollController;
use  App\Http\Controllers\Mhr\PayrollListController;






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
    Route::post('/skills/list', [EmployeeSkillController::class, 'getList']);
    Route::post('/skills/save', [EmployeeSkillController::class, 'save']);
    Route::post('/skills/delete', [EmployeeSkillController::class, 'delete']);
    Route::post('/skills/details', [EmployeeSkillController::class, 'getDetails']);


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
