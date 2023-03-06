<?php
namespace App\StyleManagement;
use App\StyleManagement\StyleProvider;
//use App\StyleManagement\Minifier;

class StyleManager{
    // function __construct(){
        
    // }

    // function __destruct(){
    //     return null;
    // }

    // static function getBaseUrl(){
    //     $server_name = $_SERVER['SERVER_NAME'];
    //     $protocol = stripos($_SERVER['SERVER_PROTOCOL'],'https') === 0 ? 'https://' : 'http://';
    //     return $protocol.$server_name;
    // }
   
    //remove comments and spaces from css style
    //NOTE: $buffer is css content
    static function minify_css($buffer ="") {
		   // Remove comments
            $buffer = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $buffer);

            // Remove space after colons
            $buffer = str_replace(': ', ':', $buffer);

            // Remove whitespace
            $buffer = str_replace(array("\r\n", "\r", "\n", "\t", '  ', '    ', '    '), '', $buffer);
            $buffer = str_replace(array(";--",), '--', $buffer);
            return $buffer;
            // // Enable GZip encoding.
            // ob_start("ob_gzhandler");

            // // Enable caching
            // header('Cache-Control: public');

            // // Expire in one day
            // header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 86400) . ' GMT');

            // // Set the correct MIME type, because Apache won't set it for us
            // header("Content-type: text/css");

