<?php
namespace App\Models;
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;

class Campus //extends Model
{
    // use HasFactory;
    static function save($arr=[],$id=null,$ss){
    $v_rule = [
            'name' => '1|string|1-350',
            'shortcut'=>'1|string|1-15',
            'address'=>'0|string|0-250',
            'loc_lat' => '0|number',
            'loc_lng' => '0|number',
        ];

        $res = validateObject($arr,$v_rule,0,[],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;

        $newID = saveData($ss,'campuses',['id' => $id],$inputs,[],1);
        return DV::depends($newID,['action' => 'saved','campuses' => self::list($ss)]);
    }

    static function list($ss){
        $branch_id = $ss->branch_id;
        $rows = DB::table('campuses as c')->selectRaw('c.name,c.shortcut,id')->where('c.branch_id',$branch_id)->get();
        return $rows;
    }

    static function details($id,$ss){
        $branch_id = $ss->branch_id;
        $row = DB::table('campuses')->where('id',$id)->selectRaw('id,name,shortcut')->where('branch_id',$branch_id)->first();
        return $row;
    }

    static function delete($id,$ss){
        $branch_id = $ss->branch_id;
        $row = DB::table('campuses')->where('id',$id)->where('branch_id',$branch_id)->delete();
        return DV::depends($row,['action' => 'Deleted','campuses' => self::list($ss)]);
    }
}
