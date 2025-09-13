<?php

namespace App\Models\Prm;

use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use XPublicStorage;

class BuildingSpace
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'building_spaces';
    public function __construct($id = null, $userInfo = null){
        $this->id = $id;
        $this->userInfo = $userInfo;

    }

    public function saveBuildingSpace($arr = [], $id = null, $ss = null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
         $v_rule = [
            'building_id' => '1|number|exists=buildings.id',
            'floor_number' => '0|number',
            'space_type_id' => '0|number|exists=space_types.id',
            'sqm_size' => '0|number',
            'price' => '0|number',
            'price_type' => '0|string|default=sqm',
        ];
        $email_char = ['@','.','-','_'];
        $address_char = ['@',',','.','#'];
        $res = DBX::validateObject($arr,$v_rule,1,[],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $id = DBX::saveData($ss,'building_spaces',['id'=>$id],$inputs,[],1);
        if($id > 0){
            return DV::depends(1,['building_spaces'=>$inputs,'id'=>$id]);
        }
        return DV::error('Error saving Building Space ...!');
    }


}
