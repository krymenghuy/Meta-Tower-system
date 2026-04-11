<?php

namespace App\Models\Prm;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use DV;
use XPublicStorage;
use Illuminate\Support\Facades\DB;
use Vsd\Vsloquent\VSModel;
use App\Models\Prm\GeneralSettings;
use Log;

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
        // 1. Force local timezone so 'now' matches your watch
        date_default_timezone_set('Asia/Phnom_Penh');
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        // Fix time
        if (!empty($arr['start_time'])) {
            $arr['start_time'] = date('H:i:s', strtotime($arr['start_time']));
        }
        if (!empty($arr['end_time'])) {
            $arr['end_time'] = date('H:i:s', strtotime($arr['end_time']));
        }
        
        // Fix empty status_id string if present
        if (isset($arr['status_id']) && $arr['status_id'] === "") {
            unset($arr['status_id']);
        }

        $v_rule = [
            'id'                 => '0|number',
            'tenant_id'          => '1|number|exists=tenants.id',
            'amenity_id'         => '1|number|exists=amenities.id',
            'booking_date'               => '1|date',
            'start_time'         => '1|time',
            'end_time'           => '1|time',
            'remarks'        => '0|string|0-350',
            'status_id'          => '0|number|default=1',
            'reference_code'     => '0|string|0-50',
        ];

        $remarks_char = ['@', ',', '-', '.', '#', '&', '(', ')', ':', '_'];
        $res = DBX::validateObject( $arr, $v_rule, 1, ['remarks'=> $remarks_char], $ss->lang, 0, null );
        if($res->error) return DV::error($res->error);
        
        $inputs = $res->values;
        $d = (object) $inputs;

        $inputDate = date('Y-m-d', strtotime($inputs['booking_date']));
        $today   = date('Y-m-d');
        $nowTime = date('H:i:s');

        if ($inputDate < $today) {
            return DV::error('Start date cannot be in the past.');
        }

        // Log::info("Current Server Time: " . date('Y-m-d H:i:s'));
        // 1. Get the date and time as clean strings
        $cleanDate = date('Y-m-d', strtotime($inputs['booking_date'])); 
        $cleanTime = date('H:i:s', strtotime($inputs['start_time']));

        // 2. Create a single timestamp
        $scheduledTimestamp = strtotime("$cleanDate $cleanTime");
        $currentTimestamp = time(); 

        // 3. Give the user a 1-minute "Grace Period" 
        // (This prevents errors if it takes 10 seconds to click 'Submit')
        if ($scheduledTimestamp < ($currentTimestamp - 60)) {
            return DV::error('Start time cannot be in the past. Current time is ' . date('h:i A'));
        }
        // Log::info("Input: " . $inputs['booking_date'] . " " . $inputs['start_time']);
        // 4. PREVENT DUPLICATE/OVERLAP:
        if ($d->amenity_id && $d->booking_date && $d->start_time && $d->end_time) {
            $exists = self::where('amenity_id', $d->amenity_id)
                ->where('booking_date', $d->booking_date)
                ->where(function ($query) use ($d) {
                    $query->where('start_time', '<', $d->end_time)
                        ->where('end_time', '>', $d->start_time);
                })
                ->when($id, function ($query, $id) {
                    return $query->where('id', '!=', $id);
                })
                ->exists();

            if ($exists){
                return DV::error('This amenity is already booked for this time slot.');
            }
        }
        if ($d->amenity_id && $d->booking_date && $d->start_time && $d->end_time) {
    
        // Calculate the "Buffered" end time for the incoming request
        // This ensures no one can book within 15 mins AFTER this new booking
        $bufferedEndTime = date('H:i:s', strtotime($d->end_time . ' +15 minutes'));

        $exists = self::where('amenity_id', $d->amenity_id)
            ->where('booking_date', $d->booking_date)
            ->where(function ($query) use ($d, $bufferedEndTime) {
                /* Check overlap with existing records. 
                We use DATE_ADD or raw SQL to add 15 mins to existing end_times 
                to honor their buffers too.
                */
                $query->where(DB::raw("DATE_ADD(end_time, INTERVAL 15 MINUTE)"), '>', $d->start_time)
                    ->where('start_time', '<', $bufferedEndTime);
            })
            ->when($id, function ($query, $id) {
                return $query->where('id', '!=', $id);
            })
            ->exists();

        if ($exists) {
            return DV::error('Unavailable: A 15-minute cleaning buffer is required.');
        }
    }

        $id = DBX::saveData($ss, 'reservations', ['id'=>$id], $inputs, [], 1);

        if($id > 0){
            return DV::depends(1, ['reservations'=>$inputs, 'id'=>$id]);
        }

        return DV::error('Error saving reservation!');
    }

    static function checkDuplicateReservation($amenity_id, $booking_date, $id = null)
    {
        if (!$amenity_id || !$booking_date) return null;

        $query = DB::table('reservations as r')
            ->where('r.amenity_id', $amenity_id)
            ->where('r.booking_date', $booking_date);

        if ($id) {
            $query->where('r.id', '<>', $id);
        }
        return $query->value('id');
    }

    public function getListPaginate($arr, $ss = null)
    {
        $d = (object) $arr;
        $search_value = $d->search_value ?? null;
        $tenant_id = $d->tenant_id ?? null;
        $amenity_id = $d->amenity_id ?? null;
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
            $str_search = "(t.name LIKE '%" . $search_value . "%' OR a.name LIKE '%" . $search_value . "%' )";
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

        $query = DB::table('reservations as r')
            ->join('reservation_statuses as rs', 'rs.id', '=', 'r.status_id')
            ->join('amenities as a', 'a.id', '=', 'r.amenity_id')
            ->join('amenity_categories as ac', 'ac.id', '=', 'a.category_id')
            ->join('tenants as t', 't.id', '=', 'r.tenant_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw("r.id, r.booking_date, r.start_time, r.end_time, r.amenity_id, a.name as amenity_name, a.code as amenity_code, a.category_id, ac.name as amenity_category, a.max_capacity as amenity_capacity, r.tenant_id, t.name as tenant_name, t.phone_number as phone_number, r.remarks, r.status_id, rs.name as status_name, r.updated_at, r.update_user")
            ->orderBy('r.id','DESC');

        $count = (clone $query)->count('r.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        // --- AUTO STATUS LOGIC STARTS HERE ---
        $now = \Carbon\Carbon::now('Asia/Phnom_Penh'); 

        foreach($rows as $row) {
            $now = \Carbon\Carbon::now('Asia/Phnom_Penh');
            $start = \Carbon\Carbon::parse($row->booking_date . ' ' . $row->start_time, 'Asia/Phnom_Penh');
            $end   = \Carbon\Carbon::parse($row->booking_date . ' ' . $row->end_time, 'Asia/Phnom_Penh');

            $calculatedStatusId = 1;
            if ($now->between($start, $end)) {
                $calculatedStatusId = 2;
            } elseif ($now->gt($end)) {
                $calculatedStatusId = 3;
            }

            // IMPORTANT: If the database status is different from reality, update it!
            if ($row->status_id != $calculatedStatusId) {
                DB::table('reservations')->where('id', $row->id)->update(['status_id' => $calculatedStatusId]);
                $row->status_id = $calculatedStatusId;
            }
            
            // Set text names for your UI badges
            $row->status = ($row->status_id == 1) ? "Upcoming" : (($row->status_id == 2) ? "In-Progress" : "Completed");

            $row = setOfficialDates($row, ['booking_date','updated_at'], [], ['start_time','end_time']);
        }
        return new \Illuminate\Pagination\LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public static function reservationDetails($id){
        return DB::table('reservations as r')
            ->join('amenities as a', 'a.id', '=', 'r.amenity_id')
            ->join('amenity_categories as ac', 'ac.id', '=', 'a.category_id')
            ->join('tenants as t', 't.id', '=', 'r.tenant_id')
            ->where('r.id',$id)
            ->selectRaw('r.id,r.booking_date,r.start_time,r.end_time,r.status_id,r.amenity_id,a.name as amenity_name,a.code as amenity_code,a.category_id,ac.name as amenity_category,a.max_capacity as amenity_capacity,r.tenant_id,t.name as tenant_name,t.phone_number as phone_number,r.remarks')
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
        $status_id = DB::table('reservations')->where('id', $id)->value('status_id');
        if ($status_id == 2) {
            return DV::error('Cannot delete an in-progress reservation.');
        }
        if ($status_id == 3) {
            return DV::error('Cannot delete a completed reservation.');
        }
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

    

    
}