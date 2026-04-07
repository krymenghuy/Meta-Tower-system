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

    // public function upsert($arr = [], $id = null, $ss = null)
    // {
    //     $id = $id ?? $this->id;
    //     $ss = $ss ?? $this->userInfo;
    //     $branch_id = $ss->branch_id;

    //     // $created = !$id;
    //     $v_rule = [
    //         'tenant_id'         => '1|number|exists=tenants.id',
    //         'service_id'        => '1|number|exists=services.id',
    //         'space_id'          => '1|number|exists=building_spaces.id',
    //         'service_type_id'   => '1|number|exists=service_types.id',
    //         'remarks'       => '0|string|0-255',
    //         'duration_hours'    => '0|numeric|min:0.5|',
    //         'code'              => '0|string|0-20',
    //         'unit_type'         => '0|choice|1,2', // 1 one_time , 2 hour
    //         'request_date'      => '0|date',
    //         'scheduled_date'    => '1|date',
    //         'start_time'        => '1|time',
    //         'complete_date'    => '0|date',
    //     ];
    //     $allowed_chars = ['@', ',', '-', '.', '#', '!', '?', '(', ')', "\n"];
    //     $res = DBX::validateObject($arr,$v_rule,1,['remarks' => $allowed_chars],$ss->lang ?? 'en',0,null);
    //     if ($res->error) {
    //         return DV::error($res->error);
    //     }
    //     $input = $res->values;
    //     $total_price = null;
    //     if($input['unit_type']=="2" && $input['duration_hours'] == ""){
    //          return DV::error('Please select value duration hour');

    //     }
    //     $created = !$id;
    //     try {
    //     $input['request_date'] = isset($input['request_date'])
    //         ? (int) date('Ymd', strtotime($input['request_date']))
    //         : (int) date('Ymd');
    //         $save_id = DBX::saveData($ss, 'service_requests', ['id' => $id], $input, [], 1);
    //         if (!$save_id) {
    //             return DV::error('Failed to save service request.');
    //         }
    //         if ($created) {
    //             $prefix = 'REQ-';
    //             $codeRes = setOfficialCode($branch_id,'service_request_code_control','service_requests',['id' => $save_id],$prefix,5,null);
    //             if (isset($codeRes->code)) {
    //                 $return_data['code'] = $codeRes->code;
    //             } else {
    //                 Log::warning("Code generation failed for service request ID: {$save_id}", [
    //                     'response' => $codeRes ?? 'No response'
    //                 ]);
    //                 // Still success, but log issue
    //             }
    //         } else {
    //             // On update/modify: return existing code
    //             $return_data['code'] = DB::table('service_requests')
    //                 ->where('id', $id)
    //                 ->value('code') ?? '123';
    //         }
    //         $message = $created ? 'Service request created successfully' : 'Service request updated successfully';

    //         return DV::success($return_data + ['message' => $message]);
    //     }
    //     catch (\Exception $e) {
    //         Log::error('Service request save failed', [
    //             'error' => $e->getMessage(),
    //             'data'  => $input
    //         ]);
    //         return DV::error('Error saving service request: ' . $e->getMessage());
    //     }
    // }

    public function upsert($arr = [], $id = null, $ss = null)
{
    $id = $id ?? $this->id;
    $ss = $ss ?? $this->userInfo;
    $branch_id = $ss->branch_id;

    $v_rule = [
        'tenant_id'         => '1|number|exists=tenants.id',
        'service_id'        => '1|number|exists=services.id',
        'space_id'          => '1|number|exists=building_spaces.id',
        'service_type_id'   => '1|number|exists=service_types.id',
        'remarks'       => '0|string|0-255',
        'duration_hours'    => '0|numeric|min:0.5|max:99.9',
        'unit_type'         => '0|choice|1,2', // 1=one_time, 2=hour
        'request_date'      => '0|date',
        'scheduled_date'    => '1|date',
        'start_time'        => '1|time',
        'complete_date'     => '0|date',
    ];

    $allowed_chars = ['@', ',', '-', '.', '#', '!', '?', '(', ')', "\n"];
    $res = DBX::validateObject($arr, $v_rule, 1, ['remarks' => $allowed_chars], $ss->lang ?? 'en', 0, null);
    if ($res->error) {
        return DV::error($res->error);
    }
    $input = $res->values;
   
    if ($input['unit_type'] == '2' && empty($input['duration_hours'])) {
        return DV::error('Please select value duration hour');
    }

    if ($input['unit_type'] == '2' && !empty($input['duration_hours'])) {
        $service = DB::table('services')
            ->where('id', $input['service_id'])
            ->first(['price']);

        if (!$service) {
            return DV::error('Service not found or invalid.');
        }
        $hourly_rate = $service->price ?? 0;
        if ($hourly_rate <= 0) {
            return DV::error('Price not defined for this service.');
        }
        $input['total_price'] = round($hourly_rate * $input['duration_hours'], 2);
    } else {
        $input['total_price'] = null;
    }

    $input['request_date'] = isset($input['request_date'])
        ? (int) date('Ymd', strtotime($input['request_date']))
        : (int) date('Ymd');

    $created = !$id;

    try {
        $save_id = DBX::saveData($ss, 'service_requests', ['id' => $id], $input, [], 1);
        if (!$save_id) {
            return DV::error('Failed to save service request.');
        }

        $return_data = [];

        if ($created) {
            $prefix = 'REQ-';
            $codeRes = setOfficialCode($branch_id, 'service_request_code_control', 'service_requests', ['id' => $save_id], $prefix, 5, null);
            if (isset($codeRes->code)) {
                $return_data['code'] = $codeRes->code;
            } else {
                Log::warning("Code generation failed for service request ID: {$save_id}");
            }
            $message = 'Service request created successfully';
        } else {
            $return_data['code'] = DB::table('service_requests')
                ->where('id', $id)
                ->value('code') ?? '123';
            $message = 'Service request updated successfully';
        }

        return DV::success($return_data + ['message' => $message]);

    } catch (\Exception $e) {
        Log::error('Service request save failed', [
            'error' => $e->getMessage(),
            'data'  => $input
        ]);
        return DV::error('Error saving service request: ' . $e->getMessage());
    }
}


    public function getServiceRequestList($arr = [], $ss = null)
    {
        $d = (object) $arr;
        $search_value      = $d->search_value ?? null;
        $service_type_id   = $d->service_type_id ?? null;
        $service_id        = $d->service_id ?? null;
        $status_id         = $d->status_id ?? null;
        $current_page      = $d->current_page ?? 1;
        $per_page          = $d->per_page ?? 10;
        if (!is_numeric($current_page) || !is_numeric($per_page)) {
            return null;
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $str_search = "1=1";
        $str_moreWhere = "2=2";
        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(sr.code LIKE '%" .$search_value . "%' OR t.name LIKE '%" . $search_value . "%')";
        }

        if ($service_type_id) {
            $str_moreWhere .= ' AND s.service_type_id = ' . $service_type_id;
        }

       if ($status_id) {
            $str_moreWhere .= ' AND sr.status_id =' . $status_id;
        }
         if ($service_id) {
            $str_moreWhere .= ' AND sr.service_id =' . $service_id;
        }


        $query = DB::table('service_requests as sr')
            ->join('tenants as t', 't.id', '=', 'sr.tenant_id')
            ->join('building_spaces as bs', 'bs.id', '=', 'sr.space_id')
            ->join('services as s', 's.id', '=', 'sr.service_id')
            ->join('service_types as st', 'st.id', '=', 's.service_type_id')
            ->join('request_statuses as rs', 'rs.id', '=', 'sr.status_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw("
                sr.id, sr.code, sr.tenant_id, t.name as tenant_name, t.email as tenant_email, t.phone_number as tenant_phone,
                sr.space_id, bs.code as space_code,
                sr.service_id, s.name as service_name,
                s.price as service_price,sr.unit_type,
                sr.total_price, sr.duration_hours,
                sr.remarks, sr.request_date,
                sr.start_time,
                sr.updated_at, sr.update_user,
                sr.scheduled_date,sr.request_date, sr.complete_date, sr.create_uid,
                rs.id as status_id,
                rs.name as status_name,
                st.name as service_type
            ")
            ->orderBy('sr.id', 'DESC');

        $clone_query = clone $query;
        $count = $clone_query->count('sr.id');
        $rows  = $query->skip($skip_rows)->take($per_page)->get();
        foreach($rows as $row){

            $row->unit_type = $row->unit_type == '1' ? 'One Time' : ($row->unit_type == '2' ? 'Hour' : '');
            $row = setOfficialDates($row,['complete_date','request_date','scheduled_date'],['updated_at','created_at as created_at'],[]);
        }
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    static function getServiceRequestDetails($id, $ss = null)
    {
        return DB::table('service_requests as sr')
            ->join('tenants as t', 't.id', '=', 'sr.tenant_id')
            ->join('services as s', 's.id', '=', 'sr.service_id')
            ->join('building_spaces as bs', 'bs.id', '=', 'sr.space_id')
            // ->leftJoin('request_statuses as rs', 'rs.id', '=', 'sr.status_id') // leftJoin for safety
            ->join('service_types as st', 'st.id', '=', 's.service_type_id')
            ->where('sr.id', $id)
            ->selectRaw("sr.id, sr.code, sr.tenant_id, sr.space_id, sr.service_id,
                sr.request_date, sr.remarks,
                sr.start_time,
                sr.scheduled_date, sr.complete_date, sr.create_uid,
                sr.updated_at, sr.total_price, sr.duration_hours,
                sr.unit_type, sr.status_id,t.name as tenant_name, bs.code as space_code, s.name as service_name, st.name as service_type
            ")
            // ->select(
            //     'sr.id', 'sr.code', 'sr.tenant_id', 'sr.space_id', 'sr.service_id', 's.service_type_id',
            //     's.price as service_price', 's.unit_type',
            //     'sr.request_date', 'sr.remarks',
            //     'sr.update_user',
            //     'sr.start_time',
            //     'sr.scheduled_date', 'sr.complete_date', 'sr.create_uid',
            //     'sr.updated_at', 'sr.total_price', 'sr.duration_hours',
            //     'bs.code as space_code',
            //     't.name as tenant_name',
            //     'st.name as service_type',
            //     's.name as service_name',
            //     'rs.id as status_id',
            //     'rs.name as status_name'
            // )
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

public function acceptRequest($arr = [], $ss = null)
{
    $ss = $ss ?? $this->userInfo;
    $d  = (object) $arr;

    $id = $d->id ?? null;
    if (!$id) {
        return DV::error('Invalid request id');
    }
    $req = DB::table('service_requests')->select('id', 'status_id')->where('id', $id)->first();
    if (!$req) {
        return DV::error('Service request not found');
    }
    if ($req->status_id == 2) {
        return DV::error('You already accepted this request.');
    }
    if (in_array($req->status_id, [3, 4])) {
        return DV::error('Request already processed.');
    }

    $updated = DB::table('service_requests')
        ->where('id', $id)
        ->update([
            'status_id'   => 2,
            'update_user' => $ss->full_name ?? 'System',
            'update_uid'  => $ss->id ?? null,
            'updated_at'  => getNowTime(),
        ]);

    if (!$updated) {
        return DV::error('Update failed.');
    }

    return DV::success([
        'message' => 'Request accepted successfully'
    ]);
}
function rejectRequest($arr = [], $ss = null)
{
    $ss = $ss ?? $this->ss;

    $arr = (array) $arr;

    $id = $arr['id'] ?? $arr['discount_id'] ?? null;
    $remarks = $arr['remarks'] ?? $arr['remark'] ?? null;

    if (empty($id)) {
        return DV::error('ID is required.');
    }

    $reject = DB::table('service_requests')
        ->where('id', $id)
        ->update([
            'status_id' => 3,
            'remarks' => $remarks
        ]);

    return DV::depends($reject, ['action' => 'reject']);
}
}
