<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotifCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notif_categories', function (Blueprint $table) {
            $table->integer('id');
            $table->string('notif_category');
            $table->string('title_color')->nullable();
            $table->string('text_color',50)->nullable();
            $table->string('app_id',50)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('notif_categories');
    }
}
