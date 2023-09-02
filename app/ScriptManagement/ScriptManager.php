<?php
namespace App\ScriptManagement;
use App\ScriptManagement\ScriptProvider;
//use App\ScriptManagement\Minifier;

/** npm install javascript-obfuscator --save-dev */

//use Illuminate\Support\Facades\File;
/** composer require symfony/process **/
use Symfony\Component\Process\Process; 

class ScriptManager{
    protected static $script_path = "";

    function __construct(){
        self::$script_path = getcwd()."/js/";
    }

    function __destruct(){
        return null;
    }
   
    
    static function escapeUnicodeCharacters($input) {
        // Regular expression pattern to match non-escaped Unicode characters
        $pattern = '/(?<!\\\\)\\\\u[0-9a-fA-F]{4}/';
    
        // Use the preg_replace_callback function to replace matches
        $output = preg_replace_callback($pattern, function($matches) {
            // Convert each Unicode escape sequence to the actual character
            $unicode = preg_replace('/\\\\u([0-9a-fA-F]{4})/', '&#x$1;', $matches[0]);
            return mb_convert_encoding($unicode, 'UTF-8', 'HTML-ENTITIES');
        }, $input);
    
        return $output;
    }
 
    static function escapeUnicode($input) {
        return preg_replace_callback('/[^\x20-\x7E]/u', function($match) {
            return '\\u' . sprintf('%04x', ord($match[0]));
        }, $input);
    }

    static function obfuscateJS($filePath)
    {
        try {
            // Check if the file path is a URL or CDN link
            if (filter_var($filePath, FILTER_VALIDATE_URL)) {
                // It's a URL, download the content
                $scriptContent = file_get_contents($filePath);
    
                // Create a temporary JavaScript file
                $jsFilePath = tempnam(sys_get_temp_dir(), 'script_');
                file_put_contents($jsFilePath, $scriptContent);
            } else {
                // It's a local file, use the provided path
                if (!file_exists($filePath)) {
                    return (object) [
                        'error_message' => 'File '.$filePath.' does not exist',
                        'content' => null,
                    ];
                }
                $jsFilePath = $filePath;
            }
    
            // Define the command to run the Node.js script with the file path as an argument
            $nodeCommand = "node app/ScriptManagement/obfuscate.js $jsFilePath";
    
            // Execute the Node.js script
            exec($nodeCommand, $output, $returnCode);
    
            // Check for errors in the Node.js script execution
            if ($returnCode !== 0) {
                return (object) [
                    'error_message' => 'Failed to obfuscate JavaScript code',
                    'content' => null,
                ];
            }
    
            // Read the obfuscated JavaScript code from the output
            $obfuscatedCode = implode("\n", $output);
    
            // Clean up the temporary JavaScript file
            if (isset($scriptContent)) {
                unlink($jsFilePath);
            }
    
            return (object) [
                'error_message' => null,
                'content' => $obfuscatedCode,
            ];
        } catch (\Exception $e) {
            // Handle any exceptions or errors here
            return (object) [
                'error_message' => $e->getMessage(),
                'content' => null,
            ];
        }
    }
       
//   static function obfuscateJS($scriptContent)
//   {
//      //$scriptContent =  self::escapeUnicode($script);
//     try {
//         // Create a temporary JavaScript file
//         $jsFilePath = tempnam(sys_get_temp_dir(), 'script_');
//         file_put_contents($jsFilePath, $scriptContent);

//         // Define the command to run the Node.js script
//         $nodeCommand = "node app/ScriptManagement/obfuscate.js $jsFilePath";

//         // Execute the Node.js script
//         exec($nodeCommand, $output);

//         // Read the obfuscated JavaScript code from the output
//         $obfuscatedCode = implode("\n", $output);

//         // Clean up the temporary JavaScript file
//         unlink($jsFilePath);

//         return (object) [
//             'error_message' => null,
//             'content' => $obfuscatedCode,
//         ];
//     } catch (\Exception $e) {
//         // Handle any exceptions or errors here
//         return (object) [
//             'error_message' => $e->getMessage(),
//             'content' => null,
//         ];
//     }
//   }
 
    /**
     * to use method uglifyJs(), we need to install nodeJS tool like  "terser" OR "uglify-js" first  
     * npm install terser  
     * npm install uglify-js => (this one iscurrently used)
    */
    static function uglifyJs($jsContent)
    {
        // Use Terser to uglify JavaScript
        $command = 'npx terser --compress --mangle';

        $process = Process::fromShellCommandline($command);
        $process->setInput($jsContent);
        $process->run();

        if (!$process->isSuccessful()) {
            return (object)['status' => 'Error', 'error_message' => $process->getErrorOutput()];
        }

        return (object)['status' => 'OK', 'content' => $process->getOutput()];
    }
 
