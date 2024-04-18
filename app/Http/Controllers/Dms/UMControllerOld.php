<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UM;
use App\Models\JDV;
use Session;
use Sanitizer;
use Localization;
use DB;

class UMControllerOld extends Controller
{
    protected $UMModel;

    public function __construct()
    {
        //UMModel (company_id,user_id,user_name)
        $this->UMModel = new UM();
    }

/* #Begin::adhoc methods => Adhoc methods are used to create Applications, Permissions, and module name etc. They are used only in Development time */
   function createApplication(Request $request){
       $app_name = $request->app_name;
       return makeJsonResponse($this->UMModel->createApplication($app_name));
   }

    // static function createAppComponent($app_name){
    //     $app_id =$this->getGUID();
    //     DB::table('um_applications')->insert([
    //         'app_id'=>$app_id,
    //         'name'=>$app_name,
    //         'name_native'=>$app_name
    //     ]);
    // }

      function createPermission(Request $request){
            $r = $this->UMModel->createPermission($request);
            return JDV::result($r);
        }

/*#End::adhoc methods (Adhoc static functions are used only in Development time) */

/*##### begin::InApp UserModel ##### */
/** send encrypted data (usually query_string data) to browser for putting in url (for normal Web report parameters) **/
function encryptData(Request $request){
  if(!$request->data || !Session::has('login_name') || !Session::get('login_name',null)) return response()->json(null);
  $m_str = $request->data;
  $encrypter = app(\Illuminate\Contracts\Encryption\Encrypter::class);
  $m_str = $encrypter->encrypt($m_str,false); //FALSE => to avoid serialization issue in decryption
  return response()->json($m_str);
}

function getModuleList(Request $req){
  $ss = UM::getUserInfoByToken($req,-1);
  if($ss->status_code !==200) return JDV::raw($ss);
    $r = $this->UMModel->getModuleList($req->user_id);
    return JDV::result($r);
}

function saveRole(Request $request){
  return makeJsonResponse($this->UMModel->saveRole($request));
}

 function role_exists(Request $req){
  $ss = UM::getUserInfoByToken($req,107);
  if($ss->status_code !==200) return JDV::raw($ss);
  $role_id = $req->role_id?$req->role_id:$req->id;
    $r = $this->UMModel->role_exists($ss,$req->role_name,$role_id);
    return JDV::result($r);
  }

  function deleteRole(Request $request) {
    $r = $this->UMModel->deleteRole($request);
    return JDV::result($r);
  }

  function addRoleMember(request $req)
  {
    $ss = UM::getUserInfoByToken($req, -1);
    if ($ss->status_code != 200) return $ss; //user not authenticated
    $role_id = $req->role_id ? $req->role_id : $req->id;
    $user_id = $req->user_id;
    $r = $this->UMModel->addRoleMember($req->all(), $ss);
    return JDV::result($r);
  }

  function removeRoleMember(Request $req)
  {
    $ss = UM::getUserInfoByToken($req, -1);
    if ($ss->status_code != 200) return $ss; //user not authenticated
    $role_id = $req->role_id ? $req->role_id : $req->id;
    $user_id = $req->user_id;
    $r = $this->UMModel->removeRoleMember($user_id, $role_id, $ss);
    return JDV::result($r);
  }
  function getUserRoles(Request $request){
    $r = $this->UMModel->getUserRoles($request);
    return JDV::result($r);
  }

  function getRoleList(Request $request){
    $r = $this->UMModel->getRoleList($request);
    return JDV::result($r);
  }

  function getRoleMembers(Request $request){
    $r = $this->UMModel->getRoleMembers($request);
    return JDV::result($r);
  }

  function getRoleById(Request $request) {
    $r = $this->UMModel->getRoleById($request);
    return JDV::result($r);
  }

  function getUserList(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    $r = $this->UMModel->getUserList($req->all(),$ss);
    return JDV::result($r);
  }

  function saveUser(Request $request){
    $prn = $request->id?112:100;
    $ss = UM::getUserInfoByToken($request,$prn);
    if($ss->status_code !=200) return JDV::raw($ss);
    $r = $this->UMModel->saveUser($request);
    if($r->status_code ===200){
       return JDV::success(['id'=>$r->id]);
    }
    return JDV::raw($r);
  }

