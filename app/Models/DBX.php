<?php
namespace App\Models;

use Illuminate\Support\Facades\DB;

class DBX
{

    public static $created_at ='created_at';
    public static $updated_at ='updated_at';
    public static $branch_table = 'um_branches';
    /***
     * query_user_info() returns select SQL for columns "updated_at, update_user, and created_at, create_user".
     * @$include_creation_info =true means to include "fields Created_at , create_user"
    */
    public static function query_user_info($table_alias= null,$update_date_alias= null,$include_creation_info = true, $create_date_alias =null ){
        if($table_alias) $table_alias = $table_alias.'.';
        if(!$include_creation_info) return self::formatTime($table_alias.self::$updated_at,$update_date_alias).',update_user';
        else return self::formatTime($table_alias.self::$updated_at,$update_date_alias).','.$table_alias.'update_user,'.$table_alias.'create_user,'.self::formatTime($table_alias.self::$created_at,$create_date_alias);
    }

    public static function ifNull($col_name, $alt_column_or_value, $col_alias = null)
    {
        $driver = DB::getDriverName();
        $alt = 'NULL';

        $sts = explode(':', $alt_column_or_value, 2);
        $key = str_replace(' ', '', strtolower(trim($sts[0])));

        if ($key == 'value') {
            $alt = is_numeric($sts[1]) ? $sts[1] : "'" . addslashes($sts[1]) . "'";
        } else {
            $alt = $alt_column_or_value;
        }

        $exp = '';
        switch ($driver) {
            case 'mysql':
            case 'pgsql':
                $exp = "COALESCE($col_name, '$alt')";
                break;
            case 'sqlsrv':
                $exp = "ISNULL($col_name, '$alt')";
                break;
            default:
                throw new \Exception("Unsupported database driver: $driver");
        }

        return $exp . ($col_alias ? ' AS ' . $col_alias : '');
    }


    public static function convertToDate($dateColumn){
            $driver = DB::getDriverName();
            switch ($driver) {
                case 'mysql':
                    $dateConversion = 'DATE('.$dateColumn.')';
                    break;
                case 'pgsql':
                    $dateConversion = $dateColumn.'::date';
                    break;
                case 'sqlsrv':
                    $dateConversion = 'CONVERT(date,'.$dateColumn.')';
                    break;
                default:
                    throw new \Exception("Unsupported database driver: $driver");
            }
         return $dateConversion;
    }

    public static function month($DateTimeColumn, $alias= null){
        $driver = DB::getDriverName();
        switch ($driver) {
            case 'mysql':
                return "MONTH($DateTimeColumn) ". ($alias? " As $alias": '');
            case 'pgsql':
                return "EXTRACT(MONTH FROM $DateTimeColumn)" . ($alias? " As $alias": '');
            case 'sqlsrv':
                return "MONTH($DateTimeColumn)" . ($alias? " As $alias": '');
            default:
                throw new \Exception("Unsupported database driver: $driver");
        }
    }

    public static function year($DateTimeColumn, $alias = null)
    {
        $driver = DB::getDriverName();
        switch ($driver) {
            case 'mysql':
                return "YEAR($DateTimeColumn)" . ($alias ? " AS $alias" : '');
            case 'pgsql':
                return "EXTRACT(YEAR FROM $DateTimeColumn)" . ($alias ? " AS $alias" : '');
            case 'sqlsrv':
                return "YEAR($DateTimeColumn)" . ($alias ? " AS $alias" : '');
            default:
                throw new \Exception("Unsupported database driver: $driver");
        }
    }

    public static function getHEX($column, $alias_name = null)
    {
        $driver = DB::getDriverName();
        $alias_name = $alias_name? ' AS '.$alias_name : '';
        switch ($driver) {
            case 'pgsql':
                return 'encode('.$column.'::bytea, \'hex\')'. $alias_name;
            case 'mysql':
                return 'HEX('.$column.')'.$alias_name;
            case 'sqlsrv':
                return 'CONVERT(VARBINARY(MAX), '.$column.', 2)'.$alias_name;
            default:
                throw new \InvalidArgumentException('Unsupported database driver:'. $driver);
        }
    }

