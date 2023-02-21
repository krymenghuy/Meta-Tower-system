<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\DV;
use App\Models\UM;
use Carbon\Carbon;
use DB;
use Sanitizer;

class CompanyProfile extends Model
{
    use HasFactory;
  
  protected $userInfo = null;

  function __construct($userInfo=null){
        $this->userInfo = $userInfo;
  }
 
  function getUserInfo()
  {
    return $this->userInfo;
  }

  //saveDetails() saveCompanyProfile()
  function save($arr=[]) {
    //$branch_id = $this->getBranchId();
    $ss = $this->getUserInfo();
    //if (!prn_allowed(0,105)) return DV::error('No access to Company Profile');
     $branch_id = $ss->branch_id;
     $data =(object)$arr; 
     if(!isset($data->name)) return DV::error("Company name cannot be empty");

     if(!isset($data->name_kh)) $data->name_kh = $data->name;
     if (!isset($data->phone_number)) return DV::error("Phone number cannot be empty");
     if(!isset($data->first_cp_name)) $data->first_cp_name = null;
     if(!isset($data->second_cp_name)) $data->second_cp_name = null;
     if(!isset($data->address)) $data->address = null;
     if(!isset($data->first_cp_phone)) $data->first_cp_phone =null;
     if(!isset($data->second_cp_phone)) $data->second_cp_phone =null;

     //$id = $data->branch_id;
     if ($branch_id>0) {
       DB::table('um_branches')->where('branch_id',$branch_id)->update(array(
           'name'=>$data->name,
           'name_kh'=>$data->name_kh,
           'email'=>$data->email,
           'address'=>$data->address,
           'address_kh'=>$data->address_kh,
           'phone_number'=>$data->phone_number,
           'first_cp_name'=>$data->first_cp_name,
           'second_cp_name'=>$data->second_cp_name,
           'first_cp_phone'=>$data->first_cp_phone,
           'second_cp_phone'=>$data->second_cp_phone,
           'update_user'=>$ss->login_name,
           'update_date'=>getNowTime()
       ));
     } else {
          //error
          return DV::error("Invalid company identifier");
     }
     return DV::success();
   }  

   function getDetails($id=null){
      if(!$id){
        $ss = $this->getUserInfo();  
        $id = $ss->branch_id;
      }
      return self::details($id); 
   } 

   static function details($branch_id){
      //if (!prn_allowed(0,105)) return DV::error('No access to Company Profile');
      $rows = DB::table('um_branches')->where('branch_id',$branch_id)->selectRaw("branch_id,name,name_kh,`address`,address_kh,phone_number,email,first_cp_name,second_cp_name,first_cp_phone,second_cp_phone,logo_file_name")->take(1)->get();
      foreach($rows as $row){
        $url = PublicStorage::getUrl($branch_id,"general","image");
        $row->logo_url = $url.$row->logo_file_name;
        unset($row->logo_file_name);
        return $row;
      }
      return null;
   }

  /** Start Save  and retrieve company's logo **/
  function saveLogo($arr =[])
  {   
    $ss = $this->getUserInfo();
    $branch_id = $ss->branch_id; 
    $data = (object)$arr;
 
	  $fileTypes = ['jpg','png','jpeg','svg'];

    $file_type= isset($data->file_type)?$data->file_type:null;
	  if(!$file_type) $file_type= isset($data->fileType)?$data->fileType:null;
    $fileContent = isset($data->photo_data)?$data->photo_data:null; 
    if(!$fileContent) $fileContent = isset($data->photoData)?$data->photoData:null;
    
	  //$dir = getcwd(). '/storage/companies/'.$branch_id.'_data/identity/';
      $dir = getcwd(). '/uploads/public/'.$branch_id.'_data/general/images/';
	  //DB::table('um_branches')->where('branch_id',1)->update(array('logo_file_name'=>$dir));   
	  $fileName =$dir.$branch_id."_logo_".date('Ymd_hms');
	  
	  $mResult = createFile($file_type,$fileName,$fileContent);
	  ////DB::table('um_branches')->where('branch_id',$branch_id)->update(array('logo_file_name'=>$mResult->error)); 
	  if (!$mResult->error)
	  {	
        $rows = DB::table('um_branches')->where('branch_id',$branch_id)->selectRaw('logo_file_name')->take(1)->get();  
        //todo: detect for error when two users try to delete this file at same time
        foreach($rows as $row) deleteFile($row->logo_file_name); 
        DB::table('um_branches')->where('branch_id',$branch_id)->update(array('logo_file_type'=>$file_type,'logo_file_name'=>basename($mResult->filename)));
       return DV::success();    
	  }
    else return DV::error($mResult->error);
  }
  
