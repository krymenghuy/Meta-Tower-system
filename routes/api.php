<?php

use App\Http\Controllers\ProgramController;
use Illuminate\Http\Request;
//use App\Models\SMS;
//use App\Models\Notifier;

use Illuminate\Support\Facades\Route;
//use App\Http\Controllers\CompanyController;
use App\Http\Controllers\PersonController;

use App\Http\Controllers\Login\LoginController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\CompanyProfileController;

//use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\MailController;
use App\Http\Controllers\DashboardController;
//use App\Http\Controllers\MobileAppSettingsController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\GeneralSettingsController;
use App\Http\Controllers\SystemSettingController;
use App\Http\Controllers\WebReportController;
//use App\Http\Controllers\NotificationController;

use App\Http\Controllers\ConsultationController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\QTicketController;
use App\Http\Controllers\MedicalServiceController;
use App\Http\Controllers\ServicePlanController;
use App\Http\Controllers\ServiceTrackController;

//use App\Http\Controllers\Inventory\MIStockController;
//use App\Http\Controllers\Inventory\ItemGroupController;
//use App\Http\Controllers\Inventory\ItemController;

//use App\Http\Controllers\Inventory\InventorySettingsController;

use App\Http\Controllers\Invoice\MedicalInvoiceController;
use App\Http\Controllers\Invoice\InvoiceController;
use App\Http\Controllers\Bill\VendorController;

use App\Http\Controllers\CurrencyController;
use App\Http\Controllers\ExchangeRateController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PatientHistoryController;

