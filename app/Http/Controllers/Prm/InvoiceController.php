<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use App\Models\Prm\Invoice;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    protected $invoices;

    public function __construct()
    {
        $this->invoices = new Invoice();
    }

    public function saveInvoice(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->id ?? $req->invoice_id;
        $invoice = new Invoice($id, $ss);
        $res = $invoice->upsert($req->all(),$id,$ss);
        return JDV::raw($res);
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

        // Get ID from request (common patterns)
        $id = $req->input('id');   // or $req->id, $req->get('id'), etc.

        if (!is_numeric($id) || $id <= 0) {
            return JDV::error('Invalid or missing ID');
        }

        $detail = $this->invoices->getInvoiceDetails($id);

        if (!$detail) {
            return JDV::error('Invoice not found');
        }

        return JDV::result($detail);
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1); // ← fixed typo
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        if (!isset($req->id) && $req->id !== null && $req->id !== 'null') {
            $id = is_numeric($req->id) ? $req->id : null;
        } else {
            $id = null;
        }

        return JDV::result($this->invoices->getFormOptions($id, $ss));
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
        return JDV::raw($this->invoices->deleteInvoice($req->id));
    }

       public function receive(Request $req)
        {
            $ss = XAuthService::verifyAuth($req, -1);
            if ($ss->status_code !== 200) {
                return JDV::raw($ss);
            }

            $invoice = new Invoice(null, $ss);
            $res = $invoice->receive($req->all(), $ss);

            return JDV::raw($res);
        }
}
