<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
class AcademicYear //extends Model
{
    static function validateAcademicYear($id=null,$academic_year,$start_date,$end_date){
        if(!$academic_year) return 'There is no academic year provided';
        $sts = explode('-',$academic_year);
        if(!isset($sts[1]) || intVal($sts[1]) === false || intVal($sts[1]) <=0) return 'It looks like the ending year is not correct';
        if(!(intVal($sts[0]) > 0)) return 'The starting year is not correct';
        if ($sts[0] >= $sts[1]) return 'The ending year should be greater than start year';
        $start_y = date('Y',strtotime($start_date));
        if ($start_y  <intval($sts[0]) || $start_y > intval($sts[1])) return 'Start date does not seem to be correct. Check if the year is correct!';
        $end_y = date('Y',strtotime($end_date));
        if($end_y < $sts[0] || $end_y >$sts[1]) return 'End date does not seem to be correct. Make ure the year is within a correct range';
        //$str_id= '1=1';
        //if($id > 0) $str_id ='id <> '.$id;
        //$row = DB::table('academic_years as y')->whereRaw('YEAR(end_date) >'.$sts[0])->whereRaw($str_id)->selectRaw('academic_year')->take(1)->get()->first();
        //if($row) return 'The ending year should not overlap the previous academic year\'s ending date';
        return null;
    }
   
    static function save($arr=[],$ss){
        $v_rule = [
            'id'=>'0|number|identity=1',
            'academic_year' => '1|string|1-150',
            'start_date' => '0|string',
            'end_date' => '0|string',
        ];
        $branch_id = $ss->branch_id;
        $unique =[$branch_id.'|academic_years|academic_year|id=id|text=Academic year already exists'];
        $res = validateObject($arr,$v_rule,0,['academic_year'=>['-']],$ss->lang,0,$unique);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $id = $res->id;
        
        $action ='Created';
        if($id>0) $action ='Updated';  
        $start_date = convertDate($inputs['start_date']);
        $end_date = convertDate($inputs['end_date']);
        $inputs['start_date'] = $start_date;
        $inputs['end_date'] =$end_date;
        if ($end_date <= $start_date) return Dv::error('The start date must be earlier than the end date');
        $err = self::validateAcademicYear($id,$inputs['academic_year'],$start_date,$end_date);
        if($err) return DV::error($err);

        $id = saveData($ss,'academic_years',['id' =>$id],$inputs,[],1,true);
        return DV::depends($id,['action' => $action,'id'=>$id,'academic_years' => self::list($ss)]);
    }

    static function getValue($id){
        return DB::table('academic_years as y')->where('id',$id)->take(1)->value('academic_year');
    }

    static function list($ss){
        $branch_id = $ss->branch_id;
        $rows = DB::table('academic_years')->selectRaw('id,academic_year,create_user,start_date,end_date,formatDate(created_at) as date')->where('branch_id',$branch_id)->get();
        return $rows;
    }

    static function details($academic_year,$ss){
        $branch_id = $ss->branch_id;
        $row = DB::table('academic_years')->selectRaw('id,academic_year,start_date,end_date')->where('academic_year',$academic_year)->where('branch_id',$branch_id)->first();
        return $row;
    }

    static function delete($id,$ss){
        $branch_id = $ss->branch_id;
        $x = DB::table('academic_years')->where('id',$id)->where('branch_id',$branch_id)->delete();
        return DV::depends($x,['action' => 'Deleted','academic_years' => self::list($ss)],'Failed to delete academic year');
    }

    /**
     * getFormOptions(). We use Academic_year as primary key, NOT using id
    */
    static function form_options($id=null,$ss){
       $ac_year =null;
       if($id) $ac_year = DB::table('academic_years as y')->where('id',$id)->selectRaw('y.id,y.academic_year,formatDate(start_date) as start_date,formatDate(end_date) as end_date,formatTime(created_at) as created_at,create_user')->get()->first(); 
       return (object)[
         'academicYearInfo'=>$ac_year
       ];
    }
}
