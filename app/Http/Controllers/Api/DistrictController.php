<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Country;
use App\Models\City;
use App\Models\District;
use App\Http\Resources\DistrictResource;
use App\Http\Resources\DistrictSingleResource;

class DistrictController extends Controller
{
    public function index(Request $request){
        $districts = District::all();
        $search = $request->search;
        if($request->search){
            $districts = District::where('name', "like", "%{$search}%")
                                ->orWhereHas('city', function ($query) use ($search) {
                                    $query->where('name', 'like', '%'.$search.'%');
                                })
                                ->orWhereHas('country', function ($query) use ($search) {
                                    $query->where('country', 'like', '%'.$search.'%');
                                })->get();
        }
        
        return DistrictResource::collection($districts);
    }
    
    public function store(Request $request){
        $this->validate($request, [
            'country_id' => 'required',
            'city_id' => 'required',
            'name' => 'required'
        ]);
        $input = $request->only('country_id', 'city_id', 'name');
        $district = District::create($input);

        return response()->json($district);
    }

    public function countries(){
        $countries = Country::all();
        return response()->json($countries);
    }

    public function cities(Country $country){
        return response()->json($country->city);
    }

    public function show(District $district){
        return new DistrictSingleResource($district);
    }

    public function update(Request $request, District $district){
        $this->validate($request, [
            'country_id' => 'required',
            'city_id' => 'required',
            'name' => 'required'
        ]);
        $input = $request->only('country_id', 'city_id', 'name');
        $district->update($input);
    }

    public function destroy(District $district)
    {
        $district->delete();
        return response()->json('District Deleted Successfully');
    }
}
