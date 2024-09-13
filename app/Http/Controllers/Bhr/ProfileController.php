<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\Profile;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    protected $profileModel;
    public function __construct(Profile $profileModel)
    {
        $this->profileModel = $profileModel;
    }
    public function saveProfile(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->profile_id ?? $req->id;
        $profile = new Profile($id, $ss);
        $res = $profile->save($req->all());
        return JDV::raw($res);
    }

    public function getProfileList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->profileModel->getProfile($ss));
    }

    public function getProfileListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        // Assuming 'perPage' is the second argument
        // $perPage = $req->input('perPage', 10);  // Default to 10 if not provided
        return JDV::result($this->profileModel->getProfilePaginate($req->all(), $ss));
    }

    public function deleteProfile(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->profileModel->delete($req->id, $ss));
    }

    public function getDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->profileModel->getDetails($req->id, $ss));

    }
}
