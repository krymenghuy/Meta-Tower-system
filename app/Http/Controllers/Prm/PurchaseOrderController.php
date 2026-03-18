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
    public function __construct()
    {
        $this->purchaseOrders = new PurchaseOrder();
    }
    public function savePurchaseOrder(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->po_id;
        $po = new PurchaseOrder($id, $ss);
        $res = $po->savePurchaseOrder($req->all());
        return JDV::raw($res);

    }
    public function getPurchaseOrderList(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code != 200)
            return $ss;
        $item = new PurchaseOrder(null, $ss);
        $data = $item->getPurchaseOrderList($req->all(), $ss);
        return JDV::result($data);
    }

     public function purchaseOrderDetails(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        if(!isset($req->id) || !is_numeric($req->id)){
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->purchaseOrders->purchaseOrderDetails($req->id));

    }

    public function getFormOptions(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        return JDV::result($this->purchaseOrders->getFormOptions($req->id,$ss));
    }
    public function getItemsByPurchaseOrder(Request $req){
        $ss = XAuthService::verifyAuth($req,-1);
        if($ss->status_code !=200) return $ss;
        $poId = $req->input('id') ?? $req->input('po_id') ?? $req->id ?? null;
        $item = new PurchaseOrder(null,$ss);
        $data = $item->getItemsByPurchaseOrder(['id' => $poId, 'po_id' => $poId], $ss);
        $list = is_object($data) && method_exists($data, 'toArray') ? $data->toArray() : (array) $data;
        return JDV::result($list);
    }

    public function deletePurchaseOrder(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->purchaseOrders->deletePurchaseOrder((int) $req->id, $ss);
        return JDV::raw($res);
    }
}
