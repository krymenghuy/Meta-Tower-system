<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Pusher\Pusher;
use XAuthService;
use JDV;
use Config;

class PusherController extends Controller
{
        public function pusherAuth(Request $req)
        {
            $ss = XAuthService::verifyAuth($req,-1);
            if($ss->status_code !=200) {
                //response as JSON response for API
                return JDV::error("Forbidden (Pusher authentication failed)");
              
            }

            $socket_id = $req->socket_id;
            $channel_name =$req->channel_name;

            $pusher_app_key =  Config::get('app.pusher_app_key'); //'bc77b0c2e26cf2b37d98';
            $pusher_app_secret =  Config::get('app.pusher_app_secret'); //'330245c53d84af48fc46';
            $pusher_app_id =  Config::get('app.pusher_app_id'); //'1311688';


            if ($ss->status_code === 200) {
                $pusher = new Pusher($pusher_app_key, $pusher_app_secret, $pusher_app_id);
                //$auth = $this->set_auth_custom($channel_name,$socket_id,$pusher_app_key,$pusher_app_secret); //works the same as method set_auth_custom() defined in this Controller
                $auth = $pusher->socket_auth($channel_name, $socket_id);
                //set response headers for cross-origin
                    header('Access-Control-Allow-Origin: *');
                    header('Access-Control-Allow-Methods:POST');
                  return JDV::result(json_decode($auth));
    
            } else {
                ////***response back as http web response
                // header('', true, 403);
                // echo "Forbidden (Pusher authentication failed)";
                // return;
            }

                ////***response as JSON object
                return JDV::error("Forbidden (Pusher authentication failed)");
            }
}
    