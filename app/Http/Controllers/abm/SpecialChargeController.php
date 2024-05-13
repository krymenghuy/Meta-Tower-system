<?php

namespace App\Http\Controllers\Abm;

use App\Http\Controllers\Controller;
use App\Models\Abm\SpecialCharge;
use Illuminate\Http\Request;
use App\Models\UM;
use App\Models\JDV;

class SpecialChargeController extends Controller
{
    protected $special_charge = null;
    function __construct(){
        $this->special_charge = new SpecialCharge();
    }
    function save(Request $req){

        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code != 200) return JDV::raw($ss);
        $id = $req->id;
        $special_charge = new SpecialCharge($id,$ss);
        $save = $special_charge->save($req->all(),$id,$ss);    
        return JDV::raw($save);
    }

    function ListPaginate(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $data = $this->special_charge->ListPaginate($req->all(),$ss);
        
        return JDV::result($data);
    }

    function deleteSpecileCharge(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $res = $this->item->deleteOrderitem($req->all(),$ss);
        return JDV::raw($res);  
    }

}
