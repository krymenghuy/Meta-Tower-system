<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class LocCountriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('loc_countries')->insert([
            [
                'name'=>'CAMBODIA',
                'name_kh'=>'កម្ពុជា',
                'code'=>'CAM',
                'standard_zone'=>1,
                'branch_id'=>1
            ]

        ]);
    }
}
