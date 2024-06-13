<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOsCurrenciesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('os_currencies', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('branch_id');
            $table->string('code');
            $table->string('name');
            $table->string('symbol');
            $table->tinyInteger('symbol_after')->default(0);
            $table->integer('decimal_point')->nullable()->default(2);
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->string('create_user',50)->nullable();
            $table->string('update_user',50)->nullable();
            $table->integer('create_uid')->nullable();
            $table->integer('update_uid')->nullable();
            $table->integer('decimal_points')->nullable()->default(2);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('os_currencies');
    }
}
