<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOsContactPersonsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('os_contact_persons', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('affiliate_id')->nullable();
            $table->integer('sender_id')->nullable();
            $table->integer('cp_type')->default(1)->comment('1=primary, 2=secondary');
            $table->integer('branch_id')->nullable();
            $table->integer('create_uid')->nullable();
            $table->integer('update_uid')->nullable();
            $table->timestamp('update_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('create_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->string('create_user',50)->nullable();
            $table->string('update_user',50)->nullable();


        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('os_contact_persons');
    }
}
