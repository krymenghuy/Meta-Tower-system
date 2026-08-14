<?php
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Mhr\AttendanceController;

Route::post('/attendance/scan', [AttendanceController::class, 'checkAccessScan']);


