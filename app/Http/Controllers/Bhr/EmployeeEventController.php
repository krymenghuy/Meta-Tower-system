<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\EmployeeEvent;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class EmployeeEventController extends Controller
{
    protected $EmployeeEvent;

    public function __construct(EmployeeEvent $EmployeeEvent)
    {
        $this->EmployeeEvent = $EmployeeEvent;
    }

    public function saveEmpEvent(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->EmployeeEvent->save($req->all(), $ss));
    }

    public function getEmpEventListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->EmployeeEvent->getEventListPaginate($req->all(), $ss));
    }

    public function getDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->EmployeeEvent->getDetails($req->id, $ss));
    }

    public function deleteEmpEvent(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        // Assuming id is passed in the request (POST body), access it like this
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->EmployeeEvent->deleteEmpEvent($req->id, $ss));
    }

    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->EmployeeEvent->getFormOptions($req->id, $ss));
    }

}
