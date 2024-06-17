<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOsCustomerPaymentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('os_customer_payments', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('payer_id')->nullable();
            $table->integer('shipment_id')->nullable();
            $table->string('payer_type',50)->nullable();
            $table->date('payment_date');
            $table->integer('shipment_count')->nullable()->default(1);
            $table->decimal('amount',10,2);
            $table->string('currency_code',10);
            $table->string('pmt_method',50)->nullable();
            $table->integer('reshape_number')->nullable();
            $table->string('remarks')->nullable();
            $table->timestamp('create_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('update_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->string('update_user',50)->nullable();
            $table->string('create_user',50)->nullable();
            $table->integer('branch_id')->nullable();
            $table->integer('create_uid')->nullable();
            $table->integer('update_uid')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('os_customer_payments');
    }
}
