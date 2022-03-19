<?php

namespace App\Http\Controllers\Merchant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Http\Requests\Merchant\MerchantRequest;

use App\Models\Sender;
use App\Models\Country;
use App\Models\City;
use App\Models\District;
use App\Models\Commune;
use App\Models\SenderType;


class MerchantController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $merchant = Sender::all();
        return view('merchant.index', compact('merchant'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $countries = Country::all();
        $sendertype = SenderType::all();
        return view('merchant.create', compact('countries', 'sendertype'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(MerchantRequest $request)
    {
        $input = $request->only('sender_type_id', 'name', 'name_kh', 'phone_number', 'email', 'country_id', 'adr_city_id', 'adr_district_id', 'adr_commune_id', 'address', 'business_type', 'sender_type');
        $input['create_user'] = 1;
        Sender::create($input);
        return redirect()->route('merchant.index')->with('flash_message','Merchant successfully inserted!');
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
        $merchant = Sender::findOrFail($id);
        $sendertype = SenderType::all();
        $countries = Country::all();
        $cities = City::where('country_id', $merchant->country_id)->get();
        $district = District::where('city_id', $merchant->adr_city_id)->get();
        $commune = Commune::where('district_id', $merchant->adr_district_id)->get();
        return view('merchant.edit', compact('merchant', 'sendertype', 'countries', 'cities', 'district', 'commune'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(MerchantRequest $request, $id)
    {
        Sender::where('id', $id)->update([
            'sender_type_id' => $request->sender_type_id,
            'name' => $request->name,
            'name_kh' => $request->name_kh,
            'phone_number' => $request->phone_number,
            'email' => $request->email,
            'country_id' => $request->country_id,
            'adr_city_id' => $request->adr_city_id,
            'adr_district_id' => $request->adr_district_id,
            'adr_commune_id' => $request->adr_commune_id,
            'address' => $request->address,
            'business_type' => $request->business_type,
            'sender_type' => $request->sender_type
        ]);
        return redirect()->route('merchant.index')->with('flash_message','Merchant successfully update!');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $merchant = Sender::findOrFail($id);
        $merchant->delete($merchant);
        return redirect()->route('merchant.index')->with('flash_message','Merchant successfully deleted!');
    }
}
