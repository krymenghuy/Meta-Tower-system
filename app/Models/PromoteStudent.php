<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
class PromoteStudent //extends Model
{
    // use HasFactory;
    protected $id=null,$ss=null;


    function __construct($id=null,$ss=null){
        $this->id = $id;
        $this->ss = $ss;
    }
    function promoteStudents($arr=[],$ss){
        $price_list = new PriceList(null,$ss);
        $promote_info = null;
        if(isset($arr['promote_info'])){
            $promote_info = $arr['promote_info'];
        }else return DV::error('promote_info is required');
        $success = 0;
        $keeps=[];
        foreach($promote_info as $info){
            $v_rule = [
                'student_id' => '1|number|exists=students.id',
                'to_level_id' => '0|number|exists=program_levels.id',
                'term_id' => '1|number|exists=terms.id',
                'session_id' => '0|number|exists=sessions.id',
                'campus_id' => '0|number|exists=campuses.id',
                'start_date' => '0|string',
            ];
            $res = validateObject($info,$v_rule,1,[],$ss->lang,0,null);
            if($res->error) return DV::error($res->error);
            $inputs = $res->values;
            $d = (object)$inputs;
            $student_id = $d->student_id;
            $studentInfo = GeneralSettings::studentInfo($student_id);
            $level_id = isset($d->to_level_id)?$d->to_level_id:$studentInfo->level_id;
            $session_id = isset($d->session_id)?$d->session_id:$studentInfo->session_id;
            $campus_id = isset($d->campus_id)?$d->campus_id:$studentInfo->campus_id;
            $start_date = isset($d->start_date)?convertDate($d->start_date):date('Y-m-d');
            $academic_year = isset($d->academic_year)?$d->academic_year:$studentInfo->academic_year;
            $pmt_option_id = isset($d->pmt_option_id)?$d->pmt_option_id:$studentInfo->pmt_option_id;
            $term_id =  isset($d->term_id)?$d->term_id:$studentInfo->term_id;
            $level = GeneralSettings::getLevel($level_id,$ss);
            $new_enroll = [
                'student_id' => $student_id,
                'level_id' => $level_id,
                'session_id' => $session_id,
                'campus_id' => $campus_id,
                'start_date' => $start_date,
                'program_id' => $level->program_id,
                'term_id' => $term_id,
                'status_id' => 1,
                'school_id' => $studentInfo->school_id,
                'academic_year' => $academic_year,
            ];

            //

            $newEnrID = saveData($ss,'enrollments',['id' => null],$new_enroll,[],1);
            if($newEnrID){
                $months = 0;
                if($pmt_option_id == 1){
                    $months = 3;
                }else if($pmt_option_id == 2){
                    $months = 6;
                }else if($pmt_option_id == 3){
                    $months = 12;
                }

                $payment_process = $price_list->payment_processing([
                    'pmt_option_id' => $pmt_option_id,
                    'start_date' => $start_date,
                    'level_id' => $level_id,
                    'session_id' => $session_id,
                    'months' => $months,
                    'academic_year' => $academic_year,
                ]);

                $new_pmt_arr = [
                    'term_id' => $term_id,
                    'level_id' => $level_id,
                    'session_id' => $session_id,
                    'enrollment_id' => $newEnrID,
                    'pmt_option_id' => $pmt_option_id,
                    'status_id' => 1, // unpaid
                    'pmt_status' => 'unpaid', //
                    'price_list_id' => $payment_process->price_list_id,
                    'tuition' => $payment_process->tuition,
                    'tuition_due' => $payment_process->tuition_due,
                    'program_id' => $level->program_id,
                    'policy_discount' => $payment_process->discount->discount,
                    'is_new_student' => 1
                ];

                $new_pmt_id = saveData($ss,'payments',['id' => null],$new_pmt_arr,[],1);
                if($new_pmt_id){
                    DB::table('enrollment_payment')->insert([
                        'enrollment_id' => $newEnrID,
                        'pmt_id' => $new_pmt_id
                    ]);
                    DB::table('enrollments')->where('id',$newEnrID)->update([
                        'tuition_end_date' => $payment_process->end_date,
                    ]);
                }
            }
            // $keeps[] = $new_enroll;

            $success ++;
            // $arr_
        }
        return DV::depends($success,['action'=>'Promoted']);
    }

}
