<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePrescriptionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('prescriptions');
        Schema::create('prescriptions', function (Blueprint $table){
            $table->id();
            $table->integer('patient_id');
            $table->integer('consultant_id');
            $table->date('issue_date');
            $table->date('followup_date')->nullable();
            $table->string('advice',250);

            $table->integer('create_uid')->nullable();
            $table->string('create_user',50)->nullable();
            $table->timestamp('created_at')->nullable();
            $table->integer('update_uid')->nullable();
            $table->string('update_user',50)->nullable();
            $table->timestamp('updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('prescriptions');
    }
}
