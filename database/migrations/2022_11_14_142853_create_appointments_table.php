<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAppointmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('branch_id');
            $table->integer('channel_id');
            $table->date('arrival_date');
            $table->timestamp('arrival_time');
            $table->string('notes',250);
            $table->string('client_name',100)->nullable();
            $table->string('client_phone_number',50);
            $table->string('client_email',50)->nullable();
            $table->string('client_sex',15)->nullable();
            $table->integer('consultant_id');
            $table->integer('client_id');
            $table->integer('client_type'); //client_type = {'lead','client'}] => helps points to either table 'patients' or 'leads'

            $table->string('create_user',50);
            $table->integer('create_uid');
            $table->timestamp('created_at')->nullable();
            $table->string('update_user',50)->nullable();
            $table->string('update_uid',50)->nullable();
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
        Schema::dropIfExists('appointments');
    }
}
