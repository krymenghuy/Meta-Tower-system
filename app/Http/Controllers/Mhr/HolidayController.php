<?php

namespace App\Http\Controllers\Mhr;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use JDV;
use XAuthService;
use App\Models\Mhr\Holiday;

class HolidayController extends Controller
{
   protected $holiday;
    public function __construct()
    {
        $this->holiday = new Holiday();
    }
    function saveHoliday(Request $req)
    {
        $id = $req->id ?? null;
        $ss = XAuthService::verifyAuth($req, -1);

        if ($ss->status_code != 200) return JDV::raw($ss);
        $holiday = new Holiday($req->id, $ss);
        $res = $holiday->save($req->all());
        return JDV::raw($res);
    }
    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->holiday->getFormOptions($req->id, $ss));
    }
    public function getDetails(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        // Assuming id is passed in the request (POST body), access it like this
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->holiday->getDetails($req->id, $ss));
    }
    public function deleteHoliday(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, 263);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->holiday->deleteHoliday($req->id, $ss);
        return JDV::raw($res);
    }
    public function getHolidayListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code != 200) return JDV::raw($ss);
        $holiday = new Holiday($req->id, $ss);
        $data = $holiday->getHolidayListPaginate($req->all(), $ss);
        return JDV::result($data);
    }
    public function getHolidayList(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $war = new Holiday();
        return JDV::result($war->getHolidayList($req->all(), $ss));
    }
}
