<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();

        $this->call([
            testingSeeder::class,
        ]);
        $this->call([
            UmUserSeeder::class,
        ]);
        $this->call([
            OsAgentTypeSeeder::class,
        ]);
        $this->call([
            OsContactPersonTypeSeeder::class,
        ]);
        $this->call([
            OsPackageStatusesSeeder::class,

        ]);
        $this->call([
            SenderStatusesSeeder::class,
        ]);
        $this->call([
            SenderTypeSeeder::class,

        ]);
    }
}
