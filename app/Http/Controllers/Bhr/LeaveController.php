<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Bhr\Leave;
use App\Models\JDV;
use App\Services\Umt\AuthService;

class LeaveController extends Controller
{
    protected $leave=null;
    public function __construct(){
        $this->leave = new Leave();
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



    public function delete(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->leave->delete($req->id, $ss));
    }

    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $data = $this->leave->getFormOptions($req->id,$ss);
        return JDV::result($data);
    }

   public function updateStatus(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->id ? $req->id : $req->id;
        $leave = new Leave($id, $ss);
        $res = $leave->updateStatus($req->action_id, $id);

        return JDV::raw($res);
    }
}
