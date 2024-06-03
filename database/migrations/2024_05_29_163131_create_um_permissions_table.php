<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUmPermissionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('um_permissions', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name',150);
            $table->integer('module_id');
            $table->string('app_id',50);
            $table->string('category',30)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('um_permissions');
    }
}
