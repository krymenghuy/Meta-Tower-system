<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use App\Models\Prm\BuildingSpace;
use Illuminate\Http\Request;
use JDV;
use XAuthService;

class BuildingSpaceController extends Controller
{
    protected $building_spaces;

    public function __construct(){
        $this->building_spaces = new BuildingSpace();
    }

    public function saveBuildingSpace(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->space_id;
        $building_space = new BuildingSpace($id, $ss);
        $res = $building_space->saveBuildingSpace($req->all());
        return JDV::raw($res);

    }
    
}
