<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOsAgentCodeControlTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('os_agent_code_control', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('branch_id');
            $table->integer('last_id')->nullable()->default(0);
            $table->string('prefix',10)->nullable();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('os_agent_code_control');
    }
}
