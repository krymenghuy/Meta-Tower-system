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
    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;

    }


    public function saveBuilding($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $subs_id = $ss->subs_id ?? getCurrentSubsId(true);

        $v_rule = [
            'name' => '1|string|0-255',
            'total_floor' => '1|number',
            'address' => '1|string|0-250',
            'total_area' => '1|number',
            'total_space' => '0|number',
            'occupancy' => '0|number',
        ];

        $allowSign = ['$', '#', '@', '!', '.', '-', ',', '_', '=', '?'];
        $res = DBX::validateObject($arr, $v_rule, true, ['name' => $allowSign, 'address' => $allowSign], $ss->lang, false);
        if ($res->error) {
            return DV::error($res->error);
        }
        $inputs = $res->values;
        $isCreate = !$id || $id == 0;
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
            $str_search = DBX::whereLowerCase('b.name', "%$search_value%", 'like');
        }

        $query = DB::table('buildings as b')
            // ->join('um_branches as um', 'um.id', '=', 'b.campus_id')
            ->whereRaw($str_search)
            ->selectRaw('b.id, b.name,b.address, b.total_floor, b.total_area, b.total_space,b.updated_at, b.update_user')
            ->orderBy('b.id', 'asc');

        $clone_query = clone $query;
        $count = $clone_query->count('b.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach ($rows as $row) {
            setOfficialDates($row, [''], ['updated_at'], []);
        }
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public static function buildingDetails($id)
    {
        $row = DB::table('buildings as b')
            ->where('b.id', $id)
            ->selectRaw('b.id, b.name, b.total_floor, b.total_space, b.total_area,b.address')
            ->first();

        return $row;
    }

    public function getFormOptions($id, $building_id = null)
    {
        $building_details = null;
        $floor_details = null;

        if ($id && is_numeric($id) && (!$building_id || !is_numeric($building_id))) {
            $building_details = self::buildingDetails($id) ?? null;
        }

        if ($id && is_numeric($id) && $building_id && is_numeric($building_id)) {
            $floor_details = DB::table('building_floors as bf')
                ->join('floors as f', 'f.id', '=', 'bf.floor_id')
                ->where('bf.building_id', $building_id)
                ->where('f.id', $id)
                ->selectRaw('f.id,f.floor_number,f.name,bf.description,bf.building_id')
                ->first();
        }

        if ($building_id && is_numeric($building_id)) {
            if (!$floor_details) {
                $max_floor_no = DB::table('building_floors as bf')
                    ->join('floors as f', 'f.id', '=', 'bf.floor_id')
                    ->where('bf.building_id', $building_id)
                    ->max('f.floor_number');

                $next_floor_no = ($max_floor_no) + 1;
                if ($next_floor_no <= 0) {
                    $next_floor_no = 1;
                }

                $floor_details = (object) [
                    'floor_number' => $next_floor_no,
                    'name' => "Floor {$next_floor_no}",
                ];
            }
        }

        return (object) [
            'building_details' => $building_details,
            'floor_details' => $floor_details,
        ];
    }

    public function deleteBuilding($id = null)
    {
        $id = $id ?? $this->id;
        $check_space = DB::table('building_spaces')->where('building_id', $id)->exists();
        if ($check_space) {
            return DV::error('Cannot delete building because it has associated spaces.');
        }
        $deleted = DB::table('buildings')->where('id', $id)->delete();

        return $deleted
            ? DV::depends(['action' => 'deleted'], 'Delete successful')
            : DV::error('Delete failed.');
    }


    public function getListFloor($id, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $cols = 'bf.id,bf.building_id,b.name as building_name,bf.floor_id,f.name as floor_name,f.floor_number as floor_no,bf.description,bf.status_id,bf.update_user,bf.updated_at';
        $rows = DB::table('building_floors as bf')
            ->join('buildings as b', 'b.id', '=', 'bf.building_id')
            ->join('floors as f', 'f.id', '=', 'bf.floor_id')
            ->where('bf.building_id', $id)
            ->selectRaw($cols)
            ->orderByRaw('bf.id ASC')->get();
        foreach ($rows as $row) {
            $amenity_count = DB::table('amenities')->where('building_id', $row->building_id)->where('floor_id', $row->floor_id)->count();
            $space_count = DB::table('building_spaces')->where('building_id', $row->building_id)->where('floor_id', $row->floor_id)->count();
            $row->total_space = $space_count + $amenity_count;
            setOfficialDates($row, [''],['updated_at'],[]);
        }
        return $rows;
    }
    public function addFloor($arr = [], $building_id = null, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;

        if ((!isset($arr['building_id']) || !$arr['building_id']) && $building_id) {
            $arr['building_id'] = $building_id;
        }

        $v_rule = [
            'id' => '0|number',
            'name' => '0|string|1-250',
            'floor_number' => '0|number',
            'building_id' => '1|number',
            'description' => '0|string|0-250',
        ];

        $allowSign = ['$', '#', '@', '!', '.', '-', ',', '_', '=', '?'];
        $res = DBX::validateObject($arr, $v_rule, true, ['description' => $allowSign], $ss->lang, false);

        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $d = (object) $inputs;
        $floor_id = $d->id ?? 0;
        $isCreate = $floor_id <= 0;

        $building = DB::table('buildings')
            ->where('id', $d->building_id)
            ->first();

        if (!$building) {
            return DV::error("Building not found.");
        }

        $floor_number = isset($d->floor_number) && is_numeric($d->floor_number)
            ? (int) $d->floor_number
            : 0;

        if ($isCreate && $floor_number <= 0) {
            $max_floor_no = DB::table('building_floors as bf')
                ->join('floors as f', 'f.id', '=', 'bf.floor_id')
                ->where('bf.building_id', $d->building_id)
                ->max('f.floor_number');

            $floor_number = ((int) $max_floor_no) + 1;
            if ($floor_number <= 0) {
                $floor_number = 1;
            }
        }

        if ($floor_number <= 0) {
            return DV::error("Floor number is required.");
        }

        if ($floor_number > $building->total_floor) {
            return DV::error("Floor number cannot exceed total floors ({$building->total_floor}).");
        }

        $expectedName = "Floor " . $floor_number;
        $name = $d->name ?? null;
        $name = is_string($name) ? trim($name) : $name;

        if ($isCreate && !$name) {
            $name = $expectedName;
        }

        if ($name !== $expectedName) {
            return DV::error("Floor name must be '{$expectedName}'.");
        }

        $existingFloor = DB::table('building_floors as bf')
            ->join('floors as f', 'f.id', '=', 'bf.floor_id')
            ->where('bf.building_id', $d->building_id)
            ->where('f.floor_number', $floor_number)
            ->when($floor_id > 0, function ($q) use ($floor_id) {
                $q->where('f.id', '<>', $floor_id);
            })
            ->first();

        if ($existingFloor) {
            return DV::error("Floor number '{$floor_number}' already exists in this building.");
        }

        $floor_data = [
            'name' => $expectedName,
            'floor_number' => $floor_number,
        ];

        // Reuse a single master floor per floor_number to prevent duplicate rows in floors table.
        $masterFloor = DB::table('floors')
            ->where('floor_number', $floor_number)
            ->first();

        if ($masterFloor) {
            $floor_id = $masterFloor->id;

            if (($masterFloor->name ?? '') !== $expectedName) {
                DBX::saveData($ss, 'floors', ['id' => $floor_id], ['name' => $expectedName], [], 1);
            }
        } else {
            $floor_id = DBX::saveData($ss, 'floors', ['id' => 0], $floor_data, [], 1);
        }

        if (!$floor_id) {
            return DV::error($floor_id ? 'Update failed.' : 'Create failed.');
        }

        DBX::saveData(
            $ss,
            'building_floors',
            ['floor_id' => $floor_id, 'building_id' => $d->building_id],
            [
                'floor_id' => $floor_id,
                'building_id' => $d->building_id,
                'description' => $d->description ?? null,
            ],
            [],
            1
        );

        return DV::depends(1, [
            'floor_id' => $floor_id,
            'building_id' => $d->building_id,
            'description' => $d->description ?? null,
            'floor_data' => $floor_data
        ]);
    }

    public function deleteFloor($id = null)
    {
        $id = $id ?? $this->id;
        $check_floor = DB::table('floors')->where('id', $id)->exists();
        if ($check_floor) {
            return DV::error('Cannot delete floor.');
        }
        $deleted = DB::table('building_floors')->where('floor_id', $id)->delete();

        return $deleted ? DV::depends(['action' => 'deleted'], 'Delete successful') : DV::error('Delete failed.');
    }
}
