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
            'from_session_id' => '0|number|exists=sessions.id',
            'to_session_id' => '0|number|exists=sessions.id',
            'from_campus_id' => '0|number|exists=campuses.id',
            'to_campus_id' => '0|number|exists=campuses.id',
        ];
        $res = validateObject($arr,$v_rule,1,[],$ss->lang,0,null);
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
            $from_id = $inputs['from_level_id'];
            $to_id = $to_level_id;
        }
        else if($req_type_id == 2){    //* request campus
            $from_id = $inputs['from_campus_id'];
            $to_id = $to_campus_id;
        }
        else if($req_type_id == 3){     //* request session
            $from_id = $inputs['from_session_id'];
            $to_id = $to_session_id;
        }

        $req_arr = [
            'request_type_id' => $req_type_id,
            'student_id' => $inputs['student_id'],
            'term_id' => $studentInfo->term_id,
            'status_id' => 1 // create request Status ID = 1;
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

    function sendRequestChange($arr,$ss=null){
        $ss = $ss?$ss:$this->ss;
        // $level = new ProgramLevel();
        $request_info = null;
        if(!isset($arr['request_info'])) return DV::error('Request info is required');
        $request_info = $arr['request_info'];
        $success = 0;
        $unsuccess =0;
        foreach($request_info as $info){
             $v_rule = [
                'request_id'=>'1|number|exists=requests.id'
            ];
            $res = validateObject($info,$v_rule,1,[],$ss->lang,0,null);
            if($res->error) return DV::error($res->error);
            $inputs = $res->values;
            $inputs['status_id'] = 2; // * reuest sent; Status ID = 2;

            $id = $inputs['request_id'];
            unset($inputs['request_id']);
            $checkSent = DB::table('requests')->where('id',$id)->where('status_id',1)->exists();
            if(!$checkSent){
                $unsuccess += 1;
                continue;
            }
            // $request_name = DB::table('request_types')->where('id',$req_type_id)->take(1)->value('name');

            $reqNewID = saveData($ss,'requests',['id'=>$id],$inputs,[],1);
            $success ++;
        }
        return DV::depends($success,['action'=>'Request sent success('.$success.') and ('.$unsuccess.') failed','message' => "Request send wait author to approve"]);
    }


    function requestChangeListPaginateList($filter=[],$ss){
        $campus = new Campus();
        $level = new ProgramLevel();
        $ss = $ss?$ss:$this->ss;
        $branch_id = $ss->branch_id;
        $search_value =isset($filter['search_value'])?$filter['search_value']:null;
        $current_page =isset($filter['current_page'])?$filter['current_page']:1;
        $type = isset($filter['type_id'])?$filter['type_id']:null;
        $per_page =isset($filter['per_page'])?$filter['per_page']:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;

        $str_search ="1=1";
        $str_moreWhere="1=1";
        if($search_value){
            $skip_rows =0;
            $search_value = escape_like_str($search_value);
            $str_search ="(s.name LIKE '%$search_value%' OR s.code = '$search_value')";
        }
        $selectCols = 'r.id as request_id,e.campus_id,s.id,s.file_name,s.name as student_name,s.code as student_code,s.name_kh,s.sex,s.date_of_birth,e.start_date as admission_date,e.session_id,e.level_id';
        $query = DB::table('students as s')
                ->join('enrollments as e','e.student_id','=','s.id')
                ->join('requests as r','r.student_id','=','s.id')
                ->selectRaw($selectCols)
                ->where('s.branch_id',$branch_id)
                ->where('r.status_id',1)
                ->whereRaw($str_moreWhere)->whereRaw($str_search);
                if($type){
                    $query->where('r.request_type_id',$type);
                }
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

    function approvalActivityListPaginateList($filter=[],$ss=null){
        $campus = new Campus();
        $ss = $ss?$ss:$this->ss;
        $branch_id = $ss->branch_id;
        $type = isset($filter['type_id'])?$filter['type_id']:null;
        $search_value =isset($filter['search_value'])?$filter['search_value']:null;
        $current_page =isset($filter['current_page'])?$filter['current_page']:1;
        $per_page =isset($filter['per_page'])?$filter['per_page']:10;
        if(!is_numeric($current_page)) $current_page=1;
        $authorized = isset($filter['authorized'])?$filter['authorized']:2;
        $skip_rows = ($current_page -1) * $per_page;

        $str_search ="1=1";
        $str_moreWhere="1=1";
        if($search_value){
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search ="(s.name LIKE '%$search_value%' OR s.code = '$search_value')";
        }
        $selectCols = 'e.campus_id,s.id as student_id,r.id as request_id,s.file_name,s.name as student_name,s.code as student_code,s.name_kh,s.sex,s.date_of_birth,e.start_date as admission_date,e.session_id';
        $query = DB::table('requests as r')
                ->join('students as s','s.id','=','r.student_id')
                ->join('enrollments as e','e.student_id','=','s.id')
                ->selectRaw($selectCols)
                ->where('r.branch_id',$branch_id)
                ->whereRaw($str_moreWhere)->whereRaw($str_search);
                if($type){
                    $query->where('r.request_type_id',$type);
                }
                $query->where('r.authorized',$authorized);
        $count_query = clone $query;
        $count = $count_query->count('r.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach($rows as $row) {
            $row->image_url = PublicStorage::getUrl($branch_id,'students','image').$row->file_name;
            $row->request_change = $this->getRequestChanges($row->request_id,$ss);
            $row->status = $authorized == 0? 'pending' : 'approved';
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
        if(!isset($arr['approve_info'])) return DV::error('Approve info is required');
        $approve_info = $arr['approve_info'];
        $success = 0;
        $cross_values = 0;
        foreach($approve_info as $info){
            $v_rule = [
                'request_id' => '1|number|exists=requests.id',
                // 'request_type_id' => '1|number|exists=request_types.id',,
                'from_level_id' => '0|number|exists=program_levels.id',
                'to_level_id' => '0|number|exists=program_levels.id',
                'from_session_id' => '0|number|exists=sessions.id',
                'to_session_id' => '0|number|exists=sessions.id',
                'from_campus_id' => '0|number|exists=campuses.id',
                'to_campus_id' => '0|number|exists=campuses.id',
            ];
            $res = validateObject($info, $v_rule,1,[],$ss->lang,0,null);
            if($res->error) return DV::error($res->error);
            $inputs = $res->values;
            $req_type_id = DB::table('requests')->where('id',$inputs['request_id'])->take(1)->value('request_type_id');
            $from_level_id = isset($inputs['from_level_id'])?$inputs['from_level_id']:null;
            $to_level_id = isset($inputs['to_level_id'])?$inputs['to_level_id']:null;
            $from_session_id = isset($inputs['from_session_id'])?$inputs['from_session_id']:null;
            $to_session_id = isset($inputs['to_session_id'])?$inputs['to_session_id']:null;
            $from_campus_id = isset($inputs['from_campus_id'])?$inputs['from_campus_id']:null;
            $to_campus_id = isset($inputs['to_campus_id'])?$inputs['to_campus_id']:null;
            // $studentInfo = $this->getStudentInfo($inputs['student_id'],$ss);
            $remarks = isset($arr['remarks'])?$arr['remarks']:null;
            $from_id = null;
            $to_id = null;
            $id = $inputs['request_id'];
            if($req_type_id == 1){ //* request level
                $from_id = $from_level_id;
                $to_id = $to_level_id;
            }
            else if($req_type_id == 2){    //* request campus
                $from_id = $from_campus_id;
                $to_id = $to_campus_id;
            }
            else if($req_type_id == 3){     //* request session
                $from_id = $from_campus_id;
                $to_id = $to_session_id;
            }
            $approve_arr = [
                'request_type_id' => $req_type_id,
                'auth_uid' => $ss->id,
                'auth_user' => $ss->full_name,
                'authorized' => 1, //  approved
                'status_id' => 3 // approve request Status ID = 3 final processing;
            ];
            $approveRequestID =1;//saveData($ss,'requests',['id' => $id],$approve_arr,[],1);//DB::table('requests')->where('id',$id)->update($approve_arr);
            if($approveRequestID){
                $req_change_arr = [
                    'from_id' => $from_id,
                    'to_id' => $to_id,
                    'remarks'=>$remarks,
                    // 'request_id' => $reqNewID,
                    // 'request_name' => $request_name
                ];
                // DB::table('request_types')->where('request_id',$approveRequestID)->update($req_change_arr);
            }

            $success ++;

        }
        $test = PriceList::findPaidAmount(1,$ss);

        return DV::depends($success,['action'=>'Request sent success ('.$success.') with ('.$cross_values.') failed','message' => "Request send wait author to approve",'data'=>$test],"Missing All ($cross_values)");
    }



    function createRequestDiscount($arr,$ss){
        $ss = $ss?$ss:$this->id;
        $v_rule = [
            'discount_type_id' => '1|number|exists=discount_types.id',
            'student_id' => '1|number|exists=students.id',
            'amount' => '1|number|0,10',
            'type' => '1|string|choice|percentage,amount',
            'remarks' => '1|string|1,250',
        ];

        $res = validateObject($arr,$v_rule,1,[],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $dis_type_id = $inputs['discount_type_id'];
        $student_id = $inputs['student_id'];
        $remarks = $inputs['remarks'];
        unset($inputs['discount_type_id']);
        unset($inputs['student_id']);
        $dis_arr = [
            'discount_type_id' => $dis_type_id,
            'student_id' => $student_id,
            'remarks' => $remarks,
            'amount' => $inputs['amount'],
            'type' => $inputs['type'],
            'authorized' => 1,
            'status_id' => 1, // create request status id = 1;
        ];
        $newID = saveData($ss,'discount_request',['id' => null],$dis_arr,[],1);

        return DV::depends($newID,['action' => 'Request Created']);
    }

    function sendRequestDiscount($arr,$ss){
        $ss = $ss?$ss:$this->ss;
        // $level = new ProgramLevel();
        $request_info = null;
        if(!isset($arr['request_info'])) return DV::error('Request info is required');
        $request_info = $arr['request_info'];
        $success = 0;
        $unsuccess =0;
        foreach($request_info as $info){
            $v_rule = [
                'discount_request_id' => '1|number|exists=discount_types.id'
            ];
            $res = validateObject($info,$v_rule,1,[],$ss->lang,0,null);
            if($res->error) return DV::error($res->error);
            $inputs = $res->values;
            $inputs['status_id'] = 2; // * reuest sent; Status ID = 2;

            $id = $inputs['discount_type_id'];
            unset($inputs['discount_type_id']);
            $checkSent = DB::table('discount_request')->where('id',$id)->where('status_id',1)->exists();
            if(!$checkSent){
                $unsuccess += 1;
                continue;
            }
            // $request_name = DB::table('request_types')->where('id',$req_type_id)->take(1)->value('name');

            $reqNewID = saveData($ss,'discount_request',['id'=>$id],$inputs,[],1);
            $success ++;
        }
        return DV::depends($success,['action'=>'Request sent success('.$success.') and ('.$unsuccess.') failed','message' => "Request send wait author to approve"]);
    }

    function requestDiscountListPaginate($filter=[],$ss){
        $campus = new Campus();
        $ss = $ss?$ss:$this->ss;
        $branch_id = $ss->branch_id;
        $type = isset($filter['discount_type_id'])?$filter['discount_type_id']:null;
        $search_value =isset($filter['search_value'])?$filter['search_value']:null;
        $current_page =isset($filter['current_page'])?$filter['current_page']:1;
        $per_page =isset($filter['per_page'])?$filter['per_page']:10;
        if(!is_numeric($current_page)) $current_page=1;
        $authorized = isset($filter['authorized'])?$filter['authorized']:1;
        $skip_rows = ($current_page -1) * $per_page;

        $str_search ="1=1";
        $str_moreWhere="1=1";
        if($search_value){
            $skip_rows =0;
            $search_value = escape_like_str($search_value);
            // $str_search ="(i.code = '$search_value' OR i.name LIKE '%$search_value%' OR g.name LIKE '%$search_value%')";
            $str_search ="(s.name LIKE '%$search_value%' OR s.code = '%$search_value%')";
        }
        $selectCols = 'dr.amount,dt.name as discount_type';
        $query = DB::table('discount_request as dr')
                ->join('discount_types as dt','dt.id','=','dr.discount_type_id')
                ->join('students as s','s.id','=','dr.student_id')
                ->where('dr.branch_id',$branch_id)
                ->whereRaw($str_moreWhere)->whereRaw($str_search);
                if($type){
                    $query->where('r.request_type_id',$type);
                }
                $query->where('dr.authorized',$authorized);

        $count_query = clone $query;
        $count = $count_query->count('dr.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach($rows as $row) {
            $row->image_url = PublicStorage::getUrl($branch_id,'students','image').$row->file_name;
            // $row->request_change = $this->getRequestChanges($row->request_id,$ss);
            $row->status = $authorized < 2? 'pending' : 'approved';
            // $row->school = $campus->details($row->campus_id,$ss)->name;
            unset($row->file_name);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }
}