        //     static function uglifyJsObfuscate($jsContent)
        //     {
        //         // Use UglifyJS to obfuscate JavaScript
        //         $command = 'npx uglify-js --mangle';

        //         $process = Process::fromShellCommandline($command);
        //         $process->setInput($jsContent);
        //         $process->run();

        //         if (!$process->isSuccessful()) {
        //             return (object)['status' => 'Error', 'error_message' => $process->getErrorOutput()];
        //         }

        //         return (object)['status' => 'OK', 'content' => $process->getOutput()];
        //    }


   
        //remove comments from codes
        static function removeComments( $js ) {
            	// Remove a tab
            	$js = str_replace("\t", " ", $js);

            	// Remove comments with "// "
            	$js = preg_replace('/\n(\s+)?\/\/[^\n]*/', "", $js);	

            	// Remove other comments
            	$js = preg_replace("!/\*[^*]*\*+([^/][^*]*\*+)*/!", "", $js);
            	$js = preg_replace("/\/\*[^\/]*\*\//", "", $js);
            	$js = preg_replace("/\/\*\*((\r\n|\n) \*[^\n]*)+(\r\n|\n) \*\//", "", $js);		

            	// Remove a carriage return
            	$js = str_replace("\r", "", $js);

            	// Remove whitespaces
            	$js = preg_replace("/\s+\n/", "\n", $js);	
            	$js = preg_replace("/\n\s+/", "\n ", $js);
            	$js = preg_replace("/ +/", " ", $js);

            	return $js;
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
        }
    
        curl_close($ch);
    
