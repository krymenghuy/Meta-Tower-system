<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OsSaleAgentStatusesSeeder extends Seeder
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
            'name'=>'Active',
            'code'=>'Active',

           ], 
           [
            'name'=>'Inactive',
            'code'=>'Inactive',
           ]
        ]);
    }
}
