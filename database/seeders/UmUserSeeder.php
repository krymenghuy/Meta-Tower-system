<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UmUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $hashed_password = Hash::make('123456');
        DB::table('um_users')->insert([
            [

            'login_name'=>'admin@gmail.com',
            'phone_number'=>'01257890',
            'email'=>'',
            'hpwd'=>$hashed_password,
            'app_id'=>'DFB15FKAEEC611EG2E7C9801A7CXD1HK',
            'branch_id'=>'1',
            'previlege_type'=>'standard',
            'is_locked'=>'0',
            'status'=>'active',
            'full_name'=>'Admin',
            'user_class'=>'admin',
            'um_remarks'=>'0',
            'create_user'=>'admin@gmail.com'

            ]
        ]);

        
    }
}
