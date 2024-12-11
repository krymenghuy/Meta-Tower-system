<?php

namespace App\Models\Bhr;

use App\Models\Bhr\GeneralSettings;
use App\Models\DV;
use App\Models\PublicStorage;
use Illuminate\Support\Facades\DB;
use App\Models\DBX;
use Illuminate\Pagination\LengthAwarePaginator;

class EmployeeDocument
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'emp_documents';

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
    public static function getExtensionFromMIMEType($file_content) {
        // Use finfo to detect the MIME type from the file content
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime_type = finfo_buffer($finfo, $file_content);
        finfo_close($finfo);

        // Map MIME types to file extensions
        $mime_types = [
            'application/pdf' => 'pdf',
            'application/msword' => 'doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
            'text/plain' => 'txt',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => 'xlsx',
            'application/vnd.ms-excel' => 'xls',
            'text/csv' => 'csv',
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/gif' => 'gif',
            'image/svg+xml' => 'svg',
            // Add other MIME types as needed
        ];

        return $mime_types[$mime_type] ?? false;
    }
    function save($arr, $ss = null) {
        // Get branch_id from user info
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        // Validation rules
        $v_rule = [
            'id' => '0|identity=1',
            'emp_id' => '1|number',
            'name' => '1|string|0-100',
            'file' => '1|string', // Expecting a Base64-encoded string
        ];

        // Validate input data
        $res = validateObject($arr, $v_rule, true, ['file' => GeneralSettings::$image_chars], $ss->lang, false, isset($arr['id']));
        if ($res->error) {
            error_log('Validation error: ' . json_encode($res->error));
            return DV::error($res->error);
        }

        // Extract validated values
        $id = $res->id;
        $inputs = $res->values;

        // Process Base64 file
        $base64 = str_replace('data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,', '', $inputs['file']);
        $decodedFile = base64_decode($base64);
        if ($decodedFile === false) {
            error_log('Error decoding Base64 file');
            return DV::error('Invalid file format');
        }

        // Generate a unique file name
        $fileName = uniqid('document_', true) . '.xlsx';

        // Set the file path
        $filePath = [
            'branch_id' => $branch_id,
            'dir' => 'emp_documents'
        ];

        // Define allowed file types for documents (mimic original savefile function structure)
        $allowed_exts = ['pdf', 'docs', 'doc', 'txt', 'xlsx', 'xls', 'csv'];
        $ext = 'xlsx';  // As we are working with .xlsx file
        $mime_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

        // Check if file type is allowed
        if (!in_array($ext, $allowed_exts)) {
            $file_exts = implode(',', $allowed_exts);
            return DV::error("File type is not allowed. Allowed file types are $file_exts. The provided file type is $ext");
        }

        // Save the file using PublicStorage
        $saveResult = PublicStorage::savefile($filePath, $ext, $decodedFile, 'documents');
        if ($saveResult) {
            // File saved successfully, update file name in inputs
            $inputs['file'] = $fileName;

            // Save or update the database record
            $id = saveData($ss, 'emp_documents', ['id' => $id], $inputs, [], 1);
            if ($id > 0) {
                return DV::depends(1, ['emp_documents' => $inputs, 'id' => $id]);
            }

            return DV::error('Error saving data to database');
        }

        // Error saving file
        error_log('Error saving file to storage');
        return DV::error('Error saving file');
    }






}
