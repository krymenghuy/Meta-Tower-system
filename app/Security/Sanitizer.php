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
        ';'=>'&U24;', // This is special case because semicolon is used in encoding, for example &U14;
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
    protected  static  $badCharCount = 32; /* No need to loop for counting array again */

    static function setDataTypes($itemTypes=[]){
        foreach($itemTypes as $key=> $value) self::$data_types[$key] = $value;
    }

    static function desanitize($text){
        $new_text=$text;  
        foreach(self::$reverse_chars as $key=>$value)  $new_text = str_replace($key,$value,$new_text);
        return $new_text; 
    }

    /***
    #fsd::class:=Sanitizer|method:=sanitizeObject()|params:=arrat,options,sanitize_modes|description:=
     $options can be for example ['email'=>['@','.'], 'remarks'=>['.','$']].
     $sanitize_mode = 0 (decode special chars before sending to database table), $sanitize_mode =1 (Do not encode special char, just allow it to pass through).
     $sanitize_modes is an arry => it can be, for example, ['amount'=>0,'email'=>1]. where it means => for each fields [amount, email]: 
         - for amount, we allow special char by encoding them.
         - for 'email' field, we allow speicial char '@' without encoding them
     $arr is the associative array( it is NOT PHP object). method sanitizeObject converts Array into a PHP object|
     return_type:=PHP object
    ****/
    static function sanitizeObject($arr =[],$options = [],$sanitize_modes= []){
        //if(is_array($arr)) $arr = (array)$arr;
        $data = [];
        if (!is_array($options)) $options = [];
        if (!is_array($sanitize_modes)) $sanitize_modes=[];
       
        foreach($arr as $prop=>$value){
            $san_mode = isset($sanitize_modes[$prop])?$sanitize_modes[$prop]:1;
            $data[$prop]= self::sanitize($value,isset($options[$prop])?$options[$prop]:[],$san_mode);
        }
        return $data;
    }
 
    static function getEncodedChar($c){
      return isset(self::$char_codes[$c])?self::$char_codes[$c]:'';
    }

   //$allowed_chars = ['$','.']
   /***
      For future Upgrade as follows:
        $options = [
            'type'=>'email',
            'allowed_chars'=>['$','%'],
            'length'=>50,
            'repeats'=>['$'=>1]
         ]
   ***/

   /***
    #fsd:: class:=Sanitizer|method:=sanitize()|params:=text,options,allow_raw|
    description:= $options can be array or string. For example, $option can be "money","email","phone", or $option array such as ['.','$',','].
    $allow_raw is by default TRUE, which means that if we allow special character such as '$' or '#', we do NOT encode these characters in order to disguise them.
   ***/
   static function sanitize($text=null,$options=[],$allow_raw =1)
   {
           if (is_numeric($text)) return $text;
           if (is_array($text)) return self::sanitizeObject($text,$options,$allow_raw);
           if((bool)strtotime($text)) return $text;
           //Just sanitize using standard function htmlspecialchars()
            
             //if ((bool)strtotime($text)) return $text;
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
            
            //return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
            
            ////In order to apply strict sanitization, you can remove comment from the following code and comment out this line above => " return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');"
             $sts = str_split($text);
             $new_text ="";
             foreach($sts as $c){
                   $f = trim($c?$c:'');
                   $d = isset(self::$char_codes[$f])?self::$char_codes[$f]:null;
                 if ($d){
                     if ($allow_raw)
                          ///Allow special charater without encoding them
                          if ($option_is_array) if (in_array($c,$options)) $new_text .= $c;
                     else
                          ////Allow special character by encoding it
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
  
    // //sanitize input data by the given type such as 'email','classtime','time','date', etc
    // static function sanitizeByType($value,$type=null,$option=[])
	// {
	// 	if (is_numeric($value) || !$value) return $value;

    //     $type_results = [
    //         'email'=>filter_var($value, FILTER_SANITIZE_EMAIL),
    //         'date'=>function(){
    //              if (isset($option['format'])) {
    //               if((bool)strtotime($value)) return $value; else return null;
    //              }else{
    //                 if((bool)strtotime($value)) return $value; else return null;
    //              }
    //         },
    //         'url'=>self::seo_friendly_url($value), 
    //     ];

    //     $val = isset(self::$type_results[$type])?self::$type_results[$type]:null;
	// 	return $val?$val:$this->sanitize($value,null);
 
    //     //return strip_tags($value);
	// 	//return htmlentities($value,ENT_QUOTES, 'UTF-8');
	//     //return sanitize($value); 
	// }
    public function manageError(){
        throw new \Exception("Your application has encountered error:1208");
    }
 }

?>