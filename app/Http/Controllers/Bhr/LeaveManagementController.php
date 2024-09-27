<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Bhr\LeaveManagement;
use App\Models\JDV;
use App\Services\Umt\AuthService;

class LeaveManagementController extends Controller
{
    protected $leavemanagement;
    public function __construct(){
        $this->leavemanagement = new LeaveManagement();
    }

    public function saveLeaveManagement(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return $this->leavemanagement->save($req->all(), $ss);
    }

    public function getLeaveManagementListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->leavemanagement->getLeaveManagementListPaginate($req->all(), $ss));
    }

    public function getDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return $this->leavemanagement->getDetails($req->id, $ss);
    }



    public function deleteLeaveManagement(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->leavemanagement->delete($req->id, $ss));
    }

    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->leavemanagement->getFormOptions($req->id, $ss));
    }

   public function updateStatus(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->id ? $req->id : $req->id;
        $leave = new LeaveManagement($id, $ss);
        $res = $leave->updateStatus($req->action_id, $id);

        return JDV::raw($res);
    }
}
