<?php

namespace App\Models;
//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;

use DB;
use App\Models\DV;
use App\Services\Umt\AuthService;
use Exception;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\Log;

class PublicStorage //extends Model
{
    //use HasFactory;
    protected static $allowed_image_extensions = ['jpg','png','jpeg','gif','heif','bmp','webp','svg'];
    protected static $allowed_doc_extensions = ['docx','pdf','txt','xls','doc','xlsx','csv','dat'];
    protected static $allowed_audio_extensions = [
        'mp3',
        'wav',
        'm4a',
        'ogg',
    ];

    protected static $mimeTypes = [
        'm4a'=>'audio/m4a',
        'mp4'=>'audio/mp4',
        'mp3'=>'audio/mpeg',
        'wav'=>'audio/wav',
        'ogg'=>'audio/ogg',
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

    static function isAudio($ext){
        return in_array(strtolower($ext? $ext:""),self::$allowed_audio_extensions);
    }

    /** get subscription from a given branch_id or $ss (user info) */
    static function getSubs($branch_id = null) {
        if(!$branch_id) return (object)['id'=>null,'customer_id'=>null];
        // Check if $branch_id is a number
        if (is_numeric($branch_id)) {
            if ($branch_id > 0) {
                $current_user = AuthService::user();
                if (!$current_user) {
                    if ($branch_id) {
                        $cols_subs_id = DBX::getHEX('id','id');
                        $col_customer_id = DBX::getHEX('customer_id','customer_id');
                        $bin_subs_id = DB::table('um_branches as b')->where('id', $branch_id)->selectRaw($cols_subs_id.','.$col_customer_id);
                        if ($bin_subs_id) return bin2hex($bin_subs_id);
                    }
                    return (object)['id'=>null,'customer_id'=>null];
                }
                return $current_user;
            } else {
                return (object)['id'=>null,'customer_id'=>null];
            }
        } else {
            // Assume $branch_id is an object with a subs_id property
            return $branch_id;
        }
    }

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
       return isset(self::$mimeTypes[$ext]) ?? null;
    }

