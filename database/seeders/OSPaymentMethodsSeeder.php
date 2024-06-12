<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OSPaymentMethodsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('os_payment_methods')->insert([
            [
                'name'=>'CASH',
                'category'=>'CASH'
            ],
            [
                'name'=>'NBC',
                'category'=>'National Bank of Cambodia'
            ],
            [
                'name'=>'ABA',
                'category'=>'BANK'
            ],
            [
                'name'=>'ACLEDA',
                'category'=>'BANK'
            ],
            [
                'name'=>'WING',
                'category'=>'BANK'
            ],

        ]);
    }
}
