<?php

namespace App\Models\Prm;

use App\Models\Prm\GeneralSettings;
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
        'floor_id'      => '1|number|exists=floors.id',
        'space_type_id' => '1|number|exists=space_types.id',
        'sqm_size'      => '0|number',
        'price'         => '1|number',
        'price_type'    => '0|string|default=sqm',
        'status_id'     => '0|number|exists=space_statuses.id|default=1',
        'code'          => '0|string|max=50',
    ];
    $code_char  = ['@','.','-','_'];
    $res = DBX::validateObject($arr, $v_rule, 1, ['code' => $code_char,], $ss->lang, 0, null);
    if ($res->error) return DV::error($res->error);

    $inputs = $res->values;
    $d = (object) $inputs;

    if (!empty($d->code)) {
        $exists = DB::table('building_spaces')
            ->where('code', $d->code)
            ->when($id, fn($q) => $q->where('id', '<>', $id))
            ->exists();

        if ($exists) return DV::error('Space code already exists');
    }

    $floor = DB::table('floors')
        ->select('floor_no')
        ->where('id', $d->floor_id)
        ->first();

    if (!$floor) return DV::error('Invalid floor selected.');

    $created = !$id;

    $id = DBX::saveData($ss, 'building_spaces', ['id' => $id], $inputs, [], 1);

    if ($id && $created && empty($d->code)) {
        self::createBuildingSpaceCode(
            $branch_id,
            $d->building_id,
            $floor->floor_no,
            $id
        );
    }

    $total_space = DB::table('building_spaces')
        ->where('building_id', $d->building_id)
        ->count();

    DB::table('buildings')
        ->where('id', $d->building_id)
        ->update(['total_space' => $total_space]);

    if ($id > 0) {
        return DV::depends(1, ['building_spaces' => $inputs, 'id' => $id]);
    }

    return DV::error('Error saving Building Space ...!');
}


