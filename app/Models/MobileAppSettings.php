<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\PrivateStorage;
use App\Models\DV;
use App\Models\UM;

use Session;
use DB;
use Carbon\Carbon;

class MobileAppSettings extends Model
{
    use HasFactory;
 
    //$d = {'app_id'}
    function getTermsAndConditions($d){
        //$ss = getSessionInfo($d);
        // if(!$ss) return '#350'; //user not authenticated
        // if (!prn_allowed(2)) return '@'; //need permission to do this task
        //$branch_id = $ss->branch_id;
        
        $file_name ='merchant_terms_and_conditions.txt';
        $app_id = isset($d->app_id)?$d->app_id:null;
        //$merchant_app_id ='38DC051E122D11EC89909801A7B0D1FCH';
        //$driver_app_id ="584C7FF2122D11EC89909801A8B0D7XKD";
        if(empty($app_id)) return "Invalid app_id";  
        
        $full_path = getcwd()."/storage/companies/common/".$app_id."/".$file_name;
        $text = readFileContent($full_path);
        //PrivateStorage::saveFile(1,'merchant','dat',$text,'document','testfile');
        // return "terms and conditions text to be written";
        // $branch_id = isset($d->branch_id)?sanitize($d->branch_id):1;
        // $rows = DB::table("terms_texts")->where('t.branch_id',$branch_id)->selectRaw('t.terms_text')->limit(1)->get();
        // foreach($rows as $row) return $row->terms_text;
        return $text;
    }

    function getContactInfo($d){
        // $ss = getSessionInfo($d);
        //if(!$ss) return '#350'; //user not authenticated
        // if (!prn_allowed(2)) return '@'; //need permission to do this task
        // $branch_id = $ss->branch_id;
        $branch_id =1; 
        if($branch_id ==0 || !$branch_id) return [];
      
       $links = DB::table('social_media_links as l')->where('l.branch_id',$branch_id)->selectRaw('l.id,l.name,l.url,l.description, NULL AS image_url')->get();
       $contacts = DB::table('contacts as c')->where('c.branch_id',$branch_id)->selectRaw("c.id,c.contact_by,c.contact_type")->get();
       return (object)[
        'links'=>$links,
        'contacts'=>$contacts
      ];
   } 

    function deleteBrandImage($d){
                $ss = getSessionInfo($d);
                if(!$ss) return '#350'; //user not authenticated
                if (!prn_allowed(0,106)) return DV::error('Unauthorized access to module Brand Images');
                $branch_id = $ss->branch_id;
                $id =isset($d->id)?$d->id:null; //pic_id picture_id
            $user_class = strtolower(isset($d->user_class)?$d->user_class:null);
            $app_id = getAppIdByUserClass($user_class);
            
            if (empty($app_id)){
                $result->error_message ='App name must be Sender or Driver';
                $result->status ='Error';
                return $result;
            }

           $rows = DB::table('mobile_brand_images AS img')->where('img.branch_id',$branch_id)->where('img.app_id',$app_id)->where('img.id',$id)->limit(1)->selectRaw('img.file_name,img.file_type')->get();   
           $file_name = null;
           foreach($rows as $row) $file_name = $row->file_name;
           if(empty($file_name)) return null;
           $path = PublicStorage::getDiskPath($branch_id,$user_class,'image').$file_name;
           $err = deleteFile($path);
           //if ($err ==null) {
            $rows = DB::table('mobile_brand_images')->where('branch_id',$branch_id)->whereRaw("app_id='".$app_id."'")->where('id',$id)->delete();
           //}
           return $err; 
        }

     
    //upload Branding images saveBrandImage SaveBrandPhoto to display on mobile app.
    //$d=> {'user_class','file_type','photo_data',[display_order]}
    function saveBrandImage($d)
    {  
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!UM::allowed(0,106)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $photo_data = isset($d->photo_data)?$d->photo_data:null;
        $file_type = isset($d->file_type)?$d->file_type:null;
        $user_class = strtolower(isset($d->user_class)?$d->user_class:null);

        if(!UM::correctUserClass($user_class)) return DV::error("User class is not correct");
        $app_id = getAppIdByUserClass($user_class);

        $result = (object)array('error_message'=>null,'status'=>'OK');

        $m = PublicStorage::saveImage($branch_id,$user_class,$file_type,$photo_data);
        if ($m->status =='OK'){
                    //begin:: Check if image count > 5
                        $rows = DB::table('mobile_brand_images AS img')->where('img.branch_id',$branch_id)->where('img.app_id',$app_id)->selectRaw('COUNT(img.id) AS cnt')->get();  
                        $cnt = 0;
                        foreach($rows as $row) $cnt = $row->cnt;
                        if ($cnt >5) {
                                $result->error_message ='Only 5 brand images allowed';
                                $result->status ='Error';
                                return $result;
                        }
                  //end:: Check if image count > 5

                    DB::table('mobile_brand_images')->insert(array(
                        'branch_id'=>$branch_id,
                        'app_id'=>$app_id,
                        'file_type'=>$file_type,
                        'file_name'=>$m->file_name,
                        'create_user'=>$ss->login_name,
                        'create_date'=>getNowTime()
                    ));
                    $new_id = DB::getPdo()->lastInsertId();
                    if ($new_id > 0) {
                        $result->error_message =null;
                        $result->status ='OK';
                        $url = PublicStorage::getUrl($branch_id,$user_class,'image').$m->file_name;
                        $result->image_url = htmlspecialchars($url);
                        return $result;
                     } else {
                            $result->error_message ="Image has been saved, but failed to create link to that image";
                            $result->status ='Error';
                            return $result; 
                    }
   
        }else return DV::error($m->error_message);
    }

   
    //getBrandImages() | getMobileBrandImages() returns array of [{user_class, image_url,title, description, category}]
    //"user_class" the image is for which user_class so we can derive which mbile app each of these images is for 
    function getMobileBrandImages($d)
    {
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(0,106)) return []; // DV::error('No access to module Brand Images');
        $branch_id = sanitize($ss->branch_id);

