<?php

namespace App\Models\Mhr;

use DV;
use DBX;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class CheckPoint
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
        return DB::table('check_points')->where('id', $id)->selectRaw($columns)->first();
    }

    public function save($id, $ss, $arr)
    {
        $id = $this->id ?? ($arr['id'] ?? null);
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $validationRules = [
            'id' => '0|identity=1',
            'name' => '1|string|0-250',
            'category_id' => '1|number',
        ];

        $restrictedChars = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ','];

        $validationResult = DBX::validateObject($arr, $validationRules, true, ['name' => $restrictedChars], $ss->lang, false);

        if ($validationResult->error) {
            return DV::error($validationResult->error);
        }

        $inputs = $validationResult->values;

        $exists = DB::table('check_points')
            ->where('category_id', $inputs['category_id'])
            ->where('name', $inputs['name'])
            ->when($id, function ($q) use ($id) {
                $q->where('id', '<>', $id);
            })
            ->exists();

        if ($exists) {
            return DV::error('Checkpoint name already exists.');
        }

        $id = DBX::saveData($ss, 'check_points', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['check_points' => $inputs, 'id' => $id]);
        }
        return DV::error('Error saving Checkpoint');
    }

    public function getList($arr, $ss = null)
    {
        $params = (object) $arr;
        $branch_id = $ss->branch_id;
        $currentPage = $params->current_page ?? 1;
        $perPage = $params->per_page ?? 10;
        $offset = ($currentPage - 1) * $perPage;

        $query = DB::table('check_points as cp')
            ->join('check_point_categories as cpc', 'cpc.id', '=', 'cp.category_id')
            ->selectRaw('cp.id, cp.name, cpc.name as category_name, cp.updated_at, cp.update_user');

        if (!empty($params->category_id)) {
            $query->where('cp.category_id', $params->category_id);
        }

        if (!empty($params->search_value)) {
            $searchValue = $params->search_value;
            $query->where(function ($q) use ($searchValue) {
                $q->where('cp.name', 'LIKE', "%{$searchValue}%")
                    ->orWhere('cpc.name', 'LIKE', "%{$searchValue}%");
            });
        }

        $total = $query->count();
        $items = $query->skip($offset)->take($perPage)->get();
        foreach ($items as $item) {
            $item = setOfficialDates($item, [''], ['updated_at'], ['']);
        }

        return new LengthAwarePaginator($items, $total, $perPage, $currentPage);
    }

    public static function getDetails($id)
    {
        return DB::table('check_points as cp')
            ->join('check_point_categories as cpc', 'cpc.id', '=', 'cp.category_id')
            ->selectRaw('cp.id, cp.name, cp.category_id, cpc.name as category_name')
            ->where('cp.id', $id)->get()
            ->first();
    }

    public function delete($id = null)
    {
        $id = $id ?? $this->id;
        $deleted = DB::table('check_points')->where('id', $id)->delete();

        return $deleted
            ? DV::depends($deleted, ['action' => 'deleted'])
            : DV::error('Delete failed.');
    }

    public static function getFormOptions($id)
    {
        $checkPoints = $id ? self::getDetails($id) : null;

        return (object) [
            'check_point_categories' => DB::table('check_point_categories')->select('id', 'name')->get(),
            'check_points' => $checkPoints,
        ];
    }

    public function getExitFormList($arr, $ss = null)
    {
        $params = (object) $arr;
        $branch_id = $ss->branch_id;

        $query = DB::table('check_points as cp')
            ->where('cp.branch_id', $branch_id)
            ->selectRaw('cp.id, cp.name');

        if (!empty($params->search_value)) {
            $query->where('cp.name', 'LIKE', "%{$params->search_value}%");
        }

        return $query->get();
    }
}
