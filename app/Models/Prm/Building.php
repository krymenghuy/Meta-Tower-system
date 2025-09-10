<?php

namespace App\Models\Prm;

use App\Models\Ypg\GeneralSettings;
use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use XPublicStorage;
class Building //extends Model
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'building';
    public function __construct($id = null, $userInfo = null){
        $this->id = $id;
        $this->userInfo = $userInfo;

    }

    public function saveBuilding($arr = [],$id=null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'name' => '1|string|0-150',
            'floors' => '0|number'
        ];
    }
    public function getListBuilding($arr, $ss = null)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $search_value = $d->search_value ?? null;
        $status_id = $d->status_id ?? null;


        $str_search = '1=1';
        $str_moreWhere = '1=1';
        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(buil.name LIKE '%" . $search_value . "%' OR buil.code LIKE '%" . $search_value . "%')";
        }
        if($status_id){
            $str_moreWhere .= ' AND buil.status_id =\'' . $status_id . '\'';
        }
        $updated_at = DBX::formatTime("buil.updated_at", 'updated_at');
        $telegram_link = "CONCAT('https://t.me/+', REPLACE(REPLACE(REPLACE(buil.phone_number, '+', ''), ' ', ''), '-', '')) AS telegram_link";
        $query = DB::table('building as buil')
            ->join('building_statuses as ss', 'ss.id', '=', 'buil.status_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw("
                buil.id,
                buil.code,
                buil.update_user,
                $updated_at,
                buil.name,
                buil.sex,
                buil.role,
                buil.floors,
                buil.zones,
                buil.phone_number,
                buil.status_id,
                ss.name as status,
                $telegram_link
            ")
            ->orderBy('buil.id', 'DESC');

        $clone_query = clone $query;
        $count = $clone_query->count('buil.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
     
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public function buildingDetails($id, $ss=null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $row = DB::table('building as buil')
            ->join('building_statuses as ss','ss.id','=','buil.status_id')
            ->where('ss.id',$id)
            ->selectRaw('buil.id,buil.name,buil.sex,buil.role,buil.phone_number,buil.floors,buil.zones,buil.status_id,ss.name as status')->first();
            return $row;

    }

    public function getFormOptions($id,$ss){
        $building_details = self::buildingDetails($id) ?? null;
        return (object)[
            'building_details' => $building_details,
            'statuses' => GeneralSettings::options_building_status($ss),
        ];
    }

    public function deleteBuilding($id){
        $id = $id ?? $this->id;
        $deleted = DB::table('building')->where('id',$id)->delete();
        if($deleted){
            return DV::depends(1,['id'=>$id]);
        }return Dv::error('Error delete buiding...!');
    }

    public function updatebuildingStatus($status_id,$id = null, $ss = null){
        $id = $id ?? $this->id;

        $ss = $ss ? $ss : $this->userInfo;
        $status = DB::table('building')->where('id',$id)->value('status_id');
        if($status == $status_id){
            return DV::error('It is the same current status');
        }
        $update = DB::table('building')->where('id',$id)->update([
            'status_id' =>$status_id,
            'update_user' => $ss->full_name,
            'updated_at' =>getNowTime(),
            'update_uid' =>$ss->user_id
        ]);
        return DV::depends($update,['Building','updated']);
    }


}
