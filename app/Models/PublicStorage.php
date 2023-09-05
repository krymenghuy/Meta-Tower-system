<?php

namespace App\Models;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
//use Intervention\Image\Facades\Image;

//use App\Models\Notifier;
//use Storage;
use Session;
use DB;
use App\Models\DV;
use Carbon\Carbon;
use Exception;

class PublicStorage //extends Model
{
    //use HasFactory;
    protected static $allowed_image_extensions = ['jpg','png','jpeg','gif','heif','bmp'];
    protected static $allowed_audio_extensions = [
        'mp3',
        'wav',
        'm4a',
        'ogg',
    ];

    //map from $user_class to upload directory name
    protected static $upload_dirs =[
      "item"=>"item",
      "product"=>"item",
      "rm"=>"rm",
      "partner"=>"partner",
      "patient"=>"patient",
      "driver"=>"driver",
      "merchant"=>"merchant",
      "sender"=>"merchant",
      "staff"=>"staff",
      "employee"=>"staff",
      "general"=>"general",
      "person"=>"person",
      "student"=>"student",
      "borrower"=>"borrower",
      "lender"=>"lender",
      "vendor"=>"vendor",
      "customer"=>"customer",
      "client"=>"customer",
      "admin"=>"general",
      "brand-image"=>"brand-images",
      "identity"=>"identity"
    ];

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

    static function delete($branch_id,$user_class,$category,$file_name){
         $file = self::getDiskPath($branch_id,$user_class,$category).$file_name;
         return self::deleteFile($file);
    }

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

    static function getBase64ImageSize($base64Image){ //return memory size in B, KB, MB
            try{
                $size_in_bytes = (int) (strlen(rtrim($base64Image, '=')) * 3 / 4);
                $size_in_kb    = $size_in_bytes / 1024;
                $size_in_mb    = $size_in_kb / 1024;

                return $size_in_mb;
            }
            catch(Exception $e){
                return $e;
            }
        }

        //readFileContent() in PublicStoreage is DIFFERENT from readFileContent() in PrivateStorage for security reason
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

                $ext = pathinfo($fileName,PATHINFO_EXTENSION);
                $ext = strtolower($ext?$ext:'');
                $mime_type = self::getMIMETypeFromExtension($ext);
               
                // if(!$mime_type){
                //     $result->error= "File MIME type is not valid";
                //     return $result;
                // }

                //$result->error = $file_type;
                //return $result;
                $dir = dirname($fileName);
                if (!file_exists($dir)) {
                    mkdir($dir, 0755, true); //permission
                    //$result->error = 'Storage file or folder does not exist';
                    //return $result;
                }
 
                // # Decode the Base64 string, making sure that it contains only valid characters
                $bin = base64_decode($fileContent, true);
                $test = base64_encode($bin);
                if ($test != $fileContent) return DV::error('Invalid file content. Base64 data is expected'); 

                # Perform a basic validation to make sure that the result is a valid PDF file
                # Be aware! The magic number (file signature) is not 100% reliable solution to validate PDF files
                # Moreover, if you get Base64 from an untrusted source, you must sanitize the PDF contents
                // if(!in_array($ext,$allowed_exts)){
                //     $result->error= "File type $ext is not allowed!";
                //     return $result;
                // }

                // if ($ext==='pdf'){
                //     if (strpos($bin, '%PDF')  != 0 ) return DV::error('This pdf file does not have PDF file signature');
                // }

                //$fileName = $fileName.".".$ext;//No need
               try{
                file_put_contents($fileName, $bin);
               }catch(\exception $e){
                return DV::error($e->getMessage());
               }

                // $myfile = fopen($dir."/".$file, "w") or die ("Unable to open file!");