        if ($data === FALSE) {
            return (object)['status'=>'Error','error_message'=>"Failed to fectch url $url. Info: ".$info];
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
               }catch(\Exception $e){
                 return (object)['error_message'=>$e->getMessage()." File: ".$outFileName,'status'=>'Error'];
               }
            }
    }

    protected static function createFile($content=null,$file_name=null,$ext =null){
        if (!$file_name) return (object)["status"=>"Error","error_message"=>"Error in createFile() method because parameter file_name is not supplied"];
        if (!$content) return (object)["status"=>"Error","error_message"=>"Cannot create file $file_name.$ext with NULL content"];
        $file_name = explode('?',$file_name)[0];
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
        else return (object)['status'=>'OK','file_name'=>$file_name,'error_message'=>null];
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


    
    public static function createAllBundleFiles()
    {
        $bs = ScriptProvider::getBundles();
        $files = [];
        foreach ($bs as $b) {
            $res = self::createBundleFileFromArray($b);
            if ($res->status === 'Error') return $res;
            else  $files[] = $res->file_name;
        }
        return (object)['status' => 'OK', 'files' => $files];
    }
 

 static function createBundleFileFromArray($b = [])
 {
    if (!$b) {
        return (object)["status" => "OK", "file_name" => null];
    }
    if (!isset($b['output_file'])) {
        return (object)["status" => "OK", "file_name" => null];
    }

    $base_dir = public_path(); /** base_dir is "/public" */
    // Output file path
    $outputFilePath = $base_dir . $b['output_file'];

    // Initialize an array to store obfuscated file contents
    $obfuscatedContents = [];

    if (isset($b['single_file']) && $b['single_file'] == 1) {
        // Bundle all files into a single obfuscated file

        foreach ($b['files'] as $file) {
            $file = explode('?',$file)[0];
            $file_path = $base_dir . '/' . ltrim($file, '/\\');
            $c = self::obfuscateJS($file_path);
            if($c->error_message) return (object)['status' => 'Error', 'file_name' => $file_path,'error_message'=>$c->error_message];
            // Add the local JavaScript content to the array
            $obfuscatedContents[] = $c->content;
        }

        // Combine obfuscated file contents and save to the output file
        $combinedContent = implode(";", $obfuscatedContents);
        $createFileResult = self::createFile($combinedContent, $outputFilePath, null);

        if ($createFileResult->error_message) {
            // Handle file creation errors here
            return (object)['status' => 'Error', 'error_message' => $createFileResult->error_message];
        }

        return (object)['status' => 'OK', 'file_name' => $outputFilePath];
    } else {
        // Process each file individually and obfuscate them
        foreach ($b['files'] as $file) {
            $file = explode('?',$file)[0];
            $file_path = $base_dir . '/' . ltrim($file, '/\\');
            $c = self::obfuscateJS($file_path); 
            if($c->error_message) return (object)['status' => 'Error', 'file_name' => $file_path,'error_message'=>$c->error_message];
            //todo: Save the obfuscated file content to specific directory
            $fileName = basename($file);
            $outputFile = $base_dir. '/dist/js/' .$fileName;
            $createFileResult = self::createFile($c->content, $outputFile, null);
        }
        return (object)['status' => 'OK', 'file_name' => null]; // Adjust this part based on bundling logic
    }
 }


    //create script tags by each bundle's name. Todo: bundle and minify all scripts into one file
    //$degbugMode =1 then it does not render one combined script tag, it will create multple script tags based on orginal js files. default =1
    static function render($bundle_name, $degbugMode = 0, $version = null)
    {
        $b = ScriptProvider::bundle($bundle_name);
        if (!$b) return;
        $attr = $b ? $b['attr'] : "";
        if ($degbugMode == 1) {
            $files = $b ? $b['files'] : [];
            $ref = self::createTags($files, $attr, $version);
            echo str_replace(['\n', '\r'], '', $ref);
        } else {
            $base_url = url('/');
            $public_dir = self::getPublicDirectory();
            $single_file = $b ? $b['single_file'] : 1;
            if ($single_file === 1) {
                $output_file = isset($b['output_file']) ? $b['output_file'] : null;
                $output_file = $output_file;
                $is_external_link = true;
                if (substr($output_file, 0, 1) === '/' || substr($output_file, 0, 1) === '\\') $is_external_link  = false;
                $url_path = $output_file;
                if (!$is_external_link) $url_path = $base_url . $public_dir . $output_file;
                if ($url_path) {
                    $ref = self::createTags([$url_path], $attr, $version);
                    echo str_replace(['\n', '\r'], '', $ref);
                }
            }
            else{
                $files = [];
                $bFiles = $b ? $b['files'] : [];
                foreach ($bFiles as $file) {
                    $path = $file;
                    $file_name = basename($path);
                    $fPath = $base_url . $public_dir . "/dist/js/" . $file_name;
                    $files[] = $fPath;
                }

                $ref = self::createTags($files, $attr, $version);
                echo str_replace(['\n', '\r'], '', $ref);
            }
        }
    }

    //getPublicDirectory() return empty string on Local or Development environment.
    //On Hosting environment, it returns "public" that is directory name.
    //This function depends on getCWD(), which returns root directory on Hosting environment, and it returns public_path on Hosting Local environment
    static function getPublicDirectory()
    {
        $working_dir = getcwd(); //public
        $public_dir = substr($working_dir, -7);
        $public_dir = $public_dir ? $public_dir : '';

        if ($public_dir === 'public\\' || $public_dir === '\\public' || $public_dir === '/public' || $public_dir === 'public/') {
            //This is local environment, so no need of "/public" for script sn css paths
            $public_dir = "";
        } else {
            //This is hosting environment, so it requires "/public" for script and CSS paths
            $public_dir = "/public";
        }
        return $public_dir;
    }

    //todo: createTags() will be repalced with bundleScript() that bundles and minifies all scripts into one single file
    protected static function createTags($files = [], $attr, $version = null)
    {
        $ss = "";
        //NOTE: on hosting environement => getcwd() return only Root directory and No "public" directory. Example => "/home/vectoraclouds/public_html/loan.vectoraclouds.com"
        //NOTE on Local environment, getCWD() return public_path. Exmaple => "E:/laravelApps/LMS/public"
        $base_url = url('/'); //base_url()
        $public_dir = self::getPublicDirectory();
        //$is_external_link is link to CDN or url lin for script of css from other server
        foreach ($files as $filePath) {
            $is_external_link = true;
            if (substr($filePath, 0, 1) === '/' || substr($filePath, 0, 1) === '\\')  $is_external_link = false;
            $url_path = $filePath;
            if (!$is_external_link) $url_path = $base_url . $public_dir . $filePath;
            $vers = "";
            if ($version) $vers = "?v=$version";
            if ($url_path) $ss .= "<script $attr src='$url_path$vers' type='text/javascript'></script>\n";
        }
        return $ss;
    }
 
    //create script tags for all script .js files in a given directory's name within the  directory "/public/js"
    static function renderFromDir($dir_name = null)
    {
        //$base_url = self::getBaseUrl();
        /// getcwd() is same as public_path() on Local computer. One Cloud hosting, getCwd() = base_path() that is root directory;
        $my_path = base_path();
        if ($dir_name) $my_path = base_path() . "/public/$dir_name";
        $files = glob("$my_path/*.js");
        $ss = "";

        foreach ($files as $file) {
            $f = basename($file);
            if ($dir_name)  $url_path = url('/') . "/$dir_name/$f";
            else  $url_path = url('/') . "/$f";
            $ss .= "<script defer src='$url_path' type='text/javascript'></script>\n";
        }
        //$ss .= "<script src='$my_path/myscript.js' type='text/javascript'></script>\n<script src='testsr/myscript2.js' type='text/javascript'></script>\n";
        echo $ss;
    }

}
 
