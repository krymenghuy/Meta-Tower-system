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
        $branch_id = $ss->branch_id;

        $created = !$id;
        $v_rule = [
            'tenant_id'         => '1|number|exists=tenants.id',
            'service_id'        => '1|number|exists=services.id',
            'space_id'          => '1|number|exists=building_spaces.id',
            'description'       => '0|string|0-1000',
            'duration_hours'    => '0|numeric|min:0.5|nullable',
            'code'              => '0|string|0-100',
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
            // 'one_time' => 0,
            'hour'     => 1,
            'month'    => 2,
            // 'time'     => 3,
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
                Log::warning('Invalid unit_type received - using service default', [
                    'received' => $unit_string,
                    'service_unit_type' => $service->unit_type ?? 'missing'
                ]);
            }
        }

        if ($unit_type_value === null && isset($unitTypeMap[$service->unit_type])) {
            $unit_type_value = $unitTypeMap[$service->unit_type];
        }

        $input['unit_type'] = $unit_type_value;

        // Hourly service pricing
        if ($service->unit_type === 'hour') {
            $duration_hours = !empty($arr['duration_hours']) ? (float)$arr['duration_hours'] : null;
            if ($duration_hours === null || $duration_hours <= 0 || !is_numeric($duration_hours)) {
                return DV::error('Please select a valid duration for hourly services.');
            }
            $input['duration_hours'] = round($duration_hours, 2);
            $input['total_price']    = round($service->price * $duration_hours, 2);
        } else {
            $input['duration_hours'] = null;
            $input['total_price']    = $service->price;
        }

        $input['request_date'] = isset($input['request_date'])
            ? (int) date('Ymd', strtotime($input['request_date']))
            : (int) date('Ymd');

        if (isset($input['scheduled_date'])) {
            $input['scheduled_date'] = (int) date('Ymd', strtotime($input['scheduled_date']));
        }

        if (isset($input['completed_date'])) {
            $input['completed_date'] = (int) date('Ymd', strtotime($input['completed_date']));
        }

        // System / audit fields
        $input['branch_id']    = $branch_id;
        $input['update_uid']   = $ss->uid ?? null;
        $input['update_user']  = $ss->name ?? 'System';
        $input['updated_at']   = date('Y-m-d H:i:s');   // or use DB raw if needed

        if ($created) {
            $input['create_uid']  = $ss->uid ?? null;
            $input['create_user'] = $ss->name ?? 'System';
            $input['created_at']  = date('Y-m-d H:i:s');
            $input['request_status_id'] = $input['request_status_id'] ?? 1;
        }

        try {
            $saved_id = DBX::saveData($ss, 'service_requests', ['id' => $id], $input, [], 1);

            if (!$saved_id) {
                return DV::error('Failed to save service request.');
            }

            // Generate official code only on creation
            if ($created) {
                $prefix = 'S';
                $codeRes = setOfficialCodeInvoice(
                    $branch_id,
                    'service_request_code_control',
                    'service_requests',
                    ['id' => $saved_id],
                    $prefix,
                    5,
                    null
                );

                if (!$codeRes || !isset($codeRes->status) || $codeRes->status !== 'OK') {
                    Log::error('Failed to generate service request code', ['id' => $saved_id]);
                    // Decide: continue or fail?
                }

                $return_data = ['id' => $saved_id];
                if (isset($codeRes->code)) {
                    $return_data['code'] = $codeRes->code;
                }

                return DV::success($return_data + ['message' => 'Service request created successfully']);
            }

            return DV::success([
                'id'      => $saved_id,
                'message' => 'Service request updated successfully'
            ]);
        }
        catch (\Exception $e) {
            Log::error('Service request save failed', [
                'error' => $e->getMessage(),
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
            )";
        }

        if ($request_status_id) $where_more .= ' AND sr.request_status_id = ' . (int)$request_status_id;

        $updated_at = DBX::formatTime("sr.updated_at", 'updated_at');

        $query = DB::table('service_requests as sr')
            ->join('tenants as t', 't.id', '=', 'sr.tenant_id')
            ->join('building_spaces as bs', 'bs.id', '=', 'sr.space_id')
            ->join('services as s', 's.id', '=', 'sr.service_id')
            ->join('request_status as rs', 'rs.id', '=', 'sr.request_status_id')
            ->whereRaw($where_search)
            ->whereRaw($where_more)
            ->selectRaw("
                sr.id, sr.code,tenant_id, t.name as tenant_name, t.email as tenant_email, t.phone_number as tenant_phone,
                sr.space_id, bs.code as space_code,
                sr.service_id, s.name as service_name,
                s.price as service_price, s.unit_type,
                sr.total_price, sr.duration_hours,
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
                'sr.id', 'sr.code', 'sr.tenant_id', 'sr.space_id', 'sr.service_id',
                's.price as service_price', 's.unit_type',
                'sr.request_date', 'sr.description',
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
            // 'tenants'           => GeneralSettings::options_tenant($ss),
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

        $currentStatus = DB::table('service_requests')->where('id', $id)->value('request_status_id');
        if ($currentStatus == $request_status_id){
            return DV::error('It is the same status.');
        }
        
        $updated = DB::table('service_requests')
            ->where('id', $id)
            ->update($data);

        return $updated !== false
            ? DV::success(['message' => 'Status updated successfully'])
            : DV::error('Failed to update status');
    }


}
