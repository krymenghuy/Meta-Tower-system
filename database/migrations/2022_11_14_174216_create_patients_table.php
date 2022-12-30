<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePatientsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
            Schema::create('patients', function (Blueprint $table) {
                $table->increments('id');
                $table->integer('branch_id');
                $table->integer('com_branch_id');
                $table->integer('person_id');
                $table->string('code',25)->nullable();
    
                $table->string('create_user',50);
                $table->integer('create_uid');
                $table->timestamp('created_at')->nullable()->default(NULL);
                $table->string('update_user',50);
                $table->integer('update_uid');
                $table->timestamp('updated_at')->nullable()->default(NULL);
            });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('patients');
    }
}
