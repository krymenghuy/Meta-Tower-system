<?php

namespace App\Models;
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Http;
use Config;
use App\Models\Umt\User;
class CrispModel //extends Model
{
    //use HasFactory;
    protected static $crispIdentifier;
    protected static $crispKey;
    protected static $websiteId;

    public function __construct()
    {
        self::$crispIdentifier = Config::get('app.crisp_identifier');
        self::$crispKey = Config::get('app.crisp_api_key');
        self::$websiteId = Config::get('app.crisp_website_id');
    }

    static function createOrUpdateOperator($user)
    {
        self::$crispIdentifier = 'fbf873f5-870f-445b-8738-70004fa8d68a';
        self::$crispKey = 'da4e606ddeca00a80a54a9306e34b529816d7563877e8b09e702286a72856ae2';
        self::$websiteId = '0ba03a66-8247-48cc-b23f-de9f433b8635';
        $user_email = 'samsethy@gmail.com';// $user->email ?? $user->login_name;
        $response = Http::withBasicAuth(self::$crispIdentifier, self::$crispKey)
            ->post('https://api.crisp.chat/v1/website/'.self::$websiteId.'/operators', [
                'user_name' =>$user_email,
                'email' => $user_email,
                'nickname' =>$user->login_name,
                'avatar' => $user->avatar ?? ($user->image_url ?? ''),
                'user_id' =>$user->id
            ]);
        $operator = json_decode($response->body());
        if ($operator->error){
            if($operator->reason == 'not_found') \Log::error('There is no matched Chat Operator with email "'.$user_email.'" ');
            return null;
        }
        $chat_operator_id = $operator->data->id;
        $user->chat_operator_id = $chat_operator_id;
        User::updateProps($user->id,['chat_operator_id'=>$operator['data']['id']]);
        return $operator;
    }
}
