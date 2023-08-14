<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;
class Activity //extends Model
{
    // use HasFactory;
    protected $id=null,$ss=null;
    function __construct($id=null,$ss=null){
        $this->id = $id;
        $this->ss = $ss;
    }

    function createRequest($arr,$ss){
        $ss = $ss?$ss:$this->ss;
        $v_rule = [
            'request_type_id' => '1|number|exists=request_types.id',
            'student_id' => '1|number|exists=students.id',
            'remarks' => '1|string|1,200',
            'from_level_id' => '0|number|exists=program_levels.id',
            'to_level_id' => '0|number|exists=program_levels.id',
            'from_session_id' => '0|number|exists=program_levels.id',
            'to_session_id' => '0|number|exists=program_levels.id',
            'from_campus_id' => '0|number|exists=program_levels.id',
            'to_campus_id' => '0|number|exists=program_levels.id',
        ];
        $res = validateObject($arr,$v_rule,1,[],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $req_type_id = $inputs['request_type_id'];
        $to_level_id = $inputs['to_level_id'];
        $to_session_id = $inputs['to_session_id'];
        $to_campus_id = $inputs['to_campus_id'];
        $inputs['status_id'] = 1; // create request Status ID = 1;
        $remarks = $inputs['remarks'];
        unset($inputs['level_id']);
        unset($inputs['request_type_id']);
        $studentInfo = $this->getStudentInfo($inputs['student_id'],$ss);
        $from_id = null;
        $to_id = null;
        $request_name = DB::table('request_types')->where('id',$req_type_id)->take(1)->value('name');
        if($req_type_id == 1){ //* request level
            $req_exists = DB::table('requests')->where('request_type_id',$req_type_id)->where('student_id',$inputs['student_id'])->where('term_id',$studentInfo->term_id)->where('is_approve',0)->exists();
            if($req_exists){
                    $cross_values +=1;
            }
            $from_id = $inputs['from_level_id'];
            $to_id = $to_level_id;
        }
        else if($req_type_id == 2){    //* request campus
            $req_exists = DB::table('requests')->where('request_type_id',$req_type_id)->where('student_id',$inputs['student_id'])->where('term_id',$studentInfo->term_id)->where('is_approve',0)->exists();
            if($req_exists){
                $cross_values +=1;
            }
            $from_id = $inputs['from_campus_id'];
            $to_id = $to_campus_id;
        }
        else if($req_type_id == 3){     //* request session
            $req_exists = DB::table('requests')->where('request_type_id',$req_type_id)->where('student_id',$inputs['student_id'])->where('term_id',$studentInfo->term_id)->where('is_approve',0)->exists();
            if($req_exists){
                $cross_values +=1;
            }
            $from_id = $inputs['from_session_id'];
            $to_id = $to_session_id;
        }
        // else if($req_type_id == 4){
        //     $from_id = $studentInfo->level_id;
        //     $to_id = $to_level_id;
        //     // return;
        // }

        $req_arr = [
            'request_type_id' => $req_type_id,
            'student_id' => $inputs['student_id'],
            'term_id' => $studentInfo->term_id,
        ];
        $reqNewID = saveData($ss,'requests',[],$req_arr,[],1);
        if($reqNewID){
            $level_arr = [
                'from_id' => $from_id,
                'to_id' => $to_id,
                'remarks'=>$remarks,
                'request_id' => $reqNewID,
                'request_name' => $request_name
            ];
            saveData($ss,'request_change',[],$level_arr,[],1);
        }
        return DV::depends($reqNewID,['action' => 'Request Created']);
    }

    function requestChange($arr,$ss=null){
        $ss = $ss?$ss:$this->ss;
        // $level = new ProgramLevel();
        $request_info = null;
        if(!isset($arr['request_info'])) return DV::error('Request info is required');
        $request_info = $arr['request_info'];
        $success = 0;
        $cross_values = 0;
        foreach($request_info as $info){
             $v_rule = [
                'request_type_id' => '1|number|exists=request_types.id',
                'student_id' => '1|number|exists=students.id',
                'remarks' => '1|string|1,200',
                'from_level_id' => '0|number|exists=program_levels.id',
                'to_level_id' => '0|number|exists=program_levels.id',
                'from_session_id' => '0|number|exists=program_levels.id',
                'to_session_id' => '0|number|exists=program_levels.id',
                'from_campus_id' => '0|number|exists=program_levels.id',
                'to_campus_id' => '0|number|exists=program_levels.id',,
            ];
            $res = validateObject($info,$v_rule,1,[],$ss->lang,0,null);
            if($res->error) return DV::error($res->error);
            $inputs = $res->values;
            $req_type_id = $inputs['request_type_id'];
            $to_level_id = $inputs['to_level_id'];
            $to_session_id = $inputs['to_session_id'];
            $to_campus_id = $inputs['to_campus_id'];
            $remarks = $inputs['remarks'];
            unset($inputs['level_id']);
            unset($inputs['request_type_id']);
            $studentInfo = $this->getStudentInfo($inputs['student_id'],$ss);
            $from_id = null;
            $to_id = null;
            $request_name = DB::table('request_types')->where('id',$req_type_id)->take(1)->value('name');

            if($req_type_id == 1){ //* request level
               $req_exists = DB::table('requests')->where('request_type_id',$req_type_id)->where('student_id',$inputs['student_id'])->where('term_id',$studentInfo->term_id)->where('is_approve',0)->exists();
               if($req_exists){
                $cross_values +=1;
                    continue;
               }
               $from_id = $inputs['from_level_id'];
                $to_id = $to_level_id;
            }
            else if($req_type_id == 2){    //* request campus
                $req_exists = DB::table('requests')->where('request_type_id',$req_type_id)->where('student_id',$inputs['student_id'])->where('term_id',$studentInfo->term_id)->where('is_approve',0)->exists();
                if($req_exists){
                    $cross_values +=1;
                    continue;
                }
                $from_id = $inputs['from_campus_id'];
                $to_id = $to_campus_id;
            }
            else if($req_type_id == 3){     //* request session
                $req_exists = DB::table('requests')->where('request_type_id',$req_type_id)->where('student_id',$inputs['student_id'])->where('term_id',$studentInfo->term_id)->where('is_approve',0)->exists();
                if($req_exists){
                    $cross_values +=1;
                    continue;
                }
                $from_id = $inputs['from_session_id'];
                $to_id = $to_session_id;
            }
            else if($req_type_id == 4){
                $from_id = $studentInfo->level_id;
                $to_id = $to_level_id;
                // return;
            }

            $req_arr = [
                'request_type_id' => $req_type_id,
                'student_id' => $inputs['student_id'],
                'term_id' => $studentInfo->term_id,
            ];
            $reqNewID = saveData($ss,'requests',[],$req_arr,[],1);
            if($reqNewID){
                $level_arr = [
                    'from_id' => $from_id,
                    'to_id' => $to_id,
                    'remarks'=>$remarks,
                    'request_id' => $reqNewID,
                    'request_name' => $request_name
                ];
                saveData($ss,'request_change',[],$level_arr,[],1);
            }
            $success ++;
        }
        return DV::depends($success,['action'=>'Request sent success ('.$success.') with ('.$cross_values.') failed','message' => "Request send wait author to approve"],"Missing All ($cross_values) ");
    }

    function requestDiscount($arr,$ss){
        $ss = $ss?$ss:$this->ss;
        $discount_info = null;
        if(!isset($arr['discount_info'])) return DV::error('Array Activity info missing');
        $discount_info = $arr['discount_info'];
        $success = 0;
        $cross_values = 0;
        foreach($discount_info as $info){
            $v_rule = [
                'discount_type_id' => '1|number|exists=discount_types.id',
                'student_id' => '1|number|exists=students.id',
                'remarks' => '1|string|1,250',
                'amount' => '1|number',
                'type' => '1|string|choice|amount,percentage',
            ];

            $res = validateObject($info,$v_rule,1,[],$ss->lang,0,null);
            if($res->error) return DV::error($res->error);
            $inputs = $res->values;
            $req_exists = DB::table('discount_request')->where('discount_type_id',$inputs['discount_type_id'])->where('student_id',$inputs['student_id'])->where('is_approve',0)->exists();
            if($req_exists){
                $cross_values ++;
                continue;
            }
            $success ++;
            $newID = saveData($ss,'discount_request',['id'=>null],$inputs,[],1);
        }
        return DV::depends($success,['action'=>'Request sent success ('.$success.') with ('.$cross_values.') failed','message' => "Request send wait author to approve"],"Missing All ($cross_values) ");
    }

    function activityListPaginateList($filter=[],$ss){
        $campus = new Campus();
        $level = new ProgramLevel();
        $ss = $ss?$ss:$this->ss;
        $branch_id = $ss->branch_id;
        $search_value =isset($filter['search_value'])?$filter['search_value']:null;
        $current_page =isset($filter['current_page'])?$filter['current_page']:1;
        $per_page =isset($filter['per_page'])?$filter['per_page']:10;
        if(!is_numeric($current_page)) $current_page=1;
        $is_approve = isset($filter['is_approve'])?$filter['is_approve']:0;
        $skip_rows = ($current_page -1) * $per_page;

        $str_search ="1=1";
        $str_moreWhere="1=1";
        if($search_value){
            $skip_rows =0;
            $search_value = escape_like_str($search_value);
            $str_search ="(s.name LIKE '%$search_value%' OR s.code = '$search_value')";
        }
        $selectCols = 'e.campus_id,s.id,s.file_name,s.name as student_name,s.code as student_code,s.name_kh,s.sex,s.date_of_birth,e.start_date as admission_date,e.session_id,e.level_id';
        $query = DB::table('students as s')
                ->join('enrollments as e','e.student_id','=','s.id')
                ->join('requests as r','r.student_id','=','s.id')
                ->selectRaw($selectCols)
                ->where('s.branch_id',$branch_id)
                ->whereRaw($str_moreWhere)->whereRaw($str_search);
        $count_query = clone $query;
        $count = $count_query->count('s.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach($rows as $row) {
            $row->level = $level->details($row->level_id,$ss)->name;
            $row->session = $this->getSession($row->session_id)->name;
            $row->image_url = PublicStorage::getUrl($branch_id,'students','image').$row->file_name;
            $row->school = $campus->details($row->campus_id,$ss)->name;
            $row->family_id = 'TEST10023';
            unset($row->file_name);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function approveGeneralListPaginateList($filter=[],$ss=null){
        $campus = new Campus();
        $ss = $ss?$ss:$this->ss;
        $branch_id = $ss->branch_id;
        $search_value =isset($filter['search_value'])?$filter['search_value']:null;
        $current_page =isset($filter['current_page'])?$filter['current_page']:1;
        $per_page =isset($filter['per_page'])?$filter['per_page']:10;
        if(!is_numeric($current_page)) $current_page=1;
        $is_approve = isset($filter['is_approve'])?$filter['is_approve']:0;
        $skip_rows = ($current_page -1) * $per_page;

        $str_search ="1=1";
        $str_moreWhere="1=1";
        if($search_value){
            $skip_rows =0;
            $search_value = escape_like_str($search_value);
            // $str_search ="(i.code = '$search_value' OR i.name LIKE '%$search_value%' OR g.name LIKE '%$search_value%')";
            $str_search ="(s.name LIKE '%$search_value%' OR s.code = '%$search_value%')";
        }
        $selectCols = 'e.campus_id,s.id as student_id,r.is_approve,r.id as request_id,s.file_name,s.name as student_name,s.code as student_code,s.name_kh,s.sex,s.date_of_birth,e.start_date as admission_date,e.session_id';
        $query = DB::table('requests as r')
                ->join('students as s','s.id','=','r.student_id')
                ->join('enrollments as e','e.student_id','=','s.id')
                ->selectRaw($selectCols)
                ->where('r.branch_id',$branch_id)
                ->whereRaw($str_moreWhere)->whereRaw($str_search);
                $query->where('r.is_approve',$is_approve);
        $count_query = clone $query;
        $count = $count_query->count('r.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach($rows as $row) {
            $row->image_url = PublicStorage::getUrl($branch_id,'students','image').$row->file_name;
            $row->request_change = $this->getRequestChanges($row->request_id,$ss);
            $row->status = $is_approve == 0? 'pending' : 'approved';
            $row->school = $campus->details($row->campus_id,$ss)->name;
            unset($row->file_name);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getRequestChanges($id,$ss){
        $level = new ProgramLevel();
        $row = DB::table('request_change as rg')->where('rg.request_id',$id)
                ->join('requests as r','r.id','=','rg.request_id')
                ->selectRaw('rg.request_name,rg.remarks,rg.from_id,rg.to_id,r.request_type_id')->first();
        switch($row->request_type_id){
            case 1:
                $row->from_level = $level->details($row->from_id,$ss)->name;
                $row->to_level = $level->details($row->to_id,$ss)->name;
                break;
            case 2:
                $row->from_campus = $this->getCampus($row->from_id)->name;
                $row->to_campus = $this->getCampus($row->to_id)->name;
                break;
            case 3:
                $row->from_session = $this->getSession($row->from_id)->name;
                $row->to_session = $this->getSession($row->to_id)->name;
                break;
            case 4:
                // $row->from_campus = $level->details($row->from_id,$ss)->name;
                // $row->to_campus = $level->details($row->to_id,$ss)->name;
                break;
        }
        return $row;
    }

    function getStudentInfo($id,$ss){
        return DB::table('students as s')->where('s.branch_id',$ss->branch_id)
            ->where('s.id',$id)
            ->join('enrollments as e','e.student_id','=','s.id')
            ->selectRaw('s.name,s.id,e.level_id,e.term_id,e.session_id,e.campus_id')
            ->first();
    }

    function getSession($id){
        $row = DB::table('sessions')->where('id',$id)->selectRaw('id as session_id,name as session,name,id')->first();
        if(!$row) return $row = null;
        return $row;
    }

    function getCampus($id){
        $row = DB::table('campuses')->where('id',$id)->selectRaw('id as campus_id,name as campus,name,id')->first();
        if(!$row) return $row = null;
        return $row;
    }

    function requestDiscountCount($ss=null){
        $row = DB::table('discount_request')->where('branch_id',$ss->branch_id)->where('is_approve',1)->count('is_approve');
        if(!$row) return (object)['count' => 0];
        return (object)['count' => $row];

    }

    function approveRequestChange($arr=[],$ss){
        $approve_info = null;
        if(!isset($arr['approve_info'])) return DV::error('Approve is required');
        $approve_info = $arr['approve_info'];
        $success = 0;
        $cross_values = 0;
        foreach($approve_info as $info){
            $v_rule = [
                'request_type_id' => '1|number|exists=request_types.id',
                'student_id' => '1|number|exists=enrollments.student_id',
                '' => '',
            ];
            $res = validateObject($info, $v_rule,1,[],$ss->lang,0,null);
            if($res->error) return DV::error($res->error);
            $inputs = $res->values;
            $req_type_id = $inputs['request_type_id'];
            $studentInfo = $this->getStudentInfo($inputs['student_id'],$ss);
            if($req_type_id == 1){ //* request level
                // $monthly_fee_info = PriceList::
                return $studentInfo;
            }
            // else if($req_type_id == 2){    //* request campus
            //     $req_exists = DB::table('requests')->where('request_type_id',$req_type_id)->where('student_id',$inputs['student_id'])->where('term_id',$studentInfo->term_id)->where('is_approve',0)->exists();
            //     if($req_exists){
            //         $cross_values +=1;
            //         continue;
            //     }
            //     $from_id = $studentInfo->campus_id;
            //     $to_id = $to_campus_id;
            // }
            // else if($req_type_id == 3){     //* request session

            //     $req_exists = DB::table('requests')->where('request_type_id',$req_type_id)->where('student_id',$inputs['student_id'])->where('term_id',$studentInfo->term_id)->where('is_approve',0)->exists();
            //     if($req_exists){
            //         $cross_values +=1;
            //         continue;
            //     }
            //     $from_id = $studentInfo->session_id;
            //     $to_id = $to_session_id;
            // }
            // else if($req_type_id == 4){
            //     $from_id = $studentInfo->level_id;
            //     $to_id = $to_level_id;
            //     // return;
            // }
        }

        return DV::depends($success,['action'=>'Request sent success ('.$success.') with ('.$cross_values.') failed','message' => "Request send wait author to approve"],"Missing All ($cross_values) ");
    }


}
