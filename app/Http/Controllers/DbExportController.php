<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
//use Illuminate\Support\Facades\Storage;
//use Illuminate\Support\Facades\Response;
use Illuminate\Http\Response;
// use Illuminate\Support\Facades\Schema;
use Config;
use Log;
use Symfony\Component\Process\Process;

class DbExportController extends Controller
{
    protected static $user_root = '', $password = '';
    protected static $environment = 'shared_hosting';

    public function exportDatabase($maxRows = 500, $dropIfExists = true, $allowBinaryInsert = true){
        return $this->dumpDatabase_using_php($maxRows, $dropIfExists,$allowBinaryInsert);
    }
 
    /** dumpDatabase_using_command() can be used when Laravel project is hosted on VPS, with root user and password supplied for the privilege to dump data */
    public function dumpDatabase_using_command(Request $request)
    {
        $maxRows = $request->input('max_rows', 250);
        $database = Config::get('database.connections.' . Config::get('database.default') . '.database');
        $driver = DB::getDriverName();

        if (!$database) {
            return response()->json(['error' => 'No database name specified'], 400);
        }
        switch ($driver) {
            case 'mysql':
                return $this->exportMySQLDatabase($database, $maxRows);
            case 'pgsql':
                return $this->exportPostgresDatabase($database, $maxRows);
            case 'sqlsrv':
                return $this->exportMSSQLDatabase($database, $maxRows);
            default:
                return response()->json(['error' => 'Unsupported database driver'], 400);
        }
    }

    /** dumpDatabase_using_php() is used to export data from database: MySQL, PostgreSQL, MSSQL. It depends on current database driver in laravel project */
    function dumpDatabase_using_php($max_rows = null, $dropIfExists = true, $allowBinaryInsert = true)
    {
        $logFileName = 'database_export.log';
        $logStream = fopen(storage_path("logs/$logFileName"), 'a');
    
        $tables = DB::select('SHOW FULL TABLES WHERE Table_type = "BASE TABLE"');
        $tableNames = array_map('current', $tables);
        $sqlExport = '';
    
        foreach ($tableNames as $table) {
            if ($dropIfExists) {
                $sqlExport .= "DROP TABLE IF EXISTS `$table`;\n";
            }
    
            $createTableStatement = DB::select("SHOW CREATE TABLE `$table`");
    
            if (empty($createTableStatement)) {
                fwrite($logStream, "Error: Couldn't fetch CREATE TABLE statement for table $table\n");
                continue;
            }
    
            if (isset($createTableStatement[0]->{'Create Table'})) {
                $sqlExport .= $createTableStatement[0]->{'Create Table'} . ";\n\n";
            } else {
                fwrite($logStream, "Error: Couldn't fetch proper CREATE TABLE statement for table $table\n");
                continue;
            }
    
            $query = DB::table($table);
            if ($max_rows) {
                $query->limit($max_rows);
            }
            $rows = $query->get();
    
            if ($rows->isEmpty()) {
                continue;
            }
    
            foreach ($rows as $row) {
                $columns = array_keys((array) $row);
                $values = array_values((array) $row);
    
                $formattedValues = array_map(function ($value) use ($allowBinaryInsert) {
                    if (is_null($value)) {
                        return 'NULL';
                    } elseif (is_bool($value)) {
                        return $value ? '1' : '0';
                    } elseif (is_int($value) || is_float($value)) {
                        return $value;
                    } elseif (is_string($value) && $allowBinaryInsert && preg_match('~[^\x20-\x7E\t\r\n]~', $value)) {
                        return '0x' . bin2hex($value);
                    } else {
                        return "'" . addslashes($value) . "'";
                    }
                }, $values);
    
                $sqlExport .= "INSERT INTO `$table` (`" . implode('`, `', $columns) . "`) VALUES (" . implode(', ', $formattedValues) . ");\n";
            }
    
            $sqlExport .= "\n";
        }
    
        fclose($logStream);
        $timestamp = now()->format('Y-m-d_H-i-s');
        $outputFileName = 'database_export_' . $timestamp . '.sql';
        //$filePath = storage_path('temp/' . $outputFileName);
        
        // // Save the SQL export to the file
        // file_put_contents($filePath, $sqlExport);
         
        // // Save the SQL export to the file
        // Storage::put($filePath, $sqlExport);
        
        // // Check if the file exists
        // if (Storage::exists($filePath)) {
        //     // Return the file for download
        //     return Storage::download($filePath);
        // } else {
        //     return response("An error occurred. Please check the log file for details.", 500);
        // }
 
        $headers = [
            'Content-Type' => 'application/sql',
            'Content-Disposition' => 'attachment; filename="' . $outputFileName . '"',
        ];
    
        // Return a response with the SQL content and headers
        return new Response ($sqlExport, 200, $headers); 
    }
 
