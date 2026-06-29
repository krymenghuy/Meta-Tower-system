<?php

namespace App\Models\Prm;

use App\Models\Prm\GeneralSettings;
use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use XPublicStorage;

class Announcement
{
    protected $id = null;
    protected $userInfo = null;
    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function saveAnnouncement($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $v_rule = [
            'title' => '1|string|1-150|text=announcement_title_required',
            'description' => '1|string|text=announcement_description_required'
        ];
        $title_char = ['&', '.', '/', '-', ' ', '?', '!', '(', ')', '[', ']', ',', ':', ';', '"'];
        $desc_char = ['&', '.', '/', '-', ' ', '?', '!', '(', ')', '[', ']', ',', ':', ';', '"', '<', '>', '=', '_'];
        $res = DBX::validateObject($arr, $v_rule, 1, ['title' => $title_char, 'description' => $desc_char], $ss->lang, 0, null);
        if ($res->error) {
            return DV::error($res->error);
        }
        $inputs = $res->values;
        $exist = DB::table('announcements')
            ->whereRaw('LOWER(title)=?', [strtolower($inputs['title'])])
            ->when($id, function ($q) use ($id) {
                $q->where('id', '<>', $id);
            })
            ->exists();

        $now = date('Y-m-d H:i:s');
        if ($id) {
            $inputs['updated_at'] = $now;
            $updated = DB::table('announcements')
                ->where('id', $id)
                ->update($inputs);
            if ($updated !== false) {
                return DV::depends(1, ['announcements' => $inputs, 'id' => $id]);
            }
        } else {
            $inputs['created_at'] = $now;
            $inputs['updated_at'] = $now;
            $newId = DB::table('announcements')->insertGetId($inputs);
            if ($newId > 0) {
                return DV::depends(1, ['announcements' => $inputs, 'id' => $newId]);
            }
        }

        return DV::error('Error saving announcement!');
    }

    public function getListPaginate($arr = [], $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $d = (object) $arr;
        $search_value = $d->search_value ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page) || !is_numeric($per_page)) {
            return null;
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $str_search = "1=1";
        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(a.title Like '%" . $search_value . "%' OR a.description Like '%" . $search_value . "%')";
        }
        $query = DB::table('announcements as a')
            ->whereRaw($str_search)
            ->selectRaw("a.id, a.title, a.description")
            ->orderBy('a.id', 'desc');
        $clone_query = clone $query;
        $count = $clone_query->count('a.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public function announcementDetails($id)
    {
        $announcement = DB::table('announcements as a')
            ->where('a.id', $id)
            ->selectRaw("a.id, a.title, a.description")
            ->first();
        return $announcement;
    }

    public function deleteAnnouncement($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $deleted = DB::table('announcements')->where('id', $id)->delete();
        return $deleted
            ? DV::depends($deleted, ['action' => 'deleted'])
            : DV::error('Delete failed.');
    }

    public function getFormOptions($id = null, $ss = null)
    {
        $announcement_details = $id ? self::announcementDetails($id) : null;
        return (object) [
            'announcement_details' => $announcement_details
        ];
    }
}
