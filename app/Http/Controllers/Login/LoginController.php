<?php

namespace App\Http\Controllers\Login;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UM;
use Session;
use Cookie;
use Auth;

class LoginController extends Controller
{
    protected $UMModel;
    public function __construct(){  
        $this->UMModel = new UM();
    }

    public function processLogin(Request $request){
         /** $THIS_APP_ID is used for we login. BUT for Mobile app authentication, must be come app_id and users login_name or access_token **/
         $THIS_APP_ID ='DFB15FKAEEC611EG2E7C9801A7CXD1HK'; 
        //$user = (object)(["id"=>1,"branch_id"=>1,"full_name"=>null,"login_name"=>$request->login_name]);
        //$this->UMModel->setSessionUser($user);
        //$this->UMModel->createSession($request->login_name);
        
        //$request->access_token is used to check if the existing session is valid then just use existing session for this given access_token
        $result = $this->UMModel->verifyUser($THIS_APP_ID,$request->login_name,$request->password,$request->access_token);
        if ($result->status =='OK') {
            $user = $result->user;
                Session(
                    ['login_name' => $request->login_name, 
                    'full_name'=>$user->full_name,
                    'access_token'=>$user->access_token,
                    'user_id'=>$user->id,
                    'email'=>$user->email,
                    'branch_id'=>$user->branch_id
                ]);
             
             $cookie_name ="da337_acctk_1298XA";
             
             //$cookie = Cookie::queue($cookie_name, $user->access_token, 60);
             return redirect('dms')->withCookie(cookie($cookie_name,$user->access_token,0,'/',null,false,false));
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
    public function default_view(Request $request){
        if(!Session::get('login_name')) return redirect('/'); // view('login.index');
        return view('master');
    }
    
    public function logout(){
        Ssession::flush();
        Auth::logout();
        // Session::invalidate();
        // Session::regenerateToken();
        return redirect('/');
    }
}
