<?php

namespace App\Http\Controllers\Ypg;

use App\Http\Controllers\Controller;
use App\Models\Ypg\GraveSlot;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class GraveSlotController extends Controller
{
    public function save(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->slot_id ?? $req->id;
        $slot = new GraveSlot($id, $ss);
        $res = $slot->save($req->all());
        return JDV::raw($res);
    }

    public function getList(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $slot = new GraveSlot();
        return JDV::result($slot->getList($req->all(), $ss));
    }

   public function getDetails(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $slot = new GraveSlot();
        return JDV::result($slot->getDetails($req->id, $ss));
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $slot = new GraveSlot();
        return JDV::result($slot->getFormOptions($req->id, $ss));
    }

    public function delete(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? null;
        $slot = new GraveSlot();
        $res = $slot->delete($id);
        return JDV::raw($res);
    }

    public function updateStatus(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? null;
        $slot = new GraveSlot();
        $res = $slot->updateStatus($req->status_id, $id,$ss);
        return JDV::raw($res);
    }
}
