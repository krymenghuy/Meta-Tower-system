<?php

namespace App\Models;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
//use App\Models\PrivateStorage;
use DV;
use XPublicStorage;
use App\Models\Umt\Subscription;
use DB;
use DBX;
use Config;
//use Sanitizer;
//use Carbon\Carbon;
class MobileAppSettings //extends Model
{
    //use HasFactory;
    protected $userInfo = null;
    protected $app_id =null;
    protected static $img_dir ='mobile-slides';
    function __construct($app_id=null,$userInfo=null){
         $this->app_id =$app_id;
         $this->userInfo = $userInfo;
    }
    function getUserInfo(){
         return $this->userInfo;
    }
 
   static function getHomeScreenData($subs_id,$app_id){ 
       $rows = DB::table('mobile_brand_images as img')->where('app_id',hex2bin($app_id))->where('subs_id',hex2bin($subs_id))->selectRaw('file_name')->get();
       $imgs = [];
       foreach($rows as &$row){
          $url = XPublicStorage::getUrl(['subs_id'=>$subs_id,'branch_id'=>null,'dir_name'=>self::$img_dir],'image').$row->file_name;
          $imgs[] = validateUrl($url,'');
        }
       return (object)[
         'images'=>$imgs
       ];
   }

   static function appSettings(){
     return (Object)[
         'no_data_photo'=>base_url('assets/images/icons/no_data.webp')
     ];
   }

   static function getTermsAndConditions($app_id, $ss)
   {
    $subs_id = $ss->subs_id ?? getCurrentSubsId(true);
    //$branch_id = null; // $ss->branch_id;
    // Prepare a map of app IDs to filenames
    $fileMap = [
        Config::get('app.merchant_app_id') => 'merchant_terms_and_conditions.txt',
        Config::get('app.driver_app_id')   => 'driver_terms_and_conditions.txt',
        Config::get('app.sales_app_id')    => 'salesapp_terms_and_conditions.txt',
    ];

    // Check if the app_id is valid
    if (!isset($fileMap[$app_id])) {
        return "Invalid app_id";
    }

    // Get the filename from the map
    $file_name = $fileMap[$app_id];

    // Build the full file path
    $full_path = XPublicStorage::getDiskPath(['subs_id'=>$subs_id,'branch_id'=>null,'dir'=>'general'], 'document') . $file_name;
    // Check if the file exists
    if (!file_exists($full_path)) {
        return "File not found!";
    }

    // Read the file content
    $text = file_get_contents($full_path);

    return $text;
  }

    // //$d = {'app_id'}
    // static function getTermsAndConditions($app_id,$ss){
    //     $branch_id = $ss->branch_id;
    //     $file_name ='merchant_terms_and_conditions.txt';
    //     $user_class ='general'; //default to "general"
    //     if ($app_id == Config::get('app.merchant_app_id')){
    //         $file_name ='merchant_terms_and_conditions.txt';
    //     }
    //     else if ($app_id == Config::get('app.driver_app_id')){
    //         $file_name ='driver_terms_and_conditions.txt';
    //     }
    //     else if ($app_id == Config::get('app.sales_app_id')){
    //       $file_name ='salesapp_terms_and_conditions.txt';
    //    }
    //     else return "Invalid app_id";                  
    //     $full_path = XPublicStorage::getDiskPath_v1($branch_id,$user_class,'document').$file_name; //getcwd()."/storage/companies/common/".$app_id."/".$file_name;
    //     if (!file_exists($full_path)) return "File not found!";
    //     $text = readFileContent($full_path);
      
    //     return $text;
    // }

    static function saveTermsAndConditions($app_id, $content, $ss) {
      // $branch_id = null; // $ss->branch_id;
      $subs_id = $ss->subs_id ?? getCurrentSubsId(true);
      $file_name = '';     
      if ($app_id == Config::get('app.merchant_app_id')) {
          $file_name = 'merchant_terms_and_conditions.txt';
      } else if ($app_id == Config::get('app.driver_app_id')) {
          $file_name = 'driver_terms_and_conditions.txt';
      } else if ($app_id == Config::get('app.sales_app_id')) {
          $file_name = 'salesapp_terms_and_conditions.txt';
      } else {
          return "Invalid app_id";
      }
  
      $full_path = XPublicStorage::getDiskPath(['subs_id'=>$subs_id,'branch_id'=>null, 'dir'=>'general'],'document');
     
      $content = $content ?? '';
      if (!file_exists($full_path)) {
        mkdir($full_path, 0777, true);
      }
      $full_path = rtrim($full_path, '/') . '/' . $file_name;
      // Check if the file exists
      if (!file_exists($full_path)) {
          // Create the file if it does not exist
          $file = fopen($full_path, 'w');
          if (!$file) {
              return "Failed to create file";
          }
          // Write the content to the file
          fwrite($file, $content);
          // Close the file
          fclose($file);
      } else {
          // Open the existing file for writing
          $file = fopen($full_path, 'w');
          if (!$file) {
              return "Failed to open file";
          }
          // Write the content to the file
          fwrite($file, $content ?? '');
          // Close the file
          fclose($file);
      }
      return DV::success();
  }
   
