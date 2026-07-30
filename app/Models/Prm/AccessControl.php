<?php

namespace App\Models\Prm;

use App\Models\Prm\GeneralSettings;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DV;
use DBX;
use Vsd\Vsloquent\VSModel;

class AccessControl extends VSModel
{
    protected $table    = 'access_cards';
    protected $userInfo = null;
    protected static $img_dir = 'access_controls';

    public function __construct($id = null, $userInfo = null)
    {
        $this->id       = $id;
        $this->userInfo = $userInfo;
    }

    public function saveAccessCard($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id ?? null;
        $created = !$id;

        $category = $arr['category'] ?? 'internal';

        // 1. Adjust Validation & Payload according to Category
        if ($category === 'external') {
            if (empty(trim($arr['holder_name'] ?? ''))) {
                return DV::error('holder_required');
            }
            $arr['holder_id'] = null; // Clear holder_id for external
        } else {
            if (empty($arr['holder_id'])) {
                return DV::error('holder_required');
            }
            $arr['holder_name'] = null; // Clear holder_name for internal
        }

        $v_rule = [
            'code'        => '0|string|0-50',
            'type'        => '1|string|1-50|text=card_type_required',
            'category'    => '1|choice|internal,external',
            'holder_id'   => '0|number',
            'holder_name' => '0|string|0-150',
            'space_id'    => '1|number|text=space_required',
            'expire_date' => '1|date',
            'status'      => '0|choice|active,inactive,draft',
        ];

        $res = DBX::validateObject($arr, $v_rule, 1, [], $ss->lang ?? 'en', 0, null);

        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $inputs['branch_id'] = $branch_id;

        if (empty($inputs['status'])) {
            $inputs['status'] = 'active';
        }

        DB::beginTransaction();
        try {
            $saved_id = DBX::saveData($ss, 'access_cards', ['id' => $id], $inputs, [], 1);
            if (!$saved_id) {
                DB::rollBack();
                return DV::error('create_failed');
            }

            if ($created && empty($inputs['code'])) {
                $codeRes = setOfficialCode($branch_id, 'access_cards_code_control', 'access_cards', ['id' => $saved_id], 'AC', 5, null);
                if (!$codeRes || !isset($codeRes->status) || $codeRes->status !== 'OK') {
                    DB::rollBack();
                    return DV::error('code_generation_failed');
                }
            }

            DB::commit();

            return DV::depends(1, [
                'access_card' => DB::table('access_cards')->where('id', $saved_id)->first(),
                'id'          => $saved_id
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return DV::error('Failed to save access card: ' . $e->getMessage());
        }
    }

    public function getListAccessCard($arr = [], $ss = null)
    {
        $d = (object) $arr;

        $search_value = $d->search_value ?? $d->search_term ?? null;
        $current_page = (int) ($d->current_page ?? 1);
        $per_page     = (int) ($d->per_page ?? 10);

        if ($current_page < 1 || $per_page < 1) {
            return null;
        }

        $skip_rows = ($current_page - 1) * $per_page;

        $query = DB::table('access_cards as ac')
            ->leftJoin('tenants as t', 't.id', '=', 'ac.holder_id')
            ->leftJoin('employees as e', 'e.id', '=', 'ac.holder_id')
            ->leftJoin('team_member as tm', 'tm.id', '=', 'ac.holder_id')
            ->leftJoin('building_spaces as bs', 'bs.id', '=', 'ac.space_id')
            ->leftJoin('floors as f', 'f.id', '=', 'bs.floor_id')
            ->select([
                'ac.id',
                'ac.code',
                'ac.type',
                'ac.category',
                'ac.holder_id',
                'ac.space_id',
                'ac.expire_date',
                'ac.status',
                'ac.created_at',
                'ac.updated_at',
                'ac.update_user',
                'bs.code as unit_code',
                'f.name as floor_name',
                DB::raw("COALESCE(NULLIF(ac.holder_name, ''), t.name, e.name, tm.name, '') as holder_name")
            ]);

        // Specific field filters
        if (!empty($d->status)) {
            $query->where('ac.status', $d->status);
        }

        if (!empty($d->building_id)) {
            $query->where('ac.unit', $d->building_id);
        }

        if (!empty($d->floor_id)) {
            $query->where('ac.floor', $d->floor_id);
        }

        // Search Filter
        if (!empty($search_value)) {
            $skip_rows = 0;
            $search = '%' . trim($search_value) . '%';

            $query->where(function ($q) use ($search) {
                $q->where('ac.code', 'like', $search)
                    ->orWhere('ac.type', 'like', $search)
                    ->orWhere('ac.holder_name', 'like', $search)
                    ->orWhere('t.name', 'like', $search)
                    ->orWhere('e.name', 'like', $search)
                    ->orWhere('tm.name', 'like', $search);
            });
        }

        $count = (clone $query)->distinct('ac.id')->count('ac.id');

        $rows = $query
            ->orderByDesc('ac.id')
            ->skip($skip_rows)
            ->take($per_page)
            ->get();

        foreach ($rows as $row) {
            setOfficialDates(
                $row,
                ['expire_date'],
                ['updated_at', 'created_at'],
                []
            );
        }

        return new LengthAwarePaginator(
            $rows,
            $count,
            $per_page,
            $current_page
        );
    }

    public function getFormOptions($arr = [], $ss = null)
    {
        $ss = $ss ? $ss : $this->userInfo;
        $d = (object) $arr;
        $id = $d->id ?? null;

        $access_card = null;
        if ($id) {
            $access_card = DB::table('access_cards as ac')
                ->leftJoin('tenants as t', 't.id', '=', 'ac.holder_id')
                ->leftJoin('employees as e', 'e.id', '=', 'ac.holder_id')
                ->leftJoin('team_member as tm', 'tm.id', '=', 'ac.holder_id')
                ->select([
                    'ac.*',
                    DB::raw("COALESCE(NULLIF(ac.holder_name, ''), t.name, e.name, tm.name, '') as holder_name")
                ])
                ->where('ac.id', $id)
                ->first();

            if ($access_card) {
                setOfficialDates($access_card, ['expire_date'], [], []);
            }
        }

        return (object) [
            'access_card' => $access_card,
            'building_spaces' => GeneralSettings::options_building_space_for_access_card($ss),
        ];
    }




    public function searchCardHolder($arr = [], $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $d = (object) $arr;

        $rawSearch = trim(strtolower($d->search ?? ''));

        if (empty($rawSearch)) {
            return [];
        }

        $branch_id = $ss->branch_id ?? null;
        $isEmp = str_starts_with($rawSearch, 'e-') ;
        $isTenant = str_starts_with($rawSearch, 't-') ;
        $isMember = str_starts_with($rawSearch, 'm-') ;

        $search = preg_replace('/^(emp-|e-|t-|m-)/i', '', $rawSearch);

        if (!$isEmp && !$isTenant && !$isMember) {
            $search = $rawSearch;
        }

        $results = collect();

        // Reusable query closure to keep code DRY
        $buildQuery = function ($table, $holderType) use ($branch_id, $search) {
            return DB::table($table)
                ->where('branch_id', $branch_id)
                ->where(function ($q) use ($search) {
                    $q->where('code', 'like', '%' . $search . '%')
                    ->orWhere('name', 'like', '%' . $search . '%')
                    ->orWhere('phone_number', 'like', '%' . $search . '%');
                })
                ->select('id', 'code', 'name', DB::raw("'{$holderType}' as holder_type"))
                ->limit(20)
                ->get();
        };

        // 3. Conditional execution based on prefix
        if ($isEmp || (!$isTenant && !$isMember)) {
            $results = $results->merge($buildQuery('employees', 'Employee'));
        }

        if ($isTenant || (!$isEmp && !$isMember)) {
            $results = $results->merge($buildQuery('tenants', 'Tenant'));
        }

        if ($isMember || (!$isEmp && !$isTenant)) {
            $results = $results->merge($buildQuery('team_member', 'Team Member'));
        }

        return $results;
    }

    public function deleteCard($id=null)
    {
        if (!is_numeric($id) || $id <= 0) {
            return DV::error('Invalid ID');
        }

        $deleted = DB::table('access_cards')->where('id', $id)->delete();

        if ($deleted) {
            return DV::depends(1, ['id' => $id]);
        }

        return DV::error('Failed to delete access card');
    }

    public function updateStatusCard($status, $id = null, $ss = null)
    {   
        $ss = $ss ?? $this->userInfo;
        $id = $id ?? $this->id;

        // 2. Validate Status enum values
        $allowedStatuses = ['active', 'inactive'];
        if (empty($status) || !in_array($status, $allowedStatuses, true)) {
            return DV::error('invalid_status');
        }

        // 3. Check existing card and current status
        $card = DB::table('access_cards')->where('id', $id)->first(['id', 'status']);
        if (!$card) {
            return DV::error('card_not_found');
        }

        if ($card->status === $status) {
            return DV::error('status_already_set');
        }

        try {
            $updated = DB::table('access_cards')
                ->where('id', $id)
                ->update([
                    'status'      => $status,
                    'update_user' => $ss->full_name ?? $ss->user_name ?? 'System',
                    'updated_at'  => getNowTime(),
                ]);

            if ($updated) {
                return DV::depends(1, [
                    'id'     => $id,
                    'status' => $status
                ]);
            }

            return DV::error('update_failed');
        } catch (\Exception $e) {
            return DV::error('Failed to update status: ' . $e->getMessage());
        }
    }

}