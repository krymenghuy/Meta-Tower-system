<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class SenderCodeControlSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('sender_code_control')->insert([
            [
                'branch_id'=>1,
                'prefix'=>'HM',
                'last_id'=>1
            ]
            ]);
    }
}
