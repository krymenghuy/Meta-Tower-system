<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOsBillValidationTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('os_bill_validation', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('session_id');
            $table->bigInteger('waybill_no')->nullable();
            $table->date('shipment_date');
            $table->string('dest_country',50);
            $table->string('product',9);
            $table->decimal('jto_weight',10,2)->default(0.00);
            $table->decimal('carrier_weight',10,2)->default(0.00);
            $table->decimal('jto_amount',10,2)->default(0.00);
            $table->decimal('carrier_amount',10,2)->default(0.00);
            $table->tinyInteger('unacceptable_weight')->default(0);
            $table->tinyInteger('unacceptable_price')->default(0);
            $table->tinyInteger('wrong_type')->default(0);
            $table->tinyInteger('wrong_country')->default(0);
            $table->integer('branch_id')->nullable();
            $table->integer('create_uid')->nullable();
            $table->integer('update_uid')->nullable();
            $table->timestamp('update_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('create_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->string('create_user',50)->nullable();
            $table->string('update_user',50)->nullable();
            //end 21 field----
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('os_bill_validation');
    }
}
