<?php

namespace App\Http\Controllers\Ypg;

use App\Http\Controllers\Controller;
use App\Models\Ypg\TaskAssign;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class TaskAssignController
{
    public function save(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->task_assign_id ?? $req->id;
        $taskAssign = new TaskAssign($id, $ss);
        $res = $taskAssign->save($req->all());
        return JDV::raw($res);
    }

    public function getList(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $taskAssign = new TaskAssign();
        return JDV::result($taskAssign->getList($req->all(), $ss));
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
        $taskAssign = new TaskAssign();
        return JDV::result($taskAssign->getDetails($req->id, $ss));
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $taskAssign = new TaskAssign();
        return JDV::result($taskAssign->getFormOptions($req->id, $ss));
    }

    public function delete(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? null;
        $taskAssign = new TaskAssign();
        $res = $taskAssign->delete($id);
        return JDV::raw($res);
    }

    public function updateStatus(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? null;
        $taskAssign = new TaskAssign();
        $res = $taskAssign->updateStatus($req->status_id, $id,$ss);
        return JDV::raw($res);
    }
}
