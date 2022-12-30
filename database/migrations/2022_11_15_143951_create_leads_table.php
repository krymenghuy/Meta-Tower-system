<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLeadsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('name',100);
            $table->string('sex',10);
            $table->string('phone_number',100);
            $table->integer('status_id'); /** 1=lead, 2=prospect **/
            //$table->string('prospect_status');
            $table->integer('create_uid');
            $table->string('create_user',50);
            $table->integer('update_uid')->nullable();
            $table->string('update_user',50)->nullable();
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
        Schema::dropIfExists('leads');
    }
}
