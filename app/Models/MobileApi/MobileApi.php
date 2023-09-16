<?php

namespace App\Models\MobileApi;

use App\Models\DV;
use App\Models\GeneralSettings;
use App\Models\PublicStorage;
use App\Models\StudentAttendance;
use App\Models\Notifier;
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use App\Models\UM;
use DB;
use Config;
use Illuminate\Support\Facades\Hash;
class MobileApi //xtends Model
{
    // use HasFactory;
    function pickupMyKids($arr,$ss){
        $str_ids = null;
        $ids =[];
        $i=0;
        foreach($arr as $st){
            $id = $st['id'];
            if($id > 0) $ids[] = $id;
            $i++;
        }

        if($i===0) return DV::error('No student IDs provided');
        $str_ids ='st.id IN ('.implode(',',$ids).')';
        $rows = DB::table('students as st')->where('st.branch_id',$ss->branch_id)->whereRaw($str_ids)->selectRaw('st.id,st.name,st.audio_file')->get();
        $students = [];
        if(!isset($rows[0])) return DV::error('The provided IDs are not correct');
        foreach($rows as $row){
            $audio_file_name = $row->audio_file;
            $audioUrl =null;
            if($audio_file_name) $audioUrl = PublicStorage::getUrl( $ss->branch_id,'students','audio').$audio_file_name;
            if(!$audioUrl)
              $errors[] = 'Failed to call '.$row->name.'\' s name because the audio file is missing';
            else $students[] = (object)['student_id'=>$row->id,'file_url'=>$audioUrl];
        }
        //if(!$row) return DV::error('Student identity is not correct');
        if(!isset($students[0])) return DV::error('Failed to call all your kid\'s names. This is likely because the audio files were unavailable');
        $d = (object)['branch_id' => $ss->branch_id,'sender_id' =>$ss->official_id,'students'=>$students,'persist'=>0];
        $err = Notifier::notify_admin('pickup_call', $d);
        if($err) return DV::error($err);
        return DV::success();
    }