function createBuildingSpaceCode($branch_id, $building_id, $floor_number, $space_id)
{
    $buildingName = DB::table('buildings')
        ->where('id', $building_id)
        ->value('name');
    $prefixLetters = 'B';
    if ($buildingName) {
        $words = explode(' ', $buildingName);
        $prefixLetters = '';
        foreach ($words as $word) {
            if (!empty($word)) {
                $prefixLetters .= strtoupper(substr($word, 0, 1));
            }
        }
    }
    $floorPrefix = 'F' . $floor_number;
    $row = DB::table('space_code_control')
        ->where('branch_id', $branch_id)
        ->where('prefix', $floor_number)
        ->first();

    $next_num = $row ? $row->last_id + 1 : 1;
    $roomNumber = ($floor_number * 100) + $next_num; 

    
    // $fullCode = $prefixLetters . '-' . $floorPrefix . '-R' . $roomNumber;
    // $fullCode = $floorPrefix . '-R-' . $roomNumber;
    $fullCode = 'R-' . $roomNumber;

    DB::table('building_spaces')
        ->where('id', $space_id)
        ->update(['code' => $fullCode]);
    if ($row) {
        DB::table('space_code_control')
            ->where('branch_id', $branch_id)
            ->where('prefix', $floor_number)
            ->update(['last_id' => $next_num]);
    } else {
        DB::table('space_code_control')
            ->insert([
                'branch_id' => $branch_id,
                'prefix'    => $floor_number,
                'last_id'   => $next_num,
            ]);
    }

    return $fullCode;
}




    static function checkDuplicateSpaceCode($building_id, $floor_id, $space_code, $space_id = null)
    {
        $query = DB::table('building_spaces as bs')
            ->where('bs.building_id', $building_id)
            ->where('bs.floor_id', $floor_id)
            ->where('bs.space_code', $space_code);

        if (!empty($space_id)) {
            $query->where('bs.id', '<>', $space_id);
        }

        return $query->value('id') ?: null;
    }


    public function getListPaginate($arr,$ss = null){
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $search_value = $d->search_value ?? null;
        $building_id = $d->building_id ?? null;
        $space_type_id = $d->space_type_id ?? null;
        $status_id = $d->status_id ?? null;
        $floor_id = $d->floor_id ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if(!is_numeric($current_page)){
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $str_search = "1=1";
        $str_moreWhere = "2=2";
        if($search_value){
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(bs.code LIKE '%" .$search_value ."%' OR bs.floor_id LIKE '%" . $search_value . "%' OR b.name LIKE '%" . $search_value . "%' )";
        }
        if($building_id){
            $str_moreWhere .= ' AND bs.building_id = ' . $building_id;
        }
         if($floor_id){
            $str_moreWhere .= ' AND bs.floor_id = ' . $floor_id;
        }
        if($space_type_id){
            $str_moreWhere .= ' AND bs.space_type_id = ' . $space_type_id;
        }
        if($status_id){
            $str_moreWhere .= ' AND bs.status_id = ' . $status_id;
        } 

        $updated_at = DBX::formatTime("bs.updated_at","updated_at");
        $selectCols = 'bs.id,bs.building_id,b.name as building_name,bs.code,bs.floor_id,f.name as floor_number,bs.space_type_id,st.name as space_type,bs.sqm_size,bs.price,bs.price_type,bs.status_id,ss.name as status,bs.update_user,'.$updated_at.'';
        $query = DB::table('building_spaces as bs')
            ->join('buildings as b','b.id','=','bs.building_id')
            ->join('floors as f','f.id','=','bs.floor_id')
            ->join('space_types as st','st.id','=','bs.space_type_id')
            ->join('space_statuses as ss','ss.id','=','bs.status_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw($selectCols);
        $query->orderByRaw('bs.id desc');
        $clone_query = clone $query; 
        $count = $clone_query->count('bs.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows,$count,$per_page,$current_page);
        
    }

    public static function getDetails($id){
        return DB::table('building_spaces as bs')
            ->where('bs.id',$id)
            ->selectRaw('bs.id,bs.code,bs.building_id,bs.floor_id,bs.status_id,bs.space_type_id,bs.price_type,bs.price,bs.sqm_size')
            ->first();

    }

    public function getFormOptions($arr = [],$ss = null){
        $ss = $ss ? $ss : $this->userInfo;
        $d = (object)$arr;
        $id = $d->id ?? $this->id;
        $space_details = $id ? self::getDetails($id) : null;
        $building_id = $d->building_id ?? null;

        return (object)[
            'space_details' => $space_details,
            'buildings' =>GeneralSettings::options_building($ss),
            'floors' =>GeneralSettings::options_floors($building_id,$ss),
            'space_types'=> GeneralSettings::options_space_type($ss),
            'statuses' => GeneralSettings::options_space_status($ss)
        ];
    }
   public function delete($id = null)
    {
        $id = $id ?? $this->id;

        $space = DB::table('building_spaces')->where('id', $id)->first();
        if (!$space) {
            return DV::error('Building space not found.');
        }
        $building_id = $space->building_id;
        if ($space->status_id > 1) return DV::error('This space cannot be deleted because it is not available.');
        $deleted = DB::table('building_spaces')->where('id', $id)->delete();
        if ($deleted) {
           
        $total_space = DB::table('building_spaces')
            ->where('building_id', $building_id)
            ->count();
        DB::table('buildings')
            ->where('id', $building_id)
            ->update(['total_space' => $total_space]);
        }

        return $deleted
            ? DV::depends($deleted, ['action' => 'deleted'])
            : DV::error('Delete failed.');
    }


    function updateBuildingSpaceStatus($status_id, $id = null, $ss = null)
    {

        $ss = $ss ? $ss : $this->userInfo;
        $currentStatus = DB::table('building_spaces')->where('id', $id)->value('status_id');

        if ($currentStatus == $status_id) {
            return DV::error('It is the same current status');
        }
        $x = DB::table('building_spaces')->where('id', $id)->update([
            'status_id' => $status_id,
            'update_user'=>$ss->full_name,
            'updated_at'=>getNowTime(),
            
        ]);
        return DV::depends($x, ['building space status', 'updated']);
    }
}
