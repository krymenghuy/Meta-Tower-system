<?php

namespace App\Models\Ypg;

use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use XPublicStorage;

class GraveSlot
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'grave_slots';
    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function save($arr, $id = null)
    {
        $id = $id ?? $this->id;
        $ss = $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'slot_number' => '1|string|0-20',
            'deceased_name' => '1|string|0-100',
            'size' => '1|choice|S,M,L',
            'recommender_id' => '1|number|exists=members.id',
            'photo'=> '0|image',
            'location_note'=>'0|string|0-250',
            'status_id' => '1|number|default = 1',

        ];

        $res = DBX::validateObject($arr, $v_rule, true, ['photo'=>GeneralSettings::$image_chars,'slot_number' => GeneralSettings::$address_map_chars], $ss->lang, false);
        if($res->error) return DV::error($res->error);

        $inputs = $res->values;
        $d = (object)$inputs;
        $photo = $d->photo ?? null;
        unset($inputs['photo']);
        $delete_prev_image = ($id > 0 && (!$photo || isImage($photo)));
        if(!$id){
            $checkUnque = DB::table('grave_slots')->where('slot_number',$inputs['slot_number'])->exists();
            if ($checkUnque) {
                return DV::error('This Grave Slot already exists.');
            }
        }
        $id = DBX::saveData($ss, 'grave_slots', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            if ($delete_prev_image) {
            $file_name = DB::table('grave_slots')->where('id', $id)->take(1)->value('file_name');
            if ($file_name) {
                XPublicStorage::delete(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], 'images', $file_name);
            }
            DB::table('grave_slots')->where('id', $id)->update(['file_name' => null]);
            }
            XPublicStorage::saveImage(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], null, $photo, null, ['id' => $id, 'store' => 'grave_slots.file_name']);
            return DV::depends(1, ['grave_slots' => $inputs, 'id' => $id]);
        }
        return DV::error('Error saving grave slot');
    }

    public function getList($arr, $ss = null)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $search_value = $d->search_value ?? null;
        $status_id = $d->status_id ?? null;


        $str_search = '1=1';
        $str_moreWhere = '1=1';

        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(gs.deceased_name LIKE '%" . $search_value . "%' OR gs.slot_number LIKE '%" . $search_value . "%')";
        }
        if($status_id){
            $str_moreWhere .= ' AND gs.status_id =\'' . $status_id . '\'';
        }
        $updated_at = DBX::formatTime('gs.updated_at','updated_at');
        $query = DB::table('grave_slots as gs')
            ->join('members as m','m.id','=','gs.recommender_id')
            ->join('grave_statuses as s', 's.id', '=', 'gs.status_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw('gs.id,gs.slot_number,gs.deceased_name,gs.file_name,gs.size,gs.recommender_id,m.name as recommender,'.$updated_at.',gs.update_user,gs.file_name,gs.location_note,gs.status_id,s.name AS status')
            ->orderBy('gs.id', 'DESC');



        $clone_query = clone $query;
        $count = $clone_query->count('gs.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

     foreach ($rows as $row) {
            $row->image_url = '';
            if ($row->file_name) {
                $row->image_url = self::profilePicture($row->id,$ss);
            }
            unset($row->file_name);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public function getDetails($id, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $row = DB::table('grave_slots as gs')
            ->join('grave_statuses as s', 's.id', '=', 'gs.status_id')
            ->where('gs.id', $id)
            ->selectRaw('gs.id,gs.slot_number,gs.size,gs.recommender_id,gs.file_name,gs.deceased_name,gs.location_note,gs.status_id,s.name AS status')
            ->first();
            if($row){
                $img = self::profilePicture($id,$ss);
                $row->image_url = $img;
                $row->photo = $img;
            } else $row = null;

     
        return $row;
    }

    public function getFormOptions($id,$ss)
    {
        $subs_id = $ss->subs_id;
        $grave_slot = self::getDetails($id) ?? null;

        return (object) [
            'grave_slot' => $grave_slot,
            'statuses' => GeneralSettings::options_grave_status($ss),
            'recommenders' => GeneralSettings::options_member($ss),
        ];
    }

    public function delete($id)
    {
        $id = $id ?? $this->id;
        if (empty($id)) {
            return DV::error('Invalid ID');
        }
        $res = DB::table('grave_slots')->where('id', $id)->delete();
        if ($res) {
            return DV::depends(1, ['id' => $id]);
        }
        return DV::error('Error deleting grave slot');
    }

    function updateStatus($status_id, $id = null, $ss = null)
    {
        $ss = $ss ? $ss : $this->userInfo;

        $currentStatus = DB::table('grave_slots')->where('id', $id)->value('status_id');

        if ($currentStatus == $status_id) {
            return DV::error('It is the same current status');
        }

        $x = DB::table('grave_slots')->where('id', $id)->update([
            'status_id'   => $status_id,
            'update_user' => $ss->full_name,
            'update_date' => getNowTime(),
            'update_uid'  => $ss->user_id
        ]);

        return DV::depends($x, ['grave slot status', 'updated']);
    }
    static function savePhoto($photo_data,$file_type = null, $id = null, $ss = null){
        $id = $id ?? $id;
        $ss = $ss ?? $ss;
        $col_subs_id = DBX::getHex('gs.subs_id', 'subs_id');
        $grave = DB::table('grave_slots as gs')->where('gs.id', $id)->selectRaw($col_subs_id . ',gs.id,gs.branch_id,gs.file_name')->first();
        $delete_image = (!$photo_data || isImage($photo_data));
        if (!$grave) {
            return DV::error('Grave identity is not correct!');
        }
        if ($delete_image) {
            XPublicStorage::delete(['subs_id' => $ss->subs_id, 'dir' => self::$img_dir], 'image', $grave->file_name);
            DB::table('grave_slots')->where('id', $id)->update(['file_name' => null]);
        }
        $res = XPublicStorage::saveImage(['subs_id' => $ss->subs_id, 'dir' => self::$img_dir], null, $photo_data, null, ['id' => $id, 'store' => 'grave_slots.file_name']);
        if($res->status ==='Error') return $res;
        $img = self::profilePicture($id,$ss);
        return DV::depends(1,['image_url'=>$img]);

    }
    function deletePhoto($id = null, $ss = null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $grave = DB::table('grave_slots as gs')->where('id', $id)->selectRaw('id,file_name')->first();
        if (!$grave) return DV::error('Grave identity is not correct!');
        XPublicStorage::delete(['subs_id' => $ss->subs_id, 'dir' => self::$img_dir], 'image', $grave->file_name);
        DB::table('grave_slots')->where('id', $id)->update(['file_name' => null]);
        return DV::success();
    }
    static function profilePicture($id,$ss)
    {
        $col_subs_id = DBX::getHex('gs.subs_id', 'subs_id');
        $row = DB::table('grave_slots as gs')->where('gs.id', $id)->selectRaw($col_subs_id . ',gs.branch_id,gs.file_name')->first();
        $def_image = self::defaultPhoto($row ? $row->subs_id : null);
        $url = '';
        if ($row) {
            $url = XPublicStorage::getUrl(['subs_id' => $row->subs_id, 'dir' => self::$img_dir], 'images') . $row->file_name;
            return validateUrl($url, $def_image);
        } else return $def_image;
    }
    static function defaultPhoto($subs_id)
    {
        return url('') . '/assets/images/yavpheng/grave_default.jpg';
    }

}
