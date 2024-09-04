<?php

namespace App\Http\Controllers\Login;

use App\Http\Controllers\Controller;
use App\Models\CrispModel;
use Illuminate\Http\Request;
use App\Services\Umt\AuthService; 
use App\Services\GarbageCollector\GarbageCollector;
use Config;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Crypt;
//use Cookie;
//use Auth;

//use App\Security\PHPCrypto;
class LoginController extends Controller
{
    function apiLogin(Request $request)
    {
        $app_id = $request->app_id ?? Config::get('app.bhr_app_id');
        $login_name = $request->login_name;
        $pwd = $request->password;

        $result = AuthService::verifyUser($app_id, $login_name, $pwd);
        // if ($result->status === 'OK') {
        //     $result->user->image_url = \App\Models\PublicStorage::getProfilePhoto_url($result->user->branch_id, $result->user->user_class, $result->user->official_id);
        // }
        return $result;
    }

    function processLogin(Request $request){
         /** $THIS_APP_ID is used for we login. BUT for Mobile app authentication, must be come app_id and users login_name or access_token **/
        $THIS_APP_ID = $request->app_id ?? Config::get('app.bhr_app_id');
        //$user = (object)(["id"=>1,"branch_id"=>1,"full_name"=>null,"login_name"=>$request->login_name]);
        //$this->UMModel->setSessionUser($user);
        //$this->UMModel->createSession($request->login_name);
        //$request->access_token is used to check if the existing session is valid then just use existing session for this given access_token
        $result = AuthService::verifyUser($THIS_APP_ID,$request->login_name,$request->password,"en");
        if ($result->status_code ===200) {
            $user = $result->user;
            return CrispModel::createOrUpdateOperator($user);
                $access_token =Crypt::encryptString($user->access_token);
                unset($user->access_token);
                 \AuthService::login($user);
                //*** NOTE: app/http/middleware/EncryptCookies.php (for exception of encryption)
                $cookie_name = Config::get('app.cookie_name');
                GarbageCollector::cleanAll();
             if($user->default_app){
                $app = $user->default_app;
                return redirect($app->home_route)
                ->withCookie(cookie($cookie_name,$access_token,0,'/',null,true,false));
                //->withCookie(cookie("dmsrefresh",$refreshToken,0,'/',null,true,true));
             }else{
                if(isset($user->apps[1])){
                    return redirect('landingpoint')
                    ->withCookie(cookie($cookie_name,$access_token,0,'/',null,true,false));
                    //->withCookie(cookie("dmsrefresh",$refreshToken,0,'/',null,true,true));
                }else if(isset($user->apps[0])){
                   $app = $user->apps[0] ?? null;
                   if(!$app){
                     echo 'There is no accessible application!';
                     return;
                   }
                   $route_name = $user->apps[0]->home_route ?? null;
                   if(!$route_name){
                      echo 'Route name is missing '. ($user->user_class !=='admin'? '. This is because you are a '.$user->user_class. ' and cannot access to this system':'');
                      return;
                   }
                   return redirect($route_name)
                   ->withCookie(cookie($cookie_name,$access_token,0,'/',null,true,false));
                   //->withCookie(cookie("dmsrefresh",$refreshToken,0,'/',null,true,true));
                }   
             }
             
            //  //$encrypted_token = $result->user->access_token; 
            //  if (strtolower($user->user_class) === 'admin')
            //  { 
            //     //session::put('secret',$res);
            //     $cookie_value = $result->user->access_token;
            //     $refreshToken= $result->refresh_token;
            //     return redirect('dms')->withCookie(cookie($cookie_name,$cookie_value,0,'/',null,true,false))->withCookie(cookie("dmsrefresh",$refreshToken,0,'/',null,true,true));
            //     //->header('Cache-Control', 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
            //  }
            //  else if ($user->user_class === 'customer')
            //     //public function make($name, $value, $minutes = 0, $path = null, $domain = null, $secure = false, $httpOnly = true)
            //     return redirect('cmr')->withCookie(cookie($cookie_name,$result->user->access_token,0,'/',null,true,false));
            //  else {
            //     session::put('login_error',"User class $user->user_class is not valid");
            //     return redirect('');
            //  }    
            
        } else{
            //$request->session()->flash('login_error',$result->error_message); 
            Session::put('login_error',$result->error_message);
            return redirect('');
        }
        
    }
  
//     function process_mac_login(Request $request){
//        /** $THIS_APP_ID is used for we login. BUT for Mobile app authentication, must be come app_id and users login_name or access_token **/
//        $THIS_APP_ID = Config::get('app.mac_app_id');
//        //$request->access_token is used to check if the existing session is valid then just use existing session for this given access_token
//        $result = AuthService::verifyUser($THIS_APP_ID,$request->login_name,$request->password,"en");
//        if ($result->status_code ===200) {
//                $user = $result->user;
//                CrispModel::createOrUpdateOperator($user);
//                $access_token =Crypt::encryptString($user->access_token);
//                unset($user->access_token);
//                AuthService::login($user);
//             //*** NOTE: app/http/middleware/EncryptCookies.php (for exception of encryption)
//             $cookie_name = Config::get('app.cookie_name');
//             GarbageCollector::cleanAll();
             
//             return redirect('mac')->withCookie(cookie($cookie_name,$access_token,0,'/',null,true,false));
//             //->withCookie(cookie("dmsrefresh",$refreshToken,0,'/',null,true,true));
            
//        } else{
//            //$request->session()->flash('login_error',$result->error_message); 
//            Session::put('login_error',$result->error_message);
//            return redirect('');
//        }
       
//    }

    public function logout(){
        AuthService::logout();
        // Session::invalidate();
        // Session::regenerateToken();
        return redirect('/');
    }
}
