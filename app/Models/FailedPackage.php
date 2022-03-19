<?php

namespace App\Models;
 
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Session;
use DB;

class FailedPackage extends Model
{
    use HasFactory;

    function getPackageInfo($uss,$id) {
        $branch_id = $uss->branch_id;
        $rows = DB::table('package AS p')->join('package_statuses AS ps','ps.id','=','p.status_id_id')->where('p.branch_id',$branch_id)->where('p.id',$id)->selectRaw("p.id, p.package_name, p.qr_code AS barcode,p.returned, ps.status, ps.status_id")->limit(1)->get();
        foreach($rows as $row) return $row;
        return null;
    }

    function deleteFailedPackage($d) {
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task

        $branch_id = $ss->branch_id;
        $id = $d->package_id;
        $p = $this->getPackageInfo($ss,$id);
        DB::table('package')->where('branch_id',$branch_id)->where('id',$id)->delete();
        //Todo: update table delivery.package_count and delivery.status
        return null;
    }

    //$m_status = {'returned','TBD'}
    function getFailedPackageList($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task

        $branch_id = $ss->branch_id;
        $failed_status = 9; /** Change this status to the one that means package delivery failure **/ 

        $date = isset($d->date)?$d->date:null;
        $sender_id =isset($d->sender_id)?$d->sender_id:null;
        $driver_id= isset($d->driver_id)?$d->driver_id:null;
        $m_status = isset($d->status)?$d->status:null; // {returned,TBD} TBD = TBD
        $d->date = convertDate($d->date);
        if (!(bool)strtotime($date)) $date = date('Y-m-d');

        $str_sender =null;
        $str_driver =null;
        $str_returned = null;
        if ($sender_id > 0) $str_sender = "AND d.sender_id ='".$sender_id."' ";
        if ($driver_id > 0) $str_driver = "AND d.driver_id ='".$driver_id."' ";
        if(strtolower($m_status) =='returned') 
            $str_returned = "AND p.returned =1";  //For returned packages
         else if(strtolower($m_status=='tbd')) 
            $str_returned = "AND IFNULL(p.returned,0) =0"; // for non-returned packages

      
        $date = convertDate($date);
        $more_where ="p.status_id ='".$failed_status."' ".$str_returned.$str_sender.$str_driver;
        $rows = DB::table('package AS p')->join('delivery AS d','p.delivery_id','=','d.id')->join('sender AS sd','sd.id','=','p.sender_id')->join('driver AS dr','dr.id','=','d.driver_id')->selectRaw("p.id,d.id AS delivery_id,d.fleet_tracking_number,p.qr_code AS barcode, DATE_FORMAT(d.depart_time,'%d %b %Y %r') AS depart_time,p.sender_id, sd.name AS sender_name,sd.phone_number AS sender_phone, sd.email AS sender_email, sd.address AS sender_address, dr.name AS driver_name, dr.code AS driver_code, p.returned, p.failure_notes, p.package_name, p.receiver_phone,p.receiver_name, p.receiver_address, p.zone_code,p.failure_notes")->where('d.branch_id',$branch_id)->whereRaw($more_where)->get();
        return $rows;
    }

    //Now allow user to update Failure_ntoes only for Failed package
    function updateFailedPackage($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task

        $branch_id = $ss->branch_id;
        if(!isset($d->package_id)) $d->package_id = 0;
        
        $p = $this->getPackageInfo($ss,$d->package_id);
        if($p == null) {
            return "Package identifier is not valid";
        }
        DB::table('package')->where('branch_id',$branch_id)->where('id',$d->package_id)->update(array('failure_notes'=>$d->failure_notes));
        return null; 
    }

    function getFormData_failed_delivery($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task

        $branch_id = $ss->branch_id;
        $data = (object)[];
        $data->senders = DB::table('sender AS s')->where('s.branch_id',$branch_id)->selectRaw("s.id,s.name AS sender_name")->get();
        $data->drivers = DB::table('driver AS d')->where('d.branch_id',$branch_id)->selectRaw("d.id,d.name AS driver_name")->get();
        $data->statuses = DB::table('package_statuses AS ss')->where('ss.stage','delivery')->selectRaw("ss.id,ss.name")->get();
        return $data;
    }
}
