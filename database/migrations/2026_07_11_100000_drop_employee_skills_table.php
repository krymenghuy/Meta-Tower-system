<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropEmployeeSkillsTable extends Migration
{
    public function up()
    {
        Schema::dropIfExists('employee_skills');
    }

    public function down()
    {
        Schema::create('employee_skills', function (Blueprint $table) {
            $table->unsignedInteger('id')->autoIncrement();
            $table->unsignedInteger('emp_id');
            $table->string('skill_name', 150);
            $table->decimal('rate', 5, 2);
            $table->string('description', 250)->nullable();
            $table->binary('subs_id', 16)->nullable();
            $table->unsignedInteger('branch_id')->nullable();
            $table->integer('create_uid')->nullable();
            $table->string('create_user', 50)->nullable();
            $table->integer('update_uid')->nullable();
            $table->string('update_user', 50)->nullable();
            $table->dateTime('created_at')->nullable();
            $table->dateTime('updated_at')->nullable();

            $table->index('emp_id');
        });
    }
}
