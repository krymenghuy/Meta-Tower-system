<?php

namespace App\Models;

use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;

class Car //extends Model
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
    public function save($arr, $id = null)
    {
        $id = $id ?? $this->id;
        $ss = $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'brand_name' => '1|string|0-150',
            'color' => '0|string|0-30',
            'year' => '1|number',
        ];

        $res = DBX::validateObject($arr, $v_rule, true, [], $ss->lang, false);
        if ($res->error) {
            return DV::error($res->error);
        }
       

        $inputs = $res->values;
        $d = (object)$inputs;

        $id = DBX::saveData($ss, 'cars', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends($id, ['cars' => $inputs, 'id' => $id]);
        }
        return DV::error('Error saving cars');
    }
    
}
