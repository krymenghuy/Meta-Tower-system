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
        $employee = new Employee($id, $ss);

        $res = $employee->upsert($req->all());

        return JDV::raw($res);
    }


}
