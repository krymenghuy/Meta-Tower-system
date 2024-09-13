<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\Staff;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class StaffController extends Controller
{
    protected $staffModel;

    public function __construct(Staff $staff)
    {
        $this->staffModel = $staff;
    }

    public function saveStaff(Request $req)
    {
        $ss = AuthService::verifyAuth($req, 253);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->staff_id ?? $req->id;
        $staff = new Staff($id, $ss);
        $res = $staff->save($req->all());

        return JDV::raw($res);
    }

    public function getListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->staffModel->getListPaginate($req->all(), $ss));
    }
    public function getListAll(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->staffModel->getListAll( $ss));
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

        // Call the staff model method and pass the id directly
        return JDV::result($this->staffModel->getDetails($req->id, $ss));
    }

    public function deleteStaff(Request $req)
    {
        $ss = AuthService::verifyAuth($req, 253);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->staffModel->deleteStaff($req->id, $ss));
    }


}
