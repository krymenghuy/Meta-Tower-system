<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Car;
use JDV;
use XAuthService;

class CarController extends Controller
{

     public function saveCar(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->car_id;
        $car = new Car($id, $ss);
        $res = $car->save($req->all());
        return JDV::raw($res);
    }
}
