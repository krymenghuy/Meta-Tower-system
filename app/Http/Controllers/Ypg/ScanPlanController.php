<?php

namespace App\Http\Controllers\Ypg;

use App\Http\Controllers\Controller;
use App\Models\Ypg\ScanPlan;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class ScanPlanController extends Controller
{
    protected $scanplanModel;

    public function __construct()
    {
        $this->scanplanModel = new ScanPlan();
    }

    public function saveScanPlan(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->scan_plan_id ?? $req->id;
        $scanPlan = new ScanPlan($id, $ss);
        $res = $scanPlan->save($req->all());
        return JDV::raw($res);
    }

    public function getScanPlanListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->scanplanModel->getScanPlanListPaginate($req->all(), $ss));
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
        return JDV::result($this->scanplanModel->getDetails($req->id, $ss));
    }

    public function deleteScanPlan(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->scanplanModel->deleteScanPlan($req->id, $ss);
        return JDV::raw($res);
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->scanplanModel->getFormOptions($req->id, $ss));
    }
}
