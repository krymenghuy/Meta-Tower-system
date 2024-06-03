<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUmSessionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('um_sessions', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('branch_id')->nullable();
            $table->string('app_id',50);
            $table->string('login_name',35);
            $table->integer('user_id')->nullable();
            $table->timestamp('start_time')->nullable();
            $table->timestamp('last_active_time')->nullable();
            $table->string('session_id',150)->nullable();
            $table->string('csrf_code',150)->nullable();
            $table->string('access_token',800)->nullable();
            $table->string('status',10)->nullable()->comment('status=online,offline');
            $table->string('lang',50)->nullable()->default('en');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('um_sessions');
    }
}
