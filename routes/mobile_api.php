<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\CustomRateLimiter;

use App\Http\Controllers\Auth\MobileAuthController;
use App\Http\Controllers\Tenant\RequestServiceController;
use App\Http\Controllers\Tenant\BookAmenityController;
use App\Http\Controllers\Tenant\ContractsController;
use App\Http\Controllers\Tenant\InvoiceController as TenantInvoiceController;
use App\Http\Controllers\Tenant\ReceiptController as TenantReceiptController;


Route::middleware([CustomRateLimiter::class])->prefix('account')->group( function (){
    Route::post('/login',[MobileAuthController::class,'mobileLogin']);
    // Route::post('/register',[MobileAuthController::class,'registerMobile']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('request-service')->group(function () {
    Route::post('/save', [RequestServiceController::class, 'saveServiceRequest']);
    Route::post('/list',[RequestServiceController::class, 'getServiceRequestList']);
    Route::post('/details',[RequestServiceController::class, 'serviceRequestDetails']);
    Route::post('/delete',[RequestServiceController::class,'delete']);
    Route::post('/form-options',[RequestServiceController::class,'getFormOptions']);
    Route::post('/cancel',[RequestServiceController::class,'cancelRequest']);
    Route::post('/complete',[RequestServiceController::class,'completeRequest']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('reservation')->group(function () {
    Route::post('/save', [BookAmenityController::class, 'saveReservation']);
    Route::post('/list-paginate', [BookAmenityController::class, 'getListPaginate']);
    Route::post('/details', [BookAmenityController::class, 'reservationDetails']);
    Route::post('/form-options', [BookAmenityController::class, 'getFormOptions']);
    Route::post('/delete', [BookAmenityController::class, 'deleteReservation']);
    Route::post('/update-status', [BookAmenityController::class, 'updateReservationStatus']);
    Route::post('/get-amenity-info', [BookAmenityController::class, 'getAmenityInfo']);
    Route::post('/cancel', [BookAmenityController::class, 'cancelReservation']);
});


Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('contract')->group(function () {
    Route::post('/list-paginate', [ContractsController::class, 'getListContracts']);
    Route::post('/details', [ContractsController::class, 'contractsDetails']);
    Route::post('/list-renewals', [ContractsController::class, 'getListRenewals']);
    Route::post('/form-options', [ContractsController::class, 'getFormOptions']);
    Route::post('/delete', [ContractsController::class, 'deleteContracts']);
});

Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('invoice')->group(function () {
    Route::post('/list-paginate', [TenantInvoiceController::class, 'getListPaginate']);
    Route::post('/details', [TenantInvoiceController::class, 'invoiceDetails']);
    Route::post('/form-options', [TenantInvoiceController::class, 'getFormOptions']);
    Route::post('/save', [TenantInvoiceController::class, 'saveInvoice']);
    Route::post('/receive', [TenantInvoiceController::class, 'receive']);
    Route::post('/delete', [TenantInvoiceController::class, 'deleteInvoice']);
});


Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('receipt')->group(function () {
    Route::post('/list-paginate', [TenantReceiptController::class, 'getListPaginate']);
    Route::post('/details', [TenantReceiptController::class, 'receiptDetails']);
    Route::post('/form-options', [TenantReceiptController::class, 'getFormOptions']);
});







