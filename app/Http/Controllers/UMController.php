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

class UMController extends Controller
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
  //if(!$request->data || !Session::has('login_name') || !Session::get('login_name',null)) return response()->json(null);
  $m_str = $request->data;
  $encrypter = app(\Illuminate\Contracts\Encryption\Encrypter::class);
  $m_str = $encrypter->encrypt($m_str,false); //FALSE => to avoid serialization issue in decryption
  return response()->json($m_str);
}

function getModuleList($user_id =0){
  $ss = UM::getUserInfoByToken($req,-1);
  if($ss->status_code !=200) return $ss; //user not authenticated
  $modules = $this->UMModel->getModuleList(null,$ss);
  return JDV::result($modules); 
}
  
function saveRole(Request $req){
  $ss = UM::getUserInfoByToken($req,-1);
  if($ss->status_code !=200) return $ss; //user not authenticated
  $res= $this->UMModel->saveRole($req->all(),$ss);
  return JDV::raw($res);     
}  

 function role_exists(Request $request){
    $r = $this->UMModel->role_exists($request);
    return JDV::result($r); 
  } 

  function deleteRole(Request $req) {
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $id =$req->role_id?$req->role_id:$req->id;
    $r = $this->UMModel->deleteRole($id,$ss); 
    return JDV::result($r); 
  }

  function addRoleMember(request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $role_id =$req->role_id?$req->role_id:$req->id;
    $user_id = $req->user_id;
    $r = $this->UMModel->addRoleMember($user_id,$role_id,$ss); 
    return JDV::result($r); 
  }

  function removeRoleMember(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $role_id =$req->role_id?$req->role_id:$req->id;
    $user_id = $req->user_id;
    $r = $this->UMModel->removeRoleMember($user_id,$role_id,$ss);
    return JDV::result($r);
  }

  function getUserRoles(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $user_id =$req->user_id?$req->user_id:$req->id;
    $r = $this->UMModel->getUserRoles($user_id);
    return JDV::result($r); 
  }

  function getRoleList(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $roles = $this->UMModel->getRoleList($ss);
    return JDV::result($roles); 
  }

  function getRoleMembers(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $role_id =$req->role_id?$req->role_id:$req->id;
    $r = $this->UMModel->getRoleMembers($req->all(),$role_id);
    return JDV::result($r); 
  }

  function getRoleById(Request $req) {
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $role_id =$req->role_id?$req->role_id:$req->id;
    $role = $this->UMModel->getRoleById($role_id);
    return JDV::result($role); 
  }

  function getUserList(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $users = $this->UMModel->getUserList($req->all(),$ss);
    return JDV::result($users); 
  }

  // //returns extended details about a user given by user's class, and user's official_code. A user can be Staff, Student, Teacher, parent, or Guest etc  
  // function getUserExtendedDetails(Request $request){
  //   $r = $this->UMModel->getUserExtendedDetails($request);
  //   return JDV::result($r); 
  // } 

  function saveUser(Request $req){
    $ss = UM::getUserInfoByToken($req,100);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $res = $this->UMModel->saveUser($req->all(),$ss);
    if($res->status_code ===200){
       return JDV::success(['id'=>$res->id]); 
    }
    return JDV::raw($res); 
  } 

  //getUserInfo() returns "id, previlege_type, user_class,is_locked,status"
  function getUserInfo(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $user_id = $req->user_id?$req->user_id:$req->id;
    $user= $this->UMModel->getUserInfo($user_id);
    return JDV::result($user); 
  }

  function deleteUser(Request $req){
    $ss = UM::getUserInfoByToken($req,101);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $user_id = $req->user_id?$req->user_id:$req->id;
    $res = $this->UMModel->deleteUser($user_id,$ss);
    return JDV::raw($res); 
  }

  function setUserStatus(Request $req){
    $ss = UM::getUserInfoByToken($req,106);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $user_id = $req->user_id?$req->user_id:$req->id;
    $res = $this->UMModel->setUserStatus($req->status_id,$user_id);
    return JDV::raw($res); 
  } 
  
  function unlockUser(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $user_id = $req->user_id?$req->user_id:$req->id;
    $r = $this->UMModel->unlockUser($user_id);
    return JDV::raw($r);
  }

  function setLockStatus(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
       $user_id = $req->user_id?$req->user_id:$req->id;
       $r = $this->UMModel->setLockStatus($user_id,$req->status_id);
       return JDV::raw($r);
  }
  
  // function user_exists(Request $request){
  //   $ss = UM::getUserInfoByToken($req,-1);
  //   if($ss->status_code !=200) return $ss; //user not authenticated
  //   $user_id = $req->user_id?$req->user_id:$req->id;

  //   $r = $this->UMModel->user_exists($req->name,$req->user_id); 
  //   return JDV::result($r); 
  // }
 
  //checkUser , validateUser, checkPassword, login, Signin
  /** verifyUser() check user login and pwd and then returns object $result = {status, error_message, user} **/
 function verifyUser(Request $req){
   $r = $this->UMModel->verifyUser($req);
   return JDV::result($r); 
 }

   //In case: user changes their own password
  function changePassword(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $login_name = $req->login_name?$req->login_name:$req->name;
    $res = $this->UMModel->changePassword($req->old_password,$req->new_password,$login_name);
    return JDV::raw($res); 
 }

