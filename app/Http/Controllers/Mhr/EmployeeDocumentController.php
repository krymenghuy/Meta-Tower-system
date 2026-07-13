<?php

namespace App\Http\Controllers\Mhr;

use App\Http\Controllers\Controller;
use App\Models\Mhr\EmployeeDocument;
use Illuminate\Http\Request;
use JDV;
use XAuthService;

class EmployeeDocumentController extends Controller
{
    protected $documents;

    public function __construct()
    {
        $this->documents = new EmployeeDocument();
    }

    public function getList(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $emp_id = $req->emp_id ?? $req->employee_id ?? null;
        if (!$emp_id || !is_numeric($emp_id)) {
            return JDV::error('Invalid employee ID');
        }

        return JDV::result(EmployeeDocument::getListByEmployee($emp_id, $ss));
    }

    public function save(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->id ?? $req->document_id ?? null;
        $document = new EmployeeDocument($id, $ss);
        $res = $document->upsert($req->all(), $id, $ss);

        return JDV::raw($res);
    }

    public function delete(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }

        $document = new EmployeeDocument($req->id, $ss);
        $res = $document->delete($req->id, $ss);

        return JDV::raw($res);
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

        return JDV::result($this->documents->getDetails($req->id, $ss));
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->id ?? null;

        return JDV::result($this->documents->getFormOptions($id, $ss));
    }

    public function download(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }

        $document = new EmployeeDocument($req->id, $ss);
        return JDV::raw($document->download($req->id, $ss));
    }
}