                // fwrite($myfile, $contents);
                // fclose($myfile);
                $result->status ='OK';
                $result->extension= $ext;
                $result->file_type = $ext;
                $result->file_name = $fileName;
                $result->mime_type = $mime_type;
                return (object)$result;
    }

    //upload_type is category = {'image','document'}
    static function getUrl($branch_id,$user_class,$upload_type){
        return url('')."/uploads/public/".$branch_id."_data/".self::getSpecificFolder($user_class,$upload_type);
    }

    //returns specific folder such as "merchant/images" or "merchant/documents" depending on $user_class and $upload_type
    //@user_class = {general,person,loan}
    static function getSpecificFolder($user_class,$upload_type ="document"){
        $folder_name =isset(self::$upload_dirs[$user_class])?self::$upload_dirs[$user_class]:$user_class;
        if ($upload_type ==="image" || $upload_type ==="photo")
          return $folder_name."/images/";
        else if ($upload_type ==="audio")
          return $folder_name."/audio/";
        else if ($upload_type ==="video")
          return $folder_name."/video/";
        else
          return $folder_name."/documents/";
    }

    //getPath() || getDiskPath()
    static function getDiskPath($branch_id,$user_class,$upload_type="document"){
       return getcwd(). '/uploads/public/'.$branch_id.'_data/'.self::getSpecificFolder($user_class,$upload_type);
    }

    //create a full-path including random file name,and return object = {path,file_name,extension}
    static function createFullPath($branch_id,$user_class,$category,$ext){
       $file_name = $branch_id."_file_".uniqid($branch_id).date('Ymd_hms').".".$ext;
       $path = self::getDiskPath($branch_id,$user_class,$category);
       if (!file_exists($path)) {
          mkdir($path, 0777, true);
       }
       $path .= $file_name;

       return (object)[
        'path'=>$path,
        'file_name'=>$file_name,
        'extension'=>$ext
       ];
    }

    //$upload_type = {'image','document'}
    static function createFile($branch_id,$user_class,$ext,$fileContent,$upload_type="document",$file_name = null){
        //Auto create file name, if filename not supplied
        //if(empty($file_name)) $file_name = $branch_id."_".unqueid()."_".date('Ymd_hms');
        if(!$file_name) $file_name = $branch_id."_file_".uniqid($branch_id).date('Ymd_hms');
        $filePath = self::getDiskPath($branch_id,$user_class,$upload_type).$file_name;
        return self::makeFile($ext,$filePath,$fileContent);
    }

    //NOTE: $storeInfo is associative array {"id"=>row_id,"store"=>'table_name.column_name'} Example $storeInfo =['id'=>122,'store'=>'employees.photo_file_name']
    //$userInfo = {branch_id,user_class}
    static function saveProfilePicture($userInfo,$ext,$photo,$maxSize=null,$storeInfo=[]){
       $maxSize =$maxSize?$maxSize:500000;
       $branch_id = $userInfo->branch_id;
       $user_class = $userInfo->user_class;
       $store = isset($storeInfo['store'])?$storeInfo['store']:null;
       $sts = explode('.',$store);
       $table = $sts[0];
       $col = $sts[1];
       $id = isset($storeInfo['id'])?$storeInfo['id']:null;
       if($id && $table && $col){
            $rows = DB::table($table)->where('id',$id)->select([$col])->take(1)->get();
            foreach($rows as $row)
            {
                $file_name = $row->{$col};
                $path = self::getDiskPath($branch_id,$user_class,'image').$file_name;
                //delete previous picture file
                self::deleteFile($path);
            }
       }

       $res = self::saveImage($branch_id, $user_class,$ext,$photo,$maxSize);
       if($res->status ==='Error') return $res;
       if($id && $table && $col){
            $x = DB::table($table)->where('id',$id)->update([$col=>$res->file_name]);
            if($x) return $res;
            return (object)['status'=>'Error','error_message'=>'Something went wrong in saving profile picture'];
       }
       return $res;

    }

    //$storeInfo = ['branch_id'=>25,"store"=>"tablename.col_name"]
    static function saveFileName_db($branch_id,$user_class,$file_name,$storeInfo=null,$category='image'){
        if(!$storeInfo) return;
        $store = isset($storeInfo['store'])?$storeInfo['store']:null;
        $sts = explode('.',$store);
        $table = $sts[0];
        $col = $sts[1];
        $str_id ="1=2";
        $id = isset($storeInfo['id'])?$storeInfo['id']:null;
        if($id)
          if($id> 0) $str_id ="id =$id"; else $str_id ="id ='$id'";
        else{
            foreach($storeInfo as $key=>$value){
                if($key !=='store'){
                   if($value > 0) $str_id ="$key =$value"; else $str_id ="$key ='$value'";
                   break;
                }
              }
        }

        if($table && $col){
             $row = DB::table($table)->whereRaw($str_id)->selectRaw($col)->take(1)->get()->first();
             if($row)
             {
                 $prev_file_name = $row->{$col};
                 $path = self::getDiskPath($branch_id,$user_class,$category).$prev_file_name;
                 //delete previous picture file
                 self::deleteFile($path);
                 $x = DB::table($table)->whereRaw($str_id)->update([$col=>$file_name]);

             }
        }
    }

    static function saveAudio($branch_id, $user_class, $ext, $base64, $maxSize = 500000, $store = [])
    {
        $ext = $ext?$ext:'m4a';
        if (self::isBase64Audio($base64)) {
            // Create the full path for the audio file
            $p = self::createFullPath($branch_id, $user_class, 'audio', $ext);

            //try {

                // // Check if the audio data size exceeds the maximum allowed size
                // if (strlen($audio_data) > $maxSize) {
                //     throw new \Exception('Audio file size exceeds the maximum allowed size');
                // }
 
                // // Check if the audio data size exceeds the maximum allowed size
                // if (strlen($audio_data) > $maxSize) {
                //     throw new \Exception('Audio file size exceeds the maximum allowed size');
                // }
    

                // Save the audio file using normal PHP functions
                $f_res = self::makeFile($ext,$p->path,$base64);
                // Save the file name in the database
                if($f_res->status ==='OK')
                {
                    if($store) self::saveFileName_db($branch_id, $user_class, $p->file_name, $store);
                    // Get the audio file URL using getUrl() function
                    $audio_url = self::getUrl($branch_id, $user_class, 'audio') . $p->file_name;

                    // Return the response object
                    return (object)[
                        'status' => 'OK',
                        'file_name' => $p->file_name,
                        'file_type' => $p->extension,
                        'ext' => $p->extension,
                        'extension' => $p->extension,
                        'audio_url' => $audio_url,
                    ];
                }else return $f_res;
                      
            // } catch (\Exception $e) {
            //     return (object)['error_message' => $e->getMessage(), 'status' => 'Error'];
            // }
        }

        return (object)['error_message' => "The given file type is not a valid audio format", 'status' => 'Error'];
    }


    //NOTE: saveImage() will create image file based on the given base64 string
    //savePhoto() | saveFile()
    static function saveImage($branch_id, $user_class,$ext,$image_or_base64,$maxSize=500000,$store=[]){
        if(!$ext) $ext ="png";
        if(self::isImage($ext)){
            $p = self::createFullPath($branch_id,$user_class,'image',$ext);
            if ($image_or_base64 instanceof Image){
                try{
                    //Through this senario, it means the $file_content is instance of Intervention/Image class and has been compressed to, by default, 500 KB
                    $image_or_base64->save($p->path);
                    self::saveFileName_db($branch_id,$user_class,$p->file_name,$store);
                    return (object)['status'=>'OK','file_name'=>$p->file_name,'file_type'=>$p->extension,'ext'=>$p->extension,'extension'=>$p->extension,'image_url'=>self::getUrl($branch_id,$user_class,'image').$p->file_name];
                }catch(\Exception $e){
                    return (object)['error_message'=>$e->getMessage(),'status'=>'Error'];
                }
            }

            //$full_path = self::getDiskPath($branch_id,$user_class,'image').$file_name;
            try {
                //compress image size to, by default 500 KB
                $mx = resizeImage_base64($image_or_base64,$maxSize);
                if($mx->error) return (object)['error_message'=>$mx->error,'status'=>'Error'];
                $mx->image->save($p->path);
                self::saveFileName_db($branch_id,$user_class,$p->file_name,$store);
                return (object)['status'=>'OK','file_name'=>$p->file_name,'file_type'=>$p->extension,'ext'=>$p->extension,'extension'=>$p->extension,'image_url'=>self::getUrl($branch_id,$user_class,'image').$p->file_name];
                //Image::make($file_content)->save($full_path);
                // Do something with the image
            } catch (\Exception $e) {
                if($e instanceof \Intervention\Image\Exception\NotReadableException)
                   return (object)['error_message'=>$e->getMessage(),'status'=>'Error'];
                else if($e instanceof \Intervention\Image\Exception\NotWritableException)
                   return (object)['error_message'=>$e->getMessage(),'status'=>'Error'];
                else return (object)['error_message'=>$e->getMessage(),'status'=>'Error'];
            }
        }
        return (object)['error_message'=>"The given file type is not valid image format",'status'=>'Error'];
    }

    static function isBase64Audio($base64)
    {
        return true; /** todo: Check this function for correctness */
        // Define a mapping of common audio file signatures to their corresponding file extensions
        $audioSignatures = [
            'mp3' => 'data:audio/mpeg;base64,',
            'wav' => 'data:audio/wav;base64,',
            'm4a' => 'data:audio/mp4;base64,',
            'ogg' => 'data:audio/ogg;base64,',
            // Add more signatures and extensions for other audio formats as needed
        ];

        // Iterate through the audio signatures and check if the base64 data starts with any of them
        foreach ($audioSignatures as $format => $signature) {
            if (strpos($base64, $signature) === 0) {
                return true;
            }
        }

        // The base64 data does not match any known audio format
        return false;
    }

    static function isAudio($ext){
        return in_array(strtolower($ext? $ext:""),self::$allowed_audio_extensions);
    }
    static function isImage($ext){
        return in_array(strtolower($ext? $ext:""),self::$allowed_image_extensions);
    }

    static function extension_contains_invalid_char($ext){
        $chars = array(",", "-", "/","?");
        foreach ($chars as $char) {
            if (str_contains($ext, $char)) {
               return true;
            }
        }
        return false;
    }

     //savePhoto() | saveFile()
     static function savefile($branch_id, $user_class,$ext,$file_content,$category ='image'){
        $mime_type ="";
        $ext =$ext?$ext:"";

        if (!$branch_id) return DV::error("Failed to upload file due to invalid company identity. Company information is required to identify who the file belongs to");
        $new_content =null;

        if ($category ==='image'){
            //when extension $ext contains invlid char such as '-,?,/' etc. we suspect it can be a mimeType instead of extension
            if (self::extension_contains_invalid_char($ext))
               $ext = self::getExtensionFromMIMEType($ext);
            else $mime_type = self::getMIMETypeFromExtension($ext);
             
            //self::isImage() check extension to see if it is image extension
            $is_image =self::isImage($ext);

            if($is_image){
              //compressed base64 string into smaller size, by defaul 500 KB and default format as "png".
              $mx  = resizeImage_base64($file_content,null,null);
              if($mx->error) return DV::error($mx->error);
               return self::saveImage($branch_id,$user_class,$ext,$mx->image,null);
            } return DV::error('Image file extension is not allowed'); 
        }
        else if ($category==='audio'){
            if(!in_array($ext,self::$allowed_audio_extensions)){
                return DV::error('Audio file does not have correct file type');   
            }
        }
        else{
            $allowed_doc_exts = ['pdf','docx','doc','txt','xlsx','xls','csv'];
            if(!in_array(strtolower($ext),$allowed_doc_exts)) return DV::error("File type $ext is not allowed for upload");
            else $new_content = $file_content;
        }

        //if(!$mime_type) return DV::error("There is no matching MIME type for file .$ext");
        //if (!$ext) return DV::error("Invalid file type or mime type ");

        $file_name = $branch_id."_".uniqid()."_".date('Ymd_hms').".$ext";
        $full_path = self::getDiskPath($branch_id,$user_class,$category).$file_name;
        $f_res = self::makeFile($ext,$full_path,$new_content);
        return $f_res;
        
    }

    //return a object fileInfo = {'file_name','file_type'} by a given category
    //$category ={'merchant-profile-photo','merchant-img','merchant-doc','driver-profile-photo','driver-img','driver-doc'}
    static function getFileInfoByCategory($branch_id,$category,$id){
      if($category =='merchant-profile-photo')
        {
            $rows = DB::table('sender AS s')->where('branch_id',$branch_id)->where('id',$id)->selectRaw('photo_file_name AS file_name, file_type')->limit(1)->get();
            foreach($rows as $row) return $row;
            return null;
        }else if ($category =='driver-profile-photo'){
            $rows = DB::table('driver AS d')->where('d.branch_id',$branch_id)->where('d.id',$id)->selectRaw('photo_file_name AS file_name, file_type')->limit(1)->get();
            foreach($rows as $row) return $row;
            return null;
        }
        return null;
    }

    //$category ={'merchant-profile-photo','merchant-image','merchant-doc','driver-profile-photo','driver-image','driver-doc'}
    static function deleteByCategory($branch_id,$category,$id){
         $fileInfo = self::getFileInfoByCategory($branch_id,$category,$id);
         if($fileInfo !=null){
            $file_name = $fileInfo->file_name;

            if ($category=="merchant-profile-photo" )
               $user_class ="merchant";
            else if ($category =="driver-profile-photo")
                $user_class ="driver";

            $upload_type ="image";
            if ($file_name){
                $full_path = self::getDiskPath($branch_id,$user_class,$upload_type).$file_name;
                return self::deleteFile($full_path);
            }
         }
         return null;
    }

