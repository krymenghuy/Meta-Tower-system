<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class OsShipmentStatusesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('os_shipment_statuses')->insert([
            [
                'name'=>'Pending',
                'code'=>'Pending',
            ],
            [
                'name'=>'Shipping',
                'code'=>'Shipping',
            ],
            [
                'name'=>'Validated',
                'code'=>'Validated'
            ],
            [
                'name'=>'Create Invoice',
                'code'=>'Create Invoice'
            ]
            
        ]);
    }
}