    // function exportDataByDate($date, $allowBinaryInsert = true, $batchSize = 1000)
    // {
    //     $logFileName = 'database_export_by_date.log';
    //     $logStream = fopen(storage_path("logs/$logFileName"), 'a');
    
    //     $tables = DB::select('SHOW FULL TABLES WHERE Table_type = "BASE TABLE"');
    //     $tableNames = array_map('current', $tables);
    //     $sqlExport = '';
    //     $date = empty($date) ? date('Y-m-d') : $date;
    //     $date = convertDate($date);
    //     // \Log::info('date = ' . $date);
    
    //     foreach ($tableNames as $table) {
    //         // Check if table has a create_date column
    //         $columns = DB::select("SHOW COLUMNS FROM `$table` LIKE 'create_date'");
    //         if (empty($columns)) {
    //             fwrite($logStream, "Skipping table $table as it does not have a create_date column\n");
    //             continue;
    //         }
    
    //         $str_date = 'DATE(create_date) >= \''.$date.'\'';
    //         $query = DB::table($table)->whereRaw($str_date);
    
    //         try {
    //             DB::beginTransaction();
    
    //             $query->chunkById($batchSize, function ($rows) use ($table, &$sqlExport, $allowBinaryInsert) {
    //                 foreach ($rows as $row) {
    //                     $columns = array_keys((array) $row);
    //                     $values = array_values((array) $row);
    
    //                     $formattedValues = array_map(function ($value) use ($allowBinaryInsert) {
    //                         if (is_null($value)) {
    //                             return 'NULL';
    //                         } elseif (is_bool($value)) {
    //                             return $value ? '1' : '0';
    //                         } elseif (is_int($value) || is_float($value)) {
    //                             return $value;
    //                         } elseif (is_string($value) && $allowBinaryInsert && preg_match('~[^\x20-\x7E\t\r\n]~', $value)) {
    //                             return '0x' . bin2hex($value);
    //                         } else {
    //                             return "'" . addslashes($value) . "'";
    //                         }
    //                     }, $values);
    
    //                     $sqlExport .= "INSERT INTO `$table` (`" . implode('`, `', $columns) . "`) VALUES (" . implode(', ', $formattedValues) . ");\n";
    //                 }
    //             });
    
    //             DB::commit();
    //         } catch (\Exception $e) {
    //             DB::rollBack();
    //             fwrite($logStream, "Error: Couldn't process data from table $table\n");
    //             fwrite($logStream, "Exception: " . $e->getMessage() . "\n");
    //         }
    
    //         $sqlExport .= "\n";
    //     }
    
    //     fclose($logStream);
    
    //     $timestamp = now()->format('Y-m-d_H-i-s');
    //     $outputFileName = 'database_export_by_date_' . $timestamp . '.sql';
    
    //     $headers = [
    //         'Content-Type' => 'application/sql',
    //         'Content-Disposition' => 'attachment; filename="' . $outputFileName . '"',
    //     ];
    
    //     // Return a response with the SQL content and headers
    //     return new Response($sqlExport, 200, $headers);
    // }
     
    // public function exportDataByDate($date = null, $allowBinaryInsert = true, $batchSize = 1000)
    // {
    //     $logFileName = 'database_export_by_date.log';
    //     $logStream = fopen(storage_path("logs/$logFileName"), 'a');

    //     $tables = DB::select('SHOW FULL TABLES WHERE Table_type = "BASE TABLE"');
    //     $tableNames = array_map('current', $tables);
    //     $sqlExport = '';
    //     $date = empty($date) ? date('Y-m-d') : convertDate($date);
    //     Log::info('date = ' . $date);

