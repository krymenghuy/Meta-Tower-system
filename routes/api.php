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
use App\Http\Controllers\Login\LoginController;
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

use App\Http\Controllers\ConsultationController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\QTicketController;
use App\Http\Controllers\MedicalServiceController;

use App\Http\Controllers\Inventory\CategoryController; 
use App\Http\Controllers\Inventory\MIStockController; 
use App\Http\Controllers\Inventory\ItemGroupController; 
use App\Http\Controllers\Inventory\ItemController; 
use App\Http\Controllers\Inventory\FGStockController; 
use App\Http\Controllers\Inventory\RMStockController;  
use App\Http\Controllers\Inventory\InventorySettingsController;

use App\Http\Controllers\Invoice\InvoiceController;
use App\Http\Controllers\Invoice\CustomerController;

use App\Http\Controllers\CurrencyController;
use App\Http\Controllers\ExchangeRateController;

use App\Http\Controllers\EmployeeController;  
use App\Http\Controllers\PartnerController;
//use App\Models\PublicStorage;
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
Route::post('auth/auth-data', [UMController::class, 'getAuthData']);
Route::post('auth/login', [LoginController::class, 'apiLogin']);

// Route::get('env/20230120AZ99/vars',function(){
//     $vars =[
//        "pusher_app_key"=>Illuminate\Support\Facades\Config::get('app.pusher_app_key'),
//        "cookie_name"=>Illuminate\Support\Facades\Config::get('app.cookie_name'),
//     ];
//     return response()->json($vars);   
// }); //->middleware('auth');

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
        
    //begin::ConsultationController 
        Route::post('consultation/save', [ConsultationController::class, 'saveConsultationData']);
        Route::post('consultation/delete', [ConsultationController::class, 'deleteConsultationData']);
        Route::post('consultation/details', [ConsultationController::class, 'getConsultationData']);
        Route::post('consultation/chief-complaints', [ConsultationController::class, 'getChiefComplaints']);
        //NOTE: getLaboTestData() returns object = {laboTests=> [{id,name,description,labo_id},...], labo_test_options=>[{value,text},...], labo_options=>[{value,text},...]}
        Route::post('consultation/labo-test-data', [ConsultationController::class, 'getLaboTestData']);

        Route::post('consultation/medical-history', [ConsultationController::class, 'getMedicalHistory']);
        Route::post('consultation/save-chief-complaint', [ConsultationController::class, 'saveChiefComplaint']);
        Route::post('consultation/remove-chief-complaint', [ConsultationController::class, 'deleteChiefComplaint']);
        Route::post('consultation/save-medical-history', [ConsultationController::class, 'saveMedicalHistory']);
        Route::post('consultation/save-vital-signs', [ConsultationController::class, 'saveVitalSigns']);
        Route::post('consultation/save-pe', [ConsultationController::class, 'savePE']);
        Route::post('consultation/pe', [ConsultationController::class, 'getPE']);
        Route::post('consultation/save-diagnosis', [ConsultationController::class, 'saveDiagnosis']);
        Route::post('consultation/diagnosis', [ConsultationController::class, 'getDiagnosis']);
        Route::post('consultation/prescription', [ConsultationController::class, 'getPrescription']);
        Route::post('consultation/save-prescription-item', [ConsultationController::class, 'savePrescriptionItem']);
        Route::post('consultation/remove-prescription-item', [ConsultationController::class, 'removePrescriptionItem']);
        
        Route::post('consultation/labo-tests', [ConsultationController::class, 'getLaboTests']);
        Route::post('consultation/save-labo-test', [ConsultationController::class, 'saveLaboTest']);
        Route::post('consultation/remove-labo-test', [ConsultationController::class, 'removeLaboTest']);

        Route::post('consultation/services', [ConsultationController::class, 'getServiceDetails']);
        Route::post('consultation/save-service-item', [ConsultationController::class, 'saveServiceItem']);
        Route::post('consultation/remove-service-item', [ConsultationController::class, 'removeServiceItem']);
        Route::post('consultation/advice', [ConsultationController::class, 'getAdvice']);
        Route::post('consultation/save-advice', [ConsultationController::class, 'saveAdvice']);
        Route::post('labo-test/info', [ConsultationController::class, 'getLaboTestInfo']);
        

    //end::ConsultationController

    //begin::QTicketController
        Route::post('ticket/create', [QTicketController::class, 'createTicket']);
        Route::post('ticket/list', [QTicketController::class, 'getTicketList']);
        Route::post('ticket/delete', [QTicketController::class, 'deleteTicket']);
        Route::post('ticket/details', [QTicketController::class, 'getTicketDetails']);
        Route::post('ticket/add-chief-complaint', [QTicketController::class, 'addChiefComplaint']);
        Route::post('ticket/remove-chief-complaint', [QTicketController::class, 'deleteChiefComplaint']);
        Route::post('ticket/patient-vital-signs', [QTicketController::class, 'getPatientVitalSigns']);
        Route::post('ticket/chief-complaints', [QTicketController::class, 'getChiefComplaints']);

        //getPatientPhysicalExamination()
        Route::post('ticket/patient-pe', [QTicketController::class, 'getPatientPE']);
        Route::post('ticket/labo-tests', [QTicketController::class, 'getPatientLaboTests']);
        Route::post('ticket/diagnosis', [QTicketController::class, 'getPatientDiagnosis']);
        //Route::post('ticket/history', [QTicketController::class, 'getPatientDiagnosis']);

        Route::post('ticket/patient-labo-tests', [QTicketController::class, 'getPatientLaboTests']);
        Route::post('ticket/patient-diagnosis', [QTicketController::class, 'getPatientDiagnosis']);
        Route::post('ticket/patient-prescription', [QTicketController::class, 'getPatientPrescription']);
        Route::post('ticket/doctor-advice', [QTicketController::class, 'getDoctorAdvice']);

        Route::post('ticket/save-patient-photo', [QTicketController::class, 'savePatientPhoto']);
        Route::post('ticket/patient-photos', [QTicketController::class, 'getPatientPhotos']);
        Route::post('ticket/delete-patient-photo', [QTicketController::class, 'deletePatientPhoto']);
    //End::QTicketController
    
  //begin::MedicalServiceController
    Route::post('service/details', [MedicalServiceController::class, 'getMedicalServiceDetails']);
     Route::post('service/items', [MedicalServiceController::class, 'getMedicalServices']);
     Route::post('service/delete', [MedicalServiceController::class, 'deleteMedicalService']);
     Route::post('service/save', [MedicalServiceController::class, 'saveMedicalService']);
     Route::post('service/info', [MedicalServiceController::class, 'getMedicalServiceInfo']);
  //End::MedicalServiceController
 
   //begin::ItemController
   Route::post('inventory/item-info', [ItemController::class, 'getItemInfo']);
   Route::post('inventory/item/info', [ItemController::class, 'getItemInfo']);
   Route::post('inventory/item-details', [ItemController::class, 'getItemDetails']);
   Route::post('inventory/items', [ItemController::class, 'getItemList']);
   Route::post('inventory/delete-item', [ItemController::class, 'deleteItem']);
   Route::post('inventory/save-item', [ItemController::class, 'saveItem']);
