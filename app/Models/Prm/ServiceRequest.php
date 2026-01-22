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
            'building_id' => '1|number|exists=buildings.id',
            'floor_id' => '0|number|exists=floors.id',
            'space_type_id' => '0|number|exists=space_types.id',
            'priority' => '1|enum=low,medium,high,urgent|text=Priority must be one of: low, medium, high, or urgent',
            'description' => '0|string|0-1000',
            'status_id' => '0|number|default=2|exists=service_statuses.id',
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
        $status_id = $d->status_id ?? null;
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

        if ($status_id) {
            $str_moreWhere .= ' AND sr.status_id = ' . intval($status_id);
        }

        if ($service_type_id) {
            $str_moreWhere .= ' AND s.service_type_id = ' . intval($service_type_id);
        }

        $updated_at = DBX::formatTime("sr.updated_at", 'updated_at');
        $request_date = DBX::formatTime("sr.request_date", 'request_date');
        $query = DB::table('service_requests as sr')
            // Join tenants table
            ->leftJoin('tenants as t', 't.id', '=', 'sr.tenant_id')
            ->leftJoin('buildings as b', 'b.id', '=', 'sr.building_id')
            ->leftJoin('floors as f', 'f.id', '=', 'sr.floor_id')
            ->leftJoin('services as s', 's.id', '=', 'sr.service_id')
            ->leftJoin('service_types as st', 'st.id', '=', 's.service_type_id')
            ->leftJoin('service_statuses as ss', 'ss.id', '=', 'sr.status_id')
            ->leftJoin('space_types as spt', 'spt.id', '=', 'sr.space_type_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw("
                sr.id,
                sr.name,
                sr.tenant_id,
                t.name as tenant_name,
                sr.building_id,
                b.name as building_name,
                sr.floor_id,
                f.name as floor_name,
                sr.space_type_id,
                spt.name as space_type_name,
                sr.service_id,
                s.name as service_name,
                s.price,
                sr.description,
                sr.priority,
                sr.status_id,
                ss.name as status,
                $request_date,
                $updated_at,
                sr.update_user,
                sr.scheduled_date,
                sr.completed_date
            ")
            ->orderBy('sr.id', 'DESC');

        // Clone query for count
        $clone_query = clone $query;
        $count = $clone_query->count('sr.id');

        // Get paginated results
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public function getServiceRequestDetails($id, $ss = null)
    {
        $row = DB::table('service_requests as sr')
            ->where('sr.id',$id)
            ->selectRaw('
                sr.id,
                sr.name,
                sr.tenant_id,
                sr.building_id,
                sr.floor_id,
                sr.space_type_id,
                sr.price,
                sr.status_id,
                sr.service_id,
                sr.description,
                sr.priority,
                sr.request_date,
                sr.update_user,
                sr.scheduled_date,
                sr.completed_date,
                sr.create_uid,
                sr.create_user,
                sr.created_at
            ')
            ->first();
        return $row;
    }
    // public function getServiceRequestDetails($id, $ss = null)
    //     {
    //         $branch_id = $ss->branch_id ?? null;
    //         $query = DB::table('service_requests as sr')
    //             ->leftJoin('tenants as t', 't.id', '=', 'sr.tenant_id')
    //             ->leftJoin('buildings as b', 'b.id', '=', 'sr.building_id')
    //             ->leftJoin('floors as f', 'f.id', '=', 'sr.floor_id')
    //             ->leftJoin('services as s', 's.id', '=', 'sr.service_id')
    //             ->leftJoin('service_types as st', 'st.id', '=', 's.service_type_id')
    //             ->leftJoin('service_statuses as ss_status', 'ss_status.id', '=', 'sr.status_id')
    //             ->leftJoin('space_types as spt', 'spt.id', '=', 'sr.space_type_id')
    //             ->where('sr.id', $id);

    //         if ($branch_id) {
    //             $query->where('sr.branch_id', $branch_id);
    //         }

    //         $row = $query->selectRaw('
    //             sr.id,
    //             sr.name,
    //             sr.tenant_id,
    //             t.name as tenant_name,
    //             sr.building_id,
    //             b.name as building_name,
    //             sr.floor_id,
    //             f.name as floor_name,
    //             sr.space_type_id,
    //             spt.name as space_type_name,
    //             sr.service_id,
    //             s.name as service_name,
    //             s.price as service_price,
    //             s.unit_type as service_unit_type,
    //             st.name as service_type,
    //             sr.status_id,
    //             ss_status.name as status_name,
    //             sr.description,
    //             sr.priority,
    //             sr.request_date,
    //             sr.scheduled_date,
    //             sr.completed_date,
    //             sr.create_uid,
    //             sr.create_user,
    //             sr.created_at,
    //             sr.update_user,
    //             sr.updated_at
    //         ')->first();

    //         if ($row) {
    //             return DV::success((array) $row);
    //         }

    //         return DV::error('Service request not found');
    // }


    public function delete($id = null){
        $id = $id ?? $this->id;
        $deleted = DB::table('service_requests')
        ->where('id',$id)->delete();
        return $deleted ? DV::depends($deleted,['action'=>'deleted']) : DV::error('Delete failed.');
    }

    public function updateStatus($id, $status_id, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;

        if (!$id || !$status_id) {
            return DV::error('Invalid parameters');
        }

        $data = [
            'status_id' => $status_id,
            'update_user' => $ss->name ?? 'System',
            'update_uid' => $ss->uid ?? null,
            'updated_at' => date('Y-m-d H:i:s')
        ];

        // If status is completed, set completed_date
        $statusName = DB::table('service_statuses')->where('id', $status_id)->value('name');
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
}