    static function getExtensionFromMIMEType($mimeType=null){
            if(!$mimeType) return null;
            $key = array_search($mimeType,self::$mimeTypes);
            $k = explode('?',$key);
            if($k) $k = $k[0];
            return $k?$k:$mimeType;
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

    static function makeFile($file_type,$fileName, $fileContent){
                $file_type = trim(strtolower($file_type));
                $result = (object)array('error'=>null,'filename'=>null);

                $ext = pathinfo($fileName,PATHINFO_EXTENSION);
                $ext = strtolower($ext?$ext:'');
                $mime_type = self::getMIMETypeFromExtension($ext);
                if(!$mime_type){
                   return DV::error("File MIME type is not valid");
                }

                $dir = dirname($fileName);
                if (!file_exists($dir)) {
                    mkdir($dir, 0755, true); //permission
                }

                # Decode the Base64 string, making sure that it contains only valid characters
                $bin = base64_decode($fileContent, true);
                $test = base64_encode($bin);
                if ($test != $fileContent) {
                   return DV::error("Invalid file content. Base64 data is expected");
                }

                # Perform a basic validation to make sure that the result is a valid PDF file
                # Be aware! The magic number (file signature) is not 100% reliable solution to validate PDF files
                # Moreover, if you get Base64 from an untrusted source, you must sanitize the PDF contents

                if ($ext==='pdf'){
                    if (strpos($bin, '%PDF')  != 0 )
                    {
                        return DV::error("This pdf file does not have PDF file signature");
                    }
                }
                $success = file_put_contents($fileName, $bin);
                $result->status ='OK';
                $result->extension= $ext;
                $result->file_type = $ext;
                $result->file_name = $fileName;
                $result->mime_type = $mime_type;
                return (object)$result;
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

    /** now $ss can be branch_id or $ss that include subs_id, branch_id*/
    static function getUrl($pathInfo, $category =null){
        $path =  is_object($pathInfo)? $pathInfo : (Object)$pathInfo;
        $subs_id = $path->subs_id ?? (getCurrentSubsId(true) ?? 'NO_SUBSCRIPTION');
        $branch_id = $path->branch_id ?? null;
        $dir_name = $path->dir ?? ($path->dir_name ?? null);
        $dir_name = $dir_name? '/'.$dir_name : '';
        $category = self::getSpecificFolder($category);
        $dir_branch = $branch_id? "/$branch_id".'_data':'';
        return url('').'/uploads/public/'.$subs_id.$dir_branch.$dir_name.$category;
    }

    static function getSpecificFolder($category ="image"){
        if ($category ==='image'){
            return '/images/';
        }else if($category ==='document'){
            return '/documents/';
        }else if ($category){
             return '/'.$category.'/';
        }
        return '';
    }

    // static function getDiskPath_v1($ss,$user_class,$upload_type="document"){
    //     $subs = self::getSubs($ss);
    //     $subs_id = $subs->id;
    //     $dir_branch_id ='';
    //     $branch_id = 1;
    //     if($branch_id) $dir_branch_id ='/'.$branch_id.'_data/';
    //    return getcwd(). '/uploads/public/'.$subs_id.$dir_branch_id.'/'.self::getSpecificFolder($user_class,$upload_type);
    // }

    /** $path = {$subs_id,$branch_id,$dir_name} */
    static function getDiskPath($pathInfo,$category="document"){
        $path = (Object)$pathInfo;
        $subs_id = $path->subs_id ?? (getCurrentSubsId(true) ?? 'NO_SUBSCRIPTION');
        $branch_id = $path->branch_id ?? 0;
        $dir_name = $path->dir ?? ($path->dir_name ?? null);
        $dir_branch_id ='';
        if($branch_id) $dir_branch_id = '/'.$branch_id.'_data';
        if($dir_name) $dir_name = '/'.$dir_name;
        if($category ==='image') $category ='/images/';
        else if($category ==='document') $category ='/documents/';
        else if($category ==='audio') $category ='/audio/';
        else if($category) $category ='/'.$category.'/';
        return getcwd(). '/uploads/public/'.$subs_id.$dir_branch_id.$dir_name.$category;
       // self::getSpecificFolder($dir_name,$category);
    }

    //create a full-path including random file name,and return object = {path,file_name,extension}
    static function createFullPath($pathInfo,$category,$ext){
        $path = (Object)$pathInfo;
        $branch_id = $path->branch_id ?? '0';
        $file_name = $branch_id."_file_".uniqid($branch_id).date('Ymd_hms').".".$ext;
        $dir_path = self::getDiskPath($path,$category);
        if (!file_exists($dir_path)) {
           mkdir($dir_path, 0777, true);
        }
        $dir_path = rtrim($dir_path, '/') . '/' . $file_name;
        return (object)[
         'path'=>$dir_path,
         'file_name'=>$file_name,
         'extension'=>$ext
        ];
     }

   /** $path = {subs_id,branch_id,dir_name }*/
   static function delete($path,$category,$file_name){
        $file = self::getDiskPath($path,$category).$file_name;
        return self::deleteFile($file);
   }

    /** $path = {subs_id,branch_id,dir_name }*/
    protected static function createFile($path,$file_type,$fileContent,$file_name = null,$category="document"){
        $branch_id = $path->branch_id ?? 0;
        if(empty($file_name)) $file_name = $branch_id."_file_".uniqid($branch_id).date('Ymd_hms');
        $filePath = self::getDiskPath($path,$category).$file_name;
        return self::makeFile($file_type,$filePath,$fileContent);
    }

    static function isBinary($string)
    {
        return preg_match('~[^\x20-\x7E\t\r\n]~', $string) > 0;
    }

    static function getValueType($value){
        if (is_numeric($value)) return "number";
        else if (self::isBinary($value)) return "binary";
        else if (is_string($value)) return "string";
        else return null;
    }

 //$storeInfo = ['branch_id'=>25,"store"=>"tablename.col_name"]
 protected static function saveFileName_db($path,$file_name,$category,$storeInfo=null)
 {
    if(!$storeInfo) return;
    if (!is_object($path)) $path = (Object)$path;
    $subs_id = $path->subs_id ?? null;
    $branch_id = $path->branch_id ?? 0;
    $dir_name = $path->dir ?? ($path->dir_name ?? null);
    $store =  $storeInfo['store'] ?? null;
    if(!$store){
        Log::error('Error in PublicStorage::saveFileName_db(sub_id:'.$subs_id.', branch_id:'.$branch_id.', user_class: \''.$dir_name.'\', file_name: \''.$file_name.'\', storeInfo)');
        Log::info('Hint: This usually occur when invalid $storeInfo. Make sure: $storeInfo is, for example, '."['id'=>1090,'store'=>'table_name.col_name']");
        return;
    }
    $sts = explode('.',$store);
    $target_table = $sts[0];
    $target_col = $sts[1];
    $key_found = false;
    $id_field = null;
    $id_value = null;
    $id =  $storeInfo['id'] ?? null;
    $value_type =null;
    if($id)
      {
        $id_field = 'id';
        $id_value = $id;
        $value_type = self::getValueType($id_value);
        $key_found = true;
      }
    else{
        // Access the first key-value pair efficiently
        reset($storeInfo); // Move the internal pointer to the first element
        $id_field = key($storeInfo);
        $id_value = current($storeInfo);
        if (!is_string($id_field)){
            Log::error('Error in PublicStorage::saveFileName_db(). The $store = ["id_field_name"=>"key_value", "store"=>"table_name.col_name"]');
            return;
        }
        $value_type = self::getValueType($id_value);
        if ($value_type){
            Log::error('Error in PublicStorage::saveFileName_db(). The $store = ["id_field_name"=>"key_value", "store"=>"table_name.col_name"]');
            return;
        }
        $key_found = true;
        // $is_binary_key = self::isBinary($id);
    }

    if (!$value_type || !$key_found)
    {
        Log::error('Error in PublicStorage::saveFileName_db(). The $store = ["id_field_name"=>"key_value", "store"=>"table_name.col_name"]');
        return;
    }
     if($target_table && $target_col){
        $row = DB::table($target_table)->where($id_field,$id_value)->select([$target_col])->first();
            if($row){
                $prev_file_name = $row->$target_col;
                $file= self::getDiskPath($path,$category).$prev_file_name;
                //delete previous picture file
                self::deleteFile($file);
            }
         DB::table($target_table)->where($id_field,$id_value)->update([$target_col=>$file_name]);
       }
  return;
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

static function saveAudio($path, $ext, $base64, $maxSize = 500000, $store = [])
{
    $ext = $ext?$ext:'m4a';
    if (self::isBase64Audio($base64)) {
        // Create the full path for the audio file
        $p = self::createFullPath($path , 'audio', $ext);

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
            $error = $f_res->error_message ?? null;
            // Save the file name in the database
            if(!$error)
            {
                if($store) self::saveFileName_db($path, $p->file_name, 'audio',$store);
                // Get the audio file URL using getUrl() function
                $audio_url = self::getUrl(  $path, 'audio') . $p->file_name;
                // Return the response object
                return (object)[
                    'status' => 'OK',
                    'status_code'=>200, //This status_code is VERY IMPORTANT for api call to frontend
                    'file_name' => $p->file_name,
                    'file_type' => $p->extension,
                    'ext' => $p->extension,
                    'extension' => $p->extension,
                    'audio_url' => $audio_url,
                ];
            }else return DV::error($error);

        // } catch (\Exception $e) {
        //     return (object)['error_message' => $e->getMessage(), 'status' => 'Error'];
        // }

    }

    return (object)['error_message' => "The given file type is not a valid audio format", 'status' => 'Error'];
 }

//NOTE: saveImage() will create image file based on the given base64 string
//savePhoto() | saveFile()
static function saveImage($path,$ext,$image_or_base64,$maxSize=500000,$store=[]){
    $ext = $ext ?? "png";
    if(self::isImage($ext)){
        $p = self::createFullPath( $path,'image',$ext);
        if ($image_or_base64 instanceof Image){
            try{
                //Through this senario, it means the $file_content is instance of Intervention/Image class and has been compressed to, by default, 500 KB
                $image_or_base64->save($p->path);
                self::saveFileName_db($path,$p->file_name,'image',$store);
                return (object)['status_code'=>200,'status'=>'OK','file_name'=>$p->file_name,'file_type'=>$p->extension,'ext'=>$p->extension,'extension'=>$p->extension,'image_url'=>self::getUrl($$path,'image').$p->file_name];
            }catch(\Exception $e){
                Log::error($e->getMessage());
                Log::error($e->getTraceAsString());
                return (object)['error_message'=>'Some problem occured during image saving. See log file','status'=>'Error'];
            }
        }

        try {
            //compress image size to, by default 500 KB
            $mx = resizeImage_base64($image_or_base64,$maxSize);
            if($mx->error) return (object)['error_message'=>$mx->error,'status'=>'Error'];
            $mx->image->save($p->path);
            self::saveFileName_db($path,$p->file_name,'image',$store);
            return (object)['status_code'=>200,'status'=>'OK','file_name'=>$p->file_name,'file_type'=>$p->extension,'ext'=>$p->extension,'extension'=>$p->extension,'image_url'=>self::getUrl($path,'image').$p->file_name];
            // Do something with the image
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            Log::error($e->getTraceAsString());
            if($e instanceof \Intervention\Image\Exception\NotReadableException)
               return (object)['error_message'=>$e->getMessage(),'status'=>'Error'];
            else if($e instanceof \Intervention\Image\Exception\NotWritableException)
               return (object)['error_message'=>$e->getMessage(),'status'=>'Error'];
            else return (object)['error_message'=>$e->getMessage(),'status'=>'Error'];
        }
        }
        return (object)['status'=>'error','status_code'=>405,'error_message'=>"The given file type is not valid image format",'status'=>'Error'];
    }

        static function isImage($ext){
            return in_array(strtolower($ext? $ext:""),self::$allowed_image_extensions);
        }

     static function savefile($path,$ext,$file_content,$category ='image'){
        $branch_id = $path->branch_id ?? 0;
        $allowed_exts = [];
        if ($category ==='document') $allowed_exts = self::$allowed_doc_extensions;
        else if ($category ==='image')  $allowed_exts = self::$allowed_image_extensions;

        $ext = self::getExtensionFromMIMEType($ext);
        $mime_type = self::getMIMETypeFromExtension($ext);
        if(!$mime_type) return DV::error("There is no matching MIME type for file .$ext");
        
        if (!in_array($ext,$allowed_exts)){
            $file_exts = implode(',',$allowed_exts);
            return DV::error("File type is not allowed. Allowed file types are $file_exts. The provided file type is ".($ext? $ext:"empty"));
        }


        if (!$ext) return DV::error("Invalid file type or mime type ");

        $file_name = $branch_id."_".uniqid()."_".date('Ymd_hms').".$ext";
        $full_path = self::getDiskPath($path,$category).$file_name;
        $mErr = self::makeFile($ext,$full_path,$file_content);
        if($mErr->status =='Error')  {
           return DV::error($mErr->error_message);
        } else {
            return DV::success(["file_name"=>$file_name,"file_type"=>$ext,"mime_type"=>$mime_type]);
        }
    }

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
