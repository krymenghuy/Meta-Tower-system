<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DB;

class Employee extends Model
{
    use HasFactory;

    protected $table="employees";
    protected $guard =['id'];
    protected $primaryKey ="id";
    protected $timestamps = true;
    
    protected $consultant_position_id = 1;

    // static function comboItems_consultant($branch_id=0){
    //     $position_id =1;
    //     return DB::table('employees as e')->join('persons as p','p.id','=','e.person_id')->where('e.branch_id',$branch_id)->whereRaw("hasPosition(e.id,$position_id)=1")->selectRaw("e.id,e.code,p.name")->get(); 
    // }
    // static function consultantList($branch_id=0){
    //     $position_id =1;
    //     return DB::table('employees as e')->join('persons as p','p.id','=','e.person_id')->where('e.branch_id',$branch_id)->whereRaw("hasPosition(e.id,$position_id)=1")->selectRaw("e.id,e.code,p.name")->get(); 
    // }

    // static function create($d){
    //     $branch_id = Session::get('branch_id',0);
    //     $m = super::create($d);
    //     if($m->id > 0 ){
    //         self::setCode($branch_id);
    //         DB::table('employee_positions')->insert([
    //             'emp_id'=>$m->id,
    //             'position_id'=>$d['position_id'],
    //             'create_user'=>Session::get('full_name'),
    //             'created_at'=>getNowTime(),
    //             'create_uid'=>Session::get('user_id')
    //         ]);
    //     }
    //    return $m; 
    // }
}
