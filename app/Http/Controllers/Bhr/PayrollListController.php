<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\PayrollList;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class PayrollListController extends Controller
{
    protected $payrollListModel;
    public function __construct()
    {
        $this->payrollListModel = new PayrollList();
    }

    public function getDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        // Assuming id is passed in the request (POST body), access it like this
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->payrollListModel->getDetails($req->id, $ss));
    }

    public function removeStaff(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200)  return JDV::raw($ss);
        $id = $req->id;
        $res = $this->payrollListModel->removeStaff($id, $ss);
        return JDV::raw($res);
    }

    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->payrollListModel->getFormOptions($req->id, $ss));
    }

    // public function disburseOne(Request $req)
    // {
    //     $ss = AuthService::verifyAuth($req, -1);
    //     if ($ss->status_code !== 200) {
    //         return JDV::raw($ss);
    //     }
    //     $id = $req->id;
    //     //$payroll_id = $req->payroll_id;
    //     //$emp_id = $req->emp_id;
    //     $res = ($this->payrollListModel->disburseOne($id, $ss));
    //     return JDV::raw($res);
    // }

    public function paySlip(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->payrollListModel->paySlip($req->all(), $ss));
    }

    public function addDeduction(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->payroll_list_id ?? $req->id;
        $payrollList = new PayrollList($id, $ss);
        $res = $payrollList->addDeduction($req->all());
        return JDV::raw($res);
    }


}
