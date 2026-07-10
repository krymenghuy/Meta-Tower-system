<?php

namespace App\Models\Mhr;

use App\Models\Prm\GeneralSettings;
use Illuminate\Support\Facades\DB;
use Vsd\Database\DBX;
use Vsd\Response\DV;
use Vsd\Vsloquent\VSModel;
use XPublicStorage;

class EmployeeDocument extends VSModel
{
    protected $table = 'employee_documents';
    protected $userInfo = null;
    protected static $img_dir = 'employee_documents';
    protected static $allowed_image_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    protected static $allowed_doc_extensions = ['pdf'];

    /** Hardcoded document types for employee profile (not from document_types table). */
    public static $documentTypes = [
        1 => 'Other',
        2 => 'ID Card',
        3 => 'Passport',
        4 => 'CV',
        5 => 'Contract',
    ];

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public static function getDocumentTypeName($typeId)
    {
        $typeId = (int) $typeId;
        return self::$documentTypes[$typeId] ?? null;
    }

    public static function getDocumentTypeOptions()
    {
        $rows = [];
        foreach (self::$documentTypes as $id => $name) {
            $rows[] = (object) [
                'id' => $id,
                'document_type' => $name,
            ];
        }
        return $rows;
    }

    public static function getListByEmployee($emp_id, $ss)
    {
        if (!$emp_id || !is_numeric($emp_id)) {
            return [];
        }

        return DB::table('employee_documents as ed')
            ->where('ed.emp_id', (int) $emp_id)
            ->orderByDesc('ed.id')
            ->selectRaw(
                'ed.id, ed.emp_id, ed.document_type_id, ed.remarks, ed.ext,
                ed.original_file_name, ed.file_name, ed.category',
            )
            ->get()
            ->map(function ($row) {
                $row->document_type = self::getDocumentTypeName($row->document_type_id);
                return $row;
            })
            ->values()
            ->all();
    }

    public function upsert($arr = [], $id = null, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $id = $id ?? $this->id;

        $v_rule = [
            'emp_id' => '1|number|exists=employees.id',
            'document_type_id' => '1|number|text=select_document_type',
            'remarks' => '0|string|0-255',
            'ext' => '0|string',
            'original_file_name' => '0|string|0-255',
            'data' => '0|string',
        ];

        $res = DBX::validateObject(
            $arr,
            $v_rule,
            true,
            ['data' => GeneralSettings::$image_chars],
            $ss->lang,
            false,
            null,
        );
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $typeId = (int) ($inputs['document_type_id'] ?? 0);
        if (!self::getDocumentTypeName($typeId)) {
            return DV::error('Please select a document type.');
        }
        $inputs['document_type_id'] = $typeId;

        $data = $inputs['data'] ?? null;
        $ext = strtolower($inputs['ext'] ?? '');

        if ($data && $ext) {
            $allAllowed = array_merge(
                self::$allowed_image_extensions,
                self::$allowed_doc_extensions,
            );
            if (!in_array($ext, $allAllowed, true)) {
                return DV::error('Invalid file type. Allowed: ' . implode(', ', $allAllowed));
            }

            $category = in_array($ext, self::$allowed_image_extensions, true)
                ? 'image'
                : 'document';

            $data = preg_replace('#^data:.*;base64,#', '', $data);
            $fileRes = XPublicStorage::savefile(
                ['subs_id' => $ss->subs_id, 'dir' => self::$img_dir],
                $ext,
                $data,
                $category,
                $inputs['original_file_name'] ?? null,
            );

            if ($fileRes->status === 'Error') {
                return DV::error($fileRes->error_message);
            }

            unset($inputs['data']);
            $inputs['file_name'] = $fileRes->file_name;
            $inputs['category'] = $category;
            $inputs['ext'] = $ext;
        } else {
            if (!$id) {
                return DV::error('Please select a file');
            }
            unset(
                $inputs['data'],
                $inputs['ext'],
                $inputs['file_name'],
                $inputs['category'],
                $inputs['original_file_name'],
            );
        }

        $employee = DB::table('employees')
            ->where('id', $inputs['emp_id'])
            ->selectRaw('id, branch_id')
            ->first();
        if (!$employee) {
            return DV::error('Employee not found');
        }

        $inputs['branch_id'] = $employee->branch_id ?? ($ss->branch_id ?? null);
        $now = getNowTime();
        if (!$id) {
            $inputs['created_at'] = $now;
        }
        $inputs['updated_at'] = $now;

        $id = DBX::saveData($ss, 'employee_documents', ['id' => $id], $inputs, [], 1, false);
        return DV::depends(
            $id,
            ['employee_documents' => $inputs, 'id' => $id],
            'Failed to save document',
        );
    }

    public function delete($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        if (!$id || !is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        $doc = DB::table('employee_documents')
            ->where('id', $id)
            ->selectRaw('id, file_name, category')
            ->first();
        if (!$doc) {
            return DV::error('Document not found');
        }

        if (!empty($doc->file_name) && !empty($doc->category)) {
            XPublicStorage::delete(
                ['subs_id' => $ss->subs_id, 'dir' => self::$img_dir],
                $doc->category,
                $doc->file_name,
            );
        }

        $deleted = DB::table('employee_documents')->where('id', $id)->delete();
        return DV::depends($deleted, null, 'Error deleting document');
    }

    public static function getDetails($id, $ss)
    {
        if (!$id || !is_numeric($id)) {
            return null;
        }

        $row = DB::table('employee_documents as ed')
            ->where('ed.id', $id)
            ->selectRaw(
                'ed.id, ed.emp_id, ed.document_type_id, ed.remarks, ed.ext,
                ed.original_file_name, ed.file_name, ed.category',
            )
            ->first();

        if ($row) {
            $row->document_type = self::getDocumentTypeName($row->document_type_id);
        }

        return $row;
    }

    public static function getFormOptions($id, $ss)
    {
        $document = null;
        if ($id) {
            $document = self::getDetails($id, $ss);
        }

        return (object) [
            'document_types' => self::getDocumentTypeOptions(),
            'document' => $document,
        ];
    }

    public function download($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $doc = self::getDetails($id, $ss);
        if (!$doc) {
            return DV::error('Document not found.');
        }
        if (empty($doc->file_name)) {
            return DV::error('File not found in storage.');
        }

        $mimeTypes = [
            'pdf' => 'application/pdf',
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
        ];

        $ext = strtolower(ltrim($doc->ext ?? pathinfo($doc->file_name, PATHINFO_EXTENSION), '.'));
        $storageCategory = in_array($ext, self::$allowed_image_extensions, true)
            ? 'image'
            : 'document';
        $file = XPublicStorage::getUrl(
            ['subs_id' => $ss->subs_id, 'dir' => self::$img_dir],
            $storageCategory,
        ) . $doc->file_name;

        $relativePath = str_replace('\\', '/', $file);
        if (!$relativePath) {
            return DV::error('File not found in storage.');
        }

        $displayName = $doc->original_file_name
            ? ($ext ? $doc->original_file_name . '.' . $ext : $doc->original_file_name)
            : $doc->file_name;

        return DV::depends(1, [
            'data_url' => $relativePath,
            'file_name' => $displayName,
            'ext' => $ext,
            'mime_type' => $mimeTypes[$ext] ?? 'application/octet-stream',
        ]);
    }
}
