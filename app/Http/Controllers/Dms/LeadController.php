<?php

namespace App\Http\Controllers\Dms;
use App\Http\Controllers\Controller;
use App\Models\Dms\GeneralSettings;
use Illuminate\Http\Request;
use App\Models\Dms\Lead;
use App\Models\UM;
use App\Models\JDV;
 
class LeadController extends Controller
{
    function getOptions_status(Request $req){
        $rows = GeneralSettings::options_lead_status(null);  
        return JDV::result($rows);
    }

    function getOptions_category(Request $req){
        $rows = GeneralSettings::options_lead_category(null);  
        return JDV::result($rows);
    }
    
    function getOptions_business_type(Request $req){
        $rows = GeneralSettings::options_business_type(null);  
        return JDV::result($rows);
    }

    /** submit lead for review */
    function submitForReview(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        $id = $req->id ?? $req->lead_id;
        $lead = new Lead($id,$ss);
        if($ss->status_code !==200) return JDV::raw($ss);
        $res = $lead->setForReview($id,$ss); 
        return JDV::raw($res);
    }

    function getLeadDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        $id = $req->id;
        $lead = new Lead($id,$ss);
        if($ss->status_code !==200) return JDV::raw($ss);
        $data = $lead->getDetails($id,$ss,true); 
        return JDV::result($data);
    }

    function deleteProfilePicture(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if ($ss->status_code !==200) return JDV::raw($ss); //user not authenticated
        $id = $req->id?$req->id:$req->sender_id;
        $sender = new Lead($id,$ss);
        $res = $sender->deleteProfilePicture();
        return JDV::raw($res);
     }
  
     function saveProfilePicture(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if ($ss->status_code !==200) return JDV::raw($ss); //user not authenticated
        $id = $req->id?$req->id:$req->sender_id;
        $photo = $req->photo;
        $sender = new Lead($id,$ss);
        $res = $sender->saveProfilePicture($photo,$req->file_type);
        return JDV::raw($res);
     }

    function saveLead(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        $id = $req->id;
        $lead = new Lead($id,$ss);
        if($ss->status_code !==200) return JDV::raw($ss);
        $res = $lead->save($req->all(),$id,$ss); 
        return JDV::raw($res);
    }
    function getList_paginate(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        if(strtolower($ss->user_class) =='sales_agent'){
            $id = $ss->official_id;
            $req['sales_agent_id'] = $id ?? -1;
            $req['search_value'] = null;
        }
        $data =Lead::list($req->all(),$ss);
        return JDV::result($data);
    }

    function getList_all(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $data =Lead::list_all($req->all(),$ss);
        return JDV::result($data);
    }

    function deleteLead(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id;
        $lead = new Lead($id,$ss);
         $res =$lead->delete();
        return JDV::raw($res);
    }

    function deleteSpecial(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id;
        $lead = new Lead($id,$ss);
         $res =$lead->deleteSpecial();
        return JDV::raw($res);
    }
    
    function getDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id;
        $data = Lead::details($id,$ss,true);
        return JDV::result($data);
    }
    function updateStatus(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id;
        $lead = new Lead($id,$ss);
        $res =$lead->updateStatus($req->status_id,$id,$ss);
        return JDV::raw($res);
    }

    function convertToMerchant(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id;
        $lead = new Lead($id,$ss);
        $res =$lead->convertToMerchant($id,$ss);
        return JDV::raw($res);
    }

    function getFormOptions(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        $id = $req->id;
        $lead = new Lead($id,$ss);
        if($ss->status_code !==200) return JDV::raw($ss);
        $data = $lead->getFormOptions($id,$ss,true); 
        return JDV::result($data);
    }
}
