<?php

namespace App\Models\Prm;

use App\Models\Prm\GeneralSettings;
use DV;
use Vsd\Vsloquent\VSModel;
use DBX;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;
use Log;

class ServiceRequest extends VSModel
{
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
            'tenant_id'         => '1|number|exists=tenants.id',
            'service_id'        => '1|number|exists=services.id',
            'space_id'          => '1|number|exists=building_spaces.id',
            'service_type_id'   => '1|number|exists=service_types.id',
            'description'       => '0|string|0-1000',
            'duration_hours'    => '0|numeric|min:0.5|nullable',
            'unit_type'         => '0|string|in:one_time,hour,month,time|nullable',
            'request_status_id' => '0|number|default=1|exists=request_status.id',
            'request_date'      => '0|date',
            'scheduled_date'    => '0|date',
            'completed_date'    => '0|date',
        ];

        $allowed_chars = ['@', ',', '-', '.', '#', '!', '?', '(', ')', "\n"];

        $res = DBX::validateObject(
            $arr,
            $v_rule,
            1,
            ['description' => $allowed_chars],
            $ss->lang ?? 'en',
            0,
            null
        );

        if ($res->error) {
            return DV::error($res->error);
        }

        $input = $res->values;
        if (empty($input['space_id'])) {
            if (!empty($input['building_id'])) {
                $input['space_id'] = $input['building_id'];
                Log::info('Fallback: using building_id as space_id', ['building_id' => $input['building_id']]);
            } elseif (!empty($input['floor_id'])) {
                $input['space_id'] = $input['floor_id'];
                Log::info('Fallback: using floor_id as space_id', ['floor_id' => $input['floor_id']]);
            } else {
                return DV::error('Space / Building / Floor information is required.');
            }
        }
        $service = DB::table('services')->find($input['service_id']);
        if (!$service) {
            return DV::error('Invalid service selected.');
        }
        $unitTypeMap = [
            'one_time' => 0,
            'hour'     => 1,
            'month'    => 2,
            'time'     => 3,
        ];

        $unit_string = $arr['unit_type'] ?? $service->unit_type ?? null;
        $unit_type_value = null;

        if ($unit_string !== null && $unit_string !== '') {
            $unit_string = trim(strtolower($unit_string));

            if (isset($unitTypeMap[$unit_string])) {
                $unit_type_value = $unitTypeMap[$unit_string];
            } elseif (is_numeric($unit_string)) {
                $tmp = (int)$unit_string;
                if (in_array($tmp, [0, 1, 2, 3], true)) {
                    $unit_type_value = $tmp;
                }
            } else {
                Log::warning('Invalid unit_type value received - will use service default', [
                    'received' => $unit_string,
                    'service_unit_type' => $service->unit_type ?? 'missing',
                    'service_id' => $input['service_id']
                ]);
            }
        }
        if ($unit_type_value === null && isset($unitTypeMap[$service->unit_type])) {
            $unit_type_value = $unitTypeMap[$service->unit_type];
        }

        $input['unit_type'] = $unit_type_value;
        if ($input['unit_type'] !== null && !is_int($input['unit_type'])) {
            Log::error('unit_type is not integer before save - forced to NULL', [
                'attempted' => $input['unit_type'],
                'input_data' => $arr
            ]);
            $input['unit_type'] = null;
        }
        if ($service->unit_type === 'hour') {
            $duration_hours = !empty($arr['duration_hours']) ? (float)$arr['duration_hours'] : null;

            if ($duration_hours === null || $duration_hours <= 0 || !is_numeric($duration_hours)) {
                return DV::error('Please select a valid duration for hourly services.');
            }

            $input['duration_hours'] = round($duration_hours, 2);
            $input['total_price']    = round($service->price * $duration_hours, 2);

            Log::info('Hourly service pricing calculated', [
                'service_id'     => $service->id,
                'base_price'     => $service->price,
                'duration_hours' => $input['duration_hours'],
                'total_price'    => $input['total_price']
            ]);
        } else {
            $input['duration_hours'] = null;
            $input['total_price']    = $service->price;
        }

        // Date formatting
        $input['request_date'] = isset($input['request_date'])
            ? (int) date('Ymd', strtotime($input['request_date']))
            : (int) date('Ymd');

        if (isset($input['scheduled_date'])) {
            $input['scheduled_date'] = (int) date('Ymd', strtotime($input['scheduled_date']));
        }

        if (isset($input['completed_date'])) {
            $input['completed_date'] = (int) date('Ymd', strtotime($input['completed_date']));
        }

        // Debug before save
        Log::debug('Final insert data (focus on unit_type)', [
            'unit_type'      => $input['unit_type'],
            'duration_hours' => $input['duration_hours'] ?? null,
            'total_price'    => $input['total_price'] ?? null,
            'service_unit'   => $service->unit_type
        ]);

        try {
            // Final paranoid check
            if ($input['unit_type'] !== null && !is_int($input['unit_type'])) {
                Log::critical('unit_type still invalid right before DB save - setting NULL', $input);
                $input['unit_type'] = null;
            }

            $saved_id = DBX::saveData($ss, 'service_requests', ['id' => $id], $input, [], 1);

            if ($saved_id) {
                Log::info('Service request saved successfully', ['id' => $saved_id]);
                return DV::success([
                    'id'      => $saved_id,
                    'message' => $id ? 'Service request updated successfully' : 'Service request created successfully'
                ]);
            }

            return DV::error('Failed to save service request.');
        } catch (\Exception $e) {
            Log::error('Service request save exception', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data'  => $input
            ]);
            return DV::error('Error saving service request: ' . $e->getMessage());
        }
    }
    public function getServiceRequestList($arr, $ss = null)
    {
        $d = (object) $arr;
        $branch_id         = $ss->branch_id ?? null;
        $search_value      = $d->search_value ?? null;
        $request_status_id = $d->request_status_id ?? null;
        $service_type_id   = $d->service_type_id ?? null;
        $current_page      = (int) ($d->current_page ?? 1);
        $per_page          = (int) ($d->per_page ?? 10);

        $skip_rows = ($current_page - 1) * $per_page;

        $where_search = "1=1";
        $where_more   = "1=1";

        if ($branch_id) {
            $where_more .= ' AND sr.branch_id = ' . (int)$branch_id;
        }

        if ($search_value) {
            $search = escape_like_str($search_value);
            $where_search = "(
                sr.description LIKE '%{$search}%'
                OR t.name LIKE '%{$search}%'
                OR bs.code LIKE '%{$search}%'
                OR st.name LIKE '%{$search}%'
            )";
        }

        if ($request_status_id) $where_more .= ' AND sr.request_status_id = ' . (int)$request_status_id;
        if ($service_type_id)   $where_more .= ' AND sr.service_type_id = '   . (int)$service_type_id;

        $updated_at = DBX::formatTime("sr.updated_at", 'updated_at');

        $query = DB::table('service_requests as sr')
            ->join('tenants as t', 't.id', '=', 'sr.tenant_id')
            ->join('building_spaces as bs', 'bs.id', '=', 'sr.space_id')
            ->join('services as s', 's.id', '=', 'sr.service_id')
            ->join('service_types as st', 'st.id', '=', 'sr.service_type_id')
            ->join('request_status as rs', 'rs.id', '=', 'sr.request_status_id')
            ->whereRaw($where_search)
            ->whereRaw($where_more)
            ->selectRaw("
                sr.id, sr.tenant_id, t.name as tenant_name,
                sr.space_id, bs.code as space_code,
                sr.service_id, s.name as service_name,
                s.price as service_price, s.unit_type,
                sr.total_price, sr.duration_hours,
                sr.service_type_id, st.name as service_type_name,
                sr.description, sr.request_date,
                sr.request_status_id, rs.name as status_name,
                $updated_at, sr.update_user,
                sr.scheduled_date, sr.completed_date, sr.create_uid
            ")
            ->orderBy('sr.id', 'DESC');

        $total = (clone $query)->count('sr.id');
        $rows  = $query->skip($skip_rows)->take($per_page)->get();

        return new LengthAwarePaginator($rows, $total, $per_page, $current_page);
    }

    public static function getServiceRequestDetails($id)
    {
        return DB::table('service_requests as sr')
            ->join('services as s', 's.id', '=', 'sr.service_id')
            ->where('sr.id', $id)
            ->select([
                'sr.id', 'sr.tenant_id', 'sr.space_id', 'sr.service_id',
                's.price as service_price', 's.unit_type',
                'sr.service_type_id', 'sr.request_date', 'sr.description',
                'sr.request_status_id', 'sr.update_user',
                'sr.scheduled_date', 'sr.completed_date', 'sr.create_uid',
                'sr.updated_at', 'sr.total_price', 'sr.duration_hours'
            ])
            ->first();
    }

    public static function getFormOptions($ss, $id)
    {
        $details = $id ? self::getServiceRequestDetails($id) : null;

        return (object) [
            'request_details'   => $details,
            'service_types'     => GeneralSettings::options_service_types($ss),
            'tenants'           => GeneralSettings::options_tenant_with_active_contract($ss),
            'services'          => GeneralSettings::options_service($ss),
            'building_spaces'   => GeneralSettings::options_building_space($ss),
            'request_statuses'  => GeneralSettings::options_request_status($ss)
        ];
    }

    public function deleteById($id = null)
    {
        $id = $id ?? $this->id;
        $deleted = self::deleteBy(['id' => $id]);
        return DV::depends($deleted, 'Failed to delete service request');
    }

    public function updateStatus($id, $request_status_id, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;

        if (!$id || !$request_status_id) {
            return DV::error('Missing required parameters');
        }

        $data = [
            'request_status_id' => (int) $request_status_id,
            'update_user'       => $ss->name ?? 'System',
            'update_uid'        => $ss->uid ?? null,
            'updated_at'        => date('Ymd')
        ];

        // Auto-set completed_date if status is "completed"
        $status = DB::table('request_status')->where('id', $request_status_id)->value('name');
        if (strtolower($status) === 'completed') {
            $data['completed_date'] = (int) date('Ymd');
        }

        $updated = DB::table('service_requests')
            ->where('id', $id)
            ->update($data);

        return $updated !== false
            ? DV::success(['message' => 'Status updated successfully'])
            : DV::error('Failed to update status');
    }

    
}
