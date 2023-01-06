<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDb extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::unprepared(file_get_contents(getCWD()."/db/mclinic_db.sql"));
        DB::unprepared(file_get_contents(getCWD()."/db/mclinic_db_functions.sql"));
        //DB::unprepared(file_get_contents(getCWD()."/db1/accounting_init_data.sql"));
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        return;
        //Schema::dropIfExists('db');
    }
}
