<?php
use App\Http\Controllers\Location\LocationController;
use App\Http\Middleware\CustomRateLimiter;
use Illuminate\Support\Facades\Route;

//begin::LocationController
Route::middleware(['auth.api', CustomRateLimiter::class])->prefix('location')->group(function(){
    Route::post('/countries', [LocationController::class, 'getCountryList']);
    Route::post('/cities', [LocationController::class, 'getCityList']);
    Route::post('/districts', [LocationController::class, 'getDistrictList']);
    Route::post('/communes', [LocationController::class, 'getCommuneList']);
    
    Route::post('/options-country',[LocationController::class,'getComboItems_country']);
    
    Route::post('/options-city',[LocationController::class,'getComboItems_city']);
    
    Route::post('/options-district',[LocationController::class,'getComboItems_district']);
    
    Route::post('/options-commune',[LocationController::class,'getComboItems_commune']);
    
    Route::post('/country/save',[LocationController::class,'saveCountry']);
    
    Route::post('/country/delete',[LocationController::class,'deleteCountry']);
    
    Route::post('/city/save',[LocationController::class,'saveCity']);
    
    Route::post('/city/delete',[LocationController::class,'deleteCity']);
    
    Route::post('/district/save',[LocationController::class,'saveDistrict']);
    
    Route::post('/district/delete',[LocationController::class,'deleteDistrict']);
    
    Route::post('/commune/save',[LocationController::class,'saveCommune']);
    
    Route::post('/commune/delete',[LocationController::class,'deleteCommune']);    

}); 
//end::LocationController
 
