<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOsSuppliersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('os_suppliers', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name',150);
            $table->string('phone_number',25);
            $table->string('email',50)->nullable();
            $table->string('address',255)->nullable();
            $table->integer('referrer_id')->nullable();
            $table->integer('price_list_id');
            $table->string('code', 11)->nullable();
            $table->string('photo_file_name', 255)->nullable();
            $table->integer('branch_id');
            $table->string('status_code', 20)->nullable()->default('active');
            $table->string('create_user',50)->nullable();
            $table->string('update_user', 50)->nullable();
            $table->integer('create_uid')->nullable();
            $table->integer('update_uid')->nullable();
            $table->timestamp('update_date')->nullable()->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('create_date')->nullable()->default(\DB::raw('CURRENT_TIMESTAMP'));
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('os_suppliers');
    }
}
