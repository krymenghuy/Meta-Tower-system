<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;

class Term //extends Model
{
    protected $id=null,$user_info=null;
    function __construct($id=null,$user_info=null){
        $this->id = $id;
        $this->user_info = $user_info;
    }
    // use HasFactory;
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
            'academic_year' => '1|string|1-50',
            'prev_term_id'=>'0|number'
        ];

        $res = validateObject($arr,$v_rule,false,[],$ss->lang,[],null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $end_date = convertDate($inputs['end_date']); 
        $start_date = convertDate($inputs['start_date']);
        $prev_term_id = $inputs['prev_term_id'];
        if($prev_term_id>0){
           $prev_term = DB::table('terms as t')->where('id',$prev_term_id)->selectRaw('t.id,t.name,start_date,end_date')->take(1)->get()->first();
           if(!$prev_term) return DV::error('Previous term is not valid');
           if (convertDate($prev_term->end_date) >$start_date) return DV::error('Previous term\'s ending date must be earlier than the starting date of this term'); 
        }
        if ($start_date >= $end_date) return DV::error('Start date must be ealier than end date');

        convertDate($inputs['start_date']);
        convertDate($inputs['end_date']);

        $newID = saveData($ss,'terms',['id'=>$id],$inputs,[],1);
        return DV::depends($newID,['action'=>$action,'terms'=>self::list(null,$ss)]);
    }

    function list($arr=[],$ss=null){
        $ss = $ss?$ss:$this->user_info;
        $branch_id = $ss->branch_id;
        $d = (object)$arr;
        $academic_year = isset($d->academic_year)?$d->academic_year:null;
        $str_acad_year='1=1';
        if ($academic_year>0){
            $str_acad_year = 'academic_year =\''.$academic_year.'\'';
        }
        $selectCols = 'id,name,period_type,formatDate(start_date) AS start_date,formatDate(end_date) AS end_date,academic_year,formatTime(created_at) AS created_at,create_user';
        return DB::table('terms')->selectRaw($selectCols)->where('branch_id',$branch_id)->whereRaw($str_acad_year)->orderByRaw('start_date DESC')->get();
    }

    function details($id=null,$ss=null){
        $ss = $ss?$ss:$this->user_info;
        $id = $id?$id:$this->id;
        $branch_id = $ss->branch_id;
        $selectRow = "id,name,period_type,start_date,end_date,academic_year,created_at,create_user";
        return DB::table('terms')->selectRaw($selectRow)
                ->where('branch_id',$branch_id)
                ->where('id',$id)->get()->first();
    }

    function delete($id=null,$ss=null){
        $ss = $ss?$ss:$this->user_info;
        $id = $id?$id:$this->id;
        $branch_id = $ss->branch_id;

        $x = DB::table('terms')->where('id',$id)->where('branch_id',$branch_id)->delete();
        return DV::depends($x,['action'=>'Deleted','terms'=>self::list(null,$ss)]);
    }
}
