<?php

namespace App\Models\Prm;

use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use Vsd\Database\DBX;
use Vsd\Response\DV;
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
        $branch_id = $ss->branch_id;
        $v_rule = [
            'name' => '1|string|0-100|text= Amenity name must be provided',
            'building_id' => '1|number|exists=buildings.id',
            'floor_id' => '1|number|exists=floors.id',
            'category_id' => '1|number|exists=amenity_categories.id',
            'access_level' => '1|string|0-50|default=All Tenants|text= Access level must be provided',
            'requires_booking' => '1|choice|0,1',
            'max_capacity' => '0|number',
            'description' => '0|string',
            'code' => '0|string|max=50',
        ];
        $description_char = ['@',',','-','.','#'];
        $code_char = ['@', '.', '-', '_'];
        $res = DBX::validateObject( $arr, $v_rule, 1, ['name'=>$description_char,'description'=> $description_char, 'code' => $code_char], $ss->lang, 0, null );
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $d = (object) $inputs;

        // $d->requires_booking = isset($d->requires_booking) ? (int)$d->requires_booking : 0;

        if(!$id) {
            $exist = DB::table('amenities')
                ->where('name', $inputs['name'])
                ->exists();
            if($exist){
                return DV::error('Create failed: This Amenity name already exists');
            }
        } else {
            // Check duplicate name for update (exclude current id)
            $exist = DB::table('amenities')
                ->where('name', $inputs['name'])
                ->where('id', '<>', $id)
                ->exists();
            if($exist){
                return DV::error('Update failed: Another Amenity with this name already exists');
            }
        }

        if (!empty($d->code)) {
            $exists = DB::table('amenities')
                ->where('code', $d->code)
                ->when($id, fn($q) => $q->where('id', '<>', $id))
                ->exists();

            if ($exists)
                return DV::error('Create failed: This code already exists');
        }
        $floor = DB::table('floors')
            ->select('floor_number')
            ->where('id', $d->floor_id)
            ->first();

        if (!$floor)
            return DV::error('Invalid floor selected.');

        $created = !$id;

        $id = DBX::saveData($ss, 'amenities', ['id' => $id], $inputs, [], 1);

        if ($id && $created && empty($d->code)) {
            self::createAmenityCode(
                $branch_id,
                $d->building_id,
                $floor->floor_number,
                $id
            );
        }

        if ($id > 0) {
            return DV::depends(1, ['amenities' => $inputs, 'id' => $id]);
        }
        return DV::error('Error saving Amenity...!');
    }
    function createAmenityCode($branch_id, $building_id, $floor_number, $amenity_id)
    {
        $buildingName = DB::table('buildings')
            ->where('id', $building_id)
            ->value('name');
        $prefixLetters = 'B';
        if ($buildingName) {
            $words = explode(' ', $buildingName);
            $prefixLetters = '';
            foreach ($words as $word) {
                if (!empty($word)) {
                    $prefixLetters .= strtoupper(substr($word, 0, 1));
                }
            }
        }
        $floorPrefix = 'F' . $floor_number;
        $row = DB::table('amenity_code_control')
            ->where('branch_id', $branch_id)
            ->where('prefix', $floor_number)
            ->first();

        $next_num = $row ? $row->last_id + 1 : 1;
        $roomNumber = ($floor_number * 100) + $next_num;


        // $fullCode = $prefixLetters . '-' . $floorPrefix . '-R' . $roomNumber;
        // $fullCode = $floorPrefix . '-R-' . $roomNumber;
        $fullCode = 'AMN-' . $roomNumber;

        DB::table('amenities')
            ->where('id', $amenity_id)
            ->update(['code' => $fullCode]);
        if ($row) {
            DB::table('amenity_code_control')
                ->where('branch_id', $branch_id)
                ->where('prefix', $floor_number)
                ->update(['last_id' => $next_num]);
        } else {
            DB::table('amenity_code_control')
                ->insert([
                    'branch_id' => $branch_id,
                    'prefix' => $floor_number,
                    'last_id' => $next_num,
                ]);
        }

        return $fullCode;
    }
    static function checkDuplicateAmenityCode($building_id, $floor_id, $amenity_code, $amenity_id = null)
    {
        $query = DB::table('amenities as a')
            ->where('a.building_id', $building_id)
            ->where('a.floor_id', $floor_id)
            ->where('a.amenity_code', $amenity_code);

        if (!empty($amenity_id)) {
            $query->where('bs.id', '<>', $amenity_id);
        }

        return $query->value('id') ?: null;
    }

    public function getListPaginate($arr, $ss = null){
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $status_id = $d->status_id ?? null;
        $building_id = $d->building_id ?? null;
        $floor_id = $d->floor_id ?? null;
        $category_id = $d->category_id ?? null;
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
            $str_search = "(a.code LIKE '%" . $search_value . "%' OR a.name LIKE '%" . $search_value . "%')";
        }
        if ($building_id) {
            $str_moreWhere .= ' AND a.building_id = ' . $building_id;
        }
        if ($floor_id) {
            $str_moreWhere .= ' AND a.floor_id = ' . $floor_id;
        }
        if ($category_id) {
            $str_moreWhere .= ' AND a.category_id = ' . $category_id;
        }
        if($status_id){
            $str_moreWhere .= ' AND a.status_id =' . $status_id;
        }

        $query = DB::table('amenities as a')
            ->join('amenity_statuses as as', 'as.id', '=', 'a.status_id')
            ->join('amenity_categories as ac','ac.id','=','a.category_id')
            ->join('buildings as b','b.id','=','a.building_id')
            ->join('floors as f', 'f.floor_number', '=', 'a.floor_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw("a.id,a.name,a.code,a.description,a.building_id,b.name as building_name,a.floor_id,f.name as floor_number,a.category_id,ac.name as category,a.access_level,a.requires_booking,a.max_capacity,a.status_id,as.name as status,a.updated_at,a.update_user")
            ->orderBy('a.id','DESC');
        $clone_query = clone $query;
        $count = $clone_query->count('a.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach($rows as $row){
            $row = setOfficialDates($row,[''],['updated_at'],[]);
        }
        return new LengthAwarePaginator($rows,$count,$per_page,$current_page);
    }

    public static function amenityDetails($id){
        return DB::table('amenities as a')
            ->where('a.id',$id)
            ->selectRaw('a.id,a.name,a.code,a.building_id,a.floor_id,a.category_id,a.access_level,a.requires_booking,a.max_capacity,a.description,a.status_id')
            ->first();
    }

    public function getFormOptions($id, $ss = null){
        $ss = $ss ?? $this->userInfo;

        // $d = (object) $arr;
        // $id = $d->id ?? $this->id;
        $amenity_details = $id ? self::amenityDetails($id) : null;
        $building_id = $amenity_details ? ($amenity_details->building_id ?? null) : null;

        return (object) [
            'amenity_details' => $amenity_details,
            'amenity_statuses' => GeneralSettings::options_amenity_status($ss),
            'amenity_categories' => GeneralSettings::options_amenity_category($ss),
            'buildings' => GeneralSettings::options_building($ss),
            'floors' => GeneralSettings::options_floors($building_id)
        ];
    }

   
    public function deleteAmenity($id = null)
    {
        $id = $id ?? $this->id;
        $exists = DB::table('reservations')->where('amenity_id', $id)->exists();
        if ($exists) {
            return DV::error('Cannot delete because it has reservation records.');
        }
        $deleted = DB::table('amenities')->where('id', $id)->delete();
        if($deleted){
            DB::table('maintenances')->where('amenity_id', $id)->delete();
        }
        return $deleted ? DV::depends($deleted, ['action' => 'deleted']) : DV::error('Delete failed.');
    }

    function updateAmenityStatus($status_id, $id = null, $ss = null) {
        $ss = $ss ? $ss : $this->userInfo;
        $hasActiveReservation = DB::table('reservations')
            ->where('amenity_id', $id)
            ->where('status_id', '<=', 2)
            ->exists();

        if ($hasActiveReservation) {
            return DV::error('Cannot change status due to inprogress or upcoming reservations.');
        }
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
