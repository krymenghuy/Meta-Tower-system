<?php

namespace App\Models\Location;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\DV;
use App\Models\UM;

class Country extends Model
{
    use HasFactory;
    protected $table = 'loc_countries';
    protected $guarded = ['id'];
    protected $fillable = [];
     
    protected $primaryKey = 'id';
    public $incrementing = true;
    //protected $keyType = 'string';
    public $timestamps = true;
    protected $dateFormat = 'Y-m-d';
    
    //default attribute values
    // protected $attributes = [
    //     //'inactive' => 0,
    //     'consultant_id'=>0
    // ];

     /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    // protected $hidden = [
    //     'password',
    //     'remember_token',
    // ];
 
    protected $casts = [
        'id' => 'integer',
        'name'=>'string',
        'name_kh'=>'string'
    ];
  
    //create or Update country
    static function save1($req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;

        $checkUnique =  ["$branch_id|loc_countries|name|id=id"];
        $res = getValues($d,[
            'id'=>'0|number|identity=1',
            'name'=>'1|string',
            'name_kh'=>'0|string'
        ],true,[],false,$checkUnique);

        if($res->error) return DV::error($res->error);

        $country_id = isset($res->id)?$res->id:0;
        $country_id = saveData($ss,["id"=>$country_id],'loc_countries',0);
        return DV::success(['country_id'=>$country_id]);
  } 
  
    static function delete1($req){
            $ss = UM::getUserInfoByToken($req,-1);
            if($ss->status_code !=200) return $ss; //user not authenticated
            $branch_id = $ss->branch_id;
            $id = $req->id;
            DB::table('loc_countries')->where('id',$id)->delete();
            return DV::success();
    }

}
