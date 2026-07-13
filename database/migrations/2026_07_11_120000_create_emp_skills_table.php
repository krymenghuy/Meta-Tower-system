<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmpSkillsTable extends Migration
{
    public function up()
    {
        if (Schema::hasTable('emp_skills')) {
            return;
        }

        Schema::create('emp_skills', function (Blueprint $table) {
            $table->unsignedInteger('id')->autoIncrement();
            $table->integer('emp_id')->nullable();
            $table->integer('skill_id')->nullable();
            $table->decimal('rate', 10, 2)->default(0);
            $table->integer('branch_id')->nullable();
            $table->binary('subs_id', 16)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            $table->integer('create_uid')->nullable();
            $table->integer('update_uid')->nullable();
            $table->string('create_user', 50)->nullable();
            $table->string('update_user', 50)->nullable();

            $table->index('emp_id');
            $table->index('skill_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('emp_skills');
    }
}
