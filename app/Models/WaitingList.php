<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\DV;
Use Session;
use Carbon\Carbon;
use DB;

class WaitingList extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'n_id',
    ];


    function saveApplicant($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;

        $id = isset($d->id)?$d->id:NULL;

        $name = $d->name;
        $n_id = $d->n_id;

        if(empty($name)){
            return DV::error('Name is required!');
        }
        if($id > 0){
            DB::table('tbl_waiting_list')->where('id', $id)->update(array('name'=>$name, 'n_id'=>$n_id));
        }else{
            DB::table('tbl_waiting_list')->insert(array('name'=>$name, 'n_id'=>$n_id));
        }
         return DV::success(['data'=>'']);
      } 


      function getApplicantList($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;

        return DB::table('tbl_waiting_list')->where('branch_id', $branch_id)->selectRaw('name, n_id')->get();

        
      }

}
