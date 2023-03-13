<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
//use App\Models\Notifier;
//use Storage;
use Session;
use DB;
use UM;
use Carbon\Carbon;
use App\Models\PublicStorage;
use App\Models\PrivateStorage;
use Exception;

class Upload extends Model
{
    use HasFactory;
    
    static function deleteFile($fileName)
        {
                if (file_exists($fileName)) {
                    try{
                        unlink($fileName);
                    }catch(\Exception $e){
                        return $e->getMessage();
                    }
                  
                    return null;
                } else return "File not found for deleting";  
        }

        static function readFileContent($fileName=null)
        {    
            if (empty($fileName)) return null;   
            if (!file_exists($fileName)) return null;
            $fileSize = filesize($fileName);
            if ($fileSize<=0) return null;
            $handle = fopen($fileName, "r");
            $contents = fread($handle, $fileSize);
            fclose($handle);
            return $contents;
        }


            /** create a file in a directory. Create directories if they do not exist **/	
            //makeFile() is to create a file in file system in general context
            //createFile() is static member of PublicStorage class that is used in specific context. Example, PublicStorage::createFile($branch_id,$user_class,$upload_type)
            static function makeFile($file_type,$fileName, $fileContent){
                //TODO: Check file size before saving
                $file_type = trim(strtolower($file_type));
                $result = (object)array('error'=>null,'filename'=>null); 
                //$result->error = $file_type;
                //return $result;
                $dir = dirname($fileName);
                if (!file_exists($dir)) {
                    mkdir($dir, 0755, true); //permission
                    //$result->error = 'Storage file or folder does not exist';
                    //return $result;
                }
                //$file_type ='x-msdownload' //Executable file .exe
                $img_types = ['jpg','png','jpeg','svg','pdf'];       
                // $parts = explode('/', $dir);
                // $file = array_pop($parts);
                // $dir = '';
                // foreach($parts as $part)
                    // if(!is_dir($dir .= "/".$part)) mkdir($dir);
                    
                    
                /* First stepSecurity: clean up using code-ignitter function */
                //$fileContent = $this->security->xss_clean($fileContent);
                
                # Decode the Base64 string, making sure that it contains only valid characters
                $bin = base64_decode($fileContent, true);
                $test = base64_encode($bin);
                if ($test != $fileContent) {
                    $result->error= "Invalid file content";
                    return $result;
                }			
                
                # Perform a basic validation to make sure that the result is a valid PDF file
                # Be aware! The magic number (file signature) is not 100% reliable solution to validate PDF files
                # Moreover, if you get Base64 from an untrusted source, you must sanitize the PDF contents
                $ext ='';
                if ( strpos($file_type,'vnd.openxmlformats-officedocument.wordprocessingml') !== false )//Word
                {
                    $ext= '.docx';
                } else if (strpos($file_type,'msword') !==false)
                {
                    $ext= '.doc';
                }			
                else if (strpos($file_type,'vnd.openxmlformats-officedocument.spreadsheetml') !== false)//Excel
                {
                    $ext= '.xlsx';
                }
                else if ($file_type =='pdf') //PDF
                {
                    $ext= '.pdf';
                    if (strpos($bin, '%PDF')  != 0 ) 
                    {
                        $result->error = "This pdf file does not have PDF file signature";
                        return $result;
                    }
                    
                    
                } else if (in_array($file_type,$img_types)) //image files
                {
                    $ext= ".".$file_type; // in this case: use $file_type as extension directly
                } else  {
                    
                    $result->error= "This file file type is not allowed";
                    return $result;
                }
                
                if(empty($ext)) {
                    $result->error= "Invalid file type";
                    return $result;
                }
                
                $success = file_put_contents($fileName.$ext, $bin);
                
                // $myfile = fopen($dir."/".$file, "w") or die ("Unable to open file!");
                
                // fwrite($myfile, $contents);
                // fclose($myfile);
                $result->filename = $fileName.$ext;
                $result->extension= $ext;
                return (object)$result;
            }
            
    static function getUploadProps($upload_id, $props){
      $cols = implode(',',$props);
      $rows = DB::table('uploads')->where('id',$upload_id)->selectRaw($cols)->limit(1)->get();
      foreach($rows as $row) return $row;
      return null;
    }

