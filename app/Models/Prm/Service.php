<?php

namespace App\Models\Prm;
use App\Models\Ypg\GeneralSettings;
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

    public function saveService($arr = [],$id = null, $ss = null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $v_rule = [
            'name' => '1|string|0-200|text=Service name must be provided',
            'unit_type' => '0|string|0-250',
            'price' => '0|price',
            'description' => '0|string|0-350',
            'status_id' => '0|number|default=1',
        ];

        $unit_type_char = ['@','.','-','_'];
        $description_char = ['@',',','.','#'];
        $res = DBX::validateObject($arr,$v_rule,1,['unit_type'=>$unit_type_char,'description'=> $description_char],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $d = (object) $inputs;
        if(!$id) {
            $exist = DB::table('services')->where('name',$inputs['name'])
                ->where('name',$inputs['name'])
                ->exists();
                if($exist){
                    return DV::error('Create failed: This service already exists');
                }
        }
        $id = DBX::saveData($ss,'services',['id'=>$id],$inputs,[],1);
        if($id > 0){
            return DV::depends(1,['services'=>$inputs,'id'=>$id]);
        }
        return DV::error('Error saving service...!');
    }

    public function getListPaginate($arr, $ss = null){
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $search_value = $d->search_value ?? null;
        $status_id = $d->status_id ?? null;
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
        if($status_id){
            $str_moreWhere .= ' AND s.status_id =' . $status_id ;
        }

        $updated_at = DBX::formatTime("s.updated_at", 'updated_at');
        $query = DB::table('services as s')
            ->join('service_statuses as ss', 'ss.id', '=', 's.status_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw("s.id,s.name,s.unit_type,s.price,s.description,s.status_id,ss.name as status,$updated_at,s.update_user")->orderBy('s.id','DESC');
        $clone_query = clone $query;
        $count = $clone_query->count('s.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows,$count,$per_page,$current_page);

    }

    public static function serviceDetails($id,$ss = null){
        return DB::table('services as s')
            ->where('s.id',$id)
            ->selectRaw('s.id,s.name,s.unit_type,s.price,s.description,s.status_id')
            ->first();
    }

    public static function getFormOptions($id,$ss){
        $service_details = $id ? self::serviceDetails($id) : null;
        return (object) [
            'service_details' => $service_details,
            'statuses' => GeneralSettings::options_service_status($ss)
        ];
    }
    
    public function deleteService($id = null){
        $id = $id ?? $this->id;
        $deleted = DB::table('services')->where('id',$id)->delete();
        return $deleted ? DV::depends($deleted,['action'=>'deleted']) : DV::error('Delete failed.');
    }

    function updateServiceStatus($status_id, $id = null, $ss = null)
    {

        $ss = $ss ? $ss : $this->userInfo;
        $currentStatus = DB::table('services')->where('id', $id)->value('status_id');

        if ($currentStatus == $status_id) {
            return DV::error('It is the same current status');
        }
        $x = DB::table('services')->where('id', $id)->update([
            'status_id' => $status_id,
            'update_user'=>$ss->full_name,
            'updated_at'=>getNowTime(),
            
        ]);
        return DV::depends($x, ['service status', 'updated']);
    }
}
