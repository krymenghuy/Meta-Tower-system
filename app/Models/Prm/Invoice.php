<?php

namespace App\Models\Prm;

use App\Models\Ypg\GeneralSettings;
use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use XPublicStorage;


class Invoice //extends Model
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'invoices';

    public function __construct($id = null, $userInfo = null){
        $this->id = $id;
        $this->userInfo = $userInfo;

    }

    public function saveInvoice($arr = [], $id = null, $ss = null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $subs_id = $ss->subs_id ?? getCurrentSubsId(true);

        $v_rule = [
            'due_amount' => '1|number',
            'tenant_id' => '1|number|exists=tenants.id',
            'building_id' => '1|number|exists=buildings.id',
            'paid_amount' => '0|number',
            'paid_date' => '0|date',
            'remarks' => '0|string',

        ];
        $res == DBX::validateObject($arr, $v_rule, 1, [], $ss->lang, 0, null);

        if ($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $isCreate = $id === null;
        $id = DBX::saveData($ss, 'invoices',['id' => $id], $inputs,[], 1);

        if($id > 0){
            return DV::depends(1, ['invoices' => $inputs, 'id' => $id]);
        }
        return DV::error($isCreate ? 'Create failed.' : 'Update failed.');

    }

    public function getListPaginate($arr, $ss = null){
        $d = (object) $arr;
        $search_value =$d->search_value ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if(!is_numeric($current_page)){
            $current_page = 1;
        }
        $skip_rows = ($current_page -1) * $per_page;
        $str_search = '1=1';
        $str_moreWhere = '2=2';
        

    }
}
