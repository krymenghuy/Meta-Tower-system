<?php

use App\Http\Controllers\UMController;
use App\Http\Controllers\PusherController;
use App\Http\Middleware\CustomRateLimiter;
use App\Http\Controllers\Dms\ReportCenterController;

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('report-center')->group(function(){
    Route::post('/report-list', [ReportCenterController::class, 'getReportList']);
    Route::post('/reports-by-category', [ReportCenterController::class, 'getReportListByCategory']);
    Route::post('/filter-options', [ReportCenterController::class, 'getReportFilterOptions']);
});

Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('user')->group(function () {

    //update api for user
    //Route::post('/save', [UMController::class, "saveUser"]);
    Route::post('/delete', [UMController::class, "deleteUser"]);
    Route::post('/form-options', [UMController::class, "getUserFormOption"]);
    Route::post('/list', [UMController::class, "getUserList"]);
    Route::post('/list-paginate', [UMController::class, "getUserList_paginate"]);

    Route::post('/permission/add', [UMController::class, "addPermissionToUser"]);
    Route::post('/permission/delete', [UMController::class, "removeUserPermission"]);
    Route::post('/permission/list-paginate', [UMController::class, "getUserPermissions_paginate"]);
    Route::post('/permission/list', [UMController::class, "getUserPermissions"]);
    Route::post('/report/permission', [UMController::class, "getUserViewReportPermissionListPaginate"]);

    Route::post('/module/add', [UMController::class, "addModuleToUser"]);
    Route::post('/module/delete', [UMController::class, "removeUserModule"]);
    Route::post('/module/list', [UMController::class, "getModuleList"]);

    Route::post('/info', [UMController::class, 'getUserInfo']);
    Route::post('/details', [UMController::class, 'getUserDetails']);

    Route::post('/options-user', [UMController::class, 'getComboItems_user']);
    //Route::post('/otions-user', [UMController::class, 'getComboItems_user']);
    Route::post('/options-work-location', [UMController::class, 'getComboItems_workloc']);
    //Route::post('/role/list', [UMController::class, 'getRoleList']);
    // Route::post('/role/add', [UMController::class, 'addRoleMember']);
    // Route::post('/role/delete', [UMController::class, 'removeRoleMember']);
    // Route::post('/deactivate-me', [UMController::class, 'deactivateMySelf']);
    // Route::post('/extended-details', [UMController::class, 'getUserExtendedDetails']);

    Route::post('/set-status', [UMController::class, 'setUserStatus']);
    Route::post('/unlock', [UMController::class, 'unlockUser']);
    Route::post('/set-lock-status', [UMController::class, 'setLockStatus']);
    Route::post('/exists', [UMController::class, 'user_exists']);
    Route::post('/security/authenticate', [UMController::class, 'verifyUser']);
    Route::post('/security/change-pwd', [UMController::class, 'changePassword']);
    Route::post('/security/set-pwd', [UMController::class, 'setPassword']);
    Route::post('/security/change-login', [UMController::class, 'changeLoginName']);
    Route::post('/options-user-class', [UMController::class, 'getComboItems_userclass']);
    Route::post('current/access-modules', [UMController::class, 'getAccessibleModules_current_user']);
});

Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('role')->group(function () {
    //update api for role
    Route::post('/save', [UMController::class, "saveRole"]);
    Route::post('/delete', [UMController::class, "deleteRole"]);
    Route::post('/options-role', [UMController::class, 'getComboItems_role']);
    Route::post('/details', [UMController::class, 'getRoleById']);
    Route::post('/list-paginate', [UMController::class, "getRoleList_paginate"]);
    Route::post('/list', [UMController::class, "getRoleList"]);
    Route::post('/create', [UMController::class, 'createApplication']);
    Route::post('/list-application',[UMController::class,'listApplication']);
 
    Route::post('/permission/list-paginate', [UMController::class, "getRolePermissions_paginate"]);
    Route::post('/permission/add', [UMController::class, "addPermissionToRole"]);
    Route::post('/permission/delete', [UMController::class, "removeRolePermission"]);

    Route::post('/report/add', [UMController::class, "addPermissionToRole"]);
    Route::post('/report/remove', [UMController::class, "removePermissionFromRole"]);
    Route::post('/reports', [UMController::class, 'getRoleReports']);

    Route::post('/exists', [UMController::class, 'role_exists']);
    
    Route::post('/members/add', [UMController::class, 'addRoleMember']);
    Route::post('/members/remove', [UMController::class, 'removeRoleMember']);
    Route::post('/add-member', [UMController::class, 'addRoleMember']);
    Route::post('/remove-member', [UMController::class, 'removeRoleMember']);

    Route::post('/members/list', [UMController::class, 'getRoleMembers']);
    Route::post('/members', [UMController::class, 'getRoleMembers']);
    
    //use only one model
    Route::post('/access-modules', [UMController::class, 'getAccessibleModules']);
    Route::post('/access-module/list', [UMController::class, 'getAccessibleModules']);
    Route::post('/access-module/list-all', [UMController::class, 'getAccessibleModules_all']);

    Route::post('access-module/add', [UMController::class, 'addAccessibleModule']);
    Route::post('access-module/remove', [UMController::class, 'removeAccessibleModule']);
    
    Route::post('/permissions', [UMController::class, 'getPermissionsByRole']);
    Route::post('/permission/add', [UMController::class, 'addPermissionToRole']);
    Route::post('/permission/remove', [UMController::class, 'removePermissionFromRole']);
    Route::post('/add-permission', [UMController::class, 'addPermissionToRole']);
    Route::post('/remove-permission', [UMController::class, 'removePermissionFromRole']);
 
    //Route::post('/permissions', [UMController::class, 'getPermissionsByLoginName']);
});

