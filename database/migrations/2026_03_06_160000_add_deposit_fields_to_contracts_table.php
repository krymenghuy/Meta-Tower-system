<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDepositFieldsToContractsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('contracts', function (Blueprint $table) {
            if (!Schema::hasColumn('contracts', 'deposit_amount')) {
                $table->decimal('deposit_amount', 12, 2)->nullable()->after('end_date');
            }
            if (!Schema::hasColumn('contracts', 'deposit_remarks')) {
                $table->string('deposit_remarks', 255)->nullable()->after('deposit_amount');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('contracts', function (Blueprint $table) {
            if (Schema::hasColumn('contracts', 'deposit_remarks')) {
                $table->dropColumn('deposit_remarks');
            }
            if (Schema::hasColumn('contracts', 'deposit_amount')) {
                $table->dropColumn('deposit_amount');
            }
        });
    }
}
