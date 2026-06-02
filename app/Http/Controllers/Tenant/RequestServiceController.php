<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant\RequestService;
use Illuminate\Http\Request;
use XAuthService;
use JDV;

class RequestServiceController extends Controller
{
    protected $request_service;

    public function __construct()
    {
        $this->request_service = new RequestService();
    }

    // Save or update   
    public function saveServiceRequest(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->request_id;

        $params = $req->all();
        if (isset($ss->tenant_id) && $ss->tenant_id) {
            $params['tenant_id'] = $ss->tenant_id;
        }
        $res = $this->request_service->upsert($params, $ss);
        return JDV::raw($res);
    }

    // Get paginated list
    public function getServiceRequestList(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $params = $req->all();

        if (isset($ss->tenant_id) && $ss->tenant_id) {
            $params['tenant_id'] = $ss->tenant_id;
        }

        return JDV::result($this->request_service->getServiceRequestList($req->all(), $ss));
    }

    // public function serviceRequestDetails(Request $req, $id = null)
    // {
    //     $ss = XAuthService::verifyAuth($req, -1);
    //     if ($ss->status_code !== 200) {
    //         return JDV::raw($ss);
    //     }
    //     if (!isset($req->id) || !is_numeric($req->id)) {
    //         return JDV::error('Invalid ID');
    //     }
    //     return JDV::result($this->serviceRequest->getServiceRequestDetails($req->id));
    // }

    public function serviceRequestDetails(Request $req, $id = null)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $id ?? $req->id;
        if (!$id || !is_numeric($id)) {
            return JDV::error('Invalid ID');
        }
        $details = ServiceRequest::getServiceRequestDetails($id);
        return JDV::result($details);
    }

    // Delete service request
    public function delete(Request $req, $id = null)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $id ?? $req->id;
        if (!$id || !is_numeric($id)) {
            return JDV::error('Invalid ID provided');
        }
        $result = $this->request_service->deleteById($id, $ss);
        return JDV::raw($result);
    }

    //  GetFromOption
        public function getFormOptions(Request $req){
            $ss = XAuthService::verifyAuth($req, -1);
            if($ss->status_code !==200){
                return JDV::raw($ss);
            }
            return JDV::result($this->request_service->getFormOptions($req->all(),$ss));
        }

    function acceptRequest(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::raw($this->request_service->acceptRequest($req->all(), $ss));
    }
    function rejectRequest(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::raw($this->request_service->rejectRequest($req->all(), $ss));
    }
    function completeRequest(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::raw($this->request_service->completeRequest($req->all(), $ss));
    }



}
