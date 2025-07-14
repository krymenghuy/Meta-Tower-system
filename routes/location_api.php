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
    Route::post('/villages', [LocationController::class, 'getVillageList']);

    Route::post('/detail-country', [LocationController::class, 'getDetailCountry']);
    Route::post('/options-country',[LocationController::class,'getComboItems_country']);
    Route::post('/options-city',[LocationController::class,'getComboItems_city']);
    Route::post('/options-district',[LocationController::class,'getComboItems_district']);
    Route::post('/options-commune',[LocationController::class,'getComboItems_commune']);
    Route::post('/options-village',[LocationController::class,'getComboItems_village']);

    Route::post('/country/save',[LocationController::class,'saveCountry']);
    Route::post('/city/save',[LocationController::class,'saveCity']);
    Route::post('/district/save',[LocationController::class,'saveDistrict']);
    Route::post('/commune/save',[LocationController::class,'saveCommune']);
    Route::post('/village/save',[LocationController::class,'saveVillage']);


    Route::post('/country/delete',[LocationController::class,'deleteCountry']);
    Route::post('/city/delete',[LocationController::class,'deleteCity']);
    Route::post('/district/delete',[LocationController::class,'deleteDistrict']);
    Route::post('/commune/delete',[LocationController::class,'deleteCommune']);

    Route::post('/country/delete-flag',[LocationController::class,'deleteFlag']);
    Route::post('/country/save-flag',[LocationController::class,'saveFlag']);

    Route::post('/city/from-option',[LocationController::class,'getCityFromOption']);
    Route::post('/district/from-option',[LocationController::class,'getDistrictFromOption']);
    Route::post('/commune/from-option',[LocationController::class,'getCommuneFromOption']);
    Route::post('/village/from-option',[LocationController::class,'getVillageFromOption']);

});
//end::LocationController