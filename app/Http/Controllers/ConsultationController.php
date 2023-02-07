<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UM;
use App\Models\JDV;
use App\Models\Consultation;

class ConsultationController extends Controller
{
    function saveConsultationData(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $res = Consultation::commitSave($ss,$req->all());
        if($res->status ==='OK') return JDV::success(['id'=>$res->id]);
        else return JDV::error($res->error_message);    
    }

    function deleteConsultationData(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $res = Consultation::commitDelete($ss,$req->id);
        return JDV::raw($res);
    }

    function getConsultationData(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $section_name = $req->section_name;
        $row = Consultation::findBy($ss,$res->id,$section_name);
        return JDV::result($row);
    }

}