    public static function roleAccessApp($role_id, $col,$alias_name)
    {
        $driver = DB::getDriverName();
        $alias_name = $alias_name? ' AS '.$alias_name : '';
        switch ($driver) {
            case 'pgsql':
                return 'roleAccessApp('.$role_id.','.$col.')'. $alias_name;
            case 'mysql':
                return 'roleAccessApp('.$role_id.','.$col.')'. $alias_name;
            case 'sqlsrv':
                return 'dbo.roleAccessApp('.$role_id.','.$col.')'. $alias_name;
            default:
                throw new \InvalidArgumentException('Unsupported database driver:'. $driver);
        }
    }

    public static function formatTime($column, $alias_name = null)
    {
        $driver = DB::getDriverName();
        $alias_name = $alias_name ? ' AS ' . $alias_name : '';
        switch ($driver) {
            case 'pgsql':
                return "to_char($column, 'DD Mon YYYY HH24:MI')" . $alias_name;
            case 'mysql':
                return "DATE_FORMAT($column, '%d %b %Y %H:%i')" . $alias_name;
            case 'sqlsrv':
                return "FORMAT($column, 'dd MMM yyyy HH:mm')" . $alias_name;
            default:
                throw new \InvalidArgumentException('Unsupported database driver:' . $driver);
        }
    }

public static function formatTimeOnly($column, $alias_name = null)
{
    $driver = DB::getDriverName();
    $alias_name = $alias_name ? ' AS ' . $alias_name : '';
    switch ($driver) {
        case 'pgsql':
            return "to_char($column, 'HH24:MI')" . $alias_name;
        case 'mysql':
            return "DATE_FORMAT($column, '%H:%i')" . $alias_name;
        case 'sqlsrv':
            return "FORMAT($column, 'HH:mm')" . $alias_name;
        default:
            throw new \InvalidArgumentException('Unsupported database driver:' . $driver);
    }
 }

     public static function formatDate($column, $alias_name = null)
    {
        $driver = DB::getDriverName();
        $alias_name = $alias_name ? ' AS ' . $alias_name : '';
        switch ($driver) {
            case 'pgsql':
                return "to_char($column, 'DD Mon YYYY')" . $alias_name;
            case 'mysql':
                return "DATE_FORMAT($column, '%d %b %Y')" . $alias_name;
            case 'sqlsrv':
                return "FORMAT($column, 'dd MMM yyyy')" . $alias_name;
            default:
                throw new \InvalidArgumentException('Unsupported database driver:' . $driver);
        }
    }

    public static function getYear($column, $alias_name = null)
    {
        $driver = DB::getDriverName();
        $alias_name = $alias_name ? ' AS ' . $alias_name : '';
        switch ($driver) {
            case 'pgsql':
                return "EXTRACT(YEAR FROM $column)" . $alias_name;
            case 'mysql':
                return "YEAR($column)" . $alias_name;
            case 'sqlsrv':
                return "YEAR($column)" . $alias_name;
            default:
                throw new \InvalidArgumentException('Unsupported database driver:' . $driver);
        }
    }

    public static function getMonth($column, $alias_name = null)
    {
        $driver = DB::getDriverName();
        $alias_name = $alias_name ? ' AS ' . $alias_name : '';
        switch ($driver) {
            case 'pgsql':
                return "EXTRACT(MONTH FROM $column)" . $alias_name;
            case 'mysql':
                return "MONTH($column)" . $alias_name;
            case 'sqlsrv':
                return "MONTH($column)" . $alias_name;
            default:
                throw new \InvalidArgumentException('Unsupported database driver:' . $driver);
        }
    }

