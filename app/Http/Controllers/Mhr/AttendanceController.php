<?php

namespace App\Http\Controllers\Mhr;

use App\Http\Controllers\Controller;
use App\Models\Mhr\Attendance;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    protected $attendance;

    public function __construct()
    {
        $this->attendance = new Attendance();
    }

    public function saveAttendance(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, 247);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $id = $req->id;

        // $id = $req->attendance_id ?? $req->id;
        $attendance = $this->attendance->save($req->all(),$id, $ss);

        return JDV::raw($attendance);
    }

    public function attendanceList(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200)  return JDV::raw($ss);
        $list = $this->attendance->attendanceList($req->all(),$ss);

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
        return JDV::result($this->attendance->getDetails($req->id, $ss));
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
        $res = $this->attendance->deleteAttendance($req->id, $ss);
        return JDV::raw($res);
    }
    public function getStaffAttendanceListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->attendance->getStaffAttendanceListPaginate($req->all(), $ss));
    }
    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->attendance->getFormOptions($req->id, $ss));
    }

    function scanAttendance(Request $req){
        $branch_id =null;
        $subs_id = getCurrentSubsId(true);
        $ss = (object)['subs_id'=>$subs_id,'branch_id'=>$branch_id,'lang'=>'en'];
        $instance = new Attendance(null,$ss);
        $save = $instance->scanAttendance($req->all(),$ss);
        return JDV::raw($save);
    }

    function getLastEmployeesScan(Request $req){
        $branch_id =null;
        $subs_id = getCurrentSubsId(true);
        $ss = (object)['subs_id'=>$subs_id,'branch_id'=>$branch_id,'lang'=>'en'];
        $instance = new Attendance(null,$ss);
        $save = $instance->getLastEmployeesScan($req->all(),$ss);
        return JDV::raw($save);
    }



}
