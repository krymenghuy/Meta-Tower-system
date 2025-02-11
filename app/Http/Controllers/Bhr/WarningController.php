<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\GeneralSettings;
use App\Models\Bhr\Warning;
use Illuminate\Http\Request;
use JDV;
use XAuthService;

class WarningController extends Controller
{
    protected $warnings;

    public function __construct()
    {
        $this->warnings = new Warning();
    }

    public function saveWarning(Request $req)
    {
        $id = $res->warning_id ?? $req->id;
        $prn_code = $id ? 244 : 245;
        $ss = XAuthService::verifyAuth($req, $prn_code);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $warning = new Warning($id, $ss);
        $res = $warning->save($req->all());
        return JDV::raw($res);
    }

    public function getWarningListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->warnings->getWarningsListPaginate($req->all(), $ss));
    }
    public function warningList(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $war = new Warning();
        return JDV::result($war->warningList($req->all(), $ss));
    }
    public function deleteWarning(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, 246);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->warnings->delete($req->id, $ss);
        return JDV::raw($res);

    }
    public function getDetails(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $warning = new Warning();
        return JDV::result($warning->getDetails($req->id, $ss));
    }
    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->warnings->getFormOptions($req->id, $ss));
    }

}