use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\PartnerController;
//use App\Models\PublicStorage;
//use App\Models\SystemSetting;
// use App\Models\Patient;
// use App\Models\Inventory\Brand;

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


    Route::prefix('program')->group(function(){
        Route::post('/save',[ProgramController::class,'save']);
        Route::post('/details',[ProgramController::class,'getDetails']);
        Route::post('/list',[ProgramController::class,'getList']);
        Route::post('/delete',[ProgramController::class,'delete']);
    });













    //begin:: AppointmentController

    Route::post('test', [AppointmentController::class, 'getTest']);

    Route::post('appointment/list', [AppointmentController::class, 'getAppointmentList']);
    Route::post('appointment/save', [AppointmentController::class, 'saveAppointment']);
    Route::post('appointment/delete', [AppointmentController::class, 'deleteAppointment']);
    Route::post('appointment/details', [AppointmentController::class, 'getAppointmentDetails']);
    Route::post('appointment/add-chief-complaint', [AppointmentController::class, 'addChiefComplaint']);
    Route::post('appointment/remove-chief-complaint', [AppointmentController::class, 'removeChiefComplaint']);
    Route::post('appointment/find-client', [AppointmentController::class, 'findClient']);
    Route::post('ticket/find-client', [AppointmentController::class, 'findClient']);
    //end::AppointmentController

    //begin::consult-history
     Route::post('consult/history/medical-history', [ConsultationController::class, 'getHistory_medicalHistory']);
     Route::post('consult/history/prescription', [ConsultationController::class, 'getHistory_presciption']);
     Route::post('consult/history/labo-tests', [ConsultationController::class, 'getHistory_labo_tests']);
     Route::post('consult/history/services', [ConsultationController::class, 'getHistory_services']);
     Route::post('consult/history/pe', [ConsultationController::class, 'getHistory_pe']);
     Route::post('consult/history/diagnosis', [ConsultationController::class, 'getHistory_diagnosis']);
     Route::post('consult/history/advice', [ConsultationController::class, 'getHistory_advice']);
     Route::post('consult/history/followup', [ConsultationController::class, 'getHistory_followup']);
    //end::consult-history

    //begin::ConsultationController
    Route::post('consultation/save', [ConsultationController::class, 'saveConsultationData']);
    Route::post('consultation/delete', [ConsultationController::class, 'deleteConsultationData']);
    Route::post('consultation/details', [ConsultationController::class, 'getConsultationData']);
    Route::post('consultation/chief-complaints', [ConsultationController::class, 'getChiefComplaints']);
    //NOTE: getLaboTestData() returns object = {laboTests=> [{id,name,description,labo_id},...], labo_test_options=>[{value,text},...], labo_options=>[{value,text},...]}
    Route::post('consultation/labo-test-data', [ConsultationController::class, 'getLaboTestData']);

    Route::post('consultation/medical-history', [ConsultationController::class, 'getMedicalHistory']);
    Route::post('consultation/save-chief-complaint', [ConsultationController::class, 'saveChiefComplaint']);
    Route::post('consultation/vital-signs', [ConsultationController::class, 'getPatientVitalSigns']);
    Route::post('consultation/remove-chief-complaint', [ConsultationController::class, 'deleteChiefComplaint']);
    Route::post('consultation/save-medical-history', [ConsultationController::class, 'saveMedicalHistory']);
    Route::post('consultation/save-vital-signs', [ConsultationController::class, 'saveVitalSigns']);
    Route::post('consultation/save-vital-sign-one', [ConsultationController::class, 'saveVitalSignOne']);
    Route::post('consultation/save-pe', [ConsultationController::class, 'savePE']);
    Route::post('consultation/pe', [ConsultationController::class, 'getPE']);
    Route::post('consultation/save-diagnosis', [ConsultationController::class, 'saveDiagnosis']);
    Route::post('consultation/diagnosis', [ConsultationController::class, 'getDiagnosis']);
    Route::post('consultation/followups', [ConsultationController::class, 'getFollowups']);
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
    Route::post('ticket/form-options', [QTicketController::class, 'ticket_form_options']);
    Route::post('ticket/create', [QTicketController::class, 'createTicket']);
    Route::post('ticket/list', [QTicketController::class, 'getTicketList']);
    Route::post('ticket/delete', [QTicketController::class, 'deleteTicket']);
    Route::post('ticket/details', [QTicketController::class, 'getTicketDetails']);
    Route::post('ticket/add-chief-complaint', [QTicketController::class, 'addChiefComplaint']);
    Route::post('ticket/remove-chief-complaint', [QTicketController::class, 'deleteChiefComplaint']);
    //Route::post('ticket/patient-vital-signs', [QTicketController::class, 'getPatientVitalSigns']);
    Route::post('ticket/patient-vital-signs', [ConsultationController::class, 'getPatientVitalSigns']);
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
    Route::post('service/list-paginate', [MedicalServiceController::class, 'getMedicalServices_paginate']);
    Route::post('service/list', [MedicalServiceController::class, 'getMedicalServices']);
    Route::post('service/delete', [MedicalServiceController::class, 'deleteMedicalService']);
    Route::post('service/save', [MedicalServiceController::class, 'saveMedicalService']);
    Route::post('service/info', [MedicalServiceController::class, 'getMedicalServiceInfo']);
    //End::MedicalServiceController

    //begin::ServicePlanController
    Route::post('service-plan/form-options', [ServicePlanController::class, 'getFormOptions']);
    Route::post('service-plan/details', [ServicePlanController::class, 'getServicePlanDetails']);
    Route::post('service-plan/list', [ServicePlanController::class, 'getServicePlans']);
    Route::post('service-plan/list-paginate', [ServicePlanController::class, 'getServicePlans_paginate']);
    Route::post('service-plan/delete', [ServicePlanController::class, 'deleteServicePlan']);
    Route::post('service-plan/save', [ServicePlanController::class, 'saveServicePlan']);
    Route::post('service-plan/info', [ServicePlanController::class, 'getServicePlanDetails']);
    Route::post('service-plan/subscriber/list', [ServicePlanController::class, 'getSubscribers']);
    Route::post('service-plan/subscriber/count', [ServicePlanController::class, 'getSubscriberCount']);
    Route::post('service-plan/subscriber/add', [ServicePlanController::class, 'addSubscriber']);
    Route::post('service-plan/subscriber/remove', [ServicePlanController::class, 'removeSubscriber']);
    //End::ServicePlanController

    //begin::ServiceTrackController

       Route::post('serive-track/form-options', [ServiceTrackController::class, 'getFormOptions']);
       Route::post('service-track/details', [ServiceTrackController::class, 'getTrackDetails']);
       Route::post('service-track/list', [ServiceTrackController::class, 'getServiceTracks']);
       Route::post('service-track/delete', [ServiceTrackController::class, 'deleteTrack']);
       Route::post('service-track/save', [ServiceTrackController::class, 'saveTrack']);
       Route::post('service-track/info', [ServiceTrackController::class, 'getTrackDetails']);
    //End::ServiceTrackController

    // //begin::MIStockController
    // //stock/groups
    // Route::post('inventory/stock/group-list', [MIStockController::class, 'getGroupList']);
    // Route::post('inventory/stock/group-items', [MIStockController::class, 'getItemsByGroup']);
    // Route::post('inventory/stock/classes', [MIStockController::class, 'getStockClasses']);
    // Route::post('inventory/stock/receive-items', [MIStockController::class, 'receiveVPO']);
    // Route::post('inventory/stock/receive-vpo', [MIStockController::class, 'receiveVPO']);
    // Route::post('inventory/stock/adjust', [MIStockController::class, 'adjustGroupQty']);
    // Route::post('inventory/stock/receive-returns', [MIStockController::class, 'receiveReturns']);
    // Route::post('inventory/stock/return-to-vendor', [MIStockController::class, 'returnToVendor']);

    // Route::post('inventory/stock/transfer', [MIStockController::class, 'transfer']);
    // //Transfer stock items Qty from one class to another class
    // Route::post('inventory/stock/transfer-class', [MIStockController::class, 'transferClass']);

    // //update selling prices, and cost
    // Route::post('inventory/item/update-prices', [MIStockController::class, 'updateItemPrices']);
    // //update item's sku and do the sku conversion for item avaliable in stock
    // Route::post('inventory/item/change-sku', [MIStockController::class, 'updateItemSKU']);
    // //Update item's name, code, category
    // Route::post('inventory/item/update-info', [MIStockController::class, 'updateItemInfo']);
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

    // //begin::ItemGroupController
    // Route::post('inventory/group/details', [ItemGroupController::class, 'getItemGroupDetails']);
    // Route::post('inventory/group/info', [ItemGroupController::class, 'getGroupInfo']);
    // //Route::post('inventory/group/info', [ItemGroupController::class, 'getGroupInfo']);
    // Route::post('inventory/group/list', [ItemGroupController::class, 'getItemGroups']);
    // Route::post('inventory/group/list-paginate', [ItemGroupController::class, 'getItemGroups_paginate']);
    // //Route::post('inventory/group-list', [ItemGroupController::class, 'getItemGroups']);
    // Route::post('inventory/group/delete', [ItemGroupController::class, 'deleteItemGroup']);
    // Route::post('inventory/group/save', [ItemGroupController::class, 'saveItemGroup']);
    // Route::post('inventory/group/rename', [ItemGroupController::class, 'renameGroup']);
    // Route::post('inventory/group/form-options', [ItemGroupController::class, 'getFormOptions']);
    // Route::post('group/form-options', [ItemGroupController::class, 'getFormOptions']);

    // Route::post('inventory/group-details', [ItemGroupController::class, 'getItemGroupDetails']);
    // Route::post('inventory/group-info', [ItemGroupController::class, 'getGroupInfo']);
    // Route::post('inventory/group/info', [ItemGroupController::class, 'getGroupInfo']);
    // Route::post('inventory/groups', [ItemGroupController::class, 'getItemGroups']);
    // Route::post('inventory/group-list', [ItemGroupController::class, 'getItemGroups']);
    // Route::post('inventory/delete-group', [ItemGroupController::class, 'deleteItemGroup']);
    // Route::post('inventory/save-group', [ItemGroupController::class, 'saveItemGroup']);
    // //    Route::post('group/form-options', [ItemGroupController::class, 'getFormOptions']);
    // //End::ItemGroupController

    //begin::VendorController
    Route::post('vendor/save', [VendorController::class, 'saveVendor']);
    Route::post('vendor/delete', [VendorController::class, 'deleteVendor']);
    Route::post('vendor/details', [VendorController::class, 'getVendorDetails']);
    Route::post('vendor/list', [VendorController::class, 'getVendorList']);
    Route::post('bill/settings/options-vendor-type', [VendorController::class, 'getComboItems_vendor_type']);
    Route::post('bill/settings/save-vendor-type', [VendorController::class, 'saveVendorType']);
    Route::post('bill/settings/delete-vendor-type', [VendorController::class, 'deleteVendorType']);
    //end::VendorController

    //begin::MedicalInvoiceController
    Route::post('medical-invoice/create', [MedicalInvoiceController::class, 'createInvoice']);
    Route::post('medical-invoice/update', [MedicalInvoiceController::class, 'updateMedicalInvoice']);
    //end::MedicalInvoiceController

    //begin::InvoiceController
    Route::post('invoice/payment-form-options', [InvoiceController::class, 'getPaymentFormOptions']);
    Route::post('invoice/form-options', [InvoiceController::class, 'invoice_form_options']);
    Route::post('invoice/customer-info', [InvoiceController::class, 'getCustomerInfo']);
    Route::post('invoice/create', [InvoiceController::class, 'createInvoice']);
    Route::post('invoice/update', [InvoiceController::class, 'updateInvoice']);
    Route::post('invoice/delete', [InvoiceController::class, 'deleteInvoice']);
    Route::post('invoice/details', [InvoiceController::class, 'getInvoiceDetails']);
    Route::post('invoice/basic-info', [InvoiceController::class, 'getBasicInfo']);
    Route::post('invoice/list', [InvoiceController::class, 'getInvoiceList']);
    Route::post('invoice/list-paginate', [InvoiceController::class, 'getInvoiceList_paginate']);
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

    //begin::EmployeeController
    Route::post('employee/details', [EmployeeController::class, 'getEmployeeDetails']);
    Route::post('employee/list', [EmployeeController::class, 'getEmployeeList']);
    Route::post('employee/delete', [EmployeeController::class, 'deleteEmployee']);
    Route::post('employee/save', [EmployeeController::class, 'saveEmployee']);
    Route::post('employee/form-options', [EmployeeController::class, 'getEmployeeFormOptions']);
    Route::post('employee/options-nationality', [EmployeeController::class, 'getCombItems_nationality']);
    Route::post('employee/options-department', [EmployeeController::class, 'getCombItems_department']);
    Route::post('employee/options-position', [EmployeeController::class, 'getCombItems_position']);
    //End::EmployeeController

    Route::post('Bill/settings/save-vendor-type', [VendorController::class, 'saveVendorType']);
    Route::post('Bill/settings/delete-vendor-type', [VendorController::class, 'saveVendorType']);

    // //begin::InventorySettingsController =>  Inventory Settings.
    // Route::post('inventory/settings/options-group', [InventorySettingsController::class, 'getComboItems_group']);
    // Route::post('inventory/settings/item-form-options', [InventorySettingsController::class, 'getItemFormOptions']);
    // Route::post('inventory/settings/stock-tracking-options', [InventorySettingsController::class, 'getStockTrackingFormOptions']);
    // Route::post('inventory/settings/vpo-form-options', [InventorySettingsController::class, 'getReceiveVPOOptions']);
    // Route::post('inventory/settings/options-detail-type', [InventorySettingsController::class, 'getComboItems_detailtype']);
    // Route::post('inventory/settings/options-category', [InventorySettingsController::class, 'getComboItems_category']);
    // Route::post('inventory/settings/options-unit', [InventorySettingsController::class, 'getComboItems_unit']);
    // Route::post('inventory/settings/options-sku', [InventorySettingsController::class, 'getComboItems_unit']);
    // Route::post('inventory/settings/options-manufacturer', [InventorySettingsController::class, 'getComboItems_manufacturer']);
    // Route::post('inventory/settings/save-unit', [InventorySettingsController::class, 'saveUnit']);
    // Route::post('inventory/settings/save-sku', [InventorySettingsController::class, 'saveUnit']);
    // Route::post('inventory/settings/save-manufacturer', [InventorySettingsController::class, 'saveManufacturer']);
    // Route::post('inventory/settings/save-brand', [InventorySettingsController::class, 'saveBrand']);
    // Route::post('inventory/settings/options-stock-class', [InventorySettingsController::class, 'getComboItems_stockclass']);
    // Route::post('inventory/settings/receive-stock-options', [InventorySettingsController::class, 'getReceiveStockFormOptions']);
    // Route::post('inventory/settings/options-warehouse', [InventorySettingsController::class, 'getComboItems_warehouse']);

    // Route::post('inventory/settings/unit/delete', [InventorySettingsController::class, 'deleteUnit']);
    // Route::post('inventory/settings/unit/list', [InventorySettingsController::class, 'getUnitList']);
    // Route::post('inventory/settings/unit/save', [InventorySettingsController::class, 'saveUnit']);
    // //Route::post('inventory/settings/delete-sku', [InventorySettingsController::class, 'deleteUnit']);

    // Route::post('inventory/settings/manufacturer/delete', [InventorySettingsController::class, 'deleteManufacturer']);
    // Route::post('inventory/settings/manufacturer/list', [InventorySettingsController::class, 'getManufacturerList']);
    // Route::post('inventory/settings/manufacturer/save', [InventorySettingsController::class, 'saveManufacturer']);

    // // Route::post('inventory/settings/brand/delete', [InventorySettingsController::class, 'deleteBrand']);
    // // Route::post('inventory/settings/brand/list', [InventorySettingsController::class, 'getBrandList']);
    // // Route::post('inventory/settings/brand/save', [InventorySettingsController::class, 'saveBrand']);

    // // *** inventory/group/save
    // Route::post('inventory/settings/brand/save', function (Request $req) {
    //     $res = Brand::createOrUpdate($req);
    //     return response()->json($res);
    // });

    // Route::post('inventory/settings/brand/delete', function (Request $req) {
    //     $res = Brand::deletePermanently($req);
    //     return response()->json($res);
    // });
    // Route::post('inventory/settings/brand/list', function (Request $req) {
    //     $res = Brand::list($req);
    //     return response()->json($res);
    // });
    // //end::InventorySettingsController =>  Inventory Settings.

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
    Route::prefix('currency')->group(function () {
        Route::post('details', [CurrencyController::class, 'getCurrencyDetails']);
        Route::post('save', [CurrencyController::class, 'saveCurrency']);
        Route::post('delete', [CurrencyController::class, 'deleteCurrency']);
        Route::post('list', [CurrencyController::class, 'getCurrencies']);
        Route::post('history', [CurrencyController::class, 'getExchangeRateInfo']);
    });
    //end::Currency APIs

    //begin::Exchange Rate APIs
    Route::prefix('x-rate')->group(function () {
        Route::post('options-month', [ExchangeRateController::class, 'getComboItems_x_month']);
        Route::post('create-currency-pair', [ExchangeRateController::class, 'createCurrencyPair']);
        Route::post('delete-currency-pair', [ExchangeRateController::class, 'deleteCurrencyPair']);
        Route::post('currency-pair-list', [ExchangeRateController::class, 'getCurrencyPairs']);
        Route::post('currency-pairs', [ExchangeRateController::class, 'getCurrencyPairs']);
        Route::post('info', [ExchangeRateController::class, 'getExchangeRateInfo']);
        Route::post('delete', [ExchangeRateController::class, 'deleteExchangeRate']);
        Route::post('list', [ExchangeRateController::class, 'getExchangeRates']);
        Route::post('save', [CurrencyController::class, 'saveExchangeRate']);
        Route::post('apply', [ExchangeRateController::class, 'applyExchangeRate']);
        Route::post('apply-rate', [ExchangeRateController::class, 'applyExchangeRate']);
    });
    //begin::Exchange Rate APIs

    //begin::PatientController. Not using Controller
    Route::post('patient/subscribed-plans', [PatientController::class, 'getSubscribedServicePlans']);
    Route::post('patient/quick-info', [PatientController::class, 'getPatientQuickInfo']);
    Route::post('patient/history', [PatientController::class, 'getPatientHistory']);
    Route::post('patient/details', [PatientController::class, 'getPatientDetails']);
    Route::post('patient/info', [PatientController::class, 'getPatientDetails']);
    Route::post('patient/quick-summary', [PatientController::class, 'getQuickSummary']);

    Route::post('patient/history/medical-history', [PatientHistoryController::class, 'getMedicalHistory']);
    Route::post('patient/history/pe', [PatientHistoryController::class, 'getHistoricalPE']);
    Route::post('patient/history/labo-tests', [PatientHistoryController::class, 'getHistoricalLaboTests']);
    Route::post('patient/history/medication', [PatientHistoryController::class, 'getHistoricalMedication']);
    Route::post('patient/history/diagnosis', [PatientHistoryController::class, 'getHistoricalDiagnosis']);
    Route::post('patient/history/services', [PatientHistoryController::class, 'getHistoricalServices']);
    Route::post('patient/history/followups', [PatientHistoryController::class, 'getHistoricalFollowups']);
    Route::post('patient/history/advice', [PatientHistoryController::class, 'getHistoricalAdvice']);

    //saveProfilePhoto() for patient or client
    Route::post('patient/save-profile-picture', [PatientController::class, 'saveProfilePicture']);

    Route::post('patient/find', [PatientController::class, 'findPatients']);
    Route::post('patient/list', [PatientController::class, 'getPatientList']);
    Route::post('patient/list-paginate', [PatientController::class, 'getPatientList_paginate']);
    Route::post('patient/delete', [PatientController::class, 'deletePatient']);
    Route::post('patient/register', [PatientController::class, 'registerPatient']);
    Route::post('patient/photos', [PatientController::class, 'getPatientPhotos']);
    Route::post('patient/tickets', [PatientController::class, 'getPatientTickets']);
    Route::post('patient/medication-details', [PatientController::class, 'getMedicationDetails']);

    Route::post('patient/invoices', [PatientController::class, 'getPatientInvoices']);
    Route::post('patient/payments', [PatientController::class, 'getPatientPayments']);

    // Route::post('patient/register',function(Request $req){
    //     $res = Patient::register($req);
    //     return response()->json($res);
    // });

    // Route::post('patient/list', function(Request $req){
    //     return response()->json(Patient::list($req));
    // });

    // Route::post('patient/delete',function(Request $req){
    //     $res = Patient::delete($req);
    //     return response()->json($res);
    // });

    // Route::post('patient/history',function(Request $req){
    //     $res = Patient::history($req);
    //     return response()->json($res);
    // });

    // Route::post('patient/photos',function(Request $req){
    //     $res = Patient::photos($req);
    //     return response()->json($res);
    // });

    // Route::post('patient/invoices',function(Request $req){
    //     $res = Patient::invoices($req);
    //     return response()->json($res);
    // });

    // Route::post('patient/transactions',function(Request $req){
    //     $res = Patient::transactions($req);
    //     return response()->json($res);
    // });

    //end::PatientController


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
Route::post('test/test-api', function () {
    $data = "This is result of api";
    return response()->json($data);
});