//End::ItemController

//begin::MIStockController
   //stock/groups  
   Route::post('inventory/stock/group-list', [MIStockController::class, 'getGroupList']);
   Route::post('inventory/stock/group-items', [MIStockController::class, 'getItemsByGroup']);
   Route::post('inventory/stock/classes', [MIStockController::class, 'getStockClasses']); 
   Route::post('inventory/stock/receive-items', [MIStockController::class, 'receiveVPO']);
   Route::post('inventory/stock/receive-vpo', [MIStockController::class, 'receiveVPO']);
   Route::post('inventory/stock/adjust', [MIStockController::class, 'adjustGroupQty']);
   Route::post('inventory/stock/receive-returns', [MIStockController::class, 'receiveReturns']); 
   Route::post('inventory/stock/return-to-vendor', [MIStockController::class, 'returnToVendor']);

   Route::post('inventory/stock/transfer', [MIStockController::class, 'transfer']);
   //Transfer stock items Qty from one class to another class
   Route::post('inventory/stock/transfer-class', [MIStockController::class, 'transferClass']); 
   
     //update selling prices, and cost
     Route::post('inventory/item/update-prices', [MIStockController::class, 'updateItemPrices']);
     //update item's sku and do the sku conversion for item avaliable in stock
     Route::post('inventory/item/change-sku', [MIStockController::class, 'updateItemSKU']);
     //Update item's name, code, category
     Route::post('inventory/item/update-info', [MIStockController::class, 'updateItemInfo']);
