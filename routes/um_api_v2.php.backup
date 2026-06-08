<?php
use App\Http\Controllers\CompanyProfileController;
use App\Http\Controllers\SocialMediaController;
use App\Http\Controllers\PusherController;
use App\Http\Controllers\ReportCenterController;
use App\Http\Middleware\CustomRateLimiter;

use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Route;

Route::middleware([CustomRateLimiter::class])->prefix('settings')->group(function(){
    Route::get('/lang', [XUserController::class, 'getLang']);
    Route::get('/next-prn-id', [XPermissionController::class, 'getNextPermissionId']);
    Route::get('/report/actions', [XReportController::class, 'getReportActionNames']);
    Route::get('/utils/uuid', function () {
        return response()->json(['uuid' => createUUID(true)]);
    });
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
    Route::post('/options-branch', [XUMTSettingsController::class, 'options_branch']);
    Route::post('/options-user-class', [XUMTSettingsController::class, 'options_user_class']);
    Route::post('/options-mobile-app', [XUMTSettingsController::class, 'options_mobile_app']);
    Route::post('/options-web-app', [XUMTSettingsController::class, 'options_web_app']);
    Route::post('/options-app', [XUMTSettingsController::class, 'options_app']);
});

// /** apis for AuthServices: setpassword, changepassword, lock or disable user */
// Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('auth')->group(function(){
//     Route::post('/set-password', [XAuthServiceController::class, 'setPassword']);
//     Route::post('/change-login-name', [XUserController::class, 'changeLoginName']);  
// });
  
