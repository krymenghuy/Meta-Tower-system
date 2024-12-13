<?php

namespace App\Models\Bhr;

use App\Models\Bhr\GeneralSettings;
use App\Models\DBX;
use App\Models\DV;
use App\Models\PublicStorage;
use Illuminate\Support\Facades\DB;
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

    public function save($arr = [], $ss = null,$id = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'emp_id' => '1|number',
            'name' => '0|string',
            'ext' => '0|string',
            'file_name' => '1|string',
        ];

        $res = validateObject($arr, $v_rule, true, ['file_name' => GeneralSettings::$image_chars], $ss->lang, false, null);
        if ($res->error) {
            error_log('Validation error: ' . json_encode($res->error));
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $d = (object) $inputs;
        $data = $d->file_name;
        $ext = $d->ext;
        // $category = isImage($data) ? 'image' : 'document';
        $extImage =  ['jpg','png','jpeg','gif','heif','bmp','webp','svg'];
        if (in_array($ext, $extImage)) {
            $category = 'image';
        }
         else{
            $category = 'document';
         }


        unset($inputs['file_name']);
        unset($inputs['ext']);
        $emp_document_create = !$id;
        $res = null;

        $res = PublicStorage::savefile(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], $ext, $data, $category);

        if ($res->status === "Error") {
            return DV::error($res->error_message);
        }

        $inputs['file_name'] = $res->file_name;

        if (empty($inputs['name'])) {
            $inputs['name'] = $res->file_name;
        }

        $id = saveData($ss, 'emp_documents', ['id' => $id], $inputs, [], 1);
        return DV::depends(1, ['emp_documents' => $inputs, 'id' => $id]);

        return DV::error('Error saving data');
    }

    function listpaginate($arr, $ss)
    {
        $d = (object) $arr;

        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 5;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $emp_id = $d->emp_id ?? null;
        $skip_rows = ($current_page - 1) * $per_page;

        $query = DB::table('emp_documents as ed')
            ->selectRaw('ed.id,ed.emp_id,ed.name,ed.file_name')
            ->where('ed.branch_id', $ss->branch_id)
            ->where('ed.emp_id', $emp_id);

            $query->skip($skip_rows)->take($per_page);
            $count_query = clone $query;
            $count = $count_query->count('ed.id');
            $rows = $query->get();

        // foreach ($rows as $row) {
        //     $row->image_url = '';
        //     if ($row->file_name) {
        //         $row->image_url = self::getfile($row->id);
        //     }
        //     unset($row->image_file_name);
        // }

            return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
        }



    function getDetails($id, $ss)
    {
        $row = DB::table('emp_documents as ed')
            ->selectRaw('ed.id,ed.emp_id,ed.name,ed.file_name')
            ->where('ed.branch_id', $ss->branch_id)
            ->first();
        return $row;
    }

    function delete($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        if (!isset($ss->branch_id) || !isset($ss->subs_id)) {
            return DV::error('Invalid session data');
        }

        $data = DB::table('emp_documents as ed')
            ->where('ed.id', $id)
            ->take(1)
            ->value('ed.file_name');
        $extension = pathinfo($data, PATHINFO_EXTENSION);
        $extImage =  ['jpg','png','jpeg','gif','heif','bmp','webp','svg'];
        if (in_array($extension, $extImage)) {
            $category = 'images';
        }
         else{
            $category = 'documents';
         }
        if ($data) {
            PublicStorage::delete(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], $category, $data);
        }
        DB::table('emp_documents as ed')->where('ed.id', $id)->update(['file_name' => null]);

        $query = DB::table('emp_documents')
            ->where('id', $id)
            ->where('branch_id', $ss->branch_id)
            ->delete();

        if (!$query) {
            return DV::error('Data not found or not deleted');
        }

        return DV::depends(1, ['id' => $id, 'deleted' => $data ?? 'No file found']);
    }

    function getFormOptions($id, $ss)
    {
        $emp_document = null;
        if ($id) {
            $emp_document = self::getDetails($id, $ss);
        }
        return (object) [


            'emp_document' => $emp_document,
        ];

    }

    public static function getfile($id)
    {
        $extImage =  ['jpg','png','jpeg','gif','heif','bmp','webp','svg'];

        $col_subs_id = DBX::getHex('ed.subs_id', 'subs_id');
        $row = DB::table('emp_documents as ed')->where('id', $id)->selectRaw($col_subs_id . ',ed.branch_id,ed.file_name')->first();

        $extension = pathinfo($row->file_name, PATHINFO_EXTENSION);
            if (in_array($extension, $extImage)) {
            $category = 'image';
            }
            else{
                $category = 'document';
            }
            // return $category;
        if ($row) {
            $url = PublicStorage::getUrl(['subs_id' => $row->subs_id, 'dir' => 'emp_documents'], $category) . $row->file_name;
            return validateUrl($url);
        } else {
            return self::defaultImage($row ? $row->subs_id : null);
        }
    }

    function downloadDocument($id, $ss)
    {

        $rows = DB::table('emp_documents as ed')
            ->selectRaw('ed.id, ed.emp_id, ed.name, ed.file_name')
            ->where('ed.branch_id', $ss->branch_id)
            ->get();


        foreach ($rows as $row) {
            $row->image_url = '';
            if ($row->file_name) {
                $row->image_url = self::getfile($row->id);
            }
            unset($row->file_name);
        }

        return $rows;
    }


}
