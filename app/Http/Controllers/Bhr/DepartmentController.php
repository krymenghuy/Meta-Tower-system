<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Bhr\Department;
use App\Services\Umt\AuthService;
use App\Models\JDV;

class DepartmentController extends Controller
{
    protected $departmentModel;
    public function __construct(Department $department)
    {
        $this->departmentModel = $department;
    }
    function saveDepartment(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);

        if ($ss->status_code != 200) return JDV::raw($ss);
        $department = new Department($req->id, $ss);
        $res = $department->save($req->all());
        return JDV::raw($res);
    }

    function getDepartmentList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code != 200) return JDV::raw($ss);
        $department = new Department($req->id, $ss);
        $data = $department->getList($ss);
        return JDV::result($data);
    }

    function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code != 200) return JDV::raw($ss);
        $id = $req->id;
        $data = Department::getFormOptions($id, $ss);
        return JDV::result($data);
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
        return JDV::result($this->departmentModel->getDetails($req->id, $ss));
    }
    function  deleteDepartment(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code != 200) return JDV::raw($ss);
        $department = new Department($req->id, $ss);
        $res = $department->deleteDepartment($req->id);
        return JDV::raw($res);
    }
    public function getDepartmentListPaginate(Request $req){
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code!= 200) return JDV::raw($ss);
        $department = new Department($req->id, $ss);
        $data = $department->getDepartmentListPaginate($req->all(), $ss);
        return JDV::result($data);
    }
}