<?php

namespace App\Http\Controllers\Mhr;

use App\Http\Controllers\Controller;
use App\Models\Mhr\CheckPointCategory;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class CheckPointCategoryController extends Controller
{
    protected $check_point_categories;
    public function __construct()
    {
        $this->check_point_categories = new CheckPointCategory();
    }
    function save(Request $req)
    {
        $id = $req->id ?? null;
        $prn_code = $id ? 298 : 299;
        $ss = XAuthService::verifyAuth($req, $prn_code);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $res = $this->check_point_categories->save($id, $ss, $req->all());
        return JDV::raw($res);
    }
    public function getListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->check_point_categories->getListPaginate($req->all(), $ss));
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
        return JDV::result($this->check_point_categories->getDetails($req->id, $ss));
    }
    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->check_point_categories->getFormOptions($req->id, $ss));
    }

    public function delete(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, 300);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->check_point_categories->delete($req->id);
        return JDV::raw($res);
    }
    public function getAllList(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->check_point_categories->getList($req->all(), $ss));
    }
}
