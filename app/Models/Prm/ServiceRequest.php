<?php

namespace App\Models\Prm;
use App\Models\Prm\GeneralSettings;
use DV;
use Vsd\Vsloquent\VSModel;
use DBX;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;

class ServiceRequest extends VSModel{
    protected $userInfo = null;
    protected $table = 'service_requests';
    protected static $img_dir = 'service_requests';
    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function upsert($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $v_rule = [
            'tenant_id' => '1|number|exists=tenants.id',
            'service_id' => '1|number|exists=services.id',
            'name' => '1|string|0-200|text=Service name must be provided',
            'building_id' => '0|number|exists=buildings.id',
            'service_type_id' => '0|number|exists=service_types.id',
            'service_status_id' => '0|number|exists=service_statuses.id',
            'space_type_id' => '0|number|exists=building_spaces.id',
            'priority' => '1|enum=low,medium,high,urgent|text=Priority must be one of: low, medium, high, or urgent',
            'description' => '0|string|0-350',
            'status_id' => '0|number|default=2',
            'title' => '1|string|1-250',
            // 'requested_date' => '1|datetime|text=Requested date is required',
        ];

        $description_char = ['@', ',', '-', '.', '#'];

        $res = DBX::validateObject(
            $arr,
            $v_rule,
            1,
            ['description' => $description_char],
            $ss->lang ?? 'en',
            0,
            null
        );
        if ($res->error) {
            return DV::error($res->error);
        }
        $input = $res->values;
        $input['request_date']= date('Y-m-d');
        $id = DBX::saveData($ss, 'service_requests', ['id' => $id], $input, [], 1);
        if ($id) {
            return DV::depends(1);
        }
        return DV::error('Error saving service request!');
    }
        public function getServiceRequest($arr, $ss = null){
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $search_value = $d->search_value ?? null;
        $status_id = $d->status_id ?? null;
        $service_type_id = $d->service_type_id ?? null;
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
            $str_search = "(sr.description LIKE '%" . $search_value ."%' OR s.name LIKE '%" . $search_value . "%' OR st.name LIKE '%" . $search_value . "%')";
        }
        if($status_id){
            $str_moreWhere .= ' AND sr.status_id =' . $status_id ;
        }
        if($service_type_id){
            $str_moreWhere .= ' AND sr.service_type_id =' . $service_type_id ;
        }

        $updated_at = DBX::formatTime("sr.updated_at", 'updated_at');
        $query = DB::table('service_requests as sr')
            ->join('services as s','s.id','=','sr.service_id')  // Assuming service_requests has service_id
            ->join('service_types as st','st.id','=','s.service_type_id')
            ->join('service_statuses as ss', 'ss.id', '=', 'sr.status_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw("sr.id,s.name,s.service_type_id,st.name as service_type,s.unit_type,s.price,sr.description,sr.status_id,ss.name as status,$updated_at,sr.update_user")->orderBy('sr.id','DESC');
        $clone_query = clone $query;
        $count = $clone_query->count('sr.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows,$count,$per_page,$current_page);

    }
}