function setPassword(Request $req){
  $ss = UM::getUserInfoByToken($req,-1);
  if($ss->status_code !=200) return $ss; //user not authenticated
  $login_name = $req->login_name?$req->login_name:null;
   $newPwd = $req->newPwd?$req->newPwd:null;
   if(!$newPwd) $newPwd = $req->newPwd?$req->newPwd:$req->password;
   $res = $this->UMModel->setPassword($newPwd,$login_name,$ss);
   return JDV::raw($res);
}

function changeLoginName(Request $req){
  $ss = UM::getUserInfoByToken($req,-1);
  if($ss->status_code !=200) return $ss; //user not authenticated
  //$user_id = $req->user_id?$req->user_id:$req->id;
  $res = $this->UMModel->changeLoginName($req->login_name,$req->new_login_name,$ss);
  return JDV::raw($res); 
}

// function createLoginSession(Request $request){
//     $r = $this->UMModel->createLoginSession($request);
//     return JDV::raw($r); 
// }

function getComboItems_user(Request $req){
   $ss = UM::getUserInfoByToken($req,-1);
   if($ss->status_code !==200) return JDV::raw($ss);
   $users = $this->UMModel->getComboItems_user(null,$ss);
    return JDV::result($users); 
}

function getComboItems_role(Request $req){
  $ss = UM::getUserInfoByToken($req,-1);
  if($ss->status_code !==200) return JDV::raw($ss);
    $roles = $this->UMModel->getComboItems_role($req->user_class,$ss);
    return JDV::result($roles); 
}
 function getComboItems_workloc(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $rows = $this->UMModel->getComboItems_workloc($ss);
    return JDV::result($rows);
 }

 function getComboItems_module(Request $req){
   $ss = UM::getUserInfoByToken($req,-1);
   if($ss->status_code !==200) return JDV::raw($ss);
    $mods = $this->UMModel->getComboItems_module($ss);
    return JDV::result($mods); 
 }

//   function getAccessibleModules_current_user(Request $req){
//     $rows = $this->UMModel->getAccessibleModules_current_user($ss);
//     return JDV::result($rows); 
//  } 

function getAccessibleModules(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $mods = $this->UMModel->getAccessibleModules($req->role_id,$ss);
    return JDV::json($mods); 
} 

function addAccessibleModule(Request $req){
  $ss = UM::getUserInfoByToken($req,-1);
  if($ss->status_code !==200) return JDV::raw($ss);
    $mod_id = $req->module_id?$req->module_id:$req->mod_id;
    $role_id = $req->role_id;
    $res = $this->UMModel->addAccessibleModule($mod_id,$role_id,$ss);
    return JDV::result($res);
}