  //getUserInfo() returns "id, previlege_type, user_class,is_locked,status"
  function getUserInfo(Request $request){
      $r = $this->UMModel->getUserInfo($request);
      return JDV::result($r);
  }

  function deleteUser(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $id = $req->id?$req->id:$req->user_id;
    $r = $this->UMModel->deleteUser($id);
    return JDV::raw($r);
  }

  function setUserStatus(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $id = $req->id?$req->id:$req->user_id;
    $r = $this->UMModel->setUserStatus($id,$req->status_code);
    return JDV::raw($r);
  }

  function unlockUser(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $id = $req->id?$req->id:$req->user_id;
    $r = $this->UMModel->unlockUser($id);
    return JDV::raw($r);
  }

  function setLockStatus(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $id = $req->id?$req->id:$req->user_id;
    $r = $this->UMModel->setLockStatus($req->action,$req->user_id,$ss);
    return JDV::raw($r);
  }

  function user_exists(Request $req){
    $r = $this->UMModel->user_exists($req->name,$req->user_id);
    return JDV::result($r);
  }

  //checkUser , validateUser, checkPassword, login, Signin
  /** verifyUser() check user login and pwd and then returns object $result = {status, error_message, user} **/
 function verifyUser(Request $req){
  $r = $this->UMModel->verifyUser($req->app_id,$req->login_name,$req->password,'en');
  return JDV::result($r);
 }

   //In case: user changes their own password
  function changePassword(Request $request){
     $r = $this->UMModel->changePassword($request);
     return JDV::raw($r);
  }

function setPassword(Request $req){
   $ss = UM::getUserInfoByToken($req,-1);
   if($ss->status_code !==200) return JDV::raw($ss);
   $r = $this->UMModel->setPassword($req->all(),$ss);
   return JDV::raw($r);
}

function changeLoginName(Request $req){
  $ss = UM::getUserInfoByToken($req,110);
  if($ss->status_code !==200) return JDV::raw($ss);
  $r = $this->UMModel->changeLoginName($req->all(),$ss);
  return JDV::raw($r);
}

function createLoginSession(Request $request){
    $r = $this->UMModel->createLoginSession($request);
    return JDV::raw($r);
}

function getComboItems_user(Request $request){
    $r = $this->UMModel->getComboItems_user($request);
    return JDV::json($r);
}

function getComboItems_role(Request $request){
    $r = $this->UMModel->getComboItems_role($request);
    return JDV::json($r);
}
 function getComboItems_workloc(Request $request){
    $r = $this->UMModel->getComboItems_workloc($request);
    return JDV::json($r);
 }

 function getComboItems_module(Request $request){
    $r = $this->UMModel->getComboItems_module($request);
    return JDV::json($r);
 }
 

 function getAccessibleModules(Request $req)
  {
    $ss = UM::getUserInfoByToken($req, -1);
    if ($ss->status_code !== 200) return JDV::raw($ss);
    $mods = $this->UMModel->getAccessibleModules($req->role_id, $ss);
    return JDV::json($mods);
  }

