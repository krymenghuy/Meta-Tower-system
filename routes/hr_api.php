<?php

use App\Http\Controllers\Bhr\BenefitController;
use App\Http\controllers\Bhr\DashboardController;
use App\Http\controllers\Bhr\EmployeeController;
use App\Http\Controllers\Bhr\JobLevelController;
use App\Http\Controllers\Bhr\PayrollController;
use App\Http\Controllers\Bhr\PayrollListController;
use App\Http\controllers\Bhr\SkillController;
use App\Http\controllers\Bhr\LeaveController;
use App\Http\Controllers\CompanyProfileController;
use App\Http\Controllers\Login\LoginController;
use App\Http\Middleware\CustomRateLimiter;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Bhr\DepartmentController;
use App\Http\Controllers\Bhr\PositionController;
use App\Http\Controllers\Bhr\ReportController;
use App\Http\Controllers\Bhr\WarningController;
use App\Http\Controllers\Bhr\WorkShiftController;
use App\Http\Controllers\Bhr\ShiftDetailController;
use App\Http\Controllers\Bhr\ScanPlanController;
use App\Http\Controllers\Bhr\AttendanceController;
use App\Http\Controllers\Bhr\MovementController;
use App\Http\Controllers\Bhr\SalaryHistoryController;
use App\Http\Controllers\Bhr\BranchChangeController;
use App\Http\Controllers\Bhr\EventController;
use App\Http\Controllers\Bhr\EmployeeEventController;
use App\Http\Controllers\Bhr\EducationController;
use App\Http\Controllers\Bhr\ExperienceController;
use App\Http\Controllers\Bhr\AccountController;
use App\Http\Controllers\Bhr\HolidayController;
use App\Http\Controllers\Bhr\TaxAllowanceController;
use App\Http\Controllers\Bhr\TaxBracketController;
use App\Http\Controllers\Bhr\TransactionController;
use App\Http\Controllers\Bhr\WalletAccountController;
use App\Http\Controllers\Bhr\PromoteEmployeeController;
use App\Http\Controllers\Bhr\ShiftDetailsController;
use App\Http\Controllers\Bhr\GeneralSettingsController;


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
    Route::post('/find', [EmployeeController::class, 'findEmployee']);
    Route::post('/details', [EmployeeController::class, 'getDetails']);
    Route::post('/delete', [EmployeeController::class, 'deleteEmployee']);
    Route::post('/filter-options', [EmployeeController::class, 'getFilterOptions']);
    Route::post('/form-options', [EmployeeController::class, 'getFormOptions']);
    Route::post('/promote-intern', [EmployeeController::class, 'promoteIntern']);
    Route::post('/promote-staff',[EmployeeController::class,'promoteStaff']);
    Route::post('/set-terminate-status', [EmployeeController::class, 'setTerminateStatus']);
    Route::post('/set-resign-status',[EmployeeController::class,'setResignStatus']);
    Route::post('/set-rejoin-status',[EmployeeController::class,'setRejoinStatus']);
    Route::post('/list', [EmployeeController::class, 'getEmployeeList']);

    //Route::post('updateSenderStatus', [SenderController::class, 'updateSenderStatus']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('event')->group(function () {
    Route::post('/save', [EventController::class, 'createEvent']);
    Route::post('/list-paginate', [EventController::class, 'getEventListPaginate']);
    Route::post('/details', [EventController::class, 'getDetails']);
    Route::post('/delete', [EventController::class, 'deleteEvent']);
    Route::post('/form-options', [EventController::class, 'getFormOptions']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('emp-event')->group(function () {
    Route::post('/save', [EmployeeEventController::class, 'saveEmpEvent']);
    Route::post('/list-paginate', [EmployeeEventController::class, 'getEmpEventListPaginate']);
    Route::post('/details', [EmployeeEventController::class, 'getDetails']);
    Route::post('/delete', [EmployeeEventController::class, 'deleteEmpEvent']);
    Route::post('/form-options', [EmployeeEventController::class, 'getFormOptions']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('leave')->group(function () {

    Route::post('/save', [LeaveController::class, 'save']);
    Route::post('/list-paginate', [LeaveController::class, 'getLeaveListPaginate']);
    Route::post('/details', [LeaveController::class, 'getDetails']);
    Route::post('/delete', [LeaveController::class, 'delete']);
    Route::post('/form-options', [LeaveController::class, 'getFormOptions']);
    Route::post('/update-status', [LeaveController::class, 'updateStatus']);
    Route::post('/list', [LeaveController::class, 'getLeaveList']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('employee/benefit')->group(function () {

    Route::post('/save', [BenefitController::class, 'saveBenefit']);
    Route::post('/bonus-list', [BenefitController::class, 'getBonusList']);
    Route::post('/seniority-list', [BenefitController::class, 'getSeniorityList']);
    Route::post('/life_insurance-list', [BenefitController::class, 'getLifeInsurancesList']);
    Route::post('/details', [BenefitController::class, 'getDetails']);
    Route::post('/delete', [BenefitController::class, 'deleteBenefit']);
    Route::post('/form-options', [BenefitController::class, 'getFormOptions']);
    Route::post('/all-list', [BenefitController::class, 'getAllBenefitList']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('payroll')->group(function () {

    Route::post('/save', [PayrollController::class, 'savePayroll']);
    Route::post('/list-paginate', [PayrollController::class, 'getPayrollListPaginate']);
    Route::post('/details', [PayrollController::class, 'getDetails']);
    Route::post('/delete', [PayrollController::class, 'deletePayroll']);
    Route::post('/form-options', [PayrollController::class, 'getFormOptions']);
    Route::post('/update-authorize', [PayrollController::class, 'updateAuthorize']);
    Route::post('/update-disburse', [PayrollController::class, 'updateDisburse']);
    Route::post('/list', [PayrollController::class, 'getPayrollList']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('payroll-list')->group(function () {

    Route::post('/save', [PayrollListController::class, 'savePayrollList']);
    Route::post('/list-paginate', [PayrollListController::class, 'getPayrollListPaginate']);
    Route::post('/details', [PayrollListController::class, 'getDetails']);
    Route::post('/delete', [PayrollListController::class, 'deletePayrollList']);
    Route::post('/form-options', [PayrollListController::class, 'getFormOptions']);
    Route::post('/import', [PayrollListController::class, 'importPayrollList']);
    Route::post('calculate', [PayrollListController::class, 'calculatePayrollList']);
    Route::post('disburse', [PayrollListController::class, 'disbursePayrollList']);
    Route::post('disburse-all', [PayrollListController::class, 'disburseAllPayrollList']);
    Route::post('pay-slip', [PayrollListController::class, 'paySlip']);
    Route::post('/list', [PayrollListController::class, 'getListPayrollList']);

});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('warning')->group(function () {
    Route::post('/save', [WarningController::class, 'saveWarning']);
    Route::post('/list-paginate', [WarningController::class, 'getWarningListPaginate']);
    Route::post('/details', [WarningController::class, 'getDetails']);
    Route::post('/delete', [WarningController::class, 'deleteWarning']);
    Route::post('/form-options', [WarningController::class, 'getFormOptions']);
    Route::post('/update-status', [WarningController::class, 'updateStatus']);
    Route::post('/list', [WarningController::class, 'warningList']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('work-shifts')->group(function () {

    Route::post('/save', [WorkShiftController::class, 'saveWorkShift']);
    Route::post('/list-paginate', [WorkShiftController::class, 'getWorkShiftListPaginate']);
    Route::post('/details', [WorkShiftController::class, 'getDetails']);
    Route::post('/delete', [WorkShiftController::class, 'deleteWorkShift']);
    Route::post('/form-options', [WorkShiftController::class, 'getFormOptions']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('shift-details')->group(function () {

    Route::post('/save', [ShiftDetailsController::class, 'saveShiftDetails']);
    Route::post('/list-paginate', [ShiftDetailsController::class, 'getShiftDetailsListPaginate']);
    Route::post('/details', [ShiftDetailsController::class, 'getDetails']);
    Route::post('/delete', [ShiftDetailsController::class, 'deleteShiftDetails']);
    Route::post('/form-options', [ShiftDetailsController::class, 'getFormOptions']);
    Route::post('/list', [ShiftDetailsController::class, 'getShiftDetail']);
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
    Route::post('/list-paginate', [AttendanceController::class, 'getStaffAttendanceListPaginate']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('salary-history')->group(function () {
    Route::post('/save', [SalaryHistoryController::class, 'saveSalaryHistory']);
    Route::post('/list-paginate', [SalaryHistoryController::class, 'getSalaryHistoryListPaginate']);
    Route::post('/details', [SalaryHistoryController::class, 'getDetails']);
    Route::post('/delete', [SalaryHistoryController::class, 'deleteSalaryHistory']);
    Route::post('/form-options', [SalaryHistoryController::class, 'getFormOptions']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('account')->group(function () {

    Route::post('/save', [AccountController::class, 'saveAccount']);
    Route::post('/list-paginate', [AccountController::class, 'getAccountListPaginate']);
    Route::post('/details', [AccountController::class, 'getDetails']);
    Route::post('/delete', [AccountController::class, 'deleteAccount']);
    Route::post('/form-options', [AccountController::class, 'getFormOptions']);
    Route::post('/transfer', [AccountController::class, 'transfer']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('tax-allowance')->group(function () {

    Route::post('/save', [TaxAllowanceController::class, 'saveTaxAllowance']);
    Route::post('/list-paginate', [TaxAllowanceController::class, 'getTaxAllowanceListPaginate']);
    Route::post('/list-all', [TaxAllowanceController::class, 'listAll']);
    Route::post('/details', [TaxAllowanceController::class, 'getDetails']);
    Route::post('/delete', [TaxAllowanceController::class, 'deleteTaxAllowance']);
    Route::post('/form-options', [TaxAllowanceController::class, 'getFormOptions']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('tax-bracket')->group(function () {

    Route::post('/save', [TaxBracketController::class, 'saveTaxBracket']);
    Route::post('/list-paginate', [TaxBracketController::class, 'getTaxBracketListPaginate']);
    Route::post('/details', [TaxBracketController::class, 'getDetails']);
    Route::post('/delete', [TaxBracketController::class, 'deleteTaxBracket']);
    Route::post('/form-options', [TaxBracketController::class, 'getFormOptions']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('transaction')->group(function () {

    Route::post('/save', [TransactionController::class, 'saveTransaction']);
    Route::post('/list-paginate', [TransactionController::class, 'getTransactionListPaginate']);
    Route::post('/details', [TransactionController::class, 'getDetails']);
    Route::post('/delete', [TransactionController::class, 'deleteTransaction']);
    Route::post('/form-options', [TransactionController::class, 'getFormOptions']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('wallet-account')->group(function () {

    Route::post('/save', [WalletAccountController::class, 'saveWalletAccount']);
    Route::post('/list-paginate', [WalletAccountController::class, 'getWalletAccountListPaginate']);
    Route::post('/details', [WalletAccountController::class, 'getDetails']);
    Route::post('/delete', [WalletAccountController::class, 'deleteWalletAccount']);
    Route::post('/form-options', [WalletAccountController::class, 'getFormOptions']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('department')->group(function () {
    Route::post('/save', [DepartmentController::class, 'saveDepartment']);
    Route::post('/list-paginate', [DepartmentController::class, 'getDepartmentListPaginate']);
    Route::post('/details', [DepartmentController::class, 'getDetails']);
    Route::post('/delete', [DepartmentController::class, 'deleteDepartment']);
    Route::post('/form-options', [DepartmentController::class, 'getFormOptions']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('education')->group(function () {
    Route::post('/save', [EducationController::class, 'save']);
    Route::post('/list-all', [EducationController::class, 'listAll']);
    Route::post('/details', [EducationController::class, 'getDetails']);
    Route::post('/delete', [EducationController::class, 'delete']);
    Route::post('/form-options', [EducationController::class, 'getFormOptions']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('experience')->group(function () {
    Route::post('/save', [ExperienceController::class, 'save']);
    Route::post('/list-all', [ExperienceController::class, 'listAll']);
    Route::post('/details', [ExperienceController::class, 'getDetails']);
    Route::post('/delete', [ExperienceController::class, 'delete']);
    Route::post('/form-options', [ExperienceController::class, 'getFormOptions']);
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
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('holiday')->group(function () {
    Route::post('/save', [HolidayController::class, 'saveHoliday']);
    Route::post('/list-paginate', [HolidayController::class, 'getHolidayListPaginate']);
    Route::post('/details', [HolidayController::class, 'getDetails']);
    Route::post('/delete', [HolidayController::class, 'deleteHoliday']);
    Route::post('/form-options', [HolidayController::class, 'getFormOptions']);
    Route::post('/list', [HolidayController::class, 'getHolidayList']);
});


Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('dashboard')->group(function () {
    Route::post('/count-employees', [DashboardController::class, 'countEmployees']);
    Route::post('/get-departments', [DashboardController::class, 'getDepartments']);
    Route::post('/get-levels', [DashboardController::class, 'getLevels']);
    Route::post('/get-benefits', [DashboardController::class, 'getBenefits']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->group( function (){
    Route::post('/form-option',[GeneralSettingsController::class,'select_options']);
});
Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('reports')->group(function(){
    Route::post('/list',[ReportController::class,'getReportList']);
    Route::post('employee/list-by-branch', [ReportController::class, 'getEmployeeList']);
    Route::post('employee/list-by-type', [ReportController::class, 'getEmployeeListByType']);

    // Route::post('/filter-options', [ReportController::class, 'getReportFilterOptions']);
    // Route::post('/options-receiver',[ReportController::class,'getReceivers']);

    // Route::post('finance/activities',[ReportController::class,'getActivities']);
    // Route::post('finance/payments',[ReportController::class,'getInvoicePayments']);
    // Route::post('finance/invoice-list',[ReportController::class,'getInvoiceList']);
    // Route::post('finance/invoice-paid',[ReportController::class,'getPaidInvoices']);
    // Route::post('finance/expired-students',[ReportController::class,'getExpiredStudents']);
    // Route::post('finance/students-with-sepcial-discount',[ReportController::class,'getStudentsWithSpecialDiscount']);
    // Route::post('finance/student-counts-by-pmt-option',[ReportController::class,'countStudentsByPmtOptions']);
    // Route::post('finance/daily-cash-list',[ReportController::class,'getDailyCashList']);
    // Route::post('finance/monthly-cash-list',[ReportController::class,'getMonthlyCashList']);
    // Route::post('finance/referral-fee-list',[ReportController::class,'getReferalFeeList']);
    // Route::post('finance/school-fee-list',[ReportController::class,'getSchoolFee']);
    // Route::post('finance/non-tuition-fee-list',[ReportController::class,'getNonTuitionFeeList']);
    // Route::post('finance/income-by-categories',[ReportController::class,'getIncomeByCategories']);
    // Route::post('finance/income-by-class',[ReportController::class,'getIncomeByClass']);
    // Route::post('finance/deposite-list',[ReportController::class,'getStudentDepositeList']);
    // Route::post('finance/total-by-month',[ReportController::class,'getTotalPaymentByMonth']);
    // Route::post('finance/total-by-year',[ReportController::class,'getTotalPaymentByYear']);
    // Route::post('finance/total-payment-history-year',[ReportController::class,'getTotalPaymentHistoryByYear']);
    // Route::post('finance/total-student-payment-history',[ReportController::class,'getTotalStudentPaymentHistory']);
    // Route::post('finance/student-payment-history',[ReportController::class,'getStudentPaymentHistory']);
    // Route::post('finance/cross-year-payment',[ReportController::class,'crossYearReceipt']);
    // Route::post('finance/upgrade-fee',[ReportController::class,'upgradeFee']);


    // Route::post('enrollment/dropped-out-students',[ReportController::class,'getLeaveStudent']);
    // Route::post('enrollment/comeback-students',[ReportController::class,'getComeBackStudents']);
    // Route::post('enrollment/leave-student',[ReportController::class,'getLeaveStudent']);
    // Route::post('enrollment/student-referrers',[ReportController::class,'getStudentReferers']);
    // // Route::post('enrollment/family-list',[ReportController::class,'getFamilyList']);
    // Route::post('enrollment/family-list',[ReportController::class,'getFamilyInfoList']);
    // Route::post('enrollment/activities',[ReportController::class,'getActivities']);
    // // Route::post('/attendance-summary',[ReportController::class,'getAttendanceSummary']);
    // Route::post('enrollment/attendance-summary',[ReportController::class,'getAttendanceList']);
    // Route::post('enrollment/student-list',[ReportController::class,'getStudentList']);
    // Route::post('enrollment/new-students',[ReportController::class,'getNewStudents']);

    // Route::post('enrollment/request-change',[ReportController::class,'studentRequestChange']);

    // //** */
    // Route::post('enrollment/student-info',[ReportController::class,'getStudentInfoList']);
    // Route::post('enrollment/family-info',[ReportController::class,'getFamilyInfoList']);
    // Route::post('enrollment/attendance/list',[ReportController::class,'getAttendanceList']);
    // //** */

});
