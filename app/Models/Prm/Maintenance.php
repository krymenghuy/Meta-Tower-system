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

    /**
     * Planned (1) / In Progress (2) from schedule window vs current time.
     * Before start -> 1, from start onwards -> 2.
     * Completed (3) must be set manually via finish action.
     */
    public static function computeScheduleStatusId($startDate, $endDate = null): int
    {
        $now = Carbon::now();
        $startAt = Carbon::parse($startDate);
        if ($now->lt($startAt)) {
            return 1;
        }
        return 2;
    }

    /**
     * Persist and reflect schedule-derived status when not Completed (3) or Cancelled (4).
     * Call before setOfficialDates() so date fields are still parseable DB values.
     *
     * @param object $row list/detail row with id, status_id, start_date, end_date, status_name
     * @param \Illuminate\Support\Collection|array|null $statusIdToName pluck('name','id') optional
     */
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
        try {
            $computed = self::computeScheduleStatusId($start);
        } catch (\Throwable $e) {
            return;
        }
        $id = ($row->id ?? 0);
        if ($id > 0 && $computed !== $sid) {
            DB::table('maintenances')->where('id', $id)->update(['status_id' => $computed]);
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
            'building_id'          => '1|number|exists=buildings.id',
            'space_id'             => '0|number|exists=building_spaces.id',
            'amenity_id'           => '0|number|exists=amenities.id',
            'start_date'           => '1|TIMESTAMP',
            'end_date'             => '1|TIMESTAMP',
            'remarks'              => '0|string|0-255',
        ];

        $allowed_chars = ['@', ',', '-', '.', '#', '!', '?', '(', ')', "\n"];
        $res = DBX::validateObject($arr,$v_rule,1,['remarks' => $allowed_chars],$ss->lang ?? 'en',0,null);
        if ($res->error) {
            return DV::error($res->error);
        }
        $input = $res->values;

        $startAt = Carbon::parse($input['start_date']);
        $endAt = Carbon::parse($input['end_date']);
        if ($startAt->greaterThanOrEqualTo($endAt)) {
            return DV::error(
                'Start date and time must be before end date and time. Expected format: YYYY-MM-DD hh:mm AM/PM.'
            );
        }

        try {
            $sid = ($input['status_id'] ?? 0);
            if (!in_array($sid, [3, 4], true)) {
                $start = $input['start_date'] ?? null;
                if ($start) {
                    $input['status_id'] = self::computeScheduleStatusId($start);
                }
            }
        } catch (\Exception $e) {
            // ignore auto-sync errors
        }

        try {
            $save_id = DBX::saveData($ss, 'maintenances', ['id' => $id], $input, [], 0);
            if (!$save_id) {
                return DV::error('Failed to save maintenance.');
            }
            if (!empty($input['space_id'])) {
                DB::table('building_spaces')->where('id', $input['space_id'])->update(['maintenance_status_id' => 1]);
            }
            if (!empty($input['amenity_id'])) {
                $underMaintenanceId = DB::table('amenity_statuses')->whereRaw('LOWER(TRIM(name)) = ?', ['maintenance'])->value('id');
                if ($underMaintenanceId) {
                    DB::table('amenities')->where('id', $input['amenity_id'])->update([
                        'status_id'   => $underMaintenanceId,
                        'update_user' => $ss->full_name ?? 'System',
                        'update_uid'  => $ss->id ?? null,
                        'updated_at'  => getNowTime(),
                    ]);
                }
            }
            $message = !$id ? 'Maintenance created successfully' : 'Maintenance updated successfully';
            return DV::success(['message' => $message]);
        } catch (\Exception $e) {
            return DV::error('Error saving maintenance: ' . $e->getMessage());
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
            $str_search = "(b.name LIKE '%" .$search_value ."%' OR bs.code LIKE '%" .$search_value ."%' OR a.code LIKE '%" .$search_value ."%')";
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
            $processed = setOfficialDates($row, ['updated_at'], ['updated_at'], []);
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
            // setOfficialDates($row, [], ['updated_at', 'start_date', 'end_date'], []);
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

        $building_spaces = GeneralSettings::options_building_space($ss, $include_space_id, true);

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
        if($row->status_id == 2) {
            return DV::error('Cannot delete maintenance that is In Progress');
        }
        if($row->status_id == 3) {
            return DV::error('Cannot delete maintenance that is Completed');
        }
        $deleted = self::deleteBy(['id' => $id]);
        if ($deleted && $space_id) {
            DB::table('building_spaces')->where('id', $space_id)->update(['maintenance_status_id' => 0]);
        }
        return DV::depends($deleted, 'Failed to delete maintenance');
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
        // When Cancelled (4) or Completed (3): stop showing "(Under maintenance)" on the space card
        if ($status_id === 3 || $status_id === 4) {
            $space_id = isset($row->space_id) ?  $row->space_id : 0;
            if ($space_id > 0) {
                DB::table('building_spaces')->where('id', $space_id)->update(['maintenance_status_id' => 0]);
            }
            $amenity_id = isset($row->amenity_id) ?  $row->amenity_id : 0;
            if ($amenity_id > 0) {
                DB::table('amenities')->where('id', $amenity_id)->update([
                    'status_id'   => 1,
                    'update_user' => $ss->full_name ?? 'System',
                    'update_uid'  => $ss->id ?? null,
                    'updated_at'  => getNowTime(),
                ]);
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
