<?php

namespace App\Http\Controllers\PickUp;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Order;

class Pickupcontroller extends Controller
{
    public function index(){
        $order= new Order();
        $order = $order->getPickupList();
        return view('pickup.index', compact('order'));
    }

    public function change_status($id){
        Order::where('id', $id)->update(['status_id' => 4]);
        return redirect()->route('pickup.index')->with('flash_message','Status successfully changed!');
    }
}