//    static function delete($branch_id,$user_class,$upload_type,$file_name){
//      $full_path = self::getDiskPath($branch_id,$user_class,$upload_type).$file_name;
//      return self::deleteFile($full_path);
//    }

//    static function saveMerchantProfilePhoto($branch_id,$sender_id,$file_type,$file_content){
//         $result = (object)array('error_message'=>null,'status'=>'OK');
//         $fileTypes = ['jpg','png','jpeg'];

//         if (!$branch_id){
//             $result->error_message = "Failed to upload file due to invalid company identity";
//             $result->status ='Error';
//             return $result;
//         }

//         if (!in_array($file_type,$fileTypes)){
//             $result->error_message = "Photo file type is not allowed. Allowed file type are png, jpg,jpeg";
//             $result->status ='Error';
//             return $result;
//         }
//         $ext = $file_type; //self::mime_to_ext($file_type);

//         if (!$ext){
//             $result->error_message = "Invalid file type or mime type ";
//             $result->status ='Error';
//             return $result;
//         }

//         $file_name = $branch_id."_merchant_photo_".uniqid($branch_id).date('Ymd_hms');

//         $full_path = self::getDiskPath($branch_id,'merchant','image').$file_name;
//         $mErr = self::makeFile($file_type,$full_path,$file_content);

