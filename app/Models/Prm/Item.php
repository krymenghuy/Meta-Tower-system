<?php

namespace App\Models\Prm;
use App\Models\Prm\GeneralSettings;
use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use XPublicStorage;



class Item //extends Model
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'items';
    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;

    }


    public function saveItem($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'name' => '1|string|1-150',
            'category_id' => '1|number|exists=item_categories.id',
            'unit' => '1|string|0-30'
        ];

        $res = DBX::validateObject($arr, $v_rule, 1, [], $ss->lang, 0, null);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;

        $exist = DB::table('items')
            ->whereRaw('LOWER(name)=?', [strtolower($inputs['name'])])
            ->when($id, function ($q) use ($id) {
                $q->where('id', '<>', $id);
            })
            ->exists();

        if ($exist) {
            return DV::error('Item name already exists!');
        }
        $created = !$id;
        $id = DBX::saveData($ss, 'items', ['id' => $id], $inputs, [], 1);
        if ($id && $created) {

            $prefix = 'ITM-';
            $res = setOfficialCode($branch_id, 'item_code_control', 'items', ['id' => $id], $prefix, 5, null);

        }
        if ($id > 0) {
            return DV::depends(1, ['items' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving item!');
    }
    public function getListPaginate($arr = [], $ss = null)
    {
        $d = (object) $arr;
        $search_value = $d->search_value ?? null;
        $item_category_id = $d->item_category_id ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page) || !is_numeric($per_page)) {
            return null;
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $str_search = "1=1";
        $str_moreWhere = "2=2";
        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(i.name Like '%" . $search_value . "%' OR i.code Like '%" . $search_value . "%')";
        }
        if ($item_category_id) {
            $str_moreWhere .= ' AND i.category_id =' . $item_category_id;
        }

        $updated_at = DBX::formatTime('i.updated_at', 'updated_at');


        $query = DB::table('items as i')
            ->join('item_categories as ic', 'ic.id', 'i.category_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw("i.id, i.name, i.code, i.unit, i.category_id, ic.name as category_name,i.update_user,$updated_at")
            ->orderBy('i.id', 'desc');
        $clone_query = clone $query;
        $count = $clone_query->count('i.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);


    }
    public function itemDetails($item_id)
    {
        $item = DB::table('items as i')
            ->where('i.id', $item_id)
            ->selectRaw("i.id, i.name, i.code, i.unit, i.category_id")
            ->first();
        return $item;
    }
    public function getFormOptions($id = null, $ss = null)
    {
        $item_details = $id ? self::itemDetails($id) : null;
        return (object) [
            'item_details' => $item_details,
            'item' =>DB::table('items')->selectRaw('id as value, name as label')->get(),
            'item_categories' => DB::table('item_categories')->select('id', 'name')->get()
        ];
    }
    public function deleteItem($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $deleted = DB::table('items')->where('id', $id)->delete();
        return $deleted
            ? DV::depends($deleted, ['action' => 'deleted'])
            : DV::error('Delete failed.');
    }

}
