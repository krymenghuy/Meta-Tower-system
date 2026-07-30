<?php

namespace App\Http\Controllers\Mhr;

use App\Models\Mhr\Deduction;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use XAuthService;
use JDV;

class DeductionController extends Controller
{
    protected $deductions;

    public function __construct()
    {
        $this->deductions = new Deduction();
    }

    public function saveDeduction(Request $request)
    {
        $ss = XAuthService::verifyAuth($request, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $request->id ?? $request->deduction_id;
        $deduction = new Deduction($id, $ss);
        $res = $deduction->upsert($request->all());
        return JDV::raw($res);
    }

    public function getDeductionListPaginate(Request $request)
    {
        $ss = XAuthService::verifyAuth($request, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->deductions->getDeductionListPaginate($request->all(), $ss));
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

        return JDV::result($this->deductions->getDetails($request->id, $ss));
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

        $res = $this->deductions->delete($request->id, $ss);
        return JDV::raw($res);
    }

    public function getFormOptions(Request $request)
    {
        $ss = XAuthService::verifyAuth($request, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->deductions->getFormOptions($request->id, $ss));
    }
}
