<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->integer('id')->default(0);
            $table->integer('branch_id');
            $table->string('app_id',50);
            $table->integer('user_id')->nullable()->comment('user_id is the sender_id or driver_id');
            $table->string('message',250);
            $table->string('title',100);
            $table->timestamp('expiry_time')->nullable();
            $table->tinyInteger('is_read')->default(0);
            $table->string('image_url',350)->nullable();
            $table->timestamp('create_date')->nullable();
            $table->string('user_class',25)->nullable();
            $table->string('role_name',150)->nullable();
            $table->integer('category_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('notifications');
    }
}
