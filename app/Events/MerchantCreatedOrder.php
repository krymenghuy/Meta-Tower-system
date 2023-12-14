<?php

namespace App\Events;

//use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
//use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
//use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

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
            $branch_id = isset($this->data->branch_id)?$this->data->branch_id:0;
            //$user_id =isset($this->data->user_id)?$this->data->user_id:0;
            return new PrivateChannel(channel_prefix()."backend.".$branch_id);
        }
        public function broadcastAs()
        {
            return 'merchant_created_order';
        }
}
