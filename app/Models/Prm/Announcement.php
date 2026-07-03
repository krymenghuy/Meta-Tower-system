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
            'description' => '1|string|text=announcement_description_required',
            'category' => '0|string|0-50',
            'priority' => '0|string|0-50',
            'audience' => '0|string|0-50',
            'publish_date' => '1|string|text=publish_date_required',
            'expiry_date' => '0|string',
            'status' => '1|string|text=status_required',
            'building_id' => '0|integer'
        ];
        $title_char = ['&', '.', '/', '-', ' ', '?', '!', '(', ')', '[', ']', ',', ':', ';', '"'];
        $desc_char = ['&', '.', '/', '-', ' ', '?', '!', '(', ')', '[', ']', ',', ':', ';', '"', '<', '>', '=', '_', '+', '%', '$', '#', '@', '\'', '*', '{', '}', '|', '\\', '~', '`', '^'];
        $clean_char = [' ', '-', '_'];
        $res = DBX::validateObject($arr, $v_rule, 1, [
            'title' => $title_char, 
            'description' => $desc_char,
            'category' => $clean_char,
            'priority' => $clean_char,
            'audience' => $clean_char,
            'status' => $clean_char,
            'publish_date' => ['/', ' ', ':', '-'],
            'expiry_date' => ['/', ' ', ':', '-']
        ], $ss->lang, 0, null);
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


        // Format dates
        if (!empty($inputs['publish_date'])) {
            $inputs['publish_date'] = date('Y-m-d H:i:s', strtotime($inputs['publish_date']));
        }
        if (!empty($inputs['expiry_date'])) {
            $inputs['expiry_date'] = date('Y-m-d H:i:s', strtotime($inputs['expiry_date']));
        } else {
            $inputs['expiry_date'] = null;
        }

        $inputs['building_id'] = !empty($inputs['building_id']) ? $inputs['building_id'] : null;

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
        $category = $d->category ?? null;
        $priority = $d->priority ?? null;
        $status = $d->status ?? null;
        $sort = $d->sort ?? 'newest';

        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page) || !is_numeric($per_page)) {
            return null;
        }
        $skip_rows = ($current_page - 1) * $per_page;

        $query = DB::table('announcements as a')
            ->leftJoin('buildings as b', 'b.id', '=', 'a.building_id');

        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $query->whereRaw("(a.title Like '%" . $search_value . "%' OR a.description Like '%" . $search_value . "%')");
        }

        if ($category) {
            $query->where('a.category', $category);
        }

        if ($priority) {
            $query->where('a.priority', $priority);
        }

        $isTenant = !empty($ss->official_id) || !empty($arr['is_tenant']);
        if ($isTenant) {
            $nowStr = date('Y-m-d H:i:s');
            $query->where('a.status', 'Active');
            $query->where(function ($q) use ($nowStr) {
                $q->whereNull('a.publish_date')
                  ->orWhere('a.publish_date', '')
                  ->orWhere('a.publish_date', 'null')
                  ->orWhere('a.publish_date', 'like', '0000%')
                  ->orWhere('a.publish_date', '<=', $nowStr);
            });
            $query->where(function ($q) use ($nowStr) {
                $q->whereNull('a.expiry_date')
                  ->orWhere('a.expiry_date', '')
                  ->orWhere('a.expiry_date', 'null')
                  ->orWhere('a.expiry_date', 'like', '0000%')
                  ->orWhereRaw("DATE(a.expiry_date) >= ?", [date('Y-m-d')]);
            });
        } else {
            if ($status) {
                $query->where('a.status', $status);
            }
        }

        $orderDirection = ($sort === 'oldest') ? 'asc' : 'desc';
        $query->orderBy('a.id', $orderDirection);

        $query->selectRaw("a.id, a.title, a.description, a.category, a.priority, a.audience, a.publish_date, a.expiry_date, a.status, a.building_id, b.name as building_name");

        $clone_query = clone $query;
        $count = $clone_query->count('a.id');

        $isTenant = !empty($ss->official_id) || !empty($arr['is_tenant']);
        if ($isTenant) {
            $count = min($count, 3);
            $rows = $query->take(3)->get();
            return new LengthAwarePaginator($rows, $count, 3, 1);
        }

        $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public function announcementDetails($id)
    {
        $announcement = DB::table('announcements as a')
            ->where('a.id', $id)
            ->selectRaw("a.id, a.title, a.description, a.category, a.priority, a.audience, a.publish_date, a.expiry_date, a.status, a.building_id")
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
        $buildings = DB::table('buildings')->select('id', 'name as building')->get();
        return (object) [
            'announcement_details' => $announcement_details,
            'buildings' => $buildings
        ];
    }
}
