<?php

namespace App\Models\Dms;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Config;
//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;

class Tracker //extends Model
{
     protected static $track_table ='package_tracks';
    //use HasFactory;

    //Log() logPackageInfo() create history of package updates such as in cases like:
    /***
      1. "cod_change": Driver update COD amount from Driver's app => it is important to keep track what changes made by Driver from mobile app
      2. "package_status_change" When Admin Change
      3. update after settle payment with Merchant, or Driver: COD change, price change, df_payer, billed_kg
      @d = {[user_class],'package_id','action_name','description','user_comment'} 
      @action_name = change_cod, update_price, change_zone, change_driver, change_pickup_driver  
     ***/
    static function log($d,$ss){
        $user_class = isset($ss->user_class)?$ss->user_class:$d->user_class;
        if(!isset($d->user_comment)) $d->user_comment=null;
        $package_id = isset($d->package_id)?$d->package_id: (isset($d->id)?$d->id:0);
        $inputs = [
          'create_user_class'=>$user_class,
          'description'=>$d->description,
          'user_comment'=>$d->user_comment,
          'action_name'=>$d->action_name,
          'package_id'=>$package_id
        ];
        saveData($ss,self::$track_table,['id'=>null],$inputs,[],1,false);
        //self::sendToTelegram($d->description);
        return DV::success();
      }
       
    static  function sendToTelegram($message, $files = [])
    {
        // Decode the base64 strings and save the files to storage
        $fileUrls = [];
        foreach ($files as $file) {
            $decodedFile = base64_decode($file['content']);
            $filename = time() . '_' . Str::random(10) . '.' . $file['extension'];
            Storage::put($filename, $decodedFile);
            $fileUrls[] = Storage::url($filename);
        }

        // Send the message and file URLs to Telegram
        $apiToken = Config::get('app.telegram_bot_token');
        $chatId = Config::get('app.chat_id');
        //self::addBotToChat($apiToken,$chatId);
        // return (object)[
        //    'channel_id'=>$chatId,
        //    'bot_id'=>$apiToken
        // ];
        $telegramApiUrl = "https://api.telegram.org/bot{$apiToken}/sendMessage";
        $data = [
            'chat_id' =>$chatId,
            'text' => $message,
        ];

        foreach ($fileUrls as $fileUrl) {
            $data['document'][] = $fileUrl;
        }

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $telegramApiUrl);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $result = curl_exec($ch);
        curl_close($ch);

        // Delete the files from storage
        foreach ($fileUrls as $fileUrl) {
            Storage::delete(str_replace('/storage/', '', $fileUrl));
        }

        return $result;
    }

    static function addBotToChat($botToken, $chatId)
    {
        $botUsername = json_decode(file_get_contents("https://api.telegram.org/bot{$botToken}/getMe"), true)['result']['username'];
        $telegramApiUrl = "https://api.telegram.org/bot{$botToken}/addChatMember";

        $data = [
            'chat_id' => $chatId,
            'user_id' => $botUsername,
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $telegramApiUrl);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $result = curl_exec($ch);
        curl_close($ch);

        return $result;
    }
      
}
