<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use App\Models\Prm\Receipt;
use Illuminate\Http\Request;
use JDV;
use XAuthService;
class ReceiptController extends Controller
{
    protected $receipts;
    public function __construct()
    {
        $this->receipts = new Receipt();
    }


    public function getListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->receipts->getListPaginate($req->all(), $ss));
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

        $detail = $this->receipts->getReceiptDetails($id);

        if (!$detail) {
            return JDV::error('Receipt not found');
        }

        return JDV::result($detail);
    }

    public function deleteReceipt(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::raw($this->receipts->deleteReceipt($req->id));
    }

}
