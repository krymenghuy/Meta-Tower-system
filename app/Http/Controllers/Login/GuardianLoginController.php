<?php

namespace App\Http\Controllers\Login;

use App\Http\Controllers\Controller;
use App\Models\JDV;
use App\Models\MobileApi\HomePage;
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

    function getGuardianProfile(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code != 200) return $ss;

        $d = new HomePage();
        $profile = $d->guardianProfile($ss);
        return JDV::result($profile);
    }
}
