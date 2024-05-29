<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOsSalesAgentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('os_sales_agents', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('affiliate_id')->nullable();
            $table->integer('agent_type')->nullable()->default(1)->comment('1=full-time, 2=freelancer');
            $table->integer('branch_id')->default(1);
            $table->integer('create_uid')->nullable();
            $table->integer('update_uid')->nullable();
            $table->string('create_user',50)->nullable();
            $table->string('update_user',50)->nullable();
            $table->timestamp('update_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('create_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('os_sales_agents');
    }
}
