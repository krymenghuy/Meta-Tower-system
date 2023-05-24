<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Models\Inventory\Item;
use DB;

class PurchaseEventHandler
{
    // /**
    //  * Create the event listener.
    //  *
    //  * @return void
    //  */
    // public function __construct()
    // {
    //     //
    // }
     
    // /**
    //  * Handle the event.
    //  *
    //  * @param  object  $event
    //  * @return void
    //  */
    public function handle($event)
    {
        /*** $data ={ 
            items=> [{id,code,qty,sku,stockclass_code,target_qty*}, ...]
          } 
         ***/
        $data = $event->data;
        $ss = $data['user'];
        $warehouse_id = $data['warehouse_id'];
        //$stock_class = $data['stock_class'];
        //if(!$stock_class) $stock_class = $data['stockclass_code'];
        $items = $data['items'];
        //$target_qty = $data['target_qty'];
        $x = Item::updateQty_many($ss,$warehouse_id,$items); 
    }
}