//begin::SystemSettingController
Route::post('getComboItems_price_list', [SystemSettingController::class, 'getComboItems_price_list']);

//end::SystemSettingController

//begin::CompanyProfileController
    Route::post('company/save-logo', [CompanyProfileController::class, 'saveCompanyLogo']);
    Route::post('company/logo', [CompanyProfileController::class, 'getCompanyLogo']);
    Route::post('company/delete-logo', [CompanyProfileController::class, 'deleteCompanyLogo']);
    Route::post('company/save-profile', [CompanyProfileController::class, 'saveCompanyInfo']);
    Route::post('company/profile', [CompanyProfileController::class, 'getCompanyInfo']);
    Route::post('company/info', [CompanyProfileController::class, 'getCompanyInfo']);
    // Route::post('getBrandImages_driver', [CompanyProfileController::class, 'getBrandImages_driver']);
    // Route::post('getBrandImages_sender', [CompanyProfileController::class, 'getBrandImages_sender']);
//end::CompanyProfileController


// //begin::MobileAppSettingsController
// Route::post('getMobileBrandImages', [MobileAppSettingsController::class, 'getMobileBrandImages']);
// Route::post('saveBrandImage', [MobileAppSettingsController::class, 'saveBrandImage']);
// Route::post('deleteBrandImage', [MobileAppSettingsController::class, 'deleteBrandImage']);
// //end::MobileAppSettingsController


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
// Route::post('settings/lang', [UMController::class, 'getLang']);
// Route::post('settings/save-lang', [UMController::class, 'saveLang']);
Route::post('settings/departments', [GeneralSettingsController::class, 'getDepartmentList']);
Route::post('settings/save-department', [GeneralSettingsController::class, 'saveDepartment']);
Route::post('settings/delete-department', [GeneralSettingsController::class, 'deleteDepartment']);
Route::post('settings/department-info', [GeneralSettingsController::class, 'getDepartmentDetails']);

