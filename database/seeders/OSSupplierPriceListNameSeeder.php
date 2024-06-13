<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OSSupplierPriceListNameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('os_supplier_price_list_names')->insert([
            [
                'name'=>'S001',
                'branch_id'=>1,
                'kg_marker'=>'5',
                                                                            
            ],
            [
                'name'=>'S002',
                'branch_id'=>1,
                'kg_marker'=>'5'
            ]
            ]);
    }
}
