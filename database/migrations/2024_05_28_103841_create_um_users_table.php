<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUmUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('um_users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('login_name', 50);
            $table->string('phone_number', 50)->nullable();
            $table->string('email', 100)->nullable();
            $table->string('hpwd', 150)->nullable();
            $table->timestamp('last_login_date')->nullable()->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->string('app_id', 50);
            $table->string('subs_id', 50)->nullable()->default('');
            $table->integer('branch_id');
            $table->string('previlege_type', 20)->default('standard')->comment('previlege_type ={standard,admin}');
            $table->tinyInteger('is_locked')->default('0');
            $table->string('status', 15)->default('active')->comment('status ={active,inactive}');
            $table->string('full_name', 50);
            $table->integer('official_id')->nullable()->comment('official_id is the ID values that is used to link to more meaningful details table such as Employees, Students,Parents,Viewers, Customers etc. ');
            $table->string('user_class', 25)->comment('user_class { whatever classification that fits each application context }. Example. user_class = {staff,student,parent,customer,...}');
            $table->string('create_user', 50)->nullable();
            $table->integer('create_uid')->nullable();
            $table->timestamp('create_date')->nullable();
            $table->string('official_code')->nullable();
            $table->integer('work_location_id')->nullable();
            $table->string('otp_code', 15)->nullable();
            $table->string('lang', 25)->default('en');
            $table->integer('update_uid')->nullable();
            $table->string('update_user', 50)->nullable();
            $table->timestamp('update_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->integer('is_system_admin')->default(1);
            $table->timestamp('updated_at')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->string('photo_file_name', 150)->nullable();
            $table->integer('um_remarks')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('um_users');
    }
}
