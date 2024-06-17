<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSenderBusinessTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sender_business_types', function (Blueprint $table) {
            $table->increments('id');
            $table->string('business_type',150);
            $table->tinyInteger('allow_register')->nullable()->default(1);
            $table->string('applyTo',25)->nullable();
    });
}
    

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sender_business_types');
    }
}
