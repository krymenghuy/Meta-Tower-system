<?php

namespace App\Models\Tenant;

use App\Models\Prm\GeneralSettings;
use App\Models\Prm\Tenant as PrmTenant;
use DB;
use DBX;
use DV;
use Carbon\Carbon;

class TenantProfile
{
    protected $userInfo = null;
    protected static $img_dir = 'tenants';

    function __construct($userInfo = null)
    {
        $this->userInfo = $userInfo;
    }

    function getUserInfo()
    {
        return $this->userInfo;
    }

    function getDetails($ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        return self::details($ss);
    }

    static function details($ss)
    {
        $tenant_id = $ss->official_id ?? null;
        if (!$tenant_id) return null;

        $start_date = DBX::formatDate("c.start_date", 'start_date');
        $end_date = DBX::formatDate("c.end_date", 'end_date');
        $date_of_birth = DBX::formatDate("t.date_of_birth", 'date_of_birth');
        $lastContract = PrmTenant::liveContractSubquery();

        $row = DB::table('tenants as t')
            ->leftJoinSub($lastContract, 'lc', function ($join) {
                $join->on('lc.tenant_id', '=', 't.id');
            })
            ->leftJoin('contracts as c', 'c.id', '=', 'lc.id')
            ->leftJoin('building_spaces as bs', 'bs.id', '=', 'c.space_id')
            ->leftJoin('floors as f', 'f.id', '=', 'bs.floor_id')
            ->leftJoin('loc_countries as lc_n', 'lc_n.id', '=', 't.nationality_id')
            ->join('tenant_statuses as ts', 'ts.id', '=', 't.status_id')
            ->where('t.id', $tenant_id)
            ->selectRaw("
                t.id,t.branch_id,t.name,t.name_kh,t.code,t.national_id,t.passport_number,
                $date_of_birth,t.nationality_id,lc_n.nationality,t.photo_file_name,t.sex,t.tenant_type,
                t.status_id,ts.name as status,t.legal_name,t.phone_number,t.email,t.address,
                c.price,c.price_type,c.sqm_size,c.deposit,$start_date,$end_date,
                bs.code as space_code,c.space_id,bs.floor_id,f.name as floor_name
            ")
            ->first();

        if (!$row) return null;

        $img = self::photoUrl($ss, $row->id);
        $row->image_url = $img;
        $row->photo = $img;
        unset($row->photo_file_name);

        if ($row->price !== null) {
            $row->monthly_price = $row->price_type === 'sqm'
                ? $row->sqm_size * $row->price
                : $row->price;
            $row->monthly_price = number_format($row->monthly_price, 2);
        }

        if ($row->start_date && $row->end_date) {
            $row->lease_term = Carbon::parse($row->start_date)
                ->diffInMonths(Carbon::parse($row->end_date)) . ' ខែ';
        }

        return $row;
    }

    static function getFormOptions($ss)
    {
        return (object) [
            'tenant' => self::details($ss),
            'nationalities' => GeneralSettings::options_nationality($ss),
        ];
    }

    /** Start Save and retrieve tenant photo **/
    static function photoUrl($ss, $id = null)
    {
        $id = $id ?? ($ss->official_id ?? null);
        if (!$id) return PrmTenant::defaultPhoto($ss->subs_id ?? null);
        return PrmTenant::profilePicture($id, $ss);
    }

    function getPhotoUrl($ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        return self::photoUrl($ss);
    }

    static function savePhoto($photo_data, $ss)
    {
        $id = $ss->official_id ?? null;
        if (!$id) return DV::error('Tenant identify is not correct!');
        return PrmTenant::createProfilePicture($photo_data, null, $id, $ss);
    }

    static function deletePhoto($ss)
    {
        $id = $ss->official_id ?? null;
        if (!$id) return DV::error('Tenant identify is not correct!');
        $tenant = new PrmTenant($id, $ss);
        return $tenant->deleteProfilePicture($id, $ss);
    }
}
