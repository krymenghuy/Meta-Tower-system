<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\ExitForm;
use App\Models\Bhr\ExitFormItem;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class ExitFormController extends Controller
{

    protected $exit_form;
    public function __construct()
    {
        $this->exit_form = new ExitForm();
    }
    function saveExitForm(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);

        if ($ss->status_code != 200) return JDV::raw($ss);
        $exit_form = new ExitForm($req->id, $ss);
        $id = $req->id ?? $req->id;
        $res = $exit_form->save($req->all(),$id, $ss);
        return JDV::raw($res);
    }
    function saveExitItem(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $res = ExitForm::saveExitItem($req->all(), $ss);
        return JDV::raw($res);
    }
    public function getList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->exit_form->getList($req->all(), $ss));
    }

    public function getCheckpoints(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $form_id = $req->id ?? $req->form_id;
        return JDV::result($this->exit_form->getCheckpoints($form_id));
    }

    public function getDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->exit_form->getDetails($req->id, $ss));
    }
    public function getExitFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->exit_form->getFormOptions($req->id, $ss));
    }

    public function delete(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->exit_form->delete($req->id, $ss);
        return JDV::raw($res);
    }
}
