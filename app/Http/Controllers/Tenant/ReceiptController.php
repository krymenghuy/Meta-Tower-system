<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Prm\Receipt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use JDV;
use XAuthService;

class ReceiptController extends Controller
{
    protected $receipts;

    public function __construct()
    {
        $this->receipts = new Receipt();
    }

    protected function resolveTenantId($ss)
    {
        if (!empty($ss->tenant_id)) {
            return (int) $ss->tenant_id;
        }

        if (!empty($ss->official_id)) {
            return (int) $ss->official_id;
        }

        return null;
    }

    public function getListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $params = $req->all();
        $tenantId = $this->resolveTenantId($ss);

        if (($ss->user_class ?? null) === 'tenant') {
            if (!$tenantId) {
                return JDV::error('Tenant not found.');
            }
            $params['tenant_id'] = $tenantId;
        } elseif ($tenantId) {
            $params['tenant_id'] = $tenantId;
        }

        return JDV::result($this->receipts->getListPaginate($params, $ss));
    }

    public function receiptDetails(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->input('id');

        if (!is_numeric($id) || $id <= 0) {
            return JDV::error('Invalid or missing ID');
        }

        $tenantId = $this->resolveTenantId($ss);
        if ($tenantId) {
            $owner = DB::table('receipts')->where('id', $id)->value('tenant_id');
            if ($owner != $tenantId) {
                return JDV::error('Access denied.');
            }
        }

        $detail = $this->receipts->getReceiptDetails($id);

        if (!$detail) {
            return JDV::error('Receipt not found');
        }

        return JDV::result($detail);
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->receipts->getFormOptions($req->all(), $ss));
    }
}