    //     foreach ($tableNames as $table) {
    //         // Check if table has a create_date column
    //         $columns = DB::select("SHOW COLUMNS FROM `$table` LIKE 'create_date'");
    //         if (empty($columns)) {
    //             fwrite($logStream, "Skipping table $table as it does not have a create_date column\n");
    //             continue;
    //         }

    //         $str_date = 'DATE(create_date) >= \'' . $date . '\'';
    //         $query = DB::table($table)->whereRaw($str_date);

    //         try {
    //             $query->chunkById($batchSize, function ($rows) use ($table, &$sqlExport, $allowBinaryInsert) {
    //                 foreach ($rows as $row) {
    //                     $columns = array_keys((array) $row);
    //                     $values = array_values((array) $row);

    //                     $formattedValues = array_map(function ($value) use ($allowBinaryInsert) {
    //                         if (is_null($value)) {
    //                             return 'NULL';
    //                         } elseif (is_bool($value)) {
    //                             return $value ? '1' : '0';
    //                         } elseif (is_int($value) || is_float($value)) {
    //                             return $value;
    //                         } elseif (is_string($value) && $allowBinaryInsert && preg_match('~[^\x20-\x7E\t\r\n]~', $value)) {
    //                             return '0x' . bin2hex($value);
    //                         } else {
    //                             return "'" . addslashes($value) . "'";
    //                         }
    //                     }, $values);

    //                     $sqlExport .= "INSERT INTO `$table` (`" . implode('`, `', $columns) . "`) VALUES (" . implode(', ', $formattedValues) . ");\n";
    //                 }
    //             });
    //         } catch (\Exception $e) {
    //             fwrite($logStream, "Error: Couldn't process data from table $table\n");
    //             fwrite($logStream, "Exception: " . $e->getMessage() . "\n");
    //         }

    //         $sqlExport .= "\n";
    //     }

    //     fclose($logStream);

    //     $timestamp = now()->format('Y-m-d_H-i-s');
    //     $outputFileName = 'database_export_by_date_' . $timestamp . '.sql';

    //     $headers = [
    //         'Content-Type' => 'application/sql',
    //         'Content-Disposition' => 'attachment; filename="' . $outputFileName . '"',
    //     ];

    //     // Return a response with the SQL content and headers
    //     return new Response($sqlExport, 200, $headers);
    // }

    public function exportDataByDate($date = null, $allowBinaryInsert = true)
    {
        $all_data_tables = [
            'um_users',
            'sender_code_control',
            'driver_code_control',
            'agent_code_control',
            'tracking_numbers',
            'trip_num_control',
            'settings_number',
            'settings_string'
        ];
    
        $logFileName = 'database_export_by_date.log';
        $logStream = fopen(storage_path("logs/$logFileName"), 'w');
    
        $tables = DB::select('SHOW FULL TABLES WHERE Table_type = "BASE TABLE"');
        $tableNames = array_map('current', $tables);
        $sqlExport = '';
        $date = empty($date) ? date('Y-m-d') : convertDate($date);
        Log::info('export data from date = ' . $date);
    
        foreach ($tableNames as $table) {
            $addDropTable = false;
            $query = DB::table($table);
    
            if (in_array($table, $all_data_tables)) {
                $addDropTable = true;
            } else {
                $columns = DB::select("SHOW COLUMNS FROM `$table` LIKE 'create_date'");
                if (empty($columns)) {
                    fwrite($logStream, "Skipping table $table as it does not have a create_date column\n");
                    continue;
                }
    
                $str_date = 'DATE(create_date) >= \'' . $date . '\'';
                $query = DB::table($table)->whereRaw($str_date);
            }
    
            try {
                $rows = $query->get();
    
                if ($rows->isNotEmpty()) {
                    if ($addDropTable) {
                        $sqlExport .= "DROP TABLE IF EXISTS `$table`;\n";
                    }
    
                    // Retrieve CREATE TABLE statement
                    $createTableStmt = DB::select("SHOW CREATE TABLE `$table`");
                    $sqlExport .= $createTableStmt[0]->{"Create Table"} . ";\n";
    
                    foreach ($rows as $row) {
                        $columns = array_keys((array) $row);
                        $values = array_values((array) $row);
    
                        $formattedValues = array_map(function ($value) use ($allowBinaryInsert) {
                            if (is_null($value)) {
                                return 'NULL';
                            } elseif (is_bool($value)) {
                                return $value ? '1' : '0';
                            } elseif (is_int($value) || is_float($value)) {
                                return $value;
                            } elseif (is_string($value) && $allowBinaryInsert && preg_match('~[^\x20-\x7E\t\r\n]~', $value)) {
                                return '0x' . bin2hex($value);
                            } else {
                                return "'" . addslashes($value) . "'";
                            }
                        }, $values);
    
                        $sqlExport .= "INSERT INTO `$table` (`" . implode('`, `', $columns) . "`) VALUES (" . implode(', ', $formattedValues) . ");\n";
                    }
                }
            } catch (\Exception $e) {
                fwrite($logStream, "Error: Couldn't process data from table $table\n");
                fwrite($logStream, "Exception: " . $e->getMessage() . "\n");
            }
    
            $sqlExport .= "\n";
        }
    
        fclose($logStream);
    
        $timestamp = now()->format('Y-m-d_H-i-s');
        $outputFileName = 'database_export_by_date_' . $timestamp . '.sql';
    
        $headers = [
            'Content-Type' => 'application/sql',
            'Content-Disposition' => 'attachment; filename="' . $outputFileName . '"',
        ];
    
        // Return a response with the SQL content and headers
        return new Response($sqlExport, 200, $headers);
    }
  
