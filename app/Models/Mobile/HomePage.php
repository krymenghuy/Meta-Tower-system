<?php

namespace App\Models\Mobile;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use App\Models\PublicStorage;
use DB;
class HomePage //extends Model
{
    // use HasFactory;
    static function getConnectedStudent($ss){
        $selectCols='s.name as student_name,s.file_name';
        $rows = DB::table('student_guardians as sg')
                ->join('guardians as g','sg.guardian_id','=','g.id')
                ->join('students as s','s.id','=','sg.student_id')
                ->selectRaw($selectCols)
                ->where('g.id',$ss->official_id)
                ->get();

        foreach($rows as $row){
            $row->image_url = PublicStorage::getUrl($ss->branch_id,'students','image').$row->file_name;
            unset($row->file_name);
        }
        return $rows;
    }
}