//         if (!$mErr->error){
//             $rows = DB::table('sender')->where('branch_id',$branch_id)->where('id',$sender_id)->selectRaw('photo_file_name')->limit(1)->get();
//             //todo: detect for error when two users try to delete this file at same time
//             foreach($rows as $row) {
//                 if(!empty($row->photo_file_name)){
//                     $del_path = self::getDiskPath($branch_id,'merchant','image').$row->photo_file_name;
//                     $del_err = self::deleteFile($del_path);
//                 }
//             }
//             $file_name .=".".$ext;
//             DB::table('sender')->where('branch_id',$branch_id)->where('id',$sender_id)->update(array('photo_file_type'=>$file_type,'photo_file_name'=>$file_name));
//             $result->error_message =null;
//             $result->status ='OK';
//         }else{
//             $result->error_message = $mErr->error;
//             $result->status ='Error';
//             return $result;
//         }
//    }

//    static function saveDriverProfilePhoto($branch_id,$driver_id,$file_type,$file_content){
//     $result = (object)array('error_message'=>null,'status'=>'OK');
//     $fileTypes = ['jpg','png','jpeg','svg'];

//     if (!$branch_id){
//         $result->error_message = "Failed to upload file due to invalid company identity";
//         $result->status ='Error';
//         return $result;
//     }