    public static function getDay($column, $alias_name = null)
    {
        $driver = DB::getDriverName();
        $alias_name = $alias_name ? ' AS ' . $alias_name : '';
        switch ($driver) {
            case 'pgsql':
                return "EXTRACT(DAY FROM $column)" . $alias_name;
            case 'mysql':
                return "DAY($column)" . $alias_name;
            case 'sqlsrv':
                return "DAY($column)" . $alias_name;
            default:
                throw new \InvalidArgumentException('Unsupported database driver:' . $driver);
        }
    }

    public static function getDayName($column, $alias_name = null)
    {
        $driver = DB::getDriverName();
        $alias_name = $alias_name ? ' AS ' . $alias_name : '';
        switch ($driver) {
            case 'pgsql':
                return 'to_char('.$column.', \'Day\')' . $alias_name;
            case 'mysql':
                return 'DAYNAME('.$column.')' . $alias_name;
            case 'sqlsrv':
                return 'DATENAME(weekday, '.$column.')' . $alias_name;
            default:
                throw new \InvalidArgumentException('Unsupported database driver:' . $driver);
        }
    }

    static function updateForeignKeyRows($fk_tables, $old_value, $new_value){
        foreach($fk_tables as $table_name => $fk_name){
           DB::table($table_name)->where($fk_name,$old_value)->update([$fk_name=>$new_value]);
        }
    }

    static function deleteForeignKeyRows($fk_tables, $value,$soft_delete = false){
        foreach($fk_tables as $table_name => $fk_name){
            if($soft_delete)
              DB::table($table_name)->where($fk_name,$value)->uopdate(['deleted'=>1]);
            else DB::table($table_name)->where($fk_name,$value)->delete();
        }
        return DV::depends(1);
    }

    static function updatePrimaryKey($table_name, $pk_name, $old_value, $new_value) {
            $driverName = DB::getDriverName();
            // Get the database connection
           // $connection = DB::connection();
             // Begin transaction for safety
            DB::beginTransaction();
            try {
                // Step 1: Check if the new value already exists as a primary key
                $check_query = "SELECT COUNT(*) FROM {$table_name} WHERE {$pk_name} = :new_value";
                $stmt = DB::prepare($check_query);
                $stmt->execute(['new_value' => $new_value]);
                $exists = $stmt->fetchColumn();

                if ($exists > 0) {
                    // If the new value already exists, return false or handle the error
                    throw new \Exception("The new primary key value '{$new_value}' already exists.");
                }

                // Step 2: Disable foreign key checks for MySQL/MariaDB
                if ($driverName === 'mysql' || $driverName === 'mariadb') {
                    //$db->exec('SET FOREIGN_KEY_CHECKS = 0');
                    DB::statement(DB::raw('SET FOREIGN_KEY_CHECKS = 0'));
                }

                // Step 3: Update the primary key in the base table
                $update_query = "UPDATE {$table_name} SET {$pk_name} = :new_value WHERE {$pk_name} = :old_value";
                $stmt = DB::prepare($update_query);
                $stmt->execute(['new_value' => $new_value, 'old_value' => $old_value]);

                // Step 4: Commit the transaction
                DB::commit();

                // Re-enable foreign key checks for MySQL/MariaDB
                if ($driverName === 'mysql' || $driverName === 'mariadb') {
                    //$db->exec('SET FOREIGN_KEY_CHECKS = 1');
                    DB::statement(DB::raw('SET FOREIGN_KEY_CHECKS = 1'));
                }

                return true;
            } catch (\Exception $e) {
                // Rollback in case of error
                DB::rollBack();
                return false;
            }
        }

        /** Count foreign_key table items */
        static function count_fk_items($value, $fk_tables,$table =null){
            $cnt = 0 ;
            foreach($fk_tables  as $table_name =>$fk_field){
                if ($table && $table === $table_name){
                     return DB::table($table_name)->where($fk_field,$value)->count($fk_field);
                }else{
                    $cnt += DB::table($table_name)->where($fk_field,$value)->count($fk_field);
                }
            }
            return $cnt;
        }

}
