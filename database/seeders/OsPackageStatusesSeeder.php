<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OsPackageStatusesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('os_package_statuses')->insert([
            [
                'name'=>'Available For Pickup',
            ],
            [
                'name'=>'Picked',
            ],
            [
                'name'=>'Arrived Warehouse',
            ],
            [
                'name'=>'Shipping',
            ],
            [
                'name'=>'Delivered',
            ]
            ]);
    }
}
