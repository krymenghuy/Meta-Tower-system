<?php

namespace App\Models\MobileApi;

use App\Models\GeneralSettings;
use App\Models\PublicStorage;
use App\Models\StudentAttendance;
use App\Models\Notifier;
use App\Models\DV;
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
class MobileApi //xtends Model
{
    // use HasFactory;
    function pickupMyKids($student_id,$ss){
        $row = DB::table('students as st')->where('branch_id',$ss->branch_id)->where('id',$student_id)->take(1)->selectRaw('audio_file')->get()->first();
        if(!$row) return DV::error('Student identity is not correct');
        $audio_file_name = $row->audio_file;
        $audioUrl =null;
        if($audio_file_name) $audioUrl = PublicStorage::getUrl( $ss->branch_id,'students','audio').$audio_file_name;
        $d = (object)['branch_id' => $ss->branch_id,'sender_id' =>$ss->official_id,'student_id'=>$student_id,'file_url'=>$audioUrl,'persist'=>0];
        if(!$audioUrl) return DV::error('Failed to call your kid\'s name because audio file is missing');
        $err = Notifier::notify_admin('pickup_call', $d);
        if($err){
           return DV::error($err);
        }
        return DV::success();
    }

    function attendanceList($filter){
        $att = new StudentAttendance();
        $row =  $att->getAttendanceDetails($filter);
        return $row;
    }

    function homePage($ss){
        $banner = DB::table('banners')->selectRaw('file_name')->get();
        $branch_id = $ss->branch_id;
        foreach($banner as $row){
            if($row->file_name){
                $row->image_url = PublicStorage::getUrl($branch_id,'banners','image').$row->file_name;
            }
            unset($row->file_name);
        }

        $children = DB::table('students as s')
                ->join('student_guardians as sg','sg.student_id','=','s.id')
                ->join('guardians as g','g.id','=','sg.guardian_id')
                ->where('g.id',$ss->official_id)
                ->distinct()
                ->selectRaw('s.name,s.id as student_id,date_of_birth,s.phone_number,s.name_kh,s.file_name')
                ->get();
        foreach($children as $child){
            $child->image_url = PublicStorage::getUrl($branch_id,'students','image').$child->file_name;
            $child->class = $this->getStudentLatestEnrollment($child->student_id,$ss)->program.'('.$this->getStudentLatestEnrollment($child->student_id,$ss)->level.')';
            unset($child->file_name);
        }

        $res = [
            'banner' => $banner,
            'children' => $children,
        ];
        return $res;
    }

    function guardianProfile($ss){
        $row = DB::table('guardians as g')
            ->where('g.id',$ss->official_id)
            ->selectRaw('file_name,name,sex,address,role,n_id as national_id,email,phone_number')
            ->first();
        $row->image_url = PublicStorage::getUrl($ss->branch_id,'guardians','image');
        return $row;
    }

    function getStudentLatestEnrollment($student_id,$ss){
        $row = DB::table('enrollments as e')->where('e.branch_id',$ss->branch_id)->where('e.student_id',$student_id)
            ->selectRaw('e.level_id,e.academic_year')
            ->first();
        $row->level = GeneralSettings::getLevel($row->level_id,$ss)->name;
        $row->program = GeneralSettings::getProgramByLevel($row->level_id,$ss)->program;

        return $row;
    }
}
