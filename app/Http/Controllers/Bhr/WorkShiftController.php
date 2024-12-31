<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\WorkShift;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class WorkShiftController extends Controller
{
    protected $workShiftModel;

    public function __construct()
    {
        $this->workShiftModel = new WorkShift();
    }

    public function saveWorkShift(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->work_shift_id ?? $req->id;
        $workShift = new WorkShift($id, $ss);
        $res = $workShift->save($req->all());
        return JDV::raw($res);
    }

    public function getWorkShiftListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->workShiftModel->getWorkShiftListPaginate($req->all(), $ss));
    }

    public function getDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->workShiftModel->getDetails($req->id, $ss));
    }

    public function deleteWorkShift(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->workShiftModel->delete($req->id, $ss);
        return JDV::raw($res);
    }

    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->workShiftModel->getFormOptions($req->id, $ss));
    }
}
