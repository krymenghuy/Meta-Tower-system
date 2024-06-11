<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOsLastSessionControlTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('os_last_session_control', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('last_id')->default(0);
            $table->integer('branch_id');
            $table->string('prefix',30)->nullable();
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('os_last_session_control');
    }
}
