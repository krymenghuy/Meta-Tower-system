<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
//use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Session;
use Carbon\Carbon;

class OrderStatusChanged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public $data;
    public function __construct($data=null)
    {
        $this->data = $data;
    }
 
    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    // public function broadcastOn()
    // {
    //     return ['pickup_channel'];
    // }
    public function broadcastAs()
    {
        return 'order_status_changed';
    }
    
    public function broadcastOn(){
         //$user_id = isset($this->data->user_id)?$this->data->user_id:0;
         $branch_id = isset($this->data->branch_id)?$this->data->branch_id:0;
         return new PrivateChannel('backend.'.$branch_id);
    }

    // public function broadcastOn()
    // {
    //     return new PrivateChannel('channel-name');
    // }
}
