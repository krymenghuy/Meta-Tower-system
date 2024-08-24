<?php

namespace App\Models\Umt;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use App\Models\DV;
use App\Models\DBX;
use DB;

class App //extends Model
{
    //use HasFactory;
    protected static $id = null, $user_info = null; 
    function __construct($id = null, $user_info = null)
    {
        $this->id = $id;
        $this->user_info = $user_info;
    }

    function save($arr,$id =null, $ss=null){
         $v_rule = [
            'name'=>'1|string|300',
            'name_native'=>'0|string|0-250',
            'is_mobile_app'=>'1|choice|0,1',
            'icon_file_name'=>'0|string|150',
            'home_route'=>'0|string|50'
         ];
         $res = validateObject($arr,$v_rule,true,[],$ss->lang,false,null);
         if($res->error) return DV::error($res->error);
         $inputs = $res->values;
         $id = saveData($ss,'um_applications',['id'=>$id],$inputs,[],0,false,'binary');
         if($id){
             return DV::depends(1,['app_id'=>$id],'Failed to save application');
         }    
    }

    function delete($id){
      $id = hex2bin($id);  
      DB::table('um_applications')->where('id',$id)->delete();
      return DV::depends(1);
    }
    
    static function list($arr,$ss){
        //   $d = (object)$arr;
        //   $subs_id = $d->subs_id;  
      $cols =  DBX::getHEX('app.id','app_id'). ', app.name,app.name_native,app.is_mobile_app,app.home_route';
      $rows = DB::table('um_applications as app')->selectRaw($cols)->get();
      return $rows;
    }
}
