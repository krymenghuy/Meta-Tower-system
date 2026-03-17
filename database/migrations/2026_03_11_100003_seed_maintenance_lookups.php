<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class SeedMaintenanceLookups extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (DB::table('maintenance_types')->count() === 0) {
            DB::table('maintenance_types')->insert([
                ['name' => 'Preventive', 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'Corrective', 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'Emergency', 'created_at' => now(), 'updated_at' => now()],
            ]);
        }
        if (DB::table('maintenance_statuses')->count() === 0) {
            DB::table('maintenance_statuses')->insert([
                ['name' => 'Pending', 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'In Progress', 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'Completed', 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'Cancelled', 'created_at' => now(), 'updated_at' => now()],
            ]);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::table('maintenance_statuses')->truncate();
        DB::table('maintenance_types')->truncate();
    }
}
