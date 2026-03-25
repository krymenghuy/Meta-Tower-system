<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use App\Models\Prm\Maintenance;
use Illuminate\Http\Request;
use XAuthService;
use JDV;

class MaintenanceController extends Controller
{
    protected $maintenance;

    public function __construct()
    {
        $this->maintenance = new Maintenance();
    }

    public function save(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? null;
        $res = $this->maintenance->upsert($req->all(), $id, $ss);
        return JDV::raw($res);
    }

    public function getListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->maintenance->getMaintenanceList($req->all(), $ss));
    }

    public function details(Request $req, $id = null)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $id ?? $req->id;
        if (!$id || !is_numeric($id)) {
            return JDV::error('Invalid ID');
        }
        $details = Maintenance::getMaintenanceDetails($id);
        return JDV::result($details);
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->maintenance->getFormOptions($req->all(), $ss));
    }

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
        $result = $this->maintenance->deleteById($id);
        return JDV::raw($result);
    }

    public function setStatus(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::raw($this->maintenance->setStatus($req->all(), $ss));
    }

    public function finishBySpace(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::raw($this->maintenance->finishBySpaceId($req->all(), $ss));
    }

    public function finishByAmenity(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::raw($this->maintenance->finishByAmenityId($req->all(), $ss));
    }
}
