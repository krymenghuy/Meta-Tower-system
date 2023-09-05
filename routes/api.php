<?php

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\AudioController;
use App\Http\Controllers\CampusController;
use App\Http\Controllers\DepositeController;
use App\Http\Controllers\GuardianController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\Login\GuardianLoginController;
use App\Http\Controllers\MobileApi\AttendanceController;
use App\Http\Controllers\MobileApi\HomePageController;
use App\Http\Controllers\MobileApi\MobileApiController;
use App\Http\Controllers\MobileSetting\BannerController;
use App\Http\Controllers\MobileSetting\SocialMediaController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\ProgramLevelController;
use App\Http\Controllers\PromoteStudentController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\StudentAttendanceController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\StudentGroupController;
use App\Http\Controllers\TermController;
use App\Http\Controllers\PriceListController;
use App\Http\Controllers\PolicyDiscountController;
use App\Http\Controllers\OtherFeeController;


use App\Models\MobileApi\FrontBanner;
use Illuminate\Http\Request;
//use App\Models\SMS;
//use App\Models\Notifier;

use Illuminate\Support\Facades\Route;
//use App\Http\Controllers\CompanyController;
use App\Http\Controllers\PersonController;

use App\Http\Controllers\Login\LoginController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\CompanyProfileController;

use App\Http\Controllers\MailController;
use App\Http\Controllers\DashboardController;
//use App\Http\Controllers\MobileAppSettingsController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\GeneralSettingsController;
use App\Http\Controllers\SystemSettingController;
use App\Http\Controllers\WebReportController;
use App\Http\Controllers\ReportController;
//use App\Http\Controllers\NotificationController;

use App\Http\Controllers\Bill\VendorController;

use App\Http\Controllers\CurrencyController;
use App\Http\Controllers\ExchangeRateController;

use App\Http\Controllers\EmployeeController;
//use App\Models\GeneralSettings;

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
Route::post('/auth/guardian/login',[GuardianLoginController::class,'guardianLogin']);
Route::post('/auth/guardian/profile',[GuardianLoginController::class,'getGuardianProfile']);
Route::post('/auth/guardian/change-password',[GuardianLoginController::class, 'changePasswords']);
Route::post('/auth/guardian/change-profile',[GuardianLoginController::class, 'changeProfile']);

// Route::get('env/20230120AZ99/vars',function(){
//     $vars =[
//        "pusher_app_key"=>Illuminate\Support\Facades\Config::get('app.pusher_app_key'),
//        "cookie_name"=>Illuminate\Support\Facades\Config::get('app.cookie_name'),
//     ];
//     return response()->json($vars);
// }); //->middleware('auth');

