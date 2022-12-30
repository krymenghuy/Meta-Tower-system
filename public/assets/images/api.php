<?php

use Illuminate\Http\Request;
use App\Models\SMS;
use App\Models\Notifier;
use App\Models\UM;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\PersonController;
use App\Http\Controllers\UMController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\CompanyProfileController;
 
//use App\Http\Controllers\Api\ReportController;
  
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MobileAppSettingsController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\GeneralSettingsController;
use App\Http\Controllers\SystemSettingController; 
//use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PusherController;
 
use App\Http\Controllers\LoanAppController;
use App\Http\Controllers\LoanController;
 
use App\Models\PublicStorage;
use App\Models\SystemSetting;
 
/*
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('broadcast/auth', [PusherController::class, 'pusherAuth']); //->middleware('auth');
   
// Rate Limiting for a whole group of routes= > allow 200 requests per 1 minute
Route::group(['middleware' => 'throttle:200,1'], function () {

        //begin::LocationController
        Route::post('getComboItems_country', [LocationController::class, 'getComboItems_country']);
        Route::post('createCountry', [LocationController::class, 'createCountry']);
        Route::post('saveCountry', [LocationController::class, 'saveCountry']);
        Route::post('saveCity', [LocationController::class, 'saveCity']);
        Route::post('saveDistrict', [LocationController::class, 'saveDistrict']);
        Route::post('saveCommune', [LocationController::class, 'saveCommune']);
        Route::post('getCountryList', [LocationController::class, 'getCountryList']);
        Route::post('getDistrictList', [LocationController::class, 'getDistrictList']);
        Route::post('getCityList', [LocationController::class, 'getCityList']);
        Route::post('getCommuneList', [LocationController::class, 'getCommuneList']);
        Route::post('deleteCountry', [LocationController::class, 'deleteCountry']);
        Route::post('deleteCity', [LocationController::class, 'deleteCity']);
        Route::post('deleteDistrict', [LocationController::class, 'deleteDistrict']);
        Route::post('deleteCommune', [LocationController::class, 'deleteCommune']);
        Route::post('getComboItems_city', [LocationController::class, 'getComboItems_city']);
        Route::post('getComboItems_district', [LocationController::class, 'getComboItems_district']);
        Route::post('getComboItems_commune', [LocationController::class, 'getComboItems_commune']);
        Route::post('getComboItems_zone', [LocationController::class, 'getComboItems_zone']);
         
     //end::LocationController
  
     //begin:: PromotionController 
            Route::post('getPromotionList', [PromotionController::class, 'getPromotionList']);
            Route::post('savePromotion', [PromotionController::class, 'savePromotion']);
            Route::post('getPromotionInfo', [PromotionController::class, 'getPromotionInfo']);
            Route::post('deletePromotion', [PromotionController::class, 'deletePromotion']);
    //end::PromotionController
     
});


//um::controller

Route::post('auth/prns', [UMController::class, 'getPermissionsByLoginName']);
//Route::post('auth/prns', [UMController::class, 'getPermissionsByUserId']);

//$d = {'search_value'} seach_value can be NID, phone, email
Route::post('person/info', [UMController::class, 'getPersonDetails']);
Route::post('createApplication', [UMController::class, 'createApplication']);
Route::post('encryptData', [UMController::class, 'encryptData']);
Route::post('createPermission', [UMController::class, 'createPermission']);
Route::post('getModuleList', [UMController::class, 'getModuleList']);
Route::post('saveRole', [UMController::class, 'saveRole']);
Route::post('role_exists', [UMController::class, 'role_exists']);
Route::post('deleteRole', [UMController::class, 'deleteRole']);
Route::post('addRoleMember', [UMController::class, 'addRoleMember']);
Route::post('removeRoleMember', [UMController::class, 'removeRoleMember']);
Route::post('getUserRoles', [UMController::class, 'getUserRoles']);
Route::post('getRoleList', [UMController::class, 'getRoleList']);
Route::post('getRoleMembers', [UMController::class, 'getRoleMembers']);
Route::post('getRoleById', [UMController::class, 'getRoleById']);
Route::post('getUserList', [UMController::class, 'getUserList']);
Route::post('getUserExtendedDetails', [UMController::class, 'getUserExtendedDetails']);
Route::post('saveUser', [UMController::class, 'saveUser']);
Route::post('getUserInfo', [UMController::class, 'getUserInfo']);
Route::post('deleteUser', [UMController::class, 'deleteUser']);
Route::post('setUserStatus', [UMController::class, 'setUserStatus']);
Route::post('unlockUser', [UMController::class, 'unlockUser']);
Route::post('setLockStatus', [UMController::class, 'setLockStatus']);
Route::post('user_exists', [UMController::class, 'user_exists']);
Route::post('verifyUser', [UMController::class, 'verifyUser']);
Route::post('changePassword', [UMController::class, 'changePassword']);
Route::post('setPassword', [UMController::class, 'setPassword']);
Route::post('changeLoginName', [UMController::class, 'changeLoginName']);
Route::post('createLoginSession', [UMController::class, 'createLoginSession']);
Route::post('getComboItems_user', [UMController::class, 'getComboItems_user']);
Route::post('getComboItems_role', [UMController::class, 'getComboItems_role']);
Route::post('getComboItems_workloc', [UMController::class, 'getComboItems_workloc']);
Route::post('getAccessibleModules_current_user', [UMController::class, 'getAccessibleModules_current_user']);
Route::post('getAccessibleModules', [UMController::class, 'getAccessibleModules']);
Route::post('addAccessibleModule', [UMController::class, 'addAccessibleModule']);
Route::post('getPermissionsByRole', [UMController::class, 'getPermissionsByRole']);
Route::post('findPermissions', [UMController::class, 'findPermissions']);
Route::post('addPermissionToRole', [UMController::class, 'addPermissionToRole']);
Route::post('removePermissionFromRole', [UMController::class, 'removePermissionFromRole']);
Route::post('getPermissionsByLoginName', [UMController::class, 'getPermissionsByLoginName']);
Route::post('getPermissionsByUserId', [UMController::class, 'getPermissionsByUserId']);
Route::post('getPermissionsByRoleId', [UMController::class, 'getPermissionsByRoleId']);
Route::post('localizePermissions', [UMController::class, 'localizePermissions']);
Route::post('allowed', [UMController::class, 'allowed']);
Route::post('accessibleModule', [UMController::class, 'accessibleModule']);
Route::post('getComboItems_module', [UMController::class, 'getComboItems_module']);
Route::post('removeAccessibleModule', [UMController::class, 'removeAccessibleModule']);
Route::post('getComboItems_userclass', [UMController::class, 'getComboItems_userclass']);
Route::post('logout', [UMController::class, 'logout']);
//end::controller
 
//begin::SystemSettingController
    Route::post('getComboItems_price_list',[SystemSettingController::class,'getComboItems_price_list']);

//end::SystemSettingController
  
//begin::CompanyProfileController
    Route::post('saveCompanyLogo', [CompanyProfileController::class, 'saveCompanyLogo']);
    Route::post('getCompanyLogo', [CompanyProfileController::class, 'getCompanyLogo']);
    Route::post('deleteCompanyLogo', [CompanyProfileController::class, 'deleteCompanyLogo']);
    Route::post('saveCompanyInfo', [CompanyProfileController::class, 'saveCompanyInfo']);
    Route::post('getCompanyInfo', [CompanyProfileController::class, 'getCompanyInfo']);
    Route::post('getBrandImages_driver', [CompanyProfileController::class, 'getBrandImages_driver']);
    Route::post('getBrandImages_sender', [CompanyProfileController::class, 'getBrandImages_sender']);
//end::CompanyProfileController
 
//begin::DashboardController
//  Route::post('dbs_getPackageCounts', [DashboardController::class, 'getPackageCounts']);
//  Route::post('dbs_getData_card1', [DashboardController::class, 'getData_card1']);
 
//end::DashboardController

// //begin::SalesAgentController
//     Route::post('saveSalesAgent', [SalesAgentController::class, 'saveSalesAgent']);
//     Route::post('deleteSalesAgent', [SalesAgentController::class, 'deleteSalesAgent']);
//     Route::post('getSalesAgentList', [SalesAgentController::class, 'getSalesAgentList']);
//     Route::post('getFormData_salesAgent', [SalesAgentController::class, 'getFormData_salesAgent']);
//     Route::post('getSalesAgentById', [SalesAgentController::class, 'getSalesAgentById']);
//     Route::post('updateSalesAgentStatus', [SalesAgentController::class, 'updateSalesAgentStatus']);
// //end::SalesAgentController

//begin::ReportController
    Route::prefix('rpt')->group(function(){
        Route::post('rpt_getSummaryData', [ReportController::class, 'getSummaryData']);
    });
//end::ReportController

//begin::ReportController
     Route::post('getMobileBrandImages', [MobileAppSettingsController::class, 'getMobileBrandImages']);
     Route::post('saveBrandImage', [MobileAppSettingsController::class, 'saveBrandImage']);
     Route::post('deleteBrandImage', [MobileAppSettingsController::class, 'deleteBrandImage']);
//end::ReportController


/***### ROUTES FOR EXTERNAL API (V1) ##****/
//begin::API routes for external calls

        //// ***Allow 3 API calls per 10 minutes ***/
        // Route::group(['middleware' => 'cors','middleware' => 'throttle:3,10'], function(){
        //     Route::prefix('v1')->group(function(){
        //         Route::post('externalLogin', [ApiController::class, 'externalLogin']);
        //         Route::post('savePickupRequest', [ApiController::class, 'savePickupRequest']);
        //         Route::post('getPickupList', [PickuprequestController::class, 'getPickupList']);
        //     });
        // });

    Route::post('pending-requests', [NotificationController::class, 'getPendingRequests']);
    Route::post('notifications', [NotificationController::class, 'getNotificationListByUser']);

    Route::post('person/find', [PersonController::class, 'findPersons']);
    // person/profile() does takes person_id as parameter (used for backend)
    Route::post('person/profile', [PersonController::class, 'getPersonProfile']);

    // borrower/profile() does not take person_id as parameter (used for Student page login)
    Route::post('borrower/profile', [PersonController::class, 'getBorrowerProfile']);
    //begin:: LoanController
    
       Route::post('loan/receipt-info', [LoanController::class, 'getReceiptData_print']);
       Route::post('loan/payment-info', [LoanController::class, 'getPaymentInfo']);
       Route::post('loan/filter-options', [LoanController::class, 'getComboItems_loan']);
       Route::post('loan/info', [LoanController::class, 'getLoanInfo']);
       Route::post('loan/list', [LoanController::class, 'getLoanList']);
       Route::post('loan/save', [LoanController::class, 'saveLoan']);
       Route::post('loan/delete', [LoanController::class, 'deleteLoan']);
       Route::post('loan/disburse', [LoanController::class, 'disburseLoan']);
       Route::post('loan/save-payment', [LoanController::class, 'savePayment']);
       Route::post('loan/payment-list', [LoanController::class, 'getPaymentList']);
       Route::post('loan/delete-payment', [LoanController::class, 'deletePayment']);

       //returns payment list for student currently logged in
       Route::post('borrower/payment-list', [LoanController::class, 'getPaymentList_cu']);
       Route::post('borrower/loan-list', [LoanController::class, 'getLoanList_cu']);
      
       Route::post('loan/save-usedup', [LoanController::class, 'saveUsedup']);
       Route::post('loan/useup-list', [LoanController::class, 'getUsedups']);
       Route::post('loan/delete-usedup', [LoanController::class, 'deleteUsedup']);

       Route::post('loan/guarantors', [LoanController::class, 'getGuarantorList']);
       Route::post('loan/borrowers', [LoanController::class, 'getBorrowerList']);
       Route::post('loan/finished-loan-list', [LoanController::class, 'getFinishedLoanList']);
       
    //end:: LoanController


    //loan-info-disburse returns object {'borrower_data','loan_data'} that is the initial data for "Disburse Loan" screen
    Route::post('loan/loan-info-disburse', [LoanController::class, 'getLoanAppInfo_disburse']);
    Route::post('loan-application/document-content', [LoanAppController::class, 'getDocumentContent']);
    Route::post('loan-application/delete-document', [LoanAppController::class, 'deleteDocument']);
    Route::post('loan-application/save-document', [LoanAppController::class, 'saveDocument']);
    Route::post('loan-application/documents', [LoanAppController::class, 'getDocuments']);

    Route::post('loan-application/delete-profile-picture', [LoanAppController::class, 'deleteProfilePicture']);
    Route::post('loan-application/save-profile-picture', [LoanAppController::class, 'saveProfilePicture']);
    //return object {'personal_data','academic_data'} based on the given @n_id
    Route::post('loan-application/person-info', [LoanAppController::class, 'getApplicantInfo']);
    
    Route::post('loan-application/delete', [LoanAppController::class, 'deleteLoanApplication']);
    Route::post('loan-application/save', [LoanAppController::class, 'saveLoanApplication']);
    Route::post('loan-application/list', [LoanAppController::class, 'getLoanApplicationList']);
    Route::post('loan-application/info', [LoanAppController::class, 'getLoanApplicationInfo']);
    Route::post('loan-application/form-options', [LoanAppController::class, 'getForm_options']);
    Route::post('loan-application/active-loan-options', [LoanAppController::class, 'getComboItems_active_loan']);
    Route::post('loan-application/approve', [LoanAppController::class, 'approveLoanApp']);
    

    Route::post('dashboard/card-data', [DashboardController::class, 'getCardData']);
  
    Route::post('settings/payment-form-options', [GeneralSettingsController::class, 'getPaymentFormOptions']);
    Route::post('settings/program-details', [GeneralSettingsController::class, 'getProgramDetails']);
    Route::post('settings/program-options', [GeneralSettingsController::class, 'getProgramOptions']);
    Route::post('settings/save-program', [GeneralSettingsController::class, 'saveProgram']);

    Route::post('settings/save-occupation', [GeneralSettingsController::class, 'saveOccupation']);
    Route::post('settings/occupations', [GeneralSettingsController::class, 'getOccupations']);
 
    Route::post('settings/save-loan-purpose', [GeneralSettingsController::class, 'saveLoanPurpose']);
    Route::post('settings/loan-purposes', [GeneralSettingsController::class, 'getLoanPurposes']);
 
    Route::post('location/cities', [LocationController::class, 'getCityList']);
    Route::post('location/districts', [LocationController::class, 'getDistrictList']);
    Route::post('location/communes', [LocationController::class, 'getCommuneList']);
    
    Route::group(['middleware' => 'cors'], function(){
         
        //##begin:: driver app api V1
            Route::prefix('borrower/v1')->group(function(){
        
            });
        //##end:: driver app api V1

    });

//end::API routes for external calls


