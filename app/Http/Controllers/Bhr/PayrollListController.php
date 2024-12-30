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

    public function savePayrollList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->payroll_list_id ?? $req->id;
        $payrollList = new PayrollList($id, $ss);
        $res = $payrollList->save($req->all());
        return JDV::raw($res);
    }

    public function getPayrollListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->payrollListModel->getPayrollListPaginate($req->all(), $ss));
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


    public function deletePayrollList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        // Assuming id is passed in the request (POST body), access it like this
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->payrollListModel->deletePayrollList($req->id, $ss));
    }

    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->payrollListModel->getFormOptions($req->id, $ss));
    }

    public function importPayrollList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $res = $this->payrollListModel->importPayrollList($req->all(), $ss);
        return JDV::raw($res); 
        //Please DO NOT use JDV::result() for UPDATE or DELETE
        //return JDV::result($this->payrollListModel->importPayrollList($req->all(), $ss));
    }

    public function calculatePayrollList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $res =  $this->payrollListModel->calculatePayrollList($req->all(), $ss);
        return JDV::raw($res);
    }

    public function disbursePayrollList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $res = ($this->payrollListModel->disbursePayrollList($req->all(), $ss));
        return JDV::raw($res);
    }

    public function disburseAllPayrollList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $res = ($this->payrollListModel->disburseAllPayrollList($req->all(), $ss));
        return JDV::raw($res);
    }
    public function paySlip(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->payrollListModel->paySlip($req->all(), $ss));
    }

}
