<?php

use App\Http\Controllers\Bhr\BenefitController;
use App\Http\Controllers\Bhr\BookController;
use App\Http\controllers\Bhr\DashboardController;
use App\Http\controllers\Bhr\EmployeeController;
use App\Http\Controllers\Bhr\MembersController;
use App\Http\Controllers\Bhr\PayrollController;
use App\Http\Controllers\Bhr\PayrollListController;
use App\Http\Controllers\Bhr\ProductsController;
use App\Http\Controllers\Bhr\ProfileController;
use App\Http\controllers\Bhr\SkillController;
use App\Http\controllers\Bhr\StaffBenefitController;
use App\Http\controllers\Bhr\StaffController;
use App\Http\Controllers\CompanyProfileController;
use App\Http\Controllers\Login\LoginController;
use App\Http\Middleware\CustomRateLimiter;
use Illuminate\Support\Facades\Route;
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
    Route::post('/list-paginate', [EmployeeController::class, 'getListPaginate']);
    Route::post('/details', [EmployeeController::class, 'getDetails']);
    Route::post('/delete', [EmployeeController::class, 'deleteEmployee']);
    Route::post('/filter-options', [EmployeeController::class, 'getFilterOptions']);
    Route::post('/form-options', [EmployeeController::class, 'getFormOptions']);

    //Route::post('updateSenderStatus', [SenderController::class, 'updateSenderStatus']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('staff')->group(function () {

    Route::post('/save', [StaffController::class, 'saveStaff']);
    Route::post('/list-paginate', [StaffController::class, 'getListPaginate']);
    Route::post('/list', [StaffController::class, 'getListAll']);
    Route::post('/details', [StaffController::class, 'getDetails']);
    Route::post('/delete', [StaffController::class, 'deleteStaff']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('book')->group(function () {
    Route::post('/save', [BookController::class, 'saveBook']);
    Route::post('/list', [BookController::class, 'getBookList']);
    Route::post('/list-paginate', [BookController::class, 'getBookListPaginate']);
    Route::post('/details', [BookController::class, 'getDetails']);
    Route::post('/delete', [BookController::class, 'deleteBook']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('member')->group(function () {
    Route::post('/save', [MembersController::class, 'saveMember']);
    Route::post('/list', [MembersController::class, 'getMemberList']);
    Route::post('/list-paginate', [MembersController::class, 'getMemberListPaginate']);
    Route::post('/delete', [MembersController::class, 'deleteMember']);
});
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('product')->group(function () {

    Route::post('/save', [ProductsController::class, 'saveProduct']);
    Route::post('/list', [ProductsController::class, 'getProductList']);
    Route::post('/list-paginate', [ProductsController::class, 'getProductListPaginate']);
    Route::post('/details', [ProductsController::class, 'getDetails']);
    Route::post('/delete', [ProductsController::class, 'deleteProduct']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('profile')->group(function () {
    Route::post('/save', [ProfileController::class, 'saveProfile']);
    Route::post('/list', [ProfileController::class, 'getProfileList']);
    Route::post('/list-paginate', [ProfileController::class, 'getProfileListPaginate']);
    Route::post('/details', [ProfileController::class, 'getDetails']);
    Route::post('/delete', [ProfileController::class, 'deleteProfile']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('skills')->group(function () {

    Route::post('/save', [SkillController::class, 'saveSkill']);
    Route::post('/list', [SkillController::class, 'getSkillList']);
    Route::post('/list-paginate', [SkillController::class, 'getSkillListPaginate']);
    Route::post('/details', [SkillController::class, 'getDetails']);
    Route::post('/delete', [SkillController::class, 'deleteSkill']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('benefit')->group(function () {

    Route::post('/save', [BenefitController::class, 'saveBenefit']);
    Route::post('/list', [BenefitController::class, 'getBenefitList']);
    Route::post('/list-paginate', [BenefitController::class, 'getBenefitListPaginate']);
    Route::post('/details', [BenefitController::class, 'getDetails']);
    Route::post('/delete', [BenefitController::class, 'deleteBenefit']);
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
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('payroll-list')->group(function () {

    Route::post('/save', [PayrollListController::class, 'savePayrollList']);
    Route::post('/list-paginate', [PayrollListController::class, 'getPayrollListPaginate']);
    Route::post('/details', [PayrollListController::class, 'getDetails']);
    Route::post('/delete', [PayrollListController::class, 'deletePayrollList']);
});
// Department routes

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('department')->group(function () {
    Route::post('/save', [DepartmentController::class, 'saveDepartment']);
    Route::post('/list', [DepartmentController::class, 'getDepartmentList']);
    Route::post('/list-paginate', [DepartmentController::class, 'getDepartmentListPaginate']);
    Route::post('/detail', [DepartmentController::class, 'getDetails']);
    Route::post('/delete', [DepartmentController::class, 'deleteDepartment']);
});
