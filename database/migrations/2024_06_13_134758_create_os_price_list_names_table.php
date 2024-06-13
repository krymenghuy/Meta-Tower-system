<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOsPriceListNamesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('os_price_list_names', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name',150);
            $table->integer('branch_id');
            $table->decimal('kg_marker',10,0);
            $table->string('create_user',35)->nullable();
            $table->timestamp('create_date')->nullable();
            $table->integer('id_default')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('os_price_list_names');
    }
}
