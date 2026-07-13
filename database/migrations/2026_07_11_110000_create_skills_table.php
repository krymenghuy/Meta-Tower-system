<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSkillsTable extends Migration
{
    public function up()
    {
        if (Schema::hasTable('skills')) {
            return;
        }

        Schema::create('skills', function (Blueprint $table) {
            $table->unsignedInteger('id')->autoIncrement();
            $table->string('title', 100)->nullable();
            $table->string('description', 1000)->nullable();
            $table->string('image_file_name', 1000)->nullable();
            $table->integer('count_member')->default(0);
            $table->integer('branch_id')->nullable();
            $table->binary('subs_id', 16)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            $table->integer('create_uid')->nullable();
            $table->integer('update_uid')->nullable();
            $table->string('create_user', 50)->nullable();
            $table->string('update_user', 50)->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('skills');
    }
}
