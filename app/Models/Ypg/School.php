<?php

namespace App\Models\Ypg;

use DV;
use DBX;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class School //extends Model
{
    protected $id;
    protected $userInfo;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function getProps($id, $props = [])
    {
        $columns = is_array($props) ? implode(',', $props) : $props;
        return DB::table('schools')->where('id', $id)->selectRaw($columns)->first();
    }

    public function save($school, $ss, $arr)
    {
        $id = $this->id ?? ($arr['id'] ?? null);
        $ss = $ss ?? $this->userInfo;

        $validationRules = [
            'id' => '0|identity=1',
            'name' => '1|string|0-150',
            'location' => '0|string|0-250',
            'established_year' => '0|year',
        ];

        $restrictedChars = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ','];

        $validationResult = DBX::validateObject($arr, $validationRules, true, ['name' => $restrictedChars], $ss->lang, false);

        if ($validationResult->error) {
            return DV::error($validationResult->error);
        }

        $inputs = $validationResult->values;

        $existingItem = DB::table('schools')
        ->where('name', $inputs['name'])
        ->first();

        if ($id) {
            if ($existingItem && $existingItem->id !== $id) {
                return DV::error('Update failed: School name already exists.');
            }

            $updated = DB::table('schools')
            ->where('id', $id)
            ->update($inputs);

            return $updated
            ? DV::depends($id, ['id' => $id], 'Update successful')
            : DV::error('Update failed.');
        } else {
            if ($existingItem) {
                return DV::error('Create failed: School name already exists.');
            }

            $newId = DB::table('schools')->insertGetId($inputs);

            return $newId
            ? DV::depends($newId, ['id' => $newId], 'Create successful')
            : DV::error('Create failed.');
        }
    }

    public function getList($arr, $ss = null)
    {
        $params = (object) $arr;
        $currentPage = $params->current_page ?? 1;
        $perPage = $params->per_page ?? 10;
        $offset = ($currentPage - 1) * $perPage;
        $query = DB::table('schools as sc')
            ->selectRaw('sc.id, sc.name as school_name, sc.location, sc.established_year')
            ->orderBy('sc.id', 'asc');


        if (!empty($params->search_value)) {
            $searchValue = $params->search_value;
            $query->where(function ($q) use ($searchValue) {
                $q->where('sc.name', 'LIKE', "%{$searchValue}%");
            });
        }

        $total = $query->count();
        $Schools = $query->skip($offset)->take($perPage)->get();

        return new LengthAwarePaginator($Schools, $total, $perPage, $currentPage);
    }

    public static function getDetails($id)
    {
        return DB::table('schools as sc')
        ->selectRaw('sc.id, sc.name as school_name, sc.location, sc.established_year')
        ->where('sc.id', $id)->get()
        ->first();
    }

    public function delete($id = null)
    {
        $id = $id ?? $this->id;
        $deleted = DB::table('schools')->where('id', $id)->delete();

        return $deleted
        ? DV::depends($deleted, ['action' => 'deleted'])
        : DV::error('Delete failed.');
    }

    public static function getFormOptions($id)
    {
        $checkPoints = $id ? self::getDetails($id) : null;

        return (object) [
            'schools' => $checkPoints,
        ];
    }

    public function getSchoolList($arr, $ss = null)
    {
        $params = (object) $arr;
        $branch_id = $ss->branch_id;

        $query = DB::table('schools as sc')
            ->selectRaw('sc.id, sc.name as school_name, sc.location, sc.established_year');

        if (!empty($params->search_value)) {
            $query->where('sc.name', 'LIKE', "%{$params->search_value}%");
        }

        return $query->get();
    }
}