    static function savePrivacyContent($app_id, $content){
      $file_name = null;
      if ($app_id == Config::get('app.merchant_app_id')){
          $file_name = 'privacy.blade.php';
      }
      else if ($app_id == Config::get('app.driver_app_id')){
          $file_name = 'privacy.blade.php';
      }
      else if ($app_id == Config::get('app.sales_app_id')){
          $file_name = 'hou_connect_privacy.blade.php';
      }
      else {
          return "Invalid app_id";
      }
      
      $full_path = base_path('resources/views/' . $file_name); 
        $content = $content ?? '';
        // Check if the file exists
        if (!file_exists($full_path)) {
            // Create the file if it does not exist
            $file = fopen($full_path, 'w');
            if (!$file) {
                return "Failed to create file";
            }
            // Write the content to the file
            fwrite($file, $content);
            // Close the file
            fclose($file);
        } else {
            // Open the existing file for writing
            $file = fopen($full_path, 'w');
            if (!$file) {
                return "Failed to open file";
            }
            // Write the content to the file
            fwrite($file, $content ?? '');
            // Close the file
            fclose($file);
        }
    
        return DV::success();
    }
 
    static function getPrivacyContent($app_id){
        // Define a mapping of app IDs to filenames
        $fileMap = [
            Config::get('app.merchant_app_id') => 'privacy.blade.php',
            Config::get('app.driver_app_id')   => 'privacy.blade.php',
            Config::get('app.sales_app_id')    => 'hou_connect_privacy.blade.php',
        ];

        // Check if the app_id is valid and retrieve the filename
        if (!array_key_exists($app_id, $fileMap)) {
            return "Invalid app_id";
        }

        // Build the full file path
        $file_name = $fileMap[$app_id];
        $full_path = base_path("resources/views/{$file_name}");
        
        // Check if the file exists
        if (!file_exists($full_path)) {
            return "File not found! " . $full_path;
        }

        // Read the file content and convert the encoding
        $text = file_get_contents($full_path);
        $text_utf8 = mb_convert_encoding($text, 'UTF-8');

        return $text_utf8;
    }

  

  
  //   static function getPrivacyContent($app_id){
  //     //$branch_id = $ss->branch_id;
  //     $file_name =null;
  //     //$user_class ='general'; //default to "general"
      
  //     if ($app_id == Config::get('app.merchant_app_id')){
  //         $file_name ='privacy.blade.php';
  //     }
  //     else if ($app_id == Config::get('app.driver_app_id')){
  //       $file_name ='privacy.blade.php';
  //     }
  //     else if ($app_id == Config::get('app.sales_app_id')){
  //       $file_name ='hou_connect_privacy.blade.php';
  //    }
  //     else return "Invalid app_id";
  //     $full_path = base_path('resources/views/' . $file_name);                
  //     if (!file_exists($full_path)) return "File not found! ".$full_path;
  //     $text = readFileContent($full_path);
  //     return $text;
  // }

  static function contactInfo($ss){
    $subs_id = $ss->subs_id;
    $subs = Subscription::props($subs_id,'customer_id');
    $subscriber_id = $ss->subscriber_id ?? ($subs? $subs->customer_id : null);
    $bin_customer_id = null;
    if($subscriber_id) $bin_customer_id =   $subscriber_id;
    if (!$bin_customer_id) return null;
    $links = DB::table('social_media as l')->where('l.customer_id',$bin_customer_id)->selectRaw('l.id,l.name,l.url, NULL AS image_url')->get();
    $row = DB::table('um_customers as c')->where('c.id',$bin_customer_id)->selectRaw('c.phone_number, c.email,c.address,c.address_kh, \'\' AS map_url, website')->first();
    //$contacts = DB::table('contacts as c')->where('c.customer_id',$bin_customer_id)->selectRaw("c.id,c.contact_by,c.contact_type")->get();
    return (object)[
      'links'=>$links,
      'contact_info'=>$row
    ];
  }
   
    static function faq_list($app_id,$arr=[],$ss=null){
        //$ss = UM::getUserInfoByToken($d);
        //if ($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task
        $d = (object)$arr; 
        $bin_app_id = $app_id? hex2bin($app_id) : null;
        $branch_id = $ss?$ss->branch_id:1;
        return DB::table('faq_list AS f')->where('f.branch_id',$branch_id)->where('app_id',$bin_app_id)->selectRaw("id,question_text,answer_text, order_number")->orderByRaw("f.order_number ASC")->get();
    }
 
