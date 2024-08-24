<?php

namespace App\Models\Umt;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use App\Models\DV;
use App\Models\DBX;
use DB;
class Permission //extends Model
{
    //use HasFactory;
    protected $id = null, $userInfo = null;
    function __construct($id = null,$userInfo=null)
    {
       $this->id = $id;
       $this->userInfo = $userInfo;   
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
        return DB::table('um_permissions as p')->join('um_applications as app','app.id','=','p.app_id')->join('um_app_modules as m','m.id','=','p.module_id')->where('p.id', $id )
        ->selectRaw( DBX::getHEX('app.id','app_id').',p.id, p.name, app.name AS app_name, m.name As module_name,m.id as module_id, p.category')->first();
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
            'category'=>'1|string'
        ];

        $res = validateObject($arr, $v_rule,true,[],$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $app_id = $inputs['app_id'];
        $bin_app_id = $app_id? hex2bin($app_id): null;
        if(!$bin_app_id) return DV::error('App ID is required');
        if( !self::appExists($bin_app_id)) return DV::error('App ID does not exist');
        $inputs['app_id'] =  $bin_app_id;
        $prn_name = $inputs['name'];
        $id = saveData($ss,'um_permissions',['id'=>$id],$inputs,[],0,false);
        return DV::depends($id, ['id'=>$id, 'name'=>$prn_name]); 
    }

    function delete($id,$ss=null){
        $ss = $ss?? $this->userInfo;
        DB::table('um_permissions')->where('id',$id)->delete();
        DB::table('um_role_permissions')->where('id',$id)->delete();
        DB::table('um_user_permissions')->where('id',$id)->delete();
        //DB::table('reports')->where('permission_id',$id)->delete();
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
