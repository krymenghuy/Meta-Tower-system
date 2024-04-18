<?php
namespace App\Http\Controllers\Dms;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\Dms\UM;
use App\Models\Dms\JDV;
use DB;

class RemarksController extends Controller
{
    function remarksExists($branch_id,$des,$id){
       $str_id = $id > 0? 'id <> '.$id : '1=1';
       return  DB::table('remarks as d')->where('d.branch_id',$branch_id)->where('d.remarks',$des)->whereRaw($str_id)->select('id')->take(1)->first();
    }

    function saveRemarks(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $branch_id = $ss->branch_id;
        $id = $req->id; 
        $description = $req->description;
        $category = isset($req->category)?$req->category:null;
        $fee_eligible = isset($req->fee_eligible)?$req->fee_eligible:0;
        if(!$description) $description = $req->description;
        if(!$description) return JDV::error('Description cannot be empty');
        if(!$category) return JDV::error('Category cannot be empty');
        $old_des = $this->getDescription($branch_id,$id);
        if($this->remarksExists($branch_id,$description,$id)) return JDV::error("Remarks $description already exists");
        $inputs = ['remarks'=>$description,'category'=>$category,'fee_eligible'=>$fee_eligible];
        
        $id = saveData($ss,'remarks',['id'=>$id],$inputs,[],1);
        if ($id > 0){
           if ($old_des != $description){
              $this->updateRemarks($branch_id,$id,$description);
           } 
           return JDV::success(['id'=>$id]);
        }
        return JDV::error('Something when wrong during saving Remarks');
    }

    function getDescription($branch_id,$id){
        if(!$id) $id =0;
       return DB::table('remarks as d')->where('branch_id',$branch_id)->where('id',$id)->value("remarks");
    }

    //Temporarily, we delete Remarks by $name , not by $id
    function deleteRemarks(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);;
        $branch_id = $ss->branch_id;
        $id = $req->id;
        $des = $req->description;
        if(!$des) $des = $req->des;
        DB::table('remarks')->where('branch_id',$branch_id)->where('id',$id)->delete();
        return JDV::success(); 
    }
     
    public function getRemarksList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);
        $branch_id = $ss->branch_id;
        $rows = DB::table("remarks as d")->where('branch_id',$branch_id)->selectRaw('d.id,d.remarks AS description,d.category,fee_eligible,IFNULL(d.update_user,d.create_user) AS update_user, formatTime(d.update_date) AS updated_at')->get();
        return JDV::result($rows);
    }

    public function getRemarksList_paginate(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);
        $branch_id = $ss->branch_id;
        $d = (object)$req->all();
        $current_page =isset($d->current_page)?$d->current_page:1;
        $per_page =isset($d->per_page)?$$d->per_page:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;

        $query = DB::table("remarks as d")->where('branch_id',$branch_id)->selectRaw('d.id,d.remarks AS description,d.category,fee_eligible,IFNULL(d.update_user,d.create_user) AS update_user, formatTime(d.update_date) AS updated_at');
        $count_query = clone $query;
        $count = $count_query->count('d.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        $data = new LengthAwarePaginator($rows, $count, $per_page, $current_page);
        return JDV::result($data);
    }

    function getRemarksDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);
        $branch_id = $ss->branch_id;
        $id = $req->id;
        $row = DB::table("remarks as d")->where('d.id',$id)->where('d.branch_id',$branch_id)->selectRaw('d.id,d.remarks AS description,d.category,fee_eligible,d.create_user,d.create_date')->take(1)->first();
        return JDV::result($row);
    }
 
    //After saving Remarks = > apply update to other user table such table "order", "package"
    function updateRemarks($branch_id,$id,$des){
        $old_des = DB::table('remarks')->where('id',$id)->value('remarks');
        if(!$old_des) return JDV::error("Remarks ID is not valid");
        // DB::table('package')->where('failure_notes',$old_des)->where('branch_id',$branch_id)->update([
        //     'failure_notes'=>$des
        // ]);
        return JDV::success();
    }
}
