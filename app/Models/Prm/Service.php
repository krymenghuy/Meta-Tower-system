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
            'name'            => '1|string|0-200',
            'service_type_id' => '1|number|exists=service_types.id|text=Please select a valid category.',
            'type'            => '1|choice|0,1|text=Please select a valid type.',
            'price'           => '1|number|min=0|text=Please enter a valid price.',
            'unit_type'       => '0|string|0-50',
            'description'     => '0|string|0-350',
        ];

        $res = DBX::validateObject(
            $arr,
            $v_rule,
            1,
            [
                'name' => ['(', ')', '-', '.', '#'],
                'unit_type' => ['@', '.', '-', '_'],
                'description' => ['@', ',', '-', '.', '#']
            ],
            $ss->lang,
            0,
            null
        );

        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $baseName = trim($inputs['name']);
        $baseName = preg_replace('/\s*\(.*?\)\s*/', '', $baseName);
        $unitType = trim($inputs['unit_type'] ?? '');
        $unitType = ucwords(str_replace('_', ' ', strtolower($unitType)));
        $fullName = $unitType ? "{$baseName} ({$unitType})" : $baseName;
        $inputs['name'] = $fullName;
        $exist = DB::table('services')
            ->whereRaw('LOWER(name) = ?', [strtolower($fullName)])
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
        $service_type_id = $d->service_type_id ?? null;
        $status_id = $d->status_id ?? null;
        $charge_as = $d->unit_type ?? null;
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
            $str_search = "(s.name LIKE '%" . $search_value ."%' OR s.price LIKE '%" . $search_value . "%' OR s.description LIKE '%" . $search_value . "%')";
        }
        if($service_type_id){
            $str_moreWhere .= ' AND s.service_type_id =' . $service_type_id ;
        }
        if($status_id){
            $str_moreWhere .= ' AND s.status_id =' . $status_id ;
        }
        if($charge_as){
            $str_moreWhere .= ' AND s.unit_type =' . $charge_as ;
        }
        $query = DB::table('services as s')
            ->join('service_types as st','st.id','=','s.service_type_id')
            ->join('service_statuses as ss','ss.id','=','s.status_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw("s.id,s.name,s.service_type_id,st.name as service_type,s.unit_type,s.price,s.status_id,ss.name as status,s. description,s.updated_at,s.update_user,s.type")->orderBy('s.id','DESC');
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
            ->selectRaw('s.id,s.name,s.service_type_id,s.type,s.unit_type,s.price,s.status_id,s.description')
            ->first();
    }

    public static function getFormOptions($id,$ss){
        $service_details = $id ? self::serviceDetails($id) : null;
        return (object) [
            'service_details' => $service_details,
            'statuses' => GeneralSettings::options_service_status($ss),
            'service_types' => GeneralSettings::options_service_types($ss)
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
            ->select('id', 'name', 'service_type_id', 'unit_type', 'price', 'description')
            ->first();
        $serviceType = null;
        if ($service && $service->service_type_id) {
            $serviceType = DB::table('service_types')
                ->where('id', $service->service_type_id)
                ->select('id', 'name')
                ->first();
        }
        return (object) [
            'services'      => $service,
            'service_types' => $serviceType
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
