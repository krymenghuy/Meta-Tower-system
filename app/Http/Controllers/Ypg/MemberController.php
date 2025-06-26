<?php

namespace App\Http\Controllers\Ypg;

use App\Http\Controllers\Controller;
use App\Models\Ypg\Member;
use JDV;
use XAuthService;
use Illuminate\Http\Request;
class MemberController extends Controller
{
    public function save(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->member_id ?? $req->id;
        $member = new Member($id, $ss);
        $res = $member->save($req->all(),$id,$ss);
        return JDV::raw($res);
    }

    public function getList(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $member = new Member();
        return JDV::result($member->getList($req->all(), $ss));
    }

    public function getDetails(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $member = new Member();
        return JDV::result($member->getDetails($req->id, $ss));
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $member = new Member();
        return JDV::result($member->getFormOptions($req->id, $ss));
    }

    public function delete(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? null;
        $member = new Member();
        $res = $member->delete($id);
        return JDV::raw($res);
    }

    public function updateStatus(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? null;
        $member = new Member();
        $res = $member->updateStatus($req->status_id, $id,$ss);
        return JDV::raw($res);
    }

    function getProfilePhoto(Request $req){
        $ss = XAuthService::verifyAuth($req,-1);
        if($ss->status_code !== 200){
            return JDV::raw($ss);
        }
        $id = $req->member_id ?? $req->id;
        $img = Member::profilePicture($id,$ss);
        return JDV::result($img);
    }
    function saveProfilePhoto(Request $req){
        $ss = XAuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->member_id ?? $req->id;
        $photo = $req->photo ?? $req->img;
        $res = Member::saveProfilePicture($photo,null,$id,$ss);
        return JDV::raw($res);
    }
     function deleteProfilePhoto(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $id = $req->employee_id ?? $req->id;
        $emp = new Member($id, $ss);
        $res = $emp->deleteProfilePicture($id);
        return JDV::raw($res);
    }

    
}