Route::post('settings/options-pmt-method', [GeneralSettingsController::class, 'getComboItems_pmt_method']);
Route::post('settings/save-position', [GeneralSettingsController::class, 'savePosition']);
Route::post('settings/options-department', [GeneralSettingsController::class, 'getComboItems_department']);
Route::post('settings/options-position', [GeneralSettingsController::class, 'getComboItems_position']);
Route::post('settings/options-nationality', [GeneralSettingsController::class, 'getComboItems_nationality']);
Route::post('settings/create-org', [GeneralSettingsController::class, 'createOrganization']);
Route::post('settings/delete-org', [GeneralSettingsController::class, 'deleteOrganization']);
Route::post('settings/create-industry', [GeneralSettingsController::class, 'createIndustry']);
Route::post('settings/delete-industry', [GeneralSettingsController::class, 'deleteIndustry']);
Route::post('settings/collateral-types', [GeneralSettingsController::class, 'getCollateralTypes']);

Route::post('settings/options-contact-channel', [GeneralSettingsController::class, 'getComboItems_channel']);
Route::post('settings/options-appt-status', [GeneralSettingsController::class, 'getComboItems_appt_status']);
Route::post('settings/options-ticket-status', [GeneralSettingsController::class, 'getComboItems_ticket_status']);
Route::post('settings/patient-reg-options', [GeneralSettingsController::class, 'getPatientRegisterOptions']);

