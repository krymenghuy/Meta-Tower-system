<?php

namespace App\Http\Controllers\Ypg;

use App\Models\Ypg\TaskType;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class TaskTypeController
{
    public function save(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->task_type_id ?? $req->id;
        $taskType = new TaskType($id, $ss);
        $res = $taskType->save($req->all());
        return JDV::raw($res);
    }

    public function getlist(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $taskType = new TaskType();
        return JDV::result($taskType->getList($req->all(), $ss));
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
        $taskType = new TaskType();
        return JDV::result($taskType->getDetails($req->id, $ss));
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $taskType = new TaskType();
        return JDV::result($taskType->getFormOptions($req->id, $ss));
    }

    public function delete(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? null;
        $taskType = new TaskType();
        $res = $taskType->delete($id);
        return JDV::raw($res);
    }

    public function updateStatus(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? null;
        $taskType = new TaskType();
        $res = $taskType->updateStatus($req->status_id, $id,$ss);
        return JDV::raw($res);
    }
}
