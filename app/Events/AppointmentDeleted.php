<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AppointmentDeleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public $data = null;
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
   
    public function broadcastOn()
    {
        $branch_id = isset($this->data->branch_id)?$this->data->branch_id:1;

        // //$user_id =isset($this->data->user_id)?$this->data->user_id:0;
        // $channel_name = channel_prefix()."backend.$branch_id";
        // return [$channel_name];
        //*** For Private channel (Both Laravel websocket or Internet-based Pusher Socket service ***/
        return new PrivateChannel(channel_prefix()."backend.".$branch_id);
        //return new PrivateChannel("vsmclinic.backend.$branch_id");
    }
    public function broadcastAs()
    {
        return 'AppointmentDeleted';
    }
}