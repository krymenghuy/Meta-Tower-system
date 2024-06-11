<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
class OSCurrencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $adminUserId = DB::table('um_users')->where('login_name', 'admin@example.com')->value('id');
        DB::table('os_currency')->insert([
            [
                'branch_id' => 1,
                'code' => 'USD',
                'name' => 'American Dollar',
                'symbol' => '$',
                'symbol_after' => 0,
                'decimal_point' => 2,
                'created_at' => Carbon::now(),
                'updated_at' => null,
                'create_user' => $adminUserId,
                'update_user' => null,
                'create_uid' => $adminUserId,
                'update_uid' => null,
                'decimal_points' => 2,
            ],
            [
                'branch_id' => 1,
                'code' => 'KHR',
                'name' => 'Khmer Riel',
                'symbol' => '៛',
                'symbol_after' => 0,
                'decimal_point' => 2,
                'created_at' => Carbon::now(),
                'updated_at' => null,
                'create_user' => $adminUserId,
                'update_user' => null,
                'create_uid' => $adminUserId,
                'update_uid' => null,
                'decimal_points' => 2,
            ]
        ]);
    }
}
