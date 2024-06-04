<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReportsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('module_id')->default(100);
            $table->string('code',35)->nullable()->default('');
            $table->string('name',150);
            $table->string('category',20)->comment('category= "payment","enrollment","schedule". => show reports by category or group of report');
            $table->string('params',250)->nullable();
            $table->integer('display_order')->nullable();
            $table->tinyInteger('hidden')->default(0);
            $table->integer('category_id')->nullable();
            $table->integer('permission_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('reports');
    }
}
