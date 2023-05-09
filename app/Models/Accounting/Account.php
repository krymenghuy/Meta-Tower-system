<?php

namespace App\Models\Accounting;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
//use App\Models\DV;

class Account //extends Model
{
    //use HasFactory;
    protected $id = null,$userInfo = null;

    function __construct($id=null,$userInfo=null){
       $this->id = $id;
       $this->userInfo = $userInfo;
    }

    static function list($filter=[], $ss=null){
      $branch_id = $ss->branch_id;  
      return DB::table("accounts AS a")->where("a.branch_id",$branch_id)->selectRaw("a.id,a.name,a.account_type_id")->get();
    }
}