Route::middleware(['auth.api', CustomRateLimiter::class])->group(function(){
    Route::post('broadcast/auth', [PusherController::class, 'pusherAuth']);
    Route::post('um/data/import', [XDataImportController::class, 'importData']);
    Route::post('um/reports/sync', [XDataImportController::class, 'syncReports']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('report-center')->group(function(){
    Route::post('/report-list', [ReportCenterController::class, 'getReportList']);
    Route::post('/reports-by-category', [ReportCenterController::class, 'getReportListByCategory']);
});

Route::middleware([CustomRateLimiter::class])->group(function(){
    Route::get('/vsx-sec/token', [XAuthServiceController::class, 'getToken']);
    Route::post('logout', [XAuthServiceController::class, 'logout']);
    Route::get('auth/um-options', [XUserController::class, 'getUserManagementOptions']);
    Route::post('encryptData', [XAuthServiceController::class, 'encryptData']);
    Route::post('vs-encrypt031181', [XAuthServiceController::class, 'encryptData']);
    Route::post('allowed', [XAuthServiceController::class, 'allowed']);
    Route::get('csrf-token', [XAuthServiceController::class, 'refreshCsrfToken']);
});
 
Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('application')->group(function(){
    Route::post('/save', [XApplicationController::class, 'saveApplication']);
    Route::post('/delete', [XApplicationController::class, 'deleteApplication']);
    Route::post('/list', [XApplicationController::class, 'getApplicationList']);
    Route::post('/form-options', [XApplicationController::class, 'getFormOptions']);
    Route::post('/eligible-users', [XApplicationController::class, "getEligibleUsers"]);
});
 
Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('permission')->group(function(){
    Route::post('/save', [XPermissionController::class, 'savePermission']);
    Route::post('/delete', [XPermissionController::class, 'deletePermission']);
    Route::post('/list', [XPermissionController::class, 'getPermissionList']);
    Route::post('/form-options', [XPermissionController::class, 'getFormOptions']);
    Route::post('/import', [XPermissionController::class, 'importJson']);
});

Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('report')->group(function(){
    Route::post('/save', [XReportController::class, 'saveReport']);
    Route::post('/delete', [XReportController::class, 'deleteReport']);
    Route::post('/list', [XReportController::class, 'getReportList']);
    Route::post('/form-options', [XReportController::class, 'getFormOptions']);
    Route::post('/import', [XReportController::class, 'importJson']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('module')->group(function () {
    Route::post('/save', [XModuleController::class, 'saveModule']);
    Route::post('/delete', [XModuleController::class, "deleteModule"]);
    Route::post('/form-options', [XModuleController::class, "getFormOptions"]);
    Route::post('/import', [XModuleController::class, "importModules"]);
    Route::post('/list',[XModuleController::class, "getModuleList"]);
});
 
Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('user')->group(function () {
    Route::post('/save-lang', [XUserController::class, 'saveLang']);
    Route::post('/lang', [XUserController::class, 'getLang']);
    Route::post('/authization/report', [XUserController::class, 'getUserAuthorizationReport']);
    Route::post('/auth-data', [XAuthServiceController::class,'getAuthData']);
    Route::post('/form-options', [XUserController::class, "getUserFormOption"]);
    Route::post('/linked-user/form-options', [XUserController::class, "getLinkUserFormOptions"]);
    Route::post('/list', [XUserController::class, "getUserList"]);
    Route::post('/list-paginate', [XUserController::class, "getUserList_paginate"]);
    Route::post('/save', [XUserController::class, "saveUser"]);
    Route::post('/update', [XUserController::class, "updateUser"]);
    Route::post('/save-profile-picture', [XUserController::class, "saveProfilePicture"]);
    Route::post('/delete-profile-picture', [XUserController::class, 'deleteProfilePicture']);
    Route::post('/delete', [XUserController::class, "deleteUser"]);

    Route::post('/apps', [XUserController::class, "getUserApps"]);
     //find profile info by official code
     Route::post('/profile-by-code', [XUserController::class, "findProfileByOfficialCode"]);
     //find profile info by email or phone number
     Route::post('/profile', [XUserController::class, "findProfile"]);
     Route::post('/security/set-pwd', [XUserController::class, 'setPassword']);
     Route::post('/set-password', [XAuthServiceController::class, 'setPassword']);
     Route::post('/password/change', [XUserController::class, 'changePassword']);
     Route::post('/password/reset', [XUserController::class, 'setPassword']);
     Route::post('/login-name/change', [XUserController::class, 'changeLoginName']);
     Route::post('/role/change', [XUserController::class, 'setRole']);
     Route::post('/status/update', [XUserController::class, 'setUserStatus']);
     Route::post('/branch/set', [XUserController::class, 'setUserBranch']);
     Route::post('/change-login-name', [XUserController::class, 'changeLoginName']);
     Route::post('/authorization-report', [XUserController::class, "getUserAuthorizationReport"]);
     Route::post('/set-role', [XUserController::class, 'setRole']);
     Route::post('/linked-user/create', [XUserController::class, 'createLinkedUser']);
     Route::post('/linked-user/delete', [XUserController::class, 'deleteLinkedUser']);
});

Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('branch')->group(function (){
    Route::post('/list', [XBranchController::class, "getBranchList"]);
    Route::post('/delete', [XBranchController::class, "deleteBranch"]);
    Route::post('/save', [XBranchController::class, "saveBranch"]);
    Route::post('/set-director', [XBranchController::class, "setDirector"]);
    Route::post('/form-options', [XBranchController::class, "getFormOptions"]);
});

Route::middleware([CustomRateLimiter::class])->group(function(){
    Route::get(Config::get('app.secure_route').'/{q}',[XAuthServiceController::class,'decypherToken']); 
});

Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('role')->group(function () {
    Route::post('/form-options', [XRoleController::class, "getRoleFormOptions"]);
    Route::post('/list-paginate', [XRoleController::class, "getRoleList_paginate"]);
    Route::post('/list', [XRoleController::class, "getRoleList"]);
    Route::post('/listForPrint', [XRoleController::class, "getRoleListForPrint"]);
    Route::post('/list/print', [XRoleController::class, "getRoleListForPrint"]);
    //Route::post('/permission/list-paginate', [XRoleController::class, "getRolePermissions_paginate"]);
    Route::post('/permission/add', [XRoleController::class, "addRolePermission"]);
    Route::post('/permission/remove', [XRoleController::class, "removeRolePermission"]);

    Route::post('/report/add', [XRoleController::class, "addRolePermission"]);
    Route::post('/report/remove', [XRoleController::class, "removeRolePermission"]);

    Route::post('/permissions', [XRoleController::class, 'getRolePermissions']);
    Route::post('/reports', [XRoleController::class, "getRoleReports"]);
    Route::post('/reports-by-category', [XRoleController::class, "getRoleReportsByCategory"]);

    Route::post('/save', [XRoleController::class, "saveRole"]);
    Route::post('/delete', [XRoleController::class, "deleteRole"]);
    Route::post('/members/add', [XRoleController::class, 'addRoleMembers']);
    Route::post('/add-members',[XRoleController::class, "addRoleMembers"]);
    Route::post('/members/remove', [XRoleController::class, 'removeRoleMember']);
    Route::post('/add-member', [XRoleController::class, 'addRoleMember']);
    Route::post('/remove-member', [XRoleController::class, 'removeRoleMember']);
    Route::post('/members/list', [XRoleController::class, 'getRoleMembers']);
    Route::post('/members', [XRoleController::class, 'getRoleMembers']);
 
    Route::post('/add-member', [XRoleController::class, 'addRoleMembers']);
    Route::post('/remove-member', [XRoleController::class, 'removeRoleMember']);

    Route::post('/options-role', [XRoleController::class, 'getComboItems_role']);
    Route::post('/details', [XRoleController::class, 'getRoleById']);

     //getRoleApps() returns list of all apps under the current subscription, but each app has "Allowed" status as 0 or 1
    Route::post('/apps', [XRoleController::class, 'getRoleApps']);
    //getAccessibleApps() returns only the accessible apps
    Route::post('/accessible-apps', [XRoleController::class, 'getAccessibleApps']);
    Route::post('/apps/set-status', [XRoleController::class, 'setRoleAppStatus']);
    Route::post('/apps/add', [XRoleController::class, 'addRoleApp']);
    Route::post('/apps/remove', [XRoleController::class, 'removeRoleApp']);

    Route::post('/modules', [XRoleController::class, 'getRoleModules']);
    // Route::post('/access-module/list', [XRoleController::class, 'getAccessibleModules']);
    // Route::post('/access-module/list-all', [XRoleController::class, 'getAccessibleModules_all']);
    Route::post('modules/add', [XRoleController::class, 'addAccessibleModule']);
    Route::post('modules/remove', [XRoleController::class, 'removeAccessibleModule']);
    Route::post('modules/set-status', [XRoleController::class, 'setRoleModuleStatus']);
    Route::post('/permissions/add', [XRoleController::class, 'addPermissionToRole']);
    Route::post('/permissions/remove', [XRoleController::class, 'removePermissionFromRole']);
    Route::post('/permissions/set-status', [XRoleController::class, 'setRolePermissionStatus']);
    Route::post('/reports/set-status', [XRoleController::class, 'setRoleReportStatus']);
    Route::post('/add-permission', [XRoleController::class, 'addPermissionToRole']);
    Route::post('/remove-permission', [XRoleController::class, 'removePermissionFromRole']);

    //Route::post('/permissions', [UMController::class, 'getPermissionsByLoginName']);
});
  
// Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('money')->group(function(){
//     Route::post('/x-rate/options-month', [MoneyController::class,'options_x_month']);
//     Route::post('/x-rate/list', [MoneyController::class,'getExchangeRateList']);
//     Route::post('/x-rate/save', [MoneyController::class,'saveExchangeRate']);
//     Route::post('/x-rate/delete', [MoneyController::class,'deleteExchangeRate']);
//     Route::post('/x-date/details', [MoneyController::class,'getExchangeRateDetails']);

//     Route::post('/currency/list', [MoneyController::class,'getCurrencies']);
//     Route::post('/currency/details', [MoneyController::class,'getCurrencyDetails']);
//     Route::post('/currency/delete', [MoneyController::class,'deleteCurrency']);
    
//     Route::post('/x-rate/form-options', [MoneyController::class,'getFormOptions_exchange_rate']);
//     Route::post('/currency/form-options', [MoneyController::class,'getFormOptions_currency']);
// });
//begin::Currency APIs