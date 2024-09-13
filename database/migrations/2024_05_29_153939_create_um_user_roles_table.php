<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUmUserRolesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('um_user_roles', function (Blueprint $table) {
            $table->integer('uer_id');
            $table->integer('role_id');
            $table->integer('branch_id');
            $table->string('app_id', 50);
            $table->tinyInteger('is_primary_role')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('um_user_roles');
    }
}
