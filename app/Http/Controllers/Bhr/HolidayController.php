<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\Holiday;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class HolidayController extends Controller
{
    protected $holiday;
    public function __construct()
    {
        $this->holiday = new Holiday();
    }
    function saveHoliday(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);

        if ($ss->status_code != 200) return JDV::raw($ss);
        $holiday = new Holiday($req->id, $ss);
        $res = $holiday->save($req->all());
        return JDV::raw($res);
    }
    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->holiday->getFormOptions($req->id, $ss));
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
        return JDV::result($this->holiday->getDetails($req->id, $ss));
    }
    public function deleteHoliday(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->holiday->deleteHoliday($req->id, $ss));
    }
    public function getHolidayListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code != 200) return JDV::raw($ss);
        $holiday = new Holiday($req->id, $ss);
        $data = $holiday->getHolidayListPaginate($req->all(), $ss);
        return JDV::result($data);
    }
    public function getHolidayList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $war = new Holiday();
        return JDV::result($war->getHolidayList($req->all(), $ss));
    }
}
