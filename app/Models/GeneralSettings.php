<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Session;
use DB;

class GeneralSettings extends Model
{
    use HasFactory;

    function deleteProductType($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id);
        $id = isset($d->id)?sanitize($d->id):null;
        $id =isset($d->id)?sanitize($d->id):0;
        DB::table('product_types')->where('branch_id',$branch_id)->where('id',$id)->delete();
        return null;
    }

    function sendMessage($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id);
        $phone_number = isset($d->phone_number)?sanitize($d->phone_number):null;
        $text = isset($d->text)?sanitize($d->text):null;

                $fields = array(
                    //'app_id' => "5eb5a37e-b458-11e3-ac11-000c2940e62c",
                    'gw-username'=>'xperasoft',
                    'gw-password'=>'bchsd',
                    'gw-to'=>$phone_number,
                    'gw-from'=>'Dolgoal',
                    'gw-text'=>$text
                    //'token' =>'di5B9xXcZeULyNAFSsdv9COWOzBPWE',
                );

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, "http://sms.plasgate.com:29062/cgi-bin/sendsms");
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json; charset=utf-8',
                'Authorization: Basic di5B9xXcZeULyNAFSsdv9COWOzBPWE'
            ));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
            curl_setopt($ch, CURLOPT_HEADER, FALSE);
            curl_setopt($ch, CURLOPT_POST, TRUE);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
            
            $response = curl_exec($ch);
            curl_close($ch);
            
            return $response;
    }

    function getProductTypes($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id);
        $sender_id = isset($d->sender_id)?sanitize($d->sender_id):null;
        $id =isset($d->id)?sanitize($d->id):0;
        DB::table('sender_base_price')->where('id',$id)->where('branch_id',$branch_id)->delete();
        return null;
    }
}
