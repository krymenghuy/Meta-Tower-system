<?php
namespace App\Console\Commands;
//The following reference requires to edit php.ini to release extension=php_recursive.dll
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use RecursiveCallbackFilterIterator;
use Illuminate\Support\Facades\File;
class HtmlCompressor{

    function compressFiles($directory,$outout_dir=null){
        $success_files = [];
        if(!$outout_dir) $outout_dir =$directory."/compressed"; 
        $files = $this->getFiles($directory); //get files in directory recursively
        //$files = scandir($directory); //get files in the directory
        foreach ($files as $file) {
            $file_path = $directory . '/' . $file;
            if (is_file($file_path)) {
                $extension = pathinfo($file_path, PATHINFO_EXTENSION);
                if($extension==='php' || $extension==='html'){
                    $x = self::compressfile($file_path,$outout_dir);
                    if($x){
                        $success_files[] = $outout_dir."/".basename($file_path);
                    }
                }
            }
        }
        return $success_files;
    }
    
    function getFiles($dir) {
        $files = array();
      
        $items = scandir($dir);
        foreach ($items as $item) {
          if ($item == '.' || $item == '..') {
            continue;
          }
      
          $path = $dir . '/' . $item;
          if (is_file($path)) {
            $files[] = $item;
          } 
          elseif (is_dir($path)) {
            $files = array_merge($files, $this->getFiles($path));
          }
        }
      
        return $files;
    }

    // protected function getFilesToCompress($dir)
    // {
    //     $files = [];

    //     foreach (new \DirectoryIterator($dir) as $fileInfo) {
    //         if ($fileInfo->isDot()) {
    //             continue;
    //         }

    //         if ($fileInfo->isDir()) {
    //             $subDir = $fileInfo->getPathname();
    //             $subFiles = $this->getFilesToCompress($subDir);
    //             $files = array_merge($files, $subFiles);
    //         } else {
    //             $extension = strtolower($fileInfo->getExtension());
    //             if ($extension === 'php' || $extension === 'html') {
    //                 $files[] = $fileInfo->getPathname();
    //             }
    //         }
    //     }

    //     return $files;
    // }

    static function compressfile($file,$outout_dir){
       $extension = pathinfo($file, PATHINFO_EXTENSION);
       if($extension==='php' || $extension ==='html'){
         $file_name = basename($file);
         $content = file_get_contents($file);
         $c_content = self::compressHtml($content);
         return self::createFile($outout_dir,$file_name,$c_content);
       }
       return false;
    }
    
    static function createFile($directory,$file_name,$content){
        if (!is_dir($directory)) {
           mkdir($directory, 0777, true);
        }

        $file = $directory . '/'.$file_name;
        $result = file_put_contents($file, $content);
        return $result; 
    }

    static function compressHtml($html) {
        // Remove comments
        $html = preg_replace('/<!--.*?-->/s', '', $html);
        
        // Remove whitespace
        $html = preg_replace('/\s+/s', ' ', $html);
        
        // Remove whitespace before and after tags
        $html = preg_replace('/\s*<\s*/', '<', $html);
        $html = preg_replace('/\s*>\s*/', '>', $html);
        
        // Remove whitespace between tags
        $html = preg_replace('/>\s+</', '><', $html);
        
        // Remove whitespace inside tags
        $html = preg_replace('/\s*=\s*/', '=', $html);
        
        // Remove whitespace from inline CSS
        $html = preg_replace('/\s*{\s*/', '{', $html);
        $html = preg_replace('/\s*:\s*/', ':', $html);
        $html = preg_replace('/\s*;\s*/', ';', $html);
        
        // Remove whitespace from the beginning and end of the string
        $html = trim($html);
        
        // Return the compressed HTML
        return $html;
      }

      //If $mode = 0 then it means we swith to production mode, where the scripts and css style are referenced from /public/dist/css or public/dist/js respectively
      static function switchStyleAndScripts($contents, $mode=null){
        $mode = $mode?$mode:0;
        //$contents = "Lorem ipsum ScriptManager::render('some_script_here', 1 ); dolor sit amet, consectetur adipiscing elit. Vestibulum StyleManager::render('some_style_here', 1 ); ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam ac massa auctor, congue risus vel, semper ex.";
        $new_contents = str_replace(["ScriptManager::render('", "StyleManager::render('"], ["ScriptManager::render('", "StyleManager::render('"], $contents);
        return preg_replace("/,\s*1\s*\)/", ", $mode)", $new_contents);
      } 

     //This method will picks only files from resources/views/layouts directory that are included in the master.blade.php and then
     //extract their conents and combine those contents in the right place within master.blade.php file.
     //NOTe that buildMasterView() will use file in folder "/resources/views/master.blade.php" and then create another output compressed file for master.blade.php in a desired directory, or by default, use directory "/views/dist"  
     function buildMasterView($output_dir=null){
        $base_dir = getCwd(); 
        $masterFile =  $base_dir.'/resources/views/master.blade.php';
        //set default Output directory to "/resources/views/dist"
        $output_dir =$output_dir? $output_dir: "/resources/views/dist";
        $outputFile =  $base_dir.$output_dir.'/master.blade.php';

        $content = File::get($masterFile);

        $pattern = '/@include\(\'([^\']+)\'\)/';
        $matches =[];
        preg_match_all($pattern, $content, $matches);
        
        $errors =[];
        //NOTE include_name is a string inside @include(). example => @include('layouts.testComponent'), the $include_name =layouts.testCompoent
        foreach ($matches[1] as $include_name) {
            $blade_path = str_replace(".","/",$include_name);
            //$file_name = basename($blade_path); 
            $layoutFile = resource_path('views/' .$blade_path. '.blade.php');
            // if (!File::exists($layoutFile)) {
            //     $layoutFile = resource_path('views/' .$layoutFile. '.blade.php');
            // }
            if (File::exists($layoutFile)) {
                $layoutContent = File::get($layoutFile);
                $content = str_replace('@include(\'' . $include_name . '\')', $layoutContent, $content);
            } else {
                $errors[] =  'Layout file not found: ' . $layoutFile;
            }
        }

        $outputDir = dirname($outputFile);
        if (!File::exists($outputDir)) {
            File::makeDirectory($outputDir, 0755, true);
        }
        $c_content = self::compressHtml($content);
        //Switch Style and Scripts to production mode, using the compressed files
        $c_content = self::switchStyleAndScripts($c_content,0);
        $x = self::createFile($outputDir,"master.blade.php",$c_content);
        if($x) return (object)['status'=>'OK','file'=>$outputDir."/master.blade.php","error_message"=>null,"error_files"=>$errors];
        else return (object)['status'=>'Error','error_message'=>"Failed to create the output file master.blade.php in $outputDir","error_files"=>[]];             
   }
      
}