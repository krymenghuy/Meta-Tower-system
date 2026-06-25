<?php

namespace App\Models\Prm;

use App\Models\Prm\GeneralSettings;
use Vsd\Response\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use Vsd\Database\DBX;
use XPublicStorage;
use Log;

class Bill
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'bills';
    protected static $allowed_image_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    protected static $allowed_doc_extensions = ['pdf', 'doc', 'docx'];
    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public static function getBillImageUrl($filename, $ss)
    {
        if (!$filename) return null;

        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        $category = in_array($ext, self::$allowed_image_extensions) ? 'image' : 'document';

        return XPublicStorage::getUrl(
            ['subs_id' => $ss->subs_id, 'dir' => self::$img_dir],
            $category
        ) . $filename;
    }

    public function saveBill($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $remark_char = ['@', '.', '-', '_'];
        $ref_no_char = ['@', '.', '-', '_'];

        $v_rule = [
            'vendor_id'       => '1|number|exists=vendors.id|text=please_select_a_valid_vendor',
            'building_id'     => '1|number|exists=buildings.id|text=please_select_a_valid_building',
            'expense_type_id' => '1|number|exists=expense_categories.id|text=please_select_a_valid_category',
            'ref_no'          => '1|string|0-25|text=reference_no_is_required',
            'total_amount'    => '1|number|min=0|text=total_amount_is_required',
            'bill_date'       => '1|date|text=issue_date_is_required',
            'due_date'        => '1|date|text=due_date_is_required',
            'remark'          => '0|string|0-255',
            'data'            => '0|string',
            'ext'             => '0|string',
            'mime_type'       => '0|string',
            'original_file_name' => '0|string|0-255',

        ];

        $res = DBX::validateObject($arr, $v_rule, 1, ['data'  => GeneralSettings::$image_chars, 'mime_type' => GeneralSettings::$mime_type_chars, 'remark' => $remark_char, 'ref_no' => $ref_no_char], $ss->lang);
        if ($res->error) return DV::error($res->error);
        $inputs = $res->values;
        // \Log::info(json_encode($inputs));

        $data = $inputs['data'] ?? null;
        $ext   = $inputs['ext'] ?? null;
        $mimeType = $inputs['mime_type'] ?? null;
        // $file_name = $inputs['file_name'] ?? null;

        $billDate = strtotime($inputs['bill_date']);
        $dueDate  = strtotime($inputs['due_date']);

        if ($dueDate < $billDate) {
            return DV::error('due_date_must_be_after_issue_date');
        }
        $originalFileName = $inputs['original_file_name'] ?? null;
        unset($inputs['data'], $inputs['ext'], $inputs['original_file_name']);
        $total = floatval($inputs['total_amount'] ?? 0);
        if ($total < 0) {
            return  DV::error('total_amount_cannot_be_negative');
        }

        $inputs['total_amount'] = $total;
        $inputs['paid_amount']  = 0;
        $inputs['balance']      = $total;
        if (!empty($inputs['bill_number'])) {
            $exists = DB::table('bills')
                ->where('bill_number', $inputs['bill_number'])
                ->when($id, fn($q) => $q->where('id', '<>', $id))
                ->exists();

            if ($exists) {
                return DV::error('bill_number_already_exists');
            }
        }

        if (!empty($inputs['ref_no'])) {
            $exists = DB::table('bills')
                ->where('ref_no', $inputs['ref_no'])
                ->when($id, fn($q) => $q->where('id', '<>', $id))
                ->exists();

            if ($exists) {
                return DV::error('reference_number_already_exists');
            }
        }

        DB::beginTransaction();
        try {

            $created = !$id;
            $id = DBX::saveData($ss, 'bills', ['id' => $id], $inputs);
            if (!$id) {
                DB::rollBack();
                return DV::error('error_saving_bill');
            }
            if ($created) {
                setOfficialBillNumber($branch_id, 'bill_code_control', 'bills', ['id' => $id], 'B-', 5);
            }

            if ($data && $ext) {

                $ext = strtolower($ext);

                // Determine category
                if (in_array($ext, self::$allowed_image_extensions)) {
                    $category = 'image';
                } elseif (in_array($ext, self::$allowed_doc_extensions)) {
                    $category = 'document';
                } else {
                    DB::rollBack();
                    return DV::error('file_type');
                }

                // if (!is_string($data)) {
                //     DB::rollBack();
                //     return DV::error('Invalid file content.');
                // }

                // if (strpos($data, 'base64,') !== false) {
                //     $parts = explode('base64,', $data);
                //     $data = $parts[1] ?? '';
                // }

                // if (base64_decode($data, true) === false) {
                //     DB::rollBack();
                //     return DV::error('Invalid base64 data.');
                // }

                $old_file = DB::table('bills')->where('id', $id)->value('file_image');
                if ($old_file) {
                    XPublicStorage::delete([
                        'subs_id' => $ss->subs_id,
                        'dir'     => self::$img_dir
                    ], 'image', $old_file);
                }
                $data = preg_replace('#^data:.*;base64,#', '', $data);

                // \Log::info($data);
                $file = XPublicStorage::savefile(
                    ['subs_id' => $ss->subs_id, 'dir' => self::$img_dir],
                    $ext,
                    $data,
                    $category,
                    $originalFileName
                );
                // \Log::info(json_encode($file));


                if ($file->status === 'Error') {
                    DB::rollBack();
                    return DV::error($file->error_message);
                }

                if (!empty($file->file_name)) {
                    DB::table('bills')->where('id', $id)->update([
                        'file_image' => $file->file_name,
                        'ext' => $ext,
                        'original_file_name' => $originalFileName ?? $file->file_name

                    ]);

                    $inputs['file_image'] = $file->file_name;
                }
            }

            DB::commit();

            return DV::depends(1, ['bills' => $inputs, 'id' => $id]);
        } catch (\Exception $e) {
            DB::rollBack();
            return DV::error($e->getMessage());
        }
    }


    public function getListBill($arr = [], $ss = null)
    {
        $d  = (object) $arr;
        $search_value = $d->search_value ?? null;
        $building_id  = $d->building_id  ?? null;
        $vendor_id    = $d->vendor_id    ?? null;
        $status_id    = $d->status_id    ?? null;
        $expense_type_id    = $d->expense_type_id ?? null;
        $start_date = $d->bill_date_start ?? null;
        $end_date   = $d->bill_date_end ?? null;
        $due_date = $d->due_date ?? null;
        $due_end_date   = $d->due_end_date ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page     = $d->per_page     ?? 10;

        if (!is_numeric($current_page)) {
            $current_page = 1;
        }

        $skip_rows = ($current_page - 1) * $per_page;
        $str_search = "1=1";
        $str_moreWhere = "2=2";

        if ($search_value) {
            $skip_rows    = 0;
            $search_value = escape_like_str($search_value);
            $str_search   = "(b.bill_number LIKE '%" . $search_value . "%' OR b.ref_no LIKE '%" . $search_value . "%' OR v.name LIKE '%" . $search_value . "%')";
        } else {
            if ($start_date) {
                $start_date = date('Y-m-d', strtotime($start_date));
                $str_moreWhere .= " AND b.bill_date >= '$start_date'";
            }

            if ($end_date) {
                $end_date = date('Y-m-d', strtotime($end_date));
                $str_moreWhere .= " AND b.bill_date <= '$end_date'";
            }
            if ($due_date) {
                $due_date = date('Y-m-d', strtotime($due_date));
                $str_moreWhere .= " AND b.due_date >= '$due_date'";
            }

            if ($due_end_date) {
                $due_end_date = date('Y-m-d', strtotime($due_end_date));
                $str_moreWhere .= " AND b.due_date <= '$due_end_date'";
            }
            if ($vendor_id) {
                $str_moreWhere .= ' AND b.vendor_id = ' . $vendor_id;
            }

            if ($building_id) {
                $str_moreWhere .= ' AND b.building_id = ' . $building_id;
            }

            if ($status_id) {
                $str_moreWhere .= ' AND b.status_id = ' . $status_id;
            }
            if ($expense_type_id) {
                $str_moreWhere .= ' AND b.expense_type_id = ' . $expense_type_id;
            }
        }

        $query = DB::table('bills as b')
            ->leftJoin('vendors as v', 'v.id', 'b.vendor_id')
            ->leftJoin('buildings as bl', 'bl.id', 'b.building_id')
            ->leftJoin('bill_statuses as s', 's.id', 'b.status_id')
            ->leftJoin('expense_categories as ex', 'ex.id', 'b.expense_type_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw("   b.id, b.bill_number, b.ref_no, b.expense_type_id,
                            ex.name as expense_type_name, b.vendor_id,
                            v.name as vendor_name, v.phone_number,v.email,
                            bl.name as building_name,
                            b.bill_date, b.due_date,
                            b.total_amount, b.balance, b.paid_amount,
                            b.status_id,
                            CASE
                                WHEN b.status_id = 2 THEN s.name
                                WHEN b.balance > 0 AND b.due_date < CURDATE() THEN 'Overdue'
                                ELSE s.name
                            END AS status,
                            CASE
                                WHEN b.status_id = 2 THEN b.status_id
                                WHEN b.balance > 0 AND b.due_date < CURDATE() THEN 4
                                ELSE b.status_id
                            END AS display_status_id,
                            b.file_image,b.original_file_name, b.update_user, b.remark, b.updated_at
                        ")
            ->orderBy('b.id', 'desc');
        $count = (clone $query)->count('b.id');
        $rows  = $query->skip($skip_rows)->take($per_page)->get();
        foreach ($rows as $row) {
            $processed = setOfficialDates($row, ['bill_date', 'due_date'], ['updated_at'], []);
            if ($processed) $row = $processed;

            $row->image_url = self::getBillImageUrl($row->file_image, $ss);
        }
        unset($row);

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public static function billDetails($id, $ss = null)
    {
        $row = DB::table('bills as b')
            // ->leftJoin('purchase_orders as po', 'po.id', 'b.po_number')
            ->leftJoin('vendors as v', 'v.id', 'b.vendor_id')
            ->leftJoin('buildings as bl', 'bl.id', 'b.building_id')
            ->leftJoin('expense_categories as ex', 'ex.id', 'b.expense_type_id')
            ->where('b.id', $id)
            ->selectRaw('b.id, b.bill_number, b.ref_no, b.vendor_id, v.name as vendor_name,b.expense_type_id, ex.name as expense_type_name, v.phone_number,v.email, b.building_id,bl.name as building_name, b.bill_date,b.due_date, b.file_image,b.original_file_name, b.total_amount, b.balance, b.paid_amount, b.status_id, b.remark')
            ->first();
        if ($row) {
            $row->file_image_url = self::getBillImageUrl($row->file_image, $ss);
            $processed = setOfficialDates($row, ['bill_date', 'due_date'], ['updated_at'], []);
            if ($processed) $row = $processed;
        }
        return $row;
    }

    public static function getFormOptions($id = null, $ss = null)
    {
        $bill_details = $id ? self::billDetails($id, $ss) : null;

        return (object) [
            'bill_details' => $bill_details,
            'vendors'      => GeneralSettings::options_vendor($ss),
            'buildings'    => GeneralSettings::options_building($ss),
            'bill_statuses'  => GeneralSettings::options_bill_statuses($ss),
            'expense_types' => GeneralSettings::options_expense_categories($ss),
        ];
    }

    public function deleteBill($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $paid = DB::table('bills')->select('id', 'status_id', 'paid_amount')->where('id', $id)->first();
        if (!$paid) {
            return DV::error('bill_not_found');
        }
        $is_paid = ($paid->paid_amount > 0 || $paid->status_id > 1);
        if ($is_paid) return DV::error('cannot_delete_paid_invoice');
        $deleted = DB::table('bills')->where('id', $id)->delete();
        if (!$deleted) {
            return DV::error('delete_failed');
        }
        return DV::depends($deleted, ['action' => 'deleted']);
    }

    public function getVendorInfo($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $vendor = DB::table('vendors')
            ->where('id', $id)
            ->select('id', 'name', 'code', 'tax_number', 'address', 'phone_number', 'email')
            ->first();

        return (object) ['vendor' => $vendor];
    }

    public function updateBillStatus($status_id, $id = null, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;

        $currentStatus = DB::table('bills')->where('id', $id)->value('status_id');
        if ($currentStatus == $status_id) return DV::error('same_current_status');
        $x = DB::table('bills')->where('id', $id)->update([
            'status_id'   => $status_id,
            'update_user' => $ss->full_name,
            'updated_at'  => getNowTime(),
        ]);

        return DV::depends($x, ['Bill status', 'updated']);
    }

    public function uploadAttachment($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        if (!$id) return DV::error('bill_not_found');

        $bill = DB::table('bills')
            ->where('id', $id)
            ->select('id', 'file_image')
            ->first();

        if (!$bill) return DV::error('bill_not_found');

        $v_rule = [
            'id'                 => '1|integer|exists:bills,id',
            'data'               => '1|string',
            'ext'                => '1|string',
            'mime_type'          => '0|string',
            'original_file_name' => '0|string|0-255',
            'remark'             => '0|string|0-255',
        ];

        $res = DBX::validateObject(
            $arr,
            $v_rule,
            1,
            [
                'data'      => GeneralSettings::$image_chars,
                'mime_type' => GeneralSettings::$mime_type_chars,
            ],
            $ss->lang
        );
        if ($res->error) return DV::error($res->error);
        $inputs = $res->values;

        $data             = $inputs['data']               ?? null;
        $ext              = strtolower($inputs['ext']     ?? '');
        $originalFileName = $inputs['original_file_name'] ?? null;
        $remark           = $inputs['remark']             ?? null;

        if (!$data || !$ext) return DV::error('file_is_required');

        // validate extension
        $allowedExt = array_merge(self::$allowed_image_extensions, self::$allowed_doc_extensions);
        if (!in_array($ext, $allowedExt)) {
            return DV::error('file_type');
        }


        DB::beginTransaction();
        try {
            // delete old file if exists
            if ($bill->file_image) {
                $oldExt      = strtolower(pathinfo($bill->file_image, PATHINFO_EXTENSION));
                $oldCategory = in_array($oldExt, self::$allowed_image_extensions) ? 'image' : 'document';
                XPublicStorage::delete(
                    ['subs_id' => $ss->subs_id, 'dir' => self::$img_dir],
                    $oldCategory,
                    $bill->file_image
                );
            }

            // strip base64 header
            $data = preg_replace('#^data:.*;base64,#', '', $data);

            if (in_array($ext, self::$allowed_image_extensions)) {
                $category = 'image';
            } elseif (in_array($ext, self::$allowed_doc_extensions)) {
                $category = 'document';
            } else {
                DB::rollBack();
                return DV::error('file_type');
            }

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
                'file_image'         => $file->file_name,
                'ext'                => $ext,
                'original_file_name' => $originalFileName ?? $file->file_name,
                'update_user'        => $ss->full_name ?? 'Admin',
                'updated_at'         => getNowTime(),
            ];

            if (!is_null($remark)) {
                $updateData['remark'] = $remark;
            }

            DB::table('bills')->where('id', $id)->update($updateData);

            DB::commit();
            return DV::depends(1, ['id' => $id, 'file_name' => $file->file_name, "message" => '1234567890']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Bill::uploadAttachment Error: ' . $e->getMessage());
            return DV::error($e->getMessage());
        }
    }

    public function viewBillAttachment($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $bill = DB::table('bills')
            ->where('id', $id)
            ->select('id', 'file_image', 'ext')
            ->first();

        if (!$bill) return DV::error('bill_not_found');
        if (!$bill->file_image) return DV::error('no_attachment_found_for_bill');

        $ext = strtolower(pathinfo($bill->file_image, PATHINFO_EXTENSION));
        $category = in_array($ext, self::$allowed_image_extensions) ? 'image' : 'document';

        $fileUrl = XPublicStorage::getUrl(
            ['subs_id' => $ss->subs_id, 'dir' => self::$img_dir],
            $category
        ) . $bill->file_image;

        // \Log::info($fileUrl);

        $mimeTypes = [
            'gif'  => 'image/gif',
            'png'  => 'image/png',
            'jpg'  => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'pdf'  => 'application/pdf',
            'doc'  => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        // \Log::info($ext);

        $mimeType = $mimeTypes[$ext] ?? 'application/octet-stream';

        return DV::depends(1, [
            'data_url'  => $fileUrl,
            'file_name' => $bill->file_image,
            'ext'       => $ext,
            'mime_type' => $mimeType,
        ]);
    }

    public function deleteAttachment($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $bill = DB::table('bills')
            ->where('id', $id)
            ->select('id', 'file_image')
            ->first();

        if (!$bill)     return DV::error('bill_not_found');
        if (!$bill->file_image) return DV::error('no_attachment_found_for_bill');

        $ext = strtolower(pathinfo($bill->file_image, PATHINFO_EXTENSION));
        $category = in_array($ext, self::$allowed_image_extensions) ? 'image' : 'document';

        DB::beginTransaction();
        try {
            $deleted = XPublicStorage::delete(
                ['subs_id' => $ss->subs_id, 'dir' => self::$img_dir],
                $category,
                $bill->file_image
            );

            if (!$deleted) {
                Log::warning('Bill::deleteAttachment - File not found on disk: ' . $bill->file_image);
            }

            DB::table('bills')->where('id', $id)->update([
                'file_image'  => null,
                'update_user' => $ss->full_name ?? 'Admin',
                'updated_at'  => getNowTime(),
            ]);

            DB::commit();
            return DV::depends(1, ['action' => 'attachment_deleted', 'id' => $id]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Bill::deleteAttachment Error: ' . $e->getMessage());
            return DV::error('failed_to_delete_attachment');
        }
    }
}
