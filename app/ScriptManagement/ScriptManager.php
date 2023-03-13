<?php
namespace App\ScriptManagement;
use App\ScriptManagement\ScriptProvider;
use App\ScriptManagement\Minifier;

class ScriptManager{
 
    protected static $script_path = "";

    function __construct(){
        self::$script_path = getcwd()."/js/";
    }

    function __destruct(){
        return null;
    }

    // static function getBaseUrl(){
    //     $server_name = $_SERVER['SERVER_NAME'];
    //     $protocol = stripos($_SERVER['SERVER_PROTOCOL'],'https') === 0 ? 'https://' : 'http://';
    //     return $protocol.$server_name;
    // }
   

    protected static function createFile($ext =null,$file_name,$content=null){
        if (!$content) return (object)["status"=>"Error","error_message"=>"Cannot create file $file_name.$ext with NULL content"];
        $dir = dirname($file_name);
        if (!file_exists($dir)) {
           mkdir($dir, 0755, true); //permission
            //$result->error = 'Storage file or folder does not exist';
            //return $result;
        }
        $success = file_put_contents($file_name.$ext, $content);
        if (!$success) return  (object)["status"=>"Error","error_message"=>"Error creating file $file_name.$ext"];
        else return (object)['status'=>'OK','file_name'=>$file_name.$ext];
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

    static function combineFileContents($b=[]){
      $str = "";
      $files = isset($b['files'])?$b['files']:[];
      $dir = getcwd();
      $excepts = $b? (isset($b['no-minify'])?$b['no-minify']:[]) :[];
      //NOTE that: each file path is  $dir.$f = "E:\LaravelApps\GTS/assets/material-js/jquery.min.js"
      // then we need to add directory called "public" to it => "E:\LaravelApps\GTS/public/assets/material-js/jquery.min.js"
      foreach($files as $f){
        $path = $dir."/public".$f;
        $last_seven_chars = substr($f, strlen($f)-7,7);
        if (in_array($f,$excepts)){
            $str.= ';'.self::getFileContent($path); 
        }else {
            if ($last_seven_chars ==='.min.js')
               $str.= ';'.self::getFileContent($path);
            else $str.=';'.Minifier::minify(self::getFileContent($path),  ['flaggedComments' => false]);
        }
           
      }
      return $str;
    }

    static function createBundleFileFromArray($b=[]){
        if(!$b) return (object)["status"=>"OK","file_name"=>null];
        if (!isset($b['output_file'])) return (object)["status"=>"OK","file_name"=>null];
        //base_path() gives the same result both on Local and on Hosted environment. It gives Root directory
        //always put script in public_path => "/public"
        $dir = public_path(); // getcwd();  // physical disk path to "public"
        //NOTE: $b['output_file'] should starts with "/" 
        $fpath = $dir.$b['output_file'];

        if (file_exists($fpath))
         {
             $err = deleteFile($fpath);
             if ($err) return (object)["status"=>"Error","error_message"=>$err];
         }
      
        $content = self::combineFileContents($b);
        return self::createFile(null,$fpath,$content);
    }

    static function createBundleFile($bundle_name){
       $b = ScriptProvider::bundle($bundle_name);
       if(!$b) return (object)['status'=>'Error','error_message'=>"The script bundle named $bundle_name is not found!"];
       return self::createBundleFileFromArray($b);
       
    }
    
    static function createAllBundleFiles(){
        $bs = ScriptProvider::getBundles();
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
             if ($url_path) $ss .= "<script $attr src='$url_path$vers' type='text/javascript'></script>\n";
          }
          return $ss;
    }

    //create script tags by each bundle's name. Todo: bundle and minify all scripts into one file
    //$degbugMode =1 then it does not render one combined script tag, it will create multple script tags based on orginal js files. default =1
    static function render($bundle_name, $degbugMode=0,$version=null){
        $b = ScriptProvider::bundle($bundle_name);
        if(!$b) return;
        $attr = $b?$b['attr']:"";
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