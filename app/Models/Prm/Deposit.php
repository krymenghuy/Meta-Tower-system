<?php

namespace App\Models\Prm;

use App\Models\Prm\GeneralSettings;
use Vsd\Response\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use Vsd\Database\DBX;
use Vsd\Storage\PublicStorage as XPublicStorage;
use Log;

class Deposit
{
    protected $id = null;
    protected $userInfo = null;
    // Commented out: not related to database table
    /*
    protected static $img_dir = 'deposits';
    protected static $allowed_image_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    protected static $allowed_doc_extensions = ['pdf', 'doc', 'docx'];
    */

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    // Commented out: not related to database table
    /*
    public static function getDepositImageUrl($filename, $ss)
    {
        if (!$filename) return null;

        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        $category = in_array($ext, self::$allowed_image_extensions) ? 'image' : 'document';

        return XPublicStorage::getUrl(
            ['subs_id' => $ss->subs_id, 'dir' => self::$img_dir],
            $category
        ) . $filename;
    }
    */

    public function saveDeposit($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $arr['id'] ?? null;
        $ss = $ss ?? $this->userInfo;

        $v_rule = [
            'id'                    => '0|number',
            'contract_id'           => '1|number|exists=contracts.id',
            'tenant_id'             => '1|number|exists=tenants.id',
            'amount'                => '1|number|min=0|text=Amount is required.',
            'paid_amount'           => '0|number|min=0',
            'deposit_date'          => '1|date|text=Deposit date is required.',
            'status'                => '0|string',
            'remarks'               => '0|string|0-255',
            // 'payment_method'        => '1|string|text=Payment method is required.',
            // 'ref_no'                => '0|string|0-50',
            // 'remark'                => '0|string|0-255',
            // 'data'                  => '0|string',
            // 'ext'                   => '0|string',
            // 'mime_type'             => '0|string',
            // 'original_file_name'    => '0|string|0-255',
        ];

        $res = DBX::validateObject($arr, $v_rule, 1, [], $ss->lang);
        if ($res->error) return DV::error($res->error);
        $inputs = $res->values;

        $saveData = [
            'contract_id'  => $inputs['contract_id'],
            'tenant_id'    => $inputs['tenant_id'],
            'amount'       => $inputs['amount'],
            'paid_amount'  => $inputs['paid_amount'] ?? 0.00,
            'deposit_date' => $inputs['deposit_date'],
            'status'       => $inputs['status'] ?? 'pending',
            'remarks'      => $inputs['remarks'] ?? null,
        ];

        $savedId = DBX::saveData($ss, 'deposits', ['id' => $id], $saveData, [], 1);
        if (!$savedId) {
            return DV::error('Error saving deposit.');
        }

        return DV::depends($savedId, ['deposits' => $saveData, 'id' => $savedId]);
    }

    public function getListDeposit($arr = [], $ss = null)
    {
        $d = (object) $arr;
        $search_value = $d->search_value ?? null;
        $building_id  = $d->building_id  ?? null;
        $tenant_id    = $d->tenant_id    ?? null;
        $status_id    = $d->status_id    ?? null;
        $start_date   = $d->deposit_date_start ?? null;
        $end_date     = $d->deposit_date_end ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page     = $d->per_page     ?? 10;

        if (!is_numeric($current_page)) {
            $current_page = 1;
        }

        $skip_rows = ($current_page - 1) * $per_page;
        $str_search = "1=1";
        $str_moreWhere = "2=2";

        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "(t.name LIKE '%" . $search_value . "%' OR bs.code LIKE '%" . $search_value . "%' OR t.phone_number LIKE '%" . $search_value . "%')";
        } else {
            if ($start_date) {
                $start_date = date('Y-m-d', strtotime($start_date));
                $str_moreWhere .= " AND d.deposit_date >= '$start_date'";
            }

            if ($end_date) {
                $end_date = date('Y-m-d', strtotime($end_date));
                $str_moreWhere .= " AND d.deposit_date <= '$end_date'";
            }

            if ($tenant_id) {
                $str_moreWhere .= ' AND d.tenant_id = ' . $tenant_id;
            }

            if ($building_id) {
                $str_moreWhere .= ' AND bs.building_id = ' . $building_id;
            }

            if ($status_id) {
                $str_moreWhere .= " AND d.status = '" . escape_like_str($status_id) . "'";
            }
        }

