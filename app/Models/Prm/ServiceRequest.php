<?php

namespace App\Models\Prm;

use App\Models\Prm\GeneralSettings;
use DV;
use Vsd\Vsloquent\VSModel;
use DBX;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;

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

    /**
     * Insert or Update service request
     */
    public function upsert($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $v_rule = [
            'tenant_id' => '1|number|exists=tenants.id',
            'service_id' => '1|number|exists=services.id',
            'name' => '1|string|1-100|text=Service name must be provided',
            'building_space_id' => '1|number|exists=building_spaces.id',
            'priority' => '1|enum=low,medium,high,urgent|text=Priority must be one of: low, medium, high, or urgent',
            'description' => '0|string|0-1000',
            'request_status_id' => '0|number|default=2|exists=service_statuses.id',
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
            return DV::error($res->error);
        }

        $input = $res->values;

        // Set request_date if not provided
        if (!isset($input['request_date'])) {
            $input['request_date'] = date('Y-m-d H:i:s');
        }

        // Set default priority if not provided
        if (!isset($input['priority'])) {
            $input['priority'] = 'medium';
        }

        $id = DBX::saveData($ss, 'service_requests', ['id' => $id], $input, [], 1);

        if ($id) {
            return DV::success(['id' => $id, 'message' => 'Service request saved successfully']);
        }

        return DV::error('Error saving service request!');
    }

    public function getServiceRequest($arr, $ss = null)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id ?? null;
        $search_value = $d->search_value ?? null;
        $request_status_id = $d->request_status_id ?? null;
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
                OR sr.name LIKE '%" . $search_value . "%'
                OR t.name LIKE '%" . $search_value . "%'
                OR b.name LIKE '%" . $search_value . "%'
                OR st.name LIKE '%" . $search_value . "%'
            )";
        }

        if ($request_status_id) {
            $str_moreWhere .= ' AND sr.request_status_id = ' . intval($request_status_id);
        }

        if ($service_type_id) {
            $str_moreWhere .= ' AND s.service_type_id = ' . intval($service_type_id);
        }

        $updated_at = DBX::formatTime("sr.updated_at", 'updated_at');
        $request_date = DBX::formatTime("sr.request_date", 'request_date');
        $query = DB::table('service_requests as sr')
            // Join tenants table
            ->leftJoin('tenants as t', 't.id', '=', 'sr.tenant_id')
            ->leftJoin('building_spaces as b', 'b.id', '=', 'sr.building_space_id')
            ->leftJoin('services as s', 's.id', '=', 'sr.service_id')
            ->leftJoin('service_statuses as rr', 'rr.id', '=', 'sr.request_status_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw("
                sr.id,
                sr.name,
                sr.tenant_id,
                t.name as tenant_name,
                sr.building_space_id,
                b.floor_id as building_space_floor_id,
                b.building_id as building_space_building_id,
                sr.service_id,
                s.name as service_name,
                s.price as service_price,
                s.status_code  as service_status_code,
                s.unit_type as service_unit_price,
                sr.description,
                sr.priority,
                sr.request_status_id,
                rr.name as request_status_name,
                $request_date,
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

    public static function getServiceRequestDetails($id, $ss = null)
    {
        $row = DB::table('service_requests as sr')
            ->where('sr.id',$id)
            ->selectRaw('
                sr.id,
                sr.name,
                sr.tenant_id,
                sr.building_space_id,
                sr.request_status_id,
                sr.service_id,
                sr.description,
                sr.priority,
                sr.request_date,
                sr.update_user,
                sr.scheduled_date,
                sr.completed_date,
                sr.create_uid,
                sr.update_uid,
                sr.create_user,
                sr.created_at
            ')
            ->first();
        return $row;
    }
    public function delete($id = null){
        $id = $id ?? $this->id;
        $deleted = DB::table('service_requests')
        ->where('id',$id)->delete();
        return $deleted ? DV::depends($deleted,['action'=>'deleted']) : DV::error('Delete failed.');
    }

    public function updateStatus($id, $request_status_id, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;

        if (!$id || !$request_status_id) {
            return DV::error('Invalid parameters');
        }
        $data = [
            'request_status_id' => $request_status_id,
            'update_user' => $ss->name ?? 'System',
            'update_uid' => $ss->uid ?? null,
            'updated_at' => date('Y-m-d H:i:s')
        ];

        // If status is completed, set completed_date
        $statusName = DB::table('service_statuses')->where('id', $request_status_id)->value('name');
        if (strtolower($statusName) === 'completed') {
            $data['completed_date'] = date('Y-m-d H:i:s');
        }

        $updated = DB::table('service_requests')
            ->where('id', $id)
            ->update($data);

        if ($updated !== false) {
            return DV::success(['message' => 'Status updated successfully']);
        }

        return DV::error('Error updating status');
    }

    public static function getFormOptions($ss,$id){
        $details = $id ? self::getServiceRequestDetails($id) : null;
        return (object) [
            'service_requests' => $details,
            'service_types'=> GeneralSettings::options_service_types($ss)
        ];
    }

}
