<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Notifier;
use Storage;
use Session;
use DB;
use Carbon\Carbon;
use Exception;

class PrivateStorage extends Model
{
    use HasFactory;

    protected static $mimeTypes = [
        'pdf'=>"application/pdf",
        'pdf?1'=>"pdf",
        'xlsx'=>"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        'xlsx?1'=>"vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        'xlsx?2'=>"xlsx",
        'xls'=>"application/vnd.ms-excel",
        'xlsm'=>"application/vnd.ms-excel.sheet.macroEnabled.12",
        'docx'=>"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        'docx?1'=>"vnd.openxmlformats-officedocument.wordprocessingml.document",
        'docx?2'=>"docx",
        'doc'=>"application/msword",
        'doc?1'=>"msword",
        'gif'=>"image/gif",
        'jpeg'=>"image/jpeg",
        'jpg'=>"image/jpeg",
        'png'=>"image/png",
        'csv'=>"text/csv",
        'csv?1'=>"csv"
       
    ];

    static function getFileExtension($file_name=null) {
        return pathinfo($file_name, PATHINFO_EXTENSION);
    }
    
    static function getMIMEType($file_name =null)
    {
        if (!$file_name) return null;
        $ext = self::getFileExtension($file_name);
        $ext= strtolower($ext?$ext:'');
        return isset(self::$mimeTypes[$ext])?self::$mimeTypes[$ext]:null;
    }

    static function getMIMETypeFromExtension($ext=null){
        $ext= strtolower($ext?$ext:'');
        return isset(self::$mimeTypes[$ext])?self::$mimeTypes[$ext]:null;
     }

     
    static function getExtensionFromMIMEType($mimeType=null){
        if(!$mimeType) return null;
        $key = array_search($mimeType,self::$mimeTypes);
        $k = explode('?',$key);
        if($k) $k = $k[0];
        return $k?$k:$mimeType;
    }
    
    static function deleteFile_internal($fileName)
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

    static function deleteFile($branch_id,$user_class,$category,$file_name)
    {
        $dir =self::path($branch_id,$user_class,$category);
        $file_path = $dir.$file_name;
        return self::deleteFile_internal($file_path);
    }


       

    static function downloadFile($branch_id,$user_class,$category,$file_name){

        $sub_dir =self::path($branch_id,$user_class,$category,1);
        $my_file = $sub_dir.$file_name;

           set_time_limit(0);

            $fs = Storage::disk('private')->getDriver();
             
            $metaData = $fs->getMetadata($my_file);
            $stream = $fs->readStream($my_file);
             
            if (ob_get_level()) ob_end_clean();

            return response()->stream(
                function () use ($stream) {
                    fpassthru($stream);
                },
                200,
                [
                    'Content-Type' => $metaData['type'],
                    'Content-disposition' => 'attachment; filename="' . $metaData['path'] . '"',
                ]);
    }


    static function readFileContent($branch_id,$user_class,$category,$file_name,$show_file_size =0)
    {    $file_size =0;
         $result = (object)['error'=>null,'contents'=>null];
           $sub_dir =self::path($branch_id,$user_class,$category,1);
           $my_file = $sub_dir.$file_name;
           try{
              $contents = Storage::disk('private')->get($my_file);
              if ($show_file_size) $file_size = Storage::disk('private')->size($my_file);
           }catch(Exception $e){
              $result->error =$e->getMessage();
              return $result;
           }
           $result->contents = $contents;
           if ($show_file_size) $result->file_size = $file_size;
           return $result;

    }
 
        static function makeFile($file_type,$fileName, $fileContent){
            $file_type = trim(strtolower($file_type));
            $result = (object)array('error'=>null,'filename'=>null); 

            $ext = pathinfo($fileName,PATHINFO_EXTENSION);
            $ext = strtolower($ext?$ext:'');
            $mime_type = self::getMIMETypeFromExtension($ext);
            if(!$mime_type){
                $result->error= "File MIME type is not valid";
                return $result;
            }

            $dir = dirname($fileName);
            if (!file_exists($dir)) {
                mkdir($dir, 0755, true); 
            }

            $bin = base64_decode($fileContent, true);
            $test = base64_encode($bin);
            if ($test != $fileContent) {
                $result->error= "Invalid file content. Base64 data is expected";
                return $result;
            }			
            
            if ($ext==='pdf'){
                if (strpos($bin, '%PDF')  != 0 ) 
                {
                    $result->error = "This pdf file does not have PDF file signature";
                    return $result;
                }
            }

            
            $success = file_put_contents($fileName, $bin);
            
            
            
            $result->extension= $ext;
            $result->file_type = $ext;
            $result->file_name = $fileName;
            $result->mime_type = $mime_type;
            return (object)$result;
}
 

    static function path($branch_id,$user_class,$category=null,$return_sub_dir=0){
        $path = Storage::disk('private')->path('');
        $sub_dir ="";
        if ($user_class ==='person')
          $sub_dir =$branch_id."_data/person/";
        else if ($user_class ==='loan')
            $sub_dir .=$branch_id."_data/loan/";
        else $sub_dir .=$sub_dir."_data/general/";

        $path .= $sub_dir;

        if($category ==='image') 
        {
            $path .="images/";
            $sub_dir .="images/";
        }
        else{
            $path .="documents/";
            $sub_dir .="documents/";
        }

        if ($return_sub_dir===1) return $sub_dir;
        return $path;
    }
     
    static function saveFile($branch_id,$user_class,$ext,$file_content,$category='image',$file_name =null){
       $path = self::path($branch_id,$user_class,$category);

       $allowed_exts = ['pdf','docx','doc','txt','xlsx','xls','csv','jpg','png','jpeg','gif','svg'];
       if ($category ==='document') $allowed_exts = ['pdf','docs','doc','txt','xlsx','xls','csv'];
       else if ($category ==='image')  $allowed_exts = ['jpg','png','jpeg','gif','svg'];

       $result = (object)['error_message'=>null,'status'=>'OK'];
       if(empty($file_name)) $file_name = $branch_id."_file_".uniqid($branch_id).date('Ymd_hms');

       $ext = self::getExtensionFromMIMEType($ext);
       $mime_type = self::getMIMETypeFromExtension($ext);
       
       if (!in_array($ext,$allowed_exts)){
           $file_exts = implode(',',$allowed_exts); 
           return DV::error("File type is not allowed. Allowed file types are $file_exts. The provided file type is ".($ext? $ext:"empty"));
       }

       $ext1 = pathinfo($file_name, PATHINFO_EXTENSION);
       if(!$ext1) $file_name .= ".".$ext;

       $file_path =$path.$file_name;
       $mErr = self::makeFile($ext,$file_path,$file_content);
       if($mErr->error) return DV::error($mErr->error);
       return DV::success(['extension'=>$mErr->file_type,'file_type'=>$mErr->file_type,'file_name'=>$file_name,'directory'=>$path,'mime_type'=>$mime_type]);
    }

    static function getFileContent($branch_id,$user_class,$category,$file_name){
         $res = self::readFileContent($branch_id,$user_class,$category,$file_name);
         if(!$res->error) return $res->contents;
         return null;
    }
    
}
