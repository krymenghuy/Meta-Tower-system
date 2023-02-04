<?php
namespace App\Locales;
use LangContentProvider;

//BEGIN:: LocaleManager class
class LocaleManager{
        // protected static $langContents = [
        //     'en'=>null,
        //     'km'=>null
        // ];
        protected static  $langRoutes = [];

        public static $reload_count=0;

        function __construct(){
            return;
            // $working_dir = getcwd();
            // $langRoutes['km'] = $working_dir."/locales/km.php";
            // $langRoutes['en'] = $working_dir."/locales/en.php";

            ////NOTE: method loadLangContent() uses $langRoutes[] to find file_path to langauge files "./locales/en.php etc..."
            //self::loadLangContent('all');
        } 

        function __destruct(){
           return;
        } 

        static function getLangList(){
            $base_path = base_path(); 
              return [
                  'en'=>"$base_path/storage/locales/en.json",
                  'km'=>"$base_path/storage/locales/km.json",
                  'kh'=>"$base_path/storage/locales/km.json"
                ];
        }

        static function getLangContents(){
            return LangContentProvider::langContents();
            //return self::$langContents;
        }

        // static function getLangRoutes(){
        //     $cwd = getcwd(); 
        //     return [
        //         'km'=> $cwd."/locales/km.php",
        //         'kh'=> $cwd."/locales/km.php",
        //         'en'=> $cwd."/locales/en.php"
        //     ];
        // }

        static function replace_marks($str,$arr)
        {
            $out=""; 
            $x=0;
            $dd = explode("?",$str);
            foreach ($dd as $part) 
            {
                $out.=$part;
                if (isset($dd[$x+1])) $out.=isset($arr[$x])?$arr[$x]:'';
                $x++;
                 
            }
            return $out;
        }

        // /*** loadLangContent() loads lan content from file "/Locales/km.php" or "Locales/en.php". This method is not used for now because we use LangContentProvider class instead, so that langCotent is provided directly from current memory ***/
        // //refresh lang content by $lang. loanLangContent() returns NULL is not error, and it returns error message in case of Parse error or when language files are empty
        // static function loadLangContent($lang='en'){

        //     if ($lang==='all' || !$lang){
        //         $err =null;
        //         foreach(self::$langRoutes as $file_path){

        //                     if (file_exists($file_path)){
        //                         //try to read file only if file exists
        //                         $arry_code = readFileContent($file_path);
                        
        //                         if ($arry_code){
        //                             $arr = [];
        //                             try{
        //                                 $arr = eval($arry_code);
        //                                 self::$langContents[$lang] = $arr;
        //                             }catch(Throwable $e){
        //                                 //Stay slient on error Parsing
        //                                 $err = "Error while parsing $lang language file content.".$e->getMessage(); 
        //                                 //return $e->getMessage(); 
        //                             }
                                    
        //                         } else $err = "$lang file does not contains any data";  
        //                     } else $err =$file_path?$file_path:"File". " does not exists"; 
        //         }
        //     return $err;
        //     }else{

        //         $file_path = isset(self::$langRoutes[$lang])? self::$langRoutes[$lang]: getcwd()."/locales/km.php";
        //         $arry_code = readFileContent($file_path);

        //         if ($arry_code){
        //             $arr = [];
        //             try{
        //                 $arr = eval($arry_code);
        //                 self::$langContents[$lang] = $arr;
        //                 return null;
        //             }catch(Throwable $e){
        //                     return "Error while parsing $lang language file content.".$e->getMessage();
        //             }
                    
        //         } else return "$lang file does not contains any data";
        //     }
        
        // } 

        static function getLangText($lang='en',$text_prop=null,$section=null){
            if (!$text_prop) return 'No translated text';
            if (!$section) $section = 'validation';
            //use language content directly from current Memory (that is provided by "LangContentProvider" class )
            $c = LangContentProvider::langContents()[$lang];
            // //method self::loadLangContent() will refresh or reload langauge file content by storing lang data in static variable "self::$langContents"
            // //load the language file content is these data are not yet loaded. NOTE: self::loadLangContent() does NOT return $langContent data, but only returns "error message" when there is error.  
            // $c = self::$langContents[$lang]; 
            // if (!$c){
            //     self::loadLangContent($lang);
            //     $c = self::$langContents[$lang];
                   /** this is first time loaded lang content from file such ".\Locales\km.php" or ".\Locales\en.php" NOTE: it seems that it loads every time an api is called requiring translation => so it is not good for performnce **/   
            // }

            if (!$c) return $text_prop;

            if (isset($c[$section])) 
            return isset($c[$section][$text_prop])? $c[$section][$text_prop]:$text_prop;
            else 
            return $text_prop;
        }

        //If for example, $text_prop = "Data must be between ? and ?::5;100" then method translate() will return "Data must be between 5 and 100". In this case, the parameter $replacements is not used
        static function translate($lang,$text_prop,$replacements=null,$langSection='validation'){
            $parts = explode('::',$text_prop);
            if (!$langSection) $langSection ='validation';
            if (isset($parts[1])){
                $text = self::getLangText($lang,$parts[0],$langSection);
                $arr = explode(';',$parts[1]);
                return self::replace_marks($text,$arr);   
            }else {
                $text = self::getLangText($lang,$text_prop,$langSection);
                if(!$replacements) 
                   return $text;
                else return self::replace_marks($text,$replacements);   
            }
        }


}

?>