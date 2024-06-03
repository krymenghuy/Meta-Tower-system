<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OSContactPersonStatusesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('os_contact_person_statuses')->insert([
            [ 
                'name'=>'Active',
                'code'=>'Active'
            ],
            [
                'name'=>'Inactive',
                'code'=>'Inactive'
            ]

        ]);
    }
}
