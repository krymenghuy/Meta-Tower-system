<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
class Activity //extends Model
{
    // use HasFactory;
    static function save($arr,$id,$ss){
        $v_rule = [
            'name' => '1|string|1,50',
        ];
        $res = validateObject($arr,$v_rule,1,[],$ss->lang,0,null);
        if($res->error)return DV::error($res->error);
        $inputs = $res->values;
        $exist = DB::table('')->where('id',$id)->where('name',$inputs['name'])->first();
        if($exist){
            return DV::error('Activity is already exist');
        }
        $newID = saveData($ss,'',['id' => $id],$inputs,[],1);

        return DV::depends($newID,['action'=>'Save','activities'=>self::list($ss)]);
    }

    static function list($ss){
        return DB::table('activities')->where('branch_id',$ss->branch_id)->selectRaw('name,id')->get();
    }

    static function details($id,$ss){
        return DB::table('activities')->where('branch_id',$ss->branch_id)->where('id',$id)->selectRaw('name,id')->get()->first();
    }

    static function student_activity($arr,$ss){
        $v_rule = [
            'name' => '1|string|1,50',
        ];
        $res = validateObject($arr,$v_rule,1,[],$ss->lang,0,null);
        if($res->error)return DV::error($res->error);
        $inputs = $res->values;
    }

    static function delete($id,$ss){
        $in_use = false;
        if($in_use) return DV::error('Activity is already');
        $delele = DB::table('activities')->where('branch_id',$ss->branch_id)->delete();
        return DV::depends($delele,'Deleted');
    }
}
