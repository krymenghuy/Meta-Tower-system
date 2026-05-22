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
        $v_rule = [
            'tenant_id'         => '1|number|exists=tenants.id|text=Please select a tenant.',
            'space_id'          => '1|number|exists=building_spaces.id|text=Please select a space.',
            'category_id'       => '1|number|exists=service_categories.id|text=Please select a category.',
            'service_id'        => '1|number|exists=services.id|text=Please select a service.',
            'unit_type'         => '0|choice|1,2,3',
            'duration_hours'    => '0|numeric|min:0.5|max:99.9|text=Duration hours is required when unit type is Hour.',
            'request_date'      => '0|date',
            'scheduled_date'    => '1|date|text=Scheduled date is required.',
            'start_time'        => '1|time|text=Start time is required.',
            'complete_date'     => '0|date',
            'remarks'           => '0|string|0-255',
        ];

        $allowed_chars = ['@', ',', '-', '.', '#', '!', '?', '(', ')', "\n"];

        $res = DBX::validateObject($arr, $v_rule, 1, ['remarks' => $allowed_chars], $ss->lang ?? 'en', 0, null);
        if ($res->error) return DV::error($res->error);

        $input = $res->values;
        $scheduledDate = $input['scheduled_date'];
        $startTime = date('H:i:s', strtotime($input['start_time']));
        $now = time();
        $startDT = strtotime($scheduledDate . ' ' . $startTime);
        if ($startDT <= $now) {
            return DV::error('Cannot schedule in the past.');
        }
        if ($input['unit_type'] == 2 && empty($input['duration_hours'])) {
            return DV::error('Please select duration hour.');
        }
        $duration = $input['duration_hours'] ?? 0;
        $start = $startTime;
        $end = $start;
        if ($input['unit_type'] == 2 && $duration > 0) {
            $end = date('H:i:s', strtotime("+{$duration} hours", strtotime($start)));
        }
        $overlap = DB::table('service_requests')
            ->where('tenant_id', $input['tenant_id'])
            ->where('service_id', $input['service_id'])
            ->where('scheduled_date', $scheduledDate)
            ->where('status_id', 1)
            ->when($id, fn($q) => $q->where('id', '<>', $id))
            ->where(function ($q) use ($start, $end, $input) {
                if ($input['unit_type'] == 1) {
                    $q->where('start_time', $start);
                } else {
                    $q->whereRaw('start_time < ?', [$end])
                    ->whereRaw('ADDTIME(start_time, SEC_TO_TIME(duration_hours * 3600)) > ?', [$start]);
                }
            })
            ->exists();

        if ($overlap) {
            return DV::error('This time slot overlaps with an existing pending request. Each request must have a [duration] gap between them.');
        }

        if ($input['unit_type'] == 2) {
            $service = DB::table('services')
                ->where('id', $input['service_id'])
                ->first(['price']);

            if (!$service) return DV::error('Service not found.');
            if (($service->price ?? 0) <= 0) return DV::error('Service price not defined.');

            $input['total_price'] = round($service->price * $duration, 2);
            $input['price'] = $service->price;

        } else {
            $service = DB::table('services')->where('id', $input['service_id'])->first(['price']);

            if (!$service) return DV::error('Service not found.');
            if (($service->price ?? 0) <= 0) return DV::error('Service price not defined.');

            $input['total_price'] = round($service->price, 2);
            $input['price'] = $service->price;
        }

        $input['request_date'] = !empty($input['request_date'])? date('Ymd', strtotime($input['request_date'])): date('Ymd');
        $created = !$id;
        try {
            $save_id = DBX::saveData($ss, 'service_requests', ['id' => $id], $input, [], 1);
            if (!$save_id) return DV::error('Failed to save service request.');

            $return_data = [];

            if ($created) {
                $codeRes = setOfficialCode(
                    $branch_id,
                    'service_request_code_control',
                    'service_requests',
                    ['id' => $save_id],
                    'REQ-',
                    5,
                    null
                );

                if (!empty($codeRes->code)) {
                    $return_data['code'] = $codeRes->code;
                }

                $message = 'Service request created successfully';
            } else {
                $return_data['code'] = DB::table('service_requests')
                    ->where('id', $id)
                    ->value('code');

                $message = 'Service request updated successfully';
            }

            return DV::success($return_data + ['message' => $message]);

        } catch (\Throwable $e) {
            Log::error('Service request save failed', [
                'error' => $e->getMessage(),
                'data'  => $input
            ]);

            return DV::error('Failed to save service request.');
        }
    }

    public function getServiceRequestList($arr = [], $ss = null)
    {
        $d = (object) $arr;
        $search_value      = $d->search_value ?? null;
        $category_id         = $d->category_id ?? null;
        $service_id          = $d->service_id ?? null;
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

        if ($category_id) {
            $str_moreWhere .= ' AND sr.category_id = ' . $category_id;
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
            ->join('service_categories as sc', 'sc.id', '=', 's.category_id')
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
                sr.status_id,
                rs.name as status_name,
                sc.name as service_category
            ")
            ->orderBy('sr.id', 'DESC');

        $clone_query = clone $query;
        $count = $clone_query->count('sr.id');
        $rows  = $query->skip($skip_rows)->take($per_page)->get();
        foreach($rows as $row){
            $scheduledDateTime = strtotime($row->scheduled_date . ' ' . $row->start_time);
            if ($row->status_id == 1 && !empty($row->scheduled_date) && !empty($row->start_time) && $scheduledDateTime < time()) {
                $row->status_name = 'Expired';
                $row->status_id = 4;
            }
            $row->unit_type = $row->unit_type == '1' ? 'One Time' : ($row->unit_type == '2' ? 'Hour' : ($row->unit_type == '3' ? 'Unit' : ''));
            $row = setOfficialDates($row,['complete_date','request_date','scheduled_date'],['updated_at','created_at as created_at'],[]);
        }
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    static function getServiceRequestDetails($id, $ss = null)
    {
        $row =  DB::table('service_requests as sr')
            ->join('tenants as t', 't.id', '=', 'sr.tenant_id')
            ->join('services as s', 's.id', '=', 'sr.service_id')
            ->join('building_spaces as bs', 'bs.id', '=', 'sr.space_id')
            // ->leftJoin('request_statuses as rs', 'rs.id', '=', 'sr.status_id') // leftJoin for safety
            ->join('service_categories as sc', 'sc.id', '=', 's.category_id')
            ->where('sr.id', $id)
            ->selectRaw("sr.id, sr.code, sr.tenant_id, sr.space_id, sr.service_id,
                sr.request_date, sr.remarks,
                sr.start_time,
                sr.scheduled_date, sr.complete_date, sr.create_uid,
                sr.updated_at, sr.total_price, sr.duration_hours,
                sr.unit_type, sr.status_id,t.name as tenant_name, bs.code as space_code,s.price as price, s.name as service_name, s.category_id, sc.name as service_category
            ")
            ->first();
                if($row){
                    setOfficialDates($row, ['scheduled_date','complete_date'], [], []);
                }
            return $row;
    }


    public function getFormOptions($arr = [], $ss = null)
    {
        $ss = $ss ? $ss : $this->userInfo;
        $d = (object)$arr;
        $id = $d->id ?? $this->id;
        $details = $id ? self::getServiceRequestDetails($id) : null;
        $category_id = $d->category_id ?? null;
        return (object) [
            'request_details'     => $details,
            'service_categories'  => GeneralSettings::options_service_categories($ss),
            'tenants'             => GeneralSettings::options_tenant_with_active_contract($ss),
            'services'            => GeneralSettings::options_service_request_type($category_id),
            'building_spaces'   => GeneralSettings::options_building_space($ss),
            'request_statuses'  => GeneralSettings::options_request_status($ss)
        ];
    }

    public function deleteById($id = null)
    {
        $id = $id ?? $this->id;
        $req = DB::table('service_requests')->where('id', $id)->select('status_id')->first();
        if($req->status_id == 2){
            return DV::error('This request has already been accepted, so it cannot be deleted.');
        }
        if($req->status_id == 3){
            return DV::error('This request has already been rejected, so it cannot be deleted.');
        }

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
