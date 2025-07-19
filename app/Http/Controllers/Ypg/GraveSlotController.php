<?php

namespace App\Http\Controllers\Ypg;

use App\Http\Controllers\Controller;
use App\Models\Ypg\GraveSlot;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class GraveSlotController extends Controller
{
    public function saveGrave(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->slot_id ?? $req->id;
        $grave = new GraveSlot($id, $ss);
        $res = $grave->saveGrave($req->all());
        return JDV::raw($res);
    }

    public function getListGrave(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $grave = new GraveSlot();
        return JDV::result($grave->getGraveList($req->all(), $ss));
    }

   public function getGraveDetails(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $grave = new GraveSlot();
        return JDV::result($grave->getGraveDetails($req->id, $ss));
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $grave = new GraveSlot();
        return JDV::result($grave->getFormOptions($req->id, $ss));
    }

    public function deleteGrave(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? null;
        $grave = new GraveSlot();
        $res = $grave->deleteGrave($id);
        return JDV::raw($res);
    }

    public function updateGraveStatus(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? null;
        $grave = new GraveSlot();
        $res = $grave->updateGraveStatus($req->status_id, $id,$ss);
        return JDV::raw($res);
    }
    function savePhoto(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->slot_id;
        $photo = $req->photo ?? $req->img;
        $res = GraveSlot::savePhoto($photo,null,$id,$ss);
        return JDV::raw($res);
    }
    function deletePhoto(Request $req){
        $ss = XAuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->slot_id ?? $req->id;
        $grave = new GraveSlot($id,$ss);
        $res = $grave->deletePhoto($id);
        return JDV::raw($res);
    }
       function getPhoto(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $id = $req->id ?? $req->slot_id;
        $img = GraveSlot::profilePicture($id, $ss);
        return JDV::result($img);
    }
}
