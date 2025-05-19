<?php

namespace App\Models\Ypg;

use DV;
use DBX;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class DocumentType //extends Model
{
    protected $id;
    protected $userInfo;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function getProps($id, $props = [])
    {
        $columns = is_array($props) ? implode(',', $props) : $props;
        return DB::table('document_types')->where('id', $id)->selectRaw($columns)->first();
    }

    public function save($doc, $ss, $arr)
    {
        $id = $this->id ?? ($arr['id'] ?? null);
        $ss = $ss ?? $this->userInfo;

        $validationRules = [
            'id' => '0|identity=1',
            'name' => '1|string|0-100',
        ];

        $restrictedChars = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ','];

        $validationResult = DBX::validateObject($arr, $validationRules, true, ['name' => $restrictedChars], $ss->lang, false);

        if ($validationResult->error) {
            return DV::error($validationResult->error);
        }

        $inputs = $validationResult->values;

        $existingItem = DB::table('document_types')
            ->where('name', $inputs['name'])
            ->first();

        if ($id) {
            if ($existingItem && $existingItem->id !== $id) {
                return DV::error('Update failed: Document type already exists.');
            }

            $updated = DB::table('document_types')
                ->where('id', $id)
                ->update($inputs);

            return $updated
                ? DV::depends($id, ['id' => $id], 'Update successful')
                : DV::error('Update failed.');
        } else {
            if ($existingItem) {
                return DV::error('Create failed: Document type already exists.');
            }

            $newId = DB::table('document_types')->insertGetId($inputs);

            return $newId
                ? DV::depends($newId, ['id' => $newId], 'Create successful')
                : DV::error('Create failed.');
        }
    }

    public function getList($arr, $ss = null)
    {
        $params = (object) $arr;
        $currentPage = $params->current_page ?? 1;
        $perPage = $params->per_page ?? 10;
        $offset = ($currentPage - 1) * $perPage;
        $query = DB::table('document_types as doc')
            ->selectRaw('doc.id, doc.name as doc_name')
            ->orderBy('doc.id', 'adoc');


        if (!empty($params->search_value)) {
            $searchValue = $params->search_value;
            $query->where(function ($q) use ($searchValue) {
                $q->where('doc.name', 'LIKE', "%{$searchValue}%");
            });
        }

        $total = $query->count();
        $Schools = $query->skip($offset)->take($perPage)->get();

        return new LengthAwarePaginator($Schools, $total, $perPage, $currentPage);
    }

    public static function getDetails($id)
    {
        return DB::table('document_types as doc')
            ->selectRaw('doc.id, doc.name as doc_name')
            ->where('doc.id', $id)->get()
            ->first();
    }

    public function delete($id = null)
    {
        $id = $id ?? $this->id;
        $deleted = DB::table('document_types')->where('id', $id)->delete();

        return $deleted
            ? DV::depends($deleted, ['action' => 'deleted'])
            : DV::error('Delete failed.');
    }

    public static function getFormOptions($id)
    {
        $checkPoints = $id ? self::getDetails($id) : null;

        return (object) [
            'document_types' => $checkPoints,
        ];
    }

    public function getDocumentType($arr, $ss = null)
    {
        $params = (object) $arr;
        $branch_id = $ss->branch_id;

        $query = DB::table('document_types as doc')
            ->selectRaw('doc.id, doc.name as doc_name');

        if (!empty($params->search_value)) {
            $query->where('doc.name', 'LIKE', "%{$params->search_value}%");
        }

        return $query->get();
    }
}