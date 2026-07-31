<?php

namespace App\Models\Prm;

use App\Models\Prm\GeneralSettings;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DV;
use DBX;
use Vsd\Vsloquent\VSModel;

class AccessLog extends VSModel
{
    protected $table    = 'access_logs';
    protected $userInfo = null;
    protected static $img_dir = 'access_logs';

    public function __construct($id = null, $userInfo = null)
    {
        $this->id       = $id;
        $this->userInfo = $userInfo;
    }

    public function saveAccessLog($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id ?? null;

        // Validation rules matching table schema
        $v_rule = [
            'card_id'   => '1|number|text=card_id_required',
            'status_id' => '0|choice|accessed,denied',
        ];

        $res = DBX::validateObject($arr, $v_rule, 1, [], $ss->lang ?? 'en', 0, null);

        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $inputs['branch_id'] = $branch_id;

        // Set default status to 'accessed' if not provided
        if (empty($inputs['status_id'])) {
            $inputs['status_id'] = 'accessed';
        }

        DB::beginTransaction();
        try {
            $saved_id = DBX::saveData($ss, 'access_logs', ['id' => $id], $inputs, [], 1);
            
            if (!$saved_id) {
                DB::rollBack();
                return DV::error('create_failed');
            }

            DB::commit();

            return DV::depends(1, [
                'access_logs' => DB::table('access_logs')->where('id', $saved_id)->first(),
                'id'          => $saved_id
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return DV::error('Failed to save access log: ' . $e->getMessage());
        }
    }

    public function getListAccessLog($arr = [], $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $d = (object) $arr;

        $search_value = $d->search_value ?? $d->search_term ?? null;
        $current_page = (int) ($d->current_page ?? 1);
        $per_page     = (int) ($d->per_page ?? 10);

        if ($current_page < 1 || $per_page < 1) {
            return null;
        }
        $logStatusFilter = $d->status_id ?? $d->status ?? null;



        $skip_rows = ($current_page - 1) * $per_page;

        $query = DB::table('access_logs as al')
            ->join('access_cards as ac', 'al.card_id', '=', 'ac.id')
            ->leftJoin('building_spaces as bs', 'bs.id', '=', 'ac.space_id')
            ->leftJoin('tenants as t', function ($join) {
                $join->on('ac.holder_id', '=', 't.id')
                     ->where('ac.type', '=', 'tenant');
            })
            ->leftJoin('employees as e', function ($join) {
                $join->on('ac.holder_id', '=', 'e.id')
                     ->where('ac.type', '=', 'employee');
            })
            ->leftJoin('team_member as tm', function ($join) {
                $join->on('ac.holder_id', '=', 'tm.id')
                     ->where('ac.type', '=', 'team_member');
            })
            ->select([
                'al.id',
                'al.card_id',
                'al.status_id as log_status', // 'accessed' or 'denied'
                'al.created_at as log_at',
                'ac.code',
                'ac.type',
                'ac.category',
                'ac.holder_id',
                'ac.space_id',
                'ac.expire_date',
                'ac.status as card_status', // 'active' or 'inactive'
                'ac.created_at',
                'ac.updated_at',
                'ac.update_user',
                'bs.code as unit_code',
                DB::raw("COALESCE(NULLIF(ac.holder_name, ''), t.name, e.name, tm.name, '') as holder_name")
            ]);

        // Filter by branch
        if (!empty($ss->branch_id)) {
            $query->where('al.branch_id', $ss->branch_id);
        }

        // Filter by Log Status ('accessed' or 'denied')
        if (!empty($logStatusFilter)) {
            $query->where('al.status_id', $logStatusFilter);
        }

        // Filter by Card Status ('active' or 'inactive')
        if (!empty($d->card_status)) {
            $query->where('ac.status', $d->card_status);
        }

        // Filter by Card Category ('internal' or 'external')
        if (!empty($d->category)) {
            $query->where('ac.category', $d->category);
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

        $count = (clone $query)->count('al.id');

        $rows = $query
            ->orderByDesc('al.id')
            ->skip($skip_rows)
            ->take($per_page)
            ->get();

        foreach ($rows as $row) {
            setOfficialDates(
                $row,
                ['expire_date'],
                ['updated_at', 'created_at', 'log_at'],
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
                ->leftJoin('tenants as t', function ($join) {
                    $join->on('ac.holder_id', '=', 't.id')
                         ->where('ac.type', '=', 'tenant');
                })
                ->leftJoin('employees as e', function ($join) {
                    $join->on('ac.holder_id', '=', 'e.id')
                         ->where('ac.type', '=', 'employee');
                })
                ->leftJoin('team_member as tm', function ($join) {
                    $join->on('ac.holder_id', '=', 'tm.id')
                         ->where('ac.type', '=', 'team_member');
                })
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

}