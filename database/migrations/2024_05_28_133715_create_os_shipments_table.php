<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOsShipmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('os_shipments', function (Blueprint $table) {
            $table->increments('id');
            $table->string('code',50)->nullable();
            $table->bigInteger('qr_code')->nullable();
            $table->integer('sender_id');
            $table->integer('supplier_id');
            $table->string('item_type',10)->default('doc');
            $table->integer('zone_code');
            $table->integer('to_country_id');
            $table->integer('from_country_id')->default('1');
            $table->integer('primary_cp_id')->nullable();
            $table->integer('secondary_cp_id')->nullable();
            $table->decimal('effective_weight',10,2)->nullable()->default(0.00);
            $table->decimal('actual_weight',10,2)->nullable()->default(0.00);
            $table->decimal('markup_weight',10,2)->nullable()->default(0.00);
            $table->decimal('total_weight',10,2)->nullable()->default(0.00);
            $table->decimal('carrier_total_weight',10,2)->nullable()->default(0.00);
            $table->decimal('total_price',10,2)->nullable()->default(0.00);
            $table->decimal('carrier_cost',10,2)->nullable()->default(0.00);
            $table->decimal('carrier_special_charge',10,2)->nullable()->default(0.00);
            $table->decimal('total_carrier_cost',10,2)->nullable()->default(0.00);
            $table->decimal('total_special_charge',10,2)->nullable()->default(0.00);
            $table->string('receiver_name',150)->nullable();
            $table->string('receiver_address',250)->nullable();
            $table->string('remarks',250)->nullable();
            $table->smallInteger('package_qty')->default(0);
            $table->integer('branch_id');
            $table->integer('status_id')->nullable();
            $table->string('create_user',50)->nullable();
            $table->string('update_user',50)->nullable();
            $table->integer('create_uid')->nullable();
            $table->integer('update_uid')->nullable();
            $table->timestamp('update_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('create_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->integer('paid_status_id')->default(1);
            $table->integer('trx_id')->nullable();
            
                        //end 32 field---


        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('os_shipments');
    }
}
