<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUmApplicationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('um_applications', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name',150);
            $table->string('name_native',150);
            $table->tinyInteger('is_mobile_app')->nullable()->default(0);
            $table->string('icon_file_name',150)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('um_applications');
    }
}
