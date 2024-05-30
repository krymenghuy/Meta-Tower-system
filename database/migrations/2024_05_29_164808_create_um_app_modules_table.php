<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUmAppModulesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('um_app_modules', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('parent_mod_id')->nullable();
            $table->string('app_id',50)->nullable();
            $table->string('ref_code',20)->nullable()->default('');
            $table->string('module_name',150);
            $table->string('module_name_native',150)->nullable();
            $table->string('icon_image',100)->nullable()->default('');
            $table->string('target_url',150)->nullable();
            $table->tinyInteger('hidden')->default(0);
            $table->tinyInteger('disabled')->default(0);
            $table->integer('display_order')->nullable()->default(0);
            $table->string('icon_file_name',150)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('um_app_modules');
    }
}
