<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSenderPriceListTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sender_price_list', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('sender_id');
            $table->decimal('price_per_kg', 10, 2);
            $table->decimal('start_kg', 10, 2);
            $table->decimal('end_kg', 10, 2);
            $table->string('zone_code', 15);
            $table->integer('branch_id');
            $table->decimal('price', 10, 2)->default(0.00);
            $table->decimal('base_price', 10, 2)->default(0.00);
            $table->string('delivery_type', 25)->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->tinyInteger('never_expires')->nullable()->default(1);
            $table->string('price_option', 15)->nullable();
            $table->string('create_user', 50)->nullable();
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
        Schema::dropIfExists('sender_price_list');
    }
}
