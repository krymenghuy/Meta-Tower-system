<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use App\Models\Prm\Contract;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class ContractController extends Controller
{
    protected  $contracts;


    public function __construct()
    {
        $this->contracts = new Contract();
    }
    public function saveContract(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->contract_id;
        $contract = new Contract($id, $ss);
        $res = $contract->saveContract($req->all());

        return JDV::raw($res);
    }
    public function getListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        // Apply contract unit updates for renewals whose start date is today (when renewal changed unit).
        Contract::applyPendingRenewalUnitChanges();

        return JDV::result($this->contracts->getListPaginate($req->all(), $ss));
    }

    public function getListRenewals(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->contracts->getListRenewalsPaginate($req->all(), $ss));
    }

    public function contractDetails(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !== 200){
            return JDV::raw($ss);
        }

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }

        return JDV::result($this->contracts->contractDetails($req->id));
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $space_id = $req->space_id ?? null;
        $tenant_id = $req->tenant_id ?? null;
        $bookingTenantMatch = null;
        $prefillSpaceIds = [];
        $restrictToPrefillSpaces = false;
        if ($space_id && is_numeric($space_id)) {
            $check = Contract::validateBookingTenantPhone($space_id);
            if (!($check->status ?? false)) {
                return JDV::error($check->message ?? 'Please create tenant first.');
            }
            $bookingTenantMatch = $check;
            $restrictToPrefillSpaces = true;
            if (!empty($check->spaces) && is_iterable($check->spaces)) {
                foreach ($check->spaces as $spaceRow) {
                    $sid = (int) ($spaceRow->id ?? 0);
                    if ($sid > 0) {
                        $prefillSpaceIds[] = $sid;
                    }
                }
            }
        }
        if (empty($prefillSpaceIds) && $tenant_id && is_numeric($tenant_id)) {
            $spacesByTenant = Contract::getBookingSpacesByTenantId((int) $tenant_id);
            if (!empty($spacesByTenant)) {
                $restrictToPrefillSpaces = true;
            }
            foreach ($spacesByTenant as $spaceRow) {
                $sid = (int) ($spaceRow->id ?? 0);
                if ($sid > 0) {
                    $prefillSpaceIds[] = $sid;
                }
            }
        }
        $out = $this->contracts->getFormOptions($req->id, $ss, $space_id, $prefillSpaceIds, $restrictToPrefillSpaces);
        if ($bookingTenantMatch && !empty($bookingTenantMatch->tenant_id)) {
            $out->prefill_tenant_id = $bookingTenantMatch->tenant_id;
            $out->prefill_tenant_name = $bookingTenantMatch->tenant_name ?? null;
            $out->prefill_spaces = $bookingTenantMatch->spaces ?? [];
        } elseif (!empty($prefillSpaceIds)) {
            $out->prefill_spaces = array_map(function ($sid) {
                return (object) ['id' => (int) $sid];
            }, $prefillSpaceIds);
        }

        return JDV::result($out);
    }

    public function deleteContract(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }

        $res = $this->contracts->deleteContract($req->id);

        return JDV::raw($res);
    }

    public function terminateContract(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }

        $res = $this->contracts->terminateContract($req->id, $ss);

        return JDV::raw($res);
    }

        public function renewContract(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->contract_id;
        $contract = new Contract($id, $ss);
        $res = $contract->renewContract($req->all());

        return JDV::raw($res);
    }

    public function cancelPendingRenewal(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }

        $contract = new Contract($req->id, $ss);
        $res = $contract->cancelPendingRenewal($req->id, $ss);

        return JDV::raw($res);
    }

    public function updatePendingRenewal(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->id ?? $req->contract_id;
        if (!$id || !is_numeric($id)) {
            return JDV::error('Invalid ID');
        }

        $contract = new Contract($id, $ss);
        $res = $contract->updatePendingRenewal($req->all(), $id, $ss);

        return JDV::raw($res);
    }
     function getTenantInfo(Request $req){
        $ss = XAuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        return JDV::raw(Contract::getTenantInfo($req->all(),$ss));
    }
    public function getContractMonths(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $data = $req->json()->all();
        $contract_id = $data['contract_id'] ?? $data['id'] ?? $req->input('contract_id') ?? $req->input('id') ?? null;
        $months = Contract::generateContractMonths((int) $contract_id);

        return JDV::result(['months' => $months]);
    }

    public function validateBookingTenantPhone(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $space_id = $req->space_id ?? null;
        if (!$space_id || !is_numeric($space_id)) {
            return JDV::error('Invalid space ID');
        }

        $res = Contract::validateBookingTenantPhone((int) $space_id);
        if (!($res->status ?? false)) {
            return JDV::error($res->message ?? 'Phone number validation failed.');
        }

        return JDV::result($res);
    }


}
