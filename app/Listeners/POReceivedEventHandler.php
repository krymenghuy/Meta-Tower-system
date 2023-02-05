<?php

namespace App\Http\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use DB;

class POReceivedEventHandler
{
    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle($event)
    {
        //$items = $event->$items;
        
        DB::table('inv_available_stocks')->insert([
            'branch_id'=>1,
            'item_id'=>1,
             'item_code'=>"1111", 
             'avaialble_qty'=>1
        ]);
    }
}