// Rate Limiting for a whole group of routes= > allow 200 requests per 1 minute
Route::group(['middleware' => 'throttle:200,1'], function () {

    //mobile api

    Route::prefix('mobile')->group(function(){
        Route::post('/pickup-my-kids',[MobileApiController::class,'pickupMyKids']);
        Route::post('/home-page',[MobileApiController::class,'homePage']);
        Route::post('/student-attendance',[MobileApiController::class,'attendanceList']);
        Route::post('/payment-invoice',[MobileApiController::class,'getChildrenInvoices']);
        Route::post('/student-enrollments',[MobileApiController::class,'getStudentEnrollment']);
        Route::post('/social-media',[MobileApiController::class,'getSocialMediaList']);
    });

    //end mobile api

    //
    Route::post('audio',function(Request $req){
        $file = '';
        return $file;
    });
    //
     //
     Route::post('audio/save',[AudioController::class,'saveAudio']);
     Route::post('audio',[AudioController::class,'getAudio']);
    //

    //begin::ActivityController
    Route::prefix('activity')->group(function(){
        Route::post('/create-request-change',[ActivityController::class,'createRequestChange']);
        Route::post('/send-request-change',[ActivityController::class,'sendRequestChange']);
        Route::post('/request-change/list-paginate',[ActivityController::class,'requestChangeListPaginateList']);
        Route::post('/request-discount',[ActivityController::class,'requestDiscount']);
        Route::post('/create-request-discount',[ActivityController::class,'createRequestDiscount']);
        Route::post('/send-request-discount',[ActivityController::class,'sendRequestDiscount']);
        Route::post('/request-discount/list-paginate',[ActivityController::class,'requestDiscountListPaginate']);
        Route::post('/request-change/delete',[ActivityController::class,'deleteRequest']);
        Route::post('/request-discount/delete',[ActivityController::class,'deleteRequestDiscount']);
        Route::post('/preview-request-payment',[ActivityController::class,'previewRequestPaymentFee']);


    });
    // Route::post('/approve/general/list-paginate',[ActivityController::class,'approveGeneralListPaginateList']);

    Route::prefix('approval')->group(function(){
        Route::post('/discount-count',[ActivityController::class,'requestDiscountCount']);
        Route::post('/request-change-list',[ActivityController::class,'approvalActivityListPaginateList']);
        Route::post('/request-discount-list',[ActivityController::class,'approvalDiscountListPaginate']);
        Route::post('/approve-request-change',[ActivityController::class,'approveRequestChange']);
        Route::post('/approve-request-discount',[ActivityController::class,'approveRequestDiscount']);
        Route::post('/reject-request-change',[ActivityController::class,'rejectRequestChange']);
        Route::post('/reject-request-discount',[ActivityController::class,'rejectRequestDiscount']);
    });
    //end::ActivityController


    //begin::PromoteController
    Route::prefix('promote')->group(function(){
        Route::post('/students',[PromoteStudentController::class,'promoteStudents']);
        Route::post('/verify',[PromoteStudentController::class,'verifyPromotedStudent']);
        Route::post('/delete',[PromoteStudentController::class,'deleteNewPromoted']);
        Route::post('/student-list-paginate',[PromoteStudentController::class,'promoteListPaginate']);
        Route::post('/form-options',[PromoteStudentController::class,'getFormOptions']);

    });
    //end::PromoteController


    Route::post('/form-option',[SettingController::class,'select_options']);
    Route::post('option/prev-program',[SettingController::class,'prevPrograms']);
    Route::post('option/prev-program-level',[SettingController::class,'prevProgramLevels']);
    Route::post('/option/other-fee',[GeneralSettingsController::class,'otherFeeFormOptions']);
    Route::post('/option/other-fee-info',[GeneralSettingsController::class,'getFeeTypeInfo']);
    Route::post('/option/request-type',[GeneralSettingsController::class,'requestTypeOptions']);
    Route::post('/option/discount-type',[GeneralSettingsController::class,'requestDiscountOptions']);
    Route::post('/option/request-type-input',[GeneralSettingsController::class,'requestTypeTnput']);
    Route::post('/option/request-type-dialog',[GeneralSettingsController::class,'requestTypeDialog']);
    Route::post('/option/student-request-info',[GeneralSettingsController::class,'optionsStudentRequest']);
    Route::post('/option/student-enrollment',[GeneralSettingsController::class,'optionStudentEnrollments']);

    Route::prefix('settings')->group(function () {
        Route::post('/options-level', [GeneralSettingsController::class, 'getOptions_level']);
        Route::post('/options-program', [StudentController::class, 'getOptions_program']);
        Route::post('/options-academic-year', [StudentController::class, 'getOptions_academic_year']);
        //Route::post('/options-term', [StudentController::class, 'getOptions_term']);
        Route::post('/options-term', [GeneralSettingsController::class, 'getOptions_term']);
    });

    // Route::prefix('invoice')->group(function (){
    //     //** PriceListController */
    //     Route::post('/list',[PriceListController::class,'studentInvoice']);
    //     Route::post('/generate',[PriceListController::class,'generateInvoice']);
    //     //Route::post('/find',[PriceListController::class,'findStudent']);
    //     Route::post('/generate-details',[PriceListController::class,'generateInvoiceDetails']);
    //     Route::post('/pay',[PriceListController::class,'schoolFeePay']);
    //     Route::post('/delete',[PriceListController::class,'deleteInvoice']);
    //     Route::post('/set-active',[PriceListController::class,'turnInvoiceToActive']);
    //     Route::post('/update',[PriceListController::class,'updateInvoice']);
    //     Route::post('/items',[PriceListController::class,'getInvoiceItems']);
    // });

    Route::prefix('invoice')->group(function (){
        //** PriceListController */
        Route::post('/list',[InvoiceController::class,'studentInvoice']);
        Route::post('/generate',[InvoiceController::class,'generateInvoice']);
        //Route::post('/find',[InvoiceController::class,'findStudent']);
        Route::post('/generate-details',[InvoiceController::class,'generateInvoiceDetails']);
        Route::post('/pay',[InvoiceController::class,'schoolFeePay']);
        Route::post('/delete',[InvoiceController::class,'deleteInvoice']);
        Route::post('/set-active',[InvoiceController::class,'turnInvoiceToActive']);
        Route::post('/update',[InvoiceController::class,'updateInvoice']);
        Route::post('/items',[InvoiceController::class,'getInvoiceItems']);
    });

    //begin:: EnrollmentManager
    Route::prefix('enrollment')->group(function () {
        //Route::post('/registration', [StudentController::class, 'studentRegistration']);
        Route::post('/form-options',[EnrollmentController::class,'getFormOptions']);
        Route::post('/list-paginate',[EnrollmentController::class,'list_paginate']);
        Route::post('/delete',[EnrollmentController::class,'deleteEnrollment']);
        Route::post('/student-info',[EnrollmentController::class,'studentDetials']);
        Route::post('/delete-verified',[EnrollmentController::class,'deleteVerifiedEnrollment']);
        Route::post('/save',[EnrollmentController::class,'saveEnrollment']);
        Route::post('/details',[EnrollmentController::class,'getEnrollmentDetails']);
        Route::post('/finalize',[EnrollmentController::class,'finalizeEnrollment']);
    });
    //end::EnrollmentManager

    //api endpoint for filter options on the Find Students Component
    Route::post('/find-student/filter-options', [GeneralSettingsController::class, 'getOptions_academic_year']);

    //begin::StudentController
    Route::prefix('student')->group(function () {
        //**option */
        Route::post('/form-options',[StudentController::class,'formOptions']);
        //** */
        Route::post('/update-info',[StudentController::class,'updateStudentInfo']);
        Route::post('/save-audio', [StudentController::class, 'saveAudioFile']);
        Route::post('/registration', [StudentController::class, 'studentRegistration']);
        Route::post('/list-paginate',[StudentController::class,'studentPaginate']);
        Route::post('/delete-student-enrollment',[StudentController::class,'deleteStudentEnrollment']);
        Route::post('/details-student',[StudentController::class,'studentDetials']);
        Route::post('/delete-verified',[EnrollmentController::class,'deleteVerifiedStudent']);
        Route::post('/information',[StudentController::class,'studentInformation']);
        Route::post('/enrollment-details',[StudentController::class,'getStudentEnrollmentInfo']);

        //** PriceListController */
        Route::post('/invoice-list',[InvoiceController::class,'studentInvoice']);
        Route::post('/generate-invoice',[InvoiceController::class,'generateInvoice']);
        // Route::post('/find',[PriceListController::class,'findStudent']);
        Route::post('/find',[InvoiceController::class,'findStudent']);
        Route::post('/generate-invoice/details',[PriceListController::class,'generateInvoiceDetails']);
        Route::post('/school-fee/pay',[InvoiceController::class,'schoolFeePay']);
        Route::post('/invoice-delete',[InvoiceController::class,'deleteInvoice']);
        // Route::post('/invoice-to-active',[PriceListController::class,'turnInvoiceToActive']);
        Route::post('/invoice-update',[InvoiceController::class,'updateInvoice']);
        // Route::post('/invoice-items',[PriceListController::class,'getInvoiceItems']);

        //** AttendanceController */
        Route::post('/attendance-save',[StudentAttendanceController::class,'saveAttendance']);
        Route::post('/attendance-scan',[StudentAttendanceController::class,'scanAttendance']);
        Route::post('/attendance-list',[StudentAttendanceController::class,'attendanceList']);
        Route::post('/attendance-details',[StudentAttendanceController::class,'attendanceDetails']);
        Route::post('/attendance-date-details',[StudentAttendanceController::class,'getAttendanceDateDetails']);
        Route::post('/options-by-group',[StudentAttendanceController::class,'studentListByGroup']);
        Route::post('/options-group',[StudentAttendanceController::class,'optionsGroup']);
        Route::post('/options-attendance-types',[StudentAttendanceController::class,'optionsAttendanceTypes']);
        Route::post('/attendance-list-report',[StudentAttendanceController::class,'studentAttendanceListReport']);




    });
    //end::StudentController

    //begin::DepositController
    Route::prefix('deposite')->group(function () {
        Route::post('/save',[DepositeController::class,'save']);
        Route::post('/details',[DepositeController::class,'getDetails']);
        Route::post('/list',[DepositeController::class,'getList']);
        Route::post('/delete',[DepositeController::class,'delete']);
        Route::post('/student-info',[DepositeController::class,'getOldStudentInfo']);
    });
    //end::DepositController

    //begin::CampusController
    Route::prefix('campus')->group(function () {
        Route::post('/save', [CampusController::class, 'save']);
        Route::post('/list', [CampusController::class, 'getList']);
        Route::post('/details', [CampusController::class, 'getDetails']);
        Route::post('/delete', [CampusController::class, 'delete']);
    });
    //end::CampusController

    //begin::AcademicYearController
    Route::prefix('academic-year')->group(function () {
        Route::post('/save', [AcademicYearController::class, 'save']);
        Route::post('/list', [AcademicYearController::class, 'getList']);
        Route::post('/details', [AcademicYearController::class, 'getDetails']);
        Route::post('/delete', [AcademicYearController::class, 'delete']);
        Route::post('/form-options', [AcademicYearController::class, 'getFormOptions']);
    });
    //end::AcademicYearController

    //begin::StudentGroupController
    Route::prefix('student-group')->group(function () {
        Route::post('/save', [StudentGroupController::class, 'save']);
        Route::post('/list', [StudentGroupController::class, 'getList']);
        Route::post('/list-paginate', [StudentGroupController::class, 'getList_paginate']);
        Route::post('/details', [StudentGroupController::class, 'getDetails']);
        Route::post('/delete', [StudentGroupController::class, 'delete']);
        Route::post('/form-options', [StudentGroupController::class, 'getFormOptions']);
        Route::post('/assign',[StudentGroupController::class,'assignStudentToGroup']);
    });
    //end::StudentGroupController

    //begin::TermController
    Route::prefix('term')->group(function () {
        Route::post('/save', [TermController::class, 'save']);
        Route::post('/list', [TermController::class, 'getList']);
        Route::post('/details', [TermController::class, 'getDetails']);
        Route::post('/delete', [TermController::class, 'delete']);
        //term/form-options
        Route::post('/form-options', [TermController::class, 'getFormOptions']);
    });
    //end::TermController

    //begin::ProgramController
    Route::prefix('program')->group(function(){
        Route::post('/save',[ProgramController::class,'save']);
        Route::post('/list',[ProgramController::class,'getList']);
        Route::post('/details',[ProgramController::class,'getDetails']);
        Route::post('/delete',[ProgramController::class,'delete']);
        Route::post('/levels',[ProgramController::class,'get_levels_by_program']);
    });
    //end::ProgramController

    //begin::ProgramLevelController
    Route::prefix('program-level')->group(function () {
        Route::post('/save', [ProgramLevelController::class, 'save']);
        Route::post('/list', [ProgramLevelController::class, 'getList']);
        Route::post('/details', [ProgramLevelController::class, 'getDetails']);
        Route::post('/delete', [ProgramLevelController::class, 'delete']);
    });
    //end::ProgramController

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

    Route::get('settings/options-school', [GeneralSettingsController::class, 'getOptions_school']);
    Route::get('settings/options-level', [GeneralSettingsController::class, 'getOptions_level']);
    Route::get('settings/options-program', [GeneralSettingsController::class, 'getOptions_program']);
    Route::get('settings/options-group-all', [GeneralSettingsController::class, 'getOptions_group']);
    Route::post('settings/options-group', [GeneralSettingsController::class, 'getOptions_group']);
    Route::post('settings/school/save', [GeneralSettingsController::class, 'saveOption_school']);
    Route::post('settings/school/delete', [GeneralSettingsController::class, 'deleteOption_school']);

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
    // Route::post('invoice/payment-form-options', [InvoiceController::class, 'getPaymentFormOptions']);
    // Route::post('invoice/form-options', [InvoiceController::class, 'invoice_form_options']);
    // Route::post('invoice/customer-info', [InvoiceController::class, 'getCustomerInfo']);
    // Route::post('invoice/create', [InvoiceController::class, 'createInvoice']);
    // Route::post('invoice/update', [InvoiceController::class, 'updateInvoice']);
    // Route::post('invoice/delete', [InvoiceController::class, 'deleteInvoice']);
    // Route::post('invoice/details', [InvoiceController::class, 'getInvoiceDetails']);
    // Route::post('invoice/basic-info', [InvoiceController::class, 'getBasicInfo']);
    // Route::post('invoice/list', [InvoiceController::class, 'getInvoiceList']);
    // Route::post('invoice/list-paginate', [InvoiceController::class, 'getInvoiceList_paginate']);
    // Route::post('invoice-payment/receive', [InvoiceController::class, 'receivePayment']);
    // Route::post('invoice/receive-payment', [InvoiceController::class, 'receivePayment']);
    // Route::post('invoice/receive-payments', [InvoiceController::class, 'receivePayments']);
    // Route::post('invoice/payments', [InvoiceController::class, 'getInvoicePayments']);
    // Route::post('invoice/payments-with-summary', [InvoiceController::class, 'getInvoicePayments_with_summary']);
    // Route::post('invoice-payment/details', [InvoiceController::class, 'getInvoicePaymentDetails']);
    //getPaymentDetailsWithSummary() => payment details + invoice info
    // Route::post('invoice-payment/details-with-summary', [InvoiceController::class, 'getInvoicePaymentWithSummary']);

    // Route::post('invoice-payment/update', [InvoiceController::class, 'updatePayment']);
    // Route::post('invoice-payment/delete', [InvoiceController::class, 'deletePayment']);

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


    //begin::PriceListController
    Route::post('price-list/list-paginate', [PriceListController::class, 'getPriceList_paginate']);
    Route::post('price-list/delete', [PriceListController::class, 'deletePriceList']);
    Route::post('price-list/save', [PriceListController::class, 'savePriceList']);
    Route::post('price-list/details', [PriceListController::class, 'getPriceListDetails']);
    Route::post('price-list/items', [PriceListController::class, 'getPriceListItems']);
    Route::post('price-list/save-item', [PriceListController::class, 'saveItem']);
    Route::post('price-list/delete-item', [PriceListController::class, 'deleteItem']);
    Route::post('price-list/item-details', [PriceListController::class, 'getPriceListItemDetails']);

    Route::post('price-list/pending/payment',[PriceListController::class,'getPendingPayment']);
    Route::post('price-list/preview/pending-payment',[PriceListController::class,'previewPendingPaymentDetails']);
    Route::post('price-list/update/pending-payment',[PriceListController::class,'updatePendingPayment']);
    Route::post('price-list/pending-payment/details',[PriceListController::class,'getStudentPendingPaymentDetails']);


    Route::post('price-list/weekly', [PriceListController::class, 'weeklyFee']);

    Route::post('price-list/monthly', [PriceListController::class, 'monthlyFee']);
    //End::PriceListController

   //begin::PolicyDiscountController
        Route::post('pol-discount/list-paginate', [PolicyDiscountController::class, 'getDiscountList_paginate']);
        Route::post('pol-discount/delete', [PolicyDiscountController::class, 'deleteDiscount']);
        Route::post('pol-discount/save', [PolicyDiscountController::class, 'saveDiscount']);
        Route::post('pol-discount/details', [PolicyDiscountController::class, 'getDetails']);
       // Route::post('pol-discount/items', [PolicyDiscountController::class, 'getDiscountItems']);
        // Route::post('pol-discount/save-item', [PolicyDiscountController::class, 'saveItem']);
        // Route::post('pol-discount/delete-item', [PolicyDiscountController::class, 'deleteItem']);

    //End::PolicyDiscountController

      //begin::OtherFeeController
      Route::post('other-fee/list', [OtherFeeController::class, 'getList']);
      Route::post('other-fee/delete', [OtherFeeController::class, 'deleteOtherFee']);
      Route::post('other-fee/save', [OtherFeeController::class, 'saveOtherFee']);
      Route::post('other-fee/details', [OtherFeeController::class, 'getDetails']);
      // Route::post('other-fee/items', [PolicyDiscountController::class, 'getDiscountItems']);
      // Route::post('other-fee/save-item', [PolicyDiscountController::class, 'saveItem']);
      // Route::post('other-fee/delete-item', [PolicyDiscountController::class, 'deleteItem']);

  //End::OtherFeeController

  //begin::ReportController
   Route::post('report-center/report-list', [ReportController::class, 'getReportList']);
   Route::post('report-center/filter-options', [WebReportController::class, 'getReportFilterOptions']);

  Route::prefix('reports')->group(function(){
    Route::post('/list',[ReportController::class,'getReportList']);
    Route::post('/filter-options', [ReportController::class, 'getReportFilterOptions']);

    Route::post('finance/activities',[ReportController::class,'getActivities']);
    Route::post('finance/payments',[ReportController::class,'getInvoicePayments']);
    Route::post('finance/invoice-list',[ReportController::class,'getInvoiceList']);
    Route::post('finance/invoice-paid',[ReportController::class,'getPaidInvoices']);
    Route::post('finance/expired-students',[ReportController::class,'getExpiredStudents']);
    Route::post('finance/students-with-sepcial-discount',[ReportController::class,'getStudentsWithSpecialDiscount']);
    Route::post('finance/student-counts-by-pmt-option',[ReportController::class,'countStudentsByPmtOptions']);

    Route::post('enrollment/student-referrers',[ReportController::class,'getStudentReferers']);
    Route::post('enrollment/family-list',[ReportController::class,'getFimilyList']);
    Route::post('enrollment/activities',[ReportController::class,'getActivities']);
    Route::post('enrollment/attendance-summary',[ReportController::class,'getAttendanceSummary']);
    Route::post('enrollment/student-list',[ReportController::class,'getStudentList']);
    Route::post('enrollment/dropout-students',[ReportController::class,'getDropoutStudents']);
    Route::post('enrollment/new-students',[ReportController::class,'getNewStudents']);

    Route::post('/student-info',[ReportController::class,'getStudentInfoList']);
    Route::post('/family-info',[ReportController::class,'getFamilyInfoList']);


    Route::post('/attendance/list',[ReportController::class,'getAttendanceList']);
  });
 //end::ReportController


  //begin::MobileSettingsController
    Route::prefix('mobile-settings')->group(function(){
        Route::post('/banner-save',[BannerController::class,'save']);
        Route::post('/banner-list',[BannerController::class,'list']);
        Route::post('/banner-details',[BannerController::class,'details']);
        Route::post('/banner-delete',[BannerController::class,'delete']);

        // Social Media
        Route::post('/social-media-save',[SocialMediaController::class,'save']);
        Route::post('/social-media-list',[SocialMediaController::class,'list']);
        Route::post('/social-media-details',[SocialMediaController::class,'details']);
        Route::post('/social-media-delete',[SocialMediaController::class,'delete']);
    });
  //end::MobileSettingsController

    //begin::GuardianController
    Route::prefix('guardian')->group(function(){
        Route::post('/save',[GuardianController::class,'save']);
        Route::post('/list',[GuardianController::class,'list']);
        Route::post('/test',[GuardianController::class,'test']);
        Route::post('/details',[GuardianController::class,'details']);
        Route::post('/request-account',[GuardianController::class,'parentRequestAccount']);
        Route::post('/children-details',[GuardianController::class,'parentChildrenDetails']);
        Route::post('/options-family',[GuardianController::class,'optionFamily']);
    });
    //end::GuardianController

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

    Route::post('getPromotionList', [PromotionController::class, 'getPromotionList']);
    Route::post('savePromotion', [PromotionController::class, 'savePromotion']);
    Route::post('getPromotionInfo', [PromotionController::class, 'getPromotionInfo']);
    Route::post('deletePromotion', [PromotionController::class, 'deletePromotion']);
    //end::PromotionController
});

