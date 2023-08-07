<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
class Setting //extends Model
{


    static function select_options($ss){
        $res = [
            'price_list'=>self::price_list_options($ss),
            'sessions' => self::session_options($ss),
            'pmt_options' => self::pmt_options($ss),
            'programs' => self::programs_options($ss),
            'levels' => self::level_options($ss),
            'campuses' => self::campus_options($ss),
            'academic_year' => self::getAcademicYear($ss)
        ];
        return $res;
    }
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

    static function programs_options($ss=null){
        $branch_id = $ss->branch_id;
        return DB::table('programs')->where('branch_id',$branch_id)->selectRaw('name as program_name,id')->get();
    }

    static function level_options($ss=null){
        $branch_id = $ss->branch_id;
        return DB::table('program_levels')->where('branch_id',$branch_id)->selectRaw('name as level,id')->get();
    }

    static function campus_options($ss){
        $branch_id = $ss->branch_id;
        return DB::table('campuses')->where('branch_id',$branch_id)->selectRaw('name as campus,id')->get();
    }

    static function prevProgramOptions($ss=null){
        $branch_id = $ss->branch_id;
        return DB::table('programs')->where('branch_id',$branch_id)->selectRaw('name as program,id')->get();
    }

    static function prevProgramLevelOptions($ss=null){
        $branch_id = $ss->branch_id;
        return DB::table('program_levels')->where('branch_id',$branch_id)->selectRaw('name as level,id')->get();
    }

    static function getAcademicYear($ss=null){
        $branch_id = $ss->branch_id;
        return DB::table('academic_years')->where('branch_id',$branch_id)->selectRaw('academic_year')->get();
    }
}
