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

        // $created = !$id;

        $v_rule = [
            'tenant_id'         => '1|number|exists=tenants.id',
            'service_id'        => '1|number|exists=services.id',
            'space_id'          => '1|number|exists=building_spaces.id',
            'service_type_id'   => '1|number|exists=service_types.id',
            'description'       => '0|string|0-1000',
            'duration_hours'    => '0|numeric|min:0.5|',
            'code'              => '0|string|0-100',
            'unit_type'         => '0|choice|1,2', // 1 one_time , 2 hour
            'request_date'      => '0|date',
            'scheduled_date'    => '1|date',
            'start_time'        => '1|time',
            'complete_date'    => '0|date',
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
        $total_price = null;
        

        if($input['unit_type']=="2" && $input['duration_hours'] == ""){
             return DV::error('Please select value duration hour');

        }
        $created = !$id;
        try {
        $input['request_date'] = isset($input['request_date'])
            ? (int) date('Ymd', strtotime($input['request_date']))
            : (int) date('Ymd');
            $save_id = DBX::saveData($ss, 'service_requests', ['id' => $id], $input, [], 1);

            if (!$save_id) {
                return DV::error('Failed to save service request.');
            }
            if ($created) {
                $prefix = 'S-';  // adjust prefix if needed (S- or S)
                $codeRes = setOfficialCode(
                    $branch_id,
                    'service_request_code_control',
                    'service_requests',
                    ['id' => $save_id],
                    $prefix,
                    5,
                    null
                );

                if (isset($codeRes->code)) {
                    $return_data['code'] = $codeRes->code;
                } else {
                    Log::warning("Code generation failed for service request ID: {$save_id}", [
                        'response' => $codeRes ?? 'No response'
                    ]);
                    // Still success, but log issue
                }
            } else {

            Log::info('11111', $input);

                // On update/modify: return existing code
                $return_data['code'] = DB::table('service_requests')
                    ->where('id', $id)
                    ->value('code') ?? '123';
            }

            $message = $created ? 'Service request created successfully' : 'Service request updated successfully';

            return DV::success($return_data + ['message' => $message]);
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
        $service_type_id   = $d->service_type_id ?? null;
        $status_id         = $d->status_id ?? null;
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

        if ($service_type_id) {
            $where_more .= ' AND s.service_type_id = ' . (int)$service_type_id;
        }

        if ($status_id !== null && $status_id !== '' && $status_id !== 'all') {
            $where_more .= ' AND sr.status_id = ' . (int)$status_id;
        }

        // $updated_at = DBX::formatTime("sr.updated_at", 'updated_at');
        // $scheduled_date = DBX::formatTime("sr.scheduled_date");
        $query = DB::table('service_requests as sr')
            ->join('tenants as t', 't.id', '=', 'sr.tenant_id')
            ->join('building_spaces as bs', 'bs.id', '=', 'sr.space_id')
            ->join('services as s', 's.id', '=', 'sr.service_id')
            ->join('service_types as st', 'st.id', '=', 's.service_type_id')
            ->leftJoin('request_statuses as rs', 'rs.id', '=', 'sr.status_id')
            ->whereRaw($where_search)
            ->whereRaw($where_more)
            ->selectRaw("
                sr.id, sr.code, sr.tenant_id, t.name as tenant_name, t.email as tenant_email, t.phone_number as tenant_phone,
                sr.space_id, bs.code as space_code,
                sr.service_id, s.name as service_name,
                s.price as service_price, s.unit_type,
                sr.total_price, sr.duration_hours,
                sr.description, sr.request_date,
                sr.start_time,
                sr.updated_at, sr.update_user,
                sr.scheduled_date, sr.complete_date, sr.create_uid,
                rs.id as status_id,
                rs.name as status_name,
                st.name as service_type
            ")
            ->orderBy('sr.id', 'DESC');

        $total = (clone $query)->count('sr.id');
        $rows  = $query->skip($skip_rows)->take($per_page)->get();
        foreach($rows as $row){

            $row = setOfficialDates($row,['complete_date','scheduled_date'],['updated_at','created_at as created_at'],[]);

            //$row = setOfficialDates($row,['complete_date'],['updated_at','created_at as created_at','scheduled_date'],[]);

        return new LengthAwarePaginator($rows, $total, $per_page, $current_page);
    }
    }

    public function getServiceRequestDetails($id)
    {
        return DB::table('service_requests as sr')
            ->join('tenants as t', 't.id', '=', 'sr.tenant_id')
            ->join('services as s', 's.id', '=', 'sr.service_id')
            ->join('building_spaces as bs', 'bs.id', '=', 'sr.space_id')
            ->leftJoin('request_statuses as rs', 'rs.id', '=', 'sr.status_id') // leftJoin for safety
            ->join('service_types as st', 'st.id', '=', 's.service_type_id')
            ->where('sr.id', $id)
            ->select(
                'sr.id', 'sr.code', 'sr.tenant_id', 'sr.space_id', 'sr.service_id', 's.service_type_id',
                's.price as service_price', 's.unit_type',
                'sr.request_date', 'sr.description',
                'sr.update_user',
                'sr.start_time',
                'sr.scheduled_date', 'sr.complete_date', 'sr.create_uid',
                'sr.updated_at', 'sr.total_price', 'sr.duration_hours',
                'bs.code as space_code',
                't.name as tenant_name',
                'st.name as service_type',
                's.name as service_name',
                'rs.id as status_id',
                'rs.name as status_name'
            )
            ->first();
    }


    public function getFormOptions($arr = [], $ss = null)
    {
        $ss = $ss ? $ss : $this->userInfo;
        $d = (object)$arr;
        $id = $d->id ?? $this->id;
        $details = $id ? self::getServiceRequestDetails($id) : null;
        $service_type_id = $d->service_type_id ?? null;
        return (object) [
            'request_details'   => $details,
            'service_types'     => GeneralSettings::options_service_type_request($ss),
            'tenants'           => GeneralSettings::options_tenant_with_active_contract($ss),
            'services'          => GeneralSettings::options_service_request_type($service_type_id),
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

    public function setRequestStatus($arr, $ss = null)
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
        $updated = DB::table('service_requests')
            ->where('id', $id)
            ->update($data);

        if ($updated === 0) {
            return DV::error('Service request not found or no changes made');
        }
        return DV::success(['message' => 'Status updated successfully']);
    }


}
