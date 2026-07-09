<?php

namespace App\Http\Controllers\Mhr;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Mhr\PayrollList;
use JDV;
use XAuthService;

class PayrollListController extends Controller
{
     protected $payrollListModel;
    public function __construct()
    {
        $this->payrollListModel = new PayrollList();
    }

    public function getDetails(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        // Assuming id is passed in the request (POST body), access it like this
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->payrollListModel->getDetails($req->id, $ss));
    }

    public function delete(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, 215);
        if ($ss->status_code !== 200)  return JDV::raw($ss);
        $id = $req->id;
        $res = $this->payrollListModel->delete($id);
        return JDV::raw($res);
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->payrollListModel->getFormOptions($req->id, $ss));
    }

    // public function disburseOne(Request $req)
    // {
    //     $ss = XAuthService::verifyAuth($req, -1);
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
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->payrollListModel->paySlip($req->all(), $ss));
    }

    public function addDeduction(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, 214);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->payroll_list_id ?? $req->id;
        $payrollList = new PayrollList($id, $ss);
        $res = $payrollList->addDeduction($req->all());
        return JDV::raw($res);
    }
}
