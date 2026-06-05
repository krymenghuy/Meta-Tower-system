<?php

namespace App\Models\Tenant;

use App\Models\Prm\GeneralSettings;
use App\Models\Prm\Invoice as PrmInvoice;
use DV;
use Illuminate\Support\Facades\DB;

class Invoice
{
    protected $userInfo = null;

    public function __construct($userInfo = null)
    {
        $this->userInfo = $userInfo;
    }

    public static function resolveTenantId($ss)
    {
        return ($ss->official_id ?? $ss->tenant_id ?? 0);
    }

    public static function assertTenantOwnsInvoice($invoiceId, $tenantId)
    {
        if ($invoiceId <= 0 || $tenantId <= 0) {
            return false;
        }

        $owner = DB::table('invoices')->where('id', $invoiceId)->value('tenant_id');

        return $owner === $tenantId;
    }

    public function getListPaginate($arr, $ss)
    {
        $tenantId = self::resolveTenantId($ss);
        if ($tenantId <= 0) {
            return null;
        }

        if (!is_array($arr)) {
            $arr = (array) $arr;
        }

        $arr['tenant_id'] = $tenantId;

        if (!empty($arr['status_id']) && empty($arr['payment_status_id'])) {
            $arr['payment_status_id'] = $arr['status_id'];
        }

        $prm = new PrmInvoice(null, $ss);

        return $prm->getListPaginate($arr, $ss);
    }

    public function getInvoiceDetails($id, $ss)
    {
        $tenantId = self::resolveTenantId($ss);
        $id =  $id;

        if ($id <= 0 || $tenantId <= 0) {
            return null;
        }

        if (!self::assertTenantOwnsInvoice($id, $tenantId)) {
            return null;
        }

        return PrmInvoice::getInvoiceDetails($id);
    }

    public function getFormOptions($id, $ss)
    {
        $tenantId = self::resolveTenantId($ss);
        $id = $id !== null && $id !== '' && $id !== 'null' && is_numeric($id) ? $id : null;

        if ($id > 0 && !self::assertTenantOwnsInvoice($id, $tenantId)) {
            return (object) [
                'invoice_details' => null,
                'statuses'        => GeneralSettings::options_payment_status($ss),
                'banks'           => GeneralSettings::options_bank($ss),
            ];
        }

        $details = $id ? $this->getInvoiceDetails($id, $ss) : null;

        return (object) [
            'invoice_details' => $details,
            'statuses'        => GeneralSettings::options_payment_status($ss),
            'banks'           => GeneralSettings::options_bank($ss),
        ];
    }

    public function receive($data, $ss)
    {
        $tenantId = self::resolveTenantId($ss);
        $invoiceId = ($data['invoice_id'] ?? 0);

        if ($tenantId <= 0) {
            return DV::error('Tenant session is invalid.');
        }

        if ($invoiceId <= 0 || !self::assertTenantOwnsInvoice($invoiceId, $tenantId)) {
            return DV::error('Access denied.');
        }

        $prm = new PrmInvoice(null, $ss);

        return $prm->receive($data, $ss);
    }
}
