<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SalesAgentsStatusesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('os_sales_agents_statuses')->insert([
            [ 
                'code'=>'Active',
                'name'=>'Active'
            ],
            [
                'code'=>'Inactive',
                'name'=>'Inactive'
            ]
            ]);
    }
}
