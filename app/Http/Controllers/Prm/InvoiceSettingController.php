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
        
        // Pass 'null' as the second argument so $ss lands in the 3rd position
        return JDV::result($this->invoiceSetting->saveInvoiceSetting($req->all(), null, $ss));
    }
    public function getInvoiceSetting(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        
        return JDV::result($this->invoiceSetting->getInvoiceSetting($req->all(), $ss));
    }

    public function updateToglleButton(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->invoiceSetting->updateToglleButton($req->all(), $ss));
    }

     public function getToglleButton(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->invoiceSetting->getToglleButton($req->all(), $ss));
    }


}
