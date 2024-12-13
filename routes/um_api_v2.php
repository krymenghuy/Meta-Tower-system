<?php
use App\Http\Controllers\CompanyProfileController;
use App\Http\Controllers\SocialMediaController;
use App\Http\Controllers\PusherController;
use App\Http\Controllers\ReportCenterController;
use App\Http\Middleware\CustomRateLimiter;

use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Umt\DataImportController;
use App\Http\Controllers\Umt\RoleController;
use App\Http\Controllers\Umt\UserController;
use App\Http\Controllers\Umt\UMTSettingController;
use App\Http\Controllers\Umt\AuthServiceController;
use App\Http\Controllers\Umt\BranchController;
use App\Http\Controllers\Umt\ApplicationController;
use App\Http\Controllers\Umt\ModuleController;
use App\Http\Controllers\Umt\PermissionController;
use App\Http\Controllers\Umt\ReportController;
use App\Http\Controllers\CurrencyController;

Route::middleware([CustomRateLimiter::class])->prefix('settings')->group(function(){
    Route::get('/lang', [UserController::class, 'getLang']);
    Route::get('/next-prn-id', [PermissionController::class, 'getNextPermissionId']);
    Route::get('/report/actions', [ReportController::class, 'getReportActionNames']);
});

//begin::CompanyProfileController
    Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('company')->group(function(){
        Route::post('/save-logo', [CompanyProfileController::class, 'saveCompanyLogo']);
        Route::post('/logo-url', [CompanyProfileController::class, 'getCompanyLogo']);
        Route::post('/delete-logo', [CompanyProfileController::class, 'deleteCompanyLogo']);
        Route::post('/save-details', [CompanyProfileController::class, 'saveCompanyInfo']);
        Route::post('/details', [CompanyProfileController::class, 'getCompanyInfo']);
        Route::post('/info', [CompanyProfileController::class, 'getCompanyInfo']);
    });
//end::CompanyProfileController

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('company/social-media')->group(function(){
    Route::post('/save',[SocialMediaController::class,'save']);
    Route::post('/list-paginate',[SocialMediaController::class,'list']);
    Route::post('list',[SocialMediaController::class,'listAll']);
    Route::post('/details',[SocialMediaController::class,'details']);
    Route::post('/delete',[SocialMediaController::class,'delete']);
});

//begin:: Admin notifications
Route::middleware('auth.api', CustomRateLimiter::class)->prefix('user')->group(function(){
    Route::post('pending-requests', [NotificationController::class, 'getPendingRequests']);
    Route::post('notifications', [NotificationController::class, 'getNotificationListByUser']);
    Route::post('unread-count',[NotificationController::class,'getUnreadCount']);
    Route::post('mark-read-all',[NotificationController::class,'markReadAll']); 
});
//end:: Admin Notification

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('umt-settings')->group(function(){
    Route::post('/options-branch', [UMTSettingController::class, 'options_branch']);
    Route::post('/options-user-class', [UMTSettingController::class, 'options_user_class']);
    Route::post('/options-mobile-app', [UMTSettingController::class, 'options_mobile_app']);
    Route::post('/options-web-app', [UMTSettingController::class, 'options_web_app']);
    Route::post('/options-app', [UMTSettingController::class, 'options_app']);
});

// /** apis for AuthServices: setpassword, changepassword, lock or disable user */
// Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('auth')->group(function(){
//     Route::post('/set-password', [AuthServiceController::class, 'setPassword']);
//     Route::post('/change-login-name', [UserController::class, 'changeLoginName']);  
// });
  
