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
                'name_kh'=>'ប្រទេសកម្ពុជា',
                'code'=>'CAM',
                'standard_zone'=>1,
                'branch_id'=>1
            ],
            [
                'name'=>'SINGAPORE',
                'name_kh'=>'ប្រទេសសិង្ហបុរី',
                'code'=>'SGP',
                'standard_zone'=>2,
                'branch_id'=>1
                
            ],
            [
                'name'=>'FRANCE',
                'name_kh'=>'ប្រទេសបារំាង',
                'code'=>'FR',
                'standard_zone'=>3,
                'branch_id'=>1
            ],
            [
                'name'=>'ENGLAND',
                'name_kh'=>'ប្រទេសអង់គ្លេស',
                'code'=>'ENG',
                'standard_zone'=>4,
                'branch_id'=>1
            ]

        ]);
    }
}