//End::MIStockController

//  //begin::FGStockController
//     //stock/groups  
//     Route::post('inventory/stock/group-list', [FGStockController::class, 'getGroupList']);
//     Route::post('inventory/stock/group-items', [FGStockController::class, 'getItemsByGroup']);
//     Route::post('inventory/stock/classes', [FGStockController::class, 'getStockClasses']); 

//     Route::post('inventory/stock/receive-items', [FGStockController::class, 'receiveItems']);
//     Route::post('inventory/stock/adjust', [FGStockController::class, 'getStockClasses']);
//     Route::post('inventory/stock/receive-returns', [FGStockController::class, 'receiveReturns']); 
//     Route::post('inventory/stock/return-to-vendor', [FGStockController::class, 'returnToVendor']);

//     Route::post('inventory/stock/transfer', [FGStockController::class, 'transfer']);
//     //Transfer stock items Qty from one class to another class
//     Route::post('inventory/stock/transfer-class', [FGStockController::class, 'transferClass']);  

// //End::FGStockController

//begin::ItemGroupController
   Route::post('inventory/group-details', [ItemGroupController::class, 'getItemGroupDetails']);
   Route::post('inventory/group-info', [ItemGroupController::class, 'getGroupInfo']);
   Route::post('inventory/group/info', [ItemGroupController::class, 'getGroupInfo']);
   Route::post('inventory/groups', [ItemGroupController::class, 'getItemGroups']);
   Route::post('inventory/group-list', [ItemGroupController::class, 'getItemGroups']);
   Route::post('inventory/delete-group', [ItemGroupController::class, 'deleteItemGroup']);
   Route::post('inventory/save-group', [ItemGroupController::class, 'saveItemGroup']);
   Route::post('group/form-options', [ItemGroupController::class, 'getFormOptions']);
//End::ItemGroupController

//begin::InvoiceController
  Route::post('invoice/create', [InvoiceController::class, 'createInvoice']);
  Route::post('invoice/update', [InvoiceController::class, 'updateInvoice']);
  Route::post('invoice/delete', [InvoiceController::class, 'deleteInvoice']);
  Route::post('invoice/details', [InvoiceController::class, 'getInvoiceDetails']);
  Route::post('invoice/basic-info', [InvoiceController::class, 'getBasicInfo']);
  Route::post('invoice/list', [InvoiceController::class, 'getInvoiceList']);
  Route::post('invoice-payment/receive', [InvoiceController::class, 'receivePayment']);
  Route::post('invoice/receive-payment', [InvoiceController::class, 'receivePayment']);
  Route::post('invoice/receive-payments', [InvoiceController::class, 'receivePayments']);
  Route::post('invoice/payments', [InvoiceController::class, 'getInvoicePayments']);
  Route::post('invoice/payments-with-summary', [InvoiceController::class, 'getInvoicePayments_with_summary']); 
  Route::post('invoice-payment/details', [InvoiceController::class, 'getInvoicePaymentDetails']);
  //getPaymentDetailsWithSummary() => payment details + invoice info
  Route::post('invoice-payment/details-with-summary', [InvoiceController::class, 'getInvoicePaymentWithSummary']);
  
  Route::post('invoice-payment/update', [InvoiceController::class, 'updatePayment']);
  Route::post('invoice-payment/delete', [InvoiceController::class, 'deletePayment']);
  
