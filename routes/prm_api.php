<?php

use App\Http\Controllers\CompanyProfileController;
use App\Http\Controllers\Auth\AuthController;

use App\Http\Controllers\Prm\PurchaseOrderController;
use App\Http\Middleware\CustomRateLimiter;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Prm\GeneralSettingsController;

use App\Http\Controllers\Prm\TenantController;
use App\Http\Controllers\Prm\TenantDocumentController;
use App\Http\Controllers\Prm\BuildingController;
use App\Http\Controllers\Prm\BuildingSpaceController;
use App\Http\Controllers\Prm\ContractController;
use App\Http\Controllers\Prm\ServiceController;
use App\Http\Controllers\Prm\VendorController;

use App\Http\Controllers\Prm\InvoiceController;
use App\Http\Controllers\Prm\ExpenseController;
use App\Http\Controllers\Prm\PaymentController;
use App\Http\Controllers\Prm\ServiceRequestController;
use App\Http\Controllers\Prm\ReservationController;
use App\Http\Controllers\Prm\AmenityController;
use App\Http\Controllers\Prm\ItemController;
use App\Http\Controllers\Prm\MaintenanceController;
use App\Http\Controllers\Prm\BillController;
use App\Http\Controllers\Prm\BillPaymentController;
use App\Http\Controllers\Prm\ReceiptController;
use App\Http\Controllers\Prm\ReportController;

use App\Http\Controllers\tenant\AccountStaffController;
use App\Http\Controllers\tenant\ZoneController;
use App\Http\Controllers\Tenant\ContractsController;
use App\Http\Controllers\Prm\InvoiceSettingController;
use App\Http\Controllers\Tenant\TenantProfileController;
use App\Http\Controllers\Tenant\ReservationsController;
use App\Http\Controllers\Tenant\RequestServiceController;




//begin:: api without Authentication
Route::middleware([CustomRateLimiter::class])->group(function () {
    // Route::post('logout', [ApiController::class,'logout_mobile']);
    // Route::post('auth/login', [ApiController::class, 'externalLogin']);
    Route::post('admin/login', [AuthController::class, 'apiLogin']);
    //Route::post('auth/login', [AuthController::class, 'apiLogin']);
});
//end:: api without Authentication
// Route::post('/employee/attendance/scan',[AttendanceController::class,'scanAttendance']);
// Route::post('/employee/attendance/last-employees-scan',[AttendanceController::class,'getLastEmployeesScan']);
// Route::post('/create-contract', [ContractController::class, 'createContract']);



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
// Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('dashboard')->group(function () {
//     Route::post('/data', [DashboardController::class, 'getDashboardData']);
//     Route::post('/overview-data', [DashboardController::class, 'getOverviewData']);
// });


