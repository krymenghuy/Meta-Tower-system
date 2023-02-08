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
  
  function saveCompanyInfo($data) {
    $ss = UM::getUserInfoByToken($data,-1);
	  if ($ss->status_code ===401) return $ss;
    if (!prn_allowed(0,105)) return DV::error('No access to Company Profile');
	
     $branch_id = $ss->branch_id;
      
     if(!isset($data->name)) {
         return "Company name cannot be empty";
     }
     if(!isset($data->name_kh)) $data->name_kh = $data->name;
     if (!isset($data->phone_number)) return "Phone number cannot be empty";
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
          return "Invalid company identifier";
     }
     return null;
   }  
   

   static function details($branch_id=0) {
    //$ss = UM::getUserInfoByToken($data,105);
    //if ($ss->status_code !=200) return $ss;
    //if (!prn_allowed(0,105)) return DV::error('No access to Company Profile');
     $rows = DB::table('um_branches')->where('branch_id',$branch_id)->select("branch_id","logo_file_name","name","name_kh","address","address_kh","phone_number","email","first_cp_name","second_cp_name","first_cp_phone","second_cp_phone")->take(1)->get();
      foreach($rows as $row){
         $file_name = basename($row->logo_file_name);
         $url =PublicStorage::getUrl($branch_id,'general','image');
         $logofile = $url.$file_name;
         $row->logo_url = $logofile;  
         return $row;
      }
      return null;
  } 
   function getCompanyInfo($data) {
       $ss = UM::getUserInfoByToken($data,105);
	     if ($ss->status_code !=200) return $ss;
       //if (!prn_allowed(0,105)) return DV::error('No access to Company Profile');
        $branch_id = $ss->branch_id;
        $rows = DB::table('um_branches')->where('branch_id',$branch_id)->selectRaw("branch_id,name,name_kh,`address`,address_kh,phone_number,email,first_cp_name,second_cp_name,first_cp_phone,second_cp_phone")->take(1)->get();
        foreach($rows as $row) return $row;
        return DV::success(['data'=>$row]);
   } 

  /** Start Save  and retrieve company's logo **/
  function saveCompanyLogo($data)
  {   
    $ss = UM::getUserInfoByToken($data,105);
	  if ($ss->status_code ===401) return $ss;
    //if (!prn_allowed(0,105)) return DV::error('No access to Company Profile');
 
	  $result = (object)array('error_message'=>null,'status'=>'OK');
	  $fileTypes = ['jpg','png','jpeg','svg'];
      $branch_id = $ss->branch_id;
	  $file_type= isset($data->fileType)?$data->fileType:null;
	  $fileContent= $data->photoData;

    //   if(!in_array($file_type,$fileTypes)) {
	// 	  $result->error_message="File type is not correct";
	// 	  $result->status="Error";
	// 	  return $result;
	//   } 

    //   if (!($branch_id>0)) {
    //     $result->error_message="Company identifier is not correct";
    //     $result->status="Error";
    //     return $result;
    //   }

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
        DB::table('um_branches')->where('branch_id',$branch_id)->update(array('logo_file_type'=>$file_type,'logo_file_name'=>$mResult->filename));
	      $result->error_message =null;
		$result->status ='OK'; 
	  } else 
	  {
		  $result->error_message =$mResult->error;
		  $result->status ='Error';
          return $result;
	  }		  
	   
	  return $result;
  }
  
  function getCompanyLogo($data)
  {
    $ss = UM::getUserInfoByToken($data,-1);
	  if ($ss->status_code ===401) return $ss;
      //if (!prn_allowed(-1)) return DV::error('No access to Company Profile'); //need permission to do this task
        $branch_id = $ss->branch_id;

          $rows = DB::table('um_branches')->where('branch_id',$branch_id)->selectRaw('logo_file_name,logo_file_type')->take(1)->get();
        foreach($rows as $row)
        {
            $content = readFileContent($row->logo_file_name);   
          $p = "data".Sanitizer::getEncodedChar(':')."image".Sanitizer::getEncodedChar("/").$row->logo_file_type.";"."base64".Sanitizer::getEncodedChar(',');
          //****Return for javascript client
          //return $p.base64_encode($content);
          //**** return direct from server
          return  DV::success(['data'=>"data:image/jpg;base64,".base64_encode($content)]);
          
        }
        return DV::success();
  }
  
  function getCompanyLogo1($branch_id=0)
  {    
    $rows = DB::table('um_branches')->where('branch_id',$branch_id)->selectRaw('logo_file_name,logo_file_type')->take(1)->get();
	   foreach($rows as $row)
	   {
		    $content = readFileContent($row->logo_file_name);   
			$p = "data".Sanitizer::getEncodedChar(':')."image".Sanitizer::getEncodedChar("/").$row->logo_file_type.";"."base64".Sanitizer::getEncodedChar(',');
			//****Return for javascript client
			//return $p.base64_encode($content);
			//**** return direct from server
			return DV::success(['data'=> "data:image/jpg;base64,".base64_encode($content)]);
			
	   }
	   return DV::success();
  }
  
  //return list of images for mobiles App
  function getBrandImages($d)
  {
    //$ss = getSessionInfo($d);
    //if(!$ss) return '#350'; //user not authenticated
    //if (!prn_allowed(2)) return '@'; //need permission to do this task
      $branch_id = 1; //problem when many companies substribe to any App
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

  function saveBrandImage($d)
  {   
    $ss = UM::getUserInfoByToken($data,-1);
	  if ($ss->status_code ===401) return $ss;
	  //if (!prn_allowed(-1)) return '@'; //need permission to do this task
 
	  $result = (object)array('error_message'=>null,'status'=>'OK');
	  $fileTypes = ['jpg','png','jpeg','svg'];
    $branch_id = $ss->branch_id;
	  $file_type= isset($data->fileType)?$data->fileType:null;
	  $fileContent= $data->photoData;
    $target_app = $d->target_app_name; // {'merchant','driver'}
    $app_id = null;
    if ($target_app =='driver') $app_id ='';
    else  $app_id ='';

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
        DB::table('brand_images')->where('app_id',$app_id)->update(array('file_type'=>$file_type,'file_name'=>$mResult->filename));
	      $result->error_message =null;
		$result->status ='OK'; 
	  } else 
	  {
		  $result->error_message =$mResult->error;
		  $result->status ='Error';
          return $result;
	  }		  
	   
	  return $result;
  }
  
  function deleteBrandImage($d)
  {
      $ss = UM::getUserInfoByToken($data,-1);
      if ($ss->status_code ===401) return $ss;
      //if (!prn_allowed(-1)) return '@'; //need permission to do this task
          $branch_id = $ss->branch_id;
          $app_id = $d->app_id;
          $file_id = $d->id; 
          $rows = DB::table('brand_iamges')->where('app_id',$app_id)->where('id',$file_id)->selectRaw('file_name')->take(1)->get();
          foreach($rows as $row) {
            deleteFile($row->file_name);
          }
          DB::table('brand_images')->where('app_id',$app_id)->where('id',$file_id)->delete();
          return DV::success();
  }
 
  function deleteCompanyLogo($data)
  {
     $ss = UM::getUserInfoByToken($data,-1);
	   if ($ss->status_code ===401) return $ss;
     //if (!prn_allowed(214)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
          $rows = DB::table('um_branches')->where('branch_id',$branch_id)->selectRaw('logo_file_name')->take(1)->get();
        foreach($rows as $row) {
          deleteFile($row->logo_file_name);
        }
          DB::table('um_branches')->where('branch_id',$branch_id)->update(array('logo_file_type'=>null,'logo_file_name'=>null));
        return DV::success();
  }
}
