<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\Department;
use App\Models\JDV;
use App\Services\Umt\AuthService;
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
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? null;

        $res = $this->departmentModel->save($req->all(),$id,$ss);
        return JDV::raw($res);
    }

    public function getList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->departmentModel->getList($req->all(), $ss));
    }


    public function getDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->departmentModel->getDetails($req->id, $ss));
    }

    public function deleteDepartment(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        // Assuming id is passed in the request (POST body), access it like this
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res =  $this->departmentModel->deleteDepartment($req->id, $ss);
        return JDV::raw($res);
        return JDV::raw($this->departmentModel->deleteDepartment($req->id, $ss)); //THIS IS WRONG. DO not use ::result() for DELETE or UPDATE
    }

    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->departmentModel->getFormOptions($req->id, $ss));
    }
}
