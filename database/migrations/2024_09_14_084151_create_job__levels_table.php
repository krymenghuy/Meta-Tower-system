<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateJobLevelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('job__levels', function (Blueprint $table) {
            $table->id();
            $table->string('Job_Title');
            $table->string('Level');
            $table-> integer('Ratting');
            $table->integer('branch_id');
            $table->string('create_user', 50)->nullable();
            $table->integer('create_uid')->nullable();
            $table->integer('update_uid')->nullable();
            $table->string('update_user', 50)->nullable();
            $table->binary('subs_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('job__levels');
    }
}