  //List all modules and accessible modules has its prop "accessible =1"
  function getAccessibleModules_all(Request $req)
  {
    $ss = UM::getUserInfoByToken($req, -1);
    if ($ss->status_code !== 200) return JDV::raw($ss);
    $mods = $this->UMModel->getAccessibleModules($req->role_id, $ss);
    return JDV::json($mods);
  }

function addAccessibleModule(Request $req)
  {
    $ss = UM::getUserInfoByToken($req, -1);
    if ($ss->status_code !== 200) return JDV::raw($ss);
    $mod_id = $req->module_id ? $req->module_id : $req->mod_id;
    $role_id = $req->role_id;
    $res = $this->UMModel->addAccessibleModule($mod_id, $role_id, $ss);
    return JDV::result($res);
  }

function getPermissionsByRole(Request $request) {
    $r = $this->UMModel->getPermissionsByRole($request);
    return JDV::result($r);
}

function findPermissions(Request $request){
    $r = $this->UMModel->findPermissions($request);
    return JDV::result($r);
}

function addPermissionToRole(Request $req) {
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return JDV::raw($ss);
    $r = $this->UMModel->addPermissionToRole($req->id,$req->role_id,$ss);
    if($r->status==='OK') return JDV::success();
    else return JDV::error($r->error_message);
}

function removePermissionFromRole(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return JDV::raw($ss);
    $this->UMModel->removePermissionFromRole($req->ids,$req->role_id,$ss);
    return JDV::success();
}

function getPersonDetails(Request $request){
  $r = $this->UMModel->getPersonDetails($request->search_value);
  return JDV::result($r);
}

function getPermissions_cu(Request $request){
    $r = $this->UMModel->getPermissions_cu($request);
    return JDV::result($r);
}

function getPermissionsByUserId(Request $request){
    $r = $this->UMModel->getPermissionsByUserId($request);
    return JDV::result($r);
}

function getPermissionsByRoleId(Request $request){
    $r = $this->UMModel->getPermissionsByRoleId($request);
    return JDV::result($r);
}

//returns auth data for AuthManager.js. returns object {prns=[], modules=[]}
function getAuthData(Request $request){
  $r = $this->UMModel->getAuthData($request);
  return JDV::result($r);
}

 function localizePermissions(Request $request){
    $r = $this->UMModel->localizePermissions($request);
    return JDV::result($r);
}

function apiLogin(Request $request){
  //app_id of the LMS backend system
  $app_id = getAdminAppId(); //$request->app_id;
  $login_name = $request->login_name;
  $pwd = $request->password;

  $result = $this->UMModel->verifyUser($app_id,$login_name,$pwd);
  // if($result->status ==='OK'){
  //     //$encrypter = app(\Illuminate\Contracts\Encryption\Encrypter::class);
  //     //$result->user->access_token = $encrypter->encrypt($result->user->access_token,false); //FALSE => to avoid serialization issue in decryption
  //     //$result->user->image_url = null; // PublicStorage::getProfilePhoto_url($result->user->branch_id, $result->user->user_class, $result->user->official_id);
  //  }
  return $result;
}


function allowed(Request $request){
    $r = $this->UMModel->allowed($request);
    return JDV::result($r);
}

function removeAccessibleModule(Request $request) {
  $r = $this->UMModel->removeAccessibleModule($request);
  return JDV::result($r);
}
//Check if current user has access to a MODULE refered by module_code or ref_code
function accessibleModule(Request $request) {
    $r = $this->UMModel->accessibleModule($request);
    return JDV::result($r);
}

  function getComboItems_userclass(Request $request){
    $r = $this->UMModel->getComboItems_userclass($request);
    return JDV::result($r);
  }

  // function reloadCurrentLang(Request $req){
  //       return JDV::success(['langContents'=>Localization::getLangContents()]);
  // }

  function getLang(Request $req){
        // $ss = UM::getUserInfoByToken($req,-1);
        // if($ss->status_code !=200) return $ss; //user not authenticated
        //$branch_id = $ss->branch_id;
        //$d = Sanitizer::sanitizeObject($req->all(),[]);
        $lang = $req->lang; // strtolower(getValue($d,'lang'));
        //if parameter @lang is NULL then use "lang" set in um_session table based on (app_id,user_id) if the user already logged in
        //if (empty($lang)) $lang = $ss->lang;
        if (!$lang) $lang = "km"; //if there is no preset lanague for the user then use "khmer" default lang
        $langRoutes = Localization::getLangList();
        $base_path = base_path();
        // [
        //   'en'=> $base_path."/storage/locales/en.json",
        //   'km'=> $base_path."/storage/locales/km.json",
        //   'kh'=> $base_path."/storage/locales/km.json"
        // ];

      //if no valid file_path => use km language
      $file_path = isset($langRoutes[$lang])? $langRoutes[$lang]:$base_path."/storage/locales/km.json";
      $data = readFileContent($file_path);
      return JDV::result($data);
  }

