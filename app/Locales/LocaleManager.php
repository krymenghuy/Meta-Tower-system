<?php
namespace App\Locales;
use LangContentProvider;

//BEGIN:: LocaleManager class
class LocaleManager{
        protected static  $langRoutes = [];

        public static $reload_count=0;

        function __construct(){
            return;
        } 

        function __destruct(){
           return;
        } 

        static function getLangList(){
            $base_path = base_path(); 
              return [
                  'en'=>$base_path.'/storage/locales/en.json',
                  'km'=>$base_path.'/storage/locales/km.json',
                  'kh'=>$base_path.'/storage/locales/km.json'
                ];
        }

        static function getLangContents(){
            return LangContentProvider::langContents();
        }
 
        static function replace_marks($str,$arr)
        {
            $out=''; 
            $x=0;
            $dd = explode('?',$str);
            foreach ($dd as $part) 
            {
                $out.=$part;
                if (isset($dd[$x+1])) $out.=isset($arr[$x])?$arr[$x]:'';
                $x++;
                 
            }
            return $out;
        }
        static function getLangText($lang='en',$text_prop=null,$section=null){
            if (!$text_prop) return 'No translated text';
            $section = $section ?? 'validation';
            //use language content directly from current Memory (that is provided by 'LangContentProvider' class )
            $c = LangContentProvider::langContents()[$lang];
            if (!$c) return $text_prop;

            if (isset($c[$section])) 
            return isset($c[$section][$text_prop])? $c[$section][$text_prop]:$text_prop;
            else 
            return $text_prop;
        
        }

        //If for example, $text_prop = 'Data must be between ? and ?::5;100' then method translate() will return 'Data must be between 5 and 100'. In this case, the parameter $replacements is not used
        static function translate($lang,$text_prop,$replacements=null,$langSection='validation'){
            $parts = explode('::',$text_prop);
            $langSection = $langSection ?? 'validation';
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