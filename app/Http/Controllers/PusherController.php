<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Pusher\Pusher;
use App\Models\UM;

class PusherController extends Controller
{

        ///*###This function is the same as $pusher->set_auth() */
        //  //Create signature for pusher auth response back to pusher client
        //  ////https://pusher.com/docs/channels/library_auth_reference/auth-signatures/

        // function set_auth_custom($channel_name, $socket_id,$pusher_app_key,$pusher_app_secret){
        //         $string_to_sign = $socket_id.":".$channel_name;
        //         $sig = hash_hmac('sha256', $string_to_sign, $pusher_app_secret);
        //         //*** visit this site for auth signature detailed technique */
        //         ////https://pusher.com/docs/channels/library_auth_reference/auth-signatures/
        
        //          $retuned_auth  = $pusher_app_key.":".$sig;
        //          $auth = (object)['auth'=>$retuned_auth];
        //         return $auth;
        // } 

         /**
         * Authenticates logged-in user in the Pusher JS app
         * For private channels
         */
        public function pusherAuth(Request $request)
        {
            //$request->bearerToken();
            //$user = auth()->user();
            $um = new UM();
            $user = $um->getUserByToken($request);
            $socket_id = $request->socket_id;
            $channel_name =$request['channel_name'];

            // //NOTE that running config:cache  method env('var_name') does not work
            // $app_key = env('PUSHER_APP_KEY');
            // $secret = env('PUSHER_APP_SECRET');
            // $app_id = env('PUSHER_APP_ID');

            $app_key = '780bc0f81cba4c28118a';
            $secret = '330244c53d84af48fc46';
            $app_id = '1312272';
    
            // $pusher = new Pusher($key, $secret, $app_id);
            // $auth = $pusher->socket_Auth($channel_name, $socket_id);
            // return response($auth, 200);

            if ($user) {
                $pusher = new Pusher($app_key, $secret, $app_id);
                ////$pusher->set_auth() works the same as method set_auth_custom() defined in this Controller
                $auth = $pusher->socket_auth($channel_name, $socket_id);
                //set response headers for cross-origin
                    header('Access-Control-Allow-Origin: *');
                    header('Access-Control-Allow-Methods:POST');
                  //header('Access-Control-Allow-Methods: GET, POST');

                return response($auth, 200);

                // $pusher = new Pusher($app_key, $secret, $app_id);
                // $string_to_sign = $socket_id.":".$channel_name;
                // $sig = hash_hmac('sha256', $string_to_sign, $secret);
                // //$auth = $pusher->socket_auth($channel_name, $socket_id);
                // //*** visit this site for auth signature detailed technique */
                // ////https://pusher.com/docs/channels/library_auth_reference/auth-signatures/
        
                //  $retuned_auth  = $app_key.":".$sig;
                //  $auth = (object)['auth'=>$retuned_auth];
                // return response(json_encode($auth), 200);
    
            } else {
                //header('', true, 403);
                header('', true, 403);

                // $u = UM::getUserByToken($request);
                // if($u->error) echo $u->error;
                echo "Forbidden";
                //echo "User authentication failed";
                return;
            }
        }
    
}
