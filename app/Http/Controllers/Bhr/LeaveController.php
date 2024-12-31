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

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }

        $res = $this->leave->delete($req->id, $ss);
        return JDV::raw($res);
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
        if ($ss->status_code !== 200) return JDV::raw($ss);

        $id = $req->id;
        $res = $this->leave->updateStatus($req->status_id, $id,$ss);

        return JDV::raw($res);
    }
    public function getLeaveList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $war = new Leave();
        return JDV::result($war->getLeaveList($req->all(), $ss));
    }
}
