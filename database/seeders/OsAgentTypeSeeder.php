<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class OsAgentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('os_agent_types')->insert([
            [
                'name'=>'client_affiliate',
            ],
            [
                'name'=>'freelancer',
            ],
            
            [
                'name'=>'full_time',
            ]

        ]);

    }
}
