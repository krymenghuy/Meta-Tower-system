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
    protected $table = 'emp_documents';
    protected $userInfo = null;
    protected static $img_dir = 'emp_documents';
    protected static $allowed_image_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    protected static $allowed_doc_extensions = ['pdf'];

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public static function baseQuery()
    {
        return DB::table('emp_documents as ed')
            ->join('document_types as dt', 'dt.id', '=', 'ed.document_type_id');
    }

    public static function storageCategory($ext)
    {
        $ext = strtolower(ltrim( $ext, '.'));
        return in_array($ext, self::$allowed_image_extensions, true) ? 'image' : 'document';
    }

    public static function getListByEmployee($emp_id, $ss)
    {
        if (!$emp_id || !is_numeric($emp_id)) {
            return [];
        }

        return self::baseQuery()
            ->where('ed.emp_id', (int) $emp_id)
            ->orderByDesc('ed.id')
            ->selectRaw(
                'ed.id, ed.emp_id, ed.document_type_id, ed.description,
                ed.description as remarks, ed.file_name, dt.name as document_type',
            )
            ->get()
            ->values()
            ->all();
    }

    public function upsert($arr = [], $id = null, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $id = $id ?? $this->id;

        if (!isset($arr['description']) && isset($arr['remarks'])) {
            $arr['description'] = $arr['remarks'];
        }

        $v_rule = [
            'emp_id' => '1|number|exists=employees.id',
            'document_type_id' => '1|number|exists=document_types.id|text=select_document_type',
            'description' => '0|string|0-150',
            'ext' => '0|string',
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
        $data = $inputs['data'] ?? null;
        $ext = strtolower($inputs['ext'] ?? '');

        $employee = DB::table('employees')
            ->where('id', $inputs['emp_id'])
            ->selectRaw('id, branch_id')
            ->first();
        if (!$employee) {
            return DV::error('Employee not found');
        }

        $saveInputs = [
            'emp_id' => $inputs['emp_id'],
            'document_type_id' => ($inputs['document_type_id'] ?? 0),
            'description' => $inputs['description'] ?? null,
            'branch_id' => $employee->branch_id ?? ($ss->branch_id ?? null),
        ];

        if ($data && $ext) {
            $allAllowed = array_merge(
                self::$allowed_image_extensions,
                self::$allowed_doc_extensions,
            );
            if (!in_array($ext, $allAllowed, true)) {
                return DV::error('Invalid file type. Allowed: ' . implode(', ', $allAllowed));
            }

            $category = self::storageCategory($ext);
            $data = preg_replace('#^data:.*;base64,#', '', $data);
            $fileRes = XPublicStorage::savefile(
                ['subs_id' => $ss->subs_id, 'dir' => self::$img_dir],
                $ext,
                $data,
                $category,
                null,
            );

            if ($fileRes->status === 'Error') {
                return DV::error($fileRes->error_message);
            }

            $saveInputs['file_name'] = $fileRes->file_name;
        } elseif (!$id) {
            return DV::error('Please select a file');
        } elseif ($id) {
            $existing = DB::table('emp_documents')
                ->where('id', $id)
                ->value('file_name');
            $saveInputs['file_name'] = $existing;
        }

        $now = getNowTime();
        if (!$id) {
            $saveInputs['created_at'] = $now;
        }
        $saveInputs['updated_at'] = $now;

        $id = DBX::saveData($ss, 'emp_documents', ['id' => $id], $saveInputs, [], 1, false);
        return DV::depends(
            $id,
            ['emp_documents' => $saveInputs, 'id' => $id],
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

        $doc = DB::table('emp_documents')
            ->where('id', $id)
            ->selectRaw('id, file_name')
            ->first();
        if (!$doc) {
            return DV::error('Document not found');
        }

        if (!empty($doc->file_name)) {
            $ext = pathinfo($doc->file_name, PATHINFO_EXTENSION);
            XPublicStorage::delete(
                ['subs_id' => $ss->subs_id, 'dir' => self::$img_dir],
                self::storageCategory($ext),
                $doc->file_name,
            );
        }

        $deleted = DB::table('emp_documents')->where('id', $id)->delete();
        return DV::depends($deleted, null, 'Error deleting document');
    }

    function getDetails($id, $ss)
    {
        $document = DB::table('emp_documents as ed')
            ->join('document_types as dt', 'dt.id', '=', 'ed.document_type_id')
            ->where('ed.id', $id)
            ->selectRaw(
                'ed.id, ed.emp_id, ed.document_type_id, ed.description,
                ed.description as remarks, ed.file_name, dt.name as document_type',
            )
            ->first();
        return $document;
    }

    function getFormOptions($id, $ss)
    {
        $document = null;
        if ($id) $document = self::getDetails($id, $ss);
        return (object) [
            'document_types' => GeneralSettings::options_document_type($ss),
            'document_request' => $document,
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

        $ext = strtolower(ltrim(pathinfo($doc->file_name, PATHINFO_EXTENSION), '.'));
        $storageCategory = self::storageCategory($ext);
        $file = XPublicStorage::getUrl(
            ['subs_id' => $ss->subs_id, 'dir' => self::$img_dir],
            $storageCategory,
        ) . $doc->file_name;

        $relativePath = str_replace('\\', '/', $file);
        if (!$relativePath) {
            return DV::error('File not found in storage.');
        }

        return DV::depends(1, [
            'data_url' => $relativePath,
            'file_name' => $doc->file_name,
            'ext' => $ext,
            'mime_type' => $mimeTypes[$ext] ?? 'application/octet-stream',
        ]);
    }
}
