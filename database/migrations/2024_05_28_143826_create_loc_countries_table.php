<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLocCountriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('loc_countries', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name',100);
            $table->string('name_kh',100);
            $table->string('code',5)->nullable();
            //$table->integer('standard_zone')->nullable();
            $table->decimal('lat',10,2)->nullable();
            $table->decimal('lng',10,2)->nullable();
            $table->string('nationality',100)->nullable();
            $table->string('nationality_kh',100)->nullable();
            $table->integer('branch_id');
            $table->timestamp('update_at')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('create_at')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->integer('create_uid')->nullable();
            $table->integer('update_uid')->nullable();
            $table->timestamp('update_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('create_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->string('create_user',50)->nullable();
            $table->string('update_user',50)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('loc_countries');
    }
}
