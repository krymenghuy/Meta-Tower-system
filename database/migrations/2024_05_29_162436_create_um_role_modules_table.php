<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUmRoleModulesTable extends Migration
{
    /**
     * Run the migrations.
     *3
     * @return void
     */
    public function up()
    {
        Schema::create('um_role_modules', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('role_id');
            $table->integer('module_id');
            $table->timestamp('start_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('um_role_modules');
    }
}