    //getMobileBrandImages() returns array of [{user_class, image_url,title, description, category}]
    //"user_class" the image is for which user_class so we can derive which mbile app each of these images is for 
    function getMobileBrandImages($app_id, $ss)
    {
        $ss = $ss ?? $this->userInfo;
        $subs_id = $ss->subs_id;
        $branch_id = null; // $ss->branch_id;
        $bin_app_id = $app_id? hex2bin($app_id) : null;
          
        //$subs_id = isset($d->subs_id)?$d->subs_id:null;
        $str_branch = $branch_id > 0? 'img.branch_id = '.$branch_id : '2=2';
        $rows = DB::table('mobile_brand_images AS img')->where($str_branch)->where('img.app_id',$bin_app_id)->selectRaw("img.id,file_name,file_type,NULL AS title,description, 'Brand Image' AS category")->orderByRaw('img.display_order ASC')->get();
        $i=0;
        foreach($rows as $row)
        {
            $i++;
            //$storage_folder ="general", so the brand images are retrieved from folder "General"
            $image_url = htmlspecialchars(XPublicStorage::getUrl(['subs_id'=>$subs_id,'branch_id'=>null,'dir_name'=>self::$img_dir],'image').$row->file_name);
            $row->image_url = $image_url;
        }
        return $rows;
    }
  
    //used by mobile apps
    //$d is $request object (No authentication here)
    //$d = {company_id,$app_id}
    //getBrandImages() is used by backend only
    //getBrandImages() is used by backend only
    static function getBrandImages($app_id, $ss)
    {
        //$branch_id = null;
        $subs_id = $ss? ($ss->subs_id?? null):null;
        $subs_id = $subs_id ?? getCurrentSubsId(true);
        $subs_id = $ss->subs_id ?? getCurrentSubsId(true);
        $str_branch="1=1"; //problem when many companies substribe to the same Mobile App
        $bin_app_id = $app_id? hex2bin($app_id): null;
        if(!$app_id){
            return [];
        }
        $rows = DB::table('mobile_brand_images AS b')->where('b.app_id',$bin_app_id)->where('b.subs_id',hex2bin($subs_id))->whereRaw($str_branch)->selectRaw('b.id,b.file_name,b.file_type,b.description')->orderByRaw('b.id DESC')->get();
        $imgs = [];
        foreach($rows as $row){
        $imgs[] = (object)[
            'id'=>$row->id,
            'image_url'=>XPublicStorage::getUrl(['subs_id'=>$subs_id,'branch_id'=>null,'dir_name'=>self::$img_dir],'image').$row->file_name,
            'description'=>$row->description
        ];
        }
        return $imgs;
    }

    //$d is array. $d = ['photo_data','file_type','title','app_id','description']
  static function saveBrandImage($d,$app_id,$ss)
  {   
    //if($ss) $branch_id = $ss->branch_id; else $branch_id =0;
    $subs_id = $ss->subs_id;
    $branch_id = $ss->branch_id;
    $description = isset($d['description'])?$d['description']:null; 
	  $file_type= isset($d['file_type'])? $d['file_type']:null;
    if(!$file_type) $file_type= isset($d['fileType'])? $d['fileType']:null;
    $photo_data = isset($d['photo_data'])?$d['photo_data']: (isset($d['photoData'])?$d['photoData']:null);
 
    $bin_app_id = $app_id? hex2bin($app_id): null; 
    //Do not save and just ignore
    //if(!$photo_data || filter_var($photo_data, FILTER_VALIDATE_URL)) return DV::success();
   
    $res = XPublicStorage::saveImage(['subs_id'=>$subs_id,'branch_id'=>null,'dir_name'=>self::$img_dir],$file_type,$photo_data,null,null);
    if($res->status ==='OK'){
      $new_id = DBX::saveData($ss,'mobile_brand_images',['id'=>null],[
        'app_id'=>$bin_app_id,
        'description'=>$description,
        'file_type'=>$res->extension,
        'file_name'=>$res->file_name
      ],[],1);
      if($new_id > 0){
        $url = XPublicStorage::getUrl(['subs_id'=>$subs_id,'branch_id'=>null,'dir_name'=>self::$img_dir],'image').$res->file_name;
         return DV::depends(1,['imgs'=>self::getBrandImages($app_id,$ss),'image'=>(object)['url'=>$url,'description'=>$description]]);
      }
      return DV::error('Something when wrong in saving Brand Image');
    }
    return DV::error($res->error_message);
  }
  
  //$d = [app_id,$id]
  static function deleteBrandImage($id,$app_id,$ss)
  {
      //$bin_app_id = $app_id? hex2bin($app_id): null; 
      $subs_id = $ss->subs_id;
      $row = DB::table('mobile_brand_images')->where('id',$id)->selectRaw('file_name')->first();
      if($row) XPublicStorage::delete(['subs_id'=>$subs_id,'branch_id'=>null,'dir_name'=>self::$img_dir],'image',$row->file_name);
      DB::table('mobile_brand_images')->where('id',$id)->delete();
      return DV::depends(1,['imgs'=>self::getBrandImages( $app_id,$ss)]);
  }
}