<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class testingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('testing')->insert([
            'name'=>'First test',
            'description'=>'About test',
            'brand'=>'LV',
            'price'=>'10',
            'discount'=>'50'

            
        ]);
    }
}
