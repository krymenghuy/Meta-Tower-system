<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUmUserPermissionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('um_user_permissions', function (Blueprint $table) {
            $table->integer('user_id');
            $table->integer('permission_id');
            $table->integer('role_id')->nullable();
            $table->timestamp('start_date')->nullable()->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->integer('create_uid')->nullable();
            $table->integer('update_uid')->nullable();
            $table->timestamp('update_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('create_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->string('create_user',50)->nullable();
            $table->string('update_user',50)->nullable();
            $table->increments('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('um_user_permissions');
    }
}
