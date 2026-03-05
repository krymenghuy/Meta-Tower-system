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
    protected static $allowed_doc_extensions = ['docx','pdf','txt','xls','doc','xlsx','csv','dat','jpg', 'jpeg', 'png', 'gif', 'webp'];

  

    public function __construct($id = null, $userInfo = null) {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function saveTenantDocument($arr = [], $ss = null,$id = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'tenant_id' => '1|number|exists=tenants.id',
            'description' => '0|string|0-150',
            'document_type_id' => '1|number|exists=document_types.id',
            'ext' => '0|string',
            'file_name' => '1|string',
        ];

        $res = DBX::validateObject($arr, $v_rule, true, ['file_name' => GeneralSettings::$image_chars], $ss->lang, false, null);
        if ($res->error) {
            error_log('Validation error: ' . json_encode($res->error));
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $d = (object) $inputs;
        $data = $d->file_name;
        $ext = $d->ext;
        $allowed_exts = [];
        $category = 'image';
        if (in_array($ext, self::$allowed_image_extensions)) {
            $category = 'image';
        }
         else if  (in_array($ext, self::$allowed_doc_extensions)){
            $category = 'document';
         }


        unset($inputs['file_name']);
        unset($inputs['ext']);
        $emp_document_create = !$id;
        $res = null;

        $res = XPublicStorage::savefile(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], $ext, $data, $category);

        if ($res->status === "Error") {
            return DV::error($res->error_message);
        }

        $inputs['file_name'] = $res->file_name;

        if (empty($inputs['description'])) {
            $inputs['description'] = $res->file_name;
        }

        $id = DBX::saveData($ss, 'tenant_documents', ['id' => $id], $inputs, [], 1);
        return DV::depends(1, ['tenant_documents' => $inputs, 'id' => $id]);

    }
    public function getListPaginate($arr, $ss = null) {
        $d = (object) $arr;
        $tenant_id = $d->tenant_id ?? null;
        $document_type_id = $d->document_type_id ?? null;
        $current_page = is_numeric($d->current_page ?? null) ? $d->current_page : 1;
        $per_page = $d->per_page ?? 10;
        
        $skip_rows = ($current_page - 1) * $per_page;
        $str_moreWhere = '1=1';
       
        if($tenant_id) $str_moreWhere .= ' AND td.tenant_id =' . (int)$tenant_id;
        if($document_type_id) $str_moreWhere .= ' AND td.document_type_id =' . (int)$document_type_id;
        
        $updated_at = DBX::formatTime("td.updated_at", 'updated_at');
        $query = DB::table('tenant_documents as td')
            ->join('document_types as dt', 'dt.id', '=', 'td.document_type_id')
            ->join('tenants as t', 't.id', '=', 'td.tenant_id')
            ->whereRaw($str_moreWhere)
            ->selectRaw("td.id, td.tenant_id, td.description, td.document_type_id, dt.name as document_type_name, td.file_name, td.created_at, $updated_at, td.update_user, td.created_user")
            ->orderBy('td.id', 'DESC');

        $count = (clone $query)->count('td.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public static function getDetails($id) {
        return DB::table('tenant_documents as td')
            ->where('td.id', $id)
            ->selectRaw('td.id, td.tenant_id, td.description, td.document_type_id, td.file_name')
            ->first();
    }

    public static function getFormOptions($id, $ss) {
        $document_details = $id ? self::getDetails($id) : null;
        return (object) [
            'document_details' => $document_details,
            'document_types'   => GeneralSettings::options_document_type($ss),
        ];
    }
}