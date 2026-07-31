<?php

namespace App\Http\Controllers\Mhr;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Mhr\Employee;
use JDV;
use XAuthService;

class EmployeeController extends Controller
{
    protected $employees;
    public function __construct()
    {
        $this->employees = new Employee();
    }
    public function saveEmployee(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->id ?? $req->employee_id;
        $emp = new Employee($id, $ss);

        $res = $emp->upsert($req->all());

        return JDV::raw($res);
    }

    function getListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->employees->getListPaginate($req->all(), $ss));
    }

    public function getDetails(Request $req){
        $ss = XAuthService::verifyAuth($req,-1);
        if($ss->status_code !== 200){
            return JDV::raw($ss);
        }
        if(!isset($req->id) || !is_numeric($req->id)){
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->employees->getDetails($req->id, $ss));
    }

    public function getFormOptions(Request $req){
        $ss = XAuthService::verifyAuth($req,-1);
        if($ss->status_code !== 200){
            return JDV::raw($ss);
        }
        return JDV::result($this->employees->getFormOptions($req->id, $ss));
    }

    public function setResign(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $emp_id = $req->emp_id ?? $req->id;
        $emp = new Employee($emp_id, $ss);
        $res = $emp->setResign($req->all(), $ss);
        return JDV::raw($res);
    }

    public function deleteEmployee(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->employees->deleteEmployee($req->id, $ss);
        return JDV::raw($res);
    }

    public function promoteStaff(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $id = $req->id ?? $req->emp_id;
        $employee = new Employee($id, $ss);
        $res = $employee->promoteStaff($req->all(), $id, $ss);
        return JDV::raw($res);
    }
}
