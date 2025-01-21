<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\DocumentType;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class DocumentTypeController extends Controller
{
    protected $document_types;
    public function __construct()
    {
        $this->document_types = new DocumentType();
    }
    function save(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $res = $this->document_types->save($req->doc, $ss, $req->all());
        return JDV::raw($res);
    }
    public function getList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->document_types->getList($req->all(), $ss));
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
        return JDV::result($this->document_types->getDetails($req->id, $ss));
    }
    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->document_types->getFormOptions($req->id, $ss));
    }

    public function delete(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->document_types->delete($req->id, $ss);
        return JDV::raw($res);
    }
    public function listDocumentType(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $document_types = new DocumentType();
        return JDV::result($document_types->getDocumentType($req->all(), $ss));
    }
}
