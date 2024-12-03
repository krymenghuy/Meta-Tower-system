<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\ShiftDetails;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class ShiftDetailsController extends Controller
{
    protected $shiftDetailsModel;
    public function __construct(ShiftDetails $shiftDetailsModel)
    {
        $this->shiftDetailsModel = $shiftDetailsModel;
    }

    public function saveShiftDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->shift_details_id ?? $req->id;
        $shiftDetails = new ShiftDetails($id, $ss);
        $res = $shiftDetails->save($req->all());
        return JDV::raw($res);
    }

    public function getShiftDetailsListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->shiftDetailsModel->getShiftDetailsListPaginate($req->all(), $ss));
    }

    public function getDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        // Assuming id is passed in the request (POST body), access it like this
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->shiftDetailsModel->getDetails($req->id, $ss));
    }

    public function deleteShiftDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        // Assuming id is passed in the request (POST body), access it like this
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->shiftDetailsModel->deleteShiftDetails($req->id, $ss));
    }

    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->shiftDetailsModel->getFormOptions($req->id, $ss));
    }
    public function getShiftDetail(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $war = new ShiftDetails();
        return JDV::result($war->getShiftDetail($req->all(), $ss));
    }
}
