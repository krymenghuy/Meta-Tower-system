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
        'docx'=>"application/vnd.openxmlformats-officedocument.wordprocessingml.document", //"application/vnd.openxmlformats-officedocument.wordprocessing",
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
    
    //return MIME type based on a given file_name "something.pdf"
    static function getMIMEType($file_name =null)
    {
        if (!$file_name) return null;
        $ext = self::getFileExtension($file_name);
        $ext= strtolower($ext?$ext:'');
        return isset(self::$mimeTypes[$ext])?self::$mimeTypes[$ext]:null;
    }

    //return a MIME type based on a given extendion "pdf"
    static function getMIMETypeFromExtension($ext=null){
        $ext= strtolower($ext?$ext:'');
        return isset(self::$mimeTypes[$ext])?self::$mimeTypes[$ext]:null;
     }

     
    //return file extension based the given mimetype, otherwise return the meimeType itself
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

    // static function deleteFile($branch_id,$user_class,$category,$file_name){
    //     if (file_exists($fileName)) {
    //         $sub_dir =self::path($branch_id,$user_class,$category,1);
    //         $my_file = $sub_dir.$file_name;
    //         try{
    //            Storage::disk('private')->delete($my_file);
    //         }catch(Exception $e){
    //            return $e->getMessage();
    //         }
    //         return null;

    //     } else return "File not found for deleting";
       
    // }

    static function downloadFile($branch_id,$user_class,$category,$file_name){

        $sub_dir =self::path($branch_id,$user_class,$category,1);
        $my_file = $sub_dir.$file_name;

           set_time_limit(0);

            /** @var \League\Flysystem\Filesystem $fs */
            //$fs = Storage::disk('local')->getDriver();
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


    //get file stream
    /***
      NOTE: Storage::disk('private') returns,example  "E:/LaravelApps/LMS/storage/companies/private/";
      //Whereas the private files are useually saved in sub directory "/1_data/loan/documents",
      therefore,   
     * ***/
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

            // if (empty($fileName)) return null;   
            // if (!file_exists($fileName)) return null;//file not exists
            // $fileSize = filesize($fileName);
            // if ($fileSize<=0) return null;
            // $handle = fopen($fileName, "r");
            // $contents = fread($handle, $fileSize);
            // fclose($handle);
            //return $contents;
    }
 
        /** create a file in a directory. Create directories if they do not exist **/	
        //makeFile() is to create a file in file system in general context
        //createFile() is static member of PublicStorage class that is used in specific context. Example, PublicStorage::createFile($branch_id,$user_class,$upload_type)
        static function makeFile($file_type,$fileName, $fileContent){
            //TODO: Check file size before saving
            $file_type = trim(strtolower($file_type));
            $result = (object)array('error'=>null,'filename'=>null); 

            $ext = pathinfo($fileName,PATHINFO_EXTENSION);
            $ext = strtolower($ext?$ext:'');
            $mime_type = self::getMIMETypeFromExtension($ext);
            //$ext = self::getExtensionFromMIMEType($file_type);
            if(!$mime_type){
                $result->error= "File MIME type is not valid";
                return $result;
            }

            //$result->error = $file_type;
            //return $result;
            $dir = dirname($fileName);
            if (!file_exists($dir)) {
                mkdir($dir, 0755, true); //permission
                //$result->error = 'Storage file or folder does not exist';
                //return $result;
            }

            //$file_type ='x-msdownload' //Executable file .exe
            
            //$allowed_exts = ['jpg','jpeg','png','svg','pdf','doc','doxc','xlsx','xls','txt','csv'];       
           
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
                $result->error= "Invalid file content. Base64 data is expected";
                return $result;
            }			
            
            # Perform a basic validation to make sure that the result is a valid PDF file
            # Be aware! The magic number (file signature) is not 100% reliable solution to validate PDF files
            # Moreover, if you get Base64 from an untrusted source, you must sanitize the PDF contents
            // if(!in_array($ext,$allowed_exts)){
            //     $result->error= "File type $ext is not allowed!";
            //     return $result;
            // }

            if ($ext==='pdf'){
                if (strpos($bin, '%PDF')  != 0 ) 
                {
                    $result->error = "This pdf file does not have PDF file signature";
                    return $result;
                }
            }

            
            //$fileName = $fileName.".".$ext;//No need
            $success = file_put_contents($fileName, $bin);
            
            // $myfile = fopen($dir."/".$file, "w") or die ("Unable to open file!");
            
            // fwrite($myfile, $contents);
            // fclose($myfile);
            
            $result->extension= $ext;
            $result->file_type = $ext;
            $result->file_name = $fileName;
            $result->mime_type = $mime_type;
            return (object)$result;
}
 

    //$category = {'image','document'} // or it is called $upload_type
    //$user_class ={'driver','merchant','admin',NULL}
    //$return_sub_dir =1 => return only sub directory such as "1_data/loan/documents"
    static function path($branch_id,$user_class,$category=null,$return_sub_dir=0){
        $path = Storage::disk('private')->path('');
        $sub_dir ="";
        //$last_char = substr($path,-1);
        //if ($last_char !='\\' || $last_char !="/") $path .='\\';
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
     
    //$file_content is base64 format string
    //$category ={'image','document'}
    //$file_type is file extension 3 or 4 letter without dot (.)
    //$user_class ={'loan','person','general'}. When user_class = NULL or admin => store file in "General" folder     
    static function saveFile($branch_id,$user_class,$ext,$file_content,$category='image',$file_name =null){
       $path = self::path($branch_id,$user_class,$category);

       $allowed_exts = ['pdf','docx','doc','txt','xlsx','xls','csv','jpg','png','jpeg','gif','svg'];
       if ($category ==='document') $allowed_exts = ['pdf','docs','doc','txt','xlsx','xls','csv'];
       else if ($category ==='image')  $allowed_exts = ['jpg','png','jpeg','gif','svg'];

       $result = (object)['error_message'=>null,'status'=>'OK'];
       if(empty($file_name)) $file_name = $branch_id."_file_".uniqid($branch_id).date('Ymd_hms');

       $ext = self::getExtensionFromMIMEType($ext);
       $mime_type = self::getMIMETypeFromExtension($ext);
       //if(!$mime_type) return DV::error("There is no matching MIME type for file .$ext");
       
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

    //readFileContent() return object reporting error if any. object = {error,contents,file_size}
    //getFileContent() return contents straignt away
    static function getFileContent($branch_id,$user_class,$category,$file_name){
         $res = self::readFileContent($branch_id,$user_class,$category,$file_name);
         if(!$res->error) return $res->contents;
         return null;
    }
    
}
