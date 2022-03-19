<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UploadManager extends Model
{
    use HasFactory;
         protected $allowed_file_types = ['pdf','docs','jpg','svg','png','jpeg','csv','xlsx']; 
         protected $upload_path = null;

         function deleteUpload($d){
                $ss = getSessionInfo($d);
                if(!$ss) return '#350'; //user not authenticated
                if (!prn_allowed(2)) return '@'; //need permission to do this task
                $branch_id = $ss->branch_id;
                $id =isset($d->id)?$d->id:null; //pic_id picture_id

                $app_name = isset($d->app_name)?$d->app_name:null;
                $app_id = null; //isset($d->app_id)?$d->app_id:null;
                if (strtolower($app_name) =='sender' || strtolower($app_name) =='merchant') 
                    $app_id = "38DC051E122D11EC89909801A7B0D1FCH";
                else if (strtolower($app_name) =='driver') {
                    $app_id = "584C7FF2122D11EC89909801A8B0D7XKD";
                } else {
                    $result->error_message ='App name must be Sender or Driver';
                    $result->status ='Error';
                    return $result;
                }
            $rows = DB::table('mobile_brand_images AS img')->where('img.branch_id',$branch_id)->where('img.app_id',$app_id)->where('img.id',$id)->limit(1)->selectRaw('img.file_name,img.file_type')->get();   
            $file_name = null;
            foreach($rows as $row) $file_name = $row->file_name;
            $err = deleteFile($file_name);
            //if ($err ==null) {
                $rows = DB::table('mobile_brand_images')->where('branch_id',$branch_id)->whereRaw("app_id='".$app_id."'")->where('id',$id)->delete();
            //}
            return $err; 
            }

            //upload Branding images saveBrandImage SaveBrandPhoto to display on mobile app.
            //$d=> {'app_name','file_type','photo_data'}
            function saveBrandPicture($d)
            {  
            $ss = getSessionInfo($d);
            if(!$ss) return '#350'; //user not authenticated
            if (!prn_allowed(2)) return '@'; //need permission to do this task
            $branch_id = $ss->branch_id;

            $result = (object)array('error_message'=>null,'status'=>'OK');
            $fileTypes = ['jpg','png','jpeg','svg'];

            $file_type= isset($d->file_type)?$d->file_type:null;
            $fileContent= $d->photo_data;
            $app_id = null; //isset($d->app_id)?$d->app_id:null;
            $app_name = isset($d->app_name)?$d->app_name:null;

            $app_id = null;
            if (strtolower($app_name) =='sender' || strtolower($app_name) =='merchant') 
            $app_id = "38DC051E122D11EC89909801A7B0D1FCH";
            else if (strtolower($app_name) =='driver') {
            $app_id = "584C7FF2122D11EC89909801A8B0D7XKD";
            } else {
            $result->error_message ='App name must be Sender or Driver';
            $result->status ='Error';
            return $result;
            }

            //$dir = getcwd(). '/storage/companies/'.$branch_id.'_data/identity/';
            $dir = getcwd(). '/uploads/companies/'.$branch_id.'_data/brand_mobile/';
            //DB::table('um_branches')->where('branch_id',1)->update(array('photo_file_name'=>$dir));   
            $fileName =$dir.$branch_id."_brand_pic_".date('Ymd_hms');
            $mResult = createFile($file_type,$fileName,$fileContent);   
            ////DB::table('um_branches')->where('branch_id',$branch_id)->update(array('photo_file_name'=>$mResult->error)); 
            if (!$mResult->error)
            {	
            $rows = DB::table('mobile_brand_images AS img')->where('img.branch_id',$branch_id)->where('img.app_id',$app_id)->selectRaw('COUNT(img.id) AS cnt')->get();  
            //todo: detect for error when two users try to delete this file at same time
            $cnt = 0;
            foreach($rows as $row) $cnt = $row->cnt;
            if ($cnt >5) {
                $result->error_message ='Only 5 brand images allowed';
                $result->status ='Error';
                return $result;
            }
            DB::table('mobile_brand_images')->insert(array(
                'branch_id'=>$branch_id,
                'app_id'=>$app_id,
                'file_type'=>$file_type,
                'file_name'=>$mResult->filename,
                'create_user'=>$ss->login_name,
                'create_date'=>getNowTime()
                ));
            $new_id = DB::getPdo()->lastInsertId();
            if ($new_id > 0) {
                $result->error_message =null;
                $result->status ='OK'; 
            } else {
                $result->error_message ='Unexpected problem occured during the upload';
                $result->status ='Error'; 
            }
            } 
            else 
            {
            $result->error_message =$mResult->error;
            $result->status ='Error';
            return $result;
            }		  

            return $result;
            }


            //$d = {'app_name'} use app_name to get app_id //getBrandImages()
            function getMobileBrandImages($d)
            {
            $ss = getSessionInfo($d);
            if(!$ss) return '#350'; //user not authenticated
            if (!prn_allowed(2)) return '@'; //need permission to do this task
            $branch_id = sanitize($ss->branch_id);       
            $app_name = isset($d->app_name)?$d->app_name:null;
            $app_id = null;
            if (strtolower($app_name) =='merchant' || strtolower($app_name) =='sender') 
            $app_id = "38DC051E122D11EC89909801A7B0D1FCH";
            else if (strtolower($app_name) =='driver') {
                $app_id = "584C7FF2122D11EC89909801A8B0D7XKD";
            } else {
                $result->error_message ='App name must be Sender or Driver';
                $result->status ='Error';
                return $result;
            }   

            //$subs_id = isset($d->subs_id)?$d->subs_id:null;
            $rows = DB::table('mobile_brand_images AS img')->where('img.branch_id',$branch_id)->where('img.app_id',$app_id)->selectRaw('img.id,file_name,file_type,description')->orderByRaw('img.display_order ASC')->get();
            $imgs = [];
            $i=0;
            foreach($rows as $row)
            {
                $i++;
                $content = readFileContent($row->file_name);   
                //$p = "data".getEncodedChar(':')."image".getEncodedChar("/").$row->photo_file_type.";"."base64".getEncodedChar(',');
                //****Return for javascript client
                //return $p.base64_encode($content);
                //**** return direct from server
                $imgs[] = (object)array('id'=>$row->id,'image_data'=>"data:image/jpg;base64,".base64_encode($content),'display_order'=>$i,'description'=>$row->description);
            }
            return $imgs;
            }

}
