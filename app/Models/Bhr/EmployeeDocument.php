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

    public function save($arr = [], $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'id' => '0|identity=1',
            'emp_id' => '1|number',
            'name' => '0|string',
            'ext' => '0|string',
            'file_name' => '1|string',
        ];

        $res = validateObject($arr, $v_rule, true, ['file_name' => GeneralSettings::$image_chars], $ss->lang, false, isset($arr['id']));
        if ($res->error) {
            error_log('Validation error: ' . json_encode($res->error));
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;
        $d = (object) $inputs;
        $data = $d->file_name;
        $catagory = isImage($data) ? 'image' : 'document';
        $ext = $d->ext;


        unset($inputs['file_name']);
        unset($inputs['ext']);
        $emp_document_create = !$id;
        $res = null;

        if($catagory == 'image')
        {
            $res =PublicStorage::saveImage(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], null, $data, null);
        }
        else
        {
            $res = PublicStorage::savefile(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], $ext, $data,$catagory);
        }
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

    // public static function getfile($id)
    // {
    //     $col_subs_id = DBX::getHex('ed.subs_id', 'subs_id');
    //     $row = DB::table('emp_documents as ed')->where('id', $id)->selectRaw($col_subs_id . ',ed.branch_id,ed.file_name')->first();
    //     if ($row) {
    //         $category = isImage($row->file_name) ? 'image' : 'document';
    //         $url = PublicStorage::getUrl(['subs_id' => $row->subs_id, 'dir' => 'emp_documents'], $category) . $row->file_name;
    //         return validateUrl($url);
    //     } else {
    //         return self::defaultImage($row ? $row->subs_id : null);
    //     }
    // }


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

    function delete($id, $ss)
    {
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

        $catagory = isImage($data) ? 'image' : 'document';
        if ($data) {
            PublicStorage::delete(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], $catagory, $data);
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

}
