<?php

namespace App\Http\Controllers\Mhr;

use App\Http\Controllers\Controller;
use App\Models\Mhr\ShiftDetails;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class ShiftDetailsController extends Controller
{
    protected $shiftDetailsModel;
    public function __construct()
    {
        $this->shiftDetailsModel = new ShiftDetails();
    }

    public function saveShiftDetails(Request $req)
    {
        $id = $req->shift_details_id ?? $req->id;
        $prn_code = $id ? 487 : 488;
        $ss = XAuthService::verifyAuth($req, $prn_code);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $shiftDetails = new ShiftDetails($id, $ss);
        $res = $shiftDetails->save($req->all());
        return JDV::raw($res);
    }

    public function getShiftDetailsListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->shiftDetailsModel->getShiftDetailsListPaginate($req->all(), $ss));
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
        return JDV::result($this->shiftDetailsModel->getDetails($req->id, $ss));
    }

    public function deleteShiftDetails(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, 489);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->shiftDetailsModel->deleteShiftDetails($req->id);
        return JDV::raw($res);
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->shiftDetailsModel->getFormOptions($req->id, $ss));
    }
    public function getShiftDetail(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $war = new ShiftDetails();
        return JDV::result($war->getShiftDetail($req->all(), $ss));
    }
}
