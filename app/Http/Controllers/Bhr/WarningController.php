<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\GeneralSettings;
use App\Models\Bhr\Warning;
use Illuminate\Http\Request;
use App\Models\JDV;
use App\Services\Umt\AuthService;

class WarningController extends Controller
{
    protected $warnings;

    public function __construct()
    {
        $this->warnings = new Warning();
    }

    public function saveWarning(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return $this->warnings->saveWarnings($req->all(), $ss);
    }

    public function getWarningListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->warnings->getWarningsListPaginate($req->all(), $ss));
    }
    public function warningList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $war = new Warning();
        return JDV::result($war->warningList($req->all(), $ss));
    }
    public function deleteWarning(Request $req)
    {
        // Verify the user's authentication status
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss); // Return error response if not authenticated
        }

        // Call the delete method on the model
        $result = $this->warnings->deleteWarning($req->id, $ss);

        return $result; // Return the result from the model
    }
    public function getDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $warning = new Warning();
        return JDV::result($warning->getDetails($req->id, $ss));
    }
    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->warnings->getFormOptions($req->id, $ss));
    }

}
