<?php

namespace App\Http\Controllers\Mhr;

use App\Http\Controllers\Controller;
use App\Models\Mhr\Department;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    protected $departmentModel;
    public function __construct()
    {
        $this->departmentModel = new Department();
    }

    public function saveDepartment(Request $req)
    {
        $id = $req->id ?? null;
        $prn_code = $id ? 216 : 217;
        $ss = XAuthService::verifyAuth($req, $prn_code);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $res = $this->departmentModel->save($req->all(),$id,$ss);
        return JDV::raw($res);
    }

    public function getList(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->departmentModel->getList($req->all(), $ss));
    }


    public function getDetails(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->departmentModel->getDetails($req->id));
    }

    public function deleteDepartment(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, 218);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res =  $this->departmentModel->deleteDepartment($req->id);
        return JDV::raw($res);
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->departmentModel->getFormOptions($req->id, $ss));
    }
}
