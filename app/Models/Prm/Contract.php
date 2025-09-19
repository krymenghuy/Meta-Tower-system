<?php

namespace App\Models\Prm;

use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use XPublicStorage;


class Contract 
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'contracts';
    public function __construct($id = null, $userInfo = null){
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function createContract($arr = [],$id = null, $ss = null)
     {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $subs_id = $ss->subs_id ?? getCurrentSubsId(true);

        $v_rule = [
            'tenant' => '1|string|0-255',
            'business_type' => '1|string|0-255',
        ];
        $allowSign = ['$', '#', '@', '!', '.', '-', '_', '=', '?'];
        $res = DBX::validateObject($arr, $v_rule, true, ['tenant' => $allowSign], $ss->lang, false);
        if ($res->error) {
            return DV::error($res->error);
        }
        $inputs = $res->values;
        $isCreate = !$id || $id == 0;
        if ($isCreate) {
            $existingBuilding = DB::table('contracts')
                ->where('tenant', $inputs['tenant'])
                ->where('id', '!=', $id)
                ->exists();

            if ($existingBuilding) {
                return DV::error('Update failed Another building with the same details already exists.');
            }
        }
        $id = DBX::saveData($ss, 'contracts', ['id' => $id], $inputs, [], 1);

        if ($id > 0) {
            return DV::depends(1, ['contracts' => $inputs, 'id' => $id]);
        }
        return DV::error($isCreate ? 'Create failed.' : 'Update failed.');
    }

     public function getListContract($arr, $ss = null)
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
             $str_search = DBX::whereLowerCase('c.name',"%$search_value%",'like');
        }
     
        $updated_at = DBX::formatTime('c.updated_at','updated_at');
        $query = DB::table('contracts as c')
           
             ->whereRaw($str_search)
            ->selectRaw('c.id, c.tenant, c.business_type,  '.$updated_at.', c.update_user')
            ->orderBy('c.id', 'asc');

        $clone_query = clone $query;
        $count = $clone_query->count('c.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
       return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public static function contractDetails($id)
    {
        $row = DB::table('contracts as c')
            ->where('c.id', $id)
            ->selectRaw('c.id, c.name, c.floors')
            ->first();
 
        return $row;
    }

    public function getFormOptions($id){
        $contract_details = self::contractDetails($id) ?? null;
        return (object)[
            'contract_details' => $contract_details,
        ];
    }
    


}
        