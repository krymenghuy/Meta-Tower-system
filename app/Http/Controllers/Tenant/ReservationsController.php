<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use JDV;
use XAuthService;

class ReservationsController extends Controller
{
    protected $reservation;

    public function __construct()
    {
        $this->reservation = new Reservation();
    }

    public function saveReservation(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->id ?? $req->reservation_id;
        $reservation = new Reservation($id, $ss);

        $params = $req->all();
        if (isset($ss->tenant_id) && $ss->tenant_id) {
            $params['tenant_id'] = $ss->tenant_id;
        }

        $res = $reservation->upsert($params);

        return JDV::raw($res);
    }

    public function getListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $params = $req->all();

        if (isset($ss->tenant_id) && $ss->tenant_id) {
            $params['tenant_id'] = $ss->tenant_id;
        }

        return JDV::result($this->reservation->getListPaginate($params, $ss));
    }

    public function reservationDetails(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }

        $row = Reservations::reservationDetails($req->id);

        if (!$row) {
            return JDV::error('Reservation not found.');
        }

        // ✅ Prevent tenants from viewing another tenant's reservation
        if (isset($ss->tenant_id) && $ss->tenant_id && $row->tenant_id != $ss->tenant_id) {
            return JDV::error('Access denied.');
        }

        return JDV::result($row);
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->reservation->getFormOptions($req->id, $ss));
    }

    public function deleteReservation(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->input('id');
        if (!$id || !is_numeric($id)) {
            return JDV::error('Invalid or missing ID');
        }

        // ✅ Verify ownership before deleting
        if (isset($ss->tenant_id) && $ss->tenant_id) {
            $owner = DB::table('reservations')->where('id', $id)->value('tenant_id');
            if ($owner != $ss->tenant_id) {
                return JDV::error('Access denied.');
            }
        }

        $res = $this->reservation->deleteReservation($id);

        return JDV::raw($res);
    }

    public function updateReservationStatus(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->input('id');
        $status_id = $req->input('status_id');

        if (!$id || !is_numeric($id) || !$status_id || !is_numeric($status_id)) {
            return JDV::error('Missing or invalid id/status_id');
        }

        // ✅ Verify ownership before updating status
        if (isset($ss->tenant_id) && $ss->tenant_id) {
            $owner = DB::table('reservations')->where('id', $id)->value('tenant_id');
            if ($owner != $ss->tenant_id) {
                return JDV::error('Access denied.');
            }
        }

        $result = $this->reservation->updateReservationStatus($status_id, $id, $ss);

        return JDV::raw($result);
    }

    public function option_select_amenity_info(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        // ✅ If tenant, always use their own tenant_id
        $id = (isset($ss->tenant_id) && $ss->tenant_id)
            ? $ss->tenant_id
            : ($req->tenant_id ?? $req->id);

        return JDV::result($this->tenants->getAmenityInfo($id, $ss));
    }

    public function cancelReservation(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->input('id');
        if (!$id || !is_numeric($id)) {
            return JDV::error('Invalid or missing ID');
        }

        // ✅ Verify ownership before cancelling
        if (isset($ss->tenant_id) && $ss->tenant_id) {
            $owner = DB::table('reservations')->where('id', $id)->value('tenant_id');
            if ($owner != $ss->tenant_id) {
                return JDV::error('Access denied.');
            }
        }

        $res = $this->reservation->cancelReservation($id, $ss);

        return JDV::raw($res);
    }
}