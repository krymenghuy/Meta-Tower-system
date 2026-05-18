<?php

namespace App\Models\Prm;
use App\Models\Prm\GeneralSettings;
use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use XPublicStorage;

class Service
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'services';
    public function __construct($id = null, $userInfo = null){
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

  public function saveService($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $v_rule = [
            'name'            => '1|string|0-100|text=Name is required.',
            'type_id'         => '1|number|exists=service_types.id|text=Please select a valid type.',
            'category_id'     => '1|number|exists=service_categories.id|text=Please select a valid category.',
            'charge_as'       => '1|string|0-50|text=Please select a valid charge as.',
            'price'           => '1|number|min=0|text=Please enter a valid price.',
            'remarks'         => '0|string|0-350',
        ];

        $res = DBX::validateObject($arr,$v_rule,1,['name' => ['(', ')', '-', '.', '#'],'unit_type' => ['@', '.', '-', '_'],'description' => ['@', ',', '-', '.', '#']],$ss->lang,0,null);
        if ($res->error) {
            return DV::error($res->error);
        }
        $inputs = $res->values;
        $exist = DB::table('services')
            ->whereRaw('LOWER(name) = ?', [strtolower($inputs['name'])])
            ->where('charge_as', $inputs['charge_as'])
            ->when($id, fn($q) => $q->where('id', '<>', $id))
            ->exists();

        if ($exist) {
            return DV::error('This service already exists');
        }
        $inputs['price'] = (float)($inputs['price'] ?? 0);
        $id = DBX::saveData($ss, 'services', ['id' => $id], $inputs, [], 1);
        if (!$id) {
            return DV::error('Error saving service!');
        }

        return DV::depends(1, [
            'services' => $inputs,
            'id' => $id
        ]);
    }


    public function getListPaginate($arr, $ss = null){
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $search_value = $d->search_value ?? null;
        $type_id = $d->type_id ?? null;
        $category_id = $d->category_id ?? null;
        $status_id = $d->status_id ?? null;
        $charge_as = $d->charge_as ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if(!is_numeric($current_page)){
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;

        $str_search = "1=1";
        $str_moreWhere = '2=2';
        if($search_value){
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(s.name LIKE '%" . $search_value ."%')";
        }
        if($type_id){
            $str_moreWhere .= ' AND s.type_id =' . $type_id ;
        }
        if($category_id){
            $str_moreWhere .= ' AND s.category_id =' . $category_id ;
        }
        if($status_id){
            $str_moreWhere .= ' AND s.status_id =' . $status_id ;
        }
        if($charge_as){
            $str_moreWhere .= " AND s.charge_as = '$charge_as'";
        }
        $query = DB::table('services as s')
            ->join('service_categories as sc','sc.id','=','s.category_id')
            ->join('service_types as st','st.id','=','s.type_id')
            ->join('service_statuses as ss','ss.id','=','s.status_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw("s.id,s.name,s.category_id,sc.name as service_category,s.type_id,st.name as service_type,s.charge_as,s.price,s.status_id,ss.name as status,s.remarks,s.updated_at,s.update_user")
            ->orderBy('s.category_id','DESC')
            ->orderBy('s.id','DESC');
        $clone_query = clone $query;
        $count = $clone_query->count('s.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach($rows as $row){
            // $row = setOfficialDates($row, [], ['updated_at'], []);
            $processed = setOfficialDates($row, ['bill_date','due_date'], ['updated_at'], []);
            if ($processed) $row = $processed;
        }
        return new LengthAwarePaginator($rows,$count,$per_page,$current_page);

    }

    public static function serviceDetails($id,$ss = null){
        return DB::table('services as s')
            ->where('s.id',$id)
            ->selectRaw('s.id,s.name,s.category_id,s.type_id,s.charge_as,s.price,s.status_id,s.remarks')
            ->first();
    }

    public static function getFormOptions($id,$ss){
        $service_details = $id ? self::serviceDetails($id) : null;
        return (object) [
            'service_details' => $service_details,
            'statuses' => GeneralSettings::options_service_status($ss),
            'service_categories' => GeneralSettings::options_service_categories($ss),
            'service_types' => GeneralSettings::options_service_types($ss),
            'charge_as' => [
                            ['id' => 'per_unit', 'name' => 'Per Unit'],
                            ['id' => 'one_time', 'name' => 'One Time'],
                            ['id' => 'hour', 'name' => 'Per Hour'],
                            ['id' => 'month', 'name' => 'Per Month'],
                        ],
        ];
    }

    public function deleteService($id = null,$ss = null){
        $id = $id ?? $this->id;
        $service = DB::table('services')->select('id','status_id')->where('id',$id)->first();
        if(!$service){
            return DV::error('Service not found.');
        }
        if($service->status_id == 1){
            return DV::error('cannot not delete active service.');

        }
        $service = DB::table('service_requests')->where('service_id',$id)->first();
        if($service){
            return DV::error('Cannot delete service that has been used in service request.');
        }
        $deleted = DB::table('services')->where('id',$id)->delete();
        return $deleted ? DV::depends($deleted,['action'=>'deleted']) : DV::error('Delete failed.');
    }

    public function getServiceInfo($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $service = DB::table('services')
            ->where('id', $id)
            ->select('id', 'name', 'category_id','type_id', 'charge_as', 'price', 'remarks')
            ->first();
        $category = null;
        if ($service && $service->category_id) {
            $category = DB::table('service_categories')
                ->where('id', $service->category_id)
                ->select('id', 'name')
                ->first();
        }
        return (object) [
            'services'      => $service,
            'service_categories' => $category
        ];
    }
    function updateServiceStatus($status_id, $id = null, $ss = null)
    {
        $ss = $ss ? $ss : $this->userInfo;
        $currentStatus = DB::table('services')->where('id', $id)->value('status_id');
        if ($currentStatus == $status_id) {
            return DV::error('It is the same current status.');
        }
        $x = DB::table('services')->where('id', $id)->update([
            'status_id' => $status_id,
            'update_user' => $ss->full_name,
            'updated_at' => getNowTime(),
        ]);
        return DV::depends($x, ['Service status', 'updated']);
    }



}
