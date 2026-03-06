<?php

namespace App\Models\Prm;

use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use DV;
use XPublicStorage;
use App\Models\Prm\GeneralSettings;
use Vsd\Vsloquent\VSModel;

class Amenity extends VSModel
{
    protected $table = 'amenities';
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function upsert($arr = [], $id = null, $ss = null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $v_rule = [
            'id' => '0|number',
            'name' => '1|string|0-100|text= Amenity name must be provided',
            'description' => '0|string',
            'floor' => '0|string|0-50',
            'location_detail' => '0|string|0-150',
            'access_level' => '0|string|0-50|default=All Tenants|text= Access level must be provided',
            'requires_booking' => '1|choice|0,1',
            'max_capacity' => '0|number',
            'is_available' => '0|choice|0,1',
            'status_id' => '0|number|default=1',
        ];
        $location_detail_char = ['@','.','-','_'];
        $description_char = ['@',',','-','.','#'];
        $res = DBX::validateObject( $arr, $v_rule, 1, ['name'=>$location_detail_char,'location_detail'=>$location_detail_char,'description'=> $description_char], $ss->lang, 0, null );
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $d = (object) $inputs;
        
        $d->requires_booking = isset($d->requires_booking) ? (int)$d->requires_booking : 0;
        $d->is_available     = isset($d->is_available)     ? (int)$d->is_available     : 1;


        if(!$id) {
            $exist = DB::table('amenities')
                ->where('name', $inputs['name'])
                ->exists();
            if($exist){
                return DV::error('Create failed: This amenity already exists');
            }
        } else {
            // Check duplicate name for update (exclude current id)
            $exist = DB::table('amenities')
                ->where('name', $inputs['name'])
                ->where('id', '<>', $id)
                ->exists();
            if($exist){
                return DV::error('Update failed: Another amenity with this name already exists');
            }
        }
        $id = DBX::saveData($ss, 'amenities', ['id'=>$id], $inputs, [], 1);
        if($id > 0){
            return DV::depends(1, ['amenity'=>$inputs, 'id'=>$id]);   // ← fixed typo ameniti es → amenity
        }
        return DV::error('Error saving amenity!');
    }

    public function getListPaginate($arr, $ss = null){
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $status_id = $d->status_id ?? null;
        $search_value = $d->search_value ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if(!is_numeric($current_page)){
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $str_search = "1=1";
        $str_moreWhere = '2=2';
        if($search_value){
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(a.name LIKE '%" . $search_value . "%' OR a.description LIKE '%" . $search_value . "%')";
        }
        if($status_id){
            $str_moreWhere .= ' AND a.status_id =' . $status_id;
        }
        
        $updated_at = DBX::formatTime("a.updated_at", 'updated_at');
        $query = DB::table('amenities as a')
            ->join('amenity_statuses as as', 'as.id', '=', 'a.status_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw("a.name,a.description,a.id,a.floor,a.location_detail,a.access_level,a.requires_booking,a.max_capacity,a.is_available,a.status_id,as.name as status,$updated_at,a.update_user")
            ->orderBy('a.id','DESC');
        $clone_query = clone $query;
        $count = $clone_query->count('a.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows,$count,$per_page,$current_page);
    }

    public static function amenityDetails($id,$ss = null){
        return DB::table('amenities as a')
            ->where('a.id',$id)
            ->selectRaw('a.id,a.name,a.floor,a.location_detail,a.access_level,a.requires_booking,a.max_capacity,a.is_available,a.description,a.status_id')
            ->first();
    }

    public static function getFormOptions($id,$ss){
        $amenity_details = $id ? self::amenityDetails($id) : null;
        return (object) [
            'amenity_details' => $amenity_details,
            'amenity_statuses' => GeneralSettings::options_amenity_status($ss)
        ];
    }

    public function deleteAmenity($id = null){
        $id = $id ?? $this->id;
        $deleted = DB::table('amenities')->where('id',$id)->delete();
        return $deleted ? DV::depends($deleted,['action'=>'deleted']) : DV::error('Delete failed.');
    }

    function updateAmenityStatus($status_id, $id = null, $ss = null) {
        $ss = $ss ? $ss : $this->userInfo;
        $currentStatus = DB::table('amenities')->where('id', $id)->value('status_id');
        if ($currentStatus == $status_id) {
            return DV::error('It is the same current status.');
        }
        $x = DB::table('amenities')->where('id', $id)->update([
            'status_id' => $status_id,
            'update_user'=>$ss->full_name,
            'updated_at'=>getNowTime(),
        ]);
        return DV::depends($x, ['amenity status', 'updated']);
    }

}