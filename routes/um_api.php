<?php
use App\Http\Controllers\UMController;
use App\Http\Controllers\PusherController;

Route::post('logout', [UMController::class, 'logout']);
Route::get('settings/lang', [UMController::class, 'getLang']);
Route::post('settings/save-lang', [UMController::class, 'saveLang']);

Route::post('auth/um-options', [UMController::class, 'getUserManagementOptions']);
Route::post('broadcast/auth', [PusherController::class, 'pusherAuth']); //->middleware('auth');
Route::post('auth/auth-data', [UMController::class, 'getAuthData']);
//Route::post('getComboItems_userclass', [UMController::class, 'getComboItems_userclass']);

Route::prefix('application')->group(function () {
    Route::post('/create', [UMController::class, 'createApplication']);
    Route::post('/delete', [UMController::class,"saveUser"]);
    Route::post('/module/create', [UMController::class, 'createModule']);
    Route::post('/module/delete', [UMController::class, 'deleteModule']);
    Route::post('/module/list', [UMController::class, 'getModuleList']);
    Route::post('/module/option-module', [UMController::class, 'getComboItems_module']); 
});

Route::prefix('module')->group(function () {
    Route::post('/create', [UMController::class, 'createModule']);
    Route::post('/delete', [UMController::class,"deleteModule"]);
    Route::post('/list', [UMController::class, 'getModuleList']);
    Route::post('/options-module', [UMController::class, 'getComboItems_module']);
    Route::post('/save-module-list', [UMController::class, 'saveModuleList']);
});

Route::prefix('permission')->group(function () {
    Route::post('/create', [UMController::class, 'createPermission']);
    Route::post('/delete', [UMController::class,"deletePermission"]);
    Route::post('/info', [UMController::class,"getPermissionInfo"]);
    Route::post('/find', [UMController::class, 'findPermissions']);
});


Route::prefix('user')->group(function () {
    Route::post('/list', [UMController::class,"getUserList"]);
    Route::post('/save', [UMController::class,"saveUser"]);
    Route::post('/delete', [UMController::class,"deleteUser"]);
    
    Route::post('/info', [UMController::class, 'getUserInfo']);
    Route::post('/dettails', [UMController::class, 'getUserDetails']);

    Route::post('/options-user', [UMController::class, 'getComboItems_user']);
    //Route::post('/otions-user', [UMController::class, 'getComboItems_user']);
    Route::post('/options-work-location', [UMController::class, 'getComboItems_workloc']);
    Route::post('/roles', [UMController::class, 'getUserRoles']);
    Route::post('/deactivate-me', [UMController::class, 'deactivateMySelf']);
    Route::post('/extended-details', [UMController::class, 'getUserExtendedDetails']);

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

Route::prefix('role')->group(function () {
    Route::post('/list', [UMController::class,"getRoleList"]);
    Route::post('/save', [UMController::class,"saveRole"]);
    Route::post('/delete', [UMController::class,"deleteRole"]);
    Route::post('/exists', [UMController::class, 'role_exists']);
    Route::post('/members/add', [UMController::class, 'addRoleMember']);
    Route::post('/members/remove', [UMController::class, 'removeRoleMember']);
    Route::post('/add-member', [UMController::class, 'addRoleMember']);
    Route::post('/remove-member', [UMController::class, 'removeRoleMember']);
    Route::post('/members/list', [UMController::class, 'getRoleMembers']);
    Route::post('/members', [UMController::class, 'getRoleMembers']);
    Route::post('/options-role', [UMController::class, 'getComboItems_role']);
    Route::post('/details', [UMController::class, 'getRoleById']);

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
 
Route::post('encryptData', [UMController::class, 'encryptData']);   
Route::post('allowed', [UMController::class, 'allowed']); 
Route::get('csrf-token', [UMController::class, 'refreshCsrfToken']); 



