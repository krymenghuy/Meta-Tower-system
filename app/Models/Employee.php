<?php

namespace App\Models;
//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use DB;
use App\Models\DV;
use App\Models\PublicStorage;

class Employee //extends Person
{
    protected $id = null;
    protected $userInfo =null;
    
    function __construct($id =null,$userInfo = null){
         $this->id = $id;
         $this->userInfo = $userInfo;
         //$person_id = self::personId($id);
         //parent::__construct($person_id,$userInfo);
    }
    
    function getId(){
        return $this->id;
    }
    function getUserInfo(){
        return $this->userInfo;
    }
    static function personId($id){
        $e = getDataRow('employees',['id'=>$id],'person_id');
        return $e?$e->person_id:null;
    }
     
    function getDetails($id = null,$ss=null){
        $ss = $ss?$ss:$this->getUserInfo();
        $id =$id?$id:$this->getId();
        $branch_id = $ss->branch_id;
        $cols ="e.id,e.code,CONCAT(p.last_name,' ',p.first_name) as name,p.first_name,p.last_name,p.nationality_id,p.sex,p.phone_number,p.email,p.address,DATE_FORMAT(p.date_of_birth,'%d %b %Y') AS date_of_birth, p.cp_name,p.cp_phone_number,e.employment_type,e.photo_file_type,e.photo_file_name,e.created_at,e.create_user";
        $rows = DB::table('persons as p')->join('employees as e','e.person_id','=','p.id')->where('e.id',$id)->where('e.branch_id',$branch_id)->selectRaw($cols)->take(1)->get();
        foreach($rows as $row){
            $url = PublicStorage::getUrl($branch_id,'person','image').$row->photo_file_name;
            $row->photo_url = $url;
            return $row;
        }
        return null;
    }

    function save($d=[],$ss=null){
        $ss = $ss?$ss:$this->getUserInfo();
        $branch_id = $ss->branch_id;
        $id = isset($d['id'])?$d['id']:null;
        $res = (new \App\Models\Person())->save($d,$ss);
        if($res->status ==='OK'){
            $inputs = [
                'code'=>isset($d['code'])?$d['code']:null,
                'person_id'=>$res->person['id'],
                'branch_id'=>$branch_id,
                'salary'=>0,
                'currency_code'=>'USD',
                'employment_type'=>'full time'
            ];

           $new_code = $inputs['code']; 
           $emp_created = false; 
           if (!$id) $emp_created = true; 
            $id = saveData($ss,'employees',['id'=>$id],$inputs,[],1);
            if($id>0){
               if($emp_created) $new_code = setOfficialCode($branch_id,'employee_code_control','employees',['id'=>$emp_id],$def_prefix,$def_code_length);
            }
            return DV::success(['id'=>$id]);
        }
        return DV::error($res->error_message);
    }

    // static function personId($id){
    //     $row = getDataRow('employees',['id'=>$id],"person_id");
    //     if($row) return $row->person_id;
    //     return null;
    // }

    static function canDelete($id,$ss){
        return true;
    }

    function delete($id=null,$ss=null){
       $id = $id?$id:$this->getId(); 
       $branch_id = $ss->branch_id;
       $person_id = self::personId($id);
       if (!self::canDelete($ss,$id)) return DV::error("Employee profile is locked");
       $x = DB::table('employees')->where('id',$id)->where('branch_id',$branch_id)->delete();
       return DV::success();
    }

    static function list($d,$ss){
        $branch_id = $ss->branch_id;
        $search_value = isset($d['search_value'])?$d['search_value']:null;
        $department_id = isset($d['department_id'])?$d['department_id']:null;
        $phone_number = isset($d['phone_number'])?$d['phone_number']:null;
        $email = isset($d['email'])?$d['email']:null;
        $str_search="1=1";
        if($department_id >0) $str_search .= " AND (e.department_id =$department_id)";
        if($phone_number) $str_search .=" AND p.phone_number ='$phone_number'";
        if($email) $str_search .=" AND p.email ='$email'";
        if($search_value) $str_search .=" AND (p.phone_number ='$phone_number' OR p.email='$search_value' OR CONCAT(p.last_name,' ',p.first_name) LIKE '%$search_value%')";

        $cols = "e.id, p.id as person_id,e.code,CONCAT(p.last_name,' ',p.first_name) AS name,p.sex,p.email,p.phone_number,p.phone_number1,DATE_FORMAT(p.date_of_birth,'%d %b %Y') as date_of_birth,e.created_at,e.create_user";
        return DB::table('employees as e')->join('persons as p','p.id','=','e.person_id')->where('e.branch_id',$branch_id)->whereRaw($str_search)->selectRaw($cols)->orderBy("name","ASC")->get();
    }

    function getList($d=[],$ss=null){
       return self::list($d,$ss); 
    }

    // static function details($ss,$id){
    //     $branch_id = $ss->branch_id;
    //     $cols = "e.id, p.id as person_id,e.name,e.sex,e.email,e.phone_number,e.phone_number1,e.created_at,e.create_user";
    //     $rows = DB::table('employees as e')->join('persons as p','p.id','=','e.person_id')->where('e.id',$id)->where('e.branch_id',$branch_id)->selectRaw($cols)->orderByRaw("e.name ASC")->take(1)->get();
    //     return isset($rows[0])?$rows[0]:null;
    // }
}