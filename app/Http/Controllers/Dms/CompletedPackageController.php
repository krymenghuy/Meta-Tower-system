<?php

namespace App\Http\Controllers\Dms;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Dms\CompletedPackage;
use App\Models\Dms\UM;
use App\Models\Dms\JDV;

class CompletedPackageController extends Controller
{
    protected $completedPackageModel;
    public function __construct() {
        $this->completedPackageModel = new CompletedPackage();
    }

    function getList(Request $req) {
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        return JDV::result(CompletedPackage::list($req->all(),$ss)); 
    }

    function getList_all(Request $req) {
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      return JDV::result(CompletedPackage::listAll($req->all(),$ss)); 
   }

    /** deleteCompletedPackage() */
    function deletePackage(Request $req) {
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $id = $req->id?$req->id:$req->package_id;
      $p = new CompletedPackage($id,$ss);
      return JDV::raw($p->delete());  
   } 

   function getFormOptions(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $id = $req->id?$req->id: $req->package_id;
    $r = $this->completedPackageModel->getFormOptions($id,$ss);
    return JDV::result($r);   
   }

   function updateCompletedPackage(Request $req) {
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
      $res = $this->completedPackageModel->update($req->all());
      return JDV::result($res); 
   } 
}
