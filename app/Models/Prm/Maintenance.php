<?php

namespace App\Models\Prm;

use App\Models\Prm\GeneralSettings;
use DV;
use Vsd\Vsloquent\VSModel;
use DBX;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;

class Maintenance extends VSModel
{
    protected $userInfo = null;
    protected $table = 'maintenances';

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
            'description'          => '0|string|0-2000',
            'start_date'           => '0|date',
            'end_date'             => '0|date',
            'status_id'            => '0|number|exists=maintenance_statuses.id',
            'remarks'              => '0|string|0-1000',
        ];

        $allowed_chars = ['@', ',', '-', '.', '#', '!', '?', '(', ')', "\n"];
        $res = DBX::validateObject(
            $arr,
            $v_rule,
            1,
            ['description' => $allowed_chars, 'remarks' => $allowed_chars],
            $ss->lang ?? 'en',
            0,
            null
        );

        if ($res->error) {
            return DV::error($res->error);
        }

        $input = $res->values;

        if (!empty($input['start_date'])) {
            $input['start_date'] = date('Y-m-d H:i:s', strtotime($input['start_date']));
        } else {
            $input['start_date'] = null;
        }
        if (!empty($input['end_date'])) {
            $input['end_date'] = date('Y-m-d H:i:s', strtotime($input['end_date']));
        } else {
            $input['end_date'] = null;
        }

        if (isset($input['space_id']) && (int) $input['space_id'] <= 0) {
            $input['space_id'] = null;
        }
        if (isset($input['amenity_id']) && (int) $input['amenity_id'] <= 0) {
            $input['amenity_id'] = null;
        }
        if (empty($input['status_id'])) {
            $input['status_id'] = 1; // default: Pending
        }

        try {
            $save_id = DBX::saveData($ss, 'maintenances', ['id' => $id], $input, [], 0);
            if (!$save_id) {
                return DV::error('Failed to save maintenance.');
            }
            if (!empty($input['space_id'])) {
                DB::table('building_spaces')->where('id', $input['space_id'])->update(['maintenance_status_id' => 1]);
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
        $current_page     = (int) ($d->current_page ?? 1);
        $per_page         = (int) ($d->per_page ?? 10);
        $skip_rows        = ($current_page - 1) * $per_page;

        $where_search = "1=1";
        $where_more   = "1=1";

        if ($search_value) {
            $search = escape_like_str($search_value);
            $where_search = "(m.description LIKE '%{$search}%' OR m.remarks LIKE '%{$search}%' OR b.name LIKE '%{$search}%' OR bs.code LIKE '%{$search}%')";
        }
        if ($building_id) {
            $where_more .= ' AND m.building_id = ' . (int) $building_id;
        }
        if ($space_id) {
            $where_more .= ' AND m.space_id = ' . (int) $space_id;
        }
        if ($status_id !== null && $status_id !== '' && $status_id !== 'all') {
            $where_more .= ' AND m.status_id = ' . (int) $status_id;
        }

        $updated_at = DBX::formatTime('m.updated_at', 'updated_at');

        $query = DB::table('maintenances as m')
            ->join('buildings as b', 'b.id', '=', 'm.building_id')
            ->leftJoin('building_spaces as bs', 'bs.id', '=', 'm.space_id')
            ->leftJoin('amenities as a', 'a.id', '=', 'm.amenity_id')
            ->leftJoin('maintenance_statuses as ms', 'ms.id', '=', 'm.status_id')
            ->whereRaw($where_search)
            ->whereRaw($where_more)
            ->selectRaw("
                m.id, m.building_id, b.name as building_name,
                m.space_id, bs.code as space_code,
                m.amenity_id, a.name as amenity_name,
                m.description, m.start_date, m.end_date,
                m.status_id, ms.name as status_name,
                m.remarks,
                m.create_uid, m.create_user, m.update_uid, m.update_user,
                $updated_at
            ")
            ->orderBy('m.id', 'DESC');

        $total = (clone $query)->count('m.id');
        $rows  = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            setOfficialDates($row, [], ['updated_at', 'start_date', 'end_date'], []);
        }

        return new LengthAwarePaginator($rows, $total, $per_page, $current_page);
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
                'm.description', 'm.start_date', 'm.end_date',
                'm.status_id', 'm.remarks',
                'm.create_uid', 'm.create_user', 'm.update_uid', 'm.update_user', 'm.updated_at',
                'b.name as building_name', 'bs.code as space_code', 'a.name as amenity_name',
                'ms.name as status_name'
            ])
            ->first();

        if ($row) {
            setOfficialDates($row, [], ['updated_at', 'start_date', 'end_date'], []);
        }
        return $row;
    }

    public function getFormOptions($arr = [], $ss = null)
    {
        $ss = $ss ?: $this->userInfo;
        $d = (object) $arr;
        $id = $d->id ?? $this->id;
        $details = $id ? self::getMaintenanceDetails($id) : null;

        return (object) [
            'maintenance_details' => $details,
            'buildings'           => GeneralSettings::options_building($ss),
            'building_spaces'     => GeneralSettings::options_building_space($ss),
            'amenities'           => GeneralSettings::options_amenity($ss),
            'maintenance_statuses' => GeneralSettings::options_maintenance_status($ss),
        ];
    }

    public function deleteById($id = null)
    {
        $id = $id ?? $this->id;
        $row = DB::table('maintenances')->where('id', $id)->first();
        $space_id = $row->space_id ?? null;
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
        $status_id = (int) ($arr['status_id'] ?? 0);

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
            $space_id = isset($row->space_id) ? (int) $row->space_id : 0;
            if ($space_id > 0) {
                DB::table('building_spaces')->where('id', $space_id)->update(['maintenance_status_id' => 0]);
            }
        }
        return DV::success(['message' => 'Status updated successfully']);
    }
}
