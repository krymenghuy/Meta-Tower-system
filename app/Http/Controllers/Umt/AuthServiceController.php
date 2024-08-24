<?php

namespace App\Http\Controllers\Umt;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use App\Models\Umt\User;
use Illuminate\Support\Facades\Crypt;

class AuthServiceController extends Controller
{
 
    function getAuthData(Request $req)
    {
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code != 200) return JDV::raw($ss);
        $app_id = $req->app_id;
        $user = AuthService::getAuthData($app_id);
        return JDV::result($user);
    }
    
    function encryptData(Request $request)
    {
      //if(!$request->data || !Session::has('login_name') || !Session::get('login_name',null)) return response()->json(null);
      $m_str = $request->data;
      $encrypter = app(\Illuminate\Contracts\Encryption\Encrypter::class);
      $m_str = $encrypter->encrypt($m_str, false); //FALSE => to avoid serialization issue in decryption
      return response()->json($m_str);
    }
    
    function allowed(Request $req)
    {
        $prn_id = $req->prn_id ?? $req->permission_id;
        $user_id = $req->user_id;  
        $allowed = AuthService::allowed($prn_id,$user_id);
        return JDV::result($allowed);
    }

    function setPassword(Request $req){
        $ss = AuthService::verifyAuth($req,100);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->user_id;
        $newPwd = $req->password ?? $req->new_password;
        $res = User::setPassword($newPwd,$id);
        return JDV::raw($res); 
    }
 
    function decypherToken($etoken){
        try{
            $etoken = urldecode($etoken);
            $d = Crypt::decryptString($etoken);
            return JDV::result(['value'=>$d]);
           }catch(\Exception $e){
             \Log::info('It is likely that the given token is invlid string for decryption purpose');
             \Log::info($e->getMessage());
             \Log::info($e->getTraceAsString());
             return JDV::error('there a problem decyphing the given token. Check server error log for details');
           }
    }
}
