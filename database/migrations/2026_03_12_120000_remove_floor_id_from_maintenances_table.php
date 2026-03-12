<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class RemoveFloorIdFromMaintenancesTable extends Migration
{
    public function up()
    {
        if (!Schema::hasColumn('maintenances', 'floor_id')) {
            return;
        }
        DB::statement('ALTER TABLE maintenances DROP COLUMN floor_id');
    }

    public function down()
    {
        Schema::table('maintenances', function (Blueprint $table) {
            $table->unsignedBigInteger('floor_id')->nullable()->after('building_id');
            $table->foreign('floor_id')->references('id')->on('floors')->onDelete('set null');
        });
    }
}
