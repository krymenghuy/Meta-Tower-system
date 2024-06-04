<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class OsContactPersonTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('os_contact_person_types')->insert([
            [
                'name'=>'primary',
            ],
            [
                'name'=>'secondary',
            ]

        ]);
    }
}