Route::middleware([CustomRateLimiter::class])->prefix('settings')->group(function(){
    Route::get('/lang', [UMController::class, 'getLang']);
    Route::post('/save-lang', [UMController::class, 'saveLang']);
});

Route::middleware([CustomRateLimiter::class])->group(function(){
    Route::post('logout', [UMController::class, 'logout']);
    Route::get('auth/um-options', [UMController::class, 'getUserManagementOptions']);
    Route::post('broadcast/auth', [PusherController::class, 'pusherAuth']); //->middleware('auth');
    Route::post('auth/auth-data', [UMController::class, 'getAuthData']);

    Route::post('encryptData', [UMController::class, 'encryptData']);
    Route::post('vs-encrypt031181', [UMController::class, 'encryptData']);
    Route::post('allowed', [UMController::class, 'allowed']);
    Route::get('csrf-token', [UMController::class, 'refreshCsrfToken']);
});
 
Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('application')->group(function(){
    Route::post('/delete', [UMController::class, "saveUser"]);
    Route::post('/module/create', [UMController::class, 'createModule']);
    Route::post('/module/delete', [UMController::class, 'deleteModule']);
    Route::post('/module/list', [UMController::class, 'getModuleList']);
    Route::post('/create', [UMController::class, 'createApplication']);

    Route::post('/module/option-module', [UMController::class, 'getComboItems_module']);
});
 
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('module')->group(function () {
    Route::post('/create', [UMController::class, 'createModule']);
    Route::post('/delete', [UMController::class, "deleteModule"]);
    // Route::post('/list', [UMController::class, 'getModuleList']);
    Route::post('/list',[UMController::class, "moduleList"]);
    Route::post('/options-module', [UMController::class, 'getComboItems_module']);
    Route::post('/save-module-list', [UMController::class, 'saveModuleList']);
});

Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('permission')->group(function () {
    Route::post('/create', [UMController::class, 'createPermission']);
    Route::post('/delete', [UMController::class, "deletePermission"]);
    Route::post('/list',[UMController::class, "permissionList"]);
    Route::post('/report-list',[UMController::class, "reportPrnList"]);
    Route::post('/info', [UMController::class, "getPermissionInfo"]);
    Route::post('/find', [UMController::class, 'findPermissions']);
    // Route::post('/list-paginate', [UMController::class,'getPermissionListPaginate']);
});

Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('role')->group(function () {
    //role api
    Route::post('/save', [UMController::class, 'saveRole']);
    Route::post('/delete', [UMController::class, "deleteRole"]);
    Route::post('/list-all',[UMController::class, "getRoleList"]);
    Route::post('/list-paginate',[UMController::class, "getRoleList_paginate"]);
    Route::post('/details', [UMController::class, "getRoleDetails"]);
  
    //member api
    Route::post('/add-member',[UMController::class, "addRoleMember"]);
    Route::post('/add-members',[UMController::class, "addRoleMembers"]);
    Route::post('/remove-member',[UMController::class, "removeRoleMember"]);


    //app api
    Route::post('/add-app',[UMController::class, "addRoleApp"]);
    Route::post('/remove-app',[UMController::class, "removeRoleApp"]);

    //module api
    Route::post('/add-module',[UMController::class, "addRoleModule"]);
    Route::post('/remove-module',[UMController::class, "removeRoleModule"]);

    //permission api
    Route::post('/add-permission',[UMController::class, "addRolePermission"]);
    Route::post('/remove-permission',[UMController::class, "removeRolePermission"]);

    //reports api
    Route::post('/add-report',[UMController::class, "addRoleReport"]);
    Route::post('/remove-report',[UMController::class, "removeRoleReport"]);

    //get all api
    Route::post('/users',[UMController::class, "getRoleMembers"]);
    Route::post('/members',[UMController::class, "getRoleMembers"]);
    Route::post('/apps',[UMController::class, "getRoleApps"]);
    Route::post('/modules',[UMController::class, "getRoleModules"]);
    Route::post('/permissions',[UMController::class, "getPermissionsByRole"]);
    Route::post('/reports',[UMController::class, "getRoleReports"]);
});