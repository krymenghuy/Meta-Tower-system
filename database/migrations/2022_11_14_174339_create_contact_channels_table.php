<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContactChannelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
            Schema::create('contact_channels', function (Blueprint $table) {
                $table->increments('id');
                $table->integer('branch_id');
                $table->string('name',50);
                $table->string('create_user',50);
                $table->integer('create_uid');
                $table->timestamp('created_at')->nullable()->default(NULL);
                $table->string('update_user',50)->nullable();
                $table->integer('update_uid')->nullable();
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
        Schema::dropIfExists('contact_channels');
    }
}
