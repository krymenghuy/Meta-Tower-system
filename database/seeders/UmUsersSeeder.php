<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UmUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('um_users')->insert([
            [
            'login_name'=>'admin@gmail.com',
            'phone_number'=>'0712126288',
            'email'=>'admin@gmail.com',
            'full_name'=>'Mengchhorng',
            'user_class'=>'admin',
            'last_login_date'=>now(),
            'subs_id'=>null,
            'official_id'=>1,
            'app_id'=>38,
            'branch_id'=>1,
            'official_code'=>'HA100019',
            ],
          
        ]);
        
    }
}
