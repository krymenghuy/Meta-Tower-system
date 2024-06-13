<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OsCustomerPriceListNameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('os_customer_price_list_names')->insert([
            [
                'name'=>'C001',
                'branch_id'=>1,
                'kg_marker'=>'5',
                                                                            
            ],
            [
                'name'=>'C002',
                'branch_id'=>1,
                'kg_marker'=>'5'
            ]
            ]);
    }
}
