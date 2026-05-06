<?php

namespace App\Models\Prm;

use App\Models\Prm\GeneralSettings;
use DV;
use Illuminate\Support\Facades\DB;
use DBX;
use XPublicStorage;
use Illuminate\Pagination\LengthAwarePaginator;

class BuildingSpace
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'building_spaces';

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
    public static function updateTotalSpace($building_id)
{
    $space_count = DB::table('building_spaces')
        ->where('building_id', $building_id)
        ->count();

    $amenity_count = DB::table('amenities')
        ->where('building_id', $building_id)
        ->count();

    $total_space = $space_count + $amenity_count;

    DB::table('buildings')
        ->where('id', $building_id)
        ->update(['total_space' => $total_space]);
}

    public function saveBuildingSpace($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $isCreate = empty($id);

        $v_rule = [
            'building_id' => '1|number|exists=buildings.id',
            'floor_id' => '1|number|exists=floors.id',
            'space_type_id' => '1|number|exists=space_types.id',
            'sqm_size' => '1|number',
            'price' => '1|number',
            'price_type' => '1|string|1-25|text=Price type is required',
            'code' => '0|string|max=50',
        ];

        $code_char = ['@', '.', '-', '_'];
        $res = DBX::validateObject($arr,$v_rule,1,['code' => $code_char],$ss->lang,0,null);
        if ($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $d = (object) $inputs;

        if (!empty($d->code)) {
            $exists = DB::table('building_spaces')
                ->where('code', $d->code)
                ->when($id, fn($q) => $q->where('id', '<>', $id))
                ->exists();
            if ($exists) return DV::error('Space code already exists');
        }
        if ((float) $inputs['price'] <= 0 ){
            return DV::error('Price must be greater than zero.');
        }
        if ((float) $inputs['sqm_size'] <= 0 ){
            return DV::error('Size must be greater than zero.');
        }
        $floor = DB::table('floors')
            ->select('floor_number')
            ->where('id', $d->floor_id)
            ->first();
        if (!$floor) return DV::error('Invalid floor selected.');
        DB::beginTransaction();
        try {
            $space_id = DBX::saveData($ss, 'building_spaces', ['id' => $id], $inputs, [], 1);

            if (!$space_id) {
                DB::rollBack();
                return DV::error('Error saving Building Space ...!');
            }
            if ($isCreate && empty($d->code)) {
                self::createBuildingSpaceCode(
                    $branch_id,
                    $d->building_id,
                    $floor->floor_number,
                    $space_id
                );
            }
            self::updateTotalSpace($d->building_id);
            DB::commit();

            return DV::depends(1, [
                'building_spaces' => $inputs,
                'id' => $space_id
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return DV::error('Transaction failed. Please try again.');
        }
    }


   function createBuildingSpaceCode($branch_id, $building_id, $floor_number, $space_id)
{
    $buildingName = DB::table('buildings')
        ->where('id', $building_id)
        ->value('name');

    $prefixLetters = 'B';

    if ($buildingName) {
        $words = explode(' ', $buildingName);
        $prefixLetters = '';

        foreach ($words as $word) {
            if (!empty($word)) {
                $prefixLetters .= strtoupper(substr($word, 0, 1));
            }
        }
    }

    $floorPrefix = 'F' . $floor_number;

    // ✅ FIX: include building_id
    $row = DB::table('space_code_control')
        ->where('branch_id', $branch_id)
        ->where('building_id', $building_id)
        ->where('prefix', $floor_number)
        ->first();

    $next_num = $row ? $row->last_id + 1 : 1;

    $roomNumber = ($floor_number * 100) + $next_num;

    $fullCode = 'R-' . $roomNumber;

    DB::table('building_spaces')
        ->where('id', $space_id)
        ->update(['code' => $fullCode]);

    if ($row) {
        DB::table('space_code_control')
            ->where('id', $row->id)
            ->update(['last_id' => $next_num]);
    } else {
        DB::table('space_code_control')
            ->insert([
                'branch_id'   => $branch_id,
                'building_id' => $building_id,
                'prefix'      => $floor_number,
                'last_id'     => $next_num,
            ]);
    }

    return $fullCode;
}


    static function checkDuplicateSpaceCode($building_id, $floor_id, $space_code, $space_id = null)
    {
        $query = DB::table('building_spaces as bs')
            ->where('bs.building_id', $building_id)
            ->where('bs.floor_id', $floor_id)
            ->where('bs.space_code', $space_code);

        if (!empty($space_id)) {
            $query->where('bs.id', '<>', $space_id);
        }

        return $query->value('id') ?: null;
    }


    public function getListPaginate($arr, $ss = null)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $search_value = $d->search_value ?? null;
        $building_id = $d->building_id ?? null;
        $space_type_id = $d->space_type_id ?? null;
        $status_id = $d->status_id ?? null;
        $floor_id = $d->floor_id ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $str_search = "1=1";
        $str_moreWhere = "2=2";
        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(bs.code LIKE '%" . $search_value . "%' OR b.name LIKE '%" . $search_value . "%' )";
        }
        if ($building_id) {
            $str_moreWhere .= ' AND bs.building_id = ' . $building_id;
        }
        if ($floor_id) {
            $str_moreWhere .= ' AND bs.floor_id = ' . $floor_id;
        }
        if ($space_type_id) {
            $str_moreWhere .= ' AND bs.space_type_id = ' . $space_type_id;
        }
        if ($status_id) {
            // If filter is OCCUPIED, include units even when they are under maintenance.
            // For AVAILABLE/BOOKED, exclude maintenance units.
            $status_id = (int) $status_id;

            $selectedStatus = DB::table('space_statuses')
                ->where('id', $status_id)
                ->select('name', 'status_code')
                ->first();

            $selectedName = strtolower(trim($selectedStatus->name ?? ''));
            $selectedCode = strtolower(trim($selectedStatus->status_code ?? ''));
            $isOccupiedFilter = $selectedName === 'occupied' || $selectedCode === 'occupied';

            $str_moreWhere .= ' AND bs.status_id = ' . $status_id;
            if (!$isOccupiedFilter) {
                // Not under maintenance: treat NULL like 0 (legacy rows may have NULL).
                $str_moreWhere .= ' AND COALESCE(bs.maintenance_status_id, 0) = 0';
            }
        }

        $selectCols = 'bs.id,bs.building_id,b.name as building_name,bs.code,bs.floor_id,f.name as floor_number,bs.space_type_id,st.name as space_type,bs.sqm_size,bs.price,bs.price_type,bs.status_id,bs.maintenance_status_id,ss.name as status,bs.update_user,bs.updated_at';
        $query = DB::table('building_spaces as bs')
            ->join('buildings as b', 'b.id', '=', 'bs.building_id')
            ->join('floors as f', 'f.floor_number', '=', 'bs.floor_id')
            ->join('space_types as st', 'st.id', '=', 'bs.space_type_id')
            ->join('space_statuses as ss', 'ss.id', '=', 'bs.status_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw($selectCols)
            ->orderByRaw('bs.status_id ASC')
            ->orderByRaw('bs.created_at DESC');

        $clone_query = clone $query;
        $count = $clone_query->count('bs.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach ($rows as $row) {
            setOfficialDates($row, [''], ['updated_at'], []);
        }
        $summaryRow = DB::table('building_spaces as bs')
            ->join('buildings as b', 'b.id', '=', 'bs.building_id')
            ->join('floors as f', 'f.floor_number', '=', 'bs.floor_id')
            ->join('space_types as st', 'st.id', '=', 'bs.space_type_id')
            ->join('space_statuses as ss', 'ss.id', '=', 'bs.status_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw("
                COUNT(bs.id) as total_units,
                SUM(CASE WHEN LOWER(TRIM(ss.name)) = 'available' THEN 1 ELSE 0 END) as available_cnt,
                SUM(CASE WHEN LOWER(TRIM(ss.name)) = 'booked' THEN 1 ELSE 0 END) as booked_cnt,
                SUM(CASE WHEN LOWER(TRIM(ss.name)) = 'occupied' THEN 1 ELSE 0 END) as occupied_cnt
            ")
            ->first();

        $totalUnits = ($summaryRow->total_units ?? 0);
        $available =($summaryRow->available_cnt ?? 0);
        $booked = ($summaryRow->booked_cnt ?? 0);
        $occupied =($summaryRow->occupied_cnt ?? 0);
        // Occupancy = count of occupied units only (matches OCCUPIED on cards). Booked has its own summary.
        $occupancyCount = $occupied;

        $paginator = new LengthAwarePaginator($rows, $count, $per_page, $current_page);
        $out = $paginator->toArray();
        $out['summary'] = [
            'total_units' => $totalUnits,
            'occupancy' => $occupancyCount,
            'available' => $available,
            'booked' => $booked,
        ];

        return $out;

    }

    public static function getDetails($id)
    {
        return DB::table('building_spaces as bs')
            ->where('bs.id', $id)
            ->selectRaw('bs.id,bs.code,bs.building_id,bs.floor_id,bs.status_id,bs.space_type_id,bs.price_type,bs.price,bs.sqm_size')
            ->first();

    }

    public function getFormOptions($arr = [], $ss = null)
    {
        $ss = $ss ? $ss : $this->userInfo;
        $d = (object) $arr;
        $id = $d->id ?? $this->id;
        $space_details = $id ? self::getDetails($id) : null;
        $building_id = $d->building_id ?? null;

        return (object) [
            'space_details' => $space_details,
            'buildings' => GeneralSettings::options_building($ss),
            'floors' => GeneralSettings::options_floors($building_id),
            'space_types' => GeneralSettings::options_space_type($ss),
            'statuses' => GeneralSettings::options_space_status($ss)
        ];
    }
    public function delete($id = null)
    {
        $id = $id ?? $this->id;

        $space = DB::table('building_spaces')->where('id', $id)->first();
        if (!$space) {
            return DV::error('Building space not found.');
        }
        $building_id = $space->building_id;
        if ($space->status_id > 1)
            return DV::error('This space cannot be deleted because it is not available.');
        $deleted = DB::table('building_spaces')->where('id', $id)->delete();
        if ($deleted) {
            self::updateTotalSpace($building_id);
        }

        return $deleted
            ? DV::depends($deleted, ['action' => 'deleted'])
            : DV::error('Delete failed.');
    }


    function updateBuildingSpaceStatus($status_id, $id = null, $ss = null)
    {

        $ss = $ss ? $ss : $this->userInfo;
        $currentStatus = DB::table('building_spaces')->where('id', $id)->value('status_id');

        if ($currentStatus == $status_id) {
            return DV::error('It is the same current status');
        }
        $x = DB::table('building_spaces')->where('id', $id)->update([
            'status_id' => $status_id,
            'update_user' => $ss->full_name,
            'updated_at' => getNowTime(),

        ]);
        return DV::depends($x, ['building space status', 'updated']);
    }
    // public function createBooking($arr = [], $id = null, $ss = null)
    // {
    //     $id = $id ?? $this->id;
    //     $ss = $ss ?? $this->userInfo;

    //     $v_rule = [
    //         'space_id' => '1|number|exists=building_spaces.id',
    //         'booker_name' => '1|string|1-50',
    //         'booker_phone' => '1|string|1-25',
    //         'booker_email' => '0|string|1-100',
    //         'booking_date' => '1|date',
    //         'expired_booking_date' => '1|date',
    //         'booking_fee' => '0|number|min=0',
    //         'remarks' => '0|string|1-255',
    //     ];

    //     $email_char = ['@', '.', '-', '_'];

    //     $res = DBX::validateObject($arr, $v_rule, 1, ['booker_email' => $email_char], $ss->lang, 0, null);
    //     if ($res->error)
    //         return DV::error($res->error);
    //     $inputs = $res->values;
    //     $d = (object) $inputs;
    //     $space = DB::table('building_spaces')->where('id', $d->space_id)->first();
    //     if (!$space) {
    //         return DV::error('Selected space does not exist.');
    //     }
    //     if ($space->status_id != 1) {
    //         return DV::error('This space is not available for booking.');
    //     }
    //     $today = date('Y-m-d');

    //     if (strtotime($d->expired_booking_date) < strtotime($today)) {
    //         return DV::error('Expired booking date cannot be in the past.');
    //     }

    //     if (strtotime($d->expired_booking_date) < strtotime($d->booking_date)) {
    //         return DV::error('Expired booking date must be after booking date.');
    //     }
    //     $minExpire = date('Y-m-d', strtotime($d->booking_date . ' +14 days'));

    //     if (strtotime($d->expired_booking_date) < strtotime($minExpire)) {
    //         return DV::error('Expired booking date must be at least 14 days after booking date.');
    //     }
    //     if (empty($inputs['remarks'])) {
    //         $inputs['remarks'] = "Booking created by {$d->booker_name} on " . date('Y-m-d H:i:s');
    //     }
    //     DB::beginTransaction();
    //     try {
    //         $booking_id = DBX::saveData($ss, 'space_bookings', ['id' => $id], $inputs, [], 1);
    //         if (!$booking_id) {
    //             DB::rollBack();
    //             return DV::error('Unable to create booking.');
    //         }
    //         DB::table('building_spaces')->where('id', $d->space_id)->update(['status_id' => 2]);
    //         DB::commit();
    //         return DV::depends(1, ['id' => $booking_id, 'space_bookings' => $inputs]);
    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         return DV::error('Booking failed. Please try again.');

    //     }
    // }

    public function createBooking($arr = [], $id = null, $ss = null)
{
    $id = $id ?? $this->id;
    $ss = $ss ?? $this->userInfo;

    $v_rule = [
        'space_id' => '1|number|exists=building_spaces.id',
        'booker_name' => '1|string|1-50',
        'booker_phone' => '1|string|1-25',
        'booker_email' => '0|email',
        'booking_date' => '1|date|text=Booking date is required.',
        'expired_booking_date' => '1|date|text=Expired booking date is required.',
        'booking_fee' => '1|number|min=0|text=Booking fee is required.',
        'remarks' => '0|string|1-255',
    ];
    $email_char = ['@', '.', '_', '-', '+'];
    $remarks_char = ['@', '.', '_', '-', '+'];

    $res = DBX::validateObject(
        $arr,
        $v_rule,
        1,
        ['booker_email' => $email_char, 'remarks' => $remarks_char],
        $ss->lang,
        0,
        null
    );

    if ($res->error) return DV::error($res->error);

    $inputs = $res->values;
    $d = (object) $inputs;
    $booker_email = $d->booker_email ?? null;
    if ($booker_email !== null && $booker_email !== '') {

        if (strpos($booker_email, '@') === false) {
            return DV::error('Email must contain @');
        }

        if (!filter_var($booker_email, FILTER_VALIDATE_EMAIL)) {
            return DV::error('Invalid email format');
        }
    }
    $today = date('Y-m-d');
    if ($d->booking_date != $today) {
        return DV::error('Booking date must be today.');
    }
    $minExpire = date('Y-m-d', strtotime($d->booking_date . ' +14 days'));
    if (strtotime($d->expired_booking_date) < strtotime($minExpire)) {
        return DV::error('Expired booking date must be at least 14 days after booking date.');
    }
    if (empty($inputs['remarks'])) {
        $inputs['remarks'] = "Booking created by {$d->booker_name} on " . date('d-M-Y H:i:s');
    }
    DB::beginTransaction();
    try {
        $space = DB::table('building_spaces')
            ->where('id', $d->space_id)
            ->lockForUpdate()
            ->first();

        if (!$space) {
            DB::rollBack();
            return DV::error('Selected space does not exist.');
        }
        if ($space->status_id != 1) {
            DB::rollBack();
            return DV::error('This space is not available for booking.');
        }

        $booking_id = DBX::saveData($ss, 'space_bookings', ['id' => $id], $inputs, [], 1);

        if (!$booking_id) {
            DB::rollBack();
            return DV::error('Unable to create booking.');
        }

        DB::table('building_spaces')
            ->where('id', $d->space_id)
            ->update(['status_id' => 2]);

        DB::commit();

        return DV::depends(1, [
            'id' => $booking_id,
            'space_bookings' => $inputs
        ]);

    } catch (\Exception $e) {
        DB::rollBack();
        return DV::error('Booking failed. Please try again.');
    }
}

public function viewBookingDetails($id)
{
    $row = DB::table('space_bookings as sb')
        ->join('building_spaces as bs', 'bs.id', '=', 'sb.space_id')
        ->where('sb.space_id', $id)
        ->orderByDesc('sb.id')
        ->selectRaw('sb.id, sb.booker_name, sb.booker_phone, sb.booker_email, sb.booking_date, sb.expired_booking_date, sb.booking_fee, sb.remarks, bs.code as space_code')
        ->first();
    if ($row) {
        setOfficialDates($row, ['booking_date', 'expired_booking_date'], [], []);
    }
    return $row;
}


public function getLatestBooking($space_id)
{
    if (!$space_id) {
        return DV::error('space_id is required.');
    }

    $row = DB::table('space_bookings')
        ->where('space_id', $space_id)
        ->orderByDesc('id')
        ->select(
            'id',
            'space_id',
            'booker_name',
            'booker_phone',
            'booker_email',
            'booking_date',
            'expired_booking_date',
            'booking_fee',
            'remarks'
        )
        ->first();

    if (!$row) {
        return DV::depends(1, []);
    }
    $data = json_decode(json_encode($row, JSON_UNESCAPED_UNICODE), true);

    return DV::depends(1, $data);
}
public function updateBooking($arr = [], $ss = null)
{
    $ss = $ss ?? $this->userInfo;
    $v_rule = [
        'booking_id' => '1|number|exists=space_bookings.id',
        'space_id' => '1|number|exists=building_spaces.id',
        'booker_name' => '1|string|1-50',
        'booker_phone' => '1|string|1-25',
        'booker_email' => '0|email',
        'booking_date' => '1|date|text=Booking date is required.',
        'expired_booking_date' => '1|date|text=Expired booking date is required.',
        'booking_fee' => '1|number|min=0|text=Booking fee is required.',
        'remarks' => '0|string|1-255',
    ];
    $email_char = ['@', '.', '_', '-', '+'];

    $remarks_char = ['@', '.', '_', '-', ':'];

    $res = DBX::validateObject(
        $arr,
        $v_rule,
        1,
        ['booker_email' => $email_char, 'remarks' => $remarks_char],
        $ss->lang,
        0,
        null
    );

    if ($res->error) return DV::error($res->error);

    $inputs = $res->values;
    $d = (object) $inputs;
    $booker_email = $d->booker_email ?? null;
    if ($booker_email !== null && $booker_email !== '') {



        if (!filter_var($booker_email, FILTER_VALIDATE_EMAIL)) {
            return DV::error('Invalid email format');
        }
    }
    $minExpire = date('Y-m-d', strtotime($d->booking_date . ' +14 days'));
    if (strtotime($d->expired_booking_date) < strtotime($minExpire)) {
        return DV::error('Expired booking date must be at least 14 days after booking date.');
    }

    DB::beginTransaction();
    try {
        $booking = DB::table('space_bookings')->where('id', $d->booking_id)->first();
        if (!$booking || $booking->space_id !== $d->space_id) {
            DB::rollBack();
            return DV::error('Booking not found for this space.');
        }
        $space = DB::table('building_spaces')
            ->where('id', $d->space_id)
            ->lockForUpdate()
            ->first();
        if (!$space) {
            DB::rollBack();
            return DV::error('Selected space does not exist.');
        }
        if ($space->status_id !== 2) {
            DB::rollBack();
            return DV::error('This space does not have an active booking.');
        }

        unset($inputs['booking_id']);
        $updated = DBX::saveData($ss, 'space_bookings', ['id' => $d->booking_id], $inputs, [], 1);
        if (!$updated) {
            DB::rollBack();
            return DV::error('Unable to update booking.');
        }

        DB::commit();

        return DV::depends(1, ['id' => $d->booking_id, 'space_bookings' => $inputs]);
    } catch (\Exception $e) {
        DB::rollBack();
        return DV::error('Update failed.');
    }
}

// public function cancelBooking($arr = [], $ss = null)
// {
//     $ss = $ss ?? $this->userInfo;
//     $v_rule = ['space_id' => '1|number|exists=building_spaces.id'];
//     $res = DBX::validateObject($arr, $v_rule, 1, [], $ss->lang, 0, null);
//     if ($res->error) return DV::error($res->error);
//     $space_id =$res->values['space_id'];

//     DB::beginTransaction();
//     try {
//         $space = DB::table('building_spaces')
//             ->where('id', $space_id)
//             ->lockForUpdate()
//             ->first();
//         if (!$space) {
//             DB::rollBack();
//             return DV::error('Space not found.');
//         }
//         if ($space->status_id !== 2) {
//             DB::rollBack();
//             return DV::error('This space does not have an active booking.');
//         }

//         DB::table('space_bookings')->where('space_id', $space_id)->delete();
//         DB::table('building_spaces')
//             ->where('id', $space_id)
//             ->update(['status_id' => 1]);

//         DB::commit();

//         return DV::depends(1, ['action' => 'cancelled', 'space_id' => $space_id]);
//     } catch (\Exception $e) {
//         DB::rollBack();
//         return DV::error('Unable to cancel booking.');
//     }
// }
public function cancelBooking($arr = [], $ss = null)
{
    $ss = $ss ?? $this->userInfo;
    $space_id = isset($arr['space_id']) ? $arr['space_id'] : null;

    if (!$space_id || !is_numeric($space_id)) {
        return DV::error('Invalid space_id.');
    }

    DB::beginTransaction();
    try {
        $space = DB::table('building_spaces')
            ->where('id', $space_id)
            ->lockForUpdate()
            ->first();

        if (!$space) {
            DB::rollBack();
            return DV::error('Space not found.');
        }
        if ($space->status_id !== 2) {
            DB::rollBack();
            return DV::error('This space does not have an active booking.');
        }

        DB::table('space_bookings')->where('space_id', $space_id)->delete();
        DB::table('building_spaces')
            ->where('id', $space_id)
            ->update(['status_id' => 1]);

        DB::commit();

        return DV::depends(1, ['action' => 'cancelled', 'space_id' => $space_id]);
    } catch (\Exception $e) {
        DB::rollBack();
        return DV::error('Unable to cancel booking.');
    }
}
}
