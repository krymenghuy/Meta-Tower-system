<?php

namespace App\Http\Controllers\Delivery;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Order;
use App\Models\Package;
use App\Models\Country;
use App\Models\City;
use App\Models\District;
use App\Models\Commune;

class DeliveryController extends Controller
{
    public function index(){
        $order= new Order();
        $order = $order->getPickupList();
        return view('delivery.index', compact('order'));
    }

    public function list_packages($order_id){
        $order = Order::select('code')->where('id', $order_id)->first();
        $package = new Package();
        $package = $package->getPackages($order_id);
        // $countries = Country::where('id', $package->ra_country_id)->get();
        // $cities = City::where('id', $package->ra_country_id)->get();
        // $districts = District::where('id', $package->ra_city_id)->get();
        // $communes = Commune::where('id', $package->ra_district_id)->get();
        return view('delivery.list_packages', compact('order', 'package'));
    }

    public function edit_package($package_id){
        $package = new Package();
        $package = $package->getPackageById($package_id);
        $countries = Country::all();
        $cities = City::where('id', $package->ra_country_id)->get();
        $districts = District::where('id', $package->ra_city_id)->get();
        $communes = Commune::where('id', $package->ra_district_id)->get();
        return view('delivery.edit_package', compact('package', 'countries', 'cities', 'districts', 'communes'));
    }

    public function update_package(Request $request, $id){
        Package::where('id', $id)->update([
            'qr_code' => $request->qr_code,
            'package_name' => $request->package_name,
            'product_type' => $request->product_type,
            'price' => $request->price,
            'qty' => $request->qty,
            'delivery_fee' => $request->delivery_fee,
            'dimension_x' => $request->dimension_x,
            'dimension_y' => $request->dimension_y,
            'dimension_z' => $request->dimension_z,
            'weight_kg' => $request->weight_kg,
            'cubic_meter_size' => $request->cubic_meter_size,
            'receiver_id' => $request->receiver_id,
            'receiver_name' => $request->receiver_name,
            'receiver_phone' => $request->receiver_phone,
            'receiver_address' => $request->receiver_address,
            'ra_country_id' => $request->ra_country_id,
            'ra_city_id' => $request->ra_city_id,
            'ra_district_id' => $request->ra_district_id,
            'ra_commune_id' => $request->ra_commune_id,
            'update_user' => 'testing',
            'update_uid' => 1,
        ]);
        return redirect('list_packages/'.$request->order_id)->with('flash_message','Package successfully updated!');
    }
}