//     if (!in_array($file_type,$fileTypes)){
//         $result->error_message = "Photo file type is not allowed!";
//         $result->status ='Error';
//         return $result;
//     }
//         $file_name = $branch_id."_driver_profile_".date('Ymd_hms');
//         $ext= $file_type;
//         //$ext = self::mime_to_ext($file_type);
//         if (!$ext){
//             $result->error_message = "Invalid file type or mime type";
//             $result->status ='Error';
//             return $result;
//         }

//         $file_name .= ".".$file_type;
//         $full_path = self::getDiskPath($branch_id,'driver','image').$file_name;

//         $mErr = self::makeFile($file_type,$full_path,$file_content);
//         if(!$mErr->error){
//             $rows = DB::table('driver')->where('branch_id',$branch_id)->where('id',$driver_id)->selectRaw('photo_file_name')->limit(1)->get();
//             //todo: detect for error when two users try to delete this file at same time
//             foreach($rows as $row) {
//                 if(!empty($row->photo_file_name)){
//                     $del_path = self::getDiskPath($branch_id,'driver','image').$row->photo_file_name;
//                     self::deleteFile($del_path);
//                 }
//             }
//             $file_name .=".".$ext;
//             DB::table('driver')->where('branch_id',$branch_id)->where('id',$driver_id)->update(array('photo_file_type'=>$file_type,'photo_file_name'=>$file_name));
//             $result->error_message =null;
//             $result->status ='OK';
//         }else {
//             $result->error_message = $mErr->error;
//             $result->status ='Error';
//             return $result;
//         }

