<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Bhr\LeaveManagement;
use App\Models\JDV;
use App\Services\Umt\AuthService;

class LeaveManagementController extends Controller
{
    protected $leave=null;
    public function __construct(){
        $this->leave = new LeaveManagement();
    }

    public function save(Request $req)
    {
        $id = $req->id;
        // $prn_code = $id ? 306:305;
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $save = $this->leave->save($req->all(),$id,$ss);

        return JDV::raw($save);
    }

    public function getLeaveListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $data = $this->leave->getLeaveListPaginate($req->all(),$ss);

        return JDV::result($data);
    }

    public function getDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $leave = $this->leave->getDetails($req->id,$ss);

        return JDV::result($leave);
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
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $leave = $this->leave->getFormOptions($req->id,$ss);

        return JDV::result($leave);
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