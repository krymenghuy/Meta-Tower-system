<?php

namespace App\Http\Controllers\Mhr;

use App\Http\Controllers\Controller;
use App\Models\Mhr\ExitFormItem;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class ExitFormItemController extends Controller
{

    protected $emp_exit_items;
    public function __construct()
    {
        $this->emp_exit_items = new ExitFormItem();
    }
    function saveExitFormItem(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $res = $this->emp_exit_items->save($req->form_item, $ss, $req->all());
        return JDV::raw($res);
    }
    public function getList(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->emp_exit_items->getList($req->all(), $ss));
    }
    public function getAllList(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->emp_exit_items->getAllList($req->all(), $ss));
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
        return JDV::result($this->emp_exit_items->getDetails($req->id, $ss));
    }
    public function getExitFormItemOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->emp_exit_items->getFormOptions($req->id, $ss));
    }

    public function deleteExitFormItem(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->emp_exit_items->delete($req->id, $ss);
        return JDV::raw($res);
    }
}
