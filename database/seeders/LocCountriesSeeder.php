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
        DB::table('loc_counties')->insert([
            [
                'name'=>'CAMBODIA',
                'name_kh'=>'ប្រទេសកម្ពុជា',
                'code'=>'CAM',
                'standard_zone'=>1
            ],
            [
                'name'=>'SINGAPORE',
                'name_kh'=>'ប្រទេសសិង្ហបុរី',
                'code'=>'SGP',
                'standard_zone'=>2
            ],
            [
                'name'=>'ICELAND',
                'name_kh'=>'ប្រទេសអៀកឡុង',
                'code'=>'ICL',
                'standard_zone'=>3
            ],
            [
                'name'=>'AUSTRALIA',
                'name_kh'=>'ប្រទេសអ៊ូស្តា្រលី',
                'code'=>'AUS',
                'standard_zone'=>4
            ],
            [
                'name'=>'FRANCE',
                'name_kh'=>'ប្រទេសបារំាង',
                'code'=>'FRA',
                'standard_zone'=>5
            ],
        ]);
    }
}
