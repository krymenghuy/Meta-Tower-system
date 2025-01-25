<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\Payroll;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class PayrollController extends Controller
{
    protected $payrollModel;
    public function __construct()
    {
        $this->payrollModel = new Payroll();
    }

    public function savePayroll(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->payroll_id ?? $req->id;
        $payroll = new Payroll($id, $ss);
        $res = $payroll->save($req->all());
        return JDV::raw($res);
    }

    public function reset(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $var = new Payroll();
        $id = $req->id?? $req->payroll_id;
        return JDV::result($var->reset($id, $ss));
    }
    public function reverseTransactions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $var = new Payroll();
        $id = $req->id?? $req->payroll_id;
        return JDV::result($var->reverseTransactions($id, $ss));
    }

    public function getPayrollListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->payrollModel->getList($req->all(), $ss));
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
        return JDV::result($this->payrollModel->getDetails($req->id, $ss));
    }


    public function deletePayroll(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->payrollModel->delete($req->id, $ss);
        return JDV::raw($res);
    }

    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->payrollModel->getFormOptions($req->id,$ss));
    }

    public function updateAuthorize(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->id ? $req->id : $req->id;
        $payroll = new Payroll($id, $ss);
        $res = $payroll->updateAuthorize($id,$ss);

        return JDV::raw($res);
    }

    public function updateDisburse(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->id ? $req->id : $req->id;
        $payroll = new Payroll($id, $ss);
        $res = $payroll->updateDisburse($id,$ss);

        return JDV::raw($res);
    }

    public function getEndDate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $payroll = new Payroll;
        $res = $payroll->getEndDate($ss);

        return JDV::success($res);
    }


}
