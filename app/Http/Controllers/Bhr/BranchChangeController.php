<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\BranchChange;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class BranchChangeController extends Controller
{
    protected $branchChange;

    public function __construct(BranchChange $branchChange)
    {
        $this->branchChange = $branchChange;
    }

    public function saveBranchChange(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->branch_change_id ?? $req->id;
        $branchChange = new BranchChange($id, $ss);
        $res = $branchChange->save($req->all());
        return JDV::raw($res);
    }

    public function getBranchChangeListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->branchChange->getBranchChangeListPaginate($req->all(), $ss));
    }

    public function getDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->branchChange->getDetails($req->id, $ss));
    }

    public function deleteBranchChange(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        // Assuming id is passed in the request (POST body), access it like this
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->branchChange->deleteBranchChange($req->id, $ss));
    }

    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->branchChange->getFormOptions($req->id, $ss));
    }
}
