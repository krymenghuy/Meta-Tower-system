<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Notifier;
use Storage;
use Session;
use Sanitizer;
use DB;
use Carbon\Carbon;
use Exception;

class PrivateStorage extends Model
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
                $result->file_name = $fileName.$ext;
                $result->file_type = $file_type;
                $result->extension= $ext;
                return (object)$result;
            }
 
    //$category = {'image','document'} // or it is called $upload_type
    //$user_class ={'driver','merchant','admin',NULL}
    static function path($branch_id,$user_class,$category){
        $path = Storage::disk('private')->path('');
        //$last_char = substr($path,-1);
        //if ($last_char !='\\' || $last_char !="/") $path .='\\';
        if ($user_class =='person')
            $path .= $branch_id."_data/person/";
        else if ($user_class =='loan') 
            $path .=$branch_id."_data/loan/";
        else $path .=$branch_id."_data/general/"; 

        if($category =='image') 
            $path .="images/";
        else $path .="documents/";
        return $path;
    }
     
    //$file_content is base64 format string
    //$category ={'image','document'}
    //$file_type is file extension 3 or 4 letter without dot (.)
    //$user_class ={'loan','person','general'}. When user_class = NULL or admin => store file in Admin folder     
    static function saveFile($branch_id,$user_class,$file_type,$file_content,$category,$file_name =null){
       $path = self::path($branch_id,$user_class,$category);
       $result = (object)['error_message'=>null,'status'=>'OK'];
       if(empty($file_name)) $file_name = $branch_id."_file_".uniqid($branch_id).date('Ymd_hms');
       
       $file_name .= ".".$file_type;
       $file_path =$path.$file_name;
       $mErr = self::makeFile($file_type,$file_path,$file_content);
       if($mErr->error !=null){
           $result->status ='Error';
           $result->error_message = $mErr->error;
           return $result;
       } 
       return DV::success(['file_type'=>$mErr->file_type,'file_name'=>$file_name,'directory'=>$path]);
    }

    static function get($full_path){
         return self::readFileContent($full_path);
    }
    
}
