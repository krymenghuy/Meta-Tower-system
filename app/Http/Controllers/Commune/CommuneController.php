<?php

namespace App\Http\Controllers\Commune;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Country;
use App\Models\City;
use App\Models\District;
use App\Models\Commune;

class CommuneController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $commune = Commune::orderBy('id', 'DESC')->get();
        return view('commune.index', compact('commune'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $country = Country::all();
        return view('commune.create', compact('country'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'country_id' => 'required',
            'city_id' => 'required',
            'district_id' => 'required',
            'name' => 'required',
        ]);
        $input = $request->only('country_id', 'city_id', 'district_id', 'name');
        Commune::create($input);
        return redirect()->route('commune.index')->with('flash_message','Commune successfully inserted!');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $commune = Commune::findOrFail($id);
        $country = Country::all();
        $city = City::where('country_id', $commune->country_id)->get();
        $district = District::where('city_id', $commune->city_id)->get();
        return view('commune.edit', compact('commune','country','city','district'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'country_id' => 'required',
            'city_id' => 'required',
            'district_id' => 'required',
            'name' => 'required',
        ]);
        Commune::where('id', $id)->update([
            'country_id' => $request->country_id, 
            'city_id' => $request->city_id,
            'district_id' => $request->district_id,
            'name' => $request->name,
        ]);
        return redirect()->route('commune.index')->with('flash_message','Commune successfully update!');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $commune = Commune::findOrFail($id);
        $commune->delete($commune);
        return redirect()->route('commune.index')->with('flash_message','Commune successfully deleted!');
    }

    function getCity(Request $request){
        $city = City::where('country_id', $request->country_id)->get();
        $out_put = null;
        $out_put .= '<option value="">Pick a city...</option>';
        foreach($city as $cities){
            $out_put .= '<option value="'.$cities->id.'">'.$cities->name.'</option>';
        }

        return response()->json($out_put);
    }

    function getDistrict(Request $request){
        $district = District::where('city_id', $request->city_id)->get();
        $out_put = null;
        $out_put .= '<option value="">Pick a district...</option>';
        foreach($district as $rows){
            $out_put .= '<option value="'.$rows->id.'">'.$rows->name.'</option>';
        }

        return response()->json($out_put);
    }

    function getCommune(Request $request){
        $commune = Commune::where('district_id', $request->adr_district_id)->get();
        $out_put = null;
        $out_put .= '<option value="">Pick a commune...</option>';
        foreach($commune as $rows){
            $out_put .= '<option value="'.$rows->id.'">'.$rows->name.'</option>';
        }

        return response()->json($out_put);
    }
}
