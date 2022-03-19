<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Session;
use Carbon\Carbon;
use DB;
class Dashboard extends Model
{
    use HasFactory;
    function getPackageCounts($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $status_id = $d->status_id;
        $x_days_ago = $d->x_days_ago;

        $str_date = '';
        $str_status = null;
        if ($status_id !=-1) $str_status = " AND p.status_id ='".$status_id."' ";
        $past_date = date('Y-m-d',strtotime(date('Y-m-d').'-31days'));
        $str_date = " AND DATE(p.create_date) >='".$past_date."' ";
        $rows = DB::select(DB::raw("SELECT COUNT(p.id) AS cnt, DATE(p.create_date) AS create_date  from package AS p WHERE p.branch_id= '$branch_id' $str_date $str_status GROUP BY p.create_date"));
        $labels =[];
        $data = [];
        $total =0;
        foreach($rows as $row){
          $labels[] = $row->create_date;
          $x =  is_numeric($row->cnt)?$row->cnt:0;
          $data[] = $x;
          $total +=$x;
        }
       $result = (object)array('total'=>$total,'labels'=>$labels,'data'=>$data);
       return $result;
    }
    //get TotalFees over the last 31 days, number of merchants
    function getData_card1($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $status_id = $d->status_id;
        $x_days_ago = $d->x_days_ago;

        $sender_count = 0;
        $total_fees = 0;
        $rows = DB::table('sender As s')->where('s.branch_id',$branch_id)->where('s.status_code','active')->selectRaw('COUNT(s.id) AS cnt')->get();
        foreach($rows as $row) $sender_count = $row->cnt;
        $rows = DB::table('package As p')->where('p.branch_id',$branch_id)->where('p.status_id',8)->selectRaw(" SUM(IFNULL(p.delivery_fee,0) + IFNULL(p.base_fee,0) + IFNULL(p.cod_fee,0)) AS total_fees")->get();
        foreach($rows as $row) $total_fees = $row->total_fees;
        $result = (object) array('cur'=>'$','total_fees'=>$total_fees,'sender_count'=>$sender_count);
        return $result;
    }
    
}
