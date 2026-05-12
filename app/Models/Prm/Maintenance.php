<?php

namespace App\Models\Prm;

use App\Models\Prm\GeneralSettings;
use Carbon\Carbon;
use DV;
use Vsd\Vsloquent\VSModel;
use DBX;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;

class Maintenance extends VSModel
{
    protected $userInfo = null;
    protected $table = 'maintenances';

    public static function computeScheduleStatusId($startDate, $endDate = null)
    {
        $now = Carbon::now();
        $start = Carbon::parse($startDate);

        if ($now->lt($start)) {
            return 1; // Planned
        }

        return 2; // In Progress
    }


    public static function resolveSpaceMaintenanceStatusId($spaceId)
    {
        $spaceId = $spaceId;
        if ($spaceId <= 0) {
            return 0;
        }

        $hasInProgress = DB::table('maintenances')
            ->where('space_id', $spaceId)
            ->where('status_id', 2)
            ->exists();
        if ($hasInProgress) {
            return 2;
        }

        $hasPlanned = DB::table('maintenances')
            ->where('space_id', $spaceId)
            ->where('status_id', 1)
            ->exists();
        if ($hasPlanned) {
            return 1;
        }

        return 0;
    }

    // Amenity is considered "under maintenance" only when the schedule is
    // already In-Progress (status_id = 2) or its start time has arrived.
    private static function shouldBeMaintenance($startDate, $statusId)
    {
        if ($statusId === 2) {
            return true;
        }
        if (empty($startDate)) {
            return false;
        }
        return time() >= strtotime($startDate);
    }

    // Centralised amenity status writer used by upsert/setStatus/auto-derive.
    private static function syncAmenityStatus($amenityId, $toMaintenance, $ss = null)
    {
        if ($amenityId <= 0) {
            return;
        }
        if ($toMaintenance) {
            $statusId = DB::table('amenity_statuses')
                ->whereRaw('LOWER(TRIM(name)) = ?', ['maintenance'])
                ->value('id');
            if (!$statusId) {
                return;
            }
        } else {
            $statusId = 1; // Active
        }
        DB::table('amenities')
            ->where('id', $amenityId)
            ->update([
                'status_id'   => $statusId,
                'update_user' => $ss->full_name ?? 'System',
                'update_uid'  => $ss->id ?? null,
                'updated_at'  => getNowTime(),
            ]);
    }

