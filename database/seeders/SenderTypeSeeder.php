<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SenderTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('sender_type')->insert([
            [
                'branch_id'=>'1',
                'name'=>'VIP',
            ],
            [
                'branch_id'=>'1',
                'name'=>'Normal',
            ]
            ]);
    }
}
