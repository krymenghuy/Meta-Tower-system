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
            'tenant_id' => '1|number|exists=tenants.id',
            'service_id' => '1|number|exists=services.id',
            'space_id' => '1|number|exists=building_spaces.id',
            'service_type_id' => '1|number|exists=service_types.id',
            'priority' => '0|enum=low,medium,high,urgent|default=medium',
            'description' => '0|string|0-1000',
            'request_status_id' => '0|number|default=2|exists=request_status.id',
            'request_date' => '0|date',
            'scheduled_date' => '0|date',
            'completed_date' => '0|date',
        ];

        $description_char = ['@', ',', '-', '.', '#', '!', '?', '(', ')', '\n'];

        $res = DBX::validateObject(
            $arr,
            $v_rule,
            1,
            ['description' => $description_char],
            $ss->lang ?? 'en',
            0,
            null
        );

        if ($res->error) {
            // return DV::error('ServiceRequest validation failed', [
            //     'error' => $res->error,
            //     'input_data' => $arr
            // ]);
            return DV::error($res->error);
        }

        $input = $res->values;

        //Log::info('ServiceRequest validation passed', ['validated_data' => $input]);

        // Handle building_space_id - can come from building_id, floor_id, or building_space_id
        if (!isset($input['space_id']) || empty($input['space_id'])) {
            if (isset($input['building_id']) && !empty($input['building_id'])) {
                $input['space_id'] = $input['building_id'];
                Log::info('Using building_id as space_id', ['building_id' => $input['building_id']]);
            } elseif (isset($input['floor_id']) && !empty($input['floor_id'])) {
                $input['space_id'] = $input['floor_id'];
                Log::info('Using floor_id as space_id', ['floor_id' => $input['floor_id']]);
            } else {
                Log::error('space_id cannot be determined', [
                    'space_id' => $input['space_id'] ?? 'not set'
                ]);
                return DV::error('Building/Floor information is required. Please select a building or floor.');
            }
        }

        // Convert request_date to integer format YYYYMMDD if provided, otherwise use current date
        if (isset($input['request_date'])) {
            $input['request_date'] = (int) date('Ymd', strtotime($input['request_date']));
        } else {
            $input['request_date'] = (int) date('Ymd');
        }
        Log::info('Request date converted', ['request_date' => $input['request_date']]);

        // Set default priority if not provided
        if (!isset($input['priority'])) {
            $input['priority'] = 'medium';
        }

        // Convert scheduled_date and completed_date to integer format YYYYMMDD if provided
        if (isset($input['scheduled_date'])) {
            $input['scheduled_date'] = (int) date('Ymd', strtotime($input['scheduled_date']));
        }
        if (isset($input['completed_date'])) {
            $input['completed_date'] = (int) date('Ymd', strtotime($input['completed_date']));
        }

        Log::info('Final data before save', ['data' => $input]);

        try {
            $id = DBX::saveData($ss, 'service_requests', ['id' => $id], $input, [], 1);

            if ($id) {
                Log::info('ServiceRequest saved successfully', ['id' => $id]);
                return DV::success(['id' => $id, 'message' => 'Service request saved successfully']);
            }

            Log::error('ServiceRequest save returned null/false');
            return DV::error('Error saving service request!');

        } catch (\Exception $e) {
            Log::error('ServiceRequest save exception', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return DV::error('Error saving service request: ' . $e->getMessage());
        }
    }

    public function getServiceRequestList($arr, $ss = null)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id ?? null;
        $search_value = $d->search_value ?? null;
        $request_status_id = $d->request_status_id ?? null;
        $tenant_id = $d->tenant_id ?? null;
        $service_type_id = $d->service_type_id ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;

        if (!is_numeric($current_page)) {
            $current_page = 1;
        }

        $skip_rows = ($current_page - 1) * $per_page;

        // Base search condition
        $str_search = "1=1";
        $str_moreWhere = "1=1";

        // Add branch filter if branch_id exists
        if ($branch_id) {
            $str_moreWhere .= ' AND sr.branch_id = ' . intval($branch_id);
        }

        // Search filter
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "(
                sr.description LIKE '%" . $search_value . "%'
                OR t.name LIKE '%" . $search_value . "%'
                OR bs.code LIKE '%" . $search_value . "%'
                OR st.name LIKE '%" . $search_value . "%'
            )";
        }
        if ($tenant_id) {
            $str_moreWhere .= ' AND sr.tenant_id = ' . intval($tenant_id);
        }

        if ($request_status_id) {
            $str_moreWhere .= ' AND sr.request_status_id = ' . intval($request_status_id);
        }

        if ($service_type_id) {
            $str_moreWhere .= ' AND sr.service_type_id = ' . intval($service_type_id);
        }

        $updated_at = DBX::formatTime("sr.updated_at", 'updated_at');

        $query = DB::table('service_requests as sr')
            ->join('tenants as t', 't.id', '=', 'sr.tenant_id')
            ->join('building_spaces as bs', 'bs.id', '=', 'sr.space_id')
            ->join('services as s', 's.id', '=', 'sr.service_id')
            ->join('service_types as st', 'st.id', '=', 'sr.service_type_id')
            ->join('request_status as rs', 'rs.id', '=', 'sr.request_status_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw("
                sr.id,
                sr.tenant_id,
                t.name as tenant_name,
                sr.space_id,
                bs.code as space_code,
                sr.service_id,
                s.name as service_name,
                s.price as service_price,
                s.unit_type as service_unit_type,
                sr.service_type_id,
                st.name as service_type_name,
                sr.request_date,
                sr.description,
                sr.priority,
                sr.request_status_id,
                rs.name as status_name,
                $updated_at,
                sr.update_user,
                sr.scheduled_date,
                sr.completed_date,
                sr.create_uid
            ")
            ->orderBy('sr.id', 'DESC');

        // Clone query for count
        $clone_query = clone $query;
        $count = $clone_query->count('sr.id');

        // Get paginated results
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public static function getServiceRequestDetails($id)
    {
        return DB::table('service_requests as sr')
            ->join('services as s', 's.id', '=', 'sr.service_id')
            ->where('sr.id', $id)
            ->selectRaw('
                sr.id,
                sr.tenant_id,
                sr.space_id,
                sr.service_id,
                s.price as service_price,
                s.unit_type as unit_type,
                sr.service_type_id,
                sr.request_date,
                sr.description,
                sr.priority,
                sr.request_status_id,
                sr.update_user,
                sr.scheduled_date,
                sr.completed_date,
                sr.create_uid,
                sr.updated_at
            ')
            ->first();
    }

    public static function getFormOptions($ss, $id)
    {
        $request_details = $id ? self::getServiceRequestDetails($id) : null;

        // Get current tenant ID if editing
        // $currentTenantId = $request_details->tenant_id ?? null;

        // Get tenants with active contracts
        // $tenants = GeneralSettings::options_tenant_with_active_contract($ss, $currentTenantId);
        // $tenants = GeneralSettings::options_tenant($ss);

        // Log::info('ServiceRequest getFormOptions', [
        //     'request_id' => $id,
        //     'current_tenant_id' => $currentTenantId,
        //     'tenants_count' => $tenants->count(),
        //     // 'tenants' => $tenants->toArray()
        // ]);

        return (object) [
            'request_details' => $request_details,
            'service_types' => GeneralSettings::options_service_types($ss),
            'tenants' => GeneralSettings::options_tenant($ss),
            'services' => GeneralSettings::options_service($ss),
            'building_spaces' => GeneralSettings::options_building_space($ss),
            'request_statuses' => GeneralSettings::options_request_status($ss)
        ];
    }

    public function deleteById($id = null)
    {
        $id = $id ?? $this->id;
        $x = self::deleteBy(['id'=>$id]);
        return DV::depends($x, 'Service Request Delete failed');
    }

    public function updateStatus($id, $request_status_id, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;

        Log::info('ServiceRequest updateStatus called', [
            'id' => $id,
            'request_status_id' => $request_status_id,
            'user' => $ss->name ?? 'Unknown'
        ]);

        if (!$id || !$request_status_id) {
            Log::error('ServiceRequest updateStatus invalid parameters');
            return DV::error('Invalid parameters');
        }

        $data = [
            'request_status_id' => $request_status_id,
            'update_user' => $ss->name ?? 'System',
            'update_uid' => $ss->uid ?? null,
            'updated_at' => date('Ymd')
        ];

        // If status is completed, set completed_date
        $statusName = DB::table('request_status')->where('id', $request_status_id)->value('name');
        if (strtolower($statusName) === 'completed') {
            $data['completed_date'] = (int) date('Ymd');
        }

        $updated = DB::table('service_requests')
            ->where('id', $id)
            ->update($data);

        if ($updated !== false) {
            Log::info('ServiceRequest status updated successfully', ['id' => $id]);
            return DV::success(['message' => 'Status updated successfully']);
        }

        Log::error('ServiceRequest updateStatus failed', ['id' => $id]);
        return DV::error('Error updating status');
    }
}
