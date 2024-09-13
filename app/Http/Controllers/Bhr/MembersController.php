<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Bhr\Members;
use App\Models\JDV;
use App\Services\Umt\AuthService;
class MembersController extends Controller
{
    protected $memberModel;
    public function __construct(Members $memberModel)
    {
        $this->memberModel = $memberModel;
    }

    public function saveMember(Request $req)
    {
        $ss = AuthService::verifyAuth($req,-1);
       if($ss->status_code !==200) return JDV::raw($ss);

        $id = $req->member_id ?? $req->id;
        $member = new Members($id,$ss);
        $res = $member->save($req->all());
        return JDV::raw($res);
    }

    public function getMemberList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->memberModel->getMembers( $ss));
    }

    public function getMemberListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        // Assuming 'perPage' is the second argument
        // $perPage = $req->input('perPage', 10);  // Default to 10 if not provided
        return JDV::result($this->memberModel->getMembersPaginate( $req->all(),$ss));
    }

    public function deleteMember(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        
        return JDV::result($this->memberModel->delete($req->id, $ss));
    }
}
