<?php

namespace App\Models;
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\GeneralSettings;
use App\Security\Sanitizer;
class StudentGroup //extends Model
{
    protected $id = null, $userInfo = null;
    function __construct($id=null,$userInfo=null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    // use HasFactory;
    function save($arr=[],$id=null,$ss){
        $v_rule = [
            'descriptive_name' => '0|string|0-100',
            'term_id' => '1|number|exists=terms.id',
            'campus_shortcut'=>'1|string|1-15|text=Campus shortcut is not correct',
            'level_id' => '1|number|exists=program_levels.id',
            'session_shortcut' => '1|string|1-15',
            'checkin_time'=>'1|string|0-100',
            'checkout_time' => '1|string|0-100',
            'remarks' => '0|string|0-250',

        ];

        $res = validateObject($arr,$v_rule,0,[],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $campus_id = self::getCampusId($inputs['campus_shortcut']);
        $session_id = self::getSessionId($inputs['session_shortcut']);
        $inputs['campus_id'] = $campus_id;
        $inputs['session_id'] = $session_id;
        if(!$campus_id) return DV::error('Campus shortcut is is not valid');
        if(!$session_id) return DV::error('Session shortcut is is not valid');

        $level_id = $inputs['level_id'];
        $level = self::getLevelShortcut($level_id);

        $created = false;
        if(!$id) $created = true;

        $g_name = $inputs['term_id'].'.'.$inputs['campus_shortcut'].'.'.$level.'.'.$inputs['session_shortcut'];
        $inputs['name'] =$g_name;
        $serial_number = null;

        unset($inputs['campus_shortcut']);
        unset($inputs['session_shortcut']);

        $newID = saveData($ss,'student_groups',['id' => $id],$inputs,[],1);
        if($newID && $created){
            $des_name = $inputs['descriptive_name'];
            $serial_number = self::setGroupNumber($newID,$campus_id,$level_id,$session_id,$g_name,$des_name);
            $g_name .='.'.$serial_number;
        }else
            $serial_number = DB::table('student_groups as g')->where('id',$newID)->take(1)->value('serial_number');
        $g_name .='.'.$serial_number;
        return DV::depends($newID,['group_name'=>$g_name,'groups']);
    }

    static function getLevelShortcut($level_id){
      $level_name =  DB::table('program_levels AS l')->where('l.id',$level_id)->take(1)->value('name');
      $level_name =$level_name?$level_name:'';
      $level_name = Sanitizer::sanitize($level_name);
      return str_replace(' ','',$level_name);

    }

    static function getCampusId($shortcut){
      return DB::table('campuses as c')->where('shortcut',$shortcut)->take(1)->value('id');
    }
    static function getSessionId($shortcut){
        return DB::table('sessions as ss')->where('shortcut',$shortcut)->take(1)->value('id');
    }

    static function setGroupNumber($group_id,$campus_id,$level_id,$session_id,$group_name,$des_name=null){
      $last_id= DB::table('group_number_control AS c')->where('campus_id',$campus_id)->where('level_id',$level_id)->where('session_id',$session_id)->take(1)->value('last_id');
      $last_id =$last_id>=0?$last_id:0;
      $last_id++;
      if(!$des_name) $des_name = $group_name.'.'.$last_id;
      DB::table('student_groups')->where('id',$group_id)->update([
        'serial_number'=>$last_id,
        'descriptive_name'=>$des_name
      ]);
      return $last_id;
    }

    static function list($arr, $ss){
        $branch_id = $ss->branch_id;
        $d = (object)$arr;
        $term_id = isset($d->term_id)?$d->term_id:0;
        $campus_id = isset($d->campus_id)?$d->campus_id:0;
        //$search_value = isset($d->search_value)?$d->search_value:null;
        $program_id = isset($d->program_id)?$d->program_id:null;
        $level_id = isset($d->level_id)?$d->level_id:null;
        $session_id = isset($d->session_id)?$d->session_id:null;


        $str_wheres ='g.branch_id = '.$branch_id.' AND g.term_id ='.$term_id;
        if($level_id >0)
          $str_wheres .=' AND g.level_id ='.$level_id;
        else if ($program_id > 0){
            $str_wheres .=' AND g.program_id ='.$program_id;
        }
        if($session_id > 0) $str_wheres  .= ' AND g.session_id ='.$session_id;
        if($campus_id > 0) $str_wheres .= ' AND g.campus_id ='.$campus_id;

       return DB::table('student_groups AS g')
                ->join('campuses AS c','c.id','=','g.campus_id')
                ->join('sessions as s','g.session_id' ,'=' ,'s.id')
                ->join('program_levels as pl','pl.id','=','g.level_id')
                ->selectRaw('g.id,g.term_id,CONCAT(g.name,\'.\',g.serial_number) AS `name`,g.level_id,pl.name AS level_name,g.session_id,s.name AS session_name,s.shortcut AS session_shortcut,g.remarks')
                ->whereRaw($str_wheres)->orderBy('g.id','DESC')->get();
    }

    static function list_paginate($arr, $ss){
        $branch_id = $ss->branch_id;
        $d = (object)$arr;
        $term_id = isset($d->term_id)?$d->term_id:0;
        $campus_id = isset($d->campus_id)?$d->campus_id:null;

        $current_page =isset($arr['current_page'])?$arr['current_page']:1;
        $per_page =isset($arr['per_page'])?$arr['per_page']:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;

        //$search_value = isset($d->search_value)?$d->search_value:null;
        $program_id = isset($d->program_id)?$d->program_id:null;
        $level_id = isset($d->level_id)?$d->level_id:null;
        $session_id = isset($d->session_id)?$d->session_id:null;

        $str_wheres ='g.branch_id = '.$branch_id.' AND g.term_id ='.$term_id;
        if($level_id >0)
          $str_wheres .=' AND g.level_id ='.$level_id;
        else if ($program_id > 0){
            $str_wheres .=' AND g.program_id ='.$program_id;
        }
        if($session_id > 0) $str_wheres  .= ' AND g.session_id ='.$session_id;
        if($campus_id > 0) $str_wheres .= ' AND g.campus_id ='.$campus_id;
        $query = DB::table('student_groups AS g')
                ->join('sessions as s','g.session_id' ,'=' ,'s.id')
                ->join('program_levels as pl','pl.id','=','g.level_id')
                ->join('programs as p','p.id','=','pl.program_id')
                ->selectRaw('g.id,g.term_id,CONCAT(g.name,\'.\',g.serial_number) AS `name`,g.descriptive_name,p.name as program_name, g.level_id,pl.name AS level_name,g.session_id,s.name AS session_name,s.shortcut AS session_shortcut,g.remarks')
                ->whereRaw($str_wheres)->orderBy('g.id','DESC');

            $count_query = clone $query;
            $count = $count_query->count('g.id');
            $rows = $query->skip($skip_rows)->take($per_page)->get();
            foreach($rows as $row){
              $row->student_count = DB::table('group_members AS gm')->where('group_id',$row->id)->count('id');
            }
            return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    static function details($id,$ss){
       $branch_id = $ss->branch_id;
       return DB::table('student_groups as g')
                ->selectRaw('g.id,CONCAT(g.name,\'.\',g.serial_number) AS `name`,g.descriptive_name,g.remarks,g.campus_id,g.level_id,g.session_id,g.serial_number')
                ->where('g.id',$id)
                ->where('g.branch_id',$branch_id)->first();
    }

    function delete($id=null,$ss=null){
        $branch_id = $ss->branch_id;
        $id =$id?$id:$this->id;
        DB::table('group_members')->where('group_id',$id)->delete();
        $x = DB::table('student_groups')->where('id',$id)->delete();
        return DV::depends($x,['student_groups' => self::list([],$ss)]);
    }

    static function getFormOptions($id,$ss){
       return (object)[
         'campuses'=>GeneralSettings::options_campus($ss),
         'terms'=>GeneralSettings::options_term(null,$ss),
         'academic_years'=>GeneralSettings::options_academic_year($ss),
         'programs'=>GeneralSettings::options_program($ss),
         'sessions'=>GeneralSettings::options_session($ss),
         'student_group'=>self::details($id,$ss)
       ];
    }


    static function setUniqueGroupNumber($len=null,$level_id,$session_id,$ss){
        if (!$len) $len = 5;
        $level = GeneralSettings::getLevel($level_id,$ss);
        $level_name = strtoupper(substr($level->name,0,2));
        $session = GeneralSettings::getSession($session_id);
        $session = $session->name;
        $string = $session;
        $letters = implode(" ", array_map(function ($word) {
            return strtoupper($word[0]);
        }, explode(" ", $string)));
        $session_prefix = str_replace(" ", "", $letters);
        $group_name = $level_name.'.'.$session_prefix;
        return $group_name;
    }


    function assignStudentToGroup($arr,$ss){
        $v_rule = [
            'student_id' => '1|number|exists=students.id',
            'group_id' => '1|number|exists=student_groups.id',
        ];
        $res = validateObject($arr,$v_rule,0,[],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;

        $newID = saveData($ss,'group_members',['id' => null],$inputs,[],1);
        return DV::depends($newID,['action'=> 'Assigned']);
    }

    static function groupMemberList($ss){
        $branch_id = $ss->branch_id;
        $rows = DB::table('group_members as gm')->join('students as s','s.id','=','gm.student_id')->where('branch_id',$branch_id);
        return $rows;
    }
}