//end::InvoiceController

//begin::CategoryController
   Route::post('category/details', [CategoryController::class, 'getCategoryDetails']);
   Route::post('category/list', [CategoryController::class, 'getCategories']);
   Route::post('category/delete', [CategoryController::class, 'deleteCategory']);
   Route::post('category/save', [CategoryController::class, 'saveCategory']);
//End::CategoryController

//begin::EmployeeController
   Route::post('employee/details', [EmployeeController::class, 'getEmployeeDetails']);
   Route::post('employee/list', [EmployeeController::class, 'getEmployeeList']);
   Route::post('employee/delete', [EmployeeController::class, 'deleteEmployee']);
   Route::post('employee/save', [EmployeeController::class, 'saveEmployee']);
//End::EmployeeController

//begin::InventorySettingsController =>  Inventory Settings.
   Route::post('inventory/settings/invoice-form-options',[InventorySettingsController::class, 'invoice_form_options']);
   Route::post('inventory/settings/options-group',[InventorySettingsController::class, 'getComboItems_group']);
   Route::post('inventory/settings/item-form-options',[InventorySettingsController::class, 'getItemFormOptions']);
   Route::post('inventory/settings/stock-tracking-options', [InventorySettingsController::class, 'getStockTrackingFormOptions']);
   Route::post('inventory/settings/vpo-form-options',[InventorySettingsController::class, 'getReceiveVPOOptions']);
   Route::post('inventory/settings/options-detail-type',[InventorySettingsController::class, 'getComboItems_detailtype']);
   Route::post('inventory/settings/options-category',[InventorySettingsController::class, 'getComboItems_category']);
   Route::post('inventory/settings/options-unit',[InventorySettingsController::class, 'getComboItems_unit']);
   Route::post('inventory/settings/options-sku',[InventorySettingsController::class, 'getComboItems_unit']);
   Route::post('inventory/settings/options-manufacturer',[InventorySettingsController::class, 'getComboItems_manufacturer']);
   Route::post('inventory/settings/save-unit', [InventorySettingsController::class, 'saveUnit']);
   Route::post('inventory/settings/save-sku', [InventorySettingsController::class, 'saveUnit']);
   Route::post('inventory/settings/save-manufacturer', [InventorySettingsController::class, 'saveManufacturer']);
   Route::post('inventory/settings/save-brand', [InventorySettingsController::class, 'saveBrand']);
   Route::post('inventory/settings/options-stock-class', [InventorySettingsController::class, 'getComboItems_stockclass']);
   Route::post('inventory/settings/receive-stock-options', [InventorySettingsController::class, 'getReceiveStockFormOptions']);
   Route::post('inventory/settings/options-warehouse', [InventorySettingsController::class, 'getComboItems_warehouse']);

   Route::post('inventory/settings/unit/delete', [InventorySettingsController::class, 'deleteUnit']);
   Route::post('inventory/settings/unit/list', [InventorySettingsController::class, 'getUnitList']);
   Route::post('inventory/settings/unit/save', [InventorySettingsController::class, 'saveUnit']);
   //Route::post('inventory/settings/delete-sku', [InventorySettingsController::class, 'deleteUnit']);

   Route::post('inventory/settings/manufacturer/delete', [InventorySettingsController::class, 'deleteManufacturer']);
   Route::post('inventory/settings/manufacturer/list', [InventorySettingsController::class, 'getManufacturerList']);
   Route::post('inventory/settings/manufacturer/save', [InventorySettingsController::class, 'saveManufacturer']);

   // Route::post('inventory/settings/brand/delete', [InventorySettingsController::class, 'deleteBrand']);
   // Route::post('inventory/settings/brand/list', [InventorySettingsController::class, 'getBrandList']);
   // Route::post('inventory/settings/brand/save', [InventorySettingsController::class, 'saveBrand']);

    // *** inventory/group/save 
   Route::post('inventory/settings/brand/save',function(Request $req){
       $res = Brand::createOrUpdate($req);
       return response()->json($res);
   });

   Route::post('inventory/settings/brand/delete',function(Request $req){
       $res = Brand::deletePermanently($req);
       return response()->json($res);
   });
   Route::post('inventory/settings/brand/list',function(Request $req){
       $res = Brand::list($req);
       return response()->json($res);
   });