    static function getProfile($user){
        $official_id = $user->official_id;
        $branch_id = $user->branch_id;
        $user_class = $user->user_class;
        $row = DB::table('guardians')->where('id',$official_id)->selectRaw('file_name')->first();
        if(!$row) return null;
            if ($row->file_name == null) {
                $row = (object)['image_url' =>''];
            } else {
                $row->image_url = PublicStorage::getUrl($branch_id, 'guardians', 'image').$row->file_name;
                $row->notif_public_topic = $branch_id.topic_prefix($user_class)."public" ;
                $row->notif_private_topic = $branch_id.topic_prefix($user_class)."private".$official_id;
            }
        return $row;
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

        $children = $this->children($ss);

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
            'profile' => self::getProfile($ss),
            'social_media' => $this->getSocialMedia($ss),
            'payments' => $this->getChildrenInvoices(null,$ss)
        ];
        return $res;
    }

    function children($ss){
        $children = DB::table('students as s')
                ->join('student_guardians as sg','sg.student_id','=','s.id')
                ->join('guardians as g','g.id','=','sg.guardian_id')
                ->where('g.id',$ss->official_id)
                ->distinct()
                ->selectRaw('s.name,s.id as student_id,date_of_birth,s.phone_number,s.name_kh,s.file_name')
                ->get();
        return $children;
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

        if($res->error) return DV::error($res->error);

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
    function getChildrenInvoices($arr=null, $ss) {

        $tmps = $this->children($ss);

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
            if(isset($tuition_end_date) !=null){
                if($tuition_end_date > date('Y-m-d') && $row->status_id == 3){
                    $row->pmt_status = 'paid';
                }
                else if($tuition_end_date < date('Y-m-d') && $row->status_id == 3){
                    $row->pmt_status = 'expired';
                }
                else $row->pmt_status = 'unpaid';
            }else $row->tuition_end_date = 'N/A';
        }
        return $rows;
    }


    function getSocialMedia($ss){
        $branch_id = $ss->branch_id;
        $rows = DB::table('social_media')->where('branch_id',$branch_id)->selectRaw('id,file_name,title as name,url')->get();
        foreach($rows as $row){
            if($row->file_name != null){
                $row->image_url = PublicStorage::getUrl($branch_id,'social_media','image').$row->file_name;
            }else  $row->image_url = $row->file_name;
            unset($row->file_name);
        }
        return $rows;
    }

    function childLatestInvoice($childID,$ss){
        $selectCols = 's.name,i.due_amount,i.paid_amount,i.pmt_date,formatDate(i.pmt_date) as payment_date,i.is_paid,i.id as invoice_id,i.currency_code,e.tuition_end_date,r.receipt_number';
        $row = DB::table('invoices as i')
            ->join('receipts as r','r.invoice_id','i.id')
            ->join('receipt_amount as ra','ra.invoice_id','=','r.id')
            ->join('enrollments as e','e.id','=','i.id')
            ->join('students as s','s.id','=','i.student_id')
            ->where('i.student_id',$childID)
            ->where('i.invoice_type','tuition_fee')
            ->selectRaw($selectCols)->orderBy('i.id','desc')->limit(1)->first();
        if($row){
            $row->status_text = "unpaid";
            if($row->is_paid == 1 ){
                $row->status_text = "paid";
            }
            $row->discount = DB::table('invoice_items')->where('fee_type','tuition_fee')->where('invoice_id',$row->invoice_id)->first()->discount;
            $row->discount_type = 'percentage';
            $row->late_fee = 0;
            // $row->receipt = self::getInvoiceReceipt($row->invoice_id);
            $row->period = dateDiffMonths($row->pmt_date,$row->tuition_end_date);
            unset($row->pmt_date,$row->tuition_end_date);
        }
        return $row;
    }

    function register($arr){
        //** */
        $ss = (object)['user_id'=>1,'branch_id'=>1,'lang'=>'en','full_name'=>'admin','user_class'=>'admin'];
        $v_rule = [
            'login_name' => '1|string',
            'password' => '1|string',
            'phone_number' => '1|number',
            'email' => '0|email',
            'name' => '1|string',
            'sex' => '1|choice|F,M',
        ];

        $res = validateObject($arr,$v_rule,false,[],'en',0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $d = (object)$inputs;
        if(strlen($inputs['password']) > 20 || strlen($inputs['password']) < 6) return DV::error('password must be between 6 and 20');
        $um = new UM();
        $guardian = [
            'name' => $d->name,
            'phone_number' => $d->phone_number,
            'email' => $d->email,
            'sex' => $d->sex,
            'role' => $d->sex == 'F' ? 'mother':'father'
        ];
        $newGuardian = saveData($ss,'guardians',['id' => null,],$guardian,[],1);
        if($newGuardian>0){
            $official_id = $newGuardian;
            $um_arr= [
                'login_name' =>$d->login_name,
                'user_class' => 'parent',
                'role_id' => '16',
                'email' => $d->email,
                'password' => $d->password,
                'full_name' => $d->name,
                "official_id" => $official_id,
            ];
            $x = $um->saveUser($um_arr,$ss);
            if($x->status != 'OK') return DV::error($x->error_message);
            return DV::success(['message' => 'Registration successful']);
        }
        return DV::error('Something went wrong with the registration');

    }

    function deleteAccount($ss){
        DB::table('guardians')->where('id',$ss->official_id)->delete();
        DB::table('um_users')->where('official_id',$ss->official_id)->delete();
        return DV::success(['message'=>'Account deleted!','dd'=>$ss->official_id]);
    }

    function isShow(){
        return DV::result((object)['isShow'=>1]);
    }


    function getInvoiceReceipt($inv_id){
        $row = DB::table('receipts as r')->where('r.invoice_id',$inv_id)->join('receipt_amount as ra','r.id','=','ra.receipt_id')->selectRaw('r.receipt_amount')->get()->first();
        if(!$row) return null;
        return $row;
    }
}
