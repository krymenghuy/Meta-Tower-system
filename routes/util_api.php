<?php

use Illuminate\Http\Request;
use App\Http\Controllers\DbExportController;
//use App\Http\Middleware\CustomRateLimiter;
use Illuminate\Support\Facades\Route;
use App\Services\GarbageCollector;
//Clear trash => to delete expired data such as expired notitifications
    Route::post('trash/clear',function(Request $req){
        $res = GarbageCollector::cleanAll();
        return response()->json($res);
    });
    Route::get('clear-trash',function(){
        $res = GarbageCollector::cleanAll();
        return response()->json($res);
    });

    Route::get('gc-reset',function(){
       $res = GarbageCollector::setYesterday();
       return response()->json($res);
    });