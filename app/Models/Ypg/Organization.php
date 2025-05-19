<?php

namespace App\Models\Ypg;

use DV;
use DBX;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class Organization //extends Model
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
        return DB::table('organizations')->where('id', $id)->selectRaw($columns)->first();
    }

    public function save($org, $ss, $arr)
    {
        $id = $this->id ?? ($arr['id'] ?? null);
        $ss = $ss ?? $this->userInfo;

        $validationRules = [
            'id' => '0|identity=1',
            'name' => '1|string|0-100',
            'address' => '0|string|0-250'
        ];

        $restrictedChars = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ','];

        $validationResult = DBX::validateObject($arr, $validationRules, true, ['name' => $restrictedChars], $ss->lang, false);

        if ($validationResult->error) {
            return DV::error($validationResult->error);
        }

        $inputs = $validationResult->values;

        $existingOrg = DB::table('organizations')
        ->where('name', $inputs['name'])
        ->first();

        if ($id) {
            if ($existingOrg && $existingOrg->id !== $id) {
                return DV::error('Update failed: Organization name already exists.');
            }

            $updated = DB::table('organizations')
            ->where('id', $id)
            ->update($inputs);

            return $updated
            ? DV::depends($id, ['id' => $id], 'Update successful')
            : DV::error('Update failed.');
        } else {
            if ($existingOrg) {
                return DV::error('Create failed: School name already exists.');
            }

            $newId = DB::table('organizations')->insertGetId($inputs);

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
        $query = DB::table('organizations as org')
            ->selectRaw('org.id, org.name as org_name, org.address')
            ->orderBy('org.id', 'asc');


        if (!empty($params->search_value)) {
            $searchValue = $params->search_value;
            $query->where(function ($q) use ($searchValue) {
                $q->where('org.name', 'LIKE', "%{$searchValue}%");
            });
        }

        $total = $query->count();
        $organization = $query->skip($offset)->take($perPage)->get();

        return new LengthAwarePaginator($organization, $total, $perPage, $currentPage);
    }

    public static function getDetails($id)
    {
        return DB::table('organizations as org')
        ->selectRaw('org.id, org.name as org_name, org.address')
        ->where('org.id', $id)->get()
        ->first();
    }

    public function delete($id = null)
    {
        $id = $id ?? $this->id;
        $deleted = DB::table('organizations')->where('id', $id)->delete();

        return $deleted
        ? DV::depends($deleted, ['action' => 'deleted'])
        : DV::error('Delete failed.');
    }

    public static function getFormOptions($id)
    {
        $organize = $id ? self::getDetails($id) : null;

        return (object) [
            'organizations' => $organize,
        ];
    }

    public function getOrganizaiton($arr, $ss = null)
    {
        $params = (object) $arr;
        $branch_id = $ss->branch_id;

        $query = DB::table('organizations as org')
            ->selectRaw('org.id, org.name as org_name, org.address');

        if (!empty($params->search_value)) {
            $query->where('org.name', 'LIKE', "%{$params->search_value}%");
        }

        return $query->get();
    }
}