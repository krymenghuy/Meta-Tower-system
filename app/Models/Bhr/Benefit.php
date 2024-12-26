<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class Benefit //extends Model
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
    function getProps($id, $props = [])
    {
        $cols = is_array($props) ? implode(',', $props) : $props;
        $row = DB::table('benefits')->where('id', $id)->selectRaw($cols)->first();
        return $row;
    }
    public function save($benefits, $ss, $arr)
    {
        $id = $this->id ?? ($arr['id'] ?? null);
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'id' => '0|identity=1',
            'name' => '1|string|0-250',
        ];
        $name_restrictions = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ','];

        $res = validateObject($arr, $v_rule, true, ['name' => $name_restrictions], $ss->lang, false);
        if ($res->error) {
            return DV::error($res->error);
        }
        $inputs = $res->values;
        $inputs['branch_id'] = $branch_id;

        $name = $inputs['name'];

        if (!$id) {
            $existingBenefit = DB::table('benefits')
            ->where('name', $name)
                ->first();

            if ($existingBenefit) {
                return DV::error('This name already exists. Please choose a different name.');
            }

            try {
                $newId = DB::table('benefits')->insertGetId($inputs);

                if ($newId) {
                    return DV::depends($newId, ['id' => $newId], 'Create successful');
                } else {
                    return DV::error('Failed to create a new benefit. Please check your input.');
                }
            } catch (\Exception $e) {
                return DV::error('Create failed. An error occurred during the operation.');
            }
        }

        if ($id) {
            try {
                $updated = DB::table('benefits')
                ->where('id', $id)
                    ->update($inputs);

                if ($updated) {
                    return DV::depends($id, ['id' => $id], 'Update successful');
                } else {
                    return DV::error('Update failed. Record may not exist or data is unchanged.');
                }
            } catch (\Exception $e) {
                return DV::error('Update failed. An error occurred during the operation.');
            }
        }

        return DV::error('Invalid operation. Please provide valid data.');
    }


    public function getBenefitPaginate($arr, $ss)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $search_id = $d->id ?? null;

        $query = DB::table('benefits as b')
            ->selectRaw('b.id, b.name,b.updated_at,b.update_user')
            ->where('b.branch_id', $branch_id);

        if ($search_id) {
            $query->where('b.id', $search_id);
        }
        if ($search_value) {
            $query->where('b.name', 'like', '%' . $search_value . '%');
        }
        $clone_query = clone $query;
        $count = $clone_query->count('b.id');
        // $allRows = $query->get();
        $rows = $query->skip($skip_rows)
            ->take($per_page)
            ->get();
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public function getDetails($id, $ss)
    {
        $branch_id = $ss->branch_id;
        $row = DB::table('benefits as b')
            ->selectRaw('
                b.id,
                b.name
            ')
        ->where('b.branch_id', $branch_id)->where('b.id', $id)->take(1)->first();
        return $row;
    }

    function deleteBenefit($id = null)
    {
        $id = $id ?? $this->id;

        $delete = DB::table('benefits')->where('id', $id)->delete();
        return DV::depends($delete, ['action', 'deleted']);
    }

    public function getFormOptions($id, $ss)
    {
        $benefits = null;
        if ($id) {
            $benefits = $this->getDetails($id, $ss);
        }
        return (object) [
            'benefits' => $benefits,
        ];
    }

}
