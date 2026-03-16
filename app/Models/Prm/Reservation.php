<?php

namespace App\Models\Prm;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use DV;
use XPublicStorage;
use Illuminate\Support\Facades\DB;
use Vsd\Vsloquent\VSModel;
use App\Models\Prm\GeneralSettings;

class Reservation extends VSModel
{
    protected $table = 'reservations';
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function upsert($arr = [], $id = null, $ss = null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $v_rule = [
            'id'                 => '0|number',
            'tenant_id'          => '1|number|exists=tenants.id',
            'amenity_id'         => '1|number|exists=amenities.id',
            // 'building_id'        => '1|number|exists=buildings.id',
            // 'floor_id'           => '1|number|exists=floors.id',
            'date'               => '1|date|text=Date is required',
            'start_time'         => '1|time|text=Start time is required',
            'end_time'           => '1|time|text=End time is required',
            'description'        => '0|string|0-350',
            'status_id'          => '0|number|default=1',
            // 'requires_booking_id'=> '0|number|default=1',
            // 'is_recurring'       => '0|choice|0,1|default=0',
            'reference_code'    => '0|string|0-50',
            
        ];
        $description_char = ['@', ',', '-', '.', '#', '&', '(', ')', ':', '_'];
        $res = DBX::validateObject( $arr, $v_rule, 1, ['description'=> $description_char], $ss->lang, 0, null );
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $d = (object) $inputs;

        $today   = date('Y-m-d');
        $nowTime = time();

        if ($inputs['date'] < $today) {
            return DV::error('Start date cannot be in the past.');
        }

        if ($inputs['date'] === $today) {
            $inputTime = strtotime($inputs['date'] . ' ' . $inputs['start_time']);
            if ($inputTime < $nowTime) {
                return DV::error('Start time cannot be in the past.');
            }
        }

        if($d->amenity_id && $d->date && $d->start_time && $d->end_time && $d->tenant_id){
            $id = $id ?? self::checkDuplicateReservation($d->amenity_id, $d->date, $id);
        }

        $id = DBX::saveData($ss, 'reservations', ['id'=>$id], $inputs, [], 1);

        if($id > 0){
            return DV::depends(1, ['reservations'=>$inputs, 'id'=>$id]);
        }

        return DV::error('Error saving reservation!');

    }

    static function checkDuplicateReservation($amenity_id, $date, $id = null)
    {
        if (!$amenity_id || !$date) return null;

        $query = DB::table('reservations as r')
            ->where('r.amenity_id', $amenity_id)
            ->where('r.date', $date);

        if ($id) {
            $query->where('r.id', '<>', $id);
        }

        return $query->value('id');
    }
        
    public function getListPaginate($arr, $ss = null)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $search_value = $d->search_value ?? null;
        $tenant_id = $d->tenant_id ?? null;
        $amenity_id = $d->amenity_id ?? null;
        $floor_id = $d->floor_id ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        $status_id = $d->status_id ?? null;
        if (!is_numeric($current_page)) {
            $current_page = 1;  
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $str_search = "1=1";
        $str_moreWhere = '2=2';
        if($search_value){
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(r.name LIKE '%" . $search_value . "%' OR r.description LIKE '%" . $search_value . "%')";
        }
        if($tenant_id){ 
            $str_moreWhere .= ' AND r.tenant_id =' . $tenant_id;
        }
        if($amenity_id){
            $str_moreWhere .= ' AND r.amenity_id =' . $amenity_id;
        }
        
        if($status_id){
            $str_moreWhere .= ' AND r.status_id =' . $status_id;
        }
       
        // $updated_at = DBX::formatTime("r.updated_at", 'updated_at');
        $query = DB::table('reservations as r')
            ->join('reservation_statuses as rs', 'rs.id', '=', 'r.status_id')
            ->Join('amenities as a', 'a.id', '=', 'r.amenity_id')
            ->join('amenity_categories as ac', 'ac.id', '=', 'a.category_id')
            ->Join('tenants as t', 't.id', '=', 'r.tenant_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw("r.id,r.date,r.start_time,r.end_time,r.amenity_id,a.name as amenity_name,a.code as amenity_code,a.category_id,ac.name as amenity_category,a.max_capacity as amenity_capacity,
                         r.tenant_id,t.name as tenant_name,t.phone_number as phone_number,r.description,r.status_id,rs.name as status,r.updated_at,r.update_user")->orderBy('r.id','DESC');
        $clone_query = clone $query;
        $count = $clone_query->count('r.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach($rows as $row){
            $row = setOfficialDates($row,['updated_at','date'],[],['start_time','end_time']);
        }
        return new LengthAwarePaginator($rows,$count,$per_page,$current_page);
    }

    public static function reservationDetails($id){
        return DB::table('reservations as r')
            ->Join('amenities as a', 'a.id', '=', 'r.amenity_id')
            ->join('amenity_categories as ac', 'ac.id', '=', 'a.category_id')
            ->Join('tenants as t', 't.id', '=', 'r.tenant_id')
            ->where('r.id',$id)
            ->selectRaw('r.id,r.date,r.start_time,r.end_time,r.status_id,r.amenity_id,r.tenant_id,t.name as tenant_name,t.phone_number as phone_number,r.description,a.name as amenity_name,a.code as amenity_code,a.category_id,ac.name as amenity_category,a.max_capacity as amenity_capacity')
            ->first();
    }

    public static function getFormOptions($id,$ss)
    {
        $ss = $ss ? $ss : $this->userInfo;
        $reservation_details = $id ? self::reservationDetails($id) : null;
        
        return (object) [
            'reservation_details' => $reservation_details,
            'amenities'      => GeneralSettings::options_amenity($ss),
            'tenants'        => GeneralSettings::options_tenant($ss),
            'reservation_statuses' => GeneralSettings::options_reservation_status($ss),
            'amenity_categories' => GeneralSettings::options_amenity_category($ss),
            
        ];
    }

    public function deleteReservation($id)
    {
        $id = $id ?? $this->id;
        $deleted = DB::table('reservations')->where('id', $id)->delete();
        return $deleted ? DV::depends($deleted,['action'=>'deleted']) : DV::error('Delete failed.');
    }

    public function updateReservationStatus($status_id, $id, $ss)
    {
        $ss = $ss ? $ss : $this->userInfo;
        $currentStatus = DB::table('reservations')->where('id', $id)->value('status_id');
        if ($currentStatus == $status_id) {
            return DV::error('It is the same current status.');
        }
        $x = DB::table('reservations')->where('id', $id)->update([
            'status_id' => $status_id,
            'update_user'=>$ss->full_name,
            'updated_at'=>getNowTime(),
        ]);
        return DV::depends($x, ['reservation status', 'updated']);
    }

    public static function options_amenity($ss)
{
    return DB::table('amenities')
        ->select('id', 'amenity', 'code', 'max_capacity')   // ← important
        ->where('active', 1) // add your conditions
        ->orderBy('amenity')
        ->get();
}

    
}