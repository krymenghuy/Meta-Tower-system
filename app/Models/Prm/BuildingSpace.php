<?php

namespace App\Models\Prm;

use App\Models\Ypg\GeneralSettings;
use DV;
use Illuminate\Support\Facades\DB;
use DBX;
use XPublicStorage;
use Illuminate\Pagination\LengthAwarePaginator;

class BuildingSpace
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'building_spaces';

    public function __construct($id = null, $userInfo = null){
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

   public function saveBuildingSpace($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'building_id'   => '1|number|exists=buildings.id',
            'floor_number'  => '0|number',
            'space_type_id' => '0|number|exists=space_types.id',
            'sqm_size'      => '0|number',
            'price'         => '0|number',
            'price_type'    => '0|string|default=sqm',
            'total_price'   => '0|number'
        ];

        $res = DBX::validateObject($arr, $v_rule, 1, [], $ss->lang, 0, null);
        if ($res->error) return DV::error($res->error);

        $inputs = $res->values;
        $d = (object) $inputs;
        if (!$d->floor_number) {
            return DV::error('Floor can not be empty');
        }
        $building = DB::table('buildings')->select('floors')->where('id', $d->building_id)->first();
        if ($building && $d->floor_number > $building->floors) {
            return DV::error("Floor number cannot be greater than total floor ({$building->floors}) of this building.");
        }

        $inputs['total_price'] = ($d->price_type === 'sqm')
            ? ($d->sqm_size * $d->price)
            : $d->price;

        $duplicateId = self::checkDuplicateSpaceId(
            $d->building_id,
            $d->floor_number,
            $d->space_type_id,
            $id
        );

        if ($duplicateId) {
            return DV::error("Building space already exists for this building, floor and space type.");
        }

        $created = !$id;
        $id = DBX::saveData($ss, 'building_spaces', ['id' => $id], $inputs, [], 1);

        if ($id && $created) {
            $floor = 'F' . $inputs['floor_number'];
            $prefix = 'MT-' . $floor . '-R';
            setOfficialCode($branch_id, 'space_code_control', 'building_spaces', ['id' => $id], $prefix, 2, null);
        }

        if ($id > 0) {
            return DV::depends(1, ['building_spaces' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving Building Space ...!');
    }


    static function checkDuplicateSpaceId($building_id, $floor, $type, $space_id = null){
        $query = DB::table('building_spaces as bs')
            ->where('bs.building_id', $building_id)
            ->where('bs.floor_number', $floor)
            ->where('bs.space_type_id', $type);

        if (!empty($space_id)) {
            $query->where('bs.id', '<>', $space_id);
        }

        $id = $query->value('id');
        return $id ?: null;
    }

    public function getListPaginate($arr,$ss = null){
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $search_value = $d->search_value ?? null;
        $building_id = $d->building_id ?? null;
        $space_type_id = $d->space_type_id ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if(!is_numeric($current_page)){
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $search_value = $d->search_value ?? null;
        $str_search = "1=1";
        $str_moreWhere = "2=2";
        if($search_value){
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(bs.code LIKE '%" .$search_value ."%')";
        }
        if($building_id){
            $str_moreWhere .= ' AND bs.building_id = ' . $building_id;
        }
        if($space_type_id){
            $str_moreWhere .= ' AND bs.space_type_id = ' . $space_type_id;
        } 
        $updated_at = DBX::formatTime("bs.updated_at","updated_at");
        $selectCols = 'bs.id,bs.building_id,b.name as building_name,bs.code,bs.floor_number,bs.space_type_id,st.name as space_type,bs.sqm_size,bs.price,bs.price_type,bs.total_price,bs.update_user,'.$updated_at.'';
        $query = DB::table('building_spaces as bs')
            ->join('buildings as b','b.id','=','bs.building_id')
            ->join('space_types as st','st.id','=','bs.space_type_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw($selectCols);
        $query->orderByRaw('bs.id asc');
        $clone_query = clone $query; 
        $count = $clone_query->count('bs.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows,$count,$per_page,$current_page);




        
    }

    public static function getDetails($id){
        return DB::table('building_spaces as bs')
            ->where('bs.id',$id)
            ->selectRaw('bs.id,bs.code,bs.building_id,bs.floor_number,bs.space_type_id,bs.price_type,bs.price,bs.sqm_size,bs.total_price')
            ->first();

    }

    public static function getFormOptions($id,$ss){
        $space_details = $id ? self::getDetails($id) : null;
        return (object)[
            'space_details' => $space_details,
            'buildings' =>GeneralSettings::options_building($ss),
            'space_types'=> GeneralSettings::options_space_type($ss)
        ];
    }
    public function delete($id = null){
        $id = $id ?? $this->id;
        $deleted = DB::table('building_spaces')->where('id',$id)->delete();
        return $deleted ? DV::depends($deleted,['action'=>'deleted']) : DV::error('Deleted failed.');
    }
}
