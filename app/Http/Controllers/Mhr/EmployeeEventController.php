<?php

namespace App\Http\Controllers\Mhr;

use App\Http\Controllers\Controller;
use App\Models\Mhr\EmployeeEvent;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class EmployeeEventController extends Controller
{
    protected $EmployeeEvent;

    public function __construct()
    {
        $this->EmployeeEvent = new EmployeeEvent();
    }

    public function saveEmpEvent(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->EmployeeEvent->save($req->all(), $ss));
    }

    public function getEmpEventListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->EmployeeEvent->getEventListPaginate($req->all(), $ss));
    }

    public function getDetails(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->EmployeeEvent->getDetails($req->id, $ss));
    }

    public function deleteEmpEvent(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->EmployeeEvent->deleteEmpEvent($req->id, $ss);
        return JDV::raw($res);
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->EmployeeEvent->getFormOptions($req->id, $ss));
    }

}
