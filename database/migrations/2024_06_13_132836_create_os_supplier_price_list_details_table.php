<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOsSupplierPriceListDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('os_supplier_price_list_details', function (Blueprint $table) {
            $table->integer('price_list_id');
            $table->integer('country_id')->nullable();
            $table->integer('zone_code');
            $table->string('item_type');
            $table->decimal('price_per_kg',10,2)->default(0);
            $table->integer('branch_id');
            $table->string('create_user',50)->nullable();
            $table->string('update_user',50)->nullable();
            $table->integer('update_uid')->nullable();
            $table->timestamp('create_date')->default(\DB::raw('current_timestamp'));
            $table->timestamp('update_date')->default(\DB::raw('current_timestamp'));
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('os_supplier_price_list_details');
    }
}
