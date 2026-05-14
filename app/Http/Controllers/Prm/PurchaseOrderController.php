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
        if ($ss->status_code !== 200) return JDV::raw($ss);
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
        if($ss->status_code !==200) return JDV::raw($ss);
        if(!isset($req->po_id) || !is_numeric($req->po_id)){
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->purchaseOrders->getItemsByPurchaseOrder($req->po_id, $ss));
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
        $res = $this->purchaseOrders->deletePurchaseOrder($req->id, $ss);
        return JDV::raw($res);
    }

    public function receivePurchaseOrder(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
      
        $res = $this->purchaseOrders->receivePurchaseOrder($req->all(),$req->id, $ss);
        return JDV::raw($res);
    }

    public function confirmPurchaseOrderReceived(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->purchaseOrders->confirmPurchaseOrderReceived($req->id, $ss, $req->all());
        return JDV::raw($res);
    }
    function authorized(Request $req){
        $ss = XAuthService::verifyAuth($req,-1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $res = $this->purchaseOrders->authorized($req->all(),$ss);
        return JDV::raw($res);
    }
    function rejectPurchaseOrder(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::raw($this->purchaseOrders->rejectPurchaseOrder($req->all(), $ss));
    }

    public function getPOFormOptions(Request $req)
{
    $ss = XAuthService::verifyAuth($req, -1);
    if ($ss->status_code != 200) {
        return JDV::raw($ss);
    }

    $id = $req->po_id ?? $req->id;

    $po_detail = null;
    $items = [];
    $totals = [];

    if (!empty($id)) {

        $po_detail = PurchaseOrder::purchaseOrderDetails($id, $ss);
        if ($po_detail) {
            $model = new PurchaseOrder(null);
            $items = $model->getItemsByPO(['po_id' => $id], $ss);
            $po_detail->items = $items;
            $totals = [
                'discount_type'  => $po_detail->discount_type ?? 'amount',
                'discount_value' => $po_detail->discount_value ?? 0,
                'extra_items' => []

            ];
            $po_detail->totals = $totals;
        }
        // if ($po_detail) {
        //     $model = new PurchaseOrder(null);
        //    $items = $model->getItemsByPO(['po_id' => $id], $ss)->toArray();

        //     $items = array_map(function ($item) {
        //         $item->price = (float) $item->price;
        //         $item->total_price = (float) $item->total_price;
        //         return $item;
        //     }, $items);

        //     $po_detail->items = $items;

        //     $totals = [
        //         'discount_type'  => $po_detail->discount_type ?? 'amount',
        //         'discount_value' => (float) ($po_detail->discount_value ?? 0),
        //         'extra_items' => []
        //     ];

        //     $po_detail->totals = $totals;
        // }
    }

    $data = [
        'po_detail' => $po_detail,
        'items' => $items,
        'totals' => $totals,
        'item_options' => PurchaseOrder::getOptionItems(),
    ];

    return JDV::result($data);
}
}