    private function exportMySQLDatabase($database, $maxRows)
    {
        $user = escapeshellarg(self::$user_root);
        $password = escapeshellarg(self::$password);
        $host = escapeshellarg(Config::get('database.connections.mysql.host'));
        $port = escapeshellarg(Config::get('database.connections.mysql.port'));
        $timestamp = date('Y-m-d_H-i-s');
        $filename = "mysql-backup-" . $timestamp . ".sql";
        $filePath = storage_path("app/{$filename}");

        // Step 1: Generate the schema and routines dump
        $schemaDumpCommand = "mysqldump --host={$host} --port={$port} --user={$user} --password={$password} --routines --events --triggers --no-data {$database}";

        $process = Process::fromShellCommandline($schemaDumpCommand);
        $process->run();

        if (!$process->isSuccessful()) {
            $errorOutput = $process->getErrorOutput();
            $output = $process->getOutput();
            Log::error("mysqldump schema command failed. Output: {$output} Error Output: {$errorOutput}");
            return response()->json(['error' => 'mysqldump schema command failed', 'details' => $errorOutput ?: 'No error details available'], 500);
        }

        $schemaDump = str_replace('DEFINER=`' . $user . '`@`' . $host . '`', '', $process->getOutput());
        file_put_contents($filePath, $schemaDump);

        $tables = DB::select('SHOW TABLES');
        foreach ($tables as $table) {
            $tableName = array_values((array)$table)[0];
            if ($maxRows) {
                $dataDumpCommand = "mysqldump --host={$host} --port={$port} --user={$user} --password={$password} --no-create-info --hex-blob --where=\"1 LIMIT {$maxRows}\" {$database} {$tableName} >> {$filePath}";
            } else {
                $dataDumpCommand = "mysqldump --host={$host} --port={$port} --user={$user} --password={$password} --no-create-info --hex-blob {$database} {$tableName} >> {$filePath}";
            }

            $dataProcess = Process::fromShellCommandline($dataDumpCommand);
            $dataProcess->run();

            if (!$dataProcess->isSuccessful()) {
                $errorOutput = $dataProcess->getErrorOutput();
                $output = $dataProcess->getOutput();
                Log::error("mysqldump data command failed. Output: {$output} Error Output: {$errorOutput}");
                return response()->json(['error' => 'mysqldump data command failed', 'details' => $errorOutput ?: 'No error details available'], 500);
            }
        }

        if (file_exists($filePath)) {
            return response()->download($filePath)->withHeaders([
                'Content-Type' => 'application/sql',
            ]);
        } else {
            return response("An error occurred. Please check the log file for details.", 500);
        }
    }

    private function exportPostgresDatabase($database, $maxRows)
    {
        $user = escapeshellarg(Config::get('database.connections.pgsql.username'));
        $password = Config::get('database.connections.pgsql.password');
        $host = escapeshellarg(Config::get('database.connections.pgsql.host'));
        $timestamp = date('Y-m-d_H-i-s');
        $filename = "postgres-backup-" . $timestamp . ".sql";
        $filePath = storage_path("temp/{$filename}");

        $passwordOption = $password ? "PGPASSWORD=" . escapeshellarg($password) : "";

        $schemaDumpCommand = "{$passwordOption} pg_dump --host={$host} --username={$user} --schema-only --no-owner --no-acl {$database} > {$filePath}";

        $tables = DB::select('SELECT tablename FROM pg_tables WHERE schemaname = \'public\'');
        foreach ($tables as $table) {
            $tableName = $table->tablename;
            if ($maxRows) {
                $schemaDumpCommand .= " && {$passwordOption} pg_dump --host={$host} --username={$user} --data-only --table={$tableName} --rows-per-insert={$maxRows} {$database} >> {$filePath}";
            } else {
                $schemaDumpCommand .= " && {$passwordOption} pg_dump --host={$host} --username={$user} --data-only --table={$tableName} {$database} >> {$filePath}";
            }
        }

        $process = Process::fromShellCommandline($schemaDumpCommand);
        $process->run();

        $output = $process->getOutput();
        $errorOutput = $process->getErrorOutput();

        if (!$process->isSuccessful()) {
            Log::error("pg_dump command failed. Output: {$output} Error Output: {$errorOutput}");
            return response()->json(['error' => 'pg_dump command failed', 'details' => $errorOutput ?: 'No error details available'], 500);
        }

        if (file_exists($filePath)) {
            return response()->header('Content-Type','application/sql');
        } else {
            return response("An error occurred. Please check the log file for details.", 500);
        }
    }

    private function exportMSSQLDatabase($database, $maxRows)
    {
        $user = escapeshellarg(Config::get('database.connections.sqlsrv.username'));
        $password = escapeshellarg(Config::get('database.connections.sqlsrv.password'));
        $host = escapeshellarg(Config::get('database.connections.sqlsrv.host'));
        $timestamp = date('Y-m-d_H-i-s');
        $filename = "mssql-backup-" . $timestamp . ".sql";
        $filePath = storage_path("temp/{$filename}");

        $schemaDumpCommand = "sqlcmd -S {$host} -U {$user} -P {$password} -d {$database} -Q \"SET NOCOUNT ON; SELECT 'DROP TABLE IF EXISTS [' + s.name + '].[' + o.name + '];' FROM sys.objects o JOIN sys.schemas s ON o.schema_id = s.schema_id WHERE o.type = 'U'\" -o {$filePath}";

        $process = Process::fromShellCommandline($schemaDumpCommand);
        $process->run();

        if (!$process->isSuccessful()) {
            $errorOutput = $process->getErrorOutput();
            $output = $process->getOutput();
            Log::error("sqlcmd schema command failed. Output: {$output} Error Output: {$errorOutput}");
            return response()->json(['error' => 'sqlcmd schema command failed', 'details' => $errorOutput ?: 'No error details available'], 500);
        }

        $tables = DB::select('SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = \'BASE TABLE\'');
        foreach ($tables as $table) {
            $tableName = $table->TABLE_NAME;
            if ($maxRows) {
                $dataDumpCommand = "sqlcmd -S {$host} -U {$user} -P {$password} -d {$database} -Q \"SET NOCOUNT ON; SELECT TOP {$maxRows} * FROM [{$tableName}]\" -h-1 -W -w 1024 -s \",\" -o {$filePath}";
            } else {
                $dataDumpCommand = "sqlcmd -S {$host} -U {$user} -P {$password} -d {$database} -Q \"SET NOCOUNT ON; SELECT * FROM [{$tableName}]\" -h-1 -W -w 1024 -s \",\" -o {$filePath}";
            }

            $dataProcess = Process::fromShellCommandline($dataDumpCommand);
            $dataProcess->run();

            if (!$dataProcess->isSuccessful()) {
                $errorOutput = $dataProcess->getErrorOutput();
                $output = $dataProcess->getOutput();
                Log::error("sqlcmd data command failed. Output: {$output} Error Output: {$errorOutput}");
                return response()->json(['error' => 'sqlcmd data command failed', 'details' => $errorOutput ?: 'No error details available'], 500);
            }
        }

        if (file_exists($filePath)) {
            return response()->download($filePath)->withHeaders([
                'Content-Type' => 'application/sql',
            ]);
        } else {
            return response("An error occurred. Please check the log file for details.", 500);
        }
    }
}