  function getLogo($ss=null)
  {
        if(!$ss) $ss = $this->getUserInfo();
        $branch_id = $ss->branch_id;
        $rows = DB::table('um_branches')->where('branch_id',$branch_id)->selectRaw('logo_file_name,logo_file_type')->take(1)->get();
        foreach($rows as $row)
        {
          $content = readFileContent($row->logo_file_name);   
          $p = "data".Sanitizer::getEncodedChar(':')."image".Sanitizer::getEncodedChar("/").$row->logo_file_type.";"."base64".Sanitizer::getEncodedChar(',');
          //****Return for javascript client
          //return $p.base64_encode($content);
          //**** return direct from server
          return  "data:image/jpg;base64,".base64_encode($content);
          
        }
        return null;
  }
  
  function getLogoUrl($ss=null)
  {
        if(!$ss) $ss = $this->getUserInfo();
        $branch_id = $ss->branch_id;
        $rows = DB::table('um_branches')->where('branch_id',$branch_id)->selectRaw('logo_file_name,logo_file_type')->take(1)->get();
        foreach($rows as $row)
        {
           $url = PublicStorage::getUrl($branch_id,"general","image");
           $url = $url.$row->logo_file_name;
           return $url;
        }
        return null;
  }
 
  
  //return list of images for mobiles App
  function getBrandImages($arr =[], $ss=null)
  {
      if(!$ss) $ss = $this->getUserInfo();
      if($ss) $branch_id = $ss->branch_id; else $branch_id = 1; //problem when many companies substribe to any App
      $d = (object)$arr;
      $app_id = $d->app_id;
      $rows = DB::table('brand_images AS b')->where('b.app_id',$app_id)->selectRaw('b.file_name,b.file_type,b.img_title')->orderByRaw('b.create_date DESC')->get();
      $imgs = [];
      foreach($rows as $row)
      {
        $content = readFileContent($row->file_name);   
        //$p = "data".getEncodedChar(':')."image".getEncodedChar("/").$row->file_type.";"."base64".getEncodedChar(',');
        //****Return for javascript client
        //return $p.base64_encode($content);
        //**** return direct from server
        $m = (object)array(
          'image'=> "data:image/jpg;base64,".base64_encode($content),
          'file_type'=>$row->file_type,
          'title'=>$row->img_title
        );
        $imgs[] = $m;
      }
      return $imgs;
  }

  //$arr = ['photo_data','file_type','app_id']
  function saveBrandImage($arr = [], $ss=null)
  {  
    $data = (object)$arr; 
    if(!$ss) $ss = $this->getUserInfo(); 
	  $result = (object)array('error_message'=>null,'status'=>'OK');
	  $fileTypes = ['jpg','png','jpeg','svg'];
    $branch_id = $ss->branch_id;
	  $file_type= isset($data->file_type)?$data->file_type:null;
	  $fileContent= isset($data->photo_data)?$data->photo_data:null;
    $app_id = $data->app_id;

     
    //$dir = getcwd(). '/storage/companies/'.$branch_id.'_data/identity/';
      $dir = getcwd(). '/uploads/companies/'.$branch_id.'_data/identity/';
	  //DB::table('um_branches')->where('branch_id',1)->update(array('logo_file_name'=>$dir));   
	  $fileName =$dir.$branch_id."_logo_".date('Ymd_hms');
	  
	  $mResult = createFile($file_type,$fileName,$fileContent);
	  ////DB::table('um_branches')->where('branch_id',$branch_id)->update(array('logo_file_name'=>$mResult->error)); 
	  if (!$mResult->error)
	  {	
        $rows = DB::table('brand_images')->where('app_id',$app_id)->selectRaw('file_name')->take(1)->get();  
        //todo: detect for error when two users try to delete this file at same time
        foreach($rows as $row) deleteFile($row->file_name); 
          DB::table('brand_images')->where('app_id',$app_id)->update(array('file_type'=>$file_type,'file_name'=>basename($mResult->filename)));
          return DV::success();
	  } else 
	  {
		  return DV::error($mResult->error);
	  }		  
	    
  }
  
  function deleteBrandImage($id,$ss=null)
  {
          if(!$ss) $ss = $this->getUserInfo(); 
          $branch_id = $ss->branch_id;
          $app_id = $d->app_id;
          $file_id = $d->id; 
          $rows = DB::table('brand_iamges')->where('app_id',$app_id)->where('id',$file_id)->selectRaw('file_name')->take(1)->get();
          foreach($rows as $row) {
            deleteFile($row->file_name);
          }
          DB::table('brand_images')->where('app_id',$app_id)->where('id',$id)->delete();
          return DV::success();
  }
 
  function deleteLogo($ss=null)
  {
        if(!$ss) $ss = $this->getUserInfo();
        $branch_id = $ss->branch_id;
          $rows = DB::table('um_branches')->where('branch_id',$branch_id)->selectRaw('logo_file_name')->take(1)->get();
        foreach($rows as $row) {
          deleteFile($row->logo_file_name);
        }
          DB::table('um_branches')->where('branch_id',$branch_id)->update(array('logo_file_type'=>null,'logo_file_name'=>null));
        return DV::success();
  }
}
