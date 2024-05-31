<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SenderStatusesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('sender_statuses')->insert([
            [
                'code'=>'Active',
                'name'=>'Active',
            ],
            [
                'code'=>'Inactive',
                'name'=>'Inactive',
                
            ]
        ]);
    }
}
