<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class LastGcTimeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('last_gc_time')->insert([
            [
                'last_gc_time' => DB::raw('CURRENT_TIMESTAMP'),
            ]
        ]);
    }
}
