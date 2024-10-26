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
    public function __construct(Payroll $payroll)
    {
        $this->payrollModel = $payroll;
    }

    public function savePayroll(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return $this->payrollModel->save($req->all(), $ss);
    }

    public function getPayrollList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->payrollModel->getPayrollList( $ss));
    }

    public function getPayrollListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->payrollModel->getPayrollListPaginate($req->all(), $ss));
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
        // Assuming id is passed in the request (POST body), access it like this
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->payrollModel->deletePayroll($req->id, $ss));
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

}
