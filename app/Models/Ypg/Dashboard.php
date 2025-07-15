<?php

namespace App\Models\Ypg;

use Illuminate\Support\Facades\DB;
use DBX;
use Carbon\Carbon;

class Dashboard
{
    protected $id = null;
    protected $userInfo = null;
    function __construct($id=null,$userInfo=null){
        $this->id=$id;
        $this->userInfo =$userInfo;
    }
    public function getData($arr,$ss=null){
        $ss = $ss ?? $this->userInfo;
        return (object)[
            'members'=>self::countMember($ss),
            'graves'=>self::countGraveBySize($ss),

        ];
    }

    public static function getDashboardCards($arr, $ss) {
        $today = Carbon::today()->toDateString();
        $targetDate = Carbon::today()->addDays(90)->toDateString();


        $member_active = DB::table('members')->where('status_id', 1)->count();
        $member_inactive = DB::table('members')->where('status_id', 0)->count();
        $deceased = DB::table('deceased_registrations')->count();
        $grave_slot_avialable = DB::table('grave_slots')->where('status_id',1)->count();
        $grave_slot_reversed = DB::table('grave_slots')->where('status_id',2)->count();
        $grave_slot_used = DB::table('grave_slots')->where('status_id',3)->count();
        $task_assign = DB::table('task_assigns')->count();
        $task_type = DB::table('task_types')->count();

        $member_never_expired = DB::table('members')->where('is_expired', 0)->count();
        $member_expired_date = DB::table('members')
            ->where('is_expired', 1)
            ->whereDate('expiration_date', '<', $today)
            ->count();

        $member_near_expiry = DB::table('members')
            ->where('is_expired', 1)
            ->whereBetween('expiration_date', [$today, $targetDate])
            ->count();


        return [
            'member_active' => $member_active,
            'member_inactive' => $member_inactive,
            'deceased' => $deceased,
            'grave_slot_avialable' => $grave_slot_avialable,
            'grave_slot_reversed' => $grave_slot_reversed,
            'grave_slot_used' => $grave_slot_used,
            'member_never_expired' => $member_never_expired,
            'member_expired_date' => $member_expired_date,
            'member_near_expiry' => $member_near_expiry,
            'task_assign' => $task_assign,
            'task_type' => $task_type
        ];
    }

   public static function countMember($ss) {
    $active = 0;
    $inactive = 0;

    $rows = DB::table('members as m')
        ->join('member_statuses as s', 's.id', '=', 'm.status_id')
        ->select('s.name as status', DB::raw('COUNT(*) as count'))
        ->where('m.branch_id', $ss->branch_id)
        ->groupBy('s.name')
        ->get();

    foreach ($rows as $row) {
        switch ($row->status) {
            case 'Active':
                $active += $row->count;
                break;
            case 'Inactive':
                $inactive += $row->count;
                break;
        }
    }

    $total = $active + $inactive;

    return [
        'title' => 'Total Member',
        'total' => $total,
        'active' => $active,
        'inactive' => $inactive
    ];
}
public static function countGraveBySize($ss) {
    $sizes = ['S', 'M', 'L'];
    $results = DB::table('grave_slots')
        ->select('size', DB::raw('COUNT(*) as count'))
        ->where('branch_id', $ss->branch_id)
        ->where('status_id', 1) // 1 = used
        ->whereIn('size', $sizes)
        ->groupBy('size')
        ->get();

    $data = ['S' => 0, 'M' => 0, 'L' => 0];
    foreach ($results as $row) {
        $data[$row->size] = $row->count;
    }

    $total = array_sum($data);

    return [
        'title' => 'Graves Used: ' . $total,
        'total' => $total,
        'small' => $data['S'],
        'medium' => $data['M'],
        'large' => $data['L'],
    ];
}


    static function getMemberTasks($ss)
    {
        $labels = [];
        $values = [];
        $colors = [];
        $base_colors = ['#1d41e1', '#e1db1d'];

        $total = DB::table('members')->count();
        $member_assigned = DB::table('task_assigns')->distinct('member_id')->count('member_id');
        $member_not_assigned = $total - $member_assigned;

        $rows = [
            (object)[
                'status' => 'Member Assigned',
                'count' => $member_assigned
            ],
            (object)[
                'status' => 'Member Not Assigned',
                'count' => $member_not_assigned
            ]
        ];

        foreach ($rows as $index => $row) {
            $labels[] = $row->status;
            $values[] = $row->count;
            $colors[] = $base_colors[$index % count($base_colors)];
        }

        return (object)[
            'title' => 'Member : ' . $total,
            'labels' => $labels,
            'values' => $values,
            'colors' => $colors,
            'total' => $total,
            'member_assigned' => $member_assigned,
            'member_not_assigned' => $member_not_assigned
        ];
    }

}