        $query = DB::table('deposits as d')
            ->join('contracts as c', 'c.id', 'd.contract_id')
            ->join('tenants as t', 't.id', 'd.tenant_id')
            ->join('building_spaces as bs', 'bs.id', 'c.space_id')
            ->leftJoin('buildings as b', 'b.id', 'bs.building_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw("   d.id, d.contract_id, d.tenant_id, t.name as tenant_name, t.phone_number,
                           b.name as building_name, bs.code as space_code,
                           c.start_date, c.end_date,
                           d.amount as total_amount, 
                           d.paid_amount,
                           d.deposit_date,
                           d.status,
                           d.remarks as remark,
                           d.update_user, d.updated_at
                       ")
            ->orderBy('d.id', 'desc');

        $count = (clone $query)->count('d.id');
        $rows  = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            setOfficialDates($row, ['start_date', 'end_date', 'deposit_date'], ['updated_at'], []);
            $row->total_amount = floatval($row->total_amount);
            $row->paid_amount = floatval($row->paid_amount);
            $row->balance = max(0, $row->total_amount - $row->paid_amount);
        }
        unset($row);

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public static function depositDetails($id, $ss = null)
    {
        $row = DB::table('deposits as d')
            ->join('contracts as c', 'c.id', 'd.contract_id')
            ->join('tenants as t', 't.id', 'd.tenant_id')
            ->join('building_spaces as bs', 'bs.id', 'c.space_id')
            ->leftJoin('buildings as b', 'b.id', 'bs.building_id')
            ->where('d.id', $id)
            ->selectRaw("   d.id, d.contract_id, d.tenant_id, t.name as tenant_name, t.phone_number,
                           b.name as building_name, bs.code as space_code,
                           c.start_date, c.end_date,
                           d.amount as total_amount, 
                           d.paid_amount,
                           d.deposit_date,
                           d.status,
                           d.remarks as remark,
                           d.update_user, d.updated_at
                       ")
            ->first();
        if ($row) {
            setOfficialDates($row, ['start_date', 'end_date', 'deposit_date'], ['updated_at'], []);
            $row->total_amount = floatval($row->total_amount);
            $row->paid_amount = floatval($row->paid_amount);
            $row->balance = max(0, $row->total_amount - $row->paid_amount);
        }
        return $row;
    }

    public static function getFormOptions($id = null, $ss = null)
    {
        $deposit_details = $id ? self::depositDetails($id, $ss) : null;

        return (object) [
            'deposit_details' => $deposit_details,
            'tenants'         => GeneralSettings::options_tenant($ss),
            'buildings'       => GeneralSettings::options_building($ss),
            'deposit_statuses' => [
                ['id' => 'pending', 'name' => 'pending'],
                ['id' => 'paid', 'name' => 'paid'],
                ['id' => 'refunded', 'name' => 'refunded'],
            ],
        ];
    }

    public function deleteDeposit($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $deposit = DB::table('deposits')->where('id', $id)->first();
        if (!$deposit) {
            return DV::error('Deposit not found.');
        }

        DB::beginTransaction();
        try {
            DB::table('deposits')->where('id', $id)->delete();
            DB::commit();
            return DV::depends(1, ['action' => 'deleted']);
        } catch (\Exception $e) {
            DB::rollBack();
            return DV::error($e->getMessage());
        }
    }

    public function updateDepositStatus($status_id, $id = null, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;

        $currentStatus = DB::table('deposits')->where('id', $id)->value('status');
        if ($currentStatus == $status_id) return DV::error('It is the same current status.');

        $update = [
            'status'      => $status_id,
            'update_user' => $ss->full_name,
            'updated_at'  => getNowTime(),
        ];

        if ($status_id === 'paid') {
            $amount = DB::table('deposits')->where('id', $id)->value('amount');
            $update['paid_amount'] = $amount;
        }

        $x = DB::table('deposits')->where('id', $id)->update($update);

        return DV::depends($x, ['Deposit status', 'updated']);
    }

    /*
    public function uploadAttachment($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        if (!$id) return DV::error('Contract not found.');

        $contract = DB::table('contracts')
            ->where('id', $id)
            ->select('id', 'deposit_file_image')
            ->first();

        if (!$contract) return DV::error('Contract not found.');

        $v_rule = [
            'id'                 => '1|integer|exists:contracts,id',
            'data'               => '1|string',
            'ext'                => '1|string',
            'mime_type'          => '0|string',
            'original_file_name' => '0|string|0-255',
            'remark'             => '0|string|0-255',
        ];

        $res = DBX::validateObject($arr, $v_rule, 1, [], $ss->lang);
        if ($res->error) return DV::error($res->error);
        $inputs = $res->values;

        $data             = $inputs['data']               ?? null;
        $ext              = strtolower($inputs['ext']     ?? '');
        $originalFileName = $inputs['original_file_name'] ?? null;
        $remark           = $inputs['remark']             ?? null;

        if (!$data || !$ext) return DV::error('File is required.');

        $allowedExt = array_merge(self::$allowed_image_extensions, self::$allowed_doc_extensions);
        if (!in_array($ext, $allowedExt)) {
            return DV::error('Invalid file type.');
        }

        DB::beginTransaction();
        try {
            if ($contract->deposit_file_image) {
                XPublicStorage::delete(
                    ['subs_id' => $ss->subs_id, 'dir' => self::$img_dir],
                    'image',
                    $contract->deposit_file_image
                );
            }

            $data = preg_replace('#^data:.*;base64,#', '', $data);
            $category = in_array($ext, self::$allowed_image_extensions) ? 'image' : 'document';

            $file = XPublicStorage::savefile(
                ['subs_id' => $ss->subs_id, 'dir' => self::$img_dir],
                $ext,
                $data,
                $category,
                $originalFileName
            );

            if ($file->status === 'Error') {
                DB::rollBack();
                return DV::error($file->error_message);
            }

            $updateData = [
                'deposit_file_image'         => $file->file_name,
                'deposit_file_ext'           => $ext,
                'deposit_file_original_name' => $originalFileName ?? $file->file_name,
                'update_user'                => $ss->full_name ?? 'Admin',
                'updated_at'                 => getNowTime(),
            ];

            if (!is_null($remark)) {
                $updateData['deposit_paid_remarks'] = $remark;
            }

            DB::table('contracts')->where('id', $id)->update($updateData);

            DB::commit();
            return DV::depends(1, ['id' => $id, 'file_name' => $file->file_name]);
        } catch (\Exception $e) {
            DB::rollBack();
            return DV::error($e->getMessage());
        }
    }

    public function viewDepositAttachment($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $contract = DB::table('contracts')
            ->where('id', $id)
            ->select('id', 'deposit_file_image', 'deposit_file_ext')
            ->first();

        if (!$contract) return DV::error('Contract not found.');
        if (!$contract->deposit_file_image) return DV::error('No attachment found.');

        $ext = strtolower($contract->deposit_file_ext ?? pathinfo($contract->deposit_file_image, PATHINFO_EXTENSION));
        $category = in_array($ext, self::$allowed_image_extensions) ? 'image' : 'document';

        $fileUrl = XPublicStorage::getUrl(
            ['subs_id' => $ss->subs_id, 'dir' => self::$img_dir],
            $category
        ) . $contract->deposit_file_image;

        $mimeTypes = [
            'gif'  => 'image/gif',
            'png'  => 'image/png',
            'jpg'  => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'pdf'  => 'application/pdf',
            'doc'  => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        $mimeType = $mimeTypes[$ext] ?? 'application/octet-stream';

        return DV::depends(1, [
            'data_url'  => $fileUrl,
            'file_name' => $contract->deposit_file_image,
            'ext'       => $ext,
            'mime_type' => $mimeType,
        ]);
    }

    public function deleteAttachment($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $contract = DB::table('contracts')
            ->where('id', $id)
            ->select('id', 'deposit_file_image')
            ->first();

        if (!$contract)     return DV::error('Contract not found.');
        if (!$contract->deposit_file_image) return DV::error('No attachment found.');

        $ext = strtolower(pathinfo($contract->deposit_file_image, PATHINFO_EXTENSION));
        $category = in_array($ext, self::$allowed_image_extensions) ? 'image' : 'document';

        DB::beginTransaction();
        try {
            XPublicStorage::delete(
                ['subs_id' => $ss->subs_id, 'dir' => self::$img_dir],
                $category,
                $contract->deposit_file_image
            );

            DB::table('contracts')->where('id', $id)->update([
                'deposit_file_image'  => null,
                'deposit_file_ext'    => null,
                'deposit_file_original_name' => null,
                'update_user' => $ss->full_name ?? 'Admin',
                'updated_at'  => getNowTime(),
            ]);

            DB::commit();
            return DV::depends(1, ['action' => 'attachment_deleted', 'id' => $id]);
        } catch (\Exception $e) {
            DB::rollBack();
            return DV::error('Failed to delete attachment.');
        }
    }
    */
}