    static function delete($upload_id){
     
       DB::table('uploads')->where('id',$upload_id)->delete();
       $u = self::getUploadProps($upload_id,['file_name']);
       if(!$u) {
           return "File not found for deleting";
       } 
       $file_path = self::getDiskPath($upload_id);
       $full_path = $file_path.$u->file_name;
       $err = self::deleteFile($full_path);   
       return $err;
    }

   static function getUrl($upload_id){
     $u = self::getUploadProps($upload_id,['file_name','user_class','category','is_private']);
     if ($u) return "Upload id is not valid";
     $is_private = $u->is_private;
     if($is_private ==1){ 
        return null;
     } else{
        $path = PublicStorage::getUrl($branch_id,$u->user_class,$u->category);
        $path .=$u->file_name;
        return $path;
     }
   }

   static function getBase64($upload_id, $category='image'){
      $full_Path = self::getDiskPath_full($upload_id);
      if(!$full_Path)  throw new Exception("Upload info not found");

      $content = self::readFileContent($full_Path);   
      $p = "data".getEncodedChar(':')."image".getEncodedChar("/").$row->logo_file_type.";"."base64".getEncodedChar(',');
      //****Return for javascript client
      //return $p.base64_encode($content);
      //**** return direct from server
      return  "data:image/jpg;base64,".base64_encode($content);

      return null;
   }

   static function getDiskPath($upload_id){
      $up = self::getUploadProps($upload_id,['branch_id','is_private','file_name','file_type','user_class','category']);
      if(!$up) return null;
      if ($up->is_private ==1)
       $path = PrivateStorage::path($u->branch_id,$u->user_class,$u->category); 
      else   $path = PublicStorage::getDiskPath($u->branch_id,$u->user_class,$u->category); 
      return $path;
   }

   static function getDiskPath_full($upload_id){
        $up = self::getUploadProps($upload_id,['branch_id','is_private','file_name','file_type','user_class','category']);
        if(!$up) return null;
        if ($up->is_private ==1)
        $path = PrivateStorage::path($u->branch_id,$u->user_class,$u->category); 
        else   $path = PublicStorage::getDiskPath($u->branch_id,$u->user_class,$u->category); 
        return $path.$u->file_name;
  }

    static function save($user_id,$category,$file_type,$file_content,$is_private=false){
       
        $result = (object)array('error_message'=>null,'status'=>'OK');
        $user = UM::getUserProps($user_id,['branch_id','user_class','login_name']);
        if(!$user) {
            $result->error_message =  "user identity is not valid";
            $result->status ='Error';
            return $result;
        }

        $branch_id = $user->branch_id;
        $user_class = $user->user_class;
        $allowed_cats = ['image','document'];
         
        if(!in_array($category,$allowed_cats)) {
            $result->error_message =  "Category must be image or document";
            $result->status ='Error';
            return $result;
        }
 
        $fileTypes = ['jpg','png','jpeg','svg'];
        
        if (!$branch_id){
            $result->error_message = "Failed to upload file due to invalid company identity";
            $result->status ='Error';
            return $result;
        }

        if ($category =='image') {
            if (!in_array($file_type,$fileTypes)){
                $result->error_message = "Photo file type is not allowed!";
                $result->status ='Error';
                return $result;
            }
        } 
      
            $file_name = $branch_id."_".$user_id."_".uniqid()."_".date('Ymd_hms');
            $ext= $file_type;
            //$ext = self::mime_to_ext($file_type);
            if (!$ext){
                $result->error_message = "Invalid file type or mime type";
                $result->status ='Error';
                return $result;
            }

            $file_name .= ".".$file_type; 
            $full_path = null;
            if($is_private ==1)
                $full_path = PrivateStorage::path($branch_id,$user,$category).$file_name;
            else
                $full_path = PublicStorage::getDiskPath($branch_id,$user_class,$category).$file_name;

            $mErr = self::makeFile($file_type,$full_path,$file_content);

            if(!$mErr->error){
                $file_name .=".".$ext;
                DB::table('uploads')->insert(array(
                    'is_private'=>$is_private,
                    'category'=>$category,
                    'user_class'=>$user_class,
                    'file_type'=>$file_type,
                    'file_name'=>$file_name,
                    'create_date'=>getNowTime(),
                    'create_user'=>$user->login_name
                ));
                $new_id = DB::getPdo()->lastInsertId();
                $result->upload_id = $new_id;
                $result->error_message =null;
                $result->status ='OK'; 
            }else {
                $result->error_message = $mErr->error;
                $result->status ='Error';
                return $result;
            } 

            return $result;
    }
}
