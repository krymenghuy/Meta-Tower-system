<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use App\Models\Prm\Reservations;
use Illuminate\Http\Request;
use JDV;
use XAuthService;

class ReservationsController extends Controller
{
    protected $reservation;

    public function __construct()
    {
        $this->reservation = new Reservations();
    }

    public function saveReservation(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->id ?? $req->reservation_id;
        $reservation = new Reservations($id, $ss);

        $res = $reservation->upsert($req->all());

        return JDV::raw($res);
    }

    public function getListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

         return JDV::result($this->reservation->getListPaginate($req->all(), $ss));
    }

    public function reservationDetails(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        if(!isset($req->id) || !is_numeric($req->id)){
            return JDV::error('Invalid ID');
        }
        
        return JDV::result($this->reservation->reservationDetails($req->id));
        
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->reservation->getFormOptions($req->id,$ss));
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

        $res = $this->reservation->deleteReservation($id);

        return JDV::raw($res);
    }

    public function updateReservationStatus(Request $request)
    {
        $ss = XAuthService::verifyAuth($request, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $request->input('id');
        $status_id = $request->input('status_id');

        if (!$id || !is_numeric($id) || !$status_id || !is_numeric($status_id)) {
            return JDV::error('Missing or invalid id/status_id');
        }

        $result = $this->reservation->updateReservationStatus($status_id, $id, $ss);

        return JDV::raw($result);
    }

    public function option_select_amenity_info(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !== 200){
            return JDV::raw($ss);
        }
         $id = $req->tenant_id ?? $req->id;
        return JDV::result($this->tenants->getAmenityInfo($id,$ss));
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

        $res = $this->reservation->cancelReservation($id, $ss);

        return JDV::raw($res);
    }


}