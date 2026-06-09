<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use App\Models\Prm\InvoiceSetting;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class InvoiceSettingController extends Controller
{
    protected $invoiceSetting;

    public function __construct()
    {
        $this->invoiceSetting = new InvoiceSetting();
    }
        public function saveInvoiceSetting(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $invoiceSetting = new InvoiceSetting();
        $res = $invoiceSetting->saveInvoiceSetting($req->all(), null, $ss);
        // Pass 'null' as the second argument so $ss lands in the 3rd position
        return JDV::result($res);
    }
    public function getExchangeRate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        
        $invoiceSetting = new InvoiceSetting();
        $res = $invoiceSetting->getExchangeRate(null, $ss);
        return JDV::result($res);
    }
    public function getInvoiceSetting(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        
        $invoiceSetting = new InvoiceSetting();
        $res = $invoiceSetting->getInvoiceSetting(null, $ss);
        return JDV::result($res);
    }

    public function updateToglleButton(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
         $invoiceSetting = new InvoiceSetting();
        $res = $invoiceSetting->updateToglleButton($req->all(), $ss);
        return JDV::result($res);
    }

     public function getToglleButton(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $invoiceSetting = new InvoiceSetting();
        $res = $invoiceSetting->getToglleButton(null, $ss);
        return JDV::result($res);
    }


    public function getInvoiceBuildingInfo(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $invoiceSetting = new InvoiceSetting();
        $res = $invoiceSetting->getInvoiceBuildingInfo($req->all(), $ss);
        
        // Will cleanly wrap either the real database values or the default empty structure
        return JDV::result($res);
    }

    public function saveInvoiceSettingRepresentative(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $invoiceSetting = new InvoiceSetting();
        $res = $invoiceSetting->saveInvoiceSettingRepresentative($req->all(), $ss);
    
        return JDV::result($res);
    }

    public function saveQR(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        
        $invoiceSetting = new InvoiceSetting();
        
        // FIXED: Passing 'null' explicitly for $id so $ss aligns with the 3rd parameter
        $res = $invoiceSetting->saveQR($req->all(), null, $ss);

        return JDV::raw($res);
    }
        public function deleteQR(Request $req)
        {
            $ss = XAuthService::verifyAuth($req, -1);
            if ($ss->status_code !== 200) {
                return JDV::raw($ss);
            }

            $invoiceSetting = new InvoiceSetting();

            // ✅ id=1 is always the settings row, $ss passed correctly
            $res = $invoiceSetting->deleteQR(1, $ss);

            return JDV::raw($res);
        }
}
