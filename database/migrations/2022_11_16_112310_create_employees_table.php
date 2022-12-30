<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmployeesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->integer('branch_id');
            $table->integer('person_id');
            $table->string('code',25)->nullable();
            $table->integer('position_id');
            $table->integer('department_id')->nullable();
            $table->string('employment_type',25)->nullable(); //"Full time", "Part time"
            $table->decimal('salary',10,2)->default(0); //base salary amount
            $table->string('currency_code',5)->default('USD');
            $table->string('create_user',50);
            $table->integer('create_uid');
            $table->string('update_user',50)->nullable();
            $table->integer('update_uid')->nullable();
            $table->timestamp('created_at');
            $table->timestamp('updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('employees');
    }
}
