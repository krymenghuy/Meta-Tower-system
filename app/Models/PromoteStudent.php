<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;
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
        $program_id = isset($arr['program_id'])?$arr['program_id']:null ;
        $levels = DB::table('program_levels')->where('program_id',$program_id)->selectRaw('id')->get();
        $arr_level = [];
        foreach($levels as $level){
            $arr_level[] = $level->id;
        }
        $success = 0;
        $keeps=[];
        foreach($promote_info as $info){
            $v_rule = [
                'term_id' => '1|number|exists=terms.id',
                'next_term_id' => '0|number|exists=terms.id',
            ];
            $res = validateObject($info,$v_rule,1,[],$ss->lang,0,null);
            if($res->error) return DV::error($res->error);
            $inputs = $res->values;
            $d = (object)$inputs;
            $term_id = $d->term_id;
            $nextTerm = $d->next_term_id;
            $enr_status_id = 1; // 1=active, 2 = Drop Off, 3 = Suspended;
            $q = DB::table('enrollments as e')->where('e.term_id',$term_id)
                        ->join('payments as p','p.enrollment_id','=','e.id')
                        ->where('enrollment_status_id',$enr_status_id);
                        if($program_id){
                            $q->whereIn('e.level_id',$arr_level);
                        }
            $enr_info = $q->selectRaw('p.pmt_option_id,e.school_id,e.student_id,e.campus_id,e.session_id,e.level_id,e.program_id,e.academic_year,e.is_new_promote')
                        ->get();

            foreach($enr_info as $info){
                $level_id = isset($d->to_level_id)?$d->to_level_id:$info->level_id;
                $session_id = isset($d->session_id)?$d->session_id:$info->session_id;
                $campus_id = isset($d->campus_id)?$d->campus_id:$info->campus_id;
                $start_date = isset($d->start_date)?convertDate($d->start_date):date('Y-m-d');
                $academic_year = isset($d->academic_year)?$d->academic_year:$info->academic_year;
                $pmt_option_id = isset($d->pmt_option_id)?$d->pmt_option_id:$info->pmt_option_id;
                $term_id =  isset($d->term_id)?$d->term_id:$info->term_id;
                $nextLevel = GeneralSettings::getNextLevelByCurrentLevel($level_id,$ss);
                if(!$nextLevel) return DV::error('There is no next level');
                $student_id = $info->student_id;
                // $promoted = DB::table('enrollments')->where('is_new_promote',1)->exists();
                // if($promoted){
                //     continue;
                // }

                $new_enroll = [
                    'student_id' => $student_id,
                    'level_id' => $nextLevel->id,
                    'session_id' => $session_id,
                    'campus_id' => $campus_id,
                    'start_date' => $start_date,
                    'program_id' => $nextLevel->program_id,
                    'term_id' => $nextTerm,
                    'status_id' => 1,// is pending
                    'school_id' => $info->school_id,
                    'academic_year' => $academic_year,
                    'is_new_promote' => 1,
                ];
                $newEnrID = saveData($ss,'enrollments',['id' => null],$new_enroll,[],1);
                DB::table('enrollments')->where('student_id',$info->student_id)->update([
                    'is_new_student' => 0,
                ]);
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

                    // DB::table('enrollments')->where('id',$newEnrID)->update([
                    //     'tuition_end_date' => $payment_process->end_date,
                    //     'is_new_student' => 0,
                    //     'is_new_promote' => 1
                    // ]);

                    $new_pmt_arr = [
                        'term_id' => $nextTerm,
                        'level_id' => $nextLevel->id,
                        'session_id' => $session_id,
                        'enrollment_id' => $newEnrID,
                        'pmt_option_id' => $pmt_option_id,
                        'status_id' => 1, // unpaid
                        'pmt_status' => 'unpaid', //
                        'price_list_id' => $payment_process->price_list_id,
                        'tuition' => $payment_process->tuition,
                        'tuition_due' => $payment_process->tuition_due,
                        'program_id' => $nextLevel->program_id,
                        'policy_discount' => $payment_process->discount->discount,
                    ];

                    $new_pmt_id = saveData($ss,'payments',['id' => null],$new_pmt_arr,[],1);
                    DB::table('enrollment_payment')->insert([
                        'enrollment_id' => $newEnrID,
                        'pmt_id' => $new_pmt_id,

                    ]);

                }

                $keeps[] = $new_enroll;

            }

            $success ++;
        }

        return DV::depends($success,['action'=>$keeps,'levels'=>$arr_level]);
    }

    function promotedStudentListPag($filter=[],$ss=null){
        $branch_id = $ss->branch_id;
        $search_value =isset($filter['search_value'])?$filter['search_value']:null;
        $current_page =isset($filter['current_page'])?$filter['current_page']:1;
        $per_page =isset($filter['per_page'])?$filter['per_page']:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;

        $str_search ="1=1";
        $str_moreWhere="1=1";
        if($search_value){
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search ="(s.code ='$search_value' OR s.name LIKE '%$search_value%')";
        }

        $selectCols = 'e.status_id,e.session_id,e.campus_id,c.`name` AS campus,e.level_id,l.`name` as level,s.sex,s.name,s.name_kh,s.code,s.id,s.date_of_birth as dob';
        $query = DB::table('students as s')
                ->join('enrollments as e','e.student_id','=','s.id')
                ->join('program_levels as l','l.id','=','e.level_id')
                ->join('campuses as c','c.id','=','e.campus_id')
                ->where('e.is_new_promote',1)
                ->whereRaw($str_moreWhere)->whereRaw($str_search)
                ->selectRaw($selectCols)
                ->orderBy('s.id','desc');
        $count_query = clone $query;
        $count = $count_query->count('s.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach($rows as $row) {
            $status = 'pending';
            if($row->status_id == 1){
                $status = "pending";
            }else if($row->status_id == 2){
                $status = 'verified';
            }else{
                $status = 'paid';
            }
            $row->session = GeneralSettings::getSession($row->session_id)->name;
            //$row->campus_id = DB::table('campuses')->where('id',$row->campus_id)->first()->name;
            //$row->level = GeneralSettings::getLevel($row->level_id,$ss)->name;
            $row->status = $status;
            $row->age = getAge($row->dob);
            // $row->promote_info = self::promotedEnrollment($row->id,$ss);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);

    }

    static function promotedEnrollment($d=null,$ss=null){
        $id = isset($d->student_id) ? $d->student_id : $d;
        $row = DB::table('enrollments as e')->where('e.student_id',$id)->selectRaw('e.status_id,e.level_id,e.session_id,e.campus_id')->where('e.is_new_promote',1)->first();
        if($row){
            $status = 'pending';
            if($row->status_id == 1){
                $status = "pending";
            }else if($row->status_id == 2){
                $status = 'verified';
            }else{
                $status = 'paid';
            }
            $row->session = GeneralSettings::getSession($row->session_id);
            $row->campus_id = DB::table('campuses')->where('id',$row->campus_id)->first()->name;
            $row->level = GeneralSettings::getLevel($row->level_id,$ss)->name;
            $row->status = $status;
        }

        return $row;
    }

    function getFormOptions($d=null,$ss=null){
        $ss = $ss?$ss:$this->ss;
        $id = isset($d->prev_term_id)?$d->prev_term_id:$d->term_id;
        $row = Term::optionsTerm($d,$ss);
        return $row;
    }

    function verifyPromotedStudent($id=null,$ss=null){

    }

}
