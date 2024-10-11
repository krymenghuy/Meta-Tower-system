<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\Attendance;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    protected $attandanceModel;

    public function __construct(Attendance $attandanceModel)
    {
        $this->attandanceModel = $attandanceModel;
    }

    public function saveAttendance(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->attendance_id ?? $req->id;
        $attendance = new Attendance($id, $ss);
        $res = $attendance->save($req->all());
        return JDV::raw($res);
    }

    public function getAttendanceListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->attandanceModel->getAttendanceListPaginate($req->all(), $ss));
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
        return JDV::result($this->attandanceModel->getDetails($req->id, $ss));
    }

    public function deleteAttendance(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        // Assuming id is passed in the request (POST body), access it like this
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->attandanceModel->deleteAttendance($req->id, $ss));
    }

    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->attandanceModel->getFormOptions($req->id, $ss));
    }
}
