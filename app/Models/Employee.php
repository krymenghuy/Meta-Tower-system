<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DB;
use App\Models\DV;

class Employee extends Model
{
    use HasFactory;

    protected $table = 'employees';
    protected $guarded = ['id'];
    protected $fillable = [];
 
    protected $primaryKey = 'id';
    public $incrementing = true;
    //protected $keyType = 'string';
    public $timestamps = true;
    protected $dateFormat = 'Y-m-d';
    
    protected $attributes = [
        //'inactive' => 0,
        'branch_id'=>0
    ];
 
    static function commitSave($ss,$d){
        $branch_id = $ss->branch_id;
        $id = $d['id'];
        $res = Person::commitSave($ss,$d);
        if($res->status ==='OK'){
            $inputs = [
                'person_id'=>$res->person_id,
                'branch_id'=>$branch_id,
                'salary'=>120,
                'currency_code'=>'USD',
                'employment_type'=>'full time'
            ];
            $id = saveData($ss,'employees',['id'=>$id],$inputs,[],1);
        }

        // $validate_rule = [
        //     'id'=>'0|number|identity=1',
        //     'name'=>'1|string|1-150',
        //     'sex'=>'0|choice|M,F,O',
        //     'date_of_birth'=>'1|date',
        //     'email'=>'0|email',
        //     'phone_number'=>'1|phone',
        //     'phone_number1'=>'0|phone',
        //     'address'=>'0|string',
        //     'position_id'=>'1|positive'
        // ];
    
        // $check_unique = [];
        // $res = validateObject($d,$validate_rule,true,[],$ss->lang,false,$check_unique);
        // if($res->error) return DV::error($res->error);
        // $inputs = $res->values;
        // $id = $res->id;
        // $id = saveData($ss,'employees',['id'=>$id],$inputs,[],1);
        // if($id > 0) return DV::success(['id'=>$id]);
        // return DV::error("Something went wrong during saving item group");
    }

    static function personId($id){
        $row = getDataRow('employees',['id'=>$id],"person_id");
        if($row) return $row->person_id;
        return null;
    }

    static function canDelete($ss,$id){
        return true;
    }

    static function commitDelete($ss,$id){
       $branch_id = $ss->branch_id;
       //$person_id = self::personId($id);
       if (!self::canDelete($ss,$id)) return DV::error("Employee profile is locked");
       $x = DB::table('employees')->where('id',$id)->where('branch_id',$branch_id)->delete();
       return DV::success();
    }

    static function list($ss){
        $branch_id = $ss->branch_id;
        $cols = "e.id, p.id as person_id,e.name,e.sex,e.email,e.phone_number,e.phone_number1,e.created_at,e.create_user";
        return DB::table('employees as e')->join('persons as p','p.id','=','e.person_id')->where('e.branch_id',$branch_id)->selectRaw($cols)->orderByRaw("e.name ASC")->get();
    }

    static function details($ss,$id){
        $branch_id = $ss->branch_id;
        $cols = "e.id, p.id as person_id,e.name,e.sex,e.email,e.phone_number,e.phone_number1,e.created_at,e.create_user";
        $rows = DB::table('employees as e')->join('persons as p','p.id','=','e.person_id')->where('e.id',$id)->where('e.branch_id',$branch_id)->selectRaw($cols)->orderByRaw("e.name ASC")->take(1)->get();
        return isset($rows[0])?$rows[0]:null;
    }

    
}
