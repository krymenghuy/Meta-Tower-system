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
        $id = $req->payroll_id ?? $req->id;
        $prn_code = $id ? 473 : 474;
        $ss = AuthService::verifyAuth($req, $prn_code);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $payroll = new Payroll($id, $ss);
        $res = $payroll->save($req->all());
        return JDV::raw($res);
    }

    public function getStaffList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $id = $req->payroll_id ?? $req->id;
        $payroll = new Payroll($id,$ss);
        $data = $payroll->getStaffList($req->all(),$id,$ss);
        return JDV::result($data);
    }

    public function disburseAll(Request $req)
    {
        $ss = AuthService::verifyAuth($req, 476);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->payroll_id ?? $req->id;
        $payroll = new Payroll($id,$ss);
        $res = $payroll->disburseAll($id,$ss);
        return JDV::raw($res);
    }
    public function reset(Request $req)
    {
        $ss = AuthService::verifyAuth($req, 475);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $var = new Payroll();
        $id = $req->id;
        return JDV::result($var->reset($id, $ss));
    }
   
    public function calculatePayroll(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->payroll_id;
        $payroll = new Payroll($id,$ss);
        $res =  $payroll->calculate($id, $ss);
        return JDV::raw($res);
    }

    public function importStaffList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->payroll_id;
        $payroll = new Payroll($id,$ss);
        $res = $payroll->importStaffList($id, $ss);
        return JDV::raw($res);
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
        return JDV::result($this->payrollModel->getDetails($req->id));
    }


    public function deletePayroll(Request $req)
    {
        $ss = AuthService::verifyAuth($req, 478);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->payrollModel->delete($req->id);
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

    public function authorizePayroll(Request $req)
    {
        $ss = AuthService::verifyAuth($req, 474);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->id ? $req->id : $req->id;
        $payroll = new Payroll($id, $ss);
        $res = $payroll->authorize($id,$ss);

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
