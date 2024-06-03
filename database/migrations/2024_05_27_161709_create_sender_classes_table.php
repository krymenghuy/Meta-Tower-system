<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSenderClassesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sender_classes', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('sender_id')->nullable();
            $table->string('sender_class',50)->nullable();
            $table->integer('branch_id')->nullable()->default(1);
            $table->timestamp('update_date')->nullable()->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('create_date')->nullable()->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->integer('create_uid')->nullable();
            $table->integer('update_uid')->nullable();
            $table->string('update_user',50)->nullable();
            $table->string('create_user',50)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sender_classes');
    }
}
