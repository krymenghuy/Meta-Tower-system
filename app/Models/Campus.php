<?php
namespace App\Models;
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use DB;

class Campus //extends Model
{
    // use HasFactory;
    static function save($arr=[],$id=null,$ss){
        $v_rule = [
            'name' => '1|string|1-350|text=Campus Name cannot be empty',
            'shortcut'=>'1|string|1-15|text=Campus shortcut name is required',
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
        $rows = DB::table('campuses as c')->selectRaw('c.id,c.name,c.shortcut,id')->where('c.branch_id',$branch_id)->get();
        return $rows;
    }
    static function list_paginate($arr,$ss){
        $branch_id = $ss->branch_id;
        $d = (object)$arr;
        $current_page =isset($d->current_page)?$d->current_page:1;
        $per_page =isset($d->per_page)?$d->per_page:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;
    
        $query= DB::table('campuses as c')->selectRaw('c.id,c.name,c.shortcut,id')->where('c.branch_id',$branch_id);
        $count_query = clone  $query;
        $count = $count_query->count('c.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
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
