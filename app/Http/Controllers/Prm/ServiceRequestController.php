<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use App\Models\Prm\ServiceRequest;
use Illuminate\Http\Request;
use XAuthService;
use JDV;

class ServiceRequestController extends Controller
{
    protected $serviceRequest;

    public function __construct()
    {
        $this->serviceRequest = new ServiceRequest();
    }

    // Save or update
    public function saveServiceRequest(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->id ?? null;
        $res = $this->serviceRequest->upsert($req->all(), $id, $ss);
        return JDV::raw($res);
    }

    // Get paginated list
    public function getServiceRequestList(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->serviceRequest->getServiceRequestList($req->all(), $ss));
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
        $result = $this->serviceRequest->deleteById($id, $ss);
        return JDV::raw($result);
    }

 //  GetFromOption
        public function getFormOptions(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        return JDV::result($this->serviceRequest->getFormOptions($req->all(),$ss));
    }

     function setRequestStatus(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::raw($this->serviceRequest->setRequestStatus($req->all(), $ss));
    }



}
