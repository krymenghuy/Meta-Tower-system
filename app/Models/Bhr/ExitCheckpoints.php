<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ExitCheckpoints //extends Model
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
        $cols = is_array($props) ? implode(',', $props) : $props;
        return DB::table('check_points')->where('id', $id)->selectRaw($cols)->first();
    }

    public function save($emp_exit_check_point, $ss, $arr)
    {
        $id = $this->id ?? ($arr['id'] ?? null);
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'id' => '0|identity=1',
            'item_name' => '0|string',
            'check_point_cat_id' => '1|number'
        ];
        $check_point = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ','];

        $res = validateObject($arr, $v_rule, true, ['item_name' => $check_point], $ss->lang, false);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $emp_id = $arr['emp_id'] ?? null;


        $check_point_cat = DB::table('check_points')
        ->where('check_point_cat_id', $inputs['check_point_cat_id'])
        ->where('item_name', $inputs['item_name'])
        ->first();
        if ($id) {
            $updated = DB::table('check_points')
            ->where('id', $id)
                ->update($inputs);

            if ($updated) {
                return DV::depends($id, ['id' => $id], 'Update successful');
            } else {
                return DV::error('Update failed item name already exist!.');
            }
        } else {
            $newId = DB::table('check_points')->insertGetId($inputs);

            if ($newId) {
                return DV::depends($newId, ['id' => $newId], 'Create successful');
            } else {
                return DV::error('Create failed.');
            }
        }
    }

    public function getExitCheckpointsPaginate($arr, $ss = null)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        $skip_rows = ($current_page - 1) * $per_page;
        $search_check_point_cat_id = $d->check_point_cat_id ?? null;

        $query = DB::table('check_points as cp')
        ->join('check_point_categories as cpc', 'cpc.id', '=', 'cp.check_point_cat_id')
        ->select(
            'cp.id',
            'cp.item_name',
            'cpc.name as category_name',
        )
            ->orderBy('cp.id', 'desc');

        if ($search_check_point_cat_id) {
            $query->where('cp.check_point_cat_id', $search_check_point_cat_id);
        }
        if (!empty($d->search_value)) {
            $search_value = $d->search_value;
            $query->where(function ($q) use ($search_value) {
                $q->where('cp.item_name', 'LIKE', "%{$search_value}%")
                ->orWhere('cpc.name', 'LIKE', "%{$search_value}%");
            });
        }
        $count = $query->count();

        $rows = $query->skip($skip_rows)
            ->take($per_page)
            ->get();
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public static function getDetails($id, $ss)
    {
        return DB::table('check_points as cp')
        ->join('check_point_categories as cpc', 'cpc.id', '=', 'cp.check_point_cat_id')
        ->select(
            'cp.id',
            'cp.item_name',
            'cpc.id',
            'cpc.name as category_name',
        )
            ->where('cp.id', $id)
            ->first();
    }

    public function delete($id = null)
    {
        $id = $id ?? $this->id;
        $deleted = DB::table('check_points')->where('id', $id)->delete();

        return DV::depends($deleted, ['action' => 'deleted']);
    }

    public static function getFormOptions($id, $ss)
    {
        $check_points = $id ? self::getDetails($id, $ss) : null;

        return (object) [
            'check_point_categories' => DB::table('check_point_categories')->select('id', 'name')->get(),
            'check_points' => $check_points,
        ];
    }

    public function getExitFormList($arr, $ss = null)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;

        $query = DB::table('check_points as cp')
        ->select('cp.id', '')
        ->where('cp.branch_id', $branch_id);

        if (!empty($d->search_value)) {
            $query->where('cp.name', 'LIKE', "%{$d->search_value}%");
        }

        return $query->get();
    }
}
