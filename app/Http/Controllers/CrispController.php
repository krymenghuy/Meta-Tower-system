<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Config;
use App\Services\Umt\AuthService;
use App\Models\JDV;
use App\Models\CrispModel;
use App\Models\Umt\User;
class CrispController extends Controller
{
    // protected $crispIdentifier;
    // protected $crispKey;
    // protected $websiteId;

    // public function __construct()
    // {
    //     $this->crispIdentifier = Config::get('app.crisp_identifier');
    //     $this->crispKey = Config::get('app.crisp_api_key');
    //     $this->websiteId = Config::get('app.crisp_website_id');
    // }

    public function linkUserToCrispOperator(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $user = $req->user;
        $operator = CrispModel::createOrUpdateOperator($user);
        if (isset($operator['data']['id'])) {
            // Store the operator ID with the user
            $chat_operator_id = $operator['data']['id'];
            $user->chat_operator_id = $chat_operator_id;
            User::updateProps($user->id,['chat_operator_id'=>$chat_operator_id]);
            return JDV::raw(['status_code' => 200, 'success_message' => 'Operator linked successfully']);
        } else 
            return JDV::error('Failed to create or update Crisp operator');
    }
}