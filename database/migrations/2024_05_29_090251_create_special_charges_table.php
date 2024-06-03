<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSpecialChargesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('special_charges', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('shipment_id');
            $table->string('category',50)->nullable();
            $table->decimal('charge',10,2)->nullable();
            $table->decimal('amount',10,2)->default(0.00);
            $table->string('remarks',250)->nullable();
            $table->integer('branch_id');
            $table->string('create_user',50)->nullable();
            $table->string('update_user', 50)->nullable();
            $table->integer('create_uid')->nullable();
            $table->integer('update_uid')->nullable();
            $table->timestamp('update_date')->nullable()->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('create_date')->nullable()->default(\DB::raw('CURRENT_TIMESTAMP'));
            

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('special_charges');
    }
}
