<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use App\Models\Prm\AccessControl;
use JDV;

use XAuthService;
use Illuminate\Http\Request;

class AccessController extends Controller
{
    protected $accessControls;
    public function __construct()
    {
        $this->accessControls = new AccessControl();
    }

    public function createAccessCard(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->tenant_id;
        $accessControl = new AccessControl($id, $ss);
        $res = $accessControl->saveAccessCard($req->all(), $id, $ss);
        return JDV::raw($res);
    }

    public function getListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->accessControls->getListAccessCard($req->all(), $ss));
    }


   public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        // $req->all() or array should be passed here instead of just $req->id
        return JDV::result($this->accessControls->getFormOptions($req->all(), $ss));
    }

    public function searchCardHolder(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->accessControls->searchCardHolder($req->all(), $ss));
    }

    public function delete(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id;
        $res = $this->accessControls->deleteCard($id);
        return JDV::raw($res);
    }

   public function updateCardStatus(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->id ?? null;
        $status = $req->status ?? null;

        $res = $this->accessControls->updateStatusCard($status, $id, $ss);
        return JDV::raw($res);
    }

}