        //user_class =>  tell which mobile app the image is to be displayed in        
        $user_class = strtolower(isset($d->user_class)?$d->user_class:null);
        $app_id = getAppIdByUserClass($user_class);
        if (!UM::correctUserClass($user_class))
        {
             $e = DV::error('User class is not correct!');
             $e->imgs = [];
             return $e;
        } 

        if (empty($app_id)){
            $result->error_message ='App identity or app ID was not found!';
            $result->status ='Error';
            return $result;
        }   

        //$subs_id = isset($d->subs_id)?$d->subs_id:null;
        $rows = DB::table('mobile_brand_images AS img')->where('img.branch_id',$branch_id)->where('img.app_id',$app_id)->selectRaw("img.id,file_name,file_type,NULL AS title,description, 'Brand Image' AS category")->orderByRaw('img.display_order ASC')->get();
        $i=0;
        foreach($rows as $row)
        {
            $i++;
            //$storage_folder ="general", so the brand images are retrieved from folder "General"
            $image_url = htmlspecialchars(PublicStorage::getUrl($branch_id,$user_class,'image').$row->file_name);
            $row->image_url = $image_url;
        }
        return $rows;
    }

    // //$d = {'app_name'} use app_name to get app_id //getBrandImages()
    // function getMobileBrandImages($d)
    // {
    //     $ss = getSessionInfo($d);
    //     if(!$ss) return '#350'; //user not authenticated
    //     if (!prn_allowed(2)) return '@'; //need permission to do this task
    //     $branch_id = sanitize($ss->branch_id);       
    //     $app_name = isset($d->app_name)?$d->app_name:null;
    //     $app_id = null;
    //     if (strtolower($app_name) =='merchant' || strtolower($app_name) =='sender') 
    //      $app_id = "38DC051E122D11EC89909801A7B0D1FCH";
    //     else if (strtolower($app_name) =='driver') {
    //         $app_id = "584C7FF2122D11EC89909801A8B0D7XKD";
    //     } else {
    //         $result->error_message ='App name must be Sender or Driver';
    //         $result->status ='Error';
    //         return $result;
    //     }   

    //     //$subs_id = isset($d->subs_id)?$d->subs_id:null;
    //     $rows = DB::table('mobile_brand_images AS img')->where('img.branch_id',$branch_id)->where('img.app_id',$app_id)->selectRaw('img.id,file_name,file_type,description')->orderByRaw('img.display_order ASC')->get();
    //     $imgs = [];
    //     $i=0;
    //     foreach($rows as $row)
    //     {
    //         $i++;
    //         $content = readFileContent($row->file_name);   
    //         //$p = "data".getEncodedChar(':')."image".getEncodedChar("/").$row->photo_file_type.";"."base64".getEncodedChar(',');
    //         //****Return for javascript client
    //         //return $p.base64_encode($content);
    //         //**** return direct from server
    //          $imgs[] = (object)array('id'=>$row->id,'image_data'=>"data:image/jpg;base64,".base64_encode($content),'display_order'=>$i,'description'=>$row->description);
    //     }
    //     return $imgs;
    // }

    //used by mobile apps
    //$d = {company_id,$app_id}
    function getBrandImages_mobile($d)
    {
        //Images are retirved as public => so no user identity
        $branch_id = isset($d->company_id)?$d->company_id:null;
        if(!$branch_id) $branch_id = isset($d->branch_id)?$d->branch_id:null;
        if(!$branch_id) $branch_id = 1;
        $app_id = isset($d->app_id)?$d->app_id:null;
        $user_class = $d->user_class;
         
        //$subs_id = isset($d->subs_id)?$d->subs_id:null;
        $rows = DB::table('mobile_brand_images AS img')->where('img.branch_id',$branch_id)->where('img.app_id',$app_id)->selectRaw('file_name,file_type')->orderByRaw('img.display_order ASC')->get();
        $i=0;
        foreach($rows as $row)
        {
            $i++;
            $url = htmlspecialchars(PublicStorage::getUrl($branch_id,$user_class,'image').$row->file_name);
            $row->image_url = $url;
            // $content = readFileContent($row->file_name);   
            //         //$p = "data".getEncodedChar(':')."image".getEncodedChar("/").$row->photo_file_type.";"."base64".getEncodedChar(',');
            //         //****Return for javascript client
            //         //return $p.base64_encode($content);
            //         //**** return direct from server
            //  $imgs[] = (object)array('image_data'=>"data:image/jpg;base64,".base64_encode($content),'display_order'=>$i);
        }
        return $rows;
    }
      
}
