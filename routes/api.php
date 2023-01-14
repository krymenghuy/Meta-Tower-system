<?php

use Illuminate\Http\Request;
use App\Models\SMS;
use App\Models\Notifier;
use App\Models\UM;
use App\Models\JDV;
 
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\PersonController;
use App\Http\Controllers\UMController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\CompanyProfileController;
  
//use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\MailController;  
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MobileAppSettingsController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\GeneralSettingsController;
use App\Http\Controllers\SystemSettingController; 
use App\Http\Controllers\WebReportController; 
//use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PusherController;
 
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\QTicketController;
use App\Http\Controllers\MedicalServiceController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\ItemGroupController; 
use App\Http\Controllers\EmployeeController;  
use App\Http\Controllers\InventorySettingsController;

use App\Http\Controllers\PartnerController;
use App\Http\Controllers\CurrencyController;
use App\Models\PublicStorage;
use App\Models\SystemSetting;
use App\Models\Patient;
use App\Models\Inventory\Brand;
 
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
    //begin:: AppointmentController 
        Route::post('appointment/list', [AppointmentController::class, 'getAppointmentList']);
        Route::post('appointment/save', [AppointmentController::class, 'saveAppointment']);
        Route::post('appointment/delete', [AppointmentController::class, 'deleteAppointment']);
        Route::post('appointment/details', [AppointmentController::class, 'getAppointmentDetails']);
        Route::post('appointment/add-chief-complaint', [AppointmentController::class, 'addChiefComplaint']);
        Route::post('appointment/remove-chief-complaint', [AppointmentController::class, 'removeChiefComplaint']);
        Route::post('appointment/find-client', [AppointmentController::class, 'findClient']);
    //end::AppointmentController
        
    //begin::QTicketController
        Route::post('ticket/create', [QTicketController::class, 'createTicket']);
        Route::post('ticket/list', [QTicketController::class, 'getTicketList']);
        Route::post('ticket/delete', [QTicketController::class, 'deleteTicket']);
        Route::post('ticket/details', [QTicketController::class, 'getTicketDetails']);
        Route::post('ticket/add-chief-complaint', [QTicketController::class, 'addChiefComplaint']);
        Route::post('ticket/remove-chief-complaint', [QTicketController::class, 'deleteChiefComplaint']);
        Route::post('ticket/patient-vital-signs', [QTicketController::class, 'getPatientVitalSigns']);
        //getPatientPhysicalExamination()
        Route::post('ticket/patient-pe', [QTicketController::class, 'getPatientPE']);
        Route::post('ticket/patient-labo-tests', [QTicketController::class, 'getPatientLaboTests']);
        Route::post('ticket/patient-diagnosis', [QTicketController::class, 'getPatientDiagnosis']);
        Route::post('ticket/patient-prescription', [QTicketController::class, 'getPatientPrescription']);
        Route::post('ticket/doctor-advice', [QTicketController::class, 'getDoctorAdvice']);
        
    //End::QTicketController
    
  //begin::MedicalServiceController
    Route::post('service/details', [MedicalServiceController::class, 'getMedicalServiceDetails']);
     Route::post('service/items', [MedicalServiceController::class, 'getMedicalServices']);
     Route::post('service/delete', [MedicalServiceController::class, 'deleteMedicalService']);
     Route::post('service/save', [MedicalServiceController::class, 'saveMedicalService']);
  //End::MedicalServiceController

    //begin::ItemController
        Route::post('inventory/item-details', [ItemController::class, 'getItemDetails']);
        Route::post('inventory/items', [ItemController::class, 'getItemList']);
        Route::post('inventory/delete-item', [ItemController::class, 'deleteItem']);
        Route::post('inventory/save-item', [ItemController::class, 'saveItem']);
    //End::ItemController

    //begin::ItemGroupController
        Route::post('inventory/group-details', [ItemGroupController::class, 'getItemGroupDetails']);
        Route::post('inventory/groups', [ItemGroupController::class, 'getItemGroups']);
        Route::post('inventory/delete-group', [ItemGroupController::class, 'deleteItemGroup']);
        Route::post('inventory/save-group', [ItemGroupController::class, 'saveItemGroup']);
    //End::ItemGroupController

    //begin::EmployeeController
        Route::post('employee/details', [EmployeeController::class, 'getEmployeeDetails']);
        Route::post('employee/list', [EmployeeController::class, 'getEmployeeList']);
        Route::post('employee/delete', [EmployeeController::class, 'deleteEmployee']);
        Route::post('employee/save', [EmployeeController::class, 'saveEmployee']);
    //End::EmployeeController

    //begin::InventorySettingsController =>  Inventory Settings.
    Route::post('inventory/settings/options-group',[InventorySettingsController::class, 'getComboItems_group']);
    Route::post('inventory/settings/item-form-options',[InventorySettingsController::class, 'getItemFormOptions']);
    
   //end::InventorySettingsController =>  Inventory Settings.

  //begin::PartnerController
     Route::post('partner/list', [PartnerController::class, 'getPartnerList']);
     Route::post('partner/delete', [PartnerController::class, 'deletePartner']);
     Route::post('partner/save', [PartnerController::class, 'savePartner']);
     Route::post('partner/details', [PartnerController::class, 'getPartnerDetails']);
  //End::PartnerController

   //begin::CurrencyController
    Route::post('currency/list', [CurrencyController::class, 'getCurrencyList']);
    Route::post('currency/delete', [CurrencyController::class, 'deleteCurrency']);
    Route::post('currency/save', [CurrencyController::class, 'saveCurrency']);
    Route::post('currency/details', [CurrencyController::class, 'getCurrencyDetails']);
    Route::post('currency/save-rates', [CurrencyController::class, 'saveRates']);
    Route::post('currency/save-rate', [CurrencyController::class, 'saveBuyRate']);
    Route::post('currency/save-buy-rate', [CurrencyController::class, 'saveBuyRate']);
    Route::post('currency/save-sell-rate', [CurrencyController::class, 'saveSellRate']);
  //End::CurrencyController

    //begin::PatientController. Not using Controller
            Route::post('patient/find',function(Request $req){
                $res = Patient::findSimilar($req);
                return response()->json($res);
            });

            Route::post('patient/list', function(Request $req){
                return response()->json(Patient::list($req));
            });

            Route::post('patient/register',function(Request $req){
                $res = Patient::register($req);
                return response()->json($res);
            });

            Route::post('patient/delete',function(Request $req){
                $res = Patient::deletePermanent($req);
                return response()->json($res);
            });

            Route::post('patient/history',function(Request $req){
                $res = Patient::history($req);
                return response()->json($res);
            });

            Route::post('patient/photos',function(Request $req){
                $res = Patient::photos($req);
                return response()->json($res);
            });

            Route::post('patient/invoices',function(Request $req){
                $res = Patient::invoices($req);
                return response()->json($res);
            });

            Route::post('patient/transactions',function(Request $req){
                $res = Patient::transactions($req);
                return response()->json($res);
            });

    //end::PatientController

    //begin::Inventory Module. Not using Controller
            Route::post('inventory/save-brand',function(Request $req){
                $res = Brand::createOrUpdate($req);
                return response()->json($res);
            });

            Route::post('inventory/delete-brand',function(Request $req){
                $res = Brand::deletePermanently($req);
                return response()->json($res);
            });
            Route::post('inventory/list-brand',function(Request $req){
                $res = Brand::list($req);
                return response()->json($res);
            });

    //end::Inventory Module

        //begin::LocationController
        
                Route::post('patient-reg-options',[GeneralSettingsController::class, 'getPatientRegisterOptions']);
                
                Route::post('options-nationality',function(Request $req){
                    $rows = App\Models\Location\Country::selectRaw("id,name as nationality,name_kh as nationality_kh")->orderByRaw("name asc")->get();
                    return JDV::json($rows);
                })->middleware('vs-auth');

                Route::post('options-country',function(Request $req){
                    $rows = App\Models\Location\Country::selectRaw("id,name,name_kh")->orderByRaw("name asc")->get();
                    return JDV::json($rows);
                })->middleware('vs-auth');

                Route::post('options-city',function(Request $req){
                    $country_id = $req->country_id?$req->country_id:0;
                    $rows = App\Models\Location\City::where("country_id",$country_id)->selectRaw("country_id,id,name,name_kh")->orderByRaw("name asc")->get();
                    return JDV::json($rows);
                })->middleware('vs-auth');

                Route::post('options-district',function(Request $req){
                    $city_id = $req->city_id?$req->city_id:0;
                    $rows = App\Models\Location\District::where("city_id",$city_id)->selectRaw("city_id,id,name,name_kh")->orderByRaw("name asc")->get();
                    return JDV::json($rows);
                })->middleware('vs-auth');

                Route::post('options-commune',function(Request $req){
                    $district_id = $req->district_id?$req->district_id:0;
                    $rows = App\Models\Location\Commune::where("district_id",$district_id)->selectRaw("district_id,id,name,name_kh")->orderByRaw("name asc")->get();
                    return JDV::json($rows);
                })->middleware('vs-auth');

                // Route::post('country/save',function(Request $req){
                //     $res = App\Models\Location\Country::save($req);
                //     return response()->json($res);
                // });

                // Route::post('country/delete',function(Request $req){
                //     $res = App\Models\Location\Country::delete($req);
                //     return response()->json($res);
                // });

                // Route::post('city/save',function(Request $req){
                //     $res = App\Models\Location\City::save($req);
                //     return response()->json($res);
                // });

                // Route::post('city/delete',function(Request $req){
                //     $res = App\Models\Location\City::delete($req);
                //     return response()->json($res);
                // });

                // Route::post('district/save',function(Request $req){
                //     $res = App\Models\Location\District::save($req);
                //     return response()->json($res);
                // });

                // Route::post('district/delete',function(Request $req){
                //     $res = App\Models\Location\District::delete($req);
                //     return response()->json($res);
                // });

                // Route::post('commune/save',function(Request $req){
                //     $res = App\Models\Location\Commune::save($req);
                //     return response()->json($res);
                // });

                // Route::post('commune/delete',function(Request $req){
                //     $res = App\Models\Location\Commune::delete($req);
                //     return response()->json($res);
                // });         
     //end::LocationController

  
    //begin:: PromotionController 
            Route::post('getPromotionList', [PromotionController::class, 'getPromotionList']);
            Route::post('savePromotion', [PromotionController::class, 'savePromotion']);
            Route::post('getPromotionInfo', [PromotionController::class, 'getPromotionInfo']);
            Route::post('deletePromotion', [PromotionController::class, 'deletePromotion']);
    //end::PromotionController
     
});
 
//begin::ReportController/WebReportController

//end::ReportController/WebReportController
Route::post('report-center/report-list', [WebReportController::class, 'getReportList']);
Route::post('report-center/filter-options', [WebReportController::class, 'getReportFilterOptions']);
Route::post('test/test-api',function(){
    $data ="This is result of api";
    return response()->json($data);
});

//um::controller
    Route::post('auth/login', [UMController::class, 'apiLogin']);
    Route::post('user/change-pwd', [UMController::class, 'changePassword']);
    Route::post('auth/prns', [UMController::class, 'getPermissions_cu']);
    Route::post('auth/auth-data', [UMController::class, 'getAuthData']);
    //Route::post('auth/prns', [UMController::class, 'getPermissionsByUserId']);
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
    Route::post('users/create-logins', [LoanController::class, 'temp_create_logins']);
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

 
    Route::post('pending-requests', [NotificationController::class, 'getPendingRequests']);
    Route::post('notifications', [NotificationController::class, 'getNotificationListByUser']);
    Route::post('person/save', [PersonController::class, 'savePersonInfo']);
    //Route::post('person/find', [PersonController::class, 'findPersons']);
    Route::post('person/info', [PersonController::class, 'getPersonInfo']);
    //Route::post('person/info-by-nid', [PersonController::class, 'getPersonInfoByNID']);
     
