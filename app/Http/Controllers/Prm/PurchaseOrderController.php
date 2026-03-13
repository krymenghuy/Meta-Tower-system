<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Prm\PurchaseOrder;
use JDV;
use XAuthService;
class PurchaseOrderController extends Controller
{
    protected $purchaseOrders;
    public function __construct(){
        $this->purchaseOrders = new PurchaseOrder();
    }
    public function savePurchaseOrder(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->po_id;
        $po = new PurchaseOrder($id, $ss);
        $res = $po->savePurchaseOrder($req->all());
        return JDV::raw($res);

}

}
