<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use App\Models\Prm\Amenity;
use Illuminate\Http\Request;
use JDV;
use XAuthService;

class AmenityController extends Controller
{
    protected $amenities;

    public function __construct()
    {
        $this->amenities = new Amenity();
    }

    public function saveAmenity(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->id ?? $req->amenity_id;
        $amenity = new Amenity($id, $ss);

        $res = $amenity->upsert($req->all());

        return JDV::raw($res);
    }

    
    public function getListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->amenities->getListPaginate($req->all(), $ss));
    }

    public function amenityDetails(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        if(!isset($req->id) || !is_numeric($req->id)){
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->amenities->amenityDetails($req->id));
    }

    public function getFormOptions(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        return JDV::result($this->amenities->getFormOptions($req->all(),$ss));
    }

    public function deleteAmenity(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->input('id');
        if (!$id || !is_numeric($id)) {
            return JDV::error('Invalid or missing ID');
        }

        $res = $this->amenities->deleteAmenity($id);

        return JDV::raw($res);
    }

    public function updateAmenityStatus(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->id ?? null;
        $amenity = new Amenity();
        $res = $amenity->updateAmenityStatus($req->status_id, $id,$ss);
        return JDV::raw($res);
    }

     public function option_select_all_amenity_info(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !== 200){
            return JDV::raw($ss);
        }
         $id = $req->amenity_id ?? $req->id;
        return JDV::result($this->amenities->getAmenityInfo($id,$ss));
    }
    public function checkAmenityReservation(Request $req){
        $ss = XAuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        return JDV::raw($this->amenities::checkAmenityReservation($req->amenity_id,$ss));
    }
}