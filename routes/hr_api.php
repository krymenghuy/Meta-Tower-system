<?php

use App\Http\Controllers\Bhr\BenefitController;
use App\Http\controllers\Bhr\DashboardController;
use App\Http\controllers\Bhr\EmployeeController;
use App\Http\Controllers\Bhr\JobLevelController;
use App\Http\Controllers\Bhr\PayrollController;
use App\Http\Controllers\Bhr\PayrollListController;
use App\Http\controllers\Bhr\SkillController;
use App\Http\controllers\Bhr\StaffBenefitController;
use App\Http\controllers\Bhr\StaffController;
use App\Http\controllers\Bhr\LeaveController;
use App\Http\Controllers\CompanyProfileController;
use App\Http\Controllers\Login\LoginController;
use App\Http\Middleware\CustomRateLimiter;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Bhr\DepartmentController;
use App\Http\Controllers\Bhr\PositionController;
use App\Http\Controllers\Bhr\ReportController;
use App\Http\Controllers\Bhr\WarningController;
use App\Http\Controllers\Bhr\SeniorityController;
use App\Http\Controllers\Bhr\WorkShiftController;
use App\Http\Controllers\Bhr\ShiftDetailController;
use App\Http\Controllers\Bhr\ScanPlanController;
use App\Http\Controllers\Bhr\AttendanceController;

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
    Route::post('/list-paginate', [EmployeeController::class, 'getListPaginate']);
    Route::post('/details', [EmployeeController::class, 'getDetails']);
    Route::post('/delete', [EmployeeController::class, 'deleteEmployee']);
    Route::post('/filter-options', [EmployeeController::class, 'getFilterOptions']);
    Route::post('/form-options', [EmployeeController::class, 'getFormOptions']);
    Route::post('/update-status', [EmployeeController::class, 'updateStatus']);

    //Route::post('updateSenderStatus', [SenderController::class, 'updateSenderStatus']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('department')->group(function () {

    Route::post('/save', [DepartmentController::class, 'saveDepartment']);
    Route::post('/list-paginate', [DepartmentController::class, 'getDepartmentListPaginate']);
    Route::post('/details', [DepartmentController::class, 'getDetails']);
    Route::post('/delete', [DepartmentController::class, 'deleteDepartment']);
    Route::post('/form-options', [DepartmentController::class, 'getFormOptions']);
});


Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('staff')->group(function () {

    Route::post('/save', [StaffController::class, 'saveStaff']);
    Route::post('/list-paginate', [StaffController::class, 'getListPaginate']);
    Route::post('/list', [StaffController::class, 'getListAll']);
    Route::post('/details', [StaffController::class, 'getDetails']);
    Route::post('/delete', [StaffController::class, 'deleteStaff']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('skills')->group(function () {

    Route::post('/save', [SkillController::class, 'saveSkill']);
    Route::post('/list', [SkillController::class, 'getSkillList']);
    Route::post('/list-paginate', [SkillController::class, 'getSkillListPaginate']);
    Route::post('/details', [SkillController::class, 'getDetails']);
    Route::post('/delete', [SkillController::class, 'deleteSkill']);
    Route::post('/form-options', [SkillController::class, 'getFormOptions']);
    Route::post('/save-logo', [SkillController::class, 'saveSkillLogo']);
    Route::post('/logo-url', [SkillController::class, 'getSkillLogo']);
    Route::post('/delete-logo', [SkillController::class, 'deleteSkillLogo']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('benefit')->group(function () {

    Route::post('/save', [BenefitController::class, 'saveBenefit']);
    Route::post('/list', [BenefitController::class, 'getBenefitList']);
    Route::post('/list-paginate', [BenefitController::class, 'getBenefitListPaginate']);
    Route::post('/details', [BenefitController::class, 'getDetails']);
    Route::post('/delete', [BenefitController::class, 'deleteBenefit']);
    Route::post('/form-options', [BenefitController::class, 'getFormOptions']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('seniorities')->group(function () {

    Route::post('/save', [SeniorityController::class, 'saveSeniority']);
    Route::post('/list-paginate', [SeniorityController::class, 'getSeniorityListPaginate']);
    Route::post('/details', [SeniorityController::class, 'getDetails']);
    Route::post('/delete', [SeniorityController::class, 'deleteSeniority']);
    Route::post('/form-options', [SeniorityController::class, 'getFormOptions']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('staff-benefit')->group(function () {

    Route::post('/save', [StaffBenefitController::class, 'saveStaffBenefit']);
    Route::post('/list-paginate', [StaffBenefitController::class, 'getStaffBenefitListPaginate']);
    Route::post('/details', [StaffBenefitController::class, 'getDetails']);
    Route::post('/delete', [StaffBenefitController::class, 'deleteStaffBenefit']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('payroll')->group(function () {

    Route::post('/save', [PayrollController::class, 'savePayroll']);
    Route::post('/list-paginate', [PayrollController::class, 'getPayrollListPaginate']);
    Route::post('/details', [PayrollController::class, 'getDetails']);
    Route::post('/delete', [PayrollController::class, 'deletePayroll']);
    Route::post('/form-options', [PayrollController::class, 'getFormOptions']);
    Route::post('/update-status', [PayrollController::class, 'updateStatus']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('payroll-list')->group(function () {

    Route::post('/save', [PayrollListController::class, 'savePayrollList']);
    Route::post('/list-paginate', [PayrollListController::class, 'getPayrollListPaginate']);
    Route::post('/details', [PayrollListController::class, 'getDetails']);
    Route::post('/delete', [PayrollListController::class, 'deletePayrollList']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('leaves')->group(function () {

    Route::post('/save', [LeaveController::class, 'save']);
    Route::post('/list-paginate', [LeaveController::class, 'getLeaveListPaginate']);
    Route::post('/details', [LeaveController::class, 'getDetails']);
    Route::post('/delete', [LeaveController::class, 'delete']);
    Route::post('/form-options', [LeaveController::class, 'getFormOptions']);
    Route::post('/update-status', [LeaveController::class, 'updateStatus']);
});

// Job Level routes

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('job_level')->group(function () {
    Route::post('/save', [JobLevelController::class, 'saveJobLevel']);
    Route::post('/list', [JobLevelController::class, 'getJobLevelList']);
    Route::post('/list-paginate', [JobLevelController::class, 'getJobLevelListPaginate']);
    Route::post('/detail', [JobLevelController::class, 'getDetails']);
    Route::post('/form-options', [JobLevelController::class, 'getFormOptions']);
    Route::post('/delete', [JobLevelController::class, 'deleteJobLevel']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('position')->group(function () {

    Route::post('/save', [PositionController::class, 'savePosition']);
    Route::post('/list-paginate', [PositionController::class, 'getPositionListPaginate']);
    Route::post('/details', [PositionController::class, 'getDetails']);
    Route::post('/delete', [PositionController::class, 'deletePosition']);
    Route::post('/form-options', [PositionController::class, 'getFormOptions']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('report')->group(function () {

    Route::post('/save', [ReportController::class, 'saveReport']);
    Route::post('/list-paginate', [ReportController::class, 'getReportListPaginate']);
    Route::post('/details', [ReportController::class, 'getDetails']);
    Route::post('/delete', [ReportController::class, 'deleteReport']);
    Route::post('/form-options', [ReportController::class, 'getFormOptions']);


});

// warning routes

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('warning')->group(function () {

    Route::post('/save', [WarningController::class, 'saveWarning']);
    Route::post('/list-paginate', [WarningController::class, 'getWarningListPaginate']);
    Route::post('/details', [WarningController::class, 'getDetails']);
    Route::post('/delete', [WarningController::class, 'deleteWarning']);
    Route::post('/form-options', [WarningController::class, 'getFormOptions']);
    Route::post('/update-status', [WarningController::class, 'updateStatus']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('work-shifts')->group(function () {

    Route::post('/save', [WorkShiftController::class, 'saveWorkShift']);
    Route::post('/list-paginate', [WorkShiftController::class, 'getWorkShiftListPaginate']);
    Route::post('/details', [WorkShiftController::class, 'getDetails']);
    Route::post('/delete', [WorkShiftController::class, 'deleteWorkShift']);
    Route::post('/form-options', [WorkShiftController::class, 'getFormOptions']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('shift-details')->group(function () {

    Route::post('/save', [ShiftDetailController::class, 'saveShiftDetails']);
    Route::post('/list-paginate', [ShiftDetailController::class, 'getShiftDetailsListPaginate']);
    Route::post('/details', [ShiftDetailController::class, 'getDetails']);
    Route::post('/delete', [ShiftDetailController::class, 'deleteShiftDetails']);
    Route::post('/form-options', [ShiftDetailController::class, 'getFormOptions']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('scan-plan')->group(function () {

    Route::post('/save', [ScanPlanController::class, 'saveScanPlan']);
    Route::post('/list-paginate', [ScanPlanController::class, 'getScanPlanListPaginate']);
    Route::post('/details', [ScanPlanController::class, 'getDetails']);
    Route::post('/delete', [ScanPlanController::class, 'deleteScanPlan']);
    Route::post('/form-options', [ScanPlanController::class, 'getFormOptions']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('attendances')->group(function () {

    Route::post('/save', [AttendanceController::class, 'saveAttendance']);
    Route::post('/list', [AttendanceController::class, 'attendanceList']);
    Route::post('/details', [AttendanceController::class, 'getDetails']);
    Route::post('/delete', [AttendanceController::class, 'deleteAttendance']);
    Route::post('/form-options', [AttendanceController::class, 'getFormOptions']);
});