Route::post('settings/options-consultant', [GeneralSettingsController::class, 'getComboItems_consultant']);
Route::post('settings/options-chief-complaint', [GeneralSettingsController::class, 'getComboItems_chief_complaint']);
Route::post('settings/save-chief-complaint', [GeneralSettingsController::class, 'saveChiefComplaint']);
Route::post('settings/options-labo-test', [GeneralSettingsController::class, 'getComboItems_laboTest']);
Route::post('settings/options-sales-agent', [GeneralSettingsController::class, 'getComboItems_sales_agent']);

Route::post('settings/options-service', [GeneralSettingsController::class, 'getComboItems_service']);

//getProductData() return object {"products"=> [], "usages"=>[]} for doctor's editing prescription
Route::post('settings/options-product', [GeneralSettingsController::class, 'getProductData']);

/** return various options regarding Employment data. such as organiations, industries, etc **/
Route::post('settings/emp-options', [GeneralSettingsController::class, 'getComboItems_emp_options']);
Route::post('settings/report-filter-options', [GeneralSettingsController::class, 'getReportFilter_options']);
// Route::post('settings/program-details', [GeneralSettingsController::class, 'getProgramDetails']);
// Route::post('settings/program-options', [GeneralSettingsController::class, 'getProgramOptions']);
// Route::post('settings/occupations', [GeneralSettingsController::class, 'getOccupations']);

//end::API routes for external calls
