<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Prm\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use JDV;
use XAuthService;

class InvoiceController extends Controller
{
    protected $invoices;

    public function __construct()
    {
        $this->invoices = new Invoice();
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

    protected function assertInvoiceOwnership($invoiceId, $tenantId)
    {
        if (!$tenantId) {
            return null;
        }

        $owner = DB::table('invoices')->where('id', $invoiceId)->value('tenant_id');

        if ($owner != $tenantId) {
            return JDV::error('Access denied.');
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

        return JDV::result($this->invoices->getListPaginate($params, $ss));
    }

    public function invoiceDetails(Request $req)
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
        if ($denied = $this->assertInvoiceOwnership($id, $tenantId)) {
            return $denied;
        }

        $detail = $this->invoices->getInvoiceDetails($id);

        if (!$detail) {
            return JDV::error('Invoice not found');
        }

        return JDV::result($detail);
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = null;
        if (isset($req->id) && $req->id !== null && $req->id !== 'null' && is_numeric($req->id)) {
            $id = $req->id;
        }

        return JDV::result($this->invoices->getFormOptions($id, $ss));
    }

    public function saveInvoice(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $tenantId = $this->resolveTenantId($ss);
        if ($tenantId) {
            $req->merge(['tenant_id' => $tenantId]);
        }

        $id = $req->id ?? $req->invoice_id;
        if ($id && $denied = $this->assertInvoiceOwnership($id, $tenantId)) {
            return $denied;
        }

        $invoice = new Invoice($id, $ss);
        $res = $invoice->upsert($req->all(), $id, $ss);

        return JDV::raw($res);
    }

    public function deleteInvoice(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }

        $tenantId = $this->resolveTenantId($ss);
        if ($denied = $this->assertInvoiceOwnership($req->id, $tenantId)) {
            return $denied;
        }

        return JDV::raw($this->invoices->deleteInvoice($req->id));
    }

    public function receive(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $invoiceId = $req->input('invoice_id') ?? $req->input('id');
        $tenantId = $this->resolveTenantId($ss);

        if ($invoiceId && $denied = $this->assertInvoiceOwnership($invoiceId, $tenantId)) {
            return $denied;
        }

        $invoice = new Invoice(null, $ss);
        $res = $invoice->receive($req->all(), $ss);

        return JDV::raw($res);
    }
}
