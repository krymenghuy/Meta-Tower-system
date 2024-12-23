<?php

namespace App\Http\Controllers\Umt;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use App\Models\Umt\Role;

class RoleController extends Controller
{
    
    function getRoleList(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $rows = Role::list($req->all(), $ss);
        return JDV::result($rows); 
    }

    function getRoleList_paginate(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        return JDV::result(Role::list_paginate($req->all())); 
    }

    function saveRole(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->role_id;
        $role = new Role($id,$ss);
        return JDV::raw($role->save($req->all())); 
    }

    function getRoleMembers(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->role_id;
        $role = new Role($id,$ss);
        return JDV::result($role->getMembers($req->all())); 
    }

    function deleteRole(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $role_id = $req->id ?? $req->role_id;
        $role = new Role($role_id,$ss);
        return JDV::raw($role->delete()); 
    }

    function getComboItems_role(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $role_id = $req->id ?? $req->role_id;
        $role = new Role($role_id,$ss);
        $roles = $role->getComboItems_role($req->user_class, $ss);
        return JDV::result($roles);
    }

    function getUserDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code != 200) return $ss; //user not authenticated
        $role_id = $req->role_id ? $req->role_id : $req->id;
        $role = new Role($role_id,$ss);
        $data = $role->getUserDetails($role_id,$ss);
        return JDV::result($data);
    }

    function addRoleMembers(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $role_id = $req->id ?? $req->role_id;
        $ids = $req->ids ?? $req->user_ids;
        if(!$ids) $ids = $req->id ?? $req->user_id;
        $role = new Role($role_id,$ss);
        return JDV::raw($role->addMembers($ids,$role_id,$ss)); 
    }
     
    function removeRoleMember(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $role_id = $req->id ?? $req->role_id;
        $role = new Role($role_id,$ss);
        return JDV::raw($role->removeMember($req->user_id)); 
    }
 
    function getAllowedPermissions(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $role_id = $req->id ?? $req->role_id;
        $role = new Role($role_id,$ss);
        return JDV::result($role->getPermissions($req->all())); 
    }

    function getRolePermissions(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $role_id = $req->id ?? $req->role_id;
        $role = new Role($role_id,$ss);
        $data = $role->getRolePermissions($req->all(),$role_id,$ss);
        return JDV::result($data); 
    }

    function getRoleReports(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $role_id = $req->id ?? $req->role_id;
        $role = new Role($role_id,$ss);
        $data = $role->getRoleReports($req->all(),$role_id,$ss);
        return JDV::result($data); 
    }

    function getAccessibleApps(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $role_id = $req->id ?? $req->role_id;
        $role = new Role($role_id,$ss);
        return JDV::result($role->getAccessibleApps()); 
    }

    /* return all apps list, with status as allowed or not */
    function getRoleApps(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $data = Role::getAppList($req->all(),$ss);
        return JDV::result($data); 
    }

    function setRoleAppStatus(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->role_id ?? $req->id;
        $role = new Role($id,$ss);
        $status =$req->allowed ?? $req->status_id;
        $res = null;
        if($status ==1){
             $res = $role->addApp($req->app_id,$id);
        }else{
            $res = $role->removeApp($req->app_id,$id);
        }
        return JDV::raw($res); 
    }

    function setRoleModuleStatus(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $role_id= $req->role_id ?? $req->id;
        $role = new Role($role_id,$ss);
        $status_id =$req->status_id ?? $req->allowed;
        $res = null;
        if($status_id == 1){
             $res = $role->addModule($req->module_id,$role_id);
        }else{
             $res = $role->removeModule($req->module_id,$role_id);
        }
        
        return JDV::raw($res); 
    }

    function addRoleApp(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->role_id ?? $req->id;
        $role = new Role($id,$ss);
        $res = $role->addApp($req->app_id,$id);       
        return JDV::raw($res); 
    }

    function removeRoleApp(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->role_id ?? $req->id;
        $role = new Role($id,$ss);
        $res = $role->removeApp($req->app_id,$id);       
        return JDV::raw($res); 
    }
    
    function addRolePermission(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $role_id = $req->id ?? $req->role_id;
        $prn_id = $req->prn_id ?? $req->permission_id;
        $role = new Role($role_id,$ss);
        return JDV::raw($role->addPermission($prn_id)); 
    }

    function addRoleReport(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $role_id = $req->id ?? $req->role_id;
        $prn_id = $req->prn_id ?? $req->permission_id;
        $role = new Role($role_id,$ss);
        return JDV::raw($role->addReport($prn_id)); 
    }

    function removeRolePermission(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $role_id = $req->id ?? $req->role_id;
        $prn_id = $req->prn_id ?? $req->permission_id;
        $prn_id = $prn_id ?? $req->prnIds;
        $role = new Role($role_id,$ss);
        return JDV::raw($role->removePermission($prn_id)); 
    }

    function removeRoleReport(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $role_id = $req->id ?? $req->role_id;
        $prn_id = $req->prn_id ?? $req->permission_id;
        $prn_id = $prn_id ?? $req->prnIds;
        $role = new Role($role_id,$ss);
        return JDV::raw($role->removeReport($prn_id)); 
    }

    function getRoleFormOptions(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $role_id = $req->id ?? $req->role_id;
        $data = Role::getFormOptions($role_id,$ss);
        return JDV::result($data); 
    }
 
    //getAccessibleModules() returns all modules based on the given (role_id,app_id), but each module has status "Allowed" as 0 or 1 
    function getRoleModules(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $role_id = $req->id ?? $req->role_id;
        $role = new Role($role_id,$ss);
        $data = $role->getRoleModules($req->app_id, $role_id,$ss);
        return JDV::result($data); 
    }

    /** turn on or turn off permission for a role */
    function setRolePermissionStatus(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $role_id = $req->id ?? $req->role_id;
        $status_id = $req->status_id ?? $req->allowed;
        $prn_id = $req->prn_id ?? $req->permission_id;
        $role = new Role($role_id,$ss);
        $res = null;
        if($status_id ==1){
             $res = $role->addPermission($prn_id,$role_id,$ss);
        }else{
            $res = $role->removePermission($prn_id,$role_id,$ss);
        }
        return JDV::raw($res);
    }

    function setRoleReportStatus(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $role_id = $req->id ?? $req->role_id;
        $status_id = $req->status_id ?? $req->allowed;
        $prn_id = $req->prn_id ?? $req->permission_id;
        $role = new Role($role_id,$ss);
        $res = null;
        if($status_id ==1){
             $res = $role->addReport($prn_id,$role_id,$ss);
        }else{
            $res = $role->removeReport($prn_id,$role_id,$ss);
        }
        return JDV::raw($res);
    }

    //getAccessibleModules() returns only modules that are allowed. Not all modules in the given (role_id,app_id)
    function getAccessibleModules(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $role_id = $req->id ?? $req->role_id;
        $role = new Role($role_id,$ss);
        $data = $role->getAccessibleModules($req->app_id, $role_id, $ss);
        return JDV::result($data); 
    }
}
