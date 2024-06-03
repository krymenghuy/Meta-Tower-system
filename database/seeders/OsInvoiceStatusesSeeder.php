<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OsInvoiceStatusesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('os_invoice_statuses')->insert([
            [
                'name'=>'paid',
                
            ],
            [
                'name'=>'unpaid',
            ]
            ]);
    }
}
