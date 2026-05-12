<?php 
namespace App\Http\Controllers\Prm;
use App\Http\Controllers\Controller;
use App\Models\Prm\TenantDocument;
use Illuminate\Http\Request;
use JDV;
use XAuthService;

class TenantDocumentController extends Controller{
    protected $tenant_documents;
    
    public function __construct()
    {
        $this->tenant_documents = new TenantDocument();
    }
    // public function saveTenantDocument(Request $req)
    // {
    //     $ss = XAuthService::verifyAuth($req, -1);
    //     if ($ss->status_code !== 200) {
    //         return JDV::raw($ss);
    //     }

    //     $id = $req->id ?? $req->tenant_document_id ;
    //     $tenant_document = new TenantDocument($id, $ss);
    //     $res = $tenant_document->saveTenantDocument($req->all());

    //     return JDV::raw($res);
    // }
    public function saveTenantDocument(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->tenant_documents->saveTenantDocument($req->all(), $ss));
    }
    public function getListDocument(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);

        }
         return JDV::result($this->tenant_documents->getListDocument($req->all(),$ss));
    }

    public function getDetails(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !== 200){
            return JDV::raw($ss);
        }
        if(!isset($req->id) || !is_numeric($req->id)){
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->tenant_documents->getDetails($req->id));
    }
    public function getFormOptions(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !== 200){
            return JDV::raw($ss);
        }
        return JDV::result($this->tenant_documents->getFormOptions($req->id,$ss));
    }
    public function deleteTenantDocument(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        if(!isset($req->id) || !is_numeric($req->id)){
            return JDV::error('Invalid ID');
        }
        return JDV::raw($this->tenant_documents->deleteTenantDocument($req->id));
    }

    public function downloadDocument(Request $req) {
    $ss = XAuthService::verifyAuth($req, -1);
    if ($ss->status_code !== 200) {
        return JDV::raw($ss);
    }

    if (!isset($req->id) || !is_numeric($req->id)) {
        return JDV::error('Invalid ID');
    }

    $tenant_document = new TenantDocument($req->id, $ss);
    return JDV::raw($this->tenant_documents->downloadTenantDocument($req->id, $ss));
}

}