<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\ExitFormItem;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class ExitFormItemController extends Controller
{

    protected $emp_exit_items;
    public function __construct(ExitFormItem $emp_exit_items)
    {
        $this->emp_exit_items = $emp_exit_items;
    }
    function saveExitFormItem(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $res = $this->emp_exit_items->save($req->emp_exit_check_point, $ss, $req->all());
        return JDV::raw($res);
    }
    public function getExitFormItemPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->emp_exit_items->getExitFormItemPaginate($req->all(), $ss));
    }
    public function getDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        // Assuming id is passed in the request (POST body), access it like this
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->emp_exit_items->getDetails($req->id, $ss));
    }
    public function getExitFormItemOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->emp_exit_items->getFormOptions($req->id, $ss));
    }

    public function deleteExitFormItem(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->emp_exit_items->deleteExitFormItem($req->id, $ss));
    }
}
