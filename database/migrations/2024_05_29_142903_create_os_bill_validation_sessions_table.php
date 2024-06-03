<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOsBillValidationSessionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('os_bill_validation_sessions', function (Blueprint $table) {
            $table->increments('id');
            $table->string('file_name',150)->nullable();
            $table->integer('shipment_count')->nullable()->default(0);
            $table->integer('match_count')->nullable()->default(0);
            $table->integer('unacceptable_count')->nullable()->default(0);
            $table->integer('branch_id')->nullable();
            $table->integer('create_uid')->nullable();
            $table->integer('update_uid')->nullable();
            $table->timestamp('update_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('create_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->string('create_user',50)->nullable();
            $table->string('update_user',50)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('os_bill_validation_sessions');
    }
}
