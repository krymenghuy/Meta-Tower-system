<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use App\Models\Prm\AccessLog;
use JDV;

use XAuthService;
use Illuminate\Http\Request;

class AccessLogsController extends Controller
{
    protected $accessLogs;
    public function __construct()
    {
        $this->accessLogs = new AccessLog();
    }

    public function createAccessLog(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->tenant_id;
        $accessLog = new AccessLog($id, $ss);
        $res = $accessLog->saveAccessLog($req->all(), $id, $ss);
        return JDV::raw($res);
    }

    public function getListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->accessLogs->getListAccessLog($req->all(), $ss));
    }


}
