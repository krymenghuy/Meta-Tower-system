<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

//use App\Models\Notifier;
//use Storage;
use Session;
use DB;
use App\Models\DV;
use Carbon\Carbon;
use Exception;

class PublicStorage extends Model
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
                    $result->error= "Invalid file content. Base64 data is expected";
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



    //upload_type is category = {'image','document'}
    static function getUrl($branch_id,$user_class,$upload_type){
        return url('')."/uploads/public/".$branch_id."_data/".self::getSpecificFolder($user_class,$upload_type);
    }

    //returns specific folder such as "merchant/images" or "merchant/documents" depending on $user_class and $upload_type
    //@user_class = {merchant,driver,general}
    static function getSpecificFolder($user_class,$upload_type ="document"){
        $folder_name ="driver";
        if($user_class =='merchant' || $user_class =='sender') 
           $folder_name ="merchant";
        else if ($user_class =="customer" || $user_class =="general")
           $folder_name ="customer";
        else // $user_class ='general' or else
           $folder_name ="general";
        if ($upload_type =="image" || $upload_type =="photo")   
          return $folder_name."/images/";
        else
          return $folder_name."/documents/";
    }

    //getPath() || getDiskPath()
    static function getDiskPath($branch_id,$user_class,$upload_type="document"){
       return getcwd(). '/uploads/public/'.$branch_id.'_data/'.self::getSpecificFolder($user_class,$upload_type);
    }

    //$upload_type = {'image','document'}
    static function createFile($branch_id,$user_class,$file_type,$file_name = null,$upload_type="document"){
        //Auto create file name, if filename not supplied
        if(empty($file_name)) $file_name = $branch_id."_".unqueid()."_".date('Ymd_hms');

        $filePath = self::getDiskPath($branch_id,$user_class,$upload_type).$file_name;
        return self::makeFile($file_type,$filePath,$fileContent);
    }
   
    //savePhoto() | saveFile()
    static function saveImage($branch_id, $user_class,$file_type,$file_content){
        $result = (object)array('error_message'=>null,'status'=>'OK');
        $fileTypes = ['jpg','png','jpeg'];
        
        if (!$branch_id){
            return DV::error("Failed to upload file due to invalid company identity");
        }
  
        if (!in_array($file_type,$fileTypes)){
            return DV::error("Photo file type is not allowed. Allowed file type are png, jpg,jpeg");
        }
        $ext = $file_type; //self::mime_to_ext($file_type);

        if (!$ext){
            $result->error_message = "Invalid file type or mime type ";
            $result->status ='Error';
            return $result;
        }
  
        $file_name = $branch_id."_".uniqid()."_".date('Ymd_hms');
        $full_path = self::getDiskPath($branch_id,$user_class,'image').$file_name;
        $mErr = self::makeFile($file_type,$full_path,$file_content);
        if($mErr->error)  {
           return DV::error($mErr->error);
        } else {
            $file_name .=".".$file_type;
            return DV::success(["file_name"=>$file_name,"file_type"=>$file_type]);
        }
    }

    //return a object fileInfo = {'file_name','file_type'} by a given category
    //$category ={'merchant-profile-photo','merchant-img','merchant-doc','driver-profile-photo','driver-img','driver-doc'}
    static function getFileInfoByCategory($branch_id,$category,$id){
      if($category=='merchant-profile-photo')
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
  
        $file_name = $branch_id."_merchant_profile_".date('Ymd_hms');
        $full_path = self::getDiskPath($branch_id,'merchant','image').$file_name;
        $mErr = self::makeFile($file_type,$full_path,$file_content);

        if (!$mErr->error){
            $rows = DB::table('sender')->where('branch_id',$branch_id)->where('id',$sender_id)->selectRaw('photo_file_name')->limit(1)->get();  
            //todo: detect for error when two users try to delete this file at same time
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
        //$ext = self::mime_to_ext($file_type);
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
            //todo: detect for error when two users try to delete this file at same time
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

   //return base64 content of image
    static function getMerchantProfilePhoto($branch_id,$sender_id){
        //$ss = getSessionInfo($d);
        //if(!$ss) return '#350'; //user not authenticated
        //if (!prn_allowed(2)) return '@'; //need permission to do this task
        //$sender_id = isset($d->sender_id)?$d->sender_id:null;   
        $rows = DB::table('sender')->where('branch_id',$branch_id)->where('id',$sender_id)->selectRaw('photo_file_name,photo_file_type')->limit(1)->get();
        foreach($rows as $row)
        {
            $full_path = self::getDiskPath($branch_id,'merchant','image').$row->photo_file_name;
            $content = self::readFileContent($full_path);   
            $p = "data".getEncodedChar(':')."image".getEncodedChar("/").$row->photo_file_type.";"."base64".getEncodedChar(',');
            //****Return for javascript client
            //return $p.base64_encode($content);
            //**** return direct from server
            return  "data:image/jpg;base64,".base64_encode($content);
        }
        return null;
    }

    //return base64 content of Driver profile photo
    static function getDriverProfilePhoto($branch_id,$driver_id){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task

        $driver_id = isset($d->driver_id)?$d->driver_id:null;   
        $rows = DB::table('driver AS d')->where('d.branch_id',$branch_id)->where('d.id',$driver_id)->selectRaw('photo_file_name,photo_file_type')->limit(1)->get();
        foreach($rows as $row)
        {
            $full_path = self::getDiskPath($branch_id,'driver','image').$row->photo_file_name;
            $content = self::readFileContent($full_path);   
            $p = "data".getEncodedChar(':')."image".getEncodedChar("/").$row->photo_file_type.";"."base64".getEncodedChar(',');
            //****Return for javascript client
            //return $p.base64_encode($content);
            //**** return direct from server
            return  "data:image/jpg;base64,".base64_encode($content);
        }
        return null;
    }

    static function getProfilePhoto_url($branch_id,$user_class,$official_id){
        if($user_class =='merchant' || $user_class =='sender') 
          return self::getMerchantProfilePhoto_url($branch_id,$official_id);
        else if ($user_class =='driver') 
          return self::getDriverProfilePhoto_url($branch_id,$official_id); 
        return null;
    }

    //retun publuc $url for merchant profile photo
    static function getMerchantProfilePhoto_url($branch_id,$sender_id){ 
        $rows = DB::table('sender AS d')->where('d.branch_id',$branch_id)->where('d.id',$sender_id)->selectRaw('photo_file_name,photo_file_type')->limit(1)->get();
        foreach($rows as $row) {
            if (empty($row->photo_file_name)) 
              return null;
            else
               return self::getUrl($branch_id,'merchant','image').$row->photo_file_name; 
        } 
        return $sender_id;
    }

    static function getDriverProfilePhoto_url($branch_id,$driver_id){
        $rows = DB::table('driver AS d')->where('d.branch_id',$branch_id)->where('d.id',$driver_id)->selectRaw('photo_file_name,photo_file_type')->limit(1)->get();
        foreach($rows as $row){
            if (empty($row->photo_file_name)){
               return null;
            }else return self::getUrl($branch_id,'driver','image').$row->photo_file_name; 
        }  
        return null;
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

    //return transaction's field value by a given field name 
    static function getTransactionProp($trx_type,$trx_id, $prop){
        $trx_type = strtolower($trx_type);
        $table =null;
        if($trx_type ==='disbursement'){
             $table = "cash_disbursements";
        }else if ($trx_type ==='receipt') {
            $table = "cash_receipts";
        }
        if (!$table) return null;  
        $rows = DB::table($table)->where('id',$trx_id)->selectRaw($prop)->limit(1)->get();
        foreach($rows as $row) return $row->{$prop};
        return null;
    }  
}
