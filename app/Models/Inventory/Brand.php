<?php

namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\UM;
use DB;
use App\Models\DV;

class Brand extends Model
{
    use HasFactory;
    protected $table = 'inv_brands';
    protected $guarded = ['id'];
    protected $fillable =[]; // ['id','name','first_name','last_name','sex','date_of_birth','nationality_id','cp_name','cp_phone_number'];
      
    protected $primaryKey = 'id';
    public $incrementing = true;
    //protected $keyType = 'string';
    public $timestamps = true;
    protected $dateFormat = 'Y-m-d';
    
    protected static $validate_rule = [
        "id"=>"0|identity=1","name"=>"1|string|1-100","name_kh"=>"0|string"
    ];

    protected static $sanitize_rule = ['name'=>['.','@','-']];
 
    static function deletePermanently($req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $id =$req->id;
        $x = self::where('id',$id)->where('branch_id',$branch_id)->delete();
        if ($x) return DV::success();
        else return DV::error('No matching brand name to be deleted');
    }

    static function createOrUpdate($req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        //$d = $req->all();

        //$branch_id|persons|first_name,last_name,email!phone_number|id|text=person already exists
        $checkUnique = ["$branch_id|inv_brands|name|id=id|text=Brand name already exists"];
        $res = validateReq($req,self::$validate_rule,true,self::$sanitize_rule,$ss->lang,false,$checkUnique);
        if ($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $inputs['name_kh'] = isset($inputs['name_kh'])?$inputs['name_kh']:$inputs['name'];
        $id = isset($res->id)?$res->id:0;
        $id = saveData($ss,'inv_brands',['id'=>$id],$inputs);
        if($id>0) return DV::success(["id"=>$id]);
        else return DV::error("Problem during creating new brand name"); 
    }

    static function list($req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        return DV::result(self::where('branch_id',$branch_id)->selectRaw("id,name,name_kh")->orderByRaw('name ASC')->get());
    }
}
