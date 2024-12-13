<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\ExitForm;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class ExitFormController extends Controller
{

    protected $emp_exit_items;
    public function __construct()
    {
        $this->emp_exit_items = new ExitForm();
    }
    function saveExitForm(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $res = $this->emp_exit_items->save($req->emp_exit_check_point, $ss, $req->all());
        return JDV::raw($res);
    }
    public function getExitFormPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->emp_exit_items->getExitFormPaginate($req->all(), $ss));
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
        return JDV::result($this->emp_exit_items->getDetails($req->id, $ss));
    }
    public function getExitFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->emp_exit_items->getFormOptions($req->id, $ss));
    }

    public function deleteExitForm(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->emp_exit_items->deleteExitForm($req->id, $ss));
    }
}
