<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use App\Models\Prm\ServiceRequest;
use Illuminate\Http\Request;
use XAuthService;
use JDV;


class ServiceRequestController extends Controller{
    protected $serviceRequest;
    public function __construct(){
        $this->serviceRequest = new ServiceRequest();
    }

    // save or update
    public function saveServiceRequest(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $id = $req->id ?? null;
        $res = $this->serviceRequest->upsert($req->all(), $id, $ss);
        return JDV::raw($res);
    }
    // Get paginated
    public function getServiceRequestListPaginate(Request $req){
        $ss = XAuthService::verifyAuth($req,-1);
        if($ss->status_code !==200){
            return JDV::raw($ss);

        }
        return JDV::result($this->serviceRequest->getServiceRequest($req->all(),$ss));
    }

    public function getDetails(Request $req, $id = null)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $id ?? $req->id;
        if (!$id || !is_numeric($id)) {
            return JDV::error('Invalid ID provided');
        }

        // You need to add getDetails() method to your model
        $result = $this->serviceRequest->getDetails($id);
        return JDV::result($result);
    }
    // delete service
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

        $result = $this->serviceRequest->delete($id);
        return JDV::raw($result);
    }




}
