<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Car;
use JDV;
use XAuthService;

class CarController 
{

     public function saveCar(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->car_id ?? $req->id;
        $car = new Car($id, $ss);
        $res = $car->saveCar($req->all());
        return JDV::raw($res);
    }

     public function delete(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? null;
        $car = new Car();
        $res = $car->delete($id);
        return JDV::raw($res);
    }
    public function detailsCar(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $car = new Car();
        return JDV::result($car->DetailsCar($req->id, $ss));
    }
    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $car = new Car();
        return JDV::result($car->getFormOptions($req->id, $ss));
    }
    
}
