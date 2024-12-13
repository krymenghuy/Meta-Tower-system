<?php

namespace App\Models\Bhr;
use App\Models\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;



class Education //extends Model
{
    protected $id = null;
    protected $userInfo = null;

    function __construct($id = null, $userInfo = null){
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function save($arr ,$ss = null, $id = null){
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id' => '0|identity=1',
            'emp_id' => '1|number',
            'school_id' => '1|number',
            'edu_level_id' => '1|number',
            'period' => '0|string|0-150',
            'start_year' => '0|year',
            'finish_year' => '0|year',
            'major' => '0|string|0-150',
            'diploma' => '0|string|1-150'

        ];
        $edu_char = ['$','#','@','!','.','-','_','=','?'];
        // $checkUnque = ["$branch_id|emp_educations|emp_id|school_id|period|id=id|text=Employee Eduction is already Save "];


        $res = validateObject($arr,$v_rule,true,['period'=>$edu_char],$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        $id = $res->id;

        $inputs = $res->values;

        $id = saveData($ss,'emp_educations',['id'=>$id],$inputs,[],1);
        if($id > 0 ){
            return DV::depends(1,['emp_educations'=>$inputs,'id'=>$id]);

        }
        return DV::error('Error saving data');

    }
    function getListAll($arr,$ss){
        $branch_id = $ss->branch_id;
        $d = (object) $arr;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if(!is_numeric($current_page)){
            $current_page = 1;
        }
        $emp_id = $d->emp_id ?? null;
        $skip_rows = ($current_page -1) * $per_page;
        $query  = DB::table('emp_educations as e')
            ->join('employees as emp', 'emp.id', '=','e.emp_id')
            ->join('schools as s','s.id','=','e.school_id')
            ->join('edu_levels as l','l.id','=','e.edu_level_id')
            ->where('e.branch_id',$branch_id)
            ->where('e.emp_id',$emp_id)
            ->selectRaw('e.id,emp.id as emp_id,emp.name as emp_name,s.id as school_id,s.name as school,l.id as level_id,l.name as edu_level,e.period,e.start_year,e.finish_year,e.major,e.diploma')
            ->orderBy('e.id','DESC');
        $clone_query = clone $query;
        $count = $clone_query->count('e.id');

        $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);


    }


    function details($id,$ss=null){
        $branch_id = $ss->branch_id;
        $rows = DB::table('emp_educations as e')
        ->join('employees as emp','emp.id','=','e.emp_id')
        ->selectRaw('e.id,e.emp_id,emp.name as emp_name,e.school_id,e.period,e.edu_level_id,e.start_year,e.finish_year,e.major,e.diploma')
            ->where('e.branch_id',$branch_id)
            ->where('e.id',$id)
            ->take(1)->first();
        return $rows;


    }


    function formOptions($id,$ss){
        $educations = null;
        if($id) $educations = self::details($id,$ss);
        return (object) [
            'schools'=>DB::table('schools')->selectRaw('id,name')->get(),
            'edu_levels'=>DB::table('edu_levels')->selectRaw('id,name')->get(),
            'education'=>$educations,
        ];

    }

    function delete($id = null){
        
        $id = $id ?? $this->id;

        $delete = DB::table('emp_educations')->where('id',$id)->delete();
        return DV::depends($delete,['action'=>'deleted']);

    }






}
