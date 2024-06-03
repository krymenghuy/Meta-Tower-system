<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSenderCodChargesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sender_cod_charges', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('sender_id');
            $table->decimal('cod_fee_percent',10,2)->comment('cod_fee_percent = normally 0.05% percentage of package price');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->tinyInteger('never_expires')->default(0);
            $table->string('delivery_type',20)->nullable();
            $table->string('remarks',150)->nullable();
            $table->integer('branch_id');
            $table->string('create_user',50)->nullable();
            $table->string('update_user', 50)->nullable();
            $table->timestamp('update_date')->nullable()->default(\DB::raw('CURRENT_TIMESTAMP'));
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
        Schema::dropIfExists('sender_cod_charges');
    }
}
