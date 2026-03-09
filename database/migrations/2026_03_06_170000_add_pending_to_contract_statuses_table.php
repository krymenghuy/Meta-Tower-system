<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class AddPendingToContractStatusesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $exists = DB::table('contract_statuses')
            ->where(function ($q) {
                $q->whereRaw('LOWER(TRIM(name)) = ?', ['pending'])
                    ->orWhereRaw('LOWER(TRIM(status_code)) = ?', ['pending']);
            })
            ->exists();

        if (!$exists) {
            DB::table('contract_statuses')->insert([
                'name' => 'Pending',
                'status_code' => 'pending',
            ]);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::table('contract_statuses')
            ->where(function ($q) {
                $q->whereRaw('LOWER(TRIM(name)) = ?', ['pending'])
                    ->orWhereRaw('LOWER(TRIM(status_code)) = ?', ['pending']);
            })
            ->delete();
    }
}
