<?php

namespace App\Http\Controllers\Mhr;

use App\Http\Controllers\Controller;
use App\Models\Mhr\ExitForm;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class ExitFormController extends Controller
{
    protected $exitFormModel;

    public function __construct()
    {
        $this->exitFormModel = new ExitForm();
    }

    public function saveExitForm(Request $req)
    {
        $id = $req->id ?? null;
        $prn_code = $id ? 283 : 282;
        $ss = XAuthService::verifyAuth($req, $prn_code);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $exitForm = new ExitForm($id, $ss);
        $res = $exitForm->save($req->all(), $id, $ss);
        return JDV::raw($res);
    }

    public function saveExitItem(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->item_id ?? $req->checkpoint_id;
        $res = ExitForm::saveExitItem($req->all(), $id, $ss);
        return JDV::raw($res);
    }

    public function updateCheckboxItem(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, 285);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $res = ExitForm::updateCheckboxItem($req->all(), $ss);
        return JDV::raw($res);
    }

    public function getExitFormListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->exitFormModel->getExitFormListPaginate($req->all(), $ss));
    }

    public function getCheckpoints(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, 285);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $form_id = $req->id ?? $req->form_id;
        return JDV::result($this->exitFormModel->getCheckpoints($form_id));
    }

    public function getDetails(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, 285);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result(ExitForm::getDetails($req->id, $ss));
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result(ExitForm::getFormOptions($req->id, $ss));
    }

    public function delete(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, 284);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->exitFormModel->delete($req->id, $ss);
        return JDV::raw($res);
    }
}
