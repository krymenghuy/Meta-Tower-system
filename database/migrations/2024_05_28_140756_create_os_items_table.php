<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOsItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('os_items', function (Blueprint $table) {
            $table->increments('id');
            $table->string('item_type',20)->nullable();
            $table->integer('shipment_id')->nullable();
            $table->decimal('billed_weight',10,2)->nullable()->default(0.00);
            $table->decimal('actual_weight',10,2)->nullable()->default(0.00);
            $table->decimal('allocated_kg',10,2)->nullable()->default(0.00);
            $table->decimal('price',10,2)->default(0.00);
            $table->decimal('price_per_kg',10,2)->nullable()->default(0.00);
            $table->decimal('item_total',10,2)->default(0.00);
            $table->decimal('dim_x',10,2)->nullable()->default(0.00)->comment('in centimeter "cm"');
            $table->decimal('dim_y',10,2)->nullable()->default(0.00)->comment('in centimeter "cm"');
            $table->decimal('dim_h',10,2)->nullable()->default(0.00)->comment('in centimeter "cm"');
            $table->tinyInteger('status_id')->default(5);
            $table->integer('branch_id')->nullable();
            $table->integer('create_uid')->nullable();
            $table->integer('update_uid')->nullable();
            $table->timestamp('update_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('create_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->string('create_user',50)->nullable()->default('null');
            $table->string('update_user',50)->nullable()->default('null');


            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('os_items');
    }
}