//begin::SystemSettingController
Route::post('getComboItems_price_list', [SystemSettingController::class, 'getComboItems_price_list']);

//end::SystemSettingController

//begin::CompanyProfileController
    Route::post('company/save-logo', [CompanyProfileController::class, 'saveCompanyLogo']);
    Route::post('company/logo-url', [CompanyProfileController::class, 'getCompanyLogo']);
    Route::post('company/delete-logo', [CompanyProfileController::class, 'deleteCompanyLogo']);
    Route::post('company/save-details', [CompanyProfileController::class, 'saveCompanyInfo']);
    Route::post('company/details', [CompanyProfileController::class, 'getCompanyInfo']);
    Route::post('company/info', [CompanyProfileController::class, 'getCompanyInfo']);
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
Route::post('settings/payment-options',[GeneralSettingsController::class, 'paymentOptions']);
Route::post('settings/status-options',[GeneralSettingsController::class, 'paymentStatusOptions']);
Route::post('settings/deposite-options',[GeneralSettingsController::class, 'depositeFormOptions']);

Route::post('settings/departments', [GeneralSettingsController::class, 'getDepartmentList']);
Route::post('settings/save-department', [GeneralSettingsController::class, 'saveDepartment']);
Route::post('settings/delete-department', [GeneralSettingsController::class, 'deleteDepartment']);
Route::post('settings/department-info', [GeneralSettingsController::class, 'getDepartmentDetails']);
Route::post('settings/options-academic-year', [GeneralSettingsController::class, 'GetComboItems_academic_year']);
Route::post('settings/options-term', [GeneralSettingsController::class, 'getOptions_term']);

Route::post('settings/options-pmt-method', [GeneralSettingsController::class, 'getComboItems_pmt_method']);
Route::post('settings/save-position', [GeneralSettingsController::class, 'savePosition']);
Route::post('settings/options-department', [GeneralSettingsController::class, 'getComboItems_department']);
Route::post('settings/options-position', [GeneralSettingsController::class, 'getComboItems_position']);
Route::post('settings/options-nationality', [GeneralSettingsController::class, 'getComboItems_nationality']);
Route::post('settings/create-org', [GeneralSettingsController::class, 'createOrganization']);
Route::post('settings/delete-org', [GeneralSettingsController::class, 'deleteOrganization']);
Route::post('settings/create-industry', [GeneralSettingsController::class, 'createIndustry']);
Route::post('settings/delete-industry', [GeneralSettingsController::class, 'deleteIndustry']);


Route::post('settings/options-contact-channel', [GeneralSettingsController::class, 'getComboItems_channel']);
Route::post('settings/options-appt-status', [GeneralSettingsController::class, 'getComboItems_appt_status']);
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
