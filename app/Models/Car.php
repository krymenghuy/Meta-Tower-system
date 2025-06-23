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
    public function saveCar($arr, $id = null)
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

     public function delete($id)
    {
        $id = $id ?? $this->id;
        if (empty($id)) {
            return DV::error('Invalid ID');
        }
        $res = DB::table('cars')->where('id', $id)->delete();
        if ($res) {
            return DV::depends(1, ['id' => $id]);
        }
        return DV::error('Error deleting car');
    }

    public function DetailsCar($id, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $rows = DB::table('cars')
            ->where('id', $id)
            ->selectRaw('id,brand_name,color,year')->first();
        return $rows;
        
    }
    public function getFormOptions($id,$ss)
    {
        $cars_id = $ss->subs_id;
        $cars = self::DetailsCar($id) ?? null;

        return (object) [
            'cars' => $cars,
            
        ];

    }
    

    
    
}
