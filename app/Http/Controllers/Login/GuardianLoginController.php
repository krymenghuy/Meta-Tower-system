<?php

namespace App\Http\Controllers\Login;

use App\Http\Controllers\Controller;
use App\Models\JDV;
use App\Models\MobileApi\MobileApi;
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
            $p = MobileApi::getProfile($result->user);
            if($p){
                $result->user->image_url =$p->image_url;
                $result->notif_public_topic =$p->notif_public_topic;
                $result->notif_private_topic=$p->notif_private_topic;
            }else return JDV::error('This login name does not have a corresponding parent profile information');
            // $result->user->image_url = \App\Models\PublicStorage::getProfilePhoto_url($result->user->branch_id, $result->user->user_class, $result->user->official_id);
        }
        return $result;
    }

    function getGuardianProfile(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code != 200) return $ss;

        $d = new MobileApi();
        $profile = $d->guardianProfile($ss);
        return JDV::result($profile);
    }

    function changePasswords(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code != 200) return $ss;

        $d = new MobileApi();
        $change = $d->changePassword($req->all(),$ss);
        return JDV::result($change);
    }

    function changeProfile(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code != 200) return $ss;

        $d = new MobileApi();
        $change = $d->changeProfile($req->all(),$ss);
        return JDV::result($change);
    }
}
