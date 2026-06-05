<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Invoice;
use Illuminate\Http\Request;
use JDV;
use XAuthService;

class InvoiceController extends Controller
{
    protected $invoices;

    public function __construct()
    {
        $this->invoices = new Invoice();
    }

    public function getListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->invoices->getListPaginate($req->all(), $ss));
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

        $detail = $this->invoices->getInvoiceDetails($id, $ss);

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
        if (isset($req->id) && $req->id !== null && $req->id !== 'null') {
            $id = is_numeric($req->id) ? $req->id : null;
        }

        return JDV::result($this->invoices->getFormOptions($id, $ss));
    }

    public function receive(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::raw($this->invoices->receive($req->all(), $ss));
    }
}
