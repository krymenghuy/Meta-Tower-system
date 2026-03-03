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
            'date'               => '1|date|text=Date is required',
            'start_time'         => '1|time|text=Start time is required',
            'end_time'           => '1|time|text=End time is required',
            'title'              => '1|string|1-255|text=Event title is required',
            'description'        => '0|string|0-350',
            'status_id'          => '0|number|default=1',
            'requires_booking_id'=> '0|number|default=1',
            'is_recurring'       => '0|choice|0,1|default=0',
            'recurrence_id'      => '0|number',
            
        ];
        $title_char       = ['@', ',', '-', '.', '#', '&', '(', ')', ':'];
        $description_char = ['@', ',', '-', '.', '#', '&', '(', ')', ':', '_'];
        $res = DBX::validateObject( $arr, $v_rule, 1, ['title'=>$title_char,'title_char'=>$title_char,'description'=> $description_char], $ss->lang, 0, null );
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $d = (object) $inputs;
        $dup_id = self::checkDuplicateReservation($d->amenity_id ?? null, $id);
        if ($dup_id) {
            return DV::error('Time slot conflict: This room is already booked at the selected time on this date.');
        }

        $created = !$id;
        $id = DBX::saveData($ss, 'reservations', ['id' => $id], $inputs, [], 1);
        if ($id) {
            DB::table('reservations')->where('id', $amenity_id)->update(['status_id' => 2]);
            $hasActive = DB::table('amenitys')
                ->where('tenant_id', $inputs['tenant_id'])
                ->whereDate('end_date', '>=', now())
                ->exists();

            DB::table('tenants')->where('id', $inputs['tenant_id'])
                ->update(['status_id' => $hasActive ? 2 : 3]); // 2=available, 3=unavailable
        }
        if ($id > 0) {
            return DV::depends(1, ['reservations' => $inputs, 'id' => $id]);
        }
        return DV::error($created ? 'Create failed.' : 'Update failed.');

    }

    static function checkDuplicateReservation($amenity_id, $reservation_id, $id = null)
    {
        if (!$amenity_id) return null;

        $query = DB::table('reservations as r')
            ->where('r.reservation_id', $reservation_id);

        if ($id) {
            $query->where('c.id', '<>', $id);
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
        $category = $d->category ?? null;
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
        
        $updated_at = DBX::formatTime("r.updated_at", 'updated_at');
        $query = DB::table('reservations as r')
            ->Join('amenities as a', 'a.id', '=', 'r.amenity_id')
            ->Join('tenants as t', 't.id', '=', 'r.tenant_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw("r.id,r.title,r.date,r.start_time,r.end_time,r.amenity_id,a.name as amenity_name,r.tenant_id,t.name as tenant_name,t.phone_number as phone_number,a.category as amenity_category,r.description,r.status_id,$updated_at,r.update_user")->orderBy('r.id','DESC');
        $clone_query = clone $query;
        $count = $clone_query->count('r.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows,$count,$per_page,$current_page);
    }

    public static function reservationDetails($id,$ss = null){
        return DB::table('reservations as r')
            ->where('r.id',$id)
            ->selectRaw('r.id,r.title,r.date,r.start_time,r.end_time,r.status_id,r.amenity_id,r.tenant_id,r.description')
            ->first();
    }

    public static function getFormOptions($id,$ss)
    {
        $reservation_details = $id ? self::reservationDetails($id) : null;
        return (object) [
            'reservation_details' => $reservation_details,
            'amenities'      => GeneralSettings::options_amenity($ss),
            'tenants'        => GeneralSettings::options_tenant($ss),
            // 'reservation_statuses' => GeneralSettings::options_reservation_status($ss)
        ];
    }

    public function deleteReservation($id)
    {
        $id = $id ?? $this->id;
        $deleted = DB::table('reservations')->where('id', $id)->delete();
        return $deleted ? DV::depends($deleted,['action'=>'deleted']) : DV::error('Delete failed.');
    }

    // public function updateReservationStatus($status_id, $id, $ss)
    // {
    //     $ss = $ss ? $ss : $this->userInfo;
    //     $currentStatus = DB::table('reservations')->where('id', $id)->value('status_id');
    //     if ($currentStatus == $status_id) {
    //         return DV::error('It is the same current status.');
    //     }
    //     $x = DB::table('reservations')->where('id', $id)->update([
    //         'status_id' => $status_id,
    //         'update_user'=>$ss->full_name,
    //         'updated_at'=>getNowTime(),
    //     ]);
    //     return DV::depends($x, ['reservation status', 'updated']);
    // }
}