//begin::DashboardController
    Route::post('dashboard/board-data', [DashboardController::class, 'getDashboardData']);
    Route::post('dashboard/summarized-values', [DashboardController::class, 'getDashboardData_summary']);
    Route::post('dashboard/barchart-one', [DashboardController::class, 'getDashboardData_barchart']);
    Route::post('dashboard/piechart-one', [DashboardController::class, 'getDashboardData_piechart']);
    Route::post('dashboard/table-one', [DashboardController::class, 'getDashboardData_table']);
//end::DashboardController
  
    

    Route::post('settings/test-sql', [GeneralSettingsController::class, 'testSQL']);
    //return langauge as json object format based on give parameter @lang = {'en','km',...}. It is used to return langauge to client side
    Route::post('settings/lang', [UMController::class, 'getLang']);
    Route::post('settings/save-lang', [UMController::class, 'saveLang']);
    Route::post('settings/departments', [GeneralSettingsController::class, 'getDepartmentList']);
    Route::post('settings/save-department', [GeneralSettingsController::class, 'saveDepartment']);
    Route::post('settings/delete-department', [GeneralSettingsController::class, 'deleteDepartment']);
    Route::post('settings/department-info', [GeneralSettingsController::class, 'getDepartmentDetails']);

    Route::post('settings/save-position', [GeneralSettingsController::class, 'savePosition']);
    Route::post('settings/options-position', [GeneralSettingsController::class, 'getComboItems_position']);
    Route::post('settings/create-org', [GeneralSettingsController::class, 'createOrganization']);
    Route::post('settings/delete-org', [GeneralSettingsController::class, 'deleteOrganization']);
    Route::post('settings/create-industry', [GeneralSettingsController::class, 'createIndustry']);
    Route::post('settings/delete-industry', [GeneralSettingsController::class, 'deleteIndustry']);
    Route::post('settings/collateral-types', [GeneralSettingsController::class, 'getCollateralTypes']);

    Route::post('settings/options-contact-channel', [GeneralSettingsController::class, 'getComboItems_channel']);
    Route::post('settings/options-appt-status', [GeneralSettingsController::class, 'getComboItems_appt_status']);
    Route::post('settings/options-ticket-status', [GeneralSettingsController::class, 'getComboItems_ticket_status']);
    Route::post('settings/options-department', [GeneralSettingsController::class, 'getComboItems_department']);
    Route::post('settings/options-consultant', [GeneralSettingsController::class, 'getComboItems_consultant']);   
    Route::post('settings/options-chief-complaint', [GeneralSettingsController::class, 'getComboItems_chief_complaint']);
    Route::post('settings/save-chief-complaint', [GeneralSettingsController::class, 'saveChiefComplaint']);
  
    
    //getProductData() return object {"products"=> [], "usages"=>[]} for doctor's editing prescription
    Route::post('settings/options-product', [GeneralSettingsController::class, 'getProductData']);

    /** return various options regarding Employment data. such as organiations, industries, etc **/
    Route::post('settings/emp-options', [GeneralSettingsController::class, 'getComboItems_emp_options']);
    Route::post('settings/report-filter-options', [GeneralSettingsController::class, 'getReportFilter_options']);
    // Route::post('settings/program-details', [GeneralSettingsController::class, 'getProgramDetails']);
    // Route::post('settings/program-options', [GeneralSettingsController::class, 'getProgramOptions']);
    // Route::post('settings/occupations', [GeneralSettingsController::class, 'getOccupations']);
  
    Route::post('location/cities', [LocationController::class, 'getCityList']);
    Route::post('location/districts', [LocationController::class, 'getDistrictList']);
    Route::post('location/communes', [LocationController::class, 'getCommuneList']);
     
    // Route::group(['middleware' => 'cors'], function(){
         
       

    // });

//end::API routes for external calls
