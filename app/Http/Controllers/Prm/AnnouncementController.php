<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Prm\Announcement;
use JDV;
use XAuthService;

class AnnouncementController extends Controller
{
    protected $announcements;

    public function __construct()
    {
        $this->announcements = new Announcement();
    }

    public function save(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->announcement_id;
        $announcement = new Announcement($id, $ss);
        $res = $announcement->saveAnnouncement($req->all());
        return JDV::raw($res);
    }

    public function getListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->announcements->getListPaginate($req->all(), $ss));
    }

    public function details(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $announcement_id = $req->id ?? $req->announcement_id;
        if (!isset($announcement_id) || !is_numeric($announcement_id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->announcements->announcementDetails($announcement_id));
    }

    public function delete(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $announcement_id = $req->id ?? $req->announcement_id;
        if (!isset($announcement_id) || !is_numeric($announcement_id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::raw($this->announcements->deleteAnnouncement($announcement_id, $ss));
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->announcements->getFormOptions($req->id, $ss));
    }
}
