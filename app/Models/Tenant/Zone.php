<?php

namespace App\Models\Tenant;

use App\Models\Ypg\GeneralSettings;
use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarepaginator;
use DBX;
use XPublicStorage;

class Zone //extends Model
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'zone';
    public function __construct($id = null, $userInfo = null){
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function saveZone($arr = [], $id = null, $ss = null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'zone_name' => '1|string|0-150',
            'flooe_number' => '1|number',
            'email' => '1|email|1-50',
            'address' => '1|string|0-250',
            'remarks' => '1|string|0-250',
            'tenant_id' => '1|number',

        ];
    }
}
