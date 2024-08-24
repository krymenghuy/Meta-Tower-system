<?php

namespace App\Http\Controllers\Umt;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use App\Models\Umt\User;
use Localization;  
class UserController extends Controller
{
    function getLang(Request $req){
        $lang = $req->lang ?? 'km';
        //if parameter @lang is NULL then use "lang" set in um_session table based on (app_id,user_id) if the user already logged in
        //if (empty($lang)) $lang = $ss->lang;
        $langRoutes = Localization::getLangList();
        $base_path = base_path();
      //if no valid file_path => use km language
      $file_path = isset($langRoutes[$lang])? $langRoutes[$lang]: $base_path.'/storage/locales/km.json';
      $data = readFileContent($file_path);
      return JDV::result($data);
   }

    function saveLang(Request $req)
    {
      $ss = AuthService::verifyAuth($req,-1);
      if ($ss->status_code != 200) return JDV::raw($ss);
      $lang = $req->lang ?? 'km'; //default langauge in case @lang is not supplied
      //$bin_app_id = hex2bin($req->app_id);
      $user_id = $req->user_id ?? $req->id;
      User::saveLang($lang,$user_id);
      
      $base_path = base_path();
      $langRoutes = [
        'en' => $base_path . '/storage/locales/en.json',
        'km' => $base_path . '/storage/locales/km.json',
        'kh' => $base_path . '/storage/locales/km.json'
      ];
  
      $file_path = isset($langRoutes[$lang]) ? $langRoutes[$lang] : $base_path . '/storage/locales/km.json';
      $data = readFileContent($file_path);
      //Save the new langauge code to current session
       AuthService::setUserInfo('lang',$lang);
      //Todo: In case of JWT token => then change user's token and send new JWT token to client again in order to update cookie
      //$new_token = UM::updateJWT(['lang'=>$lang]);
      return JDV::success(['lang_content' => $data]);
    }
 
    function saveLang_mobile(Request $req)
    {
      $ss = AuthService::verifyAuth($req,-1);
      if ($ss->status_code != 200) return JDV::raw($ss);
      $lang = $req->lang ?? 'km';
      $user_id = $req->user_id ?? $req->id;
      User::saveLang($lang,$user_id);
      //Save the new langauge code to current session
       AuthService::setUserInfo('lang',$lang);
      //Todo: In case of JWT token => then change user's token and send new JWT token to client again in order to update cookie
      //$new_token = UM::updateJWT(['lang'=>$lang]);
      return JDV::success();
    }

    function changeLoginName(Request $req){
        $ss = AuthService::verifyAuth($req,100);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->user_id;
        $user = new User($id,$ss);
        $new_login_name = $req->login_name ?? $req->new_login_name;
        $res = $user->changeLoginName($new_login_name,$id,$ss);
        return JDV::raw($res); 
    }
    
    function getUserList(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $rows = User::listAll($req->all(), $ss);
        return JDV::result($rows); 
    }

    function getAuthorizationReport(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->user_id;
        $user = new User($id,$ss);
        $rows =$user->getAuthorizationReport($req->all());
        return JDV::result($rows); 
    }

    function getUserList_paginate(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        return JDV::result(User::list_paginate($req->all(), $ss)); 
    }

