<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Session;
use DB;
use App\Models\DV;
use Carbon\Carbon;
use Exception;

class PublicStorage extends Model
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
                    $result->error= "File MIME type is not valid";
                    return $result;
                }

                $dir = dirname($fileName);
                if (!file_exists($dir)) {
                    mkdir($dir, 0755, true); //permission
                }

                
               
                    
                    
                
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
   
    static function getUrl($branch_id,$user_class,$upload_type){
        return url('')."/uploads/public/".$branch_id."_data/".self::getSpecificFolder($user_class,$upload_type);
    }

    static function getSpecificFolder($user_class,$upload_type ="document"){
        $folder_name ="general";
        if($user_class =='person') 
           $folder_name ="person";
        else if ($user_class =="loan")
           $folder_name ="loan";
        else // $user_class ='general' or else
           $folder_name ="general";
        if ($upload_type =="image" || $upload_type =="photo")   
          return $folder_name."/images/";
        else
          return $folder_name."/documents/";
    }

    static function getDiskPath($branch_id,$user_class,$upload_type="document"){
       return getcwd(). '/uploads/public/'.$branch_id.'_data/'.self::getSpecificFolder($user_class,$upload_type);
    }

    static function createFile($branch_id,$user_class,$file_type,$file_name = null,$upload_type="document"){
        if(empty($file_name)) $file_name = $branch_id."_file_".uniqid($branch_id).date('Ymd_hms');
        $filePath = self::getDiskPath($branch_id,$user_class,$upload_type).$file_name;
        return self::makeFile($file_type,$filePath,$fileContent);
    }
   
    static function saveImage($branch_id, $user_class,$ext,$file_content){
        return self::savefile($branch_id, $user_class,$ext,$file_content,'image');
    }

     static function savefile($branch_id, $user_class,$ext,$file_content,$category ='image'){
        $result = (object)array('error_message'=>null,'status'=>'OK');
        
        $allowed_exts = ['pdf','docx','doc','txt','xlsx','xls','csv','jpg','png','jpeg','gif','svg'];
        if ($category ==='document') $allowed_exts = ['pdf','docs','doc','txt','xlsx','xls','csv'];
        else if ($category ==='image')  $allowed_exts = ['jpg','png','jpeg','gif','svg'];
 
        if (!$branch_id) return DV::error("Failed to upload file due to invalid company identity");
         
        $ext = self::getExtensionFromMIMEType($ext);
        $mime_type = self::getMIMETypeFromExtension($ext);
        if(!$mime_type) return DV::error("There is no matching MIME type for file .$ext");

        if (!in_array($ext,$allowed_exts)){
            $file_exts = implode(',',$allowed_exts); 
            return DV::error("File type is not allowed. Allowed file types are $file_exts. The provided file type is ".($ext? $ext:"empty"));
        }
        
        if (!$ext) return DV::error("Invalid file type or mime type "); 
  
        $file_name = $branch_id."_".uniqid()."_".date('Ymd_hms').".$ext";
        $full_path = self::getDiskPath($branch_id,$user_class,$category).$file_name;
        $mErr = self::makeFile($ext,$full_path,$file_content);
        if($mErr->error)  {
           return DV::error($mErr->error);
        } else {
            return DV::success(["file_name"=>$file_name,"file_type"=>$ext,"mime_type"=>$mime_type]);
        }
    }


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


   static function saveMerchantProfilePhoto($branch_id,$sender_id,$file_type,$file_content){
        $result = (object)array('error_message'=>null,'status'=>'OK');
        $fileTypes = ['jpg','png','jpeg'];
        
        if (!$branch_id){
            $result->error_message = "Failed to upload file due to invalid company identity";
            $result->status ='Error';
            return $result;
        }
  
        if (!in_array($file_type,$fileTypes)){
            $result->error_message = "Photo file type is not allowed. Allowed file type are png, jpg,jpeg";
            $result->status ='Error';
            return $result;
        }
        $ext = $file_type; //self::mime_to_ext($file_type);

        if (!$ext){
            $result->error_message = "Invalid file type or mime type ";
            $result->status ='Error';
            return $result;
        }
  
        $file_name = $branch_id."_merchant_photo_".uniqid($branch_id).date('Ymd_hms');

        $full_path = self::getDiskPath($branch_id,'merchant','image').$file_name;
        $mErr = self::makeFile($file_type,$full_path,$file_content);

        if (!$mErr->error){
            $rows = DB::table('sender')->where('branch_id',$branch_id)->where('id',$sender_id)->selectRaw('photo_file_name')->limit(1)->get();  
            foreach($rows as $row) {
                if(!empty($row->photo_file_name)){
                    $del_path = self::getDiskPath($branch_id,'merchant','image').$row->photo_file_name;
                    $del_err = self::deleteFile($del_path);
                }
            }
            $file_name .=".".$ext; 
            DB::table('sender')->where('branch_id',$branch_id)->where('id',$sender_id)->update(array('photo_file_type'=>$file_type,'photo_file_name'=>$file_name));
            $result->error_message =null;
            $result->status ='OK'; 
        }else{
            $result->error_message = $mErr->error;
            $result->status ='Error';
            return $result;
        }
   }
   
   static function saveDriverProfilePhoto($branch_id,$driver_id,$file_type,$file_content){
    $result = (object)array('error_message'=>null,'status'=>'OK');
    $fileTypes = ['jpg','png','jpeg','svg'];
    
    if (!$branch_id){
        $result->error_message = "Failed to upload file due to invalid company identity";
        $result->status ='Error';
        return $result;
    }

    if (!in_array($file_type,$fileTypes)){
        $result->error_message = "Photo file type is not allowed!";
        $result->status ='Error';
        return $result;
    }
        $file_name = $branch_id."_driver_profile_".date('Ymd_hms');
        $ext= $file_type;
        if (!$ext){
            $result->error_message = "Invalid file type or mime type";
            $result->status ='Error';
            return $result;
        }

        $file_name .= ".".$file_type; 
        $full_path = self::getDiskPath($branch_id,'driver','image').$file_name;
        
        $mErr = self::makeFile($file_type,$full_path,$file_content);
        if(!$mErr->error){
            $rows = DB::table('driver')->where('branch_id',$branch_id)->where('id',$driver_id)->selectRaw('photo_file_name')->limit(1)->get();  
            foreach($rows as $row) {
                if(!empty($row->photo_file_name)){
                    $del_path = self::getDiskPath($branch_id,'driver','image').$row->photo_file_name;
                    self::deleteFile($del_path);
                }
            }
            $file_name .=".".$ext;
            DB::table('driver')->where('branch_id',$branch_id)->where('id',$driver_id)->update(array('photo_file_type'=>$file_type,'photo_file_name'=>$file_name));
            $result->error_message =null;
            $result->status ='OK'; 
        }else {
            $result->error_message = $mErr->error;
            $result->status ='Error';
            return $result;
        } 
 
   }

    static function getProfilePhoto($branch_id,$person_id){
        $rows = DB::table('persons')->where('branch_id',$branch_id)->where('id',$person_id)->selectRaw('photo_file_name,photo_file_type')->limit(1)->get();
        foreach($rows as $row)
        {
            $full_path = self::getDiskPath($branch_id,'person','image').$row->photo_file_name;
            $content = self::readFileContent($full_path);   
            $p = "data".getEncodedChar(':')."image".getEncodedChar("/").$row->photo_file_type.";"."base64".getEncodedChar(',');
            return  "data:image/jpg;base64,".base64_encode($content);
        }
        return null;
    }
   
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
