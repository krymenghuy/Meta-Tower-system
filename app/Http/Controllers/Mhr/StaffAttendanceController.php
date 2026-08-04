<?php

namespace App\Http\Controllers\Mhr;

use App\Http\Controllers\Controller;
use App\Models\Mhr\StaffAttendance;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class StaffAttendanceController extends Controller
{
    protected $staffAttendance;

    public function __construct()
    {
        $this->staffAttendance = new StaffAttendance();
    }

    public function saveAttendance(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->attendance_id;
        $staffAttendance = new StaffAttendance($id, $ss);

        $res = $staffAttendance->upsert($req->all());

        return JDV::raw($res);
    }

    public function attendanceList(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200)  return JDV::raw($ss);
        $list = $this->staffAttendance->attendanceList($req->all(),$ss);

        return JDV::result($list);
    }

    public function getDetails(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        // Assuming id is passed in the request (POST body), access it like this
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->staffAttendance->getDetails($req->id, $ss));
    }

    public function deleteAttendance(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->staffAttendance->deleteAttendance($req->id, $ss);
        return JDV::raw($res);
    }
    public function getStaffAttendanceListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->staffAttendance->getStaffAttendanceListPaginate($req->all(), $ss));
    }
    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->staffAttendance->getFormOptions($req->id, $ss));
    }

    function scanAttendance(Request $req){
        $branch_id =null;
        $subs_id = getCurrentSubsId(true);
        $ss = (object)['subs_id'=>$subs_id,'branch_id'=>$branch_id,'lang'=>'en'];
        $instance = new StaffAttendance(null,$ss);
        $save = $instance->scanAttendance($req->all(),$ss);
        return JDV::raw($save);
    }

    function getLastEmployeesScan(Request $req){
        $branch_id =null;
        $subs_id = getCurrentSubsId(true);
        $ss = (object)['subs_id'=>$subs_id,'branch_id'=>$branch_id,'lang'=>'en'];
        $instance = new StaffAttendance(null,$ss);
        $save = $instance->getLastEmployeesScan($req->all(),$ss);
        return JDV::raw($save);
    }



}
