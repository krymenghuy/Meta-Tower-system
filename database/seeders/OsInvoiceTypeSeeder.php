<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OsInvoiceTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('os_invoice_types')->insert([
            [
                'name'=>'informal',
            ],
            [
                'name'=>'commercial',
            ],
            [
                'name'=>'tax',
            ]

            ]);
    }
}
