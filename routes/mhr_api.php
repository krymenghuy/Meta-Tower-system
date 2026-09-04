<?php

use App\Http\Controllers\CompanyProfileController;
use App\Http\Controllers\Auth\AuthController;

use App\Http\Middleware\CustomRateLimiter;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Prm\GeneralSettingsController;
use App\Http\Controllers\Mhr\BenefitDisbursePolicyController;
use App\Http\Controllers\Mhr\EmployeeController;
use App\Http\Controllers\Mhr\MovementController;
use App\Http\Controllers\Mhr\EmployeeSkillController;
use App\Http\Controllers\Mhr\BenefitDisbursementController;
use App\Http\Controllers\Mhr\EmployeeEducationController;
use App\Http\Controllers\Mhr\EmployeeExperienceController;
use App\Http\Controllers\Mhr\EmployeeDocumentController;
use  App\Http\Controllers\Mhr\LeaveController;
use  App\Http\Controllers\Mhr\HolidayController;
use  App\Http\Controllers\Mhr\PayrollController;
use  App\Http\Controllers\Mhr\PayrollListController;
use  App\Http\Controllers\Mhr\DashboardController;
use  App\Http\Controllers\Mhr\BenefitController;
use  App\Http\Controllers\Mhr\AccountController;
use  App\Http\Controllers\Mhr\StaffAttendanceController;
use App\Http\Controllers\Mhr\EmployeeBenefitController;
use App\Http\Controllers\Mhr\WorkShiftController;
use App\Http\Controllers\Mhr\WarningController;
use App\Http\Controllers\Mhr\DeductionController;
use App\Http\Controllers\Mhr\TaxBracketController;
use App\Http\Controllers\Mhr\SkillController;
use App\Http\Controllers\Mhr\CheckPointController;
use App\Http\Controllers\Mhr\CheckPointCategoryController;
use App\Http\Controllers\Mhr\JobLevelController;
use App\Http\Controllers\Mhr\PositionController;
use App\Http\Controllers\Mhr\DepartmentController;
use App\Http\Controllers\Mhr\TaxAllowanceController;
use App\Http\Controllers\Mhr\AttendanceController;
use App\Http\Controllers\Mhr\ShiftDetailsController;
use App\Http\Controllers\Mhr\ExitFormItemController;
use App\Http\Controllers\Mhr\ExitFormController;
use App\Http\Controllers\Mhr\ReportController;

Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('dashboard')->group(function () {
    Route::post('/data', [DashboardController::class, 'getDashboardData']);
    Route::post('/overview-data', [DashboardController::class, 'getOverviewData']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->group( function (){
    Route::post('/form-option',[GeneralSettingsController::class,'select_options']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('non-staff')->group(function () {
    Route::post('/promotion/form-options', [EmployeeController::class, 'getFormOptions_non_staff']);
    Route::post('/promote',[EmployeeController::class,'promoteNonStaff']);
});


Route::post('/employee/attendance/scan',[AttendanceController::class,'scanAttendance']);
Route::post('/employee/attendance/last-scan',[AttendanceController::class,'getLastEmployeesScan']);

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
    Route::post('/resign', [EmployeeController::class, 'setResign']);
    Route::post('/rejoin', [EmployeeController::class, 'setRejoin']);
    Route::post('/terminate', [EmployeeController::class, 'setTerminate']);

    Route::post('/delete', [EmployeeController::class, 'deleteEmployee']);
    Route::post('/import',[EmployeeController::class,'importEmployee']);
    Route::post('/imported-file-history', [EmployeeController::class, 'importedFileHistory']);


    // skills
    Route::post('/skills/list', [EmployeeSkillController::class, 'getList']);
    Route::post('/skills/save', [EmployeeSkillController::class, 'save']);
    Route::post('/skills/delete', [EmployeeSkillController::class, 'delete']);
    Route::post('/skills/details', [EmployeeSkillController::class, 'getDetails']);
    Route::post('/skills/form-options', [EmployeeSkillController::class, 'getFormOptions']);
    // educations
    Route::post('/educations/list', [EmployeeEducationController::class, 'getList']);
    Route::post('/educations/save', [EmployeeEducationController::class, 'save']);
    Route::post('/educations/delete', [EmployeeEducationController::class, 'delete']);
    Route::post('/educations/details', [EmployeeEducationController::class, 'getDetails']);
    Route::post('/educations/form-options', [EmployeeEducationController::class, 'getFormOptions']);
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
    Route::post('/delete', [MovementController::class, 'deleteEmpEvent']);
    Route::post('/form-options', [MovementController::class, 'getFormOptions']);
});


Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('leave')->group(function () {
    Route::post('/save', [LeaveController::class, 'saveLeave']);
    Route::post('/list-paginate', [LeaveController::class, 'getLeaveListPaginate']);
    Route::post('/uninformed', [LeaveController::class, 'getLeaveUninformedList']);
    Route::post('/details', [LeaveController::class, 'getDetails']);
    Route::post('/delete', [LeaveController::class, 'delete']);
    Route::post('/form-options', [LeaveController::class, 'getFormOptions']);
    Route::post('/update-status', [LeaveController::class, 'updateStatus']);
    Route::post('/list', [LeaveController::class, 'getLeaveList']);
    Route::post('/accept-leave', [LeaveController::class, 'acceptLeave']);
    Route::post('/reject-leave', [LeaveController::class, 'rejectLeave']);
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

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('emp-warning')->group(function () {
    Route::post('/save', [WarningController::class, 'saveWarning']);
    Route::post('/list-paginate', [WarningController::class, 'getWarningListPaginate']);
    Route::post('/details', [WarningController::class, 'getDetails']);
    Route::post('/delete', [WarningController::class, 'delete']);
    Route::post('/form-options', [WarningController::class, 'getFormOptions']);
    Route::post('/update-status', [WarningController::class, 'updateStatus']);
    Route::post('/list', [WarningController::class, 'warningList']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('staff-promotion')->group(function () {
    Route::post('/promote',[EmployeeController::class,'promoteStaff']);
    Route::post('/form-options',[EmployeeController::class,'getFormOptionPromotion']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('emp-deduction')->group(function () {
    Route::post('/save', [DeductionController::class, 'saveDeduction']);
    Route::post('/list-paginate', [DeductionController::class, 'getDeductionListPaginate']);
    Route::post('/details', [DeductionController::class, 'getDetails']);
    Route::post('/delete', [DeductionController::class, 'delete']);
    Route::post('/form-options', [DeductionController::class, 'getFormOptions']);
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
});


Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('work-shifts')->group(function () {

    Route::post('/save', [WorkShiftController::class, 'saveWorkShift']);
    Route::post('/list-paginate', [WorkShiftController::class, 'getWorkShiftListPaginate']);
    Route::post('/details', [WorkShiftController::class, 'getDetails']);
    Route::post('/delete', [WorkShiftController::class, 'deleteWorkShift']);
    Route::post('/form-options', [WorkShiftController::class, 'getFormOptions']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('holiday')->group(function () {
    Route::post('/save', [HolidayController::class, 'saveHoliday']);
    Route::post('/list-paginate', [HolidayController::class, 'getHolidayListPaginate']);
    Route::post('/details', [HolidayController::class, 'getDetails']);
    Route::post('/delete', [HolidayController::class, 'deleteHoliday']);
    Route::post('/form-options', [HolidayController::class, 'getFormOptions']);
    Route::post('/list', [HolidayController::class, 'getHolidayList']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('skills')->group(function () {
    Route::post('/save', [SkillController::class, 'saveSkill']);
    Route::post('/list-paginate', [SkillController::class, 'getSkillListPaginate']);
    Route::post('/details', [SkillController::class, 'getDetails']);
    Route::post('/delete', [SkillController::class, 'deleteSkill']);
    Route::post('/form-options', [SkillController::class, 'getFormOptions']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('job_level')->group(function () {
    Route::post('/save', [JobLevelController::class, 'saveJobLevel']);
    Route::post('/list', [JobLevelController::class, 'getList']);
    Route::post('/list-paginate', [JobLevelController::class, 'getList']);
    Route::post('/detail', [JobLevelController::class, 'getDetails']);
    Route::post('/form-options', [JobLevelController::class, 'getFormOptions']);
    Route::post('/delete', [JobLevelController::class, 'deleteJobLevel']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('position')->group(function () {
    Route::post('/save', [PositionController::class, 'savePosition']);
    Route::post('/list-paginate', [PositionController::class, 'getList']);
    Route::post('/details', [PositionController::class, 'getDetails']);
    Route::post('/delete', [PositionController::class, 'deletePosition']);
    Route::post('/form-options', [PositionController::class, 'getFormOptions']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('department')->group(function () {
    Route::post('/save', [DepartmentController::class, 'saveDepartment']);
    Route::post('/list-paginate', [DepartmentController::class, 'getList']);
    Route::post('/details', [DepartmentController::class, 'getDetails']);
    Route::post('/delete', [DepartmentController::class, 'deleteDepartment']);
    Route::post('/form-options', [DepartmentController::class, 'getFormOptions']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('tax-bracket')->group(function () {

    Route::post('/save', [TaxBracketController::class, 'saveTaxBracket']);
    Route::post('/list-paginate', [TaxBracketController::class, 'getTaxBracketListPaginate']);
    Route::post('/details', [TaxBracketController::class, 'getDetails']);
    Route::post('/delete', [TaxBracketController::class, 'deleteTaxBracket']);
    Route::post('/form-options', [TaxBracketController::class, 'getFormOptions']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('tax-allowance')->group(function () {

    Route::post('/save', [TaxAllowanceController::class, 'saveTaxAllowance']);
    Route::post('/list-paginate', [TaxAllowanceController::class, 'getList']);
    Route::post('/list-all', [TaxAllowanceController::class, 'listAll']);
    Route::post('/details', [TaxAllowanceController::class, 'getDetails']);
    Route::post('/delete', [TaxAllowanceController::class, 'deleteTaxAllowance']);
    Route::post('/form-options', [TaxAllowanceController::class, 'getFormOptions']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('emp/benefit-disbursement')->group(function () {

    Route::post('/save', [BenefitDisbursementController::class, 'saveBenefitDisbursement']);
    Route::post('/details', [BenefitDisbursementController::class, 'getDetails']);
    Route::post('/delete', [BenefitDisbursementController::class, 'deleteBenefitDisbursement']);
    Route::post('/form-options', [BenefitDisbursementController::class, 'getFormOptions']);
    Route::post('/list-paginate', [BenefitDisbursementController::class, 'getBenefitDisbursementListPaginate']);
    Route::post('/all-list', [BenefitDisbursementController::class, 'getBenefitDisbursementList']);
});
Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('check-point')->group(function(){
    Route::post('/save', [CheckPointController::class, 'save']);
    Route::post('/list-paginate', [CheckPointController::class, 'getList']);
    Route::post('/details', [CheckPointController::class, 'getDetails']);
    Route::post('/delete', [CheckPointController::class, 'delete']);
    Route::post('/form-options', [CheckPointController::class, 'getFormOptions']);
});
Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('exit-form-item')->group(function(){
    Route::post('/save', [ExitFormItemController::class, 'saveExitFormItem']);
    Route::post('/list-paginate', [ExitFormItemController::class, 'getList']);
    Route::post('/list-all', [ExitFormItemController::class, 'getAllList']);
    Route::post('/details', [ExitFormItemController::class, 'getDetails']);
    Route::post('/delete', [ExitFormItemController::class, 'deleteExitFormItem']);
    Route::post('/form-options', [ExitFormItemController::class, 'getExitFormItemOptions']);
});
Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('exit-form')->group(function(){
    Route::post('/save', [ExitFormController::class, 'saveExitForm']);
    Route::post('/save-item', [ExitFormController::class, 'saveExitItem']);
    Route::post('/update-checkbox', [ExitFormController::class, 'updateCheckboxItem']);
    Route::post('/list-paginate', [ExitFormController::class, 'getExitFormListPaginate']);
    Route::post('/details', [ExitFormController::class, 'getDetails']);
    Route::post('/delete', [ExitFormController::class, 'delete']);
    Route::post('/form-options', [ExitFormController::class, 'getFormOptions']);
    Route::post('/checkpoints', [ExitFormController::class, 'getCheckpoints']);
});
Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('check-point-category')->group(function(){
    Route::post('/save', [CheckPointCategoryController::class, 'save']);
    Route::post('/list-paginate', [CheckPointCategoryController::class, 'getListPaginate']);
    Route::post('/details', [CheckPointCategoryController::class, 'getDetails']);
    Route::post('/delete', [CheckPointCategoryController::class, 'delete']);
    Route::post('/form-options', [CheckPointCategoryController::class, 'getFormOptions']);
    Route::post('/list-all', [CheckPointCategoryController::class, 'getAllList']);
});
Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('disburse-policy')->group(function(){
    Route::post('/save', [BenefitDisbursePolicyController::class, 'saveBenefitDisbursePolicy']);
    Route::post('/list-paginate', [BenefitDisbursePolicyController::class, 'getList']);
    Route::post('/details', [BenefitDisbursePolicyController::class, 'getDetails']);
    Route::post('/delete', [BenefitDisbursePolicyController::class, 'delete']);
    Route::post('/form-options', [BenefitDisbursePolicyController::class, 'getFormOptions']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('shift-details')->group(function () {

    Route::post('/save', [ShiftDetailsController::class, 'saveShiftDetails']);
    Route::post('/list-paginate', [ShiftDetailsController::class, 'getShiftDetailsListPaginate']);
    Route::post('/details', [ShiftDetailsController::class, 'getDetails']);
    Route::post('/delete', [ShiftDetailsController::class, 'deleteShiftDetails']);
    Route::post('/form-options', [ShiftDetailsController::class, 'getFormOptions']);
    Route::post('/list', [ShiftDetailsController::class, 'getShiftDetail']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('reports')->group(function () {
    Route::post('/list', [ReportController::class, 'getReportList']);
    Route::post('employee_movement', [ReportController::class, 'getEmployeeMovementReport']);
    Route::post('employee_benefit',[ReportController::class,'getEmployeeBenefitReport']);
    Route::post('employee_list', [ReportController::class, 'getEmployeeList']);
    Route::post('payroll_list',[ReportController::class,'getPayrollList']);
    Route::post('income_by_category',[ReportController::class,'getIncomeByCategories']);


});


   


// Route::middleware('auth.api')->get('/signal-ticket', function (Request $request) {
//     $appId = getAppIdByUserClass($request->user->user_class);
//     $secret = config('signal.signal_secret');
//     $timestamp = (string) time();
//     $projectId = config('signal.signal_project_id');
//     $userId = (string) $request->user->id;

//     $signature = hash_hmac('sha256', "{$appId}.{$timestamp}.{$projectId}.{$userId}", $secret);

//     return response()->json(compact('appId', 'timestamp', 'projectId', 'userId', 'signature'));
// });

Route::get('/scan-attendance-signal-ticket', function (Request $request) {
    // \Log::info('Signal Ticket Request: ' . json_encode($request->all()));
    $appId = '202020C88E2077212020022020204600';// getAppIdByUserClass($request->user->user_class);
    $secret = config('signal.signal_secret');
    $timestamp = (string) time();
    $projectId = config('signal.signal_project_id');
    $userId = '1';

    $signature = hash_hmac('sha256', "{$appId}.{$timestamp}.{$projectId}.{$userId}", $secret);

    return response()->json(compact('appId', 'timestamp', 'projectId', 'userId', 'signature'));
});

