<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class SenderBusinessTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('sender_business_types')->insert([
            [
                'business_type'=>'Cosmetics'
            ],
            [
                'business_type'=>'Food and Suplements'
            ],
            [
                'business_type'=>'Fashion and Clothing'
            ],
            [
                'business_type'=>'Foods and Beverage'
            ],
            [
                'business_type'=>'Electronics'
            ],
            [
                'business_type'=>'Phone and Accessories'
            ],
            [
                'business_type'=>'etc...'
            ]


        ]);
    }
}
