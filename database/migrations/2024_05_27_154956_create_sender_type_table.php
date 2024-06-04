<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSenderTypeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sender_type', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 50)->nullable();
            $table->integer('branch_id');
            $table->string('create_user', 50)->nullable();
            $table->string('update_user', 50)->nullable();
            $table->integer('create_uid')->nullable();
            $table->integer('update_uid')->nullable();
            $table->timestamp('create_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('update_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sender_type');
    }
}