function getPermissionsByRole(Request $req) {
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    //$req->all() => ['search_value','show_all','role_id']
    $rows = $this->UMModel->getPermissionsByRole($req->all(),$ss);
    return JDV::result($rows); 
}

function findPermissions(Request $req){
   //$ss = UM::getUserInfoByToken($req,-1);
   //if($ss->status_code !==200) return JDV::raw($ss);
   // $role_id = $req->role_id;
    $rows = $this->UMModel->findPermissions($req->search_value);
    return JDV::result($rows); 
}

function addPermissionToRole(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $role_id = $req->role_id;
    $prn_id = $req->prn_id?$req->prn_id:$req->id;
    $res = $this->UMModel->addPermissionToRole($prn_id,$role_id,$ss);
    return JDV::success();
}

function removePermissionFromRole(Request $req){
   $ss = UM::getUserInfoByToken($req,-1);
   if($ss->status_code !==200) return JDV::raw($ss);
    $role_id = $req->role_id;
    $prn_id = $req->prn_id?$req->prn_id:$req->id;
    $this->UMModel->removePermissionFromRole($prn_id,$role_id,$ss);
    return JDV::success();  
}
 
// function getPersonDetails(Request $req){
//   $ss = UM::getUserInfoByToken($req,-1);
//   if($ss->status_code !==200) return JDV::raw($ss);
//   $data = $this->UMModel->getPersonDetails($req->search_value);
//   return JDV::result($data);  
// }

function getPermissions_cu(Request $req){
  $ss = UM::getUserInfoByToken($req,-1);
  if($ss->status_code !==200) return JDV::raw($ss);
   //$prn_id = $req->prn_id?$req->prn_id:$req->id;
    $r = $this->UMModel->getPermissions_cu($ss);
    return JDV::result($r);   
}

function getPermissionsByUserId(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $user_id = $req->user_id?$req->user_id:$req->id;
    $r = $this->UMModel->getPermissionsByUserId($user_id,$ss); 
    return JDV::result($r);  
}

function getPermissionsByRoleId(Request $req){
  $ss = UM::getUserInfoByToken($req,-1);
  if($ss->status_code !==200) return JDV::raw($ss);
  $role_id = $req->role_id?$req->role_id:$req->id;
    $r = $this->UMModel->getPermissionsByRoleId($role_id,$ss);
    return JDV::result($r);   
}

//returns auth data for AuthManager.js. returns object {prns=[], modules=[]}
function getAuthData(Request $req){
  $r = $this->UMModel->getAuthData($req);
  return JDV::result($r);  
}

 function localizePermissions(Request $req){
    $r = $this->UMModel->localizePermissions($req);
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

function removeAccessibleModule(Request $req) {
  $ss = UM::getUserInfoByToken($req,-1);
  if($ss->status_code !==200) return JDV::raw($ss);
  $role_id = $req->role_id?$req->role_id:$req->id;
  $mod_id = $req->module_id?$req->module_id:$req->mod_id;
  $r = $this->UMModel->removeAccessibleModule($mod_id,$role_id,$ss);
  return JDV::success(); 
} 
//Check if current user has access to a MODULE refered by module_code or ref_code
function accessibleModule(Request $req) {
   $ss = UM::getUserInfoByToken($req,-1);
   if($ss->status_code !==200) return JDV::raw($ss);
   $role_id = $req->role_id?$req->role_id:$req->id;
   $mod_id = $req->mod_id?$req->mod_id:null;
    $boolean = $this->UMModel->accessibleModule($mod_id,$role_id,$ss);
    return JDV::result($boolean); 
} 

  function getComboItems_userclass(Request $req){
    $rows = $this->UMModel->getComboItems_userclass(null);
    return JDV::result($rows); 
  }

  // function reloadCurrentLang(Request $req){
  //       return JDV::success(['langContents'=>Localization::getLangContents()]);
  // }

  function getLang(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
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
              //$branch_id = $ss->branch_id;
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

  function logout(){
    Session::flush();
  }

}