//end::InventorySettingsController =>  Inventory Settings.

  //begin::PartnerController
     Route::post('partner/list', [PartnerController::class, 'getPartnerList']);
     Route::post('partner/delete', [PartnerController::class, 'deletePartner']);
     Route::post('partner/save', [PartnerController::class, 'savePartner']);
     Route::post('partner/details', [PartnerController::class, 'getPartnerDetails']);
     Route::post('partner-labo/tests', [PartnerController::class, 'getLaboTestsByPartner']);
     Route::post('partner-labo/add-test', [PartnerController::class, 'addLaboTestByPartner']);
     Route::post('partner-labo/remove-test', [PartnerController::class, 'removeLaboTestByPartner']);
  //End::PartnerController
 
    //begin::Currency APIs
        Route::prefix('currency')->group(function(){
            Route::post('details', [CurrencyController::class,'getCurrencyDetails']);          
            Route::post('save', [CurrencyController::class,'saveCurrency']); 
            Route::post('delete', [CurrencyController::class,'deleteCurrency']);   
            Route::post('list', [CurrencyController::class,'getCurrencies']);
        });
    //end::Currency APIs

    //begin::Exchange Rate APIs
        Route::prefix('x-rate')->group(function(){   
            Route::post('options-month', [ExchangeRateController::class,'getComboItems_x_month']);
            Route::post('create-currency-pair', [ExchangeRateController::class,'createCurrencyPair']); 
            Route::post('delete-currency-pair', [ExchangeRateController::class,'deleteCurrencyPair']);
            Route::post('currency-pair-list', [ExchangeRateController::class,'getCurrencyPairs']);
            Route::post('currency-pairs', [ExchangeRateController::class,'getCurrencyPairs']);
            Route::post('info', [ExchangeRateController::class,'getExchangeRateInfo']);
            Route::post('delete', [ExchangeRateController::class,'deleteExchangeRate']);
            Route::post('list', [ExchangeRateController::class,'getExchangeRates']);
            Route::post('save', [ExchangeRateController::class,'saveExchangeRate']);
            Route::post('apply', [ExchangeRateController::class,'applyExchangeRate']);
            Route::post('apply-rate', [ExchangeRateController::class,'applyExchangeRate']);  
        });
    //begin::Exchange Rate APIs
 
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

//##um::controller
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
    Route::post('user/deactivate-me', [UMController::class, 'deactivateMySelf']);
    Route::post('getUserList', [UMController::class, 'getUserList']);
    Route::post('getUserExtendedDetails', [UMController::class, 'getUserExtendedDetails']);
    Route::post('saveUser', [UMController::class, 'saveUser']);
    Route::post('getUserInfo', [UMController::class, 'getUserInfo']);
    Route::post('getUserDetails', [UMController::class, 'getUserDetails']);
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
//##end::controller
 
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
    Route::post('settings/options-labo-test', [GeneralSettingsController::class, 'getComboItems_laboTest']);

   Route::post('settings/options-service', [GeneralSettingsController::class, 'getComboItems_service']);

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
//end::API routes for external calls