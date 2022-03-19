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
//use Session;
//use Carbon\Carbon;

class MerchantCreatedOrder implements ShouldBroadcast
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
        $this->data =$data;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
        public function broadcastOn()
        {
            //$sender_id = isset($this->data->sender_id)?$this->data->sender_id:0;
            $branch_id = isset($this->data->branch_id)?$this->data->branch_id:0;
            return new PrivateChannel('backend.'.$branch_id);
        }
        public function broadcastAs()
        {
            return 'merchant_created_order';
        }
}
