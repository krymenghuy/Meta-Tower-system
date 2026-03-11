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

}