            // // Write everything out
            // echo($buffer);
	}

    //get_file_contens from url
    static function getFileContentFromUrl($url) {
        $ch = curl_init();
    
        curl_setopt($ch, CURLOPT_AUTOREFERER, TRUE);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_ENCODING, 0);
        curl_setopt($ch, CURLOPT_MAXREDIRS, 10);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST , "GET");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);  
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    
        $data = curl_exec($ch);
    
        $info = curl_getinfo($ch);
     
        if(curl_errno($ch)) {
            return (object)['status'=>'Error','error_message'=>"Failed to fectch url $url.Error: ".curl_error($ch)];
            //throw new Exception('Curl error: ' . curl_error($ch));
        }
    
        curl_close($ch);
    
        if ($data === FALSE) {
            return (object)['status'=>'Error','error_message'=>"Failed to fectch url $url. Info: ".$info];
            //throw new Exception("curl_exec returned FALSE. Info follows:\n" . print_r($info, TRUE));
        }
        return (object)['content'=>$data,'error_message'=>null,'status'=>'OK'];
    }

    static function downloadUrlToFile($url, $outFileName)
    {   
            if(is_file($url)) {
                copy($url, $outFileName); 
            } else {
               try{
                $options = array(
                    CURLOPT_FILE    => fopen($outFileName, 'w'),
                    CURLOPT_TIMEOUT =>  28800, // set this to 8 hours so we dont timeout on big files
                    CURLOPT_URL     => $url
                    );
    
                    $ch = curl_init();
                    curl_setopt_array($ch, $options);
                    curl_exec($ch);
                    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                    curl_close($ch);
                    return (object)['error_message'=>null,'info'=>$httpcode];
               }catch(Exception $e){
                 return (object)['error_message'=>$e->getMessage()." File: ".$outFileName,'status'=>'Error'];
               }
            }
    }

    protected static function createFile($content=null,$file_name=null,$ext =null){
        if (!$file_name) return (object)["status"=>"Error","error_message"=>"Error in createFile() method because parameter file_name is not supplied"];
        if (!$content) return (object)["status"=>"Error","error_message"=>"Cannot create file $file_name.$ext with NULL content"];
        $dir = dirname($file_name);
        //If file extension is Not supplied, get extention from $file_name
        if (!$ext) $ext = pathinfo($file_name, PATHINFO_EXTENSION);
        if (!file_exists($dir)) {
           mkdir($dir, 0755, true); //permission
            //$result->error = 'Storage file or folder does not exist';
            //return $result;
        }
        $ext = trim($ext?$ext:"");
        if (mb_substr($ext,0,1) !==".") $ext = ".$ext";
        if (substr($file_name,-strlen($ext)) !==$ext) $file_name .=$ext;
        $success = file_put_contents($file_name, $content);
        if (!$success) return  (object)["status"=>"Error","error_message"=>"Error creating file $file_name"];
        else return (object)['status'=>'OK','file_name'=>$file_name];
    }

    protected static function deleteFile($filePath){
        if (file_exists($filePath)) {
            unlink($filePath);
            return null;
         } else return "File not found for deleting"; 
    }

    protected static function getFileContent($fileName){
        if (empty($fileName)) return null;   
        if (!file_exists($fileName)) return null;
        $fileSize = filesize($fileName);
        if ($fileSize<=0) return null;
        $handle = fopen($fileName, "r");
        $contents = fread($handle, $fileSize);
        fclose($handle);
        return $contents;
    }

    static function is_cdn_file($path=''){
       return (substr(trim($path),0,5) =='http:' || substr(trim($path),0,6) =='https:');
    }

    static function combineFileContents($b=[]){
      $str = "";
      //contains last 10 chars of the latest combined script content
      $trailing_str="";

      $files = isset($b['files'])?$b['files']:[];
      $dir = getcwd();
      $excepts = $b? (isset($b['no-minify'])?$b['no-minify']:[]) :[];
      //NOTE that: each file path is  $dir.$f = "E:\LaravelApps\GTS/assets/material-js/jquery.min.js"
      // then we need to add directory called "public" to it => "E:\LaravelApps\GTS/public/assets/material-js/jquery.min.js"
      foreach($files as $f){
        $tmp_path = $dir."/public/".$f;
        $tmp_path = str_replace('//','/',$tmp_path);
        //Use method "explode" in ordder to exclude question mark "?", if any, from the $path string. NOTE: "?v=2" may be used for versioning and client cache control 
        $path = explode('?',$tmp_path)[0];
        $last_eight_chars = substr($f, strlen($f)-8,8);
 
        if (in_array($f,$excepts)){
            $content_last_char = mb_substr(trim($str), -1);
            $new_content = null;
            if (self::is_cdn_file($f))
            {
                $res = self::getFileContentFromUrl($f);
                //$path = $dir."/public/js/temp/".basename($f);
                //$res = self::downloadUrlToFile($f,$path);
                //$new_content = self::getFileContent($path);
                if ($res->error_message) return (object)['error'=>$res->error_message,"content"=>null];
                //just remove comments from js codes
                $new_content = self::minify_css($res->content);
            }
            else $new_content = self::minify_css(self::getFileContent($path));
            if (empty(trim($new_content))) return (object)['error'=>"Failed to fetch content from file $path","content"=>null]; 
            $str.= ($content_last_char=='}'? " " : " ").$new_content;
        }else {
            if ($last_eight_chars ==='.min.css')
            {
                $content_last_char = mb_substr(trim($str), -1);
                $new_content =null;
                if (self::is_cdn_file($f))
                {
                    $res = self::getFileContentFromUrl($f);
                    if ($res->error_message) return (object)['error'=>$res->error_message,"content"=>null];
                    $new_content = self::minify_css($res->content);
                }
                else $new_content = self::minify_css(self::getFileContent($path));

                if (empty(trim($new_content))) return (object)['error'=>"Failed to fetch content from file $path","content"=>null]; 
                $str.=($content_last_char=='}' ? " " : " ").$new_content;
            }    
            else{
                $content_last_char = mb_substr(trim($str), -1);
                //$str.= " ".self::minify_js(self::getFileContent($path),  ['flaggedComments' => false]);
                $new_content = null;
                if (self::is_cdn_file($f))
                {
                    $res = self::getFileContentFromUrl($f);
                    if ($res->error_message) return (object)['error'=>$res->error_message,"content"=>null];
                    $new_content = $res->content;
                }
                else $new_content = self::getFileContent($path);

                if (empty(trim($new_content)))  return (object)['error'=>"Failed to fetch content from file $path","content"=>null];
                $str.=($content_last_char=='}'? " " : " ").self::minify_css($new_content,  ['flaggedComments' => false]);
            }
        }
           
      }
      return (object)['content'=>$str,'error'=>null];
    }

    static function createBundleFileFromArray($b=[]){
        if(!$b) return (object)["status"=>"OK","file_name"=>null];
        if (!isset($b['output_file'])) return (object)["status"=>"OK","file_name"=>null];
        //base_path() gives the same result both on Local and on Hosted environment. It gives Root directory
        //always put script in public_path => "/public"
        $dir = public_path(); // getcwd();  // physical disk path to "public"
        //NOTE: $b['output_file'] should starts with "/" 
        $fpath = $dir."/".$b['output_file'];
        $fpath = str_replace("//","/",$fpath);
        if (file_exists($fpath))
         {
             $err = deleteFile($fpath);
             if ($err) return (object)["status"=>"Error","error_message"=>$err];
         }
      
        $res = self::combineFileContents($b);
        if($res->error) return (object)['status'=>'Error','error_message'=>$res->error];
        return self::createFile($res->content,$fpath,null);
    }

    static function createBundleFile($bundle_name){
       $b = StyleProvider::bundle($bundle_name);
       if(!$b) return (object)['status'=>'Error','error_message'=>"The script bundle named $bundle_name is not found!"];
       return self::createBundleFileFromArray($b);
       
    }
    
    static function createAllBundleFiles(){
        $bs = StyleProvider::getBundles();
        $files = []; 
        foreach($bs as $b){
            $res = self::createBundleFileFromArray($b);
            if ($res->status ==='Error') return $res; else   $files[] = $res->file_name;
        }
        return (object)['status'=>'OK','files'=>$files];
    }

    //getPublicDirectory() return empty string on Local or Development environment.
    //On Hosting environment, it returns "public" that is directory name.
    //This function depends on getCWD(), which returns root directory on Hosting environment, and it returns public_path on Hosting Local environment
    static function getPublicDirectory(){
        $working_dir = getcwd();//public
        $public_dir = substr($working_dir,-7);
        $public_dir=$public_dir?$public_dir:'';

        if ($public_dir ==='public\\' || $public_dir ==='\\public' || $public_dir ==='/public' || $public_dir ==='public/' ){
          //This is local environment, so no need of "/public" for script sn css paths
          $public_dir ="";
        }else{
          //This is hosting environment, so it requires "/public" for script and CSS paths
          $public_dir ="/public";
        }
        return $public_dir;
    }

    //todo: createTags() will be repalced with bundleScript() that bundles and minifies all scripts into one single file
    protected static function createTags($files =[],$attr,$version=null){
          $ss = "";
          //NOTE: on hosting environement => getcwd() return only Root directory and No "public" directory. Example => "/home/vectoraclouds/public_html/loan.vectoraclouds.com"
          //NOTE on Local environment, getCWD() return public_path. Exmaple => "E:/laravelApps/LMS/public"
          $base_url = url('/'); //base_url()
          $public_dir = self::getPublicDirectory(); 
          //$is_external_link is link to CDN or url lin for script of css from other server
          foreach($files as $filePath){
             $is_external_link = true;
             if (substr($filePath,0,1) ==='/' || substr($filePath,0,1) ==='\\')  $is_external_link = false;
             $url_path =$filePath;
             if (!$is_external_link) $url_path = $base_url.$public_dir.$filePath;
             $vers="";
             if($version) $vers ="?v=$version";
             if ($url_path) $ss .= "<link  href='$url_path$vers' type=\"text/css\" rel=\"stylesheet\"/>\n";
          }
          return $ss;
    }

    //create script tags by each bundle's name. Todo: bundle and minify all scripts into one file
    //$degbugMode =1 then it does not render one combined script tag, it will create multple script tags based on orginal js files. default =1
    static function render($bundle_name, $degbugMode=0,$version=null){
        $b = StyleProvider::bundle($bundle_name);
        if(!$b) return;
        $attr = null; //$b?$b['attr']:"";
        if ($degbugMode === 1){
            $files = $b?$b['files']:[];
            echo self::createTags($files,$attr,$version);
        }else {
            $output_file = isset($b['output_file'])?$b['output_file']:null;
            $base_url = url('/');
            $public_dir= self::getPublicDirectory();

            $is_external_link = true;
            if (substr($output_file,0,1) ==='/' || substr($output_file,0,1) ==='\\') $is_external_link  = false;
            $url_path =$output_file;
            if (!$is_external_link) $url_path = $base_url.$public_dir.$output_file;
            if ($url_path) echo self::createTags([$url_path],$attr,$version);
        }

       
    }

    //create script tags for all script .js files in a given directory's name within the  directory "/public/js"
    static function renderFromDir($dir_name=null){
       //$base_url = self::getBaseUrl();
       /// getcwd() is same as public_path() on Local computer. One Cloud hosting, getCwd() = base_path() that is root directory;
       $my_path = base_path();
       if ($dir_name) $my_path = base_path()."/public/$dir_name";
       //$file = basename($path);
     
       $files = glob("$my_path/*.js");
       $ss = "";

       foreach($files as $file){
         $f = basename($file);
         if ($dir_name)  $url_path = url('/')."/$dir_name/$f";
         else  $url_path = url('/')."/$f";
         $ss .= "<script defer src='$url_path' type='text/javascript'></script>\n";
       }
       //$ss .= "<script src='$my_path/myscript.js' type='text/javascript'></script>\n<script src='testsr/myscript2.js' type='text/javascript'></script>\n";
       echo $ss;
    }
}

?>