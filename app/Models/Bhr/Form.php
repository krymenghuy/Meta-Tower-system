<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class Form
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
        return DB::table('forms')
            ->where('id', $id)
            ->selectRaw($columns)
            ->first();
    }

    public function save($forms, $ss, $arr)
    {
        $id = $this->id ?? ($arr['id'] ?? null);
        $ss = $ss ?? $this->userInfo;
        $branchId = $ss->branch_id;

        $validationRules = [
            'id' => '0|identity=1',
            'name' => '1|string|0-250',
            'total_amount' => '0|number',
            'remarks' => '0|string|0-250',
        ];
        $name = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ','];

        $res = validateObject($arr, $validationRules, true, ['name' => $name], $ss->lang, false);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;

        // Check if a form with the same name already exists
        $existingForm = DB::table('forms')
            ->where('name', $inputs['name'])
            ->first();

        if ($id) {
            // Update operation
            if ($existingForm && $existingForm->id !== $id) {
                return DV::error('Update failed: form name already exists.');
            }
            $updated = DB::table('forms')
                ->where('id', $id)
                ->update($inputs);

            return $updated
                ? DV::depends($id, ['id' => $id], 'Update successful')
                : DV::error('Update failed.');
        } else {
            // Create operation
            if ($existingForm) {
                return DV::error('Create failed: form name already exists.');
            }

            $newId = DB::table('forms')->insertGetId($inputs);

            return $newId
                ? DV::depends($newId, ['id' => $newId], 'Create successful')
                : DV::error('Create failed.');
        }
    }

    public function getFormPaginate($arr, $ss = null)
    {
        $data = (object) $arr;
        $branchId = $ss->branch_id;
        $currentPage = $data->current_page ?? 1;
        $perPage = $data->per_page ?? 10;
        $skipRows = ($currentPage - 1) * $perPage;

        $query = DB::table('forms as f')
            ->selectRaw('f.id, f.name, f.total_amount, f.remarks')
            ->orderBy('f.id', 'desc');

        if (!empty($data->search_value)) {
            $searchValue = $data->search_value;
            $query->where('f.name', 'LIKE', "%{$searchValue}%");
        }

        $total = $query->count();
        $rows = $query->skip($skipRows)->take($perPage)->get();

        return new LengthAwarePaginator($rows, $total, $perPage, $currentPage);
    }

    public static function getDetails($id, $ss)
    {
        return DB::table('forms as f')
            ->selectRaw('f.id, f.name. f.total_amount, f.remarks')
            ->where('f.id', $id)
            ->first();
    }

    public function delete($id = null)
    {
        $id = $id ?? $this->id;
        $deleted = DB::table('forms')->where('id', $id)->delete();

        return $deleted
            ? DV::depends(true, ['action' => 'deleted'], 'Delete successful')
            : DV::error('Delete failed.');
    }

    public static function getFormOptions($id, $ss)
    {
        $formDetails = $id ? self::getDetails($id, $ss) : null;

        return (object) [
            'forms' => $formDetails,
        ];
    }

    public function getFormList($arr, $ss = null)
    {
        $data = (object) $arr;
        $branchId = $ss->branch_id;

        $query = DB::table('forms as f')
            ->selectRaw('f.id, f.name, f.total_amount, f.remarks')
            ->where('f.branch_id', $branchId);

        if (!empty($data->search_value)) {
            $query->where('f.name', 'LIKE', "%{$data->search_value}%");
        }

        return $query->get();
    }
}
