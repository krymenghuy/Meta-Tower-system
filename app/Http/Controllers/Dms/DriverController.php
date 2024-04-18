<?php

namespace App\Http\Controllers\Dms;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Driver;
use App\Models\UM;
use App\Models\JDV;

class DriverController extends Controller
{
    protected $driverModel;

    public function __construct(){
        $this->driverModel = new Driver();
    }

    function saveDriver(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $driver = new Driver(null,$ss);
      $res =$driver->save($req->all());
      if($res->status ==='Error') return JDV::raw($res);
      return JDV::success(['driver_id'=>$res->driver_id]);
    }

    function deleteDriver(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->driver_id?$req->driver_id:$req->id;
        $driver = new Driver($id,$ss);
        $res = $driver->delete();
        return JDV::raw($res); 
    }
     
     function saveDriverCommissions(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $id = $req->driver_id?$req->driver_id:$req->id;
      $driver = new Driver($id,$ss);
      $res = $driver->saveCommissions($req->all()); 
      return JDV::raw($res);
   }

   function getDriverBalanceDues(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $id = $req->driver_id?$req->driver_id:$req->id;
      $driver = new Driver($id,$ss);
      $data = $driver->getBalanceDues($req->all()); 
      return JDV::result($data);
   }

   function getDriverCommissions(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $id = $req->driver_id?$req->driver_id:$req->id;
    $driver = new Driver($id,$ss);
    $data = $driver->getCommissions();
    return JDV::result($data);
 }

    function updateDriverStatus(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $id = $req->driver_id?$req->driver_id:$req->id;
      $driver = new Driver($id,$ss);
      $res = $driver->updateStatus($req->status_code);
      return JDV::raw($res);
   }

    /** getDriverDetails */
     function getDetails(Request $req){ 
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $id = $req->driver_id?$req->driver_id:$req->id;
      return JDV::result(Driver::details($id,$ss));
     }

     function getDriverList(Request $req){
       $ss = UM::getUserInfoByToken($req,-1);
       if($ss->status_code !==200) return JDV::raw($ss);
      return JDV::result(Driver::list($req->all(),$ss));
     }
  
     function getFormOptions(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        return JDV::result(Driver::getFormOptions($ss));   
     }

}