//    }

    static function getProfilePhoto_url($user_id){
       $user = UM::getUserProps($user_id,"id,branch_id,user_class,official_id");
       if(!$user) return null;
       $table = null;
       $user_class = $user->user_class;
       if ($user_class==='patient')
        $table ="patients";
       else if ($user_class ==='employee' || $user_class ==='staff')
         $table ="employees";
       if(!$table) return null;

       $row = getDataRow($table,['id'=>$user->official_id],"photo_file_name");
       if(!$row) return null;
       return self::getURl($user->branch_id,$user->user_class,'image').$row->photo_file_name;
    }

   //return base64 content of image
    static function getProfilePhoto($branch_id,$person_id){
        //$ss = getSessionInfo($d);
        //if(!$ss) return '#350'; //user not authenticated
        //if (!prn_allowed(2)) return '@'; //need permission to do this task
        //$sender_id = isset($d->sender_id)?$d->sender_id:null;
        $rows = DB::table('persons')->where('branch_id',$branch_id)->where('id',$sender_id)->selectRaw('photo_file_name,photo_file_type')->limit(1)->get();
        foreach($rows as $row)
        {
            $full_path = self::getDiskPath($branch_id,'person','image').$row->photo_file_name;
            $content = self::readFileContent($full_path);
            $p = "data".getEncodedChar(':')."image".getEncodedChar("/").$row->photo_file_type.";"."base64".getEncodedChar(',');
            //****Return for javascript client
            //return $p.base64_encode($content);
            //**** return direct from server
            return  "data:image/jpg;base64,".base64_encode($content);
        }
        return null;
    }

    //retun publuc $url for merchant profile photo
    static function getProfilePhotoUrl($branch_id,$person_id){
        $rows = DB::table('persons AS d')->where('d.branch_id',$branch_id)->where('d.id',$person_id)->selectRaw('photo_file_name,photo_file_type')->limit(1)->get();
        foreach($rows as $row) {
            if (empty($row->photo_file_name))
              return null;
            else
               return self::getUrl($branch_id,'person','image').$row->photo_file_name;
        }
        return $sender_id;
    }

    //get file extension from mimeType
    static function mime_to_ext($mime) {
        $mime_map = [
            'video/3gpp2'                                                               => '3g2',
            'video/3gp'                                                                 => '3gp',
            'video/3gpp'                                                                => '3gp',
            'application/x-compressed'                                                  => '7zip',
            'audio/x-acc'                                                               => 'aac',
            'audio/ac3'                                                                 => 'ac3',
            'application/postscript'                                                    => 'ai',
            'audio/x-aiff'                                                              => 'aif',
            'audio/aiff'                                                                => 'aif',
            'audio/x-au'                                                                => 'au',
            'video/x-msvideo'                                                           => 'avi',
            'video/msvideo'                                                             => 'avi',
            'video/avi'                                                                 => 'avi',
            'application/x-troff-msvideo'                                               => 'avi',
            'application/macbinary'                                                     => 'bin',
            'application/mac-binary'                                                    => 'bin',
            'application/x-binary'                                                      => 'bin',
            'application/x-macbinary'                                                   => 'bin',
            'image/bmp'                                                                 => 'bmp',
            'image/x-bmp'                                                               => 'bmp',
            'image/x-bitmap'                                                            => 'bmp',
            'image/x-xbitmap'                                                           => 'bmp',
            'image/x-win-bitmap'                                                        => 'bmp',
            'image/x-windows-bmp'                                                       => 'bmp',
            'image/ms-bmp'                                                              => 'bmp',
            'image/x-ms-bmp'                                                            => 'bmp',
            'application/bmp'                                                           => 'bmp',
            'application/x-bmp'                                                         => 'bmp',
            'application/x-win-bitmap'                                                  => 'bmp',
            'application/cdr'                                                           => 'cdr',
            'application/coreldraw'                                                     => 'cdr',
            'application/x-cdr'                                                         => 'cdr',
            'application/x-coreldraw'                                                   => 'cdr',
            'image/cdr'                                                                 => 'cdr',
            'image/x-cdr'                                                               => 'cdr',
            'zz-application/zz-winassoc-cdr'                                            => 'cdr',
            'application/mac-compactpro'                                                => 'cpt',
            'application/pkix-crl'                                                      => 'crl',
            'application/pkcs-crl'                                                      => 'crl',
            'application/x-x509-ca-cert'                                                => 'crt',
            'application/pkix-cert'                                                     => 'crt',
            'text/css'                                                                  => 'css',
            'text/x-comma-separated-values'                                             => 'csv',
            'text/comma-separated-values'                                               => 'csv',
            'application/vnd.msexcel'                                                   => 'csv',
            'application/x-director'                                                    => 'dcr',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'   => 'docx',
            'application/x-dvi'                                                         => 'dvi',
            'message/rfc822'                                                            => 'eml',
            'application/x-msdownload'                                                  => 'exe',
            'video/x-f4v'                                                               => 'f4v',
            'audio/x-flac'                                                              => 'flac',
            'video/x-flv'                                                               => 'flv',
            'image/gif'                                                                 => 'gif',
            'application/gpg-keys'                                                      => 'gpg',
            'application/x-gtar'                                                        => 'gtar',
            'application/x-gzip'                                                        => 'gzip',
            'application/mac-binhex40'                                                  => 'hqx',
            'application/mac-binhex'                                                    => 'hqx',
            'application/x-binhex40'                                                    => 'hqx',
            'application/x-mac-binhex40'                                                => 'hqx',
            'text/html'                                                                 => 'html',
            'image/x-icon'                                                              => 'ico',
            'image/x-ico'                                                               => 'ico',
            'image/vnd.microsoft.icon'                                                  => 'ico',
            'text/calendar'                                                             => 'ics',
            'application/java-archive'                                                  => 'jar',
            'application/x-java-application'                                            => 'jar',
            'application/x-jar'                                                         => 'jar',
            'image/jp2'                                                                 => 'jp2',
            'video/mj2'                                                                 => 'jp2',
            'image/jpx'                                                                 => 'jp2',
            'image/jpm'                                                                 => 'jp2',
            'image/jpeg'                                                                => 'jpeg',
            'image/pjpeg'                                                               => 'jpeg',
            'application/x-javascript'                                                  => 'js',
            'application/json'                                                          => 'json',
            'text/json'                                                                 => 'json',
            'application/vnd.google-earth.kml+xml'                                      => 'kml',
            'application/vnd.google-earth.kmz'                                          => 'kmz',
            'text/x-log'                                                                => 'log',
            'audio/x-m4a'                                                               => 'm4a',
            'audio/mp4'                                                                 => 'm4a',
            'application/vnd.mpegurl'                                                   => 'm4u',
            'audio/midi'                                                                => 'mid',
            'application/vnd.mif'                                                       => 'mif',
            'video/quicktime'                                                           => 'mov',
            'video/x-sgi-movie'                                                         => 'movie',
            'audio/mpeg'                                                                => 'mp3',
            'audio/mpg'                                                                 => 'mp3',
            'audio/mpeg3'                                                               => 'mp3',
            'audio/mp3'                                                                 => 'mp3',
            'video/mp4'                                                                 => 'mp4',
            'video/mpeg'                                                                => 'mpeg',
            'application/oda'                                                           => 'oda',
            'audio/ogg'                                                                 => 'ogg',
            'video/ogg'                                                                 => 'ogg',
            'application/ogg'                                                           => 'ogg',
            'font/otf'                                                                  => 'otf',
            'application/x-pkcs10'                                                      => 'p10',
            'application/pkcs10'                                                        => 'p10',
            'application/x-pkcs12'                                                      => 'p12',
            'application/x-pkcs7-signature'                                             => 'p7a',
            'application/pkcs7-mime'                                                    => 'p7c',
            'application/x-pkcs7-mime'                                                  => 'p7c',
            'application/x-pkcs7-certreqresp'                                           => 'p7r',
            'application/pkcs7-signature'                                               => 'p7s',
            'application/pdf'                                                           => 'pdf',
            'application/octet-stream'                                                  => 'pdf',
            'application/x-x509-user-cert'                                              => 'pem',
            'application/x-pem-file'                                                    => 'pem',
            'application/pgp'                                                           => 'pgp',
            'application/x-httpd-php'                                                   => 'php',
            'application/php'                                                           => 'php',
            'application/x-php'                                                         => 'php',
            'text/php'                                                                  => 'php',
            'text/x-php'                                                                => 'php',
            'application/x-httpd-php-source'                                            => 'php',
            'image/png'                                                                 => 'png',
            'image/x-png'                                                               => 'png',
            'application/powerpoint'                                                    => 'ppt',
            'application/vnd.ms-powerpoint'                                             => 'ppt',
            'application/vnd.ms-office'                                                 => 'ppt',
            'application/msword'                                                        => 'doc',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation' => 'pptx',
            'application/x-photoshop'                                                   => 'psd',
            'image/vnd.adobe.photoshop'                                                 => 'psd',
            'audio/x-realaudio'                                                         => 'ra',
            'audio/x-pn-realaudio'                                                      => 'ram',
            'application/x-rar'                                                         => 'rar',
            'application/rar'                                                           => 'rar',
            'application/x-rar-compressed'                                              => 'rar',
            'audio/x-pn-realaudio-plugin'                                               => 'rpm',
            'application/x-pkcs7'                                                       => 'rsa',
            'text/rtf'                                                                  => 'rtf',
            'text/richtext'                                                             => 'rtx',
            'video/vnd.rn-realvideo'                                                    => 'rv',
            'application/x-stuffit'                                                     => 'sit',
            'application/smil'                                                          => 'smil',
            'text/srt'                                                                  => 'srt',
            'image/svg+xml'                                                             => 'svg',
            'application/x-shockwave-flash'                                             => 'swf',
            'application/x-tar'                                                         => 'tar',
            'application/x-gzip-compressed'                                             => 'tgz',
            'image/tiff'                                                                => 'tiff',
            'font/ttf'                                                                  => 'ttf',
            'text/plain'                                                                => 'txt',
            'text/x-vcard'                                                              => 'vcf',
            'application/videolan'                                                      => 'vlc',
            'text/vtt'                                                                  => 'vtt',
            'audio/x-wav'                                                               => 'wav',
            'audio/wave'                                                                => 'wav',
            'audio/wav'                                                                 => 'wav',
            'application/wbxml'                                                         => 'wbxml',
            'video/webm'                                                                => 'webm',
            'image/webp'                                                                => 'webp',
            'audio/x-ms-wma'                                                            => 'wma',
            'application/wmlc'                                                          => 'wmlc',
            'video/x-ms-wmv'                                                            => 'wmv',
            'video/x-ms-asf'                                                            => 'wmv',
            'font/woff'                                                                 => 'woff',
            'font/woff2'                                                                => 'woff2',
            'application/xhtml+xml'                                                     => 'xhtml',
            'application/excel'                                                         => 'xl',
            'application/msexcel'                                                       => 'xls',
            'application/x-msexcel'                                                     => 'xls',
            'application/x-ms-excel'                                                    => 'xls',
            'application/x-excel'                                                       => 'xls',
            'application/x-dos_ms_excel'                                                => 'xls',
            'application/xls'                                                           => 'xls',
            'application/x-xls'                                                         => 'xls',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'         => 'xlsx',
            'application/vnd.ms-excel'                                                  => 'xlsx',
            'application/xml'                                                           => 'xml',
            'text/xml'                                                                  => 'xml',
            'text/xsl'                                                                  => 'xsl',
            'application/xspf+xml'                                                      => 'xspf',
            'application/x-compress'                                                    => 'z',
            'application/x-zip'                                                         => 'zip',
            'application/zip'                                                           => 'zip',
            'application/x-zip-compressed'                                              => 'zip',
            'application/s-compressed'                                                  => 'zip',
            'multipart/x-zip'                                                           => 'zip',
            'text/x-scriptzsh'                                                          => 'zsh',
        ];

        return isset($mime_map[$mime]) ? $mime_map[$mime] : false;
    }
}
