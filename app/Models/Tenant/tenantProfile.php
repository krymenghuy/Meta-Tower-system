<?php

namespace App\Models\Tenant;

use App\Models\Prm\GeneralSettings;
use DBX;
use Illuminate\Support\Facades\DB;


class TenantProfile //extends Tenant
{
    public static function getDetails($id, $ss = null)
    {
        $start_date = DBX::formatDate("c.start_date", 'start_date');
        $end_date = DBX::formatDate("c.end_date", 'end_date');
        $date_of_birth = DBX::formatDate("t.date_of_birth", 'date_of_birth');
        $lastContract = static::liveContractSubquery();

        $row = DB::table('tenants as t')
            ->leftJoinSub($lastContract, 'lc', function ($join) {
                $join->on('lc.tenant_id', '=', 't.id');
            })
            ->leftJoin('contracts as c', 'c.id', '=', 'lc.id')
            ->leftJoin('building_spaces as bs', 'bs.id', '=', 'c.space_id')
            ->join('tenant_statuses as ts', 'ts.id', '=', 't.status_id')
            ->where('t.id', $id)
            ->selectRaw(
                "t.id,t.name,t.code,t.national_id,passport_number,"
                . "$date_of_birth,t.nationality_id,t.photo_file_name,t.sex,t.tenant_type,"
                . "t.status_id,ts.name as status,t.legal_name,t.phone_number,t.email,t.address,"
                . "c.price,c.price_type,c.sqm_size,$start_date,$end_date,bs.code as space_code"
            )
            ->first();

        if ($row) {
            $img = static::profilePicture($id, $ss);
            $row->image_url = $img;
            $row->photo = $img;
            return $row;
        }

        return null;
    }

    public static function getFormOptions($id, $ss)
    {
        $details = $id ? static::getDetails($id, $ss) : null;

        return (object) [
            'tenant' => $details,
            'nationalities' => GeneralSettings::options_nationality($ss),
            'statuses' => GeneralSettings::options_tenant_status($ss),
        ];
    }
}
