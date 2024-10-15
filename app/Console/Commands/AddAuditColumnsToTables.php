<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Str;

class AddAuditColumnsToTables extends Command
{
    protected $signature = 'db:add-audit-cols';
    protected $description = 'Add audit columns to all tables except those starting with "um_" and "loc_"';

    public function handle()
    {
        $databaseName = DB::getDatabaseName();
        $tables = $this->getTables($databaseName);

        foreach ($tables as $table) {
            if ($this->shouldProcessTable($table)) {
                $this->addAuditColumnsToTable($table);
            }
        }

        $this->info('Audit columns added successfully.');
    }

    private function getTables($databaseName)
    {
        $tables = DB::select("SELECT table_name FROM information_schema.tables WHERE table_schema = ? AND table_type = 'BASE TABLE'", [$databaseName]);
        return array_column($tables, 'table_name');
    }

    private function shouldProcessTable($table)
    {
        return !Str::startsWith($table, ['_ttt']);
    }

    private function addAuditColumnsToTable($table)
    {
        $columnsToAdd = [
            'branch_id' => 'integer',
            'create_user' => 'string',
            'created_at' => 'timestamp',
            'create_uid' => 'integer',
            'updated_at' => 'timestamp',
            'update_user' => 'string',
            'update_uid' => 'integer',
            //'deleted' => 'integer',
        ];

        $tableColumns = Schema::getColumnListing($table);

        foreach ($columnsToAdd as $columnName => $columnType) {
            if (!in_array($columnName, $tableColumns)) {
                Schema::table($table, function (Blueprint $table) use ($columnName, $columnType) {
                    if ($columnName === 'create_user' || $columnName === 'update_user') {
                        $table->{$columnType}($columnName, 50)->nullable();
                    } else {
                        $table->{$columnType}($columnName)->nullable();
                    }
                });
            }
        }
    }
}