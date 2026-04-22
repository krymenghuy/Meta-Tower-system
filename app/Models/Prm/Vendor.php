<?php

namespace App\Models\Prm;
use App\Models\Prm\GeneralSettings;
use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use XPublicStorage;


class Vendor //extends Model
{

    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'vendors';
    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;

    }

    public function saveVendor($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $v_rule = [
            'name' => '1|string|1-150',
            'phone_number' => '1|string|0-50',
            'email' => '0|string|0-100',
            'address' => '1|string|0-255',
            'contact_person' => '1|string|0-100',
            'contact_phone' => '1|string|0-25',
            'vendor_type_id' => '1|number|exists=vendor_types.id',
            'category_id' => '1|number|exists=vendor_categories.id',
            'tax_number' => '0|string|0-30',
        ];

        $email_char = ['@', '.', '-', '_'];
        $tax_char = ['@', '.', '-', '_'];
        $address_char = ['@', ',', '.', '#'];

        $res = DBX::validateObject($arr, $v_rule, 1, ['email' => $email_char, 'tax_number' => $tax_char, 'address' => $address_char], $ss->lang, 0, null);
        if ($res->error)
            return DV::error($res->error);

        $inputs = $res->values;
        $exist = DB::table('vendors')
            ->whereRaw('LOWER(name)=?', [strtolower($inputs['name'])])
            ->when($id, function ($q) use ($id) {
                $q->where('id', '<>', $id);
            })
            ->exists();

        if ($exist)
            return DV::error('Vendor name already exists!');

        $id = DBX::saveData($ss, 'vendors', ['id' => $id], $inputs, [], 1);

        if ($id > 0) {
            return DV::depends(1, ['vendors' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving vendor!');
    }


    public function getListPaginate($arr = [], $ss = null)
    {
        $d = (object) $arr;
        $search_value = $d->search_value ?? null;
        $type_id = $d->vendor_type_id ?? null;
        $category_id = $d->category_id ?? null;
        $status_id = $d->status_id ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page) || !is_numeric($per_page)) {
            return null;
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $str_search = "1=1";
        $str_moreWhere = "2=2";
        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(v.name Like '%" . $search_value . "%' OR v.phone_number Like '%" . $search_value . "%' OR v.contact_person Like '%" . $search_value . "%')";
        }
        if ($type_id) {
            $str_moreWhere .= ' AND v.vendor_type_id =' . $type_id;
        }
        if ($status_id) {
            $str_moreWhere .= ' AND v.status_id =' . $status_id;
        }
         if ($category_id) {
            $str_moreWhere .= ' AND v.category_id =' . $category_id;
        }
        $updated_at = DBX::formatTime('v.updated_at', 'updated_at');


        $query = DB::table('vendors as v')
            ->join('vendor_types as vt', 'vt.id', 'v.vendor_type_id')
            ->join('vendor_categories as vc', 'vc.id', 'v.category_id')
            ->join('vendor_statuses as s', 's.id', 'v.status_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw("v.id, v.name, v.phone_number, v.email, v.address, v.contact_person,v.contact_phone,v.status_id, vt.name as type,vc.code,vc.name as category,v.tax_number,s.name as status,v.update_user,$updated_at")
            ->orderBy('v.id', 'desc');
        $clone_query = clone $query;
        $count = $clone_query->count('v.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);


    }
    public static function vendorDetails($id, $ss = null)
    {
        return DB::table('vendors as v')
            ->where('v.id', $id)
            ->selectRaw('v.id, v.name, v.phone_number, v.email, v.address, v.contact_person,v.contact_phone,v.vendor_type_id,v.category_id,v.tax_number,v.status_id')
            ->first();
    }
    public static function getFormOptions($id = null, $ss = null)
    {
        $vendor_details = $id ? self::vendorDetails($id, $ss) : null;
        return (object) [
            'vendor_details' => $vendor_details,
            'types' => GeneralSettings::options_vendor_types($ss),
            'categories' => GeneralSettings::options_vendor_categories($ss),
            'statuses' => GeneralSettings::options_vendor_statuses($ss),
        ];
    }

    public function deleteVendor($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $vendor = DB::table('vendors')->select('id', 'status_id')->where('id', $id)->first();
        if (!$vendor) {
            return DV::error('Vendor not found.');
        }
        if ($vendor->status_id == 1) {
            return DV::error('Cannot delete active vendor.');
        }
        $deleted = DB::table('vendors')->where('id', $id)->delete();
        return $deleted
            ? DV::depends($deleted, ['action' => 'deleted'])
            : DV::error('Delete failed.');
    }
    public function getVendorInfo($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $vendor = DB::table('vendors')
            ->where('id', $id)
            ->select('id', 'name', 'code', 'tax_number', 'address', 'phone_number')->first();
        // $spaces = $this->getActiveSpaces($id,$ss);
        return (object) [
            'vendor' => $vendor,
            // 'spaces'=>$spaces
        ];
    }
    function updateVendorStatus($status_id, $id = null, $ss = null)
    {
        $ss = $ss ? $ss : $this->userInfo;
        $currentStatus = DB::table('vendors')->where('id', $id)->value('status_id');
        if ($currentStatus == $status_id) {
            return DV::error('It is the same current status.');
        }
        $x = DB::table('vendors')->where('id', $id)->update([
            'status_id' => $status_id,
            'update_user' => $ss->full_name,
            'updated_at' => getNowTime(),
        ]);
        return DV::depends($x, ['Vendor status', 'updated']);
    }

}