    public static function applyScheduleDerivedStatus(object $row, $statusIdToName = null): void
    {
        $sid = ($row->status_id ?? 0);
        if (in_array($sid, [3, 4], true)) {
            return;
        }
        $start = $row->start_date ?? null;
        if (!$start) {
            return;
        }
        $end = $row->end_date ?? null;
        try {
            $computed = self::computeScheduleStatusId($start, $end);
        } catch (\Throwable $e) {
            return;
        }
        $id = ($row->id ?? 0);
        if ($id > 0 && $computed !== $sid) {
            DB::table('maintenances')->where('id', $id)->update(['status_id' => $computed]);
        }
        $spaceId = ($row->space_id ?? 0);
        if ($spaceId > 0) {
            DB::table('building_spaces')
                ->where('id', $spaceId)
                ->update(['maintenance_status_id' => self::resolveSpaceMaintenanceStatusId($spaceId)]);
        }
        $amenityId = ($row->amenity_id ?? 0);
        if ($amenityId > 0) {
            if ($computed === 2) {
                self::syncAmenityStatus($amenityId, true, null);
            } elseif ($computed === 3) {
                // Only release if no other planned/in-progress maintenance exists for this amenity.
                $otherActive = DB::table('maintenances')
                    ->where('amenity_id', $amenityId)
                    ->where('id', '!=', $id)
                    ->whereIn('status_id', [1, 2])
                    ->exists();
                if (!$otherActive) {
                    self::syncAmenityStatus($amenityId, false, null);
                }
            }
        }
        $row->status_id = $computed;
        if ($statusIdToName !== null) {
            $name = $statusIdToName[$computed] ?? null;
            if ($name !== null) {
                $row->status_name = $name;
            }
        } else {
            $name = DB::table('maintenance_statuses')->where('id', $computed)->value('name');
            if ($name !== null) {
                $row->status_name = $name;
            }
        }
        if ((int) $row->status_id === 1) {
            $row->status_name = 'Planned';
        }
    }

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
            'building_id' => '1|number|exists=buildings.id|text=Please select a building.',
            'space_id'    => '0|number|exists=building_spaces.id',
            'amenity_id'  => '0|number|exists=amenities.id',
            'start_date'  => '1|TIMESTAMP|text=Start date is required.',
            'end_date'    => '1|TIMESTAMP|text=End date is required.',
            'remarks'     => '0|string|0-255',
        ];

        $res = DBX::validateObject(
            $arr,
            $v_rule,
            1,
            ['remarks' => ['@', ',', '-', '.', '#', '!', '?', '(', ')', "\n"]],
            $ss->lang ?? 'en'
        );

        if ($res->error) return DV::error($res->error);

        $input = $res->values;

        $spaceId = ($input['space_id'] ?? 0);
        $amenityId =($input['amenity_id'] ?? 0);
        if ($spaceId <= 0 && $amenityId <= 0) {
            return DV::error('Unit code is required.');
        }
        if ($spaceId > 0 && $amenityId > 0) {
            return DV::error('Select either a space or an amenity.');
        }

        $rawStartDate = trim(($arr['start_date'] ?? ''));
        $rawEndDate = trim(($arr['end_date'] ?? ''));
        if ($rawStartDate === '' && $rawEndDate === '') {
            return DV::error('Start date and end date are required.');
        }
        if ($rawStartDate === '') {
            return DV::error('Start date is required.');
        }
        if ($rawEndDate === '') {
            return DV::error('End date is required.');
        }

        $hasStartTime = trim(($arr['start_time'] ?? '')) !== ''
            || preg_match('/\d{1,2}:\d{2}/', (string) ($arr['start_date'] ?? ''));
        if (!$hasStartTime) {
            return DV::error('Please enter valid start time.');
        }

        $start = strtotime($input['start_date']);
        $end   = strtotime($input['end_date']);
        $now   = time();

        if ($start < strtotime(date('Y-m-d'))) {
            return DV::error('Start date cannot be in the past.');
        }

        if ($end < strtotime(date('Y-m-d'))) {
            return DV::error('End date cannot be in the past.');
        }

        if ($start > $end) {
            return DV::error('Start must be before end.');
        }

        if (date('Y-m-d', $start) === date('Y-m-d', $end) && $start >= $end) {
            return DV::error('Start time must be before end time.');
        }

        if ($start < $now) {
            return DV::error('Start time cannot be in the past.');
        }

        if ($end < $now) {
            return DV::error('End time cannot be in the past.'); 
        }

        if (!empty($input['amenity_id'])) {
            $hasReservation = DB::table('reservations')
                ->where('amenity_id', $input['amenity_id'])
                ->whereIn('status_id', [1, 2])
                ->exists();

            if ($hasReservation) {
                return DV::error('Amenity has active or upcoming reservations.');
            }
        }

        $sid = $input['status_id'] ?? 0;
        if (!in_array($sid, [3, 4], true)) {
            $input['status_id'] = self::computeScheduleStatusId(
                $input['start_date'],
                $input['end_date']
            );
        }
        try {
            $save_id = DBX::saveData($ss, 'maintenances', ['id' => $id], $input);
            if (!$save_id) return DV::error('Save failed.');
            if (!empty($input['space_id'])) {
                $map = [1 => 1, 2 => 2];
                DB::table('building_spaces')
                    ->where('id', $input['space_id'])
                    ->update([
                        'maintenance_status_id' => $map[$input['status_id']] ?? 0
                    ]);
            }
            if (!empty($input['amenity_id'])) {
                if (self::shouldBeMaintenance($input['start_date'], $input['status_id'])) {
                    self::syncAmenityStatus($input['amenity_id'], true, $ss);
                }
            }

            return DV::success([
                'message' => $id ? 'Updated successfully' : 'Created successfully'
            ]);

        } catch (\Exception $e) {
            return DV::error('Error: ' . $e->getMessage());
        }
    }

    public function getMaintenanceList($arr, $ss = null)
    {
        $d = (object) $arr;
        $search_value      = $d->search_value ?? null;
        $building_id      = $d->building_id ?? null;
        $space_id         = $d->space_id ?? null;
        $status_id        = $d->status_id ?? null;
        $current_page     = $d->current_page ?? 1;
        $per_page         = $d->per_page ?? 10;
        if(!is_numeric($current_page) || !is_numeric($per_page)){
            return null;
        }
        $skip_rows        = ($current_page - 1) * $per_page;
        $str_search = "1=1";
        $str_moreWhere   = "2=2";

        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(bs.code LIKE '%" .$search_value ."%' OR a.code LIKE '%" .$search_value ."%')";
        }
        if ($building_id) {
            $str_moreWhere .= ' AND m.building_id = ' . $building_id;
        }
        if ($space_id) {
            $str_moreWhere .= ' AND m.space_id = ' . $space_id;
        }
        if ($status_id) {
            $str_moreWhere .= ' AND m.status_id =' . $status_id;
        }
        $query = DB::table('maintenances as m')
            ->join('buildings as b', 'b.id', '=', 'm.building_id')
            ->leftJoin('building_spaces as bs', 'bs.id', '=', 'm.space_id')
            ->leftJoin('amenities as a', 'a.id', '=', 'm.amenity_id')
            ->leftJoin('maintenance_statuses as ms', 'ms.id', '=', 'm.status_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw("
                m.id, m.building_id, b.name as building_name,
                m.space_id, bs.code as space_code,
                m.amenity_id, a.name as amenity_name, a.code as amenity_code, m.start_date, m.end_date,
                m.status_id, ms.name as status_name,
                m.remarks,
                m.create_uid, m.create_user, m.update_uid, m.update_user,m.updated_at")
            ->orderBy('m.id', 'DESC');

        $clone_query = clone $query;
        $count = $clone_query->count('m.id');
        $rows  = $query->skip($skip_rows)->take($per_page)->get();

        $statusIdToName = DB::table('maintenance_statuses')->pluck('name', 'id');
        foreach ($rows as $row) {
            self::applyScheduleDerivedStatus($row, $statusIdToName);
            if (!empty($row->start_date)) {
                $row->start_date = Carbon::parse($row->start_date)->format('d-M-Y h:i A');
            }
            if (!empty($row->end_date)) {
                $row->end_date = Carbon::parse($row->end_date)->format('d-M-Y h:i A');
            }
            $processed = setOfficialDates($row, [''], ['updated_at'], []);
            if ($processed) $row = $processed;
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public static function getMaintenanceDetails($id)
    {

           $row = DB::table('maintenances as m')
            ->join('buildings as b', 'b.id', '=', 'm.building_id')
            ->leftJoin('building_spaces as bs', 'bs.id', '=', 'm.space_id')
            ->leftJoin('amenities as a', 'a.id', '=', 'm.amenity_id')
            ->leftJoin('maintenance_statuses as ms', 'ms.id', '=', 'm.status_id')
            ->where('m.id', $id)
            ->select([
                'm.id', 'm.building_id', 'm.space_id', 'm.amenity_id',
                'm.start_date', 'm.end_date',
                'm.status_id', 'm.remarks',
                'm.create_uid', 'm.create_user', 'm.update_uid', 'm.update_user', 'm.updated_at',
                'b.name as building_name', 'bs.code as space_code', 'a.name as amenity_name', 'a.code as amenity_code',
                'ms.name as status_name'
            ])
            ->first();



        if ($row) {
            self::applyScheduleDerivedStatus($row);
            setOfficialDates($row, [''], ['updated_at'], []);
            $row->start_date = Carbon::parse($row->start_date)
                ->format('d-M-Y h:i A');

            $row->end_date = Carbon::parse($row->end_date)
                ->format('d-M-Y h:i A');
                    }
        return $row;
    }

    public function getFormOptions($arr = [], $ss = null)
    {
        $ss = $ss ?: $this->userInfo;
        $d = (object) $arr;
        $id = $d->id ?? $this->id;
        $details = $id ? self::getMaintenanceDetails($id) : null;

        // When creating from Space/Amenity context, request may pass ids so options lists include that row
        // (e.g. space already under maintenance would otherwise be excluded from building_spaces).
        $include_space_id = null;
        if ($details && !empty($details->space_id)) {
            $include_space_id = $details->space_id;
        } elseif (!empty($d->space_id)) {
            $include_space_id = $d->space_id;
        }
        $include_amenity_id = null;
        if ($details && !empty($details->amenity_id)) {
            $include_amenity_id = $details->amenity_id;
        } elseif (!empty($d->amenity_id)) {
            $include_amenity_id = $d->amenity_id;
        }

        // For maintenance, unit can be Available/Booked/Occupied.
        // Keep excluding spaces already under maintenance, but do not filter by space status.
        $spaceIds = DB::table('building_spaces')
            ->where(function ($q) use ($include_space_id) {
                $q->where('maintenance_status_id', 0)
                    ->orWhereNull('maintenance_status_id');
                if (!empty($include_space_id)) {
                    $q->orWhere('id', $include_space_id);
                }
            })
            ->pluck('id')
            ->all();
        $building_spaces = GeneralSettings::options_building_space_rows_by_ids($spaceIds);

        $amenities = GeneralSettings::options_maintenance_amenity($ss);
        if (!empty($include_amenity_id)) {
            $hasIncludedAmenity = $amenities->contains(function ($a) use ($include_amenity_id) {
                return ($a->id ?? 0) === $include_amenity_id;
            });
            if (!$hasIncludedAmenity) {
                $selectedAmenity = DB::table('amenities')
                    ->where('id', $include_amenity_id)
                    ->selectRaw('id, building_id, name AS amenity, code as amenity_code, max_capacity, category_id')
                    ->first();
                if ($selectedAmenity) {
                    $amenities->push($selectedAmenity);
                }
            }
        }
        // $amenities = GeneralSettings::options_amenity($ss, false);
        $under_maintenance_amenity_ids = DB::table('maintenances')
            ->whereNotNull('amenity_id')
            ->where('amenity_id', '>', 0)
            ->where('start_date', '<=', now()->format('Y-m-d H:i:s'))
            ->where('end_date', '>=', now()->format('Y-m-d H:i:s'))
            ->whereNotIn('status_id', [3, 4])
            ->pluck('amenity_id')
            ->unique()
            ->values()
            ->all();
        $amenities = $amenities->filter(function ($a) use ($under_maintenance_amenity_ids, $include_amenity_id) {
            if (!empty($include_amenity_id) &&  $a->id === $include_amenity_id) {
                return true;
            }
            return !in_array($a->id, array_map('intval', $under_maintenance_amenity_ids), true);
        })->values();

        return (object) [
            'maintenance_details' => $details,
            'buildings'           => GeneralSettings::options_building($ss),
            'building_spaces'     => $building_spaces,
            'amenities'           => $amenities,
            'maintenance_statuses' => GeneralSettings::options_maintenance_status($ss),
        ];
    }

    public function deleteById($id = null)
    {
        $id = $id ?? $this->id;
        $row = DB::table('maintenances')->where('id', $id)->first();
        $space_id = $row->space_id ?? null;
        if(!$row) {
            return DV::error('Maintenance not found');
        }
        $deleted = self::deleteBy(['id' => $id]);
        if ($deleted && $space_id) {
            DB::table('building_spaces')->where('id', $space_id)->update(['maintenance_status_id' => 0]);
        }
        if (!$deleted) {
            return DV::error('Failed to delete maintenance');
        }
        return DV::success(['message' => 'Maintenance has been deleted.']);
    }

    public function setStatus($arr, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $id        = $arr['id'] ?? null;
        $status_id =  ($arr['status_id'] ?? 0);

        if (!$id || !$status_id) {
            return DV::error('Missing required parameters');
        }
        $row = DB::table('maintenances')->where('id', $id)->first();
        if (!$row) {
            return DV::error('Maintenance not found');
        }
        $data = [
            'status_id'   => $status_id,
            'update_user' => $ss->full_name ?? 'System',
            'update_uid'  => $ss->id ?? null,
            'updated_at'  => getNowTime(),
        ];
        $updated = DB::table('maintenances')->where('id', $id)->update($data);
        if ($updated === 0) {
            return DV::error('No changes made');
        }
        $space_id = isset($row->space_id) ?  $row->space_id : 0;
        if ($space_id > 0) {
            $spaceMaintenanceStatusId = 0;
            if ($status_id === 1) {
                $spaceMaintenanceStatusId = 1; // upcoming
            } elseif ($status_id === 2) {
                $spaceMaintenanceStatusId = 2; // in maintenance
            }
            DB::table('building_spaces')->where('id', $space_id)->update(['maintenance_status_id' => $spaceMaintenanceStatusId]);
        }

        $amenity_id = isset($row->amenity_id) ?  $row->amenity_id : 0;
        if ($amenity_id > 0) {
            // In-Progress (2): mark amenity as Maintenance.
            // Cancelled (4) or Completed (3): release amenity to Active.
            if ($status_id === 2) {
                self::syncAmenityStatus($amenity_id, true, $ss);
            } elseif ($status_id === 3 || $status_id === 4) {
                self::syncAmenityStatus($amenity_id, false, $ss);
            }
        }
        return DV::success(['message' => 'Status updated successfully']);
    }

    public function finishBySpaceId($arr, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $space_id = isset($arr['space_id']) ?  $arr['space_id'] : 0;

        if ($space_id <= 0) {
            return DV::error('Missing required parameters');
        }

        $row = DB::table('maintenances')
            ->where('space_id', $space_id)
            ->whereIn('status_id', [1, 2])
            ->orderBy('id', 'DESC')
            ->first();

        if (!$row) {
            return DV::error('No active maintenance found for this space');
        }

        return $this->setStatus(['id' => $row->id, 'status_id' => 3], $ss);
    }

    public function finishByAmenityId($arr, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $amenity_id = isset($arr['amenity_id']) ? $arr['amenity_id'] : 0;

        if ($amenity_id <= 0) {
            return DV::error('Missing required parameters');
        }

        $row = DB::table('maintenances')
            ->where('amenity_id', $amenity_id)
            ->whereIn('status_id', [1, 2])
            ->orderBy('id', 'DESC')
            ->first();

        if (!$row) {
            return DV::error('No active maintenance found for this amenity');
        }

        return $this->setStatus(['id' => $row->id, 'status_id' => 3], $ss);
    }
}
