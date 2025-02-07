<?php

namespace App\Models\Umt;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use App\Models\DV;
use App\Models\DBX;
use Illuminate\Support\Facades\DB;
class Permission //extends Model
{
    //use HasFactory;
    protected $id = null, $userInfo = null;
   
    protected static $foreign_tables = [
       'um_role_permissions' =>['fk_name'=>'permission_id','delete_action'=>'delete'],
       'um_user_permissions' =>['fk_name'=>'permission_id'],
       'um_user_permissions'=>['fk_name'=>'permission_id'],
       'um_permission_actions'=>['fk_name'=>'permission_id'],
    ];

    function __construct($id = null,$userInfo=null)
    {
       $this->id = $id;
       $this->userInfo = $userInfo;   
    }
    
    static function nextPermissionId(){
        $row = DB::table('um_permissions as p')->selectRaw('MAX(id) AS maxId')->get()->first();
        return $row? ($row->maxId +1): 1;
    }

    static function list($arr, $ss= null){
        $d = (object)$arr;
        $app_id = $d->app_id ?? null;
        $bin_app_id = $app_id? hex2bin($app_id): null; 
        $search_value = $d->search_value ?? null;
        $str_search = $search_value ? ' app.name LIKE \'%'.escape_like_str($search_value).'%\'': '3=3';
        $rows = DB::table('um_permissions as p')->join('um_applications as app','app.id','=','p.app_id')->join('um_app_modules as m','m.id','=','p.module_id')->where('category','<>','Report')->where('app.id', $bin_app_id )->whereRaw($str_search)
        ->selectRaw( DBX::getHEX('app.id','app_id').',p.id, p.name, app.name AS app_name,m.id as module_id, m.name AS module_name')->get();
        return $rows;
    }

    static function details($id){
        $row = DB::table('um_permissions as p')->join('um_applications as app','app.id','=','p.app_id')->join('um_app_modules as m','m.id','=','p.module_id')->where('p.id', $id )
        ->selectRaw( DBX::getHEX('app.id','app_id').',p.id, p.name, app.name AS app_name, m.name As module_name,m.id as module_id, p.category')->first();
        if(!$row) return null;
        $row->actions = self::getActionsAsString($id);
        return $row;
    }


    static function getActionsWithStatus($id, $role_id, $allowed = null) {
        // Fetch all actions for the permission
        $actions = DB::table('um_permission_actions as pa')
            ->where('pa.permission_id', $id)
            ->orderBy('pa.display_order')
            ->pluck('pa.action_name')
            ->toArray();
        if (!isset($actions[0])){
            if($allowed ==null){
               $allowed = DB::table('um_role_permissions as rp')->where('rp.permission_id',$id)->where('rp.role_id',$role_id)->where('rp.action_name','primary')->select('permission_id')->first() ? 1:0; 
            }
            return [(object)['action_name'=>'primary','status_id'=>$allowed]];
        }else{ // Replace "view" with "primary" (In context of report, there is View permission, but database table "um_role_permision.action_name" store value as "primary" )
            $actions = array_map(function ($action_name) {
                return $action_name === 'view' ? 'primary' : $action_name;
            }, $actions);
        }
      
        // Fetch all role permissions for the given role and permission in a single query
        $rolePermissions = DB::table('um_role_permissions as rp')
            ->where('rp.role_id', $role_id)
            ->where('rp.permission_id', $id)
            ->pluck('rp.action_name')
            ->toArray();
    
        // Map the actions with their status
        return array_map(function ($action_name) use ($rolePermissions) {
            return (object)[
                'action_name' => strtolower($action_name),
                'status_id' => in_array(strtolower($action_name), $rolePermissions) ? 1 : 0,
            ];
        }, $actions);
    }
 
    /** if @allowed =0 or 1 that means the Permission has a single action such "Allowed or Deined"  */
    static function getActionsWithStatusAsString($id, $role_id,$allowed= null) {
        if ($allowed !== null){
            return 'primary:'.$allowed;
        }
        $actions = self::getActionsWithStatus($id, $role_id);
        $prns = [];
        foreach ($actions as $action) {
            $status = $action->status_id ?? 0;
            $prns[] = $action->action_name . ':' . $status;
        }
        $result = implode('|', $prns);   
        return $result;
    }
    

    static function getActions($id) {
        return DB::table('um_permission_actions as pa')
            ->where('pa.permission_id', $id)
            ->orderBy('pa.display_order')
            ->pluck('pa.action_name')
            ->toArray();
    }

    static function getActionsAsString($id){
        $actions = self::getActions($id);
        return implode('|',$actions);
    }
    static function appExists($bin_app_id){
        return DB::table('um_applications')->where('id',$bin_app_id)->value('name');
    }

