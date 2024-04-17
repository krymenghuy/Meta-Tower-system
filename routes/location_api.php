<?php
use App\Http\Controllers\Location\LocationController;

//begin::LocationController
// Route::post('location/cities', [LocationController::class, 'getCityList']);
// Route::post('location/districts', [LocationController::class, 'getDistrictList']);
// Route::post('location/communes', [LocationController::class, 'getCommuneList']);

Route::post('location/countries', [LocationController::class, 'getCountryList']);
Route::post('location/cities', [LocationController::class, 'getCityList']);
Route::post('location/districts', [LocationController::class, 'getDistrictList']);
Route::post('location/communes', [LocationController::class, 'getCommuneList']);

Route::post('location/options-country',[LocationController::class,'getComboItems_country']);

Route::post('location/options-city',[LocationController::class,'getComboItems_city']);

Route::post('location/options-district',[LocationController::class,'getComboItems_district']);

Route::post('location/options-commune',[LocationController::class,'getComboItems_commune']);

Route::post('location/country/save',[LocationController::class,'saveCountry']);

Route::post('location/country/delete',[LocationController::class,'deleteCountry']);

Route::post('location/city/save',[LocationController::class,'saveCity']);

Route::post('location/city/delete',[LocationController::class,'deleteCity']);

Route::post('location/district/save',[LocationController::class,'saveDistrict']);

Route::post('location/district/delete',[LocationController::class,'deleteDistrict']);

Route::post('location/commune/save',[LocationController::class,'saveCommune']);

Route::post('location/commune/delete',[LocationController::class,'deleteCommune']);         
//end::LocationController
