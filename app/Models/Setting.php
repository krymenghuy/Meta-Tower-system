<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
class Setting //extends Model
{
    // use HasFactory;
    static function pmt_options($ss){
        return DB::table('pmt_options')->selectRaw('name,id')->get();
    }

    static function price_list_options($ss){
        $branch_id = $ss->branch_id;
        return DB::table('price_list')->where('branch_id',$branch_id)->selectRaw('name,id')->get();
    }

    static function session_options($ss=null){
        $branch_id = $ss->branch_id;
        return DB::table('sessions')->where('branch_id',$branch_id)->selectRaw('name,id')->get();
    }

}
