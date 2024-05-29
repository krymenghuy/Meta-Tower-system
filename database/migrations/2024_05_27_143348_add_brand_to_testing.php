<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddBrandToTesting extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('testing', function (Blueprint $table) {
            $table->string('brand',250)->nullable()->after('name');
            $table->integer('price')->nullable()->default(0.00)->after('brand');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('testing', function (Blueprint $table) {
            $table->dropColumn('brand');
            $table->dropColumn('price');
        });
    }
}
