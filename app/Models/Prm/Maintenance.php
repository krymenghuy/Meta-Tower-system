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
            'maintenance_type_id'  => '1|number|exists=maintenance_types.id',
            'description'          => '0|string|0-2000',
            'request_date'         => '1|date',
            'scheduled_date'       => '0|date',
            'completed_date'       => '0|date',
            'status_id'            => '1|number|exists=maintenance_statuses.id',
            'assigned_staff_id'    => '0|number|exists=um_users.id',
            'cost'                 => '0|numeric|min:0',
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

        $input['request_date'] = isset($input['request_date'])
            ? (int) date('Ymd', strtotime($input['request_date']))
            : (int) date('Ymd');
        if (!empty($input['scheduled_date'])) {
            $input['scheduled_date'] = (int) date('Ymd', strtotime($input['scheduled_date']));
        } else {
            $input['scheduled_date'] = null;
        }
        if (!empty($input['completed_date'])) {
            $input['completed_date'] = (int) date('Ymd', strtotime($input['completed_date']));
        } else {
            $input['completed_date'] = null;
        }

        if (isset($input['cost']) && $input['cost'] === '') {
            $input['cost'] = null;
        }
        if (isset($input['assigned_staff_id']) && (int) $input['assigned_staff_id'] <= 0) {
            $input['assigned_staff_id'] = null;
        }
        if (isset($input['space_id']) && (int) $input['space_id'] <= 0) {
            $input['space_id'] = null;
        }
        if (isset($input['amenity_id']) && (int) $input['amenity_id'] <= 0) {
            $input['amenity_id'] = null;
        }

        try {
            $save_id = DBX::saveData($ss, 'maintenances', ['id' => $id], $input, [], 0);
            if (!$save_id) {
                return DV::error('Failed to save maintenance.');
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
        $maintenance_type_id = $d->maintenance_type_id ?? null;
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
        if ($maintenance_type_id) {
            $where_more .= ' AND m.maintenance_type_id = ' . (int) $maintenance_type_id;
        }

        $updated_at = DBX::formatTime('m.updated_at', 'updated_at');

        $query = DB::table('maintenances as m')
            ->join('buildings as b', 'b.id', '=', 'm.building_id')
            ->leftJoin('building_spaces as bs', 'bs.id', '=', 'm.space_id')
            ->leftJoin('amenities as a', 'a.id', '=', 'm.amenity_id')
            ->join('maintenance_types as mt', 'mt.id', '=', 'm.maintenance_type_id')
            ->leftJoin('maintenance_statuses as ms', 'ms.id', '=', 'm.status_id')
            ->leftJoin('um_users as u', 'u.id', '=', 'm.assigned_staff_id')
            ->whereRaw($where_search)
            ->whereRaw($where_more)
            ->selectRaw("
                m.id, m.building_id, b.name as building_name,
                m.space_id, bs.code as space_code,
                m.amenity_id, a.name as amenity_name,
                m.maintenance_type_id, mt.name as maintenance_type_name,
                m.description, m.request_date, m.scheduled_date, m.completed_date,
                m.status_id, ms.name as status_name,
                m.assigned_staff_id, u.login_name as assigned_staff_name,
                m.cost, m.remarks,
                m.create_uid, m.create_user, m.update_uid, m.update_user,
                $updated_at
            ")
            ->orderBy('m.id', 'DESC');

        $total = (clone $query)->count('m.id');
        $rows  = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            foreach (['request_date', 'scheduled_date', 'completed_date'] as $col) {
                if (!empty($row->$col) && is_numeric($row->$col)) {
                    $dt = \DateTime::createFromFormat('Ymd', (string) $row->$col);
                    $row->$col = $dt ? $dt->format('Y-m-d') : $row->$col;
                }
            }
            setOfficialDates($row, ['request_date', 'scheduled_date', 'completed_date'], ['updated_at'], []);
        }

        return new LengthAwarePaginator($rows, $total, $per_page, $current_page);
    }

    public static function getMaintenanceDetails($id)
    {
        $row = DB::table('maintenances as m')
            ->join('buildings as b', 'b.id', '=', 'm.building_id')
            ->leftJoin('building_spaces as bs', 'bs.id', '=', 'm.space_id')
            ->leftJoin('amenities as a', 'a.id', '=', 'm.amenity_id')
            ->join('maintenance_types as mt', 'mt.id', '=', 'm.maintenance_type_id')
            ->leftJoin('maintenance_statuses as ms', 'ms.id', '=', 'm.status_id')
            ->leftJoin('um_users as u', 'u.id', '=', 'm.assigned_staff_id')
            ->where('m.id', $id)
            ->select([
                'm.id', 'm.building_id', 'm.space_id', 'm.amenity_id',
                'm.maintenance_type_id', 'm.description', 'm.request_date', 'm.scheduled_date', 'm.completed_date',
                'm.status_id', 'm.assigned_staff_id', 'm.cost', 'm.remarks',
                'm.create_uid', 'm.create_user', 'm.update_uid', 'm.update_user', 'm.updated_at',
                'b.name as building_name', 'bs.code as space_code', 'a.name as amenity_name',
                'mt.name as maintenance_type_name', 'ms.name as status_name', 'u.login_name as assigned_staff_name'
            ])
            ->first();

        if ($row) {
            foreach (['request_date', 'scheduled_date', 'completed_date'] as $col) {
                if (!empty($row->$col) && is_numeric($row->$col)) {
                    $dt = \DateTime::createFromFormat('Ymd', (string) $row->$col);
                    $row->$col = $dt ? $dt->format('Y-m-d') : $row->$col;
                }
            }
            setOfficialDates($row, ['request_date', 'scheduled_date', 'completed_date'], ['updated_at'], []);
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
            'maintenance_types'   => GeneralSettings::options_maintenance_type($ss),
            'maintenance_statuses' => GeneralSettings::options_maintenance_status($ss),
            'staff'              => GeneralSettings::options_staff($ss),
        ];
    }

    public function deleteById($id = null)
    {
        $id = $id ?? $this->id;
        $deleted = self::deleteBy(['id' => $id]);
        return DV::depends($deleted, 'Failed to delete maintenance');
    }

    public function setStatus($arr, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $id        = $arr['id'] ?? null;
        $status_id = $arr['status_id'] ?? null;

        if (!$id || !$status_id) {
            return DV::error('Missing required parameters');
        }
        $data = [
            'status_id'   => $status_id,
            'update_user' => $ss->full_name ?? 'System',
            'update_uid'  => $ss->id ?? null,
            'updated_at'  => getNowTime(),
        ];
        $updated = DB::table('maintenances')->where('id', $id)->update($data);
        if ($updated === 0) {
            return DV::error('Maintenance not found or no changes made');
        }
        return DV::success(['message' => 'Status updated successfully']);
    }
}