    function save($arr,$id = null, $ss = null){
        $ss =$ss ?? $this->userInfo;
        $id = $is ?? $this->id;
        $v_rule = [
            //'number'=>'0|positive',
            'name'=>'1|string|1-250',
            'module_id'=>'1|number|exists=um_app_modules.id',
            'app_id'=>'1|string',
            'category'=>'1|string',
            'actions'=>'0|string|0-1000',
            'force_permission_id'=>'0|number' //if action is "create" and no permission_id, the default AUTO ID is created for permission ID
        ];

        $res = validateObject($arr, $v_rule,true,['actions'=>[',','|',';']],$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $app_id = $inputs['app_id'];
        $str_actions= $inputs['actions'];
        unset($inputs['actions']);
        $actions = array_filter(explode('|', $str_actions), function($value) {
            return !is_null($value) && $value !== '';
        });

        $bin_app_id = $app_id? hex2bin($app_id): null;
        if(!$bin_app_id) return DV::error('App ID is required');
        if( !self::appExists($bin_app_id)) return DV::error('App ID does not exist');
        $inputs['app_id'] =  $bin_app_id;
        $prn_name = $inputs['name'];
        $force_permission_id = $inputs['force_permission_id'];
        unset($inputs['force_permission_id']);
        $id = saveData($ss,'um_permissions',['id'=>$id],$inputs,[],0,false);
        $change_id_error =null;
        if ($force_permission_id <> $id && $id > 0){
            $change_id_error  = self::changePermissionId($force_permission_id, $id);
            if(!$change_id_error) $id = $force_permission_id;
        }
        if($id > 0){
            DB::table('um_permission_actions')->where('permission_id',$id)->delete();
            $cnt =0;
            foreach($actions as $action){
                DB::table('um_permission_actions')->insert([
                    'permission_id'=>$id,
                    'action_name'=>$action
                ]);
                $cnt++;
            }
           if(isset($actions[0])) 
             DB::table('um_role_permissions')->where('permission_id',$id)->whereNotIn('action_name',$actions)->delete();
           else DB::table('um_role_permissions')->where('permission_id',$id)->whereNotIn('action_name',['primary'])->delete();
           DB::table('um_permissions')->where('id',$id)->update(['action_count'=>$cnt]);
        }
        return DV::depends($id, ['id'=>$id, 'name'=>$prn_name, 'change_id_error'=>$change_id_error], 'Something wrong! Maybe the permission table parimary is not AUTO NUMBER'); 
    }

 /**
 * Updates the primary key ID of a permission and its foreign key references.
 *
 * @param int $new_permission_id The new ID to be set.
 * @param int $old_id The current ID of the record.
 * @return string|null Returns null on success or an error message on failure.
 */
static function changePermissionId($new_permission_id, $old_id)
{
    // Define the table names
    $permission_table = 'um_permissions';
    $role_permissions_table = 'um_role_permissions';
    $user_permissions_table = 'um_user_permissions';

    if ($new_permission_id === $old_id || !$old_id) {
        return null; // No changes needed
    }

    try {
        // Begin a transaction for safety
        DB::beginTransaction();

        // Determine the database driver
        $dbDriver = DB::getDriverName();

        if ($dbDriver === 'sqlsrv') {
            // Enable IDENTITY_INSERT for MSSQL
            DB::statement("SET IDENTITY_INSERT $permission_table ON");
        }

        // Check if the old ID exists in the primary table
        $exists = DB::table($permission_table)->where('id', $old_id)->exists();
        if (!$exists) {
            throw new \Exception("No record found with ID $old_id in the permissions table.");
        }

        // Update the main table's primary key
        DB::table($permission_table)
            ->where('id', $old_id)
            ->update(['id' => $new_permission_id]);

        // Update related foreign keys in the role permissions table (if they exist)
        DB::table($role_permissions_table)
            ->where('permission_id', $old_id)
            ->update(['permission_id' => $new_permission_id]);

        // Update related foreign keys in the user permissions table (if they exist)
        DB::table($user_permissions_table)
            ->where('permission_id', $old_id)
            ->update(['permission_id' => $new_permission_id]);

        if ($dbDriver === 'sqlsrv') {
            // Disable IDENTITY_INSERT for MSSQL
            DB::statement("SET IDENTITY_INSERT $permission_table OFF");
        }

        // Commit the transaction
        DB::commit();

        return null; // Success
    } catch (\Exception $e) {
        // Rollback the transaction on error
        DB::rollBack();

        // Return the error message
        $err = $e->getMessage();

            // Check if the error message contains 'Integrity constraint violation'
            if ($err && strpos($err, 'Integrity constraint violation') !== false) {
                $err = "$new_permission_id is duplicate with existing permission ID, so permission ID $old_id is used";
            }

            return $err;

    }
 }

    function delete($id,$ss=null){
        $ss = $ss?? $this->userInfo;
        $id = $id ?? $this->id;
        foreach(self::$foreign_tables as $table =>$info){
            DB::table($table)->where($info['fk_name'],$id)->delete();
        }
        DB::table('um_permissions')->where('id',$id)->delete();
        DB::table('reports')->where('permission_id',$id)->update(['permission_id'=>null]);
        return DV::depends(1);
    }
  
    /** import json text and make save to um_permissions, by ensuring the existing permissions stay intact */
    static function importJson($arr,$ss=null){
        return DV::depends(1);
    }
    static function getFormOptions($id,$ss){
        $str_app_id = DBX::getHEX('app.id','value');
        $str_app_id1= DBX::getHEX('m.app_id','app_id');
        return (object)[
           'permission'=> $id? self::details($id):null,
           'apps' => DB::table('um_applications as app')->selectRaw($str_app_id.',app.name as label')->get(),
           'modules'=> DB::table('um_app_modules as m')->where('hidden',0)->selectRaw('m.id AS value,m.name AS label,'.$str_app_id1)->get(),
           'categories'=>[
             ['value'=>'create', 'label'=>'Create'],
             ['value'=>'update', 'label'=>'Update'],
             ['value'=>'delete', 'label'=>'Delete'],
             ['value'=>'special' ,'label'=>'Special'],
           ]
        ];
    }
}
