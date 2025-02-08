<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\EmployeeDocument;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class EmployeeDocumentController extends Controller
{
    protected $emp_doc;
    public function __construct()
    {
        $this->emp_doc = new EmployeeDocument();
    }

    public function saveEmployeeDocument(Request $req)
    {
        $ss = AuthService::verifyAuth($req, 501);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return $this->emp_doc->save($req, $ss);
    }

    public function getEmployeeDocumentListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->emp_doc->listpaginate($req, $ss));
    }

    public function getDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->emp_doc->getDetails($req->id, $ss));
    }

    public function deleteEmployeeDocument(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if(!isset($req->id) || !is_numeric($req->id)){
            return JDV::error('Invalid ID');
        }
        $res = $this->emp_doc->delete($req->id, $ss);
        return JDV::raw($res);
    }

    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->emp_doc->getFormOptions($req->id, $ss));
    }

    public function downloadDocument(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->emp_doc->downloadDocument($req->id, $ss));
    }
}
