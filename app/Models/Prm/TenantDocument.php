<?php

namespace App\Models\Prm;

use App\Models\Prm\GeneralSettings;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use DV;
use Log;
use XPublicStorage;

class TenantDocument 
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'tenant_documents';
    protected $table = 'tenant_documents';
    

    protected static $allowed_image_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    protected static $allowed_doc_extensions   = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];

    public function __construct($id = null, $userInfo = null) {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

public function saveTenantDocument($arr = [], $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'tenant_id' => '1|number|exists=tenants.id',
            'remarks' => '0|string|0-255',
            'document_type_id' => '1|number|exists=document_types.id',
            'ext' => '0|string',
            'file_name' => '0|string|0-150',
            'data' => '0|string',
        ];

        $res = DBX::validateObject($arr, $v_rule, true, ['data' => GeneralSettings::$image_chars], $ss->lang, false, null);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $d = (object) $inputs;
        $data = $d->data;
        $ext = $d->ext;
        $category = 'image';
        if (in_array($ext, self::$allowed_image_extensions)) {
            $category = 'image';
        }
         else if  (in_array($ext, self::$allowed_doc_extensions)){
            $category = 'document';
         }

        // $res = null;

        // $res = XPublicStorage::savefile(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], $ext, $data, $category);
        $data = preg_replace('#^data:.*;base64,#', '', $data);
        
        $res= XPublicStorage::savefile(['subs_id' => $ss->subs_id, 'dir' => self::$img_dir], $ext, $data, $category);
        if ($res->status === "Error") {
            return DV::error($res->error_message);
            
        }
        unset($inputs['data']);
        $inputs['file_name'] = $res->file_name;

        // $data->description = $d->description;
        $id = DBX::saveData($ss, 'tenant_documents', ['id' => $id], $inputs, [], 1);
        return DV::depends($id, ['tenant_documents' => $inputs, 'id' => $id]);

    }
    public function getListDocument($arr, $ss = null) {
        $d = (object) $arr;
        $tenant_id = $d->tenant_id ? $d->tenant_id : $ss->id;

        $updated_at = DBX::formatTime("td.updated_at", 'updated_at');
        $row = DB::table('tenant_documents as td')
            ->join('document_types as dt', 'dt.id', '=', 'td.document_type_id')
            ->where('td.tenant_id', $tenant_id)
            ->selectRaw("td.id, td.tenant_id,td.ext, td.remarks, td.document_type_id, dt.name as document_type, td.file_name, td.created_at, $updated_at, td.update_user, td.create_user")
            ->orderBy('td.id', 'DESC')->get();

        return $row;
    }

    public static function getDetails($id) {
        return DB::table('tenant_documents as td')
            ->where('td.id', $id)
            ->selectRaw('td.id, td.tenant_id, td.remarks,td.ext, td.document_type_id, td.file_name')
            ->first();
    }

    public static function getFormOptions($id, $ss) {
        $document_details = $id ? self::getDetails($id) : null;
        return (object) [
            'document_details' => $document_details,
            'document_types'   => GeneralSettings::options_document_type($ss),
        ];
    }
    public function deleteTenantDocument($id = null){
        $id = $id ?? $this->id;
        $deleted = DB::table('tenant_documents')->where('id',$id)->delete();
        return $deleted ? DV::depends($deleted,['action'=>'deleted']) : DV::error('Delete failed.');
    }

//     public function downloadTenantDocument($id = null, $ss = null) {
//     $id = $id ?? $this->id;
//     $ss = $ss ?? $this->userInfo;

//     $doc = self::getDetails($id);
//     if (!$doc) return DV::error('Document not found.');
//     $filePath = self::$img_dir . '/' . $doc->file_name;
//     $file = XPublicStorage::getUrl(['subs_id' => $ss->subs_id, 'dir' => 'tenant_documents'], 'image') . $doc->file_name;

//     Log::info('File URL: ' . $file);

//     $filePath = str_replace('\\', '/', $filePath);


//     if (!$file) {
//         return DV::error('File not found in storage.');
//     }

//     $fileContent = \Storage::disk('public')->get($filePath);

//     $mimeTypes = [
//         'pdf'  => 'application/pdf',
//         'doc'  => 'application/msword',
//         'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//         'xls'  => 'application/vnd.ms-excel',
//         'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//         'png'  => 'image/png',
//         'jpg'  => 'image/jpeg',
//         'jpeg' => 'image/jpeg',
//     ];

//     $ext      = strtolower(ltrim($doc->ext, '.'));
//     $mimeType = $mimeTypes[$ext] ?? 'application/octet-stream';
//     $base64   = base64_encode($fileContent);
//     $dataUrl  = "data:{$mimeType};base64,{$base64}";

//     return DV::depends(1, [
//         'data_url'  => $dataUrl,
//         'file_name' => $doc->file_name,
//         'ext'       => $ext,
//         'mime_type' => $mimeType,
//     ]);
// }

public function downloadTenantDocument($id = null, $ss = null)
{
    $id = $id ?? $this->id;
    $ss = $ss ?? $this->userInfo;

    $doc = self::getDetails($id);
    if (!$doc) {
        return DV::error('Document not found.');
    }

     $file = XPublicStorage::getUrl(['subs_id' => $ss->subs_id, 'dir' => 'tenant_documents'], 'images') . $doc->file_name;

    $relativePath = str_replace('\\', '/', $file);

    // Optional: make it dynamic if subs_id is always available
    // $relativePath = "{$ss->subs_id}/tenant_documents/images/{$doc->file_name}";

    Log::info('Attempting to fetch from storage path: ' . $relativePath);

    // Check existence first – prevents exception
    if (!$relativePath) {
        Log::warning("File missing in storage: {$relativePath}");
        return DV::error('File not found in storage.');
    }

    $mimeTypes = [
        'pdf'  => 'application/pdf',
        'doc'  => 'application/msword',
        'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'xls'  => 'application/vnd.ms-excel',
        'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'png'  => 'image/png',
        'jpg'  => 'image/jpeg',
        'jpeg' => 'image/jpeg',
    ];

    $ext      = strtolower(ltrim($doc->ext ?? pathinfo($doc->file_name, PATHINFO_EXTENSION), '.'));
    $mimeType = $mimeTypes[$ext] ?? 'application/octet-stream';

    return DV::depends(1, [
        'data_url'  => $relativePath,
        'file_name' => $doc->file_name,
        'ext'       => $ext,
        'mime_type' => $mimeType,
    ]);
}
}