<?php

namespace App\Models\Mhr;

use DBX;
use DV;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class CheckPointCategory //extends Model
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function getProps($id, $props = [])
    {
        $columns = is_array($props) ? implode(',', $props) : $props;
        return DB::table('check_point_categories')
            ->where('id', $id)
            ->selectRaw($columns)
            ->first();
    }

    public function save($id, $ss, $arr)
    {
        $id = $this->id ?? ($arr['id'] ?? null);
        $ss = $ss ?? $this->userInfo;

        $validationRules = [
            'id' => '0|identity=1',
            'name' => '1|string|0-250'
        ];
        $name = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ','];

        $res = DBX::validateObject($arr, $validationRules, true, ['name' => $name], $ss->lang, false);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;

        $existingForm = DB::table('check_point_categories')
            ->where('name', $inputs['name'])
            ->first();

        if ($id) {
            if ($existingForm && $existingForm->id !== $id) {
                return DV::error('Update failed: Category name already exists.');
            }
            $updated = DB::table('check_point_categories')
                ->where('id', $id)
                ->update($inputs);

            return $updated
                ? DV::depends($id, ['id' => $id], 'Update successful')
                : DV::error('Update failed.');
        } else {
            if ($existingForm) {
                return DV::error('Create failed: form name already exists.');
            }

            $newId = DB::table('check_point_categories')->insertGetId($inputs);

            return $newId
                ? DV::depends($newId, ['id' => $newId], 'Create successful')
                : DV::error('Create failed.');
        }
    }

    public function getListPaginate($arr, $ss = null)
    {
        $data = (object) $arr;
        $currentPage = $data->current_page ?? 1;
        $perPage = $data->per_page ?? 10;
        $skipRows = ($currentPage - 1) * $perPage;
        $col_update_date = DBX::formatDate('cpc.update_date', 'update_date');
        $query = DB::table('check_point_categories as cpc')
            ->selectRaw('cpc.id, cpc.name, ' . $col_update_date . '');
            // ->orderBy('cpc.id', 'desc');

        if (!empty($data->search_value)) {
            $searchValue = $data->search_value;
            $query->where('cpc.name', 'LIKE', "%{$searchValue}%");
        }

        $total = $query->count();
        $rows = $query->skip($skipRows)->take($perPage)->get();

        return new LengthAwarePaginator($rows, $total, $perPage, $currentPage);
    }

    public static function getDetails($id, $ss)
    {
        return DB::table('check_point_categories as cpc')
            ->selectRaw('cpc.id, cpc.name, cpc.update_date')
            ->where('cpc.id', $id)
            ->first();
    }

    public function delete($id = null)
    {
        $id = $id ?? $this->id;
        $deleted = DB::table('check_point_categories')->where('id', $id)->delete();

        return $deleted
            ? DV::depends(true, ['action' => 'deleted'], 'Delete successful')
            : DV::error('Delete failed.');
    }

    public static function getFormOptions($id, $ss)
    {
        $formDetails = $id ? self::getDetails($id, $ss) : null;

        return (object) [
            'check_point_categories' => $formDetails,
        ];
    }

    public function getList($arr, $ss = null)
    {
        $data = (object) $arr;
        $branchId = $ss->branch_id;

        $query = DB::table('check_point_categories as cpc')
            ->selectRaw('cpc.id, cpc.name')
            ->where('cpc.branch_id', $branchId);

        if (!empty($data->search_value)) {
            $query->where('cpc.name', 'LIKE', "%{$data->search_value}%");
        }

        return $query->get();
    }
}
