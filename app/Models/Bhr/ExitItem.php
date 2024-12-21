<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ExitItem
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
        return DB::table('exit_items')->where('id', $id)->selectRaw($columns)->first();
    }

    public function save($exit_form, $ss, $arr)
    {
        $id = $this->id ?? ($arr['id'] ?? null);
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $validationRules = [
            'id' => '0|identity=1',
            'name' => '1|string|0-250',
            'check_point_cat_id' => '1|number',
        ];

        $restrictedChars = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ','];

        $validationResult = validateObject($arr, $validationRules, true, ['name' => $restrictedChars], $ss->lang, false);

        if ($validationResult->error) {
            return DV::error($validationResult->error);
        }

        $inputs = $validationResult->values;

        $existingItem = DB::table('exit_items')
            ->where('check_point_cat_id', $inputs['check_point_cat_id'])
            ->where('name', $inputs['name'])
            ->first();

        if ($id) {
            if ($existingItem && $existingItem->id !== $id) {
                return DV::error('Update failed: item name already exists.');
            }

            $updated = DB::table('exit_items')
                ->where('id', $id)
                ->update($inputs);

            return $updated
                ? DV::depends($id, ['id' => $id], 'Update successful')
                : DV::error('Update failed.');
        } else {
            if ($existingItem) {
                return DV::error('Create failed: item name already exists.');
            }

            $newId = DB::table('exit_items')->insertGetId($inputs);

            return $newId
                ? DV::depends($newId, ['id' => $newId], 'Create successful')
                : DV::error('Create failed.');
        }
    }

    public function getExitItemPaginate($arr, $ss = null)
    {
        $params = (object) $arr;
        $branch_id = $ss->branch_id;
        $currentPage = $params->current_page ?? 1;
        $perPage = $params->per_page ?? 10;
        $offset = ($currentPage - 1) * $perPage;

        $query = DB::table('exit_items as ei')
            ->join('check_point_categories as cpc', 'cpc.id', '=', 'ei.check_point_cat_id')
            ->select('ei.id', 'ei.name', 'cpc.name as category_name')
            ->orderBy('ei.id', 'desc');

        if (!empty($params->check_point_cat_id)) {
            $query->where('ei.check_point_cat_id', $params->check_point_cat_id);
        }

        if (!empty($params->search_value)) {
            $searchValue = $params->search_value;
            $query->where(function ($q) use ($searchValue) {
                $q->where('ei.name', 'LIKE', "%{$searchValue}%")
                    ->orWhere('cpc.name', 'LIKE', "%{$searchValue}%");
            });
        }

        $total = $query->count();
        $items = $query->skip($offset)->take($perPage)->get();

        return new LengthAwarePaginator($items, $total, $perPage, $currentPage);
    }

    public static function getDetails($id)
    {
        return DB::table('exit_items as ei')
            ->join('check_point_categories as cpc', 'cpc.id', '=', 'ei.check_point_cat_id')
            ->selectRaw('ei.id, ei.name, cpc.id as category_id, cpc.name as category_name')
            ->where('ei.id', $id)
            ->first();
    }

    public function delete($id = null)
    {
        $id = $id ?? $this->id;
        $deleted = DB::table('exit_items')->where('id', $id)->delete();

        return $deleted
            ? DV::depends($deleted, ['action' => 'deleted'])
            : DV::error('Delete failed.');
    }

    public static function getFormOptions($id)
    {
        $exitItems = $id ? self::getDetails($id) : null;

        return (object) [
            'check_point_categories' => DB::table('check_point_categories')->select('id', 'name')->get(),
            'exit_items' => $exitItems,
        ];
    }

    public function getExitFormList($arr, $ss = null)
    {
        $params = (object) $arr;
        $branch_id = $ss->branch_id;

        $query = DB::table('exit_items as ei')
            ->where('ei.branch_id', $branch_id)
            ->select('ei.id', 'ei.name');

        if (!empty($params->search_value)) {
            $query->where('ei.name', 'LIKE', "%{$params->search_value}%");
        }

        return $query->get();
    }
}
