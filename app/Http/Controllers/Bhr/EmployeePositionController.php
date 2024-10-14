<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\EmployeePosition;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class EmployeePositionController extends Controller
{
    protected $employeePosition;
    public function __construct(EmployeePosition $employeePosition)
    {
        
        $this->employeePosition = $employeePosition;
    }

    public function saveEmpPosition(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->emp_position_id ?? $req->id;
        $employeePosition = new EmployeePosition($id, $ss);
        $res = $employeePosition->save($req->all());
        return JDV::raw($res);
    }

    public function getEmpPositionListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->employeePosition->getEmpPositionListPaginate($req->all(), $ss));
    }

    public function getDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->employeePosition->getDetails($req->id, $ss));
    }

    public function deleteEmpPosition(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        // Assuming id is passed in the request (POST body), access it like this
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->employeePosition->deleteEmpPosition($req->id, $ss));
    }

    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->employeePosition->getFormOptions($req->id, $ss));
    }

}
