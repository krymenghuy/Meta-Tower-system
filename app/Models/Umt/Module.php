<?php

namespace App\Models\Umt;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use App\Models\DV;
use App\Models\DBX;
use DB;
class Module //extends Model
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
        $get_app_id = DBX::getHEX('m.app_id','app_id');
        $str_search = $search_value ? ' app.name LIKE \'%'.escape_like_str($search_value).'%\'': '3=3';
        $rows = DB::table('um_app_modules as m')->join('um_applications as app','app.id','=','m.app_id')->where('app.id', $bin_app_id )->whereRaw($str_search)
        ->selectRaw($get_app_id.',m.id, CONCAT(m.name,\' (\',m.id,\')\') AS name,m.parent_module_id, app.name AS app_name')->get();
        return $rows;
    }

    static function details($id){
        return DB::table('um_app_modules as m')->join('um_applications as app','app.id','=','m.app_id')->where('m.id', $id )
        ->selectRaw(DBX::getHEX('app.id','app_id').',m.id, m.name AS name, m.parent_module_id,app.name AS app_name')->first();
    }

    static function appExists($bin_app_id){
        return DB::table('um_applications')->where('id',$bin_app_id)->value('name');
    }

    function save($arr,$id = null, $ss = null){
        $ss =$ss ?? $this->userInfo;
        $id = $id ?? $this->id;
        $v_rule = [
            //'number'=>'0|positive',
            'name'=>'1|string|1-250',
            'app_id'=>'1|string',
            'hidden'=>'0|number|default=0',
            'parent_module_id'=>'0|number',
        ];
         
        $res = validateObject($arr, $v_rule,true,[],$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $app_id = $inputs['app_id'];
        $bin_app_id = $app_id? hex2bin($app_id): null;
        if(!$bin_app_id) return DV::error('App ID is required');
        if( !self::appExists($bin_app_id)) return DV::error('App ID does not exist');
        $inputs['app_id'] = $bin_app_id;
        $module_name = $inputs['name'];
        $inputs['name_native'] = $module_name;
        $id = saveData($ss,'um_app_modules',['id'=>$id],$inputs,[],0,false);
        return DV::depends($id, ['id'=>$id,'name'=>$module_name]); 
    }

    function delete($id,$ss=null){
        $ss = $ss?? $this->userInfo;
        DB::table('um_app_modules')->where('id',$id)->delete();
        DB::table('um_role_modules')->where('id',$id)->delete();
        DB::table('um_user_modules')->where('id',$id)->delete();
        return DV::depends(1);
    }
  
    /** import json text and make save to um_permissions, by ensuring the existing permissions stay intact */
    static function importJson($arr,$ss=null){
        return DV::depends(1);
    }

   static function getFormOptions($id,$ss){
    $str_app_id = DBX::getHEX('app.id','value');
    return (object)[
       'module'=> $id? self::details($id):null,
       'apps' => DB::table('um_applications as app')->selectRaw($str_app_id.',app.name as label')->get(),
       'visible_options'=>[
          [
            'value'=>1,
            'label'=>'Hidden'
          ],
          [
            'value'=>0,
            'label'=>'Visible'
          ]
       ]
    ];
}
  
}