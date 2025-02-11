<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\SalaryHistory;
use JDV;
use XAuthService;
use Illuminate\Http\Request;


class SalaryHistoryController extends Controller
{
    protected $salaryHistory;
    public function __construct()
    {
        $this->salaryHistory = new SalaryHistory();
    }

    public function saveSalaryHistory(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->salary_history_id ?? $req->id;
        $salaryHistory = new SalaryHistory($id, $ss);
        $res = $salaryHistory->save($req->all());
        return JDV::raw($res);
    }

    public function getSalaryHistoryListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->salaryHistory->getSalaryHistoryListPaginate($req->all(), $ss));
    }

    public function getDetails(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->salaryHistory->getDetails($req->id, $ss));
    }

    public function deleteSalaryHistory(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->salaryHistory->delete($req->id, $ss);
        return JDV::raw($res);
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->salaryHistory->getFormOptions($req->id, $ss));
    }
}
