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
    protected static $img_dir = 'buildings';
    public function __construct($id = null, $userInfo = null){
        $this->id = $id;
        $this->userInfo = $userInfo;

    }

  public function saveBuilding($arr=[], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $subs_id = $ss->subs_id ?? getCurrentSubsId(true);

        $v_rule = [
            'name' => '1|string|0-255',
            'floors' => '1|number',
        ];
        $allowSign = ['$', '#', '@', '!', '.', '-', '_', '=', '?'];
        $res = DBX::validateObject($arr, $v_rule, true, ['name' => $allowSign], $ss->lang, false);
        if ($res->error) {
            return DV::error($res->error);
        }
        $inputs = $res->values;
        $isCreate = !$id || $id == 0;
        if ($isCreate) {
            $existingBuilding = DB::table('buildings')
                ->where('name', $inputs['name'])
                ->where('id', '!=', $id)
                ->exists();

            if ($existingBuilding) {
                return DV::error('Update failed Another building with the same details already exists.');
            }
        }
        $id = DBX::saveData($ss, 'buildings', ['id' => $id], $inputs, [], 1);

        if ($id > 0) {
            return DV::depends(1, ['buildings' => $inputs, 'id' => $id]);
        }
        return DV::error($isCreate ? 'Create failed.' : 'Update failed.');
    }
     public function getListBuilding($arr, $ss = null)
    {
        $d = (object) $arr;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $search_value = $d->search_value ?? null;
        $str_search = '1=1';

        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
             $str_search = DBX::whereLowerCase('b.name',"%$search_value%",'like');
        }
     
        $updated_at = DBX::formatTime('b.updated_at','updated_at');
        $query = DB::table('buildings as b')
            // ->join('um_branches as um', 'um.id', '=', 'b.campus_id')
             ->whereRaw($str_search)
            ->selectRaw('b.id, b.name, b.floors, '.$updated_at.', b.update_user')
            ->orderBy('b.id', 'asc');

        $clone_query = clone $query;
        $count = $clone_query->count('b.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
       return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

 public static function buildingDetails($id)
    {
        $row = DB::table('buildings as b')
            ->where('b.id', $id)
            ->selectRaw('b.id, b.name, b.floors')
            ->first();
 
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
