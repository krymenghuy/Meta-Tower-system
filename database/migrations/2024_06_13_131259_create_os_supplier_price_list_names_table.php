<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOsSupplierPriceListNamesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('os_supplier_price_list_names', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name',150);
            $table->decimal('kg_marker',10,0);
            $table->integer('branch_id');
            $table->string('create_user',35)->nullable();
            $table->timestamp('create_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->integer('is_default')->nullable();
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('os_supplier_price_list_names');
    }
}
