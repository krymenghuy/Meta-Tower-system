<?php

namespace App\Http\Controllers\Mhr;

use App\Http\Controllers\Controller;
use App\Models\Mhr\ExitForm;
use App\Models\Mhr\ExitFormItem;
use JDV;
use XAuthService;
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
        $id = $req->id ?? $req->id;
        $prn_code = $id ? 282 : 283;
        $ss = XAuthService::verifyAuth($req, $prn_code);

        if ($ss->status_code != 200) return JDV::raw($ss);
        $exit_form = new ExitForm($req->id, $ss);
        $res = $exit_form->save($req->all(),$id, $ss);
        return JDV::raw($res);
    }

    function saveExitItem(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $id = $req->id ?? $req->item_id ?? $req->checkpoint_id;
        $res = ExitForm::saveExitItem($req->all(), $id,$ss);
        return JDV::raw($res);
    }
    function updateCheckboxItem(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, 285);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $id = $req->id ?? $req->item_id ?? $req->checkbox_item;
        $res = ExitForm::updateCheckboxItem($req->all(), $id);
        return JDV::raw($res);
    }
    public function getList(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->exit_form->getList($req->all(), $ss));
    }

    public function getCheckpoints(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, 285);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $form_id = $req->id ?? $req->form_id;
        return JDV::result($this->exit_form->getCheckpoints($form_id));
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
        return JDV::result($this->exit_form->getDetails($req->id, $ss));
    }
    public function getExitFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->exit_form->getFormOptions($req->id, $ss));
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
        $res = $this->exit_form->delete($req->id, $ss);
        return JDV::raw($res);
    }
}
