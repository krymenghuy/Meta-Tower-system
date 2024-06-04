<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUmRolesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('um_roles', function (Blueprint $table) {
            $table->increments('id');
            $table->string('app_id',50);
            $table->string('name',50);
            $table->integer('branch_id');
            $table->string('create_user')->nullable();
            $table->timestamp('create_date')->nullable();
            $table->string('user_class',25)->nullable();
            $table->tinyInteger('protected')->nullable()->default(0)->comment('	protected =1 to prevent user from delete this role because the role name must exist for some application fixed or hard-coded logic to work');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('um_roles');
    }
}
