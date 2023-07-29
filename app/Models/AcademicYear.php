<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
class AcademicYear //extends Model
{
    // use HasFactory;
    static function save($arr=[],$id=null,$ss){
        $v_rule = [
            'academic_year' => '1|string',
            'start_date' => '1|string',
            'end_date' => '1|string',
        ];

        $res = validateObject($arr,$v_rule,0,[],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;

        $newID = saveData($ss,'academic_years',['id' => $id],$inputs,[],1);
        return DV::depends($newID,['action' => 'saved','academic_years' => self::list($ss)]);
    }

    static function list($ss){
        $branch_id = $ss->branch_id;
        $rows = DB::table('academic_years')->selectRaw('academic_year,start_date,end_date')->where('branch_id',$branch_id)->get();
        return $rows;
    }

    static function details($id,$ss){
        $branch_id = $ss->branch_id;
        $row = DB::table('academic_years')->selectRaw('academic_year,start_date,end_date')->where('id',$id)->where('branch_id',$branch_id)->first();
        return $row;
    }

    static function delete($id,$ss){
        $branch_id = $ss->branch_id;
        $row = DB::table('academic_years')->where('id',$id)->where('branch_id',$branch_id)->delete();
        return DV::depends($row,['action' => 'Deleted','academic_years' => self::list($ss)]);
    }

}