Route::middleware(['auth.api', CustomRateLimiter::class])->group( function (){
    Route::post('/form-option',[GeneralSettingsController::class,'select_options']);
});


Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('tenant')->group(function () {
    Route::post('/create', [TenantController::class, 'createTenant']);
    Route::post('/profile/photo',[TenantController::class,'getProfilePhoto']);
    Route::post('/profile/photo/delete',[TenantController::class,'deleteProfilePhoto']);
    Route::post('/profile/photo/create',[TenantController::class,'createProfilePhoto']);
    Route::post('/list-paginate', [TenantController::class, 'getListPaginate']);
    Route::post('/details', [TenantController::class, 'getDetails']);
    Route::post('/form-options', [TenantController::class, 'getFormOptions']);
    Route::post('/delete', [TenantController::class, 'delete']);
    Route::post('/update-status', [TenantController::class, 'updateMemberStatus']);
    Route::post('/lease-history', [TenantController::class, 'getLeaseHistory']);
    Route::post('/options-active-space', [TenantController::class, 'options_active_space']);
    Route::post('/options-tenant-info', [TenantController::class, 'option_select_all_tenant_info']);
    Route::post('/option-tenant-with-contract', [TenantController::class, 'getTenantOptionsWithSpacesAndMonths']);
    Route::post('/option-tenant-with-service', [TenantController::class, 'option_select_all_tenant_info_service']);

    Route::post('document/save', [TenantDocumentController::class, 'saveTenantDocument']);
    Route::post('document/list', [TenantDocumentController::class, 'getListDocument']);
    Route::post('document/details', [TenantDocumentController::class, 'getDetails']);
    Route::post('document/delete', [TenantDocumentController::class, 'deleteTenantDocument']);
    Route::post('document/form-options', [TenantDocumentController::class, 'getFormOptions']);
    Route::post('document/download', [TenantDocumentController::class, 'downloadDocument']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('building-space')->group(function () {
    Route::post('/save', [BuildingSpaceController::class, 'saveBuildingSpace']);
    Route::post('/create-booking', [BuildingSpaceController::class, 'createBooking']);
    Route::post('/update-booking', [BuildingSpaceController::class, 'updateBooking']);
    Route::post('/cancel-booking', [BuildingSpaceController::class, 'cancelBooking']);
    Route::post('/view-booking', [BuildingSpaceController::class, 'viewBookingDetails']);
    Route::post('/latest-booking', [BuildingSpaceController::class, 'getLatestBooking']);
    Route::post('/list-paginate', [BuildingSpaceController::class, 'getListPaginate']);
    Route::post('/details', [BuildingSpaceController::class, 'getDetails']);
    Route::post('/form-options', [BuildingSpaceController::class, 'getFormOptions']);
    Route::post('/delete', [BuildingSpaceController::class, 'delete']);
    Route::post('/update-status', [BuildingSpaceController::class, 'updateBuildingSpaceStatus']);
});

// Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('account-staff')->group(function () {
//     Route::post('/save', [AccountStaffController::class, 'saveAccountStaff']);
//     Route::post('/list-paginate', [AccountStaffController::class, 'getListAccountStaff']);
//     Route::post('/details', [AccountStaffController::class, 'accountStaffDetails']);
//     Route::post('/form-options', [AccountStaffController::class, 'getFormOptions']);
//     Route::post('/delete', [AccountStaffController::class, 'deleteAccountStaff']);
//     Route::post('/update-status', [AccountStaffController::class, 'updateAccountStaffStatus']);
// });

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('zone')->group(function () {
    Route::post('/save', [ZoneController::class, 'saveZone']);
    Route::post('/list-paginate', [ZoneController::class, 'getListZone']);
    Route::post('/details', [ZoneController::class, 'ZoneDetails']);
    Route::post('/form-options', [ZoneController::class, 'getFormOptions']);
    Route::post('/delete', [ZoneController::class, 'deleteZone']);
    // Route::post('/update-status', [ZoneController::class, 'updateAccountStaffStatus']);
});


Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('building')->group(function () {
    Route::post('/save', [BuildingController::class, 'saveBuilding']);
    Route::post('/add-floor', [BuildingController::class, 'addFloor']);
    Route::post('/delete-floor', [BuildingController::class, 'deleteFloor']);
    Route::post('/list-floor', [BuildingController::class, 'getListFloor']);
    Route::post('/list-paginate', [BuildingController::class, 'getListBuilding']);
    Route::post('/details', [BuildingController::class, 'buildingDetails']);
    Route::post('/form-options', [BuildingController::class, 'getFormOptions']);
    Route::post('/delete', [BuildingController::class, 'deleteBuilding']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('contract')->group(function () {
    Route::post('/save', [ContractController::class, 'saveContract']);
    Route::post('/list-paginate', [ContractController::class, 'getListPaginate']);
    Route::post('/list-renewals', [ContractController::class, 'getListRenewals']);
    Route::post('/details', [ContractController::class, 'contractDetails']);
    Route::post('/form-options', [ContractController::class, 'getFormOptions']);
    Route::post('/delete', [ContractController::class, 'deleteContract']);
    Route::post('/renew', [ContractController::class, 'renewContract']);
    Route::post('/cancel-renewal', [ContractController::class, 'cancelPendingRenewal']);
    Route::post('/update-renewal', [ContractController::class, 'updatePendingRenewal']);
    Route::post('/terminate', [ContractController::class, 'terminateContract']);
    Route::post('/get-tenant-info', [ContractController::class, 'getTenantInfo']);
    Route::post('/month', [ContractController::class, 'getContractMonths']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('service-request')->group(function () {
    Route::post('/save', [ServiceRequestController::class, 'saveServiceRequest']);
    Route::post('/list',[ServiceRequestController::class, 'getServiceRequestList']);
    Route::post('/details',[ServiceRequestController::class, 'serviceRequestDetails']);
    Route::post('/delete',[ServiceRequestController::class,'delete']);
    Route::post('/form-options',[ServiceRequestController::class,'getFormOptions']);
    Route::post('/accept',[ServiceRequestController::class,'acceptRequest']);
    Route::post('/reject',[ServiceRequestController::class,'rejectRequest']);
    Route::post('/complete',[ServiceRequestController::class,'completeRequest']);

});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('maintenance')->group(function () {
    Route::post('/save', [MaintenanceController::class, 'save']);
    Route::post('/list-paginate', [MaintenanceController::class, 'getListPaginate']);
    Route::post('/details', [MaintenanceController::class, 'details']);
    Route::post('/form-options', [MaintenanceController::class, 'getFormOptions']);
    Route::post('/delete', [MaintenanceController::class, 'delete']);
    Route::post('/set-status', [MaintenanceController::class, 'setStatus']);
    Route::post('/finish-by-space', [MaintenanceController::class, 'finishBySpace']);
    Route::post('/finish-by-amenity', [MaintenanceController::class, 'finishByAmenity']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('service')->group(function () {
    Route::post('/save', [ServiceController::class, 'saveService']);
    Route::post('/list-paginate', [ServiceController::class, 'getListPaginate']);
    Route::post('/details', [ServiceController::class, 'serviceDetails']);
    Route::post('/form-options', [ServiceController::class, 'getFormOptions']);
    Route::post('/delete', [ServiceController::class, 'deleteService']);
    Route::post('/update-status', [ServiceController::class, 'updateServiceStatus']);
    Route::post('/get-service-info', [ServiceController::class, 'option_select_all_service_info']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('vendor')->group(function () {
    Route::post('/save', [VendorController::class, 'saveVendor']);
    Route::post('/list-paginate', [VendorController::class, 'getListPaginate']);
    Route::post('/details', [VendorController::class, 'vendorDetails']);
    Route::post('/form-options', [VendorController::class, 'getFormOptions']);
    Route::post('/delete', [VendorController::class, 'deleteVendor']);
    Route::post('/options-vendor-info', [VendorController::class, 'option_select_all_vendor_info']);

     Route::post('/update-status', [VendorController::class, 'updateVendorStatus']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('item')->group(function () {
    Route::post('/save', [ItemController::class, 'saveItem']);
    Route::post('/list-paginate', [ItemController::class, 'getListPaginate']);
    Route::post('/details', [ItemController::class, 'itemDetails']);
    Route::post('/form-options', [ItemController::class, 'getFormOptions']);
    Route::post('/delete', [ItemController::class, 'deleteItem']);
    //  Route::post('/update-status', [VendorController::class, 'updateVendorStatus']);
});



Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('invoice')->group(function () {
    Route::post('/save', [InvoiceController::class, 'saveInvoice']);
    Route::post('/list-paginate', [InvoiceController::class, 'getListPaginate']);
    Route::post('/details', [InvoiceController::class, 'invoiceDetails']);
    Route::post('/form-options', [InvoiceController::class, 'getFormOptions']);
    Route::post('/delete', [InvoiceController::class, 'deleteInvoice']);
    Route::post('/update-status', [InvoiceController::class, 'updateInvoiceStatus']);
    Route::post('/receive', [InvoiceController::class, 'receive']);
    Route::post('/setting', [InvoiceController::class, 'invoiceSetting']);
    Route::post('/get-setting', [InvoiceController::class, 'getInvoiceSetting']);
    Route::post('/reset-setting', [InvoiceController::class, 'resetInvoiceSetting']);

});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('expense')->group(function () {
    Route::post('/save', [ExpenseController::class, 'saveExpense']);
    Route::post('/list-paginate', [ExpenseController::class, 'getListPaginate']);
    Route::post('/details', [ExpenseController::class, 'expenseDetails']);
    Route::post('/form-options', [ExpenseController::class, 'getFormOptions']);
    Route::post('/delete', [ExpenseController::class, 'deleteExpense']);

});


Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('contracts')->group(function () {
    Route::post('/save', [ContractsController::class, 'saveContracts']);
    Route::post('/list-paginate', [ContractsController::class, 'getListContracts']);
    Route::post('/details', [ContractsController::class, 'contractsDetails']);
    Route::post('/form-options', [ContractsController::class, 'getFormOptions']);
    Route::post('/delete', [ContractsController::class, 'deleteContracts']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('payments')->group(function () {
    Route::post('/save', [PaymentController::class, 'savePayment']);
    Route::post('/list-paginate', [PaymentController::class, 'getListPayment']);
    Route::post('/details', [PaymentController::class, 'paymentDetails']);
    Route::post('/form-options', [PaymentController::class, 'getFormOptions']);
    Route::post('/delete', [PaymentController::class, 'deletePayment']);
    Route::post('/update-status', [PaymentController::class, 'updatePaymentStatus']);
});


Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('amenity')->group(function () {
    Route::post('/save', [AmenityController::class, 'saveAmenity']);
    Route::post('/list-paginate', [AmenityController::class, 'getListPaginate']);
    Route::post('/details', [AmenityController::class, 'amenityDetails']);
    Route::post('/form-options', [AmenityController::class, 'getFormOptions']);
    Route::post('/delete', [AmenityController::class, 'deleteAmenity']);
    Route::post('/update-status', [AmenityController::class, 'updateAmenityStatus']);
    Route::post('/check-amenity-reservation', [AmenityController::class, 'checkAmenityReservation']);

    Route::post('/options-amenity-info', [AmenityController::class, 'option_select_all_amenity_info']);
    Route::post('/active-reservations', [AmenityController::class, 'hasActiveReservations']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('reservation')->group(function () {
    Route::post('/save', [ReservationController::class, 'saveReservation']);
    Route::post('/list-paginate', [ReservationController::class, 'getListPaginate']);
    Route::post('/details', [ReservationController::class, 'reservationDetails']);
    Route::post('/form-options', [ReservationController::class, 'getFormOptions']);
    Route::post('/delete', [ReservationController::class, 'deleteReservation']);
    Route::post('/update-status', [ReservationController::class, 'updateReservationStatus']);
    Route::post('/get-amenity-info', [ReservationController::class, 'getAmenityInfo']);
    Route::post('/cancel', [ReservationController::class, 'cancelReservation']);
});

Route::middleware(['auth.api',CustomRateLimiter::class])->prefix('purchase/order')->group(function(){
    Route::post('/save', [PurchaseOrderController::class, 'savePurchaseOrder']);
    Route::post('/authorized',[PurchaseOrderController::class,'authorized']);
    Route::post('/delete', [PurchaseOrderController::class, 'deletePurchaseOrder']);
    Route::post('/reject', [PurchaseOrderController::class, 'rejectPurchaseOrder']);

    Route::post('/receive', [PurchaseOrderController::class, 'receivePurchaseOrder']);
    Route::post('/confirm-received', [PurchaseOrderController::class, 'confirmPurchaseOrderReceived']);
    Route::post('/details', [PurchaseOrderController::class, 'purchaseOrderDetails']);
    Route::post('/items-by-po', [PurchaseOrderController::class, 'getItemsByPurchaseOrder']);
    Route::post('/list-paginate', [PurchaseOrderController::class, 'getPurchaseOrderList']);
    Route::post('/form-options', [PurchaseOrderController::class, 'getFormOptions']);
    Route::post('/po-form-options', [PurchaseOrderController::class, 'getPOFormOptions']);

});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('bill')->group(function () {
    Route::post('/save', [BillController::class, 'saveBill']);
    Route::post('/list-paginate', [BillController::class, 'getListBill']);
    Route::post('/details', [BillController::class, 'billDetails']);
    Route::post('/form-options', [BillController::class, 'getFormOptions']);
    Route::post('/delete', [BillController::class, 'deleteBill']);
    Route::post('/update-status', [BillController::class, 'updateBillStatus']);
    Route::post('/view-attachment', [BillController::class, 'viewBillAttachment']);
    Route::post('/delete-attachment', [BillController::class, 'deleteAttachment']);
});


Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('bill-payment')->group(function () {
    Route::post('/form-options', [BillPaymentController::class, 'getFormOptions']);
    Route::post('/save', [BillPaymentController::class, 'savePayment']);
    Route::post('/list-paginate', [BillPaymentController::class, 'getListPaginate']);
    Route::post('/details', [BillPaymentController::class, 'billPaymentDetails']);
    Route::post('/delete',  [BillPaymentController::class, 'deletePayment']);
    Route::post('/cancel', [BillPaymentController::class, 'cancelPayment']);
});


Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('settings')->group(function () {
    Route::post('/options-floors', [GeneralSettingsController::class, 'getOptions_floors']);
     Route::post('/options-service', [GeneralSettingsController::class, 'options_service']);
    // Route::post('/options-program', [StudentController::class, 'getOptions_program']);

});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('receipts')->group(function () {
    Route::post('/list-paginate', [ReceiptController::class, 'getListPaginate']);
    Route::post('/details', [ReceiptController::class, 'receiptDetails']);
    Route::post('/cancel',[ReceiptController::class,'cancelReceipt']);
    Route::post('/form-options',[ReceiptController::class,'getFormOptions']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('reports')->group(function () {
    Route::post('/list', [ReportController::class, 'getReportList']);
    Route::post('/tenant_list', [ReportController::class, 'getTenantReportList']);
    Route::post('total_payment_history',[ReportController::class,'getTotalPaymentHistory']);
    Route::post('payments',[ReportController::class,'getPaymentReport']);

});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('invoice_setting')->group(function () {
    Route::post('/get-exchange-rate', [InvoiceSettingController::class, 'getExchangeRate']);
    Route::post('/get', [InvoiceSettingController::class, 'getInvoiceSetting']);
    Route::post('/save', [InvoiceSettingController::class, 'saveInvoiceSetting']);
    Route::post('/update-toggle-button', [InvoiceSettingController::class, 'updateToglleButton']);
    Route::post('/get-toggle-button', [InvoiceSettingController::class, 'getToglleButton']);
    Route::post('/get-invoice-building-info', [InvoiceSettingController::class, 'getInvoiceBuildingInfo']);
    Route::post('/save-QR', [InvoiceSettingController::class, 'saveQR']);
});


Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('tenant/tenantProfile')->group(function () {
    Route::post('/create', [TenantProfileController::class, 'createTenant']);
    Route::post('/profile/photo',[TenantProfileController::class,'getProfilePhoto']);
    Route::post('/profile/photo/delete',[TenantProfileController::class,'deleteProfilePhoto']);
    Route::post('/profile/photo/create',[TenantProfileController::class,'createProfilePhoto']);
    Route::post('/list-paginate', [TenantProfileController::class, 'getListPaginate']);
    Route::post('/details', [TenantProfileController::class, 'getDetails']);
    Route::post('/form-options', [TenantProfileController::class, 'getFormOptions']);
    Route::post('/delete', [TenantProfileController::class, 'delete']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('tenant/reservation')->group(function () {
    Route::post('/save', [ReservationsController::class, 'saveReservation']);
    Route::post('/list-paginate', [ReservationsController::class, 'getListPaginate']);
    Route::post('/details', [ReservationsController::class, 'reservationDetails']);
    Route::post('/form-options', [ReservationsController::class, 'getFormOptions']);
    Route::post('/delete', [ReservationsController::class, 'deleteReservation']);
    Route::post('/update-status', [ReservationsController::class, 'updateReservationStatus']);
    Route::post('/get-amenity-info', [ReservationsController::class, 'getAmenityInfo']);
    Route::post('/cancel', [ReservationsController::class, 'cancelReservation']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('tenant/request-service')->group(function () {
    Route::post('/save', [RequestServiceController::class, 'saveServiceRequest']);
    Route::post('/list',[RequestServiceController::class, 'getServiceRequestList']);
    Route::post('/details',[RequestServiceController::class, 'serviceRequestDetails']);
    Route::post('/delete',[RequestServiceController::class,'delete']);
    Route::post('/form-options',[RequestServiceController::class,'getFormOptions']);
    Route::post('/accept',[RequestServiceController::class,'acceptRequest']);
    Route::post('/reject',[RequestServiceController::class,'rejectRequest']);
    Route::post('/complete',[RequestServiceController::class,'completeRequest']);


});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('tenant/contract')->group(function () {
    Route::post('/save', [ContractsController::class, 'saveContracts']);
    Route::post('/list-paginate', [ContractsController::class, 'getListContracts']);
    Route::post('/details', [ContractsController::class, 'contractsDetails']);
    Route::post('/form-options', [ContractsController::class, 'getFormOptions']);
    Route::post('/delete', [ContractsController::class, 'deleteContracts']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('tenant/invoice')->group(function () {
    Route::post('/list-paginate', [InvoiceController::class, 'getListPaginate']);
    Route::post('/details', [InvoiceController::class, 'invoiceDetails']);
    Route::post('/form-options', [InvoiceController::class, 'getFormOptions']);
    Route::post('/receive', [InvoiceController::class, 'receive']);
    Route::post('/delete', [InvoiceController::class, 'deleteInvoice']);
});


