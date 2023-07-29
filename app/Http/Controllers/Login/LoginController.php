<?php

namespace App\Http\Controllers\Login;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UM;
use Config;
use Session;
use Cookie;
use Auth;
//use App\Security\PHPCrypto;

class LoginController extends Controller
{
    protected $UMModel;
    public function __construct(){
        $this->UMModel = new UM();
    }

    function apiLogin(Request $request)
    {

        $app_id = Config::get('app.app_id');
        $login_name = $request->login_name;
        $pwd = $request->password;

        $result = $this->UMModel->verifyUser($app_id, $login_name, $pwd);
        if ($result->status === 'OK') {
            $result->user->image_url = \App\Models\PublicStorage::getProfilePhoto_url($result->user->branch_id, $result->user->user_class, $result->user->official_id);
        }

        return $result;
    }

    function processLogin(Request $request){
         /** $THIS_APP_ID is used for we login. BUT for Mobile app authentication, must be come app_id and users login_name or access_token **/
         $THIS_APP_ID = Config::get('app.app_id');
        //$user = (object)(["id"=>1,"branch_id"=>1,"full_name"=>null,"login_name"=>$request->login_name]);
        //$this->UMModel->setSessionUser($user);
        //$this->UMModel->createSession($request->login_name);
        //$request->access_token is used to check if the existing session is valid then just use existing session for this given access_token
        $result = $this->UMModel->verifyUser($THIS_APP_ID,$request->login_name,$request->password,"en");
        if ($result->status_code ===200) {
                $user = $result->user;
                //$prns = $this->UMModel->getPermissionsByUserId_internal($user->id);
                //$mods = $this->UMModel->getAccessibleModulesByUserId_internal($user->id);
                Session(
                    ['login_name' => $request->login_name,
                    'full_name'=>$user->full_name,
                    'access_token'=>$result->user->access_token,
                    'user_class'=>$user->user_class,
                    'user_id'=>$user->id,
                    'official_id'=>$user->official_id,
                    //'role_id'=>$user->role_id,
                    //'role_name'=>$user->role_name,
                    'email'=>$user->email,
                    'branch_id'=>$user->branch_id,
                    'prns'=>$user->prns,
                    'mods'=>$user->mods,
                    'lang'=>$user->lang,
                    "user"=>["branch_id"=>$user->branch_id,"full_name"=>$user->full_name,"login_name"=>$user->login_name,"user_id"=>$user->id]
                ]);

             //*** NOTE: app/http/middleware/EncryptCookies.php (for exception of encryption)
             $cookie_name =Config::get('app.cookie_name'); //vsmclinic997891zb
             //$cookie = Cookie::queue($cookie_name, $user->access_token, 60);
             //$first_role = UM::getFirstRole($user->id);
             $encrypted_token ="";
             ////Encrypt access token ans store in cookie
             //$res = (object)['value'=>'','key'=>'','iv'=>''];
             //$res = PHPCrypto::encrypt($result->user->access_token,null,null);
             //$encrypted_token =$res->value;
             //$encrypted_token = $result->user->access_token;
             if ($user->user_class==='admin' || $user->user_class==='super admin')
             {
                //session::put('secret',$res);
                $cookie_value = $result->user->access_token;
                $refreshToken= $result->refresh_token;
                return redirect('ksm')->withCookie(cookie($cookie_name,$cookie_value,0,'/',null,true,false))->withCookie(cookie("vsksmrefresh",$refreshToken,0,'/',null,true,true));;
                //->header('Cache-Control', 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
             }
             else if ($user->user_class === 'customer')
                //public function make($name, $value, $minutes = 0, $path = null, $domain = null, $secure = false, $httpOnly = true)
                return redirect('cmr')->withCookie(cookie($cookie_name,$result->user->access_token,0,'/',null,true,false));
             else {
                session::put('login_error',"User class $user->user_class is not valid");
                return redirect('');
             }
             //public function make($name, $value, $minutes = 0, $path = null, $domain = null, $secure = false, $httpOnly = true)
             //return redirect('dms')->withCookie(cookie()->forever($cookie_name,$user->access_token,0,'/',null,false,false));  /** reponse with cookie that lasts for ever **/
        } else{
            //$request->session()->flash('login_error',$result->error_message);
            session::put('login_error',$result->error_message);
            return redirect('');
        }

    }
    public function login(Request $request){
        return view('login.index');
    }

    public function logout(){
        Session::flush();
        Auth::logout();
        // Session::invalidate();
        // Session::regenerateToken();
        return redirect('/');
    }
}
