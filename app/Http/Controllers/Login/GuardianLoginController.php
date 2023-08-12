<?php

namespace App\Http\Controllers\Login;

use App\Http\Controllers\Controller;
use App\Models\UM;
use Illuminate\Http\Request;

class GuardianLoginController extends Controller
{
    //

    protected $UMModel;
    public function __construct(){
        $this->UMModel = new UM();
    }
    function guardianLogin(Request $req){
        $app_id = \Config::get('app.customer_app_id');
        $login_name = $req->login_name;
        $pwd = $req->password;

        $result = $this->UMModel->verifyUser($app_id, $login_name, $pwd);
        if ($result->status === 'OK') {
            // $result->user->image_url = \App\Models\PublicStorage::getProfilePhoto_url($result->user->branch_id, $result->user->user_class, $result->user->official_id);
        }

        return $result;
    }
}
