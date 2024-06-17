<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSenderTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sender', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('sender_type_id')->nullable()->default(1);
            $table->string('name',50);
            $table->string('name_kh',100)->nullable()->default('');
            $table->string('phone_number',25);
            $table->string('email',50)->nullable();
            $table->integer('adr_country_id')->nullable();
            $table->integer('adr_city_id')->nullable();
            $table->integer('adr_district_id')->nullable();
            $table->integer('adr_commune_id')->nullable();
            $table->string('address',250)->nullable()->default('');
            $table->string('business_type',50)->nullable();
            $table->string('sender_type',30)->nullable();
            $table->string('create_user',50);
            $table->timestamp('create_date')->nullable();
            $table->string('code',25)->nullable()->default('');
            $table->string('zone_code',15)->nullable();
            $table->string('map_location',150)->nullable();
            $table->integer('branch_id')->nullable();
            $table->string('status_code',20)->nullable()->default('active');
            $table->string('update_user',50)->nullable();
            $table->timestamp('update_date')->nullable();
            $table->integer('sales_agent_id')->nullable();
            $table->string('photo_file_name',255)->nullable();
            $table->string('photo_file_type',10)->nullable();
            $table->integer('price_list_id')->nullable();
            $table->integer('os_agent_type_id')->nullable()->default(1);
            $table->tinyInteger('cod')->nullable()->default(0);
            $table->decimal('cod_fee',10,2)->nullable()->default(0.00);
            $table->decimal('loc_lat',17,14)->nullable();
            $table->decimal('loc_lng',17,14)->nullable();
            $table->integer('create_uid')->nullable();
            $table->integer('update_uid')->nullable();
            $table->string('code_old',25)->nullable();
            $table->integer('lead_id')->nullable();
           

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sender');
    }
}
