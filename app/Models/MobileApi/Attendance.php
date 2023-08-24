<?php

namespace App\Models\MobileApi;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use App\Models\DV;
use App\Models\StudentAttendance;
use DB;
class Attendance //extends Model
{
    // use HasFactory;
    function attendanceList($filter){
        // $row = DB::table('students as s')
        //     ->where('s.id', $student_id)
        //     ->selectRaw('s.id as student_id,s.name')
        //     ->first();
        $att = new StudentAttendance();
        $row =  $att->getAttendanceDetails($filter);

        return $row;
    }
}
