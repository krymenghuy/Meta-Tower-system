<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePersonsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
            Schema::create('persons', function (Blueprint $table) {
                $table->increments('id');
                $table->integer('branch_id');
                $table->string('name',100);
                $table->string('first_name',50)->nullable();
                $table->string('last_name',50)->nullable();
                $table->string('sex',10);
                $table->date('date_of_birth')->nullable();
                $table->integer('nationality_id')->nullable();
                $table->string('phone_number',50)->nullable();
                $table->string('phone_number1',50)->nullable();
                $table->string('email',50)->nullable();
                $table->string('address',250)->nullable();
                $table->string('national_id',250)->nullable();
                $table->string('cp_name',250)->nullable();
                $table->string('cp_phone_number',250)->nullable();
    
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
        Schema::dropIfExists('persons');
    }
}
