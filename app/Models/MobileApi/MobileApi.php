<?php

namespace App\Models\MobileApi;

use App\Models\DV;
use App\Models\GeneralSettings;
use App\Models\PublicStorage;
use App\Models\StudentAttendance;
use App\Models\Notifier;
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
use Illuminate\Support\Facades\Hash;
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

    static function getProfile($id,$branch_id){
        $row = DB::table('guardians')->where('id',$id)->selectRaw('file_name')->first();
        if(isset($row->file_name)==null) return (object)['image_url' => null];
        $row->image_url = PublicStorage::getUrl($branch_id,'guardians','image').$row->file_name;
        unset($row->file_name);
        return $row->image_url;
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
            }else $row->image_url = null;
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
            $class = $this->getStudentLatestEnrollment($child->student_id,$ss);
            $child->class = null;
            if($class) $child->class = $class->program.'('.$class->level.')';
            unset($child->file_name);
        }

        $res =(object)[
            'banner' => $banner,
            'children' => $children,
        ];
        return $res;
    }

    function guardianProfile($ss){
        $row = DB::table('guardians as g')
            ->where('g.id',$ss->official_id)
            ->selectRaw('g.file_name,name,sex,address,role,n_id as national_id,email,phone_number')
            ->first();
        if(isset($row->file_name)){
            $row->image_url = PublicStorage::getUrl($ss->branch_id,'guardians','image').$row->file_name;
        }else $row->image_url = null;
        unset($row->file_name);
        return $row;
    }


    function changePassword($arr=[],$ss){

        $v_rule = [
            'old_password' => '1|string',
            'new_password' => '1|string',
        ];

        $res = validateObject($arr,$v_rule,false,[],$ss->lang,false,null);

        if($res->error) return JDV::error($res->error);

        $inputs = $res->values;
        $d = (object)$inputs;
        $findUpdate = DB::table('um_users')->where('official_id',$ss->official_id)->where('user_class','parent')->get()->first();

        if(Hash::check($d->old_password,$findUpdate->hpwd)){
            $hpwd = Hash::make($inputs['new_password']);
            $save = DB::table('um_users')->where('official_id',$ss->official_id)->where('user_class','parent')->update([
                'hpwd' => $hpwd,
            ]);
            return DV::success(['message'=>'Password has been changed']);
        }else{
            return DV::error('Your password is not correct');
        }
    }

    function changeProfile($arr=[],$ss){
        $v_rule = [
            'photo' => '0|image',
            'address' => '0|string',
        ];
        $res = validateObject($arr,$v_rule,false,[],$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $image = $inputs['photo'];
        unset($inputs['photo']);
        $update = DB::table('guardians')->where('id',$ss->official_id)->update([
            'address' => $inputs['address'],
        ]);
        $update = PublicStorage::saveImage($ss->branch_id,'guardians',null,$image,null,['id'=>$ss->official_id,'store' => 'guardians.file_name']);
        return DV::depends($update,'Profile has been changed');
    }


    function getStudentLatestEnrollment($student_id,$ss){
        $row = DB::table('enrollments as e')->where('e.branch_id',$ss->branch_id)->where('e.student_id',$student_id)
            ->selectRaw('e.level_id,e.academic_year')
            ->orderBy('e.id','desc')
            ->first();
        if($row){
            $row->level = GeneralSettings::getLevel($row->level_id,$ss)->name;
            $row->program = GeneralSettings::getProgramByLevel($row->level_id,$ss)->program;
        }
        if(!$row) return $row=null;
        return $row;
    }


    // get Student Invoices
    function getChildrenInvoices($arr = [], $ss) {

        $tmps = $this->homePage($ss)->children;

        $childrenID = [];

        foreach ($tmps as $child) {
            $childrenID[] = $child->student_id;
        }

        $combinedData = [];

        $invoices = DB::table('invoices as i')
            ->whereIn('student_id', $childrenID)
            ->join('students as s', 'i.student_id', '=', 's.id')
            ->join('invoice_items as ivit','ivit.invoice_id','=','i.id')
            ->selectRaw('i.currency_code,formatDate(i.invoice_date) as date,ivit.discount,i.student_id, i.id as invoice_id, i.amount, i.invoice_number, i.due_amount, i.is_paid, s.name')
            ->orderBy('i.is_paid', 'desc')
            ->orderBy('i.id', 'desc')
            ->get();

        $paidInvoicesCount = [];

        foreach ($invoices as $invoice) {
            $invoice->discount = $invoice->discount.'%';
            $invoice->due_amount = $invoice->due_amount.' '.$invoice->currency_code;
            $invoice->late_fee = 0;
            if ($invoice->is_paid == 0) {
                $invoice->status_text = 'unpaid';
                $combinedData['unpaid_invoice'][] = $invoice;
            } else {
                $invoice->status_text = 'paid';

                // Check if not reached the limit of $limit paid invoices for this student
                $limit = 3;
                if (!isset($paidInvoicesCount[$invoice->student_id]) || $paidInvoicesCount[$invoice->student_id] < $limit) {
                    $combinedData['paid_invoice'][] = $invoice;

                    if (!isset($paidInvoicesCount[$invoice->student_id])) {
                        $paidInvoicesCount[$invoice->student_id] = 1;
                    } else {
                        $paidInvoicesCount[$invoice->student_id]++;
                    }
                }
            }
        }

        // foreach ($invoices as $invoice) {
        //     $invoice->discount = $invoice->discount.'%';
        //     $invoice->due_amount = $invoice->due_amount.' '.$invoice->currency_code;

        //     if ($invoice->is_paid == 0) {
        //         $invoice->status_text = 'unpaid';
        //         $combinedData['unpaid_invoice'][] = $invoice;
        //     } else {
        //         $invoice->status_text = 'paid';
        //         $combinedData['paid_invoice'][] = $invoice;
        //         // $combinedData['paid_invoice'][] = $invoices->take(2);
        //     }
        // }

        return $combinedData;
    }

    function getStudentEnrollemntDetails($student_id,$ss){
        $str_search = '1=1';
        if($student_id){
            $str_search = 'e.student_id = ' . $student_id;
        }
        $rows = DB::table('enrollments as e')->whereRaw($str_search)->selectRaw('e.status_id,e.tuition_end_date,e.campus_id,e.level_id,e.id,e.start_date,e.session_id')->get();
        foreach($rows as $row){
            $tuition_end_date = $row->tuition_end_date;
            $row->level = GeneralSettings::getLevel($row->level_id,$ss)->name;
            $row->campus = GeneralSettings::getCampus($row->campus_id)->name;
            $row->session = GeneralSettings::getSession($row->session_id)->name;
            $row->pmt_status = 'unpaid';
            if(isset($tuition_end_date)){
                if($tuition_end_date > date('Y-m-d') && $row->status_id == 3){
                    $row->pmt_status = 'paid';
                }
                else if($tuition_end_date < date('Y-m-d') && $row->status_id == 3){
                    $row->pmt_status = 'expired';
                }
                else $row->pmt_status = 'unpaid';
            }
        }
        return $rows;
    }


    function getSocialMedia($ss){
        $branch_id = $ss->branch_id;
        $rows = DB::table('social_media')->where('branch_id',$branch_id)->selectRaw('file_name,title as name,url')->get();
        foreach($rows as $row){
            if($row->file_name != null){
                $row->image_url = PublicStorage::getUrl($branch_id,'social_media','image').$row->file_name;
            }else  $row->image_url = $row->file_name;
            unset($row->file_name);
        }
        return $rows;
    }
}
