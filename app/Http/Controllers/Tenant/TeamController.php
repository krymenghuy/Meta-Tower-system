<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Team;
use JDV;
use XAuthService;
use Illuminate\Http\Request;


class TeamController extends Controller
{ 
    protected $teams;
    public function __construct(){
        $this->teams = new Team();
    }

    public function saveTeamTenant(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $id = $req->team_id ?? $req->id;
        $team = new Team($id,$ss);
        $res = $team->createTeam($req->all(),$id);
        return JDV::raw($res);

    }

    public function saveTeamMember(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $id =  $req->id ?? null;
        $team = new Team($id,$ss);
        $res = $team->saveTeamMember($req->all(),$id);
        return JDV::raw($res);

    }
      public function getTeamList(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        return JDV::result($this->teams->getTeamList($req->all(),$ss));
    }


    public function getListTeamMemberPaginate(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        return JDV::result($this->teams->getListTeamMemberPaginate($req->all(),$ss));
    }

    public function getTeamDetails(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !== 200){
            return JDV::raw($ss);
        }
        if(!isset($req->id) || !is_numeric($req->id)){
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->teams->getTeamDetails($req->id));
    }
    public function getFormOptions(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $team = new Team();
        return JDV::result($team->getFormOptions($req->id,$ss));
    }

    public function deleteTeam(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->staff_id;
        $res = $this->teams->deleteTeamMember($id);
        return JDV::raw($res);
    }

    public function updateTeamStatus(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->staff_id;
        $status_id = $req->status_id;
        
        $status = \DB::table('teams')->where('id',$id)->value('status_id');
        if($status == $status_id){
            return DV::error('It is the same current status');
        }
        $update = \DB::table('teams')->where('id',$id)->update([
            'status_id' => $status_id,
            'update_user' => $ss->full_name,
            'updated_at' => getNowTime(),
            'update_uid' => $ss->user_id
        ]);
        return JDV::raw(DV::depends($update, ['Team Status', 'updated']));
    }

    public function deleteProfilePhoto(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $id = $req->tenant_id ?? $req->id;
        $team = new Team($id, $ss);
        $res = $team->deleteProfilePicture($id);
        return JDV::raw($res);
    }

    public function saveProfilePhoto(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $id = $req->tenant_id ?? $req->id;
        $photo = $req->photo ?? $req->img;
        $res = Team::createProfilePicture($photo, null, $id, $ss);
        return JDV::raw($res);
    }
}
