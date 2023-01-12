<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DB;
use App\Models\DV;

class Person extends Model
{
    use HasFactory;
    protected $table = 'persons';
    protected $guarded = ['id'];
    protected $fillable =[]; // ['id','name','first_name','last_name','sex','date_of_birth','nationality_id','cp_name','cp_phone_number'];
      
    protected $primaryKey = 'id';
    public $incrementing = true;
    //protected $keyType = 'string';
    public $timestamps = true;
    protected $dateFormat = 'Y-m-d';
    
    protected static $validate_rule = [
        "id"=>"0|identity=1",
        "national_id"=>"0|positive",
        "name"=>"1|string|0-50",
        "sex"=>"1|choice|M,F,O",
        "date_of_birth"=>"0|date",
        "nationality_id"=>"1|number",
        "phone_number"=>"1|phone",
        "phone_number1"=>"0|phone",
        "email"=>"0|email",
        "address"=>"0|string",
        "cp_name"=>"0|string",
        "cp_phone_number"=>"0|string"
     ];

     //quickInfo() is similar to info(), but it returns only a few fields "id,name,phone_number"
     static function quickInfo($branch_id,$person_id,$retrieveByFields=[]){
        $more_where =null;
        foreach($retrieveByFields as $field_name=>$value){
           if($value){
             $str = "$field_name ='$value'";
             $more_where .= ($more_where?" OR ":"").$str;
           }
        }
        if(!$more_where) return null;
        $more_where =$more_where? "($more_where)" : "1=2";
 
        $rows = self::where('branch_id',$branch_id)->whereRaw($more_where)->selectRaw("id,name,phone_number")->take(1)->get();
        return isset($rows[0])?$rows[0]:null;
    }

     static function existsByFields($branch_id,$person_id,$retrieveByFields=[]){
        $more_where =null;
        foreach($retrieveByFields as $field_name=>$value){
            if($value){
                $str = "$field_name ='$value'";
                $more_where .= ($more_where?" OR ":"").$str;
            }
        }
        if(!$more_where) return 0;
        $more_where =$more_where?$more_where:"1=2";
        $rows = self::where('branch_id',$branch_id)->whereRaw($more_where)->selectRaw("id")->take(1)->get();
        return isset($rows[0]);
    }
 
    //@param $retrieveByFields =['id'=>10,'phone_number'=>'01245656','national_id'=>'02345656'] 
    static function info($branch_id,$person_id,$retrieveByFields=[]){
        $more_where =null;
        foreach($retrieveByFields as $field_name=>$value){
            if($value){
                $str = "$field_name ='$value'";
                $more_where .= ($more_where?" OR ":"").$str;
            }
        }
        if($more_where) return null;
        $more_where = $more_where?$more_where:"1=2";

        $cols ="p.id,p.name,p.first_name,p.last_name,p.sex,p.phone_number,p.email,p.address,p.nationality_id,formatDate(date_of_Birth) as date_of_birth,cp_name,cp_phone_number,cp_email";
        $rows = self::where('branch_id',$branch_id)->whereRaw($more_where)->selectRaw($cols)->take(1)->get();
        return isset($rows[0])? $rows[0]:null;
    }

    static function commitSave($ss,$d){
        //$user = (object)Session('user');
        $sanitize_options = ['email'=>['@'],'address'=>['#','.']];
        $res = DV::validateProps($d,self::$validate_rule,true,$sanitize_options,false);
        if($res->error) return DV::error($res->error);
        $person_id =isset($res->id)? $res->id:0;

        $inputs = $res->inputs;
        //divide $name into first_name and last_name using function Helper/getNameParts()
        $o_name = getNameParts($inputs['name']);
        $inputs['first_name'] = $o_name->first_name;
        $inputs['last_name'] = $o_name->last_name;
        $person_id = saveData($ss,'persons',['id'=>$person_id],$inputs,[],1);
        if($person_id>0) return DV::success(['person_id'=>$person_id]);
    }

    //forceSave() will create a new person profile if the given @person_id is not supplied or zero 
    static function forceSave($ss,$d){
        //$user = (object)Session('user');
        $sanitize_options = ['email'=>['@'],'address'=>['#','.']];
        $res = DV::validateProps($d,self::$validate_rule,true,$sanitize_options,false);
        if($res->error) return DV::error($res->error);
        $person_id =isset($res->id)? $res->id:0;

        $inputs = $res->inputs;
        //divide $name into first_name and last_name using function Helper/getNameParts()
        $o_name = getNameParts($inputs['name']);
        $inputs['first_name'] = $o_name->first_name;
        $inputs['last_name'] = $o_name->last_name;
        $person_id = saveData($ss,'persons',['id'=>$person_id],$inputs,[],1);
        if($person_id>0) return DV::success(['person_id'=>$person_id]);
    }

    static function deleteSoft($id){
       $x = self::where('id',$id)->update(['inactive'=>1]);
       if ($x) return DV::success();
       else return DV::error("failed to soft delete person $id");
    }

    static function deletePermanent($id){
        $x = self::where('id',$id)->delete();
        if ($x) return DV::success();
        else return DV::error("failed to delete person $id");
    }
 
    static function commitDelete($id){
        $x = self::where('id',$id)->delete();
        if ($x) return DV::success();
        else return DV::error("failed to delete person $id");
    }

}
