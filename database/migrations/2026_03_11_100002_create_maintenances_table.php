<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMaintenancesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('maintenances', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('building_id');
            $table->integer('branch_id')->nullable();
            $table->unsignedBigInteger('floor_id')->nullable();
            $table->unsignedBigInteger('space_id')->nullable();
            $table->unsignedBigInteger('amenity_id')->nullable();
            $table->unsignedBigInteger('maintenance_type_id');
            $table->text('description')->nullable();
            $table->integer('request_date');
            $table->integer('scheduled_date')->nullable();
            $table->integer('completed_date')->nullable();
            $table->unsignedBigInteger('status_id');
            $table->unsignedBigInteger('assigned_staff_id')->nullable();
            $table->decimal('cost', 15, 2)->nullable();
            $table->text('remarks')->nullable();
            $table->integer('create_uid')->nullable();
            $table->string('create_user', 50)->nullable();
            $table->integer('update_uid')->nullable();
            $table->string('update_user', 50)->nullable();
            $table->timestamps();

            $table->foreign('building_id')->references('id')->on('buildings')->onDelete('restrict');
            $table->foreign('floor_id')->references('id')->on('floors')->onDelete('set null');
            $table->foreign('space_id')->references('id')->on('building_spaces')->onDelete('set null');
            $table->foreign('amenity_id')->references('id')->on('amenities')->onDelete('set null');
            $table->foreign('maintenance_type_id')->references('id')->on('maintenance_types')->onDelete('restrict');
            $table->foreign('status_id')->references('id')->on('maintenance_statuses')->onDelete('restrict');
            $table->foreign('assigned_staff_id')->references('id')->on('um_users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('maintenances');
    }
}
