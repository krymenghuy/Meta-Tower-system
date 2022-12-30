<?php
namespace App\Security;

 class Sanitizer{
    function __construct(){
        return;
    } 

    protected static $data_types =[
        'email'=>['@','.','-'],
        'phone'=>['+','(',')'],
        'address'=>['.','#',','],
        'notes'=>['.','$','%','(',')'],
        'remarks'=>['.','$','%','(',')'],
        'money'=>['$','.',',']
    ];

    protected static $char_codes = [
        ';'=>'&U24;',
        '&'=>'&U23;',
        '-'=>"&U01;",
        '$'=>"&U02;",
        '('=>"&U03;",
        ')'=>"&U04;",
        '@'=>"&U05;",
        '/'=>"&U06;",
        '#'=>"&U11;",
        ':'=>"&U09;",
        '!'=>"&U08;",
        '='=>"&U14;",
        '\\'=>"&U13;",
        '.'=>"&U16;",
        ','=>"&U17;",
        '?'=>"&U18;",
        '['=>"&U19;",
        ']'=>"&U20;",
        '+'=>"&U21;",
        '\''=>"&U10;",
        '"'=>"&U22;"
    ];

    protected static $reverse_chars = [
        '&U24;'=>';',
        '&U23;'=>'&',
        "&U01;"=>'-',
        "&U02;" =>'$',
        "&U03;"=>'(',
        "&U04;"=>')',
        "&U05;"=>'@',
        "&U06;"=>'/',
        "&U11;"=>'#',
        "&U09;"=>':',
        "&U08;"=>'!',
        "&U14;"=>'=',
        "&U13;"=>'\\',
        "&U16;"=>'.',
        "&U17;"=>',',
        "&U18;"=>'?',
        "&U19;"=>'[',
        "&U20;"=>']',
        "&U21;"=>'+',
        "&U10;"=>'\'',
        "&U22;"=>'"'
    ];

    protected static $badChars = [".",",","~", "^","(", ")", "@", "&","&amp;", "!", "$", "#", "*", ";", "/","+", "-", "%", "=", "\"", "'", "\\", ":", "<", ">", "&quot;", "&lt;", "&gt;", "&#x27;", "&#x2F;", "&#60;", "&#62;", "&#34;", ".fromCharCode","{","}","[","]","?" ];
    protected  static  $badCharCount = 32;

    static function setDataTypes($itemTypes=[]){
        foreach($itemTypes as $key=> $value) self::$data_types[$key] = $value;
    }

    static function desanitize($text){
        $new_text=$text;  
        foreach(self::$reverse_chars as $key=>$value)  $new_text = str_replace($key,$value,$new_text);
        return $new_text; 
    }
    static function sanitizeObject($arr =[],$options = [],$sanitize_modes= []){
        //if(is_array($arr)) $arr = (array)$arr;
        $data = [];
        if (!is_array($options)) $options = [];
        if (!is_array($sanitize_modes)) $sanitize_modes=[];
       
        foreach($arr as $prop=>$value){
            $san_mode = isset($sanitize_modes[$prop])?$sanitize_modes[$prop]:1;
            $data[$prop]= self::sanitize($value,isset($options[$prop])?$options[$prop]:[],$san_mode);
        }
        return (object)$data;
    }
    static function getEncodedChar($c){
      return isset(self::$char_codes[$c])?self::$char_codes[$c]:'';
    }
   static function sanitize($text=null,$options=[],$allow_raw =1)
   {
           if (is_numeric($text)) return $text;
           if((bool)strtotime($text)) return $text;
            $option_is_array = is_array($options);
            if (!$option_is_array){
                    if ($options ==='email'){
                        if (filter_var($text, FILTER_VALIDATE_EMAIL)) {
                            return $text; 
                        } else return null;
                    }else{
                        $options = isset(self::$data_types[$options])?self::$data_types[$options]:[];
                        $option_is_array= true; 
                    }
            }
            
             $sts = str_split($text);
             $new_text ="";
             foreach($sts as $c){
                   $f = trim($c?$c:'');
                   $d = isset(self::$char_codes[$f])?self::$char_codes[$f]:null;
                 if ($d){
                     if ($allow_raw)
                          if ($option_is_array) if (in_array($c,$options)) $new_text .= $c;
                     else
                          if ($option_is_array) if (in_array($c,$options))  $new_text .= $d;
                 }else $new_text.=$c;
                    
             }  
             return $new_text;
            
   }

    static function seo_friendly_url($string){
		$string = str_replace(array('[\', \']'), '', $string);
		$string = preg_replace('/\[.*\]/U', '', $string);
		$string = preg_replace('/&(amp;)?#?[a-z0-9]+;/i', '-', $string);
		$string = htmlentities($string, ENT_COMPAT, 'utf-8');
		$string = preg_replace('/&([a-z])(acute|uml|circ|grave|ring|cedil|slash|tilde|caron|lig|quot|rsquo);/i', '\\1', $string );
		$string = preg_replace(array('/[^a-z0-9]/i', '/[-]+/') , '-', $string);
		return strtolower(trim($string, '-'));
	}
   
 }

?>