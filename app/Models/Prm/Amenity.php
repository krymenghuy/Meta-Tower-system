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

   public function upsert($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'name'            => '1|string|0-100|text=Amenity name must be provided.',
            'building_id'     => '1|number|exists=buildings.id|text=Please select a valid building.',
            'floor_id'        => '1|number|exists=floors.id|text=Please select a valid floor.',
            'category_id'     => '1|number|exists=amenity_categories.id|text=Please select a valid category.',
            'access_level'    => '1|string|0-50|default=All Tenants|text=Access level must be provided.',
            'requires_booking'=> '1|choice|0,1|text=Please select a valid bookable.',
            'max_capacity'    => '0|number',
            'description'     => '0|string',
            'code'            => '0|string|max=50',
        ];

        $chars = ['@', ',', '-', '.', '#'];
        $code_char = ['@', '.', '-', '_'];

        $res = DBX::validateObject(
            $arr,
            $v_rule,
            1,
            ['name'=>$chars, 'description'=>$chars, 'code'=>$code_char],
            $ss->lang,
            0,
            null
        );

        if ($res->error) return DV::error($res->error);

        $inputs = $res->values;
        $d = (object)$inputs;

        $d->name = trim($d->name);

        $exist = DB::table('amenities')
            ->whereRaw('LOWER(TRIM(name)) = ?', [strtolower($d->name)])
            ->where('building_id', $d->building_id)
            ->when($id, fn($q) => $q->where('id', '<>', $id))
            ->exists();

        if ($exist) {
            return DV::error($id 
                ? 'Another amenity with this name already exists'
                : 'This amenity name already exists'
            );
        }

        // if ($id && self::hasActiveReservation($id)) {
        //     return DV::error('Cannot modify this amenity because it is currently in use.');
        // }

        if (!empty($d->code)) {
            $exists = DB::table('amenities')
                ->where('code', $d->code)
                ->where('building_id', $d->building_id)
                ->when($id, fn($q) => $q->where('id', '<>', $id))
                ->exists();

            if ($exists) {
                return DV::error('This code already exists.');
            }
        }

        $floor = DB::table('floors')
            ->where('id', $d->floor_id)
            ->value('floor_number');

        if (!$floor) {
            return DV::error('Invalid floor selected.');
        }

        $created = !$id;

        $id = DBX::saveData($ss, 'amenities', ['id' => $id], $inputs, [], 1);

        if (!$id) {
            return DV::error('Error saving amenity.');
        }

        if ($created && empty($d->code)) {
            self::createAmenityCode(
                $branch_id,
                $d->building_id,
                $floor,
                $id
            );
        }

        BuildingSpace::updateTotalSpace($d->building_id);

        return DV::depends(1, [
            'amenities' => $inputs,
            'id' => $id
        ]);
    }
    function createAmenityCode($branch_id, $building_id, $floor_number, $amenity_id)
    {
        $building = DB::table('buildings')
            ->select('name', 'prefix')
            ->where('id', $building_id)
            ->first();

        $prefixLetters = trim($building->prefix ?? '');
        if (empty($prefixLetters)) {
            $buildingName = $building->name ?? 'B';
            $words = explode(' ', $buildingName);
            $prefixLetters = '';
            foreach ($words as $word) {
                if (!empty($word)) {
                    $prefixLetters .= strtoupper(substr($word, 0, 1));
                }
            }
        }
        $amenity_count = DB::table('amenities as a')
            ->join('floors as f', 'a.floor_id', '=', 'f.id')
            ->where('a.building_id', $building_id)
            ->where('f.floor_number', $floor_number)
            ->count();
        $row = DB::table('amenity_code_control')
            ->where('branch_id', $branch_id)
            ->where('building_id', $building_id)
            ->where('prefix', $floor_number)
            ->first();
        $next_num = $amenity_count;
        $roomNumber = ($floor_number * 100) + $next_num;
        $fullCode = strtoupper($prefixLetters) . '-A' . $roomNumber;
        DB::table('amenities')
            ->where('id', $amenity_id)
            ->update([
                'code' => $fullCode
            ]);

        if ($row) {

            DB::table('amenity_code_control')
                ->where('id', $row->id)
                ->update([
                    'last_id' => $next_num
                ]);

        } else {

            DB::table('amenity_code_control')
                ->insert([
                    'branch_id'   => $branch_id,
                    'building_id' => $building_id,
                    'prefix'      => $floor_number,
                    'last_id'     => $next_num,
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
            ->selectRaw("a.id,a.name,a.code,a.description,a.building_id,b.name as building_name,a.floor_id,f.name as floor_number,a.category_id,ac.name as category,a.access_level,a.requires_booking,a.max_capacity,a.is_reserved,a.status_id,as.name as status,a.updated_at,a.update_user")
            ->orderBy('a.status_id', 'ASC')
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
        $row = DB::table('amenities as a')
            ->where('a.id',$id)
            ->selectRaw('a.id,a.name,a.code,a.building_id,a.floor_id,a.category_id,a.access_level,a.requires_booking,a.max_capacity,a.description,a.is_reserved,a.status_id')
            ->first();
        
        return $row;
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

   
    // public function deleteAmenity($id = null)
    // {
    //     $id = $id ?? $this->id;

    //     if (self::hasActiveReservation($id)) {
    //         return DV::error('Cannot delete because it has reservation records.');
    //     }
    //     $deleted = DB::table('amenities')->where('id', $id)->delete();
    //     if($deleted){
    //         DB::table('maintenances')->where('amenity_id', $id)->delete();
    //     }
    //     return $deleted ? DV::depends($deleted, ['action' => 'deleted']) : DV::error('Delete failed.');
    // }

    public function deleteAmenity($id = null)
    {
        $id = $id ?? $this->id;

        if (self::hasActiveReservation($id)) {
            return DV::error('Cannot delete because it has reservation records.');
        }

        $amenity = DB::table('amenities')
            ->where('id', $id)
            ->first();

        if (!$amenity) {
            return DV::error('Amenity not found.');
        }

        DB::beginTransaction();

        try {

            // 1. Delete main record
            DB::table('amenities')
                ->where('id', $id)
                ->delete();

            // 2. Delete related data
            DB::table('maintenances')
                ->where('amenity_id', $id)
                ->delete();

            // 3. Get remaining amenities (ordered)
            $amenities = DB::table('amenities')
                ->where('building_id', $amenity->building_id)
                ->where('floor_id', $amenity->floor_id)
                ->orderBy('id', 'asc')
                ->get();

            // 4. Get building prefix
            $building = DB::table('buildings')
                ->select('name', 'prefix')
                ->where('id', $amenity->building_id)
                ->first();

            $prefix = trim($building->prefix ?? '');

            if (empty($prefix)) {
                $words = explode(' ', $building->name ?? 'B');
                $prefix = '';

                foreach ($words as $word) {
                    if (!empty($word)) {
                        $prefix .= strtoupper(substr($word, 0, 1));
                    }
                }
            }

            // 5. Rebuild codes in order
            $i = 1;

            foreach ($amenities as $a) {

                $roomNumber = ($amenity->floor_number ?? 1) * 100 + $i;

                $newCode = strtoupper($prefix) . '-A' . $roomNumber;

                DB::table('amenities')
                    ->where('id', $a->id)
                    ->update([
                        'code' => $newCode
                    ]);

                $i++;
            }

            DB::commit();

            return DV::success(['action' => 'deleted']);

        } catch (\Exception $e) {

            DB::rollBack();

            return DV::error('Delete failed.');
        }
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
   
    // public static function hasActiveReservation($amenity_id): bool
    // {
    //     $rows = DB::table('reservation as r')
    //         ->join('reservation_statuses as rs', 'rs.id', '=', 'r.status_id')
    //         ->join('tenants as t', 't.id', '=', 'r.tenant_id')
    //         ->where('r.amenity_id', $amenity_id)
    //         ->whereIn('r.status_id', [1, 2])
    //         ->selectRaw('r.id, r.booking_date, r.start_time, r.end_time, r.status_id, rs.name as status, t.name as tenant_name, t.phone_number. r.remarks')
    //         ->orderBy('r.booking_date', 'ASC')
    //         ->oderBy('r.start_time', 'ASC')
    //         ->get();

    //     foreach ($rows as $row) {
    //         $row = setOfficialDates($row, ['booking_date'], [], ['start_time', 'end_time']);
    //     }    

    //     return $rows;
    // }
   public static function checkAmenityReservation($id, $ss = null)
{
    $hasReservation = DB::table('reservations')
        ->where('amenity_id', $id)
        ->whereIn('status_id', [1, 2])
        ->exists();

    if ($hasReservation) {
        return DV::error('Amenity is currently reserved.');
    }

    return DV::success();
}
    public static function hasActiveReservation($amenity_id): bool
    {
        return DB::table('reservations')
            ->where('amenity_id', $amenity_id)
            ->whereIn('status_id', [1, 2]) 
            ->exists();
    }
}