    function getUserDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code != 200) return $ss; //user not authenticated
        $user_id = $req->user_id ? $req->user_id : $req->id;
        $role = new User($user_id,$ss);
        $roles = $role->getDetails($user_id, $ss);
        return JDV::result($roles);
    }

    function setPassword(Request $req)
    {
        $ss = AuthService::verifyAuth($req, 109);
        if ($ss->status_code != 200) return $ss; //user not authenticated
        $user_id = $req->user_id ?? $req->id;
        $newPwd = $req->newPwd;
        if (!$newPwd) $newPwd = $req->newPwd ? $req->newPwd : $req->password;
        $user = new User($user_id,$ss);
        $res = $user->setPassword($newPwd,$user_id);
        return JDV::raw($res);
    }

    function changePassword(Request $req)
    {
        $ss = AuthService::verifyAuth($req, 109);
        if ($ss->status_code != 200) return $ss; //user not authenticated
        $user_id = $req->user_id ?? $req->id;
        $newPwd = $req->newPwd ?? $req->new_password;
        $oldPwd = $req->oldPwd ?? $req->old_password;
        if (!$newPwd) $newPwd = $req->newPwd ? $req->newPwd : $req->password;
        $user = new User($user_id,$ss);
        $res = $user->changePassword($oldPwd,$newPwd,$user_id,$ss);
        return JDV::raw($res);
    }

    function setRole(Request $req)
    {
        $ss = AuthService::verifyAuth($req, 109);
        if ($ss->status_code != 200) return $ss; //user not authenticated
        $user_id = $req->user_id ?? $req->id;
        $role_id = $req->role_id;
        $res = User::setRole($role_id,$user_id,$ss);
        return JDV::raw($res);
    }

    function setUserBranch(Request $req)
    {
        $ss = AuthService::verifyAuth($req, 109);
        if ($ss->status_code != 200) return $ss; //user not authenticated
        $user_id = $req->user_id ?? $req->id;
        $branch_id = $req->branch_id;
        $res = User::setBranch($ss,$branch_id, $user_id,null);
        return JDV::raw($res);
    }

    function createLinkedUser(Request $req)
    {
        $ss = AuthService::verifyAuth($req, 109);
        if ($ss->status_code != 200) return $ss; //user not authenticated
        $id = $req->user_id ?? $req->id;
        $res = User::createLinkedUser($req->all(),$id,$ss);
        return JDV::raw($res);
    }

    function deleteLinkedUser(Request $req)
    {
        $ss = AuthService::verifyAuth($req, 109);
        if ($ss->status_code != 200) return $ss; //user not authenticated
        $id = $req->id ?? $req->user_id;
        $res = User::deleteLinkedUser($id,$ss);
        return JDV::raw($res);
    }
    function saveUser(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->role_id;
        $user = new User($id,$ss);
        return JDV::raw($user->save($req->all())); 
    }

    function setUserStatus(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->user_id;
        $status_code = $req->status_code ?? $req->status;
        $res = User::setStatus($status_code,$id,true,$ss);
        return JDV::raw($res); 
    }
    function changeRoleUser(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->user_id;
        $user = new User($id,$ss);
        return JDV::raw($user->changeRoleUser($id,$req->role_id,$ss)); 
    }

    function changeUserLoginName(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->user_id;
        $user = new User($id,$ss);
        return JDV::raw($user->changeUserLoginName($id,$req->login_name,$ss)); 
    }

    function deleteUser(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->user_id;
        $user = new User($id,$ss);
        return JDV::raw($user->delete($id,$ss)); 
    }

    function getUserPermissions(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->user_id;
        $user = new User($id,$ss);
        return JDV::result($user->getPermissions($id,$ss)); 
    }

    function getUserReports(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->user_id;
        $user = new User($id,$ss);
        return JDV::result($user->getReports($id,$ss)); 
    }

    function getUserApps(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->user_id;
        $user = new User($id,$ss);
        return JDV::result($user->getAccessibleApps($id,$ss)); 
    }

    function getUserModules(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->user_id;
        $user = new User($id,$ss);
        return JDV::raw($user->getAccessibleModules($id,$ss)); 
    }

    //FindUserProfile by official code
    function findProfileByOfficialCode(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $official_code = $req->official_code ?? $req->code;
        $user_class = $req->user_class;
        $data = User::findProfileByOfficialCode($official_code,$user_class,$ss);
        return JDV::result($data);
    }

   //FindUserProfile by email or phone number phoneOrEmail
    function findProfile(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $emailOrPhone = $req->emailOrPhone ?? $req->phoneOrEmail;
        $data = User::findProfile($emailOrPhone,$ss);
        return JDV::result($data);
    }
     
    function getUserRoleFormOptions(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->user_id;
        $data = User::getUserRoleFormOptions($id,$ss);
        return JDV::result($data);
    }

    function getUserFormOption(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->user_id;
        $data = User::getUserFormOptions($id,$ss);
        return JDV::result($data);
    }

    function getLinkUserFormOptions(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->user_id;
        $data = User::getLinkUserFormOptions($id,$ss);
        return JDV::result($data);
    }

    // /* Not used */
    // function targetUserlistByApp(Request $req){
    //     $ss = AuthService::verifyAuth($req,-1);
    //     if($ss->status_code !==200) return JDV::raw($ss);
    //     $app_id = $req->id ?? $req->app_id;
    //     $data = User::targetUserlistByApp($app_id,$ss);
    //     return JDV::result($data);
    // }
}