    function saveLang(Request $req){
              $ss = UM::getUserInfoByToken($req,-1);
              if($ss->status_code !=200) return $ss; //user not authenticated
              $branch_id = $ss->branch_id;
              $d = Sanitizer::sanitizeObject($req->all(),[]);
              $lang = $req->lang;

              //if parameter @lang is NULL then use "lang" set in um_session table based on (app_id,user_id) if the user already logged in
              //if (!$lang) $lang = $ss->lang;
              if (!$lang) $lang = "km"; //default langauge in case @lang is not supplied
              $app_id = getAdminAppId();

              DB::table('um_sessions')->where('app_id',$app_id)->where('user_id',$ss->user_id)->update([
              'lang'=>$lang
              ]);
              DB::table('um_users')->where('id',$ss->user_id)->update([
              'lang'=>$lang
              ]);

              $base_path =base_path();
              $langRoutes = [
                'en'=>$base_path.'/storage/locales/en.json',
                'km'=>$base_path.'/storage/locales/km.json',
                'kh'=>$base_path.'/storage/locales/km.json'
              ];

              $file_path = isset($langRoutes[$lang])?$langRoutes[$lang]:$base_path.'/storage/locales/km.json';
              $data = readFileContent($file_path);
              //Save the new langauge code to current session
              Session::put('lang',$lang);

              //Todo: In case of JWT token => then change user's token and send new JWT token to client again in order to update cookie
              //$new_token = UM::updateJWT(['lang'=>$lang]);
              return JDV::success(['lang_content'=>$data]);
    }

    function getUserRoleListPaginate(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);
        return JDV::result($this->UMModel->getUserRoleListPaginate($req->all(),$ss));
    }


    function removeUserRole(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);
        return JDV::result($this->UMModel->removeRoleMember($req->role_id,$req->user_id,$ss));
    }


    function getUserModuleListPaginate(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);
        return JDV::result($this->UMModel->getUserModuleListPaginate($req->all(),$ss));
    }
    function addModuleToUser(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);
        return JDV::raw($this->UMModel->addModuleToUser($req->mod_id,$req->user_id,$ss));
    }

    function removeUserModule(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);
        return JDV::raw($this->UMModel->removeUserModule($req->mod_id,$req->user_id,$ss));
    }


    function getUserPermissionListPaginate(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);
        return JDV::result($this->UMModel->getUserPermissionListPaginate($req->all(),$ss));
    }

    function addPermissionToUser(Request $req){
        $ss = UM::getUserInfoByToken($req,105);
        if($ss->status_code !=200) return JDV::raw($ss);
        return JDV::raw($this->UMModel->addPermissionToUser($req->prn_id,$req->user_id,$ss));
    }

    function removeUserPermission(Request $req){
        $ss = UM::getUserInfoByToken($req,111);
        if($ss->status_code !=200) return JDV::raw($ss);
        return JDV::raw($this->UMModel->removeUserPermission($req->prn_id,$req->user_id,$ss));
    }

    function getUserViewReportPermissionListPaginate(Request $req){
        $ss = UM::getUserInfoByToken($req, -1);
        if($ss->status_code !=200) return $ss;
        $rpt = new UM();
        $list = $this->UMModel->getUserViewReportPermission_paginate($req->all(),$req->user_id,$ss);
        return JDV::result($list);
      }


      function getUserFormOption(Request $req){
        $ss = UM::getUserInfoByToken($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $data = (object)[
          'user_classes' => $this->UMModel->getComboItems_userclass(null),
          'roles' => $this->UMModel->getComboItems_role($req->user_class, $ss)
        ];
        return JDV::result($data);
      }

      function getUserDetails(Request $req){
        $ss = UM::getUserInfoByToken($req, -1);
        if ($ss->status_code != 200) return $ss; //user not authenticated
        $id = isset($req->id)?$req->id:$req->user_id;
        $users = $this->UMModel->getUserDetails($id,$ss);
        return JDV::result($users);
      }

      function permissionList(Request $req){
        $ss = UM::getUserInfoByToken($req, -1);
        if($ss->status_code !=200) return $ss;
        $rpt = new UM();
        $list = $this->UMModel->permissionList($ss);
        return JDV::result($list);
      }



  function logout(){
    Session::flush();
  }

}
