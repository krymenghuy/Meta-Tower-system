<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class SeedAmenityStatusUnderMaintenance extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!\Illuminate\Support\Facades\Schema::hasTable('amenity_statuses')) {
            return;
        }
        $exists = DB::table('amenity_statuses')
            ->whereRaw('LOWER(TRIM(name)) = ?', ['under maintenance'])
            ->exists();

        if (!$exists) {
            DB::table('amenity_statuses')->insert([
                'name'       => 'Under maintenance',
                'created_at' => now(),
                'updated_at' => now(),
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
        if (!\Illuminate\Support\Facades\Schema::hasTable('amenity_statuses')) {
            return;
        }
        DB::table('amenity_statuses')
            ->whereRaw('LOWER(TRIM(name)) = ?', ['under maintenance'])
            ->delete();
    }
}
