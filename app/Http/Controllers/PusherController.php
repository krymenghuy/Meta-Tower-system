<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Pusher\Pusher;
use App\Services\Umt\AuthService;
use App\Models\JDV;
use Config;

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
        
        //          $retuned_auth  = $pusher_app_key.":".$sig; //BEFORE
        //          $auth = (object)["auth"=>$retuned_auth];
        //         return $auth;
        // } 

         /**
         * Authenticates logged-in user in the Pusher JS app
         * For private channels
         */
        public function pusherAuth(Request $req)
        {
            //$request->bearerToken();
            //$user = auth()->user();
            //$um = new UM();
            //todo: check if Decrytpion error "The payload is invalid" causing Websocket to fail. Error 500 on "api/broadcast/auth"
            $ss = AuthService::verifyAuth($req,-1);
            if($ss->status_code !=200) {
                //response as JSON response for API
                return JDV::error("Forbidden (Pusher authentication failed)");
              
                // //Web Http response as view
                // header('', true, 403);
                // echo "Forbidden (Pusher authentication failed)";
                // return;
            }

            $socket_id = $req->socket_id;
            $channel_name =$req->channel_name;

            // //NOTE that running config:cache  method env('var_name') does not work
            // $app_key = env('PUSHER_APP_KEY');
            // $secret = env('PUSHER_APP_SECRET');
            // $app_id = env('PUSHER_APP_ID');

            $pusher_app_key =  Config::get('app.pusher_app_key'); //'bc77b0c2e26cf2b37d98';
            $pusher_app_secret =  Config::get('app.pusher_app_secret'); //'330245c53d84af48fc46';
            $pusher_app_id =  Config::get('app.pusher_app_id'); //'1311688';
    
            // $pusher = new Pusher($key, $secret, $app_id);
            // $auth = $pusher->socket_Auth($channel_name, $socket_id);
            // return response($auth, 200);

            if ($ss->status_code === 200) {
                $pusher = new Pusher($pusher_app_key, $pusher_app_secret, $pusher_app_id);
                //$auth = $this->set_auth_custom($channel_name,$socket_id,$pusher_app_key,$pusher_app_secret); //works the same as method set_auth_custom() defined in this Controller
                $auth = $pusher->socket_auth($channel_name, $socket_id);
                //set response headers for cross-origin
                    header('Access-Control-Allow-Origin: *');
                    header('Access-Control-Allow-Methods:POST');
                  //header('Access-Control-Allow-Methods: GET, POST');
                  
                  //return JDV::result(json_decode($auth)); //This wont work because incorrect JSON structure for the client Pusher object to validate
                  /** IMPORTANT NOTE: => It must reponse to client (ie: javascript Pusher object), MUST return as {"auth": signature_string }  WHRERE "signature_string" is combination of "pusher_app_key:$generated_sign" **/
                  return JDV::result(json_decode($auth));

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
                ////***response back as http web response
                // header('', true, 403);
                // echo "Forbidden (Pusher authentication failed)";
                // return;
            
                ////***response as JSON object
                return JDV::error("Forbidden (Pusher authentication failed)");
            }
        }
    
}