Route::middleware(['auth.api', CustomRateLimiter::class])->group(function(){
    Route::post('broadcast/auth', [PusherController::class, 'pusherAuth']);
    Route::post('um/data/import', [DataImportController::class, 'importData']);
    Route::post('um/reports/sync', [DataImportController::class, 'syncReports']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('report-center')->group(function(){
    Route::post('/report-list', [ReportCenterController::class, 'getReportList']);
    Route::post('/reports-by-category', [ReportCenterController::class, 'getReportListByCategory']);
});

Route::middleware([CustomRateLimiter::class])->group(function(){
    Route::post('logout', [AuthServiceController::class, 'logout']);
    Route::get('auth/um-options', [UserController::class, 'getUserManagementOptions']);
    Route::post('encryptData', [AuthServiceController::class, 'encryptData']);
    Route::post('vs-encrypt031181', [AuthServiceController::class, 'encryptData']);
    Route::post('allowed', [AuthServiceController::class, 'allowed']);
    Route::get('csrf-token', [AuthServiceController::class, 'refreshCsrfToken']);
});
 
Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('application')->group(function(){
    Route::post('/save', [ApplicationController::class, 'saveApplication']);
    Route::post('/delete', [ApplicationController::class, 'deleteApplication']);
    Route::post('/list', [ApplicationController::class, 'getApplicationList']);
    Route::post('/form-options', [ApplicationController::class, 'getFormOptions']);
    Route::post('/eligible-users', [ApplicationController::class, "getEligibleUsers"]);
});
 
Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('permission')->group(function(){
    Route::post('/save', [PermissionController::class, 'savePermission']);
    Route::post('/delete', [PermissionController::class, 'deletePermission']);
    Route::post('/list', [PermissionController::class, 'getPermissionList']);
    Route::post('/form-options', [PermissionController::class, 'getFormOptions']);
    Route::post('/import', [PermissionController::class, 'importJson']);
});

Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('report')->group(function(){
    Route::post('/save', [ReportController::class, 'saveReport']);
    Route::post('/delete', [ReportController::class, 'deleteReport']);
    Route::post('/list', [ReportController::class, 'getReportList']);
    Route::post('/form-options', [ReportController::class, 'getFormOptions']);
    Route::post('/import', [ReportController::class, 'importJson']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('module')->group(function () {
    Route::post('/save', [ModuleController::class, 'saveModule']);
    Route::post('/delete', [ModuleController::class, "deleteModule"]);
    Route::post('/form-options', [ModuleController::class, "getFormOptions"]);
    Route::post('/import', [ModuleController::class, "importModules"]);
    Route::post('/list',[ModuleController::class, "getModuleList"]);
});
 
Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('user')->group(function () {
    Route::post('/save-lang', [UserController::class, 'saveLang']);
    Route::post('/lang', [UserController::class, 'getLang']);
    Route::post('/authization/report', [UserController::class, 'getUserAuthorizationReport']);
    Route::post('/auth-data', [AuthServiceController::class,'getAuthData']);
    Route::post('/form-options', [UserController::class, "getUserFormOption"]);
    Route::post('/linked-user/form-options', [UserController::class, "getLinkUserFormOptions"]);
    Route::post('/list', [UserController::class, "getUserList"]);
    Route::post('/list-paginate', [UserController::class, "getUserList_paginate"]);
    Route::post('/save', [UserController::class, "saveUser"]);
    Route::post('/update', [UserController::class, "updateUser"]);
    Route::post('/save-profile-picture', [UserController::class, "saveProfilePicture"]);
    Route::post('/delete-profile-picture', [UserController::class, 'deleteProfilePicture']);
    Route::post('/delete', [UserController::class, "deleteUser"]);

    Route::post('/apps', [UserController::class, "getUserApps"]);
     //find profile info by official code
     Route::post('/profile-by-code', [UserController::class, "findProfileByOfficialCode"]);
     //find profile info by email or phone number
     Route::post('/profile', [UserController::class, "findProfile"]);
     Route::post('/security/set-pwd', [UserController::class, 'setPassword']);
     Route::post('/set-password', [AuthServiceController::class, 'setPassword']);
     Route::post('/password/change', [UserController::class, 'changePassword']);
     Route::post('/password/reset', [UserController::class, 'setPassword']);
     Route::post('/login-name/change', [UserController::class, 'changeLoginName']);
     Route::post('/role/change', [UserController::class, 'setRole']);
     Route::post('/status/update', [UserController::class, 'setUserStatus']);
     Route::post('/branch/set', [UserController::class, 'setUserBranch']);
     Route::post('/change-login-name', [UserController::class, 'changeLoginName']);
     Route::post('/authorization-report', [UserController::class, "getUserAuthorizationReport"]);
     Route::post('/set-role', [UserController::class, 'setRole']);
     Route::post('/linked-user/create', [UserController::class, 'createLinkedUser']);
     Route::post('/linked-user/delete', [UserController::class, 'deleteLinkedUser']);
});

Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('branch')->group(function (){
    Route::post('/list', [BranchController::class, "getBranchList"]);
    Route::post('/delete', [BranchController::class, "deleteBranch"]);
    Route::post('/save', [BranchController::class, "saveBranch"]);
    Route::post('/form-options', [BranchController::class, "getFormOptions"]);
});

Route::middleware([CustomRateLimiter::class])->group(function(){
    Route::get(Config::get('app.secure_route').'/{q}',[AuthServiceController::class,'decypherToken']); 
});

Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('role')->group(function () {
    Route::post('/form-options', [RoleController::class, "getRoleFormOptions"]);
    Route::post('/list-paginate', [RoleController::class, "getRoleList_paginate"]);
    Route::post('/list', [RoleController::class, "getRoleList"]);
    Route::post('/listForPrint', [RoleController::class, "getRoleListForPrint"]);
    Route::post('/list/print', [RoleController::class, "getRoleListForPrint"]);
    //Route::post('/permission/list-paginate', [RoleController::class, "getRolePermissions_paginate"]);
    Route::post('/permission/add', [RoleController::class, "addRolePermission"]);
    Route::post('/permission/remove', [RoleController::class, "removeRolePermission"]);

    Route::post('/report/add', [RoleController::class, "addRolePermission"]);
    Route::post('/report/remove', [RoleController::class, "removeRolePermission"]);

    Route::post('/permissions', [RoleController::class, 'getRolePermissions']);
    Route::post('/reports', [RoleController::class, "getRoleReports"]);
    Route::post('/reports-by-category', [RoleController::class, "getRoleReportsByCategory"]);

    Route::post('/save', [RoleController::class, "saveRole"]);
    Route::post('/delete', [RoleController::class, "deleteRole"]);
    Route::post('/members/add', [RoleController::class, 'addRoleMembers']);
    Route::post('/add-members',[RoleController::class, "addRoleMembers"]);
    Route::post('/members/remove', [RoleController::class, 'removeRoleMember']);
    Route::post('/add-member', [RoleController::class, 'addRoleMember']);
    Route::post('/remove-member', [RoleController::class, 'removeRoleMember']);
    Route::post('/members/list', [RoleController::class, 'getRoleMembers']);
    Route::post('/members', [RoleController::class, 'getRoleMembers']);
 
    Route::post('/add-member', [RoleController::class, 'addRoleMembers']);
    Route::post('/remove-member', [RoleController::class, 'removeRoleMember']);

    Route::post('/options-role', [RoleController::class, 'getComboItems_role']);
    Route::post('/details', [RoleController::class, 'getRoleById']);

     //getRoleApps() returns list of all apps under the current subscription, but each app has "Allowed" status as 0 or 1
    Route::post('/apps', [RoleController::class, 'getRoleApps']);
    //getAccessibleApps() returns only the accessible apps
    Route::post('/accessible-apps', [RoleController::class, 'getAccessibleApps']);
    Route::post('/apps/set-status', [RoleController::class, 'setRoleAppStatus']);
    Route::post('/apps/add', [RoleController::class, 'addRoleApp']);
    Route::post('/apps/remove', [RoleController::class, 'removeRoleApp']);

    Route::post('/modules', [RoleController::class, 'getRoleModules']);
    // Route::post('/access-module/list', [RoleController::class, 'getAccessibleModules']);
    // Route::post('/access-module/list-all', [RoleController::class, 'getAccessibleModules_all']);
    Route::post('modules/add', [RoleController::class, 'addAccessibleModule']);
    Route::post('modules/remove', [RoleController::class, 'removeAccessibleModule']);
    Route::post('modules/set-status', [RoleController::class, 'setRoleModuleStatus']);
    Route::post('/permissions/add', [RoleController::class, 'addPermissionToRole']);
    Route::post('/permissions/remove', [RoleController::class, 'removePermissionFromRole']);
    Route::post('/permissions/set-status', [RoleController::class, 'setRolePermissionStatus']);
    Route::post('/reports/set-status', [RoleController::class, 'setRoleReportStatus']);
    Route::post('/add-permission', [RoleController::class, 'addPermissionToRole']);
    Route::post('/remove-permission', [RoleController::class, 'removePermissionFromRole']);

    //Route::post('/permissions', [UMController::class, 'getPermissionsByLoginName']);
});
 

//begin::Currency APIs
Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('currency')->group(function(){
    // Route::post('options-month', [CurrencyController::class,'getComboItems_x_month']);
    Route::post('save', [CurrencyController::class,'saveCurrency']);
    Route::post('delete', [CurrencyController::class,'deleteCurrency']);
    Route::post('list', [CurrencyController::class,'getCurrencies']);
});

Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('exchange-rate')->group(function(){
    Route::post('options-month', [CurrencyController::class,'getComboItems_x_month']);
    Route::post('/currency-pairs/list', [CurrencyController::class,'getCurrencyPairs']);
    Route::post('/currency-pair/create', [CurrencyController::class,'createCurrencyPair']);
    Route::post('/currency-pair/delete', [CurrencyController::class,'deleteCurrencyPair']);
    Route::post('/details', [CurrencyController::class,'getExchangeRateInfo']);
    Route::post('/delete', [CurrencyController::class,'deleteExchangeRate']);
    Route::post('/list', [CurrencyController::class,'getExchangeRates']);
    Route::post('/save', [CurrencyController::class,'saveExchangeRate']);
    Route::post('/apply', [CurrencyController::class,'applyExchangeRate']);
    Route::post('/form-options', [CurrencyController::class,'getFormOptions']);
});
//begin::Currency APIs