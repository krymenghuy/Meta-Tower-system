<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAffiliatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('affiliates', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name',150);
            $table->string('sex',10);
            $table->string('phone_number',100)->nullable();
            $table->string('email',100)->nullable();
            $table->string('address',250)->nullable();
            $table->string('code',50)->nullable();
            $table->decimal('amount_due',10,2)->default(0.00)->nullable();
            
            $table->string('photo_file_name',255)->nullable();
            $table->string('status_code',15)->default('active');
            $table->string('position_title',255)->nullable();
            $table->integer('affiliate_type')->nullable()->default(1)->comment('1= sales agent ,2= contact person');
            $table->string('type_from_affilliate_type',35)->nullable()->comment('sales type from affiliate_type_id');
            $table->integer('branch_id');
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
        Schema::dropIfExists('affiliates');
    }
}
