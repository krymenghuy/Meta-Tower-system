<?php

namespace App\Http\Controllers\Mhr;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Mhr\Leave;
use JDV;
use XAuthService;
class LeaveController extends Controller
{
    protected $leaves;
    public function __construct()
    {
        $this->leaves = new Leave();
    }

    public function saveLeave(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->id ?? $req->leave_id;
        $leave = new Leave($id, $ss);

        $res = $leave->upsert($req->all());

        return JDV::raw($res);
    }
    
    function getLeaveListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->leaves->getLeaveListPaginate($req->all(), $ss));
    }
    public function getLeaveUninformList(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $data = $this->leaves->getLeaveUninformList($req->all(),$ss);

        return JDV::result($data);
    }
    public function getDetails(Request $req){
        $ss = XAuthService::verifyAuth($req,-1);
        if($ss->status_code !== 200){
            return JDV::raw($ss);
        }
        if(!isset($req->id) || !is_numeric($req->id)){
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->leaves->getDetails($req->id, $ss));
    }

    public function getFormOptions(Request $req){
        $ss = XAuthService::verifyAuth($req,-1);
        if($ss->status_code !== 200){
            return JDV::raw($ss);
        }
        return JDV::result($this->leaves->getFormOptions($req->id, $ss));
    }
     public function delete(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, 242);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }

        $res = $this->leaves->delete($req->id, $ss);
        return JDV::raw($res);
    }
    public function updateStatus(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, 321);
        if ($ss->status_code !== 200) return JDV::raw($ss);

        $id = $req->id;
        $res = $this->leaves->updateStatus($req->status_id, $id,$ss);

        return JDV::raw($res);
    }

    function acceptLeave(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, 321);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::raw($this->leaves->acceptLeave($req->all(), $ss));
    }

    function rejectLeave(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::raw($this->leaves->rejectLeave($req->all(), $ss));
    }
}
