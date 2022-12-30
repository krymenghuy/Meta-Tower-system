<?php
  namespace App\Security;
  
  class PHPCrypto{
                //$key must be 32 characters in length. NOTE: static $key is not safe=> todo: make it dynamic per request etc...
                protected static $key = "0123456789abcdef0123456789abcdef";
                protected static $iv =  "abcdef9876543210abcdef9876543210";
 
                protected static  $encrypt_method = 'AES-128-CBC'; //'AES-256-CBC';

                // function __construct ()
                // {
                    //return;
                    
                // }

                static function encrypt ($string,$iv=null,$key=null)
                {
                    if (!$key){
                        $key = self::getRandomHex(16);
                        self::$key = $key;
                    }
                    if (!$iv){
                        $iv = self::getRandomHex(16);
                        self::$iv = $iv;

                    }

                    $bin_key = hex2bin($key);
                    $bin_iv = hex2bin($iv);

                    if ( $encrypted = base64_encode( openssl_encrypt ($string, self::$encrypt_method,$bin_key, OPENSSL_RAW_DATA , $bin_iv ) ) )
                       return (object)['value'=>$encrypted,'key'=>$key,'iv'=>$iv];
                    else
                       return false;
                    
                }
                //$num_bytes =16 => so that encrypt works
                static function getRandomHex($num_bytes=16) {
                    return bin2hex(openssl_random_pseudo_bytes($num_bytes));
                }

                static function decrypt ($string,$iv=null,$key=null)
                {
                    $key =$key?$key:self::$key;
                    $iv = $iv?$iv:self::$iv;
                    $bin_key = hex2bin($key);
                    $bin_iv = hex2bin($iv);

                    if ( $decrypted = openssl_decrypt (base64_decode ($string), self::$encrypt_method, $bin_key, OPENSSL_RAW_DATA ,$bin_iv))
                       return $decrypted;
                    else
                       return false;
                    
                }  
  }
?>