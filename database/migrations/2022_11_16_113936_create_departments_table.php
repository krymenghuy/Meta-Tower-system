<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDepartmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->integer('branch_id');
            $table->integer('com_branch_id')->nullable()->default(0);
            $table->string('name',150);
            $table->string('description',350)->nullable();
            $table->string('create_user',50);
            $table->integer('create_uid');
            $table->string('update_user',50)->nullable();
            $table->integer('update_uid')->nullable();
            $table->timestamp('created_at');
            $table->timestamp('updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('departments');
    }
}
