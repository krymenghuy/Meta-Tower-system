<?php

namespace App\Http\Controllers\Mhr;

use App\Models\Mhr\Warning;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use XAuthService;
use JDV;

class WarningController extends Controller
{
    protected $warnings;

    public function __construct()
    {
        $this->warnings = new Warning();
    }

    public function saveWarning(Request $request)
    {
        $ss = XAuthService::verifyAuth($request, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $request->id ?? $request->warning_id;
        $warning = new Warning($id, $ss);
        $res = $warning->upsert($request->all());
        return JDV::raw($res);
    }

    public function getWarningListPaginate(Request $request)
    {
        $ss = XAuthService::verifyAuth($request, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->warnings->getWarningListPaginate($request->all(), $ss));
    }

    public function getDetails(Request $request)
    {
        $ss = XAuthService::verifyAuth($request, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        if (!isset($request->id) || !is_numeric($request->id)) {
            return JDV::error('Invalid ID');
        }

        return JDV::result($this->warnings->getDetails($request->id, $ss));
    }

    public function delete(Request $request)
    {
        $ss = XAuthService::verifyAuth($request, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        if (!isset($request->id) || !is_numeric($request->id)) {
            return JDV::error('Invalid ID');
        }

        $res = $this->warnings->delete($request->id, $ss);
        return JDV::raw($res);
    }

    public function getFormOptions(Request $request)
    {
        $ss = XAuthService::verifyAuth($request, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->warnings->getFormOptions($request->id, $ss));
    }

    public function updateStatus(Request $request)
    {
        return JDV::error('Not implemented');
    }

    public function warningList(Request $request)
    {
        return JDV::error('Not implemented');
    }
}
