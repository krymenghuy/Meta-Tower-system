<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
use App\Models\GeneralSettings;
class Term //extends Model
{
    protected $id=null,$user_info=null;
    function __construct($id=null,$user_info=null){
        $this->id = $id;
        $this->user_info = $user_info;
    }
    static function getAcademicYear($ac_year_id){
      return DB::table('academic_years as y')->where('id',$ac_year_id)->take(1)->value('academic_year');
    }

    function save($arr,$id=null,$ss=null){
        $ss = $ss?$ss:$this->user_info;
        $id = $id?$id:$this->id;

        $action='Created';
        if($id) $action='Updated';
        $v_rule = [
            'period_type' => '0|choice|Term,Semester', /** Term|Semester*/
            'name' => '1|string|1-150',
            'start_date' => '1|date',
            'end_date' => '1|date',
            'ac_year_id' => '1|number|exists=academic_years.id|text=The provided academic year does not exist yet',
            'prev_term_id'=>'0|number'
        ];

        $res = validateObject($arr,$v_rule,false,[],$ss->lang,[],null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $ac_year_id = $inputs['ac_year_id'];
        $inputs['academic_year'] = self::getAcademicYear($ac_year_id);
        $end_date = convertDate($inputs['end_date']);
        $start_date = convertDate($inputs['start_date']);
        $prev_term_id = $inputs['prev_term_id'];
        if($prev_term_id>0){
           $prev_term = DB::table('terms as t')->where('id',$prev_term_id)->selectRaw('t.id,t.name,start_date,end_date')->take(1)->get()->first();
           if(!$prev_term) return DV::error('Previous term is not valid');
           if (convertDate($prev_term->end_date) >$start_date) return DV::error('Previous term\'s ending date must be earlier than the starting date of this term');
        }
        if ($start_date >= $end_date) return DV::error('Start date must be ealier than end date');
        $newId = saveData($ss,'terms',['id'=>$id],$inputs,[],1,false);
        return DV::depends($newId,['action'=>$action,'terms'=>self::list(null,$ss)]);
    }

    function list($arr=[],$ss=null){
        $ss = $ss?$ss:$this->user_info;
        $branch_id = $ss->branch_id;
        $d = (object)$arr;
        $academic_year = isset($d->academic_year)?$d->academic_year:null;
        $str_acad_year='1=1';
        if ($academic_year>0){
            $str_acad_year = 't.academic_year =\''.$academic_year.'\'';
        }
        $prev_term =  ',CASE t.prev_term_id > 0 WHEN 1 THEN (SELECT `name` FROM terms WHERE id = t.id LIMIT 1) ELSE \'NA\' END AS prev_term_name';
        $selectCols = 't.id,name,period_type,formatDate(t.start_date) AS start_date,formatDate(t.end_date) AS end_date,semester_number,ac_year_id,academic_year,formatTime(t.created_at) AS created_at,t.create_user'.$prev_term;
        return DB::table('terms AS t')->selectRaw($selectCols)->where('t.branch_id',$branch_id)->whereRaw($str_acad_year)->orderByRaw('t.start_date DESC')->get();
    }

    function details($id=null,$ss=null){
        $ss = $ss?$ss:$this->user_info;
        $id = $id?$id:$this->id;
        $branch_id = $ss->branch_id;
        $selectRow = "id,name,ac_year_id,period_type,semester_number,formatDate(start_date) AS start_date,formatDate(end_date) AS end_date,academic_year,formatTime(created_at) AS created_at,create_user,prev_term_id,(Select `name` FROM terms WHERE id = prev_term_id LIMIT 1) AS prev_term_name";
        return DB::table('terms')->selectRaw($selectRow)
                ->where('branch_id',$branch_id)
                ->where('id',$id)->get()->first();
    }

    function delete($id=null,$ss=null){
        $ss = $ss?$ss:$this->user_info;
        $id = $id?$id:$this->id;
        $branch_id = $ss->branch_id;

        $x = DB::table('terms')->where('id',$id)->where('branch_id',$branch_id)->delete();
        return DV::depends($x,['action'=>'Deleted','terms'=>self::list(null,$ss)],'Failed to delete term');
    }

    function getFormOptions($id=null,$ss=null){
        $ss = $ss?$ss:$this->user_info;
        $id = $id?$id:$this->id;
        $term =null;
        if($id>0) $term = self::details($id,$ss);
        return (object)[
          'term'=>$term,
          'terms'=>GeneralSettings::options_term(null,$ss),
          'academic_years'=>GeneralSettings::options_academic_year($ss)
        ];
    }

    static function optionsTerm($d=null,$ss=null){
        $program_id = isset($d->program_id)?$d->program_id:null;
        $term_id = isset($d->term_id)?$d->term_id:$d->prev_term_id;
        $levels = DB::table('program_levels')->where('program_id',$program_id)->selectRaw('id')->get();
        $count = 0;
        $count = DB::table('student_groups as sg')
                ->where('sg.term_id',$term_id)
                ->join('group_members as gm','gm.group_id','=','sg.id')
                ->count('gm.group_id');
        // if($program_id){
        //     foreach($levels as $level){
        //         $count = DB::table('student_groups as sg')
        //             ->where('sg.level_id',$level->id)
        //             ->join('group_members as gm','gm.group_id','=','sg.id')
        //             ->count('sg.level_id');
        //         $count ++;
        //     }
        // }

        $res = [
            // 'level' => $level,
            'count' => $count,
            'next_term' => self::getNextTerm($term_id)
        ];
        return $res;
    }

    static function getNextTerm($prev_term_id=null){
        return DB::table('terms')->where('prev_term_id',$prev_term_id)->selectRaw('id,name,period_type,start_date,end_date,academic_year')->first();
